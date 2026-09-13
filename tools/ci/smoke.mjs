/* tools/ci/smoke.mjs — 앱이 실제로 브라우저에서 뜨고 소리를 내는가.

   왜: 1단계(정적)는 파일을 읽기만 한다. 문법이 맞고 이름이 안 겹쳐도
   <script> 순서가 틀리면 `Cannot read properties of undefined` 로 앱이
   백지가 되는데, 그건 실행해 봐야만 드러난다.
   docs/qa/01-신뢰성.md §6.1 에 «배포본만 뒤처진 상태를 목격했다» 는
   기록이 있다 — 콘솔 에러 0건을 매 푸시마다 기계가 세면 그게 사라진다.

   검사 항목
     1. HTTP 로 열었을 때 콘솔 error 0건 · uncaught 예외 0건
     2. 프리셋이 실려 있는가 (LIB)
        ⚠ window.LIB 가 아니라 **맨이름 LIB** 다. _build.js:33 이
          `const LIB = {}` 이고, 클래식 스크립트의 최상위 const 는 전역
          렉시컬 스코프에 들어가 window 프로퍼티가 되지 않는다.
     3. Play 클릭 → 3초 → uncaught 0건 · 여전히 재생 중
     4. file:// 로 열어도 콘솔 error 0건 (샘플 CORS 는 예외 허용)
     5. axe-core critical/serious 보고 — **실패시키지 않는다.**
        기준선을 먼저 재야 하므로 지금은 숫자만 남긴다.

   브라우저는 기본 자동재생 정책 그대로 띄운다(플래그를 주지 않는다).
   실사용자의 크롬과 같은 조건이어야 «첫 클릭 전» 관측이 의미를 갖는다.

   사용법:  node tools/ci/smoke.mjs
   종료코드: 0 통과 / 1 실패 / 2 준비 안 됨(playwright 없음)            */

import { HTML, OK, NG, WARN, head } from './_lib.mjs';
import { loadPlaywright, startServer, fileUrl, watchPage, where, watchdog, auditRequire }
  from './_browser.mjs';

const { chromium } = loadPlaywright();
const stopDog = watchdog(180, '스모크 테스트');

let fails = 0;
const fail = (msg) => { console.log(`${NG} ${msg}`); fails++; };
const pass = (msg) => console.log(`${OK} ${msg}`);

/* file:// 에서만 허용하는 것 — 로컬 파일에서 바깥 자원을 못 읽는 건
   브라우저 정책이지 앱의 결함이 아니다. 무엇을 봐주었는지 반드시 찍는다. */
const FILE_ALLOW = [
  /Access to .* from origin 'null'/i,
  /has been blocked by CORS policy/i,
  /net::ERR_FAILED/i,
  /Failed to load resource/i,
  /Cross origin requests are only supported/i,
];

const srv = await startServer();
const browser = await chromium.launch();

