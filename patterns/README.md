# 박자 자료 — patterns/

`genres/` 가 **악기·음색·수치**를 다룬다면, 여기는 **박자**만 다룹니다.
두 폴더는 파일 번호가 같은 계열끼리 짝을 이룹니다.

| 계열 | 박자 (여기) | 악기·음색 |
|---|---|---|
| — | [00-archetypes.md](00-archetypes.md) — 드럼 원형 | — |
| — | [00-harmony.md](00-harmony.md) — 건반·기타 화성 원형 | — |
| A. Rock | [01-rock.md](01-rock.md) | [../genres/01-rock.md](../genres/01-rock.md) |
| B. Pop | [02-pop.md](02-pop.md) | [../genres/02-pop.md](../genres/02-pop.md) |
| C. Hip Hop | [03-hiphop.md](03-hiphop.md) | [../genres/03-hiphop.md](../genres/03-hiphop.md) |
| D. R&B / Soul / Funk | [04-rnb-soul-funk.md](04-rnb-soul-funk.md) | [../genres/04-rnb-soul-funk.md](../genres/04-rnb-soul-funk.md) |
| E. Electronic | [05-electronic.md](05-electronic.md) | [../genres/05-electronic.md](../genres/05-electronic.md) |
| F. Jazz | [06-jazz.md](06-jazz.md) | [../genres/06-jazz.md](../genres/06-jazz.md) |
| G. Blues / Country / Folk | [07-roots.md](07-roots.md) | [../genres/07-roots.md](../genres/07-roots.md) |
| H. Latin | [08-latin.md](08-latin.md) | [../genres/08-latin.md](../genres/08-latin.md) |
| I. Caribbean | [09-caribbean.md](09-caribbean.md) | [../genres/09-caribbean.md](../genres/09-caribbean.md) |
| J. African | [10-african.md](10-african.md) | [../genres/10-african.md](../genres/10-african.md) |
| K. 기타 지역 | [11-regional.md](11-regional.md) | [../genres/11-regional.md](../genres/11-regional.md) |

---

## 1. 표기 규칙

- 16스텝 그리드, **0부터 시작**
- `X` = 강세, `x` = 보통, `-` = 없음
- 1박=0, 2박=4, 3박=8, 4박=12
- 베이스 트랙만 숫자(0~7)를 쓰며 스케일의 **음도**를 뜻합니다

| 기호 | 트랙 |
|---|---|
| `K` | Kick |
| `S` | Snare |
| `C` | Clap |
| `H` | Hat Closed |
| `O` | Hat Open |
| `T` | Tom |
| `B` | Bass (음도) |
| `Y` | Keys (화음) |
| `G` | Guitar (코드 근음) |

### 화성 트랙 표기

`Y`(건반)와 `G`(기타)도 16글자 문자열이며, 베이스와 같은 음도 체계를 씁니다.

| 글자 | 뜻 |
|---|---|
| `0`~`7` | 그 음도를 **근음으로 한 3화음** (인덱스 r, r+2, r+4) |
| `a`~`h` | **단음** — 아르페지오용 (`a`=0도 … `h`=7도). 건반 전용 |
| `-` | 쉼 |

기타는 단선이라 `0`~`7` 과 `-` 만 씁니다. 근음 하나를 찍으면
기타 엔진이 그 위에 코드를 스트럼합니다.

**3화음 계산의 주의점** — 7음계(Natural Minor·Dorian·Major)에서는
인덱스 7이 0의 옥타브 위라, 8 이상은 7을 빼서 한 옥타브 아래 같은 음으로
자리바꿈합니다. **5음계(Minor Pentatonic)에서는** `r, r+2, r+4` 가
3화음이 아니라 **근음·4도·b7** 이 됩니다. 힙합·록에서는 이 4도 쌓기가
오히려 장르에 맞아 그대로 둔 것이며, 잘못된 계산이 아닙니다.

계열 파일에서 장르 이름 앞의 `·` 는 **규칙으로 파생된 프리셋**을 뜻합니다.
표기가 없으면 자료를 보고 손으로 작성한 것입니다.

### 골격 공유에 대해

