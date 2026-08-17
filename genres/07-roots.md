# G. Blues / Country / Folk (American Roots) — 장르별 특징

> [00-tree.md](00-tree.md) **G 계열**의 모든 장르를 트리 등장 순서대로 다룹니다.
> BPM은 관행적 범위이지 규격이 아닙니다.
> 박자는 [../patterns/07-roots.md](../patterns/07-roots.md), 표기 규칙은 [../patterns/README.md](../patterns/README.md).
> 엔진 이름의 뜻은 [00-instruments.md](00-instruments.md) — 문서 끝의 **PULSE·16 설정값** 표와 짝입니다.

**공통 제약**: 블루스의 셔플은 셋잇단(2:1)이라 스윙 노브 **50**에서
정확히 재현됩니다. 그보다 낮으면 "약간 스윙한 스트레이트"가 됩니다.

---

## 1. Blues

| 장르 | BPM | 리듬 골격 | 음색·편성 | 핵심 포인트 |
|---|---|---|---|---|
| Delta Blues | 70~100 | 자유로운 셔플, 무박에 가까움 | 슬라이드 기타, 발 스톰프 | 그리드 밖의 타이밍 |
| Country Blues | 70~110 | 상동 | 어쿠스틱 기타 단독 | 델타블루스와 인접 |
| **Chicago Blues** | 90~130 | **셔플**(12/8 셋잇단), 백비트 | 하모니카, 앰프 기타 | 셔플 비율이 핵심 |
| Electric Blues | 90~140 | 셔플 또는 스트레이트 | 일렉 기타 + 밴드 | 시카고블루스의 상위 개념 |
| Jump Blues | 140~180 | 스윙 셔플 | 혼 섹션, 워킹 베이스 | R&B와 로큰롤의 다리 |
| Texas Blues | 100~140 | 셔플 또는 스트레이트 | 기타 중심 | 기타 솔로 비중 |
| Blues Rock | 100~150 | 스트레이트 8분 또는 셔플 | 오버드라이브 기타 | → [01-rock.md](01-rock.md) §3 |

**셔플 제작 노트**
블루스 셔플은 한 박을 3등분해서 첫째·셋째만 치는 패턴입니다(2:1).
PULSE·16에서는 **스윙 노브 50**이 정확한 값입니다.
노브 0은 스트레이트, 50이 완전 셔플, 그 사이가 "약간 스윙".

<!-- chart-auto:start -->

**차트 1위 — 이 분기에서 나온 것** *(Hot 100 0곡 · Billboard 200 1장)*

> 출처는 [../billboard/](../billboard/) — **곡·앨범명은 위키백과 그대로이지만
> 장르는 붙인 것**입니다. `?` 는 자료가 갈리는 것이고, 없다고 확정은 아닙니다.
> 연도는 1위에 오른 해이며, 재등정은 첫 해만 남겼습니다.
> **패턴의 근거로 쓰지 말고, 무엇을 들어 볼지 고르는 입구로만 쓰십시오.**
> 이 표는 자동 생성입니다 — `tools/chart-to-genres.mjs`. 여기가 아니라 `billboard/` 를 고치십시오.

| 장르 | 연도 | 곡 · 앨범 | 아티스트 | 차트 |
|---|---|---|---|---|
| Chicago Blues | 1994 | From the Cradle | Eric Clapton | BB200 |

<!-- chart-auto:end -->

---

## 2. Country

| 장르 | BPM | 리듬 골격 | 음색·편성 | 핵심 포인트 |
|---|---|---|---|---|
| Old-time / Hillbilly | 100~160 | 2/4 "붐-칙" | 피들, 밴조 | 어쿠스틱 앙상블 |
| Country | 80~140 | 2·4 백비트, 단순한 킥 | 어쿠스틱 기타, 페달 스틸, 피들 | 이 갈래 전체의 상위 이름 |
| **Bluegrass** | 120~180 | 2/4 "붐-칙", 오프비트 만돌린 촙 | 밴조·피들·만돌린 | 만돌린 촙이 스네어 역할 |
| **Honky-tonk** | 110~150 | **트레인 비트**(16분 스네어 롤) | 페달 스틸, 피들 | 스네어의 지속적 16분 |
| Nashville Sound | 80~120 | 부드러운 백비트 | 스트링, 백보컬 | 팝 프로덕션 도입 |
| Countrypolitan | 80~120 | 상동, 더 매끄럽게 | 오케스트라 | 나쉬빌 사운드의 극단 |
| Outlaw Country | 90~130 | 록에 가까운 백비트 | 일렉 기타 | 나쉬빌 사운드에 대한 반발 |
| Country Pop | 90~130 | 스트레이트 백비트 | 어쿠스틱 + 팝 프로덕션 | 팝 구조에 컨트리 음색 |
| Bro-country | 100~130 | 팝·힙합 그루브 | 드럼 루프, 신스 | 프로그래밍 비중 높음 |
| Americana | 80~130 | 느슨한 록 비트 | 어쿠스틱 + 로우파이 | 프로덕션이 절제됨 |
| Alt-country | 80~130 | 상동 | 인디록 감각 | 아메리카나와 인접 |

**Bluegrass 제작 노트**
드럼이 없습니다. **만돌린의 "촙"(오프비트 강타)이 스네어 역할**을 하고,
베이스가 1·3박을 짚습니다. 드럼 트랙으로 옮길 때는 만돌린 촙을
2·4박 스네어로 치환하면 골격이 유지됩니다.

