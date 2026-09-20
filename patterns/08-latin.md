# H. Latin — 장르별 박자

> [../genres/08-latin.md](../genres/08-latin.md) 의 악기·음색 분석과 짝을 이루는 **박자 자료**입니다.
>
> 표기: `K`킥 `S`스네어 `C`클랩 `H`클로즈햇 `O`오픈햇 `T`톰 `P`퍼커션 `B`베이스(음도)
> `X`강세 `x`보통 `o`고스트 `-`없음 · 0부터 시작, 1박=0 2박=4 3박=8 4박=12
>
> ⚠ 쿠바 계열의 `P` 는 **클라베**입니다 — 방향(3-2 / 2-3)을 바꾸면 다른 곡이 됩니다.
> 베이스의 «박 뒤로 밀린 자리»(앙티시파도)가 라틴의 정체성이라 0박이 비는 일이 잦습니다.
> 값이 안 비어 있는 트랙만 적었습니다.

**수록 39종 — 골격도 39가지입니다.**

> 2026-08-17 이전에는 «골격이 같은 장르는 한 블록에 묶었습니다» 라고 적혀 있었고,
> 실제로 골격이 7개뿐이었습니다. 상속으로 파생 프리셋이 원형을 그대로 받던 탓입니다.
> 상속을 끊고([`_build.js`](../src/data/presets/_build.js)) 장르마다 박자를 다시 썼습니다 —
> 이제 **묶인 블록이 없습니다.**

---

## 푸에르토리코 · 도미니카  (6종)

```
 Reggaeton               96 BPM  swing  8      ← 뎀보우 — 스네어가 3-3-2 로 걸린다
  K X-------X-------
  S ---x--x----x--x-
  C ----x-------x---
  H x-x-x-x-x-x-x-x-
  P x-x-x-x-x-x-x-x-
  B 0--0--0-5--5--3-

 Bachata                130 BPM  swing  0      ← 4박에 봉고 한 방 — 기타가 아르페지오
  K X-------X-------
  S ------------X---
  H x-x-x-x-x-x-x-x-
  T ------------x---
  P x-x-x-x-x-x-x-x-
  B 0---0---3---5---

 Merengue               145 BPM  swing  0      ← 8분 스네어 + 16분 햇 — 가장 빠른 2박
  K X---X---X---X---
  S x-x-x-x-x-x-x-x-
  H XxxxXxxxXxxxXxxx
  P x-x-x-x-x-x-x-x-
  B 0---5---0---5---

 Dembow                 122 BPM  swing  0      ← 레게톤의 원형 — 햇이 16분으로 채워진다
  K X-------X---x---
  S ---x--x----x--x-
  C ----x-------x---
  H x-xxx-x-x-xxx-x-
  P x-x-x-x-x-x-x-x-
  B 0--0--0-5--5--3-

 Bomba                  120 BPM  swing  0      ← 바릴 두 대 — 춤이 드럼을 이끈다
  K X---X---X---X---
  S ---x---x---x---x
  H x-x-x-x-x-x-x-x-
  T x--x-x-x--x-x-x-
  P x-x-x-x-x-x-x-x-
  B 0---0---3---3---

 Plena                  115 BPM  swing  0      ← 판데레타 — 손북이 16분을 긋는다
  K X---X---X---X---
  S --x-x---x-x-x---
  H x-x-x-x-x-x-x-x-
  P x-xxx-x-x-xxx-x-
  B 0---3---0---5---
```

## 콜롬비아  (5종)

```
 Cumbia                  92 BPM  swing  8      ← 귀로 8분 + 베이스가 박 뒤로
  K X---X---X---X---
  S ---x---x---x---x
  H x-x-x-x-x-x-x-x-
  P x-x-x-x-x-x-x-x-
  B 0-----3-0-----5-

 Vallenato              105 BPM  swing  0      ← 아코디언이 주역 — 베이스는 근음↔5도
  K X---X---X---X---
  S --x---x---x---x-
  H x-x-x-x-x-x-x-x-
  P x-x-x-x-x-x-x-x-
  B 0---5---0---5---

 Champeta               115 BPM  swing  0      ← 아프리카 기타가 들어온 쿰비아
  K X---X---X-x-X---
  S ---x---x---x---x
  H x-xxx-x-x-xxx-x-
  P x-x-x-x-x-x-x-x-
  B 0--0--3-0--0--5-

 Chicha                 103 BPM  swing  0      ← 사이키델릭 쿰비아 — 파르피사와 전기 기타
  K X---X---X---X---
  S ---x---x---x---x
  H x-x-x-x-x-x-x-x-
  T ------------x-x-
  P x-x-x-x-x-x-x-x-
  B 0---3---5---3---

 Cumbia Villera         100 BPM  swing  0      ← 거칠게 — 신스가 아코디언 자리를 대신한다
  K X---X---X---X---
  S ---x---x---x---x
  H x-x-x-x-x-x-x-x-
  P x-x-x-x-x-x-x-x-
  B 0-----5-0-----3-
```

