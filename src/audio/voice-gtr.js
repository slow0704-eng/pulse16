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
/* ch — 어느 채널로 낼지. 2번 기타 트랙은 'gtr2' 를 넘긴다.
   ⚠ 예전에는 이 인자가 없어 **gtr2 로 피들을 골라도 소리가 chan.gtr 로 갔다.**
     계측에서 gtr2/fiddle 만 chan.gtr2 가 무음으로 나와 드러났다.
     keysVoice 가 chan.keys 를 하드코딩하던 것과 똑같은 버그다. */
/* bow — BOW 표(engines.js)의 이름. 안 주면 피들이다. 업라이트 아르코가 'arco' 로 부른다.
   게인 노드를 돌려준다 — 모노로 쓰는 쪽(베이스)이 다음 음에서 이것을 죽인다. */
function fiddleVoice(t,dur,hz,v,ch,bow){
  const B=BOW[bow]||BOW.fiddle;
  const rel=B.rel, life=dur+rel+0.15, end=t+life;
  const g=G(ch||'gtr',end);

  /* 몸통 공진 — 바이올린의 대표 공진 3개 (A0 · B1− · B1+) */
  const mix=acqGain(); mix.gain.value=1; retire(mix,'gain',end+0.05);
  let node=mix;
  B.body.forEach(([f,q,db])=>{ const b=BQ('peaking',f,q,end,db); node.connect(b); node=b; });
  const lp=BQ('lowpass',B.lp,0.707,end);
  node.connect(lp).connect(g);

  const o=osc('sawtooth',t,life);
  o.frequency.setValueAtTime(hz,t);
  const og=acqGain(); og.gain.value=B.og; retire(og,'gain',end+0.05);
  o.connect(og).connect(mix);

  /* 활 잡음 — 송진이 현을 긁는 소리 */
  const nf=BQ('bandpass',B.nz[0],B.nz[1],end), ng=acqGain();
  ng.gain.value=B.nz[2]; retire(ng,'gain',end+0.05);
  nf.connect(ng).connect(mix); tapNoise(nf,end);

  /* 비브라토 — 켜기 시작하고 조금 지나서 걸린다 */
  const l=osc('sine',t,life); l.frequency.value=B.vib[0];
  const lg=acqGain(); retire(lg,'gain',end+0.05);
  lg.gain.setValueAtTime(0,t);
  lg.gain.setValueAtTime(0,t+B.vib[2]);
  lg.gain.linearRampToValueAtTime(B.vib[1],t+B.vib[3]);
  l.connect(lg).connect(o.detune);

  /* 활은 어택이 느리다 — 피들도 30ms 는 줘야 켜는 소리가 된다 */
  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(v*B.lvl,t+B.atk);
  hold(g.gain,t+dur,v*B.lvl);
  g.gain.linearRampToValueAtTime(0,t+dur+rel);
  return g;
}

/* vel — **선택** 인자(0~1 남짓). 안 넘기면 (vel??1)=1 이라 예전과
   한 샘플도 안 달라진다. **음량만** 건다 — 세게 뜯을수록 밝아지는
   음색 연동(픽 위치·바디 필터)은 여기서 안 한다.
   팜뮤트의 척(chug) 보강분과 피들의 활 세기도 v 를 그대로 따라가므로
   자동으로 같은 배율이 걸린다(음색 유지). */
function guitarVoice(t,deg,dur,e,vel){
  const S=GTR[e]||GTR.clean;
  applyGtrFx(e);                    // 버스 이펙트 — 엔진이 바뀔 때만 실제로 움직인다
  /* shift — 하모닉스처럼 울리는 음이 짚은 음보다 높을 때(engines.js 주법 변형) */
  const midi=gtrOct+rootNote+knob('gsemi')+SCALES[scaleName][deg]+(S.shift||0);
  const hz=440*Math.pow(2,(midi-69)/12);

  if(gtrRef){                              /* 모노 — 왼손 뮤트 */
    try{ fadeOut(gtrRef.g.gain,t,0.012); }catch(err){}
    try{ gtrRef.s.stop(t+0.02); }catch(err){}
    gtrRef=null;
  }

  if(S.bowed){ fiddleVoice(t,dur,hz,0.9*rnd(0.10*H())*(vel??1),'gtr'); return; }

  const buf=gtrBuf(e+'|'+midi, hz, S);
  const rel=S.palm?0.06:0.30;
  const end=t+Math.min(buf.duration,dur+rel)+0.08;
  const v=0.9*rnd(0.10*H())*(vel??1);

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
  bendRate(s,t,S);                  // 벤딩·슬라이드 — 필드가 없으면 아무것도 안 한다
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
    hold(g.gain,t+dur,v);
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
function guitarVoice2(t,deg,dur,e,vel){        // vel — 선택 인자. guitarVoice 와 같은 계약
  const S=GTR[e]||GTR.clean;
  const midi=gtrOct+rootNote+knob('gsemi')+SCALES[scaleName][deg]+(S.shift||0);
  const hz=440*Math.pow(2,(midi-69)/12);

  if(gtrRef2){
    try{ fadeOut(gtrRef2.g.gain,t,0.012); }catch(err){}
    try{ gtrRef2.s.stop(t+0.02); }catch(err){}
    gtrRef2=null;
  }
  if(S.bowed){ fiddleVoice(t,dur,hz,0.8*rnd(0.10*H())*(vel??1),'gtr2'); return; }

  const buf=gtrBuf(e+'|'+midi, hz, S);
  const rel=S.palm?0.06:0.30;
  const end=t+Math.min(buf.duration,dur+rel)+0.08;
  const v=0.8*rnd(0.10*H())*(vel??1);

  const g=acqGain(); retire(g,'gain',end+0.05);
  g.connect(chan.gtr2);              // 앰프를 안 거치고 2번 채널로 — 팬이 반대쪽

  const s2=ctx.createBufferSource();
  s2.buffer=buf;
  const cents=(Math.random()*2-1)*4*H();
  if(s2.detune) s2.detune.value=cents;
  else s2.playbackRate.value=Math.pow(2,cents/1200);
  bendRate(s2,t,S);
  s2.connect(g); s2.start(t); s2.stop(end);
  s2.onended=()=>{ try{s2.disconnect();}catch(err){} };

  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(v, t + (S.swell || 0.0015));
  hold(g.gain,t+dur,v);
  g.gain.exponentialRampToValueAtTime(Math.max(v*0.02,1e-5),t+dur+rel);
  g.gain.linearRampToValueAtTime(0,t+dur+rel+0.02);

  gtrRef2={g,s:s2};
  retire({disconnect:()=>{ if(gtrRef2 && gtrRef2.g===g) gtrRef2=null; }},'x',end+0.05);
}
