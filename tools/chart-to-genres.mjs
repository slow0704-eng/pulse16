/* 차트 → 장르 문서 매핑 — billboard/ 의 1위 곡·앨범을
   genres/*.md 의 «그 장르가 적힌 절» 밑에 표로 붙인다.

   실행:  node tools/chart-to-genres.mjs        (적용)
          node tools/chart-to-genres.mjs --dry  (예행 — 건수만)

   · 붙일 자리는 «그 장르 이름이 표 첫 칸에 나오는 절» 로 찾는다.
     계열 코드(A~K)가 가리키는 파일에 없으면 장르의 본적(family) 파일로 보낸다.
   · <!-- chart-auto:start --> ~ end 사이는 통째로 갈아 끼우므로
     그 안을 손으로 고치지 마십시오. 고칠 것은 billboard/ 쪽 태그입니다.
   · 재등정으로 여러 해에 걸린 작품은 첫 해만 남긴다.
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* 한글 경로가 URL 인코딩되지 않도록 fileURLToPath 를 쓴다 */
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const P = f => path.join(ROOT, f);
const DRY = process.argv.includes('--dry');
const MARK_A = '<!-- chart-auto:start -->';
const MARK_B = '<!-- chart-auto:end -->';

const db = JSON.parse(fs.readFileSync(P('data/genres.json'), 'utf8'));
const glist = db.genres || db;
const byName = new Map();
for (const g of glist) for (const n of [g.name, ...(g.aliases || [])]) if (n && !byName.has(n)) byName.set(n, g);

const CODE_FILE = { A:'01-rock.md',B:'02-pop.md',C:'03-hiphop.md',D:'04-rnb-soul-funk.md',
  E:'05-electronic.md',F:'06-jazz.md',G:'07-roots.md',H:'08-latin.md',I:'09-caribbean.md',
  J:'10-african.md',K:'11-regional.md' };
const CHART_LABEL = { hot100:'Hot 100', bb200:'BB200' };