## 아르헨티나 · 남미 남부  (3종)

```
 Tango                  120 BPM  swing  0      ← 마르카토 4박 — 톰이 박을 때리고 햇이 없다
  K X---X---X---X---
  T X---X---X---X---
  B 0---0---0---0---

 Nuevo Tango            120 BPM  swing  0      ← 3-3-2 마르카토 — 피아졸라의 자리
  K X--X--X---X-X---
  T X---X---X---X---
  B 0---0---3---3---

 Electrotango           115 BPM  swing  0      ← 탱고 위의 4/4 드럼머신
  K X---X---X---X---
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  B 0-0-0-0-3-3-3-3-
```

## 쿠바  (10종)

```
 Son Cubano             160 BPM  swing  0      ← 앙티시파도 베이스 + 봉고 마르티요
  K X-----X-----X---
  S ----x---x-------
  H x-x-x-x-x-x-x-x-
  T x-x-x-x-x-x-x-x-
  P x--x--x---x-x---
  B 0-----3-----5---

 Salsa                  190 BPM  swing  0      ← 카스카라 + 클라베 — 팀발레가 8분
  K X-----X-----X---
  S --x-x---x-x-x---
  H x-x-x-x-x-x-x-x-
  T x-x-x-x-x-x-x-x-
  P x--x--x---x-x---
  B 0-----3-0-----5-

 Timba                  200 BPM  swing  0      ← 살사에 펑크의 신콥 — 킥이 3-3-2
  K X--X--X-X--X--X-
  S ---x---x---x---x
  H x-x-x-x-x-x-x-x-
  T --x-x---x-x-x---
  P x--x--x---x-x---
  B 0--0--5-0--0--3-

 Rumba                  110 BPM  swing  0      ← 콩가와 목소리뿐 — 햇을 안 쓴다
  K X-----X---X-----
  S --x---x---x---x-
  T x--x--x---x-x---
  P x--x--x---x-x---
  B 0-------0-------

 Mambo                  180 BPM  swing  0      ← 빅밴드 혼이 때리는 자리 — 봄보 4박
  K X---X---X---X---
  S ----x---x---x---
  H x-x-x-x-x-x-x-x-
  T --x---x---x---x-
  P x--x--x---x-x---
  B 0---0-3-0---0-5-

 Cha-cha-chá            120 BPM  swing  0      ← 이름이 곧 리듬 — 4박 뒤 «차-차-차»
  K X---X---X---X---
  S ----------x-x-x-
  H x-x-x-x-x-x-x-x-
  T --x---x---x---x-
  P x-x-x-x-x-x-x-x-
  B 0---0---3---5---

 Songo                  115 BPM  swing  0      ← 쿠바 리듬 + 드럼셋 — 킥이 클라베를 따라간다
  K X---X-X---X-X---
  S --x---x-x---x-x-
  H x-x-x-x-x-x-x-x-
  T --x---x---x---x-
  P x--x--x---x-x---
  B 0---3-5-0---3-5-

 Mozambique             115 BPM  swing  0      ← 콩가와 벨이 겹친 카니발 리듬
  K X--X--X---X-X---
  S --x-x-x---x-x-x-
  H x-x-x-x-x-x-x-x-
  T x-x-x-x-x-x-x-x-
  P x--x--x---x-x---
  B 0---5-3-0---5-3-

 Rumba Yambú             85 BPM  swing  0      ← 가장 느린 룸바 — 카혼 중심
  K X-------X-------
  S ------x-------x-
  T x--x--x---x-x---
  P x--x--x---x-x---
  B 0-----------0---

 Rumba Columbia         140 BPM  swing  0      ← 가장 빠른 룸바 — 솔로 춤을 받친다
  K X--X--X---X--X--
  S --x-x-x---x-x-x-
  T x--x--x---x-x---
  P x--x--x---x-x---
  B 0---0---0---0---
```

