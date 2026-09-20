# J. African — 장르별 박자

> [../genres/10-african.md](../genres/10-african.md) 의 악기·음색 분석과 짝을 이루는 **박자 자료**입니다.
>
> 표기: `K`킥 `S`스네어 `C`클랩 `H`클로즈햇 `O`오픈햇 `T`톰 `P`퍼커션 `B`베이스(음도)
> `X`강세 `x`보통 `o`고스트 `-`없음 · 0부터 시작, 1박=0 2박=4 3박=8 4박=12
>
> ⚠ **Afrobeat(단수)·Jùjú·Mbalax 처럼 12/8 폴리리듬인 장르는 여기 없습니다** —
> 16스텝 그리드로 표현되지 않아 프리셋을 만들지 않았습니다(genres/10-african.md).
> 값이 안 비어 있는 트랙만 적었습니다.

**수록 22종 — 골격도 22가지입니다.**

> 2026-08-17 이전에는 «골격이 같은 장르는 한 블록에 묶었습니다» 라고 적혀 있었고,
> 실제로 골격이 7개뿐이었습니다. 상속으로 파생 프리셋이 원형을 그대로 받던 탓입니다.
> 상속을 끊고([`_build.js`](../src/data/presets/_build.js)) 장르마다 박자를 다시 썼습니다 —
> 이제 **묶인 블록이 없습니다.**

---

## 서아프리카  (6종)

```
 Afrobeats              110 BPM  swing 26      ← 3-3-2 킥 + 셰케레 16분 — 아프로비츠의 골격
  K X--x--X---x--x--
  S ----x-------x---
  C ------x-----x---
  H x-xxx-x-x-xxx-x-
  T --------x---x-x-
  P x-xxx-x-x-xxx-x-
  B 0--3--5---3--0--

 Highlife               115 BPM  swing 30      ← 스윙 30 — 베이스가 3도·5도를 돈다
  K X---X---X---X---
  C ----x-------x---
  H x-xxx-x-x-xxx-x-
  T --x---x-x---x-x-
  P x-xxx-x-x-xxx-x-
  B 0--0--3-5--3--0-

 Hiplife                105 BPM  swing  0      ← 하이라이프 + 힙합 — 킥이 앞으로 당겨진다
  K X--x--X-X---x---
  S ----X-------X---
  C ----x-------x---
  H x-xxx-x-x-xxx-x-
  T --x---x-x---x-x-
  P x-xxx-x-x-xxx-x-
  B 0--0--0-5--5--3-

 Coupé-décalé           122 BPM  swing  0      ← 코트디부아르의 클럽 — 킥이 8분 뒤를 민다
  K X---X-x-X---X-x-
  C ----x-------x---
  H x-xxx-x-x-xxx-x-
  T --x---x-x---x-x-
  P x-xxx-x-x-xxx-x-
  B 0--0--5---3--0--

 Desert Blues           100 BPM  swing  0      ← 순환하는 기타 — 6/8 에 가까운 느낌
  K X-----X---X-----
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  T --x---x---x---x-
  P x--x--x---x-x---
  B 0-----3-0-----5-

 Fuji                   120 BPM  swing  0      ← 요루바 타악 — 토킹드럼이 선율처럼 말한다
  K X---X---X---X---
  C ----x-------x---
  H x-xxx-x-x-xxx-x-
  T x--x-x-x--x-x-x-
  P x-xxx-xxx-xxx-xx
  B 0--0--5---3--0--
```

## House 계열  (2종)

```
 Amapiano               113 BPM  swing 28      ← 로그드럼이 선율을 맡는다 · 스윙 28
  K X---X---X---X---
  C ------x-----x---
  H --x-x---x-x-x-x-
  O ------------x---
  T ----x-------x-x-
  P --x---x---x---x-
  B 0---0-3---5---3-

 Afro House             122 BPM  swing 16      ← 4/4 + 콩가 — 하우스에 아프리카 타악
  K X---X---X---X---
  C ----x-------x---
  H x-xxx-x-x-xxx-x-
  T --x---x-x---x-x-
  P --x---x---x---x-
  B 0--0--3---5--0--
```

## 남아프리카  (5종)

