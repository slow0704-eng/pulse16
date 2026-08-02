/* PULSE·16 계측 하네스 공용 심(shim)
   ════════════════════════════════════════════════════════════
   이 파일의 존재 이유는 하나입니다 — **앱 코드를 복사하지 않는 것.**

   예전 하네스(measure-voices / measure-tonal)는 src/audio/* 와
   src/core/engines.js 를 통째로 복사해 두고 있었습니다. 그래서 앱에
   엔진이 늘어나면 하네스가 조용히 거짓말을 했습니다. 실측으로 확인한
   드리프트만 이만큼이었습니다.

     · perc/scratch          앱에 있는데 하네스에 없었다
     · gtr/fuzz twelve pedal saz  없었다 (amp_fuzz · body_saz 도)
     · keys/vocoder harpsi   없었다
     · keys/piano vibes marimba
         앱은 struck.js(가산합성)로 갈아탔는데 하네스는 옛 FM 경로를
         재고 있었다 — 표에 찍힌 배음이 앱의 소리가 아니었다

   tools/analyze-melody.html 이 **데이터**에 대해 먼저 한 것을
   **오디오 그래프**까지 넓힌 것입니다. 방법은 셋입니다.

     ① src/ 를 <script src> 로 그대로 로드한다 (복사 금지)
     ② dom.js · ui/* · main.js 자리를 이 파일이 최소한으로 메운다.
        노브 기본값은 적어 두지 않고 pulse16-mk16.html 에서 직접 읽는다 —
        적는 순간 그것도 복사가 되기 때문.
     ③ boot() 이 만드는 AudioContext 를 OfflineAudioContext 로
        바꿔치기해, 앱의 진짜 그래프(앰프·캐비닛·몸통 필터 포함)를
        오프라인에서 돌린다. 측정 지점만 chan[] 으로 옮긴다.

   ⚠ 전역 렉시컬 스코프를 앱과 공유하므로 여기서 선언하는 이름은
     src/ 의 어떤 이름과도 겹치면 안 됩니다(겹치면 SyntaxError).
     측정용 헬퍼는 h- 접두사를 씁니다.
   ════════════════════════════════════════════════════════════ */
'use strict';

const HARNESS_SR = 48000;

/* ── ② dom.js 대체 ─────────────────────────────────────────
   UI 는 "요소인 척하는 껍데기" 를 돌려주는 프록시입니다.
   knob()/setKnob() 은 dom.js 와 같은 계약을 지킵니다. */
const KNOB = {};
const UI = new Proxy({}, {
  get(t, k){
    if(typeof k !== 'string') return undefined;
    if(!t[k]) t[k] = {value:(k in KNOB ? KNOB[k] : '0'), textContent:'', className:'',
                      classList:{add(){}, remove(){}, toggle(){}}};
    return t[k];
  }
});
const knob = id => +UI[id].value;
function setKnob(id, v){ UI[id].value = v; }
function meterLoop(){}          // ui/meters.js 대체 — boot() 마지막 줄이 부른다

/* 화면 갱신·노드 회수는 오프라인 렌더 중에 돌면 안 된다.
   sweep() 이 렌더 도중 노드를 disconnect 하면 측정이 통째로 망가진다. */
window.setInterval = () => 0;
window.requestAnimationFrame = () => 0;

/** 노브 기본값을 앱 HTML 에서 직접 읽는다 (하드코딩 금지) */
async function loadKnobDefaults(path = '../pulse16-mk16.html'){
  const html = await (await fetch(path)).text();
  for(const m of html.matchAll(/<input\b[^>]*>/g)){
    const id = /\bid="([^"]+)"/.exec(m[0]), v = /\bvalue="([^"]*)"/.exec(m[0]);
    if(id && v) KNOB[id[1]] = v[1];
  }
  for(const m of html.matchAll(/<select\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){
    const body = m[2];
    const sel = /<option[^>]*\bselected\b[^>]*value="([^"]*)"/.exec(body)
             || /<option[^>]*value="([^"]*)"[^>]*\bselected\b/.exec(body)
             || /<option[^>]*value="([^"]*)"/.exec(body);
    if(sel) KNOB[m[1]] = sel[1];
  }
  if(!KNOB.space) KNOB.space = 'room';
  return KNOB;
}

/* ── ③ 오프라인 boot ──────────────────────────────────────── */
let OFF = null;
let hPatched = false;

/** ⚠ 앱 버그 우회 (src 를 못 고치므로 하네스에서 감싼다)
    src/audio/graph.js:103  `link(revHP, widener)`
    Tone.js 가 없으면 widener 는 nativeWidener() 가 만든 **평범한 객체**인데
    link() 는 HAS_TONE 이 false 면 `a.connect(b)` 로 가버린다 →
    BiquadFilterNode.connect(plainObject) 에서 TypeError.
    즉 "Tone.js 를 못 불러왔을 때" 의 폴백 경로가 boot() 중간에서 죽는다.
    (link 은 const 라 못 바꾸므로 nativeWidener 의 반환값을 노드로 만든다) */
