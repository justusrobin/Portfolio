import { spawn } from 'child_process';
import fs from 'fs';

async function testMobile() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=390,844',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  const versionRes = await fetch('http://127.0.0.1:9225/json/version');
  const versionData = await versionRes.json();
  const ws = new WebSocket(versionData.webSocketDebuggerUrl);

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

  const target = await send('Target.createTarget', { url: 'http://localhost:5174/' });
  const targetWs = new WebSocket(`ws://127.0.0.1:9225/devtools/page/${target.targetId}`);
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

  await sendTab('Runtime.enable');
  await sendTab('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  console.log('Waiting for loader on mobile...');
  await new Promise(r => setTimeout(r, 4000));

  await sendTab('Runtime.evaluate', {
    expression: `document.getElementById('skills')?.scrollIntoView({ behavior: 'instant' });`
  });
  await new Promise(r => setTimeout(r, 1000));

  // Check horizontal overflow
  const overflowCheck = await sendTab('Runtime.evaluate', {
    expression: `
      (() => {
        const bodyWidth = document.body.scrollWidth;
        const windowWidth = window.innerWidth;
        const skillsSection = document.getElementById('skills');
        const bubbles = Array.from(document.querySelectorAll('[data-mobile-bubble-id]')).map(el => ({
          id: el.getAttribute('data-mobile-bubble-id'),
          left: el.style.left,
          top: el.style.top,
          opacity: el.style.opacity,
          zIndex: el.style.zIndex
        }));
        return {
          bodyWidth,
          windowWidth,
          hasHorizontalOverflow: bodyWidth > windowWidth,
          bubbleCount: bubbles.length,
          bubbles
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Mobile Layout Check:', overflowCheck.result.value);

  // Take mobile screenshot
  const screenshotRes = await sendTab('Page.captureScreenshot', { format: 'png' });
  if (screenshotRes?.data) {
    fs.writeFileSync('scripts/skills_mobile_screenshot.png', Buffer.from(screenshotRes.data, 'base64'));
    console.log('Saved mobile screenshot to scripts/skills_mobile_screenshot.png');
  }

  // Test tap-to-focus on mobile: tap bubble 2 ('backend')
  const tapTest = await sendTab('Runtime.evaluate', {
    expression: `
      (() => {
        const backendBubble = document.querySelector('[data-mobile-bubble-id="backend"]');
        if (backendBubble) {
          backendBubble.click();
          return true;
        }
        return false;
      })()
    `,
    returnByValue: true
  });
  console.log('Tapped Backend bubble:', tapTest.result.value);

  await new Promise(r => setTimeout(r, 500));

  const showcaseTitle = await sendTab('Runtime.evaluate', {
    expression: `
      (() => {
        const titleEl = document.querySelector('#skills h3');
        return titleEl ? titleEl.textContent.trim() : null;
      })()
    `,
    returnByValue: true
  });
  console.log('Showcase card active title after tap:', showcaseTitle.result.value);

  chromeProcess.kill();
  console.log('Mobile tests finished successfully.');
}

testMobile().catch(e => {
  console.error(e);
  process.exit(1);
});

