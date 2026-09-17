/* tools/ci/check-song-length.mjs — 곡 형식과 선율이 같은 격자에 있는가.

   왜 필요한가.
   이 앱에서 «곡» 은 세 층이 겹쳐 만들어진다.
     ① 선율·리프·베이스 라이브러리 (melody.js) — 한 줄이 16·32·64마디
     ② 곡 형식 (src/data/songform.js ← genres/forms/forms.json) — 섹션 배분
     ③ 필인·셔플 주기 (sequencer.js) — 16마디 격자
   세 층의 길이가 서로 약수·배수가 아니면 **섹션이 선율의 엉뚱한 자리에
   얹힌다.** 소리는 나므로 스모크도 회귀도 못 잡고 콘솔에도 아무것도 안 남는다 —
   «곡 같지 않다» 만 남는다. 기계가 대신 봐야 하는 자리다.

   ⚠ 2026-09-17 의 첫 판은 «모든 폼은 정확히 64마디» 를 검사했다. 그 불변식이
     틀렸다 — 12마디 블루스가 64를 안 나눈다. 형식이 음악의 사실이고 선율
     길이는 우리가 만든 눈금이므로, **폼이 선율 길이를 정한다**로 뒤집었다
     (genres/00-form.md §2). 지금 검사하는 것은 «전부 64인가» 가 아니라
     «폼의 총 마디를 나누는 선율 길이가 있는가» 다.

   외부 의존성 없음. 정적 단계에서 돈다.

   검사
     A  폼마다 total 을 나누는 선율 길이(64·32·16)가 있는가
     B  섹션 길이·종류가 성한가 · 폼 경계가 16격자 위에 있는가
     C  섹션 규칙이 실제 트랙만 가리키는가 · 형식별 규칙이 성한가
     D  배정표가 실재하는 계열·하위분기·폼만 가리키는가 (오타 잡기)
     E  선율·리프·베이스 재료마다 64마디판이 있는가
     F  프리셋 357종이 자기 폼의 melLen 으로 뽑았을 때 그 길이만 받는가
     G  형식의 대비가 **그 프리셋에서** 유효한가 (없는 트랙을 끄는 규칙 잡기)

   ⚠ 여기까지는 전부 **표의 성질**이다. 소리로 나오는지는 표로 알 수 없다 —
     마스터의 글루 컴프·리미터가 구간별 편차를 눌러 버린다.
     실측은 tools/measure-sections.mjs 가 한다(genres/00-form.md §5).        */

import fs from 'node:fs';
import { ROOT, OK, NG, WARN, head } from './_lib.mjs';

const read = p => fs.readFileSync(ROOT + '/' + p, 'utf8');
const strip = s => s.replace(/'use strict';/g, '');

let fail = 0, warn = 0;
const bad = m => { console.log(`${NG} ${m}`); fail++; };
const soft = m => { console.log(`${WARN} ${m}`); warn++; };

/* ── 곡 형식 ─────────────────────────────────────────────── */
const A = new Function(
  strip(read('src/data/songform.js')) + strip(read('src/seq/arrange.js')) +
  '\n; return {SONG_FORM, SONG_FORM_POOL_CAT, SONG_FORM_POOL_SUB, SONG_FORM_POOL_PRESET,'
  + ' SECTION_RULE, SECTION_KINDS};'
)();

const MEL_LENS = [64, 32, 16];

