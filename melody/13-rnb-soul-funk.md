# D. R&B · Soul · Funk 계열 — 선율

> [../genres/04-rnb-soul-funk.md](../genres/04-rnb-soul-funk.md) 의 **D 계열**을 선율 관점에서만 다룹니다.
> 악기·음색·수치는 그쪽, 드럼 박자는 [../patterns/04-rnb-soul-funk.md](../patterns/04-rnb-soul-funk.md).
> 도수 표기는 [README.md](README.md) §2, 지표 번호 ①~⑩ 는 [02-melody-theory.md](02-melody-theory.md) §9.
> 여기 적은 키 이름은 전부 `../src/data/melody.js` 에서 확인한 것입니다.

**이 계열의 공통 제약**: 선율이 **화성이 아니라 리듬**을 만듭니다.
음의 종류는 적고 자리는 촘촘합니다. 그래서 지표 ⑤(음역)를 일부러 어깁니다
([02-melody-theory.md](02-melody-theory.md) §10 — "펑크: 두세 음으로 리듬을 침").

---

## 1. 음정 어휘

| | 값 |
|---|---|
| 기본 스케일 | **Dorian** (펑크·소울) / **Minor Pentatonic** (JB 계보) |
| 보조 | Major (가스펠·디스코) |
| 특징음 | **b3(도수 1)** · **b7(도수 4)** · **9도** — 도리안의 6도가 밝음을 만듭니다 |
| 블루노트 | 있으나 벤딩이 아니라 **b3 와 3 을 동시에** 울리는 방식 — 8도수로는 근사만 |
| 화음 | **1코드** 또는 도리안 뱀프(0·3) — 진행을 많이 넣으면 장르가 흐려집니다 ([01-harmony.md](01-harmony.md) §4) |

`PHRASE.funkA` 는 도수 **0·1·2·3**, `funkB` 는 본체가 **2·3·4·5** 입니다
(A = 낮은 층 0~3, B = 높은 층 2~5 — melody.js `PHRASE` 머리 주석).
"밀도가 가장 높은 축이지만 음의 종류는 적습니다"
([00-analysis.md](00-analysis.md) §2 D) 를 그대로 옮긴 값입니다.

가스펠만 표기가 다릅니다 — `PHRASE.gosA` 는 `'0-------2---1---'` 로
**단음이 아니라 3화음**(숫자 표기)입니다. 피아노가 코드로 화답하는 편성이라
그렇습니다.

---

## 2. 리듬 어휘

| | 값 |
|---|---|
| 기본 단위 | **16분** — 이 계열만 16분이 기본입니다 |
| 밀도 | 마디당 6음 안팎 (목표 7~11, 실측 5.0) |
| 당김 | **최대.** 싱커페이션이 정체성입니다 |
| 앤티시페이션 | 정박 바로 앞 16분에 음을 두어 박을 당깁니다 |

`PHRASE.funkA` 1마디 `'-a-c--b-a-b---a-'` 는 스텝
**1 · 3 · 6 · 8 · 10 · 14** 여섯 자리입니다.

**정박 0 · 4 · 12 가 비어 있고 8 만 남았습니다.**
[00-analysis.md](00-analysis.md) §2 D 의 "정박(0·4·8·12)을 일부러 비우고
그 앞뒤 16분에 음을 둔다" 를 데이터로 확인한 것입니다.
스텝 1 · 3 · 10 · 14 가 전부 정박의 앞뒤 16분입니다.

디스코는 반대로 **8분 균등**입니다 — `PHRASE.disA` 의
`'a-c-e-h-a-c-e-h-'` 는 8분 8음이 쉬지 않고 오릅니다.
킥이 4/4 로 정박을 다 잡으므로 건반은 그 위를 미끄러집니다.

---

## 3. 악구 형식

| FORM | 이 계열에서의 쓰임 |
|---|---|
| **AABB** | 기본. `funk_aabb`(펑크 싱코페) · `dis_aabb`(디스코 옥타브) · `gos_aabb`(가스펠 상행) |
| **ABAB** | 콜앤리스폰스. `funk_abab`(펑크 콜앤리스폰스) — 묻고 답하는 교대 |
| AAAB | `funk_aaab`(펑크 반복) · `dis_aaab`(디스코 반복) |

