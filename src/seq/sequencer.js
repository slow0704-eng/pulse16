/* §10 시퀀서
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ═══ §10  시퀀서 ═══════════════════════════════════════════
   Tone.js 가 있으면 Tone.Transport 가 스텝을 몰고,
   없으면 fbLoop() 가 setInterval 로 직접 스케줄합니다(폴백).
   ═════════════════════════════════════════════════════════ */

/* ── 필인 ──
   fillNow 가 걸린 루프는 마지막 len 스텝을 필인 패턴으로 대체한다.
   드럼만 바꾸고 베이스·건반·기타는 그대로 둔다 — 실제 밴드도 그렇게 친다. */
let fillOn=false, fillNow=null, fillTier='';
/* 작은 필인 / 큰 필인을 따로 돌립니다. 0 이면 그 단은 안 씁니다. */
let fillEvery=4,  fillMode='genre';      // 작은 필인
let fillEveryL=16, fillModeL='genre';    // 큰 필인

/* ── 선율 ──
   1마디 루프를 그냥 반복하면 그루브는 되지만 선율은 안 된다(melody/README.md).
   melNow 가 걸리면 건반 트랙이 여러 루프를 한 바퀴 돌며 연주한다.
   melBar 는 지금 몇 루프째인지 — loopNo 가 아니라 따로 센다.
   재생을 멈췄다 다시 틀어도 선율이 처음부터 시작하는 편이 자연스럽기 때문. */
let melOn=false, melMode='genre', melNow=null, melBar=0, riffNow=null, blineNow=null;

/* ── 겹침(레이어) ──
   한 트랙을 음색 두 겹으로 쌓습니다. 실제 편곡에서 가장 흔한 변주 수단이라
   이게 없으면 선율이 늘 홑겹으로만 들립니다.

     octave  같은 선율 한 옥타브 위 — 두께
     third   3도 위 화성 — 달콤함 (스케일 안에서 움직이므로 자동으로 3도/단3도)
     fifth   5도 위 — 파워코드성. 록·메탈
     counter 아예 다른 선율 — 대선율(counter-melody). 변주 폭이 가장 큼

   layerEng 가 'same' 이면 같은 음색으로 겹칩니다(유니즌 두께).
   다른 음색을 고르면 두 악기가 함께 연주하는 편성이 됩니다. */
let layerMode='off', layerEng='same', melNow2=null;

/* 2번 트랙이 연주할 선율·리프. 1번과 **다른 것**을 뽑는다 —
   같은 것을 뽑으면 트랙을 나눈 의미가 없다. */
let melNowB=null, riffNowB=null;

/* ── 화성 진행 ──
   화성 담당(C)이 만드는 src/data/harmony.js 의 PROG·progPoolFor·chordDegAt·
   chordSemis·snapDeg·COMP·compPoolFor 를 쓴다. 병렬로 작업 중이라 아직
   없을 수도 있으므로 매번 typeof 로 방어한다 — 없으면 조용히 기존 동작
   (진행 없이 P.keys2/원래 2번 선율, 스냅 없는 베이스)으로 빠진다.

   선율과 같은 원칙으로 MEL_BARS(16) 격자에 anchor 를 맞춘다 — 그래야
   진행이 선율·필인·셔플과 같은 자리에서 바뀐다(ARCHITECTURE.md 의
   "셔플 주기" 절과 같은 이유). progNow 는 셔플이 src.keys 를 바꾼
   **뒤**(onLoopWrap 의 셔플 블록 다음)에 뽑아야 장르가 맞는다. */
let progOn=false, progNow=null, progAnchor=0, compNow=null, chordRoot=null;

/** 화성 담당의 PROG 풀에서 다음 진행을 고른다. harmony.js 가 없으면 null */
function pickProg(){
  if(typeof PROG==='undefined' || typeof progPoolFor!=='function') return null;
  const pool=progPoolFor(src.keys);
  if(!pool || !pool.length) return null;
  return PROG[pool[(Math.random()*pool.length)|0]] || null;
}
/** 컴핑 리듬을 고른다. harmony.js 가 없으면 null */
function pickComp(){
  if(typeof COMP==='undefined' || typeof compPoolFor!=='function') return null;
  const pool=compPoolFor(src.keys);
  if(!pool || !pool.length) return null;
  return COMP[pool[(Math.random()*pool.length)|0]] || null;
}

/* ── 선율 길이는 '루프 개수'로 센다 ──
   한 루프가 한 마디다. 선율마다 길이가 다르므로(16·32·64) 고정 상수를
   쓸 수 없다. melLen 은 **지금 걸린 것들 중 가장 긴 것**을 따르고,
   짧은 쪽(리프·베이스)은 그 안에서 되풀이된다 —
   실제 음반에서도 리프는 반복되고 선율만 길게 흐른다.

   melLenPref 는 사용자가 고른 길이('auto'|'16'|'32'|'64')다.
   'auto' 는 장르 풀에 짧은 것과 긴 것을 함께 놓아 섞이게 한다. */
