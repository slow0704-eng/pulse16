/* §9 베이스 보이스
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ── 현 베이스 (핑거 · 픽 · 슬랩 · 업라이트) ──
   합성 베이스 5종과 달리 실제 현을 모델링합니다. string.js 의 코어를 씁니다.
   기타와 마찬가지로 모노이고, 새 음이 나면 이전 음을 왼손으로 죽입니다.

   Blend·Drive·X-Over·Tone 노브는 배음부를 만드는 합성 베이스용이라
   여기서는 안 씁니다. 대신 Drive 만 앰프 앞단 게인으로 살려 둡니다 —
   손가락 세게 뜯은 소리에서 픽 베이스까지 이어지는 축으로 쓸 수 있습니다. */
const bassBuf=makeStringCache(20);
let bassStrRef=null;

function stringBass(t,midi,dur,e){
  const S=BSTR[e], hz=440*Math.pow(2,(midi-69)/12);

  if(bassStrRef){
    try{ fadeOut(bassStrRef.g.gain,t,0.012); }catch(err){}
    try{ bassStrRef.s.stop(t+0.02); }catch(err){}
    bassStrRef=null;
  }

  const buf=bassBuf(e+'|'+midi, hz, S);
  const rel=0.16;
  const end=t+Math.min(buf.duration,dur+rel)+0.08;
  const bd=knob('bdrv')/100;
  const v=0.9*rnd(0.08*H())*(0.75+bd*0.5);

  const g=acqGain(); retire(g,'gain',end+0.05);
  g.connect(ampIn[S.amp]||chan.bass);

  const s=ctx.createBufferSource();
  s.buffer=buf;
  const cents=(Math.random()*2-1)*3*H();
  if(s.detune) s.detune.value=cents;
  else s.playbackRate.value=Math.pow(2,cents/1200);
  s.connect(g); s.start(t); s.stop(end);
  s.onended=()=>{ try{s.disconnect();}catch(err){} };

  /* 어택 6ms — 기타(1.5ms)보다 느립니다. 실제 베이스 현이 굵어 그렇기도 하고,
     현 베이스는 크레스트가 25dB(합성 베이스 11~19dB)라 뜯는 순간의 첨두가
     그대로 마스터 트루피크를 먹습니다. Death Metal 처럼 베이스가 킥과 같은
     자리를 칠 때 둘이 겹쳐 0 dBFS 를 넘겼습니다.(측정 확인) */
  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(v,t+0.006);
  hold(g.gain,t+dur,v);
  g.gain.exponentialRampToValueAtTime(Math.max(v*0.02,1e-5),t+dur+rel);
  g.gain.linearRampToValueAtTime(0,t+dur+rel+0.02);

  bassStrRef={g,s};
  retire({disconnect:()=>{ if(bassStrRef && bassStrRef.g===g) bassStrRef=null; }},'x',end+0.05);
}

/* ── 관 베이스 (튜바) ──
   현도 신스도 아니라 별도 경로입니다. 밴다·마리아치·뉴올리언스에서
   베이스를 튜바가 맡습니다(genres 문서 4회 언급).

   관악은 숨으로 밀어 넣는 악기라 어택이 40ms 로 느리고, 끝도 뚝 끊기지
   않고 숨이 빠지듯 잦아듭니다. 이 두 가지가 없으면 그냥 둔한 신스입니다.
   배음은 원뿔관이라 정수배가 다 나오되 8배음 위로 급히 죽습니다. */
let tubaRef=null;
function windBass(t,midi,dur){
  const hz=440*Math.pow(2,(midi-69)/12);
  if(tubaRef){
    try{ fadeOut(tubaRef.g.gain,t,0.03); }catch(err){}
    tubaRef.oscs.forEach(o => { try{ o.stop(t+0.05); }catch(err){} });
    tubaRef=null;
  }
  const atk=0.040, rel=0.10, end=t+dur+rel+0.15, oscs=[];
  const g=G('bass',end);

  /* 원뿔관 배음 — 1/n 로 떨어지고 8배음 위는 로우패스가 정리 */
  const lp=BQ('lowpass',Math.min(hz*9,900),0.707,end);
  lp.connect(g);
  [[1,1.00],[2,0.52],[3,0.30],[4,0.18],[5,0.10],[6,0.06]].forEach(([m,a])=>{
    if(hz*m>4000) return;
    const o=osc('sine',t,dur+rel+0.1);
    o.frequency.setValueAtTime(hz*m*rnd(0.004*H()),t);
    const og=acqGain(); og.gain.value=a; retire(og,'gain',end+0.05);
    o.connect(og).connect(lp); oscs.push(o);
  });

  /* 숨소리 — 관악의 어택을 만드는 성분 */
  const be=t+0.09, bg=G('bass',be), bf=BQ('bandpass',420,0.9,be);
  env(bg,t,0.055*rnd(0.15*H()),0.07,0.012); bf.connect(bg); tapNoise(bf,be);

  const v=0.62*rnd(0.07*H());
  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(v,t+atk);
  hold(g.gain,t+dur,v);
  g.gain.setTargetAtTime(0,t+dur,rel/3);       // 숨이 빠지듯
  g.gain.linearRampToValueAtTime(0,t+dur+rel);

  tubaRef={g,oscs};
  retire({disconnect:()=>{ if(tubaRef && tubaRef.g===g) tubaRef=null; }},'x',end+0.05);
}

