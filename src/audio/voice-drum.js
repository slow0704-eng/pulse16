/* §9 드럼 보이스 — 킥 · 스네어 · 클랩 · 하이햇 · 톰
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ═══ §9  신스 보이스 ═══════════════════════════════════════ */

/* ── 킥 ──
   sub(사인 바디) + body(중저역) + atk(어택 톤) + click(노이즈 트랜지언트) 4층 구조.
   Trap 계열은 tight 를 써서 808 에 저역을 양보하는 것이 정석입니다. */
const KICK = {
  deep :{sub:{f0:118,f1:37,drop:0.13, dec:1.05}, body:{f0:200,f1:74, drop:0.055,dec:0.26,amp:0.50},
         atk:{f:330,dec:0.020,amp:0.34}, click:{f:2600,q:0.7,dec:0.016,amp:0.26,bp:0}},
  punch:{sub:{f0:135,f1:50,drop:0.055,dec:0.46}, body:{f0:250,f1:96, drop:0.028,dec:0.15,amp:0.62},
         atk:{f:420,dec:0.014,amp:0.52}, click:{f:3200,q:0.7,dec:0.012,amp:0.42,bp:0}},
  tight:{sub:{f0:150,f1:62,drop:0.032,dec:0.22}, body:{f0:290,f1:120,drop:0.020,dec:0.10,amp:0.60},
         atk:{f:520,dec:0.010,amp:0.55}, click:{f:3800,q:0.7,dec:0.009,amp:0.46,bp:0}},
  wood :{sub:{f0:126,f1:44,drop:0.085,dec:0.60}, body:{f0:215,f1:88, drop:0.045,dec:0.20,amp:0.55},
         atk:{f:300,dec:0.026,amp:0.30}, click:{f:900, q:1.6,dec:0.045,amp:0.30,bp:1}},
};
function kick(t,v,e){
  const S=KICK[e], mul=st2r(knob('ktune'));
  const stretch=1+Math.max(0,-knob('ktune'))*0.035;
  const sw=0.55+SUB()*0.85, pw=0.45+PUN()*1.05;
  const sdec=S.sub.dec*stretch, end=t+sdec+0.3;

  /* 1) 서브 — 짧게 위에서 떨어지는 사인 */
  const gs=G('kick',end), os=osc('sine',t,sdec+0.25);
  os.frequency.setValueAtTime(S.sub.f0*mul*2.1,t);
  os.frequency.exponentialRampToValueAtTime(S.sub.f0*mul,t+0.012);
  os.frequency.exponentialRampToValueAtTime(S.sub.f1*mul,t+S.sub.drop);
  env2(gs,t,v*sw,0.42,0.07,sdec,0.0015); os.connect(gs);

  /* 2) 바디 — 새추레이션을 거친 중저역 */
  const eb=t+S.body.dec+0.2;
  const gb=G('kick',eb), ob=osc('sine',t,S.body.dec+0.15);
  ob.frequency.setValueAtTime(S.body.f0*mul,t);
  ob.frequency.exponentialRampToValueAtTime(S.body.f1*mul,t+S.body.drop);
  env2(gb,t,v*S.body.amp*(0.7+SUB()*0.5),0.35,0.03,S.body.dec,0.001);
  const ws=shaperNode(1,eb), blp=BQ('lowpass',6000,0.707,eb);
  ob.connect(ws).connect(blp).connect(gb);

  /* 3) 어택 — 튠의 절반만 따라가는 삼각파 */
  const ea=t+S.atk.dec+0.1;
  const ga=G('kick',ea), oa=osc('triangle',t,S.atk.dec+0.08);
  const amul=st2r(knob('ktune')*0.5);
  oa.frequency.setValueAtTime(S.atk.f*amul,t);
  oa.frequency.exponentialRampToValueAtTime(S.atk.f*amul*0.45,t+S.atk.dec);
  env(ga,t,v*S.atk.amp*pw,S.atk.dec,0.0006); oa.connect(ga);

  /* 4) 클릭 — 노이즈 트랜지언트 */
  const ec=t+S.click.dec+0.08;
  const gc=G('kick',ec), f=BQ(S.click.bp?'bandpass':'lowpass',S.click.f,S.click.q,ec);
  env(gc,t,v*S.click.amp*pw*0.5,S.click.dec,0.0005);
  f.connect(gc); tapNoise(f,ec);
}

