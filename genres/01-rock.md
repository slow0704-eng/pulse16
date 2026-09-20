# A. Rock 계열 — 장르별 특징

> [00-tree.md](00-tree.md) **A 계열**의 모든 장르를 트리 등장 순서대로 다룹니다.
> BPM은 관행적 범위이지 규격이 아닙니다. `★` = 현재 PULSE·16 프리셋 존재.
> 박자는 [../patterns/01-rock.md](../patterns/01-rock.md), 표기 규칙은 [../patterns/README.md](../patterns/README.md).
> 엔진 이름의 뜻은 [00-instruments.md](00-instruments.md) — 문서 끝의 **PULSE·16 설정값** 표와 짝입니다.
> **곡 형식**(몇 마디짜리 곡인가 · 기타 솔로 자리)은 [00-form.md](00-form.md) 입니다.

---

## 0. 이 계열의 곡 형식 — 2026-09-17 에 Hot 100 과 대조했습니다

이 계열의 1위 곡 **164곡**(`../billboard/hot100/`)에서 하위분기를 대표하는 곡의
길이를 가져와, 앱의 폼 한 바퀴와 비교했습니다. **64마디 폼은 실제 곡의 절반**
이었습니다(My Sharona 3:58 vs 1:58). 자세한 기록은 [00-form.md §6](00-form.md) 입니다.

| 하위분기 | 형식 | 총 마디 | 왜 |
|---|---|---:|---|
| 뿌리 | `aaba32` · `rockVerseChorus` | 80 · 128 | 32마디 AABA 를 «두 바퀴 + BA» 로. 1960년대 1위 곡이 2분 안팎이라는 집계와 맞습니다 |
| 뿌리 · **Rock & Roll** | `blues12` · `aaba32` | 96 · 80 | 이 문서 §1 이 이 장르의 핵심을 «12마디 블루스 구조» 라고 적습니다 — 분기가 아니라 이 프리셋만 예외입니다 |
| Hard Rock · Metal · Punk · Post-punk · Alternative · 루츠와의 교차 | `rockVerseChorus` | 128 | 벌스-프리코러스-코러스에 **기타 솔로**를 더한 형식. 솔로는 출처가 록·메탈에 대해 명시합니다 |
| Psychedelic · Krautrock | `grooveHold` | 192 | «8마디 16마디가 지나도 아무것도 안 변하는 것이 핵심». 길이도 형식의 일부라 64 → 192 로 늘렸습니다 |

---

## 1. 뿌리

| 장르 | BPM | 리듬 골격 | 음색·편성 | 핵심 포인트 |
|---|---|---|---|---|
| **Rock & Roll** | 140~180 | 셔플 또는 스트레이트 8분, 백비트 | 슬랩 베이스, 튜브 앰프, 피아노 | 12마디 블루스 구조 |
| Surf Rock | 140~180 | 빠른 백비트 | 스프링 리버브 기타, 트레몰로 피킹 | 리버브가 곧 음색 |
| Garage Rock | 120~160 | 거친 백비트 | 저품질 녹음, 파즈 | 다듬지 않음이 미학 |
| Proto-punk | 130~170 | 단순한 8분 | 원테이크 녹음 | 펑크의 직전 단계 |
| Instrumental Rock | 120~160 | 백비트 | 리버브·트레몰로 기타, 오르간 | 보컬 자리를 선율 악기가 맡음 |
| **British Invasion** | 120~165 | 백비트 + 탬버린 | 클린~크런치 기타, 겹친 보컬 | 로큰롤의 역수입 |

**British Invasion 노트**
리듬 골격은 로큰롤·R&B와 같습니다. 갈리는 것은 **보컬 하모니와 탬버린**입니다.
백비트에 탬버린이 붙고, 후렴에서 2~3성부가 겹칩니다. 셔플을 빼고
스트레이트 8분으로 가면 이 시기의 소리에 가까워집니다.

<!-- chart-auto:start -->

**차트 1위 — 이 분기에서 나온 것** *(Hot 100 51곡 · Billboard 200 22장)*

> 출처는 [../billboard/](../billboard/) — **곡·앨범명은 위키백과 그대로이지만
> 장르는 붙인 것**입니다. `?` 는 자료가 갈리는 것이고, 없다고 확정은 아닙니다.
> 연도는 1위에 오른 해이며, 재등정은 첫 해만 남겼습니다.
> **패턴의 근거로 쓰지 말고, 무엇을 들어 볼지 고르는 입구로만 쓰십시오.**
> 이 표는 자동 생성입니다 — `tools/chart-to-genres.mjs`. 여기가 아니라 `billboard/` 를 고치십시오.

| 장르 | 연도 | 곡 · 앨범 | 아티스트 | 차트 |
|---|---|---|---|---|
| British Invasion | 1964 | I Want to Hold Your Hand | The Beatles | Hot 100 |
| British Invasion | 1964 | She Loves You | The Beatles | Hot 100 |
| British Invasion | 1964 | Can't Buy Me Love | The Beatles | Hot 100 |
| British Invasion | 1964 | Love Me Do | The Beatles | Hot 100 |
| British Invasion | 1964 | A World Without Love | Peter and Gordon | Hot 100 |
| British Invasion | 1964 | A Hard Day's Night | The Beatles | Hot 100 |
| British Invasion | 1964 | The House of the Rising Sun | The Animals | Hot 100 |
| British Invasion | 1964 | Do Wah Diddy Diddy | Manfred Mann | Hot 100 |
| British Invasion | 1964 | I Feel Fine | The Beatles | Hot 100 |
| British Invasion | 1964 | Meet the Beatles! | The Beatles | BB200 |
| British Invasion | 1964 | The Beatles' Second Album | The Beatles | BB200 |
| British Invasion | 1964 | A Hard Day's Night | The Beatles (사운드트랙) | BB200 |
| British Invasion | 1965 | Downtown | Petula Clark | Hot 100 |
| British Invasion | 1965 | Eight Days a Week | The Beatles | Hot 100 |
| British Invasion | 1965 | I'm Telling You Now | Freddie and the Dreamers | Hot 100 |
| British Invasion | 1965 | The Game of Love | Wayne Fontana and the Mindbenders | Hot 100 |
| British Invasion | 1965 | Mrs. Brown, You've Got a Lovely Daughter | Herman's Hermits | Hot 100 |
| British Invasion | 1965 | Ticket to Ride | The Beatles | Hot 100 |
| British Invasion | 1965 | (I Can't Get No) Satisfaction | The Rolling Stones | Hot 100 |
| British Invasion | 1965 | I'm Henry VIII, I Am | Herman's Hermits | Hot 100 |
| British Invasion | 1965 | Help! | The Beatles | Hot 100 |
| British Invasion | 1965 | Get Off of My Cloud | The Rolling Stones | Hot 100 |
| British Invasion | 1965 | Over and Over | The Dave Clark Five | Hot 100 |
| British Invasion | 1965 | Beatles '65 | The Beatles | BB200 |
| British Invasion | 1965 | Beatles VI | The Beatles | BB200 |
| British Invasion | 1965 | Out of Our Heads | The Rolling Stones | BB200 |
| British Invasion | 1965 | Help! | The Beatles (사운드트랙) | BB200 |
| British Invasion | 1966 | We Can Work It Out | The Beatles | Hot 100 |
| British Invasion | 1966 | Paperback Writer | The Beatles | Hot 100 |
| British Invasion | 1966 | Rubber Soul | The Beatles | BB200 |
| British Invasion | 1966 | Yesterday and Today | The Beatles | BB200 |
| British Invasion | 1995 | Anthology 1 | The Beatles | BB200 |
| British Invasion | 1996 | Anthology 2 | The Beatles | BB200 |
| British Invasion | 1996 | Anthology 3 | The Beatles | BB200 |
| British Invasion | 2000 | 1 | The Beatles | BB200 |
| Rock & Roll | 1960 | Teen Angel | Mark Dinning | Hot 100 |
| Rock & Roll | 1960 | Stuck on You | Elvis Presley | Hot 100 |
| Rock & Roll | 1960 | Cathy's Clown | The Everly Brothers | Hot 100 |
| Rock & Roll | 1960 | The Twist | Chubby Checker | Hot 100 |
| Rock & Roll | 1960 | G.I. Blues | Elvis Presley (사운드트랙) | BB200 |
| Rock & Roll | 1961 | Pony Time | Chubby Checker | Hot 100 |
| Rock & Roll | 1961 | Runaway | Del Shannon | Hot 100 |
| Rock & Roll | 1961 | Travelin' Man | Ricky Nelson | Hot 100 |
| Rock & Roll | 1961 | Running Scared | Roy Orbison | Hot 100 |
| Rock & Roll | 1961 | Quarter to Three | U.S. Bonds | Hot 100 |
| Rock & Roll | 1961 | G.I. Blues | Elvis Presley | BB200 |
| Rock & Roll | 1962 | Peppermint Twist | Joey Dee and the Starliters | Hot 100 |
| Rock & Roll | 1962 | Hey! Baby | Bruce Channel | Hot 100 |
| Rock & Roll | 1962 | Good Luck Charm | Elvis Presley | Hot 100 |
| Rock & Roll | 1962 | Sheila | Tommy Roe | Hot 100 |
| Rock & Roll | 1963 | Sugar Shack | Jimmy Gilmer & the Fireballs | Hot 100 |
| Rock & Roll | 1964 | Oh, Pretty Woman | Roy Orbison | Hot 100 |
| Rock & Roll | 1965 | Roustabout | Elvis Presley (사운드트랙) | BB200 |
| Rock & Roll | 1974 | You're Sixteen | Ringo Starr | Hot 100 |
| Rock & Roll | 1978 | You're the One That I Want | John Travolta and Olivia Newton-John | Hot 100 |
| Rock & Roll | 1978 | Grease | Soundtrack | BB200 |
| Rock & Roll | 1980 | Crazy Little Thing Called Love | Queen | Hot 100 |
| Rock & Roll | 1987 | La Bamba | Los Lobos | Hot 100 |
| Rock & Roll | 1987 | La Bamba | Los Lobos (사운드트랙) | BB200 |
| Rock & Roll | 2002 | ELV1S: 30 #1 Hits | Elvis Presley | BB200 |
| Rock & Roll | 2023 | Rockin' Around the Christmas Tree | Brenda Lee | Hot 100 |
| Garage Rock | 1965 | Hang On Sloopy | The McCoys | Hot 100 |
| Garage Rock | 1966 | Hanky Panky | Tommy James and the Shondells | Hot 100 |
| Garage Rock | 1966 | Wild Thing | The Troggs | Hot 100 |
| Garage Rock | 1966 | 96 Tears | ? and the Mysterians | Hot 100 |
| Garage Rock | 1970 | Venus | Shocking Blue | Hot 100 |
| Surf Rock | 1963 | Surf City | Jan and Dean | Hot 100 |
| Surf Rock | 1964 | I Get Around | The Beach Boys | Hot 100 |
| Surf Rock | 1964 | Beach Boys Concert | The Beach Boys | BB200 |
| Surf Rock | 1965 | Help Me, Rhonda | The Beach Boys | Hot 100 |
| Surf Rock | 1974 | Endless Summer | The Beach Boys | BB200 |
| Instrumental Rock | 1962 | Telstar | The Tornados | Hot 100 |
| Rock & Roll ? | 1961 | Something for Everybody | Elvis Presley | BB200 |

<!-- chart-auto:end -->

---

## 2. Psychedelic · Krautrock

| 장르 | BPM | 리듬 골격 | 음색·편성 | 핵심 포인트 |
|---|---|---|---|---|
| Psychedelic Rock | 90~140 | 느슨한 록 비트 | 페이저·플랜저, 역재생, 시타르 | 음향 실험 자체가 목적 |
| Acid Rock | 100~140 | 록 비트, 긴 즉흥 | 왜곡 기타 솔로 | 사이키델릭의 헤비한 갈래 |
| Space Rock | 80~130 | 반복적·최면적 | 신스 패드, 긴 딜레이 | 우주적 음향 |
| Krautrock | 120~150 | 반복 중심 | 신스 시퀀서, 건조한 드럼 | 독일 실험 록 |
| **Motorik** ★ | 130~150 | 킥1-스네어2-킥3-스네어4의 기계적 교대 | 건조한 드럼, 반복 베이스 | 변화 없는 반복 자체가 목적 |

**Motorik 제작 노트**
핵심은 **8마디, 16마디가 지나도 아무것도 변하지 않는 것**입니다.
필인을 넣는 순간 모토릭이 아니게 됩니다.

<!-- chart-auto:start -->

**차트 1위 — 이 분기에서 나온 것** *(Hot 100 8곡 · Billboard 200 8장)*

> 출처는 [../billboard/](../billboard/) — **곡·앨범명은 위키백과 그대로이지만
> 장르는 붙인 것**입니다. `?` 는 자료가 갈리는 것이고, 없다고 확정은 아닙니다.
> 연도는 1위에 오른 해이며, 재등정은 첫 해만 남겼습니다.
> **패턴의 근거로 쓰지 말고, 무엇을 들어 볼지 고르는 입구로만 쓰십시오.**
> 이 표는 자동 생성입니다 — `tools/chart-to-genres.mjs`. 여기가 아니라 `billboard/` 를 고치십시오.

| 장르 | 연도 | 곡 · 앨범 | 아티스트 | 차트 |
|---|---|---|---|---|
| Psychedelic Rock | 1966 | Paint It Black | The Rolling Stones | Hot 100 |
| Psychedelic Rock | 1966 | Sunshine Superman | Donovan | Hot 100 |
| Psychedelic Rock | 1966 | Revolver | The Beatles | BB200 |
| Psychedelic Rock | 1967 | Light My Fire | The Doors | Hot 100 |
| Psychedelic Rock | 1967 | All You Need Is Love | The Beatles | Hot 100 |
| Psychedelic Rock | 1967 | Incense and Peppermints | Strawberry Alarm Clock | Hot 100 |
| Psychedelic Rock | 1967 | Sgt. Pepper's Lonely Hearts Club Band | The Beatles | BB200 |
| Psychedelic Rock | 1968 | Green Tambourine | The Lemon Pipers | Hot 100 |
| Psychedelic Rock | 1968 | Hello, I Love You | The Doors | Hot 100 |
| Psychedelic Rock | 1968 | Magical Mystery Tour | The Beatles | BB200 |
| Psychedelic Rock | 1968 | Waiting for the Sun | The Doors | BB200 |
| Psychedelic Rock | 1968 | Cheap Thrills | Big Brother and the Holding Company | BB200 |
| Psychedelic Rock | 1968 | Electric Ladyland | The Jimi Hendrix Experience | BB200 |
| Psychedelic Rock | 1969 | Crimson and Clover | Tommy James and the Shondells | Hot 100 |
| Psychedelic Rock ? | 1968 | The Beatles (화이트 앨범) | The Beatles | BB200 |
| Psychedelic Rock ? | 1970 | Woodstock | Soundtrack | BB200 |

<!-- chart-auto:end -->

---

## 3. Hard Rock

| 장르 | BPM | 리듬 골격 | 음색·편성 | 핵심 포인트 |
|---|---|---|---|---|
| **Hard Rock** | 110~150 | 8분 록 비트, 강한 백비트 | 오버드라이브 기타 리프 | 킥·스네어의 크기 |
| Blues Rock | 100~150 | 스트레이트 8분 또는 셔플 | 오버드라이브 기타 | 12마디 구조 유지 |
| Southern Rock | 100~140 | 셔플 섞인 백비트 | 트윈 기타, 슬라이드 | 컨트리·블루스 혼합 |
| Glam Rock | 120~150 | 쿵쿵 하는 단순 4박 | 화려한 프로덕션, 핸드클랩 | 스톰프 비트 |
| Arena Rock | 100~140 | 크고 느린 백비트 | 겹친 기타, 갱 보컬, 넓은 리버브 | 큰 공간을 상정한 믹스 |
| **Power Ballad** | 58~85 | 발라드 → 후렴에서 록 비트 | 클린 기타·피아노 → 디스토션 | 편곡의 단계 변화가 정체성 |

**Power Ballad 노트**
장르가 아니라 **형식**입니다. 1절은 클린 기타나 피아노에 드럼이 없고,
2절에서 드럼이 들어오며, 후렴에서 디스토션 기타와 심벌이 한꺼번에 열립니다.
같은 코드 진행을 쓰더라도 이 단계 변화가 없으면 파워 발라드로 들리지 않습니다.

<!-- chart-auto:start -->

**차트 1위 — 이 분기에서 나온 것** *(Hot 100 56곡 · Billboard 200 75장)*

> 출처는 [../billboard/](../billboard/) — **곡·앨범명은 위키백과 그대로이지만
> 장르는 붙인 것**입니다. `?` 는 자료가 갈리는 것이고, 없다고 확정은 아닙니다.
> 연도는 1위에 오른 해이며, 재등정은 첫 해만 남겼습니다.
> **패턴의 근거로 쓰지 말고, 무엇을 들어 볼지 고르는 입구로만 쓰십시오.**
> 이 표는 자동 생성입니다 — `tools/chart-to-genres.mjs`. 여기가 아니라 `billboard/` 를 고치십시오.

| 장르 | 연도 | 곡 · 앨범 | 아티스트 | 차트 |
|---|---|---|---|---|
| Hard Rock | 1969 | Led Zeppelin II | Led Zeppelin | BB200 |
| Hard Rock | 1970 | American Woman / No Sugar Tonight | The Guess Who | Hot 100 |
| Hard Rock | 1970 | Led Zeppelin III | Led Zeppelin | BB200 |
| Hard Rock | 1973 | Frankenstein | The Edgar Winter Group | Hot 100 |
| Hard Rock | 1973 | We're an American Band | Grand Funk | Hot 100 |
| Hard Rock | 1973 | Billion Dollar Babies | Alice Cooper | BB200 |
| Hard Rock | 1973 | Houses of the Holy | Led Zeppelin | BB200 |
| Hard Rock | 1974 | The Loco-Motion | Grand Funk | Hot 100 |
| Hard Rock | 1974 | You Ain't Seen Nothing Yet | Bachman–Turner Overdrive | Hot 100 |
| Hard Rock | 1974 | Bad Company | Bad Company | BB200 |
| Hard Rock | 1974 | Not Fragile | Bachman-Turner Overdrive | BB200 |
| Hard Rock | 1975 | Physical Graffiti | Led Zeppelin | BB200 |
| Hard Rock | 1976 | Rock'n Me | Steve Miller Band | Hot 100 |
| Hard Rock | 1976 | Frampton Comes Alive! | Peter Frampton | BB200 |
| Hard Rock | 1976 | Presence | Led Zeppelin | BB200 |
| Hard Rock | 1979 | In Through the Out Door | Led Zeppelin | BB200 |
| Hard Rock | 1980 | Another One Bites the Dust | Queen | Hot 100 |
| Hard Rock | 1980 | The Game | Queen | BB200 |
| Hard Rock | 1981 | Precious Time | Pat Benatar | BB200 |
| Hard Rock | 1981 | For Those About to Rock We Salute You | AC/DC | BB200 |
| Hard Rock | 1982 | I Love Rock 'n' Roll | Joan Jett and the Blackhearts | Hot 100 |
| Hard Rock | 1984 | Jump | Van Halen | Hot 100 |
| Hard Rock | 1986 | 5150 | Van Halen | BB200 |
| Hard Rock | 1987 | Mony Mony | Billy Idol | Hot 100 |
| Hard Rock | 1988 | Dirty Diana | Michael Jackson | Hot 100 |
| Hard Rock | 1988 | Sweet Child o' Mine | Guns N' Roses | Hot 100 |
| Hard Rock | 1988 | OU812 | Van Halen | BB200 |
| Hard Rock | 1988 | Appetite for Destruction | Guns N' Roses | BB200 |
| Hard Rock | 1990 | Blaze of Glory | Jon Bon Jovi | Hot 100 |
| Hard Rock | 1990 | Black Cat | Janet Jackson | Hot 100 |
| Hard Rock | 1991 | For Unlawful Carnal Knowledge | Van Halen | BB200 |
| Hard Rock | 1991 | Use Your Illusion II | Guns N' Roses | BB200 |
| Hard Rock | 1993 | Get a Grip | Aerosmith | BB200 |
| Hard Rock | 1995 | Balance | Van Halen | BB200 |
| Hard Rock | 1996 | Best of Volume I | Van Halen | BB200 |
| Hard Rock | 1997 | Nine Lives | Aerosmith | BB200 |
| Hard Rock | 2003 | Faceless | Godsmack | BB200 |
| Hard Rock | 2003 | How the West Was Won | Led Zeppelin | BB200 |
| Hard Rock | 2004 | Contraband | Velvet Revolver | BB200 |
| Hard Rock | 2005 | Out of Exile | Audioslave | BB200 |
| Hard Rock | 2006 | IV | Godsmack | BB200 |
| Hard Rock | 2008 | Black Ice | AC/DC | BB200 |
| Hard Rock | 2020 | Power Up | AC/DC | BB200 |
| Blues Rock | 1968 | Wheels of Fire | Cream | BB200 |
| Blues Rock | 1969 | Get Back | The Beatles with Billy Preston | Hot 100 |
| Blues Rock | 1969 | Honky Tonk Women | The Rolling Stones | Hot 100 |
| Blues Rock | 1969 | Come Together / Something | The Beatles | Hot 100 |
| Blues Rock | 1969 | Blind Faith | Blind Faith | BB200 |
| Blues Rock | 1969 | Green River | Creedence Clearwater Revival | BB200 |
| Blues Rock | 1970 | Cosmo's Factory | Creedence Clearwater Revival | BB200 |
| Blues Rock | 1971 | Me and Bobby McGee | Janis Joplin | Hot 100 |
| Blues Rock | 1971 | Brown Sugar | The Rolling Stones | Hot 100 |
| Blues Rock | 1971 | Pearl | Janis Joplin | BB200 |
| Blues Rock | 1971 | Sticky Fingers | The Rolling Stones | BB200 |
| Blues Rock | 1971 | Every Picture Tells a Story | Rod Stewart | BB200 |
| Blues Rock | 1972 | Exile on Main St. | The Rolling Stones | BB200 |
| Blues Rock | 1973 | Brother Louie | Stories | Hot 100 |
| Blues Rock | 1973 | Goats Head Soup | The Rolling Stones | BB200 |
| Blues Rock | 1974 | The Joker | Steve Miller Band | Hot 100 |
| Blues Rock | 1974 | 461 Ocean Boulevard | Eric Clapton | BB200 |
| Blues Rock | 1974 | It's Only Rock 'n' Roll | The Rolling Stones | BB200 |
| Blues Rock | 1976 | Black and Blue | The Rolling Stones | BB200 |
| Blues Rock | 1978 | Some Girls | The Rolling Stones | BB200 |
| Blues Rock | 1980 | Emotional Rescue | The Rolling Stones | BB200 |
| Blues Rock | 1981 | Tattoo You | The Rolling Stones | BB200 |
| Blues Rock | 1990 | Black Velvet | Alannah Myles | Hot 100 |
| Blues Rock | 1990 | Nick of Time | Bonnie Raitt | BB200 |
| Blues Rock | 1993 | Unplugged | Eric Clapton | BB200 |
| Blues Rock | 1994 | Longing in Their Hearts | Bonnie Raitt | BB200 |
| Blues Rock | 2012 | Blunderbuss | Jack White | BB200 |
| Blues Rock | 2014 | Turn Blue | The Black Keys | BB200 |
| Blues Rock | 2014 | Lazaretto | Jack White | BB200 |
| Blues Rock | 2015 | Sound & Color | Alabama Shakes | BB200 |
| Blues Rock | 2019 | Wasteland, Baby! | Hozier | BB200 |
| Blues Rock | 2019 | Help Us Stranger | The Raconteurs | BB200 |
| Blues Rock | 2024 | Too Sweet | Hozier | Hot 100 |
| Arena Rock | 1978 | Don't Look Back | Boston | BB200 |
| Arena Rock | 1979 | Babe | Styx | Hot 100 |
| Arena Rock | 1981 | Keep On Loving You | REO Speedwagon | Hot 100 |
| Arena Rock | 1981 | Hi Infidelity | REO Speedwagon | BB200 |
| Arena Rock | 1981 | Paradise Theatre | Styx | BB200 |
| Arena Rock | 1981 | 4 | Foreigner | BB200 |
| Arena Rock | 1981 | Escape | Journey | BB200 |
| Arena Rock | 1982 | Eye of the Tiger | Survivor | Hot 100 |
| Arena Rock | 1985 | St. Elmo's Fire (Man in Motion) | John Parr | Hot 100 |
| Arena Rock | 1985 | Money for Nothing | Dire Straits | Hot 100 |
| Arena Rock | 1985 | We Built This City | Starship | Hot 100 |
| Arena Rock | 1985 | Reckless | Bryan Adams | BB200 |
| Arena Rock | 1985 | Brothers in Arms | Dire Straits | BB200 |
| Arena Rock | 1985 | Heart | Heart | BB200 |
| Arena Rock | 1986 | Amanda | Boston | Hot 100 |
| Arena Rock | 1986 | Third Stage | Boston | BB200 |
| Arena Rock | 1993 | Bat Out of Hell II: Back into Hell | Meat Loaf | BB200 |
| Arena Rock | 1998 | Armageddon: The Album | Soundtrack | BB200 |
| Arena Rock | 2009 | The Circle | Bon Jovi | BB200 |
| Arena Rock | 2013 | What About Now | Bon Jovi | BB200 |
| Arena Rock | 2016 | This House Is Not for Sale | Bon Jovi | BB200 |
| Arena Rock | 2017 | Songs of Experience | U2 | BB200 |
| Power Ballad | 1983 | Total Eclipse of the Heart | Bonnie Tyler | Hot 100 |
| Power Ballad | 1985 | I Want to Know What Love Is | Foreigner | Hot 100 |
| Power Ballad | 1985 | Can't Fight This Feeling | REO Speedwagon | Hot 100 |
| Power Ballad | 1985 | Heaven | Bryan Adams | Hot 100 |
| Power Ballad | 1986 | Sara | Starship | Hot 100 |
| Power Ballad | 1986 | These Dreams | Heart | Hot 100 |
| Power Ballad | 1987 | Nothing's Gonna Stop Us Now | Starship | Hot 100 |
| Power Ballad | 1987 | Alone | Heart | Hot 100 |
| Power Ballad | 1988 | The Flame | Cheap Trick | Hot 100 |
| Power Ballad | 1988 | Love Bites | Def Leppard | Hot 100 |
| Power Ballad | 1988 | Every Rose Has Its Thorn | Poison | Hot 100 |
| Power Ballad | 1989 | When I'm with You | Sheriff | Hot 100 |
| Power Ballad | 1989 | I'll Be There for You | Bon Jovi | Hot 100 |
| Power Ballad | 1989 | Listen to Your Heart | Roxette | Hot 100 |
| Power Ballad | 1989 | When I See You Smile | Bad English | Hot 100 |
| Power Ballad | 1991 | More Than Words | Extreme | Hot 100 |
| Power Ballad | 1991 | (Everything I Do) I Do It for You | Bryan Adams | Hot 100 |
| Power Ballad | 1992 | To Be with You | Mr. Big | Hot 100 |
| Power Ballad | 1993 | I'd Do Anything for Love (But I Won't Do That) | Meat Loaf | Hot 100 |
| Power Ballad | 1994 | All for Love | Bryan Adams / Rod Stewart / Sting | Hot 100 |
| Power Ballad | 1995 | Have You Ever Really Loved a Woman? | Bryan Adams | Hot 100 |
| Power Ballad | 1998 | I Don't Want to Miss a Thing | Aerosmith | Hot 100 |
| Glam Rock | 1973 | Crocodile Rock | Elton John | Hot 100 |
| Glam Rock | 1974 | Bennie and the Jets | Elton John | Hot 100 |
| Glam Rock | 1975 | Lucy in the Sky with Diamonds | Elton John | Hot 100 |
| Glam Rock | 1978 | Hot Child in the City | Nick Gilder | Hot 100 |
| Glam Rock | 1998 | Mechanical Animals | Marilyn Manson | BB200 |
| Southern Rock | 1973 | Brothers and Sisters | The Allman Brothers Band | BB200 |
| Southern Rock | 1992 | The Southern Harmony and Musical Companion | The Black Crowes | BB200 |
| Southern Rock | 2007 | Rock N Roll Jesus | Kid Rock | BB200 |
| Hard Rock ? | 1992 | Wayne's World | Soundtrack | BB200 |
| Hard Rock ? | 1997 | Howard Stern Private Parts – The Album | Soundtrack | BB200 |
| Arena Rock ? | 1986 | Top Gun | Soundtrack | BB200 |

