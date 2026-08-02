/* §8 파라미터 적용
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ═══ §8  파라미터 적용 ═════════════════════════════════════ */

function applyWidth(){
  if(!ctx) return;
  const w = knob('width')/100;
  ALLCH().forEach(t => { if(panner[t.id] && panner[t.id].pan) panner[t.id].pan.value=(t.pan||0)*w*1.6; });
}
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
