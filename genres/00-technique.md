# 주법 사전 — 같은 악기의 다른 연주법 36종

프리셋 357종이 가장 많이 쓰는 악기는 몇 개 안 됩니다 — `gtr/clean` 457회 ·
`chat/noise` 214 · `ohat/noise` 223 · `snare/body` 181 · `bass/finger` 86 ·
`keys/organ` 64 · `ep` 46 · `piano` 41. 그런데 이 악기들은 **악기가 하나인데
연주법이 여럿**입니다. 같은 클린 기타라도 펑크 커팅과 12프렛 하모닉스는
전혀 다른 소리이고, 같은 스네어라도 플램과 한 타는 다른 사건입니다.

그래서 엔진을 36종 더 얹었습니다(186 → 222). «다른 악기» 가 아니라
**같은 악기의 다른 손짓**입니다.

---

## 1. 어떻게 만들었나 — 원 악기를 펼친다

`src/core/engines.js` 의 주법 항목은 원 악기를 **펼쳐서(`{...GTR.clean, …}`)**
만듭니다. 같은 파일의 `wah`·`phase` 가 `clean` 을 **복사해 따로 적은** 것과
반대 결정입니다.

| | 왜 |
|---|---|
| `wah`·`phase` — 복사 | «다른 음색» 이라 원본과 떨어져 있어야 한다 |
| 주법 36종 — 펼치기 | «같은 악기의 다른 연주법» 이라 **원 악기를 고치면 같이 바뀌어야** 한다 |

새 필드는 **있는 엔진에서만** 코드가 돕니다. 필드가 없는 기존 엔진은 신호
경로가 한 노드도 안 달라지므로 소리가 그대로입니다.

| 필드 | 하는 일 |
|---|---|
| `shift` | 실제로 울리는 음을 반음만큼 올린다 — 12프렛 하모닉스는 `+12` |
| `bend [st,s]` | `st` 반음 아래에서 출발해 `s` 초에 걸쳐 제 음으로. 손가락이 미는 것이라 처음이 빠르고 끝이 느리다(`setTargetAtTime`) |
| `gliss [st,s]` | 같은 출발이지만 음정이 일정한 속도로 오른다 — 프렛을 미끄러지는 슬라이드 |
| `chAmp` | 코드 각 줄의 세기(없으면 `0.88^줄번호`). 피킹 하모닉스는 기음을 0.22 로 죽인다 |
| `rolls`·`rollGap`·`rollDecay` | 같은 코드를 `rollGap` 초 간격으로 다시 친다 — 라스게아도·트레몰로 |
| `trem {hz,depth,pan}` | 음량을 LFO 로 흔든다. `pan` 이 있으면 좌우도 같은 LFO 가 돌린다(레슬리) |
| `perc [반음,게인,감쇠]` | 건반을 누른 순간 한 번 울리고 사라지는 배음 — 해먼드 퍼커션 |
| `glide` | 앞 음에서 미끄러져 온다(포르타멘토). `poly:1` 이라 앞 음이 늘 하나다 |
| `flam`·`roll` | 스네어를 **몇 번, 언제** 치는가. 한 번 치는 소리는 원 악기 그대로 두고 여러 번 부른다 |
| `dAbs` | 트랙이 정하는 길이 대신 절대 초. 하프 오픈은 어느 트랙에 놓아도 하프 오픈이어야 한다 |

---

## 2. 36종이 정말 다른가 — `tools/verify-technique.html`

«들어 보면 안다» 를 기계 검사로 바꿨습니다. `engines.js` 의 주석이 주장하는
것을 그대로 수치로 옮겨 재확인합니다. **36종 전부 통과**합니다(2026-09-16).

