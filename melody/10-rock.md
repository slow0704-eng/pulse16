# A. Rock 계열 — 선율

> [../genres/01-rock.md](../genres/01-rock.md) 의 **A 계열**을 선율 관점에서만 다룹니다.
> 악기·음색·수치는 그쪽, 드럼 박자는 [../patterns/01-rock.md](../patterns/01-rock.md).
> 도수 표기는 [README.md](README.md) §2, 지표 번호 ①~⑩ 는 [02-melody-theory.md](02-melody-theory.md) §9.
> 여기 적은 키 이름은 전부 `../src/data/melody.js` 에서 확인한 것입니다.
> 없는 키는 적지 않았습니다.

---

## 1. 음정 어휘

| | 값 |
|---|---|
| 기본 스케일 | **Minor Pentatonic** — 도수 0·1·2·3·4 가 근음·b3·4도·5도·b7 |
| 보조 | Natural Minor (Doom·Gothic 계열), Dorian (Blues Rock) |
| 특징음 | **b3(도수 1)** 과 **b7(도수 4)** — 이 둘이 없으면 록으로 안 들립니다 |
| 블루노트 | b3↔3 벤딩이 정체성인데 8도수 그리드로는 **못 냅니다** (§[00-analysis.md](00-analysis.md) §4) |

블루노트를 못 내는 대신 쓰는 방법은 두 가지입니다.

1. **스케일 노브를 Minor Pentatonic 으로 고정** — 도수 1 이 자동으로 b3 가 됩니다.
2. **도수 1 을 길게 끕니다.** `PHRASE.bluesA` 가 `'a---c--b--a-----'` 로
   도수 1(`b`)을 스텝 7 에 두고 3스텝을 비워 그 자리를 표시합니다.

**실제 데이터가 쓰는 도수** — `PHRASE.rockA` 는 **0·1·2·3**,
`PHRASE.rockB` 는 본체가 **2·3·4·5** 이고 4마디째 종지에서만 1·0 으로
내려앉습니다. melody.js 주석의 "A 프레이즈 = 낮은 층(도수 0~3),
B 프레이즈 = 높은 층(2~5)" 그대로입니다.
A 층과 B 층을 겹치지 않게
갈라 두어 **곡의 정점이 B 에서 한 번만** 나오게 한 설계입니다
(melody.js `PHRASE` 머리 주석).

---

## 2. 리듬 어휘

| | 값 |
|---|---|
| 기본 단위 | **8분** — 16분은 채움음으로만 |
| 밀도 | 마디당 4음 안팎 (목표 4~7, [00-analysis.md](00-analysis.md) §1) |
| 당김 | 약함. 정박 0·8 을 지키고 스텝 6·12 로 흘립니다 |
| 앤티시페이션 | 거의 없음 — 록은 박에 정면으로 부딪히는 것이 미학입니다 |

`PHRASE.rockA` 1마디 `'a-----c-b---a---'` 는 스텝 **0 · 6 · 8 · 12** 네 자리입니다.
0 과 8 은 정박, 6 은 2박의 뒷 8분, 12 는 4박 머리입니다.
**정박을 비우지 않는 것**이 D 계열(펑크)과 갈리는 지점입니다.

메탈은 리듬이 기타로 넘어갑니다 — `RIFF_PHRASE.metalA` 의
`'00-00-0-00-00-0-'` 가 팜뮤트 16분 척이고, 건반은 아예 빠집니다(§7).

---

## 3. 악구 형식

| FORM | 이 계열에서의 쓰임 |
|---|---|
| **AABA** | 기본. `rock_aaba`(록 드라이브). 4마디 리프를 세 번 두고 세 번째만 올림 |
| **AABB** | 절–후렴. `rock_aabb`(록 앤섬). 후렴이 통째로 한 층 위 |
| ABAB | 교대. `rock_abab`(록 교대). Post-punk 계보가 씁니다 |

**8마디가 아니라 16마디가 자연스럽습니다.** 록은 리프를 충분히 반복해야
리프로 인식되므로 4마디×4 가 최소 단위입니다.

`buildBars()` 는 같은 프레이즈가 **두 번째로 나올 때 끝마디를 상대 것으로
바꿉니다.** AABA(`FORM.AABA=[0,0,1,0]`)에서는 8·16마디가 B 의 끝마디로
갈리고, 이것이 1번 괄호 / 2번 괄호 역할을 합니다.

**긴 판** — 이 계열 재료의 32·64루프 키입니다
([README.md](README.md) §4-1).