function hPatchApp(){
  if(hPatched) return; hPatched = true;
  const orig = nativeWidener;
  window.nativeWidener = function(){
    const w = orig();
    return Object.assign(w.input, {input:w.input, output:w.output, setWidth:w.setWidth});
  };
}

/** 앱의 boot() 을 OfflineAudioContext 위에서 통째로 돌린다.
    반환값의 startRendering() 을 부르기 전에 보이스를 예약하면 된다. */
function offlineBoot(seconds){
  hPatchApp();
  OFF = new OfflineAudioContext(2, Math.ceil(HARNESS_SR*seconds), HARNESS_SR);
  window.AudioContext = function(){ return OFF; };
  window.webkitAudioContext = window.AudioContext;

  /* 앱 전역 상태를 되돌린다. 지난 렌더의 노드가 새 컨텍스트로 새면
     connect 순간 InvalidAccessError 가 난다. */
  booted = false;
  pool.gain.length = 0; pool.bq.length = 0; retireQ.length = 0; liveNodes = 0;
  openHat = null; bassRef = null; smpOpen = false;
  if(typeof keysVox    !== 'undefined') keysVox = [];
  if(typeof gtrRef     !== 'undefined') gtrRef = null;
  if(typeof gtrRef2    !== 'undefined') gtrRef2 = null;
  if(typeof bassStrRef !== 'undefined') bassStrRef = null;
  if(typeof tubaRef    !== 'undefined') tubaRef = null;
  /* PeriodicWave 는 컨텍스트에 묶여 있어 반드시 버려야 한다.
     (AudioBuffer 는 컨텍스트 독립이라 현·타현 캐시는 그대로 둔다 —
      샘플레이트가 항상 48k 로 같으므로 안전하고, 굽는 비용도 아낀다) */
  if(typeof WAVES !== 'undefined') Object.keys(WAVES).forEach(k => delete WAVES[k]);

  boot();
  meterOut.disconnect();      // 마스터 체인을 출력에서 뗀다 — 프로브만 남긴다
  return OFF;
}

/** 트랙 채널을 곧장 출력으로 뽑는다. 팬·리버브·글루·리미터를 안 거친
    "보이스 그대로" 를 잰다. 기타·베이스의 앰프/캐비닛은 chan 앞단이라 포함된다. */
function probeTrack(id){
  const p = OFF.createGain(); p.gain.value = 1;
  chan[id].disconnect();
  chan[id].connect(p);
  p.connect(OFF.destination);
  return p;
}

/** midi → Hz */
const hHz = m => 440*Math.pow(2, (m-69)/12);

/* ── 측정 ─────────────────────────────────────────────────── */
const hdB = x => (x < 1e-9 ? -Infinity : 20*Math.log10(x));

function hMono(buf){
  const L = buf.getChannelData(0);
  const R = buf.numberOfChannels > 1 ? buf.getChannelData(1) : L;
  const d = new Float32Array(L.length);
  for(let i=0;i<d.length;i++) d[i] = (L[i]+R[i])*0.5;
  return d;
}

/** 구간 [a,b) 초에서 주파수 f 의 크기 */
function hGoertzel(d,f,a,b){
  const i0 = Math.max(0,Math.floor(a*HARNESS_SR));
  const i1 = Math.min(d.length, Math.floor(b*HARNESS_SR));
  const N = i1-i0; if(N < 32) return 0;
  const w = 2*Math.PI*f/HARNESS_SR, c = 2*Math.cos(w);
  let s0=0,s1=0,s2=0;
  for(let i=i0;i<i1;i++){ s0=d[i]+c*s1-s2; s2=s1; s1=s0; }
  return 2*Math.sqrt(Math.max(s1*s1+s2*s2-c*s1*s2,0))/N;
}

const H_BANDS = [40,80,160,320,640,1280,2560,5120,10240,16000];

/** 파형 하나를 통째로 잰다.
    f0 를 주면 배음 구조까지, 안 주면 레벨·감쇠·대역만. */
