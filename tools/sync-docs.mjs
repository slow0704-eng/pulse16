/* 문서의 «사본 수치» 를 프리셋 코드에서 다시 찍어 낸다.
 *
 * `genres/*.md` 의 «PULSE·16 설정값» 표와 `patterns/*.md` 의 16칸 패턴 블록은
 * `src/data/presets/NN-*.js` 의 값을 손으로 옮겨 적은 사본입니다. 사람이 프리셋을
 * 고치고 문서를 잊으면 조용히 갈라집니다. 이 도구가 그 사본만 다시 씁니다.
 *
 * ⚠ **건드리는 것과 안 건드리는 것을 엄격히 가릅니다.**
 *   고친다  — 9칸 드럼 행 · 13칸 베이스 행 · 블록 머리의 BPM/swing · 16칸 트랙 줄
 *   안 고친다 — 절 제목, 블록 머리의 `←` 한 줄 설명, 머리말, 그 밖의 모든 산문과 표
 * 사람이 쓴 글은 기계가 만들 수 없습니다. 그래서 읽지도 않습니다.
 *
 * 이전에는 이 일을 계열마다 새로 쓴 일회용 스크립트가 했습니다(01-rock 전용으로
 * 프리셋 49종 검사·절 구성·주석이 통째로 박혀 있었습니다). 그래서 2026-09-19
 * 루츠 교정에서는 아예 안 돌았고 문서 11칸이 옛 값으로 남았습니다. 이제 계열을
 * 가리지 않고 이름으로 전역 조회합니다 — 계열 배치가 어긋난 행도 따라옵니다.
 *
 * 사용법
 *   node tools/sync-docs.mjs          전부 다시 쓴다
 *   node tools/sync-docs.mjs --dry    무엇이 바뀌는지만 보여 준다 (쓰지 않음)
 *
 * 검사는 짝이 되는 `tools/ci/check-docs-sync.mjs` 가 합니다.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import vm from 'node:vm';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');
const rd = p => readFileSync(join(ROOT, p), 'utf8');

const ctx = { RAW: {} };
vm.createContext(ctx);
for (const f of readdirSync(join(ROOT, 'src/data/presets')).filter(f => /^\d\d-.+\.js$/.test(f)).sort())
  vm.runInContext(rd('src/data/presets/' + f), ctx);
const RAW = ctx.RAW;

const EMPTY = /^-*$/;
const TRK = [['K', 'kick'], ['S', 'snare'], ['C', 'clap'], ['H', 'chat'],
             ['O', 'ohat'], ['T', 'tom'], ['P', 'perc'], ['B', 'bass']];
const norm = v => (!v || EMPTY.test(v)) ? '' : v;
const mdFiles = d => readdirSync(join(ROOT, d)).filter(f => f.endsWith('.md')).sort();

let changed = 0;
const log = [];

/* ── genres/*.md — 설정값 표의 행 ──────────────────────────────────────── */
for (const f of mdFiles('genres')) {
  const path = 'genres/' + f;
  const src = rd(path);
  const NL = src.includes('\r\n') ? '\r\n' : '\n';
  let n = 0;
  const out = src.split(/\r?\n/).map((line, i) => {
    if (!line.startsWith('| ')) return line;
    const cells = line.split('|').slice(1, -1).map(s => s.trim());
    if (cells.length !== 9 && cells.length !== 13) return line;
    const name = cells[0].replace(/^·/, '').replace(/\*\*/g, '').trim();
    const p = RAW[name];
    if (!p) return line;
    const k = p.kit, b = p.bcfg, t = p.tune || {};
    /* 이름 앞 `·` 는 «규칙 파생» 표시다 — 이름의 일부가 아니라 gen 에서 나온다 */
    const nm = (p.gen ? '·' : '') + name;
    const next = cells.length === 9
      ? `| ${nm} | ${p.bpm} | ${p.swing} | \`${k.kick}\` | \`${k.snare}\` | \`${k.clap}\` | \`${k.chat}\` | \`${k.tom}\` | ${t.kick}/${t.snare}/${t.tom}/${t.hat} |`
      : `| ${nm} | \`${k.bass}\` | ${b.oct} | ${b.gate} | ${b.glide} | ${b.blend} | ${b.drive} | ${b.xover} | ${b.tone} | ${b.sub} | ${b.exc} | ${b.duck} | ${b.scale} |`;
    if (next !== line) { n++; log.push(`  ${path}:${i + 1} ${name}`); }
    return next;
  }).join(NL);
  if (n) { changed += n; if (!DRY) writeFileSync(join(ROOT, path), out, 'utf8'); console.log(`${path} — ${n}행`); }
}

/* ── patterns/*.md — 블록 머리와 16칸 트랙 줄 ───────────────────────────── */
/* 구분자를 `\s{2,}` 로 잡으면 이름이 22자인 블록(`Melodic House & Techno`)은
   공백이 하나뿐이라 안 보인다 — 그런 블록은 영영 수리되지 않는다. */
const HEAD = /^(\s)(\S.*?)(\s+)(\d+)(\s*BPM\s+swing\s+)(-?\d+)(\s*)(←.*)?$/;
const ROW  = /^\s{2}([KSCHOTPB])\s(\S{16})\s*$/;

for (const f of mdFiles('patterns')) {
  const path = 'patterns/' + f;
  const src = rd(path);
  const NL = src.includes('\r\n') ? '\r\n' : '\n';
  const lines = src.split(/\r?\n/);
  const out = [];
  let fence = false, n = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^```/.test(line)) { fence = !fence; out.push(line); continue; }
    if (!fence) { out.push(line); continue; }
    const h = HEAD.exec(line);
    if (!h) { out.push(line); continue; }
    const name = h[2].trim();
    const p = RAW[name];
    if (!p) { out.push(line); continue; }

    /* 머리 — 수치만 갈아 끼우고 `←` 설명과 간격은 그대로 둔다 */
    const head = `${h[1]}${h[2]}${h[3]}${String(p.bpm).padStart(h[4].length)}${h[5]}${String(p.swing).padStart(h[6].length)}${h[7] || ''}${h[8] || ''}`;
    if (head !== line) { n++; log.push(`  ${path}:${i + 1} ${name} (머리)`); }
    out.push(head);

    /* 트랙 줄 — 연속한 기존 줄을 걷어내고 코드에서 다시 찍는다.
       비어 있는 트랙은 줄을 아예 적지 않는 것이 이 문서의 규칙이다. */
    const had = [];
    let j = i + 1;
    while (j < lines.length && ROW.test(lines[j])) { had.push(lines[j]); j++; }
    const want = TRK.filter(([, key]) => norm(p[key])).map(([lab, key]) => `  ${lab} ${p[key]}`);
    if (had.join('') !== want.join('')) { n++; log.push(`  ${path}:${i + 1} ${name} (트랙 ${had.length}→${want.length}줄)`); }
    out.push(...want);
    i = j - 1;
  }
  if (n) { changed += n; if (!DRY) writeFileSync(join(ROOT, path), out.join(NL), 'utf8'); console.log(`${path} — ${n}곳`); }
}

console.log(`\n${DRY ? '바뀔 곳' : '다시 쓴 곳'} ${changed}군데`);
if (changed) console.log(log.join('\n'));
if (DRY) console.log('\n--dry 라 파일은 그대로입니다.');
else console.log('\n확인: node tools/ci/check-docs-sync.mjs');
