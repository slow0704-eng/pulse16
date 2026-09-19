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

---

## 대표곡 — 웹으로 확인한 곡 (2026-09-19)

장르마다 곡을 골라 **곡이 실재하는지, 출처가 그 장르로 분류했는지**를 웹에서
확인한 것만 적었습니다. 확인하지 못한 후보는 버렸고, **버린 이유까지 아래 4에
남겨 두었습니다.**

> - **BPM 은 103줄 중 9칸(8.7%)뿐입니다.** 전부 **곡 문서 본문의 수치**이고,
>   **악보 템포 표기는 이 계열에 하나도 없습니다.** 장르 문서에서 나온 BPM 은
>   **한 칸도 없습니다** — 조사 파일 셋이 모두 「장르 문서에 BPM 수치가 없다」를
>   따로 적어 두었습니다. 추정으로 채우지 않았습니다.
> - **곡 문서의 장르란이 프리셋 장르와 다른 줄이 38건**입니다. 버리지 않고 표에
>   두되 §3 비고표에 전부 밝혔습니다 — **프리셋 근거로 쓸 때 가중치를 낮추라는
>   표시**입니다. 특히 **Bro-country 는 넷 중 하나(Cruise)만**, **Countrypolitan 은
>   여섯 중 둘(Rose Garden · The Most Beautiful Girl)만** 장르가 맞습니다.
> - **구분** — 조사 파일이 «1위» 를 적은 줄만 `1위` 입니다. 차트 기재가 없는 줄은
>   전부 `대표` 로 두었습니다(실제로 1위였을 곡도 출처 기재가 없으면 `대표`).
> - **연도** — 「(음반 단위)」 줄은 앨범의 해입니다. 출처가 연도를 안 적은 전통곡
>   넷(Cripple Creek · Soldier's Joy · Old Joe Clark · Uncle Pen)은 `—` 로 두고
>   프리셋 안 맨 뒤에 두었습니다.
> - **조성** 칸의 괄호는 출처가 함께 적은 **박자표**입니다(12/8 · 2/4 · 3/4 왈츠 ·
>   Swing 2/4 등). 프리셋이 16스텝 4/4 한 마디라 왈츠·2/4 가 그대로 담기지
>   않는다는 지적이 조사 파일 둘에 있습니다.
> - **출처 URL 은 조사 파일에 적힌 주소를 괄호·퍼센트 인코딩까지 그대로** 옮겼습니다.
>   URL 이 비어 있는 줄은 **없습니다**(§5).
> - **곡의 선율·리프는 옮겨 적지 않았습니다.** 프리셋은 이 곡들의 성질 — 템포 ·
>   드럼 골격 · 베이스 역할 · 편성 — 에만 맞추었습니다.
> - 앱의 «지금 장르» 줄과 근거 패널이 이 표를 보여 줍니다(`tools/build-refdata.mjs` → `src/data/references.js`).

| 프리셋 | 곡 | 아티스트 | 연도 | 구분 | BPM | 조성 | 출처 |
|---|---|---|---|---|---|---|---|
| Chicago Blues | Juke | Little Walter & His Night Cats | 1952 | 1위 | — | E | [wikipedia.org](https://en.wikipedia.org/wiki/Juke_(instrumental)) |
| Chicago Blues | Hoochie Coochie Man | Muddy Waters | 1954 | 대표 | 72 (본문) | A장조 (12/8) | [wikipedia.org](https://en.wikipedia.org/wiki/Hoochie_Coochie_Man) |
| Chicago Blues | My Babe | Little Walter | 1955 | 1위 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/My_Babe) |
| Chicago Blues | Mannish Boy | Muddy Waters | 1955 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Mannish_Boy) |
| Chicago Blues | Smokestack Lightning | Howlin' Wolf | 1956 | 대표 | — | 「nominally in E major」 | [wikipedia.org](https://en.wikipedia.org/wiki/Smokestack_Lightning) |
| Texas Blues | Rock Awhile | Goree Carter & His Hepcats | 1949 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Rock_Awhile) |
| Texas Blues | Texas Flood | Larry Davis (원곡) / Stevie Ray Vaughan | 1958 / 1983 | 대표 | — | 원곡 A♭ · SRV G♭ (12/8) | [wikipedia.org](https://en.wikipedia.org/wiki/Texas_Flood_(song)) |
| Texas Blues | Hide Away | Freddie King | 1960 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Hide_Away_(instrumental)) |
| Texas Blues | Pride and Joy | Stevie Ray Vaughan and Double Trouble | 1983 | 대표 | — | E (반음 내린 튜닝이라 E♭ 표기) (4/4, 12마디) | [wikipedia.org](https://en.wikipedia.org/wiki/Pride_and_Joy_(Stevie_Ray_Vaughan_song)) |
| Electric Blues | Boogie Chillen' | John Lee Hooker | 1948 | 1위 | — | 오픈 G 튜닝 + 카포 (1948년판 B) | [wikipedia.org](https://en.wikipedia.org/wiki/Boogie_Chillen%27) |
| Electric Blues | Rollin' Stone | Muddy Waters | 1950 | 대표 | — | E장조 (4/4) | [wikipedia.org](https://en.wikipedia.org/wiki/Rollin%27_Stone_(Muddy_Waters_song)) |
| Electric Blues | 3 O'Clock Blues | B.B. King | 1951 | 1위 | 65 (본문) | C조 (12/8, 12마디) | [wikipedia.org](https://en.wikipedia.org/wiki/Three_O%27Clock_Blues) |
| Electric Blues | The Things That I Used to Do | Guitar Slim | 1953 | 1위 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/The_Things_That_I_Used_to_Do) |
| Electric Blues | Boom Boom | John Lee Hooker | 1962 | 대표 | 168 (본문) | F조 (2/2, 12마디) | [wikipedia.org](https://en.wikipedia.org/wiki/Boom_Boom_(John_Lee_Hooker_song)) |
| Country Blues | Statesboro Blues | Blind Willie McTell | 1928 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Statesboro_Blues) |
| Country Blues | Pony Blues | Charley Patton | 1929 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Pony_Blues) |
| Country Blues | Cross Road Blues | Robert Johnson | 1936 | 대표 | 테이크1 ≈106 · 테이크2 ≈96 (본문) | B (오픈 G/스패니시 튜닝) | [wikipedia.org](https://en.wikipedia.org/wiki/Cross_Road_Blues) |
| Country Blues | Sweet Home Chicago | Robert Johnson | 1936 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Sweet_Home_Chicago) |
| Country Blues | Bottle Up and Go | Tommy McClennan | 1939 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Step_It_Up_and_Go) |
| Blues Rock | Crossroads (Cream 판) | Cream | 1968 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Cross_Road_Blues) |
| Blues Rock | Statesboro Blues (Allman Brothers 판) | The Allman Brothers Band | 1971 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Statesboro_Blues) |
| Blues Rock | La Grange | ZZ Top | 1973 앨범 / 1974 싱글 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/La_Grange_(song)) |
| Blues Rock | Slow Ride | Foghat | 1975 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Slow_Ride) |
| Blues Rock | Bad to the Bone | George Thorogood and the Destroyers | 1982 | 대표 | — | 오픈 G + 슬라이드 | [wikipedia.org](https://en.wikipedia.org/wiki/Bad_to_the_Bone) |
| Jump Blues | Flying Home | Lionel Hampton and His Orchestra | 1942 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Flying_Home) |
| Jump Blues | Caldonia | Louis Jordan and his Tympany Five | 1945 | 1위 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Caldonia) |
| Jump Blues | Choo Choo Ch'Boogie | Louis Jordan & His Tympany Five | 1946 | 1위 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Choo_Choo_Ch%27Boogie) |
| Jump Blues | Let the Good Times Roll | Louis Jordan and his Tympany Five | 1946 녹음 / 1947 차트 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Let_the_Good_Times_Roll_(Louis_Jordan_song)) |
| Jump Blues | Good Rocking Tonight | Roy Brown | 1947 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Good_Rocking_Tonight) |
| Jump Blues | Saturday Night Fish Fry | Louis Jordan & His Tympany Five | 1949 | 1위 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Saturday_Night_Fish_Fry) |
| Jump Blues | Rocket 88 | Jackie Brenston and his Delta Cats | 1951 | 1위 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Rocket_88) |
| Honky-tonk | Walking the Floor Over You | Ernest Tubb | 1941 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Walking_the_Floor_Over_You) |
| Honky-tonk | If You've Got the Money I've Got the Time | Lefty Frizzell | 1950 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/If_You%27ve_Got_the_Money_I%27ve_Got_the_Time) |
| Honky-tonk | Your Cheatin' Heart | Hank Williams | 1953 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Your_Cheatin%27_Heart) |
| Honky-tonk | There Stands the Glass | Webb Pierce | 1953 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/There_Stands_the_Glass) |
| Old-time / Hillbilly | The Little Old Log Cabin in the Lane | Fiddlin' John Carson (1923 녹음) | 1871 작 / 1923 녹음 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/The_Little_Old_Log_Cabin_in_the_Lane) |
| Old-time / Hillbilly | Wildwood Flower | The Carter Family | 1928 녹음 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Wildwood_Flower) |
| Old-time / Hillbilly | Single Girl, Married Girl | The Carter Family | 1928 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Single_Girl,_Married_Girl) |
| Old-time / Hillbilly | Cripple Creek | 전통곡 (아티스트 기재 없음) | — | 대표 | — | — (악보 2/4) | [wikipedia.org](https://en.wikipedia.org/wiki/Cripple_Creek_(folk_song)) |
| Old-time / Hillbilly | Soldier's Joy | 전통곡 (아티스트 기재 없음) | — | 대표 | — | — (악보 2/4) | [wikipedia.org](https://en.wikipedia.org/wiki/Soldier%27s_Joy_(fiddle_tune)) |
| Old-time / Hillbilly | Old Joe Clark | 전통곡 (아티스트 기재 없음) | — | 대표 | — | A major Mixolydian (악보 2/4) | [wikipedia.org](https://en.wikipedia.org/wiki/Old_Joe_Clark) |
| Bluegrass | Blue Moon of Kentucky | Bill Monroe | 1947 | 대표 | — | — (원곡 3/4 왈츠 · 엘비스판 4/4) | [wikipedia.org](https://en.wikipedia.org/wiki/Blue_Moon_of_Kentucky) |
| Bluegrass | Foggy Mountain Breakdown | Foggy Mountain Boys (작곡 Earl Scruggs) | 1949 녹음 / 1950 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Foggy_Mountain_Breakdown) |
| Bluegrass | Man of Constant Sorrow | The Stanley Brothers (1950년 판) | 1950 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Man_of_Constant_Sorrow) |
| Bluegrass | Dueling Banjos | Eric Weissberg & Steve Mandell (1972 싱글) · 원곡은 Arthur "Guitar Boogie" Smith(4현 플렉트럼 밴조) · Don Reno(5현 블루그래스 밴조) | 1954 작곡 / 1972 싱글 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Dueling_Banjos) |
| Bluegrass | Rocky Top | The Osborne Brothers | 1967 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Rocky_Top) |
| Bluegrass | Uncle Pen | Bill Monroe | — | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Uncle_Pen_(song)) |
| Nashville Sound | Gone | Ferlin Husky | 1957 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Gone_(Ferlin_Husky_song)) |
| Nashville Sound | Four Walls | Jim Reeves | 1957 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Four_Walls_(Jim_Reeves_song)) |
| Nashville Sound | Oh Lonesome Me | Don Gibson | 1957 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Oh_Lonesome_Me) |
| Nashville Sound | He'll Have to Go | Jim Reeves | 1959 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/He%27ll_Have_to_Go) |
| Nashville Sound | I Fall to Pieces | Patsy Cline | 1961 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/I_Fall_to_Pieces) |
| Nashville Sound | Crazy | Patsy Cline (작곡 Willie Nelson) | 1961 | 대표 | — | B♭ 조 (끝에서 B major) | [wikipedia.org](https://en.wikipedia.org/wiki/Crazy_(Willie_Nelson_song)) |
| Countrypolitan | Harper Valley PTA | Jeannie C. Riley | 1968 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Harper_Valley_PTA) |
| Countrypolitan | Stand by Your Man | Tammy Wynette | 1968 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Stand_by_Your_Man) |
| Countrypolitan | Wichita Lineman | Glen Campbell | 1968 | 대표 | — | F major → D major | [wikipedia.org](https://en.wikipedia.org/wiki/Wichita_Lineman) |
| Countrypolitan | Rose Garden | Lynn Anderson | 1970 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Rose_Garden_(song)) |
| Countrypolitan | Behind Closed Doors | Charlie Rich | 1973 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Behind_Closed_Doors_(Charlie_Rich_song)) |
| Countrypolitan | The Most Beautiful Girl | Charlie Rich | 1973 | 1위 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/The_Most_Beautiful_Girl) |
| Country Pop | Harper Valley PTA | Jeannie C. Riley | 1968 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Harper_Valley_PTA) |
| Country Pop | Take Me Home, Country Roads | John Denver | 1971 | 대표 | 82 (본문) | A major | [wikipedia.org](https://en.wikipedia.org/wiki/Take_Me_Home,_Country_Roads) |
| Country Pop | Behind Closed Doors | Charlie Rich | 1973 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Behind_Closed_Doors_(Charlie_Rich_song)) |
| Country Pop | Rhinestone Cowboy | Glen Campbell | 1975 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Rhinestone_Cowboy) |
| Country Pop | Here You Come Again (음반 단위) | Dolly Parton | 1977 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Here_You_Come_Again) |
| Country Pop | 9 to 5 | Dolly Parton | 1980 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/9_to_5_(Dolly_Parton_song)) |
| Country Pop | Islands in the Stream | Kenny Rogers & Dolly Parton | 1983 | 대표 | — | C major ↔ A♭ major (4/4) | [wikipedia.org](https://en.wikipedia.org/wiki/Islands_in_the_Stream_(song)) |
| Country Pop | You're Still the One | Shania Twain | 1998 | 대표 | 67 (본문) | E♭ major (common time) | [wikipedia.org](https://en.wikipedia.org/wiki/You%27re_Still_the_One) |
| Outlaw Country | Honky Tonk Heroes (음반 단위) | Waylon Jennings | 1973 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Honky_Tonk_Heroes) |
| Outlaw Country | Red Headed Stranger (음반 단위) | Willie Nelson | 1975 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Red_Headed_Stranger) |
| Outlaw Country | Wanted! The Outlaws (음반 단위) | Waylon Jennings · Willie Nelson · Jessi Colter · Tompall Glaser | 1976 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Wanted!_The_Outlaws) |
| Outlaw Country | Luckenbach, Texas (Back to the Basics of Love) | Waylon Jennings | 1977 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Luckenbach,_Texas_(Back_to_the_Basics_of_Love)) |
| Outlaw Country | Mammas Don't Let Your Babies Grow Up to Be Cowboys | Waylon Jennings & Willie Nelson | 1978 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Mammas_Don%27t_Let_Your_Babies_Grow_Up_to_Be_Cowboys) |
| Alt-country | No Depression (음반 단위) | Uncle Tupelo | 1990 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/No_Depression_(album)) |
| Alt-country | A.M. (음반 단위) | Wilco | 1995 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Box_Full_of_Letters) |
| Alt-country | Trace (음반 단위) | Son Volt | 1995 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Trace_(Son_Volt_album)) |
| Alt-country | Wagon Wheel | Old Crow Medicine Show | 2004 | 대표 | 76 (본문 «76 half notes per minute» — 2분음표 기준) | A major (Swing 2/4) | [wikipedia.org](https://en.wikipedia.org/wiki/Wagon_Wheel_(song)) |
| Americana | Revival (음반 단위) | Gillian Welch | 1996 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Revival_(Gillian_Welch_album)) |
| Americana | Car Wheels on a Gravel Road (음반 단위) | Lucinda Williams | 1998 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Car_Wheels_on_a_Gravel_Road) |
| Americana | Wagon Wheel | Old Crow Medicine Show | 2004 | 대표 | 76 (본문 «76 half notes per minute» — 2분음표 기준) | A major (Swing 2/4) | [wikipedia.org](https://en.wikipedia.org/wiki/Wagon_Wheel_(song)) |
| Americana | I Remember Everything | Zach Bryan feat. Kacey Musgraves | 2023 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/I_Remember_Everything_(Zach_Bryan_song)) |
| Bro-country | Cruise | Florida Georgia Line | 2012 | 대표 | — | B♭ major (B♭–F–Gm7–E♭) | [wikipedia.org](https://en.wikipedia.org/wiki/Cruise_(song)) |
| Bro-country | Drunk on You | Luke Bryan | 2012 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Drunk_on_You_(song)) |
| Bro-country | Boys 'Round Here | Blake Shelton | 2013 | 대표 | 84 (본문) | A major | [wikipedia.org](https://en.wikipedia.org/wiki/Boys_%27Round_Here) |
| Bro-country | Ready Set Roll | Chase Rice | 2013 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Ready_Set_Roll) |
| Folk Revival | If I Had a Hammer | Peter, Paul and Mary (1962년 판) 외 | 1949 작 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/If_I_Had_a_Hammer) |
| Folk Revival | Tom Dooley | The Kingston Trio | 1958 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Tom_Dooley_(song)) |
| Folk Revival | Michael, Row the Boat Ashore | The Highwaymen | 1960 녹음 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Michael,_Row_the_Boat_Ashore) |
| Folk Revival | Walk Right In | The Rooftop Singers | 1962 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Walk_Right_In) |
| Folk Revival | Blowin' in the Wind | Bob Dylan | 1963 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Blowin%27_in_the_Wind) |
| Indie Folk | Skinny Love | Bon Iver | 2007 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Skinny_Love) |
| Indie Folk | White Winter Hymnal | Fleet Foxes | 2008 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/White_Winter_Hymnal) |
| Indie Folk | Little Lion Man | Mumford & Sons | 2009 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Little_Lion_Man) |
| Indie Folk | Ho Hey | The Lumineers | 2012 | 대표 | — | C major | [wikipedia.org](https://en.wikipedia.org/wiki/Ho_Hey) |
| Folk Rock | Mr. Tambourine Man | The Byrds | 1965 | 대표 | — | — (딜런의 2/4 에서 4/4 로) | [wikipedia.org](https://en.wikipedia.org/wiki/Mr._Tambourine_Man) |
| Folk Rock | Turn! Turn! Turn! | The Byrds | 1965 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Turn!_Turn!_Turn!) |
| Folk Rock | The Sound of Silence | Simon & Garfunkel | 1965 (전기판) | 대표 | — | D♯ minor (D♯m·C♯·B·F♯) | [wikipedia.org](https://en.wikipedia.org/wiki/The_Sound_of_Silence) |
| Folk Rock | Eve of Destruction | Barry McGuire | 1965 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Eve_of_Destruction_(song)) |
| Folk Rock | A Horse with No Name | America | 1971 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/A_Horse_with_No_Name) |
| Gospel | Take My Hand, Precious Lord | 작곡 Thomas A. Dorsey (Mahalia Jackson 1956년 녹음) | 1938 출판 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/Take_My_Hand,_Precious_Lord) |
| Gospel | Oh Happy Day | The Edwin Hawkins Singers | 1967 녹음 / 1969 미국 발매 | 대표 | — | — (찬송가 3/4 → 4/4) | [wikipedia.org](https://en.wikipedia.org/wiki/Oh_Happy_Day) |
| Gospel | Man in the Mirror | Michael Jackson | 1988 | 대표 | — | G major → A♭ major | [wikipedia.org](https://en.wikipedia.org/wiki/Man_in_the_Mirror) |
| Zydeco / Cajun | Jole Blon (Jolie Blonde) | 여러 녹음 | 1929 이후 | 대표 | — | — (왈츠 3/4) | [wikipedia.org](https://en.wikipedia.org/wiki/Jolie_Blonde) |
| Zydeco / Cajun | My Toot-Toot | Rockin' Sidney | 1985 | 대표 | — | — | [wikipedia.org](https://en.wikipedia.org/wiki/My_Toot_Toot) |

**말로만 적힌 템포**(수치가 아니라 표에 못 넣은 것) — Pride and Joy 「moderately
fast tempo」 · Texas Flood 「slow-tempo twelve-bar blues」 · Saturday Night Fish Fry
「brisk tempo」 · Let the Good Times Roll 「a mid-tempo twelve-bar blues」 ·
Cruise 「mid-tempo」 · Rocky Top 「fast-paced」·「fast and upbeat tempo」 ·
Soldier's Joy 「upbeat tempo」 · No Depression 「breakneck speed」.
**전부 수치가 없어 BPM 칸은 `—` 입니다 — 추정하지 않았습니다.**

---

### 1. 프리셋별 곡 수 (21종 전부)

| 프리셋 | 곡 수 | | 프리셋 | 곡 수 |
|---|---:|---|---|---:|
| Chicago Blues | 5 | | Countrypolitan | 6 |
| Texas Blues | 4 | | Country Pop | 8 |
| Electric Blues | 5 | | Outlaw Country | 5 |
| Country Blues | 5 | | Alt-country | 4 |
| Blues Rock | 5 | | Americana | 4 |
| Jump Blues | 7 | | Bro-country | 4 |
| Honky-tonk | 4 | | Folk Revival | 5 |
| Old-time / Hillbilly | 6 | | Indie Folk | 4 |
| Bluegrass | 6 | | Folk Rock | 5 |
| Nashville Sound | 6 | | Gospel | 3 |
| | | | Zydeco / Cajun | 2 |

**0곡 프리셋은 없습니다.** 가장 얇은 것은 **Zydeco / Cajun 2곡**(자이데코 1 ·
케이준 1)이고 그다음이 **Gospel 3곡**입니다. 조사 파일이 적어 둔 대로,
Zydeco / Cajun 은 **출처가 서로 다른 두 장르라고 못 박는데 프리셋이 하나**라
2곡이 각각 한쪽씩을 대는 모양입니다 — **한 프리셋의 근거로는 가장 얇은 자리**입니다.

- 표 전체 **103줄**, 중복을 뺀 **고유 항목 98개**.
- 계열별로는 블루스 6종 31줄 · 컨트리 10종 53줄 · 포크 3종 14줄 · 가스펠 3줄 ·
  지역 2줄입니다.
- `g3-folk-gospel.md` 는 머리에 「대표곡 후보 18곡」이라 적었는데 그 파일의
  후보 표를 다 세면 **19줄**입니다(⚠ 표시한 White Winter Hymnal · Man in the Mirror
  포함). 저는 **표에 있는 19줄을 다 옮겼고** 둘 다 §3 에 밝혔습니다.

### 2. BPM 이 채워진 칸

**103줄 중 9칸 — 8.7%.**

| 프리셋 | 곡 | BPM | 출처의 말 |
|---|---|---|---|
| Chicago Blues | Hoochie Coochie Man | 72 | 본문 (12/8) |
| Electric Blues | 3 O'Clock Blues | 65 | 본문 「slow (65 beats per minute)」 |
| Electric Blues | Boom Boom | 168 | 본문 |
| Country Blues | Cross Road Blues | ≈106 / ≈96 | 본문 (두 테이크) |
| Country Pop | Take Me Home, Country Roads | 82 | 본문 |
| Country Pop | You're Still the One | 67 | 본문 「a slow tempo of 67 beats per minute」 |
| Alt-country | Wagon Wheel | 76 | 본문 「76 half notes per minute」(2분음표 기준) |
| Americana | Wagon Wheel | 76 | 같은 문서 (두 프리셋에 걸침) |
| Bro-country | Boys 'Round Here | 84 | 본문 |

- **악보(♩=) 표기는 한 칸도 없습니다.** 재즈 표에서 여섯 칸을 채웠던 악보 템포가
  이 계열에는 **하나도 나오지 않았습니다.** 조사 파일이 악보에서 가져온 것은
  **박자표**(2/4 · 12/8 · 3/4)뿐이라 조성 칸 괄호에 넣었습니다.
- **장르 문서에서 나온 BPM 은 0칸입니다.** 세 조사 파일이 각각
  「컨트리 10종 장르 문서에 beats per minute 수치가 한 곳도 없다」(g2 §0-1) ·
  「21곡·13문서 어디에도 BPM 이 없었다」(g3) · 「출처에 장르 BPM 범위가 없다」(g1 §7-17)
  로 **부재를 명시**했습니다. 조사가 부족한 것이 아니라 **출처가 말하지 않는 것**입니다.
- 채워진 9칸이 프리셋 값과 어긋나는 자리: Country Pop 67·82 대 프리셋 110 ·
  Bro-country 84 대 115 · Chicago Blues 72 대 110 · Electric Blues 65·168 대 115.

### 3. 곡 문서의 장르란이 프리셋 장르와 다른 줄 — 38건

버리지 않고 표에 두되 **근거의 무게를 낮추라는 표시**입니다. 인용은 조사 파일이
적은 원문 라벨 그대로입니다.

| 프리셋 | 곡 | 곡 문서의 장르란 | 비고 |
|---|---|---|---|
| Chicago Blues | Mannish Boy | 「Blues standard」 | |
| Chicago Blues | Smokestack Lightning | 「Blues」 | |
| Texas Blues | Rock Awhile | 「rock and roll · electric blues · jump blues」 | |
| Texas Blues | Hide Away | 「Blues guitar instrumental」 | |
| Texas Blues | Pride and Joy | 「Electric blues · blues rock」 | 본문이 「a classic **Texas shuffle**」이라 부릅니다 |
| Country Blues | Statesboro Blues | 「Piedmont blues」 | 조사자가 **«대표로는 권하지 않는다»** 고 적었습니다(표에는 남김) |
| Country Blues | Pony Blues | 「Delta blues」 | 델타는 컨트리 블루스의 **하위**라고 출처가 적습니다 |
| Country Blues | Cross Road Blues | 「Blues, Delta blues」 | 위와 같음 |
| Country Blues | Sweet Home Chicago | 「Blues standard」 | |
| Country Blues | Bottle Up and Go | 「hokum blues」/「Delta bluesman」 | 연 주소는 `Step_It_Up_and_Go`, **도달 제목이 「Bottle Up and Go」** |
| Blues Rock | Crossroads (Cream 판) | 「Blues, Delta blues」 | 문서가 **Robert Johnson 원곡 문서**이고, 크림 판 서술이 그 안에 있습니다 |
| Blues Rock | Statesboro Blues (Allman 판) | 「Piedmont blues」 | |
| Honky-tonk | There Stands the Glass | 「Country」만 | 조사자가 «버리지 않되 표시» 로 남긴 줄 |
| Old-time / Hillbilly | The Little Old Log Cabin in the Lane | 「Popular song, minstrel」 | |
| Old-time / Hillbilly | Wildwood Flower | **인포박스에 장르 칸 없음**(「cataloged as a folk song」) | |
| Old-time / Hillbilly | Single Girl, Married Girl | 「Folk song」 | |
| Old-time / Hillbilly | Cripple Creek | 「Folk」·「bluegrass」 | 본문은 「an Appalachian-style **old time tune**」 |
| Old-time / Hillbilly | Soldier's Joy | 「reel or country dance」 | 본문은 「top ten most-played **old time** fiddle tunes」 |
| Old-time / Hillbilly | Old Joe Clark | 「US folk song, a mountain ballad」 | 본문은 「**old-time** fiddle sessions」 |
| Bluegrass | Man of Constant Sorrow | 인포박스 「Folk」 | Stanley Brothers 1950년 판이 「Folk」와 **「bluegrass」**로 분류 |
| Nashville Sound | Gone | 「Country」 | 본문 「**first example of the Nashville Sound** production approach」 |
| Nashville Sound | Four Walls | 「Country」 | **장르 문서**가 「the first 'Nashville sound' record」로 지목 |
| Nashville Sound | Oh Lonesome Me | 「Country」 | **장르 문서**가 지목(Chet Atkins 프로듀스) |
| Nashville Sound | Crazy | 「Country」·「Traditional pop」 | 곡 문서도 장르 문서도 내슈빌 사운드라 하지 않습니다 |
| Countrypolitan | Behind Closed Doors | 「Country pop」·「soft rock」 | |
| Countrypolitan | Harper Valley PTA | 「Country, country pop」 | |
| Countrypolitan | Stand by Your Man | 「Country」만 | |
| Countrypolitan | Wichita Lineman | 「Country, pop, country rock」 | |
| Country Pop | Take Me Home, Country Roads | 「Country」·「folk」 | **장르 문서**가 크로스오버 히트로 지목 |
| Country Pop | Rhinestone Cowboy | 「Country」·「symphonic pop」 | |
| Country Pop | Here You Come Again | 「Pop, country」 | **곡 문서가 아니라 동명 앨범 문서**입니다(그래서 «음반 단위») |
| Americana | Revival | 「Country, folk, bluegrass」 | 본문은 「arrived on the **alt-country** scene」 |
| Americana | I Remember Everything | 「Country」만 | |
| Bro-country | Boys 'Round Here | 「Country music」 | **장르 문서**가 대표곡으로 지목 |
| Bro-country | Drunk on You | 「Country」 | **장르 문서**가 지목 |
| Bro-country | Ready Set Roll | 「Country rock」 | **장르 문서**가 지목 |
| Indie Folk | White Winter Hymnal | 「Folk」만 | 조사 파일이 ⚠ 로 표시한 줄 |
| Gospel | Man in the Mirror | 「Pop」과 「gospel」 — **팝이 먼저** | 조사 파일이 ⚠ 로 「가스펠 합창이 들어간 팝」이라 적었습니다 |

**덧붙여 적어 둘 것 넷**

1. **Bro-country 는 넷 중 «Cruise» 하나만 근거가 섭니다.** 그나마 Cruise 도
   **인포박스는 「Country music」(원곡)·「country rap」·「country pop」(리믹스)**이고,
   «bro-country» 는 **본문**의 「considered the foremost example of the genre of
   country music termed 'bro-country'」입니다. 나머지 셋은 **장르 문서가 이름을 든 것**입니다.
2. **Countrypolitan 은 여섯 중 둘**(Rose Garden · The Most Beautiful Girl)만
   인포박스에 «Countrypolitan» 이 있습니다. The Most Beautiful Girl 은 인포박스가
   **countrypolitan 과 country pop 을 동시에** 답니다.
3. **Folk Revival 다섯 줄은 장르란이 전부 「Folk」 계열**이고 «folk revival» 이라
   적은 문서가 **하나도 없습니다.** 리바이벌과의 연결이 **본문에 직접 적힌 것은
   둘**입니다 — Tom Dooley 「starting the 'folk music boom'」, Michael, Row the Boat
   Ashore 「introduced it into the American folk music revival」. 나머지 셋은 장르
   라벨만 「Folk」입니다.
4. **Electric Blues 의 두 줄(3 O'Clock Blues · Boom Boom)은 조사 파일이 장르 라벨을
   적지 않았습니다.** 어긋난다고도 맞는다고도 쓸 수 없어 위 표에서 뺐습니다 —
   **라벨 미확인**으로 남깁니다.

### 4. 버린 후보와 이유

조사 파일이 버린 것을 그대로 옮깁니다. **표에 넣지 않았습니다.**

#### 404 · 단독 문서 없음 (7건)

| 후보 | 이유 |
|---|---|
| I Can't Be Satisfied (Muddy Waters 1948) | `I_Can%27t_Be_Satisfied` · `I_Can't_Be_Satisfied` · `..._(song)` · `I_Can%E2%80%99t_Be_Satisfied` **네 주소 모두 404**. Electric blues 문서가 이름을 대지만 실재를 확인 못 함(Chicago·Electric 양쪽에서 버림) |
| Deacon's Hop (Big Jay McNeely) | `https://en.wikipedia.org/wiki/Deacon%27s_Hop` **404**. Jump blues 문서가 이름을 댐 |
| Les haricots sont pas salés / Zydeco Sont Pas Salés (Clifton Chenier) | **HTTP 404 — 단독 문서 없음.** Zydeco 문서 본문에 곡명이 있으나 Clifton Chenier 문서에는 없음 |
| Sally Goodin / Sallie Gooden | **두 철자 모두 404** |
| Soldier's Joy(모호성 문서) | 한 줄뿐이라 버리고 `Soldier%27s_Joy_(fiddle_tune)` 로 대체 — **대체본이 표에 있습니다** |
| Uncle Pen(슬래시 없는 제목) | **인물 문서**(Pendleton Vandiver)였음 → `Uncle_Pen_(song)` 로 대체 — **대체본이 표에 있습니다** |
| Behind Closed Doors (song) | **모호성 문서** → `..._(Charlie_Rich_song)` 로 대체 — **대체본이 표에 있습니다** |
| Box Full of Letters(곡으로) | **A.M. 앨범 문서로 리다이렉트**되어 곡 단독 문서가 아님 → **앨범으로 바꿔 채택**(표에 있음) |

#### 장르 라벨 불일치 (11건)

| 후보 | 이유 |
|---|---|
| Call It Stormy Monday (But Tuesday Is Just as Bad) — T-Bone Walker 1947 | 실재·수치(66 BPM · G조 · 12/8 · 12마디) 다 확인됐으나 라벨이 「slow twelve-bar blues performed in the **West Coast blues**-style」. **Texas Blues 라벨이 아님**(연주자만 텍사스 출신) |
| Born Under a Bad Sign — Albert King 1967 | 라벨이 「**Soul blues**」이고 「does not follow the typical twelve-bar blues I-IV-V progression」 — 블루스 록 대표로 부적합 |
| Shake, Rattle and Roll — Big Joe Turner 1954 | 라벨이 「rock and roll」·「rhythm and blues」뿐, **jump blues 라벨 없음** + 편성·리듬 서술 전무 |
| The Hucklebuck — Paul Williams 1949 | 실재·편성·형식 확인됐으나 라벨이 「**jazz and R&B dance tune**」 — jump blues 가 아님 |
| Keep on the Sunny Side | **인포박스에 장르 칸이 없고** old-time·hillbilly 라는 말이 없음(「popular American song」·「Christian hymn」) |
| Yankee Hotel Foxtrot | 인포박스가 「**Art rock**」·「**indie rock**」이고 **alt-country 라는 말이 없음** |
| Ho Hey (Americana 후보로서) | 인포박스가 「Folk rock」·「indie folk」 — **Americana 라는 말이 없음.** ※ **Indie Folk 쪽에서는 라벨이 맞아 표에 있습니다** |
| Good Hearted Woman | 곡이 아니라 **1972년 앨범 문서**이고 인포박스가 「Country」 하나뿐, **outlaw country 라 적지 않음** |
| Cardigan — Taylor Swift 2020 | 장르가 「soft rock, folk and indie rock」으로 **«indie folk» 이 아님.** ⚠ 그런데 **g3 조사 전체에서 BPM 수치가 나온 유일한 곡**(130 BPM · E♭ major)이라 프리셋 105 와 25 차이 — 근거로 쓰지 않았습니다 |
| Jambalaya (On the Bayou) — Hank Williams 1952 | 장르가 「Country & western」·「honky-tonk」이고 문서가 **「is not a true cajun song」**이라 직접 적음 |
| That's My Kind of Night · This Is How We Roll · Round Here · Here's to the Good Times | **어느 문서도 bro-country 라 하지 않습니다.** 조사자가 「열린 사실만 남기고 대표곡으로는 쓰지 않는 쪽을 권합니다」라고 적어 뺐습니다(4건) |

#### 곡 문서에 서술이 전무 (2건)

| 후보 | 이유 |
|---|---|
| See That My Grave Is Kept Clean — Blind Lemon Jefferson 1927·1928 | 실재는 확인했으나 문서가 **편성·리듬·템포를 한 줄도 적지 않아** 프리셋 교정 근거로 쓸 수 없음(라벨도 「Blues」뿐) |
| Terraplane Blues — Robert Johnson 1936/1937 | 같은 이유(기법·리듬·템포 서술 없음) |

#### 곡 단독 문서를 열지 않아 규칙대로 제외 (1건)

| 후보 | 이유 |
|---|---|
| Buckwheat Zydeco 의 곡들(It's Hard To Get · Hey Good Lookin' 등) | 아티스트 문서에 제목만 있고 **곡 단독 문서를 열어 확인하지 않음** |

#### 판단을 남겨 두는 한 줄 — **Slow Ride**

`g1-blues.md` 는 Slow Ride 를 **후보 표에도 올리고 «버린 후보» 에도** 적었습니다.
버린 이유는 **장르 라벨이 아니라**(라벨에 blues rock 이 **있습니다**)
「리듬·템포·편성 서술이 전무해 **패턴 근거로는 못 쓴다**」입니다.
**곡의 실재와 라벨이 성립하므로 표에는 남겼고, 여기에 표시만 합니다** —
프리셋의 `swing 0` 근거로 쓰면 안 됩니다(부기 록 문서가 Slow Ride 를
**셔플**의 예로 듭니다).

### 5. URL 이 비어 있는 줄

**없습니다 — 103줄 전부 조사 파일에 URL 이 적혀 있었습니다.**
`「문서명」 (URL 미기재)` 로 둔 줄은 하나도 없습니다.

다만 **주소와 도달 제목이 다른 줄이 둘** 있어 주소를 그대로 두고 여기에 적습니다.

| 프리셋 | 곡 | 적은 주소 | 도달 |
|---|---|---|---|
| Country Blues | Bottle Up and Go | `https://en.wikipedia.org/wiki/Step_It_Up_and_Go` | 도달 제목 **「Bottle Up and Go」** |
| Alt-country | A.M. (음반 단위) | `https://en.wikipedia.org/wiki/Box_Full_of_Letters` | **A.M. 앨범 문서로 리다이렉트** |

그리고 **한 문서를 두 프리셋이 함께 쓰는 줄이 다섯**입니다 — §6.

### 6. 한 곡이 여러 프리셋에 걸친 것 — 5건

| 곡 | 프리셋 | 걸치는 방식 |
|---|---|---|
| Cross Road Blues | **Country Blues** · **Blues Rock** | 같은 문서 한 장. Country Blues 는 Robert Johnson 1936 원곡, Blues Rock 은 그 안에 서술된 **Cream 1968 판**(「sets it to a **straight eighth-note or rock rhythm**」) |
| Statesboro Blues | **Country Blues** · **Blues Rock** | 같은 문서. Country Blues 는 Blind Willie McTell 1928 원곡, Blues Rock 은 **Allman Brothers 1971 판**(Duane Allman 의 슬라이드) |
| Wagon Wheel | **Alt-country** · **Americana** | 인포박스가 「Alt-country, **Americana**, folk, bluegrass」로 **둘을 동시에** 답니다. 조사 파일도 둘 다에 올렸습니다. **BPM 이 있는 9칸 중 2칸이 이 곡**입니다 |
| Behind Closed Doors | **Countrypolitan** · **Country Pop** | 인포박스는 「Country pop」·「soft rock」 — **Countrypolitan 쪽에서는 라벨이 어긋납니다**(§3) |
| Harper Valley PTA | **Countrypolitan** · **Country Pop** | 인포박스는 「Country, country pop」 — 위와 같습니다 |

> 이 다섯은 조사 파일이 «두 프리셋을 가르는 근거» 로 삼기 어려운 자리를 그대로
> 보여 줍니다. 특히 **Countrypolitan 과 Country Pop 은 겹치는 두 곡을 빼면 각각
> 넷·여섯이 남고**, 조사 파일은 「세 장르(Nashville · Countrypolitan · Country Pop)
> 어디에도 BPM·스윙·드럼 패턴 서술이 없다」고 적었습니다.


### 7. 표를 따로 검증했다 — 103줄의 주소를 전부 다시 열었다

표를 만든 사람과 **다른 눈**으로 103줄의 출처 URL 을 전부 다시 열었습니다.
**지어낸 곡 0건 · 404 0건 · 모호성 문서 0건 · 인물 문서를 곡으로 적은 줄 0건.**
곡 이름을 지어내는 것이 이 저장소에서 가장 나쁜 실패라, 이 확인은 생략하지 않습니다.

**고친 다섯 줄** — 곡이 없어서가 아니라 **어느 판·어느 칸을 가리키느냐**가 틀린 것들입니다.

| 곡 | 틀렸던 것 | 문서의 값 |
|---|---|---|
| Foggy Mountain Breakdown | 아티스트 칸에 **작곡자**를 적었습니다 | 인포박스 `Single by: Foggy Mountain Boys` · `Songwriter: Earl Scruggs` |
| Dueling Banjos | 성만 「Smith」였고, **1972년 싱글의 연주자가 빠져** 있었습니다 | 인포박스 `Single by: Eric Weissberg` (1972-12) · 작곡 `Arthur "Guitar Boogie" Smith, Don Reno` |
| Wanted! The Outlaws | 아티스트 칸이 **비어** 있었습니다 | 인포박스가 넷을 명시 — `Waylon Jennings, Willie Nelson, Jessi Colter and Tompall Glaser` |
| Jolie Blonde | 주소가 **리다이렉트**라 도달 제목이 다릅니다 | 도달 제목 **「Jole Blon」**(표가 괄호로 병기해 둔 쪽이 실제 제목) |
| My Toot Toot | 같은 이유 | 도달 제목 **「My Toot-Toot」**(하이픈) |

**틀리지 않았지만 밝혀 둘 것** — 고치지 않았습니다.

- **The Little Old Log Cabin in the Lane 의 「1923」** — 검증자는 「문서 어디에도 1923 이
  없다」고 보고했으나 **원문을 직접 여니 분류에 「1923 singles」가 있습니다.** 본문과
  인포박스에는 없는 것이 맞습니다(인포박스는 `Published 1871` · `Songwriter Will S. Hays`
  뿐). **부재 주장이 과장이었던 것**이라, 근거가 있는 해를 지우지 않았습니다.
- **Flying Home 의 「Lionel Hampton and His Orchestra / 1942」** — 인포박스는
  `Song by Benny Goodman Sextet`(1939-11-06)이라 **인포박스와는 다릅니다.** 다만 본문에
  「In 1942, Lionel Hampton and His Orchestra recorded the song with an epic-length
  tenor saxophone solo by nineteen-year-old Illinois Jacquet」가 **그대로** 있고,
  **점프 블루스의 근거로는 이쪽이 맞습니다** — 재킷의 테너 솔로가 이 장르의 표지입니다.
- **Uncle Pen** — 인포박스가 통째로 **Ricky Skaggs 의 1984년 싱글**입니다. 표의
  Bill Monroe 는 첫 문장(「written and originally recorded by Bill Monroe」)에서만
  확인되고 **문서가 Monroe 녹음의 해를 적지 않아**, 연도를 `—` 로 둔 것이 맞습니다.
- **연도 다섯 줄은 «녹음년 대 발매년»** 입니다 — Cross Road Blues(1936 녹음 / 1937 발매) ·
  Sweet Home Chicago(1936 / 1937) · Statesboro Blues(1928 녹음 / 1929 발매) ·
  Man of Constant Sorrow(표 1950 은 본문의 스탠리 형제 녹음, 인포박스는 1913) ·
  Skinny Love(표 2007 은 본문, 인포박스는 2008 영국 싱글). **표가 틀린 것이 아니라
  녹음년을 고른 것**이라 두었습니다.
- **Crossroads (Cream 판)** 은 「Crossroads」 문서가 아니라 **Robert Johnson 의
  「Cross Road Blues」 문서 본문**에 있습니다. 표의 1968 은 본문과 맞습니다.
- **Boys 'Round Here 의 featuring 누락**(인포박스는 `Blake Shelton featuring Pistol
  Annies and friends`)은 **제가 원문으로 확인하지 않았습니다** — 검증자 보고로만
  압니다. 그래서 고치지 않고 여기 적습니다.

### 이 곡들로 고친 것

출처가 **정면으로 다른 말을 하는 칸만** 고쳤습니다. 조사는 세 갈래로 나눠 돌렸고,
**구조를 바꾸는 인용은 제가 원문을 다시 열어 확인했습니다.**

| 프리셋 | 바꾼 것 | 근거 |
|---|---|---|
| **Honky-tonk** | 16분 스네어 롤 → **백비트** · 2번 기타 `pedal`→**`fiddle`** | 저장소는 이 자리를 «트레인 비트» 로 적어 두었는데 **그런 서술이 어디에도 없습니다** — `Train beat` 은 단독 문서도 없고, 출처가 말하는 것은 「The honky-tonk sound has a full rhythm section playing a **two-beat rhythm with a crisp backbeat**」까지입니다. 편성도 「**Steel guitar and fiddle are the dominant instruments**」인데 피들이 빠져 있었습니다(기타 두 칸이 스틸·페달스틸) |
| **Nashville Sound** | 1번 기타 `pedal`→`clean` · 2번 건반 `piano`→**`choir`** | 출처는 이 사운드를 **스틸을 «잘라낸»** 것으로 적습니다 — 「Now we've **cut out the fiddle and steel guitar** and **added choruses** to country music」·「replacing … (fiddles, steel guitar, nasal lead vocals) with 'smooth' elements (**string sections, background vocals**, crooning lead vocals)」. 그런데 프리셋은 기타 **두 칸이 모두 스틸**이었습니다. 한 칸만 남기고, 대체 목록에 있는 **합창**을 넣었습니다 |
| **Bro-country** | 2번 기타 `pedal`→**`banjo`** | 장르 문서 악기 목록에 **페달 스틸이 없고**(부재 확인) 대신 **밴조**가 있습니다 — 「Vocals, guitar, drums, drum machines, bass guitar, keyboard, electric guitar, **banjo**」. 저장소 레퍼런스 표도 페달 스틸을 적지 않아 **내부 모순**이었습니다 |
| **Zydeco / Cajun** | 퍼커션 `tamb`→**`guiro`** | 출처가 주악기를 못 박습니다 — 「The main instruments are **accordion and rubboard (washboard) or vest frottoir**」. 탬버린은 짤랑이는 소리라 방향이 다릅니다. ⚠ **도구에 워시보드·프로토와 엔진이 없어**(퍼커션 19종 확인) 있는 것 중 홈을 긁는 `guiro` 로 대체했습니다 — 자이데코가 귀로를 쓴다는 뜻이 **아닙니다** |
| **Electric Blues** | swing 30 → **50** | **Chicago·Texas·Electric blues 세 문서 모두 리듬을 말하지 않습니다**(셔플·스윙·셋잇단·백비트 전부 부재). Texas 문서는 자신을 나머지 둘과 **구분하는 문장조차 없습니다.** 50/50/30 의 «30» 은 출처에 없는 차이라, 새 숫자를 지어내는 대신 **형제와 같게** 맞췄습니다 |
| **Blues Rock** | 베이스 엔진 `reese`→`sub` · 드라이브 62→32 | 출처가 드는 것은 「electric guitar, **electric bass guitar**, drums…」입니다. `reese` 는 디튠 톱니 **신스**라 계통이 다르고, 형제 셋은 모두 `sub` 입니다 |
| **현 베이스 7종** | `gate` **80 → 340** | Old-time · Nashville Sound · Folk Revival · Indie Folk · Folk Rock · Country Blues · Americana. `gate` 는 밀리초가 아니라 **16분음 대비 백분율**이라(`spb()*0.25*gate/100`, `spb()` 는 박당 초) 80 은 4분음의 **20%** — 걷는 베이스가 아니라 끊어 치는 소리입니다. 340 은 85% 이고 Traditional Pop 이 이미 그렇게 고쳐져 있었습니다. **Honky-tonk 64 · Bluegrass 56 은 그대로** 두었습니다 — 붐칙과 만돌린 촙은 실제로 끊어 치는 어법입니다. **Jump Blues 도 80 으로 두었습니다** — 현 베이스이긴 하나 `uprightslap`(슬랩 업라이트)이라 끊어 치는 것이 주법 자체입니다. 근거가 있어 둔 것이 아니라 **바꿀 근거가 없어 둔 것**입니다 |
| **컴핑 표** | `country_quarter`(4타) 신설 → `Country` 연결 | §5-5 가 2026-09-18 에 컨트리 프리셋을 4타로 고치면서 `COMP` 를 함께 옮기지 않아 열 종이 8분과 어긋나 있었습니다. **블루스는 8분이 맞아** 그대로 두었습니다(「eight to the bar」) |

### 고치지 않은 것 — 출처가 «없거나», 근거가 얇거나, 도구 밖인 것

| 항목 | 상태 |
|---|---|
| **BPM 21종 전부** | **장르 문서에 수치가 한 곳도 없습니다.** 표 103줄 중 BPM 이 찬 것은 9칸(8.7%)이고 전부 **곡 문서 본문** 값입니다 — 악보 템포 표기는 이 계열에 **하나도 없었습니다**(재즈와 다른 점) |
| **Country Blues 의 편성** | 출처는 「The **mainly solo vocal with acoustic fingerstyle guitar** accompaniment…」이고 drum·bass·band 가 **전부 부재**인데, 프리셋에는 킥·스네어·햇·업라이트가 있습니다. **가장 큰 미해결 어긋남**입니다 — 다만 「mainly」이고, 16스텝 그루브 도구에서 이 프리셋을 «거의 빈» 상태로 만드는 것이 옳은지는 따로 판단할 일이라 값을 두었습니다 |
| **Gospel 의 피아노 부재** | 출처는 「The **primary instruments are the B3 organ and the piano**」라 피아노를 **B3 와 나란히** 듭니다. 프리셋 건반 둘은 레슬리·합창이고 **둘 다 출처가 있어**, 어느 것을 밀어낼지 근거가 없습니다 |
| **Gospel 의 `chord:'nine'`** | 출처는 「Most harmony in Gospel music makes use of **chord extensions: usually up to an 11th**」입니다. 9화음은 **모자라지만** 유효한 화음 값 목록을 확인하지 않아 두었습니다 |
| **Zydeco 와 Cajun 이 한 프리셋** | 출처가 「**Although they are two separate genres**…」라 못 박고(Cajun music 문서) 이 문서 §4 표도 이미 **두 줄**로 적습니다. 다만 프리셋을 쪼개면 전체 357종이 바뀌므로 기록만 남깁니다. 케이준의 **왈츠·투스텝**(「the **waltz and two-step** are the most common dances」)도 4/4 격자로는 표현되지 않습니다 |
| **`scale:'Minor Pentatonic'` 8칸** | 조사자는 「확인된 곡 조성이 전부 장조」라 했지만 **제가 곡 문서를 직접 보지 않았습니다.** 저장소가 「초기값이라 고른 값이 아니다」라 적은 것만으로 여덟 칸을 바꾸는 것은 근거가 얇습니다 |
| **포크 3종의 건반 리듬** | §5-8 이 `folk_strum` 의 건반 행을 「기타 행에서 근음만 남긴 값」이라 적어 **열어 둔** 자리입니다. 이번 조사에서도 **세 포크 장르 문서 모두 건반을 말하지 않음**이 확인돼 채울 근거가 없습니다 |
| **Bluegrass 의 드럼** | 조사자는 「문서가 드럼이 없다고 적는다」고 했으나 원문은 「**exclusively on acoustic instruments**」이고 드럼은 «전통에서의 이탈» 목록에 있습니다. 드럼 킷도 어쿠스틱이라 **배제되지 않습니다** |
| **`Old-time / Hillbilly` 이름** | 조사자는 「힐빌리는 컨트리 전체의 옛 이름」이라 했으나, 문서는 그것을 「**Appalachian and Southern fiddle-based and religious music**」에 붙인 이전 명칭으로 적고 「Some called it **hillbilly, or old-time music**」이라고도 합니다 — **이름은 방어됩니다** |

### 조사 쪽 오류 — 제가 원문으로 잡은 것 11건

구조를 바꾸는 인용은 전부 다시 열어 대조했습니다. **결론이 무너진 것은 둘**이고
나머지 아홉은 **결론은 살고 인용이 틀린** 종류였습니다.

**행동을 막은 둘** — 「Folk rock 문서에 건반이 없다」(실제로는 「A few bands are also
known to **rely on keyboards**…」가 있습니다) · 「Country blues 에 슬라이드가 빠졌다」
(그 문서에 slide·bottleneck 이 **없습니다**). 둘 다 그대로 믿었으면 근거 없이 고쳤을 자리입니다.

**출처를 잘못 지목한 넷** — 「two separate genres」는 Zydeco 가 아니라 **Cajun music**
문서 · 「오르간은 later」는 Chicago 가 아니라 **Electric blues** 문서 · 「Electric blues 가
텍사스를 지역 갈래로 든다」(실제는 West Coast·Detroit·**Chicago**) · Alt-country 의
하모니카 근거(그 문서는 **악기를 하나도 이름 대지 않습니다**).

**과장하거나 뒤집힌 다섯** — Nashville sound 의 핵심 인용이 **그런 문장으로 존재하지
않음**(뜻은 오히려 더 강하고, 조사자가 덧붙인 «piano» 는 대체 목록에 없음) ·
**Countrypolitan 이 리다이렉트라는 것 미확인** · Bluegrass 「드럼 없음」 과장 ·
힐빌리 이름 · **Old-time 문서에 하모니카가 있음**.

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

> **2026-09-19 — 이 표에 있던 «Blues Rock · Electric Blues» 한 줄을 뺐습니다.**
> 둘을 «오르간 · 크런치» 로 묶어 구분 없이 적어 두었는데, **바로 아래 절이 같은 두
> 프리셋을 아티스트·BPM·swing 까지 붙여 갈라** 놓고 있었습니다. 한 문서가 같은
> 자리에 대해 «구분 못 함» 과 «이렇게 구분됨» 을 동시에 말하고 있었습니다.
> 더 자세하고 근거가 붙은 아래 절을 남깁니다.

### Blues — Electric Blues 와 Blues Rock 이 갈리는 자리

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
