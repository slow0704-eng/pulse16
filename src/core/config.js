/* §1 상수 · 설정 — 트랙 정의와 음색 엔진 목록
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ═══ §1  상수 · 설정 ═══════════════════════════════════════ */

const HAS_TONE   = typeof window.Tone !== 'undefined';

/* ⚠ 이 앱이 접속하는 **유일한** 외부 오리진입니다.
   폰트와 Tone.js 는 2026-08-15 에 저장소 안으로 들여왔습니다(`fonts/` · `vendor/`).
   남은 것은 샘플뿐이고, 그것도 사용자가 킷·루프·샘플 엔진을 고를 때만 탑니다.

   여기는 **제3자의 GitHub Pages 사이트**입니다 — SLA 가 없고 `max-age=600`(10분)
   이라 길게 틀어 두면 같은 파일을 계속 다시 받습니다. 실패는 정상 경로로 취급하세요:
   `sampler.js` 의 `blocked()` 가 잡아 합성 엔진으로 되돌립니다.

   **저장소 안으로 들여오지 마세요** — 상류(Tonejs/audio)에 라이선스 파일이 없습니다.
   링크를 거는 것과 복사해 재배포하는 것은 다른 행위입니다.
   경위와 대안은 docs/perf/04-외부의존성.md §3-4. */
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

/* ⚠ chorus · drums · breakbeat 은 뺐습니다 — 상류(tonejs.github.io)에 파일이
   자체가 없어 **항상 404** 입니다. 일곱 개 중 셋이 눌러도 안 되고, 게다가
   그 실패가 «미리보기 창이 차단했다» 는 엉뚱한 경고를 띄우고 있었습니다.
   실제로 받아지는 것만 남깁니다. (2026-08-08 확인: ominous 200, 나머지 셋 404) */
const LOOP_CANDIDATES = [
  {n:'ominous',   u:'drum-samples/loops/ominous.mp3'},
  {n:'handdrum',  u:'drum-samples/handdrum-loop.mp3'},
  {n:'conga',     u:'drum-samples/conga-rhythm.mp3'},
  {n:'theremin',  u:'berklee/gurgling_theremin_1.mp3'},
];
const PIANO_URLS = {'A0':'A0.mp3','C1':'C1.mp3','D#1':'Ds1.mp3','F#1':'Fs1.mp3',
  'A1':'A1.mp3','C2':'C2.mp3','D#2':'Ds2.mp3','F#2':'Fs2.mp3',
  'A2':'A2.mp3','D#3':'Ds3.mp3','C3':'C3.mp3','F#3':'Fs3.mp3','A3':'A3.mp3'};
/* ⚠ G#2 를 도로 넣지 마세요 — 상류에 `casio/Gs2.mp3` 가 없습니다(영구 404).
   Gs2·GS2·gs2·G%232·Ab2·As2 를 전부 찔러 봤고 G2 만 200 입니다(2026-08-15 확인).
   Tone.Sampler 가 이웃 음으로 보간하므로 소리는 멀쩡했지만, casio 를 고를 때마다
   헛요청 1건과 콘솔 404 가 남고 있었습니다. 위 LOOP_CANDIDATES 에서 «항상 404 인 셋»
   을 뺀 것과 같은 정리입니다. */
