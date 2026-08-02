# G. Blues · Country · Folk 계열 — 선율

> [../genres/07-roots.md](../genres/07-roots.md) 의 **G 계열**을 선율 관점에서만 다룹니다.
> 악기·음색·수치는 그쪽, 드럼 박자는 [../patterns/07-roots.md](../patterns/07-roots.md).
> 도수 표기는 [README.md](README.md) §2, 지표 번호 ①~⑩ 는 [02-melody-theory.md](02-melody-theory.md) §9.
> 여기 적은 키 이름은 전부 `../src/data/melody.js` 에서 확인한 것입니다.

**이 계열의 공통 제약**: 블루스의 정체성인 **b3↔3 벤딩**을 8도수 그리드로는
못 냅니다. 이것이 이 계열에서 가장 큰 손실입니다.

---

## 1. 음정 어휘

| | 값 |
|---|---|
| 기본 스케일 | **Minor Pentatonic** (블루스) / **Major** (컨트리·포크) |
| 보조 | Major Pentatonic (컨트리 리드), Mixolydian 감각(도수 4=b7) |
| 특징음 | **b3(도수 1)** · **4도** · **5도** — 펜타토닉 왕복의 축 |
| 블루노트 | **정체성인데 못 냅니다.** 아래 참조 |
| 화성 | **12마디 블루스** (0×4·3×2·0×2·4·3·0·4) · I–IV–V — [01-harmony.md](01-harmony.md) §4 |

### 블루노트를 못 내는 것에 대한 대처

> "블루스는 b3↔3 사이를 오가는 게 정체성인데 8도수로는 못 냅니다.
> 대신 b3(=b)를 길게 끌어 그 자리를 표시했습니다."
> — [00-analysis.md](00-analysis.md) §2 G

`PHRASE.bluesA` 1마디 `'a---c--b--a-----'` 에서 도수 1(`b`)이 스텝 7 에 있고
그 뒤 스텝 8·9 가 비어 있습니다. **다음 스텝을 비워 긴 음을 흉내 내는**
방식(§[00-analysis.md](00-analysis.md) §4)으로 블루노트 자리를 표시한 것입니다.

`PHRASE.rootA` 는 도수 **0·1·2·3**, `rootB` 는 본체가 **2·3·4·5** —
펜타토닉 왕복입니다 (A = 낮은 층 0~3, B = 높은 층 2~5).

---

## 2. 리듬 어휘

| | 값 |
|---|---|
| 기본 단위 | **8분**, 셔플이면 Swing 노브 |
| 밀도 | 마디당 4~5음 (목표 4~6) |
| 당김 | 낮음. 박에 정직하게 얹습니다 |
| 장식음 | **같은 자리에 16분 하나를 덧붙임** — 이 계열의 서명 |

`PHRASE.rootA` 1마디 `'a---ac--b---a---'` 는 스텝 **0 · 4 · 5 · 8 · 12**.
스텝 4 와 5 가 붙어 있는 것이 장식음입니다 —
8분 자리에 16분 하나를 튕겨 붙이는 어쿠스틱 연주의 습관입니다.

`PHRASE.bluesA` 1마디는 스텝 **0 · 4 · 7 · 10** 으로 조금 더 성깁니다.
스텝 7·10 이 정박을 살짝 벗어나 셔플 감각을 만듭니다.

---

## 3. 악구 형식

| FORM | 이 계열에서의 쓰임 |
|---|---|
| **AABA** | 기본. `root_aaba`(루츠 펜타토닉) · `blues_aaba`(블루스 왕복) |
| **AABB** | `root_aabb`(루츠 전통) · `blues_aabb`(블루스 12마디풍) |
| ABAB | `blues_abab`(블루스 콜앤리스폰스) |

**12마디 블루스를 16마디에 담는 문제**가 있습니다.
`FORM` 에는 12마디 폼이 없습니다 — 전부 4마디×4 입니다.
그래서 `blues_aabb` 의 label 이 "블루스 12마디**풍**" 입니다.
12마디 구조 자체가 아니라 그 인상을 16마디로 옮긴 것입니다.

