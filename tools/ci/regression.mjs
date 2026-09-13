/* tools/ci/regression.mjs — docs/qa/01-신뢰성.md 의 결함이 되돌아오지 않았는지 본다.

   왜: 한 번 고친 결함은 «다시 깨질 수 있는 자리» 다. 특히 이 앱의 저장본
   복원 경로(src/ui/edit.js 의 fillBank)는 «믿을 수 없는 입력을 받는 자리» 인데,
   깨졌을 때의 대가가 크다 — R1 은 깨진 상태가 **다시 저장돼** 새로고침해도
   되풀이됐고, 사용자가 «저장 지움» 을 스스로 찾아내야 벗어날 수 있었다.
   그런 결함은 사람이 매번 손으로 재현할 수 없으므로 기계가 맡아야 한다.

   시험 항목 — 번호는 docs/qa/01-신뢰성.md §2 의 결함 번호와 같다.
     R1  bass 키가 없는 저장본 → 예외 0건인가 (fillBank 방어)
     R5  bass 가 [null×16] 인 저장본 → AudioParam non-finite 오류가 나는가
     R6  rootNote 키가 없는 저장본 → rootNote 가 undefined 가 되는가
     R3  200 BPM 45초 재생 후 liveNodes 가 양수인가
     R4  첫 클릭 전 콘솔 경고가 기준치 이하인가
     C   손상 저장본(잘린 JSON · null · banks 가 문자열)에도 앱이 뜨는가

   ⚠ 이 파일은 시험만 한다. src/ 를 고치지 않는다.
      시험이 실패하면 임계값을 낮추지 말고 사람에게 보고할 것.

   사용법:  node tools/ci/regression.mjs
            node tools/ci/regression.mjs --quick   (R3 의 45초를 10초로)
   종료코드: 0 통과 / 1 실패 / 2 준비 안 됨                              */

import { HTML, OK, NG, WARN, head } from './_lib.mjs';
import { loadPlaywright, startServer, watchPage, where, watchdog } from './_browser.mjs';

const QUICK = process.argv.includes('--quick');
const { chromium } = loadPlaywright();
const stopDog = watchdog(QUICK ? 180 : 300, '회귀 시험');

const SAVE_KEY = 'pulse16.mk16.v1';       // src/ui/edit.js:84
const STEPS = 16;                          // src/core/config.js:22
const DRUMS = ['kick', 'snare', 'clap', 'chat', 'ohat', 'tom', 'perc'];  // config.js:64

/* docs/qa/01-신뢰성.md §2 R1 의 재현 절차에 적힌 저장본 모양 그대로.
   overrides 로 뱅크 한 칸만 바꿔 가며 여러 결함을 같은 틀에서 시험한다. */
function save(bankPatch = {}, topPatch = {}) {
  const bank = () => ({
    drums: Object.fromEntries(DRUMS.map(d => [d, new Array(STEPS).fill(0)])),
    ...bankPatch,
  });
  return JSON.stringify({
    v: 1, banks: [bank(), bank(), bank(), bank()], bank: 0,
    src: {}, eng: {}, probT: {}, mute: {}, lvl: {},
    rootNote: 9, scaleName: 'Minor Pentatonic', baseOct: 24,
    knobs: {}, sels: {}, panels: {},
    ...topPatch,
  });
}

const srv = await startServer();
const browser = await chromium.launch();
const URL = `${srv.origin}/${HTML}`;

/* ── 알려진 결함 ────────────────────────────────────────────────────
   아직 안 고쳐진 결함은 CI 를 영영 빨갛게 만든다. 그렇다고 검사를
   지우면 고쳐졌는지 영영 모른다. 그래서 **양방향**으로 다룬다.

     · 재현되면  → ⚠ «예상된 실패» 로 기록만 하고 CI 는 통과시킨다
     · 안 되면   → ❌ 실패시킨다. 고쳐졌다는 뜻이므로 이 목록에서 빼고
                    docs/qa/01-신뢰성.md 도 같이 고치라는 신호다

   ⚠ 새 결함을 여기 넣어서 CI 를 통과시키지 마십시오. 여기 넣는 것은
     «사람이 보고받고, 고치기로 결정을 미룬» 결함뿐입니다.        */
