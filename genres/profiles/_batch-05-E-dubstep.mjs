/* 배치 A5 — Dubstep · Bass Music 16종. _gen.mjs 가 이 표를 펼친다. */

export const batch = 'A5';
export const sub = 'Dubstep · Bass Music';
export const cat = 'E';
export const date = '2026-09-14';
export const verdict =
  '16종 → 6무리. 편성이 먼저 갈려 있었다(pad+sub · growl+reese · supersaw · s808 · bell 클럽 · 110BPM 뭄바톤). '
  + '새 프레이즈는 만들지 않았다 — 있는 재료로 충분했다.';

export const groups = {
  ambientish: {
    anchor: 'Dubstep',
    members: ['Dubstep', 'Deep Dubstep', 'Meditative Dubstep', 'Future Garage', 'Wave'],
    mel: { density: [2, 4], leap: [0.15, 0.35], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'high' },
    bass: { role: 'root', oct: false, gate: 'long', kick: 'offset', glide: 'none' },
    lead: 'keys2', roles: { keys: 'pad', keys2: 'texture', gtr: 'none', gtr2: 'none' },
    chordType: 'triad', comping: 'trap_pad',
    pool: ['amb_aaba', 'amb_aabb', 'bal_aaba'],
    ev: '2000년대 후반 영국 런던 · 12곡', conf: 'high',
    why: '하프타임이라 밀도가 절반이다. 패드가 길게 깔리고 건반은 자리를 비워 준다',
  },
  aggressive: {
    anchor: 'Brostep',
    members: ['Brostep', 'Riddim', 'Hardwave'],
    mel: { density: [2, 4], leap: [0.20, 0.45], contour: 'static', range: [2, 4], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'high' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'occasional' },
    lead: 'bass', roles: { keys: 'stab', keys2: 'growl', gtr: 'none', gtr2: 'none' },
    chordType: 'triad', comping: 'trap_pad',
    pool: ['edm_aaab', 'trp_aaab'],
    ev: '2010년대 초 미국·영국 · 10곡', conf: 'high',
    why: '베이스가 주역이라 건반이 비켜 준다. 분위기형과 밀도는 같지만 음역이 더 좁다',
  },
  melodic: {
    anchor: 'Future Bass',
    members: ['Future Bass', 'Melodic Dubstep'],
    mel: { density: [5, 8], leap: [0.30, 0.50], contour: 'rise', range: [5, 7], degrees: [0, 2, 4, 5, 7], rhythm: 'onbeat', repetition: 'mid', voicing: 'chord' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'supersaw', keys2: 'bell', gtr: 'none', gtr2: 'none' },
    chordType: 'triad', comping: 'trap_pad',
    pool: ['cin_aabb', 'edm_aabb', 'bal_aaba'],
    ev: '2010년대 중반 미국·일본 · 11곡', conf: 'high',
    why: '슈퍼소우로 화음을 넓게 편다. 16종 중 유일하게 상행 윤곽이고 밀도가 가장 높다',
  },
  trapish: {
    anchor: 'EDM Trap',
    members: ['EDM Trap', 'Festival Trap'],
    mel: { density: [3, 5], leap: [0.15, 0.35], contour: 'static', range: [3, 5], degrees: [0, 2, 4, 1], rhythm: 'offbeat16', repetition: 'high' },
    bass: { role: 'root', oct: false, gate: 'long', kick: 'locked', glide: 'occasional' },
    lead: 'keys', roles: { keys: 'bell', keys2: 'brass', gtr: 'none', gtr2: 'none' },
    chordType: 'triad', comping: 'trap_pad',
    pool: ['trp_aaab', 'trp_aaba', 'hip_aaab'],
    ev: '2010년대 중반 미국 · 9곡', conf: 'high',
    why: '808 이 들어오면 선율도 트랩 어법이 된다. 벨 음색에 3연음 느낌의 16분 뭉치',
  },
  club: {
    anchor: 'Jersey Club',
    members: ['Jersey Club', 'Baltimore Club', 'Philly Club'],
    mel: { density: [4, 6], leap: [0.25, 0.45], contour: 'zigzag', range: [4, 5], degrees: [0, 2, 1, 4], rhythm: 'offbeat16', repetition: 'mid' },
    bass: { role: 'root', oct: true, gate: 'short', kick: 'free', glide: 'none' },
    lead: 'keys', roles: { keys: 'chop', keys2: 'organ', gtr: 'cut', gtr2: 'none' },
    chordType: 'triad', comping: 'disco_stab',
    pool: ['gar_abab', 'funk_abab', 'trp_aaba'],
    ev: '2000년대 이후 미국 동부 · 10곡', conf: 'medium',
    why: '쪼갠 스탭이 몸이라 UK 개러지와 어법이 같다. 134~135 BPM 으로 형제 중 가장 느리지 않다',
  },
  moombahton: {
    anchor: 'Moombahton',
    members: ['Moombahton'],
    mel: { density: [4, 6], leap: [0.20, 0.40], contour: 'static', range: [3, 5], degrees: [0, 2, 4, 1], rhythm: 'offbeat', repetition: 'high' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'lead', keys2: 'strings', gtr: 'montuno', gtr2: 'none' },
    chordType: 'triad', comping: 'trap_pad',
    pool: ['lat_abab', 'car_aabb', 'trp_aaba'],
    ev: '2010년대 초 미국·중남미 · 8곡', conf: 'high',
    why: '110 BPM 에 뎀보우. 형제 15종과 템포부터 30 이상 벌어진다 — 하우스가 아니라 라틴이다',
  },
};