| 길이 | 키 |
|---|---|
| 32루프 | `rock_l32` · `ant_l32` · `blues_l32` · `bal_l32` · `amb_l32` |
| 64루프 | `rock_l64` · `ant_l64` · `bal_l64` · `amb_l64` |

---

## 4. 기타 리프

록의 선율은 사실상 리프입니다. `RIFF_PHRASE` 에 A 계열 재료가 둘 있습니다.

| 키 | 생김새 | 관습 |
|---|---|---|
| `rockA` / `rockB` | `'0-0-0-0-0-0-0-0-'` | **파워코드 8분 연타.** 3마디에서 도수 2 로 올라갔다 4마디에서 내려앉음 |
| `metalA` / `metalB` | `'00-00-0-00-00-0-'` | **팜뮤트 척.** 16분 두 개 + 쉼의 반복 사이로 도수를 옮김 |

파워코드는 데이터에 없습니다 — **도수 하나가 곧 코드**입니다.
엔진이 `crunch = [0,7]`, `hi = [0,7,12]` 로 폅니다(melody.js `RIFF_PHRASE` 머리 주석).

완성된 리프 4종:

| RIFF 키 | label | 프레이즈 · 폼 |
|---|---|---|
| `rock_power` | 록 파워코드 | rockA/rockB · AABA |
| `rock_drive` | 록 드라이브 | rockA/rockB · AABB |
| `metal_chug` | 메탈 척 | metalA/metalB · AAAB |
| `metal_gallop` | 메탈 갤럽 | metalA/metalB · AABB |

---

## 5. 베이스 라인

| 키 | 생김새 | 관습 |
|---|---|---|
| `brockA` / `brockB` | `'0---0---0---0---'` | **4분 근음.** 2마디 끝에 8분 두 개(`0-0-1---`)로 다음 마디를 예고 |
| `bmetA` / `bmetB` | `'00-00-0-00-00-0-'` | 기타를 그대로 따라가는 16분 연타 — 메탈은 베이스가 리프의 저역 배음입니다 |

BASS_PHRASE 20개 전부 **4마디째 마지막 음이 도수 0** 입니다(실측).
"4마디째 경과음으로 다음 덩어리에 넘긴다"는 주석 그대로입니다.

| BLINE 키 | label |
|---|---|
| `brock_aaba` | 록 근음 |
| `brock_aabb` | 록 진행 |
| `bmet_aaab` | 메탈 연타 |
| `bmet_aabb` | 메탈 갤럽 |

---

## 6. 코드 키 매핑

### 건반 선율

| 하위분기 | `MELODY_KIT` 값 | 근거 |
|---|---|---|
| Metal | `[]` | **건반을 안 씁니다.** `TONE_KIT['Metal'].off:['keys']` 와 짝 |
| Punk | `[]` | 상동. `TONE_KIT['Punk'].off:['keys']` |
| Hard Rock | `rock_aaba` · `ant_aaba` · `blues_aaba` | 리프 + 스타디움 앤섬 + 블루스 뿌리 |
| Alternative | `rock_aabb` · `amb_aaba` · `bal_aaba` | 조용함↔폭발이라 여백(amb)과 발라드가 섞임 |
| Post-punk 계보 | `rock_abab` · `amb_aabb` · `ant_abab` | 교대형 — 반복보다 왕복 |

계열 기본값 `MELODY_KIT_CAT.A = ['rock_aaba','rock_aabb','ant_aaba','blues_aaba']`.

### 기타 리프

| 하위분기 | `RIFF_KIT` 값 |
|---|---|
| Metal | `metal_chug` · `metal_gallop` |
| Hard Rock | `rock_power` · `metal_gallop` |
| Punk | `rock_drive` · `rock_power` |
| Alternative | `rock_power` · `rock_drive` |
| Post-punk 계보 | `arp_folk` · `rock_drive` |

계열 기본값 `RIFF_KIT_CAT.A = ['rock_power','rock_drive']`.

> Post-punk 만 `arp_folk` 를 먼저 씁니다. 클린 기타 아르페지오가
> 그 갈래의 정체성이기 때문입니다([../genres/00-reference.md](../genres/00-reference.md) — Post-punk: "베이스가 선율 · 클린 기타").

### 베이스

| 하위분기 | `BLINE_KIT` 값 |
|---|---|
| Metal | `bmet_aaab` · `bmet_aabb` |
| Hard Rock | `brock_aaba` · `bmet_aabb` |
| Punk | `brock_aabb` · `bmet_aaab` |

계열 기본값 `BLINE_KIT_CAT.A = ['brock_aaba','brock_aabb']`.

---

