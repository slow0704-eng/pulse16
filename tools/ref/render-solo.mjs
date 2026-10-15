/* tools/ref/render-solo.mjs — 프리셋을 트랙별 솔로와 전체로 녹음해 WAV 로 쓴다.

   레퍼런스 대조(docs/음색/02-락-레퍼런스-대조.md)의 «우리 쪽» 재료다. 레퍼런스는
   Demucs 로 drums·bass·other·vocals 로 가르고, 우리는 트랙을 하나씩 솔로로 녹음해
   같은 네 묶음으로 접는다(layers.py). 곡 구조는 끈다 — 모든 층이 다 울려야
   «한 트랙이 묶음에서 차지하는 몫» 을 잴 수 있다.

   사용
     node tools/ref/render-solo.mjs <출력폴더> <초> <프리셋>...
     OVR="setKnob('sub',20); setGtrDbl(1);" TAG=_v1 node tools/ref/render-solo.mjs ...
       ← 프리셋을 고른 직후 페이지에서 실행할 코드(실험용). 파일 이름에 TAG 가 붙는다
     MIXONLY=1 …                                  ← 전체 믹스만 */
import fs from 'node:fs';
import path from 'node:path';
import { HTML } from '../ci/_lib.mjs';
import { loadPlaywright, startServer, auditRequire } from '../ci/_browser.mjs';

const [OUT, SECS, ...presets] = process.argv.slice(2);
const { RECORDER_SRC, toWav } = auditRequire('./capture.js');
const { chromium } = loadPlaywright();
const srv = await startServer();
const browser = await chromium.launch();
fs.mkdirSync(OUT, { recursive: true });

async function rec(preset, solo) {
  const page = await browser.newPage();
  await page.addInitScript(() => {
    const orig = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function (dest, ...rest) {
      const r = orig.call(this, dest, ...rest);
      try { const c = this.context;
        if (dest === c.destination) { if (!c.__tap) { c.__tap = c.createGain(); window.__tapCtx = c; } orig.call(this, c.__tap); }
      } catch {}
      return r;
    };
  });
  if (process.env.OVR) await page.addInitScript(o => { window.__ovr = o; }, process.env.OVR);
  await page.goto(`${srv.origin}/${HTML}`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  const live = await page.evaluate(([n, solo]) => {
    [...document.querySelectorAll('.chip')].find(x => x.dataset.name === n).click();
    const btn = document.getElementById('form');
    if (btn && btn.dataset.on === '1') btn.click();
    const has = id => ['bass', 'keys', 'gtr', 'keys2', 'gtr2'].includes(id)
      ? Array.isArray(P[id]) && P[id].some(v => v)
      : Array.isArray(P.drums?.[id]) && P.drums[id].some(v => v);
    const ALL = [...TRACK_IDS, 'bass', 'keys', 'gtr', 'keys2', 'gtr2'];
    if (solo) ALL.forEach(id => { mute[id] = id !== solo; });
    if (window.__ovr) (0, eval)(window.__ovr);
    return ALL.filter(has);
  }, [preset, solo]);
  await page.click('#play');
  await page.waitForFunction(() => !!window.__tapCtx, null, { timeout: 15000 });
  const L = [], R = [];
  await page.exposeBinding('__push', (_s, d) => { L.push(Float32Array.from(d.l)); R.push(Float32Array.from(d.r)); });
  const sr = await page.evaluate(async src => {
    const ctx = window.__tapCtx;
    await ctx.audioWorklet.addModule(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
    const node = new AudioWorkletNode(ctx, 'pulse-rec', { numberOfInputs: 1, numberOfOutputs: 0 });
    let bl = [], br = [], acc = 0;
    node.port.onmessage = e => {
      bl.push(e.data.l); br.push(e.data.r); acc += e.data.l.length;
      if (acc >= ctx.sampleRate * 0.25) {
        const f = a => { const o = new Float32Array(acc); let p = 0; for (const x of a) { o.set(x, p); p += x.length; } return Array.from(o); };
        window.__push({ l: f(bl), r: f(br) }); bl = []; br = []; acc = 0;
      }
    };
    ctx.__tap.connect(node);
    return ctx.sampleRate;
  }, RECORDER_SRC);
  await page.waitForTimeout(+SECS * 1000);
  await page.close();
  const cat = a => { const n = a.reduce((s, x) => s + x.length, 0), o = new Float32Array(n); let p = 0; for (const x of a) { o.set(x, p); p += x.length; } return o; };
  const file = path.join(OUT, `${preset.replace(/\W+/g, '_')}${process.env.TAG || ''}__${solo || 'MIX'}.wav`);
  fs.writeFileSync(file, toWav(cat(L), cat(R), sr));
  return live;
}

for (const p of presets) {
  const live = await rec(p, null);
  if (process.env.MIXONLY) continue;
  console.log(p, 'live:', live.join(' '));
  for (const id of live) await rec(p, id);
}
await browser.close();
srv.close?.();
process.exit(0);