/** 킥이 칠 때 베이스 버스와 리버브 리턴을 잠깐 눌러줌.
    IIFE 를 걷어내며 최상위 function 이 전역이 됐다. duck 이라는 이름은
    #duck 슬라이더가 만드는 암묵 전역과 부딪히므로 쓰지 않는다. */
function duckSidechain(t){
  if(!duckNode) return;
  const amt = knob('duck')/100;
  if(amt<=0) return;
  [duckNode.gain, revReturn.gain].forEach(p => {
    hold(p,t);
    p.linearRampToValueAtTime(1-amt*0.85, t+0.014);
    p.setTargetAtTime(1, t+0.035, 0.085+amt*0.13);
  });
}

/* tom 트랙 — 음정이 있는 타악기. 튠 노브(ttune)를 따릅니다.
   drop  : 피치 하강에 걸리는 시간(초). 없으면 감쇠에 비례해 떨어집니다.
   slap  : 손바닥 슬랩 — 라틴 막울림의 음색은 사실상 이게 만듭니다.
   shell : 금속 셸의 비배음 링 (기음 대비 배율).
   bell  : 막울림이 아니라 사각파 공진 — 카우벨 계열. */
const TOM = {
  analog :{f0:250,f1:88, dec:0.42,sub:0.55,type:'sine',     body:0},
  synth  :{f0:310,f1:112,dec:0.30,sub:0.40,type:'triangle', body:0},
  wood   :{f0:262,f1:104,dec:0.36,sub:0.48,type:'sine',     body:1},

  /* 라틴·아프리카 막울림. 톰과 달리 피치가 거의 안 떨어집니다 —
     막 장력이 유지되므로 10~15% 뿐입니다. 톰처럼 65% 를 떨어뜨리면
     콩가가 아니라 그냥 높은 신스톰이 됩니다. */
  conga  :{f0:330,f1:292,dec:0.34,sub:0.10,type:'sine',     body:0,
           slap:{f:2200,q:1.1,dec:0.030,amp:0.30}},
  bongo  :{f0:520,f1:458,dec:0.17,sub:0.04,type:'sine',     body:0,
           slap:{f:3100,q:1.2,dec:0.020,amp:0.40}},
  timbale:{f0:400,f1:370,dec:0.26,sub:0.06,type:'triangle', body:0,
           slap:{f:3600,q:0.9,dec:0.028,amp:0.42}, shell:[1.68,2.41]},

  /* 아마피아노 로그드럼 — 순수 사인이 40ms 안에 뚝 떨어집니다.
     이 급강하가 정체성이라 감쇠 비례 하강으로는 절대 안 납니다. */
  logdrum:{f0:230,f1:56, dec:0.52,sub:0,   type:'sine',     body:0, drop:0.042},

  /* 808 카우벨 — 사각파 둘을 밴드패스에 통과시킨 것. 비율 1.44 가 808 값입니다.
     폰크에서는 튠해서 리드 악기로 씁니다. */
  cowbell:{bell:[587,845], dec:0.38, bp:[2600,1.4]},
};
function tom(t,v,e){
  const S=TOM[e]||TOM.analog, mul=st2r(knob('ttune'));

  if(S.bell){                     // 카우벨 — 막울림이 아니므로 경로가 다름
    const dec=S.dec, end=t+dec+0.2;
    const g=G('tom',end), bp=BQ('bandpass',S.bp[0]*mul,S.bp[1],end);
    bp.connect(g);
    S.bell.forEach((hz,i) => {
      const o=osc('square',t,dec+0.1);
      o.frequency.setValueAtTime(hz*mul*rnd(0.012*H()),t);
      const og=acqGain(); og.gain.value=i?0.7:1; retire(og,'gain',end+0.05);
      o.connect(og).connect(bp);
    });
    env2(g,t,v*0.50*rnd(0.1*H()),0.30,0.02,dec,0.001);
    return;
  }

  const dec=S.dec*(1+Math.max(0,-knob('ttune'))*0.03);
  const f0=S.f0*mul*rnd(0.03*H()), f1=S.f1*mul, end=t+dec*1.3+0.25;

  const g=G('tom',end), o=osc(S.type,t,dec+0.2);
  o.frequency.setValueAtTime(f0,t);
  o.frequency.exponentialRampToValueAtTime(f1, t + (S.drop || dec*0.65));
  env2(g,t,v*0.8*rnd(0.1*H()),0.40,0.05,dec,0.002); o.connect(g);

  if(S.sub>0){
    const gs=G('tom',end), os=osc('sine',t,dec+0.35);
    os.frequency.setValueAtTime(f0*0.5,t);
    os.frequency.exponentialRampToValueAtTime(f1*0.5, t + (S.drop ? S.drop*1.6 : dec*0.8));
    env2(gs,t,v*S.sub*SUB()*0.9,0.40,0.06,dec*1.25,0.003); os.connect(gs);
  }

  if(S.shell) S.shell.forEach((r,i) => {   // 금속 셸의 비배음 링
    const se=t+dec*0.9, sg=G('tom',se), so=osc('sine',t,dec*0.75);
    so.frequency.setValueAtTime(f0*r,t);
    env(sg,t,v*0.14*(i?0.6:1),dec*0.55,0.001); so.connect(sg);
  });

  if(S.slap){                              // 손바닥 슬랩
    const K=S.slap, se=t+K.dec+0.1, sg=G('tom',se);
    const f=BQ('bandpass',K.f*mul,K.q,se);
    env(sg,t,v*K.amp*PUN()*rnd(0.1*H()),K.dec,0.0008); f.connect(sg); tapNoise(f,se);
  }

  if(S.body){   // 어쿠스틱은 스틱 어택을 얹음
    const be=t+0.12, bg=G('tom',be), f=BQ('bandpass',1300*mul,1.6,be);
    env(bg,t,v*0.22*PUN(),0.055,0.001); f.connect(bg); tapNoise(f,be);
  }
}

