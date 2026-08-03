/* §9-B 건반 · 신스
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ═══ §9-B  건반 · 신스 ═════════════════════════════════════ */

/* 랜덤 위상 밴드리미티드 파형.
   OscillatorNode 는 항상 위상 0 에서 출발해, 유니슨·배음이 전부 정렬되면
   어택 순간 크레스트가 최대가 된다(톱니 7개면 +8.5dB). 위상을 흩어 방지한다. */
const WAVES={};
function randWave(kind,n=64){
  const re=new Float32Array(n+1), im=new Float32Array(n+1);
  for(let k=1;k<=n;k++){
    const a = kind==='square' ? (k%2 ? 1/k : 0) : 1/k;     // 사각파는 홀수 배음만
    const p = Math.random()*Math.PI*2;
    re[k]=a*Math.sin(p); im[k]=a*Math.cos(p);
  }
  return ctx.createPeriodicWave(re,im);
}
function waveBank(kind){
  if(!WAVES[kind]) WAVES[kind]=Array.from({length:8},()=>randWave(kind));
  return WAVES[kind][(Math.random()*8)|0];
}
function oscW(kind,t,d){
  const o=ctx.createOscillator();
  if(kind==='sine'||kind==='triangle') o.type=kind;
  else o.setPeriodicWave(waveBank(kind));
  o.start(t); o.stop(t+d);
  o.onended=()=>{ try{o.disconnect();}catch(e){} };
  return o;
}

/** 서스테인·릴리스가 있는 ADSR. dur 을 미리 알므로 전 구간을 예약한다. */
function adsr(p,t,dur,A,D,S,R,peak){
  A=Math.max(A,0.0015);
  const off=t+Math.max(dur,A+0.01);
  p.setValueAtTime(0,t);
  p.linearRampToValueAtTime(peak,t+A);
  p.setTargetAtTime(peak*S, t+A, Math.max(D,0.005)/3);
  hold(p,off,peak*S);
  p.setTargetAtTime(0, off, Math.max(R,0.01)/3);
  p.linearRampToValueAtTime(0, off+R*1.6);
  return off+R*1.6;
}

/** 24dB/oct 로우패스 — 4차 버터워스 Q 스태거(0.5412 / 1.3066).
    레조넌스는 2단에만. lowpass 의 Q 는 dB 단위이므로 Q_DB 로 변환. */
function lp24(hz,R,end){
  const a=BQ('lowpass',hz,Q_DB(0.5412),end);
  const b=BQ('lowpass',hz,Q_DB(1.3066*Math.max(R,0.1)),end);
  a.connect(b);
  return {in:a,out:b,fp:[a.frequency,b.frequency]};
}

/* ═══ 질감 보정 — 신스 패치와 악기를 가르는 두 가지 ═══════════
   실제 곡과 견줘 "합성 티가 난다" 는 원인이 대부분 이 둘입니다.

   ① 음역 보정(key scaling)
      실제 악기는 낮은 음이 어둡고 길며, 높은 음이 밝고 짧습니다.
      피아노 저음은 10초를 울리고 고음은 1초도 못 갑니다.
      이게 없으면 어느 음이나 똑같은 길이·밝기로 울려 곧바로 들통납니다.
      kt = 필터가 음정을 따라가는 비율 (0=고정, 1=완전 추종)
      kd = 음정이 오를수록 감쇠가 짧아지는 비율

   ② 몸통 공명(body resonance)
      어쿠스틱 악기는 통·관·막대가 특정 대역을 키웁니다. 피아노 향판,
      색소폰 관의 포먼트, 마림바 공명관, 아코디언 리드 박스.
      로우패스 하나로는 절대 안 나오는 성분이라, 발음체와 몸통을 나눠
      발음체 → 로우패스 → 몸통(peaking 여러 개) 순으로 통과시킵니다.
   ═════════════════════════════════════════════════════════ */
