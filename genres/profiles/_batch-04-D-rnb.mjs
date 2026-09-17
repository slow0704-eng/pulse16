/* 배치 A10 — R&B · Soul · Funk 계열 24종. _gen.mjs 가 이 표를 펼친다.

   2026-09-15 첫 판은 genres/04-rnb-soul-funk.md 의 분석과 프리셋 kit 만 보고 갈랐다.
   2026-09-18 에 **대표곡으로 다시 검증했다.** 장르마다 웹에서 실재·장르 분류를 확인한
   곡(genres/04-rnb-soul-funk.md «대표곡» 표)을 모으고, 곡에서 확인되는 성질
   — 템포 · 드럼 골격 · 베이스 주법 · 건반/관 편성 — 과 대조했다.

   무리를 쪼갠 곳 (근거가 달라서)
     · pfunk(P-Funk·Electro-funk) → **둘로.** Electro 문서는 이 갈래를 「more **mechanical**」,
       사람 느낌의 반대라고 규정하고 「defined by the prominent use of the Roland TR-808」이다.
       P-Funk 의 느슨한 16분 신콥과 같은 프로파일에 둘 자리가 아니다
     · disco(Disco·Euro Disco) → **둘로.** 디스코의 저역은 「broken octaves … played on the
       **bass guitar**」인데, 유로디스코를 세운 「I Feel Love」는 「programmed on a **sequencer**」에
       좌우 딜레이로 벌린 신스 베이스다 — 바로 그 점이 두 갈래를 가른다
     · hinrg(Hi-NRG·Italo Disco) → **둘로.** 장비는 같지만 Hi-NRG 는 리듬(「pulsating octave
       basslines」), Italo 는 노래(「catchy melodies」)가 앞이다
     · discofunk(Disco Funk·Post-disco) → **둘로.** 포스트디스코의 정의가 「synthesizer sounds
       were preferred to the **lush orchestration**」 — 오케스트라를 덜어낸 쪽이다
     · quietstorm(Quiet Storm·Alternative R&B) → **둘로.** 얼터너티브 R&B 는 「many synthesizers
       and **filtered drums**」에 왜곡된 808 이고, 콰이엇 스톰은 색소폰과 핑거 베이스다

   수치는 재료 실측에서 나왔다(check-melody-profile.mjs P11 이 대조):
     amb 1.00/0.38~0.42/4 · bal 2.13~2.19/0.29~0.35/4 · trp 2.00~2.25/0.60~0.85/4
     pop 3.63~3.69/0.16~0.19/5 · cin 3.63~3.69/0.21~0.25/6 · cinbal 3.63~3.69/0.33/4
     funk 3.63~3.69/0.26~0.30/5 · disfun 3.63/0.30/5 · blues 3.50/0.27~0.31/5
     rootbl 3.50/0.30/5 · root 4.25/0.27~0.31/5 · jazz 6.25/0.29~0.30/5
     jazbal 6.25/0.32~0.33/4 · dis 6.50~6.75/0.88/7 · chip 6.50~6.75/0.92~0.94/7
     edm 6.50~6.75/0.88/7                                                            */

export const batch = 'A10';
export const sub = 'R&B · Soul · Funk (계열 D)';
export const cat = 'D';
export const date = '2026-09-18';
export const verdict =
  '24종 → 21무리. 대표곡으로 다시 갈랐고 다섯 무리를 쪼갰다(펑크·디스코·유럽 디스코·포스트디스코·콰이엇 스톰). '
  + 'JB Funk 의 클라비넷과 슬랩은 Sly 쪽 표지였음이 확인돼 되돌렸고, 하프 두 칸은 출처가 하나도 없어 비브라폰·현으로 바꿨다.';

