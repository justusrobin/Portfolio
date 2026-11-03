import { spawn } from 'child_process';
import fs from 'fs';

async function testScrollBloom() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1600,1000',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  const versionRes = await fetch('http://127.0.0.1:9226/json/version');
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
  const targetWs = new WebSocket(`ws://127.0.0.1:9226/devtools/page/${target.targetId}`);
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
  await sendTab('Page.enable');

  console.log('Waiting for loader sequence (4s)...');
  await new Promise(r => setTimeout(r, 4000));

  // Helper to query rose state from page
  async function getRoseState() {
    const res = await sendTab('Runtime.evaluate', {
      expression: `
        (() => {
          const section = document.getElementById('skills');
          if (!section) return null;
          const scrollY = window.scrollY;

          // Find the ScrollTrigger instance for #skills
          let progress = 0;
          if (window.ScrollTrigger) {
            const st = window.ScrollTrigger.getAll().find(s => s.trigger === section || s.vars?.trigger === section);
            if (st) progress = st.progress;
          }

          // Query rose canvas in desktop view
          const canvas = section.querySelector('canvas');
          const canvasInfo = canvas ? {
            width: canvas.width,
            height: canvas.height,
            visible: canvas.offsetHeight > 0
          } : null;

          // Get narrative stage indicators
          const stageSpans = Array.from(section.querySelectorAll('.font-mono-tech.text-\\\\[10px\\\\] span')).map(s => ({
            text: s.textContent.trim(),
            hasPulse: s.querySelector('.animate-pulse') !== null
          }));

          return {
            scrollY: Math.round(scrollY),
            progress: Number(progress).toFixed(3),
            canvasInfo,
            stageSpans
          };
        })()
      `,
      returnByValue: true
    });
    return res.result.value;
  }

  // Helper to scroll smoothly or instantly via Lenis
  async function scrollToTarget(offsetFraction) {
    await sendTab('Runtime.evaluate', {
      expression: `
        (() => {
          const section = document.getElementById('skills');
          if (!section) return;
          let targetY = section.offsetTop;
          if (window.ScrollTrigger) {
            const st = window.ScrollTrigger.getAll().find(s => s.trigger === section || s.vars?.trigger === section);
            if (st) {
              targetY = st.start + (st.end - st.start) * ${offsetFraction};
            }
          }
          if (window.lenis) {
            window.lenis.scrollTo(targetY, { immediate: true });
          } else {
            window.scrollTo({ top: targetY, behavior: 'instant' });
          }
        })()
      `
    });
    // Wait for GSAP scrub (0.4s) and DOM frame update
    await new Promise(r => setTimeout(r, 800));
  }

  // 1. Initial State: scroll to top of #skills (0.0)
  await scrollToTarget(0.0);

  console.log('\n--- State 1: Approaching Skills (Scroll Progress = 0%) ---');
  const state0 = await getRoseState();
  console.log('Progress:', state0?.progress);
  console.log('Rose Layers:', state0?.imgStates);
  console.log('Stage Spans:', state0?.stageSpans);

  // Capture screenshot of Closed Rosebud at 0%
  const snap0 = await sendTab('Page.captureScreenshot', { format: 'png' });
  if (snap0?.data) {
    fs.writeFileSync('scripts/bloom_0pct_rosebud.png', Buffer.from(snap0.data, 'base64'));
    console.log('Saved screenshot to scripts/bloom_0pct_rosebud.png');
  }

  // 2. Stage 1 Awakening: Scroll 25% through the track
  await scrollToTarget(0.25);

  console.log('\n--- State 2: Awakening (Scroll Progress = 25%) ---');
  const state25 = await getRoseState();
  console.log('Progress:', state25?.progress);
  console.log('Rose Layers:', state25?.imgStates);
  console.log('Stage Spans:', state25?.stageSpans);

  const snap25 = await sendTab('Page.captureScreenshot', { format: 'png' });
  if (snap25?.data) {
    fs.writeFileSync('scripts/bloom_25pct_awakening.png', Buffer.from(snap25.data, 'base64'));
    console.log('Saved screenshot to scripts/bloom_25pct_awakening.png');
  }

  // 3. Stage 2 Half-Bloom: Scroll 55% through the track
  await scrollToTarget(0.55);

  console.log('\n--- State 3: Unfolding Half-Bloom (Scroll Progress = 55%) ---');
  const state55 = await getRoseState();
  console.log('Progress:', state55?.progress);
  console.log('Rose Layers:', state55?.imgStates);
  console.log('Stage Spans:', state55?.stageSpans);

  const snap55 = await sendTab('Page.captureScreenshot', { format: 'png' });
  if (snap55?.data) {
    fs.writeFileSync('scripts/bloom_55pct_halfbloom.png', Buffer.from(snap55.data, 'base64'));
    console.log('Saved screenshot to scripts/bloom_55pct_halfbloom.png');
  }

  // 4. Stage 3 Full Bloom: Scroll 100% through the track
  await scrollToTarget(1.0);

  console.log('\n--- State 4: Full Centerpiece Bloom (Scroll Progress = 100%) ---');
  const state100 = await getRoseState();
  console.log('Progress:', state100?.progress);
  console.log('Rose Layers:', state100?.imgStates);
  console.log('Stage Spans:', state100?.stageSpans);

  const snap100 = await sendTab('Page.captureScreenshot', { format: 'png' });
  if (snap100?.data) {
    fs.writeFileSync('scripts/bloom_100pct_fullbloom.png', Buffer.from(snap100.data, 'base64'));
    console.log('Saved screenshot to scripts/bloom_100pct_fullbloom.png');
  }

  // 5. Test Scroll Reversibility: Scroll back up to 30%
  await scrollToTarget(0.30);

  console.log('\n--- State 5: Reversibility (Scrolled back up to 30%) ---');
  const stateReverse = await getRoseState();
  console.log('Progress:', stateReverse?.progress);
  console.log('Rose Layers:', stateReverse?.imgStates);
  console.log('Stage Spans:', stateReverse?.stageSpans);

  // 6. Test Unpinning & Smooth Navigation into #work section
  console.log('\n--- State 6: Smoothly continuing scroll into #work section ---');
  await sendTab('Runtime.evaluate', {
    expression: `
      (() => {
        const work = document.getElementById('work');
        if (work && window.lenis) {
          window.lenis.scrollTo(work, { immediate: true });
        }
      })()
    `
  });
  await new Promise(r => setTimeout(r, 600));

  const workState = await sendTab('Runtime.evaluate', {
    expression: `
      (() => {
        const work = document.getElementById('work');
        return {
          workTop: work ? Math.round(work.getBoundingClientRect().top) : null,
          scrollY: Math.round(window.scrollY)
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Work section position:', workState.result.value);

  const snapWork = await sendTab('Page.captureScreenshot', { format: 'png' });
  if (snapWork?.data) {
    fs.writeFileSync('scripts/scrolled_to_work.png', Buffer.from(snapWork.data, 'base64'));
    console.log('Saved screenshot to scripts/scrolled_to_work.png');
  }

  chromeProcess.kill();
  console.log('\nAll Scroll-Controlled Blooming Tests Completed Successfully!');
}

testScrollBloom().catch(err => {
  console.error(err);
  process.exit(1);
});
