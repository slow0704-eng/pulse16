# D. R&B · Soul · Funk — 장르별 박자

> [../genres/04-rnb-soul-funk.md](../genres/04-rnb-soul-funk.md) 의 악기·음색 분석과 짝을 이루는 **박자 자료**입니다.
> 여기는 16스텝 패턴만, 저쪽은 악기·수치를 다룹니다.
>
> 표기: `K`킥 `S`스네어 `C`클랩 `H`클로즈햇 `O`오픈햇 `T`톰 `P`퍼커션 `B`베이스(음도)
> `X`강세 `x`보통 `o`고스트 `-`없음 · 0부터 시작, 1박=0 2박=4 3박=8 4박=12
>
> 공통 원형은 [00-archetypes.md](00-archetypes.md), 표기·스윙·그리드 한계는 [README.md](README.md).
> 값이 안 비어 있는 트랙만 적었습니다 — 줄이 없으면 그 트랙은 쉽니다.
> 이 파일은 `src/data/presets/04-rnb-funk.js` 에서 뽑아 적었습니다 — 값이 어긋나면 프리셋 파일이 맞습니다.

**수록 24종 — 골격도 24가지입니다.**

> 2026-08-17 이전에는 «골격이 같은 장르는 한 블록에 묶었습니다» 라고 적혀 있었고,
> 실제로 골격이 몇 개뿐이었습니다. 상속으로 파생 프리셋이 원형을 그대로 받던 탓입니다.
> 상속을 끊고([`_build.js`](../src/data/presets/_build.js)) 장르마다 박자를 다시 썼습니다.

> **2026-09-18 — 대표곡으로 교정했습니다.** 장르마다 웹에서 실재·장르 분류를 확인한
> 곡([../genres/04-rnb-soul-funk.md](../genres/04-rnb-soul-funk.md) «대표곡» 표)과 대조해 어긋난 박자·악기를 고쳤습니다.
> 곡의 선율이나 리프를 옮겨 적은 곳은 없습니다 — 템포·편성·드럼 골격만 맞췄습니다.
>
> ⚠ 이 계열은 **장르 문서가 템포를 거의 말하지 않습니다.** BPM 범위를 못 박은 것은
> Boogie(110~116) · Hi-NRG(120~140) 둘뿐이고, 나머지는 곡 단위 실측이거나 근거가 없습니다.
> 그리고 **Hot 100 1위만으로 대표를 뽑으면 이 계열의 절반이 빕니다** — JB Funk·P-Funk·
> Boogie·Post-disco·Italo Disco·Electro-funk·Alternative R&B 는 1위 곡이 하나도 없습니다.

---

## 뿌리  (1종)

```
 Rhythm & Blues         130 BPM  swing 30      ← 부기 셔플 위의 혼과 피아노 — 12마디 블루스라 세븐스가 기본이다
  K X---x-X-X---x---
  S ----X--o----X---
  H X-x-X-x-X-x-X-x-
  T -------------x-x
  B 0-0-3-3-5-5-3-3-
```

## Soul  (5종)

```
 Motown                 125 BPM  swing  0      ← 탬버린이 2·4를 떠받치고 드럼이 둘 겹친다. 걷는 베이스
  K X-------X-------
  S ----X--o----X---
  C ----X-------X---
  H x-x-x-x-x-x-x-x-
  P x-x-x-x-x-x-x-x-
  B 0-0-3-5-0-0-3-5-

 Philadelphia Soul      118 BPM  swing  0      ← 현이 가장 앞, 그 위에 비브라폰. 뒷박 오픈햇이 디스코로 이어진다
  K X---X-x-X---X---
  S ----X-------X---
  H X-x-X-x-X-x-X-x-
  O --x---x---x---x-
  T -------------x-x
  P --x---x---x---x-
  B 0---5---3---5---

 Memphis Soul           100 BPM  swing  0      ← 혼이 유니즌으로 불고 박수가 백비트를 받는다 — 12마디 블루스 어휘
  K X-----x-X---x---
  S ----X--o----X---
  C ----X-------X---
  H x-x-x-x-x-x-x-x-
  T ------------x---
  P --x---x---x---x-
  B 0-0-3-0-5-3-0---

 Northern Soul          130 BPM  swing  0      ← 4분 킥을 밟는 «스톰퍼». 100 이상이라는 하한만 출처가 있다
  K X-x-X-x-X-x-X-x-
  S ----X-------X---
  C ----X-------X---
  H X-x-X-x-X-x-X-x-
  T -------------x-x
  P x-x-x-x-x-x-x-x-
  B 0-0-0-0-5-5-3-3-

 Psychedelic Soul       105 BPM  swing  0      ← 와우와 퍼즈, 콩가. 소울 다섯 중 유일하게 단조다
  K X--x--x-X---x---
  S ----X--o----X---
  H x-x-x-x-x-x-x-x-
  O ------------x---
  T ------------x-x-
  P --x---x---x---x-
  B 0--0--0-5---3---
```

## Funk  (8종)

