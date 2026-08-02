# 프리셋 확장 로드맵

> **2026-08-02 갱신 — 현재 357종.**

## 0. 트리 커버리지 — 정확한 회계

계통도의 장르가 프리셋이 되기까지 세 관문을 거칩니다.
**문서 표에 있는 것 ≠ `genres.json` 에 있는 것 ≠ 프리셋이 있는 것** 입니다.

```
트리 고유 장르 (구조 라벨 제외)          409
├─ genres.json 에 있음                   408
│   ├─ 프리셋 있음                       335  ✅ (82%)
│   └─ 프리셋 없음                        73  ← 전부 구조적 이유
└─ genres.json 에 없음                     1   ← 'UK 계열' (한글 구조 라벨, 장르 아님)
```

### 프리셋을 못 만드는 73개 — 전부 이유가 있습니다

| 개수 | 이유 | 성격 |
|---|---|---|
| 41 | **16스텝 4/4로 표현 불가** — 변박(7/8·9/8·11/8), 셋잇단 스윙, 12박 콤파스, 12/8 폴리리듬 | 🔴 구조적 한계 |
| 24 | **BPM 개념이 없음** — Ambient, Drone, Free Jazz, Art Pop 등 | 🔴 구조적 한계 |
| 4 | **고정 박자 없음** | 🔴 구조적 한계 |
| 3 | **마이크로 타이밍 필요** — 네오소울, Dilla 계열의 밀고 끌기 | 🟡 기능 추가하면 해결 |
| 1 | **뮤트·send 오토메이션 필요** — Dub | 🟡 기능 추가하면 해결 |

**🔴 69개는 도구의 구조상 못 만듭니다.** 한 박을 4등분하는 그리드에
3등분·12등분 리듬을 넣으면 근사치조차 되지 않습니다. 억지로 넣으면
"비슷한데 아닌" 프리셋이 되므로 의도적으로 뺐습니다.
16스텝 그리드의 한계는 [../patterns/README.md](../patterns/README.md) §3 참조.

**🟡 4개는 §9의 엔진 기능 두 개(마이크로 타이밍·오토메이션)를 넣으면 풀립니다.**

> **이전 판 정정**: 여기 "30개는 고칠 수 있다"고 적었던 것들은 실제로 고쳤습니다.
> 대부분 `Rumba (Guaguancó / Yambú / Columbia)` 처럼 트리의 하위 이름이
> `genres.json` 에서 상위 항목에 흡수돼 매칭이 안 되던 경우였고,
> **`aliases` 필드를 추가**해 조각 이름이 상위 항목을 가리키게 했습니다.
> Yambú·Columbia 처럼 BPM 이 실제로 다른 것들은 별도 항목으로 분리했습니다.
> 함께 발견한 **중복 항목 29개**(`forro` ↔ `baiao`, `doom-metal` ↔ `sludge` 등)도
> 복합명을 축약해 정리했습니다.

## 0-B. 프리셋 357종의 신뢰도

| 구분 | 개수 | 성격 |
|---|---|---|
| 손으로 작성 | **56** | 골격·킷·bcfg 를 장르 자료 보고 개별 작성 |
| 규칙 파생 | **299** | 아래 2단계를 거침. **개별 청감 검증은 없음** |
| Tone.js 예제 | 2 | Play Along · Casio Cells |

### 파생 프리셋이 만들어진 과정

1. **골격 배정** — `genres.json` 의 feel·family·tags 로
   [../patterns/00-archetypes.md](../patterns/00-archetypes.md) 의 원형 중 하나를 상속
2. **음색 정교화** — `genres/*.md` 의 **음색·편성 / 리듬 골격 / 핵심 포인트** 서술을
   읽어 킷 엔진·튠·베이스 엔진·bcfg 를 조정 (295개 프리셋에서 456개 값이 바뀜)

2단계 덕에 트랙 재배정이 실제 수치로 반영됩니다 —
Phonk·Memphis Rap 의 `tom` 은 **카우벨(튠 +12)**, Amapiano 는 **로그 드럼(−6)**,
Bluegrass 는 어쿠스틱이라 `kick=wood` + 사이드체인 12 로 잡힙니다.

**여전한 한계**: 골격이 같은 장르는 박자가 동일합니다.
어느 장르가 어느 골격을 공유하는지는 `patterns/` 계열 파일에 묶어서 표시했습니다.

파생 프리셋은 UI 칩에 `·` 이 붙고, `genres.json` 에서 `presetDerived: true` 로 표시됩니다.
골격은 §7-B 원형을 상속하므로 리듬은 신뢰할 수 있지만,
킷 엔진·튠·bcfg 는 태그 기반 자동 매핑이라 **손보면 더 좋아집니다.**

---

원래 계획은 아래와 같았습니다.

선정 기준:
- **(a)** 16스텝 그리드로 정확히 표현 가능한가
- **(b)** 기존 프리셋과 리듬 골격이 겹치지 않는가
- **(c)** 그 장르를 대표하는 음색이 현재 엔진으로 만들어지는가

---

## 1. 현재 커버 상태 (56개 기준)