const KEYS_TEX = {
  /*                kt    kd   body:[[Hz, Q, dB], …]  */
  piano    :{kt:0.42,kd:0.78,body:[[120,1.6,3.5],[260,2.0,2.5],[1500,1.0,2.0]]},
  ep       :{kt:0.45,kd:0.50,body:[[800,1.2,2.5],[2400,1.4,3.0]]},
  clav     :{kt:0.70,kd:0.40,body:[[900,1.6,3.0],[2200,1.8,3.5]]},
  marimba  :{kt:0.55,kd:0.70,body:[[300,2.2,4.0],[900,1.6,2.5]]},
  vibes    :{kt:0.28,kd:0.50,body:[[400,2.0,3.5],[1200,1.4,2.0]]},
  steelpan :{kt:0.50,kd:0.50,body:[[250,1.8,3.0],[700,1.6,3.5]]},
  sax      :{kt:0.55,kd:0.20,body:[[700,1.4,4.5],[1400,1.6,3.5],[2800,1.2,2.5]]},
  harmonica:{kt:0.60,kd:0.20,body:[[1200,1.6,3.5],[2400,1.4,2.5]]},
  accordion:{kt:0.50,kd:0.15,body:[[500,1.4,3.0],[1600,1.2,2.0]]},
  bandoneon:{kt:0.45,kd:0.15,body:[[350,1.6,3.5],[1100,1.2,2.0]]},
  strings  :{kt:0.45,kd:0.30,body:[[300,1.6,2.5],[800,1.2,2.0],[2400,1.0,1.5]]},
  horns    :{kt:0.55,kd:0.25,body:[[500,1.4,3.0],[1200,1.2,2.5],[2500,1.0,2.0]]},
  /* 보코더의 포먼트. 음정을 안 따라가는 것이 핵심입니다 —
     모음은 성도(聲道) 모양이 정하는 것이라 음높이와 무관합니다.
     kt 를 0 으로 두어 필터도 안 따라가게 합니다. 'ah~oh' 사이 모음.

     ⚠ formant 는 body 와 **다른 회로**입니다. body 는 peaking 을 직렬로 잇는데,
     직렬 peaking 은 기울기만 바꿔서 **포먼트 사이의 골을 못 만듭니다.**
     계측에서 부스트가 +3.5~+8.7dB 뿐이라 톱니의 −6dB/oct 경사를 못 이기고
     봉우리가 아예 안 섰습니다. 병렬 밴드패스를 가중합해야 골이 생깁니다.
     (Plaits `naive_speech_synth.cc` 가 Q≈20 밴드패스를 병렬로 씁니다.
      docs/mutable-차용.md ★1) */
  vocoder  :{kt:0.05,kd:0.10, dry:0.18,
             formant:[[ 350, 6.0,0.55],   // 기음을 실어 나르는 낮은 대역
                      [ 650,14.0,1.00],   // F1
                      [1000,16.0,0.80],   // F2
                      [2450,18.0,0.70],   // F3
                      [3400,16.0,0.45]]}, // F4
  /* 하프시코드는 얕은 나무 상자 — 저역 공명이 거의 없고 중고역만 */
  harpsi   :{kt:0.65,kd:0.55,body:[[700,1.6,2.5],[2000,1.4,3.5]]},
  /* 오르간은 몸통이 없습니다 — 전기 신호가 스피커로 바로 갑니다.
     음역 보정도 거의 없습니다(드로바는 음역과 무관하게 같은 배음). */
  organ    :{kt:0.10,kd:0.05},
  /* 신스는 원래 음역 보정이 약한 것이 정체성입니다 */
  pad      :{kt:0.30,kd:0.20},
  supersaw :{kt:0.30,kd:0.20},
  lead     :{kt:0.35,kd:0.20},
  poly     :{kt:0.35,kd:0.25},
  pluck    :{kt:0.50,kd:0.55},
  bell     :{kt:0.40,kd:0.55},
};
const TEX_DEFAULT={kt:0.40,kd:0.35};

