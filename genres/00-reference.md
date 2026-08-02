# 레퍼런스 — 세부 장르별 대표 아티스트 · 대표 앨범

## 왜 만드는가

`TONE_KIT`(src/data/preset-index.js)이 **하위분기 단위**로 악기를 배정합니다.
그래서 한 하위분기에 묶인 프리셋이 전부 같은 편성을 받습니다.

```
Grunge      bpm 110 · keys=pad♪ gtr=crunch♪ bass=finger drive=52
Britpop     bpm 125 · keys=pad♪ gtr=crunch♪ bass=finger drive=52
Dream Pop   bpm 110 · keys=pad♪ gtr=crunch♪ bass=finger drive=52
Shoegaze    bpm 120 · keys=pad♪ gtr=crunch♪ bass=finger drive=52
```

**BPM 말고는 전부 같습니다.** Grunge 와 Dream Pop 이 같은 소리를 냅니다.
"실제 대표 음악과 너무 차이난다" 는 지적의 직접적 원인입니다.

이 문서는 그 차이를 메우는 **판단 근거**입니다. 프리셋마다 무엇을 목표로
삼는지 적어 두면, 편성을 고칠 때 임의 판단이 아니라 기준에 따르게 됩니다.

---

## ⚠ 두 가지 주의

### 1. 이 목록을 AI 프롬프트에 그대로 넣지 마십시오

Suno 같은 생성 서비스는 프롬프트에 **특정 아티스트 이름을 넣는 것을
약관으로 제한**하며, 저작권 분쟁의 핵심 쟁점이기도 합니다.
[consulting/01-ISP.md](../consulting/01-ISP.md) §7 R1·R2 참조.

레퍼런스는 **속성을 뽑아내는 재료**로만 씁니다.

```
Grunge 레퍼런스 (이 문서 · 저장소 안에만)
   ↓ 사람이 속성을 뽑음
"fuzzed guitar, loose live drums, quiet-loud dynamics,
 no keyboards, early-90s analog production"
   ↓ 이것만 프롬프트로
```

### 2. 앨범명은 미검증입니다

작성자(모델)의 기억에 의존한 값입니다. **아티스트는 대체로 확실하지만
앨범은 틀릴 수 있습니다.** 발매연도는 오기 위험이 커서 아예 넣지 않았습니다.
불확실한 항목은 `(확인 필요)` 로 표시했습니다.

**이 문서는 방향을 잡는 용도이지 인용 출처가 아닙니다.**

---

