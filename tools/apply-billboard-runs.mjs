/* tools/apply-billboard-runs.mjs — 1위 기간·누적 주차를 billboard/*.md 에 적는다.

   data/billboard-runs.json (tools/fetch-billboard-runs.mjs 가 만든다)을 읽어
   각 줄 뒤에 붙인다. 붙이는 값은 **출처에서 세어 온 것**이지 추정이 아니다.

     1. Tik Tok — Kesha  `B · Electropop`  *1위 2009-11-21~2010-02-27 · 9주*

   중간에 1위를 내줬다 되찾은 곡은 구간이 둘이 된다:
     *1위 2010-05-15, 2010-05-29~2010-06-12 · 4주*

   다시 돌려도 안전하다 — 이미 붙은 꼬리표는 갈아 끼운다.

   짝짓기는 제목+아티스트 문자열이다. 위키백과 표기와 이 저장소 표기가
   조금씩 다르므로 **못 찾은 줄은 건드리지 않고 목록으로 보고**한다.
   추측으로 채우면 그게 곧 틀린 기반이 된다(billboard/README.md §신뢰도).

   사용법:  node tools/apply-billboard-runs.mjs [--dry]                  */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { abs, OK, NG, WARN, head } from './ci/_lib.mjs';

const DRY = process.argv.includes('--dry');
const RUNS = JSON.parse(readFileSync(abs('data/billboard-runs.json'), 'utf8'));
const DECADES = ['1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

/* 짝짓기용 정규화 — 괄호 주석·따옴표·구두점·대소문자 차이를 없앤다.
   «featuring» 표기가 갈리므로 feat. 뒤는 잘라 비교한다. */
const norm = s => s
  .toLowerCase()
  .replace(/’|‘/g, "'").replace(/“|”/g, '"')
  .replace(/&/g, ' and ')
  .replace(/\s*\((feat|featuring)[^)]*\)/g, '')
  .replace(/\s+(feat|featuring|with)\.?\s+.*$/, '')
  .replace(/[^a-z0-9]+/g, '');

const index = {};
for (const chart of ['hot100', 'bb200']) {
  index[chart] = new Map();
  for (const r of RUNS[chart] || []) {
    const k = norm(r.work) + '|' + norm(r.artist);
    if (!index[chart].has(k)) index[chart].set(k, r);
    /* 제목만으로도 찾을 수 있게 — 아티스트 표기가 갈리는 경우가 많다 */
    const k2 = norm(r.work);
    if (!index[chart].has('T:' + k2)) index[chart].set('T:' + k2, r);
  }
}

/** `*1위 …*` 꼬리표 문자열 */
function tag(r) {
  const spans = r.runs.map(([a, b]) => a === b ? a : `${a}~${b}`).join(', ');
  return `  *1위 ${spans} · ${r.weeks}주*`;
}

const ROW = /^(\d+)\.\s+(.+?)\s+—\s+(.+?)(\s*\*\([^)]+\)\*)?(\s+`[A-K][^`]*`)(\s+\*1위[^*]*\*)?\s*$/;

let hit = 0, miss = 0;
const missing = [];

for (const [dir, chart] of [['hot100', 'hot100'], ['bb200', 'bb200']]) {
  head(dir);
  for (const dec of DECADES) {
    const f = abs(`billboard/${dir}/${dec}.md`);
    if (!existsSync(f)) continue;
    const lines = readFileSync(f, 'utf8').split(/\r?\n/);
    let changed = 0;
    for (let i = 0; i < lines.length; i++) {
      const m = ROW.exec(lines[i]);
      if (!m) continue;
      const [, no, title, artist, note = '', genre] = m;
      const key = norm(title) + '|' + norm(artist);
      const r = index[chart].get(key) || index[chart].get('T:' + norm(title));
      if (!r) { miss++; missing.push(`${dir}/${dec} ${title} — ${artist}`); continue; }
      hit++;
      const base = `${no}. ${title} — ${artist}${note}${genre}`;
      const next = base + tag(r);
      if (lines[i] !== next) { lines[i] = next; changed++; }
    }
    if (!DRY && changed) writeFileSync(f, lines.join('\n'), 'utf8');
    console.log(`  ${dec}  ${changed}줄 갱신`);
  }
}

console.log('');
console.log(`짝지음 ${hit}건 · 못 찾음 ${miss}건 (${(hit / (hit + miss) * 100).toFixed(1)}%)`);
if (miss) {
  console.log(`${WARN} 못 찾은 줄은 **건드리지 않았습니다** — 추측으로 채우지 않습니다.`);
  for (const x of missing.slice(0, 25)) console.log(`     ${x}`);
  if (missing.length > 25) console.log(`     … 외 ${missing.length - 25}건`);
}
console.log(DRY ? `${WARN} --dry 라 파일을 쓰지 않았습니다` : `${OK} billboard/*.md 갱신`);
