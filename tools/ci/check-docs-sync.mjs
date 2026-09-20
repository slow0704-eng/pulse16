/* 문서가 프리셋 코드와 같은 말을 하는가.
 *
 * 이 저장소에서 프리셋의 정본은 `src/data/presets/NN-*.js` 입니다. 그런데
 * `genres/*.md` 의 «PULSE·16 설정값» 표와 `patterns/*.md` 의 16칸 패턴 블록이
 * 같은 수치를 **손으로 옮겨 적은 사본**으로 들고 있습니다. 사람이 프리셋을
 * 고치고 문서를 잊으면 둘이 조용히 갈라집니다 — 2026-09-19 의 루츠 교정이
 * 실제로 그랬습니다(프리셋 16칸을 고쳤는데 설정값 표와 패턴 블록은 옛 값이었고,
 * 커밋 메시지가 「근거 없다」고 지운 서술이 같은 커밋의 문서에 남아 있었습니다).
 *
 * 이 검사는 **코드에서 파생되는 값만** 봅니다 — BPM · swing · 16칸 패턴 ·
 * 킷 엔진 · 튠 · bcfg 수치. 절 구성이나 `←` 한 줄 설명 같은 **사람이 쓴 산문은
 * 건드리지도 읽지도 않습니다.** 그래서 문서를 사람 좋을 대로 고쳐도 이 검사는
 * 통과하고, 수치가 갈라질 때만 실패합니다.
 *
 * 비교 기준은 `_build.js` 가 손대기 전의 **RAW** 입니다. 문서의 표가 원래
 * RAW 에서 뽑혔기 때문입니다(베이스 표의 «엔진» 칸은 `bcfg.eng` 가 아니라
 * `kit.bass` 입니다 — `_build.js` 가 뒤에서 전자를 후자로 덮습니다).
 *
 * 사용법: node tools/ci/check-docs-sync.mjs
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import vm from 'node:vm';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const rd = p => readFileSync(join(ROOT, p), 'utf8');

/* ── 프리셋 전수를 한 자리에 모은다 ─────────────────────────────────────────
   계열 배치가 어긋난 행이 있습니다 — 예를 들어 genres/11-regional.md 가
   src/data/presets/02-pop.js 의 프리셋을 적습니다. 그래서 파일별로 짝지어
   찾지 않고 **이름으로 전역 조회**합니다. */
const ctx = { RAW: {} };
vm.createContext(ctx);
const presetFiles = readdirSync(join(ROOT, 'src/data/presets'))
  .filter(f => /^\d\d-.+\.js$/.test(f)).sort();
for (const f of presetFiles) vm.runInContext(rd('src/data/presets/' + f), ctx);
const RAW = ctx.RAW;

/* ── 도움 ──────────────────────────────────────────────────────────────── */
const EMPTY = /^-*$/;
const TRK = [['K', 'kick'], ['S', 'snare'], ['C', 'clap'], ['H', 'chat'],
             ['O', 'ohat'], ['T', 'tom'], ['P', 'perc'], ['B', 'bass']];
