/* 프리셋 — World (계열 K) · 2종
   pulse16-mk16.html 에서 분리. RAW 는 _raw.js 가 먼저 만든다. */
'use strict';

Object.assign(RAW, {

'Bhangra':{bpm:145,swing:0,
  kit:{kick:'wood',snare:'body',clap:'tight',chat:'noise',ohat:'noise',tom:'wood'},
  tune:{kick:-3,snare:1,tom:4,hat:2},
  bcfg:{eng:'sub',oct:24,semi:0,gate:64,glide:0,blend:44,drive:32,xover:120,tone:4000,
        sub:56,exc:30,duck:24,root:9,scale:'Major'},
  kick:'X---X---X---X---',snare:'----X-------X---',clap:'----------------',
  chat:'x-x-x-x-x-x-x-x-',ohat:'----------------',tom:'--x-x---x-x-x---',
  bass:'0---0---5---5---',
  keys:'0---0---2---2---',gtr:'0-------2-------'},

/* ═══ 파생 프리셋 152종 ═══════════════════════════════════════
   data/genres.json 의 bpm·feel·tags 에서 규칙으로 유도했습니다.
   골격은 §7-B 원형을 상속하고, 킷·튠·bcfg 는 태그 기반 매핑입니다.
   gen:1 로 표시되며 UI 에서 점(·)이 붙습니다.
   손으로 쓴 위쪽 프리셋들과 달리 개별 청감 검증을 거치지 않았습니다.
   ═════════════════════════════════════════════════════════ */

'Global Bass':{bpm:115,swing:0,cat:'K',gen:1,
  kit:{kick:'punch',snare:'body',clap:'tight',chat:'noise',ohat:'noise',tom:'analog'},
  tune:{kick:-2,snare:0,tom:-2,hat:0},
  bcfg:{eng:'sub',oct:36,semi:0,gate:80,glide:0,blend:40,drive:32,xover:120,tone:4000,
        sub:56,exc:32,duck:28,root:9,scale:'Minor Pentatonic'},
  kick:'X-------X-------',snare:'---x--x----x--x-',clap:'----x-------x---',
  chat:'x-x-x-x-x-x-x-x-',ohat:'----------------',tom:'----------------',
  bass:'0--0--0-5--5--3-',
  keys:'--0---0---3---3-',gtr:'----------------'},

/* ── 2차 파생 142종 — genres/*.md 표에서 genres.json 으로 승격 후 생성 ── */

});