**ABAB 가 이 계열의 특별한 폼입니다.** 펑크의 "콜앤리스폰스" 는
혼 섹션과 리듬 섹션이 주고받는 것인데, 폼 자체를 교대로 짜면
그 인상이 납니다.

**8마디로는 부족합니다.** 1코드 위에서 밀고 가는 음악이라
16마디는 있어야 그루브가 성립합니다.

**긴 판** — 이 계열 재료의 32루프 키입니다
([README.md](README.md) §4-1).

| 길이 | 키 |
|---|---|
| 32루프 | `funk_l32` · `dis_l32` · `gos_l32` · `bal_l32` · `trp_l32` |
| 64루프 | `bal_l64` 하나뿐 |

펑크·디스코 재료에 64루프가 없는 것은 의도입니다 — 그루브형 재료는
길이를 늘리는 것보다 **음색과 편성을 바꾸는 것**이 원래 방식입니다.

---

## 4. 기타 리프

D 계열은 기타가 **선율이 아니라 타악기**입니다.

| 키 | 생김새 | 관습 |
|---|---|---|
| `funkA` / `funkB` | `'--0-0--0--0-0--0'` | **16분 커팅.** 정박을 비우고 앞뒤를 침 |

`RIFF_PHRASE.funkA` 의 1마디는 스텝 **2 · 4 · 7 · 10 · 12 · 15** 입니다.
스텝 0 이 비어 있는 것이 커팅 기타의 핵심입니다 — 킥과 부딪히지 않습니다.

| RIFF 키 | label | 프레이즈 · 폼 |
|---|---|---|
| `funk_cut` | 펑크 커팅 | funkA/funkB · AABB |
| `funk_call` | 펑크 주고받기 | funkA/funkB · ABAB |

| 하위분기 | `RIFF_KIT` 값 |
|---|---|
| Funk | `funk_cut` · `funk_call` |
| Disco | `funk_cut` · `funk_call` |
| Soul | `funk_call` · `funk_cut` (순서만 뒤바뀜) |

계열 기본값 `RIFF_KIT_CAT.D = ['funk_cut','funk_call']`.

---

## 5. 베이스 라인

이 계열은 **베이스가 곡의 훅**입니다. 재료가 둘 있습니다.

| 키 | 생김새 | 관습 |
|---|---|---|
| `bfunA` / `bfunB` | `'0--0-0--1--0-0--'` | **16분 싱코페 + 도약.** 슬랩의 자리 |
| `bdisA` / `bdisB` | `'0-7-0-7-0-7-0-7-'` | **근음↔옥타브 왕복.** 디스코의 정의 |

`bdis_*` 는 실측 순차 비율이 **0.00** 입니다 — 이동이 전부 7도 도약이라
순차가 하나도 없습니다. 지표 ①·③ 을 정면으로 어기지만
**옥타브 왕복이 디스코 베이스의 정체 그 자체**입니다.

| BLINE 키 | label |
|---|---|
| `bfun_aabb` | 펑크 싱코페 |
| `bfun_abab` | 펑크 옥타브 |
| `bdis_aabb` | 디스코 옥타브 |
| `bdis_abab` | 디스코 교대 |

| 하위분기 | `BLINE_KIT` 값 |
|---|---|
| Funk | `bfun_aabb` · `bfun_abab` |
| Disco | `bdis_aabb` · `bfun_abab` |
| Soul | `bfun_aabb` · `bdis_aabb` |

계열 기본값 `BLINE_KIT_CAT.D = ['bfun_aabb','bdis_aabb']`.

---

## 6. 코드 키 매핑

### 건반 선율