const KNOWN = new Map([
  ['R5', 'bass 가 [null×16] 이면 AudioParam non-finite — fillBank() 가 «배열이면 통과» 시켜 요소를 안 본다. docs §8 2번 미적용'],
  ['C-bank', 'bank 가 뱅크 수 밖이면 P 가 undefined — src/ui/edit.js:119 `bank=o.bank||0; P=banks[bank]` 에 범위 검사가 없다. 문서에 없는 결함(2026-09-14 발견)'],
]);

let fails = 0, expected = 0, revived = 0;
const fail = (m) => { console.log(`${NG} ${m}`); fails++; };
const pass = (m) => console.log(`${OK} ${m}`);

/** 알려진 결함까지 함께 판정한다. id 가 KNOWN 에 있으면 뒤집어서 본다. */
function check(id, ok, okMsg, ngMsg) {
  if (!KNOWN.has(id)) { ok ? pass(okMsg) : fail(ngMsg); return ok; }
  if (!ok) {
    console.log(`${WARN} 예상된 실패 [${id}] — ${ngMsg}`);
    console.log(`     알려진 결함: ${KNOWN.get(id)}`);
    expected++;
    return true;
  }
  console.log(`${NG} [${id}] 알려진 결함이 재현되지 않습니다 — ${okMsg}`);
  console.log(`     고쳐진 것 같습니다. tools/ci/regression.mjs 의 KNOWN 에서 '${id}' 를 빼고`);
  console.log(`     docs/qa/01-신뢰성.md 의 상태 표기도 «고쳐짐» 으로 갱신하십시오.`);
  fails++; revived++;
  return false;
}