let keysVox=[];
function keysVoice(t,midi,dur,vel,name){
  /* 때린 현·막대는 가산합성을 구워 쓴다 — FM 으로는 배음이 일곱 번째쯤에서
     끊겨 "인공적인 패드" 로 들린다. (src/audio/struck.js) */
  if(typeof STRUCK!=="undefined" && STRUCK[name]) return struckVoice(t,midi,dur,vel,name);

  const E=KENG[name]||KENG.pad, hz=440*Math.pow(2,(midi-69)/12);
  const X=KEYS_TEX[name]||TEX_DEFAULT;

  /* C4(midi 60) 기준 음정 배율 → 필터 추종·감쇠 단축 */
  const kt  = Math.pow(2,(midi-60)/12);
  const ktF = Math.pow(kt, X.kt);
  const ktD = Math.pow(kt, -X.kd);
  const fHz = Math.min(E.f.hz*ktF, 16000);
  const dcy = E.a.d*ktD, rel = E.a.r*ktD;

  /* 보이스 스틸 — 오래된 것부터 */
  while(keysVox.length>=E.poly){
    const v=keysVox.shift();
    try{ fadeOut(v.vca.gain,t,0.008); }catch(e){}
    v.oscs.forEach(o=>{ try{o.stop(t+0.02);}catch(e){} });
  }

  const life=dur+rel*1.6+0.15, end=t+life, oscs=[];
  const vca=G('keys',end);
  const mix=acqGain(); mix.gain.value=E.mixG; retire(mix,'gain',end+0.05);
  const hp =BQ('highpass',E.hp,Q_BUTTER,end);
  const F  =lp24(fHz,E.f.R,end);
  mix.connect(hp).connect(F.in);

  /* 발음체 → 로우패스 → 몸통 공명 → VCA.
     몸통은 음정을 따라가지 않습니다 — 통의 크기는 고정이니까요.
     이 점이 필터(음정을 따라감)와 몸통(고정)의 결정적 차이입니다. */
  let node=F.out;
  if(X.formant){
    /* 포먼트는 **병렬**이라야 합니다 — 직렬로 이으면 골이 안 생깁니다.
       dry 를 조금 섞는 것은 좁은 밴드패스만 남으면 콤 필터처럼
       속이 비기 때문입니다. 실제 보코더도 밴드 수가 유한해 원음이 샙니다. */
    const sum=acqGain(); sum.gain.value=1; retire(sum,'gain',end+0.05);
    X.formant.forEach(([fh,fq,fa])=>{
      const b=BQ('bandpass',fh,fq,end);
      const fg=acqGain(); fg.gain.value=fa; retire(fg,'gain',end+0.05);
      node.connect(b); b.connect(fg); fg.connect(sum);
    });
    if(X.dry){
      const dg=acqGain(); dg.gain.value=X.dry; retire(dg,'gain',end+0.05);
      node.connect(dg); dg.connect(sum);
    }
    node=sum;
  }else if(X.body) X.body.forEach(([bh,bq,bd])=>{
    const b=BQ('peaking',bh,bq,end,bd);
    node.connect(b); node=b;
  });
  node.connect(vca);

  /* 필터 엔벨로프 — 벨로시티가 깊이를 바꾼다 */
  if(E.f.env>0) F.fp.forEach(p=>{
    p.setValueAtTime(fHz,t);
    p.linearRampToValueAtTime(fHz+E.f.env*ktF*(0.35+0.65*vel), t+E.f.ea);
    /* 지속 레벨에도 벨로시티를 먹인다. 이게 없으면 clav·pluck 처럼
       필터가 5ms 안에 닫히는 엔진에서 세게 친 음과 여리게 친 음이
       곧바로 같은 밝기로 수렴한다 — 어택비 0.87~0.99 로 측정됐다. */
    p.setTargetAtTime(fHz+E.f.env*ktF*E.f.es*(0.55+0.45*vel), t+E.f.ea, E.f.ed/3);
  });
  if(E.flfo){
    const l=osc('sine',t,life); l.frequency.value=E.flfo.hz;
    const g=acqGain(); retire(g,'gain',end+0.05);
    g.gain.setValueAtTime(0,t);
    g.gain.linearRampToValueAtTime(E.flfo.depth, t+(E.flfo.dly||0)+0.2);
    F.fp.forEach(p=>g.connect(p)); l.connect(g); oscs.push(l);
  }

  if(E.fm){
    E.fm.forEach(([cr,mr,I0,I1,tau,g])=>{
      const car=oscW('sine',t,life), mod=oscW('sine',t,life);
      car.frequency.setValueAtTime(hz*cr,t);
      mod.frequency.setValueAtTime(hz*mr,t);
      const mg=acqGain(); retire(mg,'gain',end+0.05);
      /* 벨로시티가 모듈레이션 인덱스를 바꾼다 — 로즈의 정의 */
      const I=I0*(0.25+0.75*vel*vel);
      mg.gain.setValueAtTime(I*hz*mr,t);
      mg.gain.exponentialRampToValueAtTime(Math.max(I1*(0.45+0.55*vel)*hz*mr,1), t+tau);
      mod.connect(mg).connect(car.frequency);
      const cg=acqGain(); cg.gain.value=g; retire(cg,'gain',end+0.05);
      car.connect(cg).connect(mix); oscs.push(car,mod);
    });
  }else{
    E.osc.forEach(([semi,kind,g,cent,pan])=>{
      const o=oscW(kind,t,life);
      o.frequency.setValueAtTime(hz*Math.pow(2,semi/12),t);
      o.detune.setValueAtTime(cent,t);
      const og=acqGain(); og.gain.value=g; retire(og,'gain',end+0.05);
      o.connect(og);
      if(pan && ctx.createStereoPanner){
        const p=ctx.createStereoPanner(); p.pan.value=pan;
        retire({disconnect:()=>{try{p.disconnect();}catch(e){}}},'x',end+0.05);
        og.connect(p).connect(mix);
      }else og.connect(mix);
      if(E.drift){                       /* 아날로그 드리프트 — 오실레이터마다 무상관 */
        const d=osc('sine',t,life);
        d.frequency.value=0.09+Math.random()*0.21;
        const dg=acqGain(); dg.gain.value=E.drift; retire(dg,'gain',end+0.05);
        d.connect(dg).connect(o.detune); oscs.push(d);
      }
      oscs.push(o);
    });
  }

  if(E.click){                           /* 플럭 어택 · 오르간 키클릭 */
    const [f,q,dec,amp]=E.click, ce=t+dec+0.02;
    const cg=G('keys',ce), cf=BQ('bandpass',f,q,ce);
    env(cg,t,amp*vel,dec,0.0008); cf.connect(cg); tapNoise(cf,ce);
  }
  if(E.vib){                             /* 지연 후 서서히 걸리는 비브라토 */
    const l=osc('sine',t,life); l.frequency.value=E.vib.hz;
    const g=acqGain(); retire(g,'gain',end+0.05);
    g.gain.setValueAtTime(0,t);
    g.gain.setValueAtTime(0,t+E.vib.dly);
    g.gain.linearRampToValueAtTime(E.vib.cent, t+E.vib.dly+E.vib.ramp);
    l.connect(g); oscs.filter(o=>o.detune).forEach(o=>g.connect(o.detune));
    oscs.push(l);
  }

  /* 감쇠·릴리스에 음역 보정을 먹인다 — 높은 음일수록 짧게 */
  adsr(vca.gain, t, dur, E.a.a, dcy, E.a.s, rel, E.peak*(0.35+0.65*vel));
  const rec={vca,oscs};
  keysVox.push(rec);
  retire({disconnect:()=>{ const i=keysVox.indexOf(rec); if(i>=0) keysVox.splice(i,1); }},
         'x', end+0.1);
}
