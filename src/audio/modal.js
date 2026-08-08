/* §6-B 모달 공진 뱅크 — 몸통을 "필터" 가 아니라 "공진체" 로
   pulse16-mk16.html 에서 로드. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다.

   ── 로드 위치 ── src/core/util.js 다음, src/audio/graph.js 앞.
   graph.js 의 boot() 이 modalBank() 을 바로 쓰기 때문이다.

   ── 왜 필요한가 (docs/mutable-차용.md ★2) ──
   지금 몸통 공명은 전부 직렬 peaking 이다. 직렬 peaking 은 **최소위상 EQ** 라
   입력 스펙트럼의 기울기를 바꿀 뿐 스스로 링잉하지 않고, 봉우리 사이의 골도
   못 판다. 임펄스(픽·해머·타격)를 넣어도 "통이 받아 우는" 소리가 안 나온다.

   MI(Mutable Instruments) 의 모달 공진기는 고Q 밴드패스를 **병렬**로 두고,
   각 모드의 Q 를 감쇠시간(T60)으로 환산해 쓴다. 임펄스 하나로도 몸통이
   실제로 울린다. voice-keys.js 의 vocoder 포먼트가 같은 이유로 이미
   병렬 밴드패스로 갈아탔다(측정: 봉우리-골 18.9~24.8dB, docs 참고). */
'use strict';

/* ═══ 환산 — Hz·초 단위 모드 표 → Web Audio bandpass Q ═══════

   MI(plaits/dsp/physical_modelling/resonator.cc:85-107) 의 원식은
   전부 "정규화 주파수"(f_Hz/SR) 로 쓰여 있다.

     q_sqrt = 2^(damping·79.7/12);  q = 500·q_sqrt²        // damping∈[0,1] → q∈[500, 5e6]
     Q_i    = 1 + f_i_norm · q                              // f_i_norm = f_i_Hz / SR

   2차 공진기의 포락선은 e^(−π·BW·t) 로 감쇠한다(BW = 대역폭, Hz).
   T60(−60dB, 즉 진폭이 1/1000 이 되는 시각)은

     ln(1000) = π·BW·t60   ⟹   BW = ln(1000)/(π·t60)

   Web Audio 의 bandpass 는 (근사적으로) Q = f0/BW 이므로

     Q_i = f_i / BW = f_i · π · t60 / ln(1000)

   MI 식의 "+1"(damping=0, 즉 안 울리는 극한에서 Q=1 로 바닥을 까는 항)을
   그대로 살려 옮기면, MI 의 내부 파라미터 q 를 t60 으로 역산해

     q(t60) = t60 · π · SR / ln(1000)          ← "환산 ②" 의 역산
     Q_i    = 1 + (f_i/SR) · q(t60)
            = 1 + f_i · t60 · π / ln(1000)      ← SR 이 대수적으로 소거된다

   **SR 이 소거된다는 것 자체가 검산이다** — Q 는 "중심주파수/대역폭" 비율이라
   원래 연속시간 물리량이고 샘플레이트에 무관해야 맞다. 문서(★2)의
   "48kHz 에서 q ≈ 21830·t60" 은 이 식에 SR=48000 을 대입한 특수사례일 뿐이다
   (t60·π·48000/ln(1000) = t60·21830.9, 문서의 21830 과 일치).

   그런데도 아래 modeQ() 에 sr 인자를 남겨 q(t60) 을 거쳐 계산하는 이유는
     ① 문서의 유도 과정(환산①~③)과 코드가 1:1 대응해 검증하기 쉽고
     ② ctx.sampleRate 가 48kHz 가 아닌 환경(44.1k 등)에서도 그대로 맞다는
        것을 코드 스스로 보여주기 때문이다(실측: sr 을 바꿔도 Q 는 그대로).

   ⚠ Web Audio 의 bandpass Q 는 **선형**이다(util.js 의 실측 확인, Q_DB() 는
     lowpass/highpass 전용). 여기서 Q_DB() 를 쓰면 안 된다. */
