/* 음정 · 스케일 · 튠 노브 대응 · 프리셋 계열(CATS)
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ── 음정 ── */
const NOTES  = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const SCALES = {'Minor Pentatonic':[0,3,5,7,10,12,15,17],'Natural Minor':[0,2,3,5,7,8,10,12],
  'Dorian':[0,2,3,5,7,9,10,12],'Major':[0,2,4,5,7,9,11,12]};

/* ── 옥타브당 음 수 ──────────────────────────────────────────
   7화음·9화음·13화음은 도수를 6·8·12 까지 쌓습니다. SCALES 배열은 8칸뿐이라
   그 위를 못 읽습니다. 옥타브를 넘어가려면 «몇 음마다 한 옥타브인가» 를
   알아야 하는데, **펜타토닉만 5음이고 나머지는 7음입니다.**

   SCALES 배열이 이미 그렇게 생겼습니다:
     Natural Minor [0,2,3,5,7,8,10,12]  ← 7번 칸이 12 = 0번 칸의 옥타브 위
     Minor Pentatonic [0,3,5,7,10,12,15,17]
                       └─ 5번 칸이 12 = 0번의 옥타브, 6번 15 = 1번(3)의 옥타브
   그래서 주기를 5 로 잡아야 펜타토닉의 9도가 «2도의 옥타브 위» 가 됩니다. */
const SCALE_N = {'Minor Pentatonic':5, 'Natural Minor':7, 'Dorian':7, 'Major':7};

/** 도수 → 토닉 기준 반음. d 가 8 이상이어도 된다.

    ⚠ d 가 0~7 이면 **SCALES[scaleName][d] 와 정확히 같은 값**을 돌려준다.
      네 스케일 전부에서 확인했다 — 그래서 기존 코드를 이 함수로 갈아끼워도
      소리가 한 샘플도 안 바뀐다.
        Natural Minor d=7 → SCALES[0]+12 = 12 = SCALES[7] ✔
        Pentatonic    d=6 → SCALES[1]+12 = 15 = SCALES[6] ✔ */
function degSemi(d, scaleName){
  const sc = SCALES[scaleName] || SCALES['Natural Minor'];
  const n  = SCALE_N[scaleName] || 7;
  const oct = Math.floor(d / n);
  return sc[d - oct*n] + 12*oct;
}

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
