/* tools/render-melody.mjs — **선율을 켠 채** 앱을 녹음해 WAV 로 남긴다.

   왜 따로 필요한가: `melOn` 의 기본값은 false 다(src/seq/sequencer.js:24).
   그래서 mcp/pulse-audit 의 render_wav 로 프리셋을 렌더하면 프리셋 자신의
   1마디 `keys` 패턴만 울리고 **16마디 선율 라이브러리는 한 음도 나지 않는다.**
   MELODY·RIFF·BLINE 을 고쳐 놓고 귀로 확인할 방법이 없었던 이유다.

   마스터를 가로채는 방식은 mcp/pulse-audit/server.js 의 recordApp() 과 같다 —
   앱 스크립트보다 먼저 AudioNode.prototype.connect 를 감싸 destination 으로
   가는 신호를 탭에도 흘린다. **앱 코드는 건드리지 않는다.**

   사용법
     node tools/render-melody.mjs Dancehall
     node tools/render-melody.mjs Dancehall Ragga Afro-dancehall --sec 40
     node tools/render-melody.mjs Ragga --mel rag_aaba     ← 특정 선율로 고정
     node tools/render-melody.mjs Dancehall --off          ← 선율 끈 대조군

   16마디를 한 바퀴 들으려면 100 BPM 기준 약 39초가 필요하다(기본 40초).
   결과는 renders/ 에 쌓인다 — .gitignore 의 *.wav 로 저장소에는 안 들어간다. */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { HTML, ROOT, OK, NG, WARN } from './ci/_lib.mjs';
import { loadPlaywright, startServer, watchdog, auditRequire } from './ci/_browser.mjs';

const { RECORDER_SRC, toWav } = auditRequire('./capture.js');

const argv = process.argv.slice(2);
const flag = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? (argv[i + 1] ?? def) : def;
};
const SEC = +flag('sec', 40);
const MEL = flag('mel', 'genre');            // 'genre' | 'all' | MELODY 의 키
const MEL_OFF = argv.includes('--off');
const presets = argv.filter((a, i) =>
  !a.startsWith('--') && argv[i - 1] !== '--sec' && argv[i - 1] !== '--mel');

if (!presets.length) {
  console.log('프리셋 이름을 하나 이상 주십시오.');
  console.log('  예: node tools/render-melody.mjs Dancehall Ragga Afro-dancehall');
  process.exit(2);
}

const OUTDIR = join(ROOT, 'renders');
mkdirSync(OUTDIR, { recursive: true });

const stopDog = watchdog(Math.max(300, presets.length * (SEC + 40)), '선율 렌더');
const { chromium } = loadPlaywright();
const srv = await startServer();
const browser = await chromium.launch();