const MEL_BARS=16;                    // 아무것도 안 걸렸을 때의 기본 길이
let melLen=MEL_BARS, melLenPref='auto';
/* 선율 한 바퀴가 시작된 loopNo. 늘 MEL_BARS 의 배수다 —
   이것이 선율을 셔플·필인과 같은 격자에 묶어 두는 고리다. */
let melAnchor=0;

/** 지금 루프에 해당하는 마디. 길이가 다른 라인은 자기 길이로 되풀이된다. */
function barOf(o){ return o.rows[melBar % o.rows.length]; }

/** 지금 걸린 선율·리프·베이스 중 가장 긴 것을 한 바퀴로 삼는다 */
function calcMelLen(){
  const ls=[melNow,riffNow,blineNow,melNow2,melNowB,riffNowB]
             .filter(Boolean).map(o => o.rows.length);
  melLen = ls.length ? Math.max(...ls) : MEL_BARS;
}

/** 이 스텝이 필인 구간이면 필인 패턴을, 아니면 null 을 준다 */
function fillAt(i){
  if(!fillNow) return null;
  const k = i - (STEPS - fillNow.len);
  return k>=0 ? k : null;
}

/** 한 스텝에 울릴 보이스를 전부 발사. 확률로 걸러진 트랙 id 배열을 돌려줌 */
function voicesAt(i,t){
  const jit=()=>H()*(Math.random()*2-1)*0.006;
  /* ── 그루브(arrange.js) ──
     grooveOn 이 꺼져 있으면(기본값) 항상 0/1 을 돌려줘 지금과 똑같이 들린다.
     스윙은 홀수 스텝에만 걸린다(Tone.Transport.swing 도 fbLoop() 도 같다 —
     실측 비교는 arrange.js 의 주석 참고). 이미 t 에 공통으로 걸린 그 스윙량을
     여기서 트랙별 배율(grooveNow.swing)로 다시 조정한다 — 트랙마다 다른
     스윙을 걸려면 "공통으로 걸린 만큼"을 알아야 빼고 다시 얹을 수 있다. */
  const swung = i%2===1;
  const baseSwing = swung ? spb()*(1/6)*(knob('swing')/100) : 0;
  const groove = id => {
    if(!grooveOn || !grooveNow) return 0;
    const off = (grooveNow.off && grooveNow.off[id]) || 0;
    const mul = (grooveNow.swing && grooveNow.swing[id]!=null) ? grooveNow.swing[id] : 1;
    return off + baseSwing*(mul-1);
  };
  const gvel = id => (grooveOn && grooveNow && grooveNow.vel && grooveNow.vel[id]) || 1;
  const skipped=[];
  const fk=fillAt(i);
  TRACKS.forEach(tr => {
    let v, e=eng[tr.id];
    if(fk!==null){
      /* 필인 구간 — 평소 패턴을 무시한다. 필인에 안 적힌 트랙은 쉰다.
         섹션의 off 마스크는 여기 적용하지 않는다 — 필인은 섹션이 바뀐다는
         신호라 섹션 마스크보다 우선한다(arrange.js sectionOff 주석 참고). */
      const row=fillNow.pat[tr.id];
      const c=row ? row[fk] : '-';
      v = c==='X' ? 2 : c==='x' ? 1 : 0;
      if(fillNow.eng && fillNow.eng[tr.id]) e=fillNow.eng[tr.id];
    }else{
      v=P.drums[tr.id][i];
      /* 곡 구조(arrange.js) — 이 섹션에서 꺼진 트랙이면 발사하지 않는다.
         mute[] 는 사용자 상태라 안 건드리고, 여기서만 판정하는 별도
         마스크다. 롤에 찍힌 패턴 자체는 그대로 남는다. */
      if(v && sectionOff(tr.id)) v=0;
    }
    if(!v || mute[tr.id]) return;
    /* 필인은 확률로 빠지면 안 된다 — 구멍이 나면 필인으로 안 들린다 */
    if(fk===null && v===1 && Math.random()>effProb(tr.id)){ skipped.push(tr.id); return; }
    chan[tr.id].gain.value=lvl[tr.id]*sectionLvl(tr.id);
    fireTrack(tr.id, Math.max(t+jit()+groove(tr.id), ctx.currentTime+0.004),
              (v===2?1:0.60)*gvel(tr.id), e);
  });
  /* 베이스도 선율 모드에서는 16마디 라인을 탄다.
     건반·기타와 같은 melBar 를 본다 — 셋이 같은 형식 위에 있어야 곡이 된다. */
  let deg = blineNow ? barOf(blineNow)[i] : P.bass[i];
  /* 화성 진행(progOn) — 강박(4분음표 자리, i%4===0)만 그 마디 화음의 근음으로
     스냅한다. 매 스텝을 스냅하면 베이스라인 고유의 굴곡(경과음·필인)이
     아르페지오로 뭉개진다 — 귀가 화성 근음을 인지하는 자리는 대개 강박이라
     거기만 맞춰도 화성이 들리면서 라인의 모양은 살아남는다. */
  if(deg>=0 && progOn && chordRoot!=null && typeof snapDeg==='function' && i%4===0){
    deg = snapDeg(deg, chordRoot, scaleName);
  }
  if(deg>=0 && !mute.bass && !sectionOff('bass')){
    chan.bass.gain.value=lvl.bass*sectionLvl('bass');
    bassVoice(t+jit()+groove('bass'), deg, spb()*0.25*(knob('gate')/100), eng.bass);
  }

  /* 건반 — 비트마스크의 켜진 음도를 전부 발음 (화음)
     선율 모드면 P.keys 대신 16마디 선율의 '지금 마디'를 읽는다.
     P.keys 를 덮어쓰지 않으므로 선율을 꺼도 사용자가 찍은 패턴이 그대로 남는다. */
  const m = melNow ? barOf(melNow)[i] : P.keys[i];
  if(m && !mute.keys && !sectionOff('keys')){
    chan.keys.gain.value=lvl.keys*sectionLvl('keys');
    if(keysWet) keysWet.gain.value=(KENG[eng.keys]||KENG.pad).chorus||0;
    const kdur=spb()*0.25*(knob('kgate')/100);
    /* 벨로시티 — 예전에는 모든 음이 0.85 고정이라 어느 음이나 똑같이 울렸다.
       사람은 첫 박을 제일 세게, 박머리를 그 다음, 사이 16분을 약하게 친다.
       벨로시티는 음량만이 아니라 필터 깊이·FM 인덱스도 바꾸므로(keysVoice)
       이 한 줄이 음색의 표정을 만든다. */
    const acc = i===0 ? 1.0 : (i%4===0 ? 0.78 : (i%2===0 ? 0.62 : 0.50));
    const kv  = Math.min(1, acc*rnd(0.14*H()));
    /* 화음은 위 음을 조금 여리게 — 실제 연주에서 아래가 더 세다 */
    let vi=0;
    const kbase = keysOct+rootNote+knob('ksemi');
    const kt = t+jit()+groove('keys');
    for(let d=0; d<ROWS; d++) if(m & (1<<d))
      keysVoice(kt, kbase+SCALES[scaleName][d], kdur, kv*Math.pow(0.94,vi++), eng.keys);

    /* 겹침 — 본 선율 위에 한 겹 더 쌓는다.
       조금 여리게(0.72) 하고 살짝 늦게(4ms) 넣어야 두 겹으로 들린다.
       같은 세기·같은 타이밍이면 그냥 한 음이 커진 것처럼만 들린다. */
    if(layerMode!=='off'){
      const le = layerEng==='same' ? eng.keys : layerEng;
      const lm = layerMode==='counter'
        ? (melNow2 ? barOf(melNow2)[i] : 0)
        : m;
      const dOff = layerMode==='third' ? 2 : layerMode==='fifth' ? 3 : 0;
      const semi = layerMode==='octave' ? 12 : 0;
      let li=0;
      for(let d=0; d<ROWS; d++) if(lm & (1<<d)){
        const dd = d + dOff;
        if(dd >= ROWS) continue;                 // 도수를 벗어나면 건너뛴다
        keysVoice(kt+0.004, kbase+SCALES[scaleName][dd]+semi,
                  kdur, kv*0.72*Math.pow(0.94,li++), le);
      }
    }
  }

  /* 기타 — 모노.
     선율 모드면 P.gtr 대신 16마디 리프의 '지금 마디'를 읽는다.
     건반 선율과 같은 melBar 를 본다 — 둘이 같은 형식 위에 있어야 곡이 된다. */
  const gd = riffNow ? barOf(riffNow)[i] : P.gtr[i];
  if(gd>=0 && !mute.gtr && !sectionOff('gtr')){
    chan.gtr.gain.value=lvl.gtr*sectionLvl('gtr');
    guitarVoice(t+jit()+groove('gtr'), gd, spb()*0.25*(knob('ggate')/100), eng.gtr);
  }

  /* ── 2번 트랙(keys2) ──
     progOn 이면 컴핑(화성 반주)으로 전환한다. keys2 는 원래 "1번과 다른
     단선율"을 도는 트랙이었는데, 실측해 보면 선율 라이브러리 35,072 스텝 중
     2음 이상 동시 발음(=화음)은 220개, 0.63% 뿐이라 곡에 화음이 사실상
     한 번도 안 울렸다. 컴핑이 그 자리를 대신하는 편이 훨씬 값어치 있다.
     progOn 이 꺼져 있거나 harmony.js 가 아직 없으면(chordRoot===null)
     기존 동작(2번 선율/패턴)을 그대로 쓴다 — 통합 전에도 앱이 그대로 돈다. */
  if(!mute.keys2 && !sectionOff('keys2') && progOn && chordRoot!=null && compNow
     && typeof chordSemis==='function'){
    /* COMP 항목은 fills.js 의 필인처럼 rows 가 여러 개일 수 있다(몬투노처럼
       마디마다 엇박이 미묘하게 바뀌는 스타일) — barOf() 와 같은 관례로
       (진행과 같은 anchor 인) loopNo-progAnchor 를 rows.length 로 되풀이한다. */
    const compRow = compNow.rows[(loopNo - progAnchor) % compNow.rows.length];
    const c = compRow ? compRow[i] : '-';
    if(c==='X' || c==='x'){
      chan.keys2.gain.value=lvl.keys2*sectionLvl('keys2');
      const semis = chordSemis(chordRoot, scaleName);         // 스케일 토닉 기준 반음 배열
      const kdur2 = spb()*(c==='X'?0.9:0.45)*(knob('kgate')/100);
      const kv2   = (c==='X'?0.62:0.42)*rnd(0.12*H());
      const kbase2= keysOct+rootNote+knob('ksemi');
      const kt2   = t+jit()+groove('keys2');
      semis.forEach((s,vi) => keysVoice(kt2, kbase2+s, kdur2, kv2*Math.pow(0.90,vi), eng.keys2));
    }
  }else{
    const m2 = melNowB ? barOf(melNowB)[i] : P.keys2[i];
    if(m2 && !mute.keys2 && !sectionOff('keys2')){
      chan.keys2.gain.value=lvl.keys2*sectionLvl('keys2');
      const kdur2=spb()*0.25*(knob('kgate')/100);
      const acc2 = i===0 ? 0.92 : (i%4===0 ? 0.72 : 0.52);
      const kv2  = Math.min(1, acc2*rnd(0.14*H()));
      let v2=0;
      const kt2 = t+jit()+groove('keys2');
      for(let d=0; d<ROWS; d++) if(m2 & (1<<d))
        keysVoice(kt2, keysOct+rootNote+knob('ksemi')+SCALES[scaleName][d],
                  kdur2, kv2*Math.pow(0.94,v2++), eng.keys2);
    }
  }
  const gd2 = riffNowB ? barOf(riffNowB)[i] : P.gtr2[i];
  if(gd2>=0 && !mute.gtr2 && !sectionOff('gtr2')){
    chan.gtr2.gain.value=lvl.gtr2*sectionLvl('gtr2');
    guitarVoice2(t+jit()+groove('gtr2'), gd2, spb()*0.25*(knob('ggate')/100), eng.gtr2);
  }
  return skipped;
}
/* ── 킷 셔플 ──────────────────────────────────────────────
   패턴은 그대로 두고 음색 엔진만 루프 경계에서 갈아끼운다.
   틀어놓고 듣는 용도 — 같은 박자가 매 루프 다른 킷으로 들린다.

   샘플이 걸린 트랙은 건너뛴다. eng 를 바꿔도 샘플 재생에는
   영향이 없어서, 바뀐 척만 하고 소리는 그대로이기 때문. */
