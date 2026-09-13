/* tools/ci/check-globals.mjs — 전역 이름 충돌 검사. **이 저장소에서 가장 중요한 검사.**

   왜: src/ 의 42개 파일은 클래식 <script> 라 하나의 전역 렉시컬 스코프를
   공유한다(ARCHITECTURE.md "왜 클래식 스크립트인가"). 두 파일이 같은 이름을
   const 로 선언하면 브라우저가 `Identifier 'X' has already been declared` 를
   던지고 **그 뒤 스크립트 전부가 실행되지 않는다** — 화면이 백지가 된다.
   실제로 FORM → SONG_FORM, duck() → duckSidechain() 개명이 이 사고의 흔적이다.

   두 겹으로 본다.
     1겹 · 파서 판정 : <script> 순서대로 이어붙여 `node --check` 에 먹인다.
                       Node 의 스크립트 모드는 브라우저 전역 렉시컬 스코프와
                       같은 규칙이라, 브라우저가 낼 바로 그 에러를 받아낸다.
                       (첫 에러 하나만 나오므로 원래 파일:행 으로 되짚어 준다)
     2겹 · 전수 조사 : 자체 스캐너로 중복을 한 번에 전부 나열한다.
                       최상위 function 중복은 문법상 합법이라 1겹이 못 잡는다 —
                       조용히 뒤엣것이 앞엣것을 덮어쓰므로 오히려 더 위험하다.
     덤  · id 충돌   : id 가 붙은 요소는 같은 이름의 암묵 전역을 만든다.
                       같은 이름의 최상위 function 이 있으면 경고한다(duck 재발 방지).

   사용법:  node tools/ci/check-globals.mjs
   종료코드: 0 통과 / 1 실패                                            */

import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { read, topLevelDecls, scriptsInHtml, idsInHtml, OK, NG, WARN, head } from './_lib.mjs';

let parserFail = 0, dupNames = 0, warnings = 0;

/* ═══ 0. 검사 대상 — HTML 이 실제로 부르는 src/ 파일, 부르는 순서대로 ═══ */

const loadOrder = scriptsInHtml()
  .map(s => s.src)
  .filter(s => s.startsWith('src/'));

if (loadOrder.length === 0) {
  console.log(`${NG} pulse16-mk16.html 에서 <script src="src/..."> 를 하나도 못 찾았습니다.`);
  process.exit(1);
}

/* ═══ 1겹 — 이어붙여 파서에게 묻는다 ═══ */

head('1겹 · 파서 판정 (node --check, 브라우저와 같은 규칙)');

const parts = [];
const lineMap = [];  // {startLine, file}  ← 이어붙인 파일의 행 → 원래 파일
let cursor = 1;
for (const f of loadOrder) {
  const body = read(f);
  lineMap.push({ startLine: cursor, file: f, lines: body.split('\n').length });
  parts.push(body);
  cursor += body.split('\n').length;
}
const joined = parts.join('\n');

const dir = mkdtempSync(join(tmpdir(), 'pulse16-ci-'));
const joinedPath = join(dir, 'joined.js');
writeFileSync(joinedPath, joined, 'utf8');

let parserOk = true;
try {
  execFileSync(process.execPath, ['--check', joinedPath], { stdio: 'pipe' });
} catch (e) {
  parserOk = false;
  const stderr = String(e.stderr || e.message);
  const m = /joined\.js:(\d+)/.exec(stderr);
  const reason = stderr.split('\n').find(l => /Error|error/.test(l))?.trim() || stderr.trim();
  console.log(`${NG} 이어붙인 코드가 파싱되지 않습니다 — 브라우저도 같은 곳에서 죽습니다.`);
  console.log(`     ${reason}`);
  if (m) {
    const n = Number(m[1]);
    const owner = lineMap.filter(x => x.startLine <= n).pop();
    if (owner) console.log(`     위치 → ${owner.file}:${n - owner.startLine + 1}`);
  }
  parserFail++;
}
if (parserOk) {
  console.log(`${OK} ${loadOrder.length}개 파일을 로드 순서대로 이어붙여 파싱 — 통과`);
  console.log(`     (const/let/class 중복 선언 없음. function 중복은 2겹에서 본다)`);
}

/* ═══ 2겹 — 전수 조사 ═══ */

head('2겹 · 최상위 선언 전수 조사');

const byName = new Map(); // name → [{file,line,kind}]
let total = 0;
for (const f of loadOrder) {
  for (const d of topLevelDecls(f)) {
    total++;
    if (!byName.has(d.name)) byName.set(d.name, []);
    byName.get(d.name).push(d);
  }
}
console.log(`최상위 선언 ${total}개 / 고유 이름 ${byName.size}개`);

const dups = [...byName.entries()]
  .filter(([, v]) => v.length > 1)
  .sort((a, b) => a[0].localeCompare(b[0]));

if (dups.length === 0) {
  console.log(`${OK} 중복 선언 없음`);
} else {
  console.log('');
  for (const [name, list] of dups) {
    const kinds = new Set(list.map(d => d.kind));
    /* function 만 중복이면 «조용한 덮어쓰기» — 문법 에러는 아니지만 버그다.
       const/let/class 가 섞였으면 앱이 즉시 죽는다.                       */
    const kills = !(kinds.size === 1 && kinds.has('function'));
    console.log(`  ${NG} ${name}  (${[...kinds].join(' + ')})`);
    for (const d of list) console.log(`        ${d.file}:${d.line}  ${d.kind} ${d.name}`);
    console.log(kills
      ? `        → 앱이 즉시 죽습니다: Identifier '${name}' has already been declared`
      : `        → 문법 에러는 안 나지만 뒤에 로드된 정의가 앞것을 조용히 덮어씁니다`);
    dupNames++;
  }
}

/* ═══ 덤 — HTML id 와 최상위 function 의 충돌 ═══ */

head('덤 · HTML id ↔ 최상위 function 충돌 (duck() 사고 재발 방지)');

const ids = idsInHtml();
const fnNames = new Map();
for (const [name, list] of byName) {
  const fns = list.filter(d => d.kind === 'function');
  if (fns.length) fnNames.set(name, fns[0]);
}

const clashes = [...ids.keys()].filter(id => fnNames.has(id)).sort();
console.log(`HTML id ${ids.size}개 · 최상위 function ${fnNames.size}개`);

if (clashes.length === 0) {
  console.log(`${OK} 충돌 없음`);
} else {
  for (const id of clashes) {
    const fn = fnNames.get(id);
    console.log(`  ${WARN} id="${id}" (pulse16-mk16.html:${ids.get(id)})`);
    console.log(`        ↔ function ${id}() (${fn.file}:${fn.line})`);
    console.log(`        → id 가 붙은 요소는 같은 이름의 암묵 전역을 만듭니다.`);
    console.log(`          duck() 이 #duck 과 부딪혀 duckSidechain() 이 된 것과 같은 자리입니다.`);
    warnings++;
  }
}

/* ═══ 정리 ═══ */

console.log('');
const fatal = parserFail + dupNames;
if (fatal === 0 && warnings === 0) {
  console.log(`${OK} 전역 이름 검사 통과 — 충돌 0건`);
  process.exit(0);
}
if (fatal === 0) {
  console.log(`${OK} 치명적 충돌 없음 · ${WARN} 경고 ${warnings}건 (실패로 다루지 않습니다)`);
  process.exit(0);
}
console.log(`${NG} 이름 충돌 ${dupNames}건${parserFail ? ' (파서도 거부)' : ''} · ${WARN} 경고 ${warnings}건`);
process.exit(1);
