# Tone.js 에서 무엇을 가져올 것인가

조사일 2026-08-02 · 대상 **Tone.js 14.7.77**(우리가 CDN 으로 로드 중인 판)

---

## 0. 조사 방법 — 무엇을 "확인" 이라 부르는가

이 문서에서 **확인** 은 아래 셋 중 하나를 뜻합니다. 추측은 전부 `미확인` 으로 표시했습니다.

| 표기 | 뜻 |
|---|---|
| `소스확인` | GitHub `Tonejs/Tone.js` 태그 `14.7.39` 의 TypeScript 원본을 직접 읽음 |
| `번들확인` | 우리가 실제로 로드하는 `cdnjs .../tone/14.7.77/Tone.js` 안에서 해당 상수·코드를 찾음 |
| `실측` | 14.7.77 을 브라우저에 띄워 직접 실행·계측함 |

> **왜 14.7.39 소스인가** — Tone.js 저장소에 `14.7.77` **git 태그가 없습니다**(태그 목록:
> `13.4.9 · 13.8.24 · 13.8.25 · 14.7.39 · 15.1.22 · r1~r12`). r14 계열에서 태그가 남아 있는
> 마지막 판이 `14.7.39` 라 그것을 읽고, **핵심 상수는 전부 14.7.77 번들에서 재확인**했습니다.
> 아래 상수들이 14.7.77 번들 안에 그대로 들어 있음을 확인했습니다 —
> 핑크노이즈 계수 `.99886*n+.0555179*e`, Freeverb 콤 튜닝 `1557/44100,1617/44100`,
> MetalSynth 비조화비 `1,1.483,1.932,2.546,2.63,3.897`, 지수접근 상수 `Math.log(s+1)/Math.log(200)`.

### 우리 코드에서 읽은 것

`src/audio/string.js` · `struck.js` · `voice-keys.js` · `voice-gtr.js` · `voice-bass.js` ·
`voice-drum.js` · `graph.js` · `params.js` · `sampler.js`, `src/core/util.js` · `config.js`,
`ARCHITECTURE.md`.

### 총평 — 솔직하게

**우리 신스 코어는 Tone.js 의 악기들보다 정교합니다.** 이건 겸양이 아니라 소스를 대조한 결과입니다.

- `string.js` 의 Karplus-Strong 은 1차 올패스 분수지연 보간 + β 지점 사각속도파 여기 +
  픽업 콤 + 자와리 + 복현 + 공명현까지 있습니다. `Tone.PluckSynth` 는
  **핑크 노이즈 버스트 → 로우패스 콤 필터**, 그게 전부입니다.
- `struck.js` 의 비조화 가법합성(`f_n = n·f0·√(1+B·n²)`, 16~20 부분음, 부분음별 감쇠, 유니즌)에
  대응하는 것이 Tone.js 에는 **아예 없습니다**. `FMSynth` 로는 안 된다는 건 `struck.js`
  머리주석에 이미 측정으로 적혀 있습니다.
- `voice-drum.js` 의 킥(서브+바디+어택+클릭 4층)은 `Tone.MembraneSynth`(오실레이터 1개 +
  피치 램프)보다 훨씬 두껍습니다.
- `lp24()` 의 버터워스 Q 스태거(0.5412 / 1.3066)는 `Tone.Filter` 의 `rolloff` 구현보다
  **정확합니다**. Tone 은 같은 Q 의 필터를 그냥 직렬로 겹칩니다(`Filter.ts:140-152`) —
  그러면 최대평탄이 깨집니다.

그래서 **악기 코어는 가져올 게 거의 없습니다.** 가져올 값어치가 있는 것은
① **우리에게 통째로 없는 이펙트**(페이저·와, 기타 코러스),
② **한 조각짜리 알고리즘·상수**(핑크 노이즈, 체비셰프, 지수접근, 808 심벌 비조화비)
두 갈래입니다. 아래 우선순위표가 그 결론입니다.

---

## 1. 우선순위표 — 효과 대비 비용

| 순위 | 후보 | 방식 | 효과 | 비용 | 위험 | 적용 파일 |
|:--:|---|---|:--:|:--:|:--:|---|
| **1** | `Tone.Phaser` · `Tone.AutoWah` · `Tone.Chorus` 를 기타/건반 버스에 | **그대로 사용** | 大 | 小 | 低 | `audio/graph.js`, `core/engines.js` |
| **2** | 핑크 노이즈 버스 | **이식** | 中 | 極小 | 極低 | `audio/graph.js`, `core/util.js` |
| **3** | MetalSynth 식 FM 메탈 버스 + 엔벨로프→HPF 스윕 | **이식** | 中 | 中 | 中 | `audio/graph.js`, `audio/voice-drum.js` |
| 4 | `exponentialApproachValueAtTime` 헬퍼 | **이식** | 小~中 | 極小 | **中** | `core/util.js` |
| 5 | 체비셰프 다항식 셰이퍼 → 익사이터 | **이식** | 小~中 | 小 | 低 | `audio/graph.js` |
| 6 | `Tone.MidSideCompressor` / `MultibandCompressor` 마스터단 | 그대로 사용 | 中 | 中 | **高** | `audio/graph.js` | 
| — | 나머지 전부 | **채택 안 함** | — | — | — | §3 참조 |

