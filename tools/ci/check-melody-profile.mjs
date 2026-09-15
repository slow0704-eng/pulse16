/* tools/ci/check-melody-profile.mjs — 장르 프로파일(genres/profiles/*.json) 검사.

   왜: 357종의 선율을 장르별로 확립하는 작업의 최대 실패 모드는 «차이를
   지어내는 것» 이다(작업 지침 부록 B). 「밀도 6 대 7」이 근거 있는 차이인지
   지어낸 차이인지는 사람이 60배치를 다 본 뒤에야 안다. 기계는 적어도
   **수치가 거의 같은데 다른 풀을 준 쌍**과 **수치가 확연히 다른데 같은 풀을
   준 쌍**은 잰다. 한쪽만 잡으면 반대쪽으로 도망가므로 양방향으로 본다.

   그리고 저작권 가드레일(부록 C) 중 기계가 할 수 있는 몫을 맡는다 —
   `evidenceBasis` 의 **형식을 강제**해서 곡 제목이 들어갈 문법 자리를 없앤다.
   「들으면 특정 곡이 떠오르는가」의 최종 판단은 사람만 할 수 있다.

   검사 항목 (설계 <표 7>)
     P1 스키마 · 필수 필드
     P2 evidenceBasis 형식 — 「… · N곡」. 곡 제목이 들어갈 자리를 문법으로 막음
     P3 meta.pool 의 키가 MELODY / RIFF / BLINE 에 실재
     P4 프레이즈 표기 — 16칸 × 4마디, a~h · 0~7 · - 외 문자 없음
     P5 프레이즈가 **자기 프로파일의** 밀도·도약·음역 범위를 실제로 만족
     P6 새 프레이즈가 기존 PHRASE / RIFF_PHRASE / BASS_PHRASE 와 문자열 일치 안 함
     P7 차별화 — 양방향 (아래 참고. **아직 임계값을 두지 않는다**)
     P8 커버리지 — 프로파일이 없는 프리셋. 두 부류는 대상이 아니다 —
        선율 없음(Metal·Punk) 과 계열 X «예제»(장르가 아닌 Tone.js 데모).
        이유는 P8 블록 주석에 적혀 있다
     P9 melody.js 의 MELODY_KIT 과 JSON 의 meta.pool 이 어긋남
     P10 confidence:"high" 인데 근거 곡 수가 5 미만

   ⚠ 이 파일은 검사만 한다. src/ 도 genres/profiles/ 도 고치지 않는다.
      검사가 실패하면 임계값을 낮추지 말고 사람에게 보고할 것.

   사용법:  node tools/ci/check-melody-profile.mjs
   종료코드: 0 통과(경고 포함) / 1 실패 / 2 준비 안 됨                    */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { abs, rel, OK, NG, WARN, head } from './_lib.mjs';
import { loadPlaywright, startServer, watchdog } from './_browser.mjs';
import { HTML } from './_lib.mjs';

const DIR = 'genres/profiles';
let errors = 0, warnings = 0;
const fail = (m) => { console.log(`  ${NG} ${m}`); errors++; };
const warn = (m) => { console.log(`  ${WARN} ${m}`); warnings++; };

/* ═══ 0. 프로파일 읽기 ═══ */

head('0. 프로파일 파일');

if (!existsSync(abs(DIR))) {
  console.log(`${WARN} ${DIR}/ 이 아직 없습니다 — 검사할 것이 없습니다.`);
  console.log(`     장르 프로파일 작업이 시작되면 여기에 배치별 JSON 이 생깁니다.`);
  process.exit(0);
}

const files = readdirSync(abs(DIR)).filter(f => f.endsWith('.json') && !f.startsWith('_')).sort();
if (files.length === 0) {
  console.log(`${WARN} ${DIR}/ 에 프로파일이 없습니다 — 검사할 것이 없습니다.`);
  process.exit(0);
}

const profiles = [];   // {file, p}
for (const f of files) {
  let json;
  try { json = JSON.parse(readFileSync(join(abs(DIR), f), 'utf8')); }
  catch (e) { console.log(`  ${NG} ${DIR}/${f} — JSON 파싱 실패: ${e.message}`); errors++; continue; }
  const list = Array.isArray(json) ? json : (json.profiles || [json]);
  for (const p of list) profiles.push({ file: `${DIR}/${f}`, p });
}
console.log(`파일 ${files.length}개 · 프로파일 ${profiles.length}건`);

