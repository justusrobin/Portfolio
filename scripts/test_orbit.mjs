import { spawn } from 'child_process';
import fs from 'fs';

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1600,1000',
    'about:blank'
  ]);

  // Wait 1.5s for Chrome to launch
  await new Promise(r => setTimeout(r, 1500));

  // Get WebSocket debugger URL
  const versionRes = await fetch('http://127.0.0.1:9222/json/version');
  const versionData = await versionRes.json();
  const wsUrl = versionData.webSocketDebuggerUrl;
  console.log('Connected to Chrome CDP:', wsUrl);

  const ws = new WebSocket(wsUrl);

  let idCounter = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  };

  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = idCounter++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Create new target (tab)
  const target = await send('Target.createTarget', { url: 'http://localhost:5174/' });
  const targetWs = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${target.targetId}`);
  await new Promise(r => targetWs.onopen = r);

  let tabCounter = 1;
  const tabPending = new Map();
  targetWs.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && tabPending.has(msg.id)) {
      tabPending.get(msg.id)(msg.result);
      tabPending.delete(msg.id);
    }
  };

  function sendTab(method, params = {}) {
    return new Promise((resolve) => {
      const id = tabCounter++;
      tabPending.set(id, resolve);
      targetWs.send(JSON.stringify({ id, method, params }));
    });
  }

  await sendTab('Page.enable');
  await sendTab('Runtime.enable');

  console.log('Navigated to page, waiting for cinematic loader (4s)...');
  await new Promise(r => setTimeout(r, 4000));

  // Scroll to skills section
  await sendTab('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('skills');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    `
  });

  await new Promise(r => setTimeout(r, 1500));

  console.log('Observing Skills orbital positions across time:');

  for (let s = 0; s <= 30; s += 5) {
    const res = await sendTab('Runtime.evaluate', {
      expression: `
        (() => {
          const bubbles = Array.from(document.querySelectorAll('[data-bubble-id]')).map(el => {
            const rect = el.getBoundingClientRect();
            return {
              id: el.getAttribute('data-bubble-id'),
              left: el.style.left,
              top: el.style.top,
              transform: el.style.transform,
              opacity: el.style.opacity,
              zIndex: el.style.zIndex,
              rect: { x: Math.round(rect.x), y: Math.round(rect.y) }
            };
          });
          return bubbles;
        })()
      `,
      returnByValue: true
    });

    console.log(`\n--- T = ${s}s ---`);
    const val = res?.result?.value;
    if (Array.isArray(val)) {
      for (const item of val) {
        console.log(`  ${item.id.padEnd(14)}: left=${item.left} top=${item.top} transform=${item.transform} opacity=${item.opacity} z=${item.zIndex} pos=(${item.rect.x}, ${item.rect.y})`);
      }
    } else {
      console.log('Result not array:', JSON.stringify(res));
    }

    if (s < 30) {
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  // Take screenshot at 30s
  const screenshotRes = await sendTab('Page.captureScreenshot', { format: 'png' });
  if (screenshotRes?.data) {
    fs.writeFileSync('scripts/skills_screenshot_30s.png', Buffer.from(screenshotRes.data, 'base64'));
    console.log('\nSaved screenshot to scripts/skills_screenshot_30s.png');
  }

  // Close chrome
  chromeProcess.kill();
  console.log('Test completed successfully.');
  process.exit(0);
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