/* 문서는 비어 있는 트랙 줄을 아예 적지 않습니다 — 「없음」과 「전부 쉼표」는 같은 뜻 */
const norm = v => (!v || EMPTY.test(v)) ? '' : v;
const tick = s => String(s).replace(/`/g, '').trim();
const mdFiles = d => readdirSync(join(ROOT, d)).filter(f => f.endsWith('.md')).sort();

const problems = [];
const add = (file, line, name, what, doc, code) =>
  problems.push({ file, line, name, what, doc: String(doc), code: String(code) });

/* ── 1. genres/*.md 의 설정값 표 ────────────────────────────────────────────
   9칸 = 드럼(장르 BPM Swing Kick Snare Clap Hat Tom 튠)
   13칸 = 베이스(장르 엔진 Oct Length Glide Blend Drive X-Over Tone Sub Exc Duck Scale)
   다른 표는 칸 수가 달라 저절로 걸러집니다(장르 개요 5~6칸 · 레퍼런스 4칸 · 대표곡 8칸). */
let drumRows = 0, bassRows = 0;
for (const f of mdFiles('genres')) {
  const lines = rd('genres/' + f).split(/\r?\n/);
  lines.forEach((line, i) => {
    if (!line.startsWith('| ')) return;
    const cells = line.split('|').slice(1, -1).map(s => s.trim());
    if (cells.length !== 9 && cells.length !== 13) return;
    const name = cells[0].replace(/^·/, '').replace(/\*\*/g, '').trim();
    const p = RAW[name];
    if (!p) return;                       /* 프리셋이 아닌 행은 이 검사의 대상이 아니다 */
    const at = `genres/${f}`, ln = i + 1;
    if (cells.length === 9) {
      drumRows++;
      const [, bpm, swing, kick, snare, clap, chat, tom, tune] = cells;
      const k = p.kit, t = p.tune || {};
      if (+bpm !== p.bpm)            add(at, ln, name, 'BPM', bpm, p.bpm);
      if (+swing !== p.swing)        add(at, ln, name, 'swing', swing, p.swing);
      if (tick(kick)  !== k.kick)    add(at, ln, name, 'kick 엔진', tick(kick), k.kick);
      if (tick(snare) !== k.snare)   add(at, ln, name, 'snare 엔진', tick(snare), k.snare);
      if (tick(clap)  !== k.clap)    add(at, ln, name, 'clap 엔진', tick(clap), k.clap);
      if (tick(chat)  !== k.chat)    add(at, ln, name, 'hat 엔진', tick(chat), k.chat);
      if (tick(tom)   !== k.tom)     add(at, ln, name, 'tom 엔진', tick(tom), k.tom);
      const want = `${t.kick}/${t.snare}/${t.tom}/${t.hat}`;
      if (tune.replace(/\s/g, '') !== want) add(at, ln, name, '튠', tune, want);
    } else {
      bassRows++;
      const [, eng, oct, gate, glide, blend, drive, xover, tone, sub, exc, duck, scale] = cells;
      const b = p.bcfg, k = p.kit;
      if (tick(eng) !== k.bass)      add(at, ln, name, '베이스 엔진', tick(eng), k.bass);
      const pairs = [['Oct', oct, b.oct], ['Length', gate, b.gate], ['Glide', glide, b.glide],
                     ['Blend', blend, b.blend], ['Drive', drive, b.drive], ['X-Over', xover, b.xover],
                     ['Tone', tone, b.tone], ['Sub', sub, b.sub], ['Exc', exc, b.exc], ['Duck', duck, b.duck]];
      for (const [label, d, c] of pairs) if (+d !== c) add(at, ln, name, label, d, c);
      if (scale !== b.scale)         add(at, ln, name, 'Scale', scale, b.scale);
    }
  });
}

/* ── 2. patterns/*.md 의 16칸 패턴 블록 ─────────────────────────────────── */
let blocks = 0;
/* 이름과 BPM 사이는 공백 «둘 이상» 이 아니다. 이름을 22칸으로 맞춰 적기 때문에
   `Melodic House & Techno` 처럼 22자인 이름은 공백이 **하나**만 남는다. `\s{2,}` 로
   잡으면 그 블록이 통째로 안 보이고, 더 나쁘게는 앞 블록이 닫히지 않아 뒤 블록의
   트랙 줄이 앞 프리셋의 것으로 기록된다(실제로 Future House 가 그렇게 보고됐다). */
const HEAD = /^\s(\S.*?)\s+(\d+)\s*BPM\s+swing\s+(-?\d+)/;
for (const f of mdFiles('patterns')) {
  const lines = rd('patterns/' + f).split(/\r?\n/);
  let fence = false, cur = null, curLn = 0, seen = null;
  const flush = () => {
    if (!cur) return;
    const p = RAW[cur];
    for (const [lab, key] of TRK) {
      /* 문서가 `----------------` 를 적은 것과 코드가 값을 안 가진 것은 같은 뜻이다.
         양쪽을 같은 자로 재지 않으면 멀쩡한 줄을 어긋났다고 보고한다. */
      const docv = norm(seen[lab]);
      const codev = norm(p[key]);
      if (docv !== codev)
        add(`patterns/${f}`, curLn, cur, `${lab} 패턴`, docv || '(줄 없음)', codev || '(비어 있음)');
    }
    cur = null;
  };
  lines.forEach((line, i) => {
    if (/^```/.test(line)) { flush(); fence = !fence; return; }
    if (!fence) return;
    /* 블록 사이는 빈 줄이다. 여기서 닫아 두면 머리 줄을 못 알아본 경우에도
       다음 블록의 트랙이 앞 프리셋에 붙지 않는다 — 귀속 오류는 조용해서 나쁘다. */
    if (!line.trim()) { flush(); return; }
    const h = HEAD.exec(line);
    if (h) {
      flush();
      const name = h[1].trim();
      if (!RAW[name]) { cur = null; return; }
      blocks++;
      cur = name; curLn = i + 1; seen = {};
      const p = RAW[name];
      if (+h[2] !== p.bpm)   add(`patterns/${f}`, i + 1, name, 'BPM', h[2], p.bpm);
      if (+h[3] !== p.swing) add(`patterns/${f}`, i + 1, name, 'swing', h[3], p.swing);

      /* `←` 뒤의 한 줄 설명은 사람이 쓴 글이라 `sync-docs` 가 건드리지 않습니다.
         그런데 그 글 안에 파생 수치가 박혀 있으면(「셔플 18」·「스윙 30」·「100 BPM」)
         값이 바뀔 때 혼자 남아 **한 줄이 자기 자신과 모순**됩니다. 실제로 그랬습니다 —
         Electric Blues 는 swing 을 50 으로 고친 뒤에도 설명이 「스윙 30」이었고,
         Trot 은 swing 0 인데 「셔플 18」이었습니다. 기계가 고칠 수 없는 자리라
         고치라고 지목하는 것까지가 이 검사의 몫입니다. */
      const cm = /←\s*(.*)$/.exec(line);
      if (cm) {
        let m;
        /* ⚠ 범위 표기를 수치 주장으로 오해하면 안 된다. 이 설명들은 흔히 장르의
           템포 폭을 적는다 — 「대표곡 5곡이 88~125 BPM」·「140~180 BPM」. 처음
           만들었을 때 이 걸러내기가 없어 열한 건을 낡았다고 잘못 지목했고,
           그대로 «고쳤으면» 근거 있는 서술을 지울 뻔했다. 범위의 한쪽 끝은
           프리셋 값과 달라야 정상이다. 그래서 앞뒤로 `~`·`-` 가 붙은 수는 뺀다. */
        const RANGE_L = '(?<![\\d~\\-])', RANGE_R = '(?!\\s*[~\\-]\\s*\\d)';
        if ((m = new RegExp(`(?:스윙|셔플)\\s*${RANGE_L}(\\d+)${RANGE_R}`).exec(cm[1])) && +m[1] !== p.swing)
          add(`patterns/${f}`, i + 1, name, '설명 속 스윙', m[1], p.swing);
        if ((m = new RegExp(`${RANGE_L}(\\d+)${RANGE_R}\\s*BPM`).exec(cm[1])) && +m[1] !== p.bpm)
          add(`patterns/${f}`, i + 1, name, '설명 속 BPM', m[1], p.bpm);
      }
      return;
    }
    const t = /^\s{2}([KSCHOTPB])\s([Xxo\-0-7a-h]{16})\s*$/.exec(line);
    if (t && cur) seen[t[1]] = t[2];
  });
  flush();
}

/* ── 보고 ──────────────────────────────────────────────────────────────── */
console.log('\n── 문서 ↔ 프리셋 코드 ' + '─'.repeat(50));
console.log(`프리셋 ${Object.keys(RAW).length}종 · 설정값 드럼 ${drumRows}행 · 베이스 ${bassRows}행 · 패턴 블록 ${blocks}개`);

if (!problems.length) {
  console.log('✅ 문서가 프리셋 코드와 같은 값을 말합니다');
  process.exit(0);
}

const byFile = new Map();
for (const p of problems) (byFile.get(p.file) || byFile.set(p.file, []).get(p.file)).push(p);
for (const [file, list] of [...byFile].sort()) {
  console.log(`\n  ${file} — ${list.length}건`);
  for (const p of list)
    console.log(`    ${String(p.line).padStart(5)}  ${p.name.padEnd(22)} ${p.what.padEnd(12)} 문서 ${p.doc.padEnd(18)} 코드 ${p.code}`);
}
console.log(`\n❌ 문서가 코드와 다른 자리 ${problems.length}건 (파일 ${byFile.size}개)`);
console.log('   프리셋 파일이 정본입니다 — 문서를 고치십시오. 반대가 아닙니다.');
process.exit(1);