try {
  for (const preset of presets) {
    const page = await browser.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e).split('\n')[0]));

    /* destination 으로 가는 신호를 탭에도 흘린다 (server.js recordApp 과 동일) */
    await page.addInitScript(() => {
      const orig = AudioNode.prototype.connect;
      AudioNode.prototype.connect = function (dest, ...rest) {
        const r = orig.call(this, dest, ...rest);
        try {
          const ctx = this.context;
          if (dest === ctx.destination) {
            if (!ctx.__tap) { ctx.__tap = ctx.createGain(); window.__tapCtx = ctx; }
            orig.call(this, ctx.__tap);
          }
        } catch {}
        return r;
      };
    });

    await page.goto(`${srv.origin}/${HTML}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(500);

    const found = await page.evaluate(n => {
      const c = [...document.querySelectorAll('.chip')].find(x => x.dataset.name === n);
      if (c) { c.click(); return true; }
      return false;
    }, preset);
    if (!found) { console.log(`${NG} 프리셋 '${preset}' 없음 — 건너뜁니다`); await page.close(); continue; }

    /* ── 선율 켜기 ── 이 도구의 존재 이유다 */
    const mel = await page.evaluate(({ mode, off }) => {
      const sel = document.getElementById('melmode');
      if (!off) sel.value = mode;
      sel.dispatchEvent(new Event('change', { bubbles: true }));
      const btn = document.getElementById('mel');
      if (!off && btn.dataset.on !== '1') btn.click();
      if (off && btn.dataset.on === '1') btn.click();
      return { on: btn.dataset.on === '1', mode: sel.value,
               pool: (() => { try { return melodyPoolFor(src.keys).join('|'); } catch { return '?'; } })(),
               riff: (() => { try { return riffPoolFor(src.gtr).join('|'); } catch { return '?'; } })(),
               bass: (() => { try { return blinePoolFor(src.bass).join('|'); } catch { return '?'; } })(),
               bpm: +document.getElementById('bpm').value };
    }, { mode: MEL, off: MEL_OFF });

    if (!MEL_OFF && !mel.on) { console.log(`${NG} ${preset} — 선율을 켜지 못했습니다`); await page.close(); continue; }
    const bars = (SEC * mel.bpm / 60 / 4).toFixed(1);
    console.log(`\n▶ ${preset}  선율 ${mel.on ? mel.mode : '꺼짐'} · ${mel.bpm} BPM · ${SEC}초 ≈ ${bars}마디`);
    console.log(`   선율 풀 ${mel.pool}`);
    console.log(`   리프    ${mel.riff}`);
    console.log(`   베이스  ${mel.bass}`);

    await page.click('#play');
    await page.waitForFunction(() => !!window.__tapCtx, null, { timeout: 15000 });

    const chunks = [];
    await page.exposeBinding('__push', (_s, d) => {
      chunks.push([Float32Array.from(d.l), Float32Array.from(d.r)]);
    });
    const sr = await page.evaluate(async src => {
      const ctx = window.__tapCtx;
      const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
      await ctx.audioWorklet.addModule(url);
      const node = new AudioWorkletNode(ctx, 'pulse-rec', { numberOfInputs: 1, numberOfOutputs: 0 });
      let bl = [], br = [], acc = 0;
      const CH = Math.round(ctx.sampleRate * 0.25);
      node.port.onmessage = e => {
        bl.push(e.data.l); br.push(e.data.r); acc += e.data.l.length;
        if (acc >= CH) {
          const flat = a => { const o = new Float32Array(acc); let p = 0;
                              for (const x of a) { o.set(x, p); p += x.length; } return o; };
          window.__push({ l: Array.from(flat(bl)), r: Array.from(flat(br)) });
          bl = []; br = []; acc = 0;
        }
      };
      ctx.__tap.connect(node);
      window.__stopRec = () => node.port.postMessage('stop');
      return ctx.sampleRate;
    }, RECORDER_SRC);

    await page.waitForTimeout(SEC * 1000);
    /* 실제로 어느 선율이 걸렸는지 — 풀에서 고르므로 회차마다 다를 수 있다 */
    const picked = await page.evaluate(() => ({
      mel: (typeof melNow !== 'undefined' && melNow) ? melNow.label : null,
      riff: (typeof riffNow !== 'undefined' && riffNow) ? riffNow.label : null,
      bass: (typeof blineNow !== 'undefined' && blineNow) ? blineNow.label : null,
    }));
    await page.evaluate(() => { window.__stopRec?.(); document.getElementById('play').click(); });
    await page.waitForTimeout(400);

    const total = chunks.reduce((s, c) => s + c[0].length, 0);
    if (!total) { console.log(`${NG} ${preset} — 샘플을 못 받았습니다`); await page.close(); continue; }
    const L = new Float32Array(total), R = new Float32Array(total);
    let p = 0;
    for (const [l, r] of chunks) { L.set(l, p); R.set(r, p); p += l.length; }

    const safe = preset.replace(/[^\w가-힣-]+/g, '_');
    const tag = MEL_OFF ? 'mel-off' : (MEL === 'genre' ? 'mel' : `mel-${MEL}`);
    const out = join(OUTDIR, `${safe}-${tag}-${SEC}s.wav`);
    writeFileSync(out, toWav(L, R, sr));
    console.log(`   울린 선율 ${picked.mel || '(없음)'} · 리프 ${picked.riff || '(없음)'} · 베이스 ${picked.bass || '(없음)'}`);
    console.log(`${OK} ${out}  (${sr} Hz · ${(total / sr).toFixed(1)}초)`);
    if (errs.length) console.log(`   ${WARN} 페이지 오류: ${errs.slice(0, 2).join('; ')}`);
    await page.close();
  }
} finally {
  await browser.close(); await srv.close(); stopDog();
}
console.log(`\n${OK} renders/ 에 저장했습니다. (.gitignore 의 *.wav 로 저장소에는 안 들어갑니다)`);