| 주법 | 주장 | 실측 |
|---|---|---|
| `snare/rimshot` | 테를 때리는 3.4kHz «딱» 이 얹힌다 | 크랙대역/와이어대역 1.05 → **1.70** |
| `snare/flam` | 본음 24ms 앞에 약한 장식음 | body −∞ → flam **−11.1dB** |
| `snare/buzzroll` | 타점 7 · ~27ms · 갈수록 약하다 | **7타 · 평균 27ms** |
| `chat/half` | 닫힌 햇보다 길고 열린 햇보다 짧다 | chat 17 < **half 51** < ohat 110 ms |
| `ohat/half` | 트랙이 달라도 길이가 같다(`dAbs`) | chat 51 vs ohat **48ms** |
| `chat/halfmetal` | metal 보다 대역이 낮다 | 어택중심 8669 → **7922Hz** |
| `bass/thumb` | finger 보다 어둡다 | 지속중심 89 → **78Hz** |
| `bass/pop` | 어택의 «스냅» 이 slap 보다 밝다 | 어택중심 166 → **218Hz** (지속부는 되레 어둡다 — β 0.24→0.28) |
| `bass/bassharm` | 한 옥타브 위가 운다 | H2−H1 **+30.5dB** (finger +2.4) |
| `bass/pickmute` | pick 보다 짧다 | 기음 −20dB 520 → **140ms** |
| `bass/uprightslap` | upright 보다 밝다 | 지속중심 129 → **175Hz** |
| `bass/bassslide` | 4반음 아래에서 미끄러져 온다 | 초기 낮은쪽/제음 **4.60** (finger 0.49) |
| `bass/arco` | 활을 걸어야 줄이 움직인다 | 어택 41 → **89~113ms** (설계 85) |
| `gtr/harmonic` | 2f0 가 f0 를 넘는다 | H2−H1 **+39.4dB** (clean −4.1) |
| `gtr/nylonharm` | 같은 것을 나일론에서 | H2−H1 **+43.6dB** (nylon −14.3) |
| `gtr/chank` | clean 의 1/3 아래로 짧다 | 기음 −20dB 580 → **60ms** |
| `gtr/fingerpick` | 픽보다 어둡다 | 지속중심 370 → **358Hz** |
| `gtr/pinch` | 기음이 죽고 3·4배음이 산다 | H3 **+16.8dB** (hi −3.0) |
| `gtr/strum` | +7 줄이 둘째로 들어온다(설계 16ms) | +7 입장 **22ms** |
| `gtr/strumup` | 올림이라 +7 은 넷째다(설계 33ms) | +7 입장 **37ms** |
| `gtr/slidein` | 3반음 아래에서 미끄러져 온다 | 초기 낮은쪽/제음 **3.55** (clean 0.32) |
| `gtr/bend` | 온음 아래에서 밀어 올린다 | **2.12** (crunch 0.19) |
| `gtr/rasgueado` | 네 번에 나눠 친다(45ms) | 에너지 무게중심 151 → **204ms** |
| `gtr/nylontrem` | p-a-m-i 네 번(65ms) | 157 → **234ms** |
| `keys/pizz` | 켜는 스트링과 달리 곧바로 잦아든다 | −20dB 559 → **70ms** |
| `keys/staccato` | 스웰 없이 짧게 튕긴다 | 559 → **93ms** |
| `keys/epbark` | 몸통 배음(H2~H6)이 기음에 붙는다 | −45.7 → **−28.4dB** |
| `keys/pianosoft` | 배음이 더 가파르게 준다 | −18.1 → **−20.4dB/oct** |
| `keys/felt` | 더 어둡고 더 짧다 | −18.1 → **−23.0dB/oct** · 953 → 878ms |
| `keys/organperc` | 누른 순간 3배음(+19)이 한 번 운다 | 초기 +19 −27.1 → **−19.3dB** |
| `keys/tremstr` | 11Hz 로 흔들린다 | **11.00Hz** |
| `keys/leslie` | 6.6Hz | **6.60Hz** |
| `keys/eptrem` | 5.2Hz | **5.20Hz** |
| `keys/chorale` | 0.8Hz | **0.80Hz** |
| `keys/leadglide` | 둘째 음이 앞 음 높이에서 출발한다 | 220/440 세기비 **6.37** (lead 0.06) |

### 잘못 재면 멀쩡한 주법이 틀렸다고 나온다

처음 돌렸을 때 13종이 실패했는데 **전부 재는 자가 틀린 것**이었습니다.
같은 함정을 다시 밟지 않도록 적어 둡니다.