## 7. 지표에서 벗어나는 자리

| 지표 | 벗어남 | 의도인가 |
|---|---|---|
| ⑨ 같은 음 연속 | `rock_power`·`rock_drive` 15, `metal_chug`·`metal_gallop` 20 | **의도.** 파워코드 연타가 리프의 몸입니다 ([02-melody-theory.md](02-melody-theory.md) §10) |
| ⑤ 음역 | `RIFF_PHRASE.rockA`·`metalA` 는 4마디 안에서 **2도수** | **의도.** 리프는 좁아야 리프입니다 |
| — | Metal·Punk 의 `MELODY_KIT` 이 빈 배열 | **의도.** 건반이 없는 편성 |

건반 선율 쪽(`rock_*`)은 §9 표 안에 들어옵니다 — 벗어나는 것은 리프와 베이스뿐입니다.

---

## 8. 하위분기가 비어 있는 자리

`MELODY_KIT` 에 없고 `PRESET_CAT` 에도 없어 `melodyPoolFor()` 가
**존재하지 않는 키 `'pop_arch'`** 로 떨어지는 프리셋들입니다(실측).

| 하위분기 | 프리셋 |
|---|---|
| 뿌리 | Rock & Roll · Surf Rock · Garage Rock · Proto-punk · Rhythm & Blues · Brill Building · Traditional Pop |
| Psychedelic · Krautrock | Psychedelic Rock · Acid Rock · Space Rock · Krautrock |

`MELODY_KIT['Metalcore']` 도 `[]` 로 적혀 있으나
`PRESET_SUB['Metalcore'] === 'Metal'` 이라 **닿지 않는 항목**입니다.

> 데이터 수정은 이 문서의 일이 아닙니다. 여기서는 "무엇이 비어 있는가" 만 적습니다.

---

## 9. 레퍼런스 — 대표 아티스트 · 대표 앨범 (선율 관점)

선율 데이터를 정할 때 쓴 판단 근거입니다. 표기 규칙과 주의사항은
[../genres/00-reference.md](../genres/00-reference.md) 를 먼저 보십시오 —
**이 목록을 AI 프롬프트에 그대로 넣으면 안 됩니다.**
프롬프트에는 오른쪽 열의 **파생 서술 속성만** 씁니다.
앨범명은 미검증이며 `(확인 필요)` 표시가 있습니다.

### Hard Rock · Metal

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 선율 속성 |
|---|---|---|---|
| Heavy Metal | Judas Priest | British Steel | 리프가 곧 주제 · 좁은 음역 연타 · 갤럽 |
| NWOBHM | Iron Maiden | The Number of the Beast | **달리는 베이스** · 트윈 리드의 3도 병행 |
| Thrash Metal | Metallica · Slayer | Master of Puppets | 팜뮤트 16분 · 근음 고정 · 정점 없음 |
| Doom | Black Sabbath | Master of Reality | 매우 느린 4분 · b5 강조 · 긴 지속 |
| Nu Metal | Korn · Deftones | Follow the Leader | 하프타임 · 두세 음 반복 · 저역 중심 |
| Power Metal | Helloween | Keeper of the Seven Keys | **장조 선율** · 넓은 도약 · 건반 있음 |

### Alternative · Post-punk

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 선율 속성 |
|---|---|---|---|
| Grunge | Nirvana · Soundgarden | Nevermind | 좁은 음역 반복 · 조용함↔폭발 · 건반 없음 |
| Alternative Rock | R.E.M. · Radiohead | The Bends | 아르페지오 기타 · 순차 상행 후 하강 |
| Britpop | Oasis · Blur | (What's the Story) Morning Glory? | 노래하는 아치 윤곽 · 합창 가능한 음역 |
| Shoegaze | My Bloody Valentine | Loveless | 선율이 음색에 묻힘 · 긴 음 |
| Post-punk | Joy Division | Unknown Pleasures | **베이스가 선율을 맡음** · 기타는 아르페지오 |
| New Wave | Talking Heads · Blondie | (확인 필요) | 신스 리드의 짧은 모티프 반복 |

### 뿌리

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 선율 속성 |
|---|---|---|---|
| Rock & Roll | Chuck Berry · Little Richard | (확인 필요) | 12마디 블루스 · 펜타토닉 왕복 · 피아노 트릴 |
| Surf Rock | The Ventures · Dick Dale | (확인 필요) | **기타가 선율 전부** · 반음계 하행 · 건반 없음 |
| Garage Rock | The Sonics · The Stooges | (확인 필요) | 오르간의 두세 음 반복 · 거친 반복 |
