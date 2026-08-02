/* §5 오디오 유틸 — 노드 풀 · 필터 · 엔벨로프
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ═══ §5  오디오 유틸 ═══════════════════════════════════════ */

const dbToGain = d => Math.pow(10, d/20);
const st2r     = s => Math.pow(2, s/12);
const dB       = x => 20*Math.log10(Math.max(x,1e-6));
const rnd      = a => 1 + (Math.random()*2-1)*a;

/* 자주 읽는 노브들 */
const H   = () => knob('hum')/100;      // 휴머나이즈
const SUB = () => knob('sub')/100;
const PUN = () => knob('punch')/100;
const spb = () => 60/knob('bpm');       // 한 박의 초
const effProb = id => 1 - (1-(probT[id] ?? 1)) * (knob('chance')/100);

/** Tone 노드와 네이티브 노드를 안전하게 연결 */
const link = (a,b) => { if(HAS_TONE && (a.output||b.input)) Tone.connect(a,b); else a.connect(b); };

/** 팬·리버브 센드를 가진 전체 채널 목록.
    기타는 킥과 대역이 겹치지 않고(150Hz 하이패스) 덕킹하면 리프 리듬이 뭉개지므로
    사이드체인을 태우지 않는다. 대신 앰프 체인의 하이패스로 자리를 비운다. */
const ALLCH = () => [...TRACKS,
  {id:'bass',pan:0,   send:0.03},
  {id:'keys',pan:0,   send:0.22},
  {id:'gtr', pan:0.18,send:0.06},
  {id:'keys2',pan:-0.26,send:0.24},     // 2번 트랙은 반대쪽으로 벌려 자리를 나눈다
  {id:'gtr2', pan:-0.18,send:0.08},
  {id:'loop',pan:0,   send:0.14}];
const DUCKED = ['bass','keys','keys2'];          // 사이드체인을 받는 채널

/** 트랙 id → 현재 튠(반음) */
const tuneOf = id => TUNE_KNOB[id] ? knob(TUNE_KNOB[id]) : 0;
const rateOf = id => st2r(tuneOf(id));

/* ⚠ Web Audio 의 BiquadFilter Q 는 필터 종류마다 단위가 다르다.
   lowpass·highpass → **dB 단위** (내부에서 10^(Q/20) 으로 변환)
   bandpass·peaking·notch → 선형
   측정으로 확인함: lowpass 에 Q=5 를 넣으면 컷오프 이득이 5 가 아니라 1.778.
   그래서 "레조넌스를 걸었다"고 생각한 값들이 실제로는 거의 평탄했다.
   아래 헬퍼로 의도한 선형 Q 를 dB 로 바꿔 쓴다. */
const Q_DB = qLinear => 20*Math.log10(qLinear);
const Q_BUTTER = Q_DB(Math.SQRT1_2);        // ≈ −3.01 dB — 진짜 버터워스

/* mkCurve(k) 의 원점 기울기 = k/tanh(k).
   커브를 갈아탈 때 이 값만큼 레벨이 튀므로 사용처에서 나눠줘야 한다.
   CURVES 의 k = [1.1, 1.8, 2.8, 4.0] 과 같은 순서. */
const CURVE_K = [1.1, 1.8, 2.8, 4.0];
const CURVE_GAIN = CURVE_K.map(k => k/Math.tanh(k));   // ≈ [1.374, 1.901, 2.821, 4.003]

/** tanh 새추레이션 커브 */
function mkCurve(k){
  const n=8192, c=new Float32Array(n), norm=Math.tanh(k);
  for(let i=0;i<n;i++){ const x=i/(n/2)-1; c[i]=Math.tanh(x*k)/norm; }
  return c;
}
/** 노이즈 기반 임펄스 응답 생성 */
function makeIR(sec,decay,pre,damp){
  const rate=ctx.sampleRate, len=Math.floor(rate*sec), pd=Math.floor(rate*pre);
  const buf=ctx.createBuffer(2,len+pd,rate);
  for(let ch=0;ch<2;ch++){
    const d=buf.getChannelData(ch); let lp=0;
    for(let i=0;i<len;i++){
      const t=i/len, w=Math.random()*2-1;
      lp+=(w-lp)*damp; d[pd+i]=lp*Math.pow(1-t,decay)*(1-t);
    }
  }
  return buf;
}
/** Tone.StereoWidener 없을 때 쓰는 M/S 확장기 */
function nativeWidener(){
  const inp=ctx.createGain(), sp=ctx.createChannelSplitter(2), mg=ctx.createChannelMerger(2);
  const mid=ctx.createGain();  mid.gain.value=0.5;
  const side=ctx.createGain(); side.gain.value=0.5;
  const negR=ctx.createGain(); negR.gain.value=-1;
  const negS=ctx.createGain(); negS.gain.value=-1;
  inp.connect(sp);
  sp.connect(mid,0); sp.connect(mid,1);
  sp.connect(side,0); sp.connect(negR,1); negR.connect(side);
  mid.connect(mg,0,0); mid.connect(mg,0,1);
  side.connect(mg,0,0); side.connect(negS); negS.connect(mg,0,1);
  return {input:inp, output:mg, setWidth:w => { side.gain.value=0.5*w; }};
}

