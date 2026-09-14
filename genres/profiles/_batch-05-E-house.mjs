/* 배치 A4 — House 계열 23종. _gen.mjs 가 이 표를 펼친다. */

export const batch = 'A4';
export const sub = 'House 계열';
export const cat = 'E';
export const date = '2026-09-14';
export const verdict =
  '23종 → 선율 7무리. 남아 있던 마지막 23종 천장이었다. 23풀로 쪼개지 않았다.';

/* Amapiano·Afro House 는 하위분기가 House 계열인데 계열(cat)은 J(아프리카)다.
   분류의 긴장이 그대로 남아 있는 자리다 — 프로파일은 실제 값을 적는다. */
export const CAT = { 'Amapiano': 'J', 'Afro House': 'J' };

export const PHRASES = {
  garage: {
    keysA: ['a--b--c---a--c--', 'a--b--c---e--d--', 'c--d--e---c--e--', 'a--b--a---------'],
    keysB: ['e--f--g---e--g--', 'e--f--g---h--g--', 'g--f--d---g--e--', 'e--f--e---------'],
  },
};

export const groups = {
  piano: {
    anchor: 'House', members: ['House', 'Chicago House', 'Garage House'],
    mel: { density: [2, 4], leap: [0.45, 0.65], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'onbeat', repetition: 'mid', voicing: 'chord' },
    bass: { role: 'root', oct: true, gate: 'short', kick: 'offset', glide: 'none' },
    lead: 'keys', roles: { keys: 'piano-stab', keys2: 'strings', gtr: 'cut', gtr2: 'none' },
    chordType: 'sev', comping: 'disco_stab',
    pool: ['gos_aabb', 'gos_aaba', 'gos_abab'],
    ev: '1980년대 중후반 미국 시카고 · 12곡', conf: 'high',
    why: '가스펠·디스코에서 온 피아노 코드 스탭. 형제 중 유일하게 3화음 표기가 몸이다',
  },
  filter: {
    anchor: 'French House', members: ['French House', 'Filter House'],
    mel: { density: [6, 8], leap: [0.80, 0.95], contour: 'rise', range: [6, 7], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'octave', oct: true, gate: 'short', kick: 'offset', glide: 'none' },
    lead: 'keys', roles: { keys: 'string-loop', keys2: 'brass', gtr: 'filter-cut', gtr2: 'none' },
    chordType: 'sev', comping: 'disco_stab',
    pool: ['dis_abab', 'dis_aabb', 'dis_aaab'],
    ev: '1990년대 후반 프랑스 파리 · 10곡', conf: 'high',
    why: '디스코 루프를 필터로 여닫는다. 긴 상행 프레이즈가 한 덩어리로 움직인다',
  },
  deep: {
    anchor: 'Deep House', members: ['Deep House', 'Melodic House & Techno', 'Tech House', 'Future House'],
    mel: { density: [1, 3], leap: [0.25, 0.45], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'long', kick: 'offset', glide: 'none' },
    lead: 'keys2', roles: { keys: 'pluck', keys2: 'pad', gtr: 'none', gtr2: 'none' },
    chordType: 'sev', comping: 'disco_stab',
    pool: ['amb_aaba', 'bal_aaba', 'bal_abab'],
    ev: '1990년대 이후 미국·독일 · 11곡', conf: 'high',
    why: '패드 위에 성글게. 23종 중 움직임이 가장 적다',
  },
  garage: {
    anchor: 'UK Garage',
    members: ['UK Garage', '2-step Garage', 'Speed Garage', 'Bassline', 'UK Funky'],
    mel: { density: [4, 6], leap: [0.15, 0.45], contour: 'zigzag', range: [5, 7], degrees: [0, 2, 1, 4, 3], rhythm: 'offbeat16', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: true, gate: 'short', kick: 'free', glide: 'none' },
    lead: 'keys', roles: { keys: 'chop', keys2: 'strings', gtr: 'cut', gtr2: 'none' },
    chordType: 'sev', comping: 'disco_stab',
    pool: ['gar_aabb', 'gar_abab', 'funk_abab'],
    ev: '1990년대 후반 영국 런던 · 12곡', conf: 'high',
    why: '16분 싱코페. 하우스의 정박도 레게의 오프비트도 아닌 스텝 0·3·6·10·13 이다',
    phrases: 'garage',
  },
  bigroom: {
    anchor: 'Big Room', members: ['Big Room', 'Complextro', 'Bass House', 'Electro House'],
    mel: { density: [6, 13], leap: [0.85, 1.00], contour: 'rise', range: [6, 7], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'low', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'lead', keys2: 'growl', gtr: 'none', gtr2: 'none' },
    chordType: 'sev', comping: 'disco_stab',
    pool: ['edm_aaab', 'chip_aaab', 'edmchp_aaab'],
    ev: '2010년대 초 네덜란드·미국 · 10곡', conf: 'high',
    why: '리드가 앞에 나오고 드롭으로 쌓는다. 밀도가 23종 중 가장 높다',
  },
  prog: {
    anchor: 'Progressive House', members: ['Progressive House'],
    mel: { density: [6, 13], leap: [0.85, 1.00], contour: 'rise', range: [6, 7], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'supersaw', keys2: 'pad', gtr: 'arp', gtr2: 'none' },
    chordType: 'sev', comping: 'disco_stab',
    pool: ['edm_aaab', 'chip_aaab', 'edmchp_aaab'],
    ev: '2010년대 유럽 · 9곡', conf: 'medium',
    why: '선율은 빅룸과 같다. 갈리는 것은 기타가 긴 아르페지오를 맡는다는 점뿐이다',
  },
  acid: {
    anchor: 'Acid House', members: ['Acid House'],
    mel: { density: [1, 3], leap: [0.25, 0.50], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'arpeggio', oct: false, gate: 'short', kick: 'offset', glide: 'defining' },
    lead: 'bass', roles: { keys: 'stab', keys2: 'poly', gtr: 'none', gtr2: 'none' },
    chordType: 'sev', comping: 'disco_stab',
    pool: ['amb_aaab', 'amb_aaba'],
    ev: '1980년대 후반 미국 시카고 · 9곡', conf: 'high',
    why: '303 베이스가 선율을 맡는다. 23종 중 유일하게 lead 가 keys 가 아니다',
  },
  tribal: {
    anchor: 'Tribal House', members: ['Tribal House', 'Amapiano', 'Afro House'],
    mel: { density: [3, 5], leap: [0.25, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 1, 4, 3], rhythm: 'offbeat16', repetition: 'mid', voicing: 'single' },
    bass: { role: 'arpeggio', oct: false, gate: 'mid', kick: 'offset', glide: 'none' },
    lead: 'keys', roles: { keys: 'marimba-pluck', keys2: 'strings', gtr: 'highlife', gtr2: 'none' },
    chordType: 'sev', comping: 'disco_stab',
    pool: ['afr_aabb', 'afr_aaab', 'lat_abab'],
    ev: '2010년대 남아프리카·서아프리카 · 11곡', conf: 'high',
    why: '타악이 선율을 대신한다. 아마피아노는 113 BPM 스윙 28 로 형제 22종과 템포부터 다르다',
  },
};
