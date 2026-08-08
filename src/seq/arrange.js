/* §10-A 곡 구조(섹션) · 트랙별 그루브
   시퀀서 담당 D 신규 파일. voice-gtr.js 다음, sequencer.js 앞에 로드된다
   (합의된 로드 순서 — pulse16-mk16.html 에 태그를 넣는 것은 UI 담당(E)의 몫).
   클래식 스크립트라 최상위 선언은 전역 렉시컬 스코프를 공유한다 —
   sequencer.js 의 함수들이 여기서 정의한 전역을 그대로 쓴다.

   ⚠ 이름 충돌 경고 (E 에게 전달할 것):
   원래 합의된 인터페이스는 상수 이름이 `FORM`·`FORM_NAMES` 였다.
   하지만 src/data/melody.js 가 이미 최상위 `const FORM`(AABA·AABB 같은
   프레이즈 결합 폼)을 선언해 두고 있다 — 같은 전역 스코프에서 `const` 를
   두 번 선언하면 `Identifier 'FORM' has already been declared` 로
   전체 스크립트가 죽는다. 그래서 이 파일은 `SONG_FORM`·`SONG_FORM_NAMES` 로
   이름을 바꿨다. UI 를 붙일 때 `FORM` 이 아니라 `SONG_FORM` 을 참조할 것. */
'use strict';

/* ═══ 곡 구조(섹션) ═══════════════════════════════════════════
   지금까지 "곡"을 만드는 장치는 루프 반복 · 킷/패턴 셔플 · 필인 셋뿐이었고
   전부 loopNo % every === 0 형태의 주기 함수라 "지금이 인트로인가 코러스인가"
   라는 상태가 코드 어디에도 없었다. 그래서 밀도가 주기적으로만 바뀌지
   "쌓였다 터지는" 형태가 안 나왔다. 여기서는 그 상태를 명시적인 상태
   기계(지금 어느 폼의 몇 마디째인가)로 끌어올린다.

   loopNo 는 ARCHITECTURE.md 가 명시적으로 되돌리지 말라고 못박은 값이다.
   그래서 섹션 위치는 loopNo 를 되돌리지 않고, loopNo 자체에서 "지금 이
   폼의 몇 번째 마디인가"를 그때그때 계산한다(sectionAt). */

let formOn   = false;     // 곡 구조 사용 여부 — 기본은 꺼짐. 꺼져 있으면 지금과 완전히 같게 들린다.
let formMode = 'genre';   // 'genre' | 'all' | SONG_FORM 의 이름(고정)

/* ── 폼 사전 ──
   총 마디는 16의 배수로 맞춘다 — 선율 라이브러리가 16·32·64마디이고
   MEL_BARS=16 격자 위에서 돌기 때문에(sequencer.js), 폼의 길이가 16의
   배수가 아니면 섹션 경계와 선율/필인/셔플 경계가 계속 어긋난다.
   섹션 길이는 4·8·16마디만 쓴다. */
const SONG_FORM = {
  popAABA:{label:'팝 절-후렴 (짧게)', cat:'band', secs:[
    {k:'intro',bars:4},{k:'verse',bars:8},{k:'prechorus',bars:4},{k:'chorus',bars:8},
    {k:'verse',bars:8},{k:'prechorus',bars:4},{k:'chorus',bars:8},{k:'outro',bars:4},
  ]},                                                                          // 48마디
  popLong:{label:'팝 절-후렴 (브릿지 포함)', cat:'band', secs:[
    {k:'intro',bars:4},{k:'verse',bars:8},{k:'prechorus',bars:4},{k:'chorus',bars:8},
    {k:'verse',bars:8},{k:'prechorus',bars:4},{k:'chorus',bars:8},{k:'bridge',bars:8},
    {k:'chorus',bars:8},{k:'outro',bars:4},
  ]},                                                                          // 64마디
  edmDrop:{label:'EDM 빌드업-드롭', cat:'edm', secs:[
    {k:'intro',bars:8},{k:'prechorus',bars:4},{k:'chorus',bars:8},{k:'break',bars:8},
    {k:'prechorus',bars:4},{k:'chorus',bars:8},{k:'outro',bars:8},
  ]},                                                                          // 48마디. prechorus=빌드업, chorus=드롭, break=브레이크다운
  loopMinimal:{label:'루프 반복형 (힙합·로파이)', cat:'loop', secs:[
    {k:'intro',bars:4},{k:'verse',bars:16},{k:'chorus',bars:8},{k:'verse',bars:16},{k:'outro',bars:4},
  ]},                                                                          // 48마디. 훅이 짧게 한 번만 끼는 반복형
  jazzHead:{label:'재즈 헤드-솔로-헤드', cat:'jazz', secs:[
    {k:'intro',bars:8},{k:'verse',bars:8},{k:'bridge',bars:16},{k:'verse',bars:8},{k:'outro',bars:8},
  ]},                                                                          // 48마디. bridge 자리를 솔로 트레이딩으로 씀
  worldLoop:{label:'월드·라틴 반복형', cat:'world', secs:[
    {k:'intro',bars:8},{k:'verse',bars:16},{k:'chorus',bars:16},{k:'verse',bars:16},{k:'outro',bars:8},
  ]},                                                                          // 64마디
  balladBuild:{label:'발라드 빌드업', cat:'ballad', secs:[
    {k:'intro',bars:8},{k:'verse',bars:16},{k:'prechorus',bars:8},{k:'chorus',bars:16},
    {k:'bridge',bars:8},{k:'chorus',bars:16},{k:'outro',bars:8},
  ]},                                                                          // 80마디
};
const SONG_FORM_NAMES = Object.keys(SONG_FORM);

