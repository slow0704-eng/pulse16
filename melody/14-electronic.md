# E. Electronic 계열 — 선율

> [../genres/05-electronic.md](../genres/05-electronic.md) 의 **E 계열**을 선율 관점에서만 다룹니다.
> 악기·음색·수치는 그쪽, 드럼 박자는 [../patterns/05-electronic.md](../patterns/05-electronic.md).
> 도수 표기는 [README.md](README.md) §2, 지표 번호 ①~⑩ 는 [02-melody-theory.md](02-melody-theory.md) §9.
> 여기 적은 키 이름은 전부 `../src/data/melody.js` 에서 확인한 것입니다.

**이 계열은 §9 지표를 가장 크게 벗어납니다.** 아르페지오는 **도약이 정체성**이라
지표 ①(순차 비율)과 ⑤(음역)를 정면으로 어깁니다
([02-melody-theory.md](02-melody-theory.md) §10 표에 명시).
전 계열 중 **밀도가 유일하게 목표보다 높은** 계열이기도 합니다
(목표 6~10, 실측 12.5 — [00-analysis.md](00-analysis.md) §3).

---

## 1. 음정 어휘

| | 값 |
|---|---|
| 기본 스케일 | **Natural Minor** / **Minor Pentatonic** — 어두운 쪽 |
| 보조 | Major (Trance 의 업리프팅 브레이크다운), Dorian (Deep House) |
| 특징음 | **도수 0·2·4·7** — 3화음 + 옥타브. 아르페지오의 뼈대 |
| 블루노트 | 없음 |
| 화성 | 감성 4코드 또는 **2코드 반복** ([01-harmony.md](01-harmony.md) §4) |

`PHRASE.edmA` 1마디는 `'acegacegacegaceg'` — 도수 **0·2·4·6** 을
네 번 반복합니다. 2마디에서 `'acegacegacfhacfh'` 로 뒷부분만 `a·c·f·h`
(도수 0·2·5·7)로 바꿉니다. **화음을 갈아 끼우는 것이 곧 진행**입니다.

한 가지 주의 — 5음계에서 `TRIAD(r) = {r, r+2, r+4}` 는 3화음이 아니라
**4도 쌓기**가 됩니다([01-harmony.md](01-harmony.md) §2).
Minor Pentatonic 을 걸면 `aceg` 가 근음–4도–b7–… 로 읽히는데,
이건 결함이 아니라 모달·하우스 화성에서 오히려 정확합니다.

---

## 2. 리듬 어휘

| | 값 |
|---|---|
| 기본 단위 | **16분** — 쉬지 않고 채웁니다 |
| 밀도 | 마디당 12~16음. 전 계열 최고 |
| 당김 | 없음. **격자에 정확히 얹는 것**이 이 계열의 미학입니다 |
| 앤티시페이션 | 없음. 대신 **엇박**(스텝 2·6·10·14)을 통째로 씁니다 |

`PHRASE.edmA` 1마디는 **16스텝 전부**가 음입니다.
"아르페지오는 원래 쉬지 않는 것이 정체성이라 그대로 뒀습니다"
([00-analysis.md](00-analysis.md) §3 마지막 줄).

반대쪽 극단이 앰비언트입니다 — `PHRASE.ambA` 는
`'a---------------'` 로 **마디에 한 음**, 그마저 2·4마디는 스텝 10 에
한 음만 둡니다. 여백이 악기입니다.

Techno·Minimal 은 `amb_aaab`, Dubstep 계열은 하프타임이라 `trp_aaab` 를
빌려 씁니다(§6) — 같은 E 계열 안에서 밀도가 **1음과 16음 사이**로 갈립니다.

---

## 3. 악구 형식

| FORM | 이 계열에서의 쓰임 |
|---|---|
| **AAAB** | 기본. `edm_aaab`(EDM 아르페지오) — 12마디 유지 후 4마디 전환 |
| **AABB** | 빌드. `edm_aabb`(EDM 빌드) — 8마디마다 한 층 올림 |
| ABAB | `edm_abab`(EDM 교대) — Breakbeat 계열 |

**AAAB 가 이 계열의 폼입니다.** 클럽 음악은 8·16마디 단위로
요소를 더하고 빼는 구조라, 같은 4마디를 세 번 두고 마지막에
전환하는 것이 브레이크다운·빌드업의 자리와 맞습니다.

**16마디가 최소 단위입니다.** 8마디로는 빌드가 성립하지 않습니다.

**긴 판** — 이 계열 재료의 32·64루프 키입니다
([README.md](README.md) §4-1). 클럽 음악은 원래 긴 폼이라
이 계열이 가장 많이 쓰게 됩니다.