try {
  /* ═══ 1~3. HTTP ═══ */
  head('1. HTTP 로 열기 — 콘솔 에러 0건인가');
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const rec = watchPage(page);

  await page.goto(`${srv.origin}/${HTML}`, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(1500);   // main.js 의 초기화가 끝날 여유

  console.log(`콘솔 총 ${rec.all.length}줄 — error ${rec.errors.length} · warning ${rec.warnings.length} · uncaught ${rec.uncaught.length}`);
  if (rec.errors.length === 0 && rec.uncaught.length === 0) {
    pass('콘솔 error 0건 · uncaught 예외 0건');
  } else {
    for (const e of rec.errors) fail(`콘솔 error: ${e.text}${where(e)}`);
    for (const e of rec.uncaught) fail(`uncaught 예외:\n      ${e.text.split('\n').slice(0, 4).join('\n      ')}`);
  }

  /* ── 2. 프리셋 ── */
  head('2. 프리셋이 실려 있는가');
  const lib = await page.evaluate(() => {
    /* 맨이름 접근 — window.LIB 은 undefined 다 (최상위 const 는 렉시컬) */
    const viaWindow = typeof window.LIB !== 'undefined';
    let n = -1, names = -1, cats = -1;
    try { n = Object.keys(LIB).length; } catch {}
    try { names = LIB_NAMES.length; } catch {}
    try { cats = Object.keys(PRESET_CAT).length; } catch {}
    return { n, names, cats, viaWindow };
  });
  console.log(`LIB ${lib.n}개 · LIB_NAMES ${lib.names}개 · PRESET_CAT ${lib.cats}개`
            + `   (window.LIB 노출: ${lib.viaWindow ? '있음' : '없음 — 정상'})`);
  if (lib.n > 0) pass(`프리셋 ${lib.n}개 로딩됨`);
  else fail('프리셋이 0개다 — presets/_build.js 가 RAW → LIB 전개에 실패했을 수 있다');

  /* ── 3. 재생 ── */
  head('3. Play 클릭 → 3초 → 여전히 재생 중인가');
  const before = { err: rec.errors.length, exc: rec.uncaught.length };

  await page.click('#play');
  await page.waitForTimeout(3000);

  const state = await page.evaluate(() => {
    let p = null, st = null, ctxState = null, nodes = null;
    try { p = playing; } catch {}
    try { st = step; } catch {}
    try { ctxState = ctx && ctx.state; } catch {}
    try { nodes = liveNodes; } catch {}
    return { p, st, ctxState, nodes, stat: document.getElementById('stat')?.textContent || '' };
  });
  console.log(`playing=${state.p} · step=${state.st} · AudioContext=${state.ctxState} · liveNodes=${state.nodes}`);
  console.log(`#stat → ${JSON.stringify(state.stat)}`);

  const newErr = rec.errors.slice(before.err);
  const newExc = rec.uncaught.slice(before.exc);
  if (newExc.length === 0) pass('재생 3초 동안 uncaught 예외 0건');
  else for (const e of newExc) fail(`재생 중 uncaught: ${e.text.split('\n')[0]}`);

  if (newErr.length === 0) pass('재생 3초 동안 콘솔 error 0건');
  else for (const e of newErr) fail(`재생 중 콘솔 error: ${e.text}${where(e)}`);

  if (state.p === true) pass('3초 뒤에도 재생 상태');
  else fail(`3초 뒤 playing=${state.p} — 재생이 멈췄거나 시작되지 않았다`);

  if (state.ctxState === 'running') pass(`AudioContext running`);
  else fail(`AudioContext 가 '${state.ctxState}' 다 — 클릭이 제스처로 인정되지 않았다`);

  /* ── 5. 접근성 (보고만) ── */
  head('5. 접근성 — axe-core critical/serious (보고만, 실패시키지 않음)');
  await page.addScriptTag({ path: auditRequire.resolve('axe-core/axe.min.js') });
  const ax = await page.evaluate(async () => {
    const r = await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    });
    return { ver: window.axe.version, violations: r.violations,
             passes: r.passes.length, incomplete: r.incomplete.length };
  });
  /* passes 를 같이 찍는 이유: «위반 0» 은 검사가 잘 돈 것일 수도,
     axe 가 아예 안 돈 것일 수도 있다. 둘을 구별할 수 있어야 한다. */
  console.log(`axe-core ${ax.ver} — 규칙 통과 ${ax.passes}개 · 수동확인 필요 ${ax.incomplete}개`);
  const hot = ax.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
  if (hot.length === 0) {
    console.log(`${OK} critical/serious 위반 없음 (전체 위반 ${ax.violations.length}종)`);
  } else {
    console.log(`${WARN} critical/serious ${hot.length}종 · 총 ${hot.reduce((s, v) => s + v.nodes.length, 0)}곳`);
    for (const v of hot) {
      console.log(`     [${v.impact}] ${v.id} — ${v.nodes.length}곳 · ${v.help}`);
      console.log(`        예: ${v.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' , ')}`);
    }
    console.log(`     → 기준선 측정 단계입니다. 이 숫자를 docs 에 적어 두고, 다음부터 늘어나면 잡습니다.`);
  }
  await page.close();

  /* ═══ 4. file:// ═══ */
  head('4. file:// 로 열기 — 더블클릭 흐름이 살아있는가');
  const fpage = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const frec = watchPage(fpage);
  await fpage.goto(fileUrl(HTML), { waitUntil: 'load', timeout: 30000 });
  await fpage.waitForTimeout(1500);

  const flib = await fpage.evaluate(() => { try { return Object.keys(LIB).length; } catch { return -1; } });
  const allowed = [], real = [];
  for (const e of [...frec.errors, ...frec.uncaught]) {
    (FILE_ALLOW.some(re => re.test(e.text)) ? allowed : real).push(e);
  }
  console.log(`콘솔 총 ${frec.all.length}줄 — error ${frec.errors.length} · uncaught ${frec.uncaught.length} · LIB ${flib}개`);
  if (allowed.length) {
    console.log(`${WARN} 예외 허용 ${allowed.length}건 (file:// 의 바깥 자원 접근 — 앱 결함 아님):`);
    for (const e of allowed.slice(0, 5)) console.log(`     ${e.text.slice(0, 140)}`);
  }
  if (real.length === 0) pass('file:// 에서 실제 에러 0건');
  else for (const e of real) fail(`file:// 에러: ${e.text.slice(0, 300)}${where(e)}`);

  if (flib > 0) pass(`file:// 에서도 프리셋 ${flib}개 로딩됨`);
  else fail('file:// 에서 프리셋이 0개 — 더블클릭 흐름이 깨졌다');

  await fpage.close();
} finally {
  await browser.close();
  await srv.close();
  stopDog();
}

console.log('');
if (fails === 0) {
  console.log(`${OK} 스모크 테스트 통과`);
  process.exit(0);
}
console.log(`${NG} 스모크 테스트 실패 ${fails}건`);
process.exit(1);