let shufOn=false, shufEvery=4;

/* 루프를 센 절대 횟수. 킷 셔플과 패턴 셔플이 이 하나를 같이 본다.
   예전에는 각자 자기 카운터를 갖고, 스위치를 켤 때마다 0 으로 되돌렸다.
   그러면 킷을 3루프째, 패턴을 7루프째 켰을 때 둘 다 주기가 4여도
   서로 다른 박에서 바뀌었다. 절대 격자에 맞추면 주기가 같을 때 항상 겹치고,
   4와 8처럼 배수 관계일 때도 8루프마다 함께 바뀐다. */
let loopNo=0;

/** 현재 값을 뺀 나머지 중에서 하나 고름 (같은 값 연속 방지) */
function pickOther(obj, cur){
  const ks=Object.keys(obj).filter(k => k!==cur);
  return ks.length ? ks[(Math.random()*ks.length)|0] : cur;
}
function shuffleKit(){
  let n=0;
  TRACK_IDS.forEach(id => {
    if(smpSel[id] && smpSel[id]!=='synth') return;     // 샘플 트랙은 제외
    eng[id]=pickOther(ENGINES[id], eng[id]); n++;
  });
  /* 베이스는 샘플러 엔진(piano·casio)을 뽑으면 비동기 로딩이 걸리므로 제외 */
  const bassPool={};
  Object.keys(ENGINES.bass).forEach(k => {
    if(k!=='piano' && k!=='casio') bassPool[k]=1;
  });
  eng.bass=pickOther(bassPool, eng.bass);
  eng.keys=pickOther(ENGINES.keys, eng.keys);
  eng.gtr =pickOther(ENGINES.gtr , eng.gtr );
  syncStrips();
  return n;
}

