/* 배치 A7 — Rock 계열 49종. _gen.mjs 가 이 표를 펼친다.

   근거는 genres/01-rock.md 의 장르별 분석표(BPM · 리듬 골격 · 음색·편성 ·
   핵심 포인트)와, 프리셋이 실제로 들고 있는 kit 이다. 둘이 같은 말을 하는
   자리에서만 갈랐다.

   ⚠ Metal 13종 · Punk 7종은 **선율 없음**이다(MELODY_KIT 의 빈 배열).
     「메탈은 건반을 안 씁니다」 — melody.js:566. 여기서도 건드리지 않는다.
     남은 29종이 대상이고 6풀 → 16풀로 갈렸다.

   수치는 재료 실측에서 나왔다(tools/ci/check-melody-profile.mjs P11 이 대조):
     amb 1.00/0.38~0.42/4 · bal 2.13~2.19/0.29~0.35/4 · ant 2.13~2.19/0.48~0.50/5
     rock 3.50/0.25~0.26/5 · blues 3.50/0.27~0.31/5 · rkant 3.50/0.67/5
     pop 3.63~3.69/0.16~0.19/5 · cin 3.63~3.69/0.21~0.25/6 · cinbal 3.63~3.69/0.33/4
     root 4.25/0.27~0.31/5 · rootbl 4.25/0.30~0.31/5 · funk 5.00/0.17~0.18/5
     jazbal 6.25/0.32~0.33/4 · dis 6.50~6.75/0.88/7 · disfun 6.75/0.45/7           */

export const batch = 'A7';
export const sub = 'Rock (계열 A)';
export const cat = 'A';
export const date = '2026-09-15';
export const verdict =
  '49종 중 Metal 13 · Punk 7 은 선율 없음(의도). 남은 29종을 6풀 → 16풀로 갈랐다. '
  + '드럼과 편성은 이미 개별화돼 있었다(드럼 47/49 · 편성 49/49) — 선율만 하위분기에 묶여 있었다.';

/* 하위분기가 여덟이라 _gen.mjs 의 sub 한 칸으로는 부족하다.
   프로파일의 sub 는 PRESET_SUB 와 맞아야 하므로 프리셋별로 준다. */
export const SUB = {
  'Motorik':'Psychedelic · Krautrock', 'Krautrock':'Psychedelic · Krautrock',
  'Psychedelic Rock':'Psychedelic · Krautrock', 'Acid Rock':'Psychedelic · Krautrock',
  'Space Rock':'Psychedelic · Krautrock',
  'Rock':'Hard Rock', 'Southern Rock':'Hard Rock', 'Glam Rock':'Hard Rock',
  'Rock & Roll':'뿌리', 'Surf Rock':'뿌리', 'Garage Rock':'뿌리', 'Proto-punk':'뿌리',
  'Post-punk':'Post-punk 계보', 'Gothic Rock':'Post-punk 계보',
  'Post-punk Revival':'Post-punk 계보', 'Dance-punk':'Post-punk 계보',
  'New Wave':'Post-punk 계보', 'Emo':'Post-punk 계보', 'Screamo':'Post-punk 계보',
  'Grunge':'Alternative', 'Indie Rock':'Alternative', 'Noise Rock':'Alternative',
  'Alternative Rock':'Alternative', 'Shoegaze':'Alternative', 'Dream Pop':'Alternative',
  'Britpop':'Alternative', 'Lo-fi Indie':'Alternative', 'Slacker Rock':'Alternative',
  'Country Rock':'루츠와의 교차',
};

