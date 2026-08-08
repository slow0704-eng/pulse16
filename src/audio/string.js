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
  /* ── 루프 필터 군지연 보정 ──
     지연선 길이만으로 P=SR/f 를 잡으면 음이 처진다 — 루프 안의 1극 저역통과
     (lp)·셸프(shelf)·DC 차단(dY, 아래 루프의 0.999 재귀)에도 위상지연이
     있고, 그만큼 루프 한 바퀴가 길어(또는 짧아)지기 때문이다.

     처음엔 docs/mutable-차용.md ★5 의 DC 근사(gd=b(1-a)/a, ω→0 극한)를
     그대로 넣어 봤는데, tools/measure-pitch.html 로 실측하니 **부호부터
     틀렸다** — E2 에서 처지기는커녕 +25 cent 나 날카로워졌고 크기도
     DC 근사보다 300배 컸다(예: gtr/clean E2 계산 0.026 샘플, 실측 8.3 샘플).
     원인은 ★5 가 셸프만 계산하고 **DC 차단 필터를 안 넣은 것**이었다 —
     컷오프가 SR·(1-0.999)/2π ≈ 7.6Hz 로 낮아 무해해 보이지만, 1극 필터는
     컷오프에서 한참 떨어져도 위상이 안 죽어서 82Hz 에서도 위상이
     몇 도~십몇 도 남는다. DC 근사(ω→0) 대신 **실제 신호 주파수
     ω=2πf/SR 에서** lp+셸프와 DC 차단 둘 다의 정확한 위상을 각각의
     1차 유리함수에서 해석적으로 구해 더했더니, 실측 gd 와 비율
     0.97~0.99 로 맞았다(18/20 엔진·음역 조합, tools/측정결과-신규음색.md
     §「과제1」참고). MI 의 svf_shift(2극 SVF 용)는 우리 필터(1극+셸프)에
     안 맞아 그대로 안 썼다 — 아래는 우리 필터 구조에서 직접 유도한 것. */
  const a  =1-Math.exp(-2*Math.PI*S.lpF/SR);
  const b  =1-Math.pow(10,S.shDb/20);
  const DC_R=0.999;                       // 아래 dY 재귀(DC 차단)와 반드시 같은 값

  const w=2*Math.PI*f/SR;
  /* lp+셸프 직렬을 하나의 1차 유리함수로: v=g·[(1-b)·y + b·lp(y)],
     lp(z)=a/(1-(1-a)z^-1) ⇒ F(z)=[c0-c1·z^-1]/[1-(1-a)z^-1],
     c0=1-b(1-a), c1=(1-b)(1-a) — g(실수 이득)는 위상에 안 나온다 */
  const c0=1-b*(1-a), c1=(1-b)*(1-a);
  const phF = Math.atan2(c1*Math.sin(w), c0-c1*Math.cos(w))
            - Math.atan2((1-a)*Math.sin(w), 1-(1-a)*Math.cos(w));
  /* DC 차단 v=x-x[-1]+r·v[-1] ⇒ H(z)=(1-z^-1)/(1-r·z^-1) */
  const phDC = (Math.PI/2 - w/2) - Math.atan2(DC_R*Math.sin(w), 1-DC_R*Math.cos(w));
  const gd = -(phF+phDC)/w;               // 샘플 단위 위상지연(음수=리드=주기가 짧아짐)

  let P=SR/f - gd;

  /* ── 분산(dispersion) 올패스 — 강성 때문에 배음이 정수배보다 높아진다 ──
     docs/mutable-차용.md ★6(rings/dsp/string.cc). S.disp 가 0(기본, 미설정
     포함)이면 아래는 전부 건너뛰어 기존 엔진 소리는 한 샘플도 안 바뀐다.

     처음엔 Plaits 의 경험적 stretch_correction 보정항을 그대로 옮겼는데
     (plaits/.../string.cc:126-127,158), bass/upright 저음(E1~A2)에서
     tools/measure-pitch.html §6 실측이 27~48cent 로 완전히 깨졌다 — 그
     보정항은 MI 가 자기네 음역·구조에서 경험적으로 맞춘 상수라 우리
     구조(별도 지연선 + 별도 셸프/DC차단)와 우리 음역(아주 굵고 낮은 업라이트
     저음)엔 안 맞았다(★5 의 svf_shift 와 같은 교훈).

     대신 과제1 과 **같은 방법**을 한 번 더 썼다 — 분산 올패스도
     Schroeder 형(z^-D 임베디드 지연 + 계수 g)이라 정확한 유리함수이고,
     실제 ω=2πf/SR 에서 위상을 닫힌 식으로 구할 수 있다. lp+셸프·DC차단의
     위상(gd, 위에서 이미 구함)에 이 위상까지 더해 총 지연이 정확히
     SR/f 가 되도록 P_main 을 역산한다 — 경험식이 아니라 우리 필터
     그대로의 해석해라서 음역에 안 흔들린다(실측으로 확인, §6). */
  let dispLine=null, dispWp=0, dispLen=0, dispGain=0;
  if(S.disp){
    const sp = S.disp*(2-S.disp)*0.475;                   // stretch_point, 0~0.475 (rings 식)
    dispGain = -0.618*S.disp/(0.15+Math.abs(S.disp));      // ap_gain, 0~-0.535 (rings 식)
    const apDelay = Math.round(P*sp);
    if(apDelay>=4){
      /* Schroeder 올패스 H(z)=(z^-D-g)/(1-g·z^-D) 의 ω 에서의 정확한 위상.
         w·D 가 2π 를 넘나들 수 있으므로(D 가 수백 샘플) DC 근사가 아니라
         cos(wD)·sin(wD) 로 직접 계산 — 과제1 의 F(z)·DC차단과 같은 방식. */
      const wD = w*apDelay, cwD=Math.cos(wD), swD=Math.sin(wD);
      const phDisp = Math.atan2(-swD, cwD-dispGain)
                   - Math.atan2(dispGain*swD, 1-dispGain*cwD);
      const delayDisp = -phDisp/w;
      const pMain = P - delayDisp;
      if(pMain>=4){
        P = pMain;
        /* line(메인 지연선)과 같은 관례: 길이 D 원형버퍼를 같은 슬롯에서
           읽고 쓰면 정확히 D 샘플 지연이다. +1 을 하면 D+1 이 되어 버려
           위상식(D 를 그대로 쓴 것)과 실제 구현이 어긋난다 —
           처음에 +1 로 짜서 A2 에서 -2.58cent 잔차가 났었다(실측으로 발견). */
        dispLen = apDelay; dispLine = new Float32Array(dispLen);
      } else dispGain = 0;
    } else dispGain = 0;                                    // 너무 낮은 음이면 우회(MI 와 같은 조건)
  }

  const Di=Math.max(3,Math.floor(P)-1);
  const fr=P-Di;                          // 1.0~2.0 — 올패스 과도응답 회피
  const ap=(1-fr)/(1+fr);                 // 1차 올패스 보간: |H|=1 이라 여분 감쇠 없음

  const T60=S.t60*Math.pow(82.41/f,S.t60k);
  const g  =Math.min(Math.pow(10,-3/(f*T60)),0.9975);

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
    let y=ap*v0+aX-ap*aY; aX=v0; aY=y;
    if(dispLine){                          // 분산 올패스 — Schroeder 형(stmlib Allpass)
      const rd=dispLine[dispWp];
      const wr=y+dispGain*rd;
      dispLine[dispWp]=wr;
      y=-wr*dispGain+rd;
      dispWp=(dispWp+1)%dispLen;
    }
    lp+=(y-lp)*a;
    let v=g*(y-b*(y-lp));                 // max|H| = g < 1 → 무조건 안정
    if(thr){
      if(v> thr) v= thr+(v-thr)*0.30;
      else if(v<-thr) v=-thr+(v+thr)*0.30;
    }
    dY=v-dX+DC_R*dY; dX=v; v=dY;          // DC 차단 — 위 gd 계산의 DC_R 과 같은 값이어야 한다
    line[wp]=v; wp=(wp+1)%Di;
    out[off+n]+=y;
  }
}

/** 한 번 튕긴 음(코드·복현·공명현 포함)을 통째로 버퍼로 */
function ksRender(hz,S){
  const SR=ctx.sampleRate;
  /* 상한 3.2초는 페달 스틸(설계 T60 8.49s)을 −22.6dB 지점에서 잘랐다.
     서스테인이 정체성인 악기라 9초까지 열어 둔다 — 캐시가 커지지만
     엔진별 24개 상한(makeStringCache)이 있어 메모리는 유계다. */
  const sec=Math.min(S.t60*Math.pow(82.41/hz,S.t60k)*1.1+0.15, 9.0);
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
