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
     hammer 때리는 순간의 잡음
     vsens  벨로시티 민감도 0~1. 1 이면 세게 칠수록 밝고 커진다.
            하프시코드는 플렉트럼이 현을 튕기는 구조라 **세기가 소리를 못 바꾼다** —
            건반을 아무리 세게 눌러도 같은 힘으로 뜯긴다. 0 에 가깝게 둔다. */
  piano :{parts:16, B:0.00042, tilt:1.15, t60:5.5, t60n:0.55,
          unison:[0,-1.4,1.8], hammer:{f:2400,q:0.8,dec:0.007,amp:0.20}},

  /* 하프시코드는 뜯는 악기라 배음이 더 많고 밝으며 비조화성이 작습니다.
     계측(tools/측정결과-신규음색.md)에서 비조화도 B 와 감쇠는 합격이었지만
     **기울기가 −7.9 dB/oct 로 피아노(−7.6)보다 밝지 않았습니다** — 설계 의도와 반대.
     tilt 0.80→0.55(배음이 덜 죽음) · t60n 0.40→0.22(고역이 더 오래 남음)로 고칩니다. */
  harpsi:{parts:20, B:0.00012, tilt:0.55, t60:1.3, t60n:0.22, vsens:0.15,
          unison:[0,2.2], hammer:{f:4400,q:1.4,dec:0.004,amp:0.34}},

  /* 비브라폰·마림바는 막대라 배음이 정수배가 아닙니다.
     ratios 를 주면 n 배음 대신 그 비율을 씁니다 (1 : 4 : 10 이 막대의 모드). */
  vibes :{parts:5, ratios:[1,3.9,9.2,15.1,21.3], tilt:1.30, t60:4.0, t60n:0.35,
          unison:[0], hammer:{f:1800,q:1.0,dec:0.005,amp:0.12}},
  marimba:{parts:5, ratios:[1,3.9,9.5,16.2,23.0], tilt:1.55, t60:0.9, t60n:0.30,
          unison:[0], hammer:{f:2600,q:1.2,dec:0.004,amp:0.22}},

  /* ══ 타현·타봉 6종 ══════════════════════════════════════════════
     ratios 는 **자유단 막대의 횡진동 모드비**에서 옵니다 —
       1 : 2.756 : 5.404 : 8.933 : 13.34
     (오일러-베르누이 보 방정식의 자유-자유 경계 해. 음향학 교과서 값이고
      위 marimba·vibes 가 쓰는 것과 같은 계열입니다.)

     실로폰·마림바는 막대 아래를 깎아(undercut) **2번 모드를 일부러 정수배로
     당겨** 둡니다 — 마림바 4:1, 실로폰 3:1. 글로켄슈필은 안 깎아서
     2.756 이 그대로 남습니다. 그 차이가 «나무 말렛 ↔ 금속 말렛» 을 가릅니다.

     t60 은 재질에서 옵니다: 나무(로즈우드)는 짧고, 금속(알루미늄·강철)은 깁니다.
     ⚠ amp 는 struck 경로가 자체 정규화(bakeStruck 의 피크 0.85)를 하므로
       엔진별로 따로 없습니다 — KEYS_TEX 와 vca 가 레벨을 잡습니다. */

  /* 실로폰 — 2번 모드를 3:1 로 깎은 나무 막대. 마림바보다 높고 훨씬 짧습니다. */
  xylophone:{parts:4, ratios:[1,3.0,6.0,9.2], tilt:1.40, t60:0.35, t60n:0.30,
          unison:[0], hammer:{f:3400,q:1.3,dec:0.003,amp:0.30}},
  /* 글로켄슈필 — 안 깎은 강철 막대라 2.756 이 그대로 남고 아주 길게 웁니다.
     이 비정수 2번 모드가 «쨍» 하는 금속성의 정체입니다. */
  glocken :{parts:4, ratios:[1,2.756,5.404,8.933], tilt:0.95, t60:1.80, t60n:0.28,
          unison:[0], hammer:{f:5200,q:1.4,dec:0.002,amp:0.26}},
  /* 첼레스타 — 글로켄과 같은 강철 막대지만 나무 공명통이 붙어 부드럽습니다.
     해머가 펠트라 어택이 훨씬 무릅니다. */
  celesta :{parts:4, ratios:[1,2.756,5.404,8.933], tilt:1.35, t60:1.20, t60n:0.34,
          unison:[0], hammer:{f:2600,q:0.9,dec:0.006,amp:0.12}},
  /* 칼림바(음비라) — 금속 혀를 튕깁니다. 막대와 같은 모드지만 한쪽이 고정단이라
     고역이 빨리 죽고, 통이 작아 기음이 약합니다. 아프리카·로파이. */
  kalimba :{parts:3, ratios:[1,2.756,5.404], tilt:1.55, t60:0.80, t60n:0.45,
          unison:[0], hammer:{f:2200,q:1.1,dec:0.004,amp:0.22}},
  /* 오르골 — 강철 빗살을 튕깁니다. 아주 얇고 높으며 배음이 성깁니다. */
  musicbox:{parts:3, ratios:[1,2.756,5.404], tilt:1.15, t60:0.90, t60n:0.40,
          unison:[0], hammer:{f:4600,q:1.6,dec:0.002,amp:0.28}},
  /* 튜블러벨 — 관(管)이라 막대와 모드가 다릅니다. STK TubeBell 이 쓰는
     √2 = 1.414 비를 그대로 씁니다(src/TubeBell.cpp, ratios 1 : 1.414).
     아주 길게 울립니다 — 교회종·오케스트라. */
  tubular :{parts:4, ratios:[1,1.414,2.0,2.828], tilt:0.85, t60:6.0, t60n:0.22,
          unison:[0,1.5], hammer:{f:3000,q:1.0,dec:0.005,amp:0.24}},

  /* ══ 주법 변형 3종 (engines.js «주법(technique) 변형») ══ */

  /* 스트링 피치카토 — 활 대신 손가락으로 뜯는다. 켜는 스트링(keys/strings)과 달리
     음이 곧바로 잦아든다. 현이라 비조화성은 아주 작고, 여러 명이 동시에 뜯으므로
     unison 을 넓게(±6cent) 벌린다. 손가락 살이라 잡음이 약하다. */
  pizz     :{parts:12, B:0.00003, tilt:1.30, t60:0.60, t60n:0.55, vsens:0.8,
             unison:[0,-6,5], hammer:{f:1500,q:0.8,dec:0.006,amp:0.10}},
};
/* 피아노 주법은 piano 를 펼쳐 만든다 — 객체 리터럴 안에서는 STRUCK 을 아직 못 읽는다 */
Object.assign(STRUCK, {
  /* 우나 코르다(소프트 페달) — 액션이 옆으로 밀려 해머가 세 줄 중 두 줄만 친다.
     한 줄이 빠지니 맥놀이가 줄고, 해머의 덜 닳은 면이 닿아 어둡고 여리다. */
  pianosoft:{...STRUCK.piano, unison:[0,-1.4], tilt:1.40, vsens:0.8,
             hammer:{f:1600,q:0.8,dec:0.008,amp:0.10}},
  /* 펠트 피아노 — 해머와 현 사이에 천을 끼운다. 고역이 크게 죽고(tilt·t60n)
     음이 짧아지며, 대신 «툭» 하는 해머 소리가 낮게 두드러진다. */
  felt     :{...STRUCK.piano, tilt:1.90, t60:2.2, t60n:0.85, vsens:0.6,
             hammer:{f:700,q:0.7,dec:0.012,amp:0.32}},
});

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
      /* ── 감쇠 사인을 복소 회전 재귀로 ──
         원식은 샘플마다 exp 한 번 sin 한 번이었다. 파샬이 48개(unison 3 ×
         parts 16)고 버퍼가 최대 6초라 초월함수 호출이 1400만 번까지 갔다 —
         피아노 한 음에 메인스레드가 264 ms 멈췄다(측정).

         z_i = amp·e^(−dec·i/SR)·e^(j(w·i+ph)) 로 두면 **허수부가 정확히
         원식**이고, z_(i+1) = z_i·c 다. c = e^(−dec/SR)·e^(jw) 는 파샬당
         한 번만 구하면 되므로 안쪽 루프에 곱셈 넷·덧셈 둘만 남는다.

         ⚠ 실수부 zr 을 임시변수 없이 먼저 갱신하면 zi 계산이 새 zr 을 써서
         회전이 깨진다 — t 를 반드시 거칠 것.

         [측정] Chrome 151 piano C4(N=286,800) 263.7 → 12.9 ms (20.4배).
         원식 대비 최대 표본차 1.8e−7 = **−134 dBFS** 로, Float32 양자화
         한계(−138 dB) 언저리라 들리지 않는다. 누적 위상오차는 288k 샘플에서
         상대 1e−13 수준(배정밀도)이라 음정에 영향이 없다.

         같은 재귀를 손으로 인코딩한 WASM 으로도 재 봤지만 12.9 → 13.3 ms 로
         **더 느렸다** — V8 이 이 루프를 이미 같은 기계어로 뽑는다.
         WASM 은 sin/exp 명령이 아예 없어서 어차피 이 재귀를 써야 하고,
         그러면 남는 이득이 없다. docs/perf/03-웹어셈블리검토.md 참고. */
      const r = Math.exp(-dec/SR), cr = r*Math.cos(w), ci = r*Math.sin(w);
      let zr = amp*Math.cos(ph), zi = amp*Math.sin(ph);
      for(let i=0; i<stop; i++){
        out[i] += zi;
        const t = zr*cr - zi*ci; zi = zr*ci + zi*cr; zr = t;
      }
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
function struckVoice(t, midi, dur, vel, name, ch){
  ch = ch || 'keys';                 // 2번 건반 트랙은 'keys2' — keysVoice() 주석 참고
  const S = STRUCK[name];
  const hz = 440*Math.pow(2,(midi-69)/12);
  const X = KEYS_TEX[name] || TEX_DEFAULT;

  const buf = struckBuf(name, midi, hz, S);
  const rel = 0.12;
  const end = t + Math.min(buf.duration, dur + rel) + 0.08;

  const vca = G(ch, end);

  /* 벨로시티 민감도. 0 이면 세기를 무시하고 고정 세기로 친다 —
     플렉트럼으로 뜯는 하프시코드가 그렇다. */
  const vs = S.vsens ?? 1;
  const ve = vel*vs + 0.85*(1-vs);

  /* 발음체 → 몸통 공명 → VCA. 세게 칠수록 밝아지도록 로우패스를 연다. */
  const lp = BQ('lowpass', Math.min(1800 + 9000*ve*ve, 16000), Q_BUTTER, end);
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
    const hg = G(ch, he), hf = BQ('bandpass', K.f, K.q, he);
    env(hg, t, K.amp*ve*ve, K.dec, 0.0005);
    hf.connect(hg); tapNoise(hf, he);
  }

  vca.gain.setValueAtTime(0, t);
  const vpk = 0.62*(0.30+0.70*ve);
  vca.gain.linearRampToValueAtTime(vpk, t+0.002);
  hold(vca.gain, t+dur, vpk);
  vca.gain.setTargetAtTime(0, t+dur, rel/3);
  vca.gain.linearRampToValueAtTime(0, t+dur+rel);
}
