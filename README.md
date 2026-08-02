# PULSE·16

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
| `src/audio/` | 오디오 그래프와 보이스 — 드럼 / 현(Karplus-Strong) / 타현(비조화 가법합성) / 건반 / 기타 |
| `src/data/` | 장르 프리셋 · 필인 · 선율 라이브러리 |
| `src/seq/` | 시퀀서 — 스텝 스케줄링, 필인, 선율 전개, 킷·패턴 셔플 |
| `src/ui/` | 화면 구성 · 이벤트 · 미터 · 저장 |
| `tools/` | 계측 하네스 (스펙트럼·감쇠·선율 지표) |
| `mcp/pulse-audit/` | 오프라인 렌더와 측정을 자동화하는 MCP 서버 |

설계 배경과 각 결정의 근거는 [`ARCHITECTURE.md`](ARCHITECTURE.md) 에 있습니다.

## 문서

- [`genres/`](genres/) — 세부장르별 특징과 대표 레퍼런스
- [`melody/`](melody/) — 화성·선율 이론과 선율 라이브러리의 근거
- [`patterns/`](patterns/) — 패턴 표기법과 리듬 자료
- [`consulting/`](consulting/) — ISP · EA · ISMP
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — 파일 분리 구조와 알려진 위험

## 측정 먼저

음색을 바꾸면 `tools/` 의 하네스로 재고 공표된 악기 레퍼런스 값과 대조합니다.
귀로만 판단하지 않는 것이 이 저장소의 규칙입니다. 하네스가 앱 코드를 **복사**해 쓰는
드리프트 위험은 `ARCHITECTURE.md` 에 적어 두었습니다.

## MCP 서버

```
cd mcp/pulse-audit
npm install
node selftest.js
```

`node_modules` 는 저장소에 넣지 않습니다.

## 레퍼런스 사용에 관하여

`genres/` 의 아티스트·앨범 목록은 **사람이 읽는 자료**입니다.
생성형 AI 프롬프트에 이름을 그대로 넣지 않습니다 — 파생된 서술 속성만 씁니다.
이유는 `consulting/` 에 적어 두었습니다.