- **광대역 포락선의 −20dB 는 픽 어택이 죽는 속도**를 잽니다. `bass/pick` 이
  12ms 로 나옵니다 — 기음 성분으로 재면 520ms 입니다. 현의 길이는 반드시
  기음으로 재십시오(`_app-harness.js` 의 `hDecayAt` 주석과 같은 함정).
- **48ms 만에 죽는 닫힌 햇에 지속부 중심(0.03~0.23s)을 쓰면** 이미 신호가
  없어 꼬리를 잽니다. `chat/metal` 이 `halfmetal` 보다 어둡다고 나옵니다.
  어택 중심(0~20ms)으로 봐야 10k → 8.5k 가 보입니다.
- **스테레오 팬을 모노로 합치면 변조가 두 배로 보입니다.** L+R 이 팬의
  우함수라서입니다 — `eptrem` 5.2Hz 가 10.4Hz 로 읽혔습니다. 레슬리·수트케이스는
  한 채널만 봐야 합니다.
- **`keys/lead` 는 오실레이터 셋 중 하나가 한 옥타브 위**라, 절대 음정으로
  포르타멘토를 찾으면 미끄러져 오는 그 층이 마침 목표음(440Hz)에 서 있어
  «안 미끄러졌다» 로 읽힙니다. 미끄러지지 않는 `lead` 와 세기비를 견줘야 합니다.
- **기타 포락선에는 어느 엔진에나 27ms 안팎의 잔물결이 있어** 타점 세기로는
  롤을 못 셉니다 — plain `nylon` 도 17타로 세어집니다. 롤은 «같은 엔진에서
  `rolls` 만 뗀 것» 과 에너지 무게중심으로 견줍니다.
- **스네어는 노이즈라 어택 중심이 렌더마다 700Hz 씩 흔들립니다**(1523 ↔ 2265Hz).
  한 빈이 아니라 대역 다섯 빈을 합치고, 비교 대상과 같은 대역비로 봐야 합니다.


---

## 3. 프리셋 배정 — 84칸 · 69종 (2026-09-16)

주법을 **장르가 그 손짓을 쓴다고 문서가 말하는 자리에만** 넣었습니다.
근거 칸의 `04`·`09` 같은 숫자는 그 계열 문서(`genres/04-…` · `09-…`)이고,
숫자가 없는 줄은 그 악기의 표준 주법이라는 **관행**이 근거입니다.

이 배정은 상속이 아니라 프리셋 파일의 `kit` 를 직접 고친 것입니다
(`_build.js` 의 상속은 2026-08-17 에 끊겼습니다).

#### `chank` — Funk Chank (13칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| JB Funk | `gtr` | `clean` | 04 «클린 기타 커팅» · 레퍼런스 «클린 커팅» |
| Funk | `gtr` | `clean` | 펑크 리듬 기타의 표준 주법(16분 뮤트 촙) |
| P-Funk | `gtr` | `clean` | 같은 계보 |
| Disco Funk | `gtr` | `clean` | 00·04 레퍼런스 «커팅 기타» |
| Disco | `gtr` | `wah` | 02·04 레퍼런스 «커팅 클린 기타» — wah 는 근거가 없었다 |
| Boogie | `gtr` | `clean` | 디스코 골격의 커팅 기타 |
| Post-disco | `gtr` | `clean` | 디스코 골격의 커팅 기타 |
| Euro Disco | `gtr` | `wah` | 같은 골격 — wah 는 근거가 없었다 |
| City Pop | `gtr` | `clean` | 02 레퍼런스 «커팅 클린 기타 두 대» |
| City Pop | `gtr2` | `clean` | 02 레퍼런스 «커팅 클린 기타 두 대» |
| Future Funk | `gtr` | `clean` | 00·05 «커팅 기타» |
| Nu-disco | `gtr` | `wah` | 04 «슬랩 기타»(퍼커시브 뮤트 커팅) — wah 는 근거가 없었다 |
| Jazz-Funk | `gtr` | `clean` | 로즈·슬랩 위에 얹히는 커팅 기타 |