**콜앤리스폰스가 이 계열의 원형입니다.** 부르고(4마디) 답하는(4마디)
구조가 `FORM.ABAB = [0,1,0,1]` 과 정확히 맞습니다.

**긴 판** — 이 계열 재료의 32·64루프 키입니다
([README.md](README.md) §4-1).

| 길이 | 키 |
|---|---|
| 32루프 | `root_l32` · `blues_l32` · `bal_l32` · `gos_l32` |
| 64루프 | `root_l64` · `bal_l64` |

`blues_l64` 는 없습니다 — 블루스는 12마디 순환을 **여러 번 도는** 것이
길이를 버는 방식이지 64마디 폼을 쓰는 음악이 아닙니다.

---

## 4. 기타 리프

**기타가 주인공입니다.** `RIFF_PHRASE.arpA` 가 이 계열의 재료입니다.

| 키 | 생김새 | 관습 |
|---|---|---|
| `arpA` / `arpB` | `'0-1-2-1-0-1-2-1-'` | **순차 아르페지오.** 오르내리는 왕복 |

실측 순차 비율 `arp_folk` **0.99**, `arp_country` **0.98** —
전 리프 중 가장 순차적입니다. 핑거피킹은 인접 현을 짚으므로
도약이 나올 수가 없습니다.

| RIFF 키 | label | 프레이즈 · 폼 |
|---|---|---|
| `arp_folk` | 포크 아르페지오 | arpA/arpB · AABA |
| `arp_country` | 컨트리 아르페지오 | arpA/arpB · AABB |

| 하위분기 | `RIFF_KIT` 값 |
|---|---|
| Country | `arp_country` · `arp_folk` |
| Folk | `arp_folk` · `arp_country` (순서만 뒤바뀜) |
| **Blues** | **`rock_power`** · `arp_country` |

Blues 만 `rock_power` 를 먼저 씁니다 — 일렉트릭 블루스는
파워코드 리프가 실제 어법이기 때문입니다.

계열 기본값 `RIFF_KIT_CAT.G = ['arp_country','arp_folk']`.

---

## 5. 베이스 라인

| 키 | 생김새 | 관습 |
|---|---|---|
| `bcouA` / `bcouB` | `'0---2---0---2---'` | **근음↔5도 붐칙.** 1·3박 근음, 2·4박 5도 |

`bcou_*` 는 실측 순차 비율 **0.22~0.26** 입니다. 목표(0.55~0.80)를
크게 벗어나지만, 붐칙은 정의상 **근음과 5도를 번갈아 뛰는** 것이라
순차가 나올 수 없습니다 ([02-melody-theory.md](02-melody-theory.md) §10).

| BLINE 키 | label |
|---|---|
| `bcou_aabb` | 컨트리 붐칙 |
| `bcou_aaba` | 붐칙 회귀 |

| 하위분기 | `BLINE_KIT` 값 |
|---|---|
| Country | `bcou_aabb` · `bcou_aaba` |
| Folk | `bcou_aaba` · **`bwal_aaba`** |
| Blues | `bcou_aabb` · **`bwal_aaba`** |

계열 기본값 `BLINE_KIT_CAT.G = ['bcou_aabb','bcou_aaba']`.

Folk·Blues 가 워킹(`bwal_aaba`)을 함께 쓰는 것은
`TONE_KIT['Folk'].bass = 'upright'` 와 짝입니다 — 업라이트는
붐칙보다 걷는 라인이 자연스럽습니다.

---

## 6. 코드 키 매핑

### 건반 선율

| 하위분기 | `MELODY_KIT` 값 | 근거 |
|---|---|---|
| Blues | `blues_aaba` · `blues_aabb` · `root_aaba` | 블루노트 자리를 표시한 프레이즈 |
| Country | `root_aabb` · `root_aaba` · `blues_aaba` | 펜타토닉 왕복 + 블루스 뿌리 |
| Folk | `root_aabb` · **`bal_aaba`** · `blues_aaba` | 노래 반주라 발라드 프레이즈가 섞임 |
| Gospel · 지역 장르 | **`gos_aabb`** · `gos_aaba` · `bal_aabb` | **3화음 표기** — 피아노가 코드로 화답 |