> 4번의 위험이 "中" 인 이유: 엔벨로프 모양을 바꾸면 `tools/measure-*.html` 로 잡아 둔
> 수치들이 전부 다시 움직입니다. `ARCHITECTURE.md` 대로 하네스도 같이 고쳐야 합니다.
> 6번의 위험이 "高" 인 이유: 마스터 체인은 `-7.9 LUFS` 사고 이후 트림까지 실측으로
> 맞춰 놓은 곳입니다. 여기를 건드리면 전 프리셋의 라우드니스가 다시 움직입니다.

---

## 2. 채택 후보 상세

### ★1. `Tone.Phaser` · `Tone.AutoWah` · `Tone.Chorus` — 라이브러리를 그대로 붙인다

**무엇을**

우리에게 **통째로 없는** 세 가지 이펙트입니다. 그런데 Tone.js 는 이미 로드돼 있고,
셋 다 **AudioWorklet 을 안 쓰는 순수 네이티브 노드 조합**이라 `file://` 에서도 안전합니다.

| | Tone.js 소스 | 구조 | 우리에게 있나 |
|---|---|---|---|
| Phaser | `Tone/effect/Phaser.ts:137-149` `_makeFilters()` | `allpass` 바이쿼드 10단 × 2(L/R) + LFO 2개(위상 180°) | **없음** |
| AutoWah | `Tone/effect/AutoWah.ts:126-130` | `Abs → OnePoleFilter`(=Follower) 로 포락선 추종 → `ScaleExp(exponent 0.5)` → 밴드패스(rolloff −48) + peaking 의 `frequency` 동시 구동 | **없음** |
| Chorus | `Tone/effect/Chorus.ts:100-108` | Delay L/R + LFO 2개(min/max 를 `delayTime±delayTime·depth` 로) + 피드백 | 건반 버스에만 자작(`graph.js:262-273`), **기타 버스엔 없음** |

**Tone.js 어느 부분인지 (기본값도 소스확인)**

- `Phaser.getDefaults()` — `Phaser.ts:127-135` : `frequency 0.5, octaves 3, stages 10, Q 10, baseFrequency 350`
- `AutoWah.getDefaults()` — `AutoWah.ts:138-147` : `baseFrequency 100, octaves 6, sensitivity 0, Q 2, gain 2, follower 0.2`
- `Chorus.getDefaults()` — `Chorus.ts:116-126` : `frequency 1.5, delayTime 3.5ms, depth 0.7, spread 180, feedback 0, wet 0.5`

**우리 어느 파일 어느 함수에**

- `audio/graph.js` `boot()` 안, 기타 앰프 체인(`ampIn.*` 이 `chan.gtr` 로 들어가는 지점)과
  `chan.keys` 코러스 블록(`graph.js:261-273`) 옆. 버스 단위로 **한 번만** 만들어 상시 연결합니다.
  기타 앰프 체인을 이미 그렇게 짜 두었고("노트마다 만들면 보이스당 15노드"), 같은 원칙입니다.
- 연결은 기존 `link()`(`core/util.js:21`)가 그대로 처리합니다. `masterGain → limComp`,
  `rumble → glueComp` 가 이미 네이티브↔Tone 을 넘나들고 있으므로 새 패턴이 아닙니다.
  **실측**으로 `Tone.connect(네이티브 GainNode, new Tone.Phaser())` 가 되는 것을 확인했습니다.
- 켜고 끄는 스위치는 `core/engines.js` 의 `GTR` / `KENG` 표에 `fx:'wah'` 같은 필드를 얹는 쪽이
  UI 노브를 새로 파는 것보다 쌉니다. 장르가 곧 이펙트를 정하기 때문입니다
  (펑크 클라비=와, 사이키델릭 기타=페이저, 서프/스카 클린=코러스).

**기대 효과**

장르 정체성을 만드는 질감인데 지금 하나도 없습니다. 펑크·디스코의 와, 사이키델릭 록·
70년대 로즈의 페이저, 서프·스카·80년대 클린 기타의 코러스. `genre-reference.md` 계열이
넓은 만큼 체감이 큽니다. **새 DSP 를 한 줄도 안 쓰고 얻습니다.**

**예상 위험 — 반드시 아래 셋을 지킬 것 (전부 실측으로 확인한 함정입니다)**

1. **`Tone.Chorus` 는 생성자가 LFO 를 안 켭니다.** `.start()` 를 부르지 않으면 LFO 가
   `stopped` 상태로 남아 코러스가 아니라 **고정 딜레이(콤 필터 착색)** 가 됩니다.
   `Chorus.ts:183-187` 에 `start()` 가 따로 있고, 실측에서
   `생성 직후 _lfoL.state === "stopped"`, `.start()` 후 `"started"` 를 확인했습니다.
   *(대조: `Tone.Phaser` 는 생성자 안에서 `this._lfoL.start()` 를 부릅니다 — `Phaser.ts:121-122`.)*