export const SUB = {
  'Disco Funk':'Funk','Funk':'Funk','P-Funk':'Funk','Jazz-Funk':'Funk','Boogie':'Funk',
  'Electro-funk':'Funk','JB Funk':'Funk','Post-disco':'Funk',
  'New Jack Swing':'Contemporary R&B','Quiet Storm':'Contemporary R&B','Hip Hop Soul':'Contemporary R&B',
  '90s R&B':'Contemporary R&B','Alternative R&B':'Contemporary R&B','Trap Soul':'Contemporary R&B',
  'Motown':'Soul','Philadelphia Soul':'Soul','Memphis Soul':'Soul','Northern Soul':'Soul','Psychedelic Soul':'Soul',
  'Disco':'Disco','Hi-NRG':'Disco','Italo Disco':'Disco','Euro Disco':'Disco',
  'Rhythm & Blues':'뿌리',
};

/* 프리셋 파일(src/data/presets/04-rnb-funk.js)의 실제 스케일 */
export const SCALE = {
  'Disco Funk':'Dorian','Funk':'Dorian','JB Funk':'Dorian','P-Funk':'Dorian','Jazz-Funk':'Dorian',
  'Post-disco':'Dorian','Boogie':'Dorian','Electro-funk':'Dorian',
  'New Jack Swing':'Natural Minor','Quiet Storm':'Dorian','Hip Hop Soul':'Dorian','90s R&B':'Dorian',
  'Alternative R&B':'Natural Minor','Trap Soul':'Natural Minor',
  'Motown':'Major','Philadelphia Soul':'Major','Memphis Soul':'Dorian','Northern Soul':'Major',
  'Psychedelic Soul':'Natural Minor',
  'Disco':'Major','Euro Disco':'Major','Hi-NRG':'Natural Minor','Italo Disco':'Natural Minor',
  'Rhythm & Blues':'Dorian',
};

const B = (role, gate, kick, oct = false, glide = 'none') => ({ role, oct, gate, kick, glide });