/* ═══ 표기 · 지표 ═══════════════════════════════════════════════════
   patterns/README.md §1 · melody/README.md §2 의 표기를 그대로 쓴다.
     a~h = 단음 0~7도   0~7 = 그 도수 근음의 3화음   - = 쉼            */

const NOTATION = /^[a-h0-7-]{16}$/;
const degreeOf = (c) =>
  c === '-' ? null : (c >= '0' && c <= '7') ? +c : (c >= 'a' && c <= 'h') ? c.charCodeAt(0) - 97 : NaN;

/** 4마디 프레이즈의 지표. melody/02-melody-theory.md 의 정의를 따른다. */
function metrics(bars) {
  const degs = [];                       // [{bar, step, deg}]
  bars.forEach((bar, b) => [...bar].forEach((c, i) => {
    const d = degreeOf(c);
    if (d !== null && Number.isFinite(d)) degs.push({ bar: b, step: i, deg: d });
  }));
  const density = +(degs.length / bars.length).toFixed(2);
  let leaps = 0, moves = 0;
  for (let i = 1; i < degs.length; i++) {
    const dd = Math.abs(degs[i].deg - degs[i - 1].deg);
    if (dd > 0) { moves++; if (dd >= 2) leaps++; }
  }
  const all = degs.map(d => d.deg);
  return {
    density,
    leapRatio: moves ? +(leaps / moves).toFixed(2) : 0,
    range: all.length ? Math.max(...all) - Math.min(...all) : 0,
    lastBarEmpty: [...bars[bars.length - 1]].every(c => c === '-'),
    endDegree: degs.length ? degs[degs.length - 1].deg : null,
    notes: degs.length,
  };
}

const inRange = (v, r) => !r || (typeof r.min !== 'number' ? true : v >= r.min)
                             && (typeof r.max !== 'number' ? true : v <= r.max);

/* ═══ 앱에서 실재하는 키를 가져온다 ═══
   MELODY·RIFF·BLINE 은 MEL_SRC 등에서 **만들어지는** 표라 소스를 읽어서는
   키를 셀 수 없다. 앱을 띄워 물어보는 것이 유일하게 정확한 방법이다.   */