## A. Rock — Alternative

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| Grunge | Nirvana · Soundgarden | Nevermind | 퍼즈 기타 · 조용함↔폭발 · **건반 없음** · 드럼 룸 큼 |
| Alternative Rock | R.E.M. · Radiohead | The Bends | 크런치 기타 · 아르페지오 · 건반 옅게 |
| Britpop | Oasis · Blur | (What's the Story) Morning Glory? | 밝은 크런치 · **건반 있음** · 두꺼운 코러스 |
| Shoegaze | My Bloody Valentine | Loveless | 기타가 **패드처럼** · 드럼 묻힘 · 리버브 벽 |
| Dream Pop | Cocteau Twins · Mazzy Star | Heaven or Las Vegas | 클린 기타 + 코러스 · 부드러운 드럼 · 패드 |
| Noise Rock | Sonic Youth | Daydream Nation | 불협 튜닝 · **드라이한 드럼** · 건반 없음 |
| Indie Rock | Pavement · The Strokes | Slanted and Enchanted | 얇은 기타 · 타이트 드럼 · 건반 없음 |
| Lo-fi Indie | Guided by Voices | Bee Thousand | 대역 좁음 · 노이즈 · 저역 얇음 |
| Slacker Rock | Mac DeMarco | Salad Days | 코러스 클린 기타 · 느슨한 타이밍 · 웜한 톤 |

## A. Rock — Metal

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| Heavy Metal | Judas Priest | British Steel | 크런치~하이게인 · 갤럽 · 건반 없음 |
| NWOBHM | Iron Maiden | The Number of the Beast | 트윈 리드 · 달리는 베이스 · 픽 베이스 |
| Thrash Metal | Metallica · Slayer | Master of Puppets | 팜뮤트 · 더블킥 · **베이스 픽 · 드라이** |
| Death Metal | Death · Cannibal Corpse | Symbolic | 블래스트 · 극단 하이게인 · 튜닝 낮음 |
| Black Metal | Mayhem · Darkthrone | (확인 필요) | 얇고 거친 기타 · 트레몰로 · 저역 없음 |
| Doom | Black Sabbath | Master of Reality | 느림 · 두꺼운 퍼즈 · 긴 감쇠 |
| Sludge | Eyehategod | (확인 필요) | 느림 + 거침 · 드라이 · 저역 두꺼움 |
| Stoner Rock | Kyuss | Blues for the Red Sun | 퍼즈 · 리버브 · 그루브 |
| Stoner | Sleep | Dopesmoker | Stoner Rock 보다 더 느리고 반복적 |
| Power Metal | Helloween | Keeper of the Seven Keys | 빠름 · **건반 있음(신스)** · 밝은 톤 |
| Nu Metal | Korn · Deftones | Follow the Leader | 하프타임 · 7현 저역 · 스크래치 |
| Metalcore | Killswitch Engage | Alive or Just Breathing | 브레이크다운 · 하이게인 · 타이트 |
| Symphonic Metal | Nightwish | (확인 필요) | **스트링·오케스트라 있음** · 하이게인 |

## G. Roots — Country

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| Honky-tonk | Hank Williams | (확인 필요) | **브러시 스네어** · 스틸기타 · 업라이트 |
| Bluegrass | Bill Monroe · Flatt & Scruggs | (확인 필요) | **밴조 + 만돌린 촙** · 드럼 없음 · 업라이트 |
| Old-time / Hillbilly | The Carter Family | (확인 필요) | 밴조·피들 · 드럼 거의 없음 |
| Nashville Sound | Patsy Cline | (확인 필요) | **스트링 있음** · 부드러운 드럼 · 피아노 |
| Countrypolitan | Glen Campbell | (확인 필요) | 스트링 + 팝 편곡 |
| Outlaw Country | Willie Nelson · Waylon Jennings | Red Headed Stranger | 나일론/클린 기타 · 드라이 · 건반 적음 |
| Country Pop | Shania Twain | (확인 필요) | 밝은 스틸기타 · 팝 드럼 · 피아노 |
| Bro-country | Florida Georgia Line | (확인 필요) | 일렉 크런치 · 808 섞임 · 현대적 |
| Alt-country | Wilco · Uncle Tupelo | (확인 필요) | 스틸기타 + 얇은 일렉 · 느슨함 |
| Americana | Gillian Welch | (확인 필요) | 어쿠스틱 중심 · 하모니카 · 업라이트 |

## D. R&B·Funk — Funk

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| JB Funk | James Brown | (확인 필요) | **원(one) 강조** · 클린 기타 커팅 · 혼 · 핑거 베이스 |
| Funk | Sly & the Family Stone | (확인 필요) | 클라비넷 · 슬랩 · 탬버린 |
| P-Funk | Parliament-Funkadelic | Mothership Connection | 신스 베이스(무그) · 혼 · 넓은 편성 |
| Jazz-Funk | Herbie Hancock | Head Hunters | **로즈 · 신스** · 슬랩 · 재즈 화성 |
| Disco Funk | Chic | (확인 필요) | 커팅 기타 · 스트링 · 4/4 킥 |
| Boogie | (확인 필요) | — | 신스 베이스 · 게이트 스네어 · 80년대 |
| Electro-funk | Zapp · Afrika Bambaataa | (확인 필요) | **보코더/토크박스** · 808 · 신스 베이스 |
| Post-disco | (확인 필요) | — | 디스코 골격 + 신스 비중 상승 |

## C. Hip Hop — Southern

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| Memphis Rap | Three 6 Mafia | (확인 필요) | 로파이 · **카우벨** · 어두운 톤 |
| Phonk | (Memphis 계보 파생) | — | 카우벨 리드 · 로파이 · 왜곡 808 |
| Drift Phonk | — | — | Phonk + 빠른 템포 · 강한 왜곡 |
| Crunk | Lil Jon | (확인 필요) | 신스 리드 · 큰 808 · 외침 |
| Miami Bass | 2 Live Crew | (확인 필요) | **808 롱 서브** · 빠른 템포 · 밝은 햇 |
| Booty Bass | — | — | Miami Bass 계열 · 더 빠름 |
| Snap | D4L · Dem Franchize Boyz | (확인 필요) | **핑거 스냅** · 스네어 없음 · 성김 |
| Bounce | (뉴올리언스) | — | 반복 콜 · 타악기 촘촘 |

## E. Electronic — Downtempo · Ambient · Retro

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| Trip Hop | Massive Attack · Portishead | Dummy | 느린 브레이크 · 로즈 · 어두운 저역 |
| Downtempo | Zero 7 · Bonobo | (확인 필요) | 부드러운 드럼 · 패드 · 재즈 화성 |
| Nu Jazz | St Germain | (확인 필요) | 재즈 편성 + 하우스 골격 · 로즈 |
| Synthwave | (80년대 영화음악 계보) | — | **신스 리드 + 게이트 스네어** · 아르페지오 |
| Vaporwave | — | — | 느림 · 피치 다운 · 로파이 · 리버브 |
| Mallsoft | — | — | Vaporwave 파생 · 더 흐릿하고 성김 |
| Chillout | — | — | 패드 중심 · 성긴 드럼 |
| Balearic | — | — | 나일론 기타 · 밝은 패드 · 느슨한 4/4 |
| Lounge | — | — | 비브라폰 · 브러시 · 재즈 화성 |
| Ambient Techno | Aphex Twin | Selected Ambient Works | 미니멀 · 패드 · 반복 |
| Future Funk | — | — | 디스코 샘플 감성 · 밝은 신스 · 커팅 기타 |

---

## 다음 단계

이 표의 **뽑아낸 속성** 열이 `src/data/presets/*.js` 의 프리셋별
`kit` 오버라이드로 들어갑니다. 우선순위는

```
프리셋의 kit / kit.bass  >  TONE_KIT(하위분기)  >  계열 기본값
```

이라, 프리셋에 적으면 하위분기 기본값을 덮어씁니다.
`src/data/presets/_build.js` 참조.

1차(59건)에서 다룬 것 — Alternative · Metal · Country · Funk · Southern ·
Downtempo. 2차(159건)는 아래에 이어집니다.

---

## E. Electronic — Techno · Trance · Breakbeat

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| Detroit Techno | Juan Atkins · Derrick May | (확인 필요) | **스트링 패드 + 무그 베이스** · 따뜻함 |
| Minimal Techno | Robert Hood | (확인 필요) | 요소 최소 · 벨 · 반복 |
| Dub Techno | Basic Channel | (확인 필요) | 긴 코드 스탭 + 딜레이 · 저역 깊음 |
| Acid Techno | — | — | **303 베이스**가 주인공 · 리드 |
| Industrial | Nine Inch Nails | The Downward Spiral | **기타가 들어가는 테크노** · 거친 리즈 |
| Psytrance · Goa | Infected Mushroom | (확인 필요) | 16분 303 베이스 · 리드 |
| Uplifting Trance | — | — | **큰 스트링 브레이크다운** |
| Hardstyle | — | — | 왜곡 킥 + 리즈 · 리드 |
| Drum & Bass | Goldie | Timeless | 리즈 베이스 · 패드 |
| Jungle | — | — | 아멘 브레이크 · **서브 베이스** · 라가 벨 |
| Liquid Funk | — | — | **재즈 화성 · 로즈** · 부드러운 서브 |
| Big Beat | The Chemical Brothers · Fatboy Slim | Dig Your Own Hole | **기타 샘플이 정체성** · 오르간 · 무그 |

## H. Latin — 쿠바

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| Son Cubano | Buena Vista Social Club | Buena Vista Social Club | 트레스(나일론) · 피아노 · 업라이트 · 클라베 |
| Salsa | Fania All-Stars · Héctor Lavoe | (확인 필요) | **팀발레 + 혼 섹션** · 몬투노 피아노 |
| Mambo | Pérez Prado | (확인 필요) | 혼 섹션이 주인공 · 팀발레 |
| Timba | Los Van Van | (확인 필요) | 현대적 · 핑거 베이스 · 피아노 |
| Cha-cha-chá | — | — | 콩가 · 혼 · 귀로 |
| **Rumba** | — | — | **목소리와 타악기뿐** — 화성 악기가 없는 것이 정체성 |

> Rumba·Rumba Yambú·Rumba Columbia·Bomba 는 `off:['keys','gtr']` 로
> 건반과 기타를 **껐습니다.** 실제로 없는 편성입니다.

## H. Latin — 브라질

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| Bossa Nova | João Gilberto · Antônio Carlos Jobim | Getz/Gilberto | 나일론 · 로즈 · 업라이트 · 셰이커 |
| Pagode · Partido Alto | — | — | 카바키뉴(나일론) · 콩가 · **판데이루(탬버린)** |
| Forró · Baião | Luiz Gonzaga | (확인 필요) | **아코디언 + 자붐부(톰) + 트라이앵글(아고고)** |
| Baile Funk · Bruxaria | — | — | 808 · 벨 · 셰이커 |

## B. Pop — Teen Pop · Indie Pop

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| **Baroque Pop** | The Beach Boys · The Left Banke | Pet Sounds | **하프시코드** · 스트링 · 업라이트 |
| Chamber Pop | Belle and Sebastian | (확인 필요) | 스트링 · 나일론 기타 |
| Twee Pop | — | — | 비브라폰 · 12현 기타 |
| Indie Pop | — | — | 오르간 · **12현 기타** |
| Bedroom Pop | — | — | 로즈 · 클린 기타 · 로파이 |

## A. Rock — 뿌리 · Punk · Post-punk

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| Rock & Roll | Chuck Berry · Little Richard | (확인 필요) | **피아노** · 크런치 · 업라이트 |
| **Surf Rock** | The Ventures · Dick Dale | (확인 필요) | **리버브 기타가 전부** · 건반 없음 |
| Garage Rock | The Sonics · The Stooges | (확인 필요) | 오르간 · 거친 크런치 |
| Rhythm & Blues | Ray Charles | (확인 필요) | 혼 섹션 · 피아노 |
| Post-punk | Joy Division | Unknown Pleasures | **베이스가 선율** · 클린 기타 · 얇은 신스 |
| New Wave | Talking Heads · Blondie | (확인 필요) | 신스 리드 · 클린 기타 |
| Crust | — | — | **퍼즈** · 거침 |

## G · D — Blues · R&B

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| Chicago Blues | Muddy Waters · Howlin Wolf | (확인 필요) | **하모니카** · 크런치 · 핑거 베이스 |
| Country Blues | Robert Johnson | (확인 필요) | 하모니카 · 어쿠스틱 스틸 · 업라이트 |
| Jump Blues | Louis Jordan | (확인 필요) | **혼 섹션** · 피아노 · 업라이트 |
| New Jack Swing | Teddy Riley · Bobby Brown | (확인 필요) | 신스 리드 · **무그 베이스** · 스윙 16분 |
| Quiet Storm | Sade | Diamond Life | **색소폰** · 클린 기타 · 부드러움 |
| Trap Soul | — | — | 벨 · 808 |

## I · J — Caribbean · African

| 프리셋 | 대표 아티스트 | 대표 앨범 | 뽑아낸 속성 |
|---|---|---|---|
| Reggaeton | Daddy Yankee | (확인 필요) | 벨 · 808 · 귀로 |
| Bachata | Aventura | (확인 필요) | **레킨토(나일론) + 봉고** |
| Merengue | Juan Luis Guerra | (확인 필요) | 팀발레 · 혼 · 귀로 |
| Highlife | E.T. Mensah | (확인 필요) | **쨍한 클린 기타 + 혼** |
| **Desert Blues** | Tinariwen | (확인 필요) | **기타가 전부** · 건반 없음 |
| Amapiano | — | — | **로그드럼** · 로즈 · 셰이커 |

---

## 이번 차수 적용 결과

프리셋별 오버라이드 **159건**을 넣어 하위분기 안의 편성이 갈라졌습니다.

| 하위분기 | 편성 가짓수 (전 → 후) |
|---|---|
| House 계열 23종 | 4 → **16** |
| Metal 13종 | 1 → **11** |
| Trance 계열 11종 | 2 → **7** |
| Techno 계열 10종 | 2 → **9** |
| Country 10종 | 1 → **10** |
| 쿠바 10종 | 1 → **5** |
| Dubstep 16종 | ? → **9** |

**357종 전체의 편성 조합이 199가지**가 됐습니다.

Punk 7종만 3가지로 남았는데, 이건 의도입니다 — 펑크는 편성이 단순한 것이
정체성이고 차이는 템포와 드럼에 있습니다.