export const groups = {
  jbfunk: {
    anchor: 'Funk', members: ['Funk', 'JB Funk'],
    mel: { density: [4, 6], leap: [0.05, 0.35], contour: 'static', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'offbeat16', repetition: 'high', voicing: 'single' },
    bass: B('root', 'short', 'offset'), lead: 'keys',
    roles: { keys: 'clav-organ', keys2: 'horns', gtr: 'cut', gtr2: 'none' },
    chordType: 'nine', comping: 'funk_16th_stab',
    pool: ['funk_aabb', 'funk_abab', 'funk_aaab'], riff: ['funk_cut', 'funk_call'], bline: ['bfun_aabb', 'bfun_abab'],
    ev: '1960~1970년대 미국 · 10곡', conf: 'high',
    why: '**「On the one!」** — 강세가 매 마디 첫 박이고 록의 2·4 와 정반대다. 화성은 「a static single-chord or two-chord vamp」에 「**Dorian or Mixolydian** mode」다. 둘을 가르는 것은 편성이다 — 클라비넷과 슬랩은 **Sly 쪽 표지**이고(슬랩의 발명은 Larry Graham), JB 쪽은 오르간·혼에 **핑거 베이스**다',
  },
  discofunk: {
    anchor: 'Disco Funk', members: ['Disco Funk'],
    mel: { density: [6, 8], leap: [0.80, 0.95], contour: 'rise', range: [6, 7], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: B('octave', 'short', 'locked', true), lead: 'keys',
    roles: { keys: 'horns-strings', keys2: 'staccato-strings', gtr: 'cut', gtr2: 'none' },
    chordType: 'nine', comping: 'disco_stab',
    pool: ['dis_aabb', 'dis_abab', 'dis_aaab'], riff: ['funk_cut', 'funk_groove'], bline: ['bdis_aabb', 'bdis_abab'],
    ev: '1970년대 후반 미국 · 5곡', conf: 'high',
    why: '대표곡 다섯 곡이 전부 인포박스에 disco 와 funk 를 함께 단다 — 프리셋 이름이 출처와 맞는 드문 자리다. **다섯 곡 모두 혼 섹션이 있는데** 두 건반 층이 다 현이었다. 디스코 문서가 정박만 말하므로(셔플 서술 없음) 계열 최고값이던 swing 22 를 0 으로 내렸다',
  },
  postdisco: {
    anchor: 'Post-disco', members: ['Post-disco'],
    mel: { density: [6, 8], leap: [0.70, 0.90], contour: 'zigzag', range: [6, 7], degrees: [0, 2, 4, 7], rhythm: 'offbeat16', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'short', 'offset'), lead: 'keys',
    roles: { keys: 'lead', keys2: 'poly', gtr: 'cut', gtr2: 'none' },
    chordType: 'nine', comping: 'disco_stab',
    pool: ['dis_abab', 'dis_aaab'], riff: ['funk_cut', 'edm_arp'], bline: ['bdis_abab', 'bfun_abab'],
    ev: '1980년대 초 미국 · 5곡', conf: 'medium',
    why: '정의가 **오케스트라를 신스로 갈아 끼운 것**이다 — 「For strings and brass sections, **synthesizer sounds were preferred** to the lush orchestration」. 「Drum machines, synthesizers, sequencers were either partly or entirely dominant」이고 베이스는 「often performed on a **Minimoog**」다. 그래서 2번 건반의 현을 폴리 신스로 옮겼다',
  },
  pfunk: {
    anchor: 'P-Funk', members: ['P-Funk'],
    mel: { density: [4, 6], leap: [0.10, 0.40], contour: 'zigzag', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'offbeat16', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'short', 'offset', false, 'occasional'), lead: 'keys',
    roles: { keys: 'vocoder', keys2: 'horns', gtr: 'cut', gtr2: 'none' },
    chordType: 'nine', comping: 'funk_16th_stab',
    pool: ['funk_abab', 'disfun_abab', 'funk_aaab'], riff: ['funk_groove', 'funk_cut'], bline: ['bfun_abab', 'bfun_aaab'],
    ev: '1970~1980년대 미국 · 5곡', conf: 'high',
    why: '무그가 베이스 기타를 **대신한다** — 「the Moog synthesizer, which **replaced the conventional electric bass** on songs like ‘Flash Light’ and ‘Aqua Boogie’」. 혼 섹션은 이름까지 있다(**The Horny Horns**) — 현악은 문서에 없어 2번 건반을 혼으로 바꿨다. bpm 105 는 대표곡 105·106·106 과 정확히 맞는다',
  },
  electrofunk: {
    anchor: 'Electro-funk', members: ['Electro-funk'],
    /* 밀도 상한은 디스코 형제의 8 이 아니라 13 이다. 배정한 edm_* 는 16분 시퀀스
       재료라 실측이 12.5~12.75 이고, 이미 검증된 E 계열도 같은 재료에 [6,13] 을 준다.
       808 과 시퀀서가 정의인 갈래에 형제의 값을 복사해 둔 것이 원인이었다. */
    mel: { density: [6, 13], leap: [0.85, 1.00], contour: 'rise', range: [6, 7], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: B('root', 'short', 'locked', false, 'occasional'), lead: 'keys',
    roles: { keys: 'vocoder', keys2: 'poly', gtr: 'none', gtr2: 'none' },
    chordType: 'nine', comping: 'disco_stab',
    pool: ['edm_aaab', 'edm_abab', 'chip_aaab'], riff: ['edm_arp', 'edm_alt'], bline: ['bhou_aaab', 'b808_aaab'],
    ev: '1980년대 초 미국 · 6곡', conf: 'high',
    why: '「**defined by the prominent use of the Roland TR-808**」이고 드럼은 「electronic emulations of breakbeats with a **syncopated kick drum**」이다 — 네 박도 오픈햇 뒷박도 없다. 「electro tends to be more **mechanical**」이라 P-Funk 의 느슨한 신콥에서 떼어 냈다. 보코더·토크박스가 목소리를 대신하고, **기타는 편성에 없다**',
  },
  jazzfunk: {
    anchor: 'Jazz-Funk', members: ['Jazz-Funk'],
    mel: { density: [5, 7], leap: [0.20, 0.45], contour: 'zigzag', range: [4, 6], degrees: [0, 2, 4, 5, 6], rhythm: 'offbeat16', repetition: 'high', voicing: 'single' },
    bass: B('root', 'short', 'offset'), lead: 'keys',
    roles: { keys: 'ep', keys2: 'trumpet-sax', gtr: 'comp', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['jazz_aabb', 'jazz_abab', 'jazbal_abab'], riff: ['jazz_gtr_comp', 'funk_groove'], bline: ['bfun_abab', 'bwal_abab'],
    ev: '1970년대 미국 · 5곡', conf: 'high',
    why: '정의가 「a strong **back beat**, electrified sounds, and analog synthesizers」이고 구조는 「a **simple structure based around one or two riffs**」다 — 그래서 반복이 약한 것이 아니라 **강하고**, 워킹 베이스는 문서에 없어 리프/근음으로 되돌렸다(워킹은 스윙 재즈의 어법이다). 로즈가 기본 건반이라 `epbark` 배정이 대표곡으로 뒷받침된다',
  },
  boogie: {
    anchor: 'Boogie', members: ['Boogie'],
    mel: { density: [6, 8], leap: [0.80, 0.95], contour: 'rise', range: [6, 7], degrees: [0, 2, 4, 7], rhythm: 'offbeat', repetition: 'high', voicing: 'single' },
    bass: B('octave', 'short', 'locked', true), lead: 'keys',
    roles: { keys: 'lead', keys2: 'brass', gtr: 'cut', gtr2: 'none' },
    chordType: 'nine', comping: 'disco_stab',
    pool: ['dis_abab', 'dis_aaab', 'dis_aabb'], riff: ['funk_cut', 'edm_arp'], bline: ['bdis_abab', 'bdis_aaab'],
    ev: '1980년대 초 미국 · 4곡', conf: 'medium',
    why: '**네 박 킥이 아니다** — 「a strong accent on the **second and fourth beats**」이고, 문서가 그것을 「generally **lacks the four-on-the-floor beat**, the ‘traditional’ rhythm of disco music」이라고 디스코와 대비해 적는다. 지금 값은 Disco 를 그대로 복사한 것이었다. 템포도 유일하게 출처가 있다 — 「110 to 116 BPM」',
  },

  njs: {
    anchor: 'New Jack Swing', members: ['New Jack Swing'],
    mel: { density: [4, 6], leap: [0.05, 0.35], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'triplet-feel', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'short', 'locked'), lead: 'keys',
    roles: { keys: 'lead', keys2: 'brass', gtr: 'none', gtr2: 'none' },
    chordType: 'nine', comping: 'funk_16th_stab',
    pool: ['funk_aaab', 'funk_aabb', 'disfun_abab'], riff: ['funk_cut', 'edm_alt'], bline: ['bfun_aaab', 'bhou_aabb'],
    ev: '1980년대 후반 미국 · 5곡', conf: 'high',
    why: '**이 계열에서 유일하게 실제로 셔플이다** — 「swingbeats, a rhythmic pattern using **offbeat accented 16th note triplets**」. 악기는 DX7·D50 신스와 TR-808·LinnDrum·SP-1200 이라 신스 베이스와 신스 브라스가 맞다. 확인된 조성 셋이 전부 단조다. **어긋난 칸이 거의 없는 프리셋**이다',
  },
  quietstorm: {
    anchor: 'Quiet Storm', members: ['Quiet Storm'],
    mel: { density: [1, 3], leap: [0.20, 0.45], contour: 'arch', range: [3, 5], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'long', 'free'), lead: 'keys',
    roles: { keys: 'sax', keys2: 'ep', gtr: 'fingerpick', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['bal_aaba', 'bal_aabb', 'bal_abab'], riff: ['arp_folk', 'jazz_gtr_comp'], bline: ['breg_aaba', 'bwal_aaba'],
    ev: '1970~2020년대 미국 · 5곡', conf: 'high',
    why: '「smooth, romantic, **jazz-influenced**」에 다이내믹 폭이 좁다. **기타가 한 번도 울리지 않던 것을 고쳤다** — 장르 문서는 악기를 하나도 들지 않지만 대표곡 5곡 중 **4곡이 기타 연주자를 이름째로 적는다**(Marv Tarplin · Greg Moore · 「percussive guitar」 · Bruno Mars). 템포도 74·89 라 72 에서 올렸다',
  },
  altrnb: {
    anchor: 'Alternative R&B', members: ['Alternative R&B'],
    mel: { density: [1, 2], leap: [0.30, 0.55], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'high', voicing: 'single' },
    bass: B('root', 'long', 'locked', false, 'occasional'), lead: 'keys',
    roles: { keys: 'pad', keys2: 'glass', gtr: 'none', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['amb_aaba', 'amb_aabb', 'amb_aaab'], riff: ['arp_folk', 'edm_arp'], bline: ['b808_aabb', 'breg_aaba'],
    ev: '2010~2020년대 미국 · 5곡', conf: 'medium',
    why: '「echo-laden and lofty, often using **many synthesizers and filtered drums**」 — 공간과 침묵이 편곡의 한 층이라 콰이엇 스톰에서 떼어 냈다. 베이스는 **프리셋 자신이 모순이었다** — `kit.bass` 는 핑거 베이스인데 `bcfg.eng` 는 808 이었다. 출처가 「distorted bass」·「bass synth」·*808s & Heartbreak* 쪽이라 808 로 맞췄다. Hot 100 1위가 한 곡도 없는 것이 이 장르의 성질이다',
  },
  rnb90: {
    anchor: '90s R&B', members: ['90s R&B', 'Hip Hop Soul'],
    mel: { density: [3, 5], leap: [0.20, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'triplet-feel', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'mid', 'offset'), lead: 'keys',
    roles: { keys: 'ep', keys2: 'strings-organ', gtr: 'none', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['cinbal_aaba', 'cinbal_aabb', 'bal_abab'], riff: ['soul_prog', 'soul_chank'], bline: ['bfun_aabb', 'breg_aabb'],
    ev: '1990년대 미국 · 10곡', conf: 'high',
    why: '둘을 가르는 것은 템포가 아니라 **반주의 출처**다 — 힙합 소울은 「soul singing over **hip-hop grooves**」로 빌려온 샘플 루프를 깔고, 90s R&B 는 「the roughness and grit inherent in hip-hop may be **reduced and smoothed out**」쪽이다. 그래서 90s R&B 의 템포를 95→84, 스윙을 30→14 로 내려 둘을 벌렸다(확인값 63·68·76·96·100)',
  },
  trapsoul: {
    anchor: 'Trap Soul', members: ['Trap Soul'],
    mel: { density: [2, 3], leap: [0.55, 0.80], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'offbeat16', repetition: 'high', voicing: 'single' },
    bass: B('root', 'long', 'locked', false, 'occasional'), lead: 'keys',
    roles: { keys: 'bell', keys2: 'pad', gtr: 'none', gtr2: 'none' },
    chordType: 'nine', comping: 'trap_pad',
    pool: ['trp_aaba', 'trp_aaab', 'trp_abab'], riff: ['edm_arp', 'edm_alt'], bline: ['b808_aaba', 'b808_aabb'],
    ev: '2010년대 중반 미국 · 5곡', conf: 'medium',
    why: '**위키백과에 단독 문서가 없다**(`/wiki/Trap_soul` 404) — trap-soul 로 직접 태그된 곡은 하나뿐이고 그 곡이 **113 BPM**(체감 56)이다. 트랩 일반의 「around 70 (140) BPM」보다 확실히 느려서 138 을 122 로 내렸다. 808 과 잘게 쪼갠 햇, 3박 스네어는 그대로 맞다',
  },

  motown: {
    anchor: 'Motown', members: ['Motown', 'Northern Soul'],
    mel: { density: [3, 5], leap: [0.05, 0.35], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: B('walking', 'short', 'locked'), lead: 'keys',
    roles: { keys: 'strings-piano', keys2: 'vibes-horns', gtr: 'cut', gtr2: 'none' },
    chordType: 'sev', comping: 'pop_pulse',
    pool: ['pop_aabb', 'pop_aaba', 'pop_abab'], riff: ['soul_chank', 'funk_cut'], bline: ['bfun_aabb', 'bwal_aabb'],
    ev: '1960년대 미국 디트로이트 · 8곡', conf: 'high',
    why: '「the Motown sound typically featured **tambourines to accent the back beat**」와 「**two drummers** instead of one」, 「regular use of **horns and strings**」, 그리고 「a **trebly** style of mixing」이다. 2번 건반을 합창에서 **비브라폰**으로 옮겼다 — 잭 애시퍼드의 비브라폰·마림바가 이 사운드의 고유색이다. 노던 소울은 이 편성을 그대로 쓰되, 장르 문서 자체는 「**eschews** Motown … mainstream commercial success」라 «틀던 씬» 쪽 정의임을 기억해야 한다',
  },
  philly: {
    anchor: 'Philadelphia Soul', members: ['Philadelphia Soul'],
    mel: { density: [3, 5], leap: [0.10, 0.40], contour: 'arch', range: [5, 7], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'mid', 'locked'), lead: 'keys',
    roles: { keys: 'strings', keys2: 'vibes', gtr: 'cut', gtr2: 'none' },
    chordType: 'sev', comping: 'ballad_pad',
    pool: ['cin_aaba', 'cin_aabb', 'cin_abab'], riff: ['soul_prog', 'arp_folk'], bline: ['bfun_abab', 'bdis_aabb'],
    ev: '1970년대 미국 필라델피아 · 4곡', conf: 'medium',
    why: '「**lavish orchestral instrumentation**, heavy bass and driving percussion」이고 「The world-renowned **Philadelphia Orchestra’s string section** was often employed」다. **하프는 어디에도 없다** — MFSB 30여 명 명단에도 PIR 문서에도 없고, 그 «반짝이는» 자리를 맡은 것은 빈스 몬태나의 **비브라폰**(+팀파니·오케스트라 벨·차임)이다. 게다가 `harp` 는 기타 표 이름이라 조용한 패드로 울리고 있었다',
  },
  memphis: {
    anchor: 'Memphis Soul', members: ['Memphis Soul'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'offbeat', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'mid', 'offset'), lead: 'keys',
    roles: { keys: 'horns', keys2: 'organ', gtr: 'cut', gtr2: 'none' },
    chordType: 'sev', comping: 'rock_8th',
    pool: ['blues_aaba', 'blues_aabb', 'rootbl_aabb'], riff: ['soul_chank', 'funk_cut'], bline: ['bfun_aabb', 'bcou_aabb'],
    ev: '1960~1970년대 미국 멤피스 · 5곡', conf: 'high',
    why: '정의문이 「melodic **unison horn lines**, organ, guitar, bass, and a driving beat on the drums」이고 성질에 「**handclaps**」와 콜앤리스폰스가 들어 있다 — 비어 있던 박수 트랙을 채웠다. 「Green Onions」이 **12마디 블루스**라 선율 재료도 블루스 어휘인데 스케일만 Major 였다. 해먼드 M3/B-3 가 이 도시의 두 번째 목소리라 `leslie` 배정은 그대로 둔다',
  },
  psychsoul: {
    anchor: 'Psychedelic Soul', members: ['Psychedelic Soul'],
    mel: { density: [4, 6], leap: [0.10, 0.40], contour: 'zigzag', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'offbeat16', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'short', 'offset'), lead: 'keys',
    roles: { keys: 'organ', keys2: 'strings', gtr: 'wah', gtr2: 'fuzz' },
    chordType: 'sev', comping: 'funk_16th_stab',
    pool: ['funk_aabb', 'disfun_aabb', 'funk_abab'], riff: ['funk_groove', 'funk_cut'], bline: ['bfun_abab', 'bfun_aaab'],
    ev: '1960~1970년대 미국 · 5곡', conf: 'high',
    why: '「effects units such as **wah-wah and phasing**」과 「**distorted** electric guitar and strong basslines」가 정의다 — 2번 기타의 클린을 왜곡 쪽으로 바꿨다(문서는 fuzz 라는 말까지는 쓰지 않아 **있는 엔진 중 가장 가까운 것**을 골랐다). 소울 형제 다섯 중 유일하게 조성 사료가 **단조**이고(E♭m), 타악도 탬버린이 아니라 콩가다',
  },

  disco: {
    anchor: 'Disco', members: ['Disco'],
    mel: { density: [6, 8], leap: [0.80, 0.95], contour: 'rise', range: [6, 7], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: B('octave', 'short', 'locked', true), lead: 'keys',
    roles: { keys: 'strings', keys2: 'horns', gtr: 'cut', gtr2: 'none' },
    chordType: 'sev', comping: 'disco_stab',
    pool: ['dis_aabb', 'dis_abab', 'dis_aaab'], riff: ['funk_cut', 'funk_groove'], bline: ['bdis_aabb', 'bdis_abab'],
    ev: '1970년대 미국 · 8곡', conf: 'high',
    why: '문서 문장이 그대로 골격이다 — 「a steady **four-on-the-floor** beat … with an **open hissing hi-hat on the off-beat**」, 「syncopated basslines (with heavy use of **broken octaves**) played on the **bass guitar**」. 기타 주법은 「**chicken-scratch**」뿐이고 와우는 없다. **하프는 문서에 한 번도 나오지 않아** 2번 건반을 혼으로 바꿨고, 형제 전원이 28 인데 혼자 55 이던 덕킹도 되돌렸다',
  },
  eurodisco: {
    anchor: 'Euro Disco', members: ['Euro Disco'],
    /* 상한 13 — 풀이 dis_ 와 edm_ 섞임이고 edm_ 쪽 실측이 12.5~12.75 다.
       「parts programmed on a sequencer」를 근거로 edm_ 을 넣고서 밀도는
       사람이 치는 디스코의 8 로 두었던 것이 어긋남이었다. Hi-NRG 는 chip_ 만
       쓰므로 [6,8] 그대로다 — 셋을 한꺼번에 넓히지 않았다. */
    mel: { density: [6, 13], leap: [0.85, 1.00], contour: 'rise', range: [6, 7], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: B('octave', 'short', 'locked', true), lead: 'keys',
    roles: { keys: 'strings', keys2: 'poly', gtr: 'none', gtr2: 'none' },
    chordType: 'sev', comping: 'disco_stab',
    pool: ['dis_aabb', 'edm_abab', 'edm_aaab'], riff: ['edm_arp', 'funk_cut'], bline: ['bdis_abab', 'bhou_aaab'],
    ev: '1970년대 유럽 · 4곡', conf: 'medium',
    why: '**장르 문서에는 악기도 템포도 베이스 서술도 없다** — 모로더가 개척자라는 언급뿐이다. 그래서 근거는 이 사운드를 세운 곡 쪽이다: 「produced … with a **Moog synthesizer**」, 「parts **programmed on a sequencer**」, 「the bassline is doubled by a **delay** … left … right」, 그리고 「the first song to combine repetitive synthesizer loops with a continuous four-on-the-floor bass drum and an off-beat hi-hat」. 미국 디스코의 핑거 베이스와 갈리는 자리가 바로 여기다',
  },
  hinrg: {
    anchor: 'Hi-NRG', members: ['Hi-NRG'],
    mel: { density: [6, 8], leap: [0.85, 1.00], contour: 'rise', range: [6, 7], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: B('octave', 'short', 'locked', true), lead: 'keys',
    roles: { keys: 'lead', keys2: 'poly', gtr: 'none', gtr2: 'none' },
    chordType: 'sev', comping: 'disco_stab',
    pool: ['chip_aabb', 'chip_abab', 'chip_aaab'], riff: ['edm_arp', 'edm_alt'], bline: ['bdis_abab', 'bhou_aaab'],
    ev: '1980년대 유럽·미국 · 5곡', conf: 'high',
    why: '편성이 「**Synthesizer, drum machine, electronic keyboards, music sequencer, electronic drums**」로 **기타가 없다** — 2026-09-16 에 Disco·Euro Disco 의 근거 없는 `wah` 를 정리하면서 이 칸이 빠져 있었다. 옥타브 베이스도 「**sequenced synthesizer** sound … often programmed in repeating bass sequences, **particularly 16th notes**」라 핑거 베이스와 8분 패턴 둘 다 고쳤다. 템포 「120 and 140 BPM」은 134 를 그대로 받친다',
  },
  italo: {
    anchor: 'Italo Disco', members: ['Italo Disco'],
    mel: { density: [6, 8], leap: [0.85, 1.00], contour: 'arch', range: [6, 7], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: B('octave', 'short', 'locked', true), lead: 'keys',
    roles: { keys: 'lead', keys2: 'vocoder', gtr: 'none', gtr2: 'none' },
    chordType: 'sev', comping: 'disco_stab',
    pool: ['chip_aabb', 'chip_abab', 'chip_aaab'], riff: ['edm_arp', 'edm_alt'], bline: ['bdis_abab', 'bhou_aaab'],
    ev: '1980년대 유럽 · 4곡', conf: 'medium',
    why: '편성은 「electronic drums, drum machines, synthesizers, and occasionally **vocoders**」 — Hi-NRG 와 장비가 같고 **기타는 여기에도 없다**. 갈리는 것은 앞에 서는 것이다: Hi-NRG 는 리듬, 이쪽은 「**catchy melodies**」다. 장르 문서에 BPM 도 베이스 서술도 없어 124 는 근거 없는 값으로 남는다(특정 장비 이름은 곡 문서 쪽 근거다)',
  },
  rnbroots: {
    anchor: 'Rhythm & Blues', members: ['Rhythm & Blues'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'triplet-feel', repetition: 'high', voicing: 'single' },
    bass: B('walking', 'short', 'locked'), lead: 'keys',
    roles: { keys: 'horns', keys2: 'piano', gtr: 'cut', gtr2: 'none' },
    chordType: 'sev', comping: 'rock_8th',
    pool: ['blues_abab', 'blues_aaba', 'root_aaba'], riff: ['rock_drive', 'jazz_gtr_swing'], bline: ['bwal_aabb', 'bcou_aabb'],
    ev: '1940~1960년대 미국 · 4곡', conf: 'medium',
    why: '이 이름은 출처에서 **둘**이다 — 1940년대 발원 장르이면서, 1970년대에는 「a **blanket term** for soul and funk」다. 저장소는 앞쪽으로 잡혀 있고 그것이 맞다. 편성은 「piano, one or two guitars, bass, drums, **saxophones**」이고 12마디 블루스·부기라 **세븐스**가 기본이다 — 3화음이던 것을 고쳤다. 스윙 30·130 BPM 은 「up-tempo blues」·「cruising **boogie** rhythm」이 그대로 받친다',
  },
};
