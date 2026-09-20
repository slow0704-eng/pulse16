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
   덜 갈립니다. 72개 하위분기가 72개 형식을 갖는 것이 아니라, **18개 형식**을
   나눠 씁니다. 따로 적은 분기는 30개이고 나머지 42개는 계열 기본형을
   물려받습니다 — 물려받은 것이 «아직 안 한 것» 이 아니라 **«따로 다르다는
   근거가 없다»** 는 답입니다.
   그 18개 중 다섯은 **다른 형식의 길이만 다른 판**입니다(§7-5) — 형식이 늘어난
   것이 아니라, 같은 형식이 시대·표기에 따라 다른 마디 수로 적힌다는 사실이
   값이 된 것입니다.

---

## 2. 가장 큰 발견 — «한 곡은 64마디» 가 틀렸습니다

2026-09-17 에 폼 일곱 개를 전부 정확히 64마디로 맞췄습니다. 선율이 64마디판을
갖게 됐으니 섹션도 거기 맞춰야 한다는 이유였고, 그 자체는 맞습니다. 그런데
**형식을 조사해 보니 64가 못 담는 것이 있습니다.**

| 형식 | 출처가 말하는 길이 | 64로 나누어지는가 |
|---|---|---|
| AABA ×2 + BA | 32+32+16 = **80** | **안 된다.** 80 = 16×5 |
| 12마디 블루스 ×4 | 12×4 = **48** | **안 된다.** 12 는 64 를 안 나눈다 |
| UK 덥스텝 | 32+16+32+32+32+16+32+32 = **224** | **안 된다.** 224 = 32×7 |
| 록 (기타 솔로 포함) | **128** | 된다 — 128 = 64×2 |

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

## 3. 형식들 — 출처와 함께

> 몇 종인지는 여기 적지 않습니다(적으면 낡습니다). `node tools/counts.mjs` 가
> 「곡 형식」으로 찍어 줍니다.

아래 번호는 열셋입니다 — `verseChorusBridge` 는 ①의 다른 배치라 ①안에 적었고,
**§7 에서 늘어난 넷**(`popVerseChorus` · `popVerseChorusBridge` ·
`verse16hook8Half` · `grooveHoldSingle`)은 전부 여기 있는 형식의 **길이만 다른
판**이라 원래 형식 옆에 적었습니다. 총 마디가 §7 에서 바뀐 것은 그 절에
«→ 96마디» 처럼 표시해 두었습니다.

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
브릿지를 표준 섹션으로 들기 때문에 둘을 함께 풀에 넣습니다. ①과 «다른 형식»
이라기보다 **같은 형식의 두 배치**입니다.

> **→ 총 64마디는 «1960년대 단면» 이었습니다 (§7-2).** Hot 100 1위 곡 979곡을
> 재니 곡 길이가 시대의 함수였습니다 — 1960년대 2:44, 1990년대 4:21. 64마디는
> `B:뿌리` 68곡(2:42)에 −4 % 로 맞지만 그 밖에서는 −41 % 였습니다. 그래서 값은
> 그대로 두고 **배정을 1960년대 분기로 좁혔고**, 1970년대 이후는
> `popVerseChorus` · `popVerseChorusBridge`(96마디)로 갑니다. 섹션은 그대로이고
> **한 바퀴를 더 돕니다** — 출처가 못 박는 것은 섹션 길이이지 곡 길이가 아닙니다.

### ② `aaba32` — 32마디 AABA ×2 + BA (총 80마디)

유일하게 **위키백과가 마디 수를 못 박는** 형식입니다.

