/* 배치 A8 — Pop 계열 39종. _gen.mjs 가 이 표를 펼친다.

   근거는 genres/02-pop.md 의 장르별 분석과, 프리셋이 실제로 들고 있는 kit 이다.

   드럼(39/39)과 편성(39/39)은 이미 전부 다르다. 묶여 있던 것은 **선율·리프·
   베이스 풀** 12/9/10 개뿐이었다 — 여기를 프리셋 단위로 가른다.

   수치는 재료 실측에서 나왔다(check-melody-profile.mjs P11 이 대조):
     amb 1.00/0.38~0.42/4 · bal 2.13~2.19/0.29~0.35/4 · ant 2.13~2.19/0.48~0.50/5
     gos 2.75/0.53~0.56/5/3화음 · rock 3.50/0.25~0.26/5 · blues 3.50/0.27~0.31/5
     pop 3.63~3.69/0.16~0.19/5 · cin 3.63~3.69/0.21~0.25/6 · cinbal 3.63~3.69/0.33/4
     lat 3.63~3.69/0.26~0.30/5 · latbos 3.63/0.35/4 · root 4.25/0.27~0.31/5
     wor 4.25/0.32~0.34/5 · worcin 4.25/0.30~0.32/6 · afr 4.25/0.33/5
     funk 5.00/0.17~0.18/5 · jazz 6.25/0.29~0.30/5 · jazbal 6.25/0.32~0.33/4
     chip 6.50~6.75/0.92~0.94/7 · dis 6.50~6.75/0.88/7 · edm 12.50~12.75/0.99/7   */

export const batch = 'A8';
export const sub = 'Pop (계열 B)';
export const cat = 'B';
export const date = '2026-09-15';
export const verdict =
  '39종 → 14무리. 드럼과 편성은 이미 전부 달랐고(39/39) 선율만 12풀로 묶여 있었다. '
  + '베이스 엔진이 분기 안에서 획일적이던 것도 장르 성격에 맞춰 갈랐다.';

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

