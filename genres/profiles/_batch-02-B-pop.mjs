/* 배치 A8 — Pop 계열 39종. _gen.mjs 가 이 표를 펼친다.

   2026-09-15 첫 판은 genres/02-pop.md 의 분석과 프리셋 kit 만 보고 갈랐다.
   2026-09-16 에 **대표곡으로 다시 검증했다.** 장르마다 웹에서 실재·장르 분류를 확인한
   곡 3~5곡(genres/02-pop.md «대표곡» 표)을 모으고, 곡에서 확인되는 성질
   — 템포 범위 · 건반 종류 · 기타 음색 · 베이스 역할 · 드럼 골격 — 과 대조했다.
   ev 의 «N곡» 은 그 표에 실제로 적힌 곡 수다(무리 안 형제의 곡을 합친 수).

   무리를 쪼갠 곳 (근거가 달라서)
     · worldpop(Latin Pop·Schlager·Shibuya-kei·C-pop) → 넷으로. 슐라거는 아코디언이
       대표곡에 없고 장조 팝이며, 시부야케이는 재즈·보사 인용, C-pop 은 중국 5음계다
     · desi(Desi Beats·UK Bhangra) → 둘로. UK 방그라는 곡이 서고(3곡) 98~105 BPM 인데,
       Desi Beats 는 **대표곡이 0곡**이다 — «장르가 아니라 문화 정체성» 이라는 출처가
       11-regional.md ※1 과 같은 말을 한다. 그래서 confidence low · 0곡으로 적는다

   수치는 재료 실측에서 나왔다(check-melody-profile.mjs P11 이 대조):
     amb 1.00/0.38~0.42/4 · bos 2.00/0.41~0.45/4 · bal 2.13~2.19/0.29~0.35/4
     ant 2.13~2.19/0.48~0.50/5 · pop 3.63~3.69/0.16~0.19/5 · cin 3.63~3.69/0.21~0.25/6
     cinbal 3.63~3.69/0.33/4 · lat 3.63~3.69/0.26~0.30/5 · latbos 3.63/0.35/4
     car 3.50/0.27~0.31/5 · rock 3.50/0.25~0.26/5 · blues 3.50/0.27~0.31/5
     root 4.25/0.27~0.31/5 · wor 4.25/0.32~0.34/5 · worcin 4.25/0.30~0.32/6
     afr 4.25/0.33/5 · jazz 6.25/0.29~0.30/5 · jazbal 6.25/0.32~0.33/4
     chip 6.50~6.75/0.92~0.94/7 · dis 6.50~6.75/0.88/7                            */

export const batch = 'A8';
export const sub = 'Pop (계열 B)';
export const cat = 'B';
export const date = '2026-09-16';
export const verdict =
  '39종 → 23무리. 대표곡으로 다시 갈랐고 두 무리를 쪼갰다(지역 팝 넷으로 · 남아시아 둘로). '
  + 'Dance-pop·Teen Pop·Latin Pop 은 대표곡이 단조라 스케일을 바꿨고, Desi Beats 는 대표곡 0곡이라 확신도를 낮췄다.';

export const SUB = {
  'Synthwave': 'Downtempo · Ambient · Retro',
  'Eurodance': 'Dance-pop 계보', 'Dance-pop': 'Dance-pop 계보', 'Freestyle': 'Dance-pop 계보',
  'Euro-pop': 'Dance-pop 계보', 'EDM-pop': 'Dance-pop 계보',
  'Hyperpop': 'Synth-pop 계보', 'Electropop': 'Synth-pop 계보', 'New Romantic': 'Synth-pop 계보',
  'Retrowave': 'Synth-pop 계보', 'Digicore': 'Synth-pop 계보',
  'Traditional Pop': '뿌리', 'Brill Building': '뿌리',
  'Teen Pop': 'Teen Pop · Indie Pop', 'Bedroom Pop': 'Teen Pop · Indie Pop',
  'Indie Pop': 'Teen Pop · Indie Pop', 'Bubblegum': 'Teen Pop · Indie Pop',
  'Twee Pop': 'Teen Pop · Indie Pop', 'Chamber Pop': 'Teen Pop · Indie Pop',
  'Baroque Pop': 'Teen Pop · Indie Pop',
  'City Pop': 'Soft Rock · AOR 계보', 'Soft Rock': 'Soft Rock · AOR 계보', 'AOR': 'Soft Rock · AOR 계보',
  'J-pop': '지역 팝', 'Shibuya-kei': '지역 팝', 'Enka': '지역 팝', 'Mandopop': '지역 팝',
  'Schlager': '지역 팝', 'Kayōkyoku': '지역 팝', 'Cantopop': '지역 팝', 'Latin Pop': '지역 팝',
  'Trot': '동아시아', 'C-pop': '동아시아',
  'Arabic Pop': '서아시아 · 지중해', 'Rumba Flamenca': '서아시아 · 지중해',
  'Turbo-folk': '동유럽 · 발칸',
  'Desi Beats': '남아시아', 'UK Bhangra': '남아시아',
  'Tropical Bass': '하이브리드 · 인터넷 장르',
};

