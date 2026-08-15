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

  /* ══ 보강 5종 ══
     기존 넷(deep·punch·tight·wood)이 «표준 4/4 ~ 트랩» 축을 덮고 있어서,
     비어 있던 양 끝을 채웁니다 — 아주 긴 808 서브 쪽과 왜곡된 하드코어 쪽,
     그리고 클릭을 거의 안 쓰는 미니멀·재즈 쪽.
     sh 를 주면 바디의 새추레이션 커브를 바꿉니다(기본 1, 클수록 딱딱함). */

  /* 808 — 브리지드-T 발진기. 기음이 낮고 감쇠가 1.6초로 압도적으로 깁니다.
     클릭이 거의 없어 서브가 그대로 드러납니다. 트랩·마이애미베이스. */
  eight08:{sub:{f0:62, f1:41,drop:0.10, dec:1.60}, body:{f0:130,f1:62, drop:0.050,dec:0.18,amp:0.28},
           atk:{f:220,dec:0.012,amp:0.16}, click:{f:2000,q:0.7,dec:0.008,amp:0.14,bp:0}},
  /* 909 — 808 과 반대로 피치가 빨리 떨어지고 클릭이 큽니다.
     테크노·하드하우스의 박동. */
  nine09 :{sub:{f0:128,f1:52,drop:0.045,dec:0.52}, body:{f0:240,f1:88, drop:0.022,dec:0.13,amp:0.58},
           atk:{f:480,dec:0.011,amp:0.50}, click:{f:4200,q:0.8,dec:0.010,amp:0.52,bp:0}},
  /* 순수 서브 — 클릭을 거의 지우면 믹스에서 «손가락» 이 아니라 «공기» 로 들립니다.
     딥하우스·미니멀·드럼앤베이스. */
  subkick:{sub:{f0:110,f1:45,drop:0.090,dec:0.70}, body:{f0:170,f1:70, drop:0.050,dec:0.16,amp:0.30},
           atk:{f:250,dec:0.014,amp:0.10}, click:{f:1800,q:0.7,dec:0.006,amp:0.03,bp:0}},
  /* 재즈 킥 — 작고 부드럽게 밟습니다. 클릭을 밴드패스로 돌려
     스틱이 가죽을 치는 소리만 남깁니다(wood 와 같은 이유). */
  jazz   :{sub:{f0:104,f1:52,drop:0.100,dec:0.34}, body:{f0:180,f1:86, drop:0.050,dec:0.15,amp:0.42},
           atk:{f:280,dec:0.022,amp:0.22}, click:{f:1400,q:1.4,dec:0.030,amp:0.20,bp:1}},
  /* 개버 — 바디를 가장 딱딱한 커브(sh 3)로 밀어 불규칙 배음을 만듭니다.
     하드코어·개버는 «왜곡된 킥 자체가 리드» 인 장르입니다. */
  gabber :{sub:{f0:160,f1:48,drop:0.040,dec:0.42}, body:{f0:300,f1:110,drop:0.018,dec:0.20,amp:0.85},
           atk:{f:560,dec:0.012,amp:0.62}, click:{f:3600,q:0.7,dec:0.010,amp:0.50,bp:0}, sh:3},
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
  const ws=shaperNode(S.sh!=null?S.sh:1,eb), blp=BQ('lowpass',6000,0.707,eb);
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

  /* ══ 세계 막울림 9종 ══════════════════════════════════════════
     ⚠ **출처가 위 STK 타악기와 다릅니다.** STK 는 물리모델 라이브러리라
       막울림(드럼헤드) 악기가 없습니다(Drummer 클래스는 샘플 재생입니다).
       그래서 이 9종은 다음 두 가지로만 채웠고, 지어낸 수치가 아닙니다:

         ① 기음·슬랩 주파수 — 각 악기의 **문헌상 조율 범위** 중앙값
         ② 이상적 원형막의 모드비 — 베셀 0점 비율
            1 : 1.593 : 2.136 : 2.296 : 2.653 : 2.918
            (shell 에 쓰는 값이 여기서 옵니다. 금속 셸인 timbale 과 달리
             막울림은 이 비율이라야 «드럼» 으로 들립니다)

       ③ amp·레벨은 **렌더해서 재고** 기존 8종 중앙값에 맞췄습니다.
     피치 하강폭도 물리에서 옵니다 — 막 장력이 유지되는 손드럼(콩가·젬베·
     타블라)은 10~15%만 떨어지고, 스틱으로 때리는 통드럼(수르두·타이코)은
     더 크게 떨어집니다. conga 주석과 같은 이유입니다. */

  /* 수르두 — 브라질 삼바의 저음 통드럼. 바투카다의 심장.
     아주 낮고 길게 울리며 sub 가 큽니다. */
  surdo  :{f0:95, f1:78,  dec:0.78,sub:0.72,type:'sine',     body:0},
  /* 젬베 — 서아프리카. 개방음(tone)을 기본으로 두고 슬랩을 세게 얹습니다.
     염소가죽이라 슬랩이 아주 밝습니다(2.9kHz). */
  djembe :{f0:210,f1:188, dec:0.42,sub:0.22,type:'sine',     body:0,
           slap:{f:2900,q:1.0,dec:0.026,amp:0.46}},
  /* 타블라(다얀) — 인도. 검은 반죽(syahi)이 막을 눌러 **배음이 조화적**입니다.
     그래서 다른 드럼과 달리 «음정이 또렷하게» 들립니다 —
     베셀비 대신 정수배에 가까운 1 : 2 : 3 을 shell 로 줍니다. */
  tabla  :{f0:330,f1:322, dec:0.46,sub:0.05,type:'sine',     body:0,
           slap:{f:3400,q:1.4,dec:0.014,amp:0.30}, shell:[2.0,3.0]},
  /* 타이코 — 일본. 통이 크고 두꺼워 아주 낮고 오래 갑니다. */
  taiko  :{f0:112,f1:86,  dec:0.92,sub:0.66,type:'sine',     body:1},
  /* 다르부카(둠) — 중동·발칸. 도자기·금속 몸통이라 슬랩(tek)이 금속성입니다. */
  darbuka:{f0:152,f1:132, dec:0.30,sub:0.30,type:'sine',     body:0,
           slap:{f:3800,q:1.3,dec:0.016,amp:0.44}},
  /* 쿠이카 — 브라질 마찰 드럼. 막 안쪽 막대를 문질러 **피치를 크게 끕니다.**
     그 활공이 정체성이라 하강폭이 다른 드럼의 서너 배입니다. */
  cuica  :{f0:520,f1:190, dec:0.34,sub:0.06,type:'sine',     body:0, drop:0.19},
  /* 로토톰 — 셸이 없이 헤드만 있는 톰. 통 울림이 없어 짧고 건조합니다. */
  rototom:{f0:290,f1:214, dec:0.22,sub:0,   type:'sine',     body:1},
  /* 토킹드럼 — 서아프리카. 겨드랑이로 줄을 조여 연주 중에 음을 굽힙니다.
     쿠이카와 반대로 **올라갔다 내려옵니다** — 여기서는 하강만 모사합니다. */
  talking:{f0:340,f1:232, dec:0.36,sub:0.10,type:'sine',     body:0, drop:0.12,
           slap:{f:2400,q:1.1,dec:0.018,amp:0.26}},
  /* 프레임드럼 — 보드란·다프·벤디르. 얕은 테에 막 하나라 저역이 얇고
     금방 죽습니다. 켈트·중동·포크. */
  frame  :{f0:176,f1:150, dec:0.26,sub:0.18,type:'sine',     body:1},
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

  /* ══ STK 에서 옮겨 온 10종 ══════════════════════════════════════
     출처: Perry R. Cook · Gary P. Scavone, **Synthesis ToolKit (STK)**
     `src/Shakers.cpp` 의 PhISEM/PhOLIES 파라미터 (MIT). vendor/stk-LICENSE 참고.

     ⚠ 손으로 지어낸 수치가 아닙니다. STK 는 극반경 r 과 샘플당 감쇠계수로
       적어 두었고, 아래는 그것을 우리 단위로 **환산**한 값입니다:

         Q   = f·π / ((1−r)·44100)        ← STK 는 SR 44100 기준
         dec = 3 / (−log₁₀ SYSTEM_DECAY) / 44100     (T60, 초)

       환산 스크립트와 원본 대조표는 docs/음색/01-STK차용.md 에 있습니다.
     ⚠ amp 만은 환산이 아닙니다 — STK 의 GAIN 은 자기네 신호 경로 기준이라
       그대로 못 씁니다. 우리 버스에서 **렌더해 RMS 를 재서** 맞췄습니다. */

  /* 마라카 — 라틴(살사·쿰비아·메렝게)의 기본 셰이커. 씨앗 25알.
     기존 shaker 보다 알이 굵어 중심이 낮고 알갱이가 성깁니다. */
  maraca   :{bp:[3200,5.70], dec:0.157, atk:0.005, amp:1.00},
  /* 세케레 — 서아프리카 조롱박 셰이커. 그물 구슬 64알이 바깥을 칩니다.
     Q 0.98 이라 사실상 광대역 — 아프로비트·주주의 그 '샤' 소리. */
  sekere   :{bp:[5500,0.98], dec:0.157, atk:0.004, amp:1.50, pink:1},
  /* 샌드페이퍼 — 사포를 문지르는 소리. 브러시 스네어와 짝으로 쓰면
     로파이·트립합의 질감이 됩니다. PhOLIES 계열. */
  sandpaper:{bp:[4500,0.80], dec:0.157, atk:0.010, amp:1.33, pink:1},
  /* 스틱 — 나무 막대 둘이 부딪히는 소리(STIX1). 카운트인·크로스스틱. */
  sticks   :{bp:[5500,0.98], dec:0.078, atk:0.001, amp:0.37},
  /* 자갈 — 굵은 자갈 23알(BIGROCKS). 인더스트리얼·테크노의 거친 질감. */
  rocks    :{bp:[6460,6.77], dec:0.045, atk:0.001, amp:0.97},

  /* 슬레이벨 — 방울 32개. 모드 5개가 전부 고역이고 위 둘은 게인이 낮습니다.
     소울·팝·크리스마스. */
  sleigh   :{tone:[2500,5300,6500,8300,9800], dec:0.261, amp:1.01,
             qs:[17.81,37.76,46.30,59.13,69.81], gains:[1,1,1,0.5,0.3]},
  /* 대나무 풍경 — 관 셋이 서로 부딪힙니다. Q 가 32~48 로 높아 길게 웁니다.
     앰비언트·다운템포·월드. */
  bamboo   :{tone:[2800,2240,3360], dec:1.566, amp:1.30,
             qs:[39.89,31.91,47.87], gains:[1,1,1]},
  /* 앙클룽 — 조율된 대나무 풍경(인도네시아). 7음이 실제 음계로 조율돼 있어
     다른 타악기와 달리 **선율감이 있습니다.** 가믈란·월드. */
  angklung :{tone:[1046.6,1174.8,1397,1568,1760,2093.3,2350], dec:1.566, amp:0.86,
             qs:[18.64,20.92,24.88,27.93,31.34,37.28,41.85], gains:[1,1,1,1,1,1,1]},
  /* 물방울 — 낮은 모드 셋(450·600·750). 아주 짧습니다(T60 39ms).
     앰비언트·다운템포·로파이의 공간감. */
  water    :{tone:[450,600,750], dec:0.039, amp:4.23,
             qs:[21.37,28.50,35.62], gains:[1,1,1]},
  /* 콜라캔 — 헬름홀츠 공명(370Hz) + 금속 모드 4개. 위 모드 게인이 1.8 로
     기음보다 큽니다 — 캔이 '깡' 하고 울리는 이유입니다. 로파이·실험. */
  cokecan  :{tone:[370,1025,1424,2149,3596], dec:0.157, amp:0.55,
             qs:[2.64,9.13,12.68,19.14,32.02], gains:[1,1.8,1.8,1.8,1.8]},

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
      /* qs·gains 를 주면 모드마다 다르게 — STK 에서 옮겨 온 악기가 그렇다.
         안 주면 예전처럼 공비로 떨어뜨린다(기존 엔진의 소리가 안 바뀐다). */
      const q  = S.qs    ? S.qs[i]    : S.q;
      const mg = S.gains ? S.gains[i] : Math.pow(0.62,i);
      const g=G('perc',end), f=BQ('bandpass',hz*rnd(0.012*H()),q,end);
      env(g,t,amp*mg,S.dec*Math.pow(0.80,i),0.0006);
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

  /* ══ 보강 7종 ══
     기존 여섯이 «두툼함 ~ 날카로움» 축을 덮고 있어, 바깥과
     장르별 정체성이 뚜렷한 것을 채웁니다.
     tmul 은 몸통(188·272Hz)을 통째로 올리는 배율입니다 —
     통이 얕을수록 올라갑니다(rim 이 1.9 로 가장 높은 이유). */

  /* 808 — 노이즈보다 두 삼각파 몸통이 지배적입니다. 그래서
     «치익» 이 아니라 «톡» 에 가깝습니다. 트랩·일렉트로. */
  eight08:{hp:1400,dec:0.20, tone:0.62,tdec:0.10, bp:0,crush:0},
  /* 909 — 808 보다 노이즈가 세고 밝습니다. 하우스·테크노. */
  nine09 :{hp:1800,dec:0.19, tone:0.34,tdec:0.08, bp:1,crush:0},
  /* 피콜로 — 통이 얕아 기음이 높고 짧습니다. 팝·록의 백비트. */
  piccolo:{hp:2400,dec:0.11, tone:0.34,tdec:0.05, bp:1,crush:0, tmul:1.45},
  /* 마칭 — 와이어가 길고 롤이 정체성입니다. 행진곡·뉴올리언스. */
  march  :{hp:1500,dec:0.30, tone:0.40,tdec:0.11, bp:1,crush:0},
  /* 드럼앤베이스 — 브레이크비트에서 따온 소리라 몸통이 얇고 밝습니다. */
  dnb    :{hp:2300,dec:0.14, tone:0.20,tdec:0.06, bp:1,crush:0},
  /* 트랩 — 가장 짧고 높습니다. 하이해트와 자리를 나눠야 해서입니다. */
  trap   :{hp:2600,dec:0.09, tone:0.18,tdec:0.04, bp:1,crush:0, tmul:1.30},
  /* 팻 — 통이 깊고 와이어가 낮습니다. 소울·모타운·베이퍼비트. */
  fat    :{hp:900, dec:0.28, tone:0.68,tdec:0.17, bp:0,crush:0},
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

  /* ══ 보강 5종 ══
     타격 수·간격·테일 셋만 바뀝니다 — 클랩은 이 셋이 전부입니다. */
  /* 808 — 세 번 치고 짧게 남깁니다. 대역이 좀 낮아 둔근합니다. */
  eight08:{offs:[0,0.010,0.020],             tail:0.22,q:1.3,f:1200},
  /* 909 — 타격이 네 번으로 더 촘촘하고 테일은 더 짧습니다. */
  nine09 :{offs:[0,0.009,0.018,0.028],       tail:0.18,q:1.5,f:1350},
  /* 스택 — 여러 명이 함께 치는 소리. 타격 다섯에 긴 테일. 가스펠·디스코. */
  stack  :{offs:[0,0.006,0.012,0.019,0.027], tail:0.35,q:1.0,f:1100},
  /* 룸 — 방 울림이 길게 붙은 것. 대역을 낮추고 Q 를 열어 넓게 퍼집니다. */
  room   :{offs:[0,0.014,0.030],             tail:0.45,q:0.9,f:950},
  /* 드라이 — 한 번만, 아주 짧고 좁게. 미니멀·테크노. */
  dry    :{offs:[0,0.007],                   tail:0.06,q:2.2,f:1700},
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