const SECTION_KINDS = ['intro','verse','prechorus','chorus','bridge','break','outro'];
const SECTION_LABEL_KR = {
  intro:'인트로', verse:'벌스', prechorus:'프리코러스', chorus:'코러스',
  bridge:'브릿지', break:'브레이크', outro:'아웃트로',
};

/* ── 하위분기가 아니라 계열(cat) 단위로 고른다 ──
   프리셋 357종 전부가 raw 정의에 cat:'A'~'K' 를 직접 적어 두므로(LIB[name].cat)
   PRESET_CAT(수동 예외표)보다 이쪽이 훨씬 촘촘하다. catOf() 는 ui/build.js 에
   있고 arrange.js 는 sequencer.js 보다 먼저 로드되므로 그 함수에 기대지 않고
   같은 우선순위를 직접 재현한다(LIB.cat > PRESET_CAT > 'K'). */
function catFor(name){
  return (typeof LIB!=='undefined' && LIB[name] && LIB[name].cat) || PRESET_CAT[name] || 'K';
}

/* A 록 B 팝 C 힙합 D R&B·소울·펑크 E 일렉트로닉 F 재즈
   G 블루스·컨트리·포크 H 라틴 I 카리브 J 아프리카 K 기타지역 X 그 외 */
const SONG_FORM_POOL_CAT = {
  A:['popLong','popAABA','balladBuild'],
  B:['popAABA','popLong'],
  C:['loopMinimal','popAABA'],
  D:['loopMinimal','balladBuild','popAABA'],
  E:['edmDrop','loopMinimal'],
  F:['jazzHead'],
  G:['popAABA','balladBuild','worldLoop'],
  H:['worldLoop','popAABA'],
  I:['worldLoop','loopMinimal'],
  J:['worldLoop','loopMinimal'],
  K:['worldLoop','popAABA'],
  X:['popAABA','loopMinimal'],
};
/** 지금 걸린 프리셋에 어울리는 폼 이름 목록 */
function formPoolFor(presetName){
  return SONG_FORM_POOL_CAT[catFor(presetName)] || SONG_FORM_NAMES;
}

/** f 는 SONG_FORM 항목. bar 는 곡 시작부터의 마디(0부터, loopNo 를 그대로 넘긴다).
    폼 끝에 닿으면 되풀이한다(모듈로) — loopNo 자체는 절대 되돌리지 않는다. */
function sectionAt(f, bar){
  const total = f.secs.reduce((s,x) => s+x.bars, 0);
  const pos = ((bar % total) + total) % total;      // bar 가 음수로 들어올 일은 없지만 방어
  let at = 0;
  for(let idx=0; idx<f.secs.length; idx++){
    const s = f.secs[idx];
    if(pos < at + s.bars){
      const barInSec = pos - at;
      return {k:s.k, idx, bars:s.bars, at, first:barInSec===0, last:barInSec===s.bars-1,
              total, barInSec};
    }
    at += s.bars;
  }
  /* 부동소수 오차 등으로 못 찾으면 마지막 섹션의 끝으로 — 무음보다 낫다 */
  const last = f.secs[f.secs.length-1];
  return {k:last.k, idx:f.secs.length-1, bars:last.bars, at:total-last.bars,
          first:false, last:true, total, barInSec:last.bars-1};
}

