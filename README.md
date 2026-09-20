# PULSE·16

[![CI](https://github.com/slow0704-eng/pulse16/actions/workflows/ci.yml/badge.svg)](https://github.com/slow0704-eng/pulse16/actions/workflows/ci.yml)

브라우저에서 도는 16스텝 시퀀서입니다. 빌드 도구 없이 `pulse16-mk16.html` 을 열면 그대로 돕니다.
드럼·베이스·건반·기타를 합성으로 소리 내고, 장르 프리셋과 선율 라이브러리를 얹어
"틀어 놓으면 곡이 되는" 상태를 만드는 것이 목표입니다.

## 여는 법

```
python -m http.server 8000
# → http://localhost:8000/pulse16-mk16.html
```

`file://` 로 직접 열어도 대부분 돌지만, 샘플 로딩이 CORS 에 막힙니다. 서버로 여는 쪽을 권합니다.

## 구조

클래식 스크립트(모듈 아님)라 **로드 순서가 곧 의존 순서**입니다.
`pulse16-mk16.html` 의 `<script>` 목록이 그 순서를 정의합니다.

| 경로 | 하는 일 |
|---|---|
| `src/core/` | 설정·엔진 표·상태·DOM 참조·공용 유틸 |
| `src/audio/` | 오디오 그래프와 보이스 — 드럼 / 현(Karplus-Strong) / 타현(비조화 가법합성) / 건반 / 기타 / 모달 공진 뱅크(몸통 공명) |
| `src/data/` | 장르 프리셋 · 필인 · 선율 라이브러리 · 화성 진행(코드 진행·컴핑) |
| `src/seq/` | 시퀀서 — 스텝 스케줄링, 필인, 선율 전개, 킷·패턴 셔플, 곡 구조(섹션)·트랙별 그루브 |
| `src/ui/` | 화면 구성 · 이벤트 · 미터 · 저장 |
| `tools/` | 계측 하네스 (스펙트럼·감쇠·선율 지표) |
| `mcp/pulse-audit/` | 오프라인 렌더와 측정을 자동화하는 MCP 서버 |

설계 배경과 각 결정의 근거는 [`ARCHITECTURE.md`](ARCHITECTURE.md) 에 있습니다.

## 문서

**이 표가 저장소의 문서 색인입니다.** 여기 없는 문서는 없습니다 — 예전에는 이 절이
절반만 담고 있어서 나머지가 [`genre-reference.md`](genre-reference.md) 를 통해서만
닿았고, 그쪽 숫자는 낡아 있었습니다.

**먼저 볼 것**

| 문서 | 무엇 |
|---|---|
| [`manual.html`](manual.html) | **사용자용 사용법과 동작 원리**. 앱 헤더의 「사용법」 버튼 |
| [`CLAUDE.md`](CLAUDE.md) | **이 저장소의 규칙** — 고치기 전에 읽으십시오 |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | 파일 분리 구조 · 로드 순서 지도 · 알려진 위험 |
| [`docs/시스템설명서.md`](docs/시스템설명서.md) | 아키텍처 · 런타임 · 신호 경로 · 성능 · 인터페이스 |
| [`docs/시스템-비즈니스설명서.md`](docs/시스템-비즈니스설명서.md) | 장르 체계 · 음색 배정 · 변주 규칙 · 음악 이론 규칙 |

**장르·음악 자료** — 프리셋의 근거가 되는 글입니다.

| 문서 | 무엇 |
|---|---|
| [`genres/`](genres/) | 계열 A~K 의 세부장르 특징 · **PULSE·16 설정값** · 대표 아티스트 · **대표곡**(웹으로 실재를 확인한 것만) |
| [`genres/00-tree.md`](genres/00-tree.md) | 대중음악 장르 계통도 |
| [`genres/00-instruments.md`](genres/00-instruments.md) | 악기·엔진 사전 — 합성 수치와 고르는 기준 |
| [`genres/00-technique.md`](genres/00-technique.md) | 주법 변형 36종 · 프리셋 배정과 근거 |
| [`genres/00-form.md`](genres/00-form.md) | 곡 형식(섹션 배분)의 출처 |
| [`genres/00-reference.md`](genres/00-reference.md) | ⚠ **2026-08 작업 일지** — 더는 데이터 원본이 아닙니다 |
| [`genres/profiles/README.md`](genres/profiles/README.md) | 선율·리프·베이스 배정의 «왜». **곡·아티스트 이름을 여기 넣지 않는 이유** |
| [`patterns/README.md`](patterns/README.md) | 16스텝 표기법 · 스윙 참조표 · 그리드 한계 |
| [`patterns/`](patterns/) | 계열별 박자 자료. `genres/` 와 번호가 1:1 |
| [`melody/README.md`](melody/README.md) | 선율 자료 진입점 |
| [`melody/`](melody/) | 화성·선율 이론과 선율 라이브러리의 근거 |
| [`billboard/README.md`](billboard/README.md) | 빌보드 Hot 100 · BB200 1위 자료(생성물의 원본) |
| [`data/README.md`](data/README.md) | `data/genres.json` 필드 설명 |

**측정 보고서** — 읽기·측정 전용. 값을 고치려면 하네스를 다시 돌리십시오.

| 문서 | 무엇 |
|---|---|
| [`docs/perf/`](docs/perf/) | 오디오 런타임 실측 · 로딩과 전달 · WebAssembly 검토 · 외부 의존성 전수 조사 |
| [`docs/음색/01-STK차용.md`](docs/음색/01-STK차용.md) | 엔진 파라미터의 출처와 환산식 |
| [`docs/qa/01-신뢰성.md`](docs/qa/01-신뢰성.md) | 실패 경로 보고서 — `regression.mjs` 가 이 문서를 근거로 돕니다 |
| [`docs/ux/`](docs/ux/) | 체감 성능과 대기 심리 · 정보 구조와 접근성 · 프로듀서 관점 |
| [`docs/tone-js-차용.md`](docs/tone-js-차용.md) · [`docs/mutable-차용.md`](docs/mutable-차용.md) | 외부 코드 조사 |
| [`tools/측정결과-신규음색.md`](tools/측정결과-신규음색.md) | 새 음색의 배음 실측 결과 |

**시점 기록** — 당시의 판단을 남긴 글입니다. **현행 명세가 아닙니다.**

| 문서 | 무엇 |
|---|---|
| [`genre-reference.md`](genre-reference.md) | 옛 문서 색인(2026-08). 지금은 이 README 가 그 역할입니다 |
| [`presets/audit.md`](presets/audit.md) · [`presets/roadmap.md`](presets/roadmap.md) | 프리셋 감사와 커버리지 — 2026-08 기준 |
| [`ui-review.md`](ui-review.md) · [`audio-review.md`](audio-review.md) | UI·사운드 감사 기록 |
| [`consulting/`](consulting/) | ISP · EA · ISMP — 음원 상품화로 확장하는 **미래 기획서**(2026-08). 현행 시스템 설명이 아닙니다 |

## 측정 먼저

음색을 바꾸면 `tools/` 의 하네스로 재고 공표된 악기 레퍼런스 값과 대조합니다.
귀로만 판단하지 않는 것이 이 저장소의 규칙입니다. 하네스는 `tools/_app-harness.js`
가 `src/` 를 **직접 로드**해서 돌기 때문에 앱과 따로 코드를 옮겨 적을 필요가
없습니다 — 예전에는 코드를 복사해 두고 있어서 앱이 바뀌면 하네스가 뒤처지는
드리프트 위험이 있었는데, 그 구조는 이제 사라졌습니다. 자세한 경위는
`ARCHITECTURE.md` 의 "주의" 절에 있습니다.

## 검사 돌리기

push·PR 마다 GitHub Actions 가 자동으로 돕니다(`.github/workflows/ci.yml`).
손으로 돌릴 때는 아래와 같습니다.

```
node tools/ci/all.mjs            # 전부
node tools/ci/all.mjs --static   # 브라우저 검사 빼고 — 몇 초. 커밋 전에 이것만이라도
node tools/ci/all.mjs --list     # 무엇을 도는지만 보기
```

**검사 목록은 `tools/ci/all.mjs` 한 곳에만 있습니다.** 예전에는 이 README 와
`ci.yml` 양쪽에 손으로 적혀 있었고, 그래서 갈라졌습니다 — README 대로 다 돌려도
`check-kit-engines` · `check-song-length` · `build-refdata --check` 가 빠져 CI 에서
떨어지곤 했습니다. 목록이 두 곳에 있으면 반드시 갈라집니다.

아래는 그중 눈여겨볼 것들입니다.

`check-css-vars.mjs` 는 눈으로만 보이는 부류를 잡습니다. 정의되지 않은 CSS
변수는 색만 빠지는 게 아니라 **그 선언 전체가 계산 시점에 무효** 가 됩니다 —
`border:1px solid var(--없음)` 은 `border-style` 까지 `none` 이 되어 선이 아예
안 그려지고, `background:var(--없음)` 은 배경이 통째로 날아갑니다. 콘솔에는
아무것도 안 남습니다.

`check-globals.mjs` 가 가장 중요합니다. 이 앱은 클래식 `<script>` 라 `src/` 의
최상위 선언 전부가 **하나의 전역 렉시컬 스코프**를 공유합니다(몇 개인지는 검사가 찍어 줍니다 — 이 문서에 숫자를 적어 두면 낡습니다). 두 파일이 같은
이름을 `const` 로 선언하면 브라우저가 그 뒤 스크립트를 전부 실행하지 않고
화면이 백지가 됩니다. 새 전역을 추가하기 전에 이것을 돌리세요.

`check-docs-sync.mjs` 는 **문서가 코드와 같은 말을 하는가**를 봅니다. `genres/` 의
«PULSE·16 설정값» 표와 `patterns/` 의 16칸 패턴 블록은 프리셋 파일의 값을 옮겨 적은
사본이라, 프리셋만 고치고 문서를 잊으면 조용히 갈라집니다. 갈라졌으면
`node tools/sync-docs.mjs` 가 **수치만** 다시 찍어 냅니다 — 절 구성이나 `←` 한 줄
설명 같은 사람이 쓴 글은 건드리지 않습니다.

브라우저 검사 넷(`smoke` · `regression` · `check-melody-profile` · `check-layout`)은
아래 MCP 서버의 `node_modules` 를 씁니다. 손으로 따로 부를 일이 있다면 회귀 시험의
빠른 판만 기억해 두면 됩니다.

```
node tools/ci/regression.mjs --quick  # 45초 재생 구간을 10초로 (손으로 볼 때만)
```

`check-layout.mjs` 는 «뭐가 자꾸 묻힌다» 를 숫자로 바꾼 것입니다. 컨트롤을
하나씩 얹다 보면 그리드가 조금씩 접힘선 아래로 밀려 내려갑니다 — 한 번에
알아채기 어렵고 쌓이면 못 쓰게 됩니다. 1440×900 에서 **장르 칩 · Play ·
첫 패드** 셋이 스크롤 없이 보여야 통과합니다.

회귀 시험은 **아직 안 고친 결함을 «예상된 실패» 로 따로 셉니다.** 그 목록은
`tools/ci/regression.mjs` 의 `KNOWN` 에 있습니다. 결함이 고쳐지면 시험이
**실패로 돌아서** 목록과 `docs/qa/01-신뢰성.md` 를 같이 갱신하라고 알려 줍니다.
임계값을 낮춰 통과시키지 마세요.

## 선율을 들어 보기

2026-09-17 부터 `melOn` 기본값이 **`true`** 입니다(`src/seq/sequencer.js`).
그래서 `mcp` 의 `render_wav` 로 그냥 렌더해도 선율이 납니다 — 예전에는 기본이
`false` 라 프리셋 자신의 1마디 `keys` 패턴만 울렸습니다.

그래도 선율·리프·베이스를 고친 뒤에는 이 도구를 쓰는 편이 낫습니다. **어느
선율이 걸렸는지 찍어 주고**, 특정 선율로 고정하거나 끈 대조군을 만들 수 있기
때문입니다.

```
node tools/render-melody.mjs Dancehall Ragga Afro-dancehall --sec 40
node tools/render-melody.mjs Ragga --mel rag_aaba    # 특정 선율로 고정
node tools/render-melody.mjs Dancehall --off         # 선율 끈 대조군
```

기본 길이가 64루프라 100 BPM 기준 한 바퀴가 약 2분 34초입니다(16마디는 39초).
`--sec` 를 짧게 주면 그 앞부분만 듣게 되므로, 브릿지·재현부까지 확인하려면
길이를 `16`·`32` 로 낮추거나 `--sec` 를 늘리세요. 결과는 `renders/` 에 쌓이고
`.gitignore` 의 `*.wav` 로 저장소에는 들어가지 않습니다. 어느 선율이 실제로
걸렸는지도 같이 찍습니다 — 풀에서 고르므로 회차마다 다를 수 있습니다.

## MCP 서버

```
cd mcp/pulse-audit
npm install
node selftest.js
```

`node_modules` 는 저장소에 넣지 않습니다. `tools/ci/` 의 브라우저 검사도
이 `node_modules` 를 가져다 씁니다 — 저장소에서 npm 이 필요한 곳은 여기 한 군데입니다.

## 레퍼런스 사용에 관하여

`genres/` 의 아티스트·앨범 목록은 **사람이 읽는 자료**입니다.
생성형 AI 프롬프트에 이름을 그대로 넣지 않습니다 — 파생된 서술 속성만 씁니다.
이유는 `consulting/` 에 적어 두었습니다.
