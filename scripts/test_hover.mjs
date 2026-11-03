import { spawn } from 'child_process';

async function testHover() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1600,1000',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  const versionRes = await fetch('http://127.0.0.1:9224/json/version');
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
  const targetWs = new WebSocket(`ws://127.0.0.1:9224/devtools/page/${target.targetId}`);
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
  await sendTab('DOM.enable');

  console.log('Waiting for loader...');
  await new Promise(r => setTimeout(r, 4000));

  await sendTab('Runtime.evaluate', {
    expression: `document.getElementById('skills')?.scrollIntoView({ behavior: 'instant' });`
  });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Get initial position of 'frontend'
  const beforeHover = await sendTab('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.querySelector('[data-bubble-id="frontend"]');
        const rect = el.getBoundingClientRect();
        return {
          left: el.style.left,
          top: el.style.top,
          transform: el.style.transform,
          zIndex: el.style.zIndex,
          cx: Math.round(rect.x + rect.width / 2),
          cy: Math.round(rect.y + rect.height / 2)
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Before Hover (Frontend):', beforeHover.result.value);

  const { cx, cy } = beforeHover.result.value;

  // 2. Dispatch real CDP mouse movement directly to bubble center
  await sendTab('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: cx,
    y: cy
  });

  // Wait 1.5s while hovered
  await new Promise(r => setTimeout(r, 1500));

  const duringHover1 = await sendTab('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.querySelector('[data-bubble-id="frontend"]');
        return {
          left: el.style.left,
          top: el.style.top,
          transform: el.style.transform,
          zIndex: el.style.zIndex
        };
      })()
    `,
    returnByValue: true
  });
  console.log('During Hover at +1.5s (Frontend):', duringHover1.result.value);

  // Wait another 1.5s to verify it stays paused
  await new Promise(r => setTimeout(r, 1500));

  const duringHover2 = await sendTab('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.querySelector('[data-bubble-id="frontend"]');
        return {
          left: el.style.left,
          top: el.style.top,
          transform: el.style.transform,
          zIndex: el.style.zIndex
        };
      })()
    `,
    returnByValue: true
  });
  console.log('During Hover at +3.0s (Frontend):', duringHover2.result.value);

  // 3. Move mouse away to top-left corner
  await sendTab('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: 10,
    y: 10
  });

  // Wait 3s to verify motion resumes smoothly
  await new Promise(r => setTimeout(r, 3000));

  const afterHover = await sendTab('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.querySelector('[data-bubble-id="frontend"]');
        return {
          left: el.style.left,
          top: el.style.top,
          transform: el.style.transform,
          zIndex: el.style.zIndex
        };
      })()
    `,
    returnByValue: true
  });
  console.log('After Hover Resumed at +3.0s (Frontend):', afterHover.result.value);

  chromeProcess.kill();
  console.log('Hover test finished successfully.');
}

testHover().catch(e => {
  console.error(e);
  process.exit(1);
});