2. **`Tone.Phaser` 의 기본 `wet` 은 1 이고, 그러면 효과가 거의 안 납니다.**
   올패스 필터는 진폭응답이 평탄해서, 노치는 **드라이와 섞일 때만** 생깁니다.
   화이트 노이즈를 통과시켜 200Hz~2.8kHz 를 재보니 —
   `wet=1.0` 스펙트럼 편차 **9.5 dB**, `wet=0.5` 편차 **18.1 dB**. 노치 깊이가 약 2배입니다.
   → **반드시 `wet ≈ 0.5` 로 두세요.** (`AutoWah` 도 기본 `wet=1`, `Chorus` 만 기본 0.5)
3. 셋 다 `StereoEffect` 계열이라 내부에서 `Split`/`Merge` 로 2채널을 씁니다.
   `chan.gtr` 이후 `panner.gtr` 앞에 넣어야 팬이 안 무너집니다.

**난이도** 하 (노드 생성·배선 30줄 남짓 + 엔진표 필드 1개)

---

### ★2. 핑크 노이즈 버스 — 이식

**무엇을**

우리 `noiseBus`(`graph.js:127-134`)는 **화이트 노이즈 하나뿐**입니다. 그런데 화이트를
넓은 대역으로 통과시키면 옥타브당 +3dB 로 기울어져, 실물보다 항상 더 쨍합니다.
Tone.js 는 핑크·브라운 버퍼를 이미 갖고 있습니다.

**Tone.js 어느 부분**

`Tone/source/Noise.ts:247-271`, `_noiseBuffers.pink` 게터.
Paul Kellett 식 7탭 IIR 근사입니다(원 출처는 주석에 `zacharydenton/noise.js`, MIT 로 명시).

```js
b0 = 0.99886*b0 + white*0.0555179;   b1 = 0.99332*b1 + white*0.0750759;
b2 = 0.96900*b2 + white*0.1538520;   b3 = 0.86650*b3 + white*0.3104856;
b4 = 0.55000*b4 + white*0.5329522;   b5 = -0.7616*b5 - white*0.0168980;
out = (b0+b1+b2+b3+b4+b5+b6 + white*0.5362) * 0.11;   b6 = white*0.115926;
```

버퍼 길이 `44100*5`, 2채널 (`Noise.ts:203-204`). 브라운은 `Noise.ts:228-245`
(`(lastOut + 0.02*white)/1.02`, 게인 보정 ×3.5).

**우리 어느 파일 어느 함수에**

- `audio/graph.js` `boot()` 의 `── 상시 구동 소스: 화이트 노이즈 ──` 블록(`graph.js:127-134`)
  바로 아래에 `pinkBus` 를 하나 더 만듭니다. 이미 4초짜리 루프 버퍼를 굽는 자리라
  **같은 방식으로 한 개 더 굽는 것**입니다.
- `core/util.js` 의 `tapNoise()`(`util.js:153-156`) 옆에 `tapPink()` 를 같은 모양으로 추가.
- 쓰는 쪽은 **옵트인**으로 하나씩만 바꿉니다:
  - `voice-drum.js` `snare()` 의 `brush` — hp 900 / lp 5200 으로 대역이 아주 넓어(`voice-drum.js:248`)
    화이트/핑크 차이가 가장 크게 드러나는 곳입니다. 브러시는 "치익" 이 정체성입니다.
  - `voice-drum.js` `perc()` 의 `shaker` · `cabasa` · `guiro`
  - `voice-bass.js` `windBass()` 의 숨소리(`bf` 밴드패스, `voice-bass.js:86-87`)
  - `voice-keys.js` `E.click` 의 플럭 어택

**기대 효과** 넓은 대역 노이즈를 쓰는 보이스가 실물에 가까워집니다.
`tools/measure-voices.html` 의 스펙트럼 중심(centroid)으로 바로 검증 가능합니다.

**예상 위험** 낮음. 핑크는 화이트보다 RMS 가 낮으므로 **바꾼 보이스의 amp 를 재조정**해야
합니다(`Noise.ts` 도 `*0.11` 로 게인 보정을 합니다). 좁은 Q 밴드패스로 때리는 곳
(clave, agogo, iron 같은 `S.tone` 계열)은 **바꿔도 차이가 없으니 건드리지 마세요** —
좁은 대역 안에서는 화이트나 핑크나 거의 같습니다.

**난이도** 하 (20줄)

---

### ★3. MetalSynth 식 FM 메탈 버스 — 이식

**무엇을**

우리 `metalBus`(`graph.js:136-146`)는 **평범한 사각파 6개**를 하이패스+밴드패스에 통과시킵니다.
Tone.MetalSynth 는 **FM 오실레이터 6개**(반송·변조 둘 다 square, `harmonicity 5.1`,
`modulationIndex 32`)를 씁니다. FM 인덱스 32 면 오실레이터 하나가 이미 수십 개의
측대역을 만들므로, 6개면 **부분음 수가 자릿수 단위로 늘어납니다.**