head('A·B — 폼의 총 마디를 나누는 선율 길이가 있는가');
for (const [name, f] of Object.entries(A.SONG_FORM)) {
  const total = f.secs.reduce((s, x) => s + x.bars, 0);
  if (total !== f.total)
    bad(`${name}.total 이 ${f.total} 인데 섹션 합은 ${total} 이다 — 생성물이 낡았다`);
  const fits = MEL_LENS.filter(L => total % L === 0);
  if (!fits.length)
    bad(`${name} 이 ${total}마디다 — 16·32·64 어느 것으로도 안 나누어져 선율을 못 얹는다`);
  else if (f.melLen !== fits[0])
    bad(`${name}.melLen 이 ${f.melLen} 인데 가장 긴 약수는 ${fits[0]} 이다`);

  /* 폼 경계는 16격자(필인·셔플 주기) 위에 있어야 한다 */
  if (total % 16 !== 0)
    bad(`${name} 총 ${total}마디가 16의 배수가 아니다 — 필인·셔플 격자와 어긋난다`);

  /* 섹션 길이: 4의 배수이거나 12(블루스 한 코러스). 12를 허용하는 것이 이번 변경의 요점이다 */
  const odd = f.secs.filter(x => x.bars !== 12 && x.bars % 4 !== 0);
  if (odd.length)
    bad(`${name} 에 4의 배수도 12도 아닌 섹션 — ${odd.map(x => `${x.k} ${x.bars}`).join(', ')}`);
  const kinds = f.secs.filter(x => !A.SECTION_KINDS.includes(x.k));
  if (kinds.length) bad(`${name} 에 모르는 섹션 종류 — ${kinds.map(x => x.k).join(', ')}`);

  if (fits.length && f.melLen === fits[0] && !odd.length && !kinds.length && total === f.total)
    console.log(`${OK} ${name.padEnd(18)} ${String(total).padStart(3)}마디 · 섹션 ${String(f.secs.length).padStart(2)}개`
      + ` · 선율 ${f.melLen} · 확신도 ${f.conf}`);
}
{
  const low = Object.entries(A.SONG_FORM).filter(([, f]) => f.conf === 'low').map(([n]) => n);
  if (low.length) console.log(`   ${WARN} 확신도 low ${low.join(' ')} — 출처가 얇다는 기록이지 결함이 아니다`);
}

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
  const line = A.SECTION_KINDS
    .map(k => `${k} ${ALL.length - (A.SECTION_RULE[k].off || []).length}`).join(' · ');
  console.log(`   동시에 울리는 트랙 수 — ${line}`);
  const chorus = ALL.length - A.SECTION_RULE.chorus.off.length;
  const verse = ALL.length - A.SECTION_RULE.verse.off.length;
  if (chorus <= verse) bad(`코러스(${chorus})가 벌스(${verse})보다 안 두껍다 — 쌓였다 터지는 형태가 안 된다`);

  /* ── 형식별 규칙 — 조사한 것이 실제로 소리에 닿는 자리다 ── */
  console.log('');
  let ruled = 0;
  for (const [name, f] of Object.entries(A.SONG_FORM)) {
    if (!f.rule) continue;
    ruled++;
    const used = new Set(f.secs.map(x => x.k));
    for (const [k, r] of Object.entries(f.rule)) {
      if (!A.SECTION_KINDS.includes(k)) { bad(`${name}.rule 에 모르는 섹션 — ${k}`); continue; }
      if (!used.has(k)) soft(`${name}.rule.${k} 은 이 폼에 없는 섹션이다 — 소리에 닿지 않는다`);
      for (const id of r.off || []) if (!ALL.includes(id)) bad(`${name}.rule.${k}.off 에 없는 트랙 — ${id}`);
      for (const id of Object.keys(r.lvl || {})) if (!ALL.includes(id)) bad(`${name}.rule.${k}.lvl 에 없는 트랙 — ${id}`);
    }
    if (!f.ruleWhy) bad(`${name}.rule 에 _why 가 없다 — 왜 기본값으로 안 되는지 적어야 한다`);
    /* 벌스와 코러스가 둘 다 있으면 코러스가 더 두껍거나 더 커야 한다 */
    const thick = k => {
      const r = f.rule[k] || A.SECTION_RULE[k];
      const on = ALL.filter(id => !(r.off || []).includes(id));
      const gain = on.reduce((t, id) => t + ((r.lvl || {})[id] || 1), 0);
      return { n: on.length, gain };
    };
    if (used.has('verse') && used.has('chorus')) {
      const v = thick('verse'), c = thick('chorus');
      if (c.gain <= v.gain)
        bad(`${name} — 코러스 무게 ${c.gain.toFixed(1)} 가 벌스 ${v.gain.toFixed(1)} 이하다 (트랙 ${c.n} vs ${v.n})`);
      else console.log(`${OK} ${name.padEnd(14)} 벌스 ${v.n}트랙/${v.gain.toFixed(1)} → 코러스 ${c.n}트랙/${c.gain.toFixed(1)}`);
    } else {
      const ks = [...used].map(k => `${k} ${thick(k).n}`).join(' · ');
      console.log(`${OK} ${name.padEnd(14)} ${ks}`);
    }
  }
  console.log(`   형식 ${ruled}종이 자기 규칙을 갖는다 · 나머지 ${Object.keys(A.SONG_FORM).length - ruled}종은 기본 규칙`);
}

