# C. Hip Hop 계열 — 선율

> [../genres/03-hiphop.md](../genres/03-hiphop.md) 의 **C 계열**을 선율 관점에서만 다룹니다.
> 악기·음색·수치는 그쪽, 드럼 박자는 [../patterns/03-hiphop.md](../patterns/03-hiphop.md).
> 도수 표기는 [README.md](README.md) §2, 지표 번호 ①~⑩ 는 [02-melody-theory.md](02-melody-theory.md) §9.
> 여기 적은 키 이름은 전부 `../src/data/melody.js` 에서 확인한 것입니다.

**이 계열의 공통 제약**: 선율의 목적이 "노래" 가 아니라 **"랩이 들어갈 자리를
남기는 것"** 입니다. 그래서 밀도가 가장 낮고, 지표 ⑨(같은 음 연속)를
일부러 어깁니다.

---

## 1. 음정 어휘

| | 값 |
|---|---|
| 기본 스케일 | **Minor Pentatonic** / **Natural Minor** — 어두운 쪽 |
| 특징음 | **b3(도수 1)** · **5도** — 세 음 남짓으로 끝냅니다 |
| 블루노트 | 실질적으로 안 씀. 벤딩 대신 **음색**(로파이·필터)이 그 자리를 맡습니다 |
| 화음 | 진행이 아니라 **2코드 루프** (0·5 또는 0·3) — [01-harmony.md](01-harmony.md) §4 |

`PHRASE.hipA` 가 쓰는 도수는 **0·1·2 세 개뿐**이고,
`PHRASE.trpA` 는 1·3마디를 `a` 와 `c`, 즉 **도수 0·2 두 개**로만 채웁니다
(2마디에서 `b` 하나가 더 나올 뿐입니다).
[00-analysis.md](00-analysis.md) §2 C 의 "세 음 남짓으로 2마디를 반복하고,
그 반복 자체가 훅" 을 그대로 옮긴 값입니다.

---

## 2. 리듬 어휘

| | 값 |
|---|---|
| 기본 단위 | **8분**, 트랩은 그마저 성기게 |
| 밀도 | 마디당 2~3음 — 전 계열 중 **가장 낮습니다** (실측 2.4, [00-analysis.md](00-analysis.md) §3) |
| 당김 | 낮음. 대신 **긴 쉼**이 리듬입니다 |
| 앤티시페이션 | 스텝 10 에서 12 로 밀어 넣는 형태 |

`PHRASE.hipA` 1마디 `'a-------c---a---'` 는 스텝 **0 · 8 · 12** 세 자리입니다.
스텝 1~7 이 통째로 비어 있는 것이 이 계열의 서명입니다.

`PHRASE.trpA` 1마디 `'a---------c-a---'` 는 스텝 **0 · 10 · 12**.
스텝 10 의 `c` 가 12 의 `a` 로 붙는 **두 개짜리 뭉치**인데,
이것이 트랩의 3연음 감각을 16스텝으로 근사한 것입니다
(셋잇단은 이 그리드로 못 냅니다 — [00-analysis.md](00-analysis.md) §4).

**`hipB` 와 `trpB` 는 4마디째가 통째로 비어 있습니다**(`'----------------'`).
프레이즈 42개 중 이 둘만 그렇습니다 — 랩 자리를 가장 크게 비운 값입니다.

---

## 3. 악구 형식

| FORM | 이 계열에서의 쓰임 |
|---|---|
| **AAAB** | 기본. `hip_aaab`(힙합 루프) · `trp_aaab`(트랩 성긴). 12마디 반복 후 전환 |
| AABA | `hip_aaba`(힙합 성긴) · `trp_aaba`(트랩 회귀) |
| ABAB | `hip_abab`(힙합 교대) · `trp_abab`(트랩 교대) |

**AAAB 가 이 계열의 폼입니다.** `FORM.AAAB = [0,0,0,1]` 로 A 를 세 번 두고
마지막에만 B 로 넘어갑니다 — 루프가 훅이고, 마지막 4마디가 전환입니다.

A 가 세 번 나오므로 `buildBars()` 가 **2·3번째 A 의 끝마디를 B 의 것으로**
바꿉니다. 안 바꾸면 서로 다른 마디가 4개뿐이라 지표 ⑥ 이 무너집니다.

