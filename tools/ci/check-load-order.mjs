/* tools/ci/check-load-order.mjs — HTML 의 <script> 목록 ↔ 디스크 ↔ ARCHITECTURE.md 대조.

   왜: 이 앱에는 빌드가 없으므로 «파일이 로드되는지» 를 확인해 주는 것이
   아무것도 없다. 파일 이름을 바꾸고 HTML 을 안 고치면 404 가 나고 그 아래
   스크립트가 전부 죽는다 — docs/qa/01-신뢰성.md §6.1 에 실제로
   «배포본만 뒤처진» 상태를 목격한 기록이 있다. 반대로 HTML 에서 빠뜨린
   파일은 404 도 안 나고 그냥 **없는 셈**이 되어, 고친 코드가 반영 안 되는
   채로 몇 시간을 태우게 한다.

   사용법:  node tools/ci/check-load-order.mjs
   종료코드: 0 통과(경고 포함) / 1 실패                                  */

import { existsSync } from 'node:fs';
import { walk, read, abs, scriptsInHtml, HTML, OK, NG, WARN, head } from './_lib.mjs';

let errors = 0, warnings = 0;

const scripts = scriptsInHtml();
const inHtml = scripts.map(s => s.src);
const srcInHtml = inHtml.filter(s => s.startsWith('src/'));
const onDisk = walk('src', ['.js']);

/* ═══ 1. HTML 에 있는데 디스크에 없는 파일 → 404, 에러 ═══ */

head('1. HTML 이 부르는 파일이 실재하는가 (404 검사)');
console.log(`<script src> ${inHtml.length}개 (vendor 포함)`);

const missing = inHtml.filter(s => !/^https?:/.test(s) && !existsSync(abs(s)));
if (missing.length === 0) {
  console.log(`${OK} 전부 실재합니다`);
} else {
  for (const s of missing) {
    const line = scripts.find(x => x.src === s).line;
    console.log(`  ${NG} ${s}  ← ${HTML}:${line} 이 부르는데 디스크에 없습니다 (404)`);
    console.log(`        → 이 스크립트와 그 아래 스크립트가 전부 실행되지 않습니다`);
    errors++;
  }
}

/* ═══ 2. 디스크에 있는데 HTML 에 없는 파일 → 죽은 파일, 경고 ═══ */

head('2. 디스크의 src/*.js 가 전부 로드되는가 (죽은 파일 검사)');
console.log(`src/**/*.js ${onDisk.length}개 · HTML 이 부르는 것 ${srcInHtml.length}개`);

const orphans = onDisk.filter(f => !srcInHtml.includes(f));
if (orphans.length === 0) {
  console.log(`${OK} 죽은 파일 없음 — 디스크의 모든 src 파일이 로드됩니다`);
} else {
  for (const f of orphans) {
    console.log(`  ${WARN} ${f}  ← 디스크에 있으나 ${HTML} 이 부르지 않습니다`);
    console.log(`        → 이 파일을 고쳐도 앱에 아무 영향이 없습니다`);
    warnings++;
  }
}

/* ═══ 3. 중복 로드 → 같은 파일을 두 번 부르면 const 가 두 번 선언된다 ═══ */

head('3. 같은 파일을 두 번 부르지 않는가');
const seen = new Map();
let dupLoad = 0;
for (const s of scripts) {
  if (seen.has(s.src)) {
    console.log(`  ${NG} ${s.src} 를 두 번 부릅니다 (${HTML}:${seen.get(s.src)} · :${s.line})`);
    console.log(`        → 최상위 const 가 두 번 선언되어 앱이 즉시 죽습니다`);
    errors++; dupLoad++;
  } else seen.set(s.src, s.line);
}
if (dupLoad === 0) console.log(`${OK} 중복 로드 없음`);

/* ═══ 4. ARCHITECTURE.md 지도에 빠진 파일 → 경고 ═══

   지도는 «src/ 아래 상대 경로» 를 파일명 단위로 적고
   (예: `voice-drum.js      §9  킥·스네어…`), 번호가 붙은 형제 파일은
   `01-rock.js …` / `12-example.js` 처럼 **`…` 로 범위를 생략**한다.

   그래서 두 가지를 지킨다.
     · 산문이 아니라 «## 지도» 아래 코드블록 안에서만 찾는다.
       (그러지 않으면 본문의 `src/main.js` 언급에 걸린다)
     · 파일명 앞뒤 경계를 본다. `build.js` 가 `_build.js` 에 걸리면 안 된다.
     · 번호 형제는 «맨 앞과 맨 뒤가 적혀 있고 지도에 … 가 있으면»
       그 사이를 적힌 것으로 친다.                                     */

