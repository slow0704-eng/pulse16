# A. Rock — 장르별 박자

> [../genres/01-rock.md](../genres/01-rock.md) 의 악기·음색 분석과 짝을 이루는 **박자 자료**입니다.
> 여기는 16스텝 패턴만, 저쪽은 악기·수치를 다룹니다.
>
> 표기: `K`킥 `S`스네어 `C`클랩 `H`클로즈햇 `O`오픈햇 `T`톰 `P`퍼커션 `B`베이스(음도)
> `X`강세 `x`보통 `o`고스트 `-`없음 · 0부터 시작, 1박=0 2박=4 3박=8 4박=12
>
> 공통 원형은 [00-archetypes.md](00-archetypes.md), 표기·스윙·그리드 한계는 [README.md](README.md).
> 값이 안 비어 있는 트랙만 적었습니다 — 줄이 없으면 그 트랙은 쉽니다.
> 이 파일은 `src/data/presets/01-rock.js` 에서 뽑아 적었습니다 — 값이 어긋나면 프리셋 파일이 맞습니다.

**수록 49종 — 골격도 49가지입니다.**

> 2026-08-17 이전에는 «골격이 같은 장르는 한 블록에 묶었습니다» 라고 적혀 있었고,
> 실제로 골격이 7개뿐이었습니다. 상속으로 파생 프리셋이 원형을 그대로 받던 탓입니다.
> 상속을 끊고([`_build.js`](../src/data/presets/_build.js)) 장르마다 박자를 다시 썼습니다.

> **2026-09-16 — 대표곡으로 교정했습니다.** 장르마다 웹에서 실재·장르 분류를 확인한
> 곡 3~5곡([../genres/01-rock.md](../genres/01-rock.md) «대표곡» 표)의 드럼 골격과 대조했습니다.
> 크게 바뀐 곳: 갤럽이 Heavy Metal 에서 **NWOBHM** 으로 옮겨 갔고(대표곡 4곡 모두 곧은 8분),
> Death Metal 의 **비어 있던 심벌**을 채웠고, Sludge·Stoner·Dream Pop 을 **하프타임**으로,
> Gothic Rock 을 **16분 햇 위 반박 체감**으로, Hardcore 를 **스캥크 비트**로 바꿨습니다.
> 곡 단위 드럼 출처가 없는 D-beat 는 그대로 두었습니다.

---

## Psychedelic · Krautrock  (5종)

```
 Motorik                142 BPM  swing  0      ← 스네어 자리만 뺀 8분 킥, 필인 없음 — Hallogallo·Mother Sky
  K X-x---x-X-x---x-
  S ----X-------X---
  H X-x-X-x-X-x-X-x-
  B 0-0-0-0-0-0-0-0-

 Psychedelic Rock       125 BPM  swing  0      ← 탐 굴림 + 탬버린 8분 · 베이스는 한 음 오스티나토(Tomorrow Never Knows)
  K X-----x-X-------
  S ----X-------X-o-
  H x-x-x-x-x-x-x-x-
  T --------x-x-x-x-
  P x-x-x-x-x-x-x-x-
  B 0-0-0-0-0-0-0-2-

 Acid Rock              130 BPM  swing  0      ← 퍼즈 리프에 베이스 유니즌 · 필인이 많다(모토릭과 정반대)
  K X-----x-X-x-----
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  O --------------x-
  T -----------x-xxx
  B 0-0-3-3-0-0-3-3-

 Space Rock             120 BPM  swing  0      ← 8분으로 몰아치는 킥 + 반복 리프 베이스 — Silver Machine
  K X-x---x-X-----x-
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  O ------x-------x-
  T ------------x-x-
  B 0-0-0-0-0-0-3-2-

 Krautrock              110 BPM  swing  0      ← Can 의 느린 펑크형 — 16분 고스트 햇 위 짧은 베이스 오스티나토
  K X-----x-X-x-----
  S ----X-------X---
  H x-xxx-xxx-xxx-xx
  B 0--0--0-3-0-----
```

## Hard Rock  (3종)