계열 기본값 `MELODY_KIT_CAT.G = ['root_aaba','root_aabb','blues_aaba','blues_aabb']`.

`PHRASE.gosA` 는 이 계열에서 유일하게 **단음이 아니라 3화음**입니다
(`'0-------2---1---'` — 숫자 표기). 가스펠 피아노가 화음으로
응답하는 편성을 그대로 옮긴 것입니다.

---

## 7. 지표에서 벗어나는 자리

| 지표 | 실측 | 의도인가 |
|---|---|---|
| ① 순차 비율 | `bcou_aabb` **0.22** · `bcou_aaba` **0.26** | **의도.** 붐칙은 근음↔5도 도약 |
| ⑤ 음역 | `arp_folk`·`arp_country` **6도수** (상한 근처) | 의도. 아르페지오라 넓습니다 |
| ⑥ 서로 다른 마디 | `arp_*`·`bcou_*` **0.38~0.44** | 의도. 반복이 이 계열의 미학 |

건반 선율(`root_*`·`blues_*`)은 §9 표 안에 들어옵니다.

---

## 8. 하위분기가 비어 있는 자리

| 하위분기 | 프리셋 |
|---|---|
| 루츠와의 교차 | Country Rock |

`MELODY_KIT` 에도 `PRESET_CAT` 에도 없어 `melodyPoolFor()` 가
**존재하지 않는 키 `'pop_arch'`** 로 떨어집니다(실측).

> `루츠와의 교차` 는 `TONE_KIT` 에서 G 블록에 있지만
> 장르 문서상 자리는 [../genres/01-rock.md](../genres/01-rock.md) §9 입니다.

---

## 9. 레퍼런스 — 대표 아티스트 · 대표 앨범 (선율 관점)

선율 데이터를 정할 때 쓴 판단 근거입니다. 표기 규칙과 주의사항은
[../genres/00-reference.md](../genres/00-reference.md) 를 먼저 보십시오 —
**이 목록을 AI 프롬프트에 그대로 넣으면 안 됩니다.**
프롬프트에는 오른쪽 열의 **파생 서술 속성만** 씁니다.
앨범명은 미검증이며 `(확인 필요)` 표시가 있습니다.

### Blues

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 선율 속성 |
|---|---|---|---|
| Chicago Blues | Muddy Waters · Howlin' Wolf | (확인 필요) | **하모니카 벤딩** · 12마디 · 콜앤리스폰스 |
| Texas Blues | Stevie Ray Vaughan | (확인 필요) | 펜타토닉 리드 · 빠른 장식음 |
| Country Blues | Robert Johnson | (확인 필요) | 어쿠스틱 슬라이드 · 불규칙한 마디 수 |
| Jump Blues | Louis Jordan | (확인 필요) | **혼 섹션의 유니즌 리프** · 셔플 |

### Country · Folk

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 선율 속성 |
|---|---|---|---|
| Honky-tonk | Hank Williams | (확인 필요) | 메이저 펜타토닉 · **페달스틸 벤딩** · 붐칙 |
| Bluegrass | Bill Monroe · Flatt & Scruggs | (확인 필요) | 빠른 순차 아르페지오 · **만돌린 촙** |
| Old-time / Hillbilly | The Carter Family | (확인 필요) | 밴조 롤 · 선율과 반주가 한 손 |
| Nashville Sound | Patsy Cline | (확인 필요) | 스트링 위의 노래하는 아치 |
| Outlaw Country | Willie Nelson · Waylon Jennings | Red Headed Stranger | 말하듯 뒤로 미는 프레이징 |
| Americana | Gillian Welch | (확인 필요) | 하모니카 · 성긴 밀도 · 순차 |
| Folk Revival · Folk Rock | — | — | 노래 중심 · 기타 아르페지오 반주 |

### Gospel

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 선율 속성 |
|---|---|---|---|
| Gospel | — | — | **화음으로 화답** · 변격 종지(3→0) · 상행 빌드 |
| Zydeco / Cajun | — | — | 아코디언의 반복 모티프 · 2박 계열 |