<!-- chart-auto:end -->

---

## 4. Metal

| 장르 | BPM | 리듬 골격 | 음색·편성 | 핵심 포인트 |
|---|---|---|---|---|
| **Heavy Metal** | 120~160 | 갤럽 리듬, 더블 킥 | 다운튜닝 기타, 트윈 리드 | 리프가 곡의 주제 |
| NWOBHM | 140~180 | 갤럽 8분 | 트윈 리드, 얇은 프로덕션 | 스래시의 직접 조상 |
| Glam Metal | 110~160 | 곧은 백비트, 게이트 스네어 | 코러스 걸린 기타, 갱 보컬 | 메탈 편성 + 팝 후렴 |
| **Thrash Metal** | 180~220 | 다운피킹 8분, 스키 비트 | 타이트한 팜뮤트 | 정확도가 사운드 |
| **Death Metal** | 180~260 | **블래스트 비트**, 트레몰로 | 트리거된 킥, 극단 왜곡 | 16분 이상의 밀도 |
| Black Metal | 180~260 | 블래스트 비트, 얇은 음색 | 고역 중심 왜곡, 로우파이 | 의도적으로 저역을 뺌 |
| Doom Metal | 60~80 | 매우 느린 백비트 | 저튜닝, 긴 서스테인 | 느림 자체가 무게 |
| Sludge | 60~90 | 느리고 무거움 | 하드코어 보컬 + 둠 리프 | 둠 + 하드코어 |
| Stoner | 80~120 | 그루브 있는 느린 비트 | 파즈, 아날로그 톤 | 블루스 기반 리프 |
| Power Metal | 140~200 | 더블 킥 연타 | 밝은 장조, 신스, 오케스트라 | 멜로디 우선 |
| Symphonic Metal | 120~180 | 더블 킥 + 오케스트라 | 합창, 스트링 | 편곡 규모가 정체성 |
| **Nu Metal** | 80~110 | 하프타임 신콥, 힙합 그루브 | 7현 기타, 스크래치, DJ | 록 편성 + 힙합 리듬 |
| Metalcore | 100~180 | 브레이크다운, 하프타임 전환 | 게이트된 팜뮤트 청크 | 브레이크다운의 낙차 |
| Djent | 가변 | **폴리리듬**, 변박 | 8·9현 기타, 극단 게이팅 | 그리드 위 어긋난 강세 |
| Progressive Metal | 가변 | 변박, 긴 구성 | 대편성, 신스 | 조곡 구조 |

**Metal 드럼 제작 노트**
메탈 드럼은 대부분 **트리거·샘플 대체**를 씁니다. 빠른 더블 킥은 실연으로
녹음해도 일관된 음량이 안 나오기 때문입니다. 스텝 시퀀서로 만들 때는
오히려 유리하고, 대신 매 타격을 미세하게 랜덤화(±1~2dB, ±3ms)해야
기계적으로 들리지 않습니다.

**블래스트 비트** — 킥과 스네어가 16분을 번갈아 채웁니다.
```
kick   X-X-X-X-X-X-X-X-
snare  -X-X-X-X-X-X-X-X
```

<!-- chart-auto:start -->

**차트 1위 — 이 분기에서 나온 것** *(Hot 100 5곡 · Billboard 200 40장)*

> 출처는 [../billboard/](../billboard/) — **곡·앨범명은 위키백과 그대로이지만
> 장르는 붙인 것**입니다. `?` 는 자료가 갈리는 것이고, 없다고 확정은 아닙니다.
> 연도는 1위에 오른 해이며, 재등정은 첫 해만 남겼습니다.
> **패턴의 근거로 쓰지 말고, 무엇을 들어 볼지 고르는 입구로만 쓰십시오.**
> 이 표는 자동 생성입니다 — `tools/chart-to-genres.mjs`. 여기가 아니라 `billboard/` 를 고치십시오.

