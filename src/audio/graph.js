/* §6 오디오 그래프 — 버스 · 앰프 · 리버브 · 마스터
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ═══ §6  오디오 그래프 ═════════════════════════════════════
   신호 흐름
     각 트랙 → chan → panner ┬→ mixBus ────────────┐
                             └→ send → sendMono → convolver → widener → revReturn ┘
     mixBus → busTrim ┬→ rumble HPF → glueComp ─┐
                      ├→ 저역 새추레이션 ────────┤→ sumBus → 새추레이션 → masterGain
                      └→ 익사이터 ──────────────┘                         → limComp → out
   ═════════════════════════════════════════════════════════ */

function boot(){
  if(booted) return;
  booted = true;

  /* ── 컨텍스트 ── */
  if(HAS_TONE){
    ctx = Tone.getContext().rawContext;
    Tone.getContext().lookAhead = 0.08;
  }else{
    ctx = new (window.AudioContext||window.webkitAudioContext)({latencyHint:'interactive'});
    showWarn('Tone.js를 불러오지 못했습니다. 내장 스케줄러로 실행되며 샘플 기능은 사용할 수 없습니다.');
  }
  CURVES = [mkCurve(1.1), mkCurve(1.8), mkCurve(2.8), mkCurve(4.0)];

  /* ── 마스터 체인 ── */
  masterGain = ctx.createGain(); masterGain.gain.value = knob('vol')/100*0.9;
  satIn  = ctx.createGain();
  satOut = ctx.createGain();
  const shaper = ctx.createWaveShaper(); shaper.curve=CURVES[1]; shaper.oversample='4x';
  const satLP  = ctx.createBiquadFilter(); satLP.type='lowpass'; satLP.frequency.value=15000;
  const rumble = ctx.createBiquadFilter();
  rumble.type='highpass'; rumble.frequency.value=20; rumble.Q.value=0.6;

  sumBus  = ctx.createGain();
  mixBus  = ctx.createGain();
  busTrim = ctx.createGain(); busTrim.gain.value = dbToGain(knob('trim'));

  /* ── 컴프레서 · 미터 · 스테레오 (Tone 있고 없고에 따라 분기) ── */
  if(HAS_TONE){
    glueComp = new Tone.Compressor({knee:9, release:0.19, attack:knob('gatk')/1000});
    limComp  = new Tone.Compressor({threshold:knob('lthr'), knee:1, ratio:16,
                                    attack:0.004, release:knob('lrel')/1000});
    meterOut  = new Tone.Meter({normalRange:false, smoothing:0.7});
    meterBass = new Tone.Meter({normalRange:false, smoothing:0.7});
    widener   = new Tone.StereoWidener(0.65);
  }else{
    glueComp = ctx.createDynamicsCompressor();
    glueComp.knee.value=9; glueComp.release.value=0.19; glueComp.attack.value=knob('gatk')/1000;
    limComp = ctx.createDynamicsCompressor();
    limComp.threshold.value=knob('lthr'); limComp.knee.value=1; limComp.ratio.value=16;
    limComp.attack.value=0.004; limComp.release.value=knob('lrel')/1000;
    meterOut  = ctx.createAnalyser(); meterOut.fftSize=1024;
    meterBass = ctx.createAnalyser(); meterBass.fftSize=1024;
    widener   = nativeWidener();
  }

  /* 본선: mix → trim → 럼블 컷 → 글루 컴프 → sum */
  mixBus.connect(busTrim); busTrim.connect(rumble);
  link(rumble,glueComp); glueComp.connect(sumBus);

  /* 병렬 1: 저역만 뽑아 새추레이션 (Sub 노브) */
  const lp1=ctx.createBiquadFilter(); lp1.type='lowpass'; lp1.frequency.value=110;
  const lp2=ctx.createBiquadFilter(); lp2.type='lowpass'; lp2.frequency.value=110;
  const lowSat=ctx.createWaveShaper(); lowSat.curve=CURVES[0]; lowSat.oversample='4x';
  lowGain=ctx.createGain();
  busTrim.connect(lp1).connect(lp2).connect(lowSat).connect(lowGain).connect(sumBus);

  /* 병렬 2: 저역을 왜곡해 배음만 되돌리는 익사이터 (Exciter 노브) */
  const elp =ctx.createBiquadFilter(); elp.type='lowpass';   elp.frequency.value=150;
  const epre=ctx.createGain(); epre.gain.value=2.4;
  const esh =ctx.createWaveShaper(); esh.curve=CURVES[2]; esh.oversample='4x';
  const eh1 =ctx.createBiquadFilter(); eh1.type='highpass';  eh1.frequency.value=190;
  const eh2 =ctx.createBiquadFilter(); eh2.type='highpass';  eh2.frequency.value=190;
  const elp2=ctx.createBiquadFilter(); elp2.type='lowpass';  elp2.frequency.value=3800;
  excGain=ctx.createGain();
  busTrim.connect(elp).connect(epre).connect(esh).connect(eh1).connect(eh2)
         .connect(elp2).connect(excGain).connect(sumBus);

  /* 출력단 */
  sumBus.connect(satIn).connect(shaper).connect(satLP).connect(satOut).connect(masterGain);
  link(masterGain, limComp);

  /* 트루피크 실링 — 리미터가 놓친 1ms 급 첨두를 여기서 받는다.
     −5.2 dBFS 아래는 통과, 위는 −2.0 dBFS 에 점근. (state.js mkCeiling)

     실링을 −1.0 dB 로 잡았을 때 샘플 피크는 −1.23 dB 로 내려갔지만
     트루피크는 여전히 +0.2 dBFS 였다 — 클리핑이 만든 고역이
     인터샘플 첨두를 1.4dB 나 밀어올린 것이다. 그래서
       ① 실링을 −2.0 dB 로 더 내리고
       ② 무릎(thr)을 0.70→0.55 로 넓혀 커브를 부드럽게 해
          고역 생성 자체를 줄인다.
     RMS 가 −9.8 dB 라 이 정도 실링은 라우드니스를 거의 안 깎는다. */
  tpClip = ctx.createWaveShaper();
  tpClip.curve = mkCeiling(0.45, dbToGain(-3.0));
  tpClip.oversample = 'none';
  link(limComp, tpClip);

  link(tpClip, meterOut);
  /* ⚠ tpClip 은 네이티브 노드다. 예전엔 여기가 Tone 노드(limComp)라
     .connect(Tone.getDestination()) 이 먹혔지만, 네이티브 노드로 같은 짓을 하면
     standardized-audio-context 가 "A value with the given key could not be found"
     로 죽고 마스터가 통째로 무음이 된다. 반드시 Tone.connect 로 넘긴다. */
  if(HAS_TONE) Tone.connect(tpClip, Tone.getDestination());
  else         meterOut.connect(ctx.destination);

  /* ── 리버브 ── */
  IR.room  = makeIR(0.9, 2.6, 0.006, 0.42);
  IR.plate = makeIR(1.7, 2.1, 0.012, 0.30);
  IR.hall  = makeIR(3.0, 1.7, 0.028, 0.20);
  convolver = ctx.createConvolver(); convolver.buffer = IR[UI.space.value];
  sendMono = ctx.createGain();
  const pdL=ctx.createGain(), pdR=ctx.createDelay(0.1); pdR.delayTime.value=0.013;
  const preMerge=ctx.createChannelMerger(2);
  sendMono.connect(pdL); pdL.connect(preMerge,0,0);
  sendMono.connect(pdR); pdR.connect(preMerge,0,1);
  preMerge.connect(convolver);
  const revHP=ctx.createBiquadFilter(); revHP.type='highpass'; revHP.frequency.value=300;
  revReturn=ctx.createGain();
  convolver.connect(revHP); link(revHP,widener);
  if(HAS_TONE) widener.connect(revReturn); else widener.output.connect(revReturn);
  revReturn.connect(mixBus);

  /* ── 사이드체인 덕킹 (킥이 칠 때 베이스/리버브를 눌러줌) ── */
  duckNode = ctx.createGain(); duckNode.gain.value = 1;
  duckNode.connect(mixBus);

  /* ── 채널 스트립 ── */
  ALLCH().forEach(t => {
    chan[t.id]   = ctx.createGain();
    panner[t.id] = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
    send[t.id]   = ctx.createGain();
    if(t.id==='bass'){
      const dc=ctx.createBiquadFilter(); dc.type='highpass'; dc.frequency.value=16; dc.Q.value=0.5;
      chan.bass.connect(dc); link(dc,meterBass); dc.connect(panner.bass);
    }else{
      chan[t.id].connect(panner[t.id]);
    }
    panner[t.id].connect(DUCKED.includes(t.id) ? duckNode : mixBus);
    panner[t.id].connect(send[t.id]).connect(sendMono);
  });
  chan.loop.gain.value = knob('lvol')/100;

  /* ── 상시 구동 소스: 화이트 노이즈 ── */
  const len=ctx.sampleRate*4;
  const nb=ctx.createBuffer(1,len,ctx.sampleRate);
  const nd=nb.getChannelData(0);
  for(let i=0;i<len;i++) nd[i]=Math.random()*2-1;
  noiseBus=ctx.createGain();
  const nsrc=ctx.createBufferSource(); nsrc.buffer=nb; nsrc.loop=true;
  nsrc.connect(noiseBus); nsrc.start(0);

  /* ── 상시 구동 소스: 핑크 노이즈 ──
     화이트를 넓은 대역으로 통과시키면 옥타브당 +3dB 로 기울어져
     실물보다 늘 쨍합니다. 브러시 스네어·셰이커처럼 대역이 넓은 보이스가
     그렇습니다. 좁은 Q 로 때리는 clave·agogo 계열은 화이트와 차이가
     없으니 그대로 둡니다.

     Paul Kellett 7탭 IIR 근사. Tone.js `Tone/source/Noise.ts` 의
     `_noiseBuffers.pink` 에서 가져왔습니다 (Tone.js MIT,
     Tone.js 자신은 zacharydenton/noise.js 를 출처로 밝혀 두었습니다). */
  const pb=ctx.createBuffer(1,len,ctx.sampleRate);
  const pd=pb.getChannelData(0);
  {
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for(let i=0;i<len;i++){
      const w=Math.random()*2-1;
      b0=0.99886*b0 + w*0.0555179;  b1=0.99332*b1 + w*0.0750759;
      b2=0.96900*b2 + w*0.1538520;  b3=0.86650*b3 + w*0.3104856;
      b4=0.55000*b4 + w*0.5329522;  b5=-0.7616*b5 - w*0.0168980;
      pd[i]=(b0+b1+b2+b3+b4+b5+b6 + w*0.5362)*0.11;
      b6=w*0.115926;
    }
  }
  pinkBus=ctx.createGain();
  /* ⚠ ×0.11 게인 보정 탓에 핑크는 화이트보다 RMS 가 낮습니다.
     쓰는 쪽 amp 를 그대로 두면 소리가 작아집니다 — 보정값은 실측으로 정합니다. */
  const psrc=ctx.createBufferSource(); psrc.buffer=pb; psrc.loop=true;
  psrc.connect(pinkBus); psrc.start(0);

  /* ── 상시 구동 소스: 909식 6-오실레이터 메탈 ── */
  const RATIOS=[2,3,4.16,5.43,6.79,8.21];
  const mhp=ctx.createBiquadFilter(); mhp.type='highpass'; mhp.frequency.value=7000;
  metalBP=ctx.createBiquadFilter(); metalBP.type='bandpass';
  metalBP.frequency.value=10000; metalBP.Q.value=0.9;
  metalBus=ctx.createGain();
  RATIOS.forEach(r => {
    const o=ctx.createOscillator();
    o.type='square'; o.frequency.value=40*r; o.connect(mhp); o.start(0);
  });
  mhp.connect(metalBP).connect(metalBus);

  /* ── 기타 앰프·캐비닛 ──
     엔진별로 한 번만 만들어 상시 연결한다. 노트마다 만들면 보이스당 15노드가 된다.
     그리고 왜곡이 '합산 후 1회'만 걸려야 파워코드의 인터모듈레이션이 살아난다 —
     현마다 따로 왜곡하면 5도 화음이 융합되지 않고 두 음이 따로 논다. */
  const bqf=(ty,f,q,db)=>{ const b=ctx.createBiquadFilter();
    b.type=ty; b.frequency.value=f;
    b.Q.value = (ty==='lowpass'||ty==='highpass') ? Q_DB(q) : q;
    b.gain.value=db||0; return b; };
  const gnn=v=>{ const g=ctx.createGain(); g.gain.value=v; return g; };
  const shp=c=>{ const w=ctx.createWaveShaper(); w.curve=c; w.oversample='4x'; return w; };
  const wire=a=>{ for(let i=0;i<a.length-1;i++) a[i].connect(a[i+1]); return a[0]; };

  TUBE={cln:mkTube(1.15,0.06), cru:mkTube(2.4,0.22),
        hi1:mkTube(2.2,0.26),  hi2:mkTube(5.0,0.08),
        /* 퍼즈는 진공관이 아니라 트랜지스터를 한계까지 밀어 거의 사각파를
           만듭니다. k 를 크게 잡아 하드 클리핑에 가깝게 갑니다. */
        fz1:mkTube(9.0,0.20),  fz2:mkTube(14.0,0.0)};

  /* 4×12 + V30 + SM57 근사. LP 5kHz 24dB/oct 가 "면도기↔기타"를 가른다 */
  const cab=(lpF,hpF,dip,pk,mk)=>[
    bqf('highpass',hpF,0.8), bqf('highpass',hpF,0.8),
    bqf('peaking',105,1.6,4.0), bqf('peaking',400,1.2,dip),
    bqf('peaking',2000,1.5,pk), bqf('peaking',3500,2.5,-5.0),
    bqf('lowpass',lpF,0.707),  bqf('lowpass',lpF,0.707), gnn(mk)];

  ampIn={};
  ampIn.body_steel = wire([bqf('highpass',75,0.7),
    bqf('peaking',100,3.5,5.0), bqf('peaking',205,2.5,3.5),
    bqf('peaking',400,2.0,2.0), bqf('peaking',2600,1.0,3.0),
    bqf('lowpass',12000,0.707), chan.gtr]);

  ampIn.body_nyl = wire([bqf('highpass',80,0.7),
    bqf('peaking',115,3.0,4.5), bqf('peaking',210,2.2,3.0),
    bqf('peaking',430,1.8,1.5), bqf('lowshelf',300,0.7,1.5),
    bqf('lowpass',5500,0.707), chan.gtr]);

  /* 밴조는 가죽 헤드라 저역이 통째로 없다. 200Hz 하이패스로 잘라내고
     헤드 공진(370Hz)과 브리지 대역(3kHz)을 세워야 그 소리가 난다. */
  ampIn.body_banjo = wire([bqf('highpass',160,0.7), bqf('highpass',160,0.7),
    bqf('peaking',370,2.6,4.5), bqf('peaking',1200,1.4,2.0),
    bqf('peaking',3000,1.2,5.0), bqf('lowpass',9000,0.707), chan.gtr]);

  /* 퍼즈 페달 → 앰프.
     하이게인(amp_hi)과 다른 점을 셋으로 만듭니다.
     ① 페달 앞에서 저역을 크게 잘라냄(160Hz ×2) — 퍼즈가 저역을 못 버팀
     ② 중역을 파냄(600Hz −7dB) — 그런지의 그 빈 중역
     ③ 클리핑을 두 번, 사이에 필터를 거의 안 둠 — 배음이 정연하지 않게 */
  gtrDrv.fz = gnn(9.0);
  ampIn.amp_fuzz = wire([
    bqf('highpass',160,0.7), bqf('highpass',160,0.7),
    bqf('peaking',600,1.0,-7.0), bqf('peaking',1600,1.2,3.0),
    gtrDrv.fz, shp(TUBE.fz1),
    bqf('lowpass',7000,0.707),
    gnn(3.2), shp(TUBE.fz2),
    bqf('highpass',110,0.7), gnn(0.13),
    ...cab(5200,90,-4.0,3.0,1.6), chan.gtr]);

  /* 사즈는 작고 얕은 나무통 — 저역이 거의 없고 중고역이 쨍합니다 */
  ampIn.body_saz = wire([bqf('highpass',180,0.7),
    bqf('peaking',320,2.4,4.0), bqf('peaking',900,1.6,2.5),
    bqf('peaking',2800,1.2,4.5), bqf('lowpass',9000,0.707), chan.gtr]);

  /* 시타르 몸통은 박(tumba) — 통이 크고 비어 저역 공진이 낮게 하나,
     자와리 버즈 대역(2~4kHz)이 크게 남는다. */
  ampIn.body_sitar = wire([bqf('highpass',110,0.7),
    bqf('peaking',180,2.2,4.0), bqf('peaking',540,1.6,2.0),
    bqf('peaking',2600,1.0,5.5), bqf('peaking',4200,1.4,3.0),
    bqf('lowpass',8000,0.707), chan.gtr]);

  /* ── 베이스 앰프 · 업라이트 몸통 ──
     현 베이스 엔진은 합성 베이스와 달리 서브 오실레이터가 없다.
     실제 베이스 앰프처럼 80Hz 를 세우고 400Hz 를 파서 자리를 만든다. */
  ampIn.bass_amp = wire([bqf('highpass',35,0.7),
    bqf('peaking',80,1.2,3.5), bqf('peaking',400,1.0,-2.5),
    bqf('peaking',800,1.2,1.5), bqf('peaking',2500,1.1,2.5),
    bqf('lowpass',5000,0.707), chan.bass]);

  /* 업라이트는 큰 나무 통 — 저역 공진이 살고 고역은 거의 없다 */
  ampIn.bass_upright = wire([bqf('highpass',40,0.7),
    bqf('peaking',70,2.0,4.5), bqf('peaking',180,1.6,2.5),
    bqf('peaking',400,1.4,-2.0), bqf('peaking',1100,1.0,1.5),
    bqf('lowpass',2600,0.707), chan.bass]);

  ampIn.amp_cln = wire([bqf('peaking',5800,2.2,5.0), bqf('lowpass',8500,0.707),
    bqf('highpass',90,0.7), bqf('peaking',250,1.2,-2.0),
    gnn(1.15), shp(TUBE.cln), gnn(0.92),
    bqf('highpass',90,0.8), bqf('peaking',160,1.2,2.0),
    bqf('peaking',3000,1.4,2.5), bqf('lowpass',6500,0.707), chan.gtr]);

  gtrDrv.cru = gnn(3.5);
  ampIn.amp_cru = wire([bqf('peaking',3000,1.8,4.0), bqf('lowpass',6000,0.707),
    bqf('highpass',120,0.7), bqf('peaking',700,0.9,-3.0), bqf('peaking',2000,0.8,3.5),
    gtrDrv.cru, shp(TUBE.cru), bqf('highpass',70,0.7), gnn(0.42),
    ...cab(5500,85,-3.5,3.5,1.6), chan.gtr]);

  /* 하이게인은 2단 캐스케이드 — 1단 비대칭(짝수배음), 2단 대칭(홀수배음).
     단간 필터가 없으면 하이게인이 아니라 잡음이 된다. */
  gtrDrv.hi = gnn(4.0);
  /* 드라이브 앞 하이패스는 저역을 정리해 뭉개짐을 막는 게 목적인데
     150Hz 를 두 번 걸면 A2(110Hz)·E2(82Hz) 의 기음 자체가 사라진다.
     기음이 최강 배음보다 24dB 낮게 측정됐다 → 100Hz 로 낮춘다. */
  ampIn.amp_hi = wire([
    bqf('highpass',100,0.7), bqf('highpass',100,0.7),
    bqf('peaking',720,0.8,6.0), bqf('peaking',240,1.0,-4.0),
    gtrDrv.hi, shp(TUBE.hi1),
    bqf('lowpass',8000,0.707), bqf('highpass',110,0.7),
    gnn(6.0), shp(TUBE.hi2),
    /* 출력 트림 — 예전엔 하이게인을 쓰는 프리셋이 없어 드러나지 않았다.
       TONE_KIT 이 Metal 계열에 hi 를 배정하자 마스터가 −7.9 LUFS 로 튀고
       트루피크가 +0.2 dBFS 로 클리핑했다.(측정 확인) 6dB 내린다. */
    bqf('lowpass',6000,0.707), bqf('highpass',70,0.7), gnn(0.22),
    ...cab(5000,80,-5.0,4.5,1.78), chan.gtr]);

  /* ── 기타 버스 이펙트 (Tone.js 를 그대로 씀) ──
     와·페이저·코러스는 장르 정체성인데 우리에게 통째로 없었습니다.
     셋 다 AudioWorklet 을 안 쓰는 네이티브 노드 조합이라 file:// 에서도 돕니다.
     보이스마다 만들지 않고 **버스에 한 번만** 답니다 — 앰프 체인과 같은 원칙입니다.

     직렬로 걸고 wet=0 으로 재워 둡니다(Tone 의 wet 0 은 드라이 통과).
     쓰는 엔진이 나타나면 그 하나만 깨웁니다.

     ⚠ 함정 셋 (docs/tone-js-차용.md ★1 — 전부 실측 확인된 것):
       ① Tone.Chorus 는 생성자가 LFO 를 안 켠다. .start() 를 빠뜨리면
          코러스가 아니라 고정 딜레이(콤 필터 착색)가 된다.
       ② Phaser·AutoWah 의 기본 wet 은 1 인데, 올패스는 진폭이 평탄해서
          드라이와 섞여야 노치가 생긴다. wet=1 이면 효과가 거의 없다.
          (화이트노이즈 실측: wet 1.0 편차 9.5dB vs wet 0.5 편차 18.1dB)
       ③ 셋 다 StereoEffect 라 내부에서 2채널을 쓴다.
          panner.gtr **앞**에 넣어야 팬이 안 무너진다. */
  if(HAS_TONE){
    try{
      gtrFX = {
        phaser: new Tone.Phaser({frequency:0.45, octaves:3, stages:10,
                                 Q:10, baseFrequency:350, wet:0}),
        wah   : new Tone.AutoWah({baseFrequency:110, octaves:5, sensitivity:-8,
                                  Q:2.4, gain:2, follower:0.18, wet:0}),
        chorus: new Tone.Chorus({frequency:1.2, delayTime:3.5, depth:0.62,
                                 spread:180, feedback:0, wet:0}),
      };
      gtrFX.chorus.start();                     // ① LFO 를 손으로 켠다
      chan.gtr.disconnect(panner.gtr);
      Tone.connect(chan.gtr, gtrFX.phaser);
      gtrFX.phaser.connect(gtrFX.wah);
      gtrFX.wah.connect(gtrFX.chorus);
      gtrFX.chorus.connect(panner.gtr);         // ③ 팬 앞
    }catch(err){
      /* Tone 판이 달라 못 만들면 이펙트만 포기하고 원래 배선으로 돌아간다 —
         기타가 통째로 안 들리는 것보다 낫다. */
      gtrFX=null;
      try{ chan.gtr.disconnect(); }catch(e){}
      chan.gtr.connect(panner.gtr);      // 센드는 panner 에서 갈라지므로 건드릴 게 없다
      console.warn('기타 이펙트를 못 걸었습니다 — 드라이로 갑니다', err);
    }
  }

  /* ── 건반 버스 코러스 (Juno BBD 근사) ── */
  const kdL=ctx.createDelay(0.05), kdR=ctx.createDelay(0.05);
  kdL.delayTime.value=0.0032; kdR.delayTime.value=0.0041;
  const kcl=ctx.createOscillator(); kcl.frequency.value=0.513;
  const kcg=ctx.createGain(); kcg.gain.value=0.0011;
  const kinv=ctx.createGain(); kinv.gain.value=-1;
  kcl.connect(kcg); kcg.connect(kdL.delayTime);
  kcg.connect(kinv).connect(kdR.delayTime); kcl.start(0);
  const kmg=ctx.createChannelMerger(2);
  chan.keys.connect(kdL).connect(kmg,0,0);
  chan.keys.connect(kdR).connect(kmg,0,1);
  keysWet=ctx.createGain(); keysWet.gain.value=0.0;
  kmg.connect(keysWet).connect(panner.keys);

  /* ── 트랜스포트 ── */
  if(HAS_TONE){
    Tone.Transport.bpm.value = knob('bpm');
    Tone.Transport.swingSubdivision = '16n';
    Tone.Transport.swing = knob('swing')/100;
    Tone.Transport.scheduleRepeat(onTick,'16n');
  }

  applyWidth(); applyRev(); applyDrive(); applyLow(); applyRevWidth(); applyGlueAmt();
  setInterval(sweep,120);
  requestAnimationFrame(meterLoop);
}

/** 사용자 제스처 후 오디오를 깨움 */
function wake(){
  boot();
  if(HAS_TONE) Tone.start();
  else if(ctx.state==='suspended') ctx.resume();
}
function showWarn(msg){ UI.warn.textContent=msg; UI.warn.classList.add('on'); }
function setStat(msg,cls){ UI.kstat.textContent=msg; UI.kstat.className='kstat'+(cls?' '+cls:''); }