function hAnalyze(buf, f0, opt={}){
  const d = hMono(buf);
  let peak=0, pAt=0, sum=0, dc=0, maxJump=0, jAt=0;
  for(let i=0;i<d.length;i++){
    const a=Math.abs(d[i]); if(a>peak){ peak=a; pAt=i; }
    sum += d[i]*d[i]; dc += d[i];
    if(i){ const j=Math.abs(d[i]-d[i-1]); if(j>maxJump){ maxJump=j; jAt=i; } }
  }
  const rms = Math.sqrt(sum/d.length);
  dc /= d.length;
  const first = Math.abs(d[0]);

  /* 어택 — 피크의 90% 에 처음 닿는 시각 */
  let atk=0;
  for(let i=0;i<d.length;i++){ if(Math.abs(d[i]) >= peak*0.9){ atk=i/HARNESS_SR; break; } }

  /* 2ms RMS 포락선으로 감쇠 측정.
     T60 은 끝까지 못 가는 경우가 많으므로 T20 을 3배 해 추정값도 낸다. */
  const W = Math.round(HARNESS_SR*0.002), envA = [];
  for(let i=0;i+W<d.length;i+=W){
    let s=0; for(let k=0;k<W;k++) s += d[i+k]*d[i+k];
    envA.push(Math.sqrt(s/W));
  }
  const pIdx = Math.min(Math.floor(pAt/W), Math.max(envA.length-1,0));
  let eP = 0; for(let i=pIdx;i<envA.length;i++) if(envA[i]>eP) eP=envA[i];
  const fall = db => {
    const th = eP*Math.pow(10,-db/20);
    for(let i=pIdx;i<envA.length;i++) if(envA[i] < th) return Math.max((i*W-pAt)/HARNESS_SR,0);
    return null;
  };
  const t60 = eP>1e-9 ? fall(60) : null;
  const t20 = eP>1e-9 ? fall(20) : null;

  /* 꼬리 — 마지막 200샘플 RMS (컷오프 클릭 위험) */
  let ts=0; for(let i=Math.max(0,d.length-200);i<d.length;i++) ts += d[i]*d[i];
  const tail = Math.sqrt(ts/200);

  const a0 = opt.hStart!=null ? opt.hStart : 0.03;
  const a1 = opt.hEnd  !=null ? opt.hEnd   : 0.23;

  /* 대역 분포 · 중심 */
  const mag = H_BANDS.map(f => hGoertzel(d,f,a0,Math.min(a1,a0+0.2)));
  const tot = mag.reduce((x,y)=>x+y,0) || 1;
  let cent=0; H_BANDS.forEach((f,i)=> cent += f*mag[i]/tot);
  const magA = H_BANDS.map(f => hGoertzel(d,f,0,0.020));
  const totA = magA.reduce((x,y)=>x+y,0) || 1;
  let centA=0; H_BANDS.forEach((f,i)=> centA += f*magA[i]/totA);

  const r = {peak,rms,crest:hdB(peak/Math.max(rms,1e-12)),dc,first,maxJump,
             jumpMs:jAt/HARNESS_SR*1000, tail, atk, t60, t20,
             t60est: t20==null?null:t20*3, cent, centA,
             bands:H_BANDS.map((f,i)=>[f,mag[i]/tot])};

  if(f0){
    const NH = opt.nh || 10;
    const A = []; for(let n=1;n<=NH;n++) A.push(hGoertzel(d, f0*n, a0, a1));
    const hMax = Math.max(...A) || 1e-12;
    const inter = []; for(let n=1;n<NH;n++) inter.push(hGoertzel(d, f0*(n+0.5), a0, a1));
    const hSum = A.reduce((x,y)=>x+y,0), iSum = inter.reduce((x,y)=>x+y,0);
    let odd=0, even=0;
    A.forEach((v,i)=>{ if((i+1)%2) odd+=v*v; else even+=v*v; });
    r.hAbs = A;
    r.H = A.map(h => hdB(h/hMax));
    r.hRel = A.map(h => hdB(h/Math.max(A[0],1e-12)));   // 기음 대비
    r.noise = iSum/Math.max(hSum,1e-12);
    r.oddEven = hdB(Math.sqrt(odd)/Math.max(Math.sqrt(even),1e-12));
  }
  r.d = d;
  return r;
}

/** n 번째 배음의 **실제** 주파수를 ±range cent 안에서 찾아 비조화도를 잰다.
    f_n = n·f0·√(1+B·n²) 이므로 B 를 최소제곱으로 역산한다. */
function hInharmonicity(d, f0, nMax, a, b, range=60){
  const parts = [];
  for(let n=1;n<=nMax;n++){
    const base = f0*n;
    if(base > HARNESS_SR*0.45) break;
    let best=0, bestF=base;
    for(let c=-range;c<=range;c++){
      const f = base*Math.pow(2,c/1200);
      const v = hGoertzel(d,f,a,b);
      if(v>best){ best=v; bestF=f; }
    }
    parts.push({n, f:bestF, amp:best, cents:1200*Math.log2(bestF/base)});
  }
  /* 진폭이 충분한 배음만 써서 B 추정: (f_n/(n f0))² − 1 = B n² */
  const strong = parts.filter(p => p.amp > (parts[0]?parts[0].amp:1)*0.02 && p.n>1);
  let num=0, den=0;
  strong.forEach(p => {
    const y = Math.pow(p.f/(p.n*f0),2) - 1;
    const x = p.n*p.n;
    num += x*y; den += x*x;
  });
  return {parts, B: den>0 ? num/den : null, used: strong.length};
}

/** 배음 포락선(주파수, dB) — 포먼트가 서 있는지 보는 데 쓴다 */
function hEnvelope(d, f0, nMax, a, b){
  const out=[];
  for(let n=1;n<=nMax;n++){
    const f=f0*n; if(f>HARNESS_SR*0.45) break;
    out.push([f, hGoertzel(d,f,a,b)]);
  }
  const mx = Math.max(...out.map(o=>o[1])) || 1e-12;
  return out.map(([f,v])=>[f, hdB(v/mx)]);
}
