/* tools/fetch-billboard-runs.mjs — 1위 기간과 누적 주차를 **출처에서** 가져온다.

   왜 가져오는가: billboard/*.md 에는 곡명·아티스트·장르만 있었다. 「언제부터
   언제까지 1위였나 · 누적 몇 주인가」를 기억으로 채우면 그건 지어내는 것이고,
   billboard/README.md 가 «추측으로 채우면 그 위에 만든 패턴이 틀린 기반을
   갖게 된다» 고 직접 경고해 둔 자리다.

   출처는 기존 자료와 같다 — 위키백과 연도별 차트 1위 목록. 그 표는 **한 주가
   한 행**이라 시작·종료·주차를 세기만 하면 된다.

   연도 경계를 넘는 곡이 있으므로(1월 1위 곡은 대개 전해 11~12월에 시작했다)
   전 연도를 받아 **하나의 주간 타임라인**으로 이은 뒤 구간을 센다.
   중간에 1위를 내줬다 되찾은 곡은 구간이 둘이 되고, 누적 주차는 그 합이다.

   받은 페이지는 캐시한다 — 다시 돌릴 때 네트워크를 또 때리지 않는다.

   사용법:  node tools/fetch-billboard-runs.mjs [--from 1958] [--to 2026]
   결과:    data/billboard-runs.json                                     */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { abs, OK, NG, WARN, head } from './ci/_lib.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i >= 0 ? process.argv[i + 1] : d; };
const FROM = +arg('from', 1958), TO = +arg('to', 2026);
const CACHE = join(tmpdir(), 'pulse16-billboard');
mkdirSync(CACHE, { recursive: true });

const TITLE = {
  hot100: y => `List_of_Billboard_Hot_100_number_ones_of_${y}`,
  bb200:  y => `List_of_Billboard_200_number-one_albums_of_${y}`,
};

/** 위키백과 렌더 HTML. 위키텍스트보다 연대별 편차가 적다.

    ⚠ **실패는 캐시하지 않는다.** 처음에 빈 응답까지 캐시에 썼더니, 한 번
    막힌 뒤로는 계속 빈 값을 읽어서 134개 중 16개만 성공했다. 캐시는 성공한
    것만 담아야 «다시 돌리면 이어서 받는다» 가 성립한다. */
function wiki(title) {
  const f = join(CACHE, title.replace(/[^\w-]/g, '_') + '.html');
  if (existsSync(f)) {
    const c = readFileSync(f, 'utf8');
    if (c.length > 2000) return c;      // 짧으면 실패한 캐시다 — 다시 받는다
  }
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}`
            + `&prop=text&format=json&formatversion=2`;
  for (let tryN = 1; tryN <= 3; tryN++) {
    let raw = '';
    try {
      raw = execFileSync('curl', ['-sS', '-m', '45', '--retry', '2', '--retry-delay', '2',
                                  '-A', 'pulse16-refdata/1.0 (repo research)', url],
                         { maxBuffer: 64 * 1024 * 1024 }).toString();
    } catch { raw = ''; }
    let html = '';
    try { const j = JSON.parse(raw); html = (j.parse && j.parse.text) || ''; } catch {}
    if (html.length > 2000) { writeFileSync(f, html, 'utf8'); return html; }
    execFileSync(process.execPath, ['-e', `setTimeout(()=>{}, ${tryN * 1500})`]);  // 잠깐 쉬고 다시
  }
  return '';                            // 실패 — 캐시에 쓰지 않는다
}

/* ── 표 파서 ────────────────────────────────────────────────────────
   rowspan 을 펼쳐 «한 주 = 한 행» 으로 만든다. 곡이 9주 1위면 위키표에서는
   rowspan=9 한 칸이지만, 우리에게 필요한 것은 9개의 주다.               */

const strip = h => h
  .replace(/<sup[^>]*>[\s\S]*?<\/sup>/g, '')
  .replace(/<style[\s\S]*?<\/style>/g, '')
  .replace(/<[^>]+>/g, '')
  /* ⚠ 숫자 엔티티를 먼저 푼다. 연도마다 표기가 다르다 — 2010년은 보통 공백인데
     2011년은 `January&#160;1` 이라, 안 풀면 날짜 정규식이 통째로 빗나간다. */
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/ /g, ' ')
  .replace(/\[\d+\]/g, '')
  .replace(/\s+/g, ' ').trim()
  .replace(/^"(.*)"$/, '$1')
  .replace(/[†‡*]+$/, '').trim();