> 「The song form consists of four sections: an eight-bar A section; a second
> eight-bar A section; an eight-bar B section, often with contrasting harmony
> or "feel"; and a final eight-bar A section.」
> 「commonly found in Tin Pan Alley songs … often used in rock in the 1950s and 60s」
> — [Thirty-two-bar form](https://en.wikipedia.org/wiki/Thirty-two-bar_form)

> 「AABA 곡은 거의 언제나 완전한 AABA 한 바퀴를 돌고, 그 뒤에 또 한 바퀴를
> 돌거나 불완전한 한 바퀴(보통 BA)를 돈다」
> — [Open Music Theory](https://openmusictheory.github.io/popRockForm.html)

확신도 `high`. **32마디는 한 곡이 아니라 한 바퀴입니다** — 168 BPM 에서 46초라
곡이 될 수 없습니다. 출처가 든 두 방식을 둘 다 쓰면 8×4 + 8×4 + 8×2 =
**80마디**입니다(§6-3).

### ③ `blues12` — 12마디 블루스

> 「one of the most prominent chord progressions in popular music」 ·
> 「The length of sections may be varied to create eight-bar blues or sixteen-bar blues」
> — [Twelve-bar blues](https://en.wikipedia.org/wiki/Twelve-bar_blues)

확신도 `high`. 블루스 연주의 최소 단위가 한 코러스(12마디)입니다.

**총 96마디(12×8)** 로 답니다. 처음에는 48마디(네 바퀴)로 뒀는데 그것이
168 BPM 에서 1분 8초라 곡이 아니었습니다 — 12마디 블루스 계보의 Hot 100
1위 곡이 2:34 입니다(§6-3). 여덟 바퀴면 블루스 프리셋 BPM(90~160)에서
2분 17초~4분 16초가 됩니다. 96은 32로 나누어지므로 선율은 32마디판을 씁니다.

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

> **→ 128마디 · 브레이크다운을 둘로 (§7-7).** 같은 음악에 길이가 둘이라고
> 출처가 직접 적습니다 — 「클럽용은 7~8분 12인치 믹스, 라디오용은 3분 30초
> 편집본」([House music](https://en.wikipedia.org/wiki/House_music)). **편집본
> 쪽으로 맞췄습니다** — 차트에 오른 것이 그쪽이고(`D:Disco` 43곡 3:58 ·
> `E:House 계열` 6곡 3:50) 이 앱의 다른 형식도 전부 싱글 길이에 맞춰져 있어
> 한 자리만 다른 자를 쓰면 비교가 안 됩니다. 12인치 길이는 §7-7 에 남겼습니다.

### ⑧ `largoMontuno` — 라르고 · 몬투노 (살사·손)

> 「Most salsa follows the basic son montuno model of a verse section, followed
> by a coro-pregón (call-and-response) chorus section known as the montuno.」 ·
> **「Once the montuno section begins, it usually continues until the end of the
> song.」** · 「The montuno section can be divided into various sub-sections
> sometimes referred to as mambo, diablo, moña, and especial.」
> — [Salsa (musical structure)](https://en.wikipedia.org/wiki/Salsa_(musical_structure))

벌스·코러스가 **번갈지 않는다**는 것이 이 형식의 핵심입니다. 앞은 노래,
뒤는 끝까지 콜앤리스폰스. 확신도 `high`.

> **→ 96마디 (§7-5).** 64마디는 «끝까지 이어지는» 몬투노에 32마디밖에 못 줬습니다.
> 96마디면 몬투노가 곡의 3분의 2입니다. 다만 실측 표본이 두 곡뿐이라
> (`H:푸에르토리코 · 도미니카` 3:52) **길이 쪽 근거는 얇습니다.**

### ⑨ `rumbaSebene` — 룸바 · 세베네 (수쿠스·콩고 룸바)

> 「Sebene is an instrumental section commonly played in Congolese rumba, usually
> played towards the end of the song and is the dancing section where the lead
> and rhythm guitars take the lead」 · 「Songs often build slowly to a joyous
> uptempo midsection called the Sebene」
> — [Sebene](https://en.wikipedia.org/wiki/Sebene) · [Soukous](https://en.wikipedia.org/wiki/Soukous)

⑧과 같은 «앞은 노래 · 뒤는 끝까지» 형식인데, 뒤를 맡는 것이 합창이 아니라
**기타**입니다. 확신도 `high`.

> **→ 128마디 (§7-10 ①).** 길이는 매체가 남긴 기록에서 왔습니다 —
> [Congolese rumba](https://en.wikipedia.org/wiki/Congolese_rumba) 가
> 「끊지 않고 길게 연주하던 악단이, 녹음기 바늘이 3분이면 디스크 중심에 닿는
> 제약에 부딪혔다」고 적습니다. **3분조차 음악이 아니라 매체가 정한 값**이고,
> Soukous 문서가 드는 대표곡은 8분입니다. 64마디는 145 BPM 에 1분 46초라
> 그 제약보다도 짧았습니다.

### ⑩ `grooveHold` — 그루브를 붙잡는 형식 (아프로비트·크라우트록·펑크 · 192마디)

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

**길이도 형식의 일부입니다.** 출처가 드는 곡이 5~30분대인데 64마디는 125 BPM 에
2분 3초라 «붙잡을 그루브» 가 될 시간이 없었습니다. 192마디로 답니다(§6-3 ③).

> **→ 펑크는 여기서 빠졌습니다 — `grooveHoldSingle` 128마디 (§7-7).**
> 아프로비트의 그루브는 앨범 한 면에 살지만 **펑크의 그루브는 싱글로 차트에
> 올랐습니다** — Hot 100 1위 곡이 44곡이고 중앙값이 4:07 이라 192마디는
> +66 % 였습니다. 섹션 규칙은 `grooveHold` 와 같습니다(벌스를 다섯에서 셋으로
> 줄인 것뿐). 아프로비트·크라우트록·앰비언트는 192마디 그대로입니다.

### ⑪ `verse16hook8` — 16마디 벌스 · 8마디 훅 (힙합)

①과 마디 배분이 다르고, 그 차이에 출처가 있습니다.

> 「A standard rap song structure consists of 16-bar verses, 8-bar choruses or
> hooks」 · 「The hook is typically 8 bars in length and is usually repeated 3-4
> times」 · 「4 bar intro – 16 bar verse – 8 bar chorus – 16 bar verse – 8 bar
> chorus – 16 bar verse – End」 · 「many rap songs contain between 60 and 72 bars」
> — [Rap Authority](https://rapauthority.com/rap-song-structure/) ·
> [eMastered](https://emastered.com/blog/rap-song-structure)

출처가 든 예시가 68마디이고 「60~72마디」 범위를 말합니다. 확신도 `medium`.

> **→ 96마디 · 그리고 하프타임 표기판 `verse16hook8Half` 128마디 (§7-6).**
> Hot 100 1위 랩 102곡을 재니 중앙값이 3:47 이라 64마디로는 −44 % 였습니다.
> 출처의 「60~72마디」와 갈리는 것처럼 보이는데, 트랩·드릴은 **표기 템포가
> 체감의 두 배**라(저장소의 `feltBpm`) 128마디를 체감으로 세면 64마디입니다 —
> 출처가 틀린 게 아니라 세는 단위가 달랐습니다. 다만 하프타임이 아닌 옛
> 분기(98 BPM)는 실측이 101마디를 요구해 그 범위 밖입니다.

### ⑫ `rockVerseChorus` — 록 벌스·프리코러스·코러스 (기타 솔로 · 128마디)

①과 갈리는 자리가 셋이고 전부 출처가 있습니다 — 길이 · 인트로 · **기타 솔로**.
자세한 것은 §6 에 있습니다(계열 A 를 Hot 100 과 대조한 기록).

> 「verse–prechorus–chorus 가 1980년대 데이터에서 가장 흔한 형식이었고
> 1990년대 이후 비중이 더 커졌다」 — Summach 의 집계
>
> **「록에서, 특히 헤비메탈에서는 보통 하나 이상의 기타 솔로가 있고 가운데
> 코러스 부분 뒤에 온다」** — [Song structure](https://en.wikipedia.org/wiki/Song_structure)
>
> 「록 인트로는 역사적으로 더 길어서 16~32마디였다」 — 제작 자료

총 128마디. 확신도 `medium` — 형식은 학술·백과 출처지만 마디 배분은
Hot 100 1위 곡 실측(표본 5곡)에서 맞춘 값입니다.

### ⑬ `riddimVersion` — 리딤과 버전 (레게·댄스홀)

> 「A given riddim, if popular, may be used in dozens—or even hundreds—of songs」 ·
> 곡은 「the riddim plus the voicing (vocal part)」 이다
> — [Riddim](https://en.wikipedia.org/wiki/Riddim)

**출처가 섹션도 길이도 말하지 않습니다.** 리딤은 곡의 형식이 아니라 재사용되는
반주이고, 그 위에 얹히는 것이 곡마다 다릅니다. 그래서 이 형식은 «짧은 훅이
되풀이되는 루프» 로만 적고 **확신도를 `low`** 로 둡니다. 근거가 얇다는 사실을
값으로 남깁니다.

> **→ 96마디 (§7-5).** 총 마디만 실측으로 옮겼습니다 — `I:Dancehall 계보`
> 16곡의 중앙값 3:46 에 96마디가 +2 % 입니다. **확신도는 `low` 그대로입니다** —
> 늘어난 것은 총 마디뿐이고 섹션 배분의 근거는 여전히 없습니다. 자메이카의
> 옛 분기 다섯 곡은 이 값에서 +39~61 % 로 벌어지는데, 다섯 곡으로 분기를
> 빼지는 않았습니다(§7-10 ③).

### ⑭ `grungeQuietLoud` — 조용함↔폭발 13구간 (그런지 · 176마디)

⚠ **출처를 확인하지 않은 형식입니다.** 백과·학술 자료가 아니라 **사용자가 적어 준
구간표**를 그대로 옮겼습니다. 어느 곡에서 온 표인지 이 저장소가 검증하지 않았고,
곡 이름은 데이터에 넣지 않습니다(`forms/forms.json` 머리말). 확신도 `low` 입니다.

구성은 4마디 루프를 단위로 **인트로 ×4 · 벌스 ×4 · 프리 ×2 · 코러스 ×4** 를 세
바퀴 돌리되, 첫 코러스 뒤에 **간주 ×2**, 둘째 코러스 뒤에 **기타 솔로 ×4** 가
들어갑니다. 간주와 솔로는 둘 다 `bridge` 자리를 씁니다.

아웃트로만 지정된 ×2 대신 **×4** 로 늘렸습니다 — 그대로 더하면 168마디인데
선율 길이 16·32·64 어느 것으로도 나누어지지 않아 `check-song-length` 에
걸립니다(§1). 176 = 16×11 입니다.

⑫와 갈리는 자리는 **셈여림**입니다. 벌스에서 기타를 0.55 로 내리고(⑫는 0.85),
아웃트로에서는 1.3 으로 **크게 유지**합니다(⑫는 0.9 로 잦아듭니다) — 지정이
「벌스는 절제」·「아웃트로는 폭발적 에너지를 유지한 채 리프 반복」이었습니다.
모든 구간의 `bank` 은 `false` 입니다: 이 형식은 한 구조를 그대로 재현하는 것이
목적이라, 코러스마다 다른 프리셋의 패턴으로 튀면 정반대가 됩니다.

배정은 **`Grunge` 프리셋 하나**입니다(§4 «프리셋 단위 예외»). 화성 쪽은
`harmony.js` 의 `modal_i_iv_III_VI`(도수 0-3-2-5 = 단조 i-iv-III-VI)가 짝인데,
진행 표에는 프리셋 단위가 없어 **`Alternative` 분기 전체가 함께 씁니다.**

### ⑮ `gospelVamp` — 가스펠, 콜앤드리스폰스와 뱀프 (128마디)

> 「In traditional forms, sometimes called the Congregational Song (usually with
> a **12 or 16 bar form**), there is a **call and response** between the soloist
> and choir」 · 「The soloist is expected to improvise lyrics during the **vamp**
> … at the apex of the song」 — [Black gospel music](https://en.wikipedia.org/wiki/Black_gospel_music)
>
> 「a vamp at the end of a song is often called a **tag**」 · 뱀프는 「blues, jazz,
> **gospel**, soul, and musical theater」에서 쓰인다 — [Vamp (music)](https://en.wikipedia.org/wiki/Vamp_(music))

구간은 16마디로 잡았습니다 — 출처의 「12 or 16 bar」 중 12는 4·8·16 격자에
안 맞아 `blues12` 와 같은 이유로 16으로 옮겼습니다. 브릿지를 콜앤드리스폰스가
가장 또렷한 자리로 두고, **아웃트로 32마디가 뱀프**입니다.

⚠ **뱀프의 마디 수는 어느 출처도 말하지 않습니다.** 오히려 「보컬이 준비될
때까지 반복」·「길이가 불확정」이라고 적습니다. 32마디는 **출처의 값이 아니라
«다른 구간의 두 배» 라는 제 선택**이고, 그래서 확신도가 `low` 입니다.

⚠ 「**modulate to a higher key** at the apex」는 **이 도구가 못 합니다** —
근음이 곡 전체에 하나입니다([../melody/01-harmony.md](../melody/01-harmony.md) §7).
형식으로는 절정을 만들 수 있어도 조를 올리지는 못합니다.

`rule` 은 일반 규칙을 뒤집습니다. 기본 규칙은 아웃트로에서 악기를 빼 잦아들게
하는데, **가스펠의 뱀프는 정반대로 곡의 절정**입니다. 아웃트로를 코러스만큼
키우고 오르간·합창을 앞에 세웠습니다.

배정은 **`Gospel` 프리셋 하나**입니다. 분기(`G:Gospel · 지역 장르`)에 걸지 않은
이유는 **같은 분기에 `Zydeco / Cajun` 이 함께 있기 때문**입니다 — 가스펠의 뱀프를
자이데코에 씌울 근거가 없습니다.

> 자이데코도 같은 날 찾아봤습니다 — [Zydeco](https://en.wikipedia.org/wiki/Zydeco)
> 문서에 **구조도 화성도 한 줄이 없습니다.** 그래서 «미조사» 가 아니라
> **«조사했으나 근거 없음»** 입니다. 계열 G 폴백을 그대로 씁니다.

---

## 4. 배정 — 하위분기 72개 → 곡 형식

> ⚠ **이 72 를 «고치지» 마십시오.** 여기서 세는 것은 **(계열, 분기) 쌍**입니다 —
> `assignSub` 의 키가 `A:뿌리` · `B:뿌리` 처럼 계열 접두를 답니다. 분기 «이름»
> 만 세면 그보다 적습니다(`뿌리` 는 A·B·D 가 함께 쓰므로 하나로 셉니다).
> 그래서 `docs/시스템-비즈니스설명서.md` 의 수와 이 수는 **둘 다 맞습니다.**
> 확인: `node tools/counts.mjs` 가 「하위분기」와 「형식이 배정된 분기」를 나눠 찍습니다.

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
| ~~G · Folk~~ | `verseChorus` | **2026-09-20 조사함 — 의심이 확인되지 않았습니다.** Folk music·Contemporary folk·Folk rock 셋을 열었는데 구조 서술은 「the most common form for **tunes** in folk music is **AABB**」 하나뿐이고, 그것은 춤곡 **선율**의 형태라 `melody.js` 의 프레이즈 결합 폼이지 `SONG_FORM` 이 아닙니다. 「유절형」은 어느 문서도 말하지 않습니다 — **근거 없음으로 그대로 둡니다** |
| ~~G · Gospel · 지역 장르~~ | → `Gospel` 만 `gospelVamp` | **2026-09-20 조사해 근거가 섰습니다**(§3 ⑮). 다만 분기가 아니라 **프리셋 단위**로 걸었습니다 — 같은 분기의 `Zydeco / Cajun` 에 가스펠 뱀프를 씌울 근거가 없습니다. 자이데코 쪽은 **조사했으나 근거 없음**입니다 — Zydeco 문서에 구조·화성 서술이 한 줄도 없어 계열 폴백을 그대로 둡니다 |
| H · 브라질 | `verseChorus` | 보사노바 스탠더드는 32마디 AABA 인 경우가 많습니다 — ②일 가능성이 높은데 확인하지 않았습니다 |
| H · 멕시코 · 콜롬비아 · 아르헨티나 | `verseChorus` | 쿠바·푸에르토리코만 조사했습니다 |
| I · 트리니다드 · 바베이도스 · 프랑스어권 | `verseChorus` | 소카·칼립소·주크의 형식을 확인하지 않았습니다 |
| J · 남아프리카 | `grooveHold` | 아마피아노는 7분대 곡이 흔해 ⑦(디제이용)일 수 있습니다 |
| J · 동아프리카 · 북아프리카 | `verseChorus` | 조사하지 않았습니다 |
| B · 지역 팝 · 동아시아 · 서아시아 · 남아시아 | `verseChorus` | 조사하지 않았습니다 |

---

## 5. 형식이 **소리로** 어떻게 나오는가

§3·§4 까지는 표입니다. 표는 소리가 아닙니다 — 조사한 것이 스피커까지 닿아야
의미가 있습니다. 이 절이 그 통로입니다.

### 5-1. 형식마다 섹션 규칙이 따로 있습니다

예전에는 `arrange.js` 의 `SECTION_RULE` **하나**가 형식 전부를 처리했습니다.
그래서 이런 일이 벌어졌습니다.

| 형식 | 출처가 말하는 것 | 기본 규칙이 하던 것 |
|---|---|---|
| `grooveHold` | 「8마디 16마디가 지나도 아무것도 변하지 않는 것이 핵심」 | 인트로에서 트랙 **9개**를 끔 |
| `rumbaSebene` | 「리드 기타와 리듬 기타가 춤을 이끈다」 | 코러스에서 기타 1.55 · **건반 1.40** — 리드가 누군지 흐림 |
| `djTool` | 「디제이가 섞어 넣을 비트를 앞뒤에」 | 인트로에서 **스네어를 끔** — 섞을 격자가 없어짐 |
| `buildDrop` | 「빌드업에서 서브가 아예 빠진다」 | 빌드업에서 베이스가 그대로 울림 |
| `dubstep224` | 「인트로는 리드 베이스 없는 드럼과 분위기」 | 인트로에 베이스가 있음 |
| `blues12` | 기타가 곡 자체인 장르 | 벌스에서 기타를 **0.62** 로 내림 |
| `headSolos` | 헤드는 선율을 적힌 대로 제시하는 자리 | 벌스에서 건반을 **0.72** 로 내림 |

그래서 형식마다 규칙을 갖게 했습니다(`forms.json` 의 `rule`). 덮어쓰기는
**섹션 단위로 통째로** 입니다 — 기본값과 섞으면 표를 읽어서 소리를 짐작할 수
없게 됩니다. 규칙을 안 적은 형식 셋(`verseChorus`·`verseChorusBridge`·
`riddimVersion`)은 기본 규칙을 그대로 씁니다. 앞의 둘은 기본 규칙이 곧
그 형식이고, 리딤은 확신도가 `low` 라 지어내지 않는 쪽을 골랐습니다.

### 5-2. `arc` — 출처가 셈여림에 대해 무엇을 말했는가

| `arc` | 형식 | 뜻 |
|---|---|---|
| `build` (8) | 벌스·코러스 · 힙합 · EDM · 덥스텝 · 디제이용 · 살사 · 수쿠스 | 쌓였다 터지는 형태라고 출처가 서술 |
| `flat` (1) | `grooveHold` | **안 변하는 것이 형식**이라고 출처가 서술 |
| `unsourced` (4) | 블루스 · AABA · 재즈 · 리딤 | 출처가 셈여림을 말하지 않음 |

`unsourced` 가 «아직 안 한 것» 이 아니라 **답**입니다. 12마디 블루스 문서는
화성 진행을 말하지 큰 소리·작은 소리를 말하지 않습니다. 거기에 «코러스는
2 dB 크다» 를 적으면 그것이 곧 지어낸 값입니다.

이 값은 판정 기준을 바꿉니다 — `grooveHold` 는 벌어짐이 **작아야** 통과입니다.

### 5-3. 재 봤습니다 — `tools/measure-sections.mjs`

표가 아니라 실제 재생을 녹음해서 섹션마다 RMS 를 잽니다. 앱 코드는 안
건드리고 마스터로 가는 신호를 가로챕니다(`render-melody.mjs` 와 같은 방식).

```
node tools/measure-sections.mjs Britpop "Chicago Blues" Soukous House Dubstep
```

| 프리셋 | 형식 | `arc` | 벌어짐 | 켜고 꺼지는 트랙 |
|---|---|---|---:|---:|
| House | `djTool` | build | **4.35 dB** | 5 |
| Dubstep | `dubstep224` | build | **14.31 dB** | 3 |
| Britpop | `rockVerseChorus` | build | §6-6 참고 | |
| Son Cubano | `largoMontuno` | build | 1.29 dB | 4 |
| Soukous | `rumbaSebene` | build | 0.79 dB | **5** |
| Chicago Blues | `blues12` | unsourced | 0.74 dB | 0 |
| Heavy Metal | `rockVerseChorus` | build | §6-6 참고 | |
| Motorik | `grooveHold` | flat | **0.27 dB** | 0 |

### 5-4. dB 만 보면 틀립니다

수쿠스가 0.79 dB 입니다. 그런데 이 형식의 사건은 «커진다» 가 아니라
**«누가 이끄는가가 바뀐다»** 입니다.

```
섹션           kick snare  chat   tom  perc  bass   gtr  gtr2
intro         1.00     ·  1.00     ·     ·  0.80     ·     ·
verse         1.00  1.00  1.00  1.00  1.00  1.00  0.80     ·
chorus        1.00  1.00  1.15  1.10  1.25  1.00  1.60  1.45   ← 세베네
```

기타가 0.80 → 1.60 으로 **6 dB** 올라가고 둘째 기타가 새로 들어옵니다. 총
에너지는 그대로인데 곡의 앞면이 통째로 바뀝니다. RMS 는 이것을 못 봅니다.
그래서 도구가 **편성 변화**(켜고 꺼지는 트랙 수)를 함께 세고, 판정도
«dB 가 크거나, 편성이 3트랙 이상 바뀌거나» 로 합니다.

이것은 저장소가 이미 배운 것과 같은 이야기입니다 —
「압축기를 거쳐도 살아남는 건 게인 배율보다 **안 울리는 트랙 수**」
(`arrange.js` §`SECTION_RULE`).

### 5-5. 표의 12트랙은 거짓말입니다

`SECTION_RULE` 은 트랙 12개를 가정하지만 **프리셋은 그만큼 안 갖습니다.**

```
Chicago Blues   kick snare chat + bass keys gtr          ← 7개
Britpop         kick snare chat ohat tom perc + …        ← 12개
```

블루스에서 `clap`·`ohat`·`tom`·`perc` 를 끄고 켜는 규칙은 **통째로 무효**입니다.
그래서 벌스→코러스에서 켜고 꺼지는 트랙이 **0개**이고, 남는 것은 레벨뿐인데
마스터의 글루 컴프·리미터가 그것을 눌러 0.74 dB 로 만듭니다.

`check-song-length.mjs` 의 검사 G 가 이것을 정적으로 잡습니다 — `arc:build`
형식인데 배정된 프리셋에서 켜고 꺼지는 트랙이 0이면 경고합니다.
블루스는 `unsourced` 라 대상이 아닙니다. **평평한 것이 결함이 아니라
«출처가 셈여림을 말하지 않았다» 의 결과**이기 때문입니다.

### 5-6. 큰 필인이 형식을 따릅니다

큰 필인은 «구간이 바뀐다» 는 신호입니다. 예전에는 고정 16마디마다 쳤습니다.
12마디 블루스에서는 15·31마디째에 남의 자리에서 울리고, 정작 **12마디
턴어라운드는 그냥 지나갔습니다.**

곡 구조가 켜져 있으면 주기적 큰 필인을 끄고 **섹션 끝**에 맡깁니다
(`sequencer.js` `onLoopWrap`). 작은 필인은 그루브에 속하는 것이라 그대로입니다.

실측입니다.

```
Chicago Blues  큰 필인 4회 — 섹션 끝에서 4회
               11마디(verse·끝) 23마디(verse·끝) 35마디(chorus·끝) 47마디(verse·끝)
```

블루스의 필인이 **12마디마다** 옵니다. 이것이 턴어라운드 자리입니다.

> ⚠ 위 표의 `blues12` 수치는 48마디판(4바퀴)일 때의 것입니다. §6-3 에서
> 96마디(8바퀴)로 늘렸으므로 필인은 같은 12마디 간격으로 여덟 번 옵니다.

---

## 6. 계열 A(록) 를 대표곡·Hot 100 과 대조했습니다

§3~§5 로 형식이 소리까지 닿았습니다. 그런데 **길이가 맞는지는 아직 안 쟀습니다.**
계열 A 로 그것을 처음 해 봤습니다.

### 6-1. 재는 방법 — 「한 바퀴가 한 곡인가」

이 앱에서 폼 한 바퀴가 «한 곡» 입니다. 그러면 그 한 바퀴의 **시간**이 실제
그 장르 곡의 길이와 비슷해야 합니다. 프리셋마다 BPM 이 정해져 있으므로
마디 수에서 시간이 나옵니다.

```
한 바퀴 초 = 총 마디 × 4 × 60 ÷ BPM
```

비교 대상은 저장소가 이미 가진 것입니다 — `billboard/hot100/` 의 **계열 A
1위 곡 164곡**. 그중 하위분기를 대표하는 곡의 길이를 위키백과 인포박스에서
가져왔습니다(길이는 거기 있고 BPM 은 대개 없습니다 — 그래서 BPM 은 이
저장소의 프리셋 값을 씁니다).

### 6-2. 결과 — 64마디는 록의 **절반**이었습니다

| 대표곡 | 실제 | 예전(64마디) | 오차 |
|---|---:|---:|---:|
| My Sharona (New Wave, 단축판) | 3:58 | 1:58 | −50% |
| You Give Love a Bad Name (Glam Metal) | 3:42 | 1:50 | −51% |
| With or Without You (Alternative Rock) | 4:56 | 2:17 | −54% |
| Good 4 U (Pop Punk) | 2:58 | 1:30 | −49% |
| Light My Fire (Psychedelic, 앨범판) | 7:06 | 2:03 | −71% |

같은 이야기가 집계에도 있습니다 — 미국 1위 곡의 평균 길이는 전 시대를
통틀어 **3.8분**이고, 1960년대가 2분 안팎, 1980년대 후반이 5분에 가깝습니다
([NME 의 빌보드 60년 집계 소개](https://www.nme.com/blogs/nme-blogs/billboard-100-shorter-explicit-2054269)).
125 BPM 에서 64마디는 **2분 3초**입니다. 록에서는 한 곡이 아니라 반 곡입니다.

### 6-3. 고친 것 셋

**① `rockVerseChorus` — 128마디, 기타 솔로가 있는 형식**

출처 셋이 겹칩니다.

> 「verse–prechorus–chorus 가 1980년대 데이터에서 가장 흔한 형식이었고
> 1990년대 이후 그 비중이 더 커졌다」 — Summach 의 집계
> ([MTO 학술지](https://mtosmt.org/issues/mto.22.28.3/mto.22.28.3.nobile.pdf) 가 인용)
>
> **「록에서, 특히 헤비메탈에서는 보통 하나 이상의 기타 솔로가 있고
> 가운데 코러스 부분 뒤에 온다」** — [Song structure](https://en.wikipedia.org/wiki/Song_structure)
>
> 「록 인트로는 역사적으로 더 길어서 16~32마디였다」 — 제작 자료

```
인트로16 → 벌스16 → 프리16?8 → 코러스16 → 벌스16 → 프리8 → 코러스16
        → 브릿지16(기타 솔로) → 코러스8 → 아웃트로8   =  128마디
```

**기타 솔로 자리가 이 형식의 핵심입니다.** 앱에 브릿지는 있었지만 그 자리가
솔로라는 사실이 소리에 없었습니다 — 기본 규칙은 브릿지에서 건반을 1.15 로
올리고 기타를 0.90 으로 내립니다. 록에서는 반대여야 합니다.

| | 기본 규칙 | `rockVerseChorus` |
|---|---|---|
| 인트로 | 기타 **끔** (팝 인트로) | 기타 1.20 — 록 인트로는 리프다 |
| 벌스 | 기타 0.62 | 기타 0.85 — 록에서 기타는 반주가 아니다 |
| 브릿지 | 건반 1.15 · 기타 0.90 | **기타 1.55 · 건반 0.55 · 둘째기타 끔** — 솔로 |

솔로를 **코러스보다 크게 만들지는 않았습니다.** 출처는 「솔로가 있고 가운데
코러스 뒤에 온다」고만 하지 「더 크다」고 하지 않습니다. 첫 판에서는 기타를
1.70 으로 올렸다가 실측에서 솔로가 코러스보다 커져(+0.87 vs +0.47) 되돌렸습니다 —
기타를 코러스와 같은 1.55 로 두고 건반·둘째기타를 빼서 **누가 앞에 있는가만**
바꿉니다. 세베네(⑨)와 같은 원리입니다.

**② `aaba32` 를 80마디로 — 「두 바퀴 + BA」**

> 「AABA 곡은 거의 언제나 완전한 AABA 한 바퀴를 돌고, 그 뒤에 또 한 바퀴를
> 돌거나 불완전한 한 바퀴(보통 BA)를 돈다」
> — [Open Music Theory](https://openmusictheory.github.io/popRockForm.html)

32마디는 168 BPM 에서 **46초**입니다. 곡이 아닙니다. 출처가 든 두 방식을
둘 다 쓰면 8×4 + 8×4 + 8×2 = **80마디**이고, 168 BPM 에 1분 54초입니다 —
1960년대 1위 곡이 2분 안팎이라는 집계와 맞습니다.

**③ `grooveHold` 를 192마디로**

길이도 이 형식의 일부였는데 그것을 안 적고 있었습니다. 출처가 드는 곡이
아프로비트 10~30분 · 사이키델릭 록 앨범판 7분대입니다. 64마디는 125 BPM 에
2분 3초라 **붙잡을 그루브가 될 시간이 없습니다.** 192마디(64×3)로 늘리면
110~142 BPM 에서 5분 24초~6분 59초가 됩니다.

### 6-4. 고친 뒤

| 대표곡 | 실제 | 지금 | 오차 |
|---|---:|---:|---:|
| My Sharona (New Wave) | 3:58 | 3:56 | **−1%** |
| You Give Love a Bad Name (Heavy Metal) | 3:42 | 3:39 | **−1%** |
| Good 4 U (Pop Punk) | 2:58 | 3:01 | **+2%** |
| 1990년대 1위 평균 (Grunge) | ≈4:30 | 4:39 | **+3%** |
| 1960년대 1위 평균 (Rock & Roll) | ≈2:00 | 1:54 | **−5%** |
| With or Without You (Alternative Rock) | 4:56 | 4:34 | −7% |
| Light My Fire (Psychedelic) | 7:06 | 6:09 | −13% |

### 6-5. 이 대조에서 배운 것 — 길이는 형식의 일부입니다

**길이는 형식의 일부입니다.** §2 에서 «폼이 선율 길이를 정한다» 까지는 갔지만,
«폼 자체가 몇 마디인가» 는 재 보지 않고 대부분 64로 두었습니다. 64는
**조사 결과가 아니라 어제의 습관**이었습니다.

그래서 남은 계열에도 같은 질문이 열려 있습니다 — B(팝)·C(힙합)·D·E·F·G·H·I·J
의 64마디 폼들은 아직 실제 곡 길이와 대조하지 않았습니다. 힙합만은 출처가
「60~72마디」를 직접 말해서 64가 근거를 갖습니다(§3 ⑪).

> **→ §7 에서 했습니다.** 그리고 여기 적은 «힙합만은 64가 근거를 갖는다» 도
> 틀렸습니다 — 그 출처는 **체감 마디**를 세고 있었고, 표기 마디로는 두 배입니다
> (§7-6).

### 6-6. 소리로도 확인했습니다

```
node tools/measure-sections.mjs "Heavy Metal" Britpop "Rock & Roll"
```

| 프리셋 | 형식 | 벌어짐 | 가장 큰 섹션 | 큰 필인 |
|---|---|---:|---|---|
| Britpop | `rockVerseChorus` 128 | 1.55 dB | **코러스** +0.83 | 9회 전부 섹션 끝 |
| Heavy Metal | `rockVerseChorus` 128 | 1.17 dB | **코러스** +0.30 | 9회 전부 섹션 끝 |
| Rock & Roll | `blues12` 96 | 0.75 dB | 코러스 +0.45 | 8회 전부 섹션 끝 — **12마디마다** |

**기타 솔로가 실제로 리드를 바꿉니다** (Britpop).

```
섹션           kick snare  chat  ohat   tom  perc  bass  keys   gtr  gtr2
verse         1.00  1.00  1.00     ·     ·     ·  0.95  0.80  0.85     ·
chorus        1.00  1.20  1.15  1.00     ·     ·  1.15  1.25  1.55  1.35
bridge        1.00  1.05  1.00  1.00  1.15     ·  1.00  0.55  1.55     ·   ← 기타 솔로
```

브릿지에서 건반이 0.80 → **0.55** 로 물러나고 기타가 0.85 → **1.55** 로 앞에
나옵니다. 둘째 기타는 빠집니다 — 솔로는 한 대가 치는 것입니다.
전체 크기는 코러스보다 작습니다(−0.19 vs +0.83). 의도한 대로입니다.

**로큰롤의 필인이 12마디마다 옵니다** — 11 · 23 · 35 · 47 · 59 · 71 · 83 · 95.
12마디 블루스의 턴어라운드 자리입니다.

### 6-7. 남은 한계 — 펑크·메탈은 끄고 켤 층이 없습니다

`check-song-length.mjs` 의 검사 G 가 `rockVerseChorus` 를 받는 프리셋 **17종**에
경고를 답니다 — 켜고 꺼지는 트랙이 0~1개입니다. Punk · Death Metal · Doom ·
Hardcore Punk · Post-punk 같은 것들이고, 이유는 **프리셋에 층이 없어서**입니다.

```
Heavy Metal   kick snare chat + bass gtr gtr2      ← 없는 트랙: clap ohat perc keys keys2
```

건반이 없으니 코러스의 `keys 1.25` 가 무효이고, 남는 대비는 둘째 기타 하나와
레벨뿐입니다. 그래서 Heavy Metal 의 벌어짐이 1.17 dB 로 Britpop(1.55)보다 얇습니다.

**이것은 형식의 결함이 아닙니다.** 펑크·메탈에서 «벌스는 뮤트 기타 한 대,
코러스는 두 대» 가 실제 그 장르의 방식이고, 그 한 트랙(gtr2)이 바로 지금
움직이고 있는 것입니다. 층을 더 만들려면 프리셋 쪽을 건드려야 하고 그것은
이 문서의 일이 아닙니다 — 검사는 이 상태를 **경고로 남겨 보이게만** 합니다.

---

## 7. 계열 B~J 도 Hot 100 과 대조했습니다

§6-5 가 남긴 숙제입니다 — 「B·C·D·E·F·G·H·I·J 의 64마디 폼들은 아직 실제 곡
길이와 대조하지 않았습니다」.

### 7-1. 이번에는 표본을 손으로 고르지 않았습니다

§6 은 하위분기마다 **대표곡 한 곡**을 골라 다섯 곡을 봤습니다. 고르는 사람이
답을 정할 수 있는 방법입니다. 이번에는 [`../billboard/hot100/`](../billboard/hot100/)
의 1위 곡을 **전부** 넣고 위키백과 인포박스에서 길이를 받았습니다.

```
계열 B~J 의 1위 곡        1,023곡
길이를 찾은 것              979곡  (95.7 %)
```

쓰는 값은 **계열·하위분기별 중앙값**입니다. 곡 이름은 여기 안 들어갑니다
([profiles/README.md §2](profiles/README.md)) — 들어가는 것은 «몇 곡의 중앙값» 입니다.

### 7-2. 먼저 나온 것 — 곡 길이는 장르보다 **시대**의 함수입니다

| 십년 | 곡수 | 중앙값 |
|---|---:|---:|
| 1960년대 | 140 | 2:44 |
| 1970년대 | 225 | 3:36 |
| 1980년대 | 166 | 4:11 |
| 1990년대 | 120 | **4:21** |
| 2000년대 | 121 | 3:55 |
| 2010년대 | 115 | 3:41 |
| 2020년대 | 92 | 3:20 |

§6-2 가 인용한 집계(전 시대 평균 3.8분 · 1960년대 2분 안팎 · 1980년대 후반이
5분에 가까움)와 같은 모양입니다. 다른 점은 이번엔 **저장소 자신의 데이터로
잰 것**이라는 점입니다.

그래서 «한 곡은 64마디» 는 **틀린 값이 아니라 1960년대 값**이었습니다.
계열 B 에서 그것이 그대로 보입니다.

```
B:뿌리 (Traditional Pop · Girl Group · Brill Building …)  68곡  2:42  →  64마디로 −4 %
B:Soft Rock · AOR 계보                                    175곡  3:57  →  64마디로 −41 %
```

### 7-3. 분기마다 몇 마디여야 하는가 — 역산

§6-1 의 식을 뒤집습니다. 프리셋 BPM 은 저장소가 가진 값입니다.

```
필요 마디 = 실측 중앙값(초) × BPM ÷ 240
```

표본 20곡 이상인 분기입니다.

| 분기 | 곡수 | 실측 | BPM | 필요 마디 | 그때 값 |
|---|---:|---:|---:|---:|---:|
| B:Soft Rock · AOR 계보 | 175 | 3:57 | 110 | 109 | 64 |
| D:Contemporary R&B | 139 | 4:08 | 90 | 93 | 64 |
| B:Dance-pop 계보 | 83 | 3:55 | 120 | 118 | 64 |
| D:Soul | 74 | 3:02 | 118 | 89 | 64 |
| **B:뿌리** | 68 | 2:42 | 104 | **70** | **64** |
| B:Teen Pop · Indie Pop | 49 | 3:12 | 110 | 88 | 64 |
| D:Funk | 44 | 4:07 | 113 | 116 | 192 |
| C:Trap 계열 | 43 | 3:19 | 140 | 116 | 64 |
| D:Disco | 43 | 3:58 | 124 | 123 | 96 |
| B:Synth-pop 계보 | 41 | 3:38 | 130 | 118 | 64 |
| G:Country | 35 | 3:16 | 110 | 90 | 64·80 |
| G:Folk | 32 | 3:36 | 115 | 104 | 64·80 |
| C:Southern | 24 | 3:53 | 132 | 128 | 64 |
| C:뿌리 · 골든에이지 | 21 | 4:07 | 98 | 101 | 64 |

### 7-4. 한 값으로 덮으면 **96마디**입니다

표본 10곡 이상인 분기 18개에 대해, 후보마다 «곡 수로 가중한 평균 절대오차» 를
냈습니다.

| 총 마디 | 선율 길이 | 가중 평균 절대오차 |
|---:|---:|---:|
| 64 | 64 | 35.6 % |
| 80 | 16 | 21.6 % |
| **96** | **32** | **13.6 %** |
| 112 | 16 | 16.1 % |
| 128 | 64 | 28.9 % |
| 192 | 64 | 93.2 % |

**112가 더 가까운데 96을 고른 이유**가 있습니다. §2 의 규칙이 «폼이 선율 길이를
정한다» 이고, 112는 16·32·64 중 **16으로만** 나누어집니다. 112를 고르면 계열
B·D·G·H 의 선율이 통째로 16마디판으로 떨어져 재료가 4분의 1이 됩니다. 96은
32로 나누어집니다. 1.5 %p 를 그 대가로 치르지 않았습니다 — **격자가 값을
제한하는 자리라서, 그 사실을 여기 적어 둡니다.**

### 7-5. 고친 것 — 새 형식 넷, 값 바꾼 것 다섯

| 형식 | 전 | 후 | 근거 |
|---|---:|---:|---|
| `popVerseChorus` | — | **96** | 신설. 1970년대 이후 벌스·코러스 |
| `popVerseChorusBridge` | — | **96** | 신설. 브릿지를 둔 판 |
| `verse16hook8Half` | — | **128** | 신설. 하프타임 표기 분기(§7-6) |
| `grooveHoldSingle` | — | **128** | 신설. 싱글로 차트에 오른 펑크(§7-7) |
| `verse16hook8` | 64 | **96** | 벌스 셋 · 훅 셋 |
| `djTool` | 96 | **128** | 브레이크다운을 둘로 |
| `riddimVersion` | 64 | **96** | 총 마디만. 확신도는 low 그대로 |
| `largoMontuno` | 64 | **96** | 몬투노가 곡의 3분의 2가 됨 |
| `rumbaSebene` | 64 | **128** | 세베네에 자리를 줌 |
| `verseChorus` · `verseChorusBridge` | 64 | 64 | **값은 그대로, 배정만 1960년대 분기로 좁힘** |

**늘린 방법이 중요합니다.** 섹션을 늘이지 않고 **한 바퀴를 더 돌게** 했습니다.
출처가 못 박는 것은 «벌스 8~16 · 코러스 8~16 · 2의 배수» 라는 **섹션 길이**이지
곡 길이가 아닙니다(§3 ①). 섹션을 24마디로 늘이면 그것이 곧 지어낸 값입니다.

```
popVerseChorus   인트로4 · 벌스16 · 프리4 · 코러스16
                 · 벌스16 · 프리4 · 코러스16 · 코러스16 · 아웃트로4   = 96
```

### 7-6. 같은 마디가 다른 시간이 됩니다 — 하프타임 표기

계열 C 가 한 값으로 안 덮였습니다.

```
C:뿌리 · 골든에이지   98 BPM   필요 101마디
C:Trap 계열        140 BPM   필요 116마디
C:Southern        132 BPM   필요 128마디
```

곡 길이는 셋 다 3~4분대인데 **BPM 이 다르니 필요한 마디가 다릅니다.** 그리고
그 BPM 차이는 스타일이 아니라 **표기법**입니다 — 저장소의
[`data/genres.json`](../data/genres.json) 이 이미 `feltBpm` 으로 적고 있습니다.

```
Trap           표기 140 → 체감 70
Chicago Drill  표기 138 → 체감 69
Crunk          표기 150 → 체감 75
```

체감으로 16마디인 벌스가 표기로는 32마디입니다. 그래서 이 분기들만
`verse16hook8Half`(128마디)로 뺐습니다. **지어낸 차이가 아니라 같은 곡을 두 배로
세는 자리**입니다.

이것이 §3 ⑪ 의 출처와 실측이 갈렸던 이유이기도 합니다.

> 「many rap songs contain between 60 and 72 bars」 — 제작 자료

128마디를 **체감 마디로 세면 64마디**라 이 범위 한가운데입니다. 출처가 틀린 게
아니라 세는 단위가 달랐습니다. 다만 계열 C 의 옛 분기(98 BPM · 하프타임 아님)는
실측이 101마디를 요구해 이 범위 밖입니다 — 거기서는 **실측을 따랐고, 갈린다는
사실을 여기 적어 둡니다.**

### 7-7. 싱글이냐 앨범이냐 — 안 고친 것들

Hot 100 이 재는 것은 **싱글**입니다. 그런데 형식 중에는 싱글이 원래 단위가
아닌 것이 있습니다. 위키백과가 그 둘을 나란히 적는 자리가 있습니다.

> 「DJs and producers creating a house track to be played in clubs may make a
> **"seven or eight-minute 12-inch mix"**; if the track is intended to be played
> on the radio, a **"three-and-a-half-minute" radio edit** is used.」
> — [House music](https://en.wikipedia.org/wiki/House_music)

같은 음악에 길이가 둘입니다. `djTool` 은 **편집본 쪽(128마디)** 으로 맞췄습니다 —
차트에 오른 것이 그쪽이고, 이 앱의 다른 형식이 전부 싱글 길이에 맞춰져 있어
한 자리만 다른 자를 쓰면 비교가 안 됩니다. 12인치 길이는 여기 적어 둡니다.

**그래서 안 고친 것 셋.**

| 형식 | 실측 | 지금 | 왜 안 고쳤나 |
|---|---:|---:|---|
| `grooveHold` | — | 192 | 아프로비트의 단위는 앨범 한 면이다. 저장소 자신의 조사도 「곡 길이 10~20분」이라 적는다([10-african.md](10-african.md)) |
| `dubstep224` | 3:40 (2곡) | 224 | 표본 둘이고 둘 다 라디오 편집본이다 |
| `grooveHold`(앰비언트) | 4:15 (2곡) | 192 | 같음 |

**펑크만 갈라냈습니다.** 아프로비트와 달리 펑크는 **싱글로 차트에 올랐습니다** —
1위 곡이 44곡이고(Funk 3:55 · Disco Funk 5:06 · Post-disco 4:39 ·
Minneapolis Sound 4:00) 중앙값이 4:07 입니다. 표본이 둘인 자리와 44인 자리를
같이 취급할 수 없어서, `grooveHoldSingle`(128마디)로 뺐습니다. 섹션 규칙은
`grooveHold` 와 같습니다 — 형식이 같고 길이만 다르니 규칙이 갈릴 근거가 없습니다.

### 7-8. 고친 뒤

표본 10곡 이상인 분기, 곡 921건 기준입니다.

```
곡 수로 가중한 평균 절대오차     34.7 %  →  9.2 %
가장 나쁜 곳                  D:Funk +66 %  →  B:Synth-pop 계보 −19 %
```

| 계열 | 곡수 | 전 | 후 |
|---|---:|---:|---:|
| B | 427 | 34.7 % | 12.4 % |
| C | 102 | 43.1 % | **6.6 %** |
| D | 313 | 33.6 % | **6.0 %** |
| G | 68 | 28.5 % | 11.9 % |
| I | 22 | 25.8 % | 14.3 % |
| H | 4 | 44.0 % | 16.1 % |
| E | 10 | 42.5 % | 33.8 % |
| F | 2 | 45.8 % | 45.8 % |
| J | 1 | 53.6 % | 75.8 % |

**E·F·J 는 숫자를 믿으면 안 됩니다.** 표본이 각각 10·2·1곡입니다. E 와 J 가
남은 것은 §7-7 에서 안 고치기로 한 자리들이고, F 는 두 곡이 각각 2:40 과 7:40
이라 중앙값이 뜻을 갖지 않습니다.

### 7-9. 소리로도 확인했습니다

표만 고치고 끝내면 §5 에서 배운 것을 잊는 것입니다 — 「조사가 데이터에만 있었다」.

```
node tools/measure-sections.mjs "Dance-pop" Trap "Boom Bap" Disco Funk Soukous "Reggae One Drop"
```

| 프리셋 | 형식 | 한 바퀴 | 벌어짐 | 가장 큰 섹션 | 큰 필인 |
|---|---|---:|---:|---|---|
| Dance-pop | `popVerseChorus` 96 | 3:12 | 0.80 dB · **편성 6트랙** | 코러스 +0.28 | 8회 전부 섹션 끝 |
| Trap | `verse16hook8Half` 128 | 3:39 | 1.05 dB | 코러스 +0.50 | 6회 전부 섹션 끝 |
| Boom Bap | `verse16hook8` 96 | 4:16 | 1.15 dB | 코러스 +0.74 | 8회 전부 섹션 끝 |
| Disco | `djTool` 128 | 4:20 | **8.11 dB** | 코러스 +1.41 | 7회 전부 섹션 끝 |
| Funk | `grooveHoldSingle` 128 | 4:44 | **0.21 dB** | — | **0회** |
| Soukous | `rumbaSebene` 128 | 3:32 | 0.96 dB · 편성 5트랙 | 세베네 +0.13 | 4회 |
| Reggae One Drop | `riddimVersion` 96 | 5:07 | 2.04 dB | 코러스 +1.30 | 7회 전부 섹션 끝 |

**① 펑크는 길이만 바뀌고 성질은 그대로입니다.** `grooveHoldSingle` 의 벌어짐이
0.21 dB 이고 큰 필인이 0회입니다. `arc: flat` 인 형식에서는 **이것이 통과**입니다
(§5-2) — 벌스를 다섯에서 셋으로 줄인 것뿐이고 «안 변하는 것이 형식» 이라는
성질은 건드리지 않았다는 뜻입니다.

**② 세베네가 한 덩어리로 옵니다.** Soukous 의 큰 필인은 7 · 23 · 39 · **127**
마디입니다. 앞의 셋은 인트로와 벌스 둘의 끝이고, 그 다음은 **88마디 뒤인 곡
끝**입니다. 「몬투노가 시작되면 곡이 끝날 때까지 이어진다」·「뒤는 끝까지
세베네」가 소리에서 그대로 나옵니다 — 중간에 끊는 필인이 없습니다.

**③ 브레이크를 둘로 늘린 것이 djTool 에서 가장 크게 나옵니다.** Disco 의
브레이크가 −6.69 dB 로 떨어졌다 코러스에서 +1.41 dB 로 올라와 벌어짐이
8.11 dB 입니다. 12인치의 «가운데가 비는» 모양입니다.

**④ 팝은 dB 가 아니라 편성으로 갈립니다.** Dance-pop 의 벌어짐은 0.80 dB 인데
인트로→코러스에서 **트랙 6개**가 켜집니다. §5-4 에서 수쿠스로 배운 것과 같은
자리입니다 — dB 만 보면 틀립니다.

**⑤ 여기서 §7-10 ③ 이 눈에 보입니다.** `Reggae One Drop` 은 75 BPM 이라
96마디가 **5분 7초**입니다. `I:Reggae 갈래` 실측 중앙값이 2:59 이므로 이
프리셋은 분명히 깁니다. 분기를 빼지 않은 이유는 표본이 세 곡이기 때문이고,
**틀렸을 수 있다는 것을 알고 둔 값**이라는 뜻입니다. 표본이 쌓이면 여기부터
다시 봅니다.

### 7-10. 남은 한계

**① 7인치 싱글 자체가 3~4분짜리 매체입니다.**

> 「The conventional 7-inch single usually holds three or four minutes of music
> at full volume.」 — [Twelve-inch single](https://en.wikipedia.org/wiki/Twelve-inch_single)

우리가 맞춘 것은 **곡의 길이가 아니라 싱글의 길이**일 수 있습니다. §7-2 의
시대 곡선이 «곡이 길어졌다» 가 아니라 «매체가 허용하는 길이가 늘었다» 일 가능성을
배제하지 못합니다. 같은 이야기를 콩고 룸바 문서가 직접 합니다.

> 「끊지 않고 길게 연주하던 악단이, 녹음기 바늘이 3분이면 디스크 중심에 닿는
> 제약에 부딪혔다」 · 「3분 포맷이 더 조인 구조를 강요했다」
> — [Congolese rumba](https://en.wikipedia.org/wiki/Congolese_rumba)

`rumbaSebene` 를 128마디로 올린 근거가 이것입니다 — **3분조차 음악이 아니라
매체가 정한 값**이고, [Soukous](https://en.wikipedia.org/wiki/Soukous) 문서가 드는
대표곡은 8분입니다. 64마디는 145 BPM 에 1분 46초라 그 제약보다도 짧았습니다.

**② 표본이 얇은 분기 — 고쳤지만 근거가 두껍지 않습니다.**

```
H:푸에르토리코 · 도미니카     2곡   largoMontuno 를 96마디로
H:현대 크로스오버            2곡
J:중앙아프리카              0곡   rumbaSebene 는 위 인용에만 기댄다
F 계열 전체                4곡   headSolos 128마디는 그대로 두었다
```

**③ 자메이카의 옛 분기가 길어졌습니다.**

```
I:Dancehall 계보   16곡  3:46  →  +2 %
I:Reggae 갈래       3곡  2:59  →  +61 %
I:자메이카           2곡  2:44  →  +39 %
```

계열 B 에서 본 것과 같은 시대 갈림입니다 — 1970년대 싱글이 짧습니다. 그런데
표본이 다섯 곡이라 **분기를 따로 빼지 않았습니다.** 68곡으로 확인한 B:뿌리 와
다섯 곡을 같은 근거로 다룰 수 없습니다.

**④ 조사하지 않은 것은 그대로입니다.** §4 의 `unresearched` 19건은 «이 분기가
어떤 형식인가» 를 안 본 목록이고, 이번에 본 것은 «그 형식이 몇 마디인가» 입니다.
둘은 다른 질문이라 목록은 줄지 않았습니다.
