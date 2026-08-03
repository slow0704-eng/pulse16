# Mutable Instruments 에서 무엇을 가져올 것인가

조사일 2026-08-03 · 대상 **`pichenettes/eurorack` master** + **`pichenettes/stmlib` master**
(Rings · Elements · Plaits · Warps · Braids · stmlib)

---

## 0. 조사 방법 — 무엇을 "확인" 이라 부르는가

`docs/tone-js-차용.md` 와 같은 규칙입니다. 추측은 전부 `미확인` 으로 표시했습니다.

| 표기 | 뜻 |
|---|---|
| `소스확인` | `raw.githubusercontent.com` 에서 **파일을 통째로 내려받아 직접 읽음**. 아래 목록이 전부입니다 |
| `환산` | MI 의 정규화 단위(주파수 = f/SR, LUT 인덱스)를 **Hz·dB·초로 바꾼 값**. 환산식을 반드시 함께 적었습니다 |
| `계산` | 소스의 식으로 손으로 계산한 **예측치**. 실측이 아닙니다 |
| `미확인` | 안 읽었거나 확인 못 함 |

### 실제로 읽은 MI 파일 (전문)

```
rings/dsp/      string.h  string.cc  resonator.h  resonator.cc  plucker.h  part.cc  dsp.h
                string_synth_part.cc
rings/resources/lookup_tables.py            (4_decades · svf_shift · stiffness 생성식)
elements/dsp/   exciter.h  exciter.cc  resonator.h  resonator.cc  tube.h  tube.cc
                voice.h  voice.cc  part.cc  string.h  string.cc
                multistage_envelope.h  multistage_envelope.cc
plaits/dsp/physical_modelling/  string.h  string.cc  string_voice.h  string_voice.cc
                                resonator.h  resonator.cc  modal_voice.h  modal_voice.cc
plaits/dsp/speech/  naive_speech_synth.{h,cc}  sam_speech_synth.{h,cc}  lpc_speech_synth.{h,cc}
plaits/dsp/engine/  speech_engine.cc  waveshaping_engine.cc  virtual_analog_engine.cc
plaits/dsp/dsp.h  plaits/resources/lookup_tables.py (stiffness · svf_shift 부분)
warps/dsp/      modulator.h  modulator.cc  vocoder.h  vocoder.cc  filter_bank.h  filter_bank.cc
braids/         analog_oscillator.cc  digital_oscillator.cc   (grep 수준으로만)
stmlib/dsp/     filter.h  dsp.h  delay_line.h  cosine_oscillator.h
                parameter_interpolator.h  units.h  polyblep.h  limiter.h
eurorack/README.md · stmlib/LICENSE
```

**안 읽은 것** — `clouds` · `tides` · `marbles` · `stages` · `peaks` 전부, Braids 의
`quantizer`, Plaits 의 나머지 엔진들, MI 의 `resources.cc`(구워진 LUT 배열 자체).
Braids 는 grep 으로 "포먼트/폴드가 어디 있나" 만 봤고 **본문은 안 읽었습니다.**

### 우리 코드에서 읽은 것

`src/audio/string.js` · `struck.js` · `voice-keys.js` · `voice-gtr.js` · `voice-bass.js` ·
`voice-drum.js` · `graph.js`, `src/core/util.js` · `engines.js` · `state.js`,
`ARCHITECTURE.md` · `audio-review.md` · `docs/tone-js-차용.md`.

---

## 총평 — 솔직하게

**Tone.js 때와 결론이 정반대입니다.** Tone.js 는 "우리가 더 정교하니 이펙트만 빌리자"
였지만, MI 는 **우리가 아예 안 가진 것을 여럿 갖고 있습니다.**

MI 가 우리보다 나은 곳 — 넷입니다.

1. **모달 공진(병렬 밴드패스 뱅크)** — 우리 몸통 공진은 `peaking` **직렬** 체인입니다.
   직렬 peaking 은 "기울기를 바꾸는" 것이지 **울리지 않습니다.** MI 는 24~64개
   고Q 밴드패스를 **병렬**로 두고 각각의 Q 를 감쇠시간으로 환산해 씁니다.
   (`rings/dsp/resonator.cc` · `plaits/.../resonator.cc`)
2. **포먼트** — 우리 `vocoder` 는 톱니 → 직렬 peaking(+3.5~+9dB). MI 는
   **평탄 스펙트럼 여기 → 병렬 밴드패스 Q=20**. 계측으로 잡힌 "봉우리가 안 선다"
   의 원인이 바로 이 두 가지 차이입니다. (§2 ★1 에서 dB 로 계산했습니다)
3. **활(bow)** — MI 는 **진짜 마찰 테이블**(스틱-슬립)을 밴디드 도파관에 겁니다.
   우리 `fiddleVoice` 는 톱니 + 포먼트 근사입니다. (`elements/dsp/resonator.h:92-103`)
4. **곡면 브리지** — 우리 자와리(`buzz`)는 **진폭을 접습니다**. MI 는 진폭이 아니라
   **지연선 길이를 줄입니다** — 실제로 현이 브리지에 닿으면 울리는 길이가
   짧아지므로 그쪽이 물리적으로 맞습니다. (`rings/dsp/string.cc:157-186`)

**우리가 더 정교하거나 더 맞는 곳** — 이것도 솔직히 넷입니다.

1. **여기(excitation)** — 우리 `ksInto` 의 β 지점 2단 사각 속도파는 물리적으로 유도된
   것입니다. MI 의 내부 여기(`rings/dsp/plucker.h`)는 **한 주기 길이의 백색 노이즈
   버스트 → 콤 필터 → 로우패스**, 그게 전부입니다. 우리 `string.js` 머리주석에 적힌
   "1.7kHz 아래가 없어 기음이 27dB 죽었다" 는 실패를 MI 는 콤으로 우회했을 뿐입니다.
2. **픽업 콤** — MI 스스로 `elements/dsp/resonator.cc:154-162` 주석에서
   *"정확한 방법은 콤 필터인데, 변조하면 플랜저처럼 들리고 어택이 번져서
   주파수 영역에서 모드 진폭을 조절하는 근사로 대체했다"* 고 적었습니다.
   **우리는 오프라인으로 굽기 때문에 변조가 없고, 그래서 진짜 콤을 쓸 수 있습니다.**
   여기는 우리 쪽이 맞습니다.
3. **비조화성 법칙** — 우리 `f_n = n·f0·√(1+B·n²)` 는 물리적으로 옳은 강성 법칙입니다.
   MI 의 `stretch_factor += stiffness; stiffness *= 0.98` 는 **50배에서 수렴하는**
   임의의 곡선입니다(§2 ★6 에 급수 합을 적었습니다). 피아노에 관한 한 우리 쪽이 맞습니다.
4. **앰프·캐비닛·왜곡** — MI 에는 **아예 없습니다.** 기타 앰프 모델링은 MI 의 관심사가
   아닙니다. 그래서 **퍼즈 문제는 MI 에서 답이 나오지 않습니다.**(§3 참조)

### 이식 가능성 — 이번 조사의 핵심 판단

MI 는 **C++ 고정/부동소수점, 샘플 단위 비선형 되먹임, 블록 처리** DSP 입니다.
Web Audio 노드 그래프로는 대부분 못 옮깁니다. 그런데 —

> **우리는 이미 `string.js` · `struck.js` 에서 한 음을 통째로 버퍼로 굽습니다.**
> MI 알고리즘의 상당수는 **그 버퍼 굽기 코드 안에 JavaScript 로 그대로 옮길 수 있습니다.**
> 이것이 Tone.js 조사 때와 근본적으로 다른 점입니다.

그래서 아래 표에서 이식 방법을 셋으로 나눴습니다.

| 표기 | 뜻 | 비용 |
|---|---|---|
| **노드 그래프** | `BiquadFilter`·`Gain`·`PeriodicWave` 조합으로 실시간 처리 | 싸다 |
| **버퍼 굽기** | `ksRender`/`bakeStruck` 처럼 오프라인 루프를 돌려 `AudioBuffer` 로 캐시 | 중간. 캐시 필수 |
| **워클릿 필요** | 샘플 단위 되먹임을 실시간으로 돌려야 함 | **비쌈 + `file://` 위험** |

**워클릿의 비용** — `docs/tone-js-차용.md` §3 에 적어 둔 그대로입니다.
`AudioWorklet` 모듈은 `blob:` URL 로 등록되는데 `file://` 의 opaque origin 에서
등록되는지 **아직 미확인**이고, 실패했을 때의 폴백을 우리가 직접 짜야 합니다.
`ARCHITECTURE.md` 가 "더블클릭으로 열리는 것" 을 요구사항으로 못 박아 두었으므로
**이번 문서의 어떤 제안도 워클릿을 필수로 두지 않았습니다.**

---

## 1. 우선순위표 — 효과 대비 비용