**8마디가 아니라 16마디여야 합니다.** 2마디 루프를 8번 도는 것이
이 계열의 기본 단위이기 때문입니다.

**긴 판** — 이 계열 재료의 32루프 키입니다
([README.md](README.md) §4-1).

| 길이 | 키 |
|---|---|
| 32루프 | `hip_l32` · `trp_l32` · `jazz_l32` · `bos_l32` · `amb_l32` |
| 64루프 | `jazz_l64` · `amb_l64` (Lo-fi 재료에만) |

> **`hip_l64` · `trp_l64` 는 없습니다.** `LONG_64` 목록에 힙합·트랩 재료를
> 뺀 것은 의도입니다 — "두세 음 훅이 정체성인 계열에 64마디를 물리면
> 같은 두 음을 64번 듣는 꼴" 이기 때문입니다(melody.js 주석).

---

## 4. 기타 리프

**Trap 계열 · Drill · Southern 은 기타를 끕니다.**
`TONE_KIT` 의 해당 하위분기에 `off:['gtr']` 가 걸려 있습니다
(`../src/data/preset-index.js`). 그래서 리프 풀은 실질적으로 안 쓰입니다.

기타를 켜는 갈래(Lo-fi · 뿌리 · 골든에이지 계보)를 위해
계열 기본값이 잡혀 있습니다.

```
RIFF_KIT_CAT.C = ['funk_cut','edm_arp']
```

| 빌려 온 키 | 왜 |
|---|---|
| `funk_cut` (funkA/funkB · AABB) | 샘플 원본이 펑크 커팅 기타인 경우가 압도적 |
| `edm_arp` (edmA/edmB · AAAB) | 벨·플럭 계열 아르페지오를 기타로 대신할 때 |

`RIFF_KIT` 에 C 계열 하위분기 항목은 **하나도 없습니다.**

---

## 5. 베이스 라인

이 계열은 **베이스가 주인공**입니다. 808 이 그것입니다.

| 키 | 생김새 | 관습 |
|---|---|---|
| `b808A` / `b808B` | `'0---------------'` | **한 음을 길게.** 4마디째에만 움직임 |

`b808A` 는 4마디 전체에서 음이 **6개뿐**입니다(실측).
1마디는 도수 0 하나, 2마디는 `'0---------1-----'` 로 둘, 3마디는 하나,
4마디 `'1---------0-----'` 로 둘입니다.

**이것이 결함이 아니라 808 의 정의입니다.** 808 은 음을 치는 것이 아니라
**한 음을 길게 눌러 감쇠시키는** 악기라, 스텝을 채우면 서브가 뭉갭니다.
게이트·글라이드 노브가 나머지를 합니다.

| BLINE 키 | label |
|---|---|
| `b808_aaab` | 808 롱 |
| `b808_aaba` | 808 슬라이드 |

```
BLINE_KIT_CAT.C = ['b808_aaab','b808_aaba']
```

---

## 6. 코드 키 매핑

### 건반 선율

| 하위분기 | `MELODY_KIT` 값 | 근거 |
|---|---|---|
| Trap 계열 | `trp_aaab` · `trp_aaba` · `hip_aaab` | 벨 음색 + 긴 쉼 |
| Drill | `trp_aaab` · `hip_aaba` | 트랩과 같은 성김. 슬라이드 베이스가 차이를 냄 |
| Southern | `trp_aaab` · `hip_aaab` | 상동 |
| **Lo-fi** | `jazz_aaba` · `bos_aabb` · `amb_aaba` | **혼자 다릅니다** — 재즈 화성 + 보사 + 여백 |

Lo-fi 만 트랩 계열 키를 안 씁니다. `TONE_KIT['Lo-fi'].keys = 'vibes'` 이고
장르 자체가 재즈 샘플 기반이기 때문입니다
([../genres/03-hiphop.md](../genres/03-hiphop.md) §7).

계열 기본값 `MELODY_KIT_CAT.C = ['hip_aaab','hip_aaba','trp_aaab','trp_aaba']`.

### 베이스