```
 Rock                   115 BPM  swing  0      ← 킥 1·3박(+3박 뒤) 백비트 — 대표곡 5곡이 88~125 BPM
  K X-------X-x-----
  S ----X-------X---
  H X-x-X-x-X-x-X-x-
  T -------------x-x
  B 0-0-0-0-0-0-0-0-

 Southern Rock          100 BPM  swing  8      ← 셔플이 아니라 뒤로 기대는 스트레이트(swing 8) + 스네어 고스트
  K X-------X--x----
  S ----X--o----X---
  H X-x-X-x-X-x-X-x-
  T ------------x-x-
  B 0-0-3-0-5-0-3-0-

 Glam Rock              125 BPM  swing 10      ← 4분 스톰프 킥 + 2·4박 박수 + 탬버린 8분
  K X---X---X---X---
  S ----X-------X---
  C ----X-------X---
  O --------------x-
  T ------------x-x-
  P x-x-x-x-x-x-x-x-
  B 0-0-0-0-0-0-0-0-
```

## Punk  (7종)

```
 Punk                   180 BPM  swing  0      ← 8분 다운스트로크 I–IV–V — 기타·베이스가 같은 리듬
  K X-----x-X-------
  S ----X-------X---
  H X-x-X-x-X-x-X-x-
  B 0-0-0-0-2-2-3-3-

 Pop Punk               170 BPM  swing  0      ← 펑크 골격 + 2·4박 핸드클랩 · 오픈햇 한 방
  K X-----x-X-x-----
  S ----X-------X---
  C ----X-------X---
  H X-x-X-x-X-x-X-x-
  O ------------x---
  T -------------x-x
  B 0-0-0-0-4-4-4-4-

 Hardcore Punk          200 BPM  swing  0      ← 스캥크 비트 — 킥과 스네어가 8분을 번갈아
  K X---x---X---x---
  S --X---X---X---X-
  H X-x-X-x-X-x-X-x-
  B 0-0-0-0-0-0-0-0-

 Punk Rock              175 BPM  swing  0      ← 펑크 골격 + 톰 굴림 · 리프형 선율 베이스(Neat Neat Neat)
  K X-----x-X-------
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  T ------------xxxx
  B 0-0-2-2-3-3-2-2-

 Crust                  150 BPM  swing  0      ← D-beat 골격에 톰 부족 리듬 — 원래 미드템포라 150
  K X--x--X-X--x--X-
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  T --x---x---x-x-x-
  B 0---0---3---3---

 D-beat                 200 BPM  swing  0      ← 이름이 곧 패턴 — 곡 단위 드럼 출처가 없어 이전 값 유지
  K X--x--X-X--x--X-
  S ----X-------X---
  H X-x-X-x-X-x-X-x-
  O --------------x-
  B 0-0-0-0-0-0-0-0-

 Powerviolence          250 BPM  swing  0      ← 한 마디 안에서 블래스트 ↔ 하프타임 급전환
  K X-X-X-X-X-------
  S -X-X-X-X----X---
  H xxxxxxxx----x---
  T --------x-x-----
  B 00000000--0---0-
```

## Metal  (13종)