| 순위 | 후보 | 이식 방법 | 효과 | 비용 | 위험 | 적용 파일 |
|:--:|---|---|:--:|:--:|:--:|---|
| **1** | 포먼트를 **병렬 밴드패스 + 평탄 여기** 로 (vocoder) | **노드 그래프** | 大 | 極小 | 低 | `voice-keys.js` `KEYS_TEX.vocoder`, `core/engines.js` |
| **2** | **모달 공진 뱅크** — 몸통·공진을 병렬 밴드패스로 | **노드 그래프**(버스 상주) | 大 | 中 | 中 | `graph.js` `boot()`, `voice-keys.js`, `voice-gtr.js` |
| **3** | **곡면 브리지 자와리** — 진폭 접기 → 지연 변조 | **버퍼 굽기** | 中 | 極小 | 低 | `string.js` `ksInto()` |
| **4** | **활 마찰 테이블 + 도파관** (fiddle) | **버퍼 굽기** | 大 | 大 | 中 | `voice-gtr.js` `fiddleVoice()` (신규 코어) |
| **5** | **루프 필터 지연 보정** — KS 음정 정확도 | **버퍼 굽기** | 中 | 極小 | **中** | `string.js` `ksInto()` |
| **6** | **분산 올패스** — KS 에 비조화도 넣기 | **버퍼 굽기** | 中 | 中 | 中 | `string.js` `ksInto()` |
| 7 | 연속 드라이브 (`SoftClip` + 자동 post-gain) | **노드 그래프** | 小~中 | 小 | **高** | `util.js` `mkCurve`, `voice-bass.js` |
| 8 | 리드 도파관 튜브 (sax·harmonica·tuba) | **버퍼 굽기** | 中 | 大 | 中 | `voice-keys.js`, `voice-bass.js` `windBass()` |
| 9 | 벨로시티↔밝기 분리 (harpsi) | 구조 변경 | 中 | 小 | 中 | `struck.js` `struckVoice()` |
| — | 나머지 전부 | **채택 안 함** | — | — | — | §3 참조 |

> 5번의 위험이 "中" 인 이유: **모든 현 악기의 음정이 조금씩 움직입니다.**
> `tools/measure-tonal.html` 의 기준값이 전부 다시 잡혀야 합니다.
> 7번의 위험이 "高" 인 이유: `mkCurve` 를 건드리면 357개 프리셋의 라우드니스가
> 전부 움직입니다 — `audio-review.md` §5 에 이미 "보류" 로 적혀 있는 항목입니다.

---

## 2. 채택 후보 상세

### ★1. 포먼트 — 병렬 밴드패스 + 평탄 스펙트럼 여기 (vocoder)

**무엇을**

우리 `vocoder` 는 **톱니 3개 → 직렬 `peaking` 4단**(`voice-keys.js:89-90`)입니다.

```js
vocoder:{kt:0.05,kd:0.10,body:[[620,6.0,9.0],[1100,5.0,7.0],
                               [2600,4.0,5.0],[3400,3.0,3.0]]},
```

MI 의 `NaiveSpeechSynth` 는 **평탄 스펙트럼 임펄스열 → 병렬 밴드패스 Q=20 을 가중합**입니다.

**MI 어느 파일 어느 부분** — `plaits/dsp/speech/naive_speech_synth.cc`

- `:114-121` 여기 생성 — `OSCILLATOR_SHAPE_IMPULSE_TRAIN` 을 만든 뒤
  **밴드패스 800 Hz · Q 0.5** 로 색을 입히고 ×4. (`:93` 에 `set_f_q(800/SR, 0.5)`)
- `:130-157` 포먼트 — **5개를 병렬 `Svf` 밴드패스**로 돌리고 `ProcessAdd` 로 **더합니다.**
  Q 는 다섯 개 전부 **20 고정**(`:155`), 진폭 `a` 만 다릅니다.
- `:46-82` 포먼트 표 — 5 음소 × 5 성역(register) × 5 포먼트.
- `:151` 주파수 환산식 — `f = a0 * SemitonesToRatio(f − 33)`.
  `plaits/dsp/dsp.h:48` 에서 `a0 = (440/8)/SR = 55/SR` 이므로

> **환산** : `f_Hz = 55 · 2^((v−33)/12) = 440 · 2^((v−69)/12)`
> — 표에 든 바이트는 **그냥 MIDI 노트 번호**입니다. 진폭은 `a/256`.

환산한 표 (성역 0 = 저음, 2 = 중간, 4 = 고음. 음소 순서는 대략 **a·e·i·o·u**):

| 음소 | 성역 | F1 | F2 | F3 | F4 | F5 |
|---|:--:|---|---|---|---|---|
| **a** | 0 | 587 Hz ×1.00 | 988 ×0.445 | 2217 ×0.352 | 2349 ×0.352 | 2637 ×0.098 |
| a | 2 | 659 ×1.00 | 1109 ×0.500 | 2637 ×0.070 | 2960 ×0.062 | 3322 ×0.012 |
| **e** | 0 | 392 ×1.00 | 1568 ×0.250 | 2349 ×0.352 | 2794 ×0.250 | 2960 ×0.125 |
| **i** | 0 | 247 ×1.00 | 1661 ×0.031 | 2489 ×0.156 | 2960 ×0.078 | 3322 ×0.039 |
| **o** | 0 | 392 ×1.00 | 740 ×0.281 | 2349 ×0.086 | 2489 ×0.098 | 2794 ×0.008 |
| **u** | 0 | 349 ×1.00 | 587 ×0.098 | 2349 ×0.023 | 2637 ×0.039 | 2794 ×0.016 |

(성역 1·3 도 소스에 있습니다. 위 표는 제가 환산해 계산한 값이고 **원본 바이트는
`naive_speech_synth.cc:46-82`** 에 그대로 있으니 필요하면 같은 식으로 뽑으세요.)

**왜 우리 것이 안 서는가 — 계산으로 확인**

톱니는 −6 dB/oct 입니다. 기음 220 Hz 기준으로

| | 620 Hz | 2600 Hz |
|---|---|---|
| 톱니 자체 (기음 대비) | −8.0 dB | −21.4 dB |
| 우리 peaking 부스트 | +9.0 | +5.0 |
| **합계** | **+1.0 dB** | **−16.4 dB** |

봉우리가 기음보다 **높지 않습니다.** 계측으로 나온 "봉우리가 안 선다" 가 그대로 설명됩니다.

MI 방식으로 바꾸면 (여기 = 평탄 → 밴드패스 800/Q0.5, 즉 800 Hz 아래 +6 dB/oct,
위 −6 dB/oct):

| | 620 Hz | 2600 Hz |
|---|---|---|
| MI 여기 (기음 220 대비) | +9.0 dB | **+1.0 dB** |

**2600 Hz 에서 톱니보다 22 dB 밝습니다.** 여기에 병렬 밴드패스가 얹힙니다.

**병렬 밴드패스의 골 깊이 — 계산**

Web Audio `bandpass` 는 중심에서 0 dB 로 정규화돼 있고 **Q 가 선형**입니다
(`util.js:58-64` 의 실측 확인 그대로). Q=20 짜리 두 개(587·988 Hz, 가중 1.00·0.445)를
병렬로 두면 그 사이 760 Hz 에서 —

- 587 Hz 필터: `|H| = 1/√(1+Q²(f/f0−f0/f)²)` = 0.095 → −20.4 dB
- 988 Hz 필터: 0.094 × 0.445 → −27.0 dB
- 합 ≈ **−19.7 dB**

즉 **포먼트 사이 골이 20 dB 깊어집니다.** 직렬 peaking 으로는 나올 수 없는 대비입니다.
*(위 두 표는 전부 **계산**입니다. 실측이 아닙니다 — 적용 후 `tools/measure-tonal.html`
로 반드시 확인하세요.)*

**우리 어느 파일 어느 함수에**

- **여기** — `voice-keys.js:12-20` `randWave(kind, n)` 에 `kind==='pulse'` 를 하나 더 넣어
  `a = 1`(전 배음 같은 진폭) 로 굽습니다. **랜덤 위상을 그대로 쓰세요** — 평탄
  스펙트럼을 위상 0 으로 만들면 크레스트가 √(2N) ≈ +20 dB 로 튑니다
  (`randWave` 머리주석이 톱니 7개에서 +8.5 dB 를 이미 기록해 두었습니다).
  포먼트 필터는 위상을 안 보므로 **랜덤 위상이 스펙트럼상 손해가 없습니다.**
  그 다음 `BQ('bandpass', 800, 0.5, end)` 로 색을 입힙니다(MI 의 `pulse_coloration_`).
- **포먼트** — `voice-keys.js:140-144` 의 `X.body.forEach` 는 **직렬**입니다
  (`node.connect(b); node = b`). vocoder 만 **병렬 분기**로 바꿉니다:
  각 포먼트마다 `BQ('bandpass', f, 20, end)` → `acqGain(a)` → 공통 합산 노드.
  `voice-bass.js` 의 `reese` 가 이미 여러 갈래를 하나의 `mixg` 로 모으는 패턴을
  쓰고 있으니 새로운 배선이 아닙니다.
- `KEYS_TEX.vocoder` 의 `body` 는 그대로 두고 **`formants:` 필드를 따로 두는 편**이
  낫습니다. `body` 는 다른 12개 악기가 직렬 전제로 쓰고 있습니다.
- `core/engines.js:166-170` 의 `f:{hz:3400,R:1.0,env:0,...}` 로우패스는
  평탄 여기로 바꾸면 너무 밝아질 수 있습니다 — 여기서 상한을 잡으세요.

**기대 효과** 계측된 결함이 직접 해소됩니다. 덤으로 **모음 5종(a·e·i·o·u)** 이 생겨
프리셋마다 다른 모음을 줄 수 있습니다(엔진표에 `vowel:` 한 필드).

**예상 위험**

- 평탄 배음 64개는 매우 밝고 **레벨이 톱니와 크게 다릅니다.** `E.mixG`(현재 0.58) 와
  `E.peak`(0.50) 을 실측으로 다시 잡아야 합니다.
- 병렬 밴드패스는 노드 수가 늘어납니다(포먼트 5개 → 필터 5 + 게인 5 = 10노드/보이스,
  `poly:6` 이면 60노드). `liveNodes` 로 확인하세요. 여유가 없으면 **포먼트를 3개로 줄이거나**
  ★2 처럼 **버스에 상주**시키는 쪽으로 가세요(모음을 바꿀 때만 주파수를 옮기면 됩니다).
- **`tools/measure-tonal.html` 도 같이 고쳐야 합니다** (`ARCHITECTURE.md` 「주의」).

