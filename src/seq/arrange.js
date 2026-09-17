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

/* ⚠ 기본 켜짐(2026-09-16). 한 바퀴가 인트로·벌스·코러스·아웃트로를 한 번
   도는 것이 «한 곡» 이고, 그 편성 변화가 없으면 길어진 것이 아니라 늘어진
   것이다. 끄면 섹션 마스크가 전부 빠져 예전처럼 들린다. */
let formOn   = true;
let formMode = 'genre';   // 'genre' | 'all' | SONG_FORM 의 이름(고정)

/* ── 폼 사전은 여기 없다 ──
   SONG_FORM · SONG_FORM_POOL_CAT · SONG_FORM_POOL_SUB 는 **생성물**이다
   (src/data/songform.js ← genres/forms/forms.json ← genres/00-form.md).
   arrange.js 보다 먼저 로드되므로 여기서는 그냥 쓴다.

   ⚠ 2026-09-17 에 이 자리에 손으로 쓴 폼 일곱 개가 있었다. 마디 배분이
     **어디에서도 오지 않은 값**이었고, 357종이 계열 12개를 거쳐 그 일곱 개로
     뭉개졌다. 지금은 형식마다 출처가 있고 하위분기 단위로 배정된다.

   ⚠ 그때 세웠던 «총 마디는 전부 정확히 64» 는 **틀렸다.** 12마디 블루스가
     64를 안 나눈다(최소공배수 192). 형식이 음악의 사실이고 선율 길이는
     우리가 만든 눈금이므로, 폼이 선율 길이를 정하는 쪽으로 뒤집었다 —
     폼마다 melLen(64·32·16 중 그 폼을 나누는 가장 긴 것)이 붙어 있다.
     genres/00-form.md §2 · tools/ci/check-song-length.mjs 가 지킨다. */
const SONG_FORM_NAMES = Object.keys(SONG_FORM);

const SECTION_KINDS = ['intro','verse','prechorus','chorus','bridge','break','outro'];
const SECTION_LABEL_KR = {
  intro:'인트로', verse:'벌스', prechorus:'프리코러스', chorus:'코러스',
  bridge:'브릿지', break:'브레이크', outro:'아웃트로',
};

/* ── 계열(cat) 판정 ──
   프리셋 357종 전부가 raw 정의에 cat:'A'~'K' 를 직접 적어 두므로(LIB[name].cat)
   PRESET_CAT(수동 예외표)보다 이쪽이 훨씬 촘촘하다. catOf() 는 ui/build.js 에
   있고 arrange.js 는 sequencer.js 보다 먼저 로드되므로 그 함수에 기대지 않고
   같은 우선순위를 직접 재현한다(LIB.cat > PRESET_CAT > 'K'). */
function catFor(name){
  return (typeof LIB!=='undefined' && LIB[name] && LIB[name].cat) || PRESET_CAT[name] || 'K';
}

/* 폼 풀은 **하위분기 우선 · 계열 폴백**이다.
   src/data/songform.js 의 SONG_FORM_POOL_SUB 키는 '계열:하위분기' 다 —
   하위분기 이름이 계열마다 겹치기 때문이다(E 와 J 둘 다 'House 계열',
   B 와 K 둘 다 '하이브리드 · 인터넷 장르').

   분기를 따로 안 적으면 계열 기본형을 물려받는다. 그것이 곧 «출처가 이 분기를
   따로 말하지 않았다» 는 기록이다(genres/00-form.md §4). */
function formPoolFor(presetName){
  const cat = catFor(presetName);
  const sub = (typeof PRESET_SUB!=='undefined' && PRESET_SUB[presetName]) || '';
  const hit = sub && SONG_FORM_POOL_SUB[cat+':'+sub];
  return (hit && hit.pool) || SONG_FORM_POOL_CAT[cat] || SONG_FORM_NAMES;
}

