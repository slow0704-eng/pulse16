# PULSE·16 장르 레퍼런스

음원 제작 도구에 샘플·프리셋을 추가하기 위한 장르 자료 모음입니다.

---

## 문서 구성

### 장르 자료

**파일 번호가 계통도의 계열 순서(A~K)와 1:1로 대응합니다.**
계통도에 등장하는 모든 장르는 해당 문서에서 전부 다룹니다.

각 계열 문서는 **장르별 특징**(BPM·리듬골격·음색·핵심포인트)과
**PULSE·16 설정값**(킷 엔진·튠·베이스 파라미터)을 함께 담습니다.

| 계열 | 문서 | 내용 |
|---|---|---|
| — | [genres/00-tree.md](genres/00-tree.md) | **대중음악 장르 계통도** — A~K, 약 400개 장르의 혈통 관계 |
| — | [genres/00-instruments.md](genres/00-instruments.md) | **악기·엔진 사전** — 킥 4종·스네어 4종·햇 3종·베이스 7종의 실제 합성 수치와 고르는 기준 |
| A | [genres/01-rock.md](genres/01-rock.md) | Rock — 사이키델릭, 메탈, 펑크, 포스트펑크, 얼터너티브 |
| B | [genres/02-pop.md](genres/02-pop.md) | Pop — 신스팝, 댄스팝, 하이퍼팝, 시티팝, K-pop |
| C | [genres/03-hiphop.md](genres/03-hiphop.md) | Hip Hop — 붐뱁, 트랩, 드릴, 폰크, 로파이, 그라임 |
| D | [genres/04-rnb-soul-funk.md](genres/04-rnb-soul-funk.md) | R&B / Soul / Funk / Disco — 모타운, 펑크, 네오소울 |
| E | [genres/05-electronic.md](genres/05-electronic.md) | Electronic — 하우스, 테크노, 트랜스, 브레이크비트, 베이스 |
| F | [genres/06-jazz.md](genres/06-jazz.md) | Jazz — 스윙, 비밥, 모달, 퓨전, 애시드재즈 |
| G | [genres/07-roots.md](genres/07-roots.md) | Blues / Country / Folk — 셔플, 블루그래스, 가스펠 |
| H | [genres/08-latin.md](genres/08-latin.md) | Latin — 클라베, 살사, 삼바, 쿰비아, 레게톤, 탱고 |
| I | [genres/09-caribbean.md](genres/09-caribbean.md) | Caribbean — 스카, 레게 원드롭, 덥, 댄스홀, 소카 |
| J | [genres/10-african.md](genres/10-african.md) | African — 아프로비트(스), 아마피아노, 그콤, 소우쿠스 |
| K | [genres/11-regional.md](genres/11-regional.md) | 기타 지역 — 반그라, 플라멩코, 발칸, 트로트, 인터넷 장르 |

### 제작 자료

**박자 자료는 `patterns/` 에 있고, `genres/` 와 파일 번호가 1:1로 대응합니다.**
`genres/` 는 악기·음색·수치를, `patterns/` 는 16스텝 박자를 담당합니다.

| 문서 | 내용 |
|---|---|
| [patterns/README.md](patterns/README.md) | **박자 자료 진입점** — 표기 규칙, 스윙 참조표, 그리드 한계, 계열별 인덱스 |
| [patterns/00-archetypes.md](patterns/00-archetypes.md) | 계열을 가로지르는 **공통 원형 패턴** (4온플로어, 클라베, 트레시요, 원드롭 …) |
| `patterns/01`~`11` | 계열별 장르 박자 — 골격이 같은 장르는 한 블록에 묶어 표시 |
| [presets/audit.md](presets/audit.md) | 프리셋 감사 결과와 수정안 |
| [presets/roadmap.md](presets/roadmap.md) | 프리셋 커버리지 현황과 다음 후보 |
| [ui-review.md](ui-review.md) | UI/UX 리뷰 및 개선 내역 |

### 데이터

| 파일 | 내용 |
|---|---|
| [data/genres.json](data/genres.json) | 위 내용의 기계 판독용 사본 — 장르 430개, 패턴 29개, 프리셋 연결 358개 |
| [data/README.md](data/README.md) | 필드 설명과 검증 스크립트 |

### 도구

`pulse16-mk16.html` — **프리셋 357종** 탑재.
**계열(A~K) → 하위 분기** 2단계 필터로 걸러 볼 수 있습니다
(힙합 41종 → 트랩 계열 7종 / Southern 8종 / Drill 5종 …).

| 구분 | 개수 | 신뢰도 |
|---|---|---|
| 손으로 작성 | 56 | 골격·킷·bcfg 를 장르 자료 보고 개별 작성 |
| 규칙 파생 (`·` 표시) | 299 | 골격은 원형 상속 + 킷·bcfg 는 `genres/*.md` 음색 서술에서 유도 |
| Tone.js 예제 | 2 | Play Along · Casio Cells |

