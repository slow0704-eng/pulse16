# data/genres.json — 필드 설명

`genres.json`은 `genres/` 문서와 **같은 내용의 기계 판독용 사본**입니다.
문서를 고치면 이 파일도 함께 고쳐야 합니다 (§5 동기화 참조).

현재 규모: **장르 258개, 패턴 29개, 프리셋 연결 10개**

---

## 1. 최상위 구조

| 키 | 내용 |
|---|---|
| `version` | 이 데이터 파일의 버전 (semver) |
| `updated` | 마지막 수정일 |
| `grid` | 스텝 그리드 정의 (16스텝, 0-based) |
| `enums` | 아래 필드들이 가질 수 있는 값의 목록 |
| `patterns` | 16스텝 리듬 패턴 라이브러리 |
| `swingReference` | 스윙 백분율 ↔ 장르 대응표 |
| `genres` | 장르 목록 (본체) |

---

## 2. `genres[]` 필드

### 필수

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | string | kebab-case 고유 식별자 |
| `name` | string | 영문 장르명 |
| `family` | string | 최상위 계열 |
| `feel` | enum | 리듬 감각 (아래 참조) |
| `gridSafe` | `true` \| `"approx"` \| `false` | 16스텝 그리드 표현 가능 여부 |
| `confidence` | enum | 데이터 신뢰도 (아래 참조) |

### 선택

| 필드 | 타입 | 설명 |
|---|---|---|
| `nameKo` | string | 한글 장르명 (있는 경우만) |
| `subfamily` | string | 하위 계열 |
| `crossFamily` | string[] | 다른 계열에도 걸쳐 있을 때 |
| `bpm` | `{min,max,typical}` \| `null` | 실제 템포. `null`=템포 개념이 약한 장르 |
| `feltBpm` | `{min,max,typical}` | 하프타임 계열에서 **체감** 템포 |
| `meter` | string \| `null` | 박자. 4/4가 아니면 반드시 명시 |
| `swing` | `{min,max,typical}` | 스윙 값 (PULSE·16 노브 단위) |
| `patternRef` | string | `patterns[].id` 참조 |
| `preset` | string | 대응하는 PULSE·16 프리셋 이름 |
| `presetDerived` | boolean | `true` = 규칙으로 유도된 **파생** 프리셋. 개별 청감 검증을 거치지 않음. 없으면 손으로 작성한 것 |
| `requires` | string[] | 이 장르를 제대로 만들려면 필요한 엔진 기능 |
| `gridNote` | string | 그리드로 표현 못 하는 구체적 이유 |
| `note` | string | 제작 시 주의사항 |
| `tags` | string[] | 음색·기법 태그 |
| `aliases` | string[] | 이 장르를 가리키는 다른 이름들. 계통도의 하위 이름·조각(`Guaguancó`, `One Drop`, `PBR&B` 등)이 이 항목으로 해석되도록 함 |
| `fromDoc` | string | `genres/*.md` 표에서 승격된 항목의 출처 파일 |
| `processing` | string | 원곡 처리 기법 (internet 계열 전용) |

---

## 3. enum 값

### `feel`

| 값 | 의미 |
|---|---|
| `straight` | 정박, 스윙 없음 |
| `halftime` | 스네어가 3박 하나 (체감 템포 = 실제의 절반) |
| `shuffle` | 16분 셔플 |
| `swing` | 셋잇단 기반 스윙 (재즈·블루스) |
| `triplet` | 셋잇단이 기본 단위 |
| `broken` | 정박 킥이 없는 브로큰 비트 |
| `polyrhythm` | 여러 주기가 동시에 진행 |
| `free` | 고정 박자 없음 |

### `gridSafe`

| 값 | 의미 | 소비 시 처리 |
|---|---|---|
| `true` | 16스텝으로 정확히 표현 가능 | 그대로 프리셋화 |
| `"approx"` | 근사치만 가능 | 프리셋화 가능하나 UI에 "근사" 표시 권장 |
| `false` | 표현 불가 | 프리셋 목록에서 제외하거나 비활성 표시 |

### `confidence`

| 값 | 개수 | 의미 |
|---|---|---|
| `verified` | 12 | `presets/audit.md`에서 개별 대조를 거침 |
| `conventional` | 237 | 널리 통용되는 관행값. 검증되지 않음 |
| `uncertain` | 9 | 자료가 엇갈리거나 확인이 얕음. **사용 전 확인 필요** |

