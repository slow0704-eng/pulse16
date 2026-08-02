/* §1 상수 · 설정 — 트랙 정의와 음색 엔진 목록
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ═══ §1  상수 · 설정 ═══════════════════════════════════════ */

const HAS_TONE   = typeof window.Tone !== 'undefined';
const AUDIO_BASE = 'https://tonejs.github.io/audio/';
const STEPS = 16, ROWS = 8;

/* ── 샘플 뱅크 ── */
const KITS = ['CR78','KPR77','Kit3','Kit8','LINN','R8','Stark','Techno',
              '4OP-FM','Bongos','acoustic-kit'];
const KIT_LABEL = {
  'CR78':'CR78 빈티지','KPR77':'KPR77 8비트','Kit3':'Kit3 룸','Kit8':'Kit8 게이트',
  'LINN':'LINN 80s','R8':'R8 클린','Stark':'Stark 어택','Techno':'Techno 클럽',
  '4OP-FM':'4OP-FM','Bongos':'Bongos','acoustic-kit':'Acoustic'};
const KIT_FILES  = ['kick','snare','hihat','tom1','tom2','tom3'];
const CASIO_STEP = ['A1','Cs2','E2','Fs2'];
const KIT_MAP    = {kick:'kick',snare:'snare',chat:'hihat',ohat:'hihat',tom:'tom1',clap:'tom3',
                    perc:'tom2'};

const LOOP_CANDIDATES = [
  {n:'ominous',   u:'drum-samples/loops/ominous.mp3'},
  {n:'chorus',    u:'drum-samples/loops/chorus.mp3'},
  {n:'drums',     u:'drum-samples/loops/drums.mp3'},
  {n:'breakbeat', u:'drum-samples/loops/breakbeat.mp3'},
  {n:'handdrum',  u:'drum-samples/handdrum-loop.mp3'},
  {n:'conga',     u:'drum-samples/conga-rhythm.mp3'},
  {n:'theremin',  u:'berklee/gurgling_theremin_1.mp3'},
];
const PIANO_URLS = {'A0':'A0.mp3','C1':'C1.mp3','D#1':'Ds1.mp3','F#1':'Fs1.mp3',
  'A1':'A1.mp3','C2':'C2.mp3','D#2':'Ds2.mp3','F#2':'Fs2.mp3',
  'A2':'A2.mp3','D#3':'Ds3.mp3','C3':'C3.mp3','F#3':'Fs3.mp3','A3':'A3.mp3'};
const CASIO_URLS = {'A1':'A1.mp3','A#1':'As1.mp3','B1':'B1.mp3','C2':'C2.mp3',
  'C#2':'Cs2.mp3','D2':'D2.mp3','D#2':'Ds2.mp3','E2':'E2.mp3','F2':'F2.mp3',
  'F#2':'Fs2.mp3','G2':'G2.mp3','G#2':'Gs2.mp3','A2':'A2.mp3'};

/* ── 드럼 트랙 정의 ──
   tom 과 perc 는 둘 다 타악기 트랙이지만 역할이 갈립니다.
   tom  = 음정이 있는 막울림 (튠 노브를 따라감) — 톰·콩가·봉고·팀발레·로그드럼·카우벨
   perc = 음정이 없는 금속·나무 (튠 안 따름) — 셰이커·탬버린·클라베·귀로·아이언
   Afrobeats 처럼 콩가와 셰이커가 동시에 필요한 장르 때문에 나눴습니다.
   perc 는 오른쪽으로 넓게 벌려 tom(왼쪽)과 자리가 겹치지 않게 합니다. */
const TRACKS = [
  {id:'kick',  label:'Kick',       tone:'var(--t-kick)',  gain:1.00, pan: 0.00, send:0.02},
  {id:'snare', label:'Snare',      tone:'var(--t-snare)', gain:0.68, pan:-0.06, send:0.24},
  {id:'clap',  label:'Clap',       tone:'var(--t-clap)',  gain:0.54, pan:-0.30, send:0.32},
  {id:'chat',  label:'Hat Closed', tone:'var(--t-chat)',  gain:0.38, pan: 0.30, send:0.09},
  {id:'ohat',  label:'Hat Open',   tone:'var(--t-ohat)',  gain:0.32, pan: 0.38, send:0.18},
  {id:'tom',   label:'Tom',        tone:'var(--t-tom)',   gain:0.54, pan:-0.34, send:0.26},
  {id:'perc',  label:'Perc',       tone:'var(--t-perc)',  gain:0.46, pan: 0.44, send:0.20},
];
const TRACK_IDS = TRACKS.map(t => t.id);

/* ── 음색 엔진 목록 ── */
const ENGINES = {
  kick :{deep:'Deep Boom',punch:'Punch',tight:'Tight',wood:'Acoustic'},
  snare:{body:'Analog Body',crack:'Crack',tight:'Gated',lofi:'Lo-fi Crush',
         brush:'Brush',rim:'Rimshot'},
  clap :{spread:'Spread',tight:'Tight',hall:'Hall Tail',snap:'Finger Snap'},
  chat :{metal:'6-Osc Metal',noise:'Noise',tick:'Tick'},
  ohat :{metal:'6-Osc Metal',noise:'Noise',tick:'Tick'},
  tom  :{analog:'Analog',synth:'Synth',wood:'Acoustic',
         conga:'Conga',bongo:'Bongo',timbale:'Timbale',
         logdrum:'Log Drum',cowbell:'Cowbell'},
  perc :{shaker:'Shaker',tamb:'Tambourine',clave:'Clave',woodblock:'Woodblock',
         guiro:'Güiro',cabasa:'Cabasa',agogo:'Agogô',iron:'Iron',scratch:'Scratch'},
  bass :{s808:'808 Sub',sub:'Round Sub',acid:'Acid Saw',fm:'FM Bell',reese:'Detuned',
         moog:'Moog Mono',
         finger:'Finger Bass',pick:'Pick Bass',slap:'Slap Bass',upright:'Upright',
         tuba:'Tuba (관)',
         piano:'Piano (샘플)',casio:'Casio (샘플)'},
  keys :{pad:'Analog Pad',ep:'Electric Piano',pluck:'Pluck',supersaw:'Supersaw',
         organ:'Drawbar Organ',poly:'Poly Brass',bell:'FM Bell',
         piano:'Acoustic Piano',clav:'Clavinet',strings:'String Ensemble',
         horns:'Horn Section',accordion:'Accordion',bandoneon:'Bandoneon',
         lead:'Synth Lead',vibes:'Vibraphone',marimba:'Marimba',
         sax:'Saxophone',harmonica:'Harmonica',steelpan:'Steel Pan',
         vocoder:'Vocoder',harpsi:'Harpsichord'},
  gtr  :{clean:'Electric Clean',crunch:'Crunch',hi:'Hi-Gain',mute:'Palm Mute',
         steel:'Acoustic Steel',nylon:'Nylon',
         fuzz:'Fuzz',twelve:'12-String',pedal:'Pedal Steel',
         banjo:'Banjo',mandolin:'Mandolin',fiddle:'Fiddle',sitar:'Sitar',saz:'Saz'},
};
