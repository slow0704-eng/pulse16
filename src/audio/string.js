/* 뜯은 현 — 오프라인 Karplus-Strong 코어
   pulse16-mk16.html 에서 분리하며 기타 전용이던 것을 공용으로 뺐다.
   기타(voice-gtr.js)와 현 베이스(voice-bass.js)가 같은 코어를 쓴다.

   라이브 DelayNode 루프로는 못 만든다. 사이클 안에서 128샘플이 더해져
   보정해도 상한이 SR/256 = 187.5Hz 라 기타 G3(196Hz)조차 못 낸다.(측정 확인)
   그래서 한 음을 통째로 버퍼로 구워 BufferSource 로 재생한다.

   ── 파라미터 ──
   beta   뜯는 위치(브리지 기준 현 길이 비). 배음 널이 n = 1/beta 에 선다
   exF    픽 폭. 낮으면 손가락, 높으면 단단한 픽
   exLen  픽 긁힘 노이즈 길이(초)
   exNz   픽 긁힘 노이즈량
   lpF    루프 저역통과 — 고역이 먼저 죽는 속도
   shDb   루프 셸프 — 전체 밝기
   t60    82.41Hz(E2)에서의 감쇠 시간, t60k 는 음정에 따른 지수
   chord  동시에 울릴 음정(반음). strum 은 현 사이 시간차
   det    현 사이 디튠(cent)
   course 복현(複絃) — 만돌린처럼 한 음을 두 줄로 낼 때 cent 로 준다
   puBeta 픽업 위치. 널이 n = 1/puBeta. beta 널과 겹치면 구멍이 나므로 떨어뜨린다
   buzz   자와리(시타르 브리지) — 진폭이 문턱을 넘는 동안만 접히며 소리가 부서진다
   symp   공명현 — 뜯지 않아도 같이 우는 줄(반음 목록)
   lvl    피크 정규화 목표. 엔진 간 레벨 편차를 원천 차단 */
'use strict';

/** out[off..] 에 현 하나를 가산 합성 */
function ksInto(out,off,f,S,amp,SR){
  const P=SR/f;
  const Di=Math.max(3,Math.floor(P)-1);
  const fr=P-Di;                          // 1.0~2.0 — 올패스 과도응답 회피
  const ap=(1-fr)/(1+fr);                 // 1차 올패스 보간: |H|=1 이라 여분 감쇠 없음

  const T60=S.t60*Math.pow(82.41/f,S.t60k);
  const g  =Math.min(Math.pow(10,-3/(f*T60)),0.9975);
  const a  =1-Math.exp(-2*Math.PI*S.lpF/SR);
  const b  =1-Math.pow(10,S.shDb/20);

  /* 여기 — 뜯은 직후 현의 상태를 그대로 넣는다.
     예전에는 exF 를 중심으로 대역제한한 2.8ms 노이즈 버스트였다.
     그 버스트에는 1.7kHz 아래가 거의 없어서, A2(110Hz)를 쳐도 기음이
     최강 배음보다 27dB 낮게 나왔다 — 550Hz 가 제일 크게 들렸다. (측정 확인)
     β 지점에서 꺾인 삼각 변위를 미분하면 2단 사각 속도파가 되고,
     그 푸리에 계수가 sin(nπβ)/n 이다 — 기음 최강, 6dB/oct 감쇠.
     마그네틱 픽업은 변위가 아니라 속도를 읽으므로 이쪽이 맞다. */
  const B=S.beta;
  const line=new Float32Array(Di);
  for(let i=0;i<Di;i++) line[i]=(i/Di<B)?(1-B):-B;
  /* 픽 폭 — 앞뒤로 한 번씩 걸어 위상이 밀리지 않게 한다. */
  const c=1-Math.exp(-2*Math.PI*S.exF/SR);
  let z=line[Di-1];
  for(let i=0;i<Di;i++){ z+=(line[i]-z)*c; line[i]=z; }
  for(let i=Di-1;i>=0;i--){ z+=(line[i]-z)*c; line[i]=z; }
  /* ⚠ 정규화를 먼저 하고 잡음을 얹는다. 순서를 뒤집으면 안 된다.
     잡음까지 포함해 정규화하면, 잡음이 큰 엔진(슬랩 exNz 2.2)에서
     1ms 짜리 노이즈 첨두가 피크를 차지해 현 자체가 통째로 눌린다.
     실제로 그렇게 짰더니 슬랩이 핑거보다 어둡게(중심 95 vs 103Hz)
     측정됐다 — 금속성 클릭이 정체성인 주법인데 정반대였다. */
  let ep=0; for(let i=0;i<Di;i++){ const x=Math.abs(line[i]); if(x>ep) ep=x; }
  if(ep>1e-9){ const k=amp/ep; for(let i=0;i<Di;i++) line[i]*=k; }

  /* 픽 긁힘 — 짧은 해닝 노이즈를 현 진폭에 대한 상대량으로 얹는다 */
  const bl=Math.max(4,Math.min(Di,Math.round(SR*S.exLen)));
  const nz=(S.exNz!=null?S.exNz:0.9)*amp;
  for(let i=0;i<bl;i++)
    line[i]+=(Math.random()*2-1)*(0.5-0.5*Math.cos(2*Math.PI*i/bl))*nz;

  /* 자와리 — 곡면 브리지에 현이 닿았다 떨어지길 반복한다.
     문턱을 넘는 동안만 접히므로, 소리가 잦아들면 버즈도 알아서 사라진다.
     시타르 특유의 "쟁-" 이 이 과도구간에서 나온다. */
  const thr = S.buzz ? amp*S.buzz : 0;

  let wp=0,aX=0,aY=0,lp=0,dX=0,dY=0;
  const M=Math.min(out.length-off, Math.ceil(SR*(T60*1.05+0.1)));
  for(let n=0;n<M;n++){
    const v0=line[wp];
    const y=ap*v0+aX-ap*aY; aX=v0; aY=y;
    lp+=(y-lp)*a;
    let v=g*(y-b*(y-lp));                 // max|H| = g < 1 → 무조건 안정
    if(thr){
      if(v> thr) v= thr+(v-thr)*0.30;
      else if(v<-thr) v=-thr+(v+thr)*0.30;
    }
    dY=v-dX+0.999*dY; dX=v; v=dY;         // DC 차단
    line[wp]=v; wp=(wp+1)%Di;
    out[off+n]+=y;
  }
}

