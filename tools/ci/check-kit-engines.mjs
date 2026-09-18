/* tools/ci/check-kit-engines.mjs — 프리셋의 kit 칸이 **실재하는 엔진**을 가리키는가.

   왜 필요한가.
   `voice-keys.js` 는 `KENG[name] || KENG.pad` 로 떨어진다. 기타·베이스·드럼도
   같은 모양이다. 그래서 엔진 이름을 잘못 적어도 **예외가 안 나고 소리도 난다** —
   다만 그 장르의 소리가 아니라 기본값이 난다. 콘솔에도 아무것도 안 남는다.

   2026-09-18 에 실제로 열 건이 이 상태였다. `keys2:'growl'` 여섯 건은 growl 이
   **베이스 엔진**이라 건반에서는 Analog Pad 로 떨어졌고, `keys2:'dulcimer'` ·
   `'harp'` · `'nylon'` 은 **기타 엔진**이었다. Chillout 은 프로파일이 그 트랙을
   이 프리셋의 **리드**로 적어 뒀는데(`lead: "keys2"`) 리드가 기본 패드로 울렸다.

   이 검사는 이름이 그 트랙의 엔진 표에 실재하는지만 본다. «그 장르에 맞는
   엔진인가» 는 여기서 못 본다 — 그쪽은 genres/profiles 의 roles 와 대조하는
   일이고 사람이 판단한다.

   외부 의존성 없음. 정적 단계에서 돈다.

   사용법:  node tools/ci/check-kit-engines.mjs
   종료코드: 0 통과 / 1 실패                                                  */

import fs from 'node:fs';
import { ROOT, read, OK, NG, WARN, head } from './_lib.mjs';

const strip = s => s.replace(/'use strict';/g, '');

let src = '';
for (const f of ['src/core/config.js', 'src/core/scale.js', 'src/data/preset-index.js',
                 'src/data/pattern-codec.js', 'src/data/presets/_raw.js',
                 ...fs.readdirSync(ROOT + '/src/data/presets').filter(x => /^\d\d-/.test(x)).sort()
                    .map(x => 'src/data/presets/' + x),
                 /* melody.js 는 harmony.js 의 compPoolFor() 가 melodyPoolFor() 를
                    보기 때문에 필요하다 — 안 실으면 «건반 없음» 판정이 통째로
                    빠져 검사만 다른 답을 낸다(실제로 한 번 그랬다). */
                 'src/data/presets/_build.js', 'src/data/melody.js', 'src/data/harmony.js'])
  src += '\n' + strip(read(f));

const P = new Function('window', 'console', src +
  '\n; return {RAW, LIB_NAMES, ENGINES, PRESET_SUB, PRESET_CAT, LIB, COMP, compPoolFor};')(
  { Tone: undefined }, { warn() {}, log() {} });

/* kit 칸 → 엔진 표. 2번 레이어는 1번과 같은 표를 쓴다. */
const SLOT_FAMILY = {
  kick: 'kick', snare: 'snare', clap: 'clap', chat: 'chat', ohat: 'ohat',
  tom: 'tom', perc: 'perc', bass: 'bass',
  keys: 'keys', keys2: 'keys', gtr: 'gtr', gtr2: 'gtr',
};

let fail = 0, warn = 0;
const bad = m => { console.log(`${NG} ${m}`); fail++; };
const soft = m => { console.log(`${WARN} ${m}`); warn++; };

head('kit 칸이 실재하는 엔진을 가리키는가');
{
  const missingFamily = [];
  const wrong = [];
  for (const n of P.LIB_NAMES) {
    const kit = P.RAW[n]?.kit;
    if (!kit) continue;
    for (const [slot, fam] of Object.entries(SLOT_FAMILY)) {
      const v = kit[slot];
      if (!v) continue;                       /* 빈 칸은 _build.js 가 따로 본다 */
      const table = P.ENGINES[fam];
      if (!table) { missingFamily.push(fam); continue; }
      if (table[v]) continue;
      /* 어느 표에 있는 이름인지 찾아 준다 — 고칠 때 바로 보이도록 */
      const where = Object.entries(P.ENGINES)
        .filter(([, t]) => t[v]).map(([k]) => k).join('·') || '어디에도 없음';
      wrong.push({ n, slot, v, fam, where });
    }
  }
  if (missingFamily.length)
    bad(`ENGINES 에 없는 엔진 표 — ${[...new Set(missingFamily)].join(' ')}`);

  for (const w of wrong)
    bad(`${w.n} — kit.${w.slot} = '${w.v}' 는 ${w.fam} 엔진이 아니다 (${w.where} 의 이름이다). `
      + `기본값으로 조용히 떨어진다`);

  if (!wrong.length)
    console.log(`${OK} 프리셋 ${P.LIB_NAMES.length}종 · kit 칸 ${Object.keys(SLOT_FAMILY).length}개 전부 실재하는 엔진`);
}