```
 Kwaito                 105 BPM  swing 18      ← 느린 하우스 — 베이스가 성기다
  K X---X---X---X---
  C ----x-------x---
  H x-x-x-x-x-x-x-x-
  O --------------x-
  P x-x-x-x-x-x-x-x-
  B 0-------0---3---

 Mbaqanga               115 BPM  swing  0      ← 타운십 자이브 — 백비트가 뚜렷하다
  K X---X---X---X---
  S ----X-------X---
  C ----x-------x---
  H x-x-x-x-x-x-x-x-
  T --x---x-x---x-x-
  P x-x-x-x-x-x-x-x-
  B 0-0-3-3-5-5-3-3-

 Gqom                   127 BPM  swing 28      ← 브로큰 킥 + 스윙 28 — 더반의 클럽
  K X---------X-----
  S ----X-------X---
  C ----x-------x---
  H -x-xx-x--x-xx-x-
  O --------------x-
  P x-x-x-x-x-x-x-x-
  B 0---0-3---5-0---

 Marabi                 105 BPM  swing  0      ← 남아공의 초기 재즈 — 피아노가 순환한다
  K X-------X-------
  S ----X-------X---
  C ----x-------x---
  H x-x-x-x-x-x-x-x-
  P x-x-x-x-x-x-x-x-
  B 0---3---5---3---

 Afro Tech              124 BPM  swing  0      ← 4/4 테크노 + 아프리카 타악
  K X---X---X---X---
  C ----x-------x---
  H x-x-x-x-x-x-x-x-
  T --x---x-x---x-x-
  P --x-x---x-x-x---
  B 0---0-3---5---0-
```

## 중앙아프리카  (3종)

```
 Soukous                145 BPM  swing  0      ← 세베네 — 기타가 16분으로 달린다
  K X---X---X---X---
  S ----X-------X---
  H x-xxx-x-x-xxx-x-
  T --x---x---x---x-
  P x-x-x-x-x-x-x-x-
  B 0-3-5-3-0-3-5-3-

 Congolese Rumba        115 BPM  swing  0      ← 쿠바 룸바의 역수입 — 봉고가 8분
  K X-----X-----X---
  S ----x---x-------
  H x-x-x-x-x-x-x-x-
  T --x---x---x---x-
  P x-x-x-x-x-x-x-x-
  B 0-----3-----5---

 Ndombolo               145 BPM  swing  0      ← 세베네를 더 빠르게 — 톰이 16분
  K X---X-x-X---X-x-
  S --x---x---x---x-
  C ----x-------x---
  H x-xxx-x-x-xxx-x-
  T --x---x-x---x-x-
  P x-x-x-x-x-x-x-x-
  B 0-3-5-3-0-3-5-0-
```

## 동아프리카  (3종)

```
 Ethio-jazz             110 BPM  swing 50      ← 스윙 50 — 에티오피아 음계의 재즈
  K X-------X-------
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  P x-xxx-x-x-xxx-x-
  B 0---0---3---3---

 Bongo Flava            105 BPM  swing  0      ← 탄자니아 — 킥이 3-3-2 로 걸린다
  K X--x--X---x-X---
  S ----X-------X---
  C ----x-------x---
  H x-xxx-x-x-xxx-x-
  T --x---x-x---x-x-
  P x-xxx-x-x-xxx-x-
  B 0--0--3-5--3----

 Gengetone              110 BPM  swing  0      ← 케냐의 거친 클럽 — 햇이 두 번씩 끊긴다
  K X--X--X---X--X--
  S ----X-------X---
  C ----x-------x---
  H x-xx--x-x-xx--x-
  T --x---x-x---x-x-
  P x-xxx-x-x-xxx-x-
  B 0--0--5-0--3--0-
```

## 북아프리카  (3종)

```
 Raï                    120 BPM  swing  0      ← 알제리 — 다르부카와 탬버린이 골격
  K X--x--X-X--x----
  S ----X-------X-x-
  C ----x-------x---
  H x-xxx-x-x-xxx-x-
  T ------------x-x-
  P x-xxx-x-x-xxx-x-
  B 0-0-0-5-0-0-3-0-

 Mahraganat             115 BPM  swing  0      ← 이집트 거리 음악 — 스네어가 세 번
  K X--X--X---X-X---
  S ----X---X---X---
  C ----x-------x---
  H x-xxx-x-x-xxx-x-
  T --x---x-x---x-x-
  P x-xxx-xxx-xxx-xx
  B 0--0--0-3--3--5-

 Shaabi                 115 BPM  swing  0      ← 이집트 대중음악 — 다르부카가 3-3-2
  K X--x--X-X--x--X-
  S ----X-------X---
  C ----x-------x---
  H x-xxx-x-x-xxx-x-
  T --x-x---x-x-x---
  P x-x-x-x-x-x-x-x-
  B 0--0--3-0--0--5-
```