| 리듬 골격 | 커버 | 해당 프리셋 |
|---|---|---|
| Four-on-the-floor | ✅ | House, Deep House, Techno, Trance, Psytrance, Disco Funk, Eurodance, Gabber, Hardstyle |
| 2·4 백비트 | ✅ | Rock, Motown, Ska, Zouk, Bluegrass, Soukous |
| 2·4 백비트 + 스윙 | ✅ | Boom Bap, Lo-fi, G-Funk, Trip Hop, Chicago Blues |
| 기계적 킥/스네어 교대 | ✅ | Motorik |
| 하프타임 (스네어 3박) | ✅ | Trap, Dubstep, Grime, UK Drill, Phonk, Crunk, Nu Metal, Future Bass |
| 트레시요 / 뎀보우 | ✅ | Reggaeton, Moombahton |
| 브레이크비트 + 고스트 | ✅ | Drum & Bass |
| 폴리리듬 퍼커션 | ✅ | Afrobeats, Afro House, Amapiano, Soca, Bhangra |
| **1박을 비우는 골격** | ✅ | Reggae One Drop |
| **셔플 16분** | ✅ | UK Garage, New Jack Swing, Amapiano |
| **오프비트 롤링 베이스** | ✅ | Psytrance, Trance |
| **on-the-one 강세** | ✅ | Funk |
| **블래스트 비트** | ✅ | Death Metal |
| **트레인 비트** | ✅ | Honky-tonk |
| **완전 셔플(셋잇단 근사)** | ✅ | Chicago Blues (swing 50) |
| **극저속** | ✅ | Doom |
| **마르카토 스타카토** | ✅ | Tango |

이전 판에서 비어 있던 4개 골격은 모두 채워졌습니다.

---

## 2. 추가 후보 (우선순위)

| 순위 | 후보 | 이유 | 필요한 신규 요소 |
|---|---|---|---|
| 1 | **Dubstep** | 하프타임인데 트랩과 킥 배치가 다름 | 없음 — 즉시 가능 |
| 2 | **UK Garage (2-step)** | 셔플 16분 + 브로큰 킥, 완전히 새로운 골격 | 스윙 55~62 구간 확인 |
| 3 | **Reggae One Drop** | "1박을 비우는" 유일한 골격 | 없음 — 즉시 가능 |
| 4 | **Amapiano** | 현재 가장 영향력 큰 신규 장르 | 로그 드럼 음색 (피치 하강 서브) |
| 5 | **Funk** | on-the-one, 16분 신콥의 교과서 | 없음 — 즉시 가능 |
| 6 | **Psytrance** | 오프비트 롤링 베이스 = 베이스 엔진 활용 | 16분 베이스 3연타 시퀀싱 |
| 7 | **Afrobeats 보강** | 이미 있음(개명 후) — 셰이커 레이어 추가 | 셰이커 채널 |
| 8 | **New Jack Swing** | 스윙 16분 + 게이트 스네어 | 게이트 리버브 |
| 9 | **Bossa Nova** | 다이내믹이 좁아 대비 효과 큼 | 브러시 스네어 음색 |
| 10 | **UK Drill** | 슬라이딩 808이 핵심 | 스텝별 글라이드 (일부 존재) |

### 즉시 가능한 3개 (신규 기능 불필요)

**Dubstep**
```
bpm 140, swing 0
kick   X-------X-------
snare  --------X-------
chat   --x---x---x---x-
bass   워블 — LFO를 필터에 (엔진 지원 여부 확인 필요)
```

**Reggae One Drop**
```
bpm 75, swing 12
kick   --------X-------
snare  --------X-------     림샷 음색
chat   --x---x---x---x-
```
1박이 완전히 비어 있어야 합니다. 현재 프리셋 중 이런 골격이 하나도 없습니다.

**Funk**
```
bpm 100, swing 16
kick   X-------X-x-----
snare  ----X-------X---
chat   xxxxxxxxxxxxxxxx     액센트 불규칙
```

---

## 3. 기능이 먼저 필요한 것들

아래 장르들은 기능 추가 전까지 **정확히 만들 수 없습니다.**
근사치로 넣으면 "비슷한데 아닌" 프리셋이 되므로 보류를 권장합니다.

| 장르 | 막히는 지점 | 필요 기능 |
|---|---|---|
| Footwork / Juke | 셋잇단 필수 | 12/24스텝 모드 |
| Jersey Club | 5타 킥의 3+3+2 배치 | ratchet 또는 정확한 스텝 확인 |
| Swing Jazz | 셋잇단 라이드 | 12/24스텝 모드 |
| Blues Shuffle | 2:1 셋잇단 | 스윙 66% 지원 |
| Neo-Soul | 악기별 밀고 끌기 | 스텝별 마이크로 타이밍 |
| Afrobeat(단수) | 12/8 인터로킹 | 12스텝 모드 + 트랙별 루프 길이 |
| Flamenco | 12박 콤파스 | 12/24스텝 모드 |
| Math Rock / Prog | 변박 | 가변 스텝 수 |

기능별 우선순위와 난이도는
[../patterns/README.md](../patterns/README.md) §3 참조.

---

## 4. 권장 진행 순서

1. ~~**[감사 반영]** Trap 킥 엔진 교체, Dembow→Reggaeton 개명,
   DnB 고스트 추가, Afrobeat→Afrobeats 개명~~ → **mk16에 반영 완료**
   (추가로 Reggaeton 스네어 3·6·10·13 → 3·6·11·14 수정. [audit.md](audit.md) §2)
2. **[즉시 가능]** Dubstep, Reggae One Drop, Funk 3개 추가
   → 신규 기능 없이 리듬 골격 커버리지가 크게 넓어짐
3. **[기능 추가]** 스텝별 ratchet + 마이크로 타이밍
   → 구현 난이도 낮고 해금 범위가 큼
4. **[2차 프리셋]** UK Garage, Amapiano, Psytrance, New Jack Swing
5. **[모드 확장]** 12/24스텝 모드
   → Swing Jazz, Blues Shuffle, Afrobeat, Flamenco 계열이 한꺼번에 열림
