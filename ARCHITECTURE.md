# PULSE·16 파일 구조

`pulse16-mk16.html` 한 파일에 7090줄이 들어 있던 것을 갈랐습니다.
HTML 에는 마크업과 로드 목록만 남았습니다.

## 왜 클래식 스크립트인가

ES 모듈이 아니라 평범한 `<script src>` 입니다. 이유가 둘입니다.

- **`file://` 로 열립니다.** ES 모듈은 CORS 로 막혀 로컬 서버가 있어야 합니다.
  더블클릭으로 여는 흐름을 지키려면 클래식이어야 합니다.
  (MCP 계측 도구는 어차피 임시 HTTP 서버를 띄우므로 영향이 없습니다.)
- **코드를 안 건드리고 갈랐습니다.** 최상위 `const`/`let` 은 파일이 달라도
  전역 렉시컬 스코프를 공유하므로, 앞 파일이 선언한 것을 뒤 파일이 그대로 씁니다.
  `import`/`export` 를 수백 곳에 다는 대신 잘라 옮기기만 했습니다.
  분리 전후 로직 코드가 한 글자도 다르지 않음을 확인했습니다(주석 2줄 제외).

**그래서 `<script>` 순서가 곧 의존 순서입니다.** 순서를 바꾸면 깨집니다.
실제로 무언가를 *실행* 하는 파일은 `src/main.js` 하나뿐이고,
나머지는 선언만 합니다. 새 파일을 끼울 때는 이 규칙을 지키세요.

> IIFE 를 걷어내면서 최상위 `function` 이 전역 프로퍼티가 됐습니다.
> `id` 가 붙은 요소도 같은 이름의 암묵 전역을 만들기 때문에,
> `duck()` 은 `#duck` 슬라이더와 부딪히지 않도록 `duckSidechain()` 으로 바꿨습니다.
> **`id` 와 같은 이름의 최상위 함수를 새로 만들지 마세요.**

## 지도

아래는 실제 `<script>` 로드 순서 그대로입니다 — 이 문서에서 위→아래 순서가
곧 의존 순서입니다.