/* ── 프리셋 · 선율 라이브러리 ────────────────────────────── */
let P;
{
  let src = '';
  for (const f of ['src/core/config.js', 'src/core/scale.js', 'src/data/preset-index.js',
                   'src/data/pattern-codec.js', 'src/data/presets/_raw.js',
                   ...fs.readdirSync(ROOT + '/src/data/presets').filter(x => /^\d\d-/.test(x)).sort()
                      .map(x => 'src/data/presets/' + x),
                   'src/data/presets/_build.js', 'src/data/melody.js'])
    src += '\n' + strip(read(f));
  P = new Function('window', 'console', src + '\n; return {LIB, LIB_NAMES, PRESET_CAT, PRESET_SUB,' +
    'MELODY,RIFF,BLINE,MEL_SRC,RIFF_PHRASE,BLINE_SRC,LONG_64,LONG_64H,' +
    'melodyPoolFor,riffPoolFor,blinePoolFor,melodyLenPool,riffLenPool,blineLenPool};'
  )({ Tone: undefined }, { warn() {}, log() {} });
}
const catFor = n => (P.LIB[n] && P.LIB[n].cat) || P.PRESET_CAT[n] || 'K';
const subKey = n => catFor(n) + ':' + (P.PRESET_SUB[n] || '');

head('D — 배정표가 실재하는 계열·하위분기·폼만 가리키는가');
{
  const realSubs = new Set(P.LIB_NAMES.map(subKey));
  const realCats = new Set(P.LIB_NAMES.map(catFor));
  for (const [k, v] of Object.entries(A.SONG_FORM_POOL_SUB)) {
    if (!realSubs.has(k)) bad(`SONG_FORM_POOL_SUB 에 없는 분기 — ${k} (오타이거나 분기 이름이 바뀌었다)`);
    for (const f of v.pool) if (!A.SONG_FORM[f]) bad(`${k} 이 없는 폼을 가리킨다 — ${f}`);
    if (!v.why) soft(`${k} 에 why 가 비었다 — 왜 이 형식인지 적어야 한다`);
  }
  for (const [c, pool] of Object.entries(A.SONG_FORM_POOL_CAT)) {
    if (!realCats.has(c)) soft(`SONG_FORM_POOL_CAT 에 쓰이지 않는 계열 — ${c}`);
    for (const f of pool) if (!A.SONG_FORM[f]) bad(`계열 ${c} 가 없는 폼을 가리킨다 — ${f}`);
  }
  const noCat = [...realCats].filter(c => !A.SONG_FORM_POOL_CAT[c]);
  if (noCat.length) bad(`기본형이 없는 계열 — ${noCat.join(' ')}`);
  /* 프리셋 단위 예외 — 이름이 틀리면 조용히 무시되므로 기계가 봐야 한다 */
  const realPresets = new Set(P.LIB_NAMES);
  for (const [n, v] of Object.entries(A.SONG_FORM_POOL_PRESET || {})) {
    if (!realPresets.has(n)) bad(`SONG_FORM_POOL_PRESET 에 없는 프리셋 — ${n}`);
    for (const f of v.pool) if (!A.SONG_FORM[f]) bad(`프리셋 예외 ${n} 이 없는 폼을 가리킨다 — ${f}`);
    if (!v.why) bad(`프리셋 예외 ${n} 에 why 가 없다 — 계보와 다르다는 근거를 적어야 한다`);
  }
  if (Object.keys(A.SONG_FORM_POOL_PRESET || {}).length)
    console.log(`${OK} 프리셋 단위 예외 ${Object.keys(A.SONG_FORM_POOL_PRESET).length}건 — 전부 실재하는 프리셋·폼이고 근거가 있다`);
  const covered = new Set(Object.keys(A.SONG_FORM_POOL_SUB));
  const inherited = [...realSubs].filter(s => !covered.has(s));
  console.log(`${OK} 분기 ${realSubs.size}개 — 따로 배정 ${covered.size}개 · 계열 기본형 상속 ${inherited.length}개`);
  const unused = Object.keys(A.SONG_FORM).filter(f =>
    !Object.values(A.SONG_FORM_POOL_SUB).some(v => v.pool.includes(f)) &&
    !Object.values(A.SONG_FORM_POOL_CAT).some(p => p.includes(f)));
  if (unused.length) soft(`아무도 안 쓰는 폼 — ${unused.join(' ')}`);
}