**난이도** 하 (40줄 남짓)

---

### ★2. 모달 공진 뱅크 — 몸통·공진을 병렬 밴드패스로

**무엇을**

우리 몸통 공진은 **전부 직렬 `peaking`** 입니다.

- `voice-keys.js:72-103` `KEYS_TEX.*.body` — 13개 악기
- `voice-gtr.js:21-24` `fiddleVoice` 의 바이올린 공진 4개
- `graph.js:222-266` `ampIn.body_*` — 기타/밴조/시타르/사즈 몸통
- `struck.js:108-112` — 때린 현의 몸통

직렬 peaking 은 **입력 스펙트럼의 기울기를 바꿀 뿐 스스로 울리지 않습니다.**
그래서 짧은 여기(해머 클릭·픽 잡음)를 넣어도 몸통이 "받아 울리는" 소리가 안 납니다.

MI 의 모달 공진기는 **고Q 밴드패스 24~64개를 병렬**로 두고, 각 모드의 Q 를
**감쇠시간으로 환산**해 씁니다. 그래서 임펄스 하나만 넣어도 몸통이 실제로 울립니다.

**MI 어느 파일 어느 부분**

- `plaits/dsp/physical_modelling/resonator.cc:80-133` — 가장 읽기 쉬운 판입니다.
  `resonator.h:36-37` 에 `kMaxNumModes = 24`, `kModeBatchSize = 4`.
- `rings/dsp/resonator.cc:56-99` — 같은 알고리즘의 64모드 판.
  `resonator.h:42` `kMaxModes = 64`. Elements 는 `voice.cc:73` 에서 **52** 로 제한
  (*"56 으로 돌리면 아슬아슬하다"* 는 주석).
- `elements/dsp/resonator.cc:154-169` — 픽업 콤을 모드 진폭으로 근사하는 부분.

**환산 — 고정소수점이 아니라 정규화 단위입니다. 전부 Hz·초로 바꿔 적습니다**

MI 의 `frequency` 는 전부 `f_Hz / SR` 입니다. 코드는 이렇습니다
(`plaits/.../resonator.cc:85-107`):

```
q_sqrt = 2^(damping · 79.7/12)
q      = 500 · q_sqrt²                       // damping ∈ [0,1]
Q_i    = 1 + f_i_norm · q                    // f_i_norm = f_i_Hz / SR
q     *= q_loss   (모드마다)
q_loss = brightness·(2−brightness)·0.85 + 0.15
```

> **환산 ①  q 의 범위** : `q = 500·2^(damping·13.283)` 이므로 **500 … 4.99×10⁶**.
> Rings 는 같은 값을 LUT 로 만드는데, `rings/resources/lookup_tables.py:56-57` 에
> `('4_decades', 10**(4x))` 라고 **생성식이 그대로 있습니다** → `q = 500·10^(4·damping)`
> = **500 … 5×10⁶**. 두 모듈이 같은 범위입니다. (소스확인)
>
> **환산 ②  Q → 감쇠시간** : `Q_i = 1 + f_i/SR·q` 이므로 큰 q 에서
> 대역폭 `BW = f_i/Q_i ≈ SR/q` — **모드 주파수와 무관한 고정 대역폭**입니다.
> 2차 공진기의 포락선이 `e^(−π·BW·t)` 이므로
>
>     t60 = ln(1000)/(π·BW) = ln(1000)·q/(π·SR)
>
> **48 kHz 에서 `q ≈ 21830 · t60(초)`**, 뒤집으면 `t60 = 4.58×10⁻⁵ · q`.
> 즉 q 500 → **t60 22.9 ms**, q 5×10⁶ → **t60 229 초**(사실상 무한).
> *(이 유도는 **계산**입니다. 적용 전에 하나 만들어 실측해 확인하세요.)*
>
> **환산 ③  모드별 감쇠** : `q *= q_loss` 이므로 **n번째 모드의 t60 = t60₁ · q_loss^(n−1)**.
> `q_loss` 는 brightness 0 → **0.15**, 1 → **1.00**. 즉 **등비수열**입니다.

**모드 주파수 (`resonator.cc:100,123-130`)**

```
f_n = n·f0 · S_n,   S_1 = 1,  S_{n+1} = S_n + s_n,  s_{n+1} = 0.98·s_n  (s > 0)
                                                     s_{n+1} = 0.93·s_n  (s < 0)
```
등비급수를 합치면 **`S_n = 1 + s·(1 − 0.98^(n−1))/0.02`**, n→∞ 에서 **`1 + 50s` 로 수렴**합니다.
`s`(stiffness)는 `structure` 노브에서 오는데, `plaits/resources/lookup_tables.py:149-167`
에 **파이썬 생성식이 그대로 있습니다**(소스확인) —

```python
s < 0.25 : stiffness = -(0.25 - s) * 0.25            # −0.0625 … 0  (모드가 압축됨)
s < 0.30 : stiffness = 0                             # 완전 조화
s < 0.90 : g=(s-0.3)/0.6; stiffness = 0.01·10**(2.005g) − 0.01   # 0 … 1.0
else     : g=((s-0.9)/0.1)**2; stiffness = 1.5 − cos(g·π)/2      # 1.0 … 2.0
```

**모드 진폭 (`resonator.cc:47-56`, `stmlib/dsp/cosine_oscillator.h:60-90`)**

`mode_amplitude[i] = CosineOscillator(position).Next() · 0.25`
= **`(0.5 + 0.5·cos(2π·position·i)) · 0.25`** — 뜯는 위치 콤을 모드 영역에서 만든 것입니다.
그리고 `resonator.cc:104` 의 `mode_attenuation = 1 − 2·f_norm` 으로 나이퀴스트 근처
모드를 서서히 죽입니다(클릭 방지).

**Web Audio 로 옮기는 방법 — 노드 그래프**

MI 의 `Svf` 는 `FILTER_MODE_BAND_PASS` 에서 **중심 이득이 Q** 인 비정규화 출력입니다
(`stmlib/dsp/filter.h:229-247`, `bp` 를 그대로 반환). Web Audio `bandpass` 는
**중심 0 dB 정규화**입니다. 따라서

> **모드 i 의 Web Audio 게인 = `a_i × Q_i`** 로 두어야 MI 와 같은 울림 진폭이 됩니다.
> (2차 공진기의 초기 링잉 진폭 ∝ 이득 × 대역폭 = `Q·(f/Q)` = f 로, MI 쪽은 Q 에
> 무관합니다. 정규화된 우리 밴드패스에서는 대역폭만 남으므로 Q 를 곱해야 맞습니다.)

배선:

```
입력 ──┬─ bandpass(f₁, Q₁) ─ gain(a₁·Q₁) ─┐
       ├─ bandpass(f₂, Q₂) ─ gain(a₂·Q₂) ─┤→ 합산 → (기존 체인)
       └─ …                               ─┘
```

**우리 어느 파일 어느 함수에**

- **보이스마다 만들지 마세요.** `graph.js` 의 `ampIn.body_*`(`:222-266`)와 같은 원칙으로
  **악기별로 한 번만 만들어 버스에 상주**시킵니다. 몸통은 음정을 안 따라가므로
  (`voice-keys.js:136-138` 주석이 이미 그렇게 못 박아 두었습니다) **버스 상주가 맞습니다.**
  8~12 모드면 악기당 16~24 노드, 상시 1세트라 보이스당 비용은 0 입니다.
- 우선 손댈 곳 순서:
  1. `graph.js` `ampIn.body_banjo`·`body_sitar` — 가죽 헤드/박(tumba)은 울림이 정체성인데
     지금 peaking 5개로 기울기만 바꾸고 있습니다.
  2. `voice-gtr.js:21-24` `fiddleVoice` 의 바이올린 공진 — ★4 와 함께 가면 자연스럽습니다.
  3. `voice-keys.js` `KEYS_TEX.marimba`·`vibes`·`steelpan` — 공명관·막대는 모달이 정답입니다.
     다만 `STRUCK` 로 가는 `vibes`/`marimba` 는 이미 `ratios` 로 모드를 직접 주고 있으므로
     **몸통(공명관)만** 모달로 바꾸세요.
- **모드 표를 어떻게 정할 것인가** — MI 의 `structure` 곡선을 그대로 쓰지 말고
  우리 방식대로 `[[Hz, t60, amp], …]` 로 적고, `Q = 1 + (Hz/SR)·21830·t60` 로 환산해
  넣으세요. 그래야 나중에 사람이 읽고 고칠 수 있습니다.

**기대 효과** 몸통이 "필터" 에서 "공진체" 가 됩니다. 특히 짧은 여기(해머·픽·타격)를 쓰는
악기에서 차이가 큽니다.

**예상 위험**

- **고Q 병렬 뱅크는 레벨이 크게 올라갑니다.** MI 도 `resonator.cc:109` 에서 입력에
  ×0.125, `part.cc:206-212` 에서 `SoftLimit` 을 겁니다. **반드시 뒤에 트림을 두세요** —
  `−7.9 LUFS` 사고를 반복하지 마세요.
- `Q_i` 를 크게 잡으면(t60 > 1초) 노트가 끝나도 계속 웁니다. 버스 상주 구조에서는
  이게 **의도한 동작**이지만, `retire`/`sweep` 이 안 걷어가므로 CPU 가 고정 비용이 됩니다.
- 우리 `BQ()` 의 `bandpass` Q 는 선형이 맞습니다(`util.js:58-64` 실측). `Q_DB()` 를
  **쓰면 안 됩니다.**

**난이도** 중

---

### ★3. 곡면 브리지 자와리 — 진폭 접기 대신 지연 변조

**무엇을**