`uncertain` 항목: `snap`, `brazilian-phonk`, `jersey-club`, `rumba-guaguanco`,
`bossa-nova`, `baile-funk`, `gqom`, `kpop`, `filmi`

---

## 4. `patterns[]` 필드

| 필드 | 설명 |
|---|---|
| `id` | kebab-case 식별자. `genres[].patternRef`가 이걸 가리킴 |
| `name` | 표시용 이름 |
| `feel` | `genres[].feel`과 같은 enum |
| `bars` | 마디 수. 생략 시 1 (현재 `son-clave-3-2`만 2) |
| `tracks` | 트랙명 → 16자 문자열 |
| `note` | 제작 시 주의사항 |

**`tracks` 문자열 규칙**
- 정확히 **16자**. `X`=강세, `x`=보통, `-`=없음
- 인덱스 0부터. 1박=0, 2박=4, 3박=8, 4박=12
- 예외: `bass`/`log` 트랙은 숫자가 음정 오프셋을 뜻할 수 있음
  (예: `trap-halftime`의 `"0-------5-------"`)

**트랙명 목록**
`kick` `snare` `clap` `chat`(클로즈드햇) `ohat`(오픈햇) `shkr`(셰이커)
`perc` `skank` `surdo` `tamb` `bass` `log` `accent` `clave_bar1` `clave_bar2`

---

## 5. 문서와의 동기화

`genres.json`은 아래 문서들의 사본입니다. **문서가 원본입니다.**

| JSON 부분 | 원본 문서 |
|---|---|
| `genres[]` | `genres/01`~`08-*.md` |
| `patterns[]` | `patterns/README.md` §1~7 |
| `swingReference` | `patterns/README.md` §8 |
| `requires` / `gridSafe:false` | `patterns/README.md` §9 |
| `confidence: "verified"` | `presets/audit.md` |

### 검증 스크립트

수정 후 아래를 돌려 깨진 곳이 없는지 확인하세요.

```powershell
$j = Get-Content data\genres.json -Raw -Encoding UTF8 | ConvertFrom-Json

# 1. 패턴 길이가 전부 16인가
foreach ($p in $j.patterns) {
  foreach ($t in $p.tracks.PSObject.Properties) {
    if ($t.Value.Length -ne 16) { "LENGTH: $($p.id)/$($t.Name) = $($t.Value.Length)" }
  }
}

# 2. patternRef가 존재하는 패턴을 가리키는가
$pids = $j.patterns.id
$j.genres | Where-Object { $_.patternRef -and $pids -notcontains $_.patternRef } |
  ForEach-Object { "BAD REF: $($_.id) -> $($_.patternRef)" }

# 3. id 중복
$j.genres | Group-Object id | Where-Object Count -gt 1 |
  ForEach-Object { "DUP ID: $($_.Name)" }

"검증 완료 — 위에 출력이 없으면 이상 없음"
```

> **주의**: PowerShell의 `ConvertFrom-Json`은 키를 대소문자 구분 없이 다룹니다.
> 이 때문에 `grid.symbols`를 객체가 아닌 **배열**로 정의했습니다
> (`"X"`와 `"x"`가 같은 키로 취급돼 파싱이 실패했음).
> 새 필드를 추가할 때 대소문자만 다른 키를 같은 객체에 넣지 마세요.

---

## 6. 소비 시 주의

1. **`aliasOf`가 있는 항목은 건너뛸 것** — 실제 데이터가 아니라 교차 참조용
   스텁입니다. 현재 `amapiano-african` 하나뿐이며 `bpm` 필드가 없습니다.
2. **`bpm`이 `null`일 수 있음** — Ambient, IDM, Math Rock 등 템포 개념이
   약한 장르입니다. `bpm.typical`이 `null`인 경우도 있습니다 (K-pop).
3. **`meter`를 확인할 것** — 2/4(삼바, 메렝게, 블루그래스), 3/4(란체라),
   12/8(아프로비트), 12박(플라멩코) 등이 섞여 있습니다.
   4/4로 가정하고 처리하면 강세가 어긋납니다.
4. **`bpm`은 규격이 아니라 관행** — `confidence`를 함께 보여주지 않는 UI라면
   최소한 "권장 범위"라고 표기하세요.