| 하위분기 | `MELODY_KIT` 값 | 근거 |
|---|---|---|
| Funk | `funk_aabb` · `funk_abab` · `dis_aabb` | 클라비넷 커팅 = funk 프레이즈 |
| Disco | `dis_aabb` · `funk_abab` · `gos_aabb` | 스트링 옥타브 + 가스펠 화성 |
| Soul | `gos_aabb` · `funk_aabb` · `bal_aaba` | **가스펠이 먼저** — 소울의 뿌리 |
| Contemporary R&B | `bal_aaba` · `funk_abab` · `trp_aaba` | 발라드형 + 트랩 감각 |

계열 기본값 `MELODY_KIT_CAT.D = ['funk_aabb','funk_abab','dis_aabb','gos_aabb']`.

> Contemporary R&B 만 `trp_aaba`(트랩 회귀)를 씁니다.
> Trap Soul · Alternative R&B 가 실제로 트랩 프로덕션 위에 얹히기 때문입니다
> ([../genres/04-rnb-soul-funk.md](../genres/04-rnb-soul-funk.md) §5).

---

## 7. 지표에서 벗어나는 자리

| 지표 | 벗어남 | 의도인가 |
|---|---|---|
| ⑤ 음역 | `funkA` 는 4마디 안에서 **3도수** | **의도.** §10 표의 "펑크 — 두세 음으로 리듬을 침" |
| ① 순차 · ③ 정점 | `bdis_*` 순차 0.00 · 최고음 52회 (실측) | **의도.** 옥타브 왕복 베이스 |
| ⑨ 같은 음 연속 | `funk_cut`·`funk_call` 11·10 (실측) | **의도.** 커팅은 같은 도수를 계속 칩니다 |

---

## 8. 하위분기가 비어 있는 자리

| 하위분기 | 프리셋 |
|---|---|
| Electro | Electro · Electroclash |

`MELODY_KIT` 에도 `PRESET_CAT` 에도 없어 `melodyPoolFor()` 가
**존재하지 않는 키 `'pop_arch'`** 로 떨어집니다(실측).

---

## 9. 레퍼런스 — 대표 아티스트 · 대표 앨범 (선율 관점)

선율 데이터를 정할 때 쓴 판단 근거입니다. 표기 규칙과 주의사항은
[../genres/00-reference.md](../genres/00-reference.md) 를 먼저 보십시오 —
**이 목록을 AI 프롬프트에 그대로 넣으면 안 됩니다.**
프롬프트에는 오른쪽 열의 **파생 서술 속성만** 씁니다.
앨범명은 미검증이며 `(확인 필요)` 표시가 있습니다.

### Funk

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 선율 속성 |
|---|---|---|---|
| JB Funk | James Brown | (확인 필요) | **1박 강조** · 1코드 위 두세 음 · 혼의 짧은 스탭 |
| Funk | Sly & the Family Stone | (확인 필요) | **클라비넷 16분 커팅** · 도리안 |
| P-Funk | Parliament-Funkadelic | Mothership Connection | 신스 베이스가 선율 · 넓은 도약 |
| Jazz-Funk | Herbie Hancock | Head Hunters | **로즈의 재즈 화성** · 4도 쌓기 · 도약 많음 |
| Disco Funk | Chic | (확인 필요) | 커팅 기타 + **옥타브 베이스** · 스트링 상행 |
| Electro-funk | Zapp · Afrika Bambaataa | (확인 필요) | 보코더 선율 · 무그의 단순 반복 |

### Soul · Contemporary R&B

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 선율 속성 |
|---|---|---|---|
| Motown | — | — | 아치 윤곽 후렴 · 탬버린 백비트 위의 순차 선율 |
| Memphis Soul | — | — | 혼의 짧은 응답구 · 성긴 건반 |
| Philadelphia Soul | — | — | **스트링 상행** · 넓은 편성 |
| New Jack Swing | Teddy Riley · Bobby Brown | (확인 필요) | 스윙 16분 · 신스 리드의 짧은 훅 |
| Quiet Storm | Sade | Diamond Life | **긴 음 · 낮은 음역** · 색소폰 응답 |
| Trap Soul | — | — | 벨 + 808 · 두세 음 반복 |