계열 파일은 **골격이 같은 장르를 한 블록에 묶어** 보여줍니다.
파생 프리셋이 원형을 상속한 결과이며, 묶인 장르들은 박자가 동일하고
템포·스윙·악기 구성으로 구분됩니다.
자료로 확인된 고유 박자가 있는 장르는 별도 블록으로 떨어져 있습니다.

---

## 2. 스윙 값 빠른 참조

PULSE·16의 스윙 노브는 0~100이고, **노브 50이 완전 셔플(2:1 셋잇단)**입니다.
코드에서 확인한 계산은 `홀수 스텝 이동량 = 16분음표 × (노브/100) × 0.66` 이며,
환산식은 **스윙 비율(%) = 50 + 0.33 × 노브** 입니다.
근거는 [../presets/audit.md](../presets/audit.md) §4에 있습니다.

| 노브 | 스윙 비율 | 느낌 | 해당 장르 |
|---|---|---|---|
| **0** | 50% | 완전 스트레이트 | Techno, Trance, Punk, Jazz Fusion, DnB |
| **8~14** | 52~55% | 아주 약한 흔들림 | House, Reggaeton, Reggae |
| **20~28** | 57~59% | 가벼운 셔플 | Disco, Afrobeats, Amapiano |
| **30~40** | 60~63% | 뚜렷한 셔플 | UK Garage, New Jack Swing, Boom Bap |
| **40~48** | 63~66% | 강한 스윙 | Lo-fi Hip Hop, Trip Hop |
| **50** | 67% | **완전 셔플 (2:1 셋잇단)** | Blues Shuffle, Swing Jazz 근사 |
| 50 초과 | 67% 초과 | 셋잇단을 넘어선 과장된 스윙 | 특수 효과용 |

**실무 요령**
- 재즈·블루스 셔플을 근사하려면 **노브 50**. 그 이상은 음악적으로 통용되는 범위를 벗어납니다
- UI 에 표시되는 `%` 는 노브 값이 아니라 **환산된 스윙 비율**입니다 (노브 38 → 63%)

---

## 3. 16스텝 그리드로 표현할 수 없는 것들

프리셋을 추가할 때 미리 알아둘 제약입니다.

| 제약 | 해당 장르 | 필요한 기능 |
|---|---|---|
| **셋잇단 기반** | Swing/Bebop 라이드, 블루스 셔플, Footwork, UK Drill 햇 | 12/24스텝 모드, 또는 스윙 50 근사 |
| **변박** | Math Rock, Prog, Balkan Brass, Rebetiko | 스텝 길이 가변 |
| **12/8 폴리리듬** | Afrobeat(단수), 서아프리카 전통, Gnawa | 12/24스텝 모드 |
| **12박 콤파스** | Flamenco | 12/24스텝 모드 |
| **미세 타이밍(밀고 끌기)** | Neo-Soul, J Dilla 계열, Samba, Southern Soul | 스텝별 마이크로 타이밍(±ms) |
| **32분 이상 롤** | Trap 햇 롤, Footwork, Breakcore | 스텝별 ratchet(1~4연타) |
| **인터로킹 다층 구조** | Afrobeat, Mbalax, 소우쿠스 | 트랙별 독립 루프 길이(폴리미터) |
| **비주기적 구조** | Ambient, IDM, Post-rock | 스텝 시퀀서의 범위 밖 |

이 제약 때문에 프리셋을 만들지 못한 장르가 **69개**입니다.
분류는 [../presets/roadmap.md](../presets/roadmap.md) §0 참조.

### 기능 추가 우선순위 (비용 대비 효과)

| 순위 | 기능 | 해금되는 장르 | 구현 난이도 |
|---|---|---|---|
| 1 | **스텝별 ratchet** (1~4연타) | Trap 햇 롤, Drill, Footwork 근사, Breakcore | 낮음 |
| 2 | **스텝별 마이크로 타이밍** (±ms) | Neo-Soul, Dilla, Samba, Southern Soul | 낮음 |
| 3 | **12/24스텝 모드** | Swing Jazz, Blues Shuffle, Afrobeat, Gnawa, Flamenco | 중간 |
| 4 | **트랙별 독립 루프 길이** | Afrobeat 인터로킹, 폴리미터 전반 | 중간 |
| 5 | **변박 / 가변 스텝 수** | Math Rock, Prog, Balkan | 높음 |

1·2번만 추가해도 위 8개 제약 중 3개가 풀립니다.