const CASIO_URLS = {'A1':'A1.mp3','A#1':'As1.mp3','B1':'B1.mp3','C2':'C2.mp3',
  'C#2':'Cs2.mp3','D2':'D2.mp3','D#2':'Ds2.mp3','E2':'E2.mp3','F2':'F2.mp3',
  'F#2':'Fs2.mp3','G2':'G2.mp3','A2':'A2.mp3'};

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
  kick :{deep:'Deep Boom',punch:'Punch',tight:'Tight',wood:'Acoustic',
         eight08:'808 Long',nine09:'909',subkick:'Pure Sub',jazz:'Jazz',gabber:'Gabber'},
  snare:{body:'Analog Body',crack:'Crack',tight:'Gated',lofi:'Lo-fi Crush',
         brush:'Brush',rim:'Rimshot',
         eight08:'808',nine09:'909',piccolo:'Piccolo',march:'Marching',
         dnb:'DnB Break',trap:'Trap',fat:'Fat',
         /* 주법 변형 3종 */
         rimshot:'Open Rimshot',flam:'Flam',buzzroll:'Buzz Roll'},
  clap :{spread:'Spread',tight:'Tight',hall:'Hall Tail',snap:'Finger Snap',
         eight08:'808',nine09:'909',stack:'Stack',room:'Room',dry:'Dry'},
  chat :{metal:'6-Osc Metal',noise:'Noise',tick:'Tick',
         sizzle:'Sizzle',dark:'Dark',foot:'Foot',crisp:'Crisp',
         half:'Half-Open',halfmetal:'Half-Open Metal'},
  ohat :{metal:'6-Osc Metal',noise:'Noise',tick:'Tick',
         sizzle:'Sizzle',dark:'Dark',foot:'Foot',crisp:'Crisp',
         half:'Half-Open',halfmetal:'Half-Open Metal'},
  tom  :{analog:'Analog',synth:'Synth',wood:'Acoustic',
         conga:'Conga',bongo:'Bongo',timbale:'Timbale',
         logdrum:'Log Drum',cowbell:'Cowbell',
         /* 세계 막울림 9종 */
         surdo:'Surdo',djembe:'Djembe',tabla:'Tabla',taiko:'Taiko',
         darbuka:'Darbuka',cuica:'Cuíca',rototom:'Rototom',
         talking:'Talking Drum',frame:'Frame Drum'},
  perc :{shaker:'Shaker',tamb:'Tambourine',clave:'Clave',woodblock:'Woodblock',
         guiro:'Güiro',cabasa:'Cabasa',agogo:'Agogô',iron:'Iron',scratch:'Scratch',
         /* STK 차용 10종 — docs/음색/01-STK차용.md */
         maraca:'Maraca',sekere:'Sekere',sandpaper:'Sandpaper',sticks:'Sticks',
         rocks:'Gravel',sleigh:'Sleigh Bells',bamboo:'Bamboo Chimes',
         angklung:'Angklung',water:'Water Drops',cokecan:'Coke Can'},
  bass :{s808:'808 Sub',sub:'Round Sub',acid:'Acid Saw',fm:'FM Bell',reese:'Detuned',
         moog:'Moog Mono',
         finger:'Finger Bass',pick:'Pick Bass',slap:'Slap Bass',upright:'Upright',
         tuba:'Tuba (관)',
         piano:'Piano (샘플)',casio:'Casio (샘플)',
         /* 현 베이스 7종 */
         flatwound:'Flatwound',tapewound:'Tapewound',fretless:'Fretless',
         muted:'Palm Muted',guitarron:'Guitarrón',piccolo:'Piccolo Bass',bass6:'6-String',
         /* 합성 스택 7종 (BSYN) */
         square:'Square',pluckbs:'Pluck',growl:'Growl',organbs:'Organ',
         hollow:'Hollow',buzz:'Buzz',warm:'Warm',
         /* 주법 변형 7종 */
         thumb:'Thumb Pluck',pop:'Slap Pop',bassharm:'Bass Harmonics',bassslide:'Finger Slide',
         pickmute:'Pick Mute',uprightslap:'Upright Slap',arco:'Upright Arco'},
  keys :{pad:'Analog Pad',ep:'Electric Piano',pluck:'Pluck',supersaw:'Supersaw',
         organ:'Drawbar Organ',poly:'Poly Brass',bell:'FM Bell',
         piano:'Acoustic Piano',clav:'Clavinet',strings:'String Ensemble',
         horns:'Horn Section',accordion:'Accordion',bandoneon:'Bandoneon',
         lead:'Synth Lead',vibes:'Vibraphone',marimba:'Marimba',
         sax:'Saxophone',harmonica:'Harmonica',steelpan:'Steel Pan',
         vocoder:'Vocoder',harpsi:'Harpsichord',
         /* 타현·타봉 6종 (자유단 막대 모드) */
         xylophone:'Xylophone',glocken:'Glockenspiel',celesta:'Celesta',
         kalimba:'Kalimba',musicbox:'Music Box',tubular:'Tubular Bells',
         /* STK FM 4종 */
         wurli:'Wurlitzer EP',fmlead:'FM Lead',percflut:'Perc Flute',fmorgan:'FM Organ',
         /* 관악 6종 */
         clarinet:'Clarinet',flute:'Flute',oboe:'Oboe',
         trumpet:'Trumpet',trombone:'Trombone',panflute:'Pan Flute',
         /* 그 밖 6종 */
         choir:'Choir',mellotron:'Mellotron',glassharm:'Glass Harmonica',
         toypiano:'Toy Piano',synclead:'Sync Lead',brassens:'Brass Ensemble',
         /* 주법 변형 11종 */
         pizz:'String Pizzicato',tremstr:'String Tremolo',staccato:'String Staccato',
         leslie:'Organ Leslie Fast',chorale:'Organ Leslie Slow',organperc:'Organ Percussion',
         eptrem:'EP Suitcase Tremolo',epbark:'EP Bark',
         pianosoft:'Piano Una Corda',felt:'Felt Piano',leadglide:'Lead Glide'},
  gtr  :{clean:'Electric Clean',crunch:'Crunch',hi:'Hi-Gain',mute:'Palm Mute',
         steel:'Acoustic Steel',nylon:'Nylon',
         fuzz:'Fuzz',twelve:'12-String',pedal:'Pedal Steel',
         banjo:'Banjo',mandolin:'Mandolin',fiddle:'Fiddle',sitar:'Sitar',saz:'Saz',
         wah:'Wah (Auto)',phase:'Phaser',chorus:'Chorus',
         /* 세계 발현악기 18종 */
         ukulele:'Ukulele',oud:'Oud',bouzouki:'Bouzouki',balalaika:'Balalaika',
         koto:'Koto',shamisen:'Shamisen',guzheng:'Guzheng',pipa:'Pipa',
         charango:'Charango',cuatro:'Cuatro',tres:'Tres',kora:'Kora',
         harp:'Harp',dulcimer:'Dulcimer',zither:'Zither',
         jazzbox:'Jazz Archtop',resonator:'Resonator',slide:'Slide',
         /* 주법 변형 11종 — engines.js «주법(technique) 변형» */
         harmonic:'Clean Harmonics',chank:'Funk Chank',strum:'Strum Down',strumup:'Strum Up',
         fingerpick:'Fingerpicked',slidein:'Slide-in',bend:'Crunch Bend',
         pinch:'Pinch Harmonic',rasgueado:'Rasgueado',nylontrem:'Nylon Tremolo',
         nylonharm:'Nylon Harmonics'},
};