```
 Death Metal            200 BPM  swing  0      ← 블래스트 반 마디 + 더블킥 그루브 반 마디 · 심벌이 박을 끈다
  K X-X-X-X-XxXxXxXx
  S -X-X-X-X----X---
  H X-X-X-X-X-X-X-X-
  B 0000000000000000

 Nu Metal                95 BPM  swing  0      ← 힙합식 싱코페 킥 + 2·4 스네어 · 스크래치 · 신스 텍스처
  K X--x--X---X-x---
  S ----X-------X---
  H x-x-x-x-x-xXx-x-
  T ------------x-x-
  P ------------x-x-
  B 0--0--0---0-0---

 Doom                    70 BPM  swing  0      ← 한 마디에 킥 셋 · 게이트 600 — 느림 자체가 무게
  K X-------X-x-----
  S ----X-------X---
  H x---x---x---x---
  T -------------x--
  B 0-------0-------

 Heavy Metal            140 BPM  swing  0      ← 곧은 8분 록 비트(갤럽 아님) · Am–F–G 리프
  K X-------X-x-----
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  T ------------x-x-
  B 0-0-0-0-5-5-6-6-

 Thrash Metal           200 BPM  swing  0      ← 스키 비트 — 킥 4분, 스네어 뒷박 · 다운피킹 16분
  K X---X---X---X---
  S --X---X---X---X-
  H x-x-x-x-x-x-x-x-
  B 0000000000000000

 Black Metal            210 BPM  swing  0      ← 블래스트 + 16분 트레몰로 햇 · 신스 패드 한 겹
  K X-X-X-X-X-X-X-X-
  S -X-X-X-X-X-X-X-X
  H XxxxXxxxXxxxXxxx
  B 0-0-0-0-0-0-0-0-

 Stoner Rock             92 BPM  swing 10      ← 끄는 그루브 리프 · 퍼즈 베이스 유니즌
  K X-----X-X-----x-
  S ----X-------X---
  H X-x-X-x-X-x-X-x-
  T -------------x-x
  B 0--0--3-0--0--3-

 Power Metal            180 BPM  swing  0      ← 16분 더블킥 연타 + 장조 신스 · 베이스 근음 질주
  K XxxxXxxxXxxxXxxx
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  O ------------x---
  T ------------x-x-
  B 0-0-0-0-0-0-0-0-

 Metalcore              150 BPM  swing  0      ← 앞 절반 더블킥 절 → 뒤 절반 브레이크다운
  K XxXxXxXxX--X--X-
  S ----X-------X---
  H X---X---X---X---
  T ------------x-x-
  B 0-00-0-0--0-0-00

 NWOBHM                 170 BPM  swing  0      ← 갤럽은 여기서 산다 — 베이스·기타가 8분+16분 둘(The Trooper)
  K X-----x-X-----x-
  S ----X-------X---
  H X-x-X-x-X-x-X-x-
  T -------------x-x
  B 0-000-000-000-00

 Sludge                 104 BPM  swing  0      ← 하프타임 — 스네어는 3박 하나, 체감 52
  K X-----x-X--x----
  S --------X-------
  H X-x-X-x-X-x-X-x-
  O ------------x---
  T ------------x-x-
  B 0---0---3---0---

 Stoner                 124 BPM  swing  8      ← 하프타임 체감 62 · 라이드 8분 · 스윙은 약하게
  K X-------X-----x-
  S --------X-------
  H X-x-X-x-X-x-X-x-
  O --------------x-
  T ------------x-x-
  B 0-0-3-0-5-3-0---

 Symphonic Metal        125 BPM  swing  0      ← 미드템포 백비트(Nemo) · 오케스트라·합창이 나머지를 채운다
  K X-----x-X-x-----
  S ----X-------X---
  H X-x-x-x-x-x-x-x-
  O ------------x---
  T ------------x-x-
  B 0-0-0-0-3-3-3-3-
```

## 뿌리  (4종)

```
 Rock & Roll            168 BPM  swing 24      ← 부기우기 베이스 + 스윙 24 + 2·4박 탬버린 · 피아노가 뒷박
  K X-------X-------
  S ----X--o----X---
  H X-x-X-x-X-x-X-x-
  T ------------x-x-
  P ----x-------x---
  B 0-0-3-3-5-5-3-3-

 Surf Rock              160 BPM  swing  0      ← 기타 16분 트레몰로가 정체성 · 드럼은 킥 1·3박 백비트
  K X-------X-x-----
  S ----X-------X---
  H X-x-X-x-X-x-X-x-
  T --------x-x-x-x-
  P --x---x---x---x-
  B 0-0-0-0-0-0-0-0-

 Garage Rock            140 BPM  swing  0      ← 탬버린 8분 · 콤보 오르간 반복 · 스네어 끝 고스트
  K X-----x-X-------
  S ----X-------X--o
  H X-x-X-x-X-x-X-x-
  O ------------x---
  T -------------x-x
  P x-x-x-x-x-x-x-x-
  B 0-0-0-0-5-5-5-5-

 Proto-punk             145 BPM  swing  0      ← 4분 킥을 끝까지 + 썰매방울 · 피아노 8분 연타
  K X---X---X---X---
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  T -------------x-x
  P x-x-x-x-x-x-x-x-
  B 0-0-0-0-0-0-0-0-
```

## Post-punk 계보  (7종)