```
pulse16-mk16.html      마크업 + link/script 목록 (490줄 안팎 — 계속 자랍니다,
                        정확한 숫자는 굳이 맞추지 말고 grep 으로 확인하세요)

vendor/
  tone-14.7.77.js      Tone.js (MIT, tone-LICENSE.md 동봉). 예전에 cdnjs 에서
                       받던 것을 2026-08-15 에 들여왔습니다 — 버전을 파일명에
                       박아 뒀으니 올릴 때는 새 파일을 두고 HTML 한 줄만 바꾸세요
fonts/
  *.woff2 (8)          Barlow · Barlow Condensed · Space Mono 의 latin 서브셋
  OFL.txt              위 셋의 SIL Open Font License 1.1 원문
                       ⚠ 여기에 외부 오리진을 다시 들이지 마세요 —
                         이 페이지는 이제 자기 자신 말고 아무 데도 접속하지 않습니다
                         (샘플을 고를 때만 예외). docs/perf/04-외부의존성.md

styles/
  fonts.css            위 woff2 의 @font-face. tokens.css 앞에 옵니다
  tokens.css           디자인 토큰 (색·간격 변수)
  layout.css           레이아웃 뼈대 · 헤더 · 반응형
  rack.css             패턴 라이브러리 · 샘플 뱅크 · 트랜스포트 · FX · 미터
  sequencer.css        시퀀서 그리드 · 피아노롤
  controls.css         폼 컨트롤 공통 · 단축키 오버레이

src/
  core/
    config.js          §1  HAS_TONE · STEPS · TRACKS · ENGINES
    engines.js             건반 엔진표(KENG) · 기타 엔진표(GTR)
    scale.js               NOTES · SCALES · 튠 노브 대응 · 계열(CATS)
  data/
    preset-index.js        PRESET_SUB(하위 분기) · PRESET_CAT(계열)
                           TONE_KIT — 하위분기별 건반·기타·베이스·타악기 배정
    pattern-codec.js   §2  패턴 문자열 ↔ 숫자 배열 (pat/bpat/kpat/TRIAD)
    presets/
      _raw.js              const RAW = {}  ← 그릇
      01-rock.js …         장르별 프리셋. Object.assign(RAW, {…})
      12-example.js
      _build.js            RAW → LIB 전개. 장르 파일 뒤에 와야 한다
    fills.js                필인 라이브러리(FILLS) · fillPoolFor()
    melody.js               16마디 선율·리프·베이스 라이브러리(MELODY·RIFF·
                           BLINE) · PHRASE·FORM(프레이즈 결합 폼, 곡 구조의
                           SONG_FORM 과 다름 — 아래 "이름 충돌" 참고)
    harmony.js              화성 진행(PROG·PROG_NAMES)·컴핑(COMP)·
                           chordDegAt·chordSemis·snapDeg — melody.js 다음,
                           core/dom.js 앞
  core/ (계속)
    dom.js             §3  UI 객체 · knob() · setKnob()
    state.js           §4  뱅크 · 트랙 상태 · 전역 오디오 노드 선언
    util.js            §5  노드 풀 · BQ/G/osc · env/env2 · Q_DB
  audio/
    modal.js                모달 공진 뱅크 — 몸통 공명을 직렬 peaking 대신
                           병렬 밴드패스로(graph.js 의 boot() 이 바로 씀).
                           core/util.js 다음, audio/graph.js 앞
    graph.js           §6  버스 · 앰프 체인 · 리버브 · 마스터
    sampler.js         §7  샘플 로딩
    params.js          §8  파라미터 적용
    voice-drum.js      §9  킥·스네어·클랩·하이햇·톰·퍼커션 · 사이드체인
    string.js              뜯은 현 코어 (Karplus-Strong) — 기타와 베이스가 공용
    voice-bass.js      §9  베이스 (합성 5종 + 현 4종)
    struck.js               타현(비조화 가법합성) — keys/piano·vibes·marimba 등
    voice-keys.js      §9-B 건반 · 신스
    voice-gtr.js       §9-C 기타 · 밴조 · 만돌린 · 시타르 · 피들(찰현)
  seq/
    arrange.js              (신규) 곡 구조(섹션)·트랙별 그루브 — SONG_FORM·
                           SONG_FORM_NAMES·formOn/formMode·GROOVE·
                           GROOVE_NAMES·grooveOn/grooveMode. voice-gtr.js
                           다음, seq/sequencer.js 앞
    sequencer.js       §10 스텝 스케줄링 — progOn·chordRoot 등 harmony.js ·
                           arrange.js 의 전역을 typeof 로 방어하며 쓴다
  ui/
    meters.js          §11 화면 갱신 · 미터
    build.js           §12 UI 구성
    edit.js            §12.5 실행취소 · 자동 저장 · 패널 · 드래그
    events.js          §13 이벤트 바인딩
  main.js              §14 초기화 — 유일하게 실행하는 파일

tools/                 계측·검증 하네스 (헤드리스로 도는 독립 HTML)
  measure-voices.html  드럼 보이스 실측
  measure-tonal.html   베이스·건반·기타 실측 (배음 구조)
  tune-guitar.html     기타 여기 모델 원인 분리
  verify-*.html        DSP 단위 검증
  _app-harness.js      src/ 를 직접 로드해 위 하네스들에게 진짜 앱 그래프를
                       내어주는 공용 모듈 (아래 "주의" 참고)
  render-melody.mjs    **선율을 켠 채** 녹음해 renders/ 에 WAV 를 남긴다.
                       melOn 기본값이 false 라 mcp 의 render_wav 로는 16마디
                       선율이 한 음도 안 난다 — MELODY·RIFF·BLINE 을 고치고
                       귀로 확인하려면 이쪽을 쓴다
  ci/                  자동 검사 — 브라우저 없이, 외부 의존성 없이 도는 Node 스크립트
    _lib.mjs           공용: 파일 훑기 · 주석/문자열 지우기 · 최상위 선언 수집 ·
                       HTML 의 <script src> · id 목록
    check-syntax.mjs   src·tools·mcp 의 모든 .js/.mjs 를 node --check
    check-globals.mjs  **전역 이름 충돌** — 로드 순서대로 이어붙여 파서에게 묻고
                       (브라우저와 같은 규칙), 따로 전수 조사도 한다.
                       id 와 같은 이름의 최상위 function 은 경고 (duck 사고)
    check-load-order.mjs  HTML 의 <script> 목록 ↔ 디스크 ↔ 이 지도 대조
    _browser.mjs       브라우저 검사 공용: 정적 서버 · 콘솔/예외 수집 · 타임아웃.
                       playwright·axe-core 는 mcp/pulse-audit/node_modules
                       에서 가져온다 — 루트에 package.json 을 두지 않는다
    smoke.mjs          앱이 실제로 뜨는가 — 콘솔 에러 0건 · 프리셋 로딩 ·
                       Play 3초 · file:// · axe 보고(실패시키지 않음)
    regression.mjs     docs/qa/01-신뢰성.md 의 결함 재발 검사 (R1·R3·R4·R5·R6 +
                       손상 저장본 8종). 아직 안 고친 결함은 KNOWN 목록에 두고
                       «예상된 실패» 로 센다 — 고쳐지면 실패로 돌아서 알린다
    check-melody-profile.mjs
                       genres/profiles/*.json ↔ melody.js 대조. 프레이즈가
                       자기 프로파일 수치를 만족하는지, 근거 형식(곡 제목이
                       못 들어가게)이 맞는지, «차이가 없는데 다른 풀» 과
                       «차이가 있는데 같은 풀» 을 양방향으로 본다
genres/profiles/       장르 프로파일 — 선율·리프·베이스 배정의 «왜» 를 담은
  *.json               근거 자료. 배치(하위분기) 하나 = 파일 하나.
                       ⚠ 런타임에 읽지 않습니다. 앱이 읽는 것은 melody.js 이고
                         이 JSON 은 근거이며, 둘이 어긋나면 CI 가 잡습니다
mcp/pulse-audit/       계측 MCP 서버 (harness · render_wav · audio_measure · a11y)
                       + tools/ci/ 의 브라우저 검사가 쓰는 node_modules 의 집
.github/workflows/
  ci.yml               push·PR 마다 위를 돌린다. job 1 static(정적, 5분 상한) →
                       통과해야 job 2 browser(스모크·회귀, 20분 상한). 크로미움은
                       package-lock.json 해시를 키로 캐시한다
```