/* ── 섹션이 무엇을 바꾸는가 ──
   off  : 이 섹션에서 그 스텝에 발사하지 않을 트랙 id 목록.
          mute[id] 는 사용자 상태라 건드리지 않는다 — 대신 voicesAt() 안에서만
          판정하는 별도 마스크로 둔다(sectionOff). 사용자가 롤에 찍은 패턴은
          그대로 남고, 폼을 끄면 즉시 원래대로 다 들린다.
   lvl  : 이 섹션에서 그 트랙의 레벨 배율(사용자의 lvl[] 값에 곱한다). 없으면 1.
   fillOut : 이 섹션의 마지막 마디에 큰 필인을 강제할지.
   bank    : 이 섹션의 첫 마디에 다른(채워진) 패턴 뱅크로 넘어갈지.

   드럼 7트랙 + bass·keys·gtr·keys2·gtr2 = 총 12개 id 기준으로 셌을 때
   동시에 켜지는 트랙 수: 인트로 3 · 벌스 4 · 프리코러스 7 · 코러스 10 ·
   브릿지 6 · 브레이크 2 · 아웃트로 4. (최종 보고의 실측표 참고)

   ⚠ lvl 배율만으로는 벌스↔코러스 단구간 라우드니스 차이가 크게 안 났다
   (1차 실측 2.33 LU — 마스터 체인의 글루 컴프·리미터가 구간별 편차를
   눌러 버린다. graph.js §6 의 glueComp/limComp 참고). 그래서 레벨을
   더 벌리는 것과 함께 **벌스에서 트랙을 하나 더 뺐다**(chat) — 압축기를
   거쳐도 살아남는 건 "게인 배율" 보다 "안 울리는 트랙 수" 쪽이다. */
const SECTION_RULE = {
  intro:     {off:['snare','clap','ohat','tom','perc','keys','gtr','keys2','gtr2'],
              lvl:{bass:0.80}, fillOut:true,  bank:false},
  verse:     {off:['clap','chat','ohat','tom','perc','keys','keys2','gtr2'],
              lvl:{gtr:0.62, bass:0.85, snare:0.85}, fillOut:true,  bank:false},
  prechorus: {off:['clap','tom','perc','keys2','gtr2'],
              lvl:{gtr:1.10, keys:1.10}, fillOut:true,  bank:false},
  chorus:    {off:['tom','perc'],
              lvl:{gtr:1.55, keys:1.40, keys2:1.25, gtr2:1.25, snare:1.20, bass:1.15,
                   chat:1.15, clap:1.10},
              fillOut:true,  bank:true},
  bridge:    {off:['clap','ohat','tom','perc','keys2','gtr2'],
              lvl:{keys:1.15, gtr:0.90}, fillOut:true,  bank:false},
  break:     {off:['kick','snare','clap','ohat','tom','bass','keys','gtr','keys2','gtr2'],
              lvl:{}, fillOut:true,  bank:false},
  outro:     {off:['snare','clap','ohat','tom','perc','gtr','keys2','gtr2'],
              lvl:{keys:0.75, bass:0.80}, fillOut:false, bank:false},
};

/* ── 내부 상태 — 지금 걸린 폼과 지금 섹션 ──
   sectionLabel() 이 인자 없이 "지금"을 답해야 하므로 캐시가 필요하다.
   sequencer.js 의 onLoopWrap() 이 loopNo 가 바뀔 때마다 formTick() 을
   불러 이 캐시를 갱신한다(선율·필인과 같은 자리에서). */
let formNow=null, sectionNow=null;

/** 다음에 쓸 폼을 고른다. 모드가 이름이면 그것으로 고정 */
function pickForm(presetName){
  if(formMode!=='genre' && formMode!=='all') return SONG_FORM[formMode] || null;
  const pool = formMode==='genre' ? formPoolFor(presetName) : SONG_FORM_NAMES;
  if(!pool.length) return null;
  return SONG_FORM[pool[(Math.random()*pool.length)|0]] || null;
}
/** loopNo 가 바뀔 때마다 sequencer.js 가 부른다. 폼이 없으면 고르고,
    있으면 그대로 두고 지금 섹션만 다시 계산한다. */