head('앱에서 실재 키 읽기');
const stopDog = watchdog(180, '프로파일 검사');
const { chromium } = loadPlaywright();
const srv = await startServer();
const browser = await chromium.launch();
let live;
try {
  const page = await browser.newPage();
  await page.goto(`${srv.origin}/${HTML}`, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(1200);
  live = await page.evaluate(() => ({
    melody: Object.keys(MELODY), riff: Object.keys(RIFF), bline: Object.keys(BLINE),
    scales: Object.keys(SCALES), prog: Object.keys(PROG), comp: Object.keys(COMP),
    presets: Object.keys(LIB),
    sub: Object.fromEntries(Object.keys(LIB).map(n => [n, PRESET_SUB[n] || null])),
    cat: Object.fromEntries(Object.keys(LIB).map(n => [n, PRESET_CAT[n] || (LIB[n] && LIB[n].cat) || null])),
    chordVals: [...new Set(Object.values(LIB).map(L => L.kit && L.kit.chord).filter(Boolean))],
    melodyKit: Object.fromEntries(Object.entries(MELODY_KIT)),
    /* 프리셋이 직접 정한 풀이 있으면 그것이 실제로 쓰이는 값이다 */
    effPool: Object.fromEntries(Object.keys(LIB).map(n => [n, melodyPoolFor(n)])),
    noMelody: Object.keys(LIB).filter(n => melodyPoolFor(n).length === 0),

    /* ── 실제 재료의 지표 ────────────────────────────────────────────
       프로파일이 «밀도 4~6» 이라고 적었으면, 그 프리셋이 **실제로 받는**
       MELODY 키가 정말 그 범위인지 기계가 재야 한다. JSON 에 적은
       프레이즈만 보면 «선언한 것» 을 검사할 뿐 «주어지는 것» 은 못 본다.

       MELODY·RIFF·BLINE 의 마디는 **16자 문자열**이다 (kpat/bpat 변환은
       시퀀서가 재생할 때 한다). 표기는 patterns/README.md §1 그대로 —
       'a'~'h' 단음 · '0'~'7' 3화음 · '-' 쉼. 그래서 voicing(단음이냐
       3화음이냐)을 문자만 보고 기계로 잴 수 있다. */
    material: (() => {
      const stat = (bars) => {
        const notes = [];            // {deg, chord}
        for (const bar of bars) {
          for (const c of String(bar)) {
            if (c === '-') continue;
            if (c >= '0' && c <= '7') notes.push({ deg: +c, chord: true });
            else if (c >= 'a' && c <= 'h') notes.push({ deg: c.charCodeAt(0) - 97, chord: false });
          }
        }
        let leaps = 0, moves = 0;
        for (let i = 1; i < notes.length; i++) {
          const d = Math.abs(notes[i].deg - notes[i - 1].deg);
          if (d > 0) { moves++; if (d >= 2) leaps++; }
        }
        const degs = notes.map(n => n.deg);
        return {
          bars: bars.length,
          density: +(notes.length / bars.length).toFixed(2),
          leapRatio: moves ? +(leaps / moves).toFixed(2) : 0,
          range: degs.length ? Math.max(...degs) - Math.min(...degs) : 0,
          chordRatio: notes.length ? +(notes.filter(n => n.chord).length / notes.length).toFixed(2) : 0,
        };
      };
      const out = {};
      for (const T of [MELODY, RIFF, BLINE])
        for (const [k, v] of Object.entries(T)) out[k] = stat(v.bars);
      return out;
    })(),
    phraseBars: {
      PHRASE: Object.fromEntries(Object.entries(PHRASE).map(([k, v]) => [k, v.map(String)])),
      RIFF_PHRASE: Object.fromEntries(Object.entries(RIFF_PHRASE).map(([k, v]) => [k, v.map(String)])),
      BASS_PHRASE: Object.fromEntries(Object.entries(BASS_PHRASE).map(([k, v]) => [k, v.map(String)])),
    },
  }));
  await page.close();
} finally {
  await browser.close(); await srv.close(); stopDog();
}
console.log(`${OK} MELODY ${live.melody.length} · RIFF ${live.riff.length} · BLINE ${live.bline.length}`
          + ` · SCALES ${live.scales.length} · 프리셋 ${live.presets.length}`);

/* ═══ P1 · P2 · P10 — 스키마와 근거 ═══ */

head('P1·P2·P10 — 스키마 · 근거 형식 · 확신도');

const ENUMS = {
  stage: ['assign', 'mine'],
  'melody.contour': ['rise', 'arch', 'fall', 'zigzag', 'static'],
  'melody.rhythm': ['onbeat', 'offbeat', 'offbeat16', 'triplet-feel'],
  'melody.repetition': ['low', 'mid', 'high'],
  'melody.voicing': ['single', 'chord', 'mixed'],
  'bass.role': ['root', 'walking', 'arpeggio', 'octave'],
  'bass.gate': ['short', 'mid', 'long'],
  'bass.kickRelation': ['locked', 'offset', 'free'],
  'bass.glide': ['none', 'occasional', 'defining'],
  'meta.confidence': ['high', 'medium', 'low'],
  'meta.poolDecision': ['own', 'share'],
};

/* 「1990년대 초 영국 남부 · 12곡」 — 연대 · 서술 · N곡.
   곡 제목을 적을 문법 자리가 없다. 이것이 기계가 할 수 있는 몫이다.
   「1940~50년대」처럼 연대에 걸친 표기도 받는다 — 정당한 형식이고,
   곡 제목을 막는 것과는 무관하다. */
const EVIDENCE_RE = /^\d{4}(?:\s*~\s*\d{2,4})?년대.*·\s*(\d+)곡$/;

const get = (o, path) => path.split('.').reduce((a, k) => (a == null ? a : a[k]), o);

for (const { file, p } of profiles) {
  const id = `${p.preset || '(preset 없음)'} [${file}]`;
  for (const k of ['preset', 'sub', 'cat', 'stage', 'melody', 'harmony', 'bass', 'ensemble', 'meta'])
    if (p[k] === undefined) fail(`${id} — 필수 필드 '${k}' 없음`);
  if (!p.melody) continue;

  for (const [path, allowed] of Object.entries(ENUMS)) {
    const v = get(p, path);
    if (v !== undefined && !allowed.includes(v))
      fail(`${id} — ${path} = ${JSON.stringify(v)} (허용: ${allowed.join(' | ')})`);
  }
  if (p.melody.scale && !live.scales.includes(p.melody.scale))
    fail(`${id} — scale '${p.melody.scale}' 은 SCALES 에 없음 (있는 것: ${live.scales.join(' | ')})`);
  if (p.harmony?.comping && !live.comp.includes(p.harmony.comping))
    fail(`${id} — comping '${p.harmony.comping}' 은 COMP 에 없음`);
  if (p.harmony?.chordType && !live.chordVals.includes(p.harmony.chordType))
    warn(`${id} — chordType '${p.harmony.chordType}' 을 쓰는 프리셋이 하나도 없음`);
  if (p.preset && !live.presets.includes(p.preset))
    fail(`${id} — LIB 에 없는 프리셋 이름`);
  if (p.preset && live.sub[p.preset] && p.sub !== live.sub[p.preset])
    fail(`${id} — sub 가 PRESET_SUB 와 다름 (실제 '${live.sub[p.preset]}')`);
  if (p.preset && live.cat[p.preset] && p.cat !== live.cat[p.preset])
    fail(`${id} — cat 이 실제와 다름 (실제 '${live.cat[p.preset]}')`);

  /* P2 — 근거 형식 */
  const eb = p.meta?.evidenceBasis;
  const m = eb ? EVIDENCE_RE.exec(eb) : null;
  if (!m) {
    fail(`${id} — evidenceBasis 형식 위반: ${JSON.stringify(eb)}`);
    console.log(`        형식은 「연대 · 서술 · N곡」입니다. 예: "1990년대 초 영국 남부 · 12곡"`);
    console.log(`        곡 제목·아티스트명이 들어갈 자리를 문법으로 막아 둔 것입니다.`);
  } else if (p.meta.confidence === 'high' && +m[1] < 5) {
    /* P10 */
    warn(`${id} — confidence:"high" 인데 근거가 ${m[1]}곡뿐입니다 (기준 5곡)`);
  }

  /* poolDecision 과 shareWith 의 짝 */
  if (p.meta?.poolDecision === 'share' && !p.meta.shareWith)
    fail(`${id} — poolDecision:"share" 인데 shareWith 가 비어 있음`);
  if (p.meta?.poolDecision === 'own' && p.meta.shareWith)
    warn(`${id} — poolDecision:"own" 인데 shareWith 가 적혀 있음`);
}
if (errors === 0) console.log(`${OK} 스키마·근거 형식 통과`);

/* ═══ P3 · P9 — 풀 키가 실재하는가 / melody.js 와 맞는가 ═══ */

head('P3·P9 — 풀 키 실재 · melody.js 와 일치');

const known = new Set([...live.melody, ...live.riff, ...live.bline]);
let p3 = 0;
for (const { file, p } of profiles) {
  for (const k of p.meta?.pool || []) {
    if (!known.has(k)) { fail(`${p.preset} [${file}] — pool 의 '${k}' 이 MELODY/RIFF/BLINE 어디에도 없음`); p3++; }
  }
  /* P9 — JSON 의 pool 이 **실제로 쓰이는 풀** 과 같은가.
     MELODY_KIT_PRESET → MELODY_KIT → MELODY_KIT_CAT 의 결과를 그대로 본다.
     하위분기 표만 보면, 프리셋이 직접 정한 풀을 «어긋났다» 고 잘못 잡는다. */
  const eff = live.effPool[p.preset];
  if (eff && p.meta?.pool) {
    const same = eff.length === p.meta.pool.length && eff.every((v, i) => v === p.meta.pool[i]);
    if (!same)
      warn(`${p.preset} — meta.pool 이 실제 배정과 다릅니다`
         + ` (JSON: ${p.meta.pool.join('|')} / 앱: ${eff.join('|')}) — 아직 안 옮겼다는 뜻입니다`);
  }
}
if (p3 === 0) console.log(`${OK} pool 키 전부 실재`);

/* ═══ P4 · P5 · P6 — 프레이즈 ═══ */

head('P4·P5·P6 — 프레이즈 표기 · 자기 프로파일 만족 · 기존과 중복');

const existing = new Map();   // 문자열 → 원래 이름
for (const [table, obj] of Object.entries(live.phraseBars))
  for (const [k, bars] of Object.entries(obj)) existing.set(bars.join('|'), `${table}.${k}`);

let phraseCount = 0;
for (const { file, p } of profiles) {
  for (const [slot, bars] of Object.entries(p.phrases || {})) {
    phraseCount++;
    const id = `${p.preset}.${slot}`;
    if (!Array.isArray(bars) || bars.length !== 4) {
      fail(`${id} — 4마디가 아닙니다 (${Array.isArray(bars) ? bars.length : typeof bars})`); continue;
    }
    let bad = false;
    bars.forEach((bar, i) => {
      if (typeof bar !== 'string' || !NOTATION.test(bar)) {
        fail(`${id} ${i + 1}마디 — 16칸 a~h/0~7/- 위반: ${JSON.stringify(bar)}`); bad = true;
      }
    });
    if (bad) continue;

    /* P6 — 기존과 완전히 같은 것.
       단, **자기 것과 같은 것은 정상**이다 — JSON 의 프레이즈를 melody.js 에
       옮겼으면 당연히 같아진다. 그건 오히려 «근거와 데이터가 맞다» 는 신호다.
       자기 것인지는 meta.pool 의 뿌리 이름으로 가린다 (afd_aabb → afdA/afdB). */
    const ownBases = new Set((p.meta?.pool || []).map(k => k.split('_')[0]));
    const hit = existing.get(bars.join('|'));
    if (hit) {
      const hitBase = hit.split('.')[1].replace(/[AB]$/, '');
      if (ownBases.has(hitBase)) console.log(`    ↳ ${hit} 로 melody.js 에 반영돼 있습니다 ${OK}`);
      else fail(`${id} — 남의 프레이즈 ${hit} 과 문자열이 완전히 같습니다`);
    } else if (ownBases.size) {
      warn(`${id} — melody.js 에 아직 안 옮겨졌습니다 (pool: ${[...ownBases].join(',')})`);
    }

    /* P5 — 자기 프로파일을 만족하는가. 건반 슬롯에만 댄다.
       리프·베이스는 잣대가 다르다(melody/02-melody-theory.md §10-1). */
    const mt = metrics(bars);
    console.log(`  · ${id.padEnd(28)} 밀도 ${String(mt.density).padStart(5)}`
              + ` · 도약 ${String(mt.leapRatio).padStart(4)} · 음역 ${mt.range}`
              + ` · 끝음 ${mt.endDegree ?? '없음'} · 끝마디 ${mt.lastBarEmpty ? '빔' : '참'}`);
    if (!/^keys/i.test(slot)) continue;
    if (!inRange(mt.density, p.melody.density))
      fail(`${id} — 밀도 ${mt.density} 가 프로파일 ${JSON.stringify(p.melody.density)} 밖`);
    if (!inRange(mt.leapRatio, p.melody.leapRatio))
      fail(`${id} — 도약비율 ${mt.leapRatio} 가 프로파일 ${JSON.stringify(p.melody.leapRatio)} 밖`);
    /* ⚠ 음역은 «이상» 만 본다. 프로파일의 음역은 **16마디로 이은 결과**의
       값인데 여기서 재는 것은 **4마디 프레이즈** 다. A·B 두 층을 폼으로
       엮으면 음역이 넓어지므로, 4마디가 더 좁은 것은 정상이다.
       (실제로 gar·rag 는 4마디 4 → 16마디 7 이다) */
    if (typeof p.melody.range?.max === 'number' && mt.range > p.melody.range.max)
      fail(`${id} — 음역 ${mt.range} 가 프로파일 최대 ${p.melody.range.max} 를 넘음`);
    const wantEmpty = p.melody.cadence?.lastBarEmpty;
    if (typeof wantEmpty === 'boolean' && mt.lastBarEmpty !== wantEmpty)
      fail(`${id} — 끝마디 비우기: 프로파일 ${wantEmpty} / 실제 ${mt.lastBarEmpty}`);
  }
}
console.log(phraseCount ? `프레이즈 ${phraseCount}개 검사` : `${WARN} 프레이즈가 아직 없습니다 (stage:"assign" 배치면 정상)`);

/* ═══ P11 — 배정된 재료가 프로파일을 실제로 만족하는가 ═══════════════
   이것이 «사람이 들어 봐야 안다» 를 대신하는 자리다. 프로파일이
   「밀도 4~6 · 3화음이 몸」 이라고 적었으면, 그 프리셋이 **실제로 받는**
   MELODY 키가 정말 그런지 기계가 잰다. JSON 에 적은 프레이즈만 보는
   P5 는 «선언한 것» 을 검사할 뿐 «주어지는 것» 은 못 본다.

   ⚠ 어긋나면 둘 중 하나가 틀린 것이다 — 프로파일 수치가 과장됐거나,
     풀 선택이 틀렸거나. 임계를 늘리지 말고 둘 중 무엇인지 보라.
   32·64루프(l32·l64)는 16마디 전제의 지표를 그대로 대면 안 되므로 뺀다
   (melody/README.md §4-1).                                            */

head('P11 — 배정된 재료가 프로파일 수치를 만족하는가');
{
  let checked = 0, off = 0;
  const near = (v, r, slack) => !r
    || ((typeof r.min !== 'number' || v >= r.min - slack)
     && (typeof r.max !== 'number' || v <= r.max + slack));

  for (const { p } of profiles) {
    const pool = (p.meta?.pool || []).filter(k => !/_l(32|64)b?$/.test(k));
    for (const k of pool) {
      const m = live.material[k];
      if (!m) continue;
      checked++;
      const bad = [];
      /* 밀도는 ±1칸, 도약은 ±0.15, 음역은 ±1도수까지 봐준다 —
         풀은 «후보 목록» 이지 한 곡의 정확한 사양이 아니다. */
      if (!near(m.density, p.melody.density, 1)) bad.push(`밀도 ${m.density} ∉ ${p.melody.density.min}~${p.melody.density.max}`);
      if (!near(m.leapRatio, p.melody.leapRatio, 0.15)) bad.push(`도약 ${m.leapRatio} ∉ ${p.melody.leapRatio.min}~${p.melody.leapRatio.max}`);
      if (!near(m.range, p.melody.range, 1)) bad.push(`음역 ${m.range} ∉ ${p.melody.range.min}~${p.melody.range.max}`);
      /* voicing 은 기계로 직접 잴 수 있는 유일한 질적 축이다 */
      const isChord = m.chordRatio >= 0.5;
      if (p.melody.voicing === 'chord' && !isChord) bad.push(`voicing:chord 인데 3화음 비율 ${m.chordRatio}`);
      if (p.melody.voicing === 'single' && isChord) bad.push(`voicing:single 인데 3화음 비율 ${m.chordRatio}`);
      if (bad.length) { warn(`${p.preset} ← ${k} — ${bad.join(' · ')}`); off++; }
    }
  }
  console.log(`재료 ${checked}건 검사 (32·64루프 제외) — 어긋남 ${off}건`);
  if (off === 0) console.log(`${OK} 배정된 재료가 전부 프로파일 범위 안입니다`);
}

/* ═══ P7 — 차별화, 양방향 ═══════════════════════════════════════════
   ⚠ **아직 임계값을 두지 않는다.** 「거리 얼마면 다른가」는 데이터가
   쌓여야 정해진다. 지금 숫자를 박으면 그게 곧 지어낸 값이다.
   첫 배치들은 거리를 **기록만** 하고, 분포를 본 뒤 임계를 정한다.   */

head('P7 — 차별화 거리 (기록만 · 임계값 미정)');

const CONTOUR = ['fall', 'static', 'arch', 'zigzag', 'rise'];
const REPEAT = ['low', 'mid', 'high'];
const GLIDE = ['none', 'occasional', 'defining'];
/* 단음이냐 3화음이냐 — 이 축이 없어서 피아노 하우스와 마림바 트라이벌이
   거리 0.04 로 붙어 있었다. 표기가 다르면 들리는 것이 근본적으로 다르다. */
const VOICING = ['single', 'mixed', 'chord'];
const mid = r => (typeof r?.min === 'number' && typeof r?.max === 'number') ? (r.min + r.max) / 2 : 0;

/** 프로파일 → 정규화 벡터. 각 축을 0~1 로 맞춘다. */
function vec(p) {
  return [
    mid(p.melody?.density) / 16,
    mid(p.melody?.leapRatio),
    mid(p.melody?.range) / 7,
    CONTOUR.indexOf(p.melody?.contour) / (CONTOUR.length - 1),
    REPEAT.indexOf(p.melody?.repetition) / (REPEAT.length - 1),
    GLIDE.indexOf(p.bass?.glide) / (GLIDE.length - 1),
    VOICING.indexOf(p.melody?.voicing) / (VOICING.length - 1),
  ].map(v => (Number.isFinite(v) && v >= 0) ? v : 0);
}
const dist = (a, b) => +Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0)).toFixed(3);

