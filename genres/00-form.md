# 곡 구조 — 세부장르가 실제로 어떤 형식을 쓰는가

## 왜 만드는가

`src/seq/arrange.js` 의 `SONG_FORM` 은 **손으로 쓴 일곱 개**였고, 프리셋 357종이
계열 12개를 거쳐 그 일곱 개로 뭉개졌습니다. 힙합 41종이 전부 같은 두 폼을
받았습니다. 그리고 그 일곱 개의 마디 배분 — 벌스 8마디, 코러스 8마디 — 은
**어디에서도 오지 않은 값**이었습니다.

장르 프로파일(`genres/profiles/`)은 선율·베이스·편성을 대표곡에서 가져왔습니다.
구조만 빠져 있었습니다. 프로파일 스키마 339건에 형식 축이 아예 없고,
`genres/*.md` 의 «대표곡» 표에도 마디 배분 칸이 없습니다. 이 문서가 그 칸입니다.

| 폴더 | 다루는 것 |
|---|---|
| [profiles/](profiles/) | 프리셋 단위 선율 프로파일 |
| [../patterns/](../patterns/) | 드럼 박자 |
| [../melody/](../melody/) | 선율 이론 |
| **00-form.md · forms/** | **곡 형식 — 섹션 배분 · 총 마디** |

---

## 1. 규칙 — 프로파일과 같습니다

1. **출처가 마디 수를 말하지 않으면 적지 않습니다.** 확신도 `low` 로 두고
   계열 기본형을 물려받게 둡니다. 「아마 8마디일 것이다」는 지어낸 값입니다.
2. **곡·아티스트 이름은 기계 표에 안 들어갑니다**([profiles/README.md](profiles/README.md) §2).
   이 문서에는 있어도 됩니다 — 사람이 읽는 자료입니다.
3. **«같다» 가 정상적인 답입니다**(같은 README §3). 형식은 선율보다 훨씬
   덜 갈립니다. 72개 하위분기가 72개 형식을 갖는 것이 아니라, **13개 형식**을
   나눠 씁니다. 따로 적은 분기는 19개이고 나머지 53개는 계열 기본형을
   물려받습니다 — 물려받은 것이 «아직 안 한 것» 이 아니라 **«따로 다르다는
   근거가 없다»** 는 답입니다.

---

## 2. 가장 큰 발견 — «한 곡은 64마디» 가 틀렸습니다

2026-09-17 에 폼 일곱 개를 전부 정확히 64마디로 맞췄습니다. 선율이 64마디판을
갖게 됐으니 섹션도 거기 맞춰야 한다는 이유였고, 그 자체는 맞습니다. 그런데
**형식을 조사해 보니 64가 못 담는 것이 있습니다.**

| 형식 | 출처가 말하는 길이 | 64로 나누어지는가 |
|---|---|---|
| 32마디 AABA | 8+8+8+8 = **32** | 64 = 32×2 — 된다 |
| 12마디 블루스 | **12** | **안 된다.** 12 는 64 를 안 나눈다 — 4바퀴 48, 8바퀴 96 |
| UK 덥스텝 | 32+16+32+**32**+32+16+32+32 = **224** | **안 된다.** 224 = 32×7 |

**12마디 블루스가 64마디 격자에 안 올라갑니다.** 12와 64는 최소공배수가
192입니다. 블루스 6종과 재즈의 블루스 형식이 여기 걸립니다.

그래서 불변식을 바꿉니다.

```
예전:  모든 폼 = 정확히 64마디
지금:  폼의 총 마디가 선율 길이의 배수  (선율 길이는 16·32·64 중에서 고른다)
```

폼이 48마디면 선율은 16마디판을 씁니다(48 = 16×3). 96마디면 16·32 둘 다
됩니다(32×3). 64마디면 셋 다 됩니다. **폼이 선율 길이를 정하지, 그 반대가
아닙니다** — 형식이 음악의 사실이고 선율 길이는 우리가 만든 눈금입니다.
`tools/ci/check-song-length.mjs` 가 이 관계를 지킵니다.

---

## 3. 형식 13종 — 출처와 함께

### ① `verseChorus` — 벌스·코러스

가장 흔한 형식이고, **그래서 출처가 가장 약합니다.** 위키백과
[Song structure](https://en.wikipedia.org/wiki/Song_structure) 는 섹션의
마디 수를 **하나도 말하지 않습니다** — 개념만 적습니다. 마디 수를 말하는 것은
작곡 교육 자료들이고, 그쪽도 값이 갈립니다.

> 「Verses are usually 8 bars long in pop and R&B music, but can get up to 12 bars」
> — [Native Instruments Blog](https://blog.native-instruments.com/song-structure-101/)
>
> 「Choruses are typically eight or 16 bars long」 · 「in most popular music every
> song section is a multiple of 2 bars: 2, 4, 8, 16」
> — [Sessionville](https://www.sessionville.com/articles/the-structure-of-popular-songs-part1-parts-and-phrases)

합의되는 것은 **«8의 배수» 와 «코러스가 벌스보다 짧지 않다»** 둘뿐입니다.
그래서 확신도를 `medium` 으로 적습니다.

**`verseChorusBridge`** 는 같은 근거의 다른 판입니다 — 브릿지를 둔 쪽. 출처들이
브릿지를 표준 섹션으로 들기 때문에 둘을 함께 풀에 넣습니다. 이것이 13번째
형식이고, ①과 «다른 형식» 이라기보다 **같은 형식의 두 배치**입니다.

### ② `aaba32` — 32마디 AABA

유일하게 **위키백과가 마디 수를 못 박는** 형식입니다.

> 「The song form consists of four sections: an eight-bar A section; a second
> eight-bar A section; an eight-bar B section, often with contrasting harmony
> or "feel"; and a final eight-bar A section.」
> 「commonly found in Tin Pan Alley songs … often used in rock in the 1950s and 60s」
> — [Thirty-two-bar form](https://en.wikipedia.org/wiki/Thirty-two-bar_form)

확신도 `high`. 총 32마디라 64마디 한 바퀴는 이것을 **두 번** 돕니다.

### ③ `blues12` — 12마디 블루스

> 「one of the most prominent chord progressions in popular music」 ·
> 「The length of sections may be varied to create eight-bar blues or sixteen-bar blues」
> — [Twelve-bar blues](https://en.wikipedia.org/wiki/Twelve-bar_blues)

확신도 `high`. **총 48마디(12×4)** 로 답니다 — 블루스 연주의 최소 단위가
한 코러스(12마디)이고, 넷이면 한 바퀴가 됩니다.
48은 16으로 나누어지므로 선율은 16마디판을 씁니다.

### ④ `headSolos` — 헤드 · 솔로 · 헤드 (재즈)

> 「Mainstream jazz tunes since the 1940s take the form head-solos-head, where
> the head is a written melody and the solos are improvised around the chord
> changes of the head.」 ·
> 「the default jazz arrangement often has the head played twice」
> — [Song structure](https://en.wikipedia.org/wiki/Song_structure) 및 연주 관행 자료

헤드는 **그 곡의 형식 한 바퀴**입니다 — 스탠더드면 32마디 AABA, 블루스면
12마디. 그래서 이 형식은 «헤드 → 솔로 → 솔로 → 헤드» 로 적고 총 마디는
헤드 길이의 4배가 됩니다. 스탠더드 계열은 32×4 = **128**.

> **2026-09-17 의 `jazzHead` 는 헤드를 16마디로 뒀습니다.** 어느 출처도
> 16마디 헤드를 말하지 않습니다. 그때 주석에 적은 «실제 재즈 형식의 비율» 은
> 근거가 없었습니다 — 이 문서가 그것을 정정합니다.

### ⑤ `buildDrop` — 빌드업 · 드롭 (EDM)

위키백과 [Drop (music)](https://en.wikipedia.org/wiki/Drop_(music)) 은 드롭·빌드업을
서술하지만 **마디 수는 말하지 않습니다.** 수치는 제작 자료에서 옵니다.

> 「An intro is typically a multiple of 16 bars in length」 ·
> 「a drop typically runs 16 or 32 bars before transitioning into a breakdown」
> — [Mixed In Key](https://mixedinkey.com/captain-plugins/wiki/how-to-arrange-a-dance-music-track/)

확신도 `medium`. 드롭 16 · 인트로 16의 배수를 지킵니다.

### ⑥ `dubstep224` — 덥스텝 · 베이스 뮤직

가장 구체적인 수치가 있는 형식입니다.

> 「Intro (32 bars) / Build (16 bars) / First Drop (32 bars) / Mid Section
> (16-32 bars) / Breakdown (32 bars) / Second Build (16 bars) / Second Drop
> (32 bars) / Outro (32 bars)」 ·
> 「Dubstep intros and outros follow the same logic as DnB — 32 bars of
> stripped-down DJ-friendly material」
> — [KAN Samples · Dubstep Track Arrangement](https://kansamples.com/blogs/learn/dubstep-track-arrangement)

가운데 구간만 **16~32 범위**로 주어져 있습니다. 32 를 고르면 합이
**224마디**(= 32×7)가 되어 선율 32마디판이 맞아떨어집니다 — 범위 안에서
고른 것이지 범위를 벗어나 맞춘 것이 아닙니다. 16 을 고르면 208 = 16×13 이라
선율이 16마디판으로 내려갑니다.

확신도 `medium` — 제작 자료이지 백과·학술 출처가 아닙니다.

### ⑦ `djTool` — 디제이용 긴 인트로·아웃트로 (하우스·테크노·디스코)

이 형식은 **음악이 아니라 매체가 만든 것**이라 출처가 분명합니다.

> 「The DJ-friendly long version was born with the disco-era twelve-inch single,
> which gave clubs extended intros and outros with beats or percussion,
> isolated instrumental passages」 — 브레이크다운 구간과 12인치 포맷 둘 다
> 리믹서 Tom Moulton 의 것으로 기록됩니다
> — [Twelve-inch single](https://en.wikipedia.org/wiki/Twelve-inch_single) 및 디제잉 자료

인트로·아웃트로를 두껍게 두고 가운데에 브레이크를 놓습니다.

### ⑧ `largoMontuno` — 라르고 · 몬투노 (살사·손)

> 「Most salsa follows the basic son montuno model of a verse section, followed
> by a coro-pregón (call-and-response) chorus section known as the montuno.」 ·
> **「Once the montuno section begins, it usually continues until the end of the
> song.」** · 「The montuno section can be divided into various sub-sections
> sometimes referred to as mambo, diablo, moña, and especial.」
> — [Salsa (musical structure)](https://en.wikipedia.org/wiki/Salsa_(musical_structure))

벌스·코러스가 **번갈지 않는다**는 것이 이 형식의 핵심입니다. 앞은 노래,
뒤는 끝까지 콜앤리스폰스. 확신도 `high`.

### ⑨ `rumbaSebene` — 룸바 · 세베네 (수쿠스·콩고 룸바)

> 「Sebene is an instrumental section commonly played in Congolese rumba, usually
> played towards the end of the song and is the dancing section where the lead
> and rhythm guitars take the lead」 · 「Songs often build slowly to a joyous
> uptempo midsection called the Sebene」
> — [Sebene](https://en.wikipedia.org/wiki/Sebene) · [Soukous](https://en.wikipedia.org/wiki/Soukous)

⑧과 같은 «앞은 노래 · 뒤는 끝까지» 형식인데, 뒤를 맡는 것이 합창이 아니라
**기타**입니다. 확신도 `high`.

### ⑩ `grooveHold` — 그루브를 붙잡는 형식 (아프로비트·크라우트록·펑크)

> 아프로비트 — 곡이 10~15분을 훌쩍 넘고 20~30분대도 흔하며, 긴 기악 구간이
> 노래 사이를 채웁니다. 한 앨범은 **전반부 전체가 기악**입니다
> ([Confusion](https://en.wikipedia.org/wiki/Confusion_(album)))
>
> 펑크 — 한 코드(9화음) 위에서 곡 전체를 탑니다. 「the interest is entirely in
> the rhythm … inside one unchanging harmony」
> ([Funk](https://en.wikipedia.org/wiki/Funk) · 한코드 뱀프 자료)
>
> 크라우트록 — 저장소 자신의 조사도 같은 말을 합니다: 「8마디, 16마디가
> 지나도 아무것도 변하지 않는 것이 핵심」([../patterns/00-archetypes.md](../patterns/00-archetypes.md))

섹션이 **바뀌지 않는 것이 형식**입니다. 그래서 트랙을 끄고 켜는 폭을 가장 좁게
두고, 층을 더하고 빼는 것으로만 움직입니다.

### ⑪ `verse16hook8` — 16마디 벌스 · 8마디 훅 (힙합)

①과 마디 배분이 다르고, 그 차이에 출처가 있습니다.

> 「A standard rap song structure consists of 16-bar verses, 8-bar choruses or
> hooks」 · 「The hook is typically 8 bars in length and is usually repeated 3-4
> times」 · 「4 bar intro – 16 bar verse – 8 bar chorus – 16 bar verse – 8 bar
> chorus – 16 bar verse – End」 · 「many rap songs contain between 60 and 72 bars」
> — [Rap Authority](https://rapauthority.com/rap-song-structure/) ·
> [eMastered](https://emastered.com/blog/rap-song-structure)

출처가 든 예시가 68마디이고 「60~72마디」 범위를 말합니다. **64마디**가 그
범위 한가운데이고, 벌스 16 · 훅 8 을 그대로 지키면서 16마디 격자에도 맞습니다.
확신도 `medium`.

### ⑫ `riddimVersion` — 리딤과 버전 (레게·댄스홀)

> 「A given riddim, if popular, may be used in dozens—or even hundreds—of songs」 ·
> 곡은 「the riddim plus the voicing (vocal part)」 이다
> — [Riddim](https://en.wikipedia.org/wiki/Riddim)

**출처가 섹션도 길이도 말하지 않습니다.** 리딤은 곡의 형식이 아니라 재사용되는
반주이고, 그 위에 얹히는 것이 곡마다 다릅니다. 그래서 이 형식은 «짧은 훅이
되풀이되는 루프» 로만 적고 **확신도를 `low`** 로 둡니다. 근거가 얇다는 사실을
값으로 남깁니다.

---

## 4. 배정 — 하위분기 72개 → 형식 13종

기계가 읽는 표는 [forms/forms.json](forms/forms.json) 입니다. 이 문서가 그
표의 «왜» 이고, `tools/build-refdata.mjs` 가 `src/data/songform.js` 로 굳힙니다.

### 왜 profiles/ 안이 아니라 따로인가

형식 축을 프로파일(프리셋 339건)에 넣으면 **같은 값을 339번 적게 됩니다.**
선율은 프리셋마다 갈리지만(그래서 `MELODY_KIT_PRESET` 이 프리셋 단위입니다)
형식은 그렇지 않습니다 — Boom Bap 과 Golden Age 의 선율은 갈릴 수 있어도
곡 형식은 갈릴 근거가 없습니다. 프리셋 단위로 적으면 그 339개 칸이 전부
«지어낸 차이» 의 자리가 됩니다([profiles/README.md](profiles/README.md) §3).

그래서 **하위분기 단위 표 하나**로 두고, 계열이 폴백입니다. 프리셋 하나가
정말로 자기 계보와 다른 형식을 쓴다는 근거가 나오면 그때 프리셋 단위 예외를
더하면 됩니다 — `MELODY_KIT_PRESET` 이 하위분기 상속을 끊은 것과 같은 순서입니다.

하위분기를 따로 적지 않으면 **계열 기본형을 물려받습니다** — 안 적는 것이
곧 «출처가 이 분기를 따로 말하지 않았다» 는 기록입니다.

### 조사하지 않은 것을 적어 둡니다

이번 한 바퀴에서 출처를 찾은 것은 위 12종이고, 그것으로 72개 분기를 덮었습니다.
그러나 **덮은 것과 조사한 것은 다릅니다.** 아래는 계열 기본형을 물려받았을 뿐
따로 조사하지 않은 분기입니다 — 다음 바퀴의 대상입니다.

| 분기 | 물려받은 형식 | 왜 미심쩍은가 |
|---|---|---|
| G · Folk | `verseChorus` | 포크는 후렴 없이 절만 되풀이하는 **유절형**이 많습니다. 형식이 아예 다를 수 있습니다 |
| G · Gospel · 지역 장르 | `verseChorus` | 가스펠의 **뱀프**(끝에서 한 구절을 계속 반복)는 유명하지만 출처를 확인하지 않았습니다 |
| H · 브라질 | `verseChorus` | 보사노바 스탠더드는 32마디 AABA 인 경우가 많습니다 — ②일 가능성이 높은데 확인하지 않았습니다 |
| H · 멕시코 · 콜롬비아 · 아르헨티나 | `verseChorus` | 쿠바·푸에르토리코만 조사했습니다 |
| I · 트리니다드 · 바베이도스 · 프랑스어권 | `verseChorus` | 소카·칼립소·주크의 형식을 확인하지 않았습니다 |
| J · 남아프리카 | `grooveHold` | 아마피아노는 7분대 곡이 흔해 ⑦(디제이용)일 수 있습니다 |
| J · 동아프리카 · 북아프리카 | `verseChorus` | 조사하지 않았습니다 |
| B · 지역 팝 · 동아시아 · 서아시아 · 남아시아 | `verseChorus` | 조사하지 않았습니다 |