**새 파일을 끼울 위치는 이 지도의 줄 순서 그 자체입니다** — 표에 없는
파일을 추가했다면 실제로 로드되는 자리에 맞춰 이 지도도 같이 고치세요.

**이름 충돌 주의**: `data/melody.js` 가 이미 최상위 `const FORM`(AABA·AABB 같은
프레이즈 결합 폼)을 선언하고 있어서, `seq/arrange.js` 의 "곡 구조(섹션)"
기능은 원래 합의된 `FORM`/`FORM_NAMES` 대신 `SONG_FORM`/`SONG_FORM_NAMES` 로
이름을 바꿨습니다. 같은 전역 스코프에서 `const` 를 두 번 선언하면 전체
스크립트가 죽으므로(`Identifier 'FORM' has already been declared`), 새 전역을
추가할 때는 먼저 `grep -rn "^const NAME\b\|^let NAME\b\|^function NAME\b" src/`
로 겹치는 이름이 없는지 확인하세요.

## 프리셋 추가

장르 파일 하나만 열면 됩니다. `Object.assign(RAW, {…})` 안에 항목을 넣으면
`_build.js` 가 알아서 `LIB` 로 전개합니다. 계열이 `cat:` 으로 안 붙어 있으면
`data/preset-index.js` 의 `PRESET_CAT` 에 이름을 등록하세요.

## 트랙

드럼 7트랙(`kick snare clap chat ohat tom perc`) + 음정 3트랙(`bass keys gtr`).
`perc` 는 나중에 늘린 트랙이라 **옛 프리셋·저장본에는 그 자리가 없습니다.**
- `pat()` 이 패턴 없는 트랙을 빈 패턴으로 칩니다 (`data/pattern-codec.js`)
- `fillTracks()` 가 저장본·스냅샷의 빠진 트랙을 메웁니다 (`ui/edit.js`)
- 프리셋이 안 적은 엔진은 덮어쓰지 않습니다 (`if(L.kit[id]) eng[id]=…`)