/** 이 프리셋에 폼이 배정된 근거(있으면). UI 근거 패널이 읽는다 */
function formWhyFor(presetName){
  const cat = catFor(presetName);
  const sub = (typeof PRESET_SUB!=='undefined' && PRESET_SUB[presetName]) || '';
  const hit = sub && SONG_FORM_POOL_SUB[cat+':'+sub];
  return (hit && hit.why) || '';
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
   동시에 켜지는 트랙 수: 인트로 3 · 벌스 5 · 프리코러스 7 · 코러스 10 ·
   브릿지 6 · 브레이크 2 · 아웃트로 4.

   ⚠ lvl 배율만으로는 벌스↔코러스 단구간 라우드니스 차이가 크게 안 났다
   (1차 실측 2.33 LU — 마스터 체인의 글루 컴프·리미터가 구간별 편차를
   눌러 버린다. graph.js §6 의 glueComp/limComp 참고). 그래서 레벨을
   더 벌리는 것과 함께 **벌스에서 트랙을 하나 더 뺐다**(chat) — 압축기를
   거쳐도 살아남는 건 "게인 배율" 보다 "안 울리는 트랙 수" 쪽이다.

   ⚠⚠ 2026-09-16 — **벌스에서 keys 를 되살렸다.** 예전에는 선율이 기본으로
   꺼져 있어 keys 가 «패드 한 겹» 이었고, 그래서 벌스에서 통째로 빼는 것이
   대비를 버는 가장 싼 방법이었다. 지금은 keys 가 **선율 트랙**이다 —
   64마디 선율을 만들어 놓고 벌스·인트로·아웃트로에서 끄면 64마디 중 32마디에
   가락이 없다. 끄는 대신 0.72 로 낮춰 둔다: 코러스의 1.40 과 5.8dB 차이라
   «벌스에서 조용히 흐르다 코러스에서 앞으로 나온다» 가 된다. 대비는 여전히
   chat·clap·perc·keys2·gtr2 다섯 트랙이 만든다. */
const SECTION_RULE = {
  intro:     {off:['snare','clap','ohat','tom','perc','keys','gtr','keys2','gtr2'],
              lvl:{bass:0.80}, fillOut:true,  bank:false},
  verse:     {off:['clap','chat','ohat','tom','perc','keys2','gtr2'],
              lvl:{keys:0.72, gtr:0.62, bass:0.85, snare:0.85}, fillOut:true,  bank:false},
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

/** 지금 걸린 폼이 요구하는 선율 길이(64·32·16). 폼이 없으면 null.

    **폼이 선율 길이를 정한다.** 반대가 아니다 — 형식은 음악의 사실이고
    선율 길이는 우리가 만든 눈금이다(genres/00-form.md §2). 48마디 블루스에
    64마디 선율을 물리면 둘이 192마디마다 한 번만 만나므로, 사용자가 고른
    길이보다 이쪽이 우선한다. 폼을 끄면 사용자 선택으로 돌아간다. */
function formMelLen(){
  return (formOn && formNow && formNow.melLen) || null;
}

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

/* ── accent — 스텝별 세기 배율 (16칸) ────────────────────────────
   vel 은 **트랙당 상수 하나**라 «1·3박이 세고 뒷박이 여리다» 를 표현 못 한다.
   accent 는 마디 안의 자리(스텝)마다 곱하는 배율이다. vel 과 곱해 쓴다.
   자리 번호는 patterns/README.md:26-28 의 규약 그대로 — 0부터, 1박=0 · 2박=4 ·
   3박=8 · 4박=12, 홀수 스텝이 뒷16분(스윙을 받는 자리).

   ── 값을 두 개로만 쓴 이유 ──
   문서에 "스텝별 강약을 몇 배로" 라고 적어 둔 자료는 **없다**(docs 전수 확인).
   그래서 수치를 새로 지어내지 않고, **이미 이 표 안에 있던 두 값**만 재사용한다.
     · 1.06 — laidback 의 vel.snare (이 표에서 가장 큰 기존 강세)
     · 0.90 — mpc 의 vel.chat   (이 표에 있는 유일한 기존 약화)
   자리를 어디로 잡을지만 자료로 정하고, 근거를 못 대는 자리는 **1 로 둔다.**
   (patterns/README.md:27 의 X/x 이분법과도 어긋나지 않게 2단계로 유지)

   ⚠ 음색은 안 건드린다. voice-bass.js·voice-gtr.js 의 vel 인자도 음량만 건다.

   ── vel·accent 가 실제로 걸리는 곳 (예전 주석 정정) ──
   예전에는 «bassVoice()/guitarVoice() 는 세기 인자를 안 받으니 vel.bass·vel.gtr 는
   죽은 값» 이라고 적혀 있었다. 이제 아니다 — 세 함수 모두 마지막에 **선택** 인자
   vel 을 받는다(안 넘기면 예전 소리 그대로).
     bassVoice(t,deg,dur,e,vel) · guitarVoice(t,deg,dur,e,vel) · guitarVoice2(…,vel)
   ⚠ 아직 **호출부가 안 넘긴다** — sequencer.js 를 잇는 것은 별도 작업이다.
     이을 때 곱할 값은  vel[track] * grooveAccent(grooveNow, step)  이다. */
const ACC_HI = 1.06, ACC_LO = 0.90;
/** 자리 목록 → 16칸 배열. 안 적은 자리는 1 */
function accArr(map){
  const a = new Array(16).fill(1);
  for(const k in map) a[+k] = map[k];
  return a;
}
/** 홀수 스텝(뒷16분)만 v, 나머지는 1 인 16칸 배열 */
function accOff16(v, extra){
  const a = new Array(16).fill(1);
  for(let i=1;i<16;i+=2) a[i]=v;
  for(const k in (extra||{})) a[+k] = extra[k];
  return a;
}

const GROOVE = {
  none: {label:'없음(기본)', cat:'X', off:{}, swing:{}, vel:{}},
  /* none 에는 accent 를 일부러 안 넣는다 — 기본 소리가 한 톨도 바뀌면 안 된다 */

  /* 백비트(4·12)를 세운다. 근거: 이 그루브의 label 과 off.snare +12ms 가
     이미 스네어를 백비트 악기로 지목하고 있고, genres/04-rnb-soul-funk.md:24
     Southern Soul «느슨한 백비트, 뒤로 끄는 감», :75 Neo-Soul «뒤로 끄는(laid-back)
     그루브, 고스트 노트». 고스트의 **자리**를 특정한 문장은 없어 뒷16분은 1 로 둔다. */
  laidback: {label:'레이드백 (스네어·하이햇 살짝 뒤)', cat:'A',
    off:{snare:+0.012, chat:+0.005, ohat:+0.005, bass:-0.004},
    swing:{}, vel:{snare:1.06},
    accent: accArr({4:ACC_HI, 12:ACC_HI})},

  /* on the one — 1박만 세우고 나머지 15칸을 통째로 낮춘다.
     근거: genres/04-rnb-soul-funk.md:48-51 «펑크의 강세는 1박입니다. 록의 2·4
     백비트와 정반대라서 … 1박에 킥·베이스·기타·혼을 동시에 꽂고, 나머지 15스텝은
     의도적으로 비우거나 아주 작게 채웁니다», :40 JB Funk «1박 강조(on the one)».
     patterns/00-archetypes.md:232 는 하이햇 액센트가 «불규칙» 이라고 못박으므로
     주기적인 강약을 얹지 않고 1박 대 나머지의 평탄한 대비로만 둔다. */
  pushed: {label:'앞으로 미는 (펑크·훵크)', cat:'D',
    off:{bass:-0.008, kick:-0.003, gtr:-0.006, keys:-0.004},
    swing:{}, vel:{kick:1.05},
    accent: [ACC_HI, ACC_LO,ACC_LO,ACC_LO,ACC_LO,ACC_LO,ACC_LO,ACC_LO,
             ACC_LO,ACC_LO,ACC_LO,ACC_LO,ACC_LO,ACC_LO,ACC_LO,ACC_LO]},

  /* 붐뱁 — 백비트(4·12)가 서고 스윙 받는 뒷16분이 여리다.
     근거: genres/03-hiphop.md:17 «스네어 2·4 고정 … 느슨한 햇»,
     patterns/03-hiphop.md:23-31 «S ----X-------X---» (4·12 만 X),
     같은 블록 «K X--x----X---x---» 는 뒷16분(3·12… 중 3)을 x 로 적는다.
     뒷16분을 낮추는 값 0.90 은 이 그루브가 이미 chat 에 쓰던 vel 과 같은 값이다.
     (이 표의 swing.chat 1.35 가 그 자리를 크게 미는 것과 짝이 된다) */
  mpc: {label:'MPC 스윙 (붐뱁)', cat:'C',
    off:{snare:+0.010, chat:+0.006, keys:-0.004},
    swing:{chat:1.35, snare:0.55, ohat:0.55}, vel:{chat:0.90},
    accent: accOff16(ACC_LO, {4:ACC_HI, 12:ACC_HI})},

  /* 재즈 라이드 — «딩 / 딩-가-딩». 4분음 자리(0·4·8·12)가 «딩», 그 사이
     셋잇단 뒷음 «가» 가 여리다. 근거: genres/06-jazz.md:22-25 «재즈 라이드는
     "딩, 딩-가-딩" 즉 4분 + 셋잇단 8분의 조합입니다», :34 Bebop «라이드 중심,
     킥은 액센트만», :19 «셋잇단 라이드 패턴».
     16그리드에서 셋잇단 뒷음이 놓이는 자리는 스윙이 미는 홀수 스텝이므로
     (이 표의 swing.chat 1.6 이 실제로 그 자리를 민다) 홀수 스텝을 낮춘다. */
  jazzRide: {label:'재즈 라이드 셔플', cat:'F',
    off:{chat:+0.009, bass:-0.005},
    swing:{chat:1.6, bass:0.35, snare:0.5}, vel:{},
    accent: accOff16(ACC_LO, {0:ACC_HI, 4:ACC_HI, 8:ACC_HI, 12:ACC_HI})},

  /* tightGrid 에는 accent 를 **일부러 안 넣는다.**
     patterns/05-electronic.md:23-30 House 는 킥 4개가 전부 같은 X 이고 햇도 전부 x —
     자료가 말하는 성격이 "편차 없음" 이다. genres/05-electronic.md:47-51 이 말하는
     추진력도 «오픈햇 뒷박» 의 존재이지 세기가 아니다. 근거 없이 값을 넣지 않는다. */
  tightGrid: {label:'그리드 고정 (EDM)', cat:'E',
    off:{}, swing:{chat:0, snare:0, ohat:0}, vel:{}},

  /* 원드롭 — 무게중심이 1박이 아니라 3박(스텝 8)이고, 1박은 죽인다.
     근거: genres/09-caribbean.md:25 «킥·스네어가 3박에 동시, 1박은 비움 …
     1박을 비우는 것이 정의», :31-33 «1박에는 아무것도 오지 않습니다. 킥과
     스네어(림샷)가 3박에 동시에 떨어집니다», patterns/09-caribbean.md:23-30
     «K --------X-------» «H --x---x---x---x-».
     뒷박 스캥크 자리(2·6·10·14)를 세우는 근거: genres/09-caribbean.md:17
     «뒷박 스캥크 + 원드롭 계열», :15 «뒷박이 곡의 엔진», 그리고 이 표가 이미
     off.gtr +7ms / off.keys +6ms 로 스캥크 악기를 뒤로 미는 것.
     accent 는 스텝을 비울 수 없으므로 1박은 0.90 까지만 낮춘다. */
  reggaeOneDrop: {label:'원드롭 레이백', cat:'I',
    off:{snare:+0.014, bass:-0.006, gtr:+0.007, keys:+0.006},
    swing:{}, vel:{},
    accent: accArr({0:ACC_LO, 2:ACC_HI, 6:ACC_HI, 8:ACC_HI, 10:ACC_HI, 14:ACC_HI})},
};
const GROOVE_NAMES = Object.keys(GROOVE);

/** 그루브의 스텝별 세기 배율. 없으면 1 을 돌려준다.
    id 는 그루브 **이름**('mpc') 이거나 GROOVE 항목 객체(grooveNow) 둘 다 받는다.
    step 은 16 을 넘어도(마디 누적 스텝) 알아서 접는다. */
function grooveAccent(id, step){
  const g = (id && typeof id === 'object') ? id : GROOVE[id];
  if(!g || !g.accent) return 1;
  const a = g.accent[((step|0) % 16 + 16) % 16];
  return (typeof a === 'number' && isFinite(a) && a > 0) ? a : 1;
}

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