/* ── 합성 베이스 ──
   공통: 사인 서브(gsub) + 배음부(gh). 배음부는 드라이브·X-Over·Tone 을 거칩니다.
   엔진별로 mixIn 에 들어가는 소스만 달라집니다. */
function bassVoice(t,deg,dur,e){
  const midi = baseOct + rootNote + knob('bsemi') + SCALES[scaleName][deg];

  /* 샘플러 계열은 별도 경로 */
  if(e==='piano' || e==='casio'){
    const inst  = (e==='piano') ? piano : casio;
    const ready = (e==='piano') ? pianoReady : casioReady;
    if(ready && inst){
      try{
        const nm = NOTES[((midi%12)+12)%12] + (Math.floor(midi/12)-1);
        inst.triggerAttackRelease(nm, Math.max(dur,0.25), t, 0.85);
      }catch(err){}
    }else{
      loadSampler(e);
    }
    return;
  }

  /* 현 베이스 계열 — 기타와 같은 현 코어로 굽고 베이스 앰프로 보낸다.
     서브 오실레이터를 안 쓴다. 실제 베이스는 그런 게 없고,
     현 모델의 기음이 이미 최강 배음이라 덧붙이면 오히려 뭉갠다. */
  if(BSTR[e]) return stringBass(t,midi,dur,e);
  if(e==='tuba') return windBass(t,midi,dur);

  /* 모노 신스 — 이전 음을 짧게 페이드아웃 */
  /* 이전 노트의 주파수 — 포르타멘토의 출발점 */
  const prevHz = (bassRef && bassRef.live) ? bassRef.hz : null;
  if(bassRef && bassRef.live){
    /* 글라이드 중이면 새 노트가 이전 피치에서 출발하므로 짧게 넘긴다 */
    const ft = (knob('bglide')/100 > 0.01) ? 0.006 : 0.010;
    bassRef.gains.forEach(g => fadeOut(g.gain,t,ft));
    bassRef.oscs.forEach(o => { try{ o.stop(t+ft+0.005); }catch(err){} });
    bassRef.live=false;
  }

  const hz    = 440*Math.pow(2,(midi-69)/12);
  const is808 = (e==='s808');
  const blend = knob('bmix')/100, bd = knob('bdrv')/100, vel = rnd(0.06*H());
  const gl    = knob('bglide')/100;
  const xo    = Math.max(knob('xover'), hz*1.15);
  const end   = t+dur+0.7, oscs=[];

  /* 글라이드 = 진짜 포르타멘토.
     이전 음의 주파수에서 출발해 이번 음으로 미끄러진다.
     (예전에는 항상 목표음보다 위에서 내려와, 상행 선율이 거꾸로 들렸다) */
  const glTime = 0.015 + gl*0.16;
  const doGlide = gl>0.01 && prevHz && Math.abs(prevHz-hz) > 0.5;
  const setPitch=(param,mult)=>{
    if(doGlide){
      param.setValueAtTime(prevHz*mult,t);
      param.exponentialRampToValueAtTime(hz*mult,t+glTime);
    }else{
      param.setValueAtTime(hz*mult,t);
    }
  };

  /* 서브 — 808 은 길게 감쇠, 그 외는 서스테인 유지 */
  const gsub=G('bass',end);
  const pS=(is808?0.88:0.70)*(1-blend*(is808?0.40:0.55))*vel;
  if(is808){
    gsub.gain.setValueAtTime(0,t);
    gsub.gain.linearRampToValueAtTime(pS,t+0.005);
    gsub.gain.exponentialRampToValueAtTime(Math.max(pS*0.0015,1e-5),t+dur);
    gsub.gain.linearRampToValueAtTime(0,t+dur+0.03);
  }else{
    gsub.gain.setValueAtTime(0,t);
    gsub.gain.linearRampToValueAtTime(pS,t+0.007);
    gsub.gain.setTargetAtTime(pS*0.82,t+0.05,0.17);
    hold(gsub.gain,t+dur*0.90, expAt(pS,pS*0.82,0.17,dur*0.90-0.05));
    gsub.gain.linearRampToValueAtTime(0,t+dur*0.90+0.05);
  }
  const so=osc('sine',t,dur+0.6); setPitch(so.frequency,1); so.connect(gsub); oscs.push(so);

  /* 배음부 */
  const hDur=is808?Math.min(dur*0.35,0.26):dur*0.84;
  const gh=G('bass',end);
  const pH=(is808?0.34:0.42)*(0.28+blend*1.05)*vel;
  gh.gain.setValueAtTime(0,t);
  gh.gain.linearRampToValueAtTime(pH,t+0.006);
  gh.gain.setTargetAtTime(pH*(is808?0.35:0.58),t+0.03,is808?0.06:0.10);
  hold(gh.gain,t+hDur, expAt(pH, pH*(is808?0.35:0.58), is808?0.06:0.10, hDur-0.03));
  gh.gain.linearRampToValueAtTime(0,t+hDur+0.04);

  const mixIn=acqGain(); mixIn.gain.value=1; retire(mixIn,'gain',end+0.05);
  const preLP=BQ('lowpass',3600,0.707,end);
  const dGain=acqGain(); dGain.gain.value=0.75+bd*1.6; retire(dGain,'gain',end+0.05);
  /* Drive 구간이 넓어지도록 4단계로. 0~15 는 거의 깨끗한 k=1.1 */
  const shIdx = bd<0.15?0 : bd<0.40?1 : bd<0.70?2 : 3;
  const sh=shaperNode(shIdx,end);
  /* mkCurve 는 tanh(kx)/tanh(k) 라 원점 기울기가 k/tanh(k) 만큼 커진다.
     그만큼 되돌리지 않으면 Drive 노브가 커브를 갈아탈 때 +3dB 씩 튄다. */
  const mk=acqGain();
  mk.gain.value = 1/(CURVE_GAIN[shIdx]*(1+bd*0.9));
  retire(mk,'gain',end+0.05);
  const dc=BQ('highpass',20,0.707,end);
  const xoHP1=BQ('highpass',xo,0.707,end), xoHP2=BQ('highpass',xo,0.707,end);
  const tone=BQ('lowpass',knob('btone'),0.707,end);
  mixIn.connect(preLP).connect(dGain).connect(sh).connect(mk)
       .connect(dc).connect(xoHP1).connect(xoHP2).connect(tone).connect(gh);

  /* 엔진별 소스 */
  if(is808){
    [[2,0.55,'sine'],[3,0.26,'sine'],[4,0.12,'triangle']].forEach(([m,a,ty])=>{
      const o=osc(ty,t,dur+0.6); setPitch(o.frequency,m);
      const g=acqGain(); g.gain.value=a; retire(g,'gain',end+0.05);
      o.connect(g).connect(mixIn); oscs.push(o);
    });
    const ce=t+0.03, cg=G('bass',ce), cf=BQ('bandpass',1700,1.2,ce);   // 808 특유의 클릭
    env(cg,t,0.16*vel,0.018,0.0006); cf.connect(cg); tapNoise(cf,ce);
  }else if(e==='sub'){
    [[2,0.50,'triangle'],[3,0.20,'sine'],[4,0.10,'sine'],[6,0.04,'sine']].forEach(([m,a,ty])=>{
      if(hz*m>12000) return;
      const o=osc(ty,t,dur+0.6); setPitch(o.frequency,m);
      const g=acqGain(); g.gain.value=a; retire(g,'gain',end+0.05);
      o.connect(g).connect(mixIn); oscs.push(o);
    });
  }else if(e==='acid'){
    /* 303 은 18dB/oct 다이오드 래더 + 높은 레조넌스.
       biquad 는 12dB/oct 뿐이라 레조넌스단 + 스커트단 2개로 근사한다.
       컷오프 상한이 hz*9(A1 에서 495Hz)라 배음이 다 잘려나가
       실제로 들리던 고역은 전부 셰이퍼가 만든 왜곡이었다 → hz*54 로 확대. */
    const o=osc('sawtooth',t,dur+0.6); setPitch(o.frequency,1);
    const top=Math.min(hz*54,5200), bot=Math.max(hz*4,240);
    const tau=Math.min(dur*0.30,0.35);
    const f1=BQ('lowpass',top,Q_DB(8.0),end);      // 레조넌스 — 303 스퀄치
    const f2=BQ('lowpass',top,Q_BUTTER,end);       // 스커트 — 합계 24dB/oct
    [f1,f2].forEach(f=>{
      f.frequency.setValueAtTime(top,t);
      f.frequency.setTargetAtTime(bot,t,tau);
    });
    /* 선형 Q 8 의 피크가 +18dB 이므로 그만큼 되돌린다 */
    const comp=acqGain(); comp.gain.value=0.16; retire(comp,'gain',end+0.05);
    o.connect(f1).connect(f2).connect(comp).connect(mixIn); oscs.push(o);
  }else if(e==='moog'){
    /* 무그 계열 모노 신스 베이스 — 톱니+사각을 24dB 래더에 통과시킨 소리.
       acid 와 다른 점은 레조넌스를 얕게(Q 1.6) 두고 컷오프를 덜 닫는 것.
       acid 가 "꾸르륵" 이라면 이쪽은 "두툼" 입니다.
       펑크·신스팝·디스코의 베이스 라인. */
    const top=Math.min(hz*16,2600), bot=Math.max(hz*3.2,150);
    const f1=BQ('lowpass',top,Q_DB(1.6),end);
    const f2=BQ('lowpass',top,Q_BUTTER,end);        // 합계 24dB/oct
    const tau=Math.min(dur*0.45,0.30);
    [f1,f2].forEach(f=>{
      f.frequency.setValueAtTime(top,t);
      f.frequency.setTargetAtTime(bot,t,tau);
    });
    const mixg=acqGain(); mixg.gain.value=0.42; retire(mixg,'gain',end+0.05);
    [['sawtooth',1,0.62,0],['square',1,0.34,-6],['sawtooth',2,0.14,4]].forEach(([ty,m,a,det])=>{
      const o=osc(ty,t,dur+0.6);
      setPitch(o.frequency,m); o.detune.value=det;
      const og=acqGain(); og.gain.value=a; retire(og,'gain',end+0.05);
      o.connect(og).connect(mixg); oscs.push(o);
    });
    mixg.connect(f1).connect(f2).connect(mixIn);
  }else if(e==='fm'){
    /* 모듈레이션 인덱스 I = 편차/모듈레이터주파수.
       기존 (hz*2)/(hz*3.01) = 0.66 은 살짝 흔들리는 사인일 뿐 벨이 아니다. */
    const car=osc('sine',t,dur+0.6), mod=osc('square',t,dur+0.6);
    const mg=acqGain(); retire(mg,'gain',end+0.05);
    setPitch(car.frequency,2);
    setPitch(mod.frequency,3.01);          // 모듈레이터에도 글라이드 (기존 누락 — C:M 비율이 깨졌었다)
    mg.gain.setValueAtTime(hz*6.0,t);      // I ≈ 2.0
    mg.gain.exponentialRampToValueAtTime(hz*0.40,t+Math.min(dur*0.55,0.6));
    mod.connect(mg).connect(car.frequency); car.connect(mixIn); oscs.push(car,mod);
  }else{   // reese
    /* 두 가지를 함께 고친다.
       ① 통과대역 — hz*7 은 A1 에서 385Hz 라 X-Over(120Hz) 와 겹쳐 1.2옥타브뿐이었다.
          오실레이터 배음이 270Hz 위에서 전멸해 고역이 전부 왜곡 산물이었다 → hz*72.
       ② 디튠 — cent 고정은 낮은 음일수록 비트가 느려진다(C1 에서 주기 2.4초).
          목표 비트 주파수를 정하고 cent 를 역산한다. */
    const top=Math.min(hz*72,6500), bot=Math.max(hz*12,700);
    const f=BQ('lowpass',top,Q_DB(4.0),end);
    f.frequency.setValueAtTime(top,t);
    f.frequency.setTargetAtTime(bot,t,Math.min(dur*0.35,0.4));
    const beat=3.0;                                            // 목표 3Hz
    const c=Math.min(1200*Math.log2(1+beat/hz),60);            // 상한 60 cent
    const mixg=acqGain(); mixg.gain.value=0.34; retire(mixg,'gain',end+0.05);
    /* 세 톱니를 좌·우·중앙으로 갈라 모노 진폭 비팅이 아닌 이미지 회전이 되게 */
    [[1,0,0],[1,c,-0.75],[2,-c*0.6,0.75]].forEach(([m,det,pan])=>{
      const o=osc('sawtooth',t,dur+0.6);
      setPitch(o.frequency,m); o.detune.value=det;
      if(pan && ctx.createStereoPanner){
        const p=ctx.createStereoPanner(); p.pan.value=pan;
        retire({disconnect:()=>{ try{p.disconnect();}catch(e){} }},'x',end+0.05);
        o.connect(p).connect(mixg);
      } else o.connect(mixg);
      oscs.push(o);
    });
    mixg.connect(f).connect(mixIn);
  }

  /* live 플래그로 풀 반환 후의 죽은 참조를 구분한다 */
  bassRef={gains:[gsub,gh], oscs, hz, live:true};
  const myRef=bassRef;
  retire({disconnect:()=>{ if(bassRef===myRef) bassRef.live=false; }},'x',end+0.05);
}