/* ── perc 트랙 — 음정이 없는 금속·나무 타악기 ──
   튠 노브를 따르지 않습니다. 실물도 음정을 못 바꾸고,
   따라간다면 tom 에 넣었어야 할 악기입니다.

   tone   : 공진 주파수 목록. 노이즈를 좁은 대역(높은 Q)으로 때려 울립니다.
            나무·금속처럼 배음이 정수배가 아닌 악기는 이 편이 정확합니다.
   bp/hp  : 노이즈 계열의 대역
   scrape : 긁는 악기 — 짧은 노이즈를 빠르게 반복해 만듭니다 */
const PERC = {
  /* 셰이커는 씨앗이 통 안에서 튀는 소리라 어택이 뭉툭합니다.
     어택을 0 으로 두면 하이햇과 구분이 안 갑니다 — 6ms 를 줍니다. */
  /* pink 로 바꾸며 14.8dB(×5.50) 보정 — 중심 8095 → 7068 Hz (실측) */
  shaker   :{bp:[6800,1.1], dec:0.062, atk:0.006, amp:2.31, pink:1},
  /* pink 로 바꾸며 8.8dB(×2.76) 보정 — 중심 6936 → 6458 Hz (실측) */
  cabasa   :{bp:[4200,0.9], dec:0.085, atk:0.004, amp:1.11, hp:2600, pink:1},
  /* 탬버린 = 노이즈 + 징글(금속 원반)의 고역 */
  tamb     :{bp:[7600,1.4], dec:0.13,  atk:0.002, amp:0.44, jingle:[9200,11800,14100]},

  /* 클라베는 나무 막대라 거의 순음에 가까운 짧은 공진입니다 */
  clave    :{tone:[2500,3900],            dec:0.055, amp:1.90, q:14},
  woodblock:{tone:[1150,2050],            dec:0.045, amp:2.35, q:11},
  /* 아고고는 금속 벨이라 클라베보다 훨씬 길게 울립니다 */
  agogo    :{tone:[790,1185,1660],        dec:0.34,  amp:2.00, q:22},
  /* 소카의 아이언(브레이크 드럼) — 비배음 금속 덩어리 */
  iron     :{tone:[1450,2190,3050,4370],  dec:0.17,  amp:1.15, q:9},

  guiro    :{scrape:1, bp:[3400,1.6], dec:0.19, amp:1.00, rate:46},

  /* 턴테이블 스크래치 — 레코드를 앞뒤로 문지르는 소리.
     노이즈를 밴드패스에 통과시키되 중심 주파수를 위로 훑었다가 되돌립니다.
     그 왕복이 스크래치의 정체라, 한 방향만 훑으면 그냥 스윕이 됩니다.
     뉴메탈·힙합. */
  scratch  :{sweep:1, f0:600, f1:4200, q:2.2, dec:0.16, amp:0.70},
};
function perc(t,v,e){
  const S=PERC[e]||PERC.shaker;
  const amp=v*S.amp*rnd(0.12*H());

  if(S.tone){                       /* 공진체 — 노이즈로 때려 울린다 */
    const end=t+S.dec+0.15;
    S.tone.forEach((hz,i) => {
      const g=G('perc',end), f=BQ('bandpass',hz*rnd(0.012*H()),S.q,end);
      env(g,t,amp*Math.pow(0.62,i),S.dec*Math.pow(0.80,i),0.0006);
      f.connect(g); tapNoise(f,end);
    });
    return;
  }

  if(S.sweep){                      /* 스크래치 — 밴드패스 중심을 왕복으로 훑는다 */
    const end=t+S.dec+0.12, g=G('perc',end);
    const f=BQ('bandpass',S.f0,S.q,end);
    f.frequency.setValueAtTime(S.f0,t);
    f.frequency.exponentialRampToValueAtTime(S.f1, t+S.dec*0.45);
    f.frequency.exponentialRampToValueAtTime(S.f0*1.2, t+S.dec);
    f.connect(g); tapNoise(f,end);
    /* 문지르는 손의 왕복이 음량에도 굴곡을 만든다 */
    g.gain.setValueAtTime(0,t);
    g.gain.linearRampToValueAtTime(amp,t+0.004);
    g.gain.linearRampToValueAtTime(amp*0.45,t+S.dec*0.45);
    g.gain.linearRampToValueAtTime(amp*0.85,t+S.dec*0.72);
    g.gain.linearRampToValueAtTime(0,t+S.dec+0.02);
    return;
  }

  if(S.scrape){                     /* 긁힘 — 노이즈를 잘게 썰어 훑는다 */
    const n=Math.max(2,Math.round(S.dec*S.rate)), seg=S.dec/n, end=t+S.dec+0.12;
    for(let i=0;i<n;i++){
      const g=G('perc',end);
      const f=BQ('bandpass',S.bp[0]*(1+i/n*0.5),S.bp[1],end);   // 훑으며 밝아짐
      env(g,t+i*seg,amp*(0.35+0.65*i/n)*0.5,seg*0.9,0.0005);
      f.connect(g); tapNoise(f,end);
    }
    return;
  }

  const end=t+S.dec+0.12, g=G('perc',end);
  const head=BQ('bandpass',S.bp[0]*rnd(0.05*H()),S.bp[1],end);
  let node=head;
  if(S.hp){ const h=BQ('highpass',S.hp,0.707,end); node.connect(h); node=h; }
  node.connect(g); (S.pink?tapPink:tapNoise)(head,end);
  env(g,t,amp,S.dec,S.atk);

  if(S.jingle) S.jingle.forEach((hz,i) => {   /* 징글의 금속 성분 */
    const jg=G('perc',end), o=osc('square',t,S.dec*0.8);
    o.frequency.setValueAtTime(hz*rnd(0.02*H()),t);
    const jf=BQ('bandpass',hz,9,end);
    env(jg,t,amp*0.10*Math.pow(0.75,i),S.dec*0.7,0.0008);
    o.connect(jf).connect(jg);
  });
}

