/* 때린 현 — 비조화 가산합성을 오프라인으로 굽는다
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다.

   ── 왜 FM 으로는 안 되는가 ──
   피아노를 FM(1:1 + 1:2)으로 만들었더니 A3 에서 H2 −7dB, H3 −10dB 인데
   H8 부터 −∞ 였습니다. 배음이 일곱 번째쯤에서 끊깁니다.
   그래서 "인공적인 패드" 로 들립니다. 실제 피아노는

     ① 배음이 15~20개 이상 살아 있고
     ② 현이 뻣뻣해서 배음이 정수배보다 **높습니다** (비조화성)
            f_n = n·f0·√(1 + B·n²)
     ③ 높은 배음일수록 빨리 죽고
     ④ 한 음을 현 2~3줄이 함께 울려 미세한 맥놀이가 생깁니다

   **②가 핵심입니다.** 비조화성이 없으면 배음을 아무리 늘려도
   오르간처럼 들립니다. 피아노를 피아노로 들리게 하는 것이 이 어긋남입니다.

   가산합성은 오실레이터가 수십 개라 실시간으로는 못 씁니다.
   기타와 같은 방식으로 **한 음을 통째로 버퍼에 구워 캐시**합니다. */
'use strict';

const STRUCK = {
  /* parts  배음 개수        B      비조화 계수 (클수록 더 어긋남 — 저음일수록 큼)
     tilt   배음 감쇠 기울기 1/n^tilt
     t60    C4 에서의 감쇠   t60n   배음별 감쇠 차이 (클수록 고역이 빨리 죽음)
     unison 현 여러 줄의 어긋남(cent)
     hammer 때리는 순간의 잡음 */
  piano :{parts:16, B:0.00042, tilt:1.15, t60:5.5, t60n:0.55,
          unison:[0,-1.4,1.8], hammer:{f:2400,q:0.8,dec:0.007,amp:0.20}},

  /* 하프시코드는 뜯는 악기라 배음이 더 많고 밝으며 비조화성이 작습니다 */
  harpsi:{parts:20, B:0.00012, tilt:0.80, t60:1.3, t60n:0.40,
          unison:[0,2.2], hammer:{f:4400,q:1.4,dec:0.004,amp:0.34}},

  /* 비브라폰·마림바는 막대라 배음이 정수배가 아닙니다.
     ratios 를 주면 n 배음 대신 그 비율을 씁니다 (1 : 4 : 10 이 막대의 모드). */
  vibes :{parts:5, ratios:[1,3.9,9.2,15.1,21.3], tilt:1.30, t60:4.0, t60n:0.35,
          unison:[0], hammer:{f:1800,q:1.0,dec:0.005,amp:0.12}},
  marimba:{parts:5, ratios:[1,3.9,9.5,16.2,23.0], tilt:1.55, t60:0.9, t60n:0.30,
          unison:[0], hammer:{f:2600,q:1.2,dec:0.004,amp:0.22}},
};

/** 한 음을 통째로 구워 AudioBuffer 로 돌려준다 */
function bakeStruck(hz, S){
  const SR = ctx.sampleRate;
  /* 낮은 음일수록 길게 운다 */
  const len = Math.min(S.t60 * Math.pow(261.6/hz, 0.35) * 1.05 + 0.2, 6.0);
  const N = Math.ceil(SR*len);
  const buf = ctx.createBuffer(1, N, SR);
  const out = buf.getChannelData(0);
  const TWO = 2*Math.PI;
  const base = S.t60 * Math.pow(261.6/hz, 0.35);

  S.unison.forEach((cent, ui) => {
    const f0 = hz*Math.pow(2, cent/1200);
    const uAmp = ui ? 0.72 : 1;
    for(let n=1; n<=S.parts; n++){
      /* 비조화성 — 이 한 줄이 신스와 악기를 가릅니다 */
      const fn = S.ratios ? f0*S.ratios[n-1]
                          : n*f0*Math.sqrt(1 + S.B*n*n);
      if(fn > SR*0.45) break;
      const amp = uAmp/Math.pow(n, S.tilt);
      const t60n = base/Math.pow(n, S.t60n);
      const dec = Math.log(1000)/Math.max(t60n, 0.02);
      const w = TWO*fn/SR;
      const ph = Math.random()*TWO;
      /* 진폭이 −80dB 아래로 떨어지면 더 안 돈다 — 고역 배음은 금방 끝난다 */
      const stop = Math.min(N, Math.ceil(SR*Math.log(1e4)/dec));
      for(let i=0; i<stop; i++)
        out[i] += amp*Math.exp(-dec*i/SR)*Math.sin(w*i + ph);
    }
  });

  /* 피크 정규화 */
  let pk=0; for(let i=0;i<N;i++){ const a=Math.abs(out[i]); if(a>pk) pk=a; }
  if(pk>1e-6){ const k=0.85/pk; for(let i=0;i<N;i++) out[i]*=k; }
  return buf;
}

const struckCache = new Map();
function struckBuf(name, midi, hz, S){
  const key = name+'|'+midi;
  let b = struckCache.get(key);
  if(!b){
    b = bakeStruck(hz, S);
    if(struckCache.size >= 48) struckCache.delete(struckCache.keys().next().value);
    struckCache.set(key, b);
  }
  return b;
}

/** 구운 버퍼로 한 음을 낸다. keysVoice 가 STRUCK 엔진일 때 이리로 넘긴다. */
function struckVoice(t, midi, dur, vel, name){
  const S = STRUCK[name];
  const hz = 440*Math.pow(2,(midi-69)/12);
  const X = KEYS_TEX[name] || TEX_DEFAULT;

  const buf = struckBuf(name, midi, hz, S);
  const rel = 0.12;
  const end = t + Math.min(buf.duration, dur + rel) + 0.08;

  const vca = G('keys', end);

  /* 발음체 → 몸통 공명 → VCA. 세게 칠수록 밝아지도록 로우패스를 연다. */
  const lp = BQ('lowpass', Math.min(1800 + 9000*vel*vel, 16000), Q_BUTTER, end);
  let node = lp;
  if(X.body) X.body.forEach(([bh,bq,bd]) => {
    const b = BQ('peaking', bh, bq, end, bd);
    node.connect(b); node = b;
  });
  node.connect(vca);

  const s = ctx.createBufferSource();
  s.buffer = buf;
  /* 조율 흔들림 — 실제 피아노는 음마다 조금씩 어긋나 있다 */
  const cents = (Math.random()*2-1)*2.5*H();
  if(s.detune) s.detune.value = cents;
  else s.playbackRate.value = Math.pow(2, cents/1200);
  s.connect(lp); s.start(t); s.stop(end);
  s.onended = () => { try{ s.disconnect(); }catch(e){} };

  /* 해머 잡음 — 때리는 순간의 소리. 벨로시티에 크게 반응한다 */
  if(S.hammer){
    const K = S.hammer, he = t + K.dec + 0.02;
    const hg = G('keys', he), hf = BQ('bandpass', K.f, K.q, he);
    env(hg, t, K.amp*vel*vel, K.dec, 0.0005);
    hf.connect(hg); tapNoise(hf, he);
  }

  vca.gain.setValueAtTime(0, t);
  vca.gain.linearRampToValueAtTime(0.62*(0.30+0.70*vel), t+0.002);
  hold(vca.gain, t+dur);
  vca.gain.setTargetAtTime(0, t+dur, rel/3);
  vca.gain.linearRampToValueAtTime(0, t+dur+rel);
}