function formTick(presetName, loopNo){
  if(!formOn){ formNow=null; sectionNow=null; return null; }
  if(!formNow) formNow = pickForm(presetName);
  if(!formNow){ sectionNow=null; return null; }
  sectionNow = sectionAt(formNow, loopNo);
  return sectionNow;
}
/** 장르가 바뀌었을 때(restartSong) 폼을 처음부터 다시 고르게 비운다 */
function formRestart(){ formNow=null; sectionNow=null; }

/** UI 표시용 — 예: '코러스 3/8' */
function sectionLabel(){
  if(!formOn || !sectionNow) return '';
  const nm = SECTION_LABEL_KR[sectionNow.k] || sectionNow.k;
  return `${nm} ${sectionNow.barInSec+1}/${sectionNow.bars}`;
}

/** 이 트랙이 지금 섹션에서 꺼져 있는가(필인 구간에는 적용하지 않는다 —
    필인은 섹션이 바뀐다는 신호라 섹션의 off 마스크보다 우선한다) */
function sectionOff(id){
  if(!formOn || !sectionNow) return false;
  const r = SECTION_RULE[sectionNow.k];
  return !!(r && r.off && r.off.includes(id));
}
/** 지금 섹션의 레벨 배율. 기본 1(안 바뀜) */
function sectionLvl(id){
  if(!formOn || !sectionNow) return 1;
  const r = SECTION_RULE[sectionNow.k];
  return (r && r.lvl && r.lvl[id]) || 1;
}
/** 지금이 섹션의 마지막 마디이고, 그 섹션이 필인으로 넘겨야 하는 자리인가 */
function sectionWantsFill(){
  if(!formOn || !sectionNow || !sectionNow.last) return false;
  const r = SECTION_RULE[sectionNow.k];
  return !!(r && r.fillOut);
}
/** 지금이 섹션의 첫 마디이고, 그 섹션이 뱅크를 바꿔야 하는 자리인가 */
function sectionWantsBank(){
  if(!formOn || !sectionNow || !sectionNow.first) return false;
  const r = SECTION_RULE[sectionNow.k];
  return !!(r && r.bank);
}


/* ═══ 트랙별 그루브 · 마이크로타이밍 ═══════════════════════════
   지금까지 스윙은 전역 값 하나뿐이었다(HAS_TONE 이면 Tone.Transport.swing,
   폴백이면 fbLoop() 의 six*(swing/100)*0.66). 트랙별 타이밍은 jit() 무작위
   지터 하나뿐이고 건반·기타·베이스에는 그것조차 없었다. 실제 밴드는
   악기마다 일관되게 앞/뒤로 붙는다 — 무작위 지터로는 그 "그루브"가 안 나온다
   (무작위는 느슨함이지 그루브가 아니다).

   ⚠ Tone 스윙 vs 폴백 스윙 실측 비교 (Tone.js 14.7.77 소스 직접 확인)
   Tone.Transport._processTick() 의 실제 공식:
     s = (e % (2*swingTicks)) / (2*swingTicks)
     n = sin(s*PI) * swingAmount
     shift = seconds(2*swingTicks/3 ticks) * n
   swingSubdivision 을 '16n' 으로 두면(graph.js:386) swingTicks = ppq/4 이고,
   홀수(스윙 받는) 16분음표에서는 s=0.5, sin(0.5π)=1 이라 n=swingAmount 그대로.
   shift = seconds(ppq/6 ticks) = spb()/6 * swingAmount.
   즉 Tone 쪽 오프셋 = spb() * 0.16667 * (swing/100).

   폴백(fbLoop, sequencer.js): shift = six*(swing/100)*0.66, six=spb()*0.25
   = spb() * 0.165 * (swing/100).

   0.165 vs 0.16667 — 상대 오차 1.0%. BPM 120·스윙 100 기준으로도
   차이는 spb(0.5s)*0.0017 ≈ 0.83ms 뿐이다. **버그라고 부를 정도는 아니다**
   (1% 오차, 1ms 미만) — 하지만 정확히 같지도 않다. 0.66 은 2/3(0.6667)의
   반올림값으로 보인다. 정확히 맞추고 싶다면 0.66 을 1/6*4=0.66667 로
   바꾸면 된다(사이드 이펙트는 없다 — 이 파일 소유가 아니라 여기 기록만 남긴다).

   ── 오프셋 단위를 초로, BPM 과 무관하게 고정한 이유 ──
   스윙(서브디비전 셔플)은 이미 spb() 에 비례해 tempo 를 따라간다(위 공식).
   반면 "이 그루브"의 오프셋(off)은 사람이 악기를 앞/뒤로 미는 성향이다.
   실제 세션 연주자의 타이밍 오차(운동 제어의 편차)는 템포가 바뀌어도
   절대 시간 상 거의 일정하다고 알려져 있다(느리게 친다고 그 오차가
   비례해서 커지지 않는다) — 그래서 off 는 초 단위 절대값으로 고정하고
   BPM 을 따라가게 하지 않는다. swing 배율(트랙별 스윙 세기)만 spb() 에
   비례하게 두어, 셔플이라는 "박 안에서의 비율" 개념과 구분한다. */