/* ── 1. 차트 항목 수집 ─────────────────────────────── */
const rows = [];
for (const chart of ['hot100','bb200']) {
  for (const f of fs.readdirSync(P('billboard/'+chart)).filter(f => f.endsWith('.md'))) {
    let year = null;
    for (const line of fs.readFileSync(P(`billboard/${chart}/${f}`),'utf8').split(/\r?\n/)) {
      const h = line.match(/^##\s+(\d{4})/); if (h) { year = h[1]; continue; }
      const m = line.match(/^\d+\.\s+(.*?)\s{2,}`([A-K])\s·\s([^`]+?)(\?)?`\s*$/);
      if (!m) continue;
      const work = m[1].replace(/\s*\*\([^)]*\)\*/g,'').trim();
      const [title, artist] = work.split(/\s+—\s+/);
      rows.push({ chart, year:+year, title:title.trim(), artist:(artist||'').trim(),
                  code:m[2], genre:m[3].trim(), unsure:!!m[4] });
    }
  }
}
/* 재등정·연말 재등정으로 같은 작품이 여러 해에 걸린 것은 첫 해만 남긴다 */
const seen = new Set(); const uniq = [];
for (const r of rows.sort((a,b)=>a.year-b.year)) {
  const k = `${r.chart}|${r.title}|${r.artist}`;
  if (seen.has(k)) continue; seen.add(k); uniq.push(r);
}

/* ── 2. 문서 절 구조 파악 + 장르가 적힌 절 찾기 ────────── */
const files = {};
for (const f of new Set(Object.values(CODE_FILE))) {
  const src = fs.readFileSync(P('genres/'+f),'utf8');
  const lines = src.split(/\r?\n/);
  const secs = [];
  lines.forEach((L,i) => { if (/^##\s+/.test(L)) secs.push({ title:L.replace(/^##\s+(?:\d+\.\s*)?/,'').trim(), head:i }); });
  secs.forEach((s,i) => { s.end = i+1 < secs.length ? secs[i+1].head : lines.length; });
  /* 절마다 표 첫 칸에 등장하는 이름 모으기 */
  for (const s of secs) {
    s.names = new Set();
    for (let i = s.head; i < s.end; i++) {
      const c = lines[i].match(/^\|\s*([^|]+?)\s*\|/);
      if (!c) continue;
      const t = c[1].replace(/\*\*/g,'').replace(/^·\s*/,'').replace(/^\(|\)$/g,'').trim();
      if (t && t !== '장르' && !/^-+$/.test(t)) s.names.add(t);
    }
  }
  files[f] = { src, lines, secs };
}

function findSection(file, g, rawName) {
  const cands = g ? [g.name, ...(g.aliases||[])] : [rawName];
  const secs = files[file].secs;
  for (const s of secs) for (const c of cands) if (s.names.has(c)) return s;
  /* 표에 정확히 없으면 하위분기 이름의 절 */
  if (g && g.subgroup) { const s = secs.find(s => s.title === g.subgroup); if (s) return s; }
  return null;
}

/* ── 3. 배치 ──────────────────────────────────────── */
const plan = {};        // file → sec.title → rows
const orphan = [];
const FAMILY_FILE = { rock:'01-rock.md', pop:'02-pop.md', 'hip-hop':'03-hiphop.md',
  'rnb-soul-funk':'04-rnb-soul-funk.md', electronic:'05-electronic.md', jazz:'06-jazz.md',
  roots:'07-roots.md', latin:'08-latin.md', caribbean:'09-caribbean.md', african:'10-african.md',
  internet:'11-regional.md' };
for (const r of uniq) {
  const g = byName.get(r.genre);
  /* 계열 코드가 가리키는 파일이 우선. 그 파일 표에 그 장르가 없으면
     (교차 장르라 본적이 다른 경우) 장르의 본적 파일로 보낸다. */
  let file = CODE_FILE[r.code];
  let s = findSection(file, g, r.genre);
  if (!s && g && FAMILY_FILE[g.family] && FAMILY_FILE[g.family] !== file) {
    const alt = FAMILY_FILE[g.family];
    const s2 = findSection(alt, g, r.genre);
    if (s2) { file = alt; s = s2; }
  }
  if (!s) { orphan.push(r); continue; }
  ((plan[file] ??= {})[s.title] ??= []).push({ ...r, gname: g ? g.name : r.genre });
}

const esc = s => s.replace(/\|/g,'\\|');
function block(list) {
  const byGenre = {};
  for (const r of list) (byGenre[r.gname + (r.unsure?' ?':'')] ??= []).push(r);
  const names = Object.keys(byGenre).sort((a,b)=>byGenre[b].length-byGenre[a].length || a.localeCompare(b));
  const h = list.filter(r=>r.chart==='hot100').length, b = list.length - h;
  const out = [MARK_A, '', `**차트 1위 — 이 분기에서 나온 것** *(Hot 100 ${h}곡 · Billboard 200 ${b}장)*`, '',
    '> 출처는 [../billboard/](../billboard/) — **곡·앨범명은 위키백과 그대로이지만',
    '> 장르는 붙인 것**입니다. `?` 는 자료가 갈리는 것이고, 없다고 확정은 아닙니다.',
    '> 연도는 1위에 오른 해이며, 재등정은 첫 해만 남겼습니다.',
    '> **패턴의 근거로 쓰지 말고, 무엇을 들어 볼지 고르는 입구로만 쓰십시오.**',
    '> 이 표는 자동 생성입니다 — `tools/chart-to-genres.mjs`. 여기가 아니라 `billboard/` 를 고치십시오.',
    '',
    '| 장르 | 연도 | 곡 · 앨범 | 아티스트 | 차트 |', '|---|---|---|---|---|'];
  for (const n of names)
    for (const r of byGenre[n].sort((a,b)=>a.year-b.year))
      out.push(`| ${esc(n)} | ${r.year} | ${esc(r.title)} | ${esc(r.artist)} | ${CHART_LABEL[r.chart]} |`);
  out.push('', MARK_B);
  return out.join('\n');
}

let total = 0;
for (const [file, secMap] of Object.entries(plan)) {
  const F = files[file];
  let lines = [...F.lines];
  /* 기존 자동 블록 제거 */
  const a = lines.indexOf(MARK_A);
  if (a >= 0) {
    while (true) {
      let s = lines.indexOf(MARK_A); if (s < 0) break;
      const e = lines.indexOf(MARK_B, s);
      let n = e - s + 1;
      if (s > 0 && lines[s-1].trim() === '') { s--; n++; }   // 앞 빈 줄까지
      lines.splice(s, n);
    }
    /* 절 경계 재계산 */
    F.lines = lines;
  }
  /* 절 끝에서부터 뒤로 삽입 (앞 인덱스가 안 밀리게) */
  const secs = [];
  lines.forEach((L,i) => { if (/^##\s+/.test(L)) secs.push({ title:L.replace(/^##\s+(?:\d+\.\s*)?/,'').trim(), head:i }); });
  secs.forEach((s,i) => { s.end = i+1 < secs.length ? secs[i+1].head : lines.length; });
  for (let i = secs.length - 1; i >= 0; i--) {
    const list = secMap[secs[i].title]; if (!list) continue;
    /* 절 끝의 --- 구분선 앞에 넣는다 */
    let at = secs[i].end;
    while (at > secs[i].head && lines[at-1].trim() === '') at--;
    if (lines[at-1] && lines[at-1].trim() === '---') at--;
    while (at > secs[i].head && lines[at-1].trim() === '') at--;
    lines.splice(at, 0, '', block(list));
    total += list.length;
  }
  if (!DRY) fs.writeFileSync(P('genres/'+file), lines.join('\n'));
  console.log(`${file.padEnd(22)} ${Object.values(secMap).reduce((a,l)=>a+l.length,0)}건 · ${Object.keys(secMap).length}개 절`);
}
console.log(`\n배치 ${total}건 / 중복 제거 후 ${uniq.length}건 (원본 ${rows.length}건)`);
if (orphan.length) {
  console.log(`\n■ 붙일 자리를 못 찾은 것 ${orphan.length}건`);
  const by = {};
  for (const r of orphan) (by[`${CODE_FILE[r.code]} · ${r.genre}`] ??= []).push(r);
  for (const [k,l] of Object.entries(by).sort((a,b)=>b[1].length-a[1].length)) console.log(`   ${String(l.length).padStart(3)}× ${k}`);
}
console.log(DRY ? '\n(예행)' : '\n적용 완료');