/* 프리셋 파일(src/data/presets/02-pop.js)의 실제 스케일 */
export const SCALE = {
  'Synthwave': 'Natural Minor', 'Eurodance': 'Natural Minor', 'Hyperpop': 'Major',
  'Traditional Pop': 'Major', 'Dance-pop': 'Natural Minor', 'Freestyle': 'Major',
  'Electropop': 'Natural Minor', 'Teen Pop': 'Natural Minor', 'Bedroom Pop': 'Major',
  'Indie Pop': 'Major', 'City Pop': 'Dorian', 'J-pop': 'Major', 'Shibuya-kei': 'Major',
  'Enka': 'Natural Minor', 'Trot': 'Major', 'Mandopop': 'Major', 'Arabic Pop': 'Natural Minor',
  'Schlager': 'Major', 'Turbo-folk': 'Natural Minor', 'Brill Building': 'Major',
  'Soft Rock': 'Major', 'AOR': 'Major', 'New Romantic': 'Natural Minor',
  'Retrowave': 'Natural Minor', 'Digicore': 'Natural Minor', 'Euro-pop': 'Major',
  'EDM-pop': 'Major', 'Bubblegum': 'Major', 'Twee Pop': 'Major', 'Chamber Pop': 'Major',
  'Baroque Pop': 'Major', 'Kayōkyoku': 'Major', 'Cantopop': 'Major', 'Latin Pop': 'Natural Minor',
  'Desi Beats': 'Minor Pentatonic', 'Rumba Flamenca': 'Minor Pentatonic', 'C-pop': 'Major',
  'Tropical Bass': 'Minor Pentatonic', 'UK Bhangra': 'Minor Pentatonic',
};

