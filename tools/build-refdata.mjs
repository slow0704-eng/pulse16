/* tools/build-refdata.mjs — 근거 자료를 앱이 읽을 수 있는 형태로 굳힌다.

   왜 생성이 필요한가: 앱은 `file://` 로 더블클릭해서 열리는 것이 가치다
   (ARCHITECTURE.md "왜 클래식 스크립트인가"). 그래서 마크다운도 JSON 도
   fetch 할 수 없다 — CORS 로 막힌다. 화면에 띄우려면 **클래식 스크립트로
   굳혀 두는 수밖에** 없다.

   만드는 것 둘
     src/data/billboard.js   billboard/*.md   → const BILLBOARD
     src/data/profiles.js    genres/profiles/*.json → const GENRE_PROFILE

   ⚠ 이 둘은 **생성물**이다. 손으로 고치지 말고 원본을 고친 뒤 다시 돌려라.
     원본과 어긋나면 CI 가 `--check` 로 잡는다.

   사용법:  node tools/build-refdata.mjs            만든다
            node tools/build-refdata.mjs --check    원본과 어긋나는지만 본다
                                                    (CI 가 이것을 돌린다)      */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { abs, OK, NG, WARN, head } from './ci/_lib.mjs';

const CHECK = process.argv.includes('--check');
let stale = 0;
/** --check 면 쓰지 않고 현재 파일과 대조만 한다 — 생성물이 낡는 것을 막는다 */
function emit(rel, text){
  const path = abs(rel);
  if(!CHECK){ writeFileSync(path, text, 'utf8'); return true; }
  const now = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if(now === text) return true;
  console.log(`${NG} ${rel} 이 원본과 어긋납니다 — node tools/build-refdata.mjs 를 다시 돌리십시오`);
  stale++;
  return false;
}

/* ═══ 1. 빌보드 ═══════════════════════════════════════════════════
   표기: `N. 제목 — 아티스트  \`계열 · 장르\``  (billboard/README.md §표기 규칙)
   `*(재등정)*` 같은 꼬리표는 따로 뗀다.                              */

const DECADES = ['1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];
/* 꼬리표 `*1위 … · N주*` 는 tools/apply-billboard-runs.mjs 가 붙인다.
   없을 수도 있다 — 위키백과 표기와 짝이 안 지어진 28건은 비어 있다. */
const ROW = /^(\d+)\.\s+(.+?)\s+—\s+(.+?)\s*(?:\*\(([^)]+)\)\*\s*)?`([A-K])\s*·\s*([^`]+)`(?:\s*\*1위\s*([^*·]+)·\s*(\d+)주\*)?\s*$/;

function parseChart(dir) {
  const rows = [];      // [year, title, artist, cat, genre, note]
  let year = null, skipped = 0;
  for (const dec of DECADES) {
    const f = join(abs(`billboard/${dir}`), `${dec}.md`);
    if (!existsSync(f)) continue;
    for (const raw of readFileSync(f, 'utf8').split('\n')) {
      const y = /^##\s+(\d{4})\s*$/.exec(raw);
      if (y) { year = +y[1]; continue; }
      if (!/^\d+\.\s/.test(raw)) continue;
      const m = ROW.exec(raw.trim());
      if (!m) { skipped++; continue; }
      const genre = m[6].trim().replace(/\?$/, '');
      /* [연도, 제목, 아티스트, 계열, 장르, 꼬리표, 1위 구간, 누적 주] */
      rows.push([year, m[2].trim(), m[3].trim(), m[5], genre, m[4] || '',
                 (m[7] || '').trim(), m[8] ? +m[8] : 0]);
    }
  }
  return { rows, skipped };
}

head('빌보드');
const hot = parseChart('hot100');
const bb = parseChart('bb200');
console.log(`Hot 100 ${hot.rows.length}건 (건너뜀 ${hot.skipped}) · Billboard 200 ${bb.rows.length}건 (건너뜀 ${bb.skipped})`);
if (hot.skipped + bb.skipped > 0)
  console.log(`${NG} 형식이 안 맞아 건너뛴 줄이 있습니다 — billboard/README.md 의 표기 규칙을 보십시오`);

const genres = new Set([...hot.rows, ...bb.rows].map(r => r[4]));
console.log(`장르 태그 ${genres.size}종`);

const bbJs = `/* 생성물 — tools/build-refdata.mjs 가 billboard/*.md 에서 만듭니다.
   손으로 고치지 마십시오. 원본을 고친 뒤 다시 돌리십시오.
   한 줄: [연도, 제목, 아티스트, 계열코드, 장르, 꼬리표, 1위 구간, 누적 주]
   1위 구간·주차의 출처도 위키백과다 — tools/fetch-billboard-runs.mjs 가 세어 온다.
   짝이 안 지어진 28건은 구간이 빈 문자열이고 주차가 0 이다(추측으로 안 채운다).
   출처는 위키백과 연도별 차트 1위 목록입니다 (billboard/README.md §신뢰도). */