#### `strumup` — Strum Up (8칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Ska | `gtr` | `chorus` | 09 «기타·오르간 뒷박 스캥크» · 레퍼런스 «업비트 기타» — chorus 는 근거가 없었다 |
| Rocksteady | `gtr` | `chorus` | 09 «Reggae · 뒷박 스캥크»(상위 개념) — chorus 는 근거가 없었다 |
| Reggae One Drop | `gtr` | `chorus` | 09 «스캥크 기타» — chorus 는 근거가 없었다 |
| Roots Reggae | `gtr` | `clean` | 09 «스캥크 기타» |
| Rockers | `gtr` | `clean` | 09 원드롭 계열 — 상위 행이 뒷박 스캥크 |
| Steppers | `gtr` | `clean` | 09 원드롭 계열 — 상위 행이 뒷박 스캥크 |
| Lovers Rock | `gtr` | `clean` | 09 원드롭 계열 — 상위 행이 뒷박 스캥크 |
| Calypso | `gtr` | `clean` | 칼립소 기타도 뒷박 스트럼 |

#### `strum` — Strum Down (3칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Soft Rock | `gtr` | `clean` | 클린 6현 스트럼이 반주의 뼈대 |
| Kompa | `gtr` | `clean` | 콩파의 클린 코드 스트럼 |
| Zouk Love | `gtr` | `clean` | 주크의 클린 코드 스트럼 |

#### `fingerpick` — Fingerpicked (4칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Lo-fi | `gtr` | `clean` | 로파이 기타는 픽이 아니라 손가락 — 잡음이 적고 어둡다 |
| Chillhop | `gtr` | `clean` | 같은 이유 |
| Jazzhop | `gtr` | `clean` | 같은 이유 |
| Quiet Storm | `gtr` | `clean` | 다이내믹 폭이 좁아 픽 어택이 튀면 안 된다 |

#### `rasgueado` — Rasgueado (1칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Rumba Flamenca | `gtr2` | `nylon` | 11 «나일론 기타 두 대» — 둘째 대가 리듬(라스게아도) |

#### `bend` — Crunch Bend (2칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Texas Blues | `gtr2` | `crunch` | 블루스 리드의 온음 벤딩 |
| Southern Rock | `gtr2` | `clean` | 같은 어법 |

#### `pinch` — Pinch Harmonic (2칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Nu Metal | `gtr2` | `hi` | 그루브 메탈의 «끼익» |
| Metalcore | `gtr2` | `hi` | 같은 어법 |

#### `harmonic` — Clean Harmonics (1칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Ambient Techno | `gtr2` | `clean` | 하모닉스 텍스처 — 앰비언트의 지속 배경 |

#### `nylontrem` — Nylon Tremolo (1칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Balearic | `gtr2` | `clean` | 나일론 트레몰로가 발레아릭의 그 지속음 |

#### `nylonharm` — Nylon Harmonics (1칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Chillout | `gtr2` | `clean` | 나일론 하모닉스 텍스처 |

#### `uprightslap` — Upright Slap (2칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Rock & Roll | `bass` | `upright` | 01 «슬랩 베이스» + 레퍼런스 «업라이트» |
| Jump Blues | `bass` | `upright` | 점프 블루스 업라이트는 때려서 친다 |

#### `pop` — Slap Pop (1칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Funk | `bass` | `slap` | 슬랩의 두 손짓 중 «팝»(검지로 당겨 놓기)이 이 장르의 소리다 |

#### `thumb` — Thumb Pluck (2칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Country Pop | `bass` | `finger` | 컨트리의 엄지 주법 |
| Countrypolitan | `bass` | `finger` | 같은 계보 |

#### `pickmute` — Pick Mute (3칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Thrash Metal | `bass` | `pick` | 메탈의 픽 뮤트 8분 척 |
| Metalcore | `bass` | `pick` | 같은 어법 |
| Death Metal | `bass` | `pick` | 같은 어법 |

#### `arco` — Upright Arco (1칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Nuevo Tango | `bass` | `upright` | 피아솔라 5중주의 콘트라베이스는 활을 많이 쓴다 |

