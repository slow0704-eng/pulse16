/* 배치 A7 — Rock 계열. _gen.mjs 가 이 표를 펼친다.

   2026-09-15 첫 판은 genres/01-rock.md 의 장르별 분석표와 프리셋 kit 만 보고 갈랐다.
   2026-09-16 에 **대표곡으로 다시 검증했다.** 장르마다 웹에서 실재·장르 분류를 확인한
   곡 3~5곡(genres/01-rock.md «대표곡» 표)을 모으고, 곡에서 확인되는 성질
   — 템포 범위 · 건반 유무 · 기타 음색 · 베이스 역할 · 드럼 골격 — 과 대조했다.
   ev 의 «N곡» 은 그 표에 실제로 적힌 곡 수다(무리 안 형제의 곡을 합친 수).

   어긋나서 고친 것 (자세한 근거는 01-rock.md 와 커밋 메시지)
     · 무리를 쪼갰다 — Psychedelic/Acid(편성이 다름), Post-punk Revival(베이스가 근음 8분),
       New Wave(장조·근음 베이스), Lo-fi/Slacker(«EP 라 재즈 어휘» 는 근거가 없었다)
     · 무리를 새로 만들었다 — Black · Power · Symphonic Metal. 대표곡에 건반이 있다
     · Space Rock 베이스 — 긴 음(gate long)이 아니라 반복 리프
     · Southern Rock — 4곡 모두 셔플이 아니었다(swing 30 → 8)

   수치는 재료 실측에서 나왔다(tools/ci/check-melody-profile.mjs P11 이 대조):
     amb 1.00/0.38~0.42/4 · bal 2.13~2.19/0.29~0.35/4 · ant 2.13~2.19/0.48~0.50/5
     rock 3.50/0.25~0.26/5 · blues 3.50/0.27~0.31/5 · rkant 3.50/0.67/5
     pop 3.63~3.69/0.16~0.19/5 · cin 3.63~3.69/0.21~0.25/6 · cinbal 3.63~3.69/0.33/4
     root 4.25/0.27~0.31/5 · rootbl 4.25/0.30~0.31/5 · wor 4.25/0.32~0.34/5
     funk 5.00/0.17~0.18/5                                                         */

export const batch = 'A7';
export const sub = 'Rock (계열 A)';
export const cat = 'A';
export const date = '2026-09-16';
export const verdict =
  '49종 중 Metal 10 · Punk 7 은 선율 없음(대표곡 크레딧에 건반 없음). 남은 32종을 대표곡으로 다시 갈랐다. '
  + 'Black · Power · Symphonic Metal 은 대표곡에 건반이 있어 새로 들어왔고, 네 무리를 근거에 맞춰 쪼갰다.';

/* 하위분기가 여럿이라 _gen.mjs 의 sub 한 칸으로는 부족하다.
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
  'Black Metal':'Metal', 'Power Metal':'Metal', 'Symphonic Metal':'Metal',
};

/* 프리셋 파일(src/data/presets/01-rock.js)의 실제 스케일 */
export const SCALE = {
  'Motorik':'Minor Pentatonic', 'Krautrock':'Minor Pentatonic', 'Psychedelic Rock':'Dorian',
  'Acid Rock':'Minor Pentatonic', 'Space Rock':'Minor Pentatonic',
  'Rock':'Minor Pentatonic', 'Southern Rock':'Minor Pentatonic', 'Glam Rock':'Minor Pentatonic',
  'Rock & Roll':'Minor Pentatonic', 'Surf Rock':'Minor Pentatonic',
  'Garage Rock':'Minor Pentatonic', 'Proto-punk':'Minor Pentatonic',
  'Post-punk':'Natural Minor', 'Gothic Rock':'Natural Minor', 'Post-punk Revival':'Natural Minor',
  'Dance-punk':'Natural Minor', 'New Wave':'Major', 'Emo':'Natural Minor', 'Screamo':'Natural Minor',
  'Grunge':'Natural Minor', 'Indie Rock':'Major', 'Noise Rock':'Natural Minor',
  'Alternative Rock':'Natural Minor', 'Shoegaze':'Natural Minor', 'Dream Pop':'Major',
  'Britpop':'Major', 'Lo-fi Indie':'Major', 'Slacker Rock':'Major',
  'Country Rock':'Major',
  'Black Metal':'Minor Pentatonic', 'Power Metal':'Major', 'Symphonic Metal':'Natural Minor',
};