/** 저장본을 심고 새로고침한 뒤, 원하는 만큼 재생해 본다. */
async function withSave(rawSave, { play = 0, bpm = null } = {}) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const rec = watchPage(page);
  /* 저장본은 페이지가 열려야 심을 수 있다(오리진이 있어야 localStorage 가 산다).
     그래서 한 번 열고 → 심고 → 새로고침한다 — 문서의 재현 절차와 같은 순서다. */
  await page.goto(URL, { waitUntil: 'load', timeout: 30000 });
  await page.evaluate(([k, v]) => {
    localStorage.clear();
    if (v !== null) localStorage.setItem(k, v);
  }, [SAVE_KEY, rawSave]);

  rec.errors.length = rec.warnings.length = rec.uncaught.length = rec.all.length = 0;
  await page.reload({ waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(1200);

  const beforeClick = {
    warnings: rec.warnings.length, errors: rec.errors.length, uncaught: rec.uncaught.length,
  };

  if (play > 0) {
    if (bpm) {
      await page.evaluate((v) => {
        const el = document.getElementById('bpm');
        el.value = String(v);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }, bpm);
    }
    await page.click('#play');
    await page.waitForTimeout(play);
  }

  const state = await page.evaluate(() => {
    const g = (fn) => { try { return fn(); } catch { return '<접근불가>'; } };
    return {
      playing: g(() => playing), nodes: g(() => liveNodes), step: g(() => step),
      rootNote: g(() => rootNote), scaleName: g(() => scaleName), baseOct: g(() => baseOct),
      bpm: g(() => Number(document.getElementById('bpm').value)),
      bass0: g(() => JSON.stringify(banks[0].bass)),
      libCount: g(() => Object.keys(LIB).length),
      savestat: document.getElementById('savestat')?.textContent || '',
      stat: document.getElementById('stat')?.textContent || '',
      gridCells: document.querySelectorAll('.note').length,
    };
  });
  await page.close();
  return { rec, state, beforeClick };
}

const nonFinite = (rec) =>
  [...rec.errors, ...rec.uncaught].filter(e => /non-finite|NaN/i.test(e.text));

try {
  /* ═══ R1 ═══ */
  head('R1 · bass 키가 없는 저장본 — fillBank() 방어가 살아있는가');
  {
    const { rec, state } = await withSave(save({ /* bass 없음 */ }), { play: 4000 });
    console.log(`uncaught ${rec.uncaught.length} · 콘솔 error ${rec.errors.length}`
              + ` · playing=${state.playing} · banks[0].bass=${String(state.bass0).slice(0, 60)}`);
    console.log(`savestat → ${JSON.stringify(state.savestat)}`);
    if (rec.uncaught.length === 0) pass('4초 재생 동안 uncaught 예외 0건');
    else {
      for (const e of rec.uncaught.slice(0, 5)) fail(`R1 재발: ${e.text.split('\n')[0]}`);
      console.log(`     → src/ui/edit.js 의 fillBank() 방어가 사라졌는지 확인하십시오`);
    }
    if (Array.isArray(JSON.parse(state.bass0 || 'null'))) pass('bass 가 배열로 메워졌다');
    else fail(`bass 가 배열이 아니다: ${state.bass0}`);
  }

  /* ═══ R5 ═══ */
  head('R5 · bass 가 [null×16] 인 저장본 — AudioParam non-finite 가 나는가');
  {
    const { rec, state } = await withSave(
      save({ bass: new Array(STEPS).fill(null) }), { play: 5000 });
    const nf = nonFinite(rec);
    console.log(`uncaught ${rec.uncaught.length} · 콘솔 error ${rec.errors.length}`
              + ` · non-finite ${nf.length}건 · banks[0].bass=${String(state.bass0).slice(0, 60)}`);
    check('R5', nf.length === 0,
      'non-finite 오류 0건',
      `non-finite 오류 ${nf.length}건 — ${nf[0] ? nf[0].text.slice(0, 150) : ''}`);
  }

  /* ═══ R6 ═══ */
  head('R6 · rootNote 키가 없는 저장본 — undefined 가 되는가');
  {
    const { rec, state } = await withSave(
      save({}, { rootNote: undefined, scaleName: undefined, baseOct: undefined }), { play: 3000 });
    console.log(`rootNote=${JSON.stringify(state.rootNote)}`
              + ` · scaleName=${JSON.stringify(state.scaleName)}`
              + ` · baseOct=${JSON.stringify(state.baseOct)}`
              + ` · uncaught ${rec.uncaught.length}`);
    const bad = [['rootNote', state.rootNote], ['scaleName', state.scaleName], ['baseOct', state.baseOct]]
      .filter(([, v]) => v === undefined || v === null || v === '<접근불가>');
    if (bad.length === 0) pass('세 값 모두 기본값으로 살아남았다 (!=null 가드 동작)');
    else for (const [k, v] of bad) fail(`R6 재발: ${k} = ${JSON.stringify(v)}`);
    if (rec.uncaught.length === 0) pass('uncaught 예외 0건');
    else fail(`uncaught ${rec.uncaught.length}건`);
  }

  /* ═══ R3 ═══ */
  const sec = QUICK ? 10 : 45;
  head(`R3 · 200 BPM ${sec}초 재생 후 liveNodes 가 음수가 아닌가`);
  {
    /* ⚠ 저장본을 심지 않는다. save() 가 만드는 뱅크는 드럼이 전부 0 인
       **빈 패턴**이라 칠 노트가 없고, 그러면 liveNodes 0 이 «정상» 이 되어
       계수기를 재는 의미가 사라진다. 기본 프리셋으로 실제 소리를 내야 한다. */
    const { rec, state } = await withSave(null, { play: sec * 1000, bpm: 200 });
    console.log(`bpm=${state.bpm} · liveNodes=${state.nodes} · step=${state.step}`
              + ` · playing=${state.playing} · uncaught ${rec.uncaught.length}`);
    console.log(`#stat → ${JSON.stringify(state.stat)}`);
    if (typeof state.nodes === 'number' && state.nodes > 0) {
      pass(`liveNodes = ${state.nodes} (양수·정상)`);
    } else if (state.nodes === 0) {
      fail('liveNodes 가 0이다 — 재생 중인데 그래프가 비어 있다(소리가 안 난다)');
    } else {
      fail(`R3 재발: liveNodes = ${state.nodes}`);
      console.log(`     → src/core/util.js 의 sweep() 이 'gain'/'bq' 만 세는지 확인하십시오.`);
      console.log(`       retire(node,'x',at) 를 쓰는 자리를 새로 만들면 이 계수기가 어긋납니다.`);
    }
    if (rec.uncaught.length === 0) pass(`${sec}초 재생 동안 uncaught 예외 0건`);
    else for (const e of rec.uncaught.slice(0, 3)) fail(`재생 중 uncaught: ${e.text.split('\n')[0]}`);
  }

  /* ═══ R4 ═══ */
  const WARN_MAX = 10;   // 기준선 4개(docs §5.2). 여유 6개를 두되 낮추지 말 것.
  head(`R4 · 첫 클릭 전 콘솔 경고가 ${WARN_MAX}개 이하인가`);
  {
    const { rec, beforeClick } = await withSave(null, { play: 0 });
    await new Promise(r => setTimeout(r, 1)); // 출력 순서 안정
    console.log(`첫 클릭 전 경고 ${beforeClick.warnings}개 (기준선 4 · 상한 ${WARN_MAX})`);
    for (const w of rec.warnings.slice(0, 6)) console.log(`     · ${w.text.slice(0, 110)}${where(w)}`);
    if (beforeClick.warnings <= WARN_MAX) pass(`경고 ${beforeClick.warnings}개 — 상한 이내`);
    else {
      fail(`R4 재발: 첫 클릭 전 경고 ${beforeClick.warnings}개`);
      console.log(`     → src/main.js 의 프리워밍이 requestIdleCallback/setTimeout 으로`);
      console.log(`       되돌아갔는지 확인하십시오. 첫 제스처(pointerdown/keydown)여야 합니다.`);
      console.log(`     ⚠ 이 숫자가 넘었다고 상한을 올리지 마십시오. 원인을 보십시오.`);
    }
  }

  /* ═══ C · 손상 저장본 ═══ */
  head('C · 손상된 저장본에도 앱이 뜨는가');
  {
    const cases = [
      ['C-trunc',      '잘린 JSON',            '{"v":1,"banks":[{"drums":'],
      ['C-null',       'null 문자열',          'null'],
      ['C-banks-str',  'banks 가 문자열',      JSON.stringify({ v: 1, banks: 'oops', bank: 0 })],
      ['C-banks-num',  'banks 가 숫자 배열',   JSON.stringify({ v: 1, banks: [1, 2, 3, 4], bank: 0 })],
      ['C-empty',      '빈 객체',              '{}'],
      ['C-ver',        'v 가 틀림',            JSON.stringify({ v: 99, banks: [] })],
      ['C-bank',       'bank 가 범위 밖 (77)', save({}, { bank: 77 })],
      ['C-drums-str',  'drums 가 문자열',      save({ drums: 'nope' })],
    ];
    for (const [id, name, raw] of cases) {
      const { rec, state } = await withSave(raw, { play: 2000 });
      const okBoot = state.libCount > 0 && state.gridCells > 0 && rec.uncaught.length === 0;
      const verdict = check(id, okBoot,
        `${name} — 앱이 뜬다 (LIB ${state.libCount} · 그리드 ${state.gridCells}칸 · 예외 0)`,
        `${name} — LIB ${state.libCount} · 그리드 ${state.gridCells}칸 · uncaught ${rec.uncaught.length}`);
      if (!okBoot) {
        for (const e of rec.uncaught.slice(0, 2)) console.log(`     ${e.text.split('\n')[0]}`);
      }
      void verdict;
    }
  }
} finally {
  await browser.close();
  await srv.close();
  stopDog();
}

console.log('');
if (expected) {
  console.log(`${WARN} 예상된 실패 ${expected}건 — 아직 안 고친 알려진 결함입니다:`);
  for (const [id, why] of KNOWN) console.log(`     [${id}] ${why}`);
  console.log('');
}
if (fails === 0) {
  console.log(`${OK} 회귀 시험 통과${expected ? ` (알려진 결함 ${expected}건은 예상된 실패)` : ''}`);
  process.exit(0);
}
if (revived) {
  console.log(`${WARN} 알려진 결함 ${revived}건이 재현되지 않습니다 — 고쳐졌다면 KNOWN 과 문서를 함께 갱신하십시오.`);
}
console.log(`${NG} 회귀 시험 실패 ${fails}건`);
console.log(`${WARN} 임계값을 고쳐서 통과시키지 마십시오. docs/qa/01-신뢰성.md 를 보고 원인을 찾으십시오.`);
process.exit(1);