/* ⚠ 하위분기 이름은 계열을 넘어 겹친다 — 「뿌리」가 록(A)에도 팝(B)에도 있고
   내용은 전혀 다르다(로큰롤 대 틴팬앨리). 계열까지 넣어야 한 무리가 된다. */
const bySub = {};
for (const { p } of profiles) (bySub[`${p.sub} · 계열 ${p.cat}`] ||= []).push(p);

/* 같은 풀을 쓰는 프리셋 전체 — 무리끼리 근거를 찾을 때 쓴다.
   무리가 하위분기를 넘어 걸치면(Trot 과 C-pop 이 다른 무리에 들어가듯)
   앵커가 같은 분기 안에 없을 수 있다. 그때도 연결을 찾을 수 있어야 한다. */
const byPoolAll = {};
for (const { p } of profiles) (byPoolAll[(p.meta?.pool || []).join('|')] ||= []).push(p);

/* 어느 쌍에 «무엇이 다른가» 를 요구할 것인가.

   모든 쌍에 요구하면 23종 분기에서 253개가 된다 — 지킬 수 없는 규칙은
   규칙이 아니다. 뜻이 있는 단위는 **풀** 이다:

     · 풀이 다른 두 무리 사이  → 한 줄이라도 있어야 한다 (차이의 근거)
     · 같은 풀 안             → share 쪽이 shareWith 를 «선율 아닌 축» 으로
                                설명했으면 충분하다
     · 거리 0 인데 풀이 다르면 → **지어낸 차이**. 이것이 P7 의 본체다      */
