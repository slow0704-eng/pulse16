# F. Jazz 계열 — 선율

> [../genres/06-jazz.md](../genres/06-jazz.md) 의 **F 계열**을 선율 관점에서만 다룹니다.
> 악기·음색·수치는 그쪽, 드럼 박자는 [../patterns/06-jazz.md](../patterns/06-jazz.md).
> 도수 표기는 [README.md](README.md) §2, 지표 번호 ①~⑩ 는 [02-melody-theory.md](02-melody-theory.md) §9.
> 여기 적은 키 이름은 전부 `../src/data/melody.js` 에서 확인한 것입니다.

**이 계열의 공통 제약**은 [../genres/06-jazz.md](../genres/06-jazz.md) 와 같습니다 —
재즈의 상당수는 **셋잇단 기반**이라 16분 그리드로 정확히 표현되지 않습니다.
선율 쪽에서는 여기에 **크로매틱을 못 쓴다**는 제약이 하나 더 붙습니다.

---

## 1. 음정 어휘

| | 값 |
|---|---|
| 기본 스케일 | **Dorian** (모달), **Major** (스탠더드) |
| 보조 | Minor Pentatonic (블루스 감각), Natural Minor |
| 특징음 | **9도 · 11도 · 13도** — 8도수 그리드에서는 도수 1·3·5 가 그 자리 |
| 블루노트 | 근접음(approach note)이 어법인데 **크로매틱을 못 씁니다** |
| 화성 | **ii–V–I** (도수 1·4·0) · 순환 진행 — [01-harmony.md](01-harmony.md) §4 |

**크로매틱을 못 쓰는 것을 도약의 폭으로 대신했습니다**
([00-analysis.md](00-analysis.md) §2 F). 반음 아래에서 밀어 올리는 자리를
2도 도약 + 반대방향 순차로 바꾼 것입니다.

`PHRASE.jazzA` 는 도수 **0·1·2·3**, `jazzB` 는 **0·1·2·3·4·5** 를 씁니다.
다른 계열의 A 프레이즈가 세 음인 데 비해 네 음 이상을 쓰는 것이
"전 도수를 쓴다"([00-analysis.md](00-analysis.md) §1)의 실제 모습입니다.

7음계에서 `TRIAD` 는 진짜 3화음이지만 **7화음·텐션은 못 냅니다**
([01-harmony.md](01-harmony.md) §7). 텐션을 원하면 건반 롤에 도수를
직접 여러 개 찍어야 합니다.

---

## 2. 리듬 어휘

| | 값 |
|---|---|
| 기본 단위 | **8분 연속 + 16분 뭉치** |
| 밀도 | 마디당 7~8음 (목표 8~12, 실측 6.5) |
| 당김 | 중간. 프레이즈가 **마디선을 넘어 걸칩니다** |
| 앤티시페이션 | 마디 첫 박을 앞 마디 끝 16분에서 미리 침 |

`PHRASE.jazzA` 1마디 `'--acb-a-c-b-a-b-'` 는 스텝
**2 · 3 · 4 · 6 · 8 · 10 · 12 · 14** 여덟 자리입니다.

**스텝 0 과 1 이 비어 있습니다.** 프레이즈가 정박에서 시작하지 않고
2 에서 들어오는 것 — 이것이 "프레이즈가 마디선을 넘어 걸친다"
([00-analysis.md](00-analysis.md) §2 F)의 데이터상 표현입니다.
4마디에서 안 끊고 5마디로 넘기는 것도 같은 원리입니다.

**스윙은 데이터가 아니라 노브입니다.** 셋잇단을 못 쓰므로
Swing 노브 50(2:1) 으로 근사합니다. 다만 Fusion 계보는
**스트레이트 16분**이라 Swing 0 이 맞습니다
([../genres/06-jazz.md](../genres/06-jazz.md) §5).

---

## 3. 악구 형식

| FORM | 이 계열에서의 쓰임 |
|---|---|
| **ABAB** | 기본. `jazz_abab`(재즈 비밥) — 주제와 응답의 계속된 교대 |
| **AABA** | `jazz_aaba`(재즈 발라드) — 32마디 스탠더드 폼의 절반 |
| AABB | `jazz_aabb`(재즈 절-후렴) |

