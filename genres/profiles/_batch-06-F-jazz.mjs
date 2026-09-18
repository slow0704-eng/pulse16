/* 배치 A11 — 재즈(F) 9종 · 루츠(G) 21종 · 기타 지역(K) 2종.
   세 계열을 한 배치로 묶은 이유: F 가 9종뿐이고 K 가 2종이라 따로 돌릴 값이 없다.
   근거는 genres/06-jazz.md · 07-roots.md · 11-regional.md 와 실제 kit. */

export const batch = 'A11';
export const sub = 'Jazz · Roots · Regional (계열 F·G·K)';
export const cat = 'F';
export const date = '2026-09-15';
export const verdict = '32종 → 22무리. 재즈 9 · 루츠 21 · 기타 지역 2 를 한 배치로 돌렸다. '
  + '2026-09-19 에 West Coast Jazz 를 «Bebop 계보» 에서 빼 `coolwest` 로 갈랐다 — '
  + '출처가 쿨 재즈를 「a reaction to bop」으로 적는다. '
  + '덧붙여 이 줄의 «18무리» 는 처음부터 틀린 수였다(실제 21). _gen 이 세어 준 값으로 바로잡는다.';

export const CAT = {
  'Chicago Blues':'G','Texas Blues':'G','Jump Blues':'G','Blues Rock':'G','Country Blues':'G','Electric Blues':'G',
  'Honky-tonk':'G','Bluegrass':'G','Old-time / Hillbilly':'G','Nashville Sound':'G','Outlaw Country':'G',
  'Country Pop':'G','Bro-country':'G','Countrypolitan':'G','Alt-country':'G','Americana':'G',
  'Folk Revival':'G','Indie Folk':'G','Folk Rock':'G','Gospel':'G','Zydeco / Cajun':'G',
  'Bhangra':'K','Global Bass':'K',
};
export const SUB = {
  'Jazz Fusion':'Fusion 계보','Soul Jazz':'Bebop 계보','West Coast Jazz':'Cool · West Coast',
  'Smooth Jazz':'현대 갈래','Acid Jazz':'현대 갈래',
  'Latin Jazz':'Latin Jazz','Afro-Cuban Jazz':'Latin Jazz','Bossa Jazz':'Latin Jazz','Samba Jazz':'Latin Jazz',
  'Chicago Blues':'Blues','Texas Blues':'Blues','Jump Blues':'Blues','Blues Rock':'Blues',
  'Country Blues':'Blues','Electric Blues':'Blues',
  'Honky-tonk':'Country','Bluegrass':'Country','Old-time / Hillbilly':'Country','Nashville Sound':'Country',
  'Outlaw Country':'Country','Country Pop':'Country','Bro-country':'Country','Countrypolitan':'Country',
  'Alt-country':'Country','Americana':'Country',
  'Folk Revival':'Folk','Indie Folk':'Folk','Folk Rock':'Folk',
  'Gospel':'Gospel · 지역 장르','Zydeco / Cajun':'Gospel · 지역 장르',
  'Bhangra':'남아시아','Global Bass':'하이브리드 · 인터넷 장르',
};
const B = (role, gate, kick, oct = false, glide = 'none') => ({ role, oct, gate, kick, glide });