/* ── 하이햇 ──
   예전에는 metal/noise/tick 세 갈래가 함수 안에 if 로 박혀 있었습니다.
   엔진을 늘리려면 표라야 해서 갈랐습니다 — **기존 셋의 값은 그대로**라
   소리가 안 바뀝니다(metal 0.34·noise 7200/11500/0.55·tick 9500/×0.45).

   metal : 909식 6-오실레이터 금속 버스를 씀 (bp = metalBP 중심)
   hp/pk : 노이즈 계열의 하이패스와 피킹(그 위 강조)
   dm    : 감쇠 배율 — tick 처럼 더 짧게 끊을 때
   pink  : 화이트 대신 핑크 노이즈 */
const HAT = {
  metal :{metal:1, bp:10000,            amp:0.34, dm:1   },
  noise :{hp:7200, pk:11500, pq:1.2, pd:4, amp:0.55, dm:1   },
  tick  :{hp:9500, pk:11500, pq:1.2, pd:4, amp:0.55, dm:0.45},

  /* ── 보강 4종 ──
     같은 노이즈+필터 구조에서 대역과 감쇠만 바꿉니다.
     amp 는 렌더해서 재고 기존 셋의 중앙값에 맞췄습니다. */
  /* 디스코·펑크의 쨍한 오픈햇 — 훨씬 위쪽만 남기고 길게 끕니다 */
  sizzle:{hp:10500,pk:13500,pq:1.0, pd:6, amp:0.55, dm:1.35},
  /* 로파이·트립합 — 대역을 낮추고 핑크로 기울여 어둡게.
     ⚠ 핑크는 화이트보다 RMS 가 훨씬 낮습니다. amp 0.55 로 두었더니 실측이
       기존 셋보다 **14.3 dB** 낮았습니다(shaker·brush 주석이 경고한 그 함정).
       ×5.16 해서 2.84 로 올렸습니다 — 계산이 아니라 렌더해서 잰 값입니다. */
  dark  :{hp:4200, pk:6500, pq:0.9, pd:3, amp:2.84, dm:1.10, pink:1},
  /* 페달(풋) 햇 — 발로 닫는 소리라 낮고 뭉툭하며 아주 짧습니다 */
  foot  :{hp:5200, pk:8000, pq:1.4, pd:3, amp:0.55, dm:0.60},
  /* 하우스·테크노의 좁고 단단한 클로즈드 — 피킹 Q 를 높여 대역을 좁힙니다 */
  crisp :{hp:8600, pk:12500,pq:3.0, pd:7, amp:0.55, dm:0.80},
};
function hat(t,v,e,dec,open){
  if(openHat){ fadeOut(openHat.gain,t,open?0.005:0.007); openHat=null; }  // 초크
  const id=open?'ohat':'chat', mul=st2r(knob('htune'));
  const S=HAT[e]||HAT.noise;
  const d=dec*rnd(0.10*H()), end=t+d+0.15;
  const g=G(id,end);
  if(S.metal){
    metalBP.frequency.setValueAtTime(S.bp*mul*rnd(0.05*H()),t);
    tapMetal(g,end);
  }else{
    const hp=BQ('highpass',S.hp*mul*rnd(0.05*H()),0.707,end);
    const pk=BQ('peaking',S.pk*mul,S.pq,end,S.pd);
    hp.connect(pk).connect(g); (S.pink?tapPink:tapNoise)(hp,end);
  }
  env(g,t,v*S.amp*rnd(0.14*H()), d*S.dm, 0.0008);
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
