/* tools/build-refdata.mjs — 근거 자료를 앱이 읽을 수 있는 형태로 굳힌다.

   왜 생성이 필요한가: 앱은 `file://` 로 더블클릭해서 열리는 것이 가치다
   (ARCHITECTURE.md "왜 클래식 스크립트인가"). 그래서 마크다운도 JSON 도
   fetch 할 수 없다 — CORS 로 막힌다. 화면에 띄우려면 **클래식 스크립트로
   굳혀 두는 수밖에** 없다.

   만드는 것 셋
     src/data/billboard.js   billboard/*.md   → const BILLBOARD
     src/data/profiles.js    genres/profiles/*.json → const GENRE_PROFILE
     src/data/references.js  genres/*.md 의 레퍼런스 표 → const GENRE_REF

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

/* ═══ 3. 장르 레퍼런스 ═══════════════════════════════════════════
   genres/*.md 의 `| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |` 표.
   편성을 정할 때 쓴 판단 근거라 **사람이 읽는 자료**이고, 그래서 이름이 있다
   (profiles.js 와 다르다 — genres/profiles/README.md §2).

   ⚠ 앨범명은 작성자 기억에 의존한 미검증 값이다(00-reference.md «두 가지 주의»).
     `(확인 필요)` 표시는 버리지 않고 항목마다 들고 간다 — 화면이 `?` 로 찍는다.
     곡 단위 목록은 이 표에 없다. 없는 곡을 채우지 않는다.

   같은 프리셋이 여러 파일에 있으면(00-reference.md 는 초기 요약본이다)
   **계열 파일이 먼저**, 아티스트·앨범은 합치고, 속성 설명은 먼저 온 것을 쓴다.
   한 줄에 `Psytrance · Goa` 처럼 여럿이 묶여 있으면 나눠서 각각에 붙인다. */

head('장르 레퍼런스');

/* 표의 이름이 실제 프리셋에 닿는지 보려고 프리셋 이름을 긁는다.
   앱을 띄우지 않으려고 장르 파일의 최상위 키(`'Rock':{`)만 본다. */
