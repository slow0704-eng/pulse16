/* tools/ci/check-layout.mjs — «무엇이 접힘선 아래로 묻혔는가» 를 잰다.

   왜 필요한가.
   «뭐가 계속 묻힌다» 는 감각어라 그대로는 못 고친다. 숫자로 바꿔야 한다.
   이 저장소에서 그 숫자는 하나다 — **처음 화면에서 손이 닿는가**.
   장르를 고르고(chips) · 누르고(Play) · 보는(첫 패드) 세 가지가 스크롤
   없이 다 보이면 안 묻힌 것이고, 하나라도 접힘선 아래면 묻힌 것이다.

   1440×900 과 1280×720 두 노트북 크기에서 이것을 지킨다. 390×844 는
   같이 재서 표로만 남긴다 — 휴대폰에서 Play 가 접힘선 아래로 가는 것은
   어쩔 수 없고, 거기서는 .transport 의 sticky 도 꺼 두었다(rack.css).

   실행: node tools/ci/check-layout.mjs
   playwright 를 쓰므로 CI 의 browser 단계에 들어간다. */

import { loadPlaywright, startServer, watchdog } from './_browser.mjs';
import { HTML, OK, NG, head } from './_lib.mjs';

/* 접힘선 안에 있어야 하는 것 — 이름 · 선택자 · 기준 화면 높이 */
const MUST_FIT = [
  ['장르 칩',  '#chips .chip'],
  ['Play',     '#play'],
  ['첫 패드',  '#drums .pad'],
];

const MARKS = [
  ['헤더',        '.plate'],
  ['① 고르기',    '.library'],
  ['   · 근거줄', '.motif'],
  ['② 듣기',      '.transport'],
  ['   · Play',   '#play'],
  ['   · 그리드', '.scroller'],
  ['   · 첫 패드','#drums .pad'],
  ['   · 베이스롤','.roll'],
  ['③ 변주',      '.varbar'],
  ['④ 다듬기',    '.rackbar'],
  ['⑤ 소리 재료', '.bankbar'],
  ['꼬리말',      '.foot'],
];

const SIZES = [[1440, 900], [1280, 720], [390, 844]];

const stop = watchdog(120_000, '레이아웃 측정');
const pw = loadPlaywright();
const srv = await startServer();
const browser = await pw.chromium.launch();

head('레이아웃 — 접힘선');

let fail = 0;
const table = {};

for (const [w, h] of SIZES) {
  const pg = await browser.newPage({ viewport: { width: w, height: h } });
  await pg.goto(`${srv.origin}/${HTML}`, { waitUntil: 'networkidle' });
  /* 맨이름 LIB — 최상위 const 라 window 에 안 올라간다(smoke.mjs 와 같은 이유) */
  await pg.waitForFunction(
    () => { try { return Object.keys(LIB).length > 300 && document.querySelectorAll('#drums .pad').length > 0; }
            catch { return false; } }, null, { timeout: 20_000 });
  await pg.waitForTimeout(400);   // 칩 렌더가 끝날 여유

  const r = await pg.evaluate(({ MARKS, MUST_FIT }) => {
    const top = sel => {
      const e = document.querySelector(sel);
      if (!e) return null;
      const b = e.getBoundingClientRect();
      if (!b.width && !b.height) return null;      // 숨겨진 것은 없는 것으로
      return Math.round(b.top + scrollY);
    };
    const out = { docH: document.documentElement.scrollHeight, pos: {}, must: {} };
    for (const [name, sel] of MARKS) out.pos[name] = top(sel);
    for (const [name, sel] of MUST_FIT) out.must[name] = top(sel);
    return out;
  }, { MARKS, MUST_FIT });

  table[`${w}×${h}`] = r;
  await pg.close();

  if (w < 1280) continue;                          // 노트북 두 크기에서 실패 판정
  for (const [name, y] of Object.entries(r.must)) {
    if (y === null) { console.log(`${NG} ${name} — 화면에 없습니다`); fail++; continue; }
    if (y >= h)     { console.log(`${NG} ${name} 이 ${y}px — 접힘선(${h}px) 아래입니다`); fail++; }
  }
}

/* 표 */
const cols = Object.keys(table);
console.log(`\n   ${'구역'.padEnd(13)}${cols.map(c => c.padStart(11)).join('')}`);
for (const [name] of MARKS) {
  const cells = cols.map(c => {
    const y = table[c].pos[name];
    const fold = +c.split('×')[1];
    return (y === null ? '—' : `${y}${y >= fold ? '⛔' : ''}`).padStart(11);
  });
  console.log(`   ${name.padEnd(13)}${cells.join('')}`);
}
console.log(`   ${'문서 총높이'.padEnd(11)}${cols.map(c => String(table[c].docH).padStart(11)).join('')}`);

await browser.close();
await srv.close();
stop();

if (fail) { console.log(`\n❌ 접힘선 아래로 묻힌 것 ${fail}개 (1440×900 기준)`); process.exit(1); }
console.log(`\n${OK} 고르기 · Play · 첫 패드가 모두 첫 화면 안에 있습니다`);