트랙을 또 늘린다면 이 셋을 같이 보세요.

## 프리셋의 악기 배정

프리셋은 드럼 엔진(`kit`)과 베이스 설정(`bcfg`)만 적습니다.
건반·기타·타악기는 `TONE_KIT` 이 **하위분기 단위로** 배정하고,
`presets/_build.js` 가 `LIB` 를 만들 때 채웁니다.

우선순위는 **프리셋이 직접 적은 값 > TONE_KIT > 계열 기본값** 입니다.
특정 프리셋만 다르게 하고 싶으면 그 프리셋의 `kit` 에 적으면 됩니다.

`TONE_KIT` 항목이 쓰는 필드:

| 필드 | 뜻 |
|---|---|
| `keys` `gtr` `bass` `perc` | 그 장르가 쓰는 음색 |
| `pperc` | perc 기본 패턴 (엔진만 주면 트랙이 조용합니다) |
| `lvl` | 악기별 볼륨 — 장르마다 주인공이 다릅니다 |
| `off` | 그 장르가 안 쓰는 악기. 음소거가 아니라 **패턴을 비웁니다** |

`off` 를 음소거로 안 한 이유는, 음소거는 상태로 남아 다음 프리셋까지
따라가지만 빈 패턴은 프리셋에 딸린 성질이라 롤에서 찍으면 바로 살아나기
때문입니다.

## 셔플 주기

킷 셔플과 패턴 셔플은 각자 카운터를 갖지 않고 `loopNo` 하나를 같이 봅니다
(`seq/sequencer.js`). `loopNo % every === 0` 으로 판정하므로 주기가 같으면
항상 같은 박에서 함께 바뀌고, 4와 8처럼 배수 관계여도 8루프마다 겹칩니다.
스위치를 켤 때 카운터를 0 으로 되돌리면 이 성질이 깨집니다 — 되돌리지 마세요.

## 악기 추가

1. `core/engines.js` 에 파라미터표를 넣습니다.
2. `core/config.js` 의 `ENGINES` 에 표시 이름을 등록합니다.
3. `audio/voice-*.js` 에 합성 코드를 씁니다.
4. `tools/measure-tonal.html` 을 열어 배음 구조를 실측하고 실제 악기
   기준값과 대조합니다. 하네스가 `src/` 를 직접 로드하므로 **옮겨 적을 것은
   없습니다** — 1·2 번을 했으면 새 음색이 목록에 저절로 나타납니다.
   **귀로 판단하지 말고 수치로 확인하세요** — 기타 기음이 27dB 죽어 있던 것도
   측정으로만 드러났습니다.

## 주의

`tools/` 의 하네스는 예전에 앱 코드를 **복사해서** 썼습니다. 그래서 앱이
바뀌면 하네스가 뒤처졌고, 실제로 오래 틀린 값을 재고 있었습니다 —
`keys/piano`·`vibes`·`marimba` 는 앱이 `struck.js` 로 옮겨간 뒤에도
하네스가 옛 FM 경로를 재고 있었으므로, 표에 적힌 배음이 **앱에서 나는 소리가
아니었습니다.** `perc/scratch`·`gtr/fuzz`·`keys/vocoder` 등은 아예 빠져 있었습니다.

지금은 `tools/_app-harness.js` 가 `src/` 를 **직접 로드**합니다.
`dom.js`·`ui/*`·`main.js` 자리를 메우고 `boot()` 이 만드는 AudioContext 를
`OfflineAudioContext` 로 바꿔치기해, 앰프·캐비닛·몸통 필터를 포함한
**앱의 진짜 그래프**를 오프라인에서 돌립니다. 노브 기본값도
`pulse16-mk16.html` 에서 읽습니다. 그래서 **복사도, 동기화도 필요 없습니다** —
`ENGINES` 에 등록만 하면 하네스가 알아서 훑습니다.

측정 결과는 `tools/측정결과-신규음색.md` 에 남깁니다.