/* ── 참고 — 슬롯마다 몇 종이 실제로 쓰이는가 ──
   실패시키지 않는다. «쏠려 있다» 는 것은 결함이 아니라 조사 결과일 수 있다. */
head('슬롯마다 엔진이 몇 종 쓰이는가 (보고만)');
for (const [slot, fam] of Object.entries(SLOT_FAMILY)) {
  const table = P.ENGINES[fam];
  if (!table) continue;
  const used = new Map();
  for (const n of P.LIB_NAMES) {
    const v = P.RAW[n]?.kit?.[slot];
    if (v) used.set(v, (used.get(v) || 0) + 1);
  }
  const all = Object.keys(table).length;
  const top = [...used.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
    .map(([k, c]) => `${k} ${c}`).join(' · ');
  console.log(`   ${slot.padEnd(6)} ${String(used.size).padStart(2)}종 / ${String(all).padStart(2)}종 등록`
    + `  — 가장 많은 것: ${top}`);
}

/* ── 건반 컴핑이 두 표에서 같은 것을 가리키는가 (보고만) ──
   이 저장소에는 건반 컴핑 리듬을 적은 표가 둘이다(patterns/00-harmony.md §5-3).
     · 아키타입 39종 — patterns/00-harmony.md §2. 프리셋 패턴으로 **구워져 있다**
     · COMP 20종  — src/data/harmony.js. 「화성 진행」이 켜졌을 때 **런타임**에 돈다
   둘이 어긋나면 버튼 하나로 건반 주법이 장르 밖으로 나간다. 실패시키지 않는다 —
   어느 쪽이 맞는지는 자리마다 조사가 필요하고, 지금은 그 목록을 보이게만 한다. */
head('건반 컴핑 — 프리셋 패턴과 COMP 가 같은 것을 가리키는가 (보고만)');
{
  const catFor = n => (P.LIB[n] && P.LIB[n].cat) || P.PRESET_CAT[n] || 'K';
  const rhythm = s => (s ? s.split('').map(c => (c === '-' ? '-' : 'x')).join('') : null);
  const bySub = new Map();
  for (const n of P.LIB_NAMES) {
    const k = catFor(n) + ':' + (P.PRESET_SUB[n] || '');
    if (!bySub.has(k)) bySub.set(k, []);
    bySub.get(k).push(n);
  }
  /* 프리셋마다 잰다 — 분기 대표 하나로 보면 그 분기 안의 차이를 놓친다
     (compPoolFor 는 프리셋 단위로도 갈릴 수 있다) */
  let ok = 0, bad = 0;
  const bySubBad = new Map();
  for (const [k, ns] of bySub) {
    for (const n of ns) {
      const top = rhythm(P.RAW[n]?.keys);
      if (top === null) continue;
      const pool = P.compPoolFor(n) || [];
      const rows = pool.flatMap(nm => (P.COMP[nm]?.rows || []).map(rhythm));
      /* 둘 다 «건반 없음» 이면 그것도 일치다 — 패턴이 비었고 컴핑 풀도 비었다 */
      const agree = (!pool.length && !/x/.test(top)) || rows.includes(top);
      if (agree) { ok++; continue; }
      bad++;
      if (!bySubBad.has(k)) bySubBad.set(k, { n: 0, top, pool: pool.join('/'), rows: [...new Set(rows)] });
      bySubBad.get(k).n++;
    }
  }
  console.log(`${OK} 프리셋 ${ok}종이 두 표에서 같은 리듬을 가리킨다 · ${bad}종이 어긋난다`
    + ` (분기 ${bySubBad.size}개)`);
  if (bySubBad.size) {
    const big = [...bySubBad.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 6);
    for (const [k, o] of big)
      console.log(`   ${WARN} ${k.padEnd(26)} ${String(o.n).padStart(2)}종 · 패턴 ${o.top}`
        + ` · COMP(${o.pool || '빔'}) ${o.rows.join(' ')}`);
    if (bySubBad.size > big.length) console.log(`   … 그 밖 분기 ${bySubBad.size - big.length}개`);
    console.log('   근거와 남은 목록은 patterns/00-harmony.md §5-3 · §5-8');
  }
}

console.log('');
if (fail) { console.log(`${NG} kit 엔진 검사 실패 ${fail}건`); process.exit(1); }
console.log(`${OK} kit 엔진 검사 통과${warn ? ` · ${WARN} 경고 ${warn}건` : ''}`);