또 하나 — MetalSynth 는 **엔벨로프를 하이패스 컷오프에 같이 연결**해서, 소리가 잦아드는 동안
하이패스가 `resonance` 에서 `resonance × 2^octaves` 까지 훑고 내려옵니다. 이게 심벌의
"쨍 → 쉬" 로 변하는 성질을 만듭니다. 우리 `hat()` 은 `metalBP` 의 중심만 튠에 따라 옮길 뿐
스윕이 없습니다(`voice-drum.js:306-308`).

**Tone.js 어느 부분**

- `Tone/instrument/MetalSynth.ts:26` — `inharmRatios = [1.0, 1.483, 1.932, 2.546, 2.630, 3.897]`
  출처가 주석에 명시돼 있습니다: CCRMA 의 TR-808 심벌 물리모델 논문.
- `MetalSynth.ts:115-133` — 오실레이터 6개 생성 + `Multiply` 로 비율 곱
- `MetalSynth.ts:136-152` — `Scale(min=resonance, max=7000)` 을 거쳐 엔벨로프를 `highpass.frequency` 로
- `MetalSynth.ts:166-172` — 기본값 `harmonicity 5.1, modulationIndex 32, octaves 1.5, resonance 4000`

**우리 비율과 다릅니다.** 우리는 `RATIOS=[2,3,4.16,5.43,6.79,8.21]`(=기음 대비 1, 1.5, 2.08,
2.715, 3.395, 4.105). Tone 은 `[1, 1.483, 1.932, 2.546, 2.630, 3.897]`. **어느 쪽이 맞는지는
귀가 아니라 측정으로 정하세요** — `tools/measure-voices.html` 로 실물 909/808 하이햇의
스펙트럼과 대조하는 것이 `ARCHITECTURE.md` 의 규칙입니다.

**우리 어느 파일 어느 함수에**

- `audio/graph.js` `boot()` 의 `── 상시 구동 소스: 909식 6-오실레이터 메탈 ──` 블록.
  FM 으로 바꾸려면 오실레이터가 12개(반송 6 + 변조 6)가 되지만, **상시 구동 1세트**라
  보이스당 비용은 0 입니다. 지금 구조 그대로입니다.
- `audio/voice-drum.js` `hat()` 의 `e==='metal'` 분기. 여기서 `metalBP` 대신 **노트마다
  `BQ('highpass', …)` 를 하나 만들어 엔벨로프 스윕**을 겁니다. `hat()` 은 이미 `BQ()` 로
  노트별 필터를 만들고 있으니(`noise`/`tick` 분기) 같은 패턴입니다.

**기대 효과** `chat`/`ohat` 두 트랙이 쓰는 `metal` 엔진이 우리 드럼에서 가장 얇은 곳입니다.
사각파 6개는 부분음이 성기어 "삐" 에 가깝고, 실물 심벌의 밀도가 안 납니다.

**예상 위험**
- 상시 구동 오실레이터가 6→12개. 측정된 CPU 영향은 미미할 것으로 보이나 **미확인** —
  적용 시 `liveNodes` 와 함께 확인하세요.
- `metalBP` 를 노트별 필터로 옮기면 `tapMetal()`(`util.js:157-160`)의 연결 지점이 바뀝니다.
  `retire` 로 떼는 순서를 지켜야 합니다.
- **`tools/measure-voices.html` 도 같이 고쳐야 합니다** (`ARCHITECTURE.md` 「주의」).

**난이도** 중

---

### 4. `exponentialApproachValueAtTime` — 이식

**무엇을**

"지수 모양으로 감쇠하되 **정해진 시각에 정확히 목표값에 도달**하는" AudioParam 헬퍼입니다.
Web Audio 의 `exponentialRampToValueAtTime` 은 0 에 못 가고, `setTargetAtTime` 은 영원히
목표에 도달하지 않습니다. Tone.js 는 둘을 이어 붙여 해결합니다.

**Tone.js 어느 부분** — `Tone/core/context/Param.ts:360-369`

```js
exponentialApproachValueAtTime(value, time, rampTime) {
  const timeConstant = Math.log(rampTime + 1) / Math.log(200);
  this.setTargetAtTime(value, time, timeConstant);
  this.cancelAndHoldAtTime(time + rampTime * 0.9);   // 90% 지점에서 끊고
  this.linearRampToValueAtTime(value, time + rampTime);  // 선형으로 마무리
}
```
`Param.ts:353-358` 의 `targetRampTo()` 가 이걸 감싸고, `Envelope.triggerAttack/Release`
(`Envelope.ts` 의 `_decayCurve === "exponential"` 경로)가 이걸 씁니다.

**우리 어느 파일 어느 함수에** — `core/util.js`

우리는 같은 문제를 이미 **손으로** 풀고 있는데, 상수가 자리마다 다릅니다.

- `adsr()` (`voice-keys.js:35-45`) : `setTargetAtTime(…, D/3)` 후 `linearRampToValueAtTime(0, off+R*1.6)`
- `env()` (`util.js:130-135`) : `exponentialRampToValueAtTime(max(peak*0.0008,1e-5), …)` 후 선형 0
- `env2()` (`util.js:137-143`) : 같은 방식 2단
- `windBass()`·`struckVoice()` 릴리스 : `setTargetAtTime(0, t+dur, rel/3)`