export const groups = {
  motorik: {
    anchor: 'Motorik', members: ['Motorik', 'Krautrock'],
    mel: { density: [1, 3], leap: [0.35, 0.60], contour: 'static', range: [4, 6], degrees: [0, 2, 4], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'organ-hold', keys2: 'mellotron', gtr: 'phase', gtr2: 'none' },
    chordType: 'triad', comping: 'rock_8th',
    pool: ['ant_abab', 'ant_aabb', 'amb_aaba'],
    ev: '1970년대 초 서독 · 9곡', conf: 'high',
    why: '같은 것을 오래 민다. 정박에 고정돼 있고 변화가 거의 없다 — 문서가 «모토릭» 이라 부른 그 성질이다',
  },
  psych: {
    anchor: 'Psychedelic Rock', members: ['Psychedelic Rock', 'Acid Rock'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'zigzag', range: [4, 6], degrees: [0, 2, 4, 1, 3], rhythm: 'offbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'offset', glide: 'none' },
    lead: 'keys', roles: { keys: 'organ', keys2: 'mellotron', gtr: 'fuzz-phase', gtr2: 'none' },
    chordType: 'triad', comping: 'rock_8th',
    pool: ['rock_abab', 'blues_aabb', 'rock_aabb'],
    ev: '1960년대 후반 미국·영국 · 11곡', conf: 'high',
    why: '모달 즉흥이 몸이라 모토릭과 달리 계속 움직인다. 블루스 어휘가 섞인다',
  },
  space: {
    anchor: 'Space Rock', members: ['Space Rock'],
    mel: { density: [1, 3], leap: [0.25, 0.50], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'long', kick: 'free', glide: 'none' },
    lead: 'keys2', roles: { keys: 'pad', keys2: 'texture', gtr: 'phase', gtr2: 'none' },
    chordType: 'triad', comping: 'ballad_pad',
    pool: ['amb_aaba', 'amb_aabb', 'bal_aaba'],
    ev: '1970년대 영국 · 8곡', conf: 'medium',
    why: '건반이 패드다. 105 BPM 으로 이 분기에서 가장 느리고 음이 가장 적다',
  },
  southern: {
    anchor: 'Southern Rock', members: ['Southern Rock'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'offbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'walking', oct: false, gate: 'mid', kick: 'offset', glide: 'none' },
    lead: 'gtr', roles: { keys: 'organ', keys2: 'strings', gtr: 'slide', gtr2: 'twin' },
    chordType: 'power', comping: 'rock_8th',
    pool: ['blues_aaba', 'blues_aabb', 'rootbl_aabb'],
    ev: '1970년대 미국 남부 · 9곡', conf: 'high',
    why: '슬라이드 기타에 스윙 30. 형제 둘(Rock·Glam)이 스윙 0 인데 여기만 흔들리고 블루스 어휘를 쓴다',
  },
  hardrock: {
    anchor: 'Rock', members: ['Rock', 'Glam Rock'],
    mel: { density: [3, 5], leap: [0.45, 0.80], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'gtr', roles: { keys: 'organ', keys2: 'strings', gtr: 'hi', gtr2: 'hi' },
    chordType: 'power', comping: 'rock_8th',
    pool: ['rkant_aabb', 'rkant_abab'],
    ev: '1970년대 영국·미국 · 12곡', conf: 'high',
    why: '앤섬 스톰프. 훅이 크게 벌어져 도약 비율이 형제 중 가장 높다',
  },
  rocknroll: {
    anchor: 'Rock & Roll', members: ['Rock & Roll'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'triplet-feel', repetition: 'high', voicing: 'single' },
    bass: { role: 'walking', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'piano', keys2: 'sax', gtr: 'crunch', gtr2: 'none' },
    chordType: 'sev', comping: 'rock_8th',
    pool: ['blues_aaba', 'rootbl_aaba', 'root_aaba'],
    ev: '1950년대 후반 미국 · 10곡', conf: 'high',
    why: '스윙 34 에 업라이트 베이스, 7화음. 록 계열에서 유일하게 부기 어법이다',
  },
  surf: {
    anchor: 'Surf Rock', members: ['Surf Rock'],
    mel: { density: [3, 5], leap: [0.10, 0.40], contour: 'arch', range: [5, 7], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'gtr', roles: { keys: 'organ', keys2: 'none', gtr: 'clean-reverb', gtr2: 'none' },
    chordType: 'triad', comping: 'rock_8th',
    pool: ['cin_aabb', 'cin_aaba', 'rock_aabb'],
    ev: '1960년대 초 미국 서부 · 9곡', conf: 'high',
    why: '록 계열에서 거의 유일하게 **기타가 선율을 맡는** 장르다. 그래서 음역이 형제보다 한 도수 넓다',
  },
  garage: {
    anchor: 'Garage Rock', members: ['Garage Rock', 'Proto-punk'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'static', range: [4, 6], degrees: [0, 2, 4], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'gtr', roles: { keys: 'organ', keys2: 'none', gtr: 'fuzz', gtr2: 'none' },
    chordType: 'triad', comping: 'rock_8th',
    pool: ['rock_aaba', 'rock_aabb', 'blues_abab'],
    ev: '1960년대 중반 미국 · 10곡', conf: 'high',
    why: '거칠고 단순하다. 서프와 달리 선율이 기타 뒤로 물러나 세 음을 되풀이한다',
  },
  postpunk: {
    anchor: 'Post-punk', members: ['Post-punk', 'Gothic Rock', 'Post-punk Revival'],
    mel: { density: [1, 3], leap: [0.35, 0.60], contour: 'static', range: [4, 6], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'walking', oct: true, gate: 'short', kick: 'offset', glide: 'none' },
    lead: 'bass', roles: { keys: 'poly', keys2: 'pad', gtr: 'chorus', gtr2: 'none' },
    chordType: 'add9', comping: 'rock_8th',
    pool: ['ant_abab', 'ant_aaba', 'amb_aabb'],
    ev: '1970년대 후반 영국 · 11곡', conf: 'high',
    why: '**베이스가 선율을 맡는다** — 문서가 높은 베이스를 장르의 정의라고 못박은 자리다(Oct 36 유지). 건반은 비켜 준다',
  },
  dancepunk: {
    anchor: 'Dance-punk', members: ['Dance-punk', 'New Wave'],
    mel: { density: [4, 6], leap: [0.05, 0.35], contour: 'zigzag', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'offbeat16', repetition: 'mid', voicing: 'single' },
    bass: { role: 'octave', oct: true, gate: 'short', kick: 'offset', glide: 'none' },
    lead: 'keys', roles: { keys: 'lead', keys2: 'poly', gtr: 'wah', gtr2: 'none' },
    chordType: 'add9', comping: 'disco_stab',
    pool: ['funk_abab', 'funk_aabb', 'funk_aaab'],
    ev: '2000년대 초 미국·영국 · 9곡', conf: 'high',
    why: '댄스 그루브에 와우 기타. 신스 리드가 앞에 나와 형제 중 밀도가 가장 높다',
  },
  emo: {
    anchor: 'Emo', members: ['Emo', 'Screamo'],
    mel: { density: [1, 3], leap: [0.20, 0.45], contour: 'arch', range: [3, 5], degrees: [0, 2, 4, 1], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'locked', glide: 'none' },
    lead: 'gtr', roles: { keys: 'pad', keys2: 'poly', gtr: 'arp-crunch', gtr2: 'none' },
    chordType: 'add9', comping: 'ballad_pad',
    pool: ['bal_aaba', 'bal_aabb', 'bal_abab'],
    ev: '1990년대 이후 미국 · 9곡', conf: 'medium',
    why: '기타 아르페지오가 선율을 대신한다. 건반은 패드라 음이 적고, 형제 포스트펑크와 달리 베이스도 앞에 안 나온다',
  },
  shoegaze: {
    anchor: 'Shoegaze', members: ['Shoegaze', 'Dream Pop'],
    mel: { density: [1, 3], leap: [0.25, 0.50], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'long', kick: 'free', glide: 'none' },
    lead: 'gtr', roles: { keys: 'pad', keys2: 'texture', gtr: 'wall', gtr2: 'none' },
    chordType: 'add9', comping: 'ballad_pad',
    pool: ['amb_aaba', 'amb_aabb', 'bal_aaba'],
    ev: '1990년대 초 영국 · 10곡', conf: 'high',
    why: '문서 그대로 **기타가 패드처럼 기능한다**. 텍스처가 먼저라 선율이 가장 성기다 — 스페이스 록과 같은 처리',
  },
  britpop: {
    anchor: 'Britpop', members: ['Britpop'],
    mel: { density: [3, 5], leap: [0.05, 0.35], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'organ', keys2: 'strings', gtr: 'twelve', gtr2: 'none' },
    chordType: 'add9', comping: 'pop_pulse',
    pool: ['pop_aabb', 'pop_aaba', 'pop_abab'],
    ev: '1990년대 중반 영국 · 11곡', conf: 'high',
    why: '문서가 «60년대 팝 구조의 재현» 이라 적은 그대로다. 합창 훅이라 순차 진행이 형제 중 가장 많다',
  },
  lofi: {
    anchor: 'Lo-fi Indie', members: ['Lo-fi Indie', 'Slacker Rock'],
    mel: { density: [5, 7], leap: [0.20, 0.45], contour: 'zigzag', range: [3, 5], degrees: [0, 2, 4, 1], rhythm: 'offbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'offset', glide: 'none' },
    lead: 'keys', roles: { keys: 'ep', keys2: 'none', gtr: 'clean-chorus', gtr2: 'none' },
    chordType: 'add9', comping: 'ballad_pad',
    pool: ['jazbal_aaba', 'jazbal_abab'],
    ev: '1990년대 이후 미국 · 8곡', conf: 'medium',
    why: '건반이 EP 다 — 록 계열에서 이 둘뿐이다. 늘어지는 그루브라 재즈 물든 어휘가 맞는다',
  },
  alt: {
    anchor: 'Alternative Rock', members: ['Alternative Rock', 'Grunge', 'Indie Rock', 'Noise Rock'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'gtr', roles: { keys: 'organ-pad', keys2: 'strings', gtr: 'crunch-fuzz', gtr2: 'none' },
    chordType: 'add9', comping: 'rock_8th',
    pool: ['rock_aabb', 'rock_aaba', 'rock_abab'],
    ev: '1990년대 미국 · 12곡', conf: 'high',
    why: '문서가 «우산 개념에 가깝다» 고 적은 무리다. 표준 록 비트에 표준 록 선율 — 여기서 벗어나는 형제만 따로 뺐다',
  },
  countryrock: {
    anchor: 'Country Rock', members: ['Country Rock'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'gtr', roles: { keys: 'organ', keys2: 'strings', gtr: 'pedal-steel', gtr2: 'none' },
    chordType: 'triad', comping: 'rock_8th',
    pool: ['rootbl_aabb', 'rootbl_aaba', 'root_aabb'],
    ev: '1970년대 미국 · 8곡', conf: 'high',
    why: '페달 스틸과 플랫와운드 베이스. 록 계열에서 유일하게 컨트리 쪽 어휘를 쓴다',
  },
};