**AABA 가 재즈의 원형 폼입니다.** 스탠더드의 32마디가
A(8)–A(8)–B(8, 브리지)–A(8) 이고, 이 도구의 16마디는 그 절반 축척입니다.
`FORM.AABA = [0,0,1,0]` 이 그대로 그 구조입니다.

그럼에도 `MELODY_KIT` 이 **ABAB 를 먼저** 두는 하위분기가 많은 것은
(Bebop 계보 · Latin Jazz · Fusion 계보) 즉흥 연주의 인상 —
주제를 두 번 말하지 않고 계속 바꾸는 쪽 — 을 우선했기 때문입니다.

**긴 판** — 이 계열 재료의 32·64루프 키입니다
([README.md](README.md) §4-1).

| 길이 | 키 |
|---|---|
| 32루프 | `jazz_l32` · `bal_l32` · `lat_l32` · `bos_l32` · `funk_l32` · `dis_l32` |
| 64루프 | `jazz_l64` · `bal_l64` |

`jazz_l64` 의 폼 계획이 `AABA → AABB(+1) → ABAB(+2) → AABA(0)` 인데,
마지막 덩어리가 첫 덩어리로 되돌아오는 것이 곧 **재현부**입니다.
재즈 스탠더드의 32마디 AABA 를 두 바퀴 도는 구조와 성격이 같습니다.

---

## 4. 기타 리프

재즈 기타는 리프가 아니라 **컴핑**입니다. `RIFF_PHRASE` 에 재즈 전용
재료는 없고 계열 기본값이 다른 계열 것을 빌려 옵니다.

```
RIFF_KIT_CAT.F = ['funk_call','arp_folk']
```

| 빌려 온 키 | 왜 |
|---|---|
| `funk_call` (funkA/funkB · ABAB) | 컴핑은 정박을 비우고 앞뒤를 치는 리듬 연주 — 커팅과 자리가 같습니다 |
| `arp_folk` (arpA/arpB · AABA) | 발라드·보사의 아르페지오 컴핑 |

`RIFF_KIT` 에 F 계열 하위분기 항목은 **하나도 없습니다.**

---

## 5. 베이스 라인

이 계열의 핵심입니다. **워킹 베이스**가 화성을 혼자 설명합니다.

| 키 | 생김새 | 관습 |
|---|---|---|
| `bwalA` / `bwalB` | `'0---1---2---3---'` | **4분 순차진행.** 다음 코드에 걸어서 이어 줌 |

`bwalA` 는 1마디 0→1→2→3 상행, 2마디 4→3→2→1 하행으로 되받습니다.
실측 순차 비율 **0.97~0.98** — 전 데이터 중 가장 높습니다.
워킹 베이스는 정의상 순차가 거의 전부입니다.

| BLINE 키 | label |
|---|---|
| `bwal_abab` | 재즈 워킹 |
| `bwal_aaba` | 워킹 회귀 |

| 하위분기 | `BLINE_KIT` 값 |
|---|---|
| Bebop 계보 | `bwal_abab` · `bwal_aaba` |
| Latin Jazz | `blat_aabb` · `bwal_abab` (툼바오가 먼저) |
| Fusion 계보 | `bfun_abab` · `bwal_abab` (**펑크 베이스가 먼저**) |
| 현대 갈래 | `bwal_aaba` · `bwal_abab` |

계열 기본값 `BLINE_KIT_CAT.F = ['bwal_abab','bwal_aaba']`.
`TONE_KIT` 에서 Bebop 계보·Latin Jazz·현대 갈래는 `bass:'upright'` —
업라이트가 기본 편성입니다.

---

## 6. 코드 키 매핑

### 건반 선율

| 하위분기 | `MELODY_KIT` 값 | 근거 |
|---|---|---|
| Bebop 계보 | `jazz_abab` · `jazz_aaba` · `bal_aabb` | 지그재그 + 발라드 |
| Latin Jazz | **`lat_aabb`** · `jazz_abab` · `bos_aabb` | 클라베가 먼저 — 라틴 프레이즈 위에 재즈 어법 |
| Fusion 계보 | **`funk_aabb`** · `jazz_abab` · `dis_aabb` | 퓨전은 리듬이 펑크입니다 |
| 현대 갈래 | `jazz_aaba` · `bos_aaba` · `bal_aaba` | 부드러운 쪽 — Smooth Jazz · Acid Jazz |

