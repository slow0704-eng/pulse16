/* §9-C 기타 — 현 코어(string.js)를 쓰는 발현·찰현 악기
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ═══ §9-C  기타 · 밴조 · 만돌린 · 시타르 · 피들 ═════════════ */

const gtrBuf=makeStringCache(24);
let gtrRef=null;

/** 피들 — 활로 켜는 현이라 뜯은 현 모델이 통하지 않는다.
    KS 는 "한 번 에너지를 넣고 감쇠"인데 활은 계속 밀어 넣는다.
    그래서 톱니를 지속시키고 몸통 공진(포먼트)으로 바이올린을 만든다.
    활 잡음과 지연 비브라토가 없으면 그냥 신스 리드로 들린다. */
function fiddleVoice(t,dur,hz,v){
  const rel=0.10, life=dur+rel+0.15, end=t+life;
  const g=G('gtr',end);

  /* 몸통 공진 — 바이올린의 대표 공진 3개 (A0 · B1− · B1+) */
  const mix=acqGain(); mix.gain.value=1; retire(mix,'gain',end+0.05);
  const body=[[280,2.4,5.0],[460,3.0,4.0],[720,2.2,3.0],[2800,1.4,4.5]];
  let node=mix;
  body.forEach(([f,q,db])=>{ const b=BQ('peaking',f,q,end,db); node.connect(b); node=b; });
  const lp=BQ('lowpass',7000,0.707,end);
  node.connect(lp).connect(g);

  const o=osc('sawtooth',t,life);
  o.frequency.setValueAtTime(hz,t);
  const og=acqGain(); og.gain.value=0.55; retire(og,'gain',end+0.05);
  o.connect(og).connect(mix);

  /* 활 잡음 — 송진이 현을 긁는 소리 */
  const nf=BQ('bandpass',2600,0.9,end), ng=acqGain();
  ng.gain.value=0.05; retire(ng,'gain',end+0.05);
  nf.connect(ng).connect(mix); tapNoise(nf,end);

  /* 비브라토 — 켜기 시작하고 조금 지나서 걸린다 */
  const l=osc('sine',t,life); l.frequency.value=5.4;
  const lg=acqGain(); retire(lg,'gain',end+0.05);
  lg.gain.setValueAtTime(0,t);
  lg.gain.setValueAtTime(0,t+0.18);
  lg.gain.linearRampToValueAtTime(16,t+0.45);
  l.connect(lg).connect(o.detune);

  /* 활은 어택이 느리다 — 30ms 는 줘야 켜는 소리가 된다 */
  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(v*0.62,t+0.030);
  hold(g.gain,t+dur);
  g.gain.linearRampToValueAtTime(0,t+dur+rel);
}

