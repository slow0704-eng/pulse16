# I. Caribbean — 장르별 박자

> [../genres/09-caribbean.md](../genres/09-caribbean.md) 의 악기·음색 분석과 짝을 이루는 **박자 자료**입니다.
>
> 표기: `K`킥 `S`스네어 `C`클랩 `H`클로즈햇 `O`오픈햇 `T`톰 `P`퍼커션 `B`베이스(음도)
> `X`강세 `x`보통 `o`고스트 `-`없음 · 0부터 시작, 1박=0 2박=4 3박=8 4박=12
>
> ⚠ **원-드롭은 1박이 비어 있어야 합니다.** 1박에 킥을 넣으면 스테퍼스가 되어
> 다른 장르가 됩니다 — 이 계열에서는 «킥의 자리»가 곧 장르명입니다.
> 값이 안 비어 있는 트랙만 적었습니다.

**수록 23종 — 골격도 23가지입니다.**

> 2026-08-17 이전에는 «골격이 같은 장르는 한 블록에 묶었습니다» 라고 적혀 있었고,
> 실제로 골격이 7개뿐이었습니다. 상속으로 파생 프리셋이 원형을 그대로 받던 탓입니다.
> 상속을 끊고([`_build.js`](../src/data/presets/_build.js)) 장르마다 박자를 다시 썼습니다 —
> 이제 **묶인 블록이 없습니다.**

---

## 자메이카  (4종)

```
 Reggae One Drop         75 BPM  swing 12      ← 1박이 비어 있다 — 킥·스네어가 3박에 함께
  K --------X-------
  S --------X-------
  H --x---x---x---x-
  B 0-----0-3-----5-

 Ska                    140 BPM  swing  0      ← 4박 워킹 + 오프비트 스캥크
  K X---X---X---X---
  S ----X-------X---
  H --x---x---x---x-
  B 0-0-3-3-5-5-3-3-

 Mento                  115 BPM  swing  0      ← 밴조와 룸바박스 — 자메이카의 포크
  K X-------X-------
  S ------x-----x---
  H --x---x---x---x-
  B 0---5---0---5---

 Rocksteady              90 BPM  swing  0      ← 스카를 늦춘 것 — 베이스가 굵고 성기다
  K X-------X-------
  S ----X-------X---
  H --x---x---x---x-
  B 0-0-3---5-0-3---
```

## 트리니다드 · 바베이도스  (5종)

```
 Soca                   155 BPM  swing  0      ← 아이언 16분 + 빠른 2박 — 카니발의 추진력
  K X---X---X---X---
  S --x---x---x---x-
  C ----X-------X---
  H XxxxXxxxXxxxXxxx
  T --x-x---x-x-x---
  P xxxxxxxxxxxxxxxx
  B 0-0-0-0-0-0-0-0-

 Calypso                125 BPM  swing  0      ← 소카의 전신 — 느리고 가사가 주역
  K X-------X-------
  S ----X--x----X--x
  H --x---x---x---x-
  P x-xxx-x-x-xxx-x-
  B 0-0-3---5-3-0---

 Power Soca             168 BPM  swing  0      ← 가장 빠른 소카 — 킥 4박 + 16분 아이언
  K X---X---X---X---
  S --x---x---x---x-
  H XxxxXxxxXxxxXxxx
  P x-xxx-xxx-xxx-xx
  B 0-0-0-0-0-0-0-0-

 Groovy Soca            125 BPM  swing  0      ← 느린 소카 — 몸을 흔드는 쪽
  K X---X---X---X---
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  P x-xxx-x-x-xxx-x-
  B 0---0-3-5---3---

 Chutney Soca           145 BPM  swing  0      ← 돌락이 들어온 소카 — 킥이 3-3-2
  K X--X--X-X--X--X-
  S ----X-------X---
  H --x---x---x---x-
  T --x-x---x-x-x---
  P x-xxx-xxx-xxx-xx
  B 0--0--5-0--0--3-
```

## 프랑스어권 카리브  (4종)

```
 Zouk                   120 BPM  swing 12      ← 16분 베이스가 굴러간다
  K X-----x-X-------
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  O --------------x-
  P x-x-x-x-x-x-x-x-
  B 0-0-3-0-5-0-3-0-

 Kompa                  115 BPM  swing  0      ← 아이티의 느린 2박 — 스네어가 박 사이에
  K X-------X-------
  S ------x-----x---
  H --x---x---x---x-
  P x-x-x-x-x-x-x-x-
  B 0---3---0---5---

 Zouk Love              100 BPM  swing  0      ← 가장 느린 갈래 — 4분 햇
  K X-------X---x---
  S ----X-------X---
  H x---x---x---x---
  P x-x-x-x-x-x-x-x-
  B 0-------3---5---

 Bouyon                 135 BPM  swing  0      ← 도미니카의 빠른 갈래 — 킥이 3-3-2
  K X--X--X-X--X--X-
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  P x-xxx-x-x-xxx-x-
  B 0--0--3-5--5--0-
```

## Reggae 갈래  (4종)

```
 Lovers Rock             80 BPM  swing  0      ← 원-드롭 + 소울 화성 — 셰이커가 8분
  K --------X-------
  S --------X-------
  H --x---x---x---x-
  P x-x-x-x-x-x-x-x-
  B 0-----0-5-----3-

 Roots Reggae            75 BPM  swing  0      ← 원-드롭에 타악과 톰이 붙는다
  K --------X-------
  S --------X-------
  H --x---x---x---x-
  T ------------x-x-
  P --x---x---x---x-
  B 0-------3-5-----

 Rockers                 80 BPM  swing  0      ← «밀리턴트» — 킥이 4박 전부, 스네어는 3박
  K X---X---X---X---
  S --------X-------
  H --x---x---x---x-
  T --------------x-
  B 0-----0-3-----5-

 Steppers                80 BPM  swing  0      ← 1박에 킥이 들어간다 — 원-드롭이 아니게 되는 지점
  K X---X---X---X---
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  B 0---3---5---3---
```

## Dancehall 계보  (6종)

```
 Dancehall               98 BPM  swing  0      ← 뎀보우 — 스네어가 3-3-2
  K X-------X-------
  S ---x--x----x--x-
  C ----x-------x---
  H x-x-x-x-x-x-x-x-
  B 0--0--0-5--5--3-

 Ragga                  100 BPM  swing  0      ← 디지털 리딤 — 베이스가 화음을 오간다
  K X-------X---x---
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  B 0---3-5-0---3---

 Digital Dancehall      100 BPM  swing  0      ← 슬렝텡 — 8분 베이스가 기계처럼
  K X-------X-------
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  B 0-0-3-3-0-0-5-5-

 Dembow riddim          100 BPM  swing  0      ← 레게톤으로 건너간 그 리듬
  K X-------X-------
  S ---x--x----x--x-
  H --x---x---x---x-
  B 0--0--0-5--5--3-

 Bashment               100 BPM  swing  0      ← 현대 댄스홀 — 16분 햇
  K X--x----X---x---
  S ----X-------X---
  C ----x-------x---
  H x-xxx-x-x-xxx-x-
  B 0-------5---3---

 Afro-dancehall         103 BPM  swing  0      ← 아프로비츠의 3-3-2 가 들어온 댄스홀
  K X--x--X---x--x--
  S ----x-------x---
  H x-xxx-x-x-xxx-x-
  P x-x-x-x-x-x-x-x-
  B 0--3--5---3--0--
```