function parseTable(html) {
  /* «Issue date» 를 머리로 갖는 표를 고른다 */
  const tables = [...html.matchAll(/<table[^>]*>[\s\S]*?<\/table>/g)].map(m => m[0]);
  const t = tables.find(x => /Issue date/i.test(x) && /<\/th>/.test(x));
  if (!t) return null;

  const rows = [...t.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map(m => m[1]);
  if (!rows.length) return null;

  /* 머리에서 열 위치를 찾는다 — 연대마다 열 수가 다르다 */
  const hcells = [...rows[0].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map(m => strip(m[1]));
  const col = {
    date: hcells.findIndex(h => /issue date/i.test(h)),
    work: hcells.findIndex(h => /^(song|single|album)/i.test(h)),
    art : hcells.findIndex(h => /artist/i.test(h)),
  };
  if (col.date < 0 || col.work < 0 || col.art < 0) return null;

  /* rowspan 을 펼친다: carry[열] = {값, 남은행수} */
  const carry = [];
  const out = [];
  for (const r of rows.slice(1)) {
    const cells = [...r.matchAll(/<t[dh]([^>]*)>([\s\S]*?)<\/t[dh]>/g)]
      .map(m => ({ span: +((/rowspan\s*=\s*"?(\d+)/i.exec(m[1]) || [])[1] || 1), v: strip(m[2]) }));
    const row = [];
    let ci = 0;
    for (let c = 0; c < 12; c++) {
      if (carry[c] && carry[c].left > 0) { row[c] = carry[c].v; carry[c].left--; continue; }
      if (ci >= cells.length) { row[c] = undefined; continue; }
      const cell = cells[ci++];
      row[c] = cell.v;
      if (cell.span > 1) carry[c] = { v: cell.v, left: cell.span - 1 };
    }
    const d = row[col.date], w = row[col.work], a = row[col.art];
    if (!d || !w || !a) continue;
    if (!/[A-Za-z]+\s+\d{1,2}/.test(d)) continue;      // "January 2" 꼴만
    out.push([d, w, a]);
  }
  return out;
}

const MON = { January:1, February:2, March:3, April:4, May:5, June:6,
              July:7, August:8, September:9, October:10, November:11, December:12 };
function iso(dateStr, year) {
  const m = /([A-Za-z]+)\s+(\d{1,2})/.exec(dateStr);
  if (!m || !MON[m[1]]) return null;
  return `${year}-${String(MON[m[1]]).padStart(2,'0')}-${String(+m[2]).padStart(2,'0')}`;
}

/* ── 수집 ───────────────────────────────────────────────────────── */

const result = {};
for (const chart of ['hot100', 'bb200']) {
  head(`${chart} — ${FROM}~${TO}`);
  const weeks = [];          // [iso, work, artist]
  let okY = 0, badY = [];
  for (let y = FROM; y <= TO; y++) {
    let rows = null;
    try { rows = parseTable(wiki(TITLE[chart](y))); } catch (e) { rows = null; }
    if (!rows || !rows.length) { badY.push(y); continue; }
    okY++;
    for (const [d, w, a] of rows) {
      const t = iso(d, y);
      if (t) weeks.push([t, w, a]);
    }
  }
  weeks.sort((a, b) => a[0].localeCompare(b[0]));
  console.log(`연도 ${okY}개 · 주 ${weeks.length}개` + (badY.length ? ` · ${NG} 못 읽음 ${badY.join(' ')}` : ` · ${OK}`));

  /* 연속 주를 한 구간으로 묶는다. 같은 곡이 떨어져 다시 오르면 구간이 늘어난다. */
  const runs = [];
  for (const [d, w, a] of weeks) {
    const last = runs[runs.length - 1];
    if (last && last.work === w && last.artist === a) { last.to = d; last.weeks++; continue; }
    runs.push({ work: w, artist: a, from: d, to: d, weeks: 1 });
  }
  /* 같은 곡의 여러 구간을 합쳐 누적 주차를 낸다 */
  const byWork = new Map();
  for (const r of runs) {
    const k = `${r.work} ${r.artist}`;
    if (!byWork.has(k)) byWork.set(k, { work: r.work, artist: r.artist, runs: [], weeks: 0 });
    const e = byWork.get(k);
    e.runs.push([r.from, r.to, r.weeks]);
    e.weeks += r.weeks;
  }
  result[chart] = [...byWork.values()]
    .sort((a, b) => a.runs[0][0].localeCompare(b.runs[0][0]));
  console.log(`구간 ${runs.length}개 → 고유 ${result[chart].length}건`
            + ` · 최장 ${Math.max(...result[chart].map(x => x.weeks))}주`);
}

mkdirSync(abs('data'), { recursive: true });
writeFileSync(abs('data/billboard-runs.json'),
  JSON.stringify({ source: 'en.wikipedia.org — List of Billboard … number ones of YYYY',
                   fetched: new Date().toISOString().slice(0, 10),
                   range: [FROM, TO], ...result }, null, 1) + '\n', 'utf8');
console.log(`\n${OK} data/billboard-runs.json`);
console.log(`${WARN} 캐시: ${CACHE} (다시 돌리면 네트워크를 안 탑니다 — 지우면 다시 받습니다)`);