우리 `buzz`(`string.js:70,79-82`)는 **진폭을 접습니다**:

```js
const thr = S.buzz ? amp*S.buzz : 0;
if(v> thr) v= thr+(v-thr)*0.30;
else if(v<-thr) v=-thr+(v+thr)*0.30;
```

MI 는 같은 현상을 **지연선 길이 변조**로 만듭니다. 현이 곡면 브리지에 닿으면
울리는 길이가 짧아져 **순간적으로 음정이 올라갑니다.** 진폭을 깎는 게 아닙니다.

**MI 어느 파일 어느 부분** — `rings/dsp/string.cc:157-186`, `plaits/.../string.cc:135-173`

```c
// 브리지 곡률 계산 (rings/dsp/string.cc:184-186)
float value = fabs(s) - 0.025f;
float sign  = s > 0.0f ? 1.0f : -1.5f;      // ← 비대칭! 아래쪽이 1.5배
curved_bridge_ = (fabs(value) + value) * sign;   // = 2·max(value,0)·sign

// 다음 샘플의 지연에 반영 (rings/dsp/string.cc:169-170)
delay_fm -= curved_bridge_ * bridge_curving;
delay    *= delay_fm;
```
`bridge_curving = (−dispersion)² · 0.01` (`:164`), `dispersion < 0` 일 때만 동작.
Plaits 판은 `bridge_curving = amount² · 0.01`(`string.cc:136`)로 같습니다.

> **환산** : `(|v| + v)` 는 **양의 반파 정류를 2배 한 것**입니다
> (`v>0` 이면 `2v`, 아니면 0). 문턱 `0.025` 는 MI 내부 신호 스케일(±1 근처) 기준이므로
> **우리 `amp` 에 비례하게 `0.025·amp` 로 두세요.** `bridge_curving` 최대 0.01 은
> **지연선 길이의 1%** 를 뜻합니다 — 1% 짧아지면 **약 +17 cent**(1200·log₂(1/0.99)).

**우리 어느 파일 어느 함수에** — `string.js` `ksInto()`

지금 `Di` 는 정수 상수이고 분수부 `fr` 만 올패스가 처리합니다. 지연을 샘플마다 흔들려면
**읽기 위치를 분수로 읽어야** 하는데, 우리 루프는 `line[wp]` 정수 읽기입니다.
두 갈래가 있습니다.

- **쉬운 쪽** — 올패스 계수 `ap` 를 샘플마다 다시 계산해 `fr` 을 흔듭니다.
  `fr ∈ [1,2)` 범위 안에서만 흔들 수 있으므로 **최대 ±0.5 샘플** — 낮은 음(E2 = 582샘플)
  에서 0.086% = **+1.5 cent** 뿐이라 시타르의 "쟁-" 에는 부족합니다.
- **맞는 쪽** — MI 처럼 `ReadHermite`(`stmlib/dsp/delay_line.h:91-105`, 4점 에르미트)로
  분수 위치를 읽습니다. `ksInto` 의 `line[]`/`wp` 구조를 그대로 두고 읽기만
  `readHermite(line, wp + d)` 로 바꾸면 됩니다. **버퍼를 굽는 코드라 CPU 여유가 있습니다.**

에르미트 보간 계수는 `stmlib/dsp/dsp.h:52-66` `InterpolateHermite` 에 그대로 있습니다
(Catmull-Rom 형태, 4점 · 곱셈 7회).

**기대 효과** 시타르(`sitar`)와 `buzz:0.50` 짜리 엔진(`engines.js:324`)이
"찌그러진 소리" 가 아니라 **"쟁— 하고 음정이 흔들리는 소리"** 가 됩니다.
자와리의 정체성이 바로 그 피치 요동입니다.

**예상 위험**

- 지연이 흔들리면 **`ksRender` 의 피크 정규화 기준이 달라집니다.** `lvl` 재조정 필요.
- 우리 `buzz` 를 없애지 말고 **둘을 함께 두세요.** MI 는 진폭 접기가 아예 없지만,
  우리 진폭 접기는 자와리의 "부서짐" 을 이미 만들고 있고 계측으로 맞춰져 있습니다.
  MI 의 비대칭(`-1.5`)도 그대로 살릴 값어치가 있습니다 — 실제 브리지는 위아래가
  다르게 닿습니다.
- 에르미트 보간은 고역에서 약간의 감쇠가 있습니다(1차 올패스는 `|H|=1`).
  **루프 안정성(`g < 1`)이 깨지지는 않지만** 밝기가 조금 달라집니다.

**난이도** 하~중 (에르미트 읽기 15줄 + 브리지 3줄)

---

### ★4. 활 마찰 테이블 + 밴디드 도파관 (fiddle)

**무엇을**

우리 `fiddleVoice`(`voice-gtr.js:15-50`)는 **톱니 + 몸통 포먼트 + 밴드패스 백색잡음**입니다.
머리주석에 *"활은 계속 밀어 넣는다"* 고 정확히 진단해 놓고, 구현은 근사로 남았습니다.

MI 는 **진짜 스틱-슬립 마찰 모델**을 씁니다.

**MI 어느 파일 어느 부분**

`elements/dsp/resonator.h:92-103` — `BowTable`. **전부 float, 고정소수점 없음**:

```c
inline float BowTable(float x, float velocity) const {
  x = 0.13f * velocity - x;      // Δv = 활 속도 − 현 속도
  float bow = x;
  bow *= 6.0f;
  bow = fabs(bow) + 0.75;
  bow *= bow;  bow *= bow;       // ^4
  bow = 0.25f / bow;             // μ(Δv) = 0.25 / (|6Δv|+0.75)^4
  if (bow < 0.0025f) bow = 0.0025f;
  if (bow > 0.245f)  bow = 0.245f;
  return x * bow;                // 마찰력 = Δv · μ(Δv)
}
```

`elements/dsp/resonator.cc:172-184` — 밴디드 도파관 8개(`kMaxBowedModes = 8`):

```c
for (i < num_banded_wg) {
  s = 0.99f * d_bow_[i].Read();          // 모드 주기 길이의 지연선, 되먹임 0.99
  bow_signal += s;                       // 모든 대역의 합 = 현 속도
  s = f_bow_[i].Process<BAND_PASS_NORMALIZED>(input + s);
  d_bow_[i].Write(s);
  sum_center += s * amplitudes.Next() * 8.0f;
}
bow_signal_ = BowTable(bow_signal, *bow_strength++);   // 다음 샘플 입력
```
`resonator.cc:99-103` — 대역별 지연선 길이 `period = 1/f_i`, 필터 Q = `1 + f_i_norm·1500`.

> **환산** : `Q = 1 + (f_Hz/48000)·1500` → 500 Hz 모드에서 **Q ≈ 16.6**, 2 kHz 에서 **Q ≈ 63.5**.
> 되먹임 `0.99` 는 주기마다 −0.087 dB 이므로 `t60 = 60/0.087 = 690 주기` —
> 500 Hz 에서 **1.38 초**. (계산)

**활 잡음(scratch)의 정체** — `elements/dsp/voice.cc:50-52` 를 보면
활은 `EXCITER_MODEL_FLOW` 에 `parameter = 0.7` 입니다.
`elements/dsp/exciter.cc:254-270`:

```c
scale     = parameter^4 = 0.7^4 = 0.2401
threshold = 0.0001 + scale·0.125 = 0.03011
매 샘플: sample = uniform[0,1)
  if (sample < threshold) particle_state = −particle_state;
  out = particle_state + (sample − 0.5 − particle_state)·scale
```

> **환산** : `particle_state` 는 ±0.5 의 **랜덤 텔레그래프 신호**입니다.
> 뒤집힐 확률이 샘플당 0.0301 이므로 **평균 유지 길이 33샘플 = 48 kHz 에서 0.69 ms**,
> 특성 주파수 ≈ **1.45 kHz** 부근에서 −6 dB/oct 로 꺾이는 로렌츠형 스펙트럼입니다.
> 거기에 백색 잡음이 24% 섞입니다. 우리 `fiddleVoice` 의
> `BQ('bandpass',2600,0.9)` + `gain 0.05` 백색잡음과는 성격이 다릅니다.

**Web Audio 로 옮기는 방법 — 버퍼 굽기**

`BowTable` 과 도파관은 **샘플 단위 비선형 되먹임**이라 노드 그래프로는 절대 안 됩니다.
그러나 **`ksRender` 와 똑같이 오프라인으로 구우면 됩니다.**

두 단계로 나눠 가세요.

- **1단계(싸다)** — 활 잡음만 바꿉니다. `ProcessFlow` 를 4초짜리 루프 버퍼로 구워
  `graph.js` 의 `noiseBus`/`pinkBus` 옆에 `bowBus` 를 하나 더 둡니다(핑크 노이즈를
  넣었을 때와 **완전히 같은 작업**입니다, `graph.js:156-182`). `util.js` 에 `tapBow()` 추가.
  `fiddleVoice` 의 `nf`/`ng` 를 여기로 갈아탑니다. **20줄.**
- **2단계(비싸다)** — 활로 켠 한 음을 통째로 굽습니다. `string.js` 옆에 `bowed.js` 를
  새로 만들고, 8개 밴디드 도파관 + `BowTable` 루프를 JS 로 옮겨
  `makeStringCache()`(`string.js:143-154`)로 캐시합니다.
  **주의: 활은 지속음이라 버퍼 길이를 미리 못 정합니다.** 두 가지 처리:
  - 최대 길이(예 3초)까지 굽고, 정상 상태 구간을 `loop`/`loopStart`/`loopEnd` 로 루프.
  - 어택(활이 물리는 0.2초)은 루프 밖에 두어야 합니다.
  `voice-gtr.js` 는 이미 `gtrBuf(e+'|'+midi, …)` 로 음정별 캐시를 씁니다 — 같은 패턴입니다.

