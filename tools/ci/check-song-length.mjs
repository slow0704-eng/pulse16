/* tools/ci/check-song-length.mjs — «한 곡은 64마디» 라는 불변식을 지킨다.

   왜 필요한가.
   이 앱에서 «곡» 은 세 층이 겹쳐 만들어진다.
     ① 선율·리프·베이스 라이브러리 (melody.js) — 한 줄이 16·32·64마디
     ② 곡 구조 (arrange.js SONG_FORM) — 인트로·벌스·코러스…의 마디 배분
     ③ 필인·셔플 주기 (sequencer.js) — 16마디 격자
   세 층의 길이가 서로 약수·배수가 아니면 **섹션이 선율의 엉뚱한 자리에
   얹힌다.** 48마디 폼과 64마디 선율은 최소공배수가 192라, 그 사이에는
   코러스가 선율의 브릿지 위에 오고 브레이크가 재현부를 덮는다. 소리는
   나므로 스모크도 회귀도 못 잡고, 콘솔에도 아무것도 안 남는다 —
   «곡 같지 않다» 만 남는다. 기계가 대신 봐야 하는 자리다.

   외부 의존성 없음. 정적 단계에서 돈다.

   검사
     A  SONG_FORM 전부가 정확히 SONG_FORM_BARS(64)마디인가
     B  섹션 길이가 4·8·16마디뿐인가 (그래야 16마디 격자와 맞는다)
     C  SECTION_RULE 이 실제로 있는 트랙 id 만 가리키는가
     D  선율·리프·베이스 재료마다 64마디판이 있는가
     E  길이 64 를 골랐을 때 프리셋 357종이 전부 64마디를 받는가            */

import fs from 'node:fs';
import { ROOT, OK, NG, WARN, head } from './_lib.mjs';

const read = p => fs.readFileSync(ROOT + '/' + p, 'utf8');
const strip = s => s.replace(/'use strict';/g, '');

let fail = 0, warn = 0;
const bad = m => { console.log(`${NG} ${m}`); fail++; };
const soft = m => { console.log(`${WARN} ${m}`); warn++; };

/* ── 곡 구조 ─────────────────────────────────────────────── */
const arrangeSrc = strip(read('src/seq/arrange.js'));
const A = new Function(arrangeSrc +
  '\n; return {SONG_FORM, SONG_FORM_BARS, SECTION_RULE, SECTION_KINDS, SONG_FORM_POOL_CAT};')();

head(`A·B — 곡 구조가 전부 ${A.SONG_FORM_BARS}마디인가`);
const SEC_OK = [4, 8, 16];
for (const [name, f] of Object.entries(A.SONG_FORM)) {
  const total = f.secs.reduce((s, x) => s + x.bars, 0);
  const odd = f.secs.filter(x => !SEC_OK.includes(x.bars));
  const kinds = f.secs.filter(x => !A.SECTION_KINDS.includes(x.k));
  if (total !== A.SONG_FORM_BARS)
    bad(`${name} 이 ${total}마디다 — ${A.SONG_FORM_BARS}마디여야 선율 한 바퀴와 자리가 맞는다`);
  if (odd.length)
    bad(`${name} 에 ${SEC_OK.join('·')}마디가 아닌 섹션 — ${odd.map(x => `${x.k} ${x.bars}`).join(', ')}`);
  if (kinds.length)
    bad(`${name} 에 모르는 섹션 종류 — ${kinds.map(x => x.k).join(', ')}`);
  if (total === A.SONG_FORM_BARS && !odd.length && !kinds.length)
    console.log(`${OK} ${name.padEnd(12)} ${total}마디 · 섹션 ${f.secs.length}개`);
}
const poolNames = new Set(Object.values(A.SONG_FORM_POOL_CAT).flat());
for (const n of poolNames)
  if (!A.SONG_FORM[n]) bad(`SONG_FORM_POOL_CAT 이 없는 폼을 가리킨다 — ${n}`);

head('C — 섹션 규칙이 실제 트랙만 가리키는가');
{
  const cfg = strip(read('src/core/config.js'));
  const { TRACK_IDS } = new Function('window', cfg + '\n; return {TRACK_IDS};')({ Tone: undefined });
  const ALL = [...TRACK_IDS, 'bass', 'keys', 'gtr', 'keys2', 'gtr2'];
  let n = 0;
  for (const [k, r] of Object.entries(A.SECTION_RULE)) {
    for (const id of r.off || []) if (!ALL.includes(id)) bad(`SECTION_RULE.${k}.off 에 없는 트랙 — ${id}`);
    for (const id of Object.keys(r.lvl || {})) if (!ALL.includes(id)) bad(`SECTION_RULE.${k}.lvl 에 없는 트랙 — ${id}`);
    n += (r.off || []).length;
  }
  for (const k of A.SECTION_KINDS) if (!A.SECTION_RULE[k]) bad(`SECTION_RULE 에 ${k} 규칙이 없다`);
  console.log(`${OK} 섹션 ${Object.keys(A.SECTION_RULE).length}종 · 트랙 12개 기준 off 지정 ${n}건`);
  /* 섹션마다 울리는 트랙 수 — 밀도 곡선이 살아 있는지 눈으로 본다 */
  const line = A.SECTION_KINDS
    .map(k => `${k} ${ALL.length - (A.SECTION_RULE[k].off || []).length}`).join(' · ');
  console.log(`   동시에 울리는 트랙 수 — ${line}`);
  const chorus = ALL.length - A.SECTION_RULE.chorus.off.length;
  const verse = ALL.length - A.SECTION_RULE.verse.off.length;
  if (chorus <= verse) bad(`코러스(${chorus})가 벌스(${verse})보다 안 두껍다 — 쌓였다 터지는 형태가 안 된다`);
}