/* ── 노드 풀 ──
   보이스마다 GainNode·BiquadFilterNode 를 새로 만들면 GC 압력이 큽니다.
   재생이 끝난 노드를 retireQ 에 넣고 sweep() 이 회수해 재사용합니다. */
function acqGain(){
  const g = pool.gain.pop() || ctx.createGain();
  g.gain.cancelScheduledValues(0); g.gain.value=0; liveNodes++; return g;
}
function acqBQ(type,freq,q,gainDb){
  const b = pool.bq.pop() || ctx.createBiquadFilter();
  b.frequency.cancelScheduledValues(0); b.Q.cancelScheduledValues(0); b.gain.cancelScheduledValues(0);
  b.type=type; b.frequency.value=freq; b.Q.value=(q==null?0.707:q); b.gain.value=gainDb||0;
  liveNodes++; return b;
}
/** kind 가 'gain'/'bq' 면 풀로 돌려보내고, 그 외('x')는 disconnect 만 */
function retire(node,kind,at){ retireQ.push({node,kind,at}); }
function sweep(){
  if(!ctx) return;
  const now=ctx.currentTime;
  for(let i=retireQ.length-1;i>=0;i--){
    if(retireQ[i].at>now) continue;
    const {node,kind}=retireQ[i]; retireQ.splice(i,1);
    try{ node.disconnect(); }catch(e){}
    liveNodes--;
    if(pool[kind] && pool[kind].length<64) pool[kind].push(node);
  }
}

/* ── AudioParam 헬퍼 ── */
function hold(param,t){
  if(param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(t);
  else { param.cancelScheduledValues(t); param.setValueAtTime(param.value,t); }
}
function fadeOut(param,t,sec){ hold(param,t); param.linearRampToValueAtTime(0,t+sec); }

/** 1회용 오실레이터 */
function osc(type,t,d){
  const o=ctx.createOscillator(); o.type=type;
  o.start(t); o.stop(t+d);
  o.onended=()=>{ try{ o.disconnect(); }catch(e){} };
  return o;
}
/** 어택-디케이 엔벨로프 */
function env(g,t,peak,dec,atk=0.002){
  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(peak,t+atk);
  g.gain.exponentialRampToValueAtTime(Math.max(peak*0.0008,1e-5),t+atk+dec);
  g.gain.linearRampToValueAtTime(0,t+atk+dec+0.008);
}
/** 니(knee)가 있는 2단 디케이 엔벨로프 */
function env2(g,t,peak,knee,kneeT,dec,atk=0.002){
  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(peak,t+atk);
  g.gain.exponentialRampToValueAtTime(Math.max(peak*knee,1e-5),t+atk+kneeT);
  g.gain.exponentialRampToValueAtTime(Math.max(peak*0.0006,1e-5),t+atk+kneeT+dec);
  g.gain.linearRampToValueAtTime(0,t+atk+kneeT+dec+0.01);
}
/* 보이스 안에서 쓰는 짧은 생성자들 */
function G(id,end){ const g=acqGain(); g.connect(chan[id]); retire(g,'gain',end+0.05); return g; }
function BQ(type,f,q,end,db){ const b=acqBQ(type,f,q,db); retire(b,'bq',end+0.05); return b; }
function shaperNode(idx,end){
  const w=ctx.createWaveShaper(); w.curve=CURVES[idx]; w.oversample='4x';
  retire({disconnect:()=>{ try{ w.disconnect(); }catch(e){} }},'x',end+0.05);
  return w;
}
/* 상시 구동 중인 노이즈/메탈 버스를 잠깐 물렸다 떼는 헬퍼 */
function tapNoise(node,end){
  noiseBus.connect(node);
  retire({disconnect:()=>{ try{ noiseBus.disconnect(node); }catch(e){} }},'x',end+0.06);
}
function tapMetal(node,end){
  metalBus.connect(node);
  retire({disconnect:()=>{ try{ metalBus.disconnect(node); }catch(e){} }},'x',end+0.06);
}
