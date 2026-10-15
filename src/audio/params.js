/* §8 파라미터 적용
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ═══ §8  파라미터 적용 ═════════════════════════════════════ */

function applyWidth(){
  if(!ctx) return;
  const w = knob('width')/100;
  ALLCH().forEach(t => { if(panner[t.id] && panner[t.id].pan) panner[t.id].pan.value=(t.pan||0)*w*1.6; });
  /* 더블 트래킹 — 두 테이크를 좌우로 벌린다. 폭 노브를 따르되 끝(±0.85)을 넘지 않는다.
     둘이 거의 같은 신호라 그대로 더하면 기타가 커지므로 각각 −3dB(√½) 씩 깎아 파워를 지킨다. */
  if(dblWet){
    const d = gtrDbl, sp = 0.85*Math.min(1, w*1.6)*d;
    const g = 1/Math.sqrt(1+d*d);
    dblDry.gain.value = g; dblWet.gain.value = d*g;
    if(d>0 && panner.gtr.pan) panner.gtr.pan.value = -sp;   // 0 이면 위 루프의 기본 자리 그대로
    if(dblPan.pan) dblPan.pan.value = sp;
  }
}
function setGtrDbl(v){ gtrDbl = Math.max(0, Math.min(1, +v||0)); applyWidth(); }
function applyRev(){
  if(!ctx) return;
  const r = knob('rev')/100;
  ALLCH().forEach(t => { if(send[t.id]) send[t.id].gain.value=t.send*r*1.9; });
}
function applyRevWidth(){
  if(!widener) return;
  const w = knob('rwid')/100;
  if(HAS_TONE) widener.width.value = Math.min(1,w*0.5);
  else widener.setWidth(w);
}
function applyDrive(){
  if(!ctx) return;
  const d = knob('drv')/100;
  satIn.gain.value  = 1+d*1.1;
  satOut.gain.value = 1/(1+d*0.85);
}
function applyLow(){
  if(!ctx) return;
  lowGain.gain.value = (knob('sub')/100)*0.80;
  excGain.gain.value = (knob('harm')/100)*0.26;
}
function applyGlueAmt(){
  if(!glueComp) return;
  const a = knob('grat')/100;
  glueComp.ratio.value     = 1+a*3.0;
  glueComp.threshold.value = -4-a*13;
}
function applyTrim(){ if(busTrim) busTrim.gain.value = dbToGain(knob('trim')); }

/** 프리셋의 드럼 튠 적용 */
function applyTune(t){
  if(!t) return;
  setKnob('ktune',t.kick); setKnob('stune',t.snare);
  setKnob('ttune',t.tom);  setKnob('htune',t.hat);
}
/** 프리셋의 베이스 설정 적용 */
function applyBassCfg(c){
  eng.bass = c.eng;
  baseOct  = c.oct; UI.oct.value = String(c.oct);
  setKnob('bsemi', c.semi ?? 0);
  if(c.root!=null){ rootNote=c.root; UI.root.value=String(c.root); }
  if(c.scale){ scaleName=c.scale; UI.scale.value=c.scale; }
  setKnob('gate',  c.gate);
  setKnob('bglide',c.glide);
  setKnob('bmix',  c.blend);
  setKnob('bdrv',  c.drive);
  setKnob('xover', c.xover);
  setKnob('btone', c.tone);
  if(c.sub !=null) setKnob('sub', c.sub);
  if(c.exc !=null) setKnob('harm',c.exc);
  if(c.duck!=null) setKnob('duck',c.duck);
  applyLow();
}
function setBpm(v){ if(HAS_TONE && booted) Tone.Transport.bpm.rampTo(+v,0.05); }
function setSwing(v){ if(HAS_TONE && booted) Tone.Transport.swing = +v/100; }
function setSwingSub(v){
  swingSub = v==='8n' ? '8n' : '16n';
  if(HAS_TONE && booted) Tone.Transport.swingSubdivision = swingSub;
  if(typeof updateSwingRead==='function') updateSwingRead();
}
/** 스텝 i 가 스윙으로 밀리는 시간(초). Tone.Transport._processTick() 과 같은 식이다
    (arrange.js «Tone 스윙 vs 폴백 스윙» 주석):
      k = 스윙 단위의 16분 칸 수(16n→1, 8n→2), 주기 2k 칸
      r = i % 2k,  박 위(i%4===0)는 밀지 않는다
      shift = spb·(k/4)·(2/3) · sin(π·r/2k) · 노브/100
    16n 이면 홀수 칸만 spb/6·노브, 8n 이면 박 뒤 8분이 spb/3·노브 —
    둘 다 노브 50 에서 2:1 셋잇단이다. 8n 에서 16분 칸(1·3)은 sin(π/4) 만큼
    덜 밀린다(Tone 과 같게 둔다 — 두 경로가 갈라지면 안 된다). */
function swingShift(i){
  const k = swingSub==='8n' ? 2 : 1;
  if(i%4===0) return 0;
  const r = i % (2*k);
  if(r===0) return 0;
  return spb()*(k/4)*(2/3)*Math.sin(Math.PI*r/(2*k))*(knob('swing')/100);
}