/* ── 패턴 셔플 ──────────────────────────────────────────────
   킷 셔플이 "같은 박자를 다른 음색으로" 라면, 이쪽은 박자 자체를 바꾼다.
   무작위로 357개 전체를 돌면 데스메탈 250 → 보사노바 120 처럼 튀므로,
   **지금 선택된 계열·하위분기 칩 안에서만** 고른다.

   자동 저장을 일부러 건드리지 않는다(markDirty 호출 없음) —
   틀어놓는 동안 사용자가 손으로 만든 패턴이 localStorage 에서
   덮어써지면 안 되기 때문. 셔플을 끄고 새로고침하면 원래 것이 돌아온다. */
let patOn=false, patEvery=4, patBpm='keep', patMode='seq';

/** 지금 칩 필터에 걸린 프리셋 이름들 */
function shufflePool(){
  let pool=LIB_NAMES;
  if(activeCat!=='all') pool=pool.filter(n => catOf(n)===activeCat);
  if(activeSub!=='all') pool=pool.filter(n => subOf(n)===activeSub);
  return pool.length ? pool : LIB_NAMES;
}
function shufflePattern(){
  const pool=shufflePool();
  const cur=src.kick;
  const pick=pool.filter(n => n!==cur);
  const name=(pick.length ? pick : pool)[(Math.random()*(pick.length||pool.length))|0];
  const L=LIB[name];
  if(!L) return null;

  TRACKS.forEach(t => {
    P.drums[t.id]=L.drums[t.id].slice();
    src[t.id]=name;
    if(L.kit[t.id]) eng[t.id]=L.kit[t.id];
    probT[t.id]=L.prob ? (L.prob[t.id] ?? 1) : 1;
  });
  P.bass=L.bass.slice(); src.bass=name;
  P.keys=L.keys.slice();  src.keys=name;
  P.gtr =L.gtr.slice();   src.gtr =name;
  /* 칩을 눌렀을 때와 같은 배선을 탄다 — 안 그러면 셔플로 넘어간 프리셋만
     건반·기타가 이전 음색 그대로 남아 장르가 어긋난다 */
  if(L.kit.keys) eng.keys=L.kit.keys;
  if(L.kit.gtr ) eng.gtr =L.kit.gtr;
  applyPresetLvl(L);
  applyTune(L.tune); applyBassCfg(L.bcfg);
  setKnob('swing',L.swing); setSwing(L.swing);
  if(patBpm==='follow'){ setKnob('bpm',L.bpm); setBpm(L.bpm); }
  /* 샘플은 건드리지 않는다 — 비동기 로딩이 재생 중에 끼어들면 끊긴다 */
  syncAll();
  return name;
}

