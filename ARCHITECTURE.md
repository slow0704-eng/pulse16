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

```
pulse16-mk16.html      마크업 + link/script 목록 (388줄)

styles/
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
    dom.js             §3  UI 객체 · knob() · setKnob()
    state.js           §4  뱅크 · 트랙 상태 · 전역 오디오 노드 선언
    util.js            §5  노드 풀 · BQ/G/osc · env/env2 · Q_DB
  data/
    preset-index.js        PRESET_SUB(하위 분기) · PRESET_CAT(계열)
                           TONE_KIT — 하위분기별 건반·기타·베이스·타악기 배정
    pattern-codec.js   §2  패턴 문자열 ↔ 숫자 배열 (pat/bpat/kpat/TRIAD)
    presets/
      _raw.js              const RAW = {}  ← 그릇
      01-rock.js …         장르별 프리셋. Object.assign(RAW, {…})
      12-example.js
      _build.js            RAW → LIB 전개. 장르 파일 뒤에 와야 한다
  audio/
    graph.js           §6  버스 · 앰프 체인 · 리버브 · 마스터
    sampler.js         §7  샘플 로딩
    params.js          §8  파라미터 적용
    voice-drum.js      §9  킥·스네어·클랩·하이햇·톰·퍼커션 · 사이드체인
    string.js              뜯은 현 코어 (Karplus-Strong) — 기타와 베이스가 공용
    voice-bass.js      §9  베이스 (합성 5종 + 현 4종)
    voice-keys.js      §9-B 건반 · 신스
    voice-gtr.js       §9-C 기타 · 밴조 · 만돌린 · 시타르 · 피들(찰현)
  seq/
    sequencer.js       §10 스텝 스케줄링
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
mcp/pulse-audit/       계측 MCP 서버 (harness · render_wav · audio_measure · a11y)
```

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
4. `tools/measure-tonal.html` 에 같은 코드를 옮겨 배음 구조를 실측하고,
   실제 악기 기준값과 대조합니다. **귀로 판단하지 말고 수치로 확인하세요** —
   기타 기음이 27dB 죽어 있던 것도 측정으로만 드러났습니다.

## 주의

`tools/` 의 하네스는 앱 코드를 **복사해서** 씁니다(오프라인 렌더가 목적이라
앱의 라이브 그래프를 못 씁니다). 보이스 코드를 고치면 하네스도 같이 고쳐야
측정이 유효합니다. 지금은 `measure-tonal.html` 이 `voice-gtr.js`·`voice-bass.js`·
`voice-keys.js` 를, `measure-voices.html` 이 `voice-drum.js` 를 따라갑니다.