`/3` 은 3 시상수 = 95% 도달, Tone 의 `ln(rampTime+1)/ln(200)` 은 rampTime 에 따라 5~7 시상수
= 99.5% 이상 도달입니다. Tone 쪽이 "적어 둔 시간에 실제로 끝난다" 는 성질이 더 정확합니다.

**기대 효과** 감쇠 꼬리가 문서대로 끝납니다. `env()` 의 `peak*0.0008` 바닥값(−62dB)에서
선형으로 꺾이는 지점의 미세한 꺾임이 사라집니다.

**예상 위험 — 이 항목이 위험이 제일 큽니다.**
모든 보이스의 엔벨로프 모양이 동시에 바뀝니다. `tools/measure-voices.html` ·
`measure-tonal.html` 의 기준값이 전부 다시 움직이고, 하네스도 같이 고쳐야 합니다.
**한 번에 다 바꾸지 말고 헬퍼만 먼저 넣고 한 함수씩 갈아타면서 매번 측정하세요.**
`hold()`(`util.js:116-119`)가 이미 `cancelAndHoldAtTime` 폴백을 갖고 있으므로 재활용됩니다.

**난이도** 코드는 하(6줄), 검증은 중

---

### 5. 체비셰프 다항식 셰이퍼 → 익사이터

**무엇을**

`mkCurve(k) = tanh(kx)/tanh(k)` 는 **홀함수라 홀수 배음만** 만듭니다(2·4·6배음 없음).
체비셰프 T_n 은 사인 입력에 대해 **정확히 n번째 배음 하나만** 만들어 냅니다.

**Tone.js 어느 부분** — `Tone/effect/Chebyshev.ts:73-84` `_getCoefficient()`
(재귀 점화식 `T_n = 2x·T_{n-1} − T_{n-2}`, `Map` 으로 메모이즈), `Chebyshev.ts:99-104` `set order`.
WaveShaper 길이 4096.

**우리 어느 파일 어느 함수에** — `audio/graph.js` `boot()` 의 `병렬 2: 익사이터` 블록
(`graph.js:72-81`). 지금 `esh = CURVES[2]`(tanh k=2.8) 를 쓰고 있어, 150Hz 이하를 왜곡해서
190Hz 위로 되돌리는 성분이 **3·5·7배음(홀수)** 위주입니다. 저역 익사이터는 보통
**2배음(옥타브 위)** 이 가장 자연스럽게 "무게" 로 들립니다.
`mkCurve` 옆에 `mkCheby(order)` 를 하나 더 두고 `CURVES` 와 나란히 굽습니다.

**기대 효과** `harm` 노브가 만드는 배음의 성격이 정돈됩니다. 지금은 tanh 가 만든 홀수 배음
덩어리가 190Hz 하이패스 2단 뒤에 남는 형태라 "지저분한 밝기" 에 가깝습니다.

**예상 위험** 체비셰프는 **입력 진폭이 |x|>1 이면 발산**합니다(다항식이라 소프트클리핑이
아닙니다). 앞단 `epre.gain = 2.4`(`graph.js:74`)가 그대로면 넘칩니다 — **셰이퍼 앞에
리미터나 tanh 한 겹을 반드시 두세요.** T_2 와 T_3 을 섞을 거면 각각 별도 셰이퍼가 필요합니다
(하나의 커브에 섞으면 상호변조가 생깁니다).

**난이도** 하~중

---

### 6. (보류) `Tone.MidSideCompressor` / `MultibandCompressor`

**무엇을 / 어디** — `Tone/component/dynamics/MidSideCompressor.ts:78-94`,
`MultibandCompressor.ts:97-121`. 둘 다 `Tone.Compressor` 를 조합한 것뿐이고
기본값까지 소스에 있습니다(멀티밴드: `lowFrequency 250 / highFrequency 2000`,
low `ratio 6 · thr −30 · atk 0.03 · rel 0.25 · knee 10`, mid/high `ratio 3 · thr −24 · knee 16`).
`번들확인` 완료 — 14.7.77 에 들어 있습니다.

**왜 보류인가** — 우리 마스터 체인(`graph.js:61-88`)은 이미 글루 컴프 + 리미터 + 새추레이션 +
저역 병렬 새추 + 익사이터로 촘촘하고, `-7.9 LUFS` 사고 이후 트림까지 실측으로 맞춰 놓았습니다.
여기를 멀티밴드로 갈아엎으면 **전 프리셋의 라우드니스·트루피크를 다시 다 재야 합니다.**
효과는 있겠지만 지금 시점의 비용이 너무 큽니다. 다른 것들이 끝난 뒤에 다루세요.

---

## 3. 채택하지 않기로 한 것 — 같은 조사를 반복하지 않기 위해