const SNARE = {
  body :{hp:1150,dec:0.22, tone:0.55,tdec:0.14,bp:0,crush:0},
  crack:{hp:2050,dec:0.16, tone:0.26,tdec:0.07,bp:1,crush:0},
  tight:{hp:1650,dec:0.078,tone:0.30,tdec:0.05,bp:1,crush:0},
  lofi :{hp:780, dec:0.24, tone:0.46,tdec:0.13,bp:0,crush:1},

  /* 브러시는 때리는 게 아니라 쓸어내는 것이라 어택이 뭉툭하고 꼬리가 깁니다.
     저역 하이패스 + 고역 로우패스로 좁혀야 '치익' 소리가 나고,
     몸통을 거의 빼야 스틱 스네어로 안 들립니다. (혼키통크·재즈 브러시) */
  /* pink — 900~5200Hz 로 대역이 넓어 화이트의 옥타브당 +3dB 기울기가 그대로 드러납니다.
     브러시는 '치익' 이 정체성이라 여기가 가장 크게 달라집니다.
     amp 는 핑크의 낮은 RMS 를 실측으로 보정한 값입니다 —
     화이트 RMS −18.7dB 가 핑크로 −27.0dB 가 되어 9.6dB(×3.02) 올렸습니다.
     스펙트럼 중심은 4781 → 3743 Hz 로 내려갔습니다. 이게 노린 변화입니다. */
  brush:{hp:900, dec:0.34, tone:0.10,tdec:0.05, bp:0,crush:0, lp:5200, atk:0.011, amp:1.57, pink:1},

  /* 림샷은 테를 때리는 소리 — 와이어가 거의 안 울고 나무 '톡' 이 지배합니다.
     몸통 주파수를 1.9배로 올려야 스네어가 아니라 림으로 들립니다.
     (레게 원드롭의 3박, 컨트리 크로스스틱) */
  rim  :{hp:1900,dec:0.048,tone:0.72,tdec:0.040,bp:1,crush:0, tmul:1.9, amp:0.55},
};
function snare(t,v,e){
  const S=SNARE[e]||SNARE.body, mul=st2r(knob('stune')), end=t+S.dec+0.15;

  /* 스네어 와이어 = 필터링한 노이즈 */
  const g=G('snare',end), hp=BQ('highpass',S.hp*mul*rnd(0.05*H()),0.707,end);
  let node=hp;
  if(S.bp){ const pk=BQ('peaking',4200*mul,1.1,end,5); hp.connect(pk); node=pk; }
  if(S.lp){ const lp=BQ('lowpass',S.lp,0.707,end); node.connect(lp); node=lp; }
  if(S.crush){
    const pre=BQ('lowpass',4000,0.707,end), w=shaperNode(2,end), lp=BQ('lowpass',3200,0.707,end);
    node.connect(pre).connect(w).connect(lp); node=lp;
  }
  env(g,t,v*(S.amp??0.88)*rnd(0.08*H()),S.dec,S.atk??0.0012);
  node.connect(g); (S.pink?tapPink:tapNoise)(hp,end);

  /* 몸통 = 두 개의 삼각파 */
  const te=t+S.tdec+0.15, tm=S.tmul||1;
  [188,272].forEach((hz,i) => {
    const og=G('snare',te), o=osc('triangle',t,S.tdec+0.12);
    const h=hz*tm*mul*rnd(0.02*H());
    o.frequency.setValueAtTime(h,t);
    o.frequency.exponentialRampToValueAtTime(h*0.76,t+S.tdec);
    env(og,t,v*S.tone*(i?0.55:1)*(0.7+PUN()*0.5),S.tdec,0.002);
    o.connect(og);
  });
}