'use strict';

const BILLBOARD = {
  hot100: ${JSON.stringify(hot.rows)},
  bb200: ${JSON.stringify(bb.rows)},
};
const BILLBOARD_GENRES = ${JSON.stringify([...genres].sort())};
`;
if(emit('src/data/billboard.js', bbJs))
  console.log(`${OK} src/data/billboard.js (${(bbJs.length / 1024).toFixed(0)} KB)`);

/* ═══ 2. 장르 프로파일 ═══════════════════════════════════════════
   화면에 띄울 것만 추린다. 근거 문서 전체를 앱에 실을 이유는 없다.   */

head('장르 프로파일');
const PDIR = 'genres/profiles';
const prof = {};
let files = 0;
if (existsSync(abs(PDIR))) {
  for (const f of readdirSync(abs(PDIR)).filter(x => x.endsWith('.json') && !x.startsWith('_'))) {
    files++;
    const j = JSON.parse(readFileSync(join(abs(PDIR), f), 'utf8'));
    for (const p of (j.profiles || [])) {
      prof[p.preset] = {
        sub: p.sub, cat: p.cat,
        mel: {
          d: [p.melody.density.min, p.melody.density.max],
          l: [p.melody.leapRatio.min, p.melody.leapRatio.max],
          r: [p.melody.range.min, p.melody.range.max],
          c: p.melody.contour, y: p.melody.rhythm,
          p: p.melody.repetition, v: p.melody.voicing, s: p.melody.scale,
        },
        bass: p.bass, lead: p.ensemble.lead, roles: p.ensemble.roles,
        conf: p.meta.confidence, ev: p.meta.evidenceBasis,
        pool: p.meta.pool, why: p.meta.note || '',
        diff: (p.meta.distinguishes || []).map(d => [d.from, d.axis, d.note]),
        share: p.meta.shareWith || null,
      };
    }
  }
}
const pJs = `/* 생성물 — tools/build-refdata.mjs 가 genres/profiles/*.json 에서 만듭니다.
   손으로 고치지 마십시오.

   ⚠ 곡·아티스트 이름은 여기 없습니다. 이 저장소는 생성 데이터에 이름을
     넣지 않는 것을 규칙으로 삼습니다(consulting/README.md). evidenceBasis 는
     「연대 · 지역 · N곡」 형식으로 강제돼 있어 제목이 들어갈 자리가 없습니다.
     실제 곡이 필요하면 BILLBOARD 를 보십시오 — 그쪽은 출처가 있는 자료입니다. */
'use strict';

const GENRE_PROFILE = ${JSON.stringify(prof)};
`;
if(emit('src/data/profiles.js', pJs))
  console.log(`${OK} src/data/profiles.js — 파일 ${files}개 · 프리셋 ${Object.keys(prof).length}종 (${(pJs.length / 1024).toFixed(0)} KB)`);

if(CHECK){
  console.log('');
  if(stale){ console.log(`${NG} 생성물 ${stale}개가 낡았습니다`); process.exit(1); }
  console.log(`${OK} 생성물이 원본과 일치합니다`);
}