**기대 효과** 피들·바이올린 계열이 "톱니 리드" 에서 벗어납니다. 스틱-슬립은
**세기에 따라 배음 구조가 비선형으로 변합니다** — 활 압력이 정체성인 악기에서
이게 없으면 벨로시티가 음량만 바꿉니다.

**예상 위험**

- **발산 위험.** 되먹임 0.99 + 비선형 테이블이라 파라미터가 나쁘면 폭주합니다.
  MI 도 `elements/dsp/part.cc:119-131` 에 **`panic_` 처리**(레조넌스 레벨 200 초과 시
  전 필터 리셋)를 따로 두었습니다. 오프라인이므로 우리는 굽는 중에
  `if(!isFinite(v)) break;` 로 막으면 됩니다.
- **굽는 비용이 큽니다.** 8 대역 × 3초 × 48 kHz = 115만 샘플 × 8 = 920만 연산.
  `ksRender` 보다 5~8배 비쌉니다. **캐시가 없으면 첫 음에서 렌더가 끊깁니다.**
  프리셋 로드 시 미리 굽는 경로가 필요할 수 있습니다.
- 루프 이음매에서 클릭이 날 수 있습니다. 제로 크로싱에 맞춰 자르세요.

**난이도** 1단계 하 / 2단계 **상**

---

### ★5. 루프 필터 지연 보정 — KS 음정 정확도

**무엇을**

우리 `ksInto`(`string.js:27-36,74-86`)는 지연선 길이를 이렇게 정합니다.

```js
const P=SR/f;  const Di=Math.max(3,Math.floor(P)-1);  const fr=P-Di;
const ap=(1-fr)/(1+fr);        // 1차 올패스로 분수부 fr 을 만든다
```
`Di + fr = P` 로 딱 맞습니다. **그런데 루프 안에 필터가 하나 더 있습니다.**

```js
lp+=(y-lp)*a;                       // 1극 로우패스 (lpF)
let v=g*(y-b*(y-lp));               // 셸프 (shDb)
```
이 필터에도 **군지연이 있고, 그만큼 주기가 길어져 음이 낮게 납니다.**

MI 는 이걸 명시적으로 보정합니다.

**MI 어느 파일 어느 부분**

- `rings/dsp/string.cc:125-128,139` —
  `damping_compensation = 1 − lut_svf_shift(damping_cutoff)` 를 지연에 곱합니다.
- `plaits/.../string.cc:119,122-123` — 같은 것.
- `rings/resources/lookup_tables.py:65-67` 에 **LUT 생성식이 그대로 있습니다**(소스확인):

```python
ratio     = 2.0 ** (numpy.arange(0, 257) / 12.0)      # 인덱스 = 반음
svf_shift = 2.0 * numpy.arctan(1.0 / ratio) / (2.0 * numpy.pi)
```

> **환산** : `svf_shift = atan(1/r)/π`, 보정계수 = `1 − atan(1/r)/π`.
> 여기서 `r = f_cutoff / f0` (컷오프가 기음보다 몇 배 위인가).
> 예: 컷오프가 기음보다 2옥타브 위(`r = 4`)면 보정계수 = `1 − atan(0.25)/π` = **0.922**
> — **지연선을 7.8% 짧게** 잡습니다. 보정을 안 하면 그만큼 음이 낮습니다.
>
> MI 는 2극 SVF 를 쓰므로 이 식이 그들의 필터에 맞춘 것입니다.
> **우리는 1극 + 셸프라 식이 다릅니다. 그대로 베끼면 안 됩니다.**

**우리 쪽 오차 — 계산해 봤습니다**

1극 로우패스 `y[n] = y[n−1] + a(x[n]−y[n−1])` 의 DC 근처 군지연은 `(1−a)/a` 샘플입니다.
셸프가 그 중 `b` 만큼만 섞으므로 **총 지연 ≈ `b·(1−a)/a`**.
`a = 1 − e^(−2π·lpF/SR)`, `b = 1 − 10^(shDb/20)`.

| 엔진 | lpF | shDb | a | b | 지연(샘플) | E2(82Hz) | E4(330Hz) |
|---|---|---|---|---|---|---|---|
| `fuzz` | 5500 | −0.45 | 0.513 | 0.051 | 0.048 | −0.14 cent | −0.6 cent |
| `nylon` | 3200 | −1.40 | 0.342 | 0.149 | 0.29 | −0.9 | −3.4 |
| `upright` | 1300 | −2.20 | 0.156 | 0.224 | 1.21 | −3.6 | (해당 없음) |
| **`mute`** | 2400 | **−2.50** | 0.269 | 0.250 | **0.68** | −2.0 | **−8.1 cent** |

> **전부 계산입니다.** DC 근사라 실제로는 이보다 작을 수 있습니다.
> **자기상관으로 실측하세요** — `audio-review.md` §3-5 가 `tools/verify-delay.html` 에서
> 이미 같은 방법을 썼습니다.

**우리 어느 파일 어느 함수에** — `string.js:27-31` `ksInto()` 머리

```js
const gd = b*(1-a)/a;                 // 루프 필터 군지연 (a,b 를 먼저 계산해 둘 것)
const P  = SR/f - gd;                 // ← 그만큼 미리 뺀다
```
순서만 바꾸면 됩니다(현재 `a`,`b` 가 `P` 뒤에 계산됩니다).

**기대 효과** 음정이 **음역에 무관하게** 맞습니다. 지금은 높은 음일수록 더 낮게 납니다
— 코드를 짚었을 때 위쪽 음이 처지는 형태라 화성이 탁해집니다.

**예상 위험 — 이 항목이 위험 대비 코드가 가장 작습니다**

- **모든 현 악기의 음정이 동시에 움직입니다.** 기타 8종 · 베이스 4종 · 만돌린 ·
  밴조 · 시타르 · 사즈 · 12현 전부.
- `gtrBuf`/`bassBuf` 캐시 키는 음정이라 그대로지만, **`tools/measure-tonal.html` 의
  기준값이 전부 다시 잡혀야 합니다.**
- **한 엔진씩 켜서 실측하세요.** 특히 `mute` 는 감쇠가 짧아 자기상관 창이 짧습니다.

**난이도** 코드 하(3줄), 검증 중

---

### ★6. 분산 올패스 — KS 현에 비조화도를 넣는다

**무엇을**

우리 `struck.js` 는 비조화도가 있지만(`f_n = n·f0·√(1+B·n²)`) **`string.js` 에는 없습니다.**
뜯은 현도 강성이 있어 배음이 정수배보다 높습니다 — 특히 굵은 베이스 현과 피아노 저역에서
크게 나타납니다.

MI 는 지연 루프 안에 **분산 올패스 체인**을 넣어 이걸 만듭니다.

**MI 어느 파일 어느 부분** — `rings/dsp/string.cc:150-179`, `plaits/.../string.cc:125-164`

```c
// rings 판
stretch_point = dispersion·(2 − dispersion)·0.475          // 0 … 0.475
ap_gain       = −0.618·dispersion / (0.15 + |dispersion|)  // 0 … −0.535
ap_delay      = delay · stretch_point
main_delay    = delay − ap_delay
if (ap_delay >= 4 && main_delay >= 4) {
  s = string_.ReadHermite(main_delay);
  s = stretch_.Allpass(s, ap_delay, ap_gain);              // ← 여기
} else s = string_.ReadHermite(delay);
```

`stmlib/dsp/delay_line.h:64-69` 의 `Allpass` (**전부 float**):

```c
T read  = line_[(write_ptr_ + delay) % max_delay];
T write = sample + coefficient * read;
Write(write);
return -write * coefficient + read;
```
— **긴 지연선을 쓴 1차 올패스**입니다. 우리 `ksInto` 의 `ap` 는 1샘플짜리인데,
MI 는 지연을 `delay·0.475` 까지 키웁니다.

> **환산** : `stretch_point` 는 **전체 루프 지연 중 올패스가 차지하는 비율**입니다.
> 최대 0.475 이면 루프의 절반이 올패스로 대체됩니다. 이 올패스는 주파수에 따라
> 위상 지연이 달라지므로 배음이 등간격에서 벗어납니다 — 그게 분산입니다.
> `0.618` 은 황금비의 역수인데, MI 소스에 **근거 주석이 없습니다**(미확인 — 경험값으로 보입니다).
>
> **Plaits 판에는 보정항이 하나 더 있습니다**(`plaits/.../string.cc:126-127,158`) —
> `stretch_correction = clamp(160/SR·delay, 1.0, 2.1)`,
> `main_delay = delay − ap_delay·(0.408 − stretch_point·0.308)·stretch_correction`.
> 올패스가 실제로 만드는 지연이 `ap_delay` 와 다르기 때문에 음정을 맞추는 보정입니다.
> **이걸 빠뜨리면 dispersion 노브를 돌릴 때 음정이 따라 움직입니다.**

**Web Audio 로 옮기는 방법 — 버퍼 굽기**

`ksInto` 안에 `stretch` 라는 두 번째 원형 버퍼를 하나 더 두고 위 3줄을 그대로 옮깁니다.
`ap_delay` 가 분수라 ★3 의 에르미트 읽기가 먼저 있어야 합니다 — **★3 과 묶어서 하세요.**

**우리 어느 파일 어느 함수에** — `string.js` `ksInto()`,
엔진표(`core/engines.js` `GTR`/`BSTR`)에 `disp:` 필드 추가.

가장 값어치 있는 대상: `upright`(업라이트 베이스 — 굵고 짧아 강성이 큽니다),
`slap`/`finger` 베이스의 저음역, `piano12`(12현)의 저음 코스.