/* ── 뱅크 이동 ──
   A~D 를 곡 구성(벌스·코러스·브릿지)처럼 쓰는 용법.
   내용이 있는 뱅크만 돈다 — 빈 뱅크로 넘어가면 무음이 되기 때문. */
const bankFilled = b => TRACK_IDS.some(id => b.drums[id].some(v=>v))
                     || b.bass.some(v=>v>=0) || b.keys.some(v=>v) || b.gtr.some(v=>v>=0);
const filledBanks = () => banks.map((b,i) => bankFilled(b) ? i : -1).filter(i => i>=0);
/** 실행취소·자동저장을 건드리지 않는 조용한 뱅크 전환 (셔플 전용) */
function gotoBank(i){
  if(i===bank) return;
  bank=i; P=banks[i];
  document.querySelectorAll('.slot').forEach((s,j) => { s.dataset.on = j===i ? 1 : 0; });
  syncAll();
}
function shuffleBank(rand){
  const f=filledBanks();
  if(f.length<2) return null;                 // 갈 곳이 없으면 그대로
  let next;
  if(rand){
    const others=f.filter(i => i!==bank);
    next=others[(Math.random()*others.length)|0];
  }else{
    const at=f.indexOf(bank);
    next=f[(at<0 ? 0 : at+1) % f.length];
  }
  gotoBank(next);
  return 'ABCD'[next];
}