/** 한 번 튕긴 음(코드·복현·공명현 포함)을 통째로 버퍼로 */
function ksRender(hz,S){
  const SR=ctx.sampleRate;
  const sec=Math.min(S.t60*Math.pow(82.41/hz,S.t60k)*1.1+0.15, 3.2);
  const buf=ctx.createBuffer(1,Math.ceil(SR*sec),SR);
  const out=buf.getChannelData(0);

  S.chord.forEach((iv,si)=>{
    const det=((si*7)%5-2)*S.det;
    const f=hz*Math.pow(2,(iv+det/100)/12);
    const off=Math.round(SR*S.strum*si), amp=Math.pow(0.88,si);
    ksInto(out, off, f, S, amp, SR);
    /* 복현 — 만돌린·12현은 한 음을 두 줄로 낸다. 두 줄이 절대 안 맞으므로
       그 미세한 어긋남이 곧 음색이다. 시간차도 1ms 남짓 준다. */
    if(S.course)
      ksInto(out, Math.min(off+Math.round(SR*0.0013), out.length-1),
             f*Math.pow(2,S.course/1200), S, amp*0.85, SR);
  });

  /* 공명현 — 뜯지 않아도 같이 우는 줄. 시타르의 배경 울림. */
  if(S.symp) S.symp.forEach((iv,i)=>{
    const f=hz*Math.pow(2,iv/12);
    ksInto(out, 0, f, {...S, exNz:0.05, buzz:0, t60:S.t60*1.4},
           0.13*Math.pow(0.85,i), SR);
  });

  if(S.puBeta){
    /* 픽업 위치 — 모드 형상 2|sin(nπβ)| = |1 − e^(−j2πnβ)| 를 콤으로 구현한다.
       널이 n = 1/puBeta 에 선다. 뜯는 위치 널(n = 1/beta)과 겹치면
       그 배음이 두 번 깎여 구멍이 나므로 두 값을 떨어뜨려 둔다. */
    const pd=Math.max(1,Math.round(SR/hz*S.puBeta));
    const k=S.puK!=null?S.puK:0.88, nrm=1/(1+k);
    for(let i=out.length-1;i>=pd;i--) out[i]=(out[i]-out[i-pd]*k)*nrm;
  }
  /* 피크 정규화 — 엔진 간 레벨 편차를 원천 차단.
     다만 어택 8ms 안의 과도로 정규화하면 슬랩·픽처럼 클릭이 큰 엔진에서
     지속부가 통째로 눌려 소리만 작아진다. 지속부 피크를 기준으로 잡되
     과도가 그 2배를 넘지는 못하게 한다. */
  const skip=Math.round(SR*0.008);
  let pk=0, pkSus=0;
  for(let i=0;i<out.length;i++){
    const x=Math.abs(out[i]);
    if(x>pk) pk=x;
    if(i>=skip && x>pkSus) pkSus=x;
  }
  const ref=Math.max(pkSus, pk*0.5);
  if(ref>1e-6){ const k=S.lvl/ref; for(let i=0;i<out.length;i++) out[i]*=k; }
  return buf;
}

/** 엔진·음정별 버퍼 캐시. 굽는 비용이 커서 반드시 캐시해야 한다. */
function makeStringCache(limit){
  const m=new Map();
  return (key,hz,S)=>{
    let b=m.get(key);
    if(!b){
      b=ksRender(hz,S);
      if(m.size>=limit) m.delete(m.keys().next().value);
      m.set(key,b);
    }
    return b;
  };
}