**기대 효과** 저음 현이 "고무줄" 이 아니라 "쇠줄" 로 들립니다.
`struck.js` 머리주석의 *"비조화성이 없으면 오르간처럼 들린다"* 가 뜯은 현에도 그대로 적용됩니다.

**예상 위험**

- **음정이 움직입니다.** Plaits 의 `stretch_correction` 을 반드시 같이 옮기고,
  ★5 와 함께 실측하세요.
- 올패스 지연이 4샘플 미만이면 MI 도 우회합니다(`ap_delay >= 4` 조건). 높은 음에서
  자동으로 꺼지므로 **고음은 효과가 없습니다** — 그게 맞습니다.
- 루프 이득이 올라갈 수 있습니다. `g < 1` 안정 조건은 올패스가 `|H|=1` 이라 유지되지만,
  **에르미트 보간이 끼면 더 이상 정확히 1 이 아닙니다.**

**난이도** 중

---

### 7. 연속 드라이브 — `SoftClip` + 자동 post-gain

**무엇을**

우리는 `mkCurve(k)` 를 **4개 굽고 드라이브 구간마다 갈아탑니다**
(`voice-bass.js:189-196`). 갈아탈 때 레벨이 튀어서 `CURVE_GAIN` 으로 보정합니다
(`util.js:67-71`, `audio-review.md` §3-2 에 +3.4 dB 계단이 측정돼 있습니다).

MI 는 **비선형 커브를 하나만 두고, 앞 게인을 연속으로 올린 뒤 뒤에서 그 역수를 곱합니다.**
갈아탈 커브가 없으니 계단이 **구조적으로 없습니다.**

**MI 어느 파일 어느 부분** — `warps/dsp/modulator.h:53-114` `SaturatingAmplifier`

```c
float drive_2   = drive * drive;
float pre_gain_a = drive * 0.5f;
float pre_gain_b = drive_2 * drive_2 * drive * 24.0f;      // drive^5 · 24
float pre_gain   = pre_gain_a + (pre_gain_b − pre_gain_a) * drive_2;
float drive_squished = drive * (2.0f − drive);
float post_gain = 1.0f / SoftClip(0.33f + drive_squished * (pre_gain − 0.33f));
// 샘플마다:
float pre  = pre_gain * x;
float post = SoftClip(pre) * post_gain;
out = pre + (post − pre) * limit;        // limit 로 드라이/클립 블렌드
```

`stmlib/dsp/dsp.h:101-113`:

```c
SoftLimit(x) = x·(27 + x²) / (27 + 9x²)
SoftClip(x)  = x < −3 ? −1 : (x > 3 ? 1 : SoftLimit(x))
```

> **환산** : `SoftLimit` 은 tanh 의 유리함수 근사입니다.
> `SoftLimit(1) = 28/36 = 0.778` (tanh(1) = 0.762),
> `SoftLimit(3) = 3·36/108 = 1.000` — **|x| = 3 에서 정확히 ±1 에 도달**합니다.
> tanh 는 점근이라 절대 1 에 못 갑니다. 즉 이 커브는
> **소신호에서 tanh 와 거의 같고 대신호에서 정확히 포화**합니다. 홀함수라 **홀수 배음만** 만듭니다.
> `pre_gain` 범위는 drive 0 → 0, drive 1 → 24 (**+27.6 dB**).

**우리 어느 파일 어느 함수에**

- `core/util.js:74-78` `mkCurve` 옆에 `mkSoftClip()` 을 하나 굽습니다(8192점, 20줄).
- `voice-bass.js:186-201` 의 `shIdx`/`CURVE_GAIN`/`mk` 세 줄이 **통째로 사라지고**
  `dGain.gain = preGain(bd)`, `mk.gain = 1/SoftClip(...)` 두 줄이 됩니다.

**기대 효과** Drive 노브가 연속이 됩니다. 지금은 0.15 / 0.40 / 0.70 세 지점에서
음색이 **불연속으로 점프**합니다(보정으로 레벨만 맞췄지 배음 구조는 계단입니다).

**예상 위험 — 이 항목이 위험이 제일 큽니다**

- **357개 프리셋의 베이스 음색이 전부 바뀝니다.** `audio-review.md` §5 가 이미
  "`mkCurve` 전면 정규화 → 라우드니스 재검수 필요" 로 보류해 둔 항목입니다.
- 마스터 체인의 `shaper`(`graph.js:33`, `CURVES[1]`)와 앰프의 `mkTube` 는 **건드리지 마세요.**
  거긴 −7.9 LUFS 사고 이후 실측으로 맞춰 놓은 곳입니다.
- **베이스 `Drive` 노브 한 곳만** 시범 적용하고 `tools/` 로 계단이 사라졌는지 확인한 뒤
  다음을 판단하세요.

**난이도** 코드 하, 검증 상

---

### 8. 리드 도파관 튜브 (sax · harmonica · tuba)

**무엇을**

`KENG` 의 `sax`·`harmonica`·`accordion`·`bandoneon` 과 `voice-bass.js` 의 `windBass`(튜바)는
전부 **오실레이터 + 포먼트**입니다. 관악의 정체성인 **리드의 비선형**이 없습니다.

MI 는 클라리넷식 도파관을 씁니다 — `elements/dsp/tube.cc:44-87`, **50줄이 전부**입니다.

```c
breath         = input·damping + 0.8
in             = 지연선 보간 읽기 (길이 = 1/frequency)
pressure_delta = −0.95·(in·envelope + zero_state) − breath
zero_state     = in
reed           = pressure_delta·(−0.2) + 0.8         // 리드 테이블
out            = pressure_delta·reed + breath
CONSTRAIN(out, −5, 5)
지연선.write(out · 0.5)
pole_state    += lpf_coefficient·(out − pole_state)  // 1극 로우패스
출력          += gain·envelope·pole_state
```

> **환산** : `damping = 3.6 − damping_param·1.8` → **1.8 … 3.6** 배.
> `lpf_coefficient = frequency_norm·(1 + timbre²·256)`, 상한 0.995 →
> **컷오프가 기음의 1 … 257배**를 따라갑니다(음정 추종).
> 리드 테이블 `reed = 0.8 − 0.2·Δp` 는 **STK 의 선형 리드 근사**입니다
> (압력차가 커지면 리드가 닫힘). `−0.95` 는 열린 관 끝의 반사계수.

**Web Audio 로 옮기는 방법 — 버퍼 굽기**

되먹임 루프라 노드 그래프 불가. `struck.js` `bakeStruck()` 과 같은 구조로 굽고
`struckCache` 와 같은 방식으로 캐시합니다. ★4 와 마찬가지로 **지속음이라 루프 처리 필요**.

**기대 효과** 색소폰·하모니카가 "포먼트 걸린 톱니" 에서 벗어납니다.
관악은 세게 불면 배음이 늘어나는데(리드가 더 세게 닫힘) 지금은 그게 없습니다.

**예상 위험**

- `windBass` 는 **튜바 = 금관**입니다. 리드가 아니라 입술이라 이 모델이 그대로 맞지 않습니다.
  `elements/dsp/tube.cc` 는 명시적으로 클라리넷 계열입니다. **튜바에 쓰지 마세요.**
- `sax`/`harmonica` 는 리드가 맞습니다. `accordion`/`bandoneon` 은 **자유 리드**라
  또 다릅니다(관 공진이 없음) — MI 에 해당 모델이 없습니다.
- ★4 와 같은 발산·캐시·루프 이음매 문제를 그대로 가집니다.

**난이도** 상

---

### 9. 벨로시티 ↔ 밝기 분리 (harpsi)

**무엇을 — 이건 "MI 에서 가져온다" 가 아니라 "MI 구조를 보고 우리 버그를 찾았다" 입니다**

계측 결과: 하프시코드 기울기 −7.9 dB/oct(피아노 −7.6 보다 밝지 않음),
벨로시티 민감도 5~6 dB 남음(실물 하프시코드는 **무반응**이 정체성).

원인은 `struck.js:106` 한 줄입니다.

```js
const lp = BQ('lowpass', Math.min(1800 + 9000*vel*vel, 16000), Q_BUTTER, end);
```
**`STRUCK` 4엔진(piano·harpsi·vibes·marimba)이 전부 이 식을 공유합니다.**
`STRUCK.harpsi` 에 `tilt:0.80`(피아노 1.15)로 밝게 만들어 놓고, 그 뒤 로우패스가
**피아노와 똑같이** 걸리므로 차이가 지워집니다. `vel` 도 마찬가지로 공유됩니다.

**MI 가 뭐라고 하는가** (소스확인)

MI 는 **세기(strength/accent)와 음색(timbre)을 구조적으로 분리**합니다.

- `elements/dsp/voice.cc:185` — `strike_buffer_[i] *= accent`. 벨로시티는
  **여기 신호의 진폭만** 곱합니다.
- `elements/dsp/exciter.cc:180-207` `ProcessPlectrum`(= 뜯는 것) — 진폭은
  `GetPulseAmplitude(timbre_)`, 즉 **`timbre_` 로만** 정해집니다. 세기는 안 들어옵니다.
- 밝기와 세기를 잇고 싶으면 **명시적으로 25% 만** 섞습니다 —
  `plaits/.../modal_voice.cc:66-67`, `string_voice.cc:67-68`:
  ```c
  brightness += 0.25f * accent * (1.0f - brightness);
  damping    += 0.25f * accent * (1.0f - damping);
  ```
  결합 계수가 **소스에 숫자로 적혀 있고, 모델별로 끌 수 있습니다.**

**우리 어느 파일 어느 함수에** — `struck.js` `struckVoice()`