head('E — 선율·리프·베이스 재료마다 64마디판이 있는가');
{
  const melBases = P.MEL_SRC.map(([a]) => a.replace(/A$/, ''));
  const missMel = melBases.filter(b => !P.MELODY[b + '_l64']);
  if (missMel.length) bad(`64마디판이 없는 선율 재료 ${missMel.length}종 — ${missMel.join(' ')}`);
  else console.log(`${OK} 선율 재료 ${melBases.length}종 전부 64마디판 있음` +
                   ` (전개형 ${P.LONG_64.length} · 훅형 ${P.LONG_64H.length})`);

  const riffBases = [...new Set(Object.values(P.RIFF).filter(r => r.src).map(r => r.src[0].replace(/A$/, '')))];
  const missRiff = riffBases.filter(b => !P.RIFF[b + '_l64']);
  if (missRiff.length) bad(`64마디판이 없는 리프 재료 — ${missRiff.join(' ')}`);
  else console.log(`${OK} 리프 재료 ${riffBases.length}쌍 전부 64마디판 있음`);

  const basBases = P.BLINE_SRC.map(([a]) => a.replace(/A$/, ''));
  const missBas = basBases.filter(b => !P.BLINE[b + '_l64']);
  if (missBas.length) bad(`64마디판이 없는 베이스 재료 — ${missBas.join(' ')}`);
  else console.log(`${OK} 베이스 재료 ${basBases.length}쌍 전부 64마디판 있음`);

  for (const [lib, tab] of [['MELODY', P.MELODY], ['RIFF', P.RIFF], ['BLINE', P.BLINE]])
    for (const [k, v] of Object.entries(tab)) {
      const m = k.match(/_l(\d+)b?$/);
      if (m && v.rows.length !== +m[1]) bad(`${lib}.${k} 이 ${v.rows.length}마디다 — 이름은 ${m[1]}`);
    }
}

head('F — 프리셋이 자기 폼의 선율 길이를 실제로 받는가');
{
  const poolFor = n => {
    const one = A.SONG_FORM_POOL_PRESET[n];
    if (one && one.pool) return one.pool;
    const hit = A.SONG_FORM_POOL_SUB[subKey(n)];
    return (hit && hit.pool) || A.SONG_FORM_POOL_CAT[catFor(n)] || Object.keys(A.SONG_FORM);
  };
  const short = { mel: [], rif: [], bas: [] };
  const lenTally = {};
  let noKeys = 0;
  for (const n of P.LIB_NAMES) {
    for (const fname of poolFor(n)) {
      const f = A.SONG_FORM[fname];
      if (!f) continue;                       // D 가 이미 잡았다
      lenTally[f.melLen] = (lenTally[f.melLen] || 0) + 1;
      const want = String(f.melLen);
      for (const [tag, tab, pf, lf] of [
        ['mel', P.MELODY, P.melodyPoolFor, P.melodyLenPool],
        ['rif', P.RIFF, P.riffPoolFor, P.riffLenPool],
        ['bas', P.BLINE, P.blinePoolFor, P.blineLenPool]]) {
        const key = { mel: 'keys', rif: 'gtr', bas: 'bass' }[tag];
        const pool = lf(pf(n) || [], want);
        if (!pool.length) { if (tag === 'mel') noKeys++; continue; }
        if (pool.some(x => !tab[x] || tab[x].rows.length !== f.melLen))
          short[tag].push(`${n}(${fname}·${key})`);
      }
    }
  }
  for (const [tag, label] of [['mel', '선율'], ['rif', '리프'], ['bas', '베이스']]) {
    const uniq = [...new Set(short[tag])];
    if (uniq.length)
      bad(`${label} — 폼이 요구한 길이를 못 받는 조합 ${uniq.length}건: ${uniq.slice(0, 5).join(' ')}…`);
    else console.log(`${OK} ${label} — 프리셋 ${P.LIB_NAMES.length}종이 전부 폼이 요구한 길이를 받는다`);
  }
  console.log(`   폼×프리셋 조합의 선율 길이 분포 — `
    + Object.entries(lenTally).sort((a, b) => b[0] - a[0]).map(([l, c]) => `${l}마디 ${c}건`).join(' · '));
  if (noKeys) console.log(`   (선율 풀이 비는 조합 ${noKeys}건은 건반을 안 쓰는 장르다 — 메탈·펑크)`);
}