const poolSig = p => (p.meta?.pool || []).join('|');
const linked = (a, b) =>
  [...(a.meta?.distinguishes || []).filter(x => x.from === b.preset),
   ...(b.meta?.distinguishes || []).filter(x => x.from === a.preset)];

for (const [sub, list] of Object.entries(bySub)) {
  if (list.length < 2) continue;
  const groups = {};
  for (const p of list) (groups[poolSig(p)] ||= []).push(p);
  console.log(`\n  [${sub}] ${list.length}종 → ${Object.keys(groups).length}풀`);

  for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
    const a = list[i], b = list[j];
    const d = dist(vec(a), vec(b));
    const same = poolSig(a) === poolSig(b);
    const axes = linked(a, b).map(x => x.axis);
    console.log(`    ${String(d).padStart(6)}  ${a.preset} ↔ ${b.preset}`
              + `  [${same ? '같은 풀' : '다른 풀'}]${axes.length ? ' axis=' + axes.join(',') : ''}`);

    /* 양방향 — 한쪽만 잡으면 반대쪽으로 도망간다 */
    if (!same && d === 0)
      warn(`${a.preset} ↔ ${b.preset} — 수치가 완전히 같은데 풀이 다릅니다. 지어낸 차이인지 보십시오`);
    if (same && axes.some(x => x === 'melody'))
      warn(`${a.preset} ↔ ${b.preset} — axis:"melody" 라면서 같은 풀을 씁니다. 둘 중 하나가 틀렸습니다`);
  }

  /* 풀 무리끼리는 최소 한 줄의 근거가 있어야 한다 */
  const keys = Object.keys(groups);
  for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
    /* 같은 풀을 쓰는 프리셋 **전체**로 넓혀서 본다 — 앵커가 다른 분기에 있을 수 있다 */
    const A = byPoolAll[keys[i]] || groups[keys[i]];
    const B = byPoolAll[keys[j]] || groups[keys[j]];
    const any = A.some(a => B.some(b => linked(a, b).length));
    if (!any)
      warn(`[${sub}] 풀 «${keys[i].slice(0, 24)}» ↔ «${keys[j].slice(0, 24)}» —`
         + ` 두 무리를 잇는 distinguishes 가 한 줄도 없습니다`);
  }

  /* share 는 «선율이 아닌 축» 으로 설명돼야 한다 */
  for (const p of list) {
    if (p.meta?.poolDecision !== 'share') continue;
    const ax = (p.meta.distinguishes || []).filter(x => x.from === p.meta.shareWith).map(x => x.axis);
    if (!ax.length)
      warn(`${p.preset} — shareWith:"${p.meta.shareWith}" 인데 그 상대에 대한 distinguishes 가 없습니다`);
    else if (ax.includes('melody'))
      warn(`${p.preset} — "${p.meta.shareWith}" 와 선율이 다르다면서 같은 풀을 씁니다`);
  }
}
/* ── 분포 요약 ────────────────────────────────────────────────────
   임계값은 여전히 박지 않는다. 대신 **관측된 두 분포를 그대로 보여준다** —
   같은 풀 쌍과 다른 풀 쌍의 거리가 실제로 갈리는지, 겹치는 구간이 어디인지
   사람이 보고 판단할 수 있게. 겹침 구간이 좁아지면 그때 임계를 정한다. */
{
  const same = [], diff = [];
  for (const list of Object.values(bySub)) {
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      const d = dist(vec(list[i]), vec(list[j]));
      (poolSig(list[i]) === poolSig(list[j]) ? same : diff).push(d);
    }
  }
  const st = a => a.length
    ? `쌍 ${String(a.length).padStart(4)}  최소 ${Math.min(...a).toFixed(3)}`
      + `  최대 ${Math.max(...a).toFixed(3)}  평균 ${(a.reduce((s, v) => s + v, 0) / a.length).toFixed(3)}`
    : '없음';
  console.log(`\n  분포 — 같은 풀  ${st(same)}`);
  console.log(`         다른 풀  ${st(diff)}`);
  if (same.length && diff.length) {
    const lo = Math.min(...diff), hi = Math.max(...same);
    console.log(lo > hi
      ? `  ${OK} 두 분포가 겹치지 않습니다 (경계 ${hi.toFixed(3)} ~ ${lo.toFixed(3)}) — 임계를 정할 수 있습니다`
      : `  ⓘ 겹침 구간 ${lo.toFixed(3)} ~ ${hi.toFixed(3)} — 여기 드는 쌍은 사람이 판단할 자리입니다`);
  }
  console.log(`  ⓘ 임계값은 아직 박지 않았습니다. 겹침이 남아 있는 동안 숫자를 정하면`);
  console.log(`    그것이 곧 «지어낸 값» 이 됩니다.`);
}

