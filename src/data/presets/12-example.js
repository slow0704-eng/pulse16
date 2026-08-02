/* 프리셋 — 예제 (계열 X) · 2종
   pulse16-mk16.html 에서 분리. RAW 는 _raw.js 가 먼저 만든다. */
'use strict';

Object.assign(RAW, {

'Play Along':{bpm:125,swing:0,tone:1,
  kit:{kick:'punch',snare:'crack',clap:'tight',chat:'noise',ohat:'noise',tom:'analog'},
  tune:{kick:0,snare:0,tom:0,hat:0},
  bcfg:{eng:'fm',oct:36,semi:0,gate:62,glide:0,blend:46,drive:32,xover:130,tone:4200,
        sub:55,exc:32,duck:30,root:0,scale:'Major'},
  prob:{kick:0.55,snare:0.35,chat:0.80,clap:1,ohat:1,tom:1},
  smp:{chat:'drum-samples/CR78/hihat',snare:'drum-samples/CR78/snare'},
  kick:'X-------X-----x-',snare:'----X-------X-x-',clap:'----------------',
  chat:'xxxxxxxxxxxxxxxx',ohat:'----------------',tom:'----------------',
  bass:'0-------0--0-0--',
  keys:'0-------4-------',gtr:'0---0---4---4---'},

'Casio Cells':{bpm:120,swing:0,tone:1,
  kit:{kick:'tight',snare:'tight',clap:'tight',chat:'tick',ohat:'noise',tom:'synth'},
  tune:{kick:0,snare:0,tom:0,hat:0},
  bcfg:{eng:'casio',oct:36,semi:0,gate:70,glide:0,blend:44,drive:30,xover:130,tone:4200,
        sub:50,exc:30,duck:25,root:9,scale:'Minor Pentatonic'},
  prob:{kick:1,snare:1,chat:0.7,clap:1,ohat:1,tom:1},
  smp:{kick:'casio/A1',snare:'casio/Cs2',tom:'casio/E2',clap:'casio/Fs2'},
  kick:'X---X---X---X---',snare:'----X-------X---',clap:'--x-------x-----',
  chat:'xxxxxxxxxxxxxxxx',ohat:'----------------',tom:'------x-----x---',
  bass:'0---3---5---3---',
  keys:'0-------3-------',gtr:'0---0---3---3---'},

});