| 대상 | 판정 | 이유 (근거) |
|---|---|---|
| **`Tone.PluckSynth`** | ❌ **우리가 더 정교** | `PluckSynth.ts:60-116` 전체가 **핑크노이즈 → LowpassCombFilter**, 끝입니다. `triggerAttack` 은 `delayTime = 1/freq` 를 넣을 뿐. 우리 `ksInto()` 에 있는 분수지연 올패스 보간·β 사각속도파 여기·픽업 콤·자와리·복현·공명현·피크 정규화가 **하나도 없습니다.** 게다가 아래 워크릿 문제까지 있습니다. |
| **`Tone.FeedbackCombFilter`(라이브 KS)** | ❌ **정확도 미달** | 우리 `string.js` 머리주석의 "라이브 DelayNode 로는 못 만든다(128샘플)" 를 Tone 은 AudioWorklet 으로 우회합니다. 솔깃하지만 — 워크릿 내부가 **`Math.floor(delay)` 정수 지연**입니다(`Tone/core/worklet/DelayLine.worklet.ts` `get()`). 분수지연 보간이 없어 **음정이 틀어집니다.** 우리는 1차 올패스로 보간하고 있어 이미 더 정확합니다. |
| **`Tone.Freeverb` / `Tone.JCReverb`** | ❌ **`file://` 위험 + 우리가 더 나음** | ① 둘 다 워크릿 기반(`FeedbackCombFilter` 경유)이고, `Tone/core/worklet/ToneAudioWorklet.ts:49-63` 에 **폴백 경로가 없습니다** — `addAudioWorkletModule` 이 실패하면 `onReady` 가 안 불려 입출력이 연결되지 않고 **그냥 무음**이 됩니다. 우리는 `file://` 더블클릭 실행을 지켜야 합니다(`ARCHITECTURE.md`). 워크릿은 `blob:` URL 로 등록되는데(`번들확인`: `createObjectURL` 6곳, `audioWorklet` 13곳), `file://` 의 opaque origin 에서 되는지 **미확인**입니다(Playwright 가 `file:` 을 막아 실측 실패). ② Tone 자체 문서가 `Freeverb.ts:30`·`JCReverb.ts:36` 에서 "성능 저하가 있으니 `Reverb` 를 쓰라" 고 적어 두었습니다. ③ 우리 컨볼버 IR(`util.js:61-72` `makeIR`)은 네이티브라 CPU 가 싸고 room/plate/hall 3종이 이미 있습니다. <br>*(참고용 상수만 기록: Freeverb 콤 `[1557,1617,1491,1422,1277,1356,1188,1116]/44100`, 올패스 `[225,556,441,341]` — `Freeverb.ts:18-24`. JCReverb 콤 `[1687,1601,2053,2251]/25000`, 레조넌스 `[0.773,0.802,0.753,0.733]`, 올패스 `[347,113,37]` — `JCReverb.ts:19-29`.)* |
| **`Tone.Reverb`** | ❌ **이미 동등** | `Reverb.ts:129-150` 은 OfflineContext 에 노이즈를 지수감쇠시켜 IR 을 굽는 것 = 우리 `makeIR()` 과 같은 발상. 오히려 **우리 쪽에 댐핑(`lp+=(w-lp)*damp`)과 프리딜레이 스테레오 분리가 더 있습니다**(`graph.js:96-100`). 가져올 게 없습니다. |
| **`Tone.Distortion`** | ❌ **우리가 더 나음** | `Distortion.ts:88-97` 의 커브는 `(3+k)x·20·deg/(π+k|x|)` (StackOverflow 유래). 우리 `mkCurve` 는 `tanh(kx)/tanh(k)` — 진공관에 더 가깝고, 우리는 `CURVE_GAIN` 으로 **커브 전환 시 레벨 점프까지 보정**하고 있습니다(`util.js:50-52`). 게다가 `graph.js` 의 앰프는 2단 캐스케이드(비대칭→대칭)에 단간 필터까지 있어 차원이 다릅니다. |
| **`Tone.MembraneSynth`** | ❌ **이미 있고 더 두꺼움** | `MembraneSynth.setNote()` (`MembraneSynth.ts:85-92`) = 오실레이터 1개를 `hz*octaves` 에서 `hz` 로 지수 램프. 우리 `kick()` 은 서브+바디(새추레이션)+어택+클릭 4층에 튠·SUB·PUNCH 노브까지 물려 있습니다. |
| **`Tone.FMSynth` / `AMSynth` / `MonoSynth`** | ❌ **이미 있음** | 우리 `KENG` 의 `E.fm` 표(`voice-keys.js:163-176`)가 이미 다중 오퍼레이터 FM 을 벨로시티→인덱스 매핑까지 해서 돌립니다. 그리고 `struck.js` 머리주석이 **왜 FM 으로 피아노를 만들면 안 되는지**(A3 에서 H8 부터 −∞) 측정으로 못 박아 두었습니다. |
| **`Tone.Sampler`** | ❌ **이미 사용 중** | `audio/sampler.js:114-118` `loadSampler()` 에서 이미 씁니다. |
| **`Tone.StereoWidener`** | ❌ **이미 사용 중** | `graph.js:49`. 다만 §4 의 부수 발견을 보세요. |
| **`Tone.Limiter`** | ❌ **동등** | `Limiter.ts:57-63` = `Compressor({ratio:20, attack:0, release:0})`. 우리 `limComp` 는 `ratio 16 · attack 0.004` 에 `lthr`/`lrel` 노브까지 붙어 있습니다. 사실상 같은 것이고 우리 쪽이 조절 가능합니다. |
| **`Tone.EQ3`** | ❌ **우리가 더 정밀** | `EQ3.ts:120-123` 은 `MultibandSplit` 3대역 게인. 우리는 캐비닛·몸통을 `peaking` 여러 개로 **주파수·Q·dB 를 직접** 잡습니다(`graph.js:167-259`, `voice-keys.js:72-103`). 3밴드로 내려갈 이유가 없습니다. |
| **`Tone.Filter` 의 `rolloff` 캐스케이드** | ❌ **우리가 더 정확** | `Filter.ts:140-152` 는 **같은 Q 의 필터를 그냥 직렬로** 겁니다 → 최대평탄이 아닙니다. 우리 `lp24()`(`voice-keys.js:49-54`)는 4차 버터워스 Q 스태거 `0.5412 / 1.3066` 를 쓰고 `Q_DB` 로 dB 변환까지 합니다. **명백히 우리 쪽이 맞습니다.** |
| **`Tone.OnePoleFilter`** | ❌ **효용 낮음** | `OnePoleFilter.ts:79-93` — `createIIRFilter` 로 6dB/oct. 쓸 데가 `Follower` 정도인데 우리는 포락선 추종이 필요 없습니다(아래). |
| **`Tone.Follower`(포락선 추종 사이드체인)** | ❌ **불필요** | `Follower.ts:47-53` = `Abs → OnePoleFilter`. 킥 신호로 실제 덕킹을 걸 수 있지만, 우리 `duckSidechain()`(`voice-drum.js:61-70`)은 **킥이 언제 칠지 이미 알고** 스케줄로 램프를 겁니다 — 더 정확하고 더 쌉니다. (`AutoWah` 안에 딸려 오는 것은 상관없습니다.) |
| **`Envelope` 의 커브 배열**(`bounce`/`ripple`/`step`/`cosine`) | ❌ **용도 없음** | `Envelope.ts:532-623`. 128포인트 `setValueCurveAtTime` 용 장식 커브입니다. 악기 사실성과 무관합니다. |
| **`Tone.Chorus` 로 건반 코러스 교체** | ❌ **유지** | 우리 Juno BBD 근사(`graph.js:262-273`)는 딜레이 2 + LFO 1 + 인버터로 정확히 180° 를 만들어 **노드가 더 적고 결과가 같습니다**(Tone 은 LFO 2개 + `spread` 각도). 건반 쪽은 그대로 두세요. **기타 버스에 새로 다는 것만** ★1 에 넣었습니다. |
| **`Tone.BitCrusher`** | ❌ **워크릿 위험** | `BitCrusher.worklet.ts` 기반이라 위 `file://` 문제를 그대로 가집니다. 우리 `lofi` 스네어는 이미 `shaperNode(2)` 로 크러시 느낌을 냅니다(`voice-drum.js:263-266`). |
| **`Tone.PitchShift` / `FrequencyShifter` / `Vibrato` / `Tremolo` / `AutoFilter` / `Gate`** | ⚠ **미확인 — 다음 조사** | 14.7.77 번들에 **존재하는 것만 확인**했고(`번들확인`) **소스는 안 읽었습니다.** 추측으로 쓰지 마세요. 그중 `Tremolo`(서프 기타·로즈)와 `AutoFilter`(하우스·디스코 필터 스윕)는 우리에게 없는 것이라 ★1 과 같은 이유로 **다음 순번 후보**입니다. |

