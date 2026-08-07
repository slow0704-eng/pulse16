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
  const skipped=[];
  const fk=fillAt(i);
  TRACKS.forEach(tr => {
    let v, e=eng[tr.id];
    if(fk!==null){
      /* 필인 구간 — 평소 패턴을 무시한다. 필인에 안 적힌 트랙은 쉰다. */
      const row=fillNow.pat[tr.id];
      const c=row ? row[fk] : '-';
      v = c==='X' ? 2 : c==='x' ? 1 : 0;
      if(fillNow.eng && fillNow.eng[tr.id]) e=fillNow.eng[tr.id];
    }else{
      v=P.drums[tr.id][i];
    }
    if(!v || mute[tr.id]) return;
    /* 필인은 확률로 빠지면 안 된다 — 구멍이 나면 필인으로 안 들린다 */
    if(fk===null && v===1 && Math.random()>effProb(tr.id)){ skipped.push(tr.id); return; }
    chan[tr.id].gain.value=lvl[tr.id];
    fireTrack(tr.id, Math.max(t+jit(), ctx.currentTime+0.004), v===2?1:0.60, e);
  });
  /* 베이스도 선율 모드에서는 16마디 라인을 탄다.
     건반·기타와 같은 melBar 를 본다 — 셋이 같은 형식 위에 있어야 곡이 된다. */
  const deg = blineNow ? barOf(blineNow)[i] : P.bass[i];
  if(deg>=0 && !mute.bass){
    chan.bass.gain.value=lvl.bass;
    bassVoice(t, deg, spb()*0.25*(knob('gate')/100), eng.bass);
  }

  /* 건반 — 비트마스크의 켜진 음도를 전부 발음 (화음)
     선율 모드면 P.keys 대신 16마디 선율의 '지금 마디'를 읽는다.
     P.keys 를 덮어쓰지 않으므로 선율을 꺼도 사용자가 찍은 패턴이 그대로 남는다. */
  const m = melNow ? barOf(melNow)[i] : P.keys[i];
  if(m && !mute.keys){
    chan.keys.gain.value=lvl.keys;
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
    for(let d=0; d<ROWS; d++) if(m & (1<<d))
      keysVoice(t, kbase+SCALES[scaleName][d], kdur, kv*Math.pow(0.94,vi++), eng.keys);

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
        keysVoice(t+0.004, kbase+SCALES[scaleName][dd]+semi,
                  kdur, kv*0.72*Math.pow(0.94,li++), le);
      }
    }
  }

  /* 기타 — 모노.
     선율 모드면 P.gtr 대신 16마디 리프의 '지금 마디'를 읽는다.
     건반 선율과 같은 melBar 를 본다 — 둘이 같은 형식 위에 있어야 곡이 된다. */
  const gd = riffNow ? barOf(riffNow)[i] : P.gtr[i];
  if(gd>=0 && !mute.gtr){
    chan.gtr.gain.value=lvl.gtr;
    guitarVoice(t, gd, spb()*0.25*(knob('ggate')/100), eng.gtr);
  }

  /* ── 2번 트랙 ──
     1번과 **다른 선율/리프**를 돈다. 반대쪽으로 팬을 벌려 자리를 나눈다.
     선율 모드가 꺼져 있으면 프리셋이 적어 둔 패턴(대개 비어 있음)을 쓴다. */
  const m2 = melNowB ? barOf(melNowB)[i] : P.keys2[i];
  if(m2 && !mute.keys2){
    chan.keys2.gain.value=lvl.keys2;
    const kdur2=spb()*0.25*(knob('kgate')/100);
    const acc2 = i===0 ? 0.92 : (i%4===0 ? 0.72 : 0.52);
    const kv2  = Math.min(1, acc2*rnd(0.14*H()));
    let v2=0;
    for(let d=0; d<ROWS; d++) if(m2 & (1<<d))
      keysVoice(t, keysOct+rootNote+knob('ksemi')+SCALES[scaleName][d],
                kdur2, kv2*Math.pow(0.94,v2++), eng.keys2);
  }
  const gd2 = riffNowB ? barOf(riffNowB)[i] : P.gtr2[i];
  if(gd2>=0 && !mute.gtr2){
    chan.gtr2.gain.value=lvl.gtr2;
    guitarVoice2(t, gd2, spb()*0.25*(knob('ggate')/100), eng.gtr2);
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