export const groups = {
  motorik: {
    anchor: 'Motorik', members: ['Motorik', 'Krautrock'],
    mel: { density: [1, 3], leap: [0.35, 0.60], contour: 'static', range: [4, 6], degrees: [0, 2, 4], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'locked', glide: 'none' },
    lead: 'gtr', roles: { keys: 'organ', keys2: 'mellotron/ep', gtr: 'wah-tick/crunch', gtr2: 'none' },
    chordType: 'triad', comping: 'rock_8th',
    pool: ['ant_abab', 'ant_aabb', 'amb_aaba'],
    ev: '1970년대 서독 · 7곡', conf: 'medium',
    why: '한 코드 드론 위에서 같은 것을 오래 민다. 모토릭은 필인 없이 스네어 자리만 뺀 8분 킥이 곧 장르이고, 크라우트록은 Can 의 느린 펑크형(110)이라 템포·드럼이 갈리지만 선율은 둘 다 정체형이다',
  },
  psych: {
    anchor: 'Psychedelic Rock', members: ['Psychedelic Rock'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'static', range: [4, 6], degrees: [0, 2, 4, 1, 3], rhythm: 'offbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'organ', keys2: 'mellotron', gtr: 'phase', gtr2: 'sitar' },
    chordType: 'triad', comping: 'rock_8th',
    pool: ['rock_abab', 'wor_aaba', 'rock_aabb'],
    ev: '1960년대 후반 영국·미국 · 5곡', conf: 'high',
    why: '보컬은 좁은 음역에서 오래 반복하고, 곡마다 이국적 음색 하나(시타르·오르간·저그)가 간판이다. 그래서 월드 장식음 재료를 섞고 스케일을 도리안으로 옮겼다',
  },
  acid: {
    anchor: 'Acid Rock', members: ['Acid Rock'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'zigzag', range: [4, 6], degrees: [0, 2, 4, 1, 3], rhythm: 'offbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'gtr', roles: { keys: 'organ-low', keys2: 'none', gtr: 'fuzz', gtr2: 'phase' },
    chordType: 'triad', comping: 'rock_8th',
    pool: ['rock_abab', 'blues_aabb', 'rock_aabb'],
    ev: '1960년대 후반 미국·영국 · 4곡', conf: 'medium',
    why: '퍼즈 기타 리프가 주인공이고 블루스 음계다. 건반은 4곡 중 In-A-Gadda-Da-Vida 1곡뿐이라 오르간을 낮췄고, 베이스는 리프와 유니즌이다',
  },
  space: {
    anchor: 'Space Rock', members: ['Space Rock'],
    mel: { density: [1, 3], leap: [0.25, 0.50], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys2', roles: { keys: 'farfisa', keys2: 'synth-fx', gtr: 'phase-echo', gtr2: 'fuzz' },
    chordType: 'triad', comping: 'ballad_pad',
    pool: ['amb_aaba', 'amb_aabb', 'bal_aaba'],
    ev: '1960~70년대 영국 · 4곡', conf: 'medium',
    why: '보컬 선율은 약하고 딜레이 기타·오르간·신스 효과음이 주인공이다. 베이스는 긴 음이 아니라 반복 리프(Silver Machine·Set the Controls)라 8분으로 바꿨고, 템포도 출처 곡들(98~132)에 맞춰 올렸다',
  },
  southern: {
    anchor: 'Southern Rock', members: ['Southern Rock'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'offbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'walking', oct: false, gate: 'mid', kick: 'offset', glide: 'none' },
    lead: 'gtr', roles: { keys: 'piano', keys2: 'organ', gtr: 'slide', gtr2: 'twin' },
    chordType: 'power', comping: 'rock_8th',
    pool: ['blues_aaba', 'blues_aabb', 'rootbl_aabb'],
    ev: '1970년대 미국 남부 · 4곡', conf: 'medium',
    why: '트윈·슬라이드 기타와 피아노(3/4곡). 4곡 모두 셔플이 아니라 뒤로 기대는 스트레이트라 스윙을 30 에서 8 로 내렸다 — 형제와 가르는 것은 스윙이 아니라 편성과 블루스 어휘다',
  },
  hardrock: {
    anchor: 'Rock', members: ['Rock', 'Glam Rock'],
    mel: { density: [3, 5], leap: [0.45, 0.80], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'gtr', roles: { keys: 'organ-low/piano', keys2: 'piano/sax', gtr: 'crunch', gtr2: 'crunch' },
    chordType: 'power', comping: 'rock_8th',
    pool: ['rkant_aabb', 'rkant_abab'],
    ev: '1970~80년대 영국·미국 · 10곡', conf: 'high',
    why: '기타 리프가 주인공이고 훅이 크게 벌어진다. 10곡 중 오르간은 Smoke on the Water 1곡, 기타는 하이게인이 아니라 크런치라 편성을 그쪽으로 옮겼다. 글램은 색소폰·탬버린과 4분 스톰프가 몸이다',
  },
  rocknroll: {
    anchor: 'Rock & Roll', members: ['Rock & Roll'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'triplet-feel', repetition: 'high', voicing: 'single' },
    bass: { role: 'walking', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'piano', keys2: 'sax', gtr: 'crunch', gtr2: 'none' },
    chordType: 'sev', comping: 'rock_8th',
    pool: ['blues_aaba', 'rootbl_aaba', 'root_aaba'],
    ev: '1950~60년대 미국 · 5곡', conf: 'high',
    why: '피아노가 5곡 모두에 있고 색소폰이 3곡이다. 스윙은 곡마다 갈려(드럼은 스윙, 기타는 스트레이트) 34 에서 24 로 낮췄다',
  },
  surf: {
    anchor: 'Surf Rock', members: ['Surf Rock'],
    mel: { density: [3, 5], leap: [0.10, 0.40], contour: 'arch', range: [5, 7], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'gtr', roles: { keys: 'ep', keys2: 'organ', gtr: 'clean-reverb-tremolo', gtr2: 'twelve' },
    chordType: 'triad', comping: 'rock_8th',
    pool: ['cin_aabb', 'cin_aaba', 'rock_aabb'],
    ev: '1960년대 초 미국 서부 · 5곡', conf: 'high',
    why: '록 계열에서 거의 유일하게 **기타가 선율을 맡는다**. Pipeline 의 일렉트릭 피아노와 장르 문서의 «배경 오르간» 이 있어 건반을 켰다(배경으로만)',
  },
  garage: {
    anchor: 'Garage Rock', members: ['Garage Rock', 'Proto-punk'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'static', range: [4, 6], degrees: [0, 2, 4], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'gtr', roles: { keys: 'combo-organ/piano', keys2: 'harmonica/organ', gtr: 'fuzz/crunch', gtr2: 'none' },
    chordType: 'triad', comping: 'rock_8th',
    pool: ['rock_aaba', 'rock_aabb', 'blues_abab'],
    ev: '1960~70년대 미국 · 10곡', conf: 'high',
    why: '두세 코드를 최면적으로 되풀이한다. 개러지는 콤보 오르간(96 Tears)과 탬버린, 프로토펑크는 피아노 8분 연타(Waiting for the Man)와 4분 킥이 몸이다',
  },
  postpunk: {
    anchor: 'Post-punk', members: ['Post-punk', 'Gothic Rock'],
    mel: { density: [1, 3], leap: [0.35, 0.60], contour: 'static', range: [4, 6], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'walking', oct: true, gate: 'short', kick: 'offset', glide: 'none' },
    lead: 'bass', roles: { keys: 'pad-low', keys2: 'none', gtr: 'clean/flanger', gtr2: 'twelve/chorus' },
    chordType: 'add9', comping: 'rock_8th',
    pool: ['ant_abab', 'ant_aaba', 'amb_aabb'],
    ev: '1970~80년대 영국 · 8곡', conf: 'high',
    why: '**베이스가 높은 음역에서 선율을 가져간다** — 곡 문서 3곳과 고딕록 장르 문서가 명시한다. 건반은 8곡 중 A Forest 신스 1곡뿐이다. 고딕록은 16분 하이햇 위의 반박 체감(84)과 플랜저 기타다',
  },
  revival: {
    anchor: 'Post-punk Revival', members: ['Post-punk Revival'],
    mel: { density: [3, 5], leap: [0.15, 0.40], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'gtr', roles: { keys: 'none', keys2: 'none', gtr: 'crunch', gtr2: 'clean' },
    chordType: 'add9', comping: 'rock_8th',
    pool: ['rock_abab', 'rock_aabb'],
    ev: '2000년대 초 미국·영국 · 4곡', conf: 'medium',
    why: '보컬과 맞물린 기타 두 대가 주인공이다. 원조와 달리 베이스는 근음 8분이라(선율 베이스는 Interpol 1곡) 포스트펑크 무리에서 떼어 냈고, 레퍼런스 표의 오르간은 4곡 어디에도 없었다',
  },
  dancepunk: {
    anchor: 'Dance-punk', members: ['Dance-punk'],
    mel: { density: [4, 6], leap: [0.05, 0.35], contour: 'zigzag', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'offbeat16', repetition: 'mid', voicing: 'single' },
    bass: { role: 'octave', oct: true, gate: 'short', kick: 'offset', glide: 'none' },
    lead: 'bass', roles: { keys: 'lead', keys2: 'poly', gtr: 'clean-angular', gtr2: 'crunch' },
    chordType: 'add9', comping: 'disco_stab',
    pool: ['funk_abab', 'funk_aabb', 'funk_aaab'],
    ev: '1970~2000년대 영국·미국 · 4곡', conf: 'medium',
    why: '디스코 하이햇·카우벨·스네어에 겹친 클랩이 계열 공통 표지이고, 장르 문서가 선율 베이스와 싱코페이션을 본질로 든다. 신스는 LCD 계열에만 있다',
  },
  newwave: {
    anchor: 'New Wave', members: ['New Wave'],
    mel: { density: [3, 6], leap: [0.10, 0.30], contour: 'zigzag', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'offbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'lead', keys2: 'poly', gtr: 'clean', gtr2: 'chorus' },
    chordType: 'add9', comping: 'disco_stab',
    pool: ['pop_abab', 'funk_abab'],
    ev: '1970~80년대 미국 · 5곡', conf: 'high',
    why: '신스 리프가 5곡 중 4곡에 있고 조성은 장조가 우세하다. 베이스는 근음 8분이라 댄스펑크와 떼어 냈고, 게이트 스네어는 80년대 중반의 것이라 1978~80 대표곡에 맞춰 뺐다',
  },
  emo: {
    anchor: 'Emo', members: ['Emo', 'Screamo'],
    mel: { density: [1, 3], leap: [0.20, 0.45], contour: 'arch', range: [3, 5], degrees: [0, 2, 4, 1], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'locked', glide: 'none' },
    lead: 'gtr', roles: { keys: 'pad-low', keys2: 'none', gtr: 'crunch/hi', gtr2: 'clean-arp' },
    chordType: 'add9', comping: 'ballad_pad',
    pool: ['bal_aaba', 'bal_aabb', 'bal_abab'],
    ev: '1990~2010년대 미국 · 7곡', conf: 'medium',
    why: '보컬 선율이 음역 꼭대기에서 긴장하고, 기타는 클린 아르페지오와 디스토션을 오간다. 건반은 배경층일 때만 있고 스크리모는 4곡 모두 없다',
  },
  shoegaze: {
    anchor: 'Shoegaze', members: ['Shoegaze', 'Dream Pop'],
    mel: { density: [1, 3], leap: [0.25, 0.50], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'long', kick: 'free', glide: 'none' },
    lead: 'gtr', roles: { keys: 'pad/organ', keys2: 'arp', gtr: 'fuzz-overdub/clean-reverb', gtr2: 'twelve/chorus' },
    chordType: 'add9', comping: 'ballad_pad',
    pool: ['amb_aaba', 'amb_aabb', 'bal_aaba'],
    ev: '1980~2010년대 영국·미국 · 10곡', conf: 'high',
    why: '기타 텍스처가 주인공이고 보컬은 한 겹으로 묻힌다. 슈게이즈는 한 대의 코러스가 아니라 퍼즈를 대량으로 겹친 소리였고(Only Shallow), 드림팝은 패드보다 오르간·아르페지오와 드럼머신, 반박 체감이다',
  },
  britpop: {
    anchor: 'Britpop', members: ['Britpop'],
    mel: { density: [3, 5], leap: [0.05, 0.35], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'organ', keys2: 'piano', gtr: 'crunch', gtr2: 'acoustic' },
    chordType: 'add9', comping: 'pop_pulse',
    pool: ['pop_aabb', 'pop_aaba', 'pop_abab'],
    ev: '1990년대 중반 영국 · 4곡', conf: 'medium',
    why: '4곡 모두 건반(피아노·해먼드·멜로트론)과 탬버린이 있고 장조 찬가형 후렴이다. «12현» 은 출처에서 확인되지 않아 크런치와 어쿠스틱으로 바꿨다',
  },
  lofi: {
    anchor: 'Lo-fi Indie', members: ['Lo-fi Indie'],
    mel: { density: [3, 5], leap: [0.10, 0.30], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'mid', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'chord-organ', keys2: 'piano', gtr: 'thin-crunch', gtr2: 'acoustic' },
    chordType: 'add9', comping: 'pop_pulse',
    pool: ['pop_aabb', 'pop_aaba'],
    ev: '1980~90년대 미국 · 4곡', conf: 'low',
    why: '곡의 훅과 장조 파워팝·포크 진행이 몸이다. 이전 판의 «EP 라서 재즈 어휘» 는 근거가 없었다 — 건반은 코드 오르간·피아노이고 베이스는 약하다',
  },
  slacker: {
    anchor: 'Slacker Rock', members: ['Slacker Rock'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'fall', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'walking', oct: false, gate: 'mid', kick: 'offset', glide: 'none' },
    lead: 'gtr', roles: { keys: 'none', keys2: 'none', gtr: 'chorus-wobble', gtr2: 'fuzz' },
    chordType: 'add9', comping: 'rock_8th',
    pool: ['rock_aaba', 'blues_aabb'],
    ev: '1980~2010년대 미국·호주 · 4곡', conf: 'low',
    why: '늘어지는 무표정 보컬이 박 뒤에 앉아 내려온다. 셔플이 아니라 레이드백이라 스윙을 8 로 낮췄고, 건반은 4곡에 없다',
  },
  alt: {
    anchor: 'Alternative Rock', members: ['Alternative Rock', 'Grunge', 'Indie Rock', 'Noise Rock'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'gtr', roles: { keys: 'organ-low', keys2: 'strings', gtr: 'crunch-fuzz', gtr2: 'chorus/mandolin' },
    chordType: 'add9', comping: 'rock_8th',
    pool: ['rock_aabb', 'rock_aaba', 'rock_abab'],
    ev: '1980~2000년대 미국·영국 · 17곡', conf: 'high',
    why: '조용한 벌스 → 터지는 코러스가 이 무리의 틀이다. 표준 록 선율 위에서 갈리는 것은 편성이다 — 그런지·노이즈는 건반 없음, 얼터너티브는 옅은 건반과 만돌린, 인디는 장조와 맞물린 기타',
  },
  countryrock: {
    anchor: 'Country Rock', members: ['Country Rock'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'gtr', roles: { keys: 'none', keys2: 'none', gtr: 'pedal-steel', gtr2: 'banjo' },
    chordType: 'triad', comping: 'rock_8th',
    pool: ['rootbl_aabb', 'rootbl_aaba', 'root_aabb'],
    ev: '1960~70년대 미국 · 4곡', conf: 'medium',
    why: '페달 스틸·B-벤더와 밴조, 3~4성부 화음 보컬. 4곡 모두 장조라 스케일을 Major 로 바꿨고 건반은 한 곡에도 없다',
  },
  blackmetal: {
    anchor: 'Black Metal', members: ['Black Metal'],
    mel: { density: [1, 2], leap: [0.30, 0.50], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'gtr', roles: { keys: 'pad', keys2: 'choir', gtr: 'hi-tremolo', gtr2: 'fuzz' },
    chordType: 'power', comping: 'punk_quarter',
    pool: ['amb_aaab', 'amb_aaba'],
    ev: '1990년대 노르웨이 · 4곡', conf: 'medium',
    why: '트레몰로 기타가 긴 음 선율을 그리고, 4곡 중 2곡(Emperor·Burzum)은 신스가 분위기와 느린 모티프를 맡는다 — 성긴 앰비언트 재료가 맞다',
  },
  powermetal: {
    anchor: 'Power Metal', members: ['Power Metal'],
    mel: { density: [3, 5], leap: [0.25, 0.60], contour: 'rise', range: [4, 6], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'supersaw', keys2: 'strings', gtr: 'hi-twin', gtr2: 'hi' },
    chordType: 'power', comping: 'punk_quarter',
    pool: ['rkant_aabb', 'cin_aabb'],
    ev: '1980~2000년대 독일·핀란드·영국 · 4곡', conf: 'medium',
    why: '고음 클린 보컬의 상행 찬가형 후렴이 주인공이다. 건반은 북유럽·영국형 2곡(Stratovarius·DragonForce)에만 있고 초기 Helloween 은 없다',
  },
  symphonic: {
    anchor: 'Symphonic Metal', members: ['Symphonic Metal'],
    mel: { density: [3, 5], leap: [0.15, 0.40], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: { role: 'root', oct: false, gate: 'short', kick: 'locked', glide: 'none' },
    lead: 'keys', roles: { keys: 'strings', keys2: 'choir', gtr: 'hi', gtr2: 'hi' },
    chordType: 'power', comping: 'ballad_pad',
    pool: ['cin_aabb', 'cinbal_aabb', 'cin_abab'],
    ev: '1990~2000년대 핀란드·네덜란드·이탈리아 · 4곡', conf: 'medium',
    why: '4곡 모두 오케스트라·합창·건반이 크레딧에 있고 보컬 선율이 주인공이다. 기타는 단순한 받침이라(장르 문서) 시네마틱 재료가 맞다',
  },
};