| 장르 | 연도 | 곡 · 앨범 | 아티스트 | 차트 |
|---|---|---|---|---|
| Nu Metal | 1998 | Follow the Leader | Korn | BB200 |
| Nu Metal | 1999 | Significant Other | Limp Bizkit | BB200 |
| Nu Metal | 1999 | Issues | Korn | BB200 |
| Nu Metal | 2000 | Chocolate Starfish and the Hot Dog Flavored Water | Limp Bizkit | BB200 |
| Nu Metal | 2001 | Toxicity | System of a Down | BB200 |
| Nu Metal | 2002 | Believe | Disturbed | BB200 |
| Nu Metal | 2003 | Meteora | Linkin Park | BB200 |
| Nu Metal | 2005 | Mezmerize | System of a Down | BB200 |
| Nu Metal | 2005 | Ten Thousand Fists | Disturbed | BB200 |
| Nu Metal | 2005 | Hypnotize | System of a Down | BB200 |
| Nu Metal | 2008 | Indestructible | Disturbed | BB200 |
| Nu Metal | 2008 | All Hope Is Gone | Slipknot | BB200 |
| Nu Metal | 2010 | Asylum | Disturbed | BB200 |
| Nu Metal | 2014 | .5: The Gray Chapter | Slipknot | BB200 |
| Nu Metal | 2015 | Immortalized | Disturbed | BB200 |
| Nu Metal | 2019 | We Are Not Your Kind | Slipknot | BB200 |
| Glam Metal | 1983 | Metal Health | Quiet Riot | BB200 |
| Glam Metal | 1986 | You Give Love a Bad Name | Bon Jovi | Hot 100 |
| Glam Metal | 1986 | Slippery When Wet | Bon Jovi | BB200 |
| Glam Metal | 1987 | Livin' on a Prayer | Bon Jovi | Hot 100 |
| Glam Metal | 1987 | Here I Go Again | Whitesnake | Hot 100 |
| Glam Metal | 1988 | Bad Medicine | Bon Jovi | Hot 100 |
| Glam Metal | 1988 | Hysteria | Def Leppard | BB200 |
| Glam Metal | 1988 | New Jersey | Bon Jovi | BB200 |
| Glam Metal | 1989 | Dr. Feelgood | Mötley Crüe | BB200 |
| Glam Metal | 1990 | (Can't Live Without Your) Love and Affection | Nelson | Hot 100 |
| Glam Metal | 1992 | Adrenalize | Def Leppard | BB200 |
| Heavy Metal | 1991 | Slave to the Grind | Skid Row | BB200 |
| Heavy Metal | 1991 | Metallica | Metallica | BB200 |
| Heavy Metal | 1996 | Load | Metallica | BB200 |
| Heavy Metal | 1997 | ReLoad | Metallica | BB200 |
| Heavy Metal | 2010 | Nightmare | Avenged Sevenfold | BB200 |
| Heavy Metal | 2013 | 13 | Black Sabbath | BB200 |
| Heavy Metal | 2013 | Hail to the King | Avenged Sevenfold | BB200 |
| Heavy Metal | 2025 | Skeletá | Ghost | BB200 |
| Thrash Metal | 2003 | St. Anger | Metallica | BB200 |
| Thrash Metal | 2008 | Death Magnetic | Metallica | BB200 |
| Thrash Metal | 2016 | Hardwired... to Self-Destruct | Metallica | BB200 |
| Thrash Metal | 2026 | Megadeth | Megadeth | BB200 |
| Progressive Metal | 2001 | Lateralus | Tool | BB200 |
| Progressive Metal | 2006 | 10,000 Days | Tool | BB200 |
| Progressive Metal | 2019 | Fear Inoculum | Tool | BB200 |
| Progressive Metal ? | 2025 | Even in Arcadia | Sleep Token | BB200 |
| Symphonic Metal ? | 2011 | Evanescence | Evanescence | BB200 |
| Thrash Metal ? | 1994 | Far Beyond Driven | Pantera | BB200 |

<!-- chart-auto:end -->

---

## 5. Progressive · Math

| 장르 | BPM | 리듬 골격 | 음색·편성 | 핵심 포인트 |
|---|---|---|---|---|
| Progressive Rock | 가변 | **변박**(5/4, 7/8, 9/8) | 오르간·메로트론, 대편성 | 조곡 구조 |
| Art Rock | 가변 | 비관습적 | 실험적 편성 | 형식 실험 |
| Math Rock | 가변 | **변박**, 폴리리듬 | 태핑 기타, 클린 톤 | 16스텝 그리드로 표현 불가 |

이 세 장르는 16분 그리드로 표현되지 않습니다
→ [../patterns/README.md](../patterns/README.md) §3

<!-- chart-auto:start -->

**차트 1위 — 이 분기에서 나온 것** *(Hot 100 4곡 · Billboard 200 15장)*

> 출처는 [../billboard/](../billboard/) — **곡·앨범명은 위키백과 그대로이지만
> 장르는 붙인 것**입니다. `?` 는 자료가 갈리는 것이고, 없다고 확정은 아닙니다.
> 연도는 1위에 오른 해이며, 재등정은 첫 해만 남겼습니다.
> **패턴의 근거로 쓰지 말고, 무엇을 들어 볼지 고르는 입구로만 쓰십시오.**
> 이 표는 자동 생성입니다 — `tools/chart-to-genres.mjs`. 여기가 아니라 `billboard/` 를 고치십시오.

| 장르 | 연도 | 곡 · 앨범 | 아티스트 | 차트 |
|---|---|---|---|---|
| Progressive Rock | 1972 | Thick as a Brick | Jethro Tull | BB200 |
| Progressive Rock | 1972 | Seventh Sojourn | The Moody Blues | BB200 |
| Progressive Rock | 1973 | The Dark Side of the Moon | Pink Floyd | BB200 |
| Progressive Rock | 1973 | A Passion Play | Jethro Tull | BB200 |
| Progressive Rock | 1975 | Wish You Were Here | Pink Floyd | BB200 |
| Progressive Rock | 1977 | Blinded by the Light | Manfred Mann's Earth Band | Hot 100 |
| Progressive Rock | 1979 | Breakfast in America | Supertramp | BB200 |
| Progressive Rock | 1980 | Another Brick in the Wall, Part II | Pink Floyd | Hot 100 |
| Progressive Rock | 1980 | The Wall | Pink Floyd | BB200 |
| Progressive Rock | 1981 | Long Distance Voyager | The Moody Blues | BB200 |
| Progressive Rock | 1982 | Asia | Asia | BB200 |
| Progressive Rock | 1984 | Owner of a Lonely Heart | Yes | Hot 100 |
| Progressive Rock | 1994 | The Division Bell | Pink Floyd | BB200 |
| Progressive Rock | 1995 | P•U•L•S•E | Pink Floyd | BB200 |
| Art Rock | 2000 | Kid A | Radiohead | BB200 |
| Art Rock | 2008 | Viva la Vida | Coldplay | Hot 100 |
| Art Rock | 2008 | In Rainbows | Radiohead | BB200 |
| Art Rock | 2016 | Blackstar | David Bowie | BB200 |
| Art Rock ? | 2018 | Boarding House Reach | Jack White | BB200 |

<!-- chart-auto:end -->

---

## 6. Punk

| 장르 | BPM | 리듬 골격 | 음색·편성 | 핵심 포인트 |
|---|---|---|---|---|
| **Punk Rock** | 160~200 | 8분 다운스트로크, 백비트 | 얇고 거친 기타, 좁은 다이내믹 | 속도와 단순함 |
| Hardcore Punk | 180~220 | 킥·스네어의 엇갈린 8분 | 압축된 드럼 | D-beat 패턴의 반복 |
| Crust | 160~200 | D-beat + 둠 리프 | 극단 왜곡, 로우파이 | 하드코어 + 메탈 |
| D-beat | 180~220 | 킥 1박·2박뒤, 스네어 2·4 | 압축 드럼 | 이름이 곧 드럼 패턴 |
| Powerviolence | 200~300 | 극단적 템포 변화 | 짧은 곡(30초 이하) | 급정거·급가속 |
| Pop Punk | 150~190 | 펑크 골격 + 팝 화성 | 밝은 기타, 겹친 코러스 | 후렴의 훅 |

<!-- chart-auto:start -->

**차트 1위 — 이 분기에서 나온 것** *(Hot 100 3곡 · Billboard 200 18장)*

> 출처는 [../billboard/](../billboard/) — **곡·앨범명은 위키백과 그대로이지만
> 장르는 붙인 것**입니다. `?` 는 자료가 갈리는 것이고, 없다고 확정은 아닙니다.
> 연도는 1위에 오른 해이며, 재등정은 첫 해만 남겼습니다.
> **패턴의 근거로 쓰지 말고, 무엇을 들어 볼지 고르는 입구로만 쓰십시오.**
> 이 표는 자동 생성입니다 — `tools/chart-to-genres.mjs`. 여기가 아니라 `billboard/` 를 고치십시오.

| 장르 | 연도 | 곡 · 앨범 | 아티스트 | 차트 |
|---|---|---|---|---|
| Pop Punk | 2001 | Take Off Your Pants and Jacket | Blink-182 | BB200 |
| Pop Punk | 2004 | Under My Skin | Avril Lavigne | BB200 |
| Pop Punk | 2004 | American Idiot | Green Day | BB200 |
| Pop Punk | 2007 | Girlfriend | Avril Lavigne | Hot 100 |
| Pop Punk | 2007 | Infinity on High | Fall Out Boy | BB200 |
| Pop Punk | 2007 | The Best Damn Thing | Avril Lavigne | BB200 |
| Pop Punk | 2009 | 21st Century Breakdown | Green Day | BB200 |
| Pop Punk | 2013 | Paramore | Paramore | BB200 |
| Pop Punk | 2013 | Save Rock and Roll | Fall Out Boy | BB200 |
| Pop Punk | 2014 | 5 Seconds of Summer | 5 Seconds of Summer | BB200 |
| Pop Punk | 2015 | Sounds Good Feels Good | 5 Seconds of Summer | BB200 |
| Pop Punk | 2016 | California | Blink-182 | BB200 |
| Pop Punk | 2016 | Revolution Radio | Green Day | BB200 |
| Pop Punk | 2020 | Tickets to My Downfall | Machine Gun Kelly | BB200 |
| Pop Punk | 2021 | Good 4 U | Olivia Rodrigo | Hot 100 |
| Pop Punk | 2022 | Mainstream Sellout | Machine Gun Kelly | BB200 |
| Pop Punk | 2023 | Guts | Olivia Rodrigo | BB200 |
| Pop Punk | 2023 | One More Time... | Blink-182 | BB200 |
| Pop Punk ? | 2021 | Sour | Olivia Rodrigo | BB200 |
| Pop Punk ? | 2026 | Drop Dead | Olivia Rodrigo | Hot 100 |
| Pop Punk ? | 2026 | You Seem Pretty Sad for a Girl So in Love | Olivia Rodrigo | BB200 |

<!-- chart-auto:end -->

---

## 7. Post-punk 계보

| 장르 | BPM | 리듬 골격 | 음색·편성 | 핵심 포인트 |
|---|---|---|---|---|
| **Post-punk** | 120~150 | 반복적 8분, 높은 베이스 | 코러스 걸린 클린 기타 | 베이스가 멜로디를 담당 |
| Gothic Rock | 100~140 | 드럼머신 또는 기계적 비트 | 리버브 기타, 낮은 보컬 | 어두운 화성 |
| New Wave | 110~160 | 정박 백비트 (게이트 스네어는 80년대 중반부터) | 신스 리프 + 클린 기타 | 신스팝이 여기서 갈라져 나옴 |
| (Synth-pop) | 110~140 | 기계적 정박, 게이트 스네어 | 아날로그 폴리, LinnDrum | 뉴웨이브의 전자 갈래 → [02-pop.md](02-pop.md) §3 |
| Post-punk Revival | 120~150 | 날카로운 8분 | 얇은 기타, 타이트 드럼 | 2000년대 재해석 |
| Dance-punk | 120~140 | 4/4 댄스 킥 + 펑크 기타 | 신스 + 밴드 | 록과 클럽의 접점 |
| Emo | 120~170 | 록 비트, 다이내믹 대비 | 아르페지오 클린 기타 | 조용함↔폭발 |
| Screamo | 150~200 | 하드코어 + 급변 | 절규 보컬 | 감정 진폭 극대화 |
| Midwest Emo | 100~150 | 변박 섞인 록 비트 | 태핑·아르페지오 기타 | 매스록과 친연 |

**Post-punk 제작 노트**
베이스가 기타보다 높은 음역에서 멜로디를 연주하고, 기타는 리듬·질감을
맡습니다. **역할이 뒤바뀌어 있다는 것**이 이 장르를 규정합니다.

<!-- chart-auto:start -->

**차트 1위 — 이 분기에서 나온 것** *(Hot 100 20곡 · Billboard 200 11장)*

> 출처는 [../billboard/](../billboard/) — **곡·앨범명은 위키백과 그대로이지만
> 장르는 붙인 것**입니다. `?` 는 자료가 갈리는 것이고, 없다고 확정은 아닙니다.
> 연도는 1위에 오른 해이며, 재등정은 첫 해만 남겼습니다.
> **패턴의 근거로 쓰지 말고, 무엇을 들어 볼지 고르는 입구로만 쓰십시오.**
> 이 표는 자동 생성입니다 — `tools/chart-to-genres.mjs`. 여기가 아니라 `billboard/` 를 고치십시오.

| 장르 | 연도 | 곡 · 앨범 | 아티스트 | 차트 |
|---|---|---|---|---|
| New Wave | 1979 | Heart of Glass | Blondie | Hot 100 |
| New Wave | 1979 | My Sharona | The Knack | Hot 100 |
| New Wave | 1979 | Get the Knack | The Knack | BB200 |
| New Wave | 1980 | Call Me | Blondie | Hot 100 |
| New Wave | 1981 | Rapture | Blondie | Hot 100 |
| New Wave | 1981 | Bette Davis Eyes | Kim Carnes | Hot 100 |
| New Wave | 1981 | Mistaken Identity | Kim Carnes | BB200 |
| New Wave | 1982 | Who Can It Be Now? | Men at Work | Hot 100 |
| New Wave | 1982 | Mickey | Toni Basil | Hot 100 |
| New Wave | 1982 | Beauty and the Beat | Go-Go's | BB200 |
| New Wave | 1982 | Business as Usual | Men at Work | BB200 |
| New Wave | 1983 | Down Under | Men at Work | Hot 100 |
| New Wave | 1983 | Come On Eileen | Dexys Midnight Runners | Hot 100 |
| New Wave | 1983 | Every Breath You Take | The Police | Hot 100 |
| New Wave | 1983 | Synchronicity | The Police | BB200 |
| New Wave | 1984 | Time After Time | Cyndi Lauper | Hot 100 |
| New Wave | 1984 | The Reflex | Duran Duran | Hot 100 |
| New Wave | 1985 | Don't You (Forget About Me) | Simple Minds | Hot 100 |
| New Wave | 1986 | Walk Like an Egyptian | The Bangles | Hot 100 |
| New Wave | 1987 | (I Just) Died in Your Arms | Cutting Crew | Hot 100 |
| New Wave | 1988 | Need You Tonight | INXS | Hot 100 |
| New Wave | 1988 | Wild, Wild West | The Escape Club | Hot 100 |
| New Wave | 1989 | She Drives Me Crazy | Fine Young Cannibals | Hot 100 |
| New Wave | 1989 | Good Thing | Fine Young Cannibals | Hot 100 |
| New Wave | 1989 | The Raw & the Cooked | Fine Young Cannibals | BB200 |
| New Wave | 2012 | Locked Out of Heaven | Bruno Mars | Hot 100 |
| Emo | 2006 | Decemberunderground | AFI | BB200 |
| Emo | 2017 | Science Fiction | Brand New | BB200 |
| Dance-punk | 2017 | American Dream | LCD Soundsystem | BB200 |
| Gothic Rock ? | 2006 | The Open Door | Evanescence | BB200 |
| Post-punk Revival | 2017 | Wonderful Wonderful | The Killers | BB200 |

<!-- chart-auto:end -->

---

## 8. Alternative

| 장르 | BPM | 리듬 골격 | 음색·편성 | 핵심 포인트 |
|---|---|---|---|---|
| Alternative Rock | 100~150 | 스트레이트 록 비트 | 다양 | 우산 개념에 가까움 |
| **Grunge** | 90~130 | 느린 록 비트, 헤비한 백비트 | 파즈 기타, 다이내믹 대비 | 조용함↔폭발의 낙차 |
| Post-grunge | 90~140 | 스트레이트 록 비트 | 낮춘 튜닝, 압축된 믹스 | 그런지를 라디오용으로 다듬음 |
| Rap Rock | 85~115 | 브레이크비트 + 록 백비트 | 왜곡 기타, 스크래치 | → [03-hiphop.md](03-hiphop.md)와 교차 |
| Madchester | 108~130 | 느슨한 댄스 그루브 | 와우 기타, 루프 같은 드럼 | 정박으로 맞추면 죽음 |
| Indie Rock | 100~150 | 단순한 록 비트 | 클린~약한 오버드라이브 | 다듬지 않은 프로덕션 |
| Lo-fi Indie | 90~140 | 느슨한 비트 | 카세트 녹음 질감 | 의도적 저품질 |
| Slacker Rock | 90~130 | 늘어지는 그루브 | 느슨한 튜닝, 게으른 보컬 | 템포가 살짝 뒤로 |
| **Shoegaze** | 100~140 | 단순한 록 비트 | 리버브·코러스 벽, 묻힌 보컬 | 기타가 패드처럼 기능 |
| Dream Pop | 90~130 | 부드러운 비트 | 리버브 벽, 부드러운 보컬 | 텍스처 우선 |
| Britpop | 110~140 | 스트레이트 록 비트 | 밝은 기타, 합창 | 60년대 팝 구조의 재현 |
| Noise Rock | 100~160 | 불안정한 비트 | 극단 왜곡, 불협화 | 노이즈가 음악 재료 |
| Industrial Rock | 90~140 | 기계적인 4박, 시퀀스 루프 | 드럼머신 + 왜곡 기타, 노이즈 | 사람이 안 친 것처럼 정확 |
| Post-rock | 가변 | 점진적 빌드업 | 딜레이·리버브 레이어 | 구조가 곧 서사 |

**Industrial Rock 노트**
[05-electronic.md](05-electronic.md) 의 **Industrial Techno 와 다른 장르**입니다.
그쪽은 140~160 BPM 의 4/4 테크노이고, 이쪽은 록 편성에 드럼머신을 얹은
90~140 BPM 입니다. 두 갈래가 공유하는 것은 «왜곡된 킥과 노이즈» 라는 음색뿐입니다.
차트 문서에서 `A · Industrial Rock` 으로 표기한 것이 이쪽입니다.

**Shoegaze 제작 노트**
~~기타를 "여러 대 겹치는" 것이 아니라 한 대를 리버브와 코러스로 벽처럼 만드는 것입니다.~~
**2026-09-16 정정 — 대표곡 출처와 반대였습니다.** My Bloody Valentine «Only Shallow» 는
퍼즈 기타를 트레몰로 암을 누른 채 긁고(glide guitar) **대량으로 겹쳤고**(«massively
overdubbed»), Ride «Vapour Trail» 은 **이펙트 없는 12현 두 대**입니다. 핵심 도구는 코러스가
아니라 퍼즈·트레몰로·오버더브·리버브입니다. 보컬을 기타 밑에 묻어 악기 중 하나로
취급한다는 앞 문장의 뒷부분은 출처와 맞습니다.

<!-- chart-auto:start -->

**차트 1위 — 이 분기에서 나온 것** *(Hot 100 12곡 · Billboard 200 89장)*

> 출처는 [../billboard/](../billboard/) — **곡·앨범명은 위키백과 그대로이지만
> 장르는 붙인 것**입니다. `?` 는 자료가 갈리는 것이고, 없다고 확정은 아닙니다.
> 연도는 1위에 오른 해이며, 재등정은 첫 해만 남겼습니다.
> **패턴의 근거로 쓰지 말고, 무엇을 들어 볼지 고르는 입구로만 쓰십시오.**
> 이 표는 자동 생성입니다 — `tools/chart-to-genres.mjs`. 여기가 아니라 `billboard/` 를 고치십시오.

| 장르 | 연도 | 곡 · 앨범 | 아티스트 | 차트 |
|---|---|---|---|---|
| Alternative Rock | 1987 | With or Without You | U2 | Hot 100 |
| Alternative Rock | 1987 | I Still Haven't Found What I'm Looking For | U2 | Hot 100 |
| Alternative Rock | 1987 | The Joshua Tree | U2 | BB200 |
| Alternative Rock | 1988 | Rattle and Hum | U2 | BB200 |
| Alternative Rock | 1990 | Nothing Compares 2 U | Sinéad O'Connor | Hot 100 |
| Alternative Rock | 1990 | I Do Not Want What I Haven't Got | Sinéad O'Connor | BB200 |
| Alternative Rock | 1991 | Out of Time | R.E.M. | BB200 |
| Alternative Rock | 1991 | Achtung Baby | U2 | BB200 |
| Alternative Rock | 1993 | Zooropa | U2 | BB200 |
| Alternative Rock | 1994 | The Crow | Soundtrack | BB200 |
| Alternative Rock | 1994 | Monster | R.E.M. | BB200 |
| Alternative Rock | 1995 | Throwing Copper | Live | BB200 |
| Alternative Rock | 1995 | Cracked Rear View | Hootie & the Blowfish | BB200 |
| Alternative Rock | 1995 | Jagged Little Pill | Alanis Morissette | BB200 |
| Alternative Rock | 1995 | Mellon Collie and the Infinite Sadness | The Smashing Pumpkins | BB200 |
| Alternative Rock | 1996 | Fairweather Johnson | Hootie & the Blowfish | BB200 |
| Alternative Rock | 1996 | No Code | Pearl Jam | BB200 |
| Alternative Rock | 1996 | Recovering the Satellites | Counting Crows | BB200 |
| Alternative Rock | 1996 | Tragic Kingdom | No Doubt | BB200 |
| Alternative Rock | 1997 | Secret Samadhi | Live | BB200 |
| Alternative Rock | 1997 | Pop | U2 | BB200 |
| Alternative Rock | 1998 | One Week | Barenaked Ladies | Hot 100 |
| Alternative Rock | 1998 | Before These Crowded Streets | Dave Matthews Band | BB200 |
| Alternative Rock | 1998 | City of Angels | Soundtrack | BB200 |
| Alternative Rock | 1998 | Supposed Former Infatuation Junkie | Alanis Morissette | BB200 |
| Alternative Rock | 2001 | Everyday | Dave Matthews Band | BB200 |
| Alternative Rock | 2002 | Under Rug Swept | Alanis Morissette | BB200 |
| Alternative Rock | 2002 | Busted Stuff | Dave Matthews Band | BB200 |
| Alternative Rock | 2004 | How to Dismantle an Atomic Bomb | U2 | BB200 |
| Alternative Rock | 2005 | Stand Up | Dave Matthews Band | BB200 |
| Alternative Rock | 2005 | X&Y | Coldplay | BB200 |
| Alternative Rock | 2006 | Stadium Arcadium | Red Hot Chili Peppers | BB200 |
| Alternative Rock | 2006 | Light Grenades | Incubus | BB200 |
| Alternative Rock | 2007 | Minutes to Midnight | Linkin Park | BB200 |
| Alternative Rock | 2008 | Viva la Vida or Death and All His Friends | Coldplay | BB200 |
| Alternative Rock | 2008 | Twilight | Soundtrack | BB200 |
| Alternative Rock | 2009 | No Line on the Horizon | U2 | BB200 |
| Alternative Rock | 2009 | Big Whiskey and the GrooGrux King | Dave Matthews Band | BB200 |
| Alternative Rock | 2009 | Backspacer | Pearl Jam | BB200 |
| Alternative Rock | 2010 | A Thousand Suns | Linkin Park | BB200 |
| Alternative Rock | 2011 | Showroom of Compassion | Cake | BB200 |
| Alternative Rock | 2011 | Wasting Light | Foo Fighters | BB200 |
| Alternative Rock | 2011 | Mylo Xyloto | Coldplay | BB200 |
| Alternative Rock | 2012 | Living Things | Linkin Park | BB200 |
| Alternative Rock | 2014 | Ghost Stories | Coldplay | BB200 |
| Alternative Rock | 2015 | Smoke + Mirrors | Imagine Dragons | BB200 |
| Alternative Rock | 2015 | Wilder Mind | Mumford & Sons | BB200 |
| Alternative Rock | 2015 | Blurryface | Twenty One Pilots | BB200 |
| Alternative Rock | 2015 | Drones | Muse | BB200 |
| Alternative Rock | 2016 | Walls | Kings of Leon | BB200 |
| Alternative Rock | 2017 | Concrete and Gold | Foo Fighters | BB200 |
| Alternative Rock | 2022 | Unlimited Love | Red Hot Chili Peppers | BB200 |
| Alternative Rock | 2025 | Breach | Twenty One Pilots | BB200 |
| Post-grunge | 1996 | Razorblade Suitcase | Bush | BB200 |
| Post-grunge | 1999 | Human Clay | Creed | BB200 |
| Post-grunge | 2000 | Everything You Want | Vertical Horizon | Hot 100 |
| Post-grunge | 2000 | Bent | Matchbox Twenty | Hot 100 |
| Post-grunge | 2000 | With Arms Wide Open | Creed | Hot 100 |
| Post-grunge | 2001 | How You Remind Me | Nickelback | Hot 100 |
| Post-grunge | 2001 | Break the Cycle | Staind | BB200 |
| Post-grunge | 2001 | Weathered | Creed | BB200 |
| Post-grunge | 2003 | 14 Shades of Grey | Staind | BB200 |
| Post-grunge | 2005 | Seventeen Days | 3 Doors Down | BB200 |
| Post-grunge | 2005 | Chapter V | Staind | BB200 |
| Post-grunge | 2005 | All the Right Reasons | Nickelback | BB200 |
| Post-grunge | 2007 | Daughtry | Daughtry | BB200 |
| Post-grunge | 2008 | 3 Doors Down | 3 Doors Down | BB200 |
| Post-grunge | 2009 | Leave This Town | Daughtry | BB200 |
| Post-grunge | 2010 | The Oracle | Godsmack | BB200 |
| Post-grunge | 2015 | Dark Before Dawn | Breaking Benjamin | BB200 |
| Grunge | 1992 | Nevermind | Nirvana | BB200 |
| Grunge | 1993 | In Utero | Nirvana | BB200 |
| Grunge | 1993 | Vs. | Pearl Jam | BB200 |
| Grunge | 1994 | Jar of Flies | Alice in Chains | BB200 |
| Grunge | 1994 | Superunknown | Soundgarden | BB200 |
| Grunge | 1994 | Purple | Stone Temple Pilots | BB200 |
| Grunge | 1994 | MTV Unplugged in New York | Nirvana | BB200 |
| Grunge | 1994 | Vitalogy | Pearl Jam | BB200 |
| Grunge | 1995 | Alice in Chains | Alice in Chains | BB200 |
| Grunge | 1996 | From the Muddy Banks of the Wishkah | Nirvana | BB200 |
| Grunge | 2013 | Lightning Bolt | Pearl Jam | BB200 |
| Indie Rock | 1994 | Stay (I Missed You) | Lisa Loeb & Nine Stories | Hot 100 |
| Indie Rock | 2007 | We Were Dead Before the Ship Even Sank | Modest Mouse | BB200 |
| Indie Rock | 2008 | Narrow Stairs | Death Cab for Cutie | BB200 |
| Indie Rock | 2009 | New Moon | Soundtrack | BB200 |
| Indie Rock | 2010 | Contra | Vampire Weekend | BB200 |
| Indie Rock | 2010 | The Suburbs | Arcade Fire | BB200 |
| Indie Rock | 2012 | We Are Young | Fun featuring Janelle Monáe | Hot 100 |
| Indie Rock | 2013 | Modern Vampires of the City | Vampire Weekend | BB200 |
| Indie Rock | 2013 | Reflektor | Arcade Fire | BB200 |
| Indie Rock | 2017 | Everything Now | Arcade Fire | BB200 |
| Indie Rock | 2019 | Father of the Bride | Vampire Weekend | BB200 |
| Alternative Rock ? | 1999 | The Fragile | Nine Inch Nails | BB200 |
| Alternative Rock ? | 2012 | Away from the World | Dave Matthews Band | BB200 |
| Alternative Rock ? | 2018 | Come Tomorrow | Dave Matthews Band | BB200 |
| Rap Rock | 1996 | Evil Empire | Rage Against the Machine | BB200 |
| Rap Rock | 1999 | The Battle of Los Angeles | Rage Against the Machine | BB200 |
| Rap Rock | 2001 | Butterfly | Crazy Town | Hot 100 |
| Industrial Rock | 2003 | The Golden Age of Grotesque | Marilyn Manson | BB200 |
| Industrial Rock | 2005 | With Teeth | Nine Inch Nails | BB200 |
| Madchester | 1991 | Unbelievable | EMF | Hot 100 |

<!-- chart-auto:end -->

---

## 9. 루츠와의 교차

| 장르 | BPM | 리듬 골격 | 음색·편성 | 핵심 포인트 |
|---|---|---|---|---|
| Folk Rock | 110~150 | 록 백비트 | 12현 기타, 하모니 | → [07-roots.md](07-roots.md)와 교차 |
| Country Rock | 100~140 | 백비트 + 컨트리 화성 | 페달 스틸 + 일렉 기타 | 상동 |
| Heartland Rock | 110~145 | 곧은 록 백비트 | 오르간 + 클린 기타 아르페지오 | 포크·컨트리 화성을 록 편성으로 |

<!-- chart-auto:start -->

**차트 1위 — 이 분기에서 나온 것** *(Hot 100 10곡 · Billboard 200 27장)*

> 출처는 [../billboard/](../billboard/) — **곡·앨범명은 위키백과 그대로이지만
> 장르는 붙인 것**입니다. `?` 는 자료가 갈리는 것이고, 없다고 확정은 아닙니다.
> 연도는 1위에 오른 해이며, 재등정은 첫 해만 남겼습니다.
> **패턴의 근거로 쓰지 말고, 무엇을 들어 볼지 고르는 입구로만 쓰십시오.**
> 이 표는 자동 생성입니다 — `tools/chart-to-genres.mjs`. 여기가 아니라 `billboard/` 를 고치십시오.

| 장르 | 연도 | 곡 · 앨범 | 아티스트 | 차트 |
|---|---|---|---|---|
| Country Rock | 1975 | You're No Good | Linda Ronstadt | Hot 100 |
| Country Rock | 1975 | Best of My Love | Eagles | Hot 100 |
| Country Rock | 1975 | Black Water | The Doobie Brothers | Hot 100 |
| Country Rock | 1975 | One of These Nights | Eagles | Hot 100 |
| Country Rock | 1975 | Heart Like a Wheel | Linda Ronstadt | BB200 |
| Country Rock | 1975 | One of These Nights | Eagles | BB200 |
| Country Rock | 1976 | Their Greatest Hits (1971–1975) | Eagles | BB200 |
| Country Rock | 1977 | New Kid in Town | Eagles | Hot 100 |
| Country Rock | 1977 | Hotel California | Eagles | Hot 100 |
| Country Rock | 1977 | Hotel California | Eagles | BB200 |
| Country Rock | 1977 | Simple Dreams | Linda Ronstadt | BB200 |
| Country Rock | 1978 | Living in the USA | Linda Ronstadt | BB200 |
| Country Rock | 1979 | Heartache Tonight | Eagles | Hot 100 |
| Country Rock | 1979 | The Long Run | Eagles | BB200 |
| Country Rock | 1994 | Hell Freezes Over | Eagles | BB200 |
| Country Rock | 2006 | Taking the Long Way | Dixie Chicks | BB200 |
| Country Rock | 2007 | Lost Highway | Bon Jovi | BB200 |
| Country Rock | 2007 | Long Road Out of Eden | Eagles | BB200 |
| Heartland Rock | 1980 | Against the Wind | Bob Seger & the Silver Bullet Band | BB200 |
| Heartland Rock | 1980 | The River | Bruce Springsteen | BB200 |
| Heartland Rock | 1982 | Jack & Diane | John Cougar | Hot 100 |
| Heartland Rock | 1982 | American Fool | John Cougar | BB200 |
| Heartland Rock | 1984 | Born in the U.S.A. | Bruce Springsteen | BB200 |
| Heartland Rock | 1985 | Centerfield | John Fogerty | BB200 |
| Heartland Rock | 1986 | The Way It Is | Bruce Hornsby & the Range | Hot 100 |
| Heartland Rock | 1986 | Live/1975–85 | Bruce Springsteen & The E Street Band | BB200 |
| Heartland Rock | 1987 | Shakedown | Bob Seger | Hot 100 |
| Heartland Rock | 1987 | Tunnel of Love | Bruce Springsteen | BB200 |
| Heartland Rock | 1995 | Greatest Hits | Bruce Springsteen | BB200 |
| Heartland Rock | 2002 | The Rising | Bruce Springsteen | BB200 |
| Heartland Rock | 2007 | Magic | Bruce Springsteen | BB200 |
| Heartland Rock | 2009 | Working on a Dream | Bruce Springsteen | BB200 |
| Heartland Rock | 2012 | Wrecking Ball | Bruce Springsteen | BB200 |
| Heartland Rock | 2014 | High Hopes | Bruce Springsteen | BB200 |
| Heartland Rock | 2014 | Hypnotic Eye | Tom Petty and the Heartbreakers | BB200 |
| Country Rock ? | 2018 | A Star Is Born | Lady Gaga and Bradley Cooper (사운드트랙) | BB200 |
| Country Rock ? | 2019 | A Star Is Born | Lady Gaga and Bradley Cooper | BB200 |

<!-- chart-auto:end -->

---

## PULSE·16 설정값

도구에 그대로 옮길 수 있는 수치입니다. 엔진 이름의 뜻은
[00-instruments.md](00-instruments.md) 참조. 박자는 [../patterns/01-rock.md](../patterns/01-rock.md).

이름 앞 `·` 는 규칙 파생(청감 미검증), 표기 없음은 손으로 작성한 값입니다.

> **2026-08-17 — 상속을 끊고 장르마다 값을 다시 잡았습니다.**
> 그전에는 프리셋이 안 적은 칸을 **하위분기(TONE_KIT)가 채웠습니다.** 편했지만
> 한 분기에 묶인 장르는 건반·기타·2번 레이어·화음·베이스·스케일·퍼커션이
> **전부 같은 값**이 됐고, 357종 중 **207종이 형제와 편성이 한 칸도 안 달랐습니다.**
> 박자는 더 심해서 **318종이 26개 무리로 같은 패턴**을 쓰고 있었습니다.
>
> [`_build.js`](../src/data/presets/_build.js) 에서 상속 경로를 지우고, 이 계열의
> 프리셋을 **장르마다 다시 썼습니다** — 위 표의 값은 그 결과입니다.
> 계통도([00-tree.md](00-tree.md))의 상하위 관계는 **논리적 분류로 그대로** 남습니다.
> 무엇을 어떻게 갈랐는지는 [`../patterns/01-rock.md`](../patterns/01-rock.md) 에 한 줄씩 적어 두었습니다.


> **2026-08-17 정정 — 베이스 표** 「록 베이스가 묵직하지 않다」는 지적을 받고
> 전수 대조한 결과 두 가지가 틀려 있었습니다.
>
> **① 엔진 칸이 49행 전부 틀렸습니다.** 표에는 `reese`(Motorik 은 `acid`)라고
> 적혀 있었지만, `TONE_KIT` 이 `bcfg.eng` 를 덮으므로(`_build.js` 베이스
> 우선순위 주석) 실제로는 `pick`·`finger`·`bass6`·`flatwound` 가 울립니다.
> **록 프리셋의 `bcfg.eng` 는 한 개도 소리에 닿지 않습니다.** 실제 값으로 고쳤습니다.
>
> **② Oct 가 36 이었습니다.** root 9 기준 MIDI 45 = **A2 110.0Hz** 로,
> 기타(`gtrOct` 36)와 **완전히 같은 음**입니다. 현 베이스는 합성 베이스와 달리
> 서브 오실레이터가 없어서(`voice-bass.js` §9) 이 옥타브에서는 20~60Hz 가
> 통째로 비었습니다. 손으로 쓴 5종(Rock·Punk·Death Metal·Nu Metal·Doom)만
> 24 를 쓰고 있었고, 규칙 파생 44종이 36 을 복사한 상태였습니다.
> [00-instruments.md](00-instruments.md) 의 «저역 중심 = 24» 규칙대로 39종을 24 로 내렸습니다.
> Post-punk 계보 5종은 **위 «Post-punk 제작 노트» 가 높은 베이스를 장르의 정의라고
> 못박고 있어 36 을 유지**합니다.
>
> **③ Scale 칸도 14행이 틀렸습니다.** (뒤늦게 발견) `Minor Pentatonic` 은
> state.js 의 초기값이라 «고른 값» 이 아니고, `_build.js` 가 그것을 하위분기
> 스케일로 덮습니다. 표에는 덮이기 전 값이 적혀 있었습니다.
> 나머지 계열(B~K) 문서도 같은 세 가지가 전부 틀려 있어 함께 고쳤습니다.
>
> ⚠ **Blend · X-Over · Tone · Glide 칸은 현 베이스에서 아무 일도 하지 않습니다.**
> 이 넷은 배음부를 합성하는 신스 베이스 전용 노브입니다(`voice-bass.js` §9 머리 주석).
> 표에 남긴 것은 프리셋 파일의 값을 그대로 옮긴 것일 뿐이니, 록에서 이 값을
> 돌려도 소리가 안 변한다고 해서 고장이 아닙니다. 실제로 듣는 데 관여하는 것은
> **엔진 · Oct · Length(gate) · Drive · Duck** 다섯입니다.

> **2026-09-16 — 대표곡으로 교정했습니다.** 아래 표는 교정 뒤의 값입니다
> (`src/data/presets/01-rock.js` 에서 다시 뽑았습니다). 무엇을 왜 바꿨는지는
> 문서 끝 «대표곡» 절과 [../patterns/01-rock.md](../patterns/01-rock.md) 에 있습니다.
> 템포가 크게 움직인 곳: Rock 130→115 · Southern 120→100 · Krautrock 135→110 ·
> Gothic 120→84(반박 체감) · Sludge 75→104 · Stoner 100→124(하프타임) · Dream Pop 110→150(하프타임).

### Psychedelic · Krautrock

**드럼 — 킷 엔진 · 튠**

| 장르 | BPM | Swing | Kick | Snare | Clap | Hat | Tom | 튠 K/S/T/H |
|---|---|---|---|---|---|---|---|---|
| Motorik | 142 | 0 | `tight` | `crack` | `tight` | `noise` | `synth` | 0/0/0/0 |
| ·Psychedelic Rock | 125 | 0 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Acid Rock | 130 | 0 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Space Rock | 120 | 0 | `punch` | `body` | `tight` | `noise` | `synth` | -2/0/-2/0 |
| ·Krautrock | 110 | 0 | `punch` | `body` | `tight` | `noise` | `synth` | -2/0/-2/0 |

**베이스**

| 장르 | 엔진 | Oct | Length | Glide | Blend | Drive | X-Over | Tone | Sub | Exc | Duck | Scale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Motorik | `finger` | 24 | 94 | 0 | 56 | 50 | 150 | 5600 | 52 | 28 | 20 | Minor Pentatonic |
| ·Psychedelic Rock | `finger` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Dorian |
| ·Acid Rock | `finger` | 24 | 80 | 0 | 54 | 62 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Space Rock | `finger` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Krautrock | `finger` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |

### Hard Rock

**드럼 — 킷 엔진 · 튠**

| 장르 | BPM | Swing | Kick | Snare | Clap | Hat | Tom | 튠 K/S/T/H |
|---|---|---|---|---|---|---|---|---|
| Rock | 115 | 0 | `punch` | `body` | `tight` | `noise` | `wood` | -1/0/-1/0 |
| ·Southern Rock | 100 | 8 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Glam Rock | 125 | 10 | `punch` | `body` | `spread` | `noise` | `analog` | -2/0/-2/0 |

**베이스**

| 장르 | 엔진 | Oct | Length | Glide | Blend | Drive | X-Over | Tone | Sub | Exc | Duck | Scale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Rock | `pick` | 24 | 90 | 0 | 50 | 38 | 110 | 3800 | 54 | 28 | 20 | Minor Pentatonic |
| ·Southern Rock | `pick` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Glam Rock | `pick` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |

### Punk

**드럼 — 킷 엔진 · 튠**

| 장르 | BPM | Swing | Kick | Snare | Clap | Hat | Tom | 튠 K/S/T/H |
|---|---|---|---|---|---|---|---|---|
| Punk | 180 | 0 | `tight` | `crack` | `tight` | `noise` | `analog` | 1/2/1/2 |
| ·Pop Punk | 170 | 0 | `tight` | `body` | `tight` | `noise` | `analog` | 1/2/1/2 |
| ·Hardcore Punk | 200 | 0 | `tight` | `body` | `tight` | `noise` | `analog` | 1/2/1/0 |
| ·Punk Rock | 175 | 0 | `tight` | `body` | `tight` | `noise` | `analog` | 1/2/1/0 |
| ·Crust | 150 | 0 | `tight` | `lofi` | `tight` | `metal` | `analog` | 1/-4/1/-2 |
| ·D-beat | 200 | 0 | `tight` | `body` | `tight` | `noise` | `analog` | 1/2/1/0 |
| ·Powerviolence | 250 | 0 | `tight` | `body` | `tight` | `noise` | `analog` | 1/2/1/0 |

**베이스**

| 장르 | 엔진 | Oct | Length | Glide | Blend | Drive | X-Over | Tone | Sub | Exc | Duck | Scale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Punk | `pick` | 24 | 60 | 0 | 56 | 52 | 120 | 4400 | 46 | 26 | 16 | Minor Pentatonic |
| ·Pop Punk | `pick` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Major |
| ·Hardcore Punk | `pick` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Punk Rock | `pick` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Crust | `pick` | 24 | 80 | 0 | 54 | 62 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·D-beat | `pick` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Powerviolence | `pick` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |

### Metal

**드럼 — 킷 엔진 · 튠**

| 장르 | BPM | Swing | Kick | Snare | Clap | Hat | Tom | 튠 K/S/T/H |
|---|---|---|---|---|---|---|---|---|
| Death Metal | 200 | 0 | `tight` | `crack` | `tight` | `metal` | `analog` | 2/3/0/2 |
| Nu Metal | 95 | 0 | `punch` | `crack` | `tight` | `noise` | `analog` | -4/0/-4/0 |
| Doom | 70 | 0 | `deep` | `body` | `hall` | `noise` | `wood` | -7/-4/-7/-2 |
| ·Heavy Metal | 140 | 0 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Thrash Metal | 200 | 0 | `tight` | `tight` | `tight` | `noise` | `analog` | 1/2/1/0 |
| ·Black Metal | 210 | 0 | `tight` | `crack` | `tight` | `noise` | `analog` | -4/2/1/2 |
| ·Stoner Rock | 92 | 10 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Power Metal | 180 | 0 | `tight` | `body` | `tight` | `noise` | `synth` | 1/2/1/2 |
| ·Metalcore | 150 | 0 | `tight` | `tight` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·NWOBHM | 170 | 0 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Sludge | 104 | 0 | `punch` | `body` | `tight` | `noise` | `analog` | -5/0/-5/0 |
| ·Stoner | 124 | 8 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Symphonic Metal | 125 | 0 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |

**베이스**

| 장르 | 엔진 | Oct | Length | Glide | Blend | Drive | X-Over | Tone | Sub | Exc | Duck | Scale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Death Metal | `pickmute` | 24 | 50 | 0 | 64 | 70 | 100 | 4000 | 52 | 34 | 18 | Natural Minor |
| Nu Metal | `pick` | 24 | 180 | 0 | 54 | 62 | 85 | 3000 | 66 | 38 | 30 | Minor Pentatonic |
| Doom | `finger` | 24 | 600 | 0 | 48 | 58 | 80 | 2400 | 72 | 36 | 22 | Natural Minor |
| ·Heavy Metal | `pick` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Natural Minor |
| ·Thrash Metal | `pickmute` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Black Metal | `pick` | 24 | 80 | 0 | 54 | 62 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Stoner Rock | `finger` | 24 | 80 | 0 | 54 | 62 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Power Metal | `pick` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Major |
| ·Metalcore | `pickmute` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·NWOBHM | `pick` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Natural Minor |
| ·Sludge | `pick` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Stoner | `finger` | 24 | 80 | 0 | 54 | 62 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Symphonic Metal | `pick` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Natural Minor |

### 뿌리

**드럼 — 킷 엔진 · 튠**

| 장르 | BPM | Swing | Kick | Snare | Clap | Hat | Tom | 튠 K/S/T/H |
|---|---|---|---|---|---|---|---|---|
| ·Rock & Roll | 168 | 24 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Surf Rock | 160 | 0 | `punch` | `body` | `hall` | `noise` | `analog` | -2/0/-2/0 |
| ·Garage Rock | 140 | 0 | `punch` | `lofi` | `tight` | `noise` | `analog` | -2/-4/-2/0 |
| ·Proto-punk | 145 | 0 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |

**베이스**

| 장르 | 엔진 | Oct | Length | Glide | Blend | Drive | X-Over | Tone | Sub | Exc | Duck | Scale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ·Rock & Roll | `uprightslap` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Surf Rock | `pick` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Garage Rock | `pick` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Proto-punk | `pick` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |

### Post-punk 계보

**드럼 — 킷 엔진 · 튠**

| 장르 | BPM | Swing | Kick | Snare | Clap | Hat | Tom | 튠 K/S/T/H |
|---|---|---|---|---|---|---|---|---|
| ·Post-punk | 150 | 0 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Gothic Rock | 84 | 0 | `punch` | `body` | `hall` | `noise` | `analog` | -2/0/-2/0 |
| ·Dance-punk | 130 | 0 | `wood` | `body` | `tight` | `noise` | `cowbell` | -2/0/-2/0 |
| ·Emo | 145 | 0 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·New Wave | 130 | 0 | `wood` | `body` | `tight` | `noise` | `synth` | -2/0/-2/0 |
| ·Post-punk Revival | 135 | 0 | `tight` | `tight` | `tight` | `noise` | `analog` | -1/2/-2/2 |
| ·Screamo | 175 | 0 | `tight` | `body` | `tight` | `noise` | `analog` | 1/2/1/0 |

**베이스**

| 장르 | 엔진 | Oct | Length | Glide | Blend | Drive | X-Over | Tone | Sub | Exc | Duck | Scale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ·Post-punk | `finger` | 36 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Natural Minor |
| ·Gothic Rock | `finger` | 36 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Natural Minor |
| ·Dance-punk | `finger` | 36 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 22 | Natural Minor |
| ·Emo | `pick` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Natural Minor |
| ·New Wave | `finger` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 22 | Major |
| ·Post-punk Revival | `pick` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Natural Minor |
| ·Screamo | `pick` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Natural Minor |

### Alternative

**드럼 — 킷 엔진 · 튠**

| 장르 | BPM | Swing | Kick | Snare | Clap | Hat | Tom | 튠 K/S/T/H |
|---|---|---|---|---|---|---|---|---|
| ·Grunge | 110 | 0 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Indie Rock | 112 | 0 | `wood` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Shoegaze | 120 | 0 | `punch` | `body` | `hall` | `noise` | `analog` | -2/0/-2/0 |
| ·Dream Pop | 150 | 0 | `punch` | `rim` | `hall` | `noise` | `analog` | -2/0/-2/0 |
| ·Britpop | 125 | 0 | `punch` | `body` | `tight` | `noise` | `analog` | -2/2/-2/2 |
| ·Noise Rock | 125 | 0 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Alternative Rock | 112 | 0 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Lo-fi Indie | 115 | 0 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Slacker Rock | 105 | 8 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |

**베이스**

| 장르 | 엔진 | Oct | Length | Glide | Blend | Drive | X-Over | Tone | Sub | Exc | Duck | Scale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ·Grunge | `pick` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Natural Minor |
| ·Indie Rock | `finger` | 24 | 80 | 0 | 54 | 62 | 120 | 4000 | 56 | 32 | 22 | Major |
| ·Shoegaze | `finger` | 24 | 320 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Natural Minor |
| ·Dream Pop | `finger` | 24 | 300 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Major |
| ·Britpop | `pick` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Major |
| ·Noise Rock | `pick` | 24 | 80 | 0 | 54 | 62 | 120 | 4000 | 56 | 32 | 28 | Natural Minor |
| ·Alternative Rock | `finger` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Natural Minor |
| ·Lo-fi Indie | `finger` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Major |
| ·Slacker Rock | `finger` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Major |

### 루츠와의 교차

**드럼 — 킷 엔진 · 튠**

| 장르 | BPM | Swing | Kick | Snare | Clap | Hat | Tom | 튠 K/S/T/H |
|---|---|---|---|---|---|---|---|---|
| ·Country Rock | 136 | 0 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |

**베이스**

| 장르 | 엔진 | Oct | Length | Glide | Blend | Drive | X-Over | Tone | Sub | Exc | Duck | Scale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ·Country Rock | `flatwound` | 24 | 80 | 0 | 54 | 52 | 120 | 4000 | 56 | 32 | 28 | Major |

<!-- chart-auto:start -->

**차트 1위 — 이 분기에서 나온 것** *(Hot 100 0곡 · Billboard 200 1장)*

> 출처는 [../billboard/](../billboard/) — **곡·앨범명은 위키백과 그대로이지만
> 장르는 붙인 것**입니다. `?` 는 자료가 갈리는 것이고, 없다고 확정은 아닙니다.
> 연도는 1위에 오른 해이며, 재등정은 첫 해만 남겼습니다.
> **패턴의 근거로 쓰지 말고, 무엇을 들어 볼지 고르는 입구로만 쓰십시오.**
> 이 표는 자동 생성입니다 — `tools/chart-to-genres.mjs`. 여기가 아니라 `billboard/` 를 고치십시오.

| 장르 | 연도 | 곡 · 앨범 | 아티스트 | 차트 |
|---|---|---|---|---|
| Stoner Rock | 2013 | ...Like Clockwork | Queens of the Stone Age | BB200 |

<!-- chart-auto:end -->

---

## 대표곡 — 웹으로 확인한 곡 (2026-09-16)

장르마다 곡 3~5곡을 골라 **곡이 실재하는지, 출처가 그 장르로 분류했는지**를 웹에서
확인한 것만 적었습니다. 확인하지 못한 후보는 버렸습니다(표에 없습니다).

> - **출처** 칸은 장르 분류를 확인한 페이지입니다. 곡 문서가 없어 앨범·장르 문서·비평으로
>   대신한 줄이 있습니다 — Crust · Powerviolence · Slacker Rock 이 그렇고, 제목 칸에 «음반 단위» 로 적었습니다.
> - **1위** 는 빌보드 Hot 100 1위이고 장르 태그는 저장소가 붙인 것입니다([../billboard/](../billboard/)).
>   Hot Child in the City(위키: 파워팝) · Heartache Tonight(위키: 블루스 록)은 위키 장르가 다릅니다 — 참고로만 쓰십시오.
> - **BPM · 조성**은 출처가 있는 값만 적었습니다. 대부분 자동 분석(songbpm 등)이라 반 속도·두 배로
>   읽힌 곡이 있어 괄호에 체감값을 함께 두었습니다. 장조/단조 판정은 신뢰도가 낮습니다.
> - **곡의 선율·리프는 옮겨 적지 않았습니다.** 프리셋은 이 곡들의 성질 — 템포 범위 · 건반 유무 ·
>   기타 음색 · 베이스 역할 · 드럼 골격 — 에만 맞췄습니다.
> - 앱의 «지금 장르» 줄과 근거 패널이 이 표를 보여 줍니다(`tools/build-refdata.mjs` → `src/data/references.js`).
>   **표를 고쳤으면 그 스크립트를 다시 돌리십시오.**

| 프리셋 | 곡 | 아티스트 | 연도 | 구분 | BPM | 조성 | 출처 |
|---|---|---|---|---|---|---|---|
| Motorik | Hallogallo | Neu! | 1972 | 대표 | 153 | A | [wikipedia.org](https://en.wikipedia.org/wiki/Motorik) |
| Motorik | Mother Sky | Can | 1970 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Krautrock) |
| Motorik | Autobahn (마지막 구간) | Kraftwerk | 1974 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Motorik) |
| Motorik | Opa-Loka | Hawkwind | 1975 | 대표 | 137 | C♯/D♭ | [wikipedia.org](https://en.wikipedia.org/wiki/Motorik) |
| Rock | Whole Lotta Love | Led Zeppelin | 1969 | 대표 | 92 | E 장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Whole_Lotta_Love) |
| Rock | Smoke on the Water | Deep Purple | 1972 | 대표 | 114 | G 단조 | [wikipedia.org](https://en.wikipedia.org/wiki/Smoke_on_the_Water) |
| Rock | All Right Now | Free | 1970 | 대표 | 120 | D | [wikipedia.org](https://en.wikipedia.org/wiki/All_Right_Now) |
| Rock | Back in Black | AC/DC | 1980 | 대표 | 94 | A | [wikipedia.org](https://en.wikipedia.org/wiki/Back_in_Black_(song)) |
| Rock | Sweet Child o' Mine | Guns N' Roses | 1988 | 1위 | 125 | F♯/G♭ | [wikipedia.org](https://en.wikipedia.org/wiki/Sweet_Child_o%27_Mine) |
| Punk | Blitzkrieg Bop | Ramones | 1976 | 대표 | 177 | A장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Blitzkrieg_Bop) |
| Punk | Anarchy in the U.K. | Sex Pistols | 1976 | 대표 | 134 | F | [wikipedia.org](https://en.wikipedia.org/wiki/Anarchy_in_the_U.K.) |
| Punk | White Riot | The Clash | 1977 | 대표 | 205 | D | [wikipedia.org](https://en.wikipedia.org/wiki/White_Riot) |
| Death Metal | Zombie Ritual | Death | 1987 | 대표 | 114 (배속 228) | G | [wikipedia.org](https://en.wikipedia.org/wiki/Zombie_Ritual) |
| Death Metal | Hammer Smashed Face | Cannibal Corpse | 1992 | 대표 | 97 (배속 194) | F♯/G♭ | [wikipedia.org](https://en.wikipedia.org/wiki/Hammer_Smashed_Face) |
| Death Metal | Slowly We Rot | Obituary | 1989 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Slowly_We_Rot) |
| Death Metal | Symbolic | Death | 1995 | 대표 | 114 | F♯/G♭ 단조 | [wikipedia.org](https://en.wikipedia.org/wiki/Symbolic_(Death_album)) |
| Nu Metal | Freak on a Leash | Korn | 1999 | 대표 | 103 | D | [wikipedia.org](https://en.wikipedia.org/wiki/Freak_on_a_Leash) |
| Nu Metal | Break Stuff | Limp Bizkit | 1999 | 대표 | 110 (하프 55) | — | [wikipedia.org](https://en.wikipedia.org/wiki/Break_Stuff) |
| Nu Metal | One Step Closer | Linkin Park | 2000 | 대표 | 95 | A | [wikipedia.org](https://en.wikipedia.org/wiki/One_Step_Closer_(Linkin_Park_song)) |
| Nu Metal | Wait and Bleed | Slipknot | 1999 | 대표 | 93 (더블 186) | G | [wikipedia.org](https://en.wikipedia.org/wiki/Wait_and_Bleed) |
| Doom | Black Sabbath | Black Sabbath | 1970 | 대표 | 133 | D | [wikipedia.org](https://en.wikipedia.org/wiki/Black_Sabbath_(song)) |
| Doom | Solitude | Candlemass | 1986 | 대표 | 81 | B | [wikipedia.org](https://en.wikipedia.org/wiki/Solitude_(Candlemass_song)) |
| Doom | Born Too Late | Saint Vitus | 1986 | 대표 | 74 | G♯/A♭ | [wikipedia.org](https://en.wikipedia.org/wiki/Born_Too_Late) |
| Rock & Roll | Johnny B. Goode | Chuck Berry | 1958 | 대표 | 168 | — | [wikipedia.org](https://en.wikipedia.org/wiki/Johnny_B._Goode) |
| Rock & Roll | Tutti Frutti | Little Richard | 1955 | 대표 | 185 | — | [wikipedia.org](https://en.wikipedia.org/wiki/Tutti_Frutti_(song)) |
| Rock & Roll | Rock Around the Clock | Bill Haley & His Comets | 1954 | 대표 | 180 | A 장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Rock_Around_the_Clock) |
| Rock & Roll | Great Balls of Fire | Jerry Lee Lewis | 1957 | 대표 | 167 | — | [wikipedia.org](https://en.wikipedia.org/wiki/Great_Balls_of_Fire) |
| Rock & Roll | Oh, Pretty Woman | Roy Orbison | 1964 | 1위 | 127 | A 장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Oh,_Pretty_Woman) |
| Surf Rock | Misirlou | Dick Dale & His Del-Tones | 1962 | 대표 | 173 | E | [wikipedia.org](https://en.wikipedia.org/wiki/Misirlou) |
| Surf Rock | Let's Go Trippin' | Dick Dale & His Del-Tones | 1961 | 대표 | 148 | E 장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Let%27s_Go_Trippin%27) |
| Surf Rock | Pipeline | The Chantays | 1962 | 대표 | 152 | A 단조 | [wikipedia.org](https://en.wikipedia.org/wiki/Pipeline_(instrumental)) |
| Surf Rock | Wipe Out | The Surfaris | 1963 | 대표 | 169 | C 장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Wipe_Out_(song)) |
| Surf Rock | Surf City | Jan and Dean | 1963 | 1위 | 148 | A♭ 장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Surf_City_(song)) |
| Garage Rock | Louie Louie | The Kingsmen | 1963 | 대표 | 122 | C♯ 단조 | [wikipedia.org](https://en.wikipedia.org/wiki/Louie_Louie) |
| Garage Rock | The Witch | The Sonics | 1964 | 대표 | 172 | C 장조 | [wikipedia.org](https://en.wikipedia.org/wiki/The_Witch_(song)) |
| Garage Rock | Psychotic Reaction | Count Five | 1966 | 대표 | 165 | F♯ | [wikipedia.org](https://en.wikipedia.org/wiki/Psychotic_Reaction) |
| Garage Rock | 96 Tears | ? and the Mysterians | 1966 | 1위 | 119.88 | F♯ | [wikipedia.org](https://en.wikipedia.org/wiki/96_Tears) |
| Garage Rock | Wild Thing | The Troggs | 1966 | 1위 | ≈102 | — | [wikipedia.org](https://en.wikipedia.org/wiki/Wild_Thing_(The_Wild_Ones_song)) |
| Psychedelic Rock | Tomorrow Never Knows | The Beatles | 1966 | 대표 | 126 | C Mixolydian | [wikipedia.org](https://en.wikipedia.org/wiki/Tomorrow_Never_Knows) |
| Psychedelic Rock | White Rabbit | Jefferson Airplane | 1967 | 대표 | 105 | F♯ minor | [wikipedia.org](https://en.wikipedia.org/wiki/White_Rabbit_(song)) |
| Psychedelic Rock | You're Gonna Miss Me | The 13th Floor Elevators | 1966 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/You%27re_Gonna_Miss_Me_(song)) |
| Psychedelic Rock | Paint It Black | The Rolling Stones | 1966 | 1위 | 159 | C♯/D♭ | [wikipedia.org](https://en.wikipedia.org/wiki/Paint_It_Black) |
| Psychedelic Rock | Light My Fire | The Doors | 1967 | 1위 | 125 | A minor | [wikipedia.org](https://en.wikipedia.org/wiki/Light_My_Fire) |
| Pop Punk | Basket Case | Green Day | 1994 | 대표 | 85 (더블타임 170) | E♭장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Basket_Case_(Green_Day_song)) |
| Pop Punk | All the Small Things | Blink-182 | 1999 | 대표 | 150 | C장조 | [wikipedia.org](https://en.wikipedia.org/wiki/All_the_Small_Things) |
| Pop Punk | Girlfriend | Avril Lavigne | 2007 | 1위 | 164 | D장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Girlfriend_(Avril_Lavigne_song)) |
| Pop Punk | Good 4 U | Olivia Rodrigo | 2021 | 1위 | 85 | F♯단조 | [wikipedia.org](https://en.wikipedia.org/wiki/Good_4_U) |
| Hardcore Punk | Pay to Cum | Bad Brains | 1980 | 대표 | 161 | A | [wikipedia.org](https://en.wikipedia.org/wiki/Pay_to_Cum) |
| Hardcore Punk | Straight Edge | Minor Threat | 1981 | 대표 | 189 | F | [wikipedia.org](https://en.wikipedia.org/wiki/Straight_Edge_(song)) |
| Hardcore Punk | Rise Above | Black Flag | 1981 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Damaged_(Black_Flag_album)) |
| Post-punk | Love Will Tear Us Apart | Joy Division | 1980 | 대표 | 147 | D major | [wikipedia.org](https://en.wikipedia.org/wiki/Love_Will_Tear_Us_Apart) |
| Post-punk | Transmission | Joy Division | 1979 | 대표 | 154 | G major | [wikipedia.org](https://en.wikipedia.org/wiki/Transmission_(song)) |
| Post-punk | She's Lost Control | Joy Division | 1979 | 대표 | 144 | B minor | [wikipedia.org](https://en.wikipedia.org/wiki/She%27s_Lost_Control) |
| Post-punk | Damaged Goods | Gang of Four | 1978 | 대표 | 157 | C major | [wikipedia.org](https://en.wikipedia.org/wiki/Damaged_Goods_(Gang_of_Four_song)) |
| Gothic Rock | Bela Lugosi's Dead | Bauhaus | 1979 | 대표 | 150 | — | [wikipedia.org](https://en.wikipedia.org/wiki/Bela_Lugosi%27s_Dead) |
| Gothic Rock | A Forest | The Cure | 1980 | 대표 | 163 (반박 82) | C major | [wikipedia.org](https://en.wikipedia.org/wiki/A_Forest) |
| Gothic Rock | Spellbound | Siouxsie and the Banshees | 1981 | 대표 | 149 | — | [wikipedia.org](https://en.wikipedia.org/wiki/Spellbound_(Siouxsie_and_the_Banshees_song)) |
| Gothic Rock | Temple of Love (1983) | The Sisters of Mercy | 1983 | 대표 | 171 (반박 86) | B minor | [wikipedia.org](https://en.wikipedia.org/wiki/Temple_of_Love_(The_Sisters_of_Mercy_song)) |
| Dance-punk | Losing My Edge | LCD Soundsystem | 2002 | 대표 | 116 | C♯/D♭ major | [wikipedia.org](https://en.wikipedia.org/wiki/Losing_My_Edge) |
| Dance-punk | Daft Punk Is Playing at My House | LCD Soundsystem | 2005 | 대표 | 136 | G major | [wikipedia.org](https://en.wikipedia.org/wiki/Daft_Punk_Is_Playing_at_My_House) |
| Dance-punk | House of Jealous Lovers | The Rapture | 2002 | 대표 | 130 | C♯/D♭ | [wikipedia.org](https://en.wikipedia.org/wiki/House_of_Jealous_Lovers) |
| Dance-punk | Damaged Goods | Gang of Four | 1978 | 대표 | 157 | C major | [wikipedia.org](https://en.wikipedia.org/wiki/Damaged_Goods_(Gang_of_Four_song)) |
| Emo | Seven | Sunny Day Real Estate | 1994 | 대표 | 191 (반박 96) | F major | [wikipedia.org](https://en.wikipedia.org/wiki/Emo) |
| Emo | The Middle | Jimmy Eat World | 2001 | 대표 | 162 | — | [wikipedia.org](https://en.wikipedia.org/wiki/The_Middle_(Jimmy_Eat_World_song)) |
| Emo | Helena | My Chemical Romance | 2005 | 대표 | 126 | E major | [wikipedia.org](https://en.wikipedia.org/wiki/Helena_(My_Chemical_Romance_song)) |
| Grunge | Smells Like Teen Spirit | Nirvana | 1991 | 대표 | 117 | F단조 | [wikipedia.org](https://en.wikipedia.org/wiki/Smells_Like_Teen_Spirit) |
| Grunge | Black Hole Sun | Soundgarden | 1994 | 대표 | 105 | F♯ 장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Black_Hole_Sun) |
| Grunge | Alive | Pearl Jam | 1991 | 대표 | 161 (반박 81) | G장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Alive_(Pearl_Jam_song)) |
| Grunge | Would? | Alice in Chains | 1992 | 대표 | 100 | F♯ | [wikipedia.org](https://en.wikipedia.org/wiki/Would%3F) |
| Grunge | Touch Me I'm Sick | Mudhoney | 1988 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Touch_Me_I%27m_Sick) |
| Indie Rock | Cut Your Hair | Pavement | 1994 | 대표 | 111 | — | [wikipedia.org](https://en.wikipedia.org/wiki/Cut_Your_Hair) |
| Indie Rock | Last Nite | The Strokes | 2001 | 대표 | 104 | C장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Last_Nite) |
| Indie Rock | Maps | Yeah Yeah Yeahs | 2003 | 대표 | 120 | G장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Maps_(Yeah_Yeah_Yeahs_song)) |
| Indie Rock | Float On | Modest Mouse | 2004 | 대표 | 101 | F♯ 장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Float_On_(Modest_Mouse_song)) |
| Indie Rock | A-Punk | Vampire Weekend | 2008 | 대표 | 175 (반박 88) | — | [wikipedia.org](https://en.wikipedia.org/wiki/A-Punk) |
| Shoegaze | Only Shallow | My Bloody Valentine | 1991 | 대표 | 170 (반박 85) | — | [wikipedia.org](https://en.wikipedia.org/wiki/Only_Shallow) |
| Shoegaze | Soon | My Bloody Valentine | 1990 | 대표 | 110 | F♯단조 | [wikipedia.org](https://en.wikipedia.org/wiki/Soon_(My_Bloody_Valentine_song)) |
| Shoegaze | When You Sleep | My Bloody Valentine | 1991 | 대표 | 129 | B | [wikipedia.org](https://en.wikipedia.org/wiki/When_You_Sleep) |
| Shoegaze | Vapour Trail | Ride | 1990 | 대표 | 108 | C♯단조 | [wikipedia.org](https://en.wikipedia.org/wiki/Vapour_Trail_(song)) |
| Shoegaze | Alison | Slowdive | 1993 | 대표 | 102 | — | [wikipedia.org](https://en.wikipedia.org/wiki/Souvlaki_(album)) |
| Dream Pop | Song to the Siren | This Mortal Coil | 1983 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Song_to_the_Siren) |
| Dream Pop | Heaven or Las Vegas | Cocteau Twins | 1990 | 대표 | 180 (반박 90) | — | [wikipedia.org](https://en.wikipedia.org/wiki/Heaven_or_Las_Vegas_(song)) |
| Dream Pop | Fade into You | Mazzy Star | 1993 | 대표 | 52 (배박 104) | — | [wikipedia.org](https://en.wikipedia.org/wiki/Fade_into_You) |
| Dream Pop | Myth | Beach House | 2012 | 대표 | 142 (반박 71) | — | [wikipedia.org](https://en.wikipedia.org/wiki/Myth_(Beach_House_song)) |
| Dream Pop | Space Song | Beach House | 2015 | 대표 | 147 (반박 74) | — | [wikipedia.org](https://en.wikipedia.org/wiki/Space_Song) |
| Britpop | Live Forever | Oasis | 1994 | 대표 | 92 | G장조끝에 A단조로 전조, | [wikipedia.org](https://en.wikipedia.org/wiki/Live_Forever_(Oasis_song)) |
| Britpop | Parklife | Blur | 1994 | 대표 | 138 | E장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Parklife_(song)) |
| Britpop | Common People | Pulp | 1995 | 대표 | 144 | C장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Common_People) |
| Britpop | Wonderwall | Oasis | 1995 | 대표 | 175 | F♯단조 | [wikipedia.org](https://en.wikipedia.org/wiki/Wonderwall_(song)) |
| Noise Rock | Death Valley '69 | Sonic Youth & Lydia Lunch | 1984 | 대표 | 137 | A | [wikipedia.org](https://en.wikipedia.org/wiki/Death_Valley_%2769) |
| Noise Rock | 100% | Sonic Youth | 1992 | 대표 | 117 | G | [wikipedia.org](https://en.wikipedia.org/wiki/100%25_(Sonic_Youth_song)) |
| Noise Rock | Mouth Breather | The Jesus Lizard | 1990 | 대표 | 105 | — | [wikipedia.org](https://en.wikipedia.org/wiki/Mouth_Breather) |
| Heavy Metal | Breaking the Law | Judas Priest | 1980 | 대표 | 164 (반속 82) | A 에올리안Am–F–G | [wikipedia.org](https://en.wikipedia.org/wiki/Breaking_the_Law) |
| Heavy Metal | Paranoid | Black Sabbath | 1970 | 대표 | 163 (반속 82) | E 단조E 마이너 펜타토닉 | [wikipedia.org](https://en.wikipedia.org/wiki/Paranoid_(Black_Sabbath_song)) |
| Heavy Metal | Crazy Train | Ozzy Osbourne | 1980 | 대표 | 138 | A | [wikipedia.org](https://en.wikipedia.org/wiki/Crazy_Train) |
| Heavy Metal | Holy Diver | Dio | 1983 | 대표 | 92 (배속 184) | G♯/A♭ | [wikipedia.org](https://en.wikipedia.org/wiki/Holy_Diver_(song)) |
| Thrash Metal | Master of Puppets | Metallica | 1986 | 대표 | 105 | E 단조 | [wikipedia.org](https://en.wikipedia.org/wiki/Master_of_Puppets_(song)) |
| Thrash Metal | Angel of Death | Slayer | 1986 | 대표 | 210 | — | [wikipedia.org](https://en.wikipedia.org/wiki/Angel_of_Death_(Slayer_song)) |
| Thrash Metal | Peace Sells | Megadeth | 1986 | 대표 | 144 | F♯/G♭ 단조 | [wikipedia.org](https://en.wikipedia.org/wiki/Peace_Sells) |
| Thrash Metal | Holy Wars... The Punishment Due | Megadeth | 1990 | 대표 | 125 (배속 250) | A | [wikipedia.org](https://en.wikipedia.org/wiki/Holy_Wars..._The_Punishment_Due) |
| Black Metal | Freezing Moon | Mayhem | 1994 | 대표 | 93 (배속 186) | — | [wikipedia.org](https://en.wikipedia.org/wiki/De_Mysteriis_Dom_Sathanas) |
| Black Metal | Transilvanian Hunger | Darkthrone | 1994 | 대표 | 139 | E 단조 | [wikipedia.org](https://en.wikipedia.org/wiki/Transilvanian_Hunger) |
| Black Metal | I Am the Black Wizards | Emperor | 1994 | 대표 | 104 | C | [wikipedia.org](https://en.wikipedia.org/wiki/In_the_Nightside_Eclipse) |
| Black Metal | Dunkelheit | Burzum | 1996 | 대표 | 55 (배속 110) | — | [wikipedia.org](https://en.wikipedia.org/wiki/Filosofem) |
| Stoner Rock | Green Machine | Kyuss | 1992 | 대표 | 90 (더블 180) | C | [wikipedia.org](https://en.wikipedia.org/wiki/Green_Machine_(song)) |
| Stoner Rock | No One Knows | Queens of the Stone Age | 2002 | 대표 | 171 (하프 86) | C | [wikipedia.org](https://en.wikipedia.org/wiki/No_One_Knows) |
| Stoner Rock | Space Lord | Monster Magnet | 1998 | 대표 | 96 | C minor | [wikipedia.org](https://en.wikipedia.org/wiki/Space_Lord) |
| Stoner Rock | Sweet Leaf | Black Sabbath | 1971 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Sweet_Leaf) |
| Power Metal | I Want Out | Helloween | 1988 | 대표 | 91 (배속 182) | C 장조 | [wikipedia.org](https://en.wikipedia.org/wiki/I_Want_Out_(Helloween_song)) |
| Power Metal | Eagle Fly Free | Helloween | 1988 | 대표 | 157 (배속 314) | C 장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Keeper_of_the_Seven_Keys:_Part_II) |
| Power Metal | Hunting High and Low | Stratovarius | 2000 | 대표 | 94 (배속 188) | F♯/G♭ 단조 | [wikipedia.org](https://en.wikipedia.org/wiki/Infinite_(Stratovarius_album)) |
| Power Metal | Through the Fire and Flames | DragonForce | 2006 | 대표 | 200 | C 단조E♭ 장조 구간 | [wikipedia.org](https://en.wikipedia.org/wiki/Through_the_Fire_and_Flames) |
| Metalcore | The End of Heartache | Killswitch Engage | 2004 | 대표 | 124 (하프 62) | C | [wikipedia.org](https://en.wikipedia.org/wiki/The_End_of_Heartache_(song)) |
| Metalcore | My Curse | Killswitch Engage | 2006 | 대표 | 177 (하프 89) | A♯/B♭ minor | [wikipedia.org](https://en.wikipedia.org/wiki/My_Curse_(song)) |
| Metalcore | Tears Don't Fall | Bullet for My Valentine | 2005 | 대표 | 162 (하프 81) | G minor | [wikipedia.org](https://en.wikipedia.org/wiki/Tears_Don%27t_Fall) |
| Proto-punk | I Wanna Be Your Dog | The Stooges | 1969 | 대표 | 121 | E | [wikipedia.org](https://en.wikipedia.org/wiki/I_Wanna_Be_Your_Dog) |
| Proto-punk | Kick Out the Jams | MC5 | 1969 | 대표 | 145 | F♯ 단조 | [wikipedia.org](https://en.wikipedia.org/wiki/Kick_Out_the_Jams_(song)) |
| Proto-punk | I'm Waiting for the Man | The Velvet Underground | 1967 | 대표 | 126 | G | [wikipedia.org](https://en.wikipedia.org/wiki/I%27m_Waiting_for_the_Man) |
| Proto-punk | Roadrunner | The Modern Lovers | 1972 | 대표 | 76 (두 배 152) | D | [wikipedia.org](https://en.wikipedia.org/wiki/Roadrunner_(Jonathan_Richman_song)) |
| Proto-punk | Search and Destroy | Iggy and the Stooges | 1973 | 대표 | 155 | B♭ | [wikipedia.org](https://en.wikipedia.org/wiki/Search_and_Destroy_(The_Stooges_song)) |
| Acid Rock | Psychotic Reaction | Count Five | 1966 | 대표 | 165 | F♯ | [wikipedia.org](https://en.wikipedia.org/wiki/Psychotic_Reaction) |
| Acid Rock | In-A-Gadda-Da-Vida | Iron Butterfly | 1968 | 대표 | 126 | D | [wikipedia.org](https://en.wikipedia.org/wiki/In-A-Gadda-Da-Vida_(song)) |
| Acid Rock | Purple Haze | The Jimi Hendrix Experience | 1967 | 대표 | 108 | E | [wikipedia.org](https://en.wikipedia.org/wiki/Acid_rock) |
| Acid Rock | Summertime Blues | Blue Cheer | 1968 | 대표 | 140 | F | [wikipedia.org](https://en.wikipedia.org/wiki/Vincebus_Eruptum) |
| Space Rock | Interstellar Overdrive | Pink Floyd | 1967 | 대표 | 98 | D | [wikipedia.org](https://en.wikipedia.org/wiki/Interstellar_Overdrive) |
| Space Rock | Astronomy Domine | Pink Floyd | 1967 | 대표 | 123 | D | [wikipedia.org](https://en.wikipedia.org/wiki/Astronomy_Domine) |
| Space Rock | Set the Controls for the Heart of the Sun | Pink Floyd | 1968 | 대표 | 131 | A | [wikipedia.org](https://en.wikipedia.org/wiki/Set_the_Controls_for_the_Heart_of_the_Sun) |
| Space Rock | Silver Machine | Hawkwind | 1972 | 대표 | 132 | C♯/D♭ | [wikipedia.org](https://en.wikipedia.org/wiki/Silver_Machine) |
| Krautrock | Halleluhwah | Can | 1971 | 대표 | 92 | G | [wikipedia.org](https://en.wikipedia.org/wiki/Halleluhwah) |
| Krautrock | Spoon | Can | 1972 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Spoon_(Can_song)) |
| Krautrock | Krautrock | Faust | 1973 | 대표 | 123 | A | [wikipedia.org](https://en.wikipedia.org/wiki/Krautrock) |
| Krautrock | Mother Sky | Can | 1970 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Mother_Sky) |
| Southern Rock | Sweet Home Alabama | Lynyrd Skynyrd | 1974 | 대표 | 98 | G | [wikipedia.org](https://en.wikipedia.org/wiki/Sweet_Home_Alabama) |
| Southern Rock | Free Bird | Lynyrd Skynyrd | 1973 | 대표 | 118 | — | [wikipedia.org](https://en.wikipedia.org/wiki/Free_Bird) |
| Southern Rock | Ramblin' Man | The Allman Brothers Band | 1973 | 대표 | 182 (절반 91) | A♭ 장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Ramblin%27_Man_(Allman_Brothers_Band_song)) |
| Southern Rock | Can't You See | The Marshall Tucker Band | 1973 | 대표 | 164 (절반 82) | — | [wikipedia.org](https://en.wikipedia.org/wiki/Can%27t_You_See_(The_Marshall_Tucker_Band_song)) |
| Glam Rock | Get It On | T. Rex | 1971 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Get_It_On_(T._Rex_song)) |
| Glam Rock | The Jean Genie | David Bowie | 1972 | 대표 | 129 | E | [wikipedia.org](https://en.wikipedia.org/wiki/The_Jean_Genie) |
| Glam Rock | Cum On Feel the Noize | Slade | 1973 | 대표 | 138 | G | [wikipedia.org](https://en.wikipedia.org/wiki/Cum_On_Feel_the_Noize) |
| Glam Rock | The Ballroom Blitz | Sweet | 1973 | 대표 | 109 | — | [wikipedia.org](https://en.wikipedia.org/wiki/The_Ballroom_Blitz) |
| Glam Rock | Hot Child in the City | Nick Gilder | 1978 | 1위 | ≈110 | E | [wikipedia.org](https://en.wikipedia.org/wiki/Hot_Child_in_the_City) |
| NWOBHM | The Trooper | Iron Maiden | 1983 | 대표 | 88 (배속 176) | E 단조 | [wikipedia.org](https://en.wikipedia.org/wiki/The_Trooper) |
| NWOBHM | Run to the Hills | Iron Maiden | 1982 | 대표 | 178 | G 장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Run_to_the_Hills) |
| NWOBHM | Wheels of Steel | Saxon | 1980 | 대표 | 133 | D♯/E♭ 단조 | [wikipedia.org](https://en.wikipedia.org/wiki/Wheels_of_Steel) |
| NWOBHM | Am I Evil? | Diamond Head | 1980 | 대표 | 89 (배속 178) | A♯/B♭ 단조 | [wikipedia.org](https://en.wikipedia.org/wiki/Am_I_Evil%3F) |
| Sludge | Hooch | Melvins | 1993 | 대표 | 104 (하프 52) | G | [wikipedia.org](https://en.wikipedia.org/wiki/Houdini_(album)) |
| Sludge | All I Had (I Gave) | Crowbar | 1993 | 대표 | 116 (하프 58) | — | [wikipedia.org](https://en.wikipedia.org/wiki/Crowbar_(album)) |
| Sludge | Sisterfucker (Part I) | Eyehategod | 1993 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Take_as_Needed_for_Pain) |
| Sludge | Blood and Thunder | Mastodon | 2004 | 대표 | 93 | D | [wikipedia.org](https://en.wikipedia.org/wiki/Leviathan_(Mastodon_album)) |
| Stoner | Dopesmoker | Sleep | 2003 | 대표 | 97 | F | [wikipedia.org](https://en.wikipedia.org/wiki/Jerusalem_(Sleep_album)) |
| Stoner | Dragonaut | Sleep | 1992 | 대표 | 124 (하프 62) | F | [wikipedia.org](https://en.wikipedia.org/wiki/Sleep's_Holy_Mountain) |
| Stoner | Funeralopolis | Electric Wizard | 2000 | 대표 | 63 | — | [wikipedia.org](https://en.wikipedia.org/wiki/Dopethrone) |
| Symphonic Metal | Nemo | Nightwish | 2004 | 대표 | 125 | — | [wikipedia.org](https://en.wikipedia.org/wiki/Nemo_(song)) |
| Symphonic Metal | Wishmaster | Nightwish | 2000 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Wishmaster_(album)) |
| Symphonic Metal | Ice Queen | Within Temptation | 2001 | 대표 | 92 (배속 184) | — | [wikipedia.org](https://en.wikipedia.org/wiki/Ice_Queen_(song)) |
| Symphonic Metal | Emerald Sword | Rhapsody | 1998 | 대표 | 90 (배속 180) | C 단조 | [wikipedia.org](https://en.wikipedia.org/wiki/Symphonic_metal) |
| Punk Rock | New Rose | The Damned | 1976 | 대표 | 174 | C♯/D♭ | [wikipedia.org](https://en.wikipedia.org/wiki/New_Rose) |
| Punk Rock | Neat Neat Neat | The Damned | 1977 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Neat_Neat_Neat) |
| Punk Rock | Ever Fallen in Love (With Someone You Shouldn't've) | Buzzcocks | 1978 | 대표 | 175 | E장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Ever_Fallen_in_Love_(With_Someone_You_Shouldn%27t%27ve)) |
| Crust | Arise! (동명 앨범 수록) | Amebix | 1985 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Arise!_(Amebix_album)) |
| Crust | Out from the Void | Antisect | 1985 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Crust_punk) |
| Crust | Police Bastard | Doom (UK) | 1989 | 대표 | — | — | [negativeinsight.com](https://www.negativeinsight.com/niblog/doom-police-bastard) |
| Crust | Tech-No-Logic-Kill | Nausea | 1990 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Extinction_(album)) |
| D-beat | Realities of War | Discharge | 1980 | 대표 | 133 | C | [wikipedia.org](https://en.wikipedia.org/wiki/Discharge_(band)) |
| D-beat | Raped Ass (동명 EP 수록) | Anti Cimex | 1983 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/D-beat) |
| D-beat | Get It Off | Disfear | 2008 | 대표 | 154 | D♯/E♭ | [stereogum.com](https://stereogum.com/1979559/looking-back-on-the-legacy-of-d-beat-10-years-of-disfears-masterpiece-live-the-storm/columns/sounding-board) |
| Powerviolence | Drop Dead (6곡 데모 — 음반 단위) | Siege | 1984 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Drop_Dead_(album)) |
| Powerviolence | My World... My Way (No Man's Slave 마지막 곡) | Infest | 2002 | 대표 | — | — | [sputnikmusic.com](https://www.sputnikmusic.com/review/32312/Infest-No-Mans-Slave/) |
| Powerviolence | Charles Bronson / Spazz 스플릿 7" (음반 단위) | Charles Bronson · Spazz | 1995 | 대표 | — | — | [heavyblogisheavy.com](https://www.heavyblogisheavy.com/2016/01/13/starter-kit-powerviolence/) |
| New Wave | Heart of Glass | Blondie | 1979 | 1위 | 115 | D major | [wikipedia.org](https://en.wikipedia.org/wiki/Heart_of_Glass_(song)) |
| New Wave | My Sharona | The Knack | 1979 | 1위 | 148 | — | [wikipedia.org](https://en.wikipedia.org/wiki/My_Sharona) |
| New Wave | Once in a Lifetime | Talking Heads | 1980 | 대표 | 117 | D major | [wikipedia.org](https://en.wikipedia.org/wiki/Once_in_a_Lifetime_(Talking_Heads_song)) |
| New Wave | Whip It | Devo | 1980 | 대표 | 158 | E major | [wikipedia.org](https://en.wikipedia.org/wiki/Whip_It_(Devo_song)) |
| New Wave | Just What I Needed | The Cars | 1978 | 대표 | 127 | E major | [wikipedia.org](https://en.wikipedia.org/wiki/Just_What_I_Needed) |
| Post-punk Revival | Take Me Out | Franz Ferdinand | 2004 | 대표 | 104 | — | [wikipedia.org](https://en.wikipedia.org/wiki/Take_Me_Out_(song)) |
| Post-punk Revival | Obstacle 1 | Interpol | 2002 | 대표 | 121 | — | [wikipedia.org](https://en.wikipedia.org/wiki/Obstacle_1) |
| Post-punk Revival | Mr. Brightside | The Killers | 2003 | 대표 | 148 | D♭ major | [wikipedia.org](https://en.wikipedia.org/wiki/Mr._Brightside) |
| Post-punk Revival | I Bet You Look Good on the Dancefloor | Arctic Monkeys | 2005 | 대표 | 103 (배박 206) | F♯ minor | [wikipedia.org](https://en.wikipedia.org/wiki/I_Bet_You_Look_Good_on_the_Dancefloor) |
| Screamo | Bang Yer Head | Portraits of Past | 1996 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Screamo) |
| Screamo | Cross Out the Eyes | Thursday | 2001 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Screamo) |
| Screamo | Ohio Is for Lovers | Hawthorne Heights | 2004 | 대표 | 170 | G♯/A♭ minor | [wikipedia.org](https://en.wikipedia.org/wiki/Ohio_Is_for_Lovers) |
| Screamo | Fly by Night | Loma Prieta | 2012 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Screamo) |
| Alternative Rock | Losing My Religion | R.E.M. | 1991 | 대표 | 126 | A단조 | [wikipedia.org](https://en.wikipedia.org/wiki/Losing_My_Religion) |
| Alternative Rock | Creep | Radiohead | 1992 | 대표 | 92 | G장조 | [wikipedia.org](https://en.wikipedia.org/wiki/Creep_(Radiohead_song)) |
| Alternative Rock | Fake Plastic Trees | Radiohead | 1995 | 대표 | 74 (배박 148) | — | [wikipedia.org](https://en.wikipedia.org/wiki/Fake_Plastic_Trees) |
| Alternative Rock | With or Without You | U2 | 1987 | 1위 | 110 | D장조 | [wikipedia.org](https://en.wikipedia.org/wiki/With_or_Without_You) |
| Lo-fi Indie | Walking the Cow | Daniel Johnston | 1983 | 대표 | 142 (반박 71) | B♭ 단조 | [wikipedia.org](https://en.wikipedia.org/wiki/Walking_the_Cow) |
| Lo-fi Indie | Brand New Love (1986 4트랙판) | Lou Barlow (Sentridoh) / Sebadoh | 1986 | 대표 | 105 | — | [wikipedia.org](https://en.wikipedia.org/wiki/Brand_New_Love) |
| Lo-fi Indie | Summer Babe (Winter Version) | Pavement | 1991 | 대표 | 98 | — | [wikipedia.org](https://en.wikipedia.org/wiki/Slanted_and_Enchanted) |
| Lo-fi Indie | Game of Pricks | Guided by Voices | 1995 | 대표 | 139 | — | [wikipedia.org](https://en.wikipedia.org/wiki/Alien_Lanes) |
| Slacker Rock | Freak Scene | Dinosaur Jr. | 1988 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Freak_Scene) |
| Slacker Rock | Loser | Beck | 1993 | 대표 | 86 | D장조 | [ultimateclassicrock.com](https://ultimateclassicrock.com/beck-loser-song/) |
| Slacker Rock | Avant Gardener | Courtney Barnett | 2013 | 대표 | 115 | C | [americansongwriter.com](https://americansongwriter.com/the-meaning-behind-avant-gardener-by-courtney-barnett-and-her-harrowing-slacker-anthem/) |
| Slacker Rock | Salad Days | Mac DeMarco | 2014 | 대표 | 201 (반박 101) | F장조 | [nme.com](https://www.nme.com/reviews/reviews-mac-demarco-15233-311836) |
| Country Rock | You Ain't Goin' Nowhere | The Byrds | 1968 | 대표 | 132 | G | [wikipedia.org](https://en.wikipedia.org/wiki/You_Ain%27t_Goin%27_Nowhere) |
| Country Rock | Take It Easy | Eagles | 1972 | 대표 | 139 | G | [wikipedia.org](https://en.wikipedia.org/wiki/Take_It_Easy) |
| Country Rock | Peaceful Easy Feeling | Eagles | 1972 | 대표 | 143 | E | [wikipedia.org](https://en.wikipedia.org/wiki/Peaceful_Easy_Feeling) |
| Country Rock | Heartache Tonight | Eagles | 1979 | 1위 | 113 | C | [wikipedia.org](https://en.wikipedia.org/wiki/Heartache_Tonight) |

### 이 곡들로 고친 것

프리셋 파일(`src/data/presets/01-rock.js`)과 선율 배정(`src/data/melody.js`)을 함께 고쳤습니다.
드럼 패턴은 [../patterns/01-rock.md](../patterns/01-rock.md), 선율 판정은 `genres/profiles/01-A-rock.json` 에 있습니다.

| 프리셋 | 어긋났던 것 | 곡이 말한 것 | 고친 값 |
|---|---|---|---|
| Rock | 130 BPM · 오르간 · 하이게인 | 5곡 88~125 BPM · 오르간 1곡 · 크런치 | 115 · 크런치 트윈 · 오르간 낮춤 |
| Southern Rock | swing 30 («셔플이 빠지면 하드록») | 4곡 모두 레이드백 스트레이트 · 피아노 3/4곡 | swing 8 · 100 · 피아노 |
| Glam Rock | 오르간 · 하이게인 · 8분 킥 | 오르간 0곡 · 색소폰·탬버린 · 4분 스톰프 | 125 · 색소폰 · 탬버린 · 4분 킥 |
| Rock & Roll | swing 34 | 드럼은 스윙·기타는 스트레이트 · 색소폰 3/5곡 | swing 24 · 168 · 색소폰 |
| Surf Rock | 건반 없음 · 4분 킥 | Pipeline 일렉트릭 피아노 · 장르 문서의 배경 오르간 | EP·오르간(배경) · 킥 1·3박 |
| Garage Rock | — | 콤보 오르간 반복 · 탬버린 · 하모니카 | 탬버린 8분 · 하모니카 |
| Proto-punk | 오르간 | 피아노 2 · 오르간 1 · 없음 2 · 4분 킥 | 피아노 8분 연타 · 4분 킥 · 썰매방울 · 145 |
| Country Rock | Minor Pentatonic · 120 | 4곡 모두 장조 · 132~143 · 밴조 | Major · 136 · 밴조 · 붐칙 베이스 · 건반 끔 |
| Psychedelic Rock | 115 · 형제와 같은 선율 | 105~159 · 선법 드론 · 시타르 · 탬버린 | 125 · Dorian · 탬버린 · 월드 장식음 재료 |
| Acid Rock | 형제와 오르간 공유 | 건반 1/4곡 · 퍼즈 베이스 유니즌 | 오르간 낮춤 · 베이스 = 기타 리프 · 130 |
| Space Rock | 105 · 긴 베이스(gate 400) · 패드 | 98~132 · 반복 리프 베이스 · Farfisa | 120 · 8분 오스티나토 · 오르간 |
| Motorik | 킥이 스네어 자리와 겹침 | 스네어 자리만 뺀 8분 킥 · 필인 없음 · 와우 리듬 기타 | 킥 `X-x---x-X-x---x-` · wah |
| Krautrock | 135 · 16분 시퀀서 건반 | Can 92~123 펑크형 · Farfisa·EP · 시퀀서는 확인 안 됨 | 110 · 오르간·EP |
| Heavy Metal | 갤럽 킥·베이스·기타 | 4곡 모두 곧은 8분 | 곧은 8분 · Am–F–G · 크런치 |
| NWOBHM | 8분 | 갤럽이 여기서 뚜렷(The Trooper · Run to the Hills) | 갤럽 베이스·기타 · 170 · 트윈 크런치 |
| Thrash Metal | 킥 8분 전부 | 스키 비트 | 킥 4분 · 스네어 뒷박 |
| Death Metal | **심벌이 하나도 안 울림**(이전 절 «편성과 어긋나는 것») | 미드템포 구간이 섞이고 심벌이 박을 끈다 | 라이드 8분 · 블래스트 반 + 그루브 반 |
| Black Metal | 건반 없음 | 신스 2/4곡(Emperor · Burzum) | 패드 켬 · 선율 풀 부여 |
| Power Metal | 선율 없음 | 157~200 · 고음 클린 찬가 · 건반 2/4곡 | 180 · 근음 질주 · 선율 풀 부여 |
| Symphonic Metal | 150 · Major · 선율 없음 | 오케스트라·합창 4/4곡 · 단조 · 미드템포 90~125 | 125 · Natural Minor · 선율 풀 부여 |
| Nu Metal | 건반 끔 · 하프타임 스네어 | 턴테이블·신스 3/4곡 · 2·4 스네어 | 패드 텍스처 · 백비트 |
| Metalcore | 브레이크다운만 | 빠른 절 ↔ 브레이크다운 낙차 | 한 마디에 둘 |
| Sludge | 75 · 백비트 | 하프타임 체감 52~58 | 104 + 스네어 3박 |
| Stoner | 100 · swing 18 · 오르간 | 하프 체감 50~65 · 3인조, 건반 없음 | 124 하프타임 · swing 8 |
| Stoner Rock | 100 · Stoner 와 «값이 완전히 같음» | 85~100 · 스토너 둠과 템포·골격이 다름 | 92 · 킥 골격 |
| Pop Punk | 건반 끔 | 키보드·신시사이저 3/4곡 · 핸드클랩 | 신스(poly) 켬 · 클랩 2·4 |
| Punk | 16분 베이스·기타 | 8분 다운스트로크 | 8분 I–IV–V |
| Hardcore Punk | 킥 8분 전부 | 스캥크 비트 | 킥·스네어 교대 |
| Crust | 180 | 원래 미드템포(장르 문서) | 150 · 톰 |
| Post-punk | 135 · 코러스 기타 · 건반 | 144~157 · 코러스 기타 확인 안 됨 · 건반 0/4 | 150 · 클린·12현 · 건반 끔 |
| Gothic Rock | 120 · 8분 햇 | 16분 햇 위 반박 체감(82~86) · 플랜저 · 탐 부족 리듬 | 84 · 16분 햇 · phase 기타 · 탐 |
| Post-punk Revival | 오르간 · 선율 베이스(Oct 36) | 오르간 0/4 · 근음 8분 베이스 | 건반 끔 · Oct 24 · 선율 무리 분리 |
| Dance-punk | 스네어 없음 · 와우 기타 | 스네어에 겹친 클랩 · 카우벨 · 앵귤러 클린 기타 | 스네어+클랩 · 카우벨 · 클린 |
| New Wave | Natural Minor · 게이트 스네어 · 높은 베이스 | 장조 우세 · 1978~80 곡에 게이트 스네어 없음 · 근음 8분 | Major · body 스네어 · Oct 24 |
| Screamo | 16분 킥 폭발 | 빠른 하드코어 스킵 비트 | 킥 8분 · 스네어 뒷박 |
| Grunge | — | 조용한 벌스의 코러스 기타(Small Clone) | 2번 기타 chorus |
| Indie Rock | Natural Minor · 125 | 장조 우세 · 101~120 | Major · 112 |
| Noise Rock | 어긋난 스네어 · 반음 베이스 | «불안정한 비트» 가 아니라 단순 반복 비트 위 노이즈 | 스네어 2·4 · 드론 베이스 · 125 |
| Shoegaze | «한 대 코러스 벽» · 4분 킥 | 퍼즈 대량 오버더브 · 12현 두 대 | 12현 · 킥 골격 |
| Dream Pop | 110 · 패드 · 12현 | 드럼머신 반박 체감 52~90 · 오르간·아르페지오 · 장조 | 150 하프타임 · 오르간·pluck · rim 스네어 · Major |
| Britpop | 12현 | 12현 확인 안 됨 · 건반 4/4곡 · 탬버린 | 크런치+어쿠스틱 · 탬버린 8분 |
| Alternative Rock | 125 | 92~126 · 옅은 건반 · 만돌린 | 112 · 만돌린 · 건반 낮춤 |
| Lo-fi Indie | EP · 재즈 선율 재료 | 코드 오르간·피아노 · 장조 파워팝 훅 · 약한 베이스 | 오르간·피아노 · 팝 선율 재료 · Major |
| Slacker Rock | swing 14 · EP | 레이드백 · 건반 없음 · 장조 | swing 8 · 건반 끔 · Major |

> **고치지 않은 곳** — D-beat · Powerviolence 는 곡 단위 드럼·BPM 출처가 없어 이전 값을 두었습니다.
> Doom · Emo 는 곡이 이전 값과 맞았습니다(Doom 킥 한 칸만 더했습니다).
> 조성의 장/단은 자동 분석 판정이라 **네 곳 이상의 곡이 한쪽으로 모인 경우에만** 바꿨습니다.

---

## 레퍼런스 — 대표 아티스트 · 대표 앨범

편성을 정할 때 쓴 판단 근거입니다. 표기 규칙과 주의사항은
[00-reference.md](00-reference.md) 를 먼저 보십시오 —
**이 목록을 AI 프롬프트에 그대로 넣으면 안 됩니다.**
앨범명은 미검증이며 `(확인 필요)` 표시가 있습니다.

> 2026-09-16 — 아티스트는 위 «대표곡» 표에서 확인한 이름으로 넓혔고, «뽑아낸 속성» 은
> 교정 뒤의 값으로 다시 적었습니다. 이전 판의 속성 칸(오르간·하이게인·12현 등)은
> 대표곡으로 확인되지 않은 것이 많았습니다 — «이 곡들로 고친 것» 표를 보십시오.

### 뿌리

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| Rock & Roll | Chuck Berry · Little Richard · Bill Haley & His Comets · Jerry Lee Lewis | (확인 필요) | **피아노 5/5곡** · 크런치 · 업라이트 · 색소폰 |
| Surf Rock | Dick Dale · The Chantays · The Surfaris · The Ventures | (확인 필요) | **스프링 리버브 트레몰로 기타**가 선율 · EP·오르간은 배경 |
| Garage Rock | The Kingsmen · The Sonics · ? and the Mysterians · The Troggs | (확인 필요) | 콤보 오르간 반복 · 퍼즈·크런치 · 탬버린 |
| Proto-punk | The Stooges · MC5 · The Velvet Underground · The Modern Lovers | Fun House (확인 필요) | **피아노 8분 연타**(오르간은 1곡) · 크런치 · 4분 킥 |
| Rhythm & Blues | Ray Charles | (확인 필요) | **혼 섹션** · 피아노 |
| Traditional Pop · Brill Building | — | — | 스트링 · 피아노 · 업라이트 |

### Psychedelic · Krautrock

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| Psychedelic Rock | The Beatles · Jefferson Airplane · The 13th Floor Elevators · The Doors | Surrealistic Pillow (확인 필요) | 오르간 · **시타르** · 페이저 기타 · 탬버린 · 도리안 |
| Acid Rock | Count Five · Iron Butterfly · The Jimi Hendrix Experience · Blue Cheer | (확인 필요) | **퍼즈 리프**가 주인공 · 건반 1/4곡 · 베이스 유니즌 |
| Krautrock | Can · Faust | Tago Mago (확인 필요) | Farfisa 오르간·EP · **느린 펑크 그루브**(110) |
| Motorik | Neu! · Can · Kraftwerk · Hawkwind | Neu! (확인 필요) | **필인 없는 8분 킥** · 와우 리듬 기타 · 142 BPM |
| Space Rock | Pink Floyd · Hawkwind | (확인 필요) | Farfisa 오르간 · 딜레이 기타 · 신스 효과음 · **반복 리프 베이스** |

> **Motorik** 은 리듬 형식의 이름입니다 — 필인 없이 «앞으로만 가는» 8분 4/4 골격이
> 곧 장르입니다. 킥은 스네어 자리만 비우고 8분을 채웁니다(Hallogallo 출처 격자).

### Hard Rock · 루츠와의 교차

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| Rock | — ※1 | — | 크런치 트윈 기타 · 픽 베이스 · 115 BPM · 오르간 옅게 |
| Glam Rock | T. Rex · David Bowie · Slade · Sweet | Electric Warrior (확인 필요) | 크런치 · **4분 스톰프 + 박수·탬버린** · 색소폰 |
| Southern Rock | Lynyrd Skynyrd · The Allman Brothers Band · The Marshall Tucker Band | (확인 필요) | 슬라이드·트윈 기타 · **피아노** · 레이드백 스트레이트 |
| Country Rock | The Byrds · Eagles | Sweetheart of the Rodeo (확인 필요) | 페달 스틸·밴조 · 화음 보컬 · **장조** |

> ※1 «Rock» 은 특정 씬이 아니라 **계열의 기본값**으로 둔 프리셋입니다.
> 대표를 세우는 것이 맞지 않아 비웁니다. 기준을 잡을 때는 위 «대표곡» 표의 하드록 5곡을 씁니다.

### Metal

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| Heavy Metal | Judas Priest · Black Sabbath · Ozzy Osbourne · Dio | British Steel | 크런치 · **곧은 8분**(갤럽 아님) · 건반 없음(인트로 신스 1곡) |
| NWOBHM | Iron Maiden · Saxon · Diamond Head | The Number of the Beast | **갤럽** · 트윈 리드 · 달리는 베이스 |
| Thrash Metal | Metallica · Slayer · Megadeth | Master of Puppets | **팜뮤트** 다운피킹 · 스키 비트 · 드라이 |
| Death Metal | Death · Cannibal Corpse · Obituary | Symbolic | 블래스트 ↔ 미드템포 · **심벌이 박을 끈다** · 극단 하이게인 |
| Black Metal | Mayhem · Darkthrone · Emperor · Burzum | (확인 필요) | 트레몰로 기타 · 저역 없음 · **신스 패드 2/4곡** |
| Doom | Black Sabbath · Candlemass · Saint Vitus | Master of Reality | 느림 · 두꺼운 **퍼즈** · 긴 감쇠 · 트라이톤 |
| Sludge | Melvins · Crowbar · Eyehategod · Mastodon | (확인 필요) | **하프타임** · 퍼즈 · 피드백 |
| Stoner Rock | Kyuss · Queens of the Stone Age · Monster Magnet | Blues for the Red Sun | **퍼즈** 리프 · 베이스 유니즌 · 건반 없음 |
| Stoner | Sleep · Electric Wizard | Dopesmoker | **하프타임 체감 50~65** · 극단 퍼즈 · 건반 없음 |
| Power Metal | Helloween · Stratovarius · DragonForce | Keeper of the Seven Keys | 16분 더블킥 · 고음 클린 찬가 · 건반 2/4곡(북유럽·영국형) |
| Nu Metal | Korn · Limp Bizkit · Linkin Park · Slipknot · Deftones | Follow the Leader | 싱코페 킥 · 팜뮤트 · **스크래치·신스 텍스처** |
| Metalcore | Killswitch Engage · Bullet for My Valentine | Alive or Just Breathing | 빠른 절 ↔ 브레이크다운 · 타이트 |
| Symphonic Metal | Nightwish · Within Temptation · Rhapsody | (확인 필요) | **오케스트라·합창 4/4곡** · 하이게인 받침 |

### Punk

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| Punk | Ramones · Sex Pistols · The Clash | Ramones (1976) | 크런치 · 픽 베이스 · **8분 다운스트로크** · 건반 없음 |
| Punk Rock | The Damned · Buzzcocks | (확인 필요) | 크런치 · **선율 베이스 리프** · 톰 |
| Pop Punk | Green Day · blink-182 · Avril Lavigne · Olivia Rodrigo | Dookie (확인 필요) | 크런치~하이게인 · **신스 3/4곡** · 핸드클랩 |
| Hardcore Punk | Bad Brains · Minor Threat · Black Flag | Damaged (확인 필요) | 하이게인 버즈소 · **스캥크 비트** |
| D-beat | Discharge · Anti Cimex · Disfear | Hear Nothing See Nothing Say Nothing (확인 필요) | 하이게인 · 이름이 곧 드럼 패턴 |
| Crust | Amebix · Antisect · Doom · Nausea | (확인 필요) | **퍼즈 베이스 전면** · 톰 부족 리듬 · 원래 미드템포 |
| Powerviolence | Siege · Infest · Spazz | (확인 필요) | 블래스트 ↔ 슬러지 하프타임 급전환 |

> Punk 하위분기는 `off:['keys']` 로 건반을 꺼 둡니다. **Pop Punk 는 예외** — 대표곡 4곡 중
> 3곡에 키보드·신시사이저 크레딧이 있어 켰습니다. D-beat 은 Discharge 의 드럼 패턴에서
> 이름을 딴 장르입니다 — **밴드 이름이 곧 리듬형이 된** 드문 경우입니다.

### Post-punk 계보

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| Post-punk | Joy Division · Gang of Four | Unknown Pleasures | **베이스가 선율** · 클린·12현 기타 · 건반 없음 |
| Gothic Rock | Bauhaus · The Cure · Siouxsie and the Banshees · The Sisters of Mercy | (확인 필요) | **플랜저·에코 클린 기타** · 16분 햇 반박 체감 · 탐 |
| New Wave | Blondie · Talking Heads · Devo · The Cars | (확인 필요) | 신스 리프 4/5곡 · 클린 기타 · 장조 |
| Dance-punk | LCD Soundsystem · The Rapture | (확인 필요) | 디스코 하이햇 · **카우벨·클랩** · 선율 베이스 |
| Post-punk Revival | Interpol · Franz Ferdinand · The Killers · Arctic Monkeys | Turn On the Bright Lights (확인 필요) | 크런치+클린 맞물림 · 근음 8분 베이스 · 건반 없음 |
| Emo | Sunny Day Real Estate · Jimmy Eat World · My Chemical Romance | (확인 필요) | 클린 아르페지오 ↔ 디스토션 · 배경 패드 |
| Screamo | Portraits of Past · Thursday · Hawthorne Heights | — | 하이게인 · 노래 ↔ 절규 · 건반 없음 |

### Alternative

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| Grunge | Nirvana · Soundgarden · Pearl Jam · Alice in Chains | Nevermind | 퍼즈 기타 · 조용함↔폭발 · **건반 없음** · 드럼 룸 큼 |
| Alternative Rock | R.E.M. · Radiohead · U2 | The Bends | 크런치 · 만돌린·아르페지오 · 건반 옅게 |
| Britpop | Oasis · Blur · Pulp | (What's the Story) Morning Glory? | 밝은 크런치 + 어쿠스틱 · **건반 4/4곡** · 탬버린 · 장조 |
| Shoegaze | My Bloody Valentine · Ride · Slowdive | Loveless | **퍼즈 오버더브**·글라이드 기타 · 묻힌 보컬 · 드럼 묻힘 |
| Dream Pop | Cocteau Twins · Mazzy Star · Beach House | Heaven or Las Vegas | 클린 리버브 아르페지오 · **오르간·드럼머신** · 반박 체감 · 장조 |
| Noise Rock | Sonic Youth · The Jesus Lizard | Daydream Nation | 불협 튜닝·피드백 · **드라이한 드럼** · 건반 없음 |
| Indie Rock | Pavement · The Strokes · Yeah Yeah Yeahs · Modest Mouse | Slanted and Enchanted | 맞물린 얇은 기타 · 타이트 8분 · 장조 · 건반 없음(90년대) |
| Lo-fi Indie | Daniel Johnston · Guided by Voices · Sebadoh | Bee Thousand | 대역 좁음 · 코드 오르간·피아노 · 저역 얇음 · 장조 훅 |
| Slacker Rock | Dinosaur Jr. · Beck · Mac DeMarco · Courtney Barnett | Salad Days | 코러스·워블 클린 기타 · **레이드백**(셔플 아님) · 건반 없음 |