const PRESET_NAMES = new Set();
const PRE_DIR = abs('src/data/presets');
for (const f of readdirSync(PRE_DIR).filter(x => /^\d+-.+\.js$/.test(x)))
  for (const m of readFileSync(join(PRE_DIR, f), 'utf8').matchAll(/^(['"])(.+?)\1\s*:\s*\{/gm))
    PRESET_NAMES.add(m[2]);

const REF_HEAD = /^\|\s*프리셋\s*\|\s*대표 아티스트\s*\|\s*대표 앨범\s*\|/;
/* ※N 은 표 아래 각주를 가리키는 표시다 — 이름에서는 떼고 각주는 따로 붙인다 */
const unmark = s => s.replace(/\*\*/g, '').replace(/`/g, '').replace(/※\d+/g, '').trim();
const isBlank = s => !s || /^[—-]$/.test(s) || s === '(확인 필요)';
/* «Howlin Wolf» 와 «Howlin' Wolf», «A.C. Jobim» 의 점 같은 표기 차이로 두 번 들어가지 않게 */
const nameKey = s => s.toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}]/gu, '');
const addUniq = (arr, v) => { if (v && !arr.includes(v)) arr.push(v); };

function parseRefFile(f) {
  const lines = readFileSync(join(abs('genres'), f), 'utf8').split('\n');
  const rows = [];
  let table = null;                        // 지금 각주를 받을 수 있는 표
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (REF_HEAD.test(l)) { table = []; continue; }
    if (!table) continue;
    if (/^\|[\s|:-]+\|$/.test(l)) continue;
    if (l.startsWith('|')) {
      const row = { cells: l.split('|').slice(1, -1).map(s => s.trim()),
                    marks: new Set([...l.matchAll(/※(\d+)/g)].map(m => m[1])), notes: [] };
      table.push(row); rows.push(row);
      continue;
    }
    /* 표 바로 아래 `> ※1 …` 각주. 인용 문단이 이어지는 동안 한 문단으로 모은다 */
    const fn = /^>\s*※(\d+)\s*(.*)$/.exec(l);
    if (fn) {
      let text = fn[2];
      while (i + 1 < lines.length && /^>\s*\S/.test(lines[i + 1].trim())
             && !/^>\s*※\d/.test(lines[i + 1].trim()))
        text += ' ' + lines[++i].trim().replace(/^>\s*/, '');
      for (const r of table) if (r.marks.has(fn[1])) r.notes.push(unmark(text));
      continue;
    }
    if (l === '' || l.startsWith('>')) continue;
    table = null;                          // 본문이 시작되면 그 표는 끝났다
  }
  return rows;
}

const REF = {};
const refMiss = [];
let refRows = 0;
const refFiles = readdirSync(abs('genres'))
  .filter(x => /^\d\d-.+\.md$/.test(x))
  .sort((a, b) => a.startsWith('00-') - b.startsWith('00-') || a.localeCompare(b));

for (const f of refFiles) {
  for (const row of parseRefFile(f)) {
    refRows++;
    const [pc, ac = '', lc = '', tc = ''] = row.cells;
    const whole = unmark(pc);
    let names = [whole];
    if (!PRESET_NAMES.has(whole)) {
      /* `Afrobeat (Fela 계보)` · `Rumba 계열` 처럼 설명이 붙은 이름도 벗긴다 */
      const parts = whole.split(/\s+·\s+/)
        .map(s => s.replace(/\s*\([^)]*\)\s*$/, '').replace(/\s+계열$/, '').trim());
      names = parts.filter(p => PRESET_NAMES.has(p));
      for (const p of parts) if (!PRESET_NAMES.has(p)) refMiss.push(`${f} — ${p}`);
    }
    for (const n of names) {
      const e = REF[n] ||= { a: [], al: [], at: '', no: [], src: [] };
      for (const tok of unmark(ac).split(/\s+·\s+/)) {
        if (isBlank(tok)) continue;
        /* `(Memphis 계보 파생)` 은 이름이 아니라 «이름을 세우지 않은 이유» 다 */
        if (/^\(.*\)$/.test(tok)) { addUniq(e.no, tok.slice(1, -1)); continue; }
        if (!e.a.some(x => nameKey(x) === nameKey(tok))) e.a.push(tok);
      }
      const unsure = /확인 필요/.test(lc);
      for (const tok of unmark(lc).replace(/\(확인 필요\)/g, '').split(/\s+·\s+/).map(s => s.trim())) {
        if (isBlank(tok)) continue;
        const have = e.al.find(x => nameKey(x[0]) === nameKey(tok));
        if (have) have[1] = have[1] && unsure;       // 한 곳이라도 확인 표시 없이 적었으면 그쪽
        else e.al.push([tok, unsure]);
      }
      const attr = tc.replace(/※\d+/g, '').trim();   // ** 는 남긴다 — 화면이 굵게 바꾼다
      if (!e.at && !isBlank(unmark(attr))) e.at = attr;
      for (const note of row.notes) addUniq(e.no, note);
      addUniq(e.src, f);
    }
  }
}

const refNames = Object.keys(REF);
const refNoArtist = refNames.filter(n => !REF[n].a.length);
const refAbsent = [...PRESET_NAMES].filter(n => !REF[n]);
console.log(`표 ${refRows}줄 (파일 ${refFiles.length}개) · 프리셋 이름 ${PRESET_NAMES.size}종`);
console.log(`레퍼런스가 붙은 프리셋 ${refNames.length}종 · 그중 아티스트 없음 ${refNoArtist.length}종`);
if (refAbsent.length)
  console.log(`${WARN} 표에 없는 프리셋 ${refAbsent.length}종 — ${refAbsent.join(' · ')}`);
if (refMiss.length) {
  console.log(`${WARN} 프리셋 이름에 닿지 않는 표 이름 ${refMiss.length}개 (표기가 프리셋과 다릅니다):`);
  for (const m of refMiss) console.log(`     ${m}`);
}

const rJs = `/* 생성물 — tools/build-refdata.mjs 가 genres/*.md 의 «레퍼런스» 표에서 만듭니다.
   손으로 고치지 마십시오. 원본 표를 고친 뒤 다시 돌리십시오.

   한 항목: { a: 대표 아티스트[], al: [앨범, 확인필요?][], at: 뽑아낸 속성,
             no: 각주·이름을 세우지 않은 이유[], src: 출처 파일[] }

   ⚠ 앨범명은 작성자 기억에 의존한 미검증 값입니다(genres/00-reference.md).
     곡 단위 목록은 원본에 없습니다 — 여기에도 없습니다.
   ⚠ 사람이 읽으라고 둔 자료입니다. 이 이름을 생성 파이프라인(프롬프트·
     프로파일)에 넣지 마십시오 — genres/profiles/README.md §2. */
'use strict';

const GENRE_REF = ${JSON.stringify(REF)};
`;
if(emit('src/data/references.js', rJs))
  console.log(`${OK} src/data/references.js — 프리셋 ${refNames.length}종 (${(rJs.length / 1024).toFixed(0)} KB)`);

if(CHECK){
  console.log('');
  if(stale){ console.log(`${NG} 생성물 ${stale}개가 낡았습니다`); process.exit(1); }
  console.log(`${OK} 생성물이 원본과 일치합니다`);
}