export const groups = {
  /* ── F. 재즈 9종 ── */
  bebop: {
    anchor: 'Soul Jazz', members: ['Soul Jazz'],
    mel: { density: [5, 7], leap: [0.20, 0.45], contour: 'zigzag', range: [4, 6], degrees: [0, 2, 4, 5, 6], rhythm: 'triplet-feel', repetition: 'low', voicing: 'single' },
    bass: B('walking', 'mid', 'free'), lead: 'keys',
    roles: { keys: 'organ', keys2: 'sax', gtr: 'comp', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['jazz_abab', 'jazz_aaba', 'jazz_aabb'], riff: ['jazz_gtr_swing', 'jazz_gtr_comp'], bline: ['bwal_abab', 'bwal_aaba'],
    ev: '1950~1960년대 미국 · 6곡', conf: 'high',
    why: '**비밥 계보가 맞다** — 출처가 사슬로 잇는다: 「**Hard bop is a subgenre of jazz that is an extension of bebop.**」이고 「Soul jazz … **incorporates strong influences from hard bop**」이다. 소리의 정체는 오르간이다 — 「often characterized by **organ trios featuring the Hammond organs** and small combos」. 워킹 베이스도 이 갈래만 근거가 있다(Jimmy Smith 가 「walking bass lines on the **bass pedals**」). 전까지 이 무리에 West Coast Jazz 가 함께 있었는데, 그쪽은 방향이 반대라 갈랐다',
  },
  coolwest: {
    anchor: 'West Coast Jazz', members: ['West Coast Jazz'],
    /* 밀도는 형제(비밥)와 같은 [5,7] 이다. 무리를 가르면서 한 번 [3,5] 로 적었다가
       P11 에 걸렸다 — 재료(jazz_*)의 실측이 6.25 인데 그보다 낮게 지어낸 값이었다.
       출처가 말하는 「calmer」·「relaxed」·「relied relatively more on composition
       and arrangement」는 다이내믹과 편곡에 대한 것이지 마디당 음 개수가 아니다.
       성기다는 근거가 없으므로 수치를 지어내지 않고 재료 실측에 맞춘다. */
    mel: { density: [5, 7], leap: [0.20, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'triplet-feel', repetition: 'mid', voicing: 'single' },
    bass: B('walking', 'mid', 'free'), lead: 'keys',
    roles: { keys: 'piano', keys2: 'none', gtr: 'comp', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['jazz_aaba', 'jazbal_aaba', 'jazz_aabb'], riff: ['jazz_gtr_swing', 'arp_swing'], bline: ['bwal_aaba', 'bwal_abab'],
    ev: '1950년대 미국 서해안 · 5곡', conf: 'high',
    why: '**비밥의 연장이 아니라 반작용이다** — 「West Coast jazz is often seen as a **subgenre of cool jazz**, which consisted of a calmer style **than bebop or hard bop**」이고 쿨 재즈 자체가 「**emerged as a reaction to bop**」이다. 그래서 Soul Jazz 와 한 무리에 둘 수 없다. 정의로 드는 것은 「relied relatively more on **composition and arrangement**」와 **피아노 없는 편성**이다 — 「formed an innovative and successful **piano-less quartet**」·「a rhythm section that **omitted the use of a piano, guitar, or any chordal instrument**」. 2번 건반은 **근거가 없는 층이다** — 프리셋에 적힌 `clarinet` 을 말하는 출처가 없고(있는 것은 프렌치 호른·튜바·첼로), 패턴이 비어 있어 **울리지도 않는다.** 소리에 영향이 없어 값은 그대로 두고 여기 적어만 둔다. 1번 건반의 피아노도 마찬가지로 두었다 — 출처가 특징으로 드는 것은 피아노 없는 편성이지만, 피아노가 있는 확인된 녹음도 있어 «틀렸다» 고 단정할 수 없다. 템포는 「moderate」·「relaxed」까지가 출처이고 **수치는 없다**',
  },
  fusion: {
    anchor: 'Jazz Fusion', members: ['Jazz Fusion'],
    mel: { density: [5, 7], leap: [0.20, 0.45], contour: 'zigzag', range: [4, 6], degrees: [0, 2, 4, 5, 6], rhythm: 'offbeat16', repetition: 'low', voicing: 'single' },
    bass: B('walking', 'short', 'offset'), lead: 'keys',
    roles: { keys: 'sax', keys2: 'ep', gtr: 'jazzbox', gtr2: 'none' },
    chordType: 'thirteen', comping: 'ballad_pad',
    pool: ['jazz_aabb', 'jazbal_abab', 'jazz_abab'], riff: ['jazz_gtr_comp', 'funk_groove'], bline: ['bwal_aabb', 'bfun_abab'],
    ev: '1970년대 미국 · 9곡', conf: 'high',
    why: '프렛리스에 13화음. 스윙이 없고 16분이 몸이라 비밥 형제와 박자부터 다르다',
  },
  smoothjazz: {
    anchor: 'Smooth Jazz', members: ['Smooth Jazz'],
    mel: { density: [3, 5], leap: [0.20, 0.45], contour: 'arch', range: [3, 5], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: B('walking', 'mid', 'locked'), lead: 'keys',
    roles: { keys: 'sax', keys2: 'pad', gtr: 'jazzbox', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['bal_aaba', 'cinbal_aaba', 'cinbal_aabb'], riff: ['jazz_gtr_comp', 'arp_swing'], bline: ['bwal_aaba', 'bfun_aabb'],
    ev: '1980년대 이후 미국 · 8곡', conf: 'medium',
    why: '색소폰이 패드 위를 걷는다. 비밥의 절반 밀도이고 방향을 덜 바꾼다 — 라디오용이다',
  },
  acidjazz: {
    anchor: 'Acid Jazz', members: ['Acid Jazz'],
    mel: { density: [5, 7], leap: [0.20, 0.45], contour: 'zigzag', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'offbeat16', repetition: 'mid', voicing: 'single' },
    bass: B('walking', 'short', 'offset'), lead: 'keys',
    roles: { keys: 'organ', keys2: 'trumpet', gtr: 'wah', gtr2: 'none' },
    chordType: 'nine', comping: 'funk_16th_stab',
    pool: ['jazbal_abab', 'jazz_aaba', 'jazbal_aaba'], riff: ['jazz_gtr_comp', 'funk_groove'], bline: ['bwal_abab', 'bfun_abab'],
    ev: '1980년대 후반 영국 · 9곡', conf: 'high',
    why: '와우 기타와 오르간에 스윙 30. 재즈 화성에 펑크 그루브를 붙인 자리다',
  },
  latinjazz: {
    anchor: 'Latin Jazz', members: ['Latin Jazz', 'Afro-Cuban Jazz'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'offbeat', repetition: 'mid', voicing: 'single' },
    bass: B('walking', 'short', 'offset'), lead: 'keys',
    roles: { keys: 'piano', keys2: 'trumpet-brass', gtr: 'nylon', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['lat_aabb', 'lat_abab', 'latbos_aabb'], riff: ['latin_montuno', 'latin_montuno_alt'], bline: ['blat_aabb', 'bwal_abab'],
    ev: '1940년대 이후 미국·쿠바 · 11곡', conf: 'high',
    why: '클라베가 골격이다 — 「It mixes **Afro-Cuban clave-based rhythms** with jazz harmonies」. 재즈 화성 위에 구아헤오(북미에서는 **몬투노**)가 돌아 형제 중 유일하게 쿠바 어법이다. 두 무리로 가른 것은 출처와 맞는다 — 「The **two main categories** are **Afro-Cuban jazz** … and **Afro-Brazilian jazz**, which includes samba and bossa nova」. ⚠ 전까지 적어 둔 「170~190 BPM」은 **출처가 없다**: 조사한 장르 문서 다섯(Latin jazz·Afro-Cuban jazz·Bossa nova·Samba-jazz·Samba) 중 BPM 수치를 적은 것이 하나도 없다. 기타도 마찬가지다 — Afro-Cuban jazz 의 악기 목록(피아노·콩가·트럼펫·트롬본·베이스·클라베·팀발레·봉고·색소폰·클라리넷)에 **기타가 없어** 껐다',
  },
  bossajazz: {
    anchor: 'Bossa Jazz', members: ['Bossa Jazz', 'Samba Jazz'],
    mel: { density: [1, 3], leap: [0.30, 0.55], contour: 'arch', range: [3, 5], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'mid', voicing: 'single' },
    bass: B('walking', 'mid', 'offset'), lead: 'keys',
    roles: { keys: 'piano', keys2: 'sax-trumpet', gtr: 'nylon', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['bos_aabb', 'bos_aaba', 'bos_abab'], riff: ['arp_swing', 'jazz_gtr_comp'], bline: ['bwal_aaba', 'blat_aaba'],
    ev: '1960년대 이후 브라질 · 15곡', conf: 'high',
    why: '나일론 기타가 정의다 — 「One of the major innovations of bossa nova was the way to **synthesize the rhythm of samba on the classical guitar**」이고 「**played with the fingers rather than with a pick**」이다. **쿠바 클라베를 복사해 두었던 것을 지웠다**: 출처는 보사 패턴이 손 클라베와 「**dissimilar in that the ‘two’ side of the clave is pushed by an eighth note**」라 하고, 만든 Jobim 본인은 「**merely a rhythmic motif and not a clave**」로 보았다. 대신 출처가 직접 말한 둘을 넣었다 — 「the **cabasa**, which plays a steady **sixteenth-note** pattern」과 「As in samba, the **surdo** plays an ostinato figure on the downbeat of beat one, the ‘ah’ of beat one, the downbeat of beat two and the ‘ah’ of beat two」. 삼바재즈와 갈리는 축도 템포가 아니라 세기다 — 「Unlike bossa nova … **the restraint of sound elements**, samba-jazz has many elements present in **improvising and stridency**」. ⚠ BPM 은 출처 없음(곡 악보 표기는 오히려 ♩=145·148 로 프리셋 130 보다 빠르다)',
  },

  /* ── G. 블루스 6종 ── */
  chicagoblues: {
    anchor: 'Chicago Blues', members: ['Chicago Blues', 'Electric Blues', 'Texas Blues'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'triplet-feel', repetition: 'high', voicing: 'single' },
    bass: B('root', 'mid', 'locked'), lead: 'gtr',
    roles: { keys: 'harmonica-organ', keys2: 'organ-horns', gtr: 'crunch', gtr2: 'none' },
    chordType: 'sev', comping: 'rock_8th',
    pool: ['blues_aaba', 'blues_aabb', 'blues_abab'], riff: ['rock_power', 'arp_country'], bline: ['bcou_aabb', 'bwal_aabb'],
    ev: '1950년대 이후 미국 · 12곡', conf: 'high',
    why: '스윙 30~50 의 셔플에 하모니카·크런치 기타. 12마디 형식이 뼈대다',
  },
  jumpblues: {
    anchor: 'Jump Blues', members: ['Jump Blues'],
    mel: { density: [5, 7], leap: [0.20, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'triplet-feel', repetition: 'mid', voicing: 'single' },
    bass: B('walking', 'short', 'locked'), lead: 'keys',
    roles: { keys: 'horns', keys2: 'sax', gtr: 'jazzbox', gtr2: 'none' },
    chordType: 'sev', comping: 'rock_8th',
    pool: ['jazz_aaba', 'jazbal_aaba', 'jazz_abab'], riff: ['jazz_gtr_swing', 'rock_drive'], bline: ['bwal_aabb', 'bwal_abab'],
    ev: '1940년대 미국 · 9곡', conf: 'high',
    why: '160 BPM 에 혼 섹션과 업라이트. 블루스에서 유일하게 빅밴드 쪽이라 밀도가 두 배다',
  },
  bluesrock: {
    anchor: 'Blues Rock', members: ['Blues Rock'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'short', 'locked'), lead: 'gtr',
    roles: { keys: 'organ', keys2: 'piano', gtr: 'crunch', gtr2: 'none' },
    chordType: 'sev', comping: 'rock_8th',
    pool: ['rootbl_aabb', 'rootbl_aaba', 'rock_aabb'], riff: ['rock_power', 'rock_drive'], bline: ['brock_aabb', 'bcou_aabb'],
    ev: '1960년대 후반 영국·미국 · 10곡', conf: 'high',
    why: '스윙 0 의 스트레이트. 형제 셋이 셔플인데 여기만 록 비트라 박자부터 갈린다',
  },
  countryblues: {
    anchor: 'Country Blues', members: ['Country Blues'],
    mel: { density: [3, 5], leap: [0.20, 0.45], contour: 'fall', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: B('root', 'mid', 'offset'), lead: 'gtr',
    roles: { keys: 'harmonica', keys2: 'dulcimer', gtr: 'resonator', gtr2: 'none' },
    chordType: 'sev', comping: 'rock_8th',
    pool: ['root_aaba', 'rootbl_aaba', 'blues_aaba'], riff: ['arp_country', 'arp_folk'], bline: ['bcou_aaba', 'bwal_aaba'],
    ev: '1920~30년대 미국 남부 · 9곡', conf: 'high',
    why: '90 BPM 에 리조네이터와 덜시머. 밴드가 아니라 혼자 치는 블루스라 하행이 잦다',
  },

  /* ── G. 컨트리 10종 ── */
  honkytonk: {
    anchor: 'Honky-tonk', members: ['Honky-tonk', 'Old-time / Hillbilly'],
    mel: { density: [3, 5], leap: [0.20, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: B('walking', 'short', 'locked'), lead: 'keys',
    roles: { keys: 'piano-harmonica', keys2: 'accordion-strings', gtr: 'steel-banjo', gtr2: 'none' },
    chordType: 'triad', comping: 'rock_8th',
    pool: ['root_aaba', 'root_aabb', 'root_abab'], riff: ['arp_country', 'rock_drive'], bline: ['bcou_aabb', 'bcou_aaba'],
    ev: '1940~50년대 미국 · 11곡', conf: 'high',
    why: '붐칙 베이스에 피아노·밴조. 컨트리의 뿌리 형태이고 반복이 강하다',
  },
  bluegrass: {
    anchor: 'Bluegrass', members: ['Bluegrass'],
    mel: { density: [5, 7], leap: [0.20, 0.45], contour: 'zigzag', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'low', voicing: 'single' },
    bass: B('walking', 'short', 'locked'), lead: 'gtr',
    roles: { keys: 'piano', keys2: 'strings', gtr: 'mandolin', gtr2: 'none' },
    chordType: 'triad', comping: 'rock_8th',
    pool: ['jazz_aabb', 'root_abab', 'jazbal_abab'], riff: ['arp_country', 'arp_swing'], bline: ['bcou_abab', 'bwal_aabb'],
    ev: '1940년대 이후 미국 애팔래치아 · 10곡', conf: 'high',
    why: '150 BPM 에 만돌린 트레몰로. 속주가 정체성이라 컨트리에서 밀도가 가장 높다',
  },
  nashville: {
    anchor: 'Nashville Sound', members: ['Nashville Sound', 'Countrypolitan', 'Country Pop'],
    mel: { density: [3, 5], leap: [0.05, 0.35], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'mid', 'locked'), lead: 'keys',
    roles: { keys: 'strings-piano', keys2: 'choir-strings', gtr: 'pedal', gtr2: 'none' },
    chordType: 'triad', comping: 'ballad_pad',
    pool: ['pop_aaba', 'pop_aabb', 'cinbal_aaba'], riff: ['arp_country', 'arp_folk'], bline: ['bcou_aaba', 'bdis_aabb'],
    ev: '1960년대 이후 미국 내슈빌 · 11곡', conf: 'high',
    why: '현과 합창으로 컨트리를 팝으로 다듬은 자리. 페달 스틸만 남기고 순차가 많아진다',
  },
  outlaw: {
    anchor: 'Outlaw Country', members: ['Outlaw Country', 'Alt-country', 'Americana'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'mid', 'offset'), lead: 'gtr',
    roles: { keys: 'piano-ep-harmonica', keys2: 'organ-piano', gtr: 'nylon-pedal-steel', gtr2: 'none' },
    chordType: 'triad', comping: 'rock_8th',
    pool: ['rootbl_aaba', 'rootbl_aabb', 'root_aabb'], riff: ['arp_country', 'rock_alt'], bline: ['bcou_aabb', 'brock_aabb'],
    ev: '1970년대 이후 미국 · 11곡', conf: 'high',
    why: '내슈빌의 매끈함을 거부한 계보. 블루스 어휘가 섞이고 프로덕션을 덜 다듬는다',
  },
  brocountry: {
    anchor: 'Bro-country', members: ['Bro-country'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: B('root', 'short', 'locked'), lead: 'gtr',
    roles: { keys: 'lead', keys2: 'strings', gtr: 'crunch', gtr2: 'none' },
    chordType: 'triad', comping: 'rock_8th',
    pool: ['rock_aaba', 'rock_aabb', 'rock_abab'], riff: ['rock_power', 'rock_drive'], bline: ['brock_aabb', 'bcou_aabb'],
    ev: '2010년대 미국 · 8곡', conf: 'medium',
    why: '크런치 기타에 신스 리드. 컨트리 형제 중 유일하게 록 편성이라 페달 스틸이 없다',
  },

  /* ── G. 포크 3종 · 가스펠·자이데코 2종 ── */
  folk: {
    anchor: 'Folk Revival', members: ['Folk Revival', 'Indie Folk'],
    mel: { density: [3, 5], leap: [0.20, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'mid', 'offset'), lead: 'gtr',
    roles: { keys: 'harmonica-glocken', keys2: 'dulcimer-strings', gtr: 'steel', gtr2: 'none' },
    chordType: 'add9', comping: 'ballad_pad',
    pool: ['root_aabb', 'root_aaba', 'worcin_aaba'], riff: ['arp_folk', 'arp_country'], bline: ['bcou_aaba', 'bwal_aaba'],
    ev: '1960년대 이후 미국·영국 · 10곡', conf: 'high',
    why: '스틸 기타 아르페지오에 업라이트. 컨트리와 재료는 이웃인데 붐칙이 없고 잔잔하다',
  },
  folkrock: {
    anchor: 'Folk Rock', members: ['Folk Rock'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'short', 'locked'), lead: 'gtr',
    roles: { keys: 'organ', keys2: 'harmonica', gtr: 'twelve', gtr2: 'none' },
    chordType: 'add9', comping: 'rock_8th',
    pool: ['rock_aabb', 'rock_abab', 'root_abab'], riff: ['rock_alt', 'arp_folk'], bline: ['brock_aabb', 'bcou_aabb'],
    ev: '1960년대 중반 미국·영국 · 9곡', conf: 'high',
    why: '12현에 드럼이 들어온다. 130 BPM 으로 포크 형제보다 빠르고 록 백비트가 있다',
  },
  gospel: {
    anchor: 'Gospel', members: ['Gospel'],
    mel: { density: [2, 4], leap: [0.40, 0.70], contour: 'rise', range: [4, 6], degrees: [0, 2, 4], rhythm: 'triplet-feel', repetition: 'mid', voicing: 'chord' },
    bass: B('root', 'mid', 'offset'), lead: 'keys',
    roles: { keys: 'organ', keys2: 'choir', gtr: 'cut', gtr2: 'none' },
    chordType: 'nine', comping: 'gospel_swell',
    pool: ['gos_aabb', 'gos_aaba', 'gos_abab'], riff: ['soul_chank', 'soul_prog'], bline: ['bfun_aabb', 'bwal_aaba'],
    ev: '1950년대 이후 미국 · 11곡', conf: 'high',
    why: '오르간 코드 스웰과 합창. 계열에서 유일하게 **3화음 표기가 몸**이다',
  },
  zydeco: {
    anchor: 'Zydeco / Cajun', members: ['Zydeco / Cajun'],
    mel: { density: [4, 6], leap: [0.20, 0.45], contour: 'zigzag', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'offbeat', repetition: 'high', voicing: 'single' },
    bass: B('root', 'short', 'locked'), lead: 'keys',
    roles: { keys: 'accordion', keys2: 'harmonica', gtr: 'cut', gtr2: 'none' },
    chordType: 'nine', comping: 'rock_8th',
    pool: ['wor_aabb', 'wor_abab', 'afr_abab'], riff: ['arp_country', 'funk_cut'], bline: ['bcou_abab', 'bfun_aabb'],
    ev: '1950년대 이후 미국 루이지애나 · 8곡', conf: 'medium',
    why: '아코디언과 워시보드에 140 BPM. 가스펠 형제와 달리 단음이고 계속 움직인다',
  },

  /* ── K. 기타 지역 2종 ── */
  bhangra: {
    anchor: 'Bhangra', members: ['Bhangra'],
    mel: { density: [3, 5], leap: [0.20, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'offbeat16', repetition: 'high', voicing: 'single' },
    bass: B('root', 'short', 'locked'), lead: 'gtr',
    roles: { keys: 'ep', keys2: 'strings', gtr: 'sitar', gtr2: 'none' },
    chordType: 'triad', comping: 'trap_pad',
    pool: ['afr_abab', 'afr_aabb', 'wor_abab'], riff: ['arp_folk', 'highlife_gtr'], bline: ['bafr_aaab', 'blat_aabb'],
    ev: '1980년대 이후 펀자브·영국 · 9곡', conf: 'high',
    why: '돌 리듬에 시타르. 145 BPM 으로 남아시아 형제보다 빠르고 16분으로 쪼갠다',
  },
  globalbass: {
    anchor: 'Global Bass', members: ['Global Bass'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'static', range: [4, 6], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'high', voicing: 'single' },
    bass: B('root', 'long', 'locked'), lead: 'keys',
    roles: { keys: 'bell', keys2: 'strings', gtr: 'none', gtr2: 'none' },
    chordType: 'sev', comping: 'trap_pad',
    pool: ['car_aabb', 'lat_abab', 'car_abab'], riff: ['skank_up', 'latin_montuno'], bline: ['blat_abab', 'breg_aabb'],
    ev: '2010년대 인터넷·중남미 · 8곡', conf: 'medium',
    why: '여러 지역 타악을 베이스 뮤직 위에 얹는다. 어휘는 카리브·라틴 쪽이다',
  },
};