/* ── 선율 라이브러리 ─────────────────────────────────────── */
head('D — 선율·리프·베이스 재료마다 64마디판이 있는가');
let M;
{
  let src = '';
  for (const f of ['src/core/config.js', 'src/core/scale.js', 'src/data/pattern-codec.js', 'src/data/melody.js'])
    src += '\n' + strip(read(f));
  M = new Function('window', src + `
    ; return {MELODY,RIFF,BLINE,MEL_SRC,RIFF_PHRASE,BLINE_SRC,LONG_64,LONG_64H,
              melodyPoolFor,riffPoolFor,blinePoolFor,melodyLenPool,riffLenPool,blineLenPool};`
  )({ Tone: undefined });

  const melBases = M.MEL_SRC.map(([a]) => a.replace(/A$/, ''));
  const missMel = melBases.filter(b => !M.MELODY[b + '_l64']);
  if (missMel.length) bad(`64마디판이 없는 선율 재료 ${missMel.length}종 — ${missMel.join(' ')}`);
  else console.log(`${OK} 선율 재료 ${melBases.length}종 전부 64마디판 있음` +
                   ` (전개형 ${M.LONG_64.length} · 훅형 ${M.LONG_64H.length})`);

  const riffBases = [...new Set(Object.values(M.RIFF).filter(r => r.src).map(r => r.src[0].replace(/A$/, '')))];
  const missRiff = riffBases.filter(b => !M.RIFF[b + '_l64']);
  if (missRiff.length) bad(`64마디판이 없는 리프 재료 — ${missRiff.join(' ')}`);
  else console.log(`${OK} 리프 재료 ${riffBases.length}쌍 전부 64마디판 있음`);

  const basBases = M.BLINE_SRC.map(([a]) => a.replace(/A$/, ''));
  const missBas = basBases.filter(b => !M.BLINE[b + '_l64']);
  if (missBas.length) bad(`64마디판이 없는 베이스 재료 — ${missBas.join(' ')}`);
  else console.log(`${OK} 베이스 재료 ${basBases.length}쌍 전부 64마디판 있음`);

  /* 길이가 이름과 맞는가 — _l64 인데 64마디가 아니면 길이 선택이 헛돈다 */
  for (const [lib, tab] of [['MELODY', M.MELODY], ['RIFF', M.RIFF], ['BLINE', M.BLINE]])
    for (const [k, v] of Object.entries(tab)) {
      const m = k.match(/_l(\d+)b?$/);
      if (m && v.rows.length !== +m[1]) bad(`${lib}.${k} 이 ${v.rows.length}마디다 — 이름은 ${m[1]}`);
    }
}

/* ── 프리셋별 실제 선택 ──────────────────────────────────── */
head('E — 길이 64 를 골랐을 때 프리셋이 전부 64마디를 받는가');
{
  let src = '';
  for (const f of ['src/core/config.js', 'src/core/scale.js', 'src/data/preset-index.js',
                   'src/data/pattern-codec.js', 'src/data/presets/_raw.js',
                   ...fs.readdirSync(ROOT + '/src/data/presets').filter(x => /^\d\d-/.test(x)).sort()
                      .map(x => 'src/data/presets/' + x),
                   'src/data/presets/_build.js', 'src/data/melody.js'])
    src += '\n' + strip(read(f));
  const P = new Function('window', 'console', src + '\n; return {LIB_NAMES,' +
    'MELODY,RIFF,BLINE,melodyPoolFor,riffPoolFor,blinePoolFor,melodyLenPool,riffLenPool,blineLenPool};'
  )({ Tone: undefined }, { warn() {}, log() {} });

  const short = { mel: [], rif: [], bas: [] };
  let noKeys = 0;
  for (const n of P.LIB_NAMES) {
    for (const [tag, tab, poolFn, lenFn] of [
      ['mel', P.MELODY, P.melodyPoolFor, P.melodyLenPool],
      ['rif', P.RIFF, P.riffPoolFor, P.riffLenPool],
      ['bas', P.BLINE, P.blinePoolFor, P.blineLenPool]]) {
      const pool = lenFn(poolFn(n) || [], '64');
      if (!pool.length) { if (tag === 'mel') noKeys++; continue; }
      if (pool.some(x => !tab[x] || tab[x].rows.length !== 64)) short[tag].push(n);
    }
  }
  for (const [tag, label] of [['mel', '선율'], ['rif', '리프'], ['bas', '베이스']]) {
    if (short[tag].length)
      bad(`${label} — 64마디가 아닌 것이 섞인 프리셋 ${short[tag].length}종: ${short[tag].slice(0, 6).join(' ')}…`);
    else console.log(`${OK} ${label} — 프리셋 ${P.LIB_NAMES.length}종 전부 64마디만 담긴다`);
  }
  if (noKeys) console.log(`   (선율 풀이 비는 ${noKeys}종은 건반을 안 쓰는 장르다 — 메탈·펑크)`);
}

console.log();
if (fail) { console.log(`${NG} 곡 길이 검사 실패 — ${fail}건`); process.exit(1); }
console.log(`${OK} 곡 길이 검사 통과${warn ? ` · ${WARN} 경고 ${warn}건` : ''}`);
