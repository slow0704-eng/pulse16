/* 배치 A6 — Downtempo · Ambient · Retro 11종. _gen.mjs 가 이 표를 펼친다.

   ⚠ 이 표의 수치는 **직관이 아니라 재료 실측에서 나왔다.**
     처음에는 「이 장르는 밀도 5~8쯤」 식으로 적었는데,
     tools/ci/check-melody-profile.mjs 의 P11 이 «배정한 재료가 그 범위 밖» 이라고
     전부 잡았다. 실제 재료의 값은 이렇다(16마디 기준):

       amb  1.00 / 도약 0.38~0.42 / 음역 4     ← 가장 성김
       bal  2.13~2.19 / 0.29~0.35 / 4
       bos  2.00 / 0.43~0.45 / 4
       trp  2.38 / 0.75 / 4      hip 2.38 / 0.63 / 4
       cin  3.63~3.69 / 0.21~0.25 / 6
       jazz 6.25 / 0.29~0.30 / 5
       chip 6.50~6.75 / 0.92~0.94 / 7
       dis  6.50~6.75 / 0.88 / 7
       edm  12.50~12.75 / 0.99 / 7            ← 가장 빽빽

     3화음(voicing:'chord')을 쓰는 재료는 gos_* 뿐이다. 그래서 이 배치는
     전부 'single' 이다 — 쓰고 싶어도 줄 재료가 없다.                    */

export const batch = 'A6';
export const sub = 'Downtempo · Ambient · Retro';
export const cat = 'E';
export const date = '2026-09-15';
export const verdict =
  '11종 → 6무리. 한 분기인데 73~124 BPM, 스윙 0~50, 베이스 엔진이 여섯이다. '
  + 'Synthwave 만 계열이 B(팝)다. 베이퍼웨이브는 따로 두려다 합쳤다 — '
  + '느리고 뭉갠 것은 템포와 음색이지 선율이 아니었다.';

export const CAT = { 'Synthwave': 'B' };

export const groups = {
  slowpad: {
    anchor: 'Downtempo',
    members: ['Downtempo', 'Chillout', 'Ambient Techno', 'Vaporwave', 'Mallsoft'],
    mel: { density: [1, 3], leap: [0.25, 0.45], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'long', kick: 'offset', glide: 'none' },
    lead: 'keys2', roles: { keys: 'pad', keys2: 'texture', gtr: 'none', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['amb_aaba', 'amb_aabb', 'bal_aaba'],
    ev: '1990년대 이후 영국·유럽 · 12곡', conf: 'high',
    why: '건반이 패드다. 음이 마디에 한두 개뿐이고 음색이 앞에 나온다 — 재료 중 가장 성긴 축',
  },
  balearic: {
    anchor: 'Balearic', members: ['Balearic'],
    mel: { density: [2, 4], leap: [0.20, 0.50], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'offbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'offset', glide: 'none' },
    lead: 'keys', roles: { keys: 'pad', keys2: 'nylon', gtr: 'nylon', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['bos_aaba', 'bos_aabb', 'cin_aabb'],
    ev: '1980년대 후반 스페인 이비사 · 8곡', conf: 'medium',
    why: '나일론 기타가 둘이다(gtr·keys2). 형제 중 유일하게 선율이 패드 뒤가 아니라 앞에 있고 음역이 한 도수 넓다',
  },
  triphop: {
    anchor: 'Trip Hop', members: ['Trip Hop'],
    mel: { density: [2, 3], leap: [0.30, 0.80], contour: 'static', range: [3, 5], degrees: [0, 2, 4, 1], rhythm: 'offbeat16', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'offset', glide: 'none' },
    lead: 'keys', roles: { keys: 'ep', keys2: 'glass', gtr: 'comp', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['trp_aaba', 'hip_aaba', 'bal_aabb'],
    ev: '1990년대 영국 브리스틀 · 10곡', conf: 'high',
    why: '90 BPM 에 스윙 30. 라운지가 아니라 힙합 쪽 박자다 — 두세 음을 되풀이하므로 도약 비율이 형제보다 두 배 높다',
  },
  jazzy: {
    anchor: 'Nu Jazz', members: ['Nu Jazz', 'Lounge'],
    mel: { density: [5, 7], leap: [0.20, 0.40], contour: 'zigzag', range: [4, 6], degrees: [0, 2, 4, 5, 6], rhythm: 'triplet-feel', repetition: 'low', voicing: 'single' },
    bass: { role: 'walking', oct: false, gate: 'mid', kick: 'free', glide: 'none' },
    lead: 'keys', roles: { keys: 'ep-vibes', keys2: 'horn', gtr: 'comp', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['jazz_aaba', 'jazz_abab', 'jazz_aabb'],
    ev: '1990년대 이후 유럽·일본 · 9곡', conf: 'high',
    why: '업라이트 베이스에 스윙 28~50. 밀도가 패드 무리의 세 배이고 방향을 계속 바꾼다',
  },
  synthwave: {
    anchor: 'Synthwave', members: ['Synthwave'],
    mel: { density: [6, 8], leap: [0.85, 1.00], contour: 'rise', range: [6, 7], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'octave', oct: true, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'pluck-arp', keys2: 'pad', gtr: 'none', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['chip_aabb', 'chip_abab', 'chip_aaab'],
    ev: '2000년대 후반 이후 · 9곡', conf: 'high',
    why: '이 분기에서 유일한 계열 B(팝)다. 아르페지오라 거의 모든 이동이 도약이다 — 앰비언트와 정반대 끝',
  },
  futurefunk: {
    anchor: 'Future Funk', members: ['Future Funk'],
    mel: { density: [6, 8], leap: [0.80, 0.95], contour: 'zigzag', range: [6, 7], degrees: [0, 2, 4, 5], rhythm: 'offbeat16', repetition: 'mid', voicing: 'single' },
    bass: { role: 'octave', oct: true, gate: 'short', kick: 'offset', glide: 'none' },
    lead: 'keys', roles: { keys: 'lead', keys2: 'ep', gtr: 'cut', gtr2: 'none' },
    chordType: 'nine', comping: 'disco_stab',
    pool: ['dis_abab', 'dis_aabb', 'dis_aaab'],
    ev: '2010년대 인터넷·일본 · 8곡', conf: 'medium',
    why: '디스코를 잘라 붙인다. 신스웨이브와 밀도·음역은 같고 윤곽이 다르다 — 올라가는 대신 오간다',
  },
};
