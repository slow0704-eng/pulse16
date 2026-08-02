/* 음정 · 스케일 · 튠 노브 대응 · 프리셋 계열(CATS)
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ── 음정 ── */
const NOTES  = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const SCALES = {'Minor Pentatonic':[0,3,5,7,10,12,15,17],'Natural Minor':[0,2,3,5,7,8,10,12],
  'Dorian':[0,2,3,5,7,9,10,12],'Major':[0,2,4,5,7,9,11,12]};

/* ── 트랙 id → 튠 노브 id / 프리셋 tune 키 ── */
const TUNE_KNOB = {kick:'ktune',snare:'stune',tom:'ttune',chat:'htune',ohat:'htune'};
const TUNE_KEY  = {kick:'kick', snare:'snare',tom:'tom',  chat:'hat',  ohat:'hat'};

/* ── 프리셋 계열 분류 (genres/00-tree.md 의 A~K 와 동일) ── */
const CATS = [
  {id:'all', label:'전체'},
  {id:'A', label:'Rock'},      {id:'B', label:'Pop'},       {id:'C', label:'Hip Hop'},
  {id:'D', label:'R&B·Funk'},  {id:'E', label:'Electronic'},{id:'F', label:'Jazz'},
  {id:'G', label:'Roots'},     {id:'H', label:'Latin'},     {id:'I', label:'Caribbean'},
  {id:'J', label:'African'},   {id:'K', label:'World'},     {id:'X', label:'예제'},
];