`STRUCK` 표에 `velBright`(0~1) 를 넣고 `1800 + 9000·vel²·velBright + 9000·(1−velBright)`
꼴로 바꾸면 됩니다. `harpsi`는 0, `piano`는 1.
`tilt` 만으로 밝기 차이를 내려면 로우패스가 방해하면 안 됩니다.

**기대 효과** 계측된 두 결함이 동시에 풀립니다.
`vca.gain` 의 `0.62·(0.30+0.70·vel)`(`struck.js:132`)만 남으면
**세게 쳐도 커지기만 하고 밝아지지 않는** 하프시코드가 됩니다.

**예상 위험** 피아노·비브라폰·마림바에 `velBright:1` 을 명시해 지금 동작을 유지하세요.
`tools/measure-tonal.html` 재측정 필요.

**난이도** 하 — **단, 이건 MI 차용이 아니라 우리 버그 수정입니다. 그렇게 적어 두세요.**

---

## 3. 채택하지 않기로 한 것 — 같은 조사를 반복하지 않기 위해

| 대상 | 판정 | 이유 (근거) |
|---|---|---|
| **퍼즈 / 앰프 / 캐비닛** | ❌ **MI 에 답이 없다** | `eurorack` 전체를 훑었지만 **기타 앰프·캐비닛·퍼즈 모델이 존재하지 않습니다.** 가장 가까운 것이 `warps/dsp/modulator.h` 의 `SaturatingAmplifier`(§2-7)와 `stmlib` 의 `SoftLimit` 인데 **둘 다 홀함수**라 짝수 배음을 못 만들고, 중역 스쿱 같은 개념 자체가 없습니다. 계측된 퍼즈 결함(홀/짝 0.0 dB, 중역 +15.8 dB)은 **MI 로 못 고칩니다.** 원인 추정은 §4-3 에 따로 적었습니다. |
| **`rings/dsp/plucker.h` (내부 여기)** | ❌ **우리가 더 정교** | `plucker.h:56-72` = 한 주기 길이 백색 노이즈 → 되먹임 콤(주기 = `1/f·(position·0.9+0.05)`, 이득 `(1−position)·0.8`) → 로우패스. 우리 `ksInto:45-52` 의 β 지점 2단 사각 속도파는 **물리 유도**이고, `string.js` 머리주석에 왜 노이즈 버스트로는 안 되는지(기음이 27 dB 죽음) 측정으로 적혀 있습니다. |
| **모드 진폭으로 픽업 콤 근사** | ❌ **우리 쪽이 맞다** | `elements/dsp/resonator.cc:154-162` 에서 MI 스스로 *"정확한 방법은 콤 필터지만 변조하면 플랜저처럼 들리고 어택이 번져서"* 근사로 갔다고 적었습니다. **우리는 오프라인으로 굽기 때문에 변조가 없습니다** — 진짜 콤(`ksRender:118-125`)을 쓸 수 있고 그게 정확합니다. |
| **MI 의 비조화 법칙 (`stretch_factor`)** | ❌ **우리 `√(1+Bn²)` 이 맞다** | §2-★2 에 급수를 풀어 적었습니다 — MI 의 것은 `1 + 50s` 로 **수렴**합니다. 실제 현의 강성 비조화는 수렴하지 않습니다. MI 의 것은 노브로 쓸어도 나이퀴스트를 안 넘게 만든 **연출용 곡선**입니다. 다만 `stiffness < 0`(모드가 **압축**되는 쪽, `lookup_tables.py:78-80`)은 우리에게 없는 소리라 **§6 의 다음 조사 후보**로 남깁니다. |
| **`NthHarmonicCompensation`** (`plaits/.../resonator.cc:59-70`) | ❌ **우리에게 불필요** | 배음을 늘렸을 때 3배음이 제자리에 오도록 f0 를 되돌리는 보정입니다. **실제 피아노는 기음이 제 음정에 있고 배음이 위로 늘어난 상태**(조율사가 옥타브를 스트레치하는 이유)라, 우리 `struck.js` 가 이미 맞습니다. |
| **`stmlib::Svf` 를 이식** | ❌ **불필요** | `filter.h:177-247` 은 TPT/ZDF 상태변수 필터입니다. 우리는 `BiquadFilterNode` 가 있고 **네이티브라 더 빠릅니다.** SVF 의 장점(계수 급변에도 안정)은 노트마다 필터를 새로 만드는 우리 구조에서 안 나옵니다. `FREQUENCY_FAST/ACCURATE` 탄젠트 근사(`filter.h:106-134`)도 JS 에서 `Math.tan` 이 이미 빠릅니다. |
| **`stmlib::Limiter`** (`limiter.h:50-57`) | ❌ **우리가 더 낫다** | `SLOPE(peak, |s|, 0.05, 0.00002)` 로 피크를 추종해 `1/peak` 를 곱하는 것뿐입니다(어택 계수 0.05 = 매우 빠름, 릴리스 0.00002). 우리 `limComp` + `tpClip`(`graph.js:44-100`)은 트루피크까지 실측으로 맞춰 놓았습니다. |
| **`warps` 채널 보코더** (`vocoder.cc`) | ❌ **용도가 다르다** | 20밴드 1/3옥타브(`filter_bank.h:42`, 밴드비 `1.2599 = 2^(4/12)`) 크로스오버 + 밴드별 포락선 추종기. **진짜 보코더**라 변조 입력(사람 목소리)이 필요합니다. 우리 `vocoder` 엔진은 "보코더처럼 들리는 신스" 이지 보코더가 아닙니다. 게다가 `SampleRateConverter` 로 밴드마다 데시메이션까지 하는 구조라 **워클릿 없이는 불가능**합니다. |
| **`SAMSpeechSynth`** (`sam_speech_synth.cc`) | ❌ **Web Audio 와 안 맞다** | 포먼트 사인 3개의 **위상을 성문 주기마다 리셋**하고 `(1 − phase)` 창을 곱하는 VOSIM/FOF 방식입니다(`:153-180`). Web Audio 로 하려면 주기마다 오실레이터를 재시작해야 해서 **워클릿이 필요**합니다. 모음 표는 참고용으로 §5 에 남깁니다. **★1 의 `NaiveSpeechSynth` 가 같은 결과를 노드 그래프로 냅니다.** |
| **`LPCSpeechSynth`** | ⚠ **미확인** | 파일은 받았지만 **읽지 않았습니다.** 계수 LUT(`plaits/resources`)에 의존해 옮기려면 데이터까지 가져와야 합니다. |
| **Braids `digital_oscillator.cc` 의 VOWEL** | ❌ **SAM 과 같은 것** | grep 으로 `:469-533` 이 같은 위상 리셋 포먼트 방식임을 확인했습니다(본문은 안 읽음). ★1 로 대체됩니다. |
| **Plaits `waveshaping_engine.cc` 웨이브폴더** | ❌ **데이터 의존** | `:120-127` 이 `lut_fold`/`lut_fold_2` 라는 **구워진 512점 LUT** 를 씁니다. 우리 `mkCurve` 처럼 식으로 만들 수 없어 데이터를 통째로 가져와야 합니다. 폴더가 만드는 소리는 우리 장르 범위(록·펑크·재즈…)에 쓸 데가 없습니다. |
| **Warps `Diode` / `Xmod`** (`modulator.cc:347-357,369-435`) | ❌ **용도 없음** | 다이오드 링모듈레이터(Julian Parker, DAFx-11 근사)·XOR·컴퍼레이터. 두 입력이 필요한 크로스모듈레이션이라 우리 구조에 자리가 없습니다. |
| **`elements` 의 ADSR 커브** (`multistage_envelope.h:120-135`) | ❌ **효용 낮음** | 어택 `ENV_SHAPE_QUARTIC`, 디케이·릴리스 `ENV_SHAPE_EXPONENTIAL` 이라는 **LUT 기반 커브**입니다. 우리는 `AudioParam` 의 네이티브 램프를 쓰고, `docs/tone-js-차용.md` §2-4(지수접근 헬퍼)가 이미 같은 자리를 다룹니다. **거기서 하는 편이 낫습니다.** |
| **`elements` 의 `Diffuser`·`Reverb`** | ⚠ **미확인** | `voice.cc:156` 에서 blow 경로에 디퓨저를 겁니다만 `fx/diffuser.h` 를 **안 읽었습니다.** 우리 컨볼버 IR 이 이미 있어 우선순위가 낮습니다. |
| **`Dust`** (`plaits/dsp/noise/dust.h`) | ⚠ **미확인** | `modal_voice.cc:78-80`, `string_voice.cc:83-85` 에서 지속 여기로 씁니다. 헤더를 **안 읽었습니다.** 이름과 사용처로 보아 확률적 임펄스 열(랜덤 임펄스)로 보이나 **추측이라 쓰지 마세요.** ★4-1단계와 같은 방식(버퍼 굽기)으로 옮길 수 있는 후보입니다. |
| **`ParameterInterpolator`** (`parameter_interpolator.h`) | ❌ **불필요** | 블록 처리에서 파라미터를 샘플 단위로 선형 보간하는 것입니다. 우리는 `AudioParam` 의 램프가 같은 일을 네이티브로 합니다. |
| **`rings`/`elements` 의 코드 테이블** (`part.cc:127-215`, `voice.cc:76-88`) | ❌ **우리에게 있음** | 화음 표입니다. 우리는 `core/scale.js` 의 `SCALES` 와 `TRIAD` 가 있습니다. *(다만 MI 가 유니슨을 `0.0 / 0.01 / 0.02` 반음 = **1~2 cent** 로 벌려 맥놀이를 만드는 것은 우리 `det`·`course` 와 같은 발상입니다.)* |

---

## 4. 부수 발견 — MI 소스를 보다가 걸린 우리 쪽 사항

이건 "차용" 이 아닙니다. 조사 중에 드러난 것이고 **이 문서 범위 밖이라 고치지 않았습니다.**