head('4. ARCHITECTURE.md 지도가 최신인가');
const archiAll = read('ARCHITECTURE.md');
const mapBlock = extractMapBlock(archiAll);
if (mapBlock === null) {
  console.log(`  ${WARN} ARCHITECTURE.md 에서 "## 지도" 아래 코드블록을 못 찾았습니다 — 4·5 검사를 건너뜁니다`);
  warnings++;
}
const archi = mapBlock ?? '';

function extractMapBlock(md) {
  const at = md.indexOf('## 지도');
  if (at < 0) return null;
  const open = md.indexOf('```', at);
  if (open < 0) return null;
  const close = md.indexOf('```', open + 3);
  if (close < 0) return null;
  return md.slice(open + 3, close);
}

/** 파일명이 지도에 «독립된 이름으로» 적혀 있는가.
    앞이 단어문자·하이픈·점이면 다른 이름의 일부다 (`_build.js` 안의 `build.js`). */
function listedInMap(base) {
  const re = new RegExp(`(?<![\\w\\-.])${base.replace(/[.]/g, '\\.')}`);
  return re.test(archi);
}

/** `01-rock.js` 처럼 번호가 붙은 형제가 `…` 로 생략된 자리인가.
    같은 디렉터리의 번호 형제 중 최소·최대가 지도에 적혀 있고
    지도에 `…` 가 있으면, 그 사이 번호는 적힌 것으로 친다. */
function coveredByEllipsis(f) {
  if (!archi.includes('…')) return false;
  const dir = f.slice(0, f.lastIndexOf('/'));
  const base = f.split('/').pop();
  const m = /^(\d+)-/.exec(base);
  if (!m) return false;
  const sibs = onDisk
    .filter(x => x.slice(0, x.lastIndexOf('/')) === dir)
    .map(x => x.split('/').pop())
    .filter(x => /^\d+-/.test(x))
    .sort();
  if (sibs.length < 3) return false;
  const first = sibs[0], last = sibs[sibs.length - 1];
  if (!listedInMap(first) || !listedInMap(last)) return false;
  const n = Number(m[1]);
  return n > Number(/^(\d+)-/.exec(first)[1]) && n < Number(/^(\d+)-/.exec(last)[1]);
}

const notMapped = mapBlock === null ? [] : onDisk.filter(f => {
  const base = f.split('/').pop();
  return !listedInMap(base) && !coveredByEllipsis(f);
});
if (notMapped.length === 0) {
  console.log(`${OK} src 의 ${onDisk.length}개 파일이 모두 지도에 있습니다`);
} else {
  for (const f of notMapped) {
    console.log(`  ${WARN} ${f} 가 ARCHITECTURE.md 의 "지도" 절에 없습니다`);
    console.log(`        → 저장소 규칙: 새 파일을 끼우면 지도의 그 자리에도 적습니다`);
    warnings++;
  }
}

/* ═══ 5. 지도의 순서가 실제 로드 순서와 같은가 → 경고 ═══
   지도는 «위→아래가 곧 의존 순서» 라고 선언한다. 어긋나면 지도를 믿고
   새 파일을 끼운 사람이 엉뚱한 자리에 넣는다.                          */

head('5. 지도의 순서가 실제 <script> 순서와 같은가');
const mapPos = srcInHtml.map(f => {
  const base = f.split('/').pop();
  const m = new RegExp(`(?<![\\w\\-.])${base.replace(/[.]/g, '\\.')}`).exec(archi);
  return { f, at: m ? m.index : -1 };
}).filter(x => x.at >= 0);
let outOfOrder = 0;
for (let i = 1; i < mapPos.length; i++) {
  if (mapPos[i].at < mapPos[i - 1].at) {
    console.log(`  ${WARN} 지도에서 ${mapPos[i].f} 가 ${mapPos[i - 1].f} 보다 먼저 나옵니다`);
    console.log(`        → 실제 로드 순서는 그 반대입니다 (${HTML})`);
    warnings++; outOfOrder++;
  }
}
if (outOfOrder === 0) console.log(`${OK} 지도 순서 = 실제 로드 순서`);

/* ═══ 정리 ═══ */

console.log('');
if (errors === 0 && warnings === 0) {
  console.log(`${OK} 로드 순서 검사 통과`);
  process.exit(0);
}
if (errors === 0) {
  console.log(`${OK} 치명적 문제 없음 · ${WARN} 경고 ${warnings}건 (실패로 다루지 않습니다)`);
  process.exit(0);
}
console.log(`${NG} 에러 ${errors}건 · 경고 ${warnings}건`);
process.exit(1);