| 하위분기 | `BLINE_KIT` 값 |
|---|---|
| Trap 계열 | `b808_aaab` · `b808_aaba` |
| Drill | `b808_aaba` · `b808_aaab` (순서만 뒤바뀜 — 슬라이드가 먼저) |
| Southern | `b808_aaab` |
| Lo-fi | `bwal_aaba` · `breg_aaba` |

Lo-fi 는 여기서도 갈라집니다 — **워킹 베이스**(`bwal_aaba`)가 먼저입니다.

---

## 7. 지표에서 벗어나는 자리

| 지표 | 벗어남 | 의도인가 |
|---|---|---|
| ⑨ 같은 음 연속 | `hip_*` · `trp_*` 는 두세 음 반복이 전부 | **의도.** [02-melody-theory.md](02-melody-theory.md) §10 표에 명시 |
| ⑤ 음역 | `b808_*` 는 **3도수** (목표 4~7, 실측) | **의도.** 808 은 좁아야 합니다 |
| ⑦ 끝음 안정 | `hipB` · `trpB` 는 4마디째가 비어 있어 **끝음이 없음** | **의도.** 랩 자리 |

---

## 8. 하위분기가 비어 있는 자리

`MELODY_KIT` 에 없고 `PRESET_CAT` 에도 없어 `melodyPoolFor()` 가
**존재하지 않는 키 `'pop_arch'`** 로 떨어지는 프리셋들입니다(실측).

| 하위분기 | 프리셋 |
|---|---|
| 뿌리 · 골든에이지 | Old School Hip Hop · Golden Age · Hardcore Hip Hop · Conscious Hip Hop · Jazz Rap · Horrorcore |
| Cloud · Emo 계열 | Cloud Rap · Emo Rap · SoundCloud Rap |
| UK 계열 | UK Rap · Road Rap · Afroswing |
| West Coast | Hyphy · Jerk |
| 지역화 파생 | Brazilian Phonk |

> Boom Bap · Grime · UK Drill · Phonk · G-Funk · Crunk · Miami Bass 는
> `PRESET_CAT` 에 `'C'` 로 적혀 있어 계열 기본값으로 살아납니다.
> 위 목록은 **양쪽 표에 다 없는** 프리셋만 모은 것입니다.

---

## 9. 레퍼런스 — 대표 아티스트 · 대표 앨범 (선율 관점)

선율 데이터를 정할 때 쓴 판단 근거입니다. 표기 규칙과 주의사항은
[../genres/00-reference.md](../genres/00-reference.md) 를 먼저 보십시오 —
**이 목록을 AI 프롬프트에 그대로 넣으면 안 됩니다.**
프롬프트에는 오른쪽 열의 **파생 서술 속성만** 씁니다.
앨범명은 미검증이며 `(확인 필요)` 표시가 있습니다.

### 뿌리 · 골든에이지

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 선율 속성 |
|---|---|---|---|
| Boom Bap | DJ Premier · Pete Rock | (확인 필요) | 2마디 샘플 루프 · 로즈의 두세 음 · 필터로 잘린 고역 |
| Jazz Rap | A Tribe Called Quest | The Low End Theory | **업라이트 워킹 베이스** · 재즈 화성 위의 성긴 건반 |
| Old School Hip Hop | — | — | 펑크 브레이크의 오르간 스탭 · 선율보다 리듬 |
| Conscious Hip Hop | — | — | 스트링 지속음 · 낮은 밀도 |
| Horrorcore | — | — | 어두운 벨의 반복 · 불협 |

### Southern · Trap

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 선율 속성 |
|---|---|---|---|
| Memphis Rap | Three 6 Mafia | (확인 필요) | **카우벨 모티프** · 좁은 음역 반복 |
| Phonk · Drift Phonk | (Memphis 계보) | — | 카우벨 리드가 선율 · 두세 음 |
| Crunk | Lil Jon | (확인 필요) | 신스 리드의 짧은 외침형 모티프 |
| Miami Bass · Booty Bass | 2 Live Crew | (확인 필요) | **808 롱 서브가 선율** · 건반 최소 |
| Snap | D4L · Dem Franchize Boyz | (확인 필요) | 벨 두세 음 · 극단적 여백 |
| Trap · Melodic Trap | — | — | 벨 아르페지오 + 3연음 뭉치 · 808 슬라이드 |