/** 다음에 칠 필인을 고른다. 모드가 이름이면 그것으로 고정. */
function pickFill(size, mode){
  if(mode!=='genre' && mode!=='all') return FILLS[mode] || null;
  const pool = mode==='genre'
    ? fillPoolFor(src.kick, size)
    : FILL_NAMES.filter(n => FILLS[n].size === size);
  if(!pool.length) return null;
  return FILLS[pool[(Math.random()*pool.length)|0]] || null;
}

/** 대선율용 두 번째 선율 — 본 선율과 겹치지 않게 다른 것을 고른다 */
function pickMelody2(){
  const pool = melodyLenPool(melMode==='genre' ? melodyPoolFor(src.keys) : MELODY_NAMES,
                             melLenPref);
  const other = pool.filter(n => MELODY[n] !== melNow);
  const use = other.length ? other : pool;
  return use.length ? MELODY[use[(Math.random()*use.length)|0]] : null;
}

/** 다음에 연주할 16마디 선율을 고른다. 모드가 이름이면 그것으로 고정. */
function pickMelody(){
  if(melMode!=='genre' && melMode!=='all') return MELODY[melMode] || null;
  const pool = melodyLenPool(melMode==='genre' ? melodyPoolFor(src.keys) : MELODY_NAMES,
                             melLenPref);
  if(!pool.length) return null;          // 메탈처럼 건반을 안 쓰는 장르
  return MELODY[pool[(Math.random()*pool.length)|0]] || null;
}

/** 다음에 칠 16마디 기타 리프를 고른다 */
function pickRiff(){
  if(melMode!=='genre' && melMode!=='all') return RIFF[melMode] || null;
  const pool = melMode==='genre' ? riffPoolFor(src.gtr) : RIFF_NAMES;
  if(!pool.length) return null;
  return RIFF[pool[(Math.random()*pool.length)|0]] || null;
}

/** 2번 기타용 리프 — 1번과 다른 것을 고른다 */
function pickRiff2(){
  const pool = melMode==='genre' ? riffPoolFor(src.gtr) : RIFF_NAMES;
  const other = pool.filter(n => RIFF[n] !== riffNow);
  const use = other.length ? other : pool;
  return use.length ? RIFF[use[(Math.random()*use.length)|0]] : null;
}

/** 다음에 칠 16마디 베이스 라인을 고른다 */
function pickBline(){
  if(melMode!=='genre' && melMode!=='all') return BLINE[melMode] || null;
  const pool = melMode==='genre' ? blinePoolFor(src.bass) : BLINE_NAMES;
  if(!pool.length) return null;
  return BLINE[pool[(Math.random()*pool.length)|0]] || null;
}