---

## 4. 부수 발견 — Tone.js 소스를 보다가 걸린 우리 쪽 사항

이건 "차용" 이 아니라 조사 중에 드러난 것들입니다. 이 문서 범위 밖이라 고치지 않았습니다.

1. **`Q_DB` 판단이 옳았다는 방증.** `Tone/instrument/MetalSynth.ts:107` 에 주석 처리된 채로
   `// Q: -3.0102999566398125,` 가 남아 있습니다. 이 값이 정확히 `20·log10(1/√2)` —
   우리 `util.js:47` 의 `Q_BUTTER` 와 같은 수입니다. Tone 개발자도 lowpass/highpass 의 Q 가
   dB 라는 걸 알고 있었다는 뜻입니다. **우리 측정이 맞았습니다.**

2. **`applyRevWidth()` 의 Tone 경로는 중립을 못 넘습니다.** `Tone.StereoWidener` 는
   `mid × 2(1−width)`, `side × 2·width` (`StereoWidener.ts` 생성자) 라 **`width=0.5` 가 중립**입니다.
   그런데 `params.js:21` 이 `widener.width.value = Math.min(1, w*0.5)` 로 두어, `rwid` 노브를
   끝까지 올려도 `width` 가 0.5(중립) 까지만 갑니다. 네이티브 폴백(`nativeWidener`)도
   `w=1` 에서 중립이라 **두 경로는 서로 일치**합니다 — 즉 버그는 아니고 **의도된 "모노↔중립"
   범위**입니다. 다만 `graph.js:49` 의 생성자 인자 `new Tone.StereoWidener(0.65)` 는
   `boot()` 끝의 `applyRevWidth()` 가 곧바로 덮어쓰므로 **아무 의미가 없습니다.**
   중립보다 넓히고 싶다면 Tone 경로는 `width` 를 1.0 까지 쓸 수 있습니다.