#### `leslie` — Organ Leslie Fast (6칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Gospel | `keys` | `organ` | 04 «해먼드» — 가스펠 해먼드는 레슬리를 돌린다 |
| Soul Jazz | `keys` | `organ` | 06 «해먼드 오르간» |
| Acid Jazz | `keys` | `organ` | 06 «오르간·와우 기타» — 같은 해먼드 |
| Memphis Soul | `keys2` | `organ` | 소울 해먼드 |
| Blues Rock | `keys` | `organ` | 블루스록 오르간 |
| Texas Blues | `keys` | `organ` | 같은 편성 |

#### `chorale` — Organ Leslie Slow (3칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Doom | `keys` | `organ` | 둠의 오르간은 느린 로터리(교회 오르간 쪽) |
| Sludge | `keys` | `organ` | 같은 계보 |
| Psychedelic Rock | `keys` | `organ` | 사이키델릭의 느린 로터리 |

#### `organperc` — Organ Percussion (4칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Reggae One Drop | `keys` | `organ` | 09 레퍼런스 «오르간 버블» |
| Roots Reggae | `keys` | `organ` | 같은 버블 |
| Rockers | `keys` | `organ` | 같은 버블 |
| Steppers | `keys` | `organ` | 같은 버블 |

#### `eptrem` — EP Suitcase Tremolo (5칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Trip Hop | `keys` | `ep` | 로즈의 수트케이스 오토팬 |
| Chillhop | `keys` | `ep` | 같은 로즈 |
| Vaporwave | `keys` | `ep` | 흔들리는 로즈가 이 장르의 질감 |
| Quiet Storm | `keys2` | `ep` | 같은 로즈 |
| Lo-fi | `keys2` | `ep` | 같은 로즈 |

#### `epbark` — EP Bark (2칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Jazz-Funk | `keys` | `ep` | 04 «로즈» — 세게 치면 톤바가 으르렁거린다 |
| Jazz Fusion | `keys2` | `ep` | 같은 로즈 |

#### `felt` — Felt Piano (2칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Jazzhop | `keys` | `piano` | 해머에 천을 끼운 여린 피아노 |
| Bedroom Pop | `keys2` | `piano` | 같은 피아노 |

#### `pianosoft` — Piano Una Corda (1칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Chamber Pop | `keys` | `piano` | 우나 코르다 — 실내악 규모의 여린 피아노 |

#### `pizz` — String Pizzicato (1칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Chamber Pop | `keys2` | `strings` | 챔버팝 현악의 피치카토 |

#### `staccato` — String Staccato (1칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Disco Funk | `keys2` | `strings` | 디스코 스트링의 스타카토 스탭(스트링 두 층 중 하나) |

#### `tremstr` — String Tremolo (1칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Horrorcore | `keys2` | `choir` | 긴장은 떨리는 현이 만든다 |

#### `leadglide` — Lead Glide (4칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| G-Funk | `keys` | `synclead` | 03 «얇고 높은 신스 리드(포르타멘토)» |
| Psytrance | `keys` | `lead` | 사이 리드의 포르타멘토 |
| Goa | `keys` | `lead` | 같은 어법 |
| Full-on | `keys` | `lead` | 같은 어법 |

#### `rimshot` — Open Rimshot (3칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Bluegrass | `snare` | `rim` | 07 레퍼런스 «만돌린 촙 + 림샷» |
| Reggae One Drop | `snare` | `tight` | 09 «snare = 림샷 · 킥과 동시에 3박» |
| Dembow riddim | `snare` | `tight` | 09 «스텝 3·6·11·14 림샷» |

#### `half` — Half-Open (4칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Funk | `chat` | `noise` | 펑크의 느슨한 16분 햇은 반쯤 열려 있다 |
| JB Funk | `chat` | `noise` | 같은 햇 |
| Boom Bap | `ohat` | `noise` | 붐뱁의 «치» 는 완전히 열린 햇이 아니다 |
| Golden Age | `ohat` | `noise` | 같은 햇 |

#### `halfmetal` — Half-Open Metal (2칸)

| 프리셋 | 칸 | 바꾸기 전 | 근거 |
|---|---|---|---|
| Tech House | `chat` | `metal` | 909 클로즈드가 끝까지 안 닫힌 «치» |
| Detroit Techno | `chat` | `metal` | 같은 햇 |
---