/** 루프가 한 바퀴 돌 때마다 호출. 주기가 차면 킷·패턴을 새로 뽑는다 */
function onLoopWrap(){
  loopNo++;

  /* 필인은 '바뀌기 직전 루프의 끝' 에 와야 다음 구간으로 넘겨주는 맛이 난다.
     그래서 loopNo 가 배수인 루프가 아니라 그 **하나 앞** 루프에서 친다.
     주기를 셔플과 같게 맞추면 필인 → 킷·패턴 전환이 이어진다. */
  /* 두 단이 같은 루프에 겹치면 **큰 필인이 이깁니다.**
     16마디째에 작은 필인이 나오면 섹션이 안 넘어간 것처럼 들립니다. */
  const nx = loopNo + 1;
  const bigDue   = fillOn && fillEveryL > 0 && nx % fillEveryL === 0;
  const smallDue = fillOn && fillEvery  > 0 && nx % fillEvery  === 0;
  if(bigDue){        fillNow = pickFill('L', fillModeL); fillTier = '큰'; }
  else if(smallDue){ fillNow = pickFill('S', fillMode);  fillTier = '작은'; }
  else{              fillNow = null;                     fillTier = ''; }

  /* ⚠ 셔플을 **선율보다 먼저** 돌린다.
     shufflePattern() 은 src.keys·src.gtr·src.bass 를 새 프리셋 이름으로 바꾸는데,
     선율 풀은 그 값을 보고 고른다(melodyPoolFor(src.keys)). 순서를 뒤집으면
     같은 루프에서 패턴은 새 장르로 바뀌는데 선율은 **직전 장르**에서 뽑혀
     둘이 어긋난다. 먼저 바꾸고 나서 뽑아야 한 장르로 맞는다. */
  if(shufOn && loopNo % shufEvery === 0) shuffleKit();
  if(patOn  && loopNo % patEvery  === 0){
    if(patMode==='genre'){
      const n=shufflePattern();
      if(n) setStat(`패턴 셔플 → ${n}`);
    }else{
      const b=shuffleBank(patMode==='rand');
      if(b) setStat(`뱅크 ${b}`);
      else  setStat('뱅크 셔플 — 내용이 있는 뱅크가 하나뿐입니다','err');
    }
  }

  /* ── 곡 구조(arrange.js) ── 셔플 뒤, 선율 앞. 형식은 선율과 같은 이유:
     formPoolFor(src.kick) 가 방금 셔플로 바뀐 장르를 보고 골라야 한다. */
  formTick(src.kick, loopNo);
  /* 섹션의 마지막 마디면 큰 필인을 강제한다 — 단, 이번 루프에 이미
     주기적 필인(bigDue/smallDue)이 잡혀 있으면 그쪽을 존중한다(겹치면
     큰 필인이 이긴다는 원칙은 이미 위에서 처리됐다). */
  if(fillTier==='' && sectionWantsFill()){
    const f2 = pickFill('L', fillModeL);
    if(f2){ fillNow=f2; fillTier='섹션 전환'; }
  }
  /* 섹션의 첫 마디면(코러스 진입 등) 채워진 다른 뱅크로 넘어간다.
     뱅크가 하나뿐이면(대부분의 사용자) shuffleBank() 가 조용히 null 을
     돌려주고 아무 일도 안 일어난다. */
  if(sectionWantsBank()){
    const b=shuffleBank(false);
    if(b) setStat(`${sectionLabel()} → 뱅크 ${b}`);
  }

  /* ── 그루브(arrange.js) ── grooveOn 이 꺼져 있으면 grooveNow 는 null 로
     유지된다 — voicesAt() 의 groove() 가 그때 전부 0 을 돌려준다. */
  grooveTick(src.kick);

  /* ── 화성 진행(arrange.js + harmony.js) ──
     선율과 같은 원칙 — 셔플이 src.keys 를 바꾼 **뒤** 뽑아야 장르가 맞는다.
     선율과 같은 MEL_BARS(16) 격자를 그대로 재사용해, 진행이 선율·필인·
     셔플과 같은 자리에서 바뀌게 한다. */
  if(progOn){
    if(!progNow){
      progAnchor = loopNo - (loopNo % MEL_BARS);
      progNow = pickProg(); compNow = pickComp();
    }else if(loopNo - progAnchor >= MEL_BARS){
      progAnchor = loopNo;
      progNow = pickProg(); compNow = pickComp();
    }
    chordRoot = (progNow && typeof chordDegAt==='function')
      ? chordDegAt(progNow, loopNo - progAnchor) : null;
  }else{ progNow=null; compNow=null; chordRoot=null; }

  /* ── 선율도 같은 격자 위에 올린다 ──
     한 루프가 한 마디다. 예전에는 melBar 라는 **자기 카운터**를 따로 세서,
     선율을 켠 시점이 곧 선율 주기의 시작점이었다. 그래서 주기가 같아도
     (선율 16마디 · 패턴 셔플 16루프) 시작점이 달라 서로 다른 박에서 바뀌었다.

     이제 melAnchor 를 격자(MEL_BARS=16 의 배수)에 맞춰 두고
     melBar = loopNo − melAnchor 로 센다. 긴 선율(32·64)도 전부 16의 배수라
     경계가 늘 16격자 위에 떨어진다 — 킷 셔플·패턴 셔플·필인과 같은 자리다.

     대가: 선율을 격자 중간(예: 7루프째)에 켜면 첫 바퀴는 7마디째부터
     들어간다. 한 바퀴 안에 저절로 맞춰지고, 그 뒤로는 계속 붙어 있다.
     (ARCHITECTURE.md 의 «스위치를 켤 때 카운터를 0 으로 되돌리지 말 것» 과 같은 원칙) */
  if(melOn){
    const pickAll = () => {
      melNow=pickMelody(); riffNow=pickRiff(); blineNow=pickBline();
      melNow2 = layerMode==='counter' ? pickMelody2() : null;
      melNowB = pickMelody2(); riffNowB = pickRiff2();
      calcMelLen();
    };
    if(!melNow && !riffNow && !blineNow){
      melAnchor = loopNo - (loopNo % MEL_BARS);   // 격자에 붙여서 시작
      pickAll();
    }else if(loopNo - melAnchor >= melLen){
      melAnchor = loopNo;                          // 이 자리도 16의 배수다
      pickAll();
    }
    melBar = loopNo - melAnchor;
    if(melBar >= melLen) melBar = melLen - 1;      // 안전장치 (풀이 비어 melLen 이 안 바뀐 경우)
  }else{ melNow=null; riffNow=null; blineNow=null; melNow2=null;
       melNowB=null; riffNowB=null; melBar=0; melLen=MEL_BARS; melAnchor=0; }

  syncVariation();          // 필인 구간 · 선율 마디를 화면에 반영
}