3. **`makeIR` 의 댐핑이 시간에 대해 고정입니다** (`util.js:66-69`, `lp+=(w-lp)*damp`).
   실제 공간은 시간이 갈수록 고역이 더 빨리 흡수돼 어두워집니다. `damp` 를 `t` 에 따라
   줄이면 한 줄로 더 그럴듯해집니다. **이건 Tone.js 아이디어가 아니라 우리 것입니다** —
   Tone 의 `Reverb` 에는 댐핑 자체가 없습니다.

---

## 5. 라이선스

**Tone.js 는 MIT 입니다.** 저작권자는 Yotam Mann (© 2014-2024).

### 그대로 사용할 때 (★1, 6번)

`Tone.Phaser` 등을 `new` 해서 쓰는 것은 **라이브러리 사용**이지 코드 복제가 아닙니다.
CDN `<script src>` 로 로드 중이므로 **추가 표기 의무는 사실상 없습니다.**
(MIT 는 "Software 의 실질적 부분 복제·배포" 시 고지를 요구합니다. 미수정 배포판을
CDN 에서 링크만 하는 것은 여기 해당하지 않습니다.)

### 코드를 베껴 올 때 (★2 핑크노이즈, ★3 비조화비, 4번 지수접근, 5번 체비셰프)

**이쪽은 고지가 필요합니다.** 함수 바로 위 주석에 아래 형식으로 남기세요.

```js
/* 핑크 노이즈 — Tone.js 의 Tone/source/Noise.ts (_noiseBuffers.pink) 에서 가져왔습니다.
   Tone.js (c) Yotam Mann, MIT License — https://github.com/Tonejs/Tone.js
   원 출처는 Tone.js 주석에 적힌 zacharydenton/noise.js (c) 2013 Zach Denton, MIT.
   Paul Kellett 식 7탭 IIR 근사. */
```

몇 가지 주의:

- **핑크/브라운 노이즈는 이중 고지**가 맞습니다. Tone.js 소스가 스스로
  `borrowed heavily from https://github.com/zacharydenton/noise.js (c) 2013 Zach Denton (MIT)`
  라고 적어 두었습니다(`Noise.ts:220-224`).
- **MetalSynth 의 `inharmRatios` 는 상수 6개** 입니다. 사실 데이터라 저작권 대상이 아닐
  가능성이 높지만, 출처(CCRMA TR-808 심벌 논문)를 적어 두는 편이 나중에 값을 검증할 때
  유용합니다. `MetalSynth.ts:22-26` 에 논문 링크가 있습니다.
- **`Distortion` 커브(StackOverflow 유래)와 `Chorus`(Tuna.js 참조)는 채택 안 함**이라
  고지할 일이 없습니다. 혹시 나중에 가져온다면 Tone.js 주석에 적힌 원 출처까지 따라가세요.
- 프로젝트에 `THIRD-PARTY.md` 나 그에 준하는 파일이 아직 없습니다. 베껴 온 조각이
  두 개를 넘어가면 그때 하나 만드는 편이 주석을 여기저기 흩뿌리는 것보다 낫습니다.

### 전문

```
The MIT License (MIT)
Copyright (c) 2014-2024 Yotam Mann
```
(전문: https://github.com/Tonejs/Tone.js/blob/dev/LICENSE.md)

---

## 6. 다음에 이어서 볼 것

1. `Tone.Tremolo` · `Tone.AutoFilter` · `Tone.Vibrato` 소스 (우리에게 없는 이펙트, ★1 과 같은 논리)
2. **`file://` 에서 Tone.js 워크릿(blob) 이 실제로 뜨는지 실측.** Playwright MCP 가
   `file:` 프로토콜을 막아 이번에 못 했습니다. 실제 브라우저로 `pulse16-mk16.html` 을
   더블클릭해 열고 콘솔에서 `new Tone.Freeverb()` 를 만든 뒤 1초 후
   `._combFilters[0]._combFilter._worklet` 이 `undefined` 인지 보면 됩니다.
   `undefined` 면 워크릿 계열은 우리 배포 형태에서 전부 못 씁니다 — §3 의 판정이 확정됩니다.
3. Tone.js 밖: `webaudio-tinysynth`, sfz/SoundFont 계열, Freeverb/Schroeder 원 논문.
   이번에는 **전혀 안 봤습니다.** 다만 우리가 이미 오프라인 렌더+캐시 구조를 갖고 있어,
   sfz/SoundFont 쪽은 "샘플을 받아 쓸 것인가" 라는 다른 질문에 가깝습니다
   (`sampler.js` 가 이미 Salamander 피아노를 그렇게 씁니다).