/* ═══ P8 — 커버리지 ═══ */

head('P8 — 커버리지');
const covered = new Set(profiles.map(x => x.p.preset));

/* 대상에서 빠지는 두 부류. 둘 다 «아직 안 한 것» 이 아니라 «할 것이 없는 것»
   이므로 여기에 이유를 적어 둔다 — 안 그러면 다음 사람이 «336·337 은 왜
   비었나» 를 다시 묻고, 그 답을 모르면 채워 넣게 된다. 그 순간 그것이
   지어낸 값이 된다.

   1. 선율 없음 — Metal 13 · Punk 7. 건반을 안 쓰는 것이 그 장르의 성질이라
      melodyPoolFor() 가 빈 배열을 돌려준다. 빈 것이 곧 결론이다.
   2. 계열 X «예제» — Play Along · Casio Cells. 이 둘은 장르가 아니다.
      Tone.js 의 샘플 로더가 도는지 보여 주려고 둔 데모다(12-example.js —
      drum-samples/CR78/* · casio/* 를 실제로 내려받는다). UI 에서 붉은 칩으로
      따로 표시되는 것도 그래서다. 프로파일의 내용은 «이 세부장르의 구조적
      성질 + 근거(19xx년대 · N곡)» 인데, 데모에는 장르도 없고 근거로 삼을
      곡 무리도 없다. 쓰려면 없는 장르를 지어내야 한다. */
