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

function stringBass(t,midi,dur,e,vel){
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
  /* vel — 선택 인자. 안 넘기면 1 이 곱해져 예전과 한 샘플도 안 달라진다.
     ⚠ 음량만 건다. 세게 칠수록 밝아지는 음색 연동은 여기서 안 한다. */
  const v=0.9*rnd(0.08*H())*(0.75+bd*0.5)*(vel??1);

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
function windBass(t,midi,dur,vel){
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
  env(bg,t,0.055*rnd(0.15*H())*(vel??1),0.07,0.012); bf.connect(bg); tapNoise(bf,be);

  /* vel — 선택 인자. 숨소리도 같은 배율로 줄여야 **음량만** 바뀐다.
     기음만 줄이면 여리게 칠수록 바람소리만 남아 음색이 변한다. */
  const v=0.62*rnd(0.07*H())*(vel??1);
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
/* vel — **선택** 인자(0~1 남짓). 안 넘기면 어디서도 1 이 곱해져
   예전 소리와 한 샘플도 안 달라진다. 음량만 건다 — 세게 칠수록 밝아지는
   음색 연동(필터 컷오프·드라이브)은 일부러 안 넣었다. */
function bassVoice(t,deg,dur,e,vel){
  const midi = baseOct + rootNote + knob('bsemi') + SCALES[scaleName][deg];

  /* 샘플러 계열은 별도 경로 */
  if(e==='piano' || e==='casio'){
    const inst  = (e==='piano') ? piano : casio;
    const ready = (e==='piano') ? pianoReady : casioReady;
    if(ready && inst){
      try{
        const nm = NOTES[((midi%12)+12)%12] + (Math.floor(midi/12)-1);
        inst.triggerAttackRelease(nm, Math.max(dur,0.25), t, 0.85*(vel??1));
      }catch(err){}
    }else{
      loadSampler(e);
    }
    return;
  }

  /* 현 베이스 계열 — 기타와 같은 현 코어로 굽고 베이스 앰프로 보낸다.
     서브 오실레이터를 안 쓴다. 실제 베이스는 그런 게 없고,
     현 모델의 기음이 이미 최강 배음이라 덧붙이면 오히려 뭉갠다. */
  if(BSTR[e]) return stringBass(t,midi,dur,e,vel);
  if(e==='tuba') return windBass(t,midi,dur,vel);

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
  /* vAmp — 예전엔 이 자리 이름이 vel 이었다. 인자 vel 과 이름이 겹쳐 바꿨을 뿐,
     인자를 안 넘기면 (vel??1)=1 이라 값이 그대로다. */
  const blend = knob('bmix')/100, bd = knob('bdrv')/100, vAmp = rnd(0.06*H())*(vel??1);
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

  /* ── 지속 레벨 ──
     s808 의 어택/지속비가 22.6dB 이고 나머지 합성 베이스가 6.2dB 인 진짜
     이유입니다. s808 은 서브가 dur 동안 0.15% 까지 지수 감쇠하는데,
     나머지는 0.17초 만에 82% 로 눌러앉아 그대로 버팁니다. 뜯는 소리가
     안 나는 것이 당연합니다.

     다만 **대부분은 이대로가 맞습니다.** 하우스·테크노·리즈의 베이스는
     끝까지 버티는 것이 정체성이라 다 같이 감쇠시키면 장르가 망가집니다.
     그래서 BSYN 의 sus:[레벨, tau] 필드가 **있는 엔진만** 바꿉니다.
     필드가 없으면 예전 값(0.82 / 0.17초) 그대로입니다. */
  const _S = (typeof BSYN!=='undefined') && BSYN[e];
  const susS = (_S && _S.sus) ? _S.sus[0] : 0.82;
  const susT = (_S && _S.sus) ? _S.sus[1] : 0.17;
  /* 배음부는 예전에 0.58/0.82 = 0.71 의 비였다. 그 비를 지킨다. */
  const susH = (_S && _S.sus) ? _S.sus[0]*0.71 : (is808?0.35:0.58);

  /* 서브 — 808 은 길게 감쇠, 그 외는 서스테인 유지 */
  const gsub=G('bass',end);
  const pS=(is808?0.88:0.70)*(1-blend*(is808?0.40:0.55))*vAmp;
  if(is808){
    gsub.gain.setValueAtTime(0,t);
    gsub.gain.linearRampToValueAtTime(pS,t+0.005);
    gsub.gain.exponentialRampToValueAtTime(Math.max(pS*0.0015,1e-5),t+dur);
    gsub.gain.linearRampToValueAtTime(0,t+dur+0.03);
  }else{
    gsub.gain.setValueAtTime(0,t);
    gsub.gain.linearRampToValueAtTime(pS,t+0.007);
    gsub.gain.setTargetAtTime(pS*susS,t+0.05,susT);
    hold(gsub.gain,t+dur*0.90, expAt(pS,pS*susS,susT,dur*0.90-0.05));
    gsub.gain.linearRampToValueAtTime(0,t+dur*0.90+0.05);
  }
  const so=osc('sine',t,dur+0.6); setPitch(so.frequency,1); so.connect(gsub); oscs.push(so);

  /* 배음부 */
  const hDur=is808?Math.min(dur*0.35,0.26):dur*0.84;
  const gh=G('bass',end);
  /* ── 배음 가지 메이크업 [실측으로 정한 값] ──
     이 상수가 없을 때, 합성 베이스는 **엔진이 무엇이든 똑같은 소리가 났습니다.**
     A1(55Hz) 한 음을 공장 초기값(Blend 38 · X-Over 105)으로 렌더해서
     두 가지를 따로 재 보면:

         서브 사인(gsub)만  −10.6 dB
         배음부(gh)만       −29.4 dB   ← 엔진 전체가 여기 들어 있다

     즉 **엔진이 사인파보다 18.8dB 아래**였습니다. Blend 를 100 까지
     끝까지 밀어도 −8.1dB 로 여전히 사인이 이깁니다. 사용자가 들은
     «공에서 바람 빠지는 소리» 는 이것입니다 — 무슨 엔진을 골라도
     실제로 들리는 것은 55Hz 사인 하나였습니다.
     sub·moog·acid·pluckbs·buzz 의 지속 RMS 가 소수점까지 −9.7dB 로
     같았던 것이 증거입니다.

     이득법이 의도한 비는 −5.8dB 인데(pS=0.554 대 pH=0.285) 실측이
     −18.8dB 인 것은, gh 가 사슬 **끝**에 달려서 그 앞의 셰이퍼 보정(mk)·
     X-Over 2단·톱니의 기음 손실이 전부 누적되기 때문입니다.
     gh 는 셰이퍼 뒤라 여기를 올려도 왜곡이 더 생기지 않습니다.

     목표: 기본값에서 배음이 서브보다 5dB 아래(들리되 서브가 중심을 잡는다).
       −18.8 → −5.0 이므로 +13.8dB = ×4.9.
     808 은 예외입니다. 808 의 정체성이 «길게 끄는 거의 순수한 사인» 이라
     같이 올리면 장르가 아예 달라집니다. −15.3 → −9 만, ×2.1 로 둡니다. */
  const HMAKE = is808 ? 2.1 : 4.2;
  /* 4.9(= 정확히 −5.0dB 목표) 에서 4.2 로 0.7 낮췄습니다. 4.9 로 재면
     합성군의 피크가 +0.7~+1.7dBFS 로 올라갑니다 — 배음부에 진짜 과도가
     생겼다는 뜻이라 자체는 좋은 신호지만, 그만큼 마스터 리미터를 밀어
     다른 트랙을 눌러 버립니다. 4.2 면 배음이 서브보다 −6.5dB 로
     여전히 충분히 들리면서 피크가 0dBFS 아래로 들어옵니다. */
  const pH=(is808?0.34:0.42)*(0.28+blend*1.05)*vAmp*HMAKE;
  gh.gain.setValueAtTime(0,t);
  gh.gain.linearRampToValueAtTime(pH,t+0.006);
  gh.gain.setTargetAtTime(pH*susH,t+0.03,is808?0.06:(_S&&_S.sus?susT*0.6:0.10));
  hold(gh.gain,t+hDur, expAt(pH, pH*susH, is808?0.06:(_S&&_S.sus?susT*0.6:0.10), hDur-0.03));
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
  }else if(e==='sub'){
    /* ⚠ 예전에는 [2,triangle],[3,sine],[4,sine],[6,sine] 이라 **6배음에서
       끝났습니다.** A2 에서 660Hz 가 상한이고, 600Hz 위 에너지가 전체의
       0.001% 였습니다(실측). 같은 잣대로 현 베이스(finger)는 3.9% 로 36dB 차이입니다.
       그래서 노브를 끝까지 밀어도 «맹숭맹숭» 이 안 없어졌습니다 —
       Blend·Drive·Tone 을 전부 최대로 해도 2k~4k 대역이 0.000% 였습니다.
       **없는 배음은 필터로 못 살립니다.**

       톱니 하나를 기음 자리에 두면 tone 노브(3600Hz)까지 배음이 찹니다.
       기음은 어차피 xoHP 2단(24dB/oct)이 지우고 서브(gsub)가 담당합니다. */
    [[1,0.55,'sawtooth'],[2,0.30,'triangle'],[3,0.14,'sine']].forEach(([m,a,ty])=>{
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
  }else if(BSYN[e]){
    /* 오실레이터 스택 → 24dB 래더 → 컷오프 엔벨로프.
       예전에는 moog 하나만 이 자리에 분기로 박혀 있었습니다. 구조가
       일반형이라 파라미터만 engines.js 의 BSYN 표로 뺐습니다 —
       **moog 의 수치는 그대로**라 소리가 안 바뀝니다(실측으로 확인).
       acid 는 303 특유의 2단 구성이 달라 표에 안 넣고 분기로 남깁니다. */
    const S=BSYN[e];
    const top=Math.min(hz*S.top[0],S.top[1]), bot=Math.max(hz*S.bot[0],S.bot[1]);
    const f1=BQ('lowpass',top,Q_DB(S.q),end);
    const f2=BQ('lowpass',top,Q_BUTTER,end);        // 합계 24dB/oct
    const tau=Math.min(dur*S.tau[0],S.tau[1]);
    [f1,f2].forEach(f=>{
      f.frequency.setValueAtTime(top,t);
      f.frequency.setTargetAtTime(bot,t,tau);
    });
    const mixg=acqGain(); mixg.gain.value=S.mix; retire(mixg,'gain',end+0.05);
    S.oscs.forEach(([ty,m,a,det])=>{
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
    /* 다른 엔진은 전부 mixg(0.30~0.52) 나 comp(0.16) 를 거쳐 mixIn 에 드는데
       여기만 이득 노드 없이 곧장 물려 있어 진폭이 1.0 이었습니다. 그래서
       fm 만 RMS 가 무리보다 3.2dB, 피크가 3.6dB 높았습니다(실측). */
    const fg=acqGain(); fg.gain.value=0.42; retire(fg,'gain',end+0.05);
    mod.connect(mg).connect(car.frequency); car.connect(fg).connect(mixIn); oscs.push(car,mod);
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
    const mixg=acqGain(); mixg.gain.value=0.26; retire(mixg,'gain',end+0.05);   // 0.34→0.26: 톱니 셋이 온셋에 정렬해 피크가 무리보다 2.3dB 높았다
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
