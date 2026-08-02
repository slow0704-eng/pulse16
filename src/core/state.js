/* §4 상태
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ═══ §4  상태 ══════════════════════════════════════════════ */

/* ── 패턴 뱅크 A~D ── */
const blank = () => ({
  drums: Object.fromEntries(TRACKS.map(t => [t.id, new Array(STEPS).fill(0)])),
  bass : new Array(STEPS).fill(-1),
  /* 건반은 화음이라 스텝당 음이 여러 개 — ROWS(8) 개 음도를 비트마스크로 */
  keys : new Array(STEPS).fill(0),
  gtr  : new Array(STEPS).fill(-1),
  keys2: new Array(STEPS).fill(0),
  gtr2 : new Array(STEPS).fill(-1),
});
const banks = ['A','B','C','D'].map(blank);
let bank = 0, P = banks[bank];

/* ── 트랙별 상태 ── */
/* 음정 트랙. keys2·gtr2 는 **따로 도는 2번 트랙**입니다 —
   한 트랙 안에서 음을 덧대는 겹침(layerMode)과 다릅니다.
   각자 자기 음색·볼륨·음소거를 갖고 자기 선율을 연주합니다. */
const TONAL = ['bass','keys','gtr','keys2','gtr2'];
const mute   = Object.fromEntries([...TRACK_IDS.map(id => [id,false]), ...TONAL.map(id=>[id,false])]);
const lvl    = Object.fromEntries([...TRACKS.map(t => [t.id,t.gain]),
                                   ['bass',0.72],['keys',0.58],['gtr',0.50],
                                   ['keys2',0.44],['gtr2',0.40]]);
const eng    = {kick:'deep',snare:'crack',clap:'tight',chat:'noise',ohat:'noise',tom:'wood',
                perc:'shaker', bass:'sub', keys:'pad', gtr:'clean',
                keys2:'strings', gtr2:'clean'};
const src    = Object.fromEntries([...TRACK_IDS, ...TONAL].map(id => [id,'Boom Bap']));
const smpSel = Object.fromEntries(TRACK_IDS.map(id => [id,'synth']));
const probT  = Object.fromEntries(TRACK_IDS.map(id => [id,1]));

/* ── 음정 상태 ── */
let rootNote = 9, scaleName = 'Minor Pentatonic', baseOct = 24;

/* ── 오디오 노드 (boot 에서 생성) ── */
let ctx=null, mixBus=null, sumBus=null, busTrim=null, masterGain=null, satIn=null, satOut=null,
    noiseBus=null, pinkBus=null, metalBus=null, metalBP=null, CURVES=null,
    gtrFX=null,                       // Tone.js 페이저·와·코러스 (기타 버스)
    tpClip=null,                      // 최종단 트루피크 실링
    convolver=null, revReturn=null, duckNode=null, lowGain=null, excGain=null,
    glueComp=null, limComp=null, meterOut=null, meterBass=null, widener=null,
    sendMono=null;
const chan={}, panner={}, send={}, IR={};

/* ── 노드 재활용 풀 ── */
const pool = {gain:[], bq:[]}, retireQ = [];
let liveNodes = 0, booted = false;

/* ── 샘플 캐시 ── */
const bufCache = new Map(), trackPlayer = {}, loopPlayer = {};
let piano=null, pianoReady=false, casio=null, casioReady=false;

/* ── 재생 상태 ── */
let playing=false, step=0, fbTimer=null, fbNext=0, fbStep=0;
const drawQ = [];

/* ── 보이스 추적 ── */
let openHat=null, bassRef=null, smpOpen=false;

/* ── 건반·기타 ── */
let keysOct=48, gtrOct=36;                 // 기준 옥타브 (MIDI)
let TUBE=null, ampIn=null, keysWet=null;
const gtrDrv={};

/** 최종단 트루피크 실링 커브.

    limComp 는 attack 4ms 라 1ms 급 킥 클릭을 못 잡는다. 실측에서
    정상상태 상한은 −3.53 dBFS 인데 트랜지언트가 그것을 3.5dB 뚫고 나와
    Death Metal · Black Metal 이 0 dBFS 를 넘었다(둘 다 −8 LUFS 급).
    프리셋 손잡이(duck·drive·sub·exc·tune)로는 못 고친다 —
    첨두를 만드는 것은 킥이고 duck 은 베이스·건반만 누르기 때문이다.

    그래서 샘플 단위로 즉시 듣는 소프트 클리퍼를 하나 더 둔다.
      · thr 아래는 **손대지 않는다** — 라우드니스를 지키는 자리다
      · thr 위는 tanh 로 눌러 ceil 에 점근한다

    ⚠ oversample 은 반드시 'none'. 4x 재구성 필터의 Gibbs 오버슈트가
      첨두를 잡으라고 넣은 노드에서 첨두를 만든다(esh 가 실제로 그렇다).
      대신 ceil 을 0 dBFS 가 아니라 −1 dB 로 두어 인터샘플 여유를 남긴다. */
function mkCeiling(thr, ceil){
  const n=8192, c=new Float32Array(n), k=ceil-thr;
  for(let i=0;i<n;i++){
    const x=i/(n/2)-1, a=Math.abs(x);
    c[i] = a<=thr ? x : Math.sign(x)*(thr + k*Math.tanh((a-thr)/k));
  }
  return c;
}

/** 튜브 프리앰프 커브. bias 가 대칭을 깨서 짝수 배음(= 옥타브 위)을 만든다.
    off 를 빼야 f(0)=0 이라 상시 체인에 영구 DC 가 남지 않는다. */
function mkTube(k,bias){
  const n=8192, c=new Float32Array(n);
  const off=Math.tanh(bias*k);
  const norm=Math.max(Math.abs(Math.tanh((1+bias)*k)-off),
                      Math.abs(Math.tanh((-1+bias)*k)-off));
  for(let i=0;i<n;i++){
    const x=i/(n/2)-1;
    c[i]=(Math.tanh((x+bias)*k)-off)/norm;
  }
  return c;
}