const LN1000 = Math.log(1000);           // ln(1000) ≈ 6.907755 — "−60dB 를 배수로" 의 자연로그

/** 모드 하나의 (중심 Hz, 감쇠시간 T60 초) → bandpass Q.
    sr 을 안 주면 ctx.sampleRate 를 읽는다(일반화 — 48k 전용 상수 21830 을 안 씀). */
function modeQ(hz, t60, sr){
  sr = sr || (typeof ctx !== 'undefined' && ctx ? ctx.sampleRate : 48000);
  const q = t60 * Math.PI * sr / LN1000;
  return 1 + (hz / sr) * q;
}

/** 모달 공진 뱅크를 만들어 dest 에 연결하고, **입력으로 쓸 노드**를 돌려준다.
    기존 ampIn.* 와 같은 계약이다 — 호출부는 `g.connect(ampIn[key])` 처럼
    돌려받은 노드에 그냥 connect 하면 된다.

      입력 ──┬─ bandpass(f₁,Q₁) ─ gain(a₁·Q₁) ─┐
             ├─ …                              ├→ 합산 → 트림 → dest
             └─ dry gain ──────────────────────┘

    modes : [[Hz, t60(초), amp], …] — 사람이 읽을 수 있게 Hz·초로 적은 모드 표.
    dest  : 뱅크 출력을 이을 다음 노드(보통 chan.gtr/chan.bass 나 캐비닛 첫 노드).
    opts  : { dry:0~1(직접음 섞는 비율, 기본 0), trim:dB(기본 0), sr }

    ⚠ Web Audio bandpass 는 중심 0dB 정규화라, MI 처럼 "중심 이득이 Q 인
      비정규화 출력" 과 같은 링잉 진폭을 내려면 게인에 Q 를 곱해야 한다
      (docs/mutable-차용.md ★2 "Web Audio 로 옮기는 방법"). 안 곱하면 고Q 모드일수록
      상대적으로 작게 울려 저Q 모드에 묻힌다.
    ⚠ 고Q 병렬 뱅크는 레벨이 크게 오른다(모드 수만큼 에너지가 겹쳐 쌓인다).
      반드시 trim 으로 낮추고 "바꾸기 전/후 라우드니스를 실측"할 것 — 과거
      −7.9 LUFS 사고(graph.js amp_hi 주석)가 있었다. */
function modalBank(modes, dest, opts={}){
  const dry   = opts.dry ?? 0;
  const trimDb = opts.trim ?? 0;
  const sr    = opts.sr || ctx.sampleRate;

  const input = ctx.createGain(); input.gain.value = 1;
  const sum   = ctx.createGain(); sum.gain.value = 1;

  const built = modes.map(([hz, t60, amp]) => {
    const Q  = modeQ(hz, t60, sr);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = hz; bp.Q.value = Q;
    const g  = ctx.createGain(); g.gain.value = amp * Q;   // 중심 0dB 정규화 보정
    input.connect(bp); bp.connect(g); g.connect(sum);
    return {hz, t60, amp, Q, bp, g};
  });

  let dryGain = null;
  if(dry > 0){
    /* 좁은 밴드패스만 남으면 콤 필터처럼 속이 빈다(vocoder formant 와 같은 이유).
       픽·해머 잡음처럼 넓은 대역 여기 신호의 어택감을 살리려면 직접음을 조금 섞는다. */
    dryGain = ctx.createGain(); dryGain.gain.value = dry;
    input.connect(dryGain); dryGain.connect(sum);
  }

  const trim = ctx.createGain(); trim.gain.value = dbToGain(trimDb);
  sum.connect(trim);
  if(dest) trim.connect(dest);

  /* 계측 하네스가 Q·모드 표를 그대로 읽을 수 있게 노드에 붙여 둔다.
     오디오 그래프에는 영향이 없다(그냥 JS 프로퍼티). */
  input._modalBank = {modes: built, dry, dryGain, sum, trim, sr};
  return input;
}
