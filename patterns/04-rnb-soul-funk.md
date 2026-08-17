# D. R&B · Soul · Funk — 장르별 박자

> [../genres/04-rnb-soul-funk.md](../genres/04-rnb-soul-funk.md) 의 악기·음색 분석과 짝을 이루는 **박자 자료**입니다.
> 여기는 16스텝 패턴만, 저쪽은 악기·수치를 다룹니다.
>
> 표기: `K`킥 `S`스네어 `C`클랩 `H`클로즈햇 `O`오픈햇 `T`톰 `P`퍼커션 `B`베이스(음도)
> `X`강세 `x`보통 `o`**고스트** `-`없음 · 0부터 시작, 1박=0 2박=4 3박=8 4박=12
>
> ⚠ 이 계열은 **고스트가 장르의 정체성**입니다. 16분을 전부 `x` 로 적으면
> 펑크가 되지 않습니다 — 표기 규칙은 [README.md](README.md) §1.
> 값이 안 비어 있는 트랙만 적었습니다 — 줄이 없으면 그 트랙은 쉽니다.

**수록 24종 — 골격도 24가지입니다.**

> 2026-08-17 이전에는 «골격이 같은 장르는 한 블록에 묶었습니다» 라고 적혀 있었고,
> 실제로 골격이 7개뿐이었습니다. 상속으로 파생 프리셋이 원형을 그대로 받던 탓입니다.
> 상속을 끊고([`_build.js`](../src/data/presets/_build.js)) 장르마다 박자를 다시 썼습니다 —
> 이제 **묶인 블록이 없습니다.**

---

## Funk  (8종)

```
 Disco Funk             116 BPM  swing 22      ← 4/4 + 오픈햇 뒷박 + 16분 베이스
  K X---X---X---X---
  S ----X--o----X---
  H X-x-X-x-X-x-X-x-
  O --x---x---x---x-
  T -------------x-x
  P --x---x---x---x-
  B 0-05-0-53-05-0-3

 Funk                   100 BPM  swing 16      ← «on the one» — 1박에 모든 것, 나머지는 고스트
  K X-------X-x-----
  S ----X--o----X--o
  H XoxoXoxoXoxoXoxo
  P --x---x---x---x-
  B 0-0-0--05--3-0--

 P-Funk                 105 BPM  swing 10      ← 뒤 고스트를 한 칸 당겨 더 느슨하게 · 스윙 10
  K X-------X-x-----
  S ----X--o----X-o-
  H XoxoXoxoXoxoXoxo
  P --x---x---x---x-
  B 0-0-0--05--3-0--

 Jazz-Funk              115 BPM  swing  0      ← 킥이 더 잘게 쪼개지고 햇에 16분 하나가 더 붙는다
  K X--x--X-X-x-----
  S ----X--o----X-o-
  H XoxoXoxoXoxxXoxo
  T ------------x-x-
  P --x---x---x---x-
  B 0-0-5--03--5-0--

 Boogie                 112 BPM  swing  0      ← 신스 베이스가 16분으로 통통 튄다
  K X---X---X---X---
  S ----X-------X---
  H X-x-X-x-X-x-X-x-
  O --x---x---x---x-
  T -------------x-x
  P --x---x---x---x-
  B 0-0-0-5-3-0-5-3-

 Electro-funk           118 BPM  swing  0      ← 드럼머신 16분 — 고스트 없이 강세만
  K X-------X-x-----
  S ----X-------X---
  C --------------x-
  H XxxxXxxxXxxxXxxx
  P --x---x---x---x-
  B 0-0-0--05--3-0--

 JB Funk                100 BPM  swing 14      ← 스네어 고스트 넷 — 혼 섹션이 1박을 같이 때린다
  K X-------X-x-----
  S --o-X--o--o-X--o
  H XoxoXoxoXoxoXoxo
  P --x---x---x---x-
  B 0--0--0-0---3-0-

 Post-disco             113 BPM  swing  0      ← 디스코가 식은 자리 — 킥이 8분 뒤로 물러난다
  K X---X-x-X---X---
  S ----X-------X-o-
  H X-x-X-x-X-xxX-x-
  T -------------x-x
  P --x---x---x---x-
  B 0-0-0-5-0-0-3-0-
```

## Contemporary R&B  (6종)