| 길이 | 키 |
|---|---|
| 32루프 | `edm_l32` · `chip_l32` · `amb_l32` · `dis_l32` · `trp_l32` · `bal_l32` · `bos_l32` · `jazz_l32` · `cin_l32` |
| 64루프 | `amb_l64` · `bal_l64` · `jazz_l64` · `cin_l64` |

> **`edm_l64` · `chip_l64` 는 없습니다.** 아르페지오 재료는 `LONG_64` 목록에
> 없습니다 — 16분 아르페지오를 64마디 물리면 변화 없이 길기만 합니다.
> 긴 전개가 필요하면 `cin_l64`(시네마틱 상승)를 쓰는 쪽이 맞습니다.

---

## 4. 기타 리프

E 계열에서 "기타" 는 대개 **플럭·리드 신스의 대역**입니다.

| 키 | 생김새 | 관습 |
|---|---|---|
| `edmA` / `edmB` | `'0-2-4-7-0-2-4-7-'` | 도수 0–2–4–7 의 아르페지오. 3마디에서 3–5–7–2 로 바뀜 |

> `RIFF_PHRASE.edmA` 는 melody.js 주석에 "16분 아르페지오" 라고 적혀 있지만
> 실제 자리는 스텝 0·2·4·6·8·10·12·14 의 **8분 8음**입니다.
> 16분으로 꽉 찬 것은 건반 쪽 `PHRASE.edmA` 입니다.

| RIFF 키 | label | 프레이즈 · 폼 |
|---|---|---|
| `edm_arp` | EDM 아르페지오 | edmA/edmB · AAAB |

| 하위분기 | `RIFF_KIT` 값 |
|---|---|
| House 계열 | `edm_arp` · `funk_cut` |
| Techno 계열 | `edm_arp` (하나뿐) |
| Trance 계열 | `edm_arp` (하나뿐) |

계열 기본값 `RIFF_KIT_CAT.E = ['edm_arp','funk_cut']`.
House 만 `funk_cut` 을 함께 씁니다 — 디스코·펑크 샘플이 뿌리이기 때문입니다.

---

## 5. 베이스 라인

| 키 | 생김새 | 관습 |
|---|---|---|
| `bhouA` / `bhouB` | `'--0---0---0---0-'` | **킥 사이 엇박.** 스텝 2·6·10·14 — 정박은 킥에 양보 |
| `bdisA` / `bdisB` | `'0-7-0-7-0-7-0-7-'` | 근음↔옥타브. Trance 가 씁니다 |

**하우스 베이스가 정박을 비우는 이유**는 4/4 킥과 같은 자리에 서면
저역이 뭉치기 때문입니다. 이 도구에는 사이드체인 대신 `Duck` 노브가
있지만, 애초에 자리를 비우는 것이 원본의 방식입니다.

| BLINE 키 | label |
|---|---|
| `bhou_aaab` | 하우스 엇박 |
| `bhou_aabb` | 하우스 진행 |

| 하위분기 | `BLINE_KIT` 값 |
|---|---|
| House 계열 | `bhou_aaab` · `bhou_aabb` |
| Techno 계열 | `bhou_aaab` (하나뿐) |
| Trance 계열 | `bhou_aabb` · `bdis_abab` |

계열 기본값 `BLINE_KIT_CAT.E = ['bhou_aaab','bdis_abab']`.

---

## 6. 코드 키 매핑

### 건반 선율

| 하위분기 | `MELODY_KIT` 값 | 근거 |
|---|---|---|
| House 계열 | `edm_aaab` · `dis_abab` · `chip_aaab` | 아르페지오 + 디스코 옥타브 |
| Techno 계열 | `edm_aaab` · **`amb_aaab`** · `chip_abab` | "음 두세 개만 길게" — 여백이 섞임 |
| Trance 계열 | `edm_aabb` · `chip_aaab` · `cin_aabb` | **빌드형(AABB)** + 시네마틱 상승 |
| Breakbeat 계열 | `edm_abab` · `chip_aabb` · `funk_abab` | 교대형 + 펑크 콜앤리스폰스 |
| Dubstep · Bass Music | **`trp_aaab`** · `edm_aabb` · `amb_aaba` | **하프타임**이라 트랩 프레이즈가 먼저 |
| Downtempo · Ambient · Retro | `amb_aaba` · `bal_aaba` · `bos_aabb` · `jazz_aaba` | 아르페지오를 **아예 안 씁니다** |

계열 기본값:

```
MELODY_KIT_CAT.E = ['edm_aaab','edm_aabb','chip_aaab','dis_abab','amb_aaba']
```