1. **우리 KS 루프는 음정이 음역에 따라 처집니다.** §2-★5 의 표.
   `mute` 엔진 E4 에서 **약 −8 cent**(계산). MI 는 이걸 알고 보정합니다.
   **아직 실측 안 했습니다** — `tools/verify-delay.html` 방식으로 확인하세요.

2. **`struck.js` 의 벨로시티→로우패스가 4엔진 공용입니다.** §2-9.
   `harpsi` 의 `tilt:0.80` 이 그 뒤에서 지워집니다. 계측된 두 결함의 원인입니다.

3. **퍼즈의 홀/짝 비가 0 dB 인 이유 — MI 와 무관한 우리 코드 문제로 보입니다.**
   `state.js:96-106` 의 `mkTube(k, bias)` 는 주석에 *"bias 가 대칭을 깨서 짝수 배음을
   만든다"* 고 스스로 적어 두었는데, `graph.js:212` 의 퍼즈 1단이
   **`fz1: mkTube(9.0, 0.20)`** — bias 0.20 입니다.
   `TUBE` 전체를 보면 `cln 0.06 · cru 0.22 · hi1 0.26 · hi2 0.08 · fz1 0.20 · fz2 0.0`
   (`graph.js:208-212`) — **퍼즈가 크런치·하이게인과 거의 같은 비대칭을 갖고 있습니다.**
   `engines.js:244-246` 은 퍼즈의 정체성을 *"① 홀수 배음이 압도적"*
   이라고 적어 두었습니다. **주석과 상수가 정반대입니다.**
   또 중역 스쿱 `bqf('peaking',600,1.0,−7.0)` 이 **클리핑 앞**에 있어
   (`graph.js:249`, `gtrDrv.fz`·`fz1` 보다 위) 클리퍼가 중역을 다시 채웁니다.
   클리핑 **뒤**에 있는 스쿱은 `cab(...)` 안의 `peaking(400, 1.2, −4.0)` 하나뿐입니다.
   → **가설이지 측정이 아닙니다.** `tools/tune-guitar.html` 로 확인하세요.

4. **우리 몸통 공진은 전부 직렬입니다.** §2-★2. `KEYS_TEX` 13개 악기,
   `ampIn.body_*` 6개, `fiddleVoice`, `struck.js` 전부. **한 곳도 병렬이 없습니다.**
   설계 의도(기울기 성형)로는 맞지만, 공진체를 흉내 내려는 자리에서는 잘못된 도구입니다.

5. **MI 는 모든 공진기에 발산 감시를 답니다.** `elements/dsp/part.cc:119-131,216-224`
   — 레벨 제곱 평균이 200 을 넘으면 `panic_` 으로 전 필터를 리셋합니다.
   *"한 번 실제로 터진 적이 있어서 넣었다"* 는 주석이 붙어 있습니다.
   우리가 ★2·★4 를 도입하면 **같은 장치가 필요합니다.**

6. **MI 의 여기 신호는 전부 1샘플 임펄스입니다.**
   `elements/dsp/exciter.cc:172` `out[0] = GetPulseAmplitude(timbre_)` — 그게 다입니다.
   길이가 아니라 **뒤따르는 로우패스의 컷오프가 음색을 정합니다**(`exciter.cc:76-81`).
   우리는 노이즈 버스트 길이(`exLen`)와 필터(`exF`)를 둘 다 쓰는데,
   **둘이 같은 일을 두 번 하고 있을 가능성**이 있습니다. 확인 안 했습니다.

---

## 5. 라이선스

### 확인한 사실 (소스확인)

- **`eurorack/README.md:32-42`**:

  ```
  Code (AVR projects): GPL3.0.
  Code (STM32F projects): MIT license.
  Hardware: cc-by-sa-3.0
  By: Emilie Gillet (emilie.o.gillet@gmail.com)
  ```

- **우리가 본 모듈은 전부 STM32F 계열 = MIT 입니다.**
  Rings · Elements · Plaits · Warps · Braids · Clouds · Tides.
  *(AVR = GPL3 인 것은 `edges`·`grids`·`branches`·`peaks` 같은 옛 모듈입니다.
  이번 문서는 **그 어느 것도 인용하지 않았습니다.**)*
- **파일 머리주석**에도 MIT 전문이 그대로 붙어 있습니다. 저작권 연도는 파일마다 다릅니다 —
  `elements` 2014, `rings` 2015, `plaits` 2016, `warps` 2014, `stmlib` 2012·2014.
  **베낀 파일의 연도를 그대로 적으세요.**
- **`stmlib/LICENSE:1-2`**: *"Except when noted otherwise, all code is copyright
  Emilie Gillet and is released under the MIT License"*.
- **상표 주의** — `README.md:44-50` 에 *"Mutable Instruments 는 등록상표입니다.
  파생 저작물에 이 이름을 쓰지 마세요"* 라고 명시돼 있습니다.
  **UI·프리셋 이름에 "Rings" · "Elements" · "Plaits" 를 쓰면 안 됩니다.**
  문서(이 파일 같은 출처 표기)에서 참조하는 것은 상표적 사용이 아니라 괜찮습니다.

### 고지 형식 — 함수 바로 위 주석에

`docs/tone-js-차용.md` §5 와 같은 방식입니다. **MIT 는 실질적 부분을 복제·배포할 때
저작권 표시와 허가문을 함께 싣도록 요구합니다.**

```js
/* 활 마찰 테이블 — Mutable Instruments Elements 의
   elements/dsp/resonator.h (Resonator::BowTable) 에서 가져왔습니다.
   Copyright 2014 Emilie Gillet. MIT License.
   https://github.com/pichenettes/eurorack
   μ(Δv) = 0.25/(|6Δv|+0.75)^4, [0.0025, 0.245] 로 클램프. */
```

```js
/* 모음 포먼트 표 — Mutable Instruments Plaits 의
   plaits/dsp/speech/naive_speech_synth.cc (NaiveSpeechSynth::phonemes_) 에서
   가져와 Hz 로 환산했습니다.  Copyright 2016 Emilie Gillet. MIT License.
   원본은 MIDI 노트 번호 + 진폭 0~255. f_Hz = 440·2^((v−69)/12), a = amp/256. */
```

```js
/* 곡면 브리지(자와리) — Mutable Instruments Rings 의
   rings/dsp/string.cc (String::ProcessInternal, curved_bridge_) 에서 가져왔습니다.
   Copyright 2015 Emilie Gillet. MIT License. */
```

### 몇 가지 주의

- **§2-★2 의 환산 유도(`q ≈ 21830·t60`)와 §2-★1 의 dB 계산은 제가 한 것입니다.**
  MI 소스에 없는 값입니다. 고지 대상이 아니라 **주석에 "환산: PULSE·16" 이라고
  구분해 적으세요** — 나중에 누가 원본과 대조할 때 헷갈립니다.
- **`stiffness` / `4_decades` / `svf_shift` 는 파이썬 생성식**입니다
  (`*/resources/lookup_tables.py`). 구워진 배열이 아니라 식을 옮기는 것이므로
  이식이 쉽고, 고지 대상인 것은 마찬가지입니다.
- **`stmlib` 는 별도 저장소**(`pichenettes/stmlib`)입니다. `SoftLimit` 을 가져온다면
  URL 을 그쪽으로 적으세요.
- **`THIRD-PARTY.md` 를 이제 만들 때가 됐습니다.** `docs/tone-js-차용.md` §5 가
  *"베껴 온 조각이 두 개를 넘어가면"* 이라고 적어 두었는데, 이 문서의 후보가
  채택되면 곧바로 넘습니다. 지금 우리 저장소에 이미 Tone.js(핑크 노이즈, MIT) ·
  zacharydenton/noise.js(MIT) 가 들어와 있습니다.

### 전문

```
MIT License · Copyright 2012-2016 Emilie Gillet
(전문: https://github.com/pichenettes/stmlib/blob/master/LICENSE
       및 각 소스 파일 머리주석)
```

---

## 6. 다음에 이어서 볼 것

1. **`plaits/dsp/noise/dust.h`** — ★4-1단계·모달 지속 여기에 쓰입니다. 이번에 **안 읽었습니다.**
2. **`clouds`** — 그래뉼러/텍스처. 우리 `loop` 트랙과 샘플러에 닿을 수 있습니다. **안 봤습니다.**
3. **`stiffness < 0` (모드 압축)** — `lookup_tables.py:78-80` 의 음수 분기.
   배음이 정수배보다 **낮게** 모이는 소리는 우리에게 없습니다. 종·공(gong)·스틸팬에
   쓸 데가 있을지 확인할 값어치가 있습니다.
4. **§4-1 의 음정 처짐 실측** — 계산만 했습니다. `tools/verify-delay.html` 방식으로
   자기상관을 돌려 `mute`·`upright`·`nylon` 세 엔진의 실제 편차를 재세요.
   숫자가 계산보다 작으면 ★5 는 우선순위를 내려도 됩니다.
5. **§4-3 의 퍼즈 가설 실측** — `mkTube` 의 bias 를 0 으로 놓고 홀/짝 비가 어떻게
   움직이는지, 600 Hz 스쿱을 클리핑 뒤로 옮기면 중역이 파이는지.
   **MI 와 무관하지만 계측된 결함 셋 중 하나입니다.**
6. **AudioWorklet 이 `file://` 에서 뜨는지** — `docs/tone-js-차용.md` §6-2 에 이미
   적혀 있는 숙제입니다. 확인되면 ★4·8 을 실시간 워클릿으로 짤 선택지가 생겨
   버퍼 굽기의 캐시·루프 문제가 사라집니다. **지금은 못 쓴다고 가정했습니다.**