const CLAP = {
  spread:{offs:[0,0.011,0.023],           tail:0.28,q:1.1,f:1150},
  tight :{offs:[0,0.008],                 tail:0.12,q:1.9,f:1500},
  hall  :{offs:[0,0.013,0.027,0.041],     tail:0.60,q:0.8,f:1000},
  /* 핑거 스냅은 손뼉과 달리 한 번뿐이고 훨씬 짧고 높습니다.
     Snap 계열은 스네어를 아예 안 쓰고 이걸로 백비트를 잡습니다. */
  snap  :{offs:[0],                       tail:0.042,q:2.6,f:2400},
};
function clap(t,v,e){
  const S=CLAP[e]||CLAP.spread;
  S.offs.forEach((off,i) => {   // 짧은 박수 여러 번 + 마지막에 테일
    const last=(i===S.offs.length-1), j=off*rnd(0.25*H());
    const dec=last?S.tail:0.032, end=t+j+dec+0.15;
    const g=G('clap',end), f=BQ('bandpass',S.f*rnd(0.06*H()),S.q,end);
    env(g,t+j,v*(last?1:0.62)*rnd(0.1*H()),dec,0.001);
    f.connect(g); tapNoise(f,end);
  });
}

function hat(t,v,e,dec,open){
  if(openHat){ fadeOut(openHat.gain,t,open?0.005:0.007); openHat=null; }  // 초크
  const id=open?'ohat':'chat', mul=st2r(knob('htune'));
  const d=dec*rnd(0.10*H()), end=t+d+0.15;
  const g=G(id,end);
  if(e==='metal'){
    metalBP.frequency.setValueAtTime(10000*mul*rnd(0.05*H()),t);
    tapMetal(g,end);
  }else{
    const hp=BQ('highpass',(e==='tick'?9500:7200)*mul*rnd(0.05*H()),0.707,end);
    const pk=BQ('peaking',11500*mul,1.2,end,4);
    hp.connect(pk).connect(g); tapNoise(hp,end);
  }
  env(g,t,v*(e==='metal'?0.34:0.55)*rnd(0.14*H()), e==='tick'?d*0.45:d, 0.0008);
  /* 회수된 게인 노드는 풀에서 다른 보이스에 재배정된다.
     참조를 그대로 두면 다음 초크가 엉뚱한 보이스를 죽이므로 만료 시 스스로 지운다. */
  if(open){
    openHat=g;
    retire({disconnect:()=>{ if(openHat===g) openHat=null; }},'x',end+0.05);
  }
}