> Downtempo · Ambient · Retro 하나만 `edm_*`·`chip_*` 이 없습니다.
> 이 갈래는 클럽 음악이 아니라 **감상 음악**이기 때문입니다
> ([../genres/05-electronic.md](../genres/05-electronic.md) §8).

### 프레이즈 재료

| PHRASE 키 | 마디당 음수 | 성격 |
|---|---|---|
| `edmA` / `edmB` | 16 | 16분 아르페지오. 쉼 없음 |
| `chipA` / `chipB` | 8 | 8분 아르페지오. 칩튠 |
| `disA` / `disB` | 8 | 8분 + 옥타브 도약 |
| `ambA` / `ambB` | 1 | 여백 |

---

## 7. 지표에서 벗어나는 자리

| 지표 | 실측 | 의도인가 |
|---|---|---|
| ① 순차 비율 | `edm_arp` **0.07** (목표 0.55~0.80) | **의도.** 아르페지오는 도약이 정체성 |
| ③ 정점 유일성 | `edm_arp` 최고음 **23회** | **의도.** 아르페지오에 "정점" 개념이 없음 |
| ⑤ 음역 | `edm_arp` **7도수** (목표 4~7 상한) | **의도.** 옥타브를 다 씁니다 |
| ⑥ 서로 다른 마디 | `amb_*` 는 반복이 목적 | **의도.** §10 표에 명시 |

**그래서 이 계열은 검사 도구의 `*` 표시가 가장 많습니다.**
`tools/analyze-melody.html` 은 "위반" 이 아니라 "표에서 벗어남" 으로
보고하므로, E 계열의 `*` 는 대부분 읽고 넘기면 됩니다.

---

## 8. 하위분기가 비어 있는 자리

| 하위분기 | 프리셋 |
|---|---|
| Hardcore 계열 | Hardcore Techno · Breakbeat Hardcore · Happy Hardcore · Frenchcore |

`MELODY_KIT` 에도 `PRESET_CAT` 에도 없어 `melodyPoolFor()` 가
**존재하지 않는 키 `'pop_arch'`** 로 떨어집니다(실측).
`Gabber` 자체는 `PRESET_CAT` 에 `'E'` 로 있어 살아납니다.

---

## 9. 레퍼런스 — 대표 아티스트 · 대표 앨범 (선율 관점)

선율 데이터를 정할 때 쓴 판단 근거입니다. 표기 규칙과 주의사항은
[../genres/00-reference.md](../genres/00-reference.md) 를 먼저 보십시오 —
**이 목록을 AI 프롬프트에 그대로 넣으면 안 됩니다.**
프롬프트에는 오른쪽 열의 **파생 서술 속성만** 씁니다.
앨범명은 미검증이며 `(확인 필요)` 표시가 있습니다.

### House 계열

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 선율 속성 |
|---|---|---|---|
| House · Chicago House | Frankie Knuckles | (확인 필요) | **피아노 스탭 코드** · 선율보다 화성 리듬 |
| Deep House | Larry Heard | (확인 필요) | 로즈의 긴 화음 · 낮은 밀도 |
| French House · Filter House | Daft Punk | Homework | **필터로 여닫는 반복 루프** · 디스코 샘플 |
| Amapiano | — | — | 로그드럼이 선율 · 로즈의 짧은 스탭 |

### Techno · Trance · Breakbeat

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 선율 속성 |
|---|---|---|---|
| Detroit Techno | Juan Atkins · Derrick May | (확인 필요) | 스트링 패드 + **무그 시퀀스** · 순차 반복 |
| Minimal Techno | Robert Hood | (확인 필요) | 두세 음만 · 변화가 매우 느림 |
| Acid Techno · Acid House | — | — | **303 시퀀스** — 선율이 아니라 필터 궤적 |
| Psytrance · Goa | Infected Mushroom | (확인 필요) | 16분 베이스 + 넓은 도약 리드 |
| Uplifting Trance | — | — | **장조 브레이크다운의 긴 상행** |
| Drum & Bass | Goldie | Timeless | 리즈 베이스가 선율 · 패드의 긴 화음 |
| Liquid Funk | — | — | **재즈 화성** · 로즈 · 순차 |

### Downtempo · Ambient · Retro

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 선율 속성 |
|---|---|---|---|
| Trip Hop | Massive Attack · Portishead | Dummy | 성긴 로즈 · 어두운 화성 · 긴 음 |
| Ambient Techno | Aphex Twin | Selected Ambient Works | **반복이 목적** · 패드 |
| Nu Jazz | St Germain | (확인 필요) | 재즈 화성 + 하우스 골격 |
| Vaporwave · Mallsoft | — | — | 피치 다운된 원곡 선율 · 흐릿함 |