## 4. 안 넣은 6종과 그 이유

지어내지 않기 위해 적어 둡니다. 엔진은 있으니 사용자가 직접 고를 수 있습니다.

| 주법 | 왜 안 넣었나 |
|---|---|
| `snare/flam` | 장식음이 **매 타마다** 붙습니다. 그것이 맞는 편성은 행진 스네어인데, 프리셋 357종에 마칭·세컨드라인 계열이 없습니다 |
| `snare/buzzroll` | 같은 이유 — 일곱 번 튀는 롤이 매 백비트마다 오면 그건 다른 장르입니다. Honky-tonk 의 «16분 스네어 롤» 은 **패턴**이지 한 타의 음색이 아닙니다(07) |
| `ohat/halfmetal` | 909 를 반쯤 연 «치» 는 **닫힌 자리**에서만 맞았습니다. 열린 햇이 필요한 하우스·테크노는 뒷박이 끝까지 열려야 추진력이 납니다(04 «하이햇 오픈이 추진력») |
| `bass/bassharm` | 하모닉스가 **모든 음**에 걸립니다. 자코의 그 소리는 `fretless` 로 내는 곡 안의 한두 구절이지 베이스 전체가 아닙니다 |
| `bass/bassslide` | 같은 이유. 레게 베이스가 미끄러지는 자리는 있지만 그 프리셋들은 `flatwound` 를 쓰고, 슬라이드는 `finger` 를 펼쳐 만든 것이라 감김 방식을 잃습니다 |
| `gtr/slidein` | 모든 음에 3반음 글리산도가 붙습니다. 슬라이드가 정체성인 장르는 이미 `slide`·`pedal`(보틀넥·페달스틸) 을 쓰고 있습니다 |

## 5. 레벨 — 바꾸기 전후를 재서 확인했다

배정한 35쌍을 «같은 음·같은 세기로 단독 렌더» 해 견줬습니다. RMS 가 −12dB 까지
떨어지는 쌍이 있지만(`clean`→`chank`, `strings`→`staccato`) **피크는 1dB 안쪽**입니다 —
음이 **짧아져서** 생긴 값이지 작아진 것이 아닙니다. 짧은 음을 RMS 로 재면 안 됩니다.

한 쌍만 피크가 크게 움직였습니다.

- `Horrorcore` 의 `keys2` `choir` → `tremstr` — 피크 −23.7 → **−16.1dB**(+7.6).
  다만 `tremstr` 이 센 것이 아니라 **`choir` 가 유난히 조용한 엔진**입니다(병렬
  포먼트로 대역을 좁게 깎습니다). 같은 자리의 기본 엔진 `strings` 는 −14.1dB 라
  `tremstr` 이 그보다도 낮습니다. **레벨 보정을 넣지 않았습니다.**

## 6. 고치지 않고 기록만 — `keys2` 가 건반 엔진이 아닌 프리셋 12종

배정하면서 `kit` 값을 전수 검사하다 찾았습니다. 아래 12종은 `keys2` 에
**기타·베이스 엔진 이름**을 적어 두었습니다.

| 값 | 어느 표의 이름인가 | 프리셋 |
|---|---|---|
| `harp` | `gtr` (Harp) | Philadelphia Soul · Disco · Chillout |
| `dulcimer` | `gtr` (Dulcimer) | Folk Revival · Country Blues |
| `nylon` | `gtr` (Nylon) | Balearic |
| `growl` | `bass` (Growl) | Neurofunk · Brostep · Bass House · Frenchcore · Riddim · Bruxaria |

`keysVoice()` 는 `KENG[name] || KENG.pad` 로 떨어지므로 이 12종의 2번 건반은
**조용히 패드로 울립니다.** 의도한 하프·덜시머·나일론은 `gtr2` 자리에 있어야
하고, `growl` 은 건반으로 낼 수 있는 값이 아닙니다.

이번 배치에서는 **고치지 않았습니다** — 어느 칸으로 옮길지는 프리셋마다
근거가 따로 필요하고, 그것은 이 배치(주법 배정)와 다른 일이기 때문입니다.