**Train Beat 제작 노트**
```
kick   X-------X-------
snare  xXxxxXxxxXxxxXxx     16분 롤, 2·4박 강세
```
기차 바퀴 소리를 흉내낸 것에서 이름이 왔습니다.

<!-- chart-auto:start -->

**차트 1위 — 이 분기에서 나온 것** *(Hot 100 35곡 · Billboard 200 120장)*

> 출처는 [../billboard/](../billboard/) — **곡·앨범명은 위키백과 그대로이지만
> 장르는 붙인 것**입니다. `?` 는 자료가 갈리는 것이고, 없다고 확정은 아닙니다.
> 연도는 1위에 오른 해이며, 재등정은 첫 해만 남겼습니다.
> **패턴의 근거로 쓰지 말고, 무엇을 들어 볼지 고르는 입구로만 쓰십시오.**
> 이 표는 자동 생성입니다 — `tools/chart-to-genres.mjs`. 여기가 아니라 `billboard/` 를 고치십시오.

| 장르 | 연도 | 곡 · 앨범 | 아티스트 | 차트 |
|---|---|---|---|---|
| Country Pop | 1970 | Everything Is Beautiful | Ray Stevens | Hot 100 |
| Country Pop | 1972 | Baby, Don't Get Hooked on Me | Mac Davis | Hot 100 |
| Country Pop | 1973 | The Night the Lights Went Out in Georgia | Vicki Lawrence | Hot 100 |
| Country Pop | 1973 | Delta Dawn | Helen Reddy | Hot 100 |
| Country Pop | 1974 | I Can Help | Billy Swan | Hot 100 |
| Country Pop | 1974 | John Denver's Greatest Hits | John Denver | BB200 |
| Country Pop | 1974 | Back Home Again | John Denver | BB200 |
| Country Pop | 1974 | If You Love Me, Let Me Know | Olivia Newton-John | BB200 |
| Country Pop | 1975 | Thank God I'm a Country Boy | John Denver | Hot 100 |
| Country Pop | 1975 | Rhinestone Cowboy | Glen Campbell | Hot 100 |
| Country Pop | 1975 | I'm Sorry | John Denver | Hot 100 |
| Country Pop | 1975 | Windsong | John Denver | BB200 |
| Country Pop | 1976 | Convoy | C. W. McCall | Hot 100 |
| Country Pop | 1976 | Let Your Love Flow | The Bellamy Brothers | Hot 100 |
| Country Pop | 1977 | Southern Nights | Glen Campbell | Hot 100 |
| Country Pop | 1980 | Lady | Kenny Rogers | Hot 100 |
| Country Pop | 1980 | Kenny Rogers' Greatest Hits | Kenny Rogers | BB200 |
| Country Pop | 1981 | 9 to 5 | Dolly Parton | Hot 100 |
| Country Pop | 1981 | I Love a Rainy Night | Eddie Rabbitt | Hot 100 |
| Country Pop | 1983 | Islands in the Stream | Kenny Rogers and Dolly Parton | Hot 100 |
| Country Pop | 1992 | Some Gave All | Billy Ray Cyrus | BB200 |
| Country Pop | 1997 | Unchained Melody: The Early Years | LeAnn Rimes | BB200 |
| Country Pop | 1999 | Breathe | Faith Hill | BB200 |
| Country Pop | 2000 | Amazed | Lonestar | Hot 100 |
| Country Pop | 2002 | No Shoes, No Shirt, No Problems | Kenny Chesney | BB200 |
| Country Pop | 2002 | Cry | Faith Hill | BB200 |
| Country Pop | 2002 | Up! | Shania Twain | BB200 |
| Country Pop | 2004 | When the Sun Goes Down | Kenny Chesney | BB200 |
| Country Pop | 2004 | Feels Like Today | Rascal Flatts | BB200 |
| Country Pop | 2005 | Fireflies | Faith Hill | BB200 |
| Country Pop | 2005 | The Road and the Radio | Kenny Chesney | BB200 |
| Country Pop | 2006 | Me and My Gang | Rascal Flatts | BB200 |
| Country Pop | 2007 | Still Feels Good | Rascal Flatts | BB200 |
| Country Pop | 2007 | Carnival Ride | Carrie Underwood | BB200 |
| Country Pop | 2008 | Love on the Inside | Sugarland | BB200 |
| Country Pop | 2008 | Fearless | Taylor Swift | BB200 |
| Country Pop | 2009 | Defying Gravity | Keith Urban | BB200 |
| Country Pop | 2009 | Unstoppable | Rascal Flatts | BB200 |
| Country Pop | 2009 | Live on the Inside | Sugarland | BB200 |
| Country Pop | 2009 | Play On | Carrie Underwood | BB200 |
| Country Pop | 2010 | Need You Now | Lady Antebellum | BB200 |
| Country Pop | 2010 | Hemingway's Whiskey | Kenny Chesney | BB200 |
| Country Pop | 2010 | The Incredible Machine | Sugarland | BB200 |
| Country Pop | 2010 | Speak Now | Taylor Swift | BB200 |
| Country Pop | 2011 | Red River Blue | Blake Shelton | BB200 |
| Country Pop | 2011 | Own the Night | Lady Antebellum | BB200 |
| Country Pop | 2012 | Tuskegee | Lionel Richie | BB200 |
| Country Pop | 2012 | Blown Away | Carrie Underwood | BB200 |
| Country Pop | 2012 | Night Train | Jason Aldean | BB200 |
| Country Pop | 2012 | Red | Taylor Swift | BB200 |
| Country Pop | 2013 | Golden | Lady Antebellum | BB200 |
| Country Pop | 2013 | Fuse | Keith Urban | BB200 |
| Country Pop | 2014 | Bringing Back the Sunshine | Blake Shelton | BB200 |
| Country Pop | 2016 | They Don't Know | Jason Aldean | BB200 |
| Country Pop | 2017 | Life Changes | Thomas Rhett | BB200 |
| Country Pop | 2017 | Now | Shania Twain | BB200 |
| Country Pop | 2017 | Live in No Shoes Nation | Kenny Chesney | BB200 |
| Country Pop | 2018 | Rearview Town | Jason Aldean | BB200 |
| Country Pop | 2018 | Cry Pretty | Carrie Underwood | BB200 |
| Country Pop | 2018 | Experiment | Kane Brown | BB200 |
| Country Pop | 2019 | Old Town Road | Lil Nas X | Hot 100 |
| Country Pop | 2019 | Center Point Road | Thomas Rhett | BB200 |
| Country Pop | 2020 | Here and Now | Kenny Chesney | BB200 |
| Country Pop | 2021 | Dangerous: The Double Album | Morgan Wallen | BB200 |
| Country Pop | 2021 | Fearless (Taylor's Version) | Taylor Swift | BB200 |
| Country Pop | 2021 | Red (Taylor's Version) | Taylor Swift | BB200 |
| Country Pop | 2023 | Last Night | Morgan Wallen | Hot 100 |
| Country Pop | 2023 | One Thing at a Time | Morgan Wallen | BB200 |
| Country Pop | 2023 | Speak Now (Taylor's Version) | Taylor Swift | BB200 |
| Country Pop | 2024 | I Had Some Help | Post Malone featuring Morgan Wallen | Hot 100 |
| Country Pop | 2024 | A Bar Song (Tipsy) | Shaboozey | Hot 100 |
| Country Pop | 2024 | Love Somebody | Morgan Wallen | Hot 100 |
| Country Pop | 2024 | F-1 Trillion | Post Malone | BB200 |
| Country Pop | 2024 | Beautifully Broken | Jelly Roll | BB200 |
| Country Pop | 2025 | What I Want | Morgan Wallen featuring Tate McRae | Hot 100 |
| Country Pop | 2025 | I'm the Problem | Morgan Wallen | BB200 |
| Country | 1969 | Johnny Cash at San Quentin | Johnny Cash | BB200 |
| Country | 1991 | Ropin' the Wind | Garth Brooks | BB200 |
| Country | 1992 | The Chase | Garth Brooks | BB200 |
| Country | 1993 | In Pieces | Garth Brooks | BB200 |
| Country | 1994 | Kickin' It Up | John Michael Montgomery | BB200 |
| Country | 1994 | Not a Moment Too Soon | Tim McGraw | BB200 |
| Country | 1995 | The Hits | Garth Brooks | BB200 |
| Country | 1997 | Carrying Your Love with Me | George Strait | BB200 |
| Country | 1997 | Sevens | Garth Brooks | BB200 |
| Country | 1998 | The Limited Series | Garth Brooks | BB200 |
| Country | 1998 | Double Live | Garth Brooks | BB200 |
| Country | 1999 | A Place in the Sun | Tim McGraw | BB200 |
| Country | 1999 | Fly | Dixie Chicks | BB200 |
| Country | 2001 | Scarecrow | Garth Brooks | BB200 |
| Country | 2002 | Drive | Alan Jackson | BB200 |
| Country | 2002 | Unleashed | Toby Keith | BB200 |
| Country | 2003 | Greatest Hits Volume II and Some Other Stuff | Alan Jackson | BB200 |
| Country | 2003 | Shock'n Y'all | Toby Keith | BB200 |
| Country | 2004 | Live Like You Were Dying | Tim McGraw | BB200 |
| Country | 2004 | What I Do | Alan Jackson | BB200 |
| Country | 2004 | 50 Number Ones | George Strait | BB200 |
| Country | 2005 | Be as You Are (Songs from an Old Blue Chair) | Kenny Chesney | BB200 |
| Country | 2005 | Somewhere Down in Texas | George Strait | BB200 |
| Country | 2005 | All Jacked Up | Gretchen Wilson | BB200 |
| Country | 2007 | Let It Go | Tim McGraw | BB200 |
| Country | 2007 | Big Dog Daddy | Toby Keith | BB200 |
| Country | 2007 | Reba: Duets | Reba McEntire | BB200 |
| Country | 2008 | Good Time | Alan Jackson | BB200 |
| Country | 2008 | Troubadour | George Strait | BB200 |
| Country | 2008 | Lucky Old Sun | Kenny Chesney | BB200 |
| Country | 2009 | Twang | George Strait | BB200 |
| Country | 2009 | Keep on Loving You | Reba McEntire | BB200 |
| Country | 2010 | You Get What You Give | Zac Brown Band | BB200 |
| Country | 2010 | Bullets in the Gun | Toby Keith | BB200 |
| Country | 2011 | Chief | Eric Church | BB200 |
| Country | 2011 | Clear as Day | Scotty McCreery | BB200 |
| Country | 2012 | Uncaged | Zac Brown Band | BB200 |
| Country | 2013 | Set You Free | Gary Allan | BB200 |
| Country | 2013 | Life on a Rock | Kenny Chesney | BB200 |
| Country | 2013 | Blame It All on My Roots | Garth Brooks | BB200 |
| Country | 2014 | Platinum | Miranda Lambert | BB200 |
| Country | 2015 | Jekyll + Hyde | Zac Brown Band | BB200 |
| Country | 2019 | What You See Is What You Get | Luke Combs | BB200 |
| Country | 2023 | Try That in a Small Town | Jason Aldean | Hot 100 |
| Country | 2024 | Texas Hold 'Em | Beyoncé | Hot 100 |
| Americana | 2006 | American V: A Hundred Highways | Johnny Cash | BB200 |
| Americana | 2006 | Modern Times | Bob Dylan | BB200 |
| Americana | 2009 | Together Through Life | Bob Dylan | BB200 |
| Americana | 2012 | The Hunger Games: Songs from District 12 and Beyond | Soundtrack | BB200 |
| Americana | 2013 | The Civil Wars | The Civil Wars | BB200 |
| Americana | 2023 | I Remember Everything | Zach Bryan featuring Kacey Musgraves | Hot 100 |
| Americana | 2023 | Zach Bryan | Zach Bryan | BB200 |
| Bro-country | 2013 | Spring Break... Here to Party | Luke Bryan | BB200 |
| Bro-country | 2013 | Crash My Party | Luke Bryan | BB200 |
| Bro-country | 2014 | Old Boots, New Dirt | Jason Aldean | BB200 |
| Bro-country | 2014 | Anything Goes | Florida Georgia Line | BB200 |
| Bro-country | 2015 | Kill the Lights | Luke Bryan | BB200 |
| Bro-country | 2017 | What Makes You Country | Luke Bryan | BB200 |
| Countrypolitan | 1968 | Honey | Bobby Goldsboro | Hot 100 |
| Countrypolitan | 1968 | Harper Valley PTA | Jeannie C. Riley | Hot 100 |
| Countrypolitan | 1968 | Wichita Lineman | Glen Campbell | BB200 |
| Countrypolitan | 1973 | The Most Beautiful Girl | Charlie Rich | Hot 100 |
| Countrypolitan | 1975 | (Hey Won't You Play) Another Somebody Done Somebody Wrong Song | B. J. Thomas | Hot 100 |
| Countrypolitan | 1975 | Before the Next Teardrop Falls | Freddy Fender | Hot 100 |
| Nashville Sound | 1960 | El Paso | Marty Robbins | Hot 100 |
| Nashville Sound | 1960 | I'm Sorry | Brenda Lee | Hot 100 |
| Nashville Sound | 1960 | I Want to Be Wanted | Brenda Lee | Hot 100 |
| Nashville Sound | 1961 | Big Bad John | Jimmy Dean | Hot 100 |
| Bluegrass | 1973 | Dueling Banjos | Eric Weissberg & Steve Mandell | BB200 |
| Bluegrass | 2002 | O Brother, Where Art Thou? | Soundtrack | BB200 |
| Bluegrass | 2002 | Home | Dixie Chicks | BB200 |
| Country ? | 2024 | Cowboy Carter | Beyoncé | BB200 |
| Country ? | 2026 | Choosin' Texas | Ella Langley | Hot 100 |
| Country ? | 2026 | Dandelion | Ella Langley | BB200 |
| Country Pop ? | 2004 | License to Chill | Jimmy Buffett | BB200 |
| Country Pop ? | 2026 | Cloud 9 | Megan Moroney | BB200 |
| Outlaw Country | 2014 | The Outsiders | Eric Church | BB200 |
| Outlaw Country | 2015 | Traveller | Chris Stapleton | BB200 |
| Americana ? | 2026 | With Heaven on Top | Zach Bryan | BB200 |

<!-- chart-auto:end -->

---

## 3. Folk

| 장르 | BPM | 리듬 골격 | 음색·편성 | 핵심 포인트 |
|---|---|---|---|---|
| Traditional Folk | 가변 | 노래 우선, 리듬 자유 | 어쿠스틱 기타, 목소리 | 가사 중심 |
| Folk Revival | 90~140 | 단순한 스트럼 | 어쿠스틱, 하모니카 | 60년대 미국 |
| Singer-songwriter | 60~120 | 자유로운 루바토 빈번 | 기타 또는 피아노 단독 | 다이내믹이 넓음 |
| Indie Folk | 80~130 | 부드러운 백비트 | 어쿠스틱 + 리버브 | 현대적 프로덕션 |
| Freak Folk | 가변 | 불규칙 | 이질적 악기 조합 | 실험적 포크 |
| Folk Rock | 110~150 | 록 백비트 | 12현 기타 | → [01-rock.md](01-rock.md) §9 |

<!-- chart-auto:start -->

**차트 1위 — 이 분기에서 나온 것** *(Hot 100 34곡 · Billboard 200 50장)*

> 출처는 [../billboard/](../billboard/) — **곡·앨범명은 위키백과 그대로이지만
> 장르는 붙인 것**입니다. `?` 는 자료가 갈리는 것이고, 없다고 확정은 아닙니다.
> 연도는 1위에 오른 해이며, 재등정은 첫 해만 남겼습니다.
> **패턴의 근거로 쓰지 말고, 무엇을 들어 볼지 고르는 입구로만 쓰십시오.**
> 이 표는 자동 생성입니다 — `tools/chart-to-genres.mjs`. 여기가 아니라 `billboard/` 를 고치십시오.

| 장르 | 연도 | 곡 · 앨범 | 아티스트 | 차트 |
|---|---|---|---|---|
| Singer-songwriter | 1970 | Bridge over Troubled Water | Simon & Garfunkel | Hot 100 |
| Singer-songwriter | 1970 | Bridge over Troubled Water | Simon & Garfunkel | BB200 |
| Singer-songwriter | 1971 | It's Too Late / I Feel the Earth Move | Carole King | Hot 100 |
| Singer-songwriter | 1971 | You've Got a Friend | James Taylor | Hot 100 |
| Singer-songwriter | 1971 | Brand New Key | Melanie | Hot 100 |
| Singer-songwriter | 1971 | Tapestry | Carole King | BB200 |
| Singer-songwriter | 1972 | Heart of Gold | Neil Young | Hot 100 |
| Singer-songwriter | 1972 | Music | Carole King | BB200 |
| Singer-songwriter | 1972 | Harvest | Neil Young | BB200 |
| Singer-songwriter | 1972 | Catch Bull at Four | Cat Stevens | BB200 |
| Singer-songwriter | 1973 | You're So Vain | Carly Simon | Hot 100 |
| Singer-songwriter | 1973 | Bad, Bad Leroy Brown | Jim Croce | Hot 100 |
| Singer-songwriter | 1973 | Time in a Bottle | Jim Croce | Hot 100 |
| Singer-songwriter | 1973 | No Secrets | Carly Simon | BB200 |
| Singer-songwriter | 1974 | Sunshine on My Shoulders | John Denver | Hot 100 |
| Singer-songwriter | 1974 | Sundown | Gordon Lightfoot | Hot 100 |
| Singer-songwriter | 1974 | Annie's Song | John Denver | Hot 100 |
| Singer-songwriter | 1974 | Cat's in the Cradle | Harry Chapin | Hot 100 |
| Singer-songwriter | 1974 | You Don't Mess Around with Jim | Jim Croce | BB200 |
| Singer-songwriter | 1974 | Sundown | Gordon Lightfoot | BB200 |
| Singer-songwriter | 1974 | Wrap Around Joy | Carole King | BB200 |
| Singer-songwriter | 1975 | Blood on the Tracks | Bob Dylan | BB200 |
| Singer-songwriter | 1975 | Between the Lines | Janis Ian | BB200 |
| Singer-songwriter | 1975 | Still Crazy After All These Years | Paul Simon | BB200 |
| Singer-songwriter | 1976 | 50 Ways to Leave Your Lover | Paul Simon | Hot 100 |
| Singer-songwriter | 1988 | Tracy Chapman | Tracy Chapman | BB200 |
| Singer-songwriter | 2005 | Devils & Dust | Bruce Springsteen | BB200 |
| Singer-songwriter | 2006 | You're Beautiful | James Blunt | Hot 100 |
| Singer-songwriter | 2006 | Sing-A-Longs and Lullabies for the Film Curious George | Jack Johnson & Friends | BB200 |
| Singer-songwriter | 2007 | Hey There Delilah | Plain White T's | Hot 100 |
| Singer-songwriter | 2008 | Sleep Through the Static | Jack Johnson | BB200 |
| Singer-songwriter | 2008 | Home Before Dark | Neil Diamond | BB200 |
| Singer-songwriter | 2009 | Breakthrough | Colbie Caillat | BB200 |
| Singer-songwriter | 2010 | To the Sea | Jack Johnson | BB200 |
| Singer-songwriter | 2010 | Kaleidoscope Heart | Sara Bareilles | BB200 |
| Singer-songwriter | 2011 | Mission Bell | Amos Lee | BB200 |
| Singer-songwriter | 2012 | Born and Raised | John Mayer | BB200 |
| Singer-songwriter | 2013 | From Here to Now to You | Jack Johnson | BB200 |
| Singer-songwriter | 2014 | x | Ed Sheeran | BB200 |
| Singer-songwriter | 2015 | Before This World | James Taylor | BB200 |
| Singer-songwriter | 2017 | ÷ | Ed Sheeran | BB200 |
| Singer-songwriter | 2017 | Flicker | Niall Horan | BB200 |
| Singer-songwriter | 2023 | Rich Men North of Richmond | Oliver Anthony Music | Hot 100 |
| Folk Rock | 1965 | Mr. Tambourine Man | The Byrds | Hot 100 |
| Folk Rock | 1965 | I Got You Babe | Sonny & Cher | Hot 100 |
| Folk Rock | 1965 | Eve of Destruction | Barry McGuire | Hot 100 |
| Folk Rock | 1965 | Turn! Turn! Turn! | The Byrds | Hot 100 |
| Folk Rock | 1966 | The Sound of Silence | Simon & Garfunkel | Hot 100 |
| Folk Rock | 1966 | Summer in the City | The Lovin' Spoonful | Hot 100 |
| Folk Rock | 1968 | Mrs. Robinson | Simon & Garfunkel | Hot 100 |
| Folk Rock | 1968 | The Graduate | Simon & Garfunkel | BB200 |
| Folk Rock | 1968 | Bookends | Simon & Garfunkel | BB200 |
| Folk Rock | 1969 | In the Year 2525 | Zager and Evans | Hot 100 |
| Folk Rock | 1970 | Déjà Vu | Crosby, Stills, Nash & Young | BB200 |
| Folk Rock | 1971 | Maggie May / Reason to Believe | Rod Stewart | Hot 100 |
| Folk Rock | 1971 | 4 Way Street | Crosby, Stills, Nash & Young | BB200 |
| Folk Rock | 1972 | American Pie | Don McLean | Hot 100 |
| Folk Rock | 1972 | A Horse with No Name | America | Hot 100 |
| Folk Rock | 1972 | American Pie | Don McLean | BB200 |
| Folk Rock | 1972 | America | America | BB200 |
| Folk Rock | 1974 | Planet Waves | Bob Dylan with The Band | BB200 |
| Folk Rock | 1974 | So Far | Crosby, Stills, Nash & Young | BB200 |
| Folk Rock | 1975 | Sister Golden Hair | America | Hot 100 |
| Folk Rock | 1976 | Desire | Bob Dylan | BB200 |
| Folk Rock | 2019 | Shallow | Lady Gaga and Bradley Cooper | Hot 100 |
| Folk Rock | 2021 | All Too Well (Taylor's Version) | Taylor Swift | Hot 100 |
| Folk Revival | 1960 | Here We Go Again! | The Kingston Trio | BB200 |
| Folk Revival | 1960 | Sold Out | The Kingston Trio | BB200 |
| Folk Revival | 1960 | String Along | The Kingston Trio | BB200 |
| Folk Revival | 1961 | Michael | The Highwaymen | Hot 100 |
| Folk Revival | 1962 | Peter, Paul and Mary | Peter, Paul and Mary | BB200 |
| Folk Revival | 1963 | Walk Right In | The Rooftop Singers | Hot 100 |
| Folk Revival | 1963 | In the Wind | Peter, Paul and Mary | BB200 |
| Folk Revival | 1969 | Leaving on a Jet Plane | Peter, Paul and Mary | Hot 100 |
| Indie Folk | 2008 | Juno | Soundtrack | BB200 |
| Indie Folk | 2011 | The King Is Dead | The Decemberists | BB200 |
| Indie Folk | 2012 | Babel | Mumford & Sons | BB200 |
| Indie Folk | 2016 | Cleopatra | The Lumineers | BB200 |
| Indie Folk | 2020 | Folklore | Taylor Swift | BB200 |
| Indie Folk | 2020 | Evermore | Taylor Swift | BB200 |
| Indie Folk ? | 2018 | Delta | Mumford & Sons | BB200 |
| Indie Folk ? | 2026 | The Great Divide | Noah Kahan | BB200 |
| Traditional Folk | 1966 | The Ballad of the Green Berets | SSgt. Barry Sadler | Hot 100 |
| Traditional Folk | 1966 | Ballads of the Green Berets | SSgt. Barry Sadler | BB200 |

<!-- chart-auto:end -->

---

## 4. Gospel · 지역 장르

| 장르 | BPM | 리듬 골격 | 음색·편성 | 핵심 포인트 |
|---|---|---|---|---|
| **Gospel** | 60~140 | 강한 백비트, 셔플 빈번 | 해먼드, 합창, 탬버린 | 다이내믹의 상승 구조 |
| Spirituals | 느림 | 자유 | 무반주 합창 | 소울·블루스의 공통 뿌리 |
| Zydeco | 120~160 | 2박 계열, 워시보드 | 아코디언, 프로타부아 | 루이지애나 크리올 |
| Cajun | 100~150 | 2박 왈츠·투스텝 | 아코디언, 피들 | 루이지애나 프랑스계 |

<!-- chart-auto:start -->

**차트 1위 — 이 분기에서 나온 것** *(Hot 100 1곡 · Billboard 200 3장)*

> 출처는 [../billboard/](../billboard/) — **곡·앨범명은 위키백과 그대로이지만
> 장르는 붙인 것**입니다. `?` 는 자료가 갈리는 것이고, 없다고 확정은 아닙니다.
> 연도는 1위에 오른 해이며, 재등정은 첫 해만 남겼습니다.
> **패턴의 근거로 쓰지 말고, 무엇을 들어 볼지 고르는 입구로만 쓰십시오.**
> 이 표는 자동 생성입니다 — `tools/chart-to-genres.mjs`. 여기가 아니라 `billboard/` 를 고치십시오.

| 장르 | 연도 | 곡 · 앨범 | 아티스트 | 차트 |
|---|---|---|---|---|
| Gospel | 1988 | Man in the Mirror | Michael Jackson | Hot 100 |
| Gospel | 2019 | Jesus Is King | Kanye West | BB200 |
| Gospel ? | 1960 | The Lord's Prayer | The Mormon Tabernacle Choir | BB200 |
| Gospel ? | 2013 | Burning Lights | Chris Tomlin | BB200 |

<!-- chart-auto:end -->

---

## PULSE·16 설정값

도구에 그대로 옮길 수 있는 수치입니다. 엔진 이름의 뜻은
[00-instruments.md](00-instruments.md) 참조. 박자는 [../patterns/07-roots.md](../patterns/07-roots.md).

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
> 무엇을 어떻게 갈랐는지는 [`../patterns/07-roots.md`](../patterns/07-roots.md) 에 한 줄씩 적어 두었습니다.


> **2026-08-17 정정 — 베이스 표** 록(A) 문서에서 찾은 것과 **같은 세 가지**가
> 이 문서에도 그대로 있었습니다. 표를 프리셋에서 다시 뽑았습니다 — 21행.
>
> **① 엔진 칸** — 프리셋의 `bcfg.eng` 를 옮긴 값이었습니다. 실제로는
> `kit.bass` > `TONE_KIT`(하위분기) > `bcfg.eng` 순으로 정해지므로(`_build.js`),
> 블루스·컨트리·포크는 **전부 현 베이스**입니다 — `upright`·`finger`·`pick`(21칸).
>
> **② Oct** — **18종이 36** 이었습니다. 업라이트가 A2 110Hz 를 내고 있었으니
> 콘트라베이스 소리가 날 수 없었습니다. 24 로 내렸습니다.
>
> **③ Scale 칸** — `Minor Pentatonic` 은 state.js 의 초기값이라 «고른 값» 이
> 아니고, `_build.js` 가 하위분기 스케일로 덮습니다. 표에는 덮이기 전 값이
> 적혀 있었습니다(4칸).
>
> ⚠ 현 베이스에서 **Blend · X-Over · Tone · Glide 는 아무 일도 하지 않습니다** —
> 엔진 11종과 그 이유는 [00-instruments.md](00-instruments.md) §7-2.


### 트랙 재배정

이 계열에서 트랙이 기본 역할과 다르게 쓰이는 경우입니다.

- **Honky-tonk** — `snare` = **브러시 트레인 롤** (16분 전체, 2·4박 강세)
- **Bluegrass** — `snare` = **만돌린 촙**. 드럼이 없는 편성이라 오프비트 강타가 스네어 역할

### Blues

**드럼 — 킷 엔진 · 튠**

| 장르 | BPM | Swing | Kick | Snare | Clap | Hat | Tom | 튠 K/S/T/H |
|---|---|---|---|---|---|---|---|---|
| Chicago Blues | 110 | 50 | `wood` | `body` | `tight` | `noise` | `wood` | -2/-1/-2/0 |
| ·Texas Blues | 120 | 50 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Jump Blues | 160 | 50 | `wood` | `body` | `tight` | `noise` | `wood` | -2/0/-2/0 |
| ·Blues Rock | 125 | 0 | `wood` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Country Blues | 90 | 0 | `wood` | `body` | `tight` | `tick` | `wood` | -2/0/-2/0 |
| ·Electric Blues | 115 | 30 | `wood` | `body` | `tight` | `noise` | `wood` | -2/0/-2/0 |

**베이스**

| 장르 | 엔진 | Oct | Length | Glide | Blend | Drive | X-Over | Tone | Sub | Exc | Duck | Scale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Chicago Blues | `finger` | 24 | 120 | 0 | 40 | 34 | 110 | 3600 | 54 | 26 | 16 | Minor Pentatonic |
| ·Texas Blues | `finger` | 24 | 80 | 0 | 40 | 32 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Jump Blues | `upright` | 24 | 80 | 0 | 40 | 32 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Blues Rock | `finger` | 24 | 80 | 0 | 40 | 62 | 120 | 4000 | 56 | 32 | 22 | Minor Pentatonic |
| ·Country Blues | `upright` | 24 | 80 | 0 | 40 | 32 | 120 | 4000 | 56 | 32 | 22 | Minor Pentatonic |
| ·Electric Blues | `finger` | 24 | 80 | 0 | 40 | 32 | 120 | 4000 | 56 | 32 | 22 | Minor Pentatonic |

### Country

**드럼 — 킷 엔진 · 튠**

| 장르 | BPM | Swing | Kick | Snare | Clap | Hat | Tom | 튠 K/S/T/H |
|---|---|---|---|---|---|---|---|---|
| Honky-tonk | 130 | 0 | `wood` | `brush` | `tight` | `noise` | `wood` | 0/2/0/2 |
| Bluegrass | 150 | 0 | `wood` | `rim` | `tight` | `noise` | `wood` | 1/3/1/2 |
| ·Old-time / Hillbilly | 130 | 0 | `wood` | `brush` | `tight` | `tick` | `wood` | -2/0/-2/0 |
| ·Nashville Sound | 100 | 0 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Outlaw Country | 110 | 0 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Country Pop | 110 | 0 | `wood` | `body` | `tight` | `tick` | `analog` | -2/0/-2/0 |
| ·Bro-country | 115 | 0 | `punch` | `body` | `tight` | `noise` | `synth` | -2/0/-2/0 |
| ·Countrypolitan | 100 | 0 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Alt-country | 105 | 0 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Americana | 105 | 0 | `wood` | `body` | `tight` | `tick` | `wood` | -2/-4/-2/-2 |

**베이스**

| 장르 | 엔진 | Oct | Length | Glide | Blend | Drive | X-Over | Tone | Sub | Exc | Duck | Scale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Honky-tonk | `upright` | 24 | 64 | 0 | 38 | 26 | 120 | 3800 | 48 | 24 | 14 | Major |
| Bluegrass | `upright` | 24 | 56 | 0 | 34 | 22 | 125 | 3600 | 46 | 22 | 12 | Major |
| ·Old-time / Hillbilly | `upright` | 24 | 80 | 0 | 40 | 32 | 120 | 4000 | 56 | 32 | 22 | Minor Pentatonic |
| ·Nashville Sound | `upright` | 24 | 80 | 0 | 40 | 32 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Outlaw Country | `finger` | 24 | 80 | 0 | 40 | 32 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Country Pop | `finger` | 24 | 80 | 0 | 40 | 32 | 120 | 4000 | 56 | 32 | 22 | Minor Pentatonic |
| ·Bro-country | `pick` | 24 | 80 | 0 | 40 | 32 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Countrypolitan | `finger` | 24 | 80 | 0 | 40 | 32 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Alt-country | `finger` | 24 | 80 | 0 | 40 | 32 | 120 | 4000 | 56 | 32 | 28 | Minor Pentatonic |
| ·Americana | `upright` | 24 | 80 | 0 | 40 | 30 | 120 | 4000 | 56 | 32 | 22 | Minor Pentatonic |

### Folk

**드럼 — 킷 엔진 · 튠**

| 장르 | BPM | Swing | Kick | Snare | Clap | Hat | Tom | 튠 K/S/T/H |
|---|---|---|---|---|---|---|---|---|
| ·Folk Revival | 115 | 0 | `wood` | `body` | `tight` | `tick` | `wood` | -2/0/-2/0 |
| ·Indie Folk | 105 | 0 | `wood` | `body` | `hall` | `tick` | `wood` | -2/0/-2/0 |
| ·Folk Rock | 130 | 0 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |

**베이스**

| 장르 | 엔진 | Oct | Length | Glide | Blend | Drive | X-Over | Tone | Sub | Exc | Duck | Scale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ·Folk Revival | `upright` | 24 | 80 | 0 | 40 | 32 | 120 | 4000 | 56 | 32 | 22 | Major |
| ·Indie Folk | `upright` | 24 | 80 | 0 | 40 | 32 | 120 | 4000 | 56 | 32 | 22 | Major |
| ·Folk Rock | `upright` | 24 | 80 | 0 | 40 | 32 | 120 | 4000 | 56 | 32 | 28 | Major |

### Gospel · 지역 장르

**드럼 — 킷 엔진 · 튠**

| 장르 | BPM | Swing | Kick | Snare | Clap | Hat | Tom | 튠 K/S/T/H |
|---|---|---|---|---|---|---|---|---|
| ·Gospel | 100 | 30 | `punch` | `body` | `tight` | `noise` | `analog` | -2/0/-2/0 |
| ·Zydeco / Cajun | 140 | 0 | `wood` | `body` | `tight` | `noise` | `wood` | -2/0/-2/0 |

**베이스**

| 장르 | 엔진 | Oct | Length | Glide | Blend | Drive | X-Over | Tone | Sub | Exc | Duck | Scale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ·Gospel | `finger` | 24 | 80 | 0 | 40 | 32 | 120 | 4000 | 56 | 32 | 28 | Major |
| ·Zydeco / Cajun | `finger` | 24 | 80 | 0 | 40 | 32 | 120 | 4000 | 56 | 32 | 28 | Major |

---

## 레퍼런스 — 대표 아티스트 · 대표 앨범

편성을 정할 때 쓴 판단 근거입니다. 표기 규칙과 주의사항은
[00-reference.md](00-reference.md) 를 먼저 보십시오 —
**이 목록을 AI 프롬프트에 그대로 넣으면 안 됩니다.**
앨범명은 미검증이며 `(확인 필요)` 표시가 있습니다.

### Country

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| Honky-tonk | Hank Williams | (확인 필요) | **브러시 스네어** · 페달스틸 · 업라이트 |
| Bluegrass | Bill Monroe · Flatt & Scruggs | (확인 필요) | **만돌린 촙 + 림샷** · 건반 없음 · 업라이트 |
| Old-time / Hillbilly | The Carter Family | (확인 필요) | **밴조** · 하모니카 · 브러시 |
| Nashville Sound | Patsy Cline | (확인 필요) | **스트링 + 페달스틸** |
| Countrypolitan | Glen Campbell | (확인 필요) | 스트링 + 팝 편곡 · 페달스틸 |
| Outlaw Country | Willie Nelson · Waylon Jennings | Red Headed Stranger | 나일론 기타 · 피아노 · 드라이 |
| Country Pop | Shania Twain | (확인 필요) | 페달스틸 · 피아노 · 팝 드럼 |
| Bro-country | Florida Georgia Line | (확인 필요) | 크런치 · 신스 리드 · 픽 베이스 |
| Alt-country | Wilco · Uncle Tupelo | (확인 필요) | 페달스틸 + 로즈 · 느슨함 |
| Americana | Gillian Welch | (확인 필요) | **하모니카** · 어쿠스틱 · 업라이트 |

### Blues

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| Chicago Blues | Muddy Waters · Howlin' Wolf | (확인 필요) | **하모니카** · 크런치 · 핑거 베이스 |
| Texas Blues | Stevie Ray Vaughan | (확인 필요) | 크런치 · 오르간 |
| Country Blues | Robert Johnson | (확인 필요) | 하모니카 · **어쿠스틱 스틸** · 업라이트 |
| Jump Blues | Louis Jordan | (확인 필요) | **혼 섹션** · 피아노 · 업라이트 |
| Blues Rock · Electric Blues | — | — | 오르간 · 크런치 |

### Blues

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| **Electric Blues** | Muddy Waters · Howlin' Wolf · B.B. King | (확인 필요) | 오르간 · **크런치 기타** · 핑거 베이스 · wood 킥/톰 · 115 BPM · **swing 30** |
| **Blues Rock** | Cream · The Allman Brothers Band · Stevie Ray Vaughan | (확인 필요) | 같은 편성 · **125 BPM · swing 0** · analog 톰 |

> 둘을 가르는 것은 **셔플입니다.** 일렉트릭 블루스는 swing 30 으로 늘어지고,
> 블루스 록은 0 으로 곧게 갑니다 — 록 드럼이 들어온 자리입니다.

### Folk

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| **Folk Revival** | Bob Dylan · Joan Baez · Peter, Paul and Mary | The Freewheelin' Bob Dylan (확인 필요) | **wood 킥/톰 + tick 햇**(작고 조용한 킷) · 115 BPM |
| **Folk Rock** | The Byrds · Simon & Garfunkel | (확인 필요) | **punch 킥 + noise 햇**(록 킷) · 130 BPM |
| **Indie Folk** | Fleet Foxes · Bon Iver · Sufjan Stevens | For Emma, Forever Ago (확인 필요) | wood 킥 · **hall 클랩**(넓은 잔향) · 105 BPM |

> 셋의 차이는 **드럼을 얼마나 세게 치는가** 입니다. 포크 리바이벌은 거의
> 안 치고(wood + tick), 포크 록은 록 킷을 그대로 쓰고(punch + noise),
> 인디 포크는 다시 작아지되 잔향을 크게 겁니다(hall 클랩).