export const groups = {
  /* ── Dance-pop 계보 ── */
  edmpop: {
    anchor: 'EDM-pop', members: ['EDM-pop', 'Eurodance'],
    mel: { density: [6, 8], leap: [0.80, 0.95], contour: 'rise', range: [6, 7], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'octave', oct: true, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'supersaw', keys2: 'choir', gtr: 'none', gtr2: 'none' },
    chordType: 'add9', comping: 'disco_stab',
    pool: ['dis_aabb', 'dis_abab', 'dis_aaab'],
    ev: '1990~2010년대 유럽·미국 · 10곡', conf: 'high',
    why: '드롭의 신스 훅이 곡을 끈다. 유로댄스는 정전 5곡의 중앙이 128 이라 140 에서 내렸고, 장르 문서대로 2·4박 스네어를 조용히 깔았다',
  },
  dancepop: {
    anchor: 'Dance-pop', members: ['Dance-pop', 'Euro-pop'],
    mel: { density: [3, 5], leap: [0.05, 0.35], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'lead', keys2: 'strings', gtr: 'none', gtr2: 'none' },
    chordType: 'add9', comping: 'pop_pulse',
    pool: ['pop_aabb', 'pop_aaba', 'pop_abab'],
    ev: '1970~2010년대 미국·유럽 · 10곡', conf: 'high',
    why: '후렴 훅이 노래가 되어야 하므로 순차 진행이 가장 많다. 댄스팝 대표곡은 5곡 중 4곡이 단조라 스케일을 옮겼고, «스네어를 안 쓴다» 는 Kylie 와 어긋나 2·4박을 넣었다',
  },
  freestyle: {
    anchor: 'Freestyle', members: ['Freestyle'],
    mel: { density: [3, 5], leap: [0.10, 0.40], contour: 'arch', range: [5, 7], degrees: [0, 2, 4, 5], rhythm: 'offbeat16', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'offset', glide: 'none' },
    lead: 'keys', roles: { keys: 'bell', keys2: 'pad', gtr: 'none', gtr2: 'none' },
    chordType: 'add9', comping: 'disco_stab',
    pool: ['cin_aabb', 'cin_aaba', 'cin_abab'],
    ev: '1980년대 미국 동부 · 5곡', conf: 'high',
    why: '벨 리드에 라틴계 싱코페. 기준곡 Let the Music Play 의 베이스는 808 롱 서브가 아니라 **쉬지 않는 TB-303 음형**이라 엔진과 게이트를 바꿨다',
  },

  /* ── Synth-pop 계보 ── */
  hyperpop: {
    anchor: 'Hyperpop', members: ['Hyperpop', 'Digicore'],
    mel: { density: [6, 8], leap: [0.85, 1.00], contour: 'rise', range: [6, 7], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'low', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'occasional' },
    lead: 'keys', roles: { keys: 'lead', keys2: 'glocken', gtr: 'none/crunch', gtr2: 'none' },
    chordType: 'add9', comping: 'disco_stab',
    pool: ['chip_aabb', 'chip_abab', 'chip_aaab'],
    ev: '2010~2020년대 인터넷 · 8곡', conf: 'high',
    why: '칩튠 어휘의 고밀도 도약이 몸이다. 주인공은 신스가 아니라 **처리된 보컬**이고, 디지코어에는 팝펑크·이모 기타 갈래가 있어 기타를 켰다',
  },
  synthpop: {
    anchor: 'Electropop', members: ['Electropop', 'New Romantic'],
    mel: { density: [1, 3], leap: [0.40, 0.60], contour: 'arch', range: [4, 6], degrees: [0, 2, 4], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'lead/brass', keys2: 'choir', gtr: 'none/clean', gtr2: 'none' },
    chordType: 'add9', comping: 'pop_pulse',
    pool: ['ant_aaba', 'ant_aabb', 'ant_abab'],
    ev: '1980~2010년대 영국·미국 · 8곡', conf: 'high',
    why: '신스 훅이 몇 음으로 앤섬을 만든다. 일렉트로팝 4곡은 기타가 없고(«보컬 외 전부 프로그래밍»), 뉴로맨틱은 밴드형 2곡에 실제 기타가 있어 한쪽만 켰다',
  },
  retrowave: {
    anchor: 'Retrowave', members: ['Retrowave', 'Synthwave'],
    mel: { density: [6, 8], leap: [0.85, 1.00], contour: 'rise', range: [6, 7], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'octave', oct: true, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'pluck-arp', keys2: 'pad', gtr: 'none', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['chip_aabb', 'chip_abab', 'chip_aaab'],
    ev: '2010년대 이후 · 6곡', conf: 'medium',
    why: '아르페지오가 곡 내내 돈다 — 고밀도 도약은 그 반주의 성질이고 신스웨이브 대표곡의 리드는 느린 보컬이다. 레트로웨이브는 대표곡이 130~147 이라 99 에서 올렸다',
  },

  /* ── 뿌리 ── */
  tradpop: {
    anchor: 'Traditional Pop', members: ['Traditional Pop'],
    mel: { density: [2, 4], leap: [0.20, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'triplet-feel', repetition: 'low', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'long', kick: 'free', glide: 'none' },
    lead: 'keys', roles: { keys: 'strings', keys2: 'flute-horn', gtr: 'clean', gtr2: 'none' },
    chordType: 'sev', comping: 'ballad_pad',
    pool: ['bal_aaba', 'cinbal_aabb', 'cin_aaba'],
    ev: '1950~60년대 미국 · 3곡', conf: 'medium',
    why: '크루너의 긴 음과 순차 진행이 몸이다. 검증 3곡은 69~91 의 스트레이트·12/8 발라드였고 빅밴드 스윙이 아니었다 — 소리에 닿지 않던 swing 50 을 0 으로 내리고 재즈 어휘 대신 발라드 재료를 줬다',
  },
  brill: {
    anchor: 'Brill Building', members: ['Brill Building'],
    mel: { density: [3, 5], leap: [0.15, 0.40], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'walking', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'piano', keys2: 'sax', gtr: 'clean', gtr2: 'none' },
    chordType: 'triad', comping: 'pop_pulse',
    pool: ['pop_aaba', 'rock_aaba', 'blues_aaba'],
    ev: '1960년대 초 미국 뉴욕 · 3곡', conf: 'medium',
    why: '작곡가 공장의 3분 팝. 피아노가 세 곡 모두에 있고 색소폰이 둘이라 2번 건반을 색소폰으로 바꿨다',
  },

  /* ── Teen Pop · Indie Pop ── */
  teenpop: {
    anchor: 'Teen Pop', members: ['Teen Pop', 'Bubblegum'],
    mel: { density: [3, 5], leap: [0.05, 0.35], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'piano-organ', keys2: 'piano', gtr: 'wah-clean', gtr2: 'none' },
    chordType: 'add9', comping: 'pop_pulse',
    pool: ['pop_aabb', 'pop_abab', 'cinbal_aaba'],
    ev: '1960~2010년대 미국 · 8곡', conf: 'high',
    why: '한 번 듣고 따라 부르는 훅이 몸이다. 틴팝 대표곡 4곡 중 3곡이 단조(Max Martin 시대)라 스케일을 옮겼고 와와 기타를 넣었다',
  },
  indiepop: {
    anchor: 'Indie Pop', members: ['Indie Pop', 'Twee Pop', 'Bedroom Pop'],
    mel: { density: [1, 3], leap: [0.20, 0.45], contour: 'arch', range: [3, 5], degrees: [0, 2, 4, 1], rhythm: 'offbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'offset', glide: 'none' },
    lead: 'gtr', roles: { keys: 'whistle-piano', keys2: 'none', gtr: 'acoustic-jangle', gtr2: 'none' },
    chordType: 'add9', comping: 'ballad_pad',
    pool: ['bal_aaba', 'bal_aabb', 'bal_abab'],
    ev: '1980~2020년대 영국·미국 · 12곡', conf: 'high',
    why: '다듬지 않은 프로덕션에 훅 하나. 오르간·12현·비브라폰·로즈는 검증곡에 없었고, 대신 휘파람 훅·어쿠스틱 스트럼·봉고·싼 신스가 반복해 나왔다',
  },
  chamber: {
    anchor: 'Chamber Pop', members: ['Chamber Pop', 'Baroque Pop'],
    mel: { density: [3, 5], leap: [0.10, 0.40], contour: 'arch', range: [5, 7], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'low', voicing: 'single' },
    bass: { role: 'walking', oct: false, gate: 'mid', kick: 'free', glide: 'none' },
    lead: 'keys', roles: { keys: 'piano-harpsi', keys2: 'strings-flute', gtr: 'steel', gtr2: 'harp' },
    chordType: 'add9', comping: 'ballad_pad',
    pool: ['cin_aaba', 'cin_aabb', 'cin_abab'],
    ev: '1960년대 이후 영국·미국 · 10곡', conf: 'high',
    why: '하프시코드·현·목관이 박을 새기고 드럼은 없거나 아주 여리다. 검증곡에서 가장 흔한 건반은 피아노였고 Yesterday 는 나일론이 아니라 스틸현이다',
  },

  /* ── Soft Rock · AOR ── */
  citypop: {
    anchor: 'City Pop', members: ['City Pop'],
    mel: { density: [5, 7], leap: [0.20, 0.45], contour: 'zigzag', range: [4, 6], degrees: [0, 2, 4, 5, 6], rhythm: 'offbeat16', repetition: 'low', voicing: 'single' },
    bass: { role: 'walking', oct: true, gate: 'short', kick: 'offset', glide: 'none' },
    lead: 'keys', roles: { keys: 'ep', keys2: 'brass', gtr: 'clean-cut', gtr2: 'clean-cut' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['jazbal_aaba', 'jazbal_abab', 'jazz_aaba'],
    ev: '1980년대 일본 · 4곡', conf: 'medium',
    why: '9화음에 펑크 베이스. 네 곡 어디에도 슬랩 크레딧이 없어 핑거로 되돌렸고(문서 노트와도 일치), 커팅 기타 두 대가 좌우로 갈린다',
  },
  softrock: {
    anchor: 'Soft Rock', members: ['Soft Rock', 'AOR'],
    mel: { density: [3, 5], leap: [0.10, 0.40], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'ep-poly', keys2: 'piano', gtr: 'clean', gtr2: 'none' },
    chordType: 'sev', comping: 'ballad_pad',
    pool: ['cinbal_aaba', 'cinbal_aabb', 'bal_aaba'],
    ev: '1970~80년대 미국 · 7곡', conf: 'high',
    why: '라디오용 매끈함. 소프트록 3곡은 모두 전자피아노(Wurlitzer·Rhodes)이고 현악 크레딧은 없어 건반을 바꿨다. AOR 은 폴리신스와 피아노 리프가 짝이다',
  },

  /* ── 지역 팝 ── */
  jpop: {
    anchor: 'J-pop', members: ['J-pop', 'Mandopop', 'Cantopop', 'Kayōkyoku'],
    mel: { density: [3, 5], leap: [0.10, 0.40], contour: 'arch', range: [5, 7], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'piano-strings', keys2: 'strings', gtr: 'clean', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['cin_aabb', 'cin_aaba', 'cinbal_aabb'],
    ev: '1960~2010년대 동아시아 · 16곡', conf: 'high',
    why: '피아노와 현이 깔리고 후렴에서 상행한다. J-pop 검증곡은 87~130 이라 135 에서 내렸고, 초기 광둥어 팝은 «거의 모든 곡이 하행 베이스라인» 이라 베이스만 따로 바꿨다',
  },
  enka: {
    anchor: 'Enka', members: ['Enka', 'Trot'],
    mel: { density: [3, 5], leap: [0.20, 0.45], contour: 'fall', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'long', kick: 'offset', glide: 'none' },
    lead: 'keys', roles: { keys: 'strings', keys2: 'sax', gtr: 'clean', gtr2: 'shamisen' },
    chordType: 'sev', comping: 'ballad_pad',
    pool: ['wor_aaba', 'wor_aabb', 'worcin_aaba'],
    ev: '1930~2000년대 일본·한국 · 9곡', conf: 'high',
    why: '요나누키 음계에 꺾는 창법(코부시), 하행 윤곽. 위키 두 곳이 드는 악기는 기타·바이올린·샤미센·샤쿠하치이고 **코토는 없어** 바꿨다. 트로트의 2박은 정박이라 스윙 18 을 0 으로 내렸다',
  },
  latinpop: {
    anchor: 'Latin Pop', members: ['Latin Pop'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'offbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'offset', glide: 'none' },
    lead: 'keys', roles: { keys: 'horns', keys2: 'piano', gtr: 'nylon', gtr2: 'clean' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['lat_aabb', 'lat_abab', 'latbos_aabb'],
    ev: '1980~2000년대 중남미·미국 · 4곡', conf: 'medium',
    why: '곡마다 출신 리듬이 다르다(살사·콩가·셔플·안데스). 확인된 곡 3/4 가 단조라 스케일을 옮기고 클라베를 치는 콩가를 넣었다',
  },
  schlager: {
    anchor: 'Schlager', members: ['Schlager'],
    mel: { density: [3, 5], leap: [0.05, 0.35], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'octave', oct: true, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'synth-pad', keys2: 'strings', gtr: 'clean', gtr2: 'none' },
    chordType: 'nine', comping: 'pop_pulse',
    pool: ['pop_aabb', 'pop_aaba'],
    ev: '1960~2010년대 독일 · 5곡', conf: 'medium',
    why: '짧은 반복 후렴의 장조 팝이고 현대형은 **디스코폭스**(4/4 약 120)다. 다섯 곡 어디에도 아코디언 크레딧이 없어 신스로 바꾸고 라틴 선율 재료에서 떼어 냈다',
  },
  shibuya: {
    anchor: 'Shibuya-kei', members: ['Shibuya-kei'],
    mel: { density: [1, 3], leap: [0.30, 0.50], contour: 'zigzag', range: [3, 5], degrees: [0, 2, 4, 5], rhythm: 'offbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'walking', oct: false, gate: 'mid', kick: 'offset', glide: 'none' },
    lead: 'keys', roles: { keys: 'organ', keys2: 'flute', gtr: 'jazzbox', gtr2: 'nylon' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['bos_aabb', 'bos_aaba', 'latbos_aabb'],
    ev: '1990년대 일본 · 4곡', conf: 'medium',
    why: '보사·재즈·라운지를 인용해 붙이는 «컷 앤드 페이스트» 가 정체성이라 곡마다 리듬이 다르다. 비브라폰·12현은 확인되지 않아 재즈 아치톱과 오르간으로 바꿨다',
  },
  cpop: {
    anchor: 'C-pop', members: ['C-pop'],
    mel: { density: [3, 5], leap: [0.20, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'strings', keys2: 'dizi-flute', gtr: 'clean', gtr2: 'guzheng' },
    chordType: 'sev', comping: 'ballad_pad',
    pool: ['wor_aaba', 'cin_aabb'],
    ev: '1920~2010년대 중국 · 4곡', conf: 'medium',
    why: '중국 5음계(궁조식)가 반복 출처로 확인됐고 비파·고쟁·얼후·피리가 편성에 든다. 도리안을 뒷받침하는 출처는 없어 장조로 바꿨다',
  },

  /* ── 서아시아·발칸·남아시아·하이브리드 ── */
  mideast: {
    anchor: 'Arabic Pop', members: ['Arabic Pop', 'Rumba Flamenca', 'Turbo-folk'],
    mel: { density: [3, 5], leap: [0.20, 0.45], contour: 'zigzag', range: [4, 6], degrees: [0, 1, 3, 4], rhythm: 'offbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'offset', glide: 'none' },
    lead: 'gtr', roles: { keys: 'pad-accordion', keys2: 'strings-trumpet', gtr: 'nylon-bouzouki', gtr2: 'oud' },
    chordType: 'triad', comping: 'ballad_pad',
    pool: ['wor_aabb', 'wor_abab', 'worcin_aabb'],
    ev: '1970~2000년대 서아시아·지중해·발칸 · 12곡', conf: 'medium',
    why: '장식음이 많고 인접 도수를 스친다 — 선율 어휘는 셋이 같다. 갈리는 것은 악기다: 아랍 팝은 나일론 기타와 다르부카, 룸바 플라멩카는 플라멩코 기타와 팔마스·봉고, 터보포크는 아코디언과 부주키다(사즈 근거는 어디에도 없었다)',
  },
  bhangra: {
    anchor: 'UK Bhangra', members: ['UK Bhangra'],
    mel: { density: [3, 5], leap: [0.20, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'offbeat16', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'gtr', roles: { keys: 'ep', keys2: 'strings', gtr: 'tumbi', gtr2: 'clean' },
    chordType: 'triad', comping: 'trap_pad',
    pool: ['afr_aabb', 'afr_aaab', 'wor_aaba'],
    ev: '1970~2000년대 영국 · 3곡', conf: 'medium',
    why: '돌(dhol)의 «chaal» 이 골격이고 훅은 샘플된 신스 베이스다. 곡은 98~105 BPM 이고 돌이 그 두 배로 친다 — 132 는 둘 다와 맞지 않았다. 시타르 근거는 없어 툼비 쪽 음색으로 바꿨다',
  },
  desi: {
    anchor: 'Desi Beats', members: ['Desi Beats'],
    mel: { density: [3, 5], leap: [0.20, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'offbeat16', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'gtr', roles: { keys: 'ep', keys2: 'strings', gtr: 'sitar', gtr2: 'nylon' },
    chordType: 'triad', comping: 'trap_pad',
    pool: ['afr_aabb', 'afr_aaab', 'wor_aaba'],
    ev: '2000년대 이후 영국·남아시아 디아스포라 · 0곡', conf: 'low',
    why: '**대표곡이 0곡이다.** «desi 는 장르가 아니라 문화 정체성» 이라는 출처가 곡을 하나도 들지 않고, 11-regional.md ※1 도 같은 판단이다. 이전 판의 «확신도 high · 9곡» 은 근거가 없었다 — 값은 UK 방그라의 인도 하우스 해석을 빌려 둔 것이고 그렇게 적어 둔다',
  },
  tropical: {
    anchor: 'Tropical Bass', members: ['Tropical Bass'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'static', range: [4, 6], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'long', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'bell', keys2: 'pad', gtr: 'none', gtr2: 'none' },
    chordType: 'sev', comping: 'trap_pad',
    pool: ['car_aabb', 'car_aaba', 'lat_abab'],
    ev: '2000~2010년대 앙골라·포르투갈 · 3곡', conf: 'low',
    why: '방법론의 이름이라 곡 단위 장르 태그가 드물고, 확인된 3곡은 모두 한 팀(Buraka Som Sistema)의 쿠두루다. 선율 악기가 주인공인 사례가 없어 스틸팬을 빼고 트레실로 타악을 넣었다',
  },
};