function onTick(time){
  const i=step; step=(step+1)%STEPS;
  if(step===0) onLoopWrap();
  const skipped=voicesAt(i,time);
  Tone.Draw.schedule(()=>drawStep(i,skipped), time);
}
/** 폴백 스케줄러 — 140ms 앞까지 미리 채움. 홀수 스텝을 스윙만큼 뒤로 민다 */
function fbLoop(){
  while(fbNext < ctx.currentTime+0.14){
    const six=spb()*0.25;
    const shift=(fbStep%2===1) ? six*(knob('swing')/100)*0.66 : 0;
    const skipped=voicesAt(fbStep, fbNext+shift);
    drawQ.push({i:fbStep, t:fbNext+shift, s:skipped});
    fbStep=(fbStep+1)%STEPS; fbNext+=six;
    if(fbStep===0) onLoopWrap();
  }
}
/** 장르를 바꿨을 때 **곡을 처음부터** 다시 시작한다.

    장르가 바뀌면 어울리는 필인·선율·리프도 같이 바뀌어야 하는데,
    루프 카운터가 이어지면 새 장르가 남의 곡 한가운데에 얹힌다 —
    선율은 9마디째부터 들어가고 큰 필인은 3루프 뒤에 오는 식이다.

    그래서 장르 전환은 «구간의 시작» 으로 다룬다. 카운터를 0 으로 되돌리고
    선율·리프·베이스를 비워, 다음 루프에서 **새 장르 풀** 로 다시 뽑게 한다.
    (셔플이 스스로 장르를 바꿀 때는 부르지 않는다 — 그건 흘러가는 전개다) */
function restartSong(){
  loopNo=0; melAnchor=0; melBar=0;
  melNow=null; riffNow=null; blineNow=null;
  melNow2=null; melNowB=null; riffNowB=null;
  fillNow=null; fillTier='';
  melLen=MEL_BARS;
  /* 곡 구조 · 진행 · 그루브도 "구간의 시작"이다 — 새 장르 풀에서 다시 고른다 */
  formRestart();
  progNow=null; progAnchor=0; compNow=null; chordRoot=null;
  grooveNow=null;

  if(playing){
    step=0;
    if(HAS_TONE){ Tone.Transport.position=0; }
    else{ fbStep=0; fbNext=(ctx?ctx.currentTime:0)+0.08; }
  }
  /* 선율 모드가 켜져 있으면 지금 바로 새 장르에서 뽑아 둔다 —
     다음 루프 경계까지 기다리면 한 바퀴 동안 선율이 비어 있다. */
  if(melOn){
    melNow=pickMelody(); riffNow=pickRiff(); blineNow=pickBline();
    melNow2 = layerMode==='counter' ? pickMelody2() : null;
    melNowB = pickMelody2(); riffNowB = pickRiff2();
    calcMelLen();
  }
  /* 같은 이유로 폼·진행·그루브도 즉시 새로 골라 둔다 (loopNo 는 이미 0) */
  formTick(src.kick, loopNo);
  if(progOn){
    progAnchor=0; progNow=pickProg(); compNow=pickComp();
    chordRoot = (progNow && typeof chordDegAt==='function') ? chordDegAt(progNow,0) : null;
  }
  grooveTick(src.kick);
  if(typeof syncVariation==='function') syncVariation();
}

function start(){
  wake();
  playing=true; step=0;
  UI.play.dataset.on='1'; UI.play.textContent='Stop';
  UI.head.classList.add('on');
  if(HAS_TONE){
    Tone.Transport.position=0;
    Tone.Transport.start('+0.05');
  }else{
    fbStep=0; fbNext=ctx.currentTime+0.08;
    fbTimer=setInterval(fbLoop,25);
    requestAnimationFrame(fbPaint);
  }
}
function stop(){
  playing=false;
  if(HAS_TONE) Tone.Transport.stop();
  else { clearInterval(fbTimer); fbTimer=null; drawQ.length=0; }

  const t = ctx ? ctx.currentTime : 0;
  if(openHat) fadeOut(openHat.gain,t,0.01);
  Object.values(trackPlayer).forEach(p => { try{ p.stop(t+0.02); }catch(e){} });
  if(bassRef){
    bassRef.gains.forEach(g => fadeOut(g.gain,t,0.03));
    bassRef.oscs.forEach(o => { try{ o.stop(t+0.04); }catch(e){} });
  }
  if(piano){ try{ piano.releaseAll(t+0.02); }catch(e){} }
  if(casio){ try{ casio.releaseAll(t+0.02); }catch(e){} }

  openHat=null; bassRef=null; shown=-1; smpOpen=false;
  UI.play.dataset.on='0'; UI.play.textContent='Play';
  UI.head.classList.remove('on');
  clearHits();
}