**계통도 409개 중 335개(82%)에 프리셋이 있습니다.**
나머지 73개는 **전부 구조적 이유**로 만들 수 없습니다 —
16스텝 4/4로 표현 불가 41개(변박·셋잇단·12박), BPM 개념 없음 24개,
고정 박자 없음 4개, 엔진 기능 필요 4개.
자세한 분류는 [presets/roadmap.md](presets/roadmap.md) §0 참조.

---

## 공통 표기 규칙

- 16스텝 그리드, **0부터 시작**
- `X` = 강세, `x` = 보통, `-` = 없음
- 1박=0, 2박=4, 3박=8, 4박=12
- `chat` = 클로즈드 하이햇, `ohat` = 오픈 하이햇, `shkr` = 셰이커
- `★` = 현재 PULSE·16 프리셋으로 존재하는 장르
- `체감` = 하프타임 계열에서 실제 BPM과 몸이 느끼는 속도가 다를 때만 표기

---

## 신뢰도에 대한 주의

**BPM은 대부분 관행적 범위이지 규격이 아닙니다.**
같은 장르도 시대·지역·프로듀서에 따라 ±15 BPM은 흔히 벌어집니다.
표의 값은 "이 근처에서 시작하라"는 뜻으로 읽으세요.

`data/genres.json`의 `confidence` 필드로 구분해 두었습니다.

| 등급 | 개수 | 의미 |
|---|---|---|
| `verified` | 12 | [presets/audit.md](presets/audit.md)에서 개별 대조를 거침 |
| `conventional` | 237 | 널리 통용되는 관행값. 검증되지 않음 |
| `uncertain` | 9 | 자료가 엇갈리거나 확인이 얕음 |

### 확인이 필요한 항목 (`uncertain`)

- **클라베 표기** — 손 클라베 3-2는 확인했으나, 룸바 클라베와
  보사노바 클라베의 정확한 스텝 위치는 자료마다 표기가 갈립니다
- **Jersey Club 킥 5타의 정확한 스텝 배치** — 3+3+2 기반이라는 것까지만 확인
- **Amapiano 셰이커의 스윙 비율** — "셔플이 있다"는 것은 일치하나 수치는 불명확
- **Gqom의 킥 배치** — "4/4가 아니다"는 공통되나 표준형이 있는지 불확실
- **Baile Funk 탐보르장 패턴** — 지역·시기별 변형이 커서 하나로 특정 불가
- **UK Drill 햇의 셋잇단 배치** — 16분 그리드에서는 재현 불가
- **Snap의 실제 템포** — 체감 70~80이 표기되나 실제 BPM 표기가 자료마다 다름
- **K-pop / Filmi의 BPM 범위** — 하이브리드 장르라 범위 자체의 의미가 약함

> **해결됨**: 스윙 노브(0~100)와 스윙 백분율의 대응 관계는 코드에서 확인했습니다.
> **노브 50 = 완전 셔플(66.7%)**입니다.
> → [presets/audit.md](presets/audit.md) §4

---

## 프리셋 감사 결과 (mk16 기준)

이전 감사에서 지적한 4건은 **`pulse16-mk16.html`에 모두 반영되어 있습니다** —
Trap 킥 엔진·템포, DnB 고스트 스네어·174 BPM, Dembow→Reggaeton,
Afrobeat→Afrobeats.

작업 중 **새 오류 1건을 발견해 수정**했습니다.

> **Reggaeton 스네어**: 코드 주석은 "3·6·11·14 검증 완료"인데 실제 패턴은
> `---x--x---x--x--` = **3·6·10·13**이었습니다. 같은 프리셋의 베이스는
> 이미 올바른 트레시요 위치(0·3·6·8·11·14)였으므로 스네어만 어긋나 있었습니다.
> `---x--x----x--x-`로 수정했습니다. → [presets/audit.md](presets/audit.md) §2

---

## 다음에 할 것

1. **즉시 추가 가능한 프리셋 3개** — 신규 기능 없이 리듬 골격 커버리지가 넓어짐
   ([presets/roadmap.md](presets/roadmap.md) §2)
   - **Dubstep** (하프타임인데 트랩과 킥 배치가 다름)
   - **Reggae One Drop** (1박을 비우는 유일한 골격)
   - **Funk** (on-the-one 강세)

2. **엔진 기능 2개** — 구현 난이도가 낮고 해금 범위가 큼
   ([patterns/README.md](patterns/README.md) §3)
   - 스텝별 **ratchet** (1~4연타) → 트랩 햇 롤, 드릴, 브레이크코어
   - 스텝별 **마이크로 타이밍** (±ms) → 네오소울, Dilla, 삼바

3. **UI 소소한 개선** — 스윙 노브 라벨의 `%` 표기가 실제 스윙 비율과
   다른 단위라 혼동을 줍니다 (노브 38 = 62.5%). 라벨 변경 또는 툴팁 권장