```
 Post-punk              150 BPM  swing  0      ← 드라이한 8분 록 비트 · 베이스가 선율(0-3-5-3-0-3-5-7)
  K X-------X-x-----
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  T -------------x-x
  B 0-3-5-3-0-3-5-7-

 Gothic Rock             84 BPM  swing  0      ← 16분 하이햇 위 반박 체감(84) + 탐 부족 리듬
  K X-------X-------
  S ----X-------X---
  H xxxxxxxxxxxxxxxx
  T --x---x---x-x-x-
  B 0-0-0-0-3-3-3-3-

 Dance-punk             130 BPM  swing  0      ← 4/4 킥 + 스네어에 겹친 클랩 + 오픈햇·카우벨 뒷박
  K X---X---X---X---
  S ----X-------X---
  C ----X-------X---
  H x-x-x-x-x-x-x-x-
  O --x---x---x---x-
  T --x---x---x---x-
  B 0-0-3-0-5-0-3-0-

 Emo                    145 BPM  swing  0      ← 폭발부 골격 — 아르페지오 기타가 16분을 채운다
  K X-----X-X-------
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  O ------------x---
  T ------------x-x-
  B 0---0---2---2---

 New Wave               130 BPM  swing  0      ← 정박 4분 킥 + 백비트, 신스가 8분 훅을 잡는다
  K X---X---X---X---
  S ----X-------X---
  H X-x-X-x-X-x-X-x-
  O ------------x---
  T ------------x-x-
  B 0-0-0-0-5-5-5-5-

 Post-punk Revival      135 BPM  swing  0      ← 타이트한 8분 록 · 근음 8분 베이스
  K X-----x-X-------
  S ----X-------X---
  H X-x-X-x-X-x-X-x-
  T -------------x-x
  B 0-0-0-0-5-5-5-5-

 Screamo                175 BPM  swing  0      ← 빠른 하드코어 스킵 비트 — 킥 8분, 스네어 뒷박
  K X-x-X-x-X-x-X-x-
  S --X---X---X---X-
  H XxxxXxxxXxxxXxxx
  T --------x-x-x-x-
  B 0-0-0-0-3-3-3-3-
```

## Alternative  (9종)

```
 Grunge                 110 BPM  swing  0      ← 스네어 고스트 + 킥 3박 뒤 · 조용함↔폭발
  K X-----x-X-x-----
  S ----X--o----X---
  H x-x-x-x-x-x-x-x-
  O ------------x---
  T ------------x-x-
  B 0---0---5---5---

 Indie Rock             112 BPM  swing  0      ← 킥 1·3박(+뒤) · 맞물린 기타 두 대 · 장조
  K X-------X-x-----
  S ----X-------X---
  H X-x-X-x-X-x-X-x-
  T -------------x-x
  B 0-0-5-0-3-0-5-0-

 Shoegaze               120 BPM  swing  0      ← 드럼은 기타 벽 밑으로 · 크래시 워시 · 게이트 320
  K X-----x-X-------
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  O --------------x-
  B 0-------0-------

 Dream Pop              150 BPM  swing  0      ← 드럼머신 반박 — 스네어 3박 하나 · 뒷박 햇 · 체감 75
  K X-------X-------
  S --------X-------
  H --x---x---x---x-
  O --------------x-
  B 0-------3-------

 Britpop                125 BPM  swing  0      ← 탬버린 8분 + 오픈햇 · 장조 찬가
  K X-----x-X-------
  S ----X-------X---
  H X-x-X-x-X-x-X-x-
  O ------------x---
  T ------------x-x-
  P x-x-x-x-x-x-x-x-
  B 0-0-0-0-5-5-5-5-

 Noise Rock             125 BPM  swing  0      ← 단순·반복적인 8분 비트 위에 반음(0↔1) 불협
  K X-x---x-X-x---x-
  S ----X-------X---
  H X-x-X-x-X-x-X-x-
  O ----------x-----
  T --------x-------
  B 0-0-0-0-0-0-0-0-

 Alternative Rock       112 BPM  swing  0      ← 우산 개념의 기준선 — 킥 1·3박(+뒤) 백비트
  K X-----x-X-x-----
  S ----X-------X---
  H X-x-X-x-X-x-X-x-
  T -------------x-x
  B 0-0-0-0-3-3-3-3-

 Lo-fi Indie            115 BPM  swing  0      ← 햇이 고르지 않다(x---x-x-) — 카세트의 흔들림 · 베이스 약하게
  K X-------X-------
  S ----X--o----X---
  H x---x-x-x---x-x-
  T ------------x---
  B 0---0---3---3---

 Slacker Rock           105 BPM  swing  8      ← 레이드백(swing 8) · 펑키한 베이스
  K X-----x-X-------
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  O --------------x-
  T -------------x-x
  B 0--0--3-0--0--3-
```

## 루츠와의 교차  (1종)

```
 Country Rock           136 BPM  swing  0      ← 근음–5도 붐칙 베이스 + 페달 스틸·밴조 · 장조
  K X-------X-------
  S ----X-------X---
  H X-x-X-x-X-x-X-x-
  T ------------x-x-
  B 0---4---0---4---
```