const noMelody = new Set(live.noMelody);
const demo = live.presets.filter(n => live.cat[n] === 'X');
const skip = new Set([...noMelody, ...demo]);
const todo = live.presets.filter(n => !covered.has(n) && !skip.has(n));

console.log(`프로파일 ${covered.size}종 / 대상 ${live.presets.length - skip.size}종`
          + `   (전체 ${live.presets.length}종)`);
console.log(`  제외 · 선율 없음 ${noMelody.size}종 — Metal·Punk (건반을 안 씁니다)`);
console.log(`  제외 · 계열 X   ${demo.length}종 — ${demo.join(' · ')} (장르가 아닌 Tone.js 예제)`);
console.log(`남은 ${todo.length}종${todo.length ? ' — ' + todo.join(' · ') : ''}`);
if (todo.length) warn(`아직 ${todo.length}종에 프로파일이 없습니다 (작업 진행 중이면 정상)`);
else console.log(`${OK} 장르인 프리셋 ${live.presets.length - skip.size}종이 모두 프로파일을 갖습니다`);

/* ═══ 정리 ═══ */

console.log('');
if (errors === 0 && warnings === 0) { console.log(`${OK} 프로파일 검사 통과`); process.exit(0); }
if (errors === 0) { console.log(`${OK} 치명적 문제 없음 · ${WARN} 경고 ${warnings}건`); process.exit(0); }
console.log(`${NG} 프로파일 검사 실패 ${errors}건 · 경고 ${warnings}건`);
console.log(`${WARN} 임계값이나 형식을 고쳐서 통과시키지 마십시오. 원인을 보십시오.`);
process.exit(1);