/* ── G. 형식의 대비가 **그 프리셋에서** 실제로 유효한가 ──────
   표의 12개 트랙을 다 세면 거짓말이 된다. 블루스 프리셋은 kick·snare·chat +
   bass·keys·gtr 여섯뿐이라 clap·ohat·tom·perc 를 끄고 켜는 규칙이 통째로
   무효다. 그러면 남는 것은 레벨뿐인데, 마스터의 글루 컴프·리미터가 그것을
   눌러 버린다(arrange.js §SECTION_RULE «1차 실측 2.33 LU»).
   실측은 tools/measure-sections.mjs 가 하고, 여기서는 **공짜로 잡히는 것**만
   본다 — 「이 프리셋에서는 켜고 꺼지는 트랙이 하나도 없다」. */
head('G — 형식의 대비가 그 프리셋에서 실제로 유효한가');
{
  const TRACK_IDS2 = new Function('window', strip(read('src/core/config.js')) + ';return TRACK_IDS;')({ Tone: undefined });
  const ALL = [...TRACK_IDS2, 'bass', 'keys', 'gtr', 'keys2', 'gtr2'];
  const liveOf = n => {
    const L = P.LIB[n], d = (L && L.drums) || {};
    return ALL.filter(id => {
      const a = TRACK_IDS2.includes(id) ? d[id] : L && L[id];
      return Array.isArray(a) && a.some(v => v);
    });
  };
  const poolFor = n => {
    const one = A.SONG_FORM_POOL_PRESET[n];
    if (one && one.pool) return one.pool;
    const hit = A.SONG_FORM_POOL_SUB[subKey(n)];
    return (hit && hit.pool) || A.SONG_FORM_POOL_CAT[catFor(n)] || [];
  };
  const flatFor = {};
  for (const n of P.LIB_NAMES) {
    const live = liveOf(n);
    if (!live.length) continue;
    for (const fname of poolFor(n)) {
      const f = A.SONG_FORM[fname];
      if (!f || f.arc !== 'build') continue;        // 평평한 것이 맞는 형식은 뺀다
      const kinds = [...new Set(f.secs.map(x => x.k))];
      const row = k => {
        const r = (f.rule && f.rule[k]) || A.SECTION_RULE[k];
        return live.map(id => (r.off || []).includes(id) ? 0 : ((r.lvl || {})[id] || 1));
      };
      const w = k => { const g = row(k); return g.filter(v => v > 0).length * 100 + g.reduce((s, v) => s + v, 0); };
      const thin = kinds.reduce((a, b) => w(a) <= w(b) ? a : b);
      const thick = kinds.reduce((a, b) => w(a) >= w(b) ? a : b);
      const a = row(thin), b = row(thick);
      let swing = 0;
      for (let i = 0; i < live.length; i++) if ((a[i] === 0) !== (b[i] === 0)) swing++;
      if (swing <= 1) (flatFor[fname] = flatFor[fname] || []).push(`${n}(${swing})`);
    }
  }
  const names = Object.keys(flatFor);
  if (!names.length) console.log(`${OK} build 형식은 전부, 배정된 프리셋에서 켜고 꺼지는 트랙이 둘 이상이다`);
  for (const f of names)
    soft(`${f} — 켜고 꺼지는 트랙이 0~1개인 프리셋 ${flatFor[f].length}종 (${flatFor[f].slice(0, 5).join(' ')}…).`
       + ` 대비가 레벨에 기대게 되고 마스터 컴프가 그것을 누른다.`
       + ` 대개 **프리셋에 층이 없어서**다(펑크·메탈은 드럼 셋 + 베이스·기타뿐이라 끄고 켤 것이 없다) —`
       + ` 그럴 때는 형식의 결함이 아니다. 실측으로 가려야 한다: tools/measure-sections.mjs`);
}


console.log();
if (fail) { console.log(`${NG} 곡 형식 검사 실패 — ${fail}건`); process.exit(1); }
console.log(`${OK} 곡 형식 검사 통과${warn ? ` · ${WARN} 경고 ${warn}건` : ''}`);