```
 JB Funk                100 BPM  swing 14      ← «On the one» — 1박 단독 킥에 고스트 스네어 넷. 혼이 골격의 절반이다
  K X-------X-x-----
  S --o-X--o--o-X--o
  H XoxoXoxoXoxoXoxo
  P --x---x---x---x-
  B 0--0--0-0---3-0-

 Funk                   108 BPM  swing 16      ← 클라비넷 16분에 슬랩/팝. 정박을 비우고 앞뒤에 음을 둔다
  K X-------X-x-----
  S ----X--o----X--o
  H XoxoXoxoXoxoXoxo
  P --x---x---x---x-
  B 0-0-0--05--3-0--

 P-Funk                 105 BPM  swing 10      ← 무그가 베이스 기타를 대신한다. 보코더와 The Horny Horns
  K X-------X-x-----
  S ----X--o----X-o-
  H XoxoXoxoXoxoXoxo
  P --x---x---x---x-
  B 0-0-0--05--3-0--

 Jazz-Funk              115 BPM  swing  0      ← 또렷한 백비트 위에 리프 하나 — 로즈가 으르렁거린다
  K X--x--X-X-x-----
  S ----X--o----X-o-
  H XoxoXoxoXoxxXoxo
  T ------------x-x-
  P --x---x---x---x-
  B 0-0-5--03--5-0--

 Disco Funk             113 BPM  swing  0      ← 네 박 킥 + 뒷박 오픈햇에 혼과 스타카토 현. 셔플은 없다
  K X---X---X---X---
  S ----X--o----X---
  H X-x-X-x-X-x-X-x-
  O --x---x---x---x-
  T -------------x-x
  P --x---x---x---x-
  B 0-05-0-53-05-0-3

 Post-disco             118 BPM  swing  0      ← 드럼머신과 실드럼이 겹친다. 오케스트라를 신스로 갈아 끼운 자리
  K X---X-x-X---X---
  S ----X-------X-o-
  H X-x-X-x-X-xxX-x-
  T -------------x-x
  P --x---x---x---x-
  B 0-0-0-5-0-0-3-0-

 Boogie                 112 BPM  swing  0      ← **네 박이 아니다** — 2·4 강세에 박수. 디스코와 갈리는 지점이다
  K X-------X-------
  S ----X-------X---
  C ----X-------X---
  H X-x-X-x-X-x-X-x-
  T -------------x-x
  P --x---x---x---x-
  B 0-0-0-5-3-0-5-3-

 Electro-funk           118 BPM  swing  0      ← 808 신콥 킥 — 네 박도 오픈햇도 없다. 기계적인 것이 정의다
  K X-------X-x-----
  S ----X-------X---
  C --------------x-
  H XxxxXxxxXxxxXxxx
  P --x---x---x---x-
  B 0-0-0--05--3-0--
```

## Disco  (4종)

```
 Disco                  118 BPM  swing  0      ← 네 박 킥에 뒷박 오픈햇, 옥타브를 왕복하는 베이스 기타
  K X---X---X---X---
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  O --x---x---x---x-
  T -------------x-x
  P --x---x---x---x-
  B 0-0-5-0-3-0-5-3-

 Euro Disco             124 BPM  swing  0      ← 같은 골격인데 베이스가 시퀀서다. 좌우로 벌린 16분 루프
  K X---X---X---X---
  S ----X-------X---
  H X-x-X-x-X-x-X-x-
  O --x---x---x---x-
  T -------------x-x
  P --x---x---x---x-
  B 0-0-5-0-3-0-5-0-

 Italo Disco            124 BPM  swing  0      ← 드럼머신과 보코더 — 리듬보다 노래가 앞에 선다
  K X---X---X---X---
  S ----X-------X---
  C --------------x-
  H x-x-x-x-x-x-x-x-
  O --x---x---x---x-
  T ------------x-x-
  P --x---x---x---x-
  B 0-0-0-5-0-0-3-5-

 Hi-NRG                 134 BPM  swing  0      ← 16분 햇에 맥동하는 옥타브 시퀀스. 기타는 편성에 없다
  K X---X---X---X---
  S ----X-------X---
  C ----x-------x---
  H xxxxxxxxxxxxxxxx
  O --x---x---x---x-
  T ------------x-x-
  P --x---x---x---x-
  B 0505050505050505
```

## Contemporary R&B  (6종)

```
 New Jack Swing         112 BPM  swing 34      ← 스윙된 16분 셋잇단 — 이 계열에서 유일하게 실제로 셔플이다
  K X-----x-X-x-----
  S ----X--o----X---
  C ----x-------x---
  H X-x-X-x-X-x-X-x-
  T ------------x-x-
  B 0---0-3-5---3---

 Quiet Storm             80 BPM  swing  0      ← 가장 느리고 비어 있다. 이제 기타가 실제로 울린다
  K X-------X---x---
  S ----X-------X---
  H x---x---x---x---
  T ------------x---
  B 0---0---5---3---

 Hip Hop Soul            96 BPM  swing 30      ← 빌려온 붐뱁 브레이크 위의 소울 보컬
  K X--x----X---x---
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  O --------------x-
  B 0--0----5---3---

 90s R&B                 84 BPM  swing 14      ← 발라드 쪽으로 무겁다 — 힙합의 거칠기를 깎아 낸 자리
  K X-----x-X-x-----
  S ----X--o----X---
  C ----x-------x---
  H x-x-x-x-x-x-x-x-
  T -------------x-x
  B 0-0-3-0-5-0-3-0-

 Alternative R&B         75 BPM  swing  0      ← 하프타임 스네어 하나, 홀 클랩, 왜곡된 808
  K X-------X-------
  S --------X-------
  C ----x---X---x---
  H x-x-x-xxx-x-x-xx
  B 0-------5-------

 Trap Soul              122 BPM  swing  0      ← 트랩 골격에 R&B 보컬 — 일반 트랩보다 느리다
  K X-----x-X---x-x-
  S --------X-------
  C --------x-------
  H x-xxx-x-x-xx--xx
  O ------------x---
  B 0-------5---3---
```
