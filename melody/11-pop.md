# B. Pop 계열 — 선율

> [../genres/02-pop.md](../genres/02-pop.md) 의 **B 계열**을 선율 관점에서만 다룹니다.
> 악기·음색·수치는 그쪽, 드럼 박자는 [../patterns/02-pop.md](../patterns/02-pop.md).
> 도수 표기는 [README.md](README.md) §2, 지표 번호 ①~⑩ 는 [02-melody-theory.md](02-melody-theory.md) §9.
> 여기 적은 키 이름은 전부 `../src/data/melody.js` 에서 확인한 것입니다.

**이 계열은 §9 지표를 가장 곧이곧대로 지킵니다.** 지표 자체가
서양 대중음악의 노래 선율을 기준으로 만들어졌기 때문입니다
([02-melody-theory.md](02-melody-theory.md) §10 첫 줄).

---

## 1. 음정 어휘

| | 값 |
|---|---|
| 기본 스케일 | **Major** — 도수 0·2·4 가 토닉 3화음 |
| 보조 | Natural Minor (발라드·감성 4코드), Dorian (Synth-pop) |
| 특징음 | **도수 2(3도)** 와 **도수 4(5도)** — 후렴이 이 둘에 얹힙니다 |
| 블루노트 | **안 씁니다.** 팝은 화음음에 정확히 내려앉는 것이 미학입니다 |

**화음음에 착지하는 것이 규칙입니다.** 강박(스텝 0·4·8·12)에 도수 0·2·4,
약박에 1·3·5·6 을 두고 비화음음은 순차로 해결합니다
([01-harmony.md](01-harmony.md) §6).

`PHRASE.popA` 는 도수 0·1·2·3, `PHRASE.popB` 는 2·3·4·5 입니다.
후렴(B)이 절(A)보다 정확히 **두 도수 위**에 있습니다 —
[00-analysis.md](00-analysis.md) §2 B 의 "절 8마디는 낮게, 후렴 8마디는 3~4도 위로".

---

## 2. 리듬 어휘

| | 값 |
|---|---|
| 기본 단위 | **8분**, 후렴에서 16분 채움 |
| 밀도 | 마디당 4~5음 (목표 5~8) |
| 당김 | 약함~중간. 마디 첫 박에 **긴 음**을 두어 숨을 만듭니다 |
| 앤티시페이션 | 프레이즈 끝에서만 — 4마디째를 비우고 다음 덩어리로 넘김 |

`PHRASE.popA` 1마디 `'a-----c-b---a---'` 는 스텝 0·6·8·12.
스텝 0 뒤로 5스텝을 비운 것이 "마디 첫 박의 긴 음"입니다
(이 도구에는 음길이가 없어 **다음 스텝을 비워서** 긴 음을 흉내 냅니다
— [00-analysis.md](00-analysis.md) §4).

`PHRASE.balA` 는 극단입니다 — `'a-------------c-'` 로 마디에 두 음뿐입니다.
**노래 자리를 최대한 비우는 것**이 발라드 프레이즈의 설계입니다.

---

## 3. 악구 형식

| FORM | 이 계열에서의 쓰임 |
|---|---|
| **AABB** | 절–후렴. `pop_aabb`(팝 아치)가 이 계열의 기준값 |
| **ABAB** | 훅 교대. `pop_abab`(팝 훅) — 후렴 조각을 절 사이에 꽂음 |
| **AABA** | 32마디 팝 폼의 절반. `pop_aaba`(팝 절-후렴), `bal_aaba`(발라드 긴숨) |

**8마디로도 성립하지만 16마디가 표준입니다.** 절 8 + 후렴 8 이
그대로 AABB 이기 때문입니다.

`FORM.ABAC` 도 정의돼 있으나 값이 `[0,1,0,1]` 로 ABAB 와 같고,
`MEL_SRC` 어디에서도 쓰지 않습니다 — "C 자리는 B 의 변형으로 대신" 이라는
주석 그대로입니다.

---

## 4. 기타 리프

팝은 기타가 주인공이 아니라 **반주**입니다.
`RIFF_PHRASE` 에 팝 전용 재료는 없고, 계열 기본값이 다른 계열 것을 빌려 옵니다.

```
RIFF_KIT_CAT.B = ['rock_drive','arp_folk']
```

| 빌려 온 키 | 왜 |
|---|---|
| `rock_drive` (rockA/rockB · AABB) | 밴드형 팝 — 후렴에서 파워코드가 들어옴 |
| `arp_folk` (arpA/arpB · AABA) | 어쿠스틱 팝 · Indie Pop — 순차 아르페지오 `'0-1-2-1-0-1-2-1-'` |

`RIFF_KIT` 에 B 계열 하위분기 항목은 **하나도 없습니다.**
전부 계열 기본값으로 내려갑니다.

---

## 5. 베이스 라인

```
BLINE_KIT_CAT.B = ['brock_aabb','bdis_aabb']
```

| 키 | 생김새 | 왜 |
|---|---|---|
| `brock_aabb` (brockA/brockB · AABB) | `'0---0---0---0---'` 4분 근음 | 밴드형 팝의 기본. 코드 근음을 짚음 |
| `bdis_aabb` (bdisA/bdisB · AABB) | `'0-7-0-7-0-7-0-7-'` 근음↔옥타브 | Dance-pop — 디스코 계보의 옥타브 왕복 |