```
 New Jack Swing         112 BPM  swing 34      ← 스윙 34 + 게이트 스네어 — 힙합 드럼을 R&B 에
  K X-----x-X-x-----
  S ----X--o----X---
  C ----x-------x---
  H X-x-X-x-X-x-X-x-
  T ------------x-x-
  B 0---0-3-5---3---

 Quiet Storm             72 BPM  swing  0      ← 72 BPM · 4분 햇 — 색소폰이 선율
  K X-------X---x---
  S ----X-------X---
  H x---x---x---x---
  T ------------x---
  B 0---0---5---3---

 Hip Hop Soul            96 BPM  swing 30      ← 붐뱁 드럼 위의 소울 보컬
  K X--x----X---x---
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  O --------------x-
  B 0--0----5---3---

 90s R&B                 95 BPM  swing 30      ← 스윙 30 의 16분 + 스네어 고스트
  K X-----x-X-x-----
  S ----X--o----X---
  C ----x-------x---
  H x-x-x-x-x-x-x-x-
  T -------------x-x
  B 0-0-3-0-5-0-3-0-

 Alternative R&B         75 BPM  swing  0      ← 성긴 드럼 · 박을 일부러 흘린다
  K X-------X-------
  S --------X-------
  C ----x---X---x---
  H x-x-x-xxx-x-x-xx
  B 0-------5-------

 Trap Soul              138 BPM  swing  0      ← 트랩 골격 + R&B 화성 — 808 이 3박 뒤로 흐른다
  K X-----x-X---x-x-
  S --------X-------
  C --------x-------
  H x-xxx-x-x-xx--xx
  O ------------x---
  B 0-------5---3---
```

## Soul  (5종)

```
 Motown                 125 BPM  swing  0      ← 겹친 백비트(스네어+클랩) + 8분 탬버린
  K X-------X-------
  S ----X--o----X---
  C ----X-------X---
  H x-x-x-x-x-x-x-x-
  P x-x-x-x-x-x-x-x-
  B 0-0-3-5-0-0-3-5-

 Philadelphia Soul      118 BPM  swing  0      ← 오픈햇 뒷박 + 스트링 — 디스코 직전
  K X---X-x-X---X---
  S ----X-------X---
  H X-x-X-x-X-x-X-x-
  O --x---x---x---x-
  T -------------x-x
  P --x---x---x---x-
  B 0---5---3---5---

 Memphis Soul           100 BPM  swing  0      ← 뒤로 끄는 그루브 + 혼 섹션
  K X-----x-X---x---
  S ----X--o----X---
  H x-x-x-x-x-x-x-x-
  T ------------x---
  P --x---x---x---x-
  B 0-0-3-0-5-3-0---

 Northern Soul          130 BPM  swing  0      ← 킥 8분 전부 + 핸드클랩 — 빠른 스톰프
  K X-x-X-x-X-x-X-x-
  S ----X-------X---
  C ----X-------X---
  H X-x-X-x-X-x-X-x-
  T -------------x-x
  P x-x-x-x-x-x-x-x-
  B 0-0-0-0-5-5-3-3-

 Psychedelic Soul       105 BPM  swing  0      ← 와우 기타 + 톰 — 소울에 사이키델릭 음향
  K X--x--x-X---x---
  S ----X--o----X---
  H x-x-x-x-x-x-x-x-
  O ------------x---
  T ------------x-x-
  P --x---x---x---x-
  B 0--0--0-5---3---
```

## Disco  (4종)

```
 Disco                  118 BPM  swing  0      ← 4/4 · 오픈햇 뒷박 · 16분 베이스 — 디스코의 정의
  K X---X---X---X---
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  O --x---x---x---x-
  T -------------x-x
  P --x---x---x---x-
  B 0-0-5-0-3-0-5-3-

 Hi-NRG                 134 BPM  swing  0      ← 옥타브 베이스 8분 — 디스코를 기계로 밀어붙인다
  K X---X---X---X---
  S ----X-------X---
  C ----x-------x---
  H x-x-x-x-x-x-x-x-
  O --x---x---x---x-
  T ------------x-x-
  P --x---x---x---x-
  B 0-5-0-5-0-5-0-5-

 Italo Disco            124 BPM  swing  0      ← 멜로디 우선 — 신스 리드와 보코더
  K X---X---X---X---
  S ----X-------X---
  C --------------x-
  H x-x-x-x-x-x-x-x-
  O --x---x---x---x-
  T ------------x-x-
  P --x---x---x---x-
  B 0-0-0-5-0-0-3-5-

 Euro Disco             124 BPM  swing  0      ← 스트링 중심 — 햇 강세로 밀고 나간다
  K X---X---X---X---
  S ----X-------X---
  H X-x-X-x-X-x-X-x-
  O --x---x---x---x-
  T -------------x-x
  P --x---x---x---x-
  B 0---5---3---5---
```

## 뿌리  (1종)

```
 Rhythm & Blues         130 BPM  swing 30      ← 셔플 30 + 혼 — 로큰롤로 갈라지기 직전
  K X---x-X-X---x---
  S ----X--o----X---
  H X-x-X-x-X-x-X-x-
  T -------------x-x
  P --x---x---x---x-
  B 0-0-3-3-5-5-3-3-
```