export const groups = {
  /* ── Dance-pop 계보 5종 → 셋 ── */
  edmpop: {
    anchor: 'EDM-pop', members: ['EDM-pop', 'Eurodance'],
    mel: { density: [6, 8], leap: [0.80, 0.95], contour: 'rise', range: [6, 7], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'octave', oct: true, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'supersaw', keys2: 'choir', gtr: 'none', gtr2: 'none' },
    chordType: 'add9', comping: 'disco_stab',
    pool: ['dis_aabb', 'dis_abab', 'dis_aaab'],
    ev: '1990년대 이후 유럽 · 11곡', conf: 'high',
    why: '슈퍼소우가 드롭을 끌고 간다. 형제 중 밀도가 가장 높고 거의 모든 이동이 도약이다',
  },
  dancepop: {
    anchor: 'Dance-pop', members: ['Dance-pop', 'Euro-pop'],
    mel: { density: [3, 5], leap: [0.05, 0.35], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'lead', keys2: 'strings', gtr: 'none', gtr2: 'none' },
    chordType: 'add9', comping: 'pop_pulse',
    pool: ['pop_aabb', 'pop_aaba', 'pop_abab'],
    ev: '1980년대 이후 미국·영국 · 12곡', conf: 'high',
    why: '후렴 훅이 노래가 되어야 하므로 순차 진행이 가장 많다. 드롭이 아니라 아치다',
  },
  freestyle: {
    anchor: 'Freestyle', members: ['Freestyle'],
    mel: { density: [3, 5], leap: [0.10, 0.40], contour: 'arch', range: [5, 7], degrees: [0, 2, 4, 5], rhythm: 'offbeat16', repetition: 'mid', voicing: 'single' },
    bass: { role: 'octave', oct: true, gate: 'short', kick: 'offset', glide: 'none' },
    lead: 'keys', roles: { keys: 'bell', keys2: 'pad', gtr: 'none', gtr2: 'none' },
    chordType: 'add9', comping: 'disco_stab',
    pool: ['cin_aabb', 'cin_aaba', 'cin_abab'],
    ev: '1980년대 미국 동부 · 9곡', conf: 'medium',
    why: '벨 리드에 라틴계 싱코페. 형제 넷이 정박인데 여기만 16분으로 쪼갠다',
  },

  /* ── Synth-pop 계보 5종 + Synthwave → 셋 ── */
  hyperpop: {
    anchor: 'Hyperpop', members: ['Hyperpop', 'Digicore'],
    mel: { density: [6, 8], leap: [0.85, 1.00], contour: 'rise', range: [6, 7], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'low', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'occasional' },
    lead: 'keys', roles: { keys: 'lead', keys2: 'glocken', gtr: 'none', gtr2: 'none' },
    chordType: 'add9', comping: 'disco_stab',
    pool: ['chip_aabb', 'chip_abab', 'chip_aaab'],
    ev: '2010년대 후반 인터넷 · 9곡', conf: 'high',
    why: '155~160 BPM 에 칩튠 어휘. 팝에서 가장 빠르고 거의 모든 이동이 도약이다',
  },
  synthpop: {
    anchor: 'Electropop', members: ['Electropop', 'New Romantic'],
    mel: { density: [1, 3], leap: [0.40, 0.60], contour: 'arch', range: [4, 6], degrees: [0, 2, 4], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'lead', keys2: 'choir', gtr: 'chorus', gtr2: 'none' },
    chordType: 'add9', comping: 'pop_pulse',
    pool: ['ant_aaba', 'ant_aabb', 'ant_abab'],
    ev: '1980년대 영국 · 11곡', conf: 'high',
    why: '신스 훅이 몇 음으로 앤섬을 만든다. 하이퍼팝과 어휘는 같은 계보인데 밀도가 4분의 1이다',
  },
  retrowave: {
    anchor: 'Retrowave', members: ['Retrowave', 'Synthwave'],
    mel: { density: [6, 8], leap: [0.85, 1.00], contour: 'rise', range: [6, 7], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'octave', oct: true, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'pluck-arp', keys2: 'pad', gtr: 'none', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['chip_aabb', 'chip_abab', 'chip_aaab'],
    ev: '2000년대 후반 이후 · 9곡', conf: 'high',
    why: '80년대 아르페지오가 쉬지 않고 돈다. 하이퍼팝과 재료는 같고 템포가 60 느리다',
  },

  /* ── 뿌리 2종 ── */
  tradpop: {
    anchor: 'Traditional Pop', members: ['Traditional Pop'],
    mel: { density: [5, 7], leap: [0.20, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'triplet-feel', repetition: 'low', voicing: 'single' },
    bass: { role: 'walking', oct: false, gate: 'mid', kick: 'free', glide: 'none' },
    lead: 'keys', roles: { keys: 'strings', keys2: 'trumpet', gtr: 'clean', gtr2: 'none' },
    chordType: 'sev', comping: 'ballad_pad',
    pool: ['jazz_aaba', 'jazz_abab', 'jazbal_aaba'],
    ev: '1940~50년대 미국 · 10곡', conf: 'high',
    why: '스윙 50 에 업라이트, 7화음. 빅밴드 어법이라 팝에서 유일하게 재즈 쪽이다',
  },
  brill: {
    anchor: 'Brill Building', members: ['Brill Building'],
    mel: { density: [3, 5], leap: [0.15, 0.40], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'walking', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'piano', keys2: 'strings', gtr: 'clean', gtr2: 'none' },
    chordType: 'triad', comping: 'pop_pulse',
    pool: ['pop_aaba', 'rock_aaba', 'blues_aaba'],
    ev: '1960년대 초 미국 뉴욕 · 10곡', conf: 'high',
    why: '작곡가 공장의 3분 팝. 피아노가 훅을 쓰고 구조가 단단해 반복이 강하다',
  },

  /* ── Teen Pop · Indie Pop 7종 → 셋 ── */
  teenpop: {
    anchor: 'Teen Pop', members: ['Teen Pop', 'Bubblegum'],
    mel: { density: [3, 5], leap: [0.05, 0.35], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'piano-organ', keys2: 'glocken', gtr: 'clean', gtr2: 'none' },
    chordType: 'add9', comping: 'pop_pulse',
    pool: ['pop_aabb', 'pop_abab', 'cinbal_aaba'],
    ev: '1990년대 이후 미국·영국 · 12곡', conf: 'high',
    why: '합창 훅이라 순차가 많고 반복이 강하다. 한 번 듣고 따라 부를 수 있어야 한다',
  },
  indiepop: {
    anchor: 'Indie Pop', members: ['Indie Pop', 'Twee Pop', 'Bedroom Pop'],
    mel: { density: [1, 3], leap: [0.20, 0.45], contour: 'arch', range: [3, 5], degrees: [0, 2, 4, 1], rhythm: 'offbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'offset', glide: 'none' },
    lead: 'gtr', roles: { keys: 'organ-ep', keys2: 'glocken', gtr: 'twelve', gtr2: 'none' },
    chordType: 'add9', comping: 'ballad_pad',
    pool: ['bal_aaba', 'bal_aabb', 'bal_abab'],
    ev: '1980년대 이후 영국·미국 · 11곡', conf: 'high',
    why: '다듬지 않은 프로덕션. 12현 기타가 앞이라 건반은 비켜 주고 음이 적다',
  },
  chamber: {
    anchor: 'Chamber Pop', members: ['Chamber Pop', 'Baroque Pop'],
    mel: { density: [3, 5], leap: [0.10, 0.40], contour: 'arch', range: [5, 7], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'low', voicing: 'single' },
    bass: { role: 'walking', oct: false, gate: 'mid', kick: 'free', glide: 'none' },
    lead: 'keys', roles: { keys: 'strings-harpsi', keys2: 'clarinet', gtr: 'nylon', gtr2: 'none' },
    chordType: 'add9', comping: 'ballad_pad',
    pool: ['cin_aaba', 'cin_aabb', 'cin_abab'],
    ev: '1960년대 이후 영국·미국 · 9곡', conf: 'high',
    why: '하프시코드·현·목관. 관현악 편성이라 음역이 형제보다 한 도수 넓고 반복이 약하다',
  },

  /* ── Soft Rock · AOR 3종 → 둘 ── */
  citypop: {
    anchor: 'City Pop', members: ['City Pop'],
    mel: { density: [5, 7], leap: [0.20, 0.45], contour: 'zigzag', range: [4, 6], degrees: [0, 2, 4, 5, 6], rhythm: 'offbeat16', repetition: 'low', voicing: 'single' },
    bass: { role: 'walking', oct: true, gate: 'short', kick: 'offset', glide: 'none' },
    lead: 'keys', roles: { keys: 'ep', keys2: 'brass', gtr: 'clean-cut', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['jazbal_aaba', 'jazbal_abab', 'jazz_aaba'],
    ev: '1980년대 일본 · 10곡', conf: 'high',
    why: '슬랩 베이스에 9화음. 팝에서 재즈 화성을 가장 많이 쓰는 자리라 밀도가 높다',
  },
  softrock: {
    anchor: 'Soft Rock', members: ['Soft Rock', 'AOR'],
    mel: { density: [3, 5], leap: [0.10, 0.40], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'piano-poly', keys2: 'strings', gtr: 'clean', gtr2: 'none' },
    chordType: 'sev', comping: 'ballad_pad',
    pool: ['cinbal_aaba', 'cinbal_aabb', 'bal_aaba'],
    ev: '1970년대 미국 · 10곡', conf: 'high',
    why: '플랫와운드에 라디오용 매끈함. 시티팝과 편성은 이웃인데 싱코페가 없고 훨씬 성기다',
  },

  /* ── 지역 팝 8종 + 동아시아 2종 → 셋 ── */
  jpop: {
    anchor: 'J-pop', members: ['J-pop', 'Mandopop', 'Cantopop', 'Kayōkyoku'],
    mel: { density: [3, 5], leap: [0.10, 0.40], contour: 'arch', range: [5, 7], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'piano-strings', keys2: 'strings', gtr: 'clean', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['cin_aabb', 'cin_aaba', 'cinbal_aabb'],
    ev: '1980년대 이후 동아시아 · 12곡', conf: 'high',
    why: '현이 두껍게 깔리고 전조가 잦다. 음역이 서구 팝보다 넓고 9화음을 기본으로 쓴다',
  },
  enka: {
    anchor: 'Enka', members: ['Enka', 'Trot'],
    mel: { density: [3, 5], leap: [0.20, 0.45], contour: 'fall', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'long', kick: 'offset', glide: 'none' },
    lead: 'keys', roles: { keys: 'strings-sax', keys2: 'flute', gtr: 'koto', gtr2: 'none' },
    chordType: 'sev', comping: 'ballad_pad',
    pool: ['wor_aaba', 'wor_aabb', 'worcin_aaba'],
    ev: '1960년대 이후 일본·한국 · 10곡', conf: 'high',
    why: '요나누키 5음계에 꺾는 창법. 하행 윤곽이 이 계열에서 유일하고 코토·색소폰이 앞에 선다',
  },
  worldpop: {
    anchor: 'Latin Pop', members: ['Latin Pop', 'Schlager', 'Shibuya-kei', 'C-pop'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'offbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'offset', glide: 'none' },
    lead: 'keys', roles: { keys: 'horns-accordion', keys2: 'piano', gtr: 'nylon', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['lat_aabb', 'lat_abab', 'latbos_aabb'],
    ev: '1970년대 이후 유럽·중남미·일본 · 11곡', conf: 'medium',
    why: '지역색이 관·아코디언·나일론으로 나온다. J-pop 과 달리 오프비트가 몸이다',
  },

  /* ── 서아시아·남아시아·발칸·하이브리드 ── */
  mideast: {
    anchor: 'Arabic Pop', members: ['Arabic Pop', 'Rumba Flamenca', 'Turbo-folk'],
    mel: { density: [3, 5], leap: [0.20, 0.45], contour: 'zigzag', range: [4, 6], degrees: [0, 1, 3, 4], rhythm: 'offbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'offset', glide: 'none' },
    lead: 'gtr', roles: { keys: 'ep', keys2: 'strings', gtr: 'nylon-saz', gtr2: 'none' },
    chordType: 'triad', comping: 'ballad_pad',
    pool: ['wor_aabb', 'wor_abab', 'worcin_aabb'],
    ev: '1980년대 이후 서아시아·발칸 · 9곡', conf: 'medium',
    why: '장식음이 많고 인접 도수를 스친다. 나일론·사즈가 선율을 맡아 건반은 받친다',
  },
  desi: {
    anchor: 'Desi Beats', members: ['Desi Beats', 'UK Bhangra'],
    mel: { density: [3, 5], leap: [0.20, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'offbeat16', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'gtr', roles: { keys: 'ep', keys2: 'strings', gtr: 'sitar', gtr2: 'none' },
    chordType: 'triad', comping: 'trap_pad',
    pool: ['afr_aabb', 'afr_aaab', 'wor_aaba'],
    ev: '1990년대 이후 영국·펀자브 · 9곡', conf: 'high',
    why: '시타르에 돌 리듬. 132~133 BPM 으로 서아시아 형제보다 20 빠르고 16분으로 쪼갠다',
  },
  tropical: {
    anchor: 'Tropical Bass', members: ['Tropical Bass'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'static', range: [4, 6], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'long', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'bell', keys2: 'steelpan', gtr: 'clean', gtr2: 'none' },
    chordType: 'sev', comping: 'trap_pad',
    pool: ['car_aabb', 'car_aaba', 'lat_abab'],
    ev: '2010년대 인터넷·중남미 · 8곡', conf: 'medium',
    why: '스틸팬에 카리브 오프비트. 팝 계열에 있지만 어휘는 카리브 쪽이다',
  },
};