계열 기본값 `MELODY_KIT_CAT.F = ['jazz_abab','jazz_aaba','bos_aabb','bal_aabb']`.

> `bos_*`(보사노바)가 F 계열 기본값에 들어 있는 것은 우연이 아닙니다.
> Bossa Jazz · Samba Jazz 가 Latin Jazz 하위분기에 있고
> ([../genres/06-jazz.md](../genres/06-jazz.md) §4),
> `PHRASE.bosA` 의 `'--a-----c-------'` 가 "정박을 피해 들어가고 길게 끄는"
> 보사 프레이즈이기 때문입니다.

---

## 7. 지표에서 벗어나는 자리

| 지표 | 벗어남 | 의도인가 |
|---|---|---|
| ① 순차 · ⑤ 음역 | 도약과 넓은 음역이 어법 | **의도.** [02-melody-theory.md](02-melody-theory.md) §10 표에 "재즈" 로 명시 |
| ④ 정점 위치 | `bwal_abab` 실측 **0.32** (목표 0.40~0.90) | **의도.** 워킹 베이스에 정점 개념이 없습니다 |
| ⑥ 서로 다른 마디 | `bwal_*` 실측 **0.38** (목표 0.40~0.75) | **의도.** 워킹은 같은 골격을 코드만 바꿔 되풀이합니다 |

---

## 8. 하위분기가 비어 있는 자리

**없습니다.** F 계열의 네 하위분기(Bebop 계보 · Latin Jazz · Fusion 계보 ·
현대 갈래)는 모두 `MELODY_KIT` · `BLINE_KIT` 에 항목이 있습니다.
전 계열 중 유일합니다.

`TONE_KIT` 에는 `현대 크로스오버` 도 F 블록에 적혀 있으나,
장르 문서상 자리는 [../genres/08-latin.md](../genres/08-latin.md) §7 이라
[17-latin.md](17-latin.md) 에서 다룹니다.

---

## 9. 레퍼런스 — 대표 아티스트 · 대표 앨범 (선율 관점)

선율 데이터를 정할 때 쓴 판단 근거입니다. 표기 규칙과 주의사항은
[../genres/00-reference.md](../genres/00-reference.md) 를 먼저 보십시오 —
**이 목록을 AI 프롬프트에 그대로 넣으면 안 됩니다.**
프롬프트에는 오른쪽 열의 **파생 서술 속성만** 씁니다.
앨범명은 미검증이며 `(확인 필요)` 표시가 있습니다.

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 선율 속성 |
|---|---|---|---|
| Bebop | Charlie Parker · Dizzy Gillespie | (확인 필요) | 빠른 8분 연속 · **근접음** · 마디선을 넘는 프레이즈 |
| Hard Bop | Art Blakey | (확인 필요) | 블루스 음정 + 스윙 · 혼의 유니즌 주제 |
| Soul Jazz | Jimmy Smith | (확인 필요) | 오르간의 반복 모티프 · 그루브 중심 |
| Cool Jazz · West Coast Jazz | Miles Davis · Chet Baker | (확인 필요) | **여백** · 긴 음 · 낮은 다이내믹 |
| Modal Jazz | Miles Davis | Kind of Blue | 코드 진행 대신 **선법** · 4도 쌓기 |
| Jazz Fusion | Weather Report | (확인 필요) | 스트레이트 16분 · 신스 리드의 넓은 도약 |
| Jazz-Funk | Herbie Hancock | Head Hunters | 로즈 · 도리안 · 리듬 우선 |
| Bossa Jazz | João Gilberto · A.C. Jobim | Getz/Gilberto | 정박을 피한 진입 · 긴 음 · 성김 |
| Smooth Jazz | — | — | 순차 · 좁은 음역 · 부드러운 백비트 |
| Acid Jazz | — | — | 브레이크비트 위의 오르간 반복구 |