`BLINE_KIT` 에도 B 계열 하위분기 항목이 없습니다.

---

## 6. 코드 키 매핑

### 건반 선율

| 하위분기 | `MELODY_KIT` 값 | 근거 |
|---|---|---|
| Teen Pop · Indie Pop | `pop_aabb` · `bal_aaba` · `ant_aaba` | 절-후렴 + 발라드 + 합창형 |
| Synth-pop 계보 | `chip_aabb` · `ant_aabb` · `pop_abab` | 신스 리드가 아르페지오(chip)로 감 |
| Dance-pop 계보 | `pop_aabb` · `dis_aabb` · `ant_aaba` | 팝 아치 + 디스코 옥타브 |

계열 기본값:

```
MELODY_KIT_CAT.B = ['pop_aabb','pop_abab','bal_aaba','ant_aabb','cin_aabb']
```

다섯 개로 **가장 넓습니다.** 팝은 하위분기가 많고 편차가 커서
계열 기본값 하나로 좁히기 어렵기 때문입니다.

### 프레이즈 재료

| PHRASE 키 | 생김새 | 성격 |
|---|---|---|
| `popA` / `popB` | `'a-----c-b---a---'` | 아치 윤곽. 마디 첫 박에 긴 음 |
| `balA` / `balB` | `'a-------------c-'` | 마디에 두 음. 노래 자리 |
| `antA` / `antB` | `'a-------c-------'` | 앤섬. 긴 음으로 오르고 정점에서 되받음 |
| `cinA` / `cinB` | `'a---c---b---a---'` | 시네마틱. 4분 4음의 균일한 상승 |
| `chipA` / `chipB` | `'a-c-e-a-c-e-a-c-'` | 칩튠. 8분 아르페지오 (Synth-pop 이 빌려 씀) |

---

## 7. 지표에서 벗어나는 자리

이 계열은 벗어나는 것이 거의 없습니다. 단 둘입니다.

| 지표 | 벗어남 | 의도인가 |
|---|---|---|
| ① 순차 · ⑤ 음역 | `chip_*` 는 아르페지오라 도약이 많음 | **의도.** Synth-pop 이 빌려 온 재료라 그렇습니다 |
| ① 순차 | `bdis_*` 는 근음↔옥타브 왕복이라 순차 0.00 (실측) | **의도.** 베이스는 노래가 아닙니다 ([02-melody-theory.md](02-melody-theory.md) §10) |

---

## 8. 하위분기가 비어 있는 자리

`MELODY_KIT` 에 없고 `PRESET_CAT` 에도 없어 `melodyPoolFor()` 가
**존재하지 않는 키 `'pop_arch'`** 로 떨어지는 프리셋들입니다(실측).

| 하위분기 | 프리셋 |
|---|---|
| 지역 팝 | J-pop · Kayōkyoku · Enka · Cantopop · Mandopop · Latin Pop · Schlager · Shibuya-kei |
| Soft Rock · AOR 계보 | Soft Rock · AOR · City Pop |
| 하이브리드 · 인터넷 장르 | Global Bass · Tropical Bass |

> `Soft Rock · AOR 계보` 는 `TONE_KIT` 에서는 A. Rock 블록에 적혀 있지만
> 장르 문서상 자리는 [../genres/02-pop.md](../genres/02-pop.md) §2 입니다.

---

## 9. 레퍼런스 — 대표 아티스트 · 대표 앨범 (선율 관점)

선율 데이터를 정할 때 쓴 판단 근거입니다. 표기 규칙과 주의사항은
[../genres/00-reference.md](../genres/00-reference.md) 를 먼저 보십시오 —
**이 목록을 AI 프롬프트에 그대로 넣으면 안 됩니다.**
프롬프트에는 오른쪽 열의 **파생 서술 속성만** 씁니다.
앨범명은 미검증이며 `(확인 필요)` 표시가 있습니다.

### Teen Pop · Indie Pop

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 선율 속성 |
|---|---|---|---|
| **Baroque Pop** | The Beach Boys · The Left Banke | Pet Sounds | 넓은 화성 위의 순차 선율 · 대위적 내성 |
| Chamber Pop | Belle and Sebastian | (확인 필요) | 좁은 음역 · 말하듯 붙는 리듬 |
| Twee Pop | — | — | 단순 순차 · 3도 병행 |
| Indie Pop | — | — | 반복 모티프 · 기타 아르페지오와 유니즌 |
| Bedroom Pop | — | — | 성긴 밀도 · 긴 음 · 낮은 음역 |
| Teen Pop · Bubblegum | — | — | 후렴이 절보다 뚜렷이 높음 · 반복 훅 |

### Synth-pop · Dance-pop

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 선율 속성 |
|---|---|---|---|
| Synthwave | (80년대 영화음악 계보) | — | **신스 리드 아르페지오** · 넓은 도약 |
| New Romantic | — | — | 짧은 모티프 반복 · 시퀀서 감각 |
| Electropop · Hyperpop | — | — | 극단적으로 짧은 훅 · 옥타브 점프 |
| Eurodance · Euro-pop | — | — | 후렴이 4마디 통째 반복 · 단순 순차 |
| Dance-pop · EDM-pop | — | — | 브레이크다운의 긴 음 + 드롭의 반복 |
| Freestyle | — | — | 라틴 리듬 위의 짧은 보컬 모티프 |