function guitarVoice(t,deg,dur,e){
  const S=GTR[e]||GTR.clean;
  const midi=gtrOct+rootNote+knob('gsemi')+SCALES[scaleName][deg];
  const hz=440*Math.pow(2,(midi-69)/12);

  if(gtrRef){                              /* 모노 — 왼손 뮤트 */
    try{ fadeOut(gtrRef.g.gain,t,0.012); }catch(err){}
    try{ gtrRef.s.stop(t+0.02); }catch(err){}
    gtrRef=null;
  }

  if(S.bowed){ fiddleVoice(t,dur,hz,0.9*rnd(0.10*H())); return; }

  const buf=gtrBuf(e+'|'+midi, hz, S);
  const rel=S.palm?0.06:0.30;
  const end=t+Math.min(buf.duration,dur+rel)+0.08;
  const v=0.9*rnd(0.10*H());

  const g=acqGain(); retire(g,'gain',end+0.05);
  g.connect(ampIn[S.amp]||chan.gtr);

  const s=ctx.createBufferSource();
  s.buffer=buf;
  /* ⚠ Tone.js 의 rawContext 는 standardized-audio-context 래퍼라
     AudioBufferSourceNode 에 detune 이 없다(오실레이터에는 있음).
     ±4 cent 흔들기를 playbackRate 비율로 바꿔 건다 — 2^(cent/1200). */
  const cents=(Math.random()*2-1)*4*H();
  if(s.detune) s.detune.value=cents;
  else s.playbackRate.value=Math.pow(2,cents/1200);
  s.connect(g); s.start(t); s.stop(end);
  s.onended=()=>{ try{s.disconnect();}catch(err){} };

  /* swell — 볼륨 페달로 어택을 지우고 부풀려 넣는 주법.
     페달 스틸의 정체성이라 이게 없으면 그냥 서스테인 긴 기타가 됩니다. */
  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(v, t + (S.swell || 0.0015));
  if(S.palm){
    const gt=Math.min(dur*0.55,0.14);
    g.gain.exponentialRampToValueAtTime(Math.max(v*0.02,1e-5),t+gt);
    g.gain.linearRampToValueAtTime(0,t+gt+0.02);
    /* 척(chug) 저역 텀프 — g=0.59 루프엔 기음이 거의 안 남으므로 보강 */
    const eT=t+0.09, gT=G('gtr',eT), oT=osc('sine',t,0.075);
    oT.frequency.setValueAtTime(hz,t);
    oT.frequency.exponentialRampToValueAtTime(hz*0.88,t+0.06);
    env(gT,t,v*0.38,0.055,0.001); oT.connect(gT);
    const eB=t+0.06, gB=G('gtr',eB), fB=BQ('bandpass',150,1.4,eB);
    env(gB,t,v*0.18,0.040,0.0008); fB.connect(gB); tapNoise(fB,eB);
  }else{
    hold(g.gain,t+dur);
    g.gain.exponentialRampToValueAtTime(Math.max(v*0.02,1e-5),t+dur+rel);
    g.gain.linearRampToValueAtTime(0,t+dur+rel+0.02);
  }
  gtrRef={g,s};
  retire({disconnect:()=>{ if(gtrRef && gtrRef.g===g) gtrRef=null; }},'x',end+0.05);
}


/* ── 2번 기타 ──
   guitarVoice 는 gtrRef 하나로 모노를 지키므로, 2번 트랙이 같은 함수를 쓰면
   서로의 음을 죽입니다. 참조와 채널만 따로 두고 나머지는 같습니다. */
let gtrRef2=null;
function guitarVoice2(t,deg,dur,e){
  const S=GTR[e]||GTR.clean;
  const midi=gtrOct+rootNote+knob('gsemi')+SCALES[scaleName][deg];
  const hz=440*Math.pow(2,(midi-69)/12);

  if(gtrRef2){
    try{ fadeOut(gtrRef2.g.gain,t,0.012); }catch(err){}
    try{ gtrRef2.s.stop(t+0.02); }catch(err){}
    gtrRef2=null;
  }
  if(S.bowed){ fiddleVoice(t,dur,hz,0.8*rnd(0.10*H())); return; }

  const buf=gtrBuf(e+'|'+midi, hz, S);
  const rel=S.palm?0.06:0.30;
  const end=t+Math.min(buf.duration,dur+rel)+0.08;
  const v=0.8*rnd(0.10*H());

  const g=acqGain(); retire(g,'gain',end+0.05);
  g.connect(chan.gtr2);              // 앰프를 안 거치고 2번 채널로 — 팬이 반대쪽

  const s2=ctx.createBufferSource();
  s2.buffer=buf;
  const cents=(Math.random()*2-1)*4*H();
  if(s2.detune) s2.detune.value=cents;
  else s2.playbackRate.value=Math.pow(2,cents/1200);
  s2.connect(g); s2.start(t); s2.stop(end);
  s2.onended=()=>{ try{s2.disconnect();}catch(err){} };

  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(v, t + (S.swell || 0.0015));
  hold(g.gain,t+dur);
  g.gain.exponentialRampToValueAtTime(Math.max(v*0.02,1e-5),t+dur+rel);
  g.gain.linearRampToValueAtTime(0,t+dur+rel+0.02);

  gtrRef2={g,s:s2};
  retire({disconnect:()=>{ if(gtrRef2 && gtrRef2.g===g) gtrRef2=null; }},'x',end+0.05);
}