const FIRE = {
  kick, snare, clap, tom, perc,
  chat:(t,v,e)=>hat(t,v,e,0.048,false),
  ohat:(t,v,e)=>hat(t,v,e,0.36, true),
};

/** 샘플이 배정돼 있으면 샘플로, 아니면 합성으로 */
function playSample(id,t,v){
  const pl=trackPlayer[id];
  if(!pl || !pl.loaded) return false;
  try{
    const r=rateOf(id);
    pl.playbackRate=r;
    pl.volume.cancelScheduledValues(t);
    pl.volume.setValueAtTime(Tone.gainToDb(Math.max(v,0.001)) + knob('ktrim'), t);
    if(id==='chat'){
      if(smpOpen && trackPlayer.ohat){ try{ trackPlayer.ohat.stop(t); }catch(e){} smpOpen=false; }
      pl.start(t).stop(t+0.07/r);
    }else if(id==='ohat'){
      pl.start(t); smpOpen=true;
    }else{
      pl.start(t);
    }
    return true;
  }catch(e){ return false; }
}
function fireTrack(id,t,v,e){
  /* ⚠ 덕킹은 «있으면 좋은» 것이지 소리의 조건이 아니다.
     duckSidechain 안의 hold() 가 예외를 던지면(AudioParam 구현에 따라 난다)
     그 스텝의 **드럼 전체가 무음**이 됐다. 덕킹만 건너뛰고 소리는 낸다. */
  if(id==='kick'){ try{ duckSidechain(t); }catch(err){} }
  if(smpSel[id]!=='synth' && playSample(id,t,v)) return;
  FIRE[id](t,v,e);
}