let grooveOn=false, grooveMode='genre', grooveNow=null;

const GROOVE = {
  none: {label:'없음(기본)', cat:'X', off:{}, swing:{}, vel:{}},

  laidback: {label:'레이드백 (스네어·하이햇 살짝 뒤)', cat:'A',
    off:{snare:+0.012, chat:+0.005, ohat:+0.005, bass:-0.004},
    swing:{}, vel:{snare:1.06}},

  /* ⚠ vel 은 fireTrack() 의 v 인자(드럼)와 keysVoice() 의 vel 인자에만 실제로
     걸린다. bassVoice()/guitarVoice() 는 세기 인자를 안 받는 시그니처라
     (voice-bass.js·voice-gtr.js 는 이 파일 소유가 아니라 손 못 댐)
     vel.bass·vel.gtr 를 적어도 죽은 값이 된다 — 그래서 여기 안 적는다. */
  pushed: {label:'앞으로 미는 (펑크·훵크)', cat:'D',
    off:{bass:-0.008, kick:-0.003, gtr:-0.006, keys:-0.004},
    swing:{}, vel:{kick:1.05}},

  mpc: {label:'MPC 스윙 (붐뱁)', cat:'C',
    off:{snare:+0.010, chat:+0.006, keys:-0.004},
    swing:{chat:1.35, snare:0.55, ohat:0.55}, vel:{chat:0.90}},

  jazzRide: {label:'재즈 라이드 셔플', cat:'F',
    off:{chat:+0.009, bass:-0.005},
    swing:{chat:1.6, bass:0.35, snare:0.5}, vel:{}},

  tightGrid: {label:'그리드 고정 (EDM)', cat:'E',
    off:{}, swing:{chat:0, snare:0, ohat:0}, vel:{}},

  reggaeOneDrop: {label:'원드롭 레이백', cat:'I',
    off:{snare:+0.014, bass:-0.006, gtr:+0.007, keys:+0.006},
    swing:{}, vel:{}},
};
const GROOVE_NAMES = Object.keys(GROOVE);

const GROOVE_POOL_CAT = {
  A:['none','laidback','pushed'],
  B:['none','tightGrid'],
  C:['mpc','laidback','none'],
  D:['pushed','laidback','none'],
  E:['tightGrid','none'],
  F:['jazzRide','laidback'],
  G:['laidback','pushed','none'],
  H:['pushed','laidback'],
  I:['reggaeOneDrop','laidback','none'],
  J:['pushed','laidback','none'],
  K:['laidback','none'],
  X:['none'],
};
/** 지금 걸린 프리셋에 어울리는 그루브 이름 목록 */
function groovePoolFor(presetName){
  return GROOVE_POOL_CAT[catFor(presetName)] || GROOVE_NAMES;
}

/** 다음에 쓸 그루브를 고른다. 모드가 이름이면 그것으로 고정 */
function pickGroove(presetName){
  if(grooveMode!=='genre' && grooveMode!=='all') return GROOVE[grooveMode] || null;
  const pool = grooveMode==='genre' ? groovePoolFor(presetName) : GROOVE_NAMES;
  if(!pool.length) return null;
  return GROOVE[pool[(Math.random()*pool.length)|0]] || null;
}
/** grooveOn 이 켜져 있는데 아직 안 골랐으면 고른다. sequencer.js 가
    onLoopWrap() · restartSong() 에서 부른다. */
function grooveTick(presetName){
  if(!grooveOn){ grooveNow=null; return null; }
  if(!grooveNow) grooveNow = pickGroove(presetName);
  return grooveNow;
}