## 현대 크로스오버  (3종)

```
 Latin Trap             138 BPM  swing  0      ← 트랩 골격 + 라틴 퍼커션
  K X-----x-X-----x-
  S --------X-------
  C --------x-------
  H x-xxx-x-x-xxx-xx
  O ------------x---
  P --x---x---x---x-
  B 0-------5---3---

 Neoperreo               98 BPM  swing  0      ← 뎀보우를 전자음으로 — 킥이 하나 더
  K X-------X---x---
  S ---x--x----x--x-
  C ----x-------x---
  H x-x-x-x-x-x-x-x-
  B 0--0--0-3--3--5-

 Sad Perreo              93 BPM  swing  0      ← 성긴 뎀보우 — 4분 햇, 넓은 여백
  K X---X---X---X---
  S ---x--x----x--x-
  H x---x---x---x---
  B 0-----0-3-----5-
```

## 브라질  (8종)

```
 Pagode                 100 BPM  swing  0      ← 판데이루 16분 + 수르두
  K X---X---X---X---
  S --x-x---x-x-x---
  H x-x-x-x-x-x-x-x-
  P x-xxx-xxx-xxx-xx
  B 0---5---0---5---

 Bossa Nova             130 BPM  swing  0      ← 3-3-2 킥 + 림 — 스네어를 안 때린다
  K X--X--X---X--X--
  S --x--x-x--x--x-x
  H x-x-x-x-x-x-x-x-
  P xxxxxxxxxxxxxxxx
  B 0--0--5---5--0--

 Forró                  125 BPM  swing  0      ← 자붐바 — 낮은 북이 앞뒤로 어긋난다
  K X--x--X-X--x--X-
  S ------x-------x-
  H x-x-x-x-x-x-x-x-
  P x-xxx-xxx-xxx-xx
  B 0--0--5-0--0--3-

 Baile Funk             130 BPM  swing  0      ← 탐보르장 — 킥이 3-3-2
  K X--X--X---X--X--
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  T --x---x---x---x-
  P xxxxxxxxxxxxxxxx
  B 0--0--0-5--5--3-

 Partido Alto           100 BPM  swing  0      ← 삼바의 신콥 — 스네어가 계속 어긋난다
  K X---X---X---X---
  S --x-x-x---x-x-x-
  H x-x-x-x-x-x-x-x-
  P xxxxxxxxxxxxxxxx
  B 0--0--3-0--0--5-

 Baião                  115 BPM  swing  0      ← 자붐바의 «둥-두둥» + 아고고
  K X-----X-X-----X-
  S ------x-------x-
  H x-x-x-x-x-x-x-x-
  P x--x--x---x-x---
  B 0-----5-0-----5-

 Funk Mandelão          130 BPM  swing  0      ← 파벨라 펑크 — 킥이 촘촘하게 끊긴다
  K X--X--X-X--X--X-
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  T ------------x-x-
  P xxxxxxxxxxxxxxxx
  B 0--0--0-0--5--3-

 Bruxaria               140 BPM  swing  0      ← 가장 공격적 — 킥이 8분 전부
  K X-X-X-X-X-X-X-X-
  S ----X-------X---
  H x-xxx-x-x-xxx-xx
  P xxxxxxxxxxxxxxxx
  B 0-0-0-0-5-5-3-3-
```

## 멕시코  (4종)

```
 Mariachi               105 BPM  swing  0      ← 마니코 스트럼 + 기타론이 근음↔3도
  K X---X---X---X---
  H x-x-x-x-x-x-x-x-
  T ------------x-x-
  P x--x--x---x-x---
  B 0---5---0---3---

 Norteño                140 BPM  swing  0      ← 폴카 — 아코디언과 바호섹스토
  K X---X---X---X---
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  P --x---x---x---x-
  B 0---5---0---5---

 Banda                  140 BPM  swing  0      ← 관악대 — 투바가 8분을 걷는다
  K X---X---X---X---
  S ----X-------X---
  H x-x-x-x-x-x-x-x-
  T --x---x---x---x-
  P x--x--x---x-x---
  B 0-5-0-5-0-5-0-5-

 Cumbia Sonidera         93 BPM  swing  0      ← 느리게 늘인 쿰비아 — 에코가 걸린 자리
  K X---X---X---X---
  S ---x---x---x---x
  H x-x-x-x-x-x-x-x-
  P x--x--x---x-x---
  B 0-----5-0-----3-
```
