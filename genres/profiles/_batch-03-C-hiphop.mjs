/* 배치 A9 — Hip Hop 계열 41종. _gen.mjs 가 이 표를 펼친다.

   2026-09-15 첫 판은 genres/03-hiphop.md 의 분석과 프리셋 kit 만 보고 갈랐다.
   2026-09-17 에 **대표곡으로 다시 검증했다.** 장르마다 웹에서 실재·장르 분류를
   확인한 곡(genres/03-hiphop.md «대표곡» 표)을 모으고, 곡에서 확인되는 성질
   — 템포 범위 · 드럼 골격 · 베이스 엔진 · 건반 음색 — 과 대조했다.

   무리를 쪼갠 곳 (근거가 달라서)
     · drill(5종 한 무리) → **넷으로.** 「808 슬라이드」는 출처가 UK 드릴에만 붙인다
       (Drill music: 「UK drill production … characterized by a faster BPM, 808s 'slides'」).
       시카고는 slide 서술이 없고(프리셋 자신도 glide 0), 샘플 드릴은 선율을 **샘플**이
       맡는다. 한 무리로 두면 「미끄러지는 808 이 선율을 맡는다」가 셋에게 거짓이 된다
     · crunk(Crunk·Bounce) → **둘로.** 바운스의 정체는 뉴올리언스 **트리거맨 브레이크**이고
       출처는 바운스와 크렁크를 잇지 않는다. 확인된 조성도 셋 다 장조다
     · rage(Rage·Trap Metal) → **둘로.** 트랩 메탈의 리드는 슈퍼소우가 아니라 왜곡 기타다
     · trap(Trap·Plugg) → **셋으로.** 출처가 플러그의 드럼·건반을 트랩과 다르다고 명시한다
       (Plugg: 「beat skips, crash cymbals … punctuated accent snares on half-beats」)
     · ukrap(UK Rap·Road Rap) → **둘로, 그리고 앵커를 뒤집었다.** UK rap 은 우산 이름이고
       (「covers a variety of styles of hip-hop made in the United Kingdom」, 하위 장르에
       Britcore·road rap·UK drill·UK underground) Road rap 이 그 **하위**다
     · mumble → trap 무리로. 「마림바가 리드」라는 전제가 무너졌다 — 실로폰 음색을
       지목받은 것은 **Plugg** 이고(「xylophone tones」), Mumble rap 문서는 마림바를 말하지 않는다

   수치는 재료 실측에서 나왔다(check-melody-profile.mjs P11 이 대조):
     amb 1.00/0.38~0.42/4 · bal 2.13~2.19/0.29~0.35/4 · hip 2.00~2.25/0.55~0.75/4
     trp 2.00~2.25/0.60~0.85/4 · ant 2.13~2.19/0.48~0.50/5 · cin 3.63~3.69/0.21~0.25/6
     cinbal 3.63~3.69/0.33/4 · funk 3.63~3.69/0.26~0.30/5 · gar 4.25/0.15~0.45/6
     lat 3.63~3.69/0.26~0.30/5 · car 3.50/0.27~0.31/5 · rock 3.50/0.25~0.26/5
     afr 4.25/0.33/5 · dis 6.50~6.75/0.88/7 · chip 6.50~6.75/0.92~0.94/7
     jazz 6.25/0.29~0.30/5 · jazbal 6.25/0.32~0.33/4 · pwr 3.50/0.85~1.00/6          */

export const batch = 'A9';
export const sub = 'Hip Hop (계열 C)';
export const cat = 'C';
export const date = '2026-09-17';
export const verdict =
  '41종 → 30무리. 대표곡으로 다시 갈랐고 여섯 무리를 쪼갰다(드릴 넷 · 크렁크 둘 · 레이지 둘 · 트랩 셋 · UK 둘 · 로파이 둘). '
  + 'Booty Bass 는 Miami Bass 의 다른 이름임이 확인돼 골격을 같게 맞췄고, UK Rap 은 우산 이름이라 곡을 채우지 않았다.';

export const SUB = {
  'Boom Bap':'뿌리 · 골든에이지','Old School Hip Hop':'뿌리 · 골든에이지','Jazz Rap':'뿌리 · 골든에이지',
  'Hardcore Hip Hop':'뿌리 · 골든에이지','Golden Age':'뿌리 · 골든에이지',
  'Conscious Hip Hop':'뿌리 · 골든에이지','Horrorcore':'뿌리 · 골든에이지',
  'Trap':'Trap 계열','Melodic Trap':'Trap 계열','Plugg':'Trap 계열','Rage':'Trap 계열',
  'Trap Metal':'Trap 계열','Mumble Rap':'Trap 계열','Pluggnb':'Trap 계열',
  'Lo-fi':'Lo-fi','Chillhop':'Lo-fi','Jazzhop':'Lo-fi',
  'Grime':'UK 계열','Afroswing':'UK 계열','UK Rap':'UK 계열','Road Rap':'UK 계열',
  'UK Drill':'Drill','Chicago Drill':'Drill','NY / Bronx Drill':'Drill',
  'Jersey Drill':'Drill','Sample Drill':'Drill',
  'Phonk':'Southern','Crunk':'Southern','Miami Bass':'Southern','Snap':'Southern',
  'Bounce':'Southern','Drift Phonk':'Southern','Booty Bass':'Southern','Memphis Rap':'Southern',
  'G-Funk':'West Coast','Hyphy':'West Coast','Jerk':'West Coast',
  'Cloud Rap':'Cloud · Emo 계열','Emo Rap':'Cloud · Emo 계열','SoundCloud Rap':'Cloud · Emo 계열',
  'Brazilian Phonk':'지역화 파생',
};

/* 프리셋 파일(src/data/presets/03-hiphop.js)의 실제 스케일 */
export const SCALE = {
  'Boom Bap':'Dorian','Trap':'Natural Minor','Lo-fi':'Natural Minor','Grime':'Minor Pentatonic',
  'UK Drill':'Natural Minor','Phonk':'Minor Pentatonic','G-Funk':'Natural Minor',
  'Crunk':'Natural Minor','Miami Bass':'Natural Minor','Old School Hip Hop':'Dorian',
  'Jazz Rap':'Dorian','Hardcore Hip Hop':'Natural Minor','Snap':'Natural Minor','Bounce':'Major',
  'Melodic Trap':'Natural Minor','Plugg':'Minor Pentatonic','Rage':'Minor Pentatonic',
  'Trap Metal':'Natural Minor','Chicago Drill':'Natural Minor','NY / Bronx Drill':'Natural Minor',
  'Afroswing':'Minor Pentatonic','Chillhop':'Natural Minor','Cloud Rap':'Natural Minor',
  'Emo Rap':'Natural Minor','Drift Phonk':'Minor Pentatonic','Brazilian Phonk':'Minor Pentatonic',
  'Golden Age':'Dorian','Conscious Hip Hop':'Dorian','Horrorcore':'Natural Minor',
  'Hyphy':'Natural Minor','Jerk':'Natural Minor','Booty Bass':'Natural Minor',
  'Memphis Rap':'Minor Pentatonic','Mumble Rap':'Natural Minor','Pluggnb':'Dorian',
  'Jersey Drill':'Minor Pentatonic','Sample Drill':'Natural Minor','SoundCloud Rap':'Natural Minor',
  'Jazzhop':'Natural Minor','UK Rap':'Minor Pentatonic','Road Rap':'Natural Minor',
};

const B = (role, gate, kick, oct = false, glide = 'none') =>
  ({ role, oct, gate, kick, glide });

export const groups = {
  boombap: {
    anchor: 'Boom Bap', members: ['Boom Bap', 'Golden Age', 'Hardcore Hip Hop'],
    mel: { density: [2, 3], leap: [0.50, 0.80], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'high', voicing: 'single' },
    bass: B('root', 'long', 'offset'), lead: 'keys',
    roles: { keys: 'ep-piano', keys2: 'sax-strings', gtr: 'none', gtr2: 'none' },
    chordType: 'sev', comping: 'trap_pad',
    pool: ['hip_aaab', 'hip_aaba', 'hip_abab'], riff: ['jazz_gtr_comp', 'funk_cut'], bline: ['bwal_aaba', 'bfun_aabb'],
    ev: '1980~1990년대 미국 뉴욕 · 15곡', conf: 'high',
    why: '**스윙 퀀타이즈가 장르 정의의 일부다**(「highly swung programming」). 두세 음을 되풀이해 랩이 들어갈 자리를 비운다. Golden Age 의 swing 0 은 그래서 고쳤다',
  },
  horrorcore: {
    anchor: 'Horrorcore', members: ['Horrorcore'],
    mel: { density: [2, 3], leap: [0.40, 0.70], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'high', voicing: 'single' },
    bass: B('root', 'long', 'offset'), lead: 'keys',
    roles: { keys: 'piano', keys2: 'tremolo-strings', gtr: 'none', gtr2: 'none' },
    chordType: 'sev', comping: 'ballad_pad',
    pool: ['hip_aaba', 'amb_aabb', 'bal_aaba'], riff: ['arp_folk', 'jazz_gtr_comp'], bline: ['breg_aaba', 'bwal_aaba'],
    ev: '1980~2000년대 미국 · 5곡', conf: 'medium',
    why: '골격은 붐뱁 그대로이고 정의는 가사와 분위기다 — 문서가 「musical elements … upon horror film scores」라 적어 떨리는 현(tremstr)이 그 자리다. 형제 Conscious 보다 도약이 크다(붐뱁 어휘를 그대로 쓴다). 확인된 루프는 피아노·기타·목소리였고 벨은 없었다',
  },
  jazzrap: {
    anchor: 'Jazz Rap', members: ['Jazz Rap'],
    mel: { density: [5, 7], leap: [0.20, 0.45], contour: 'zigzag', range: [4, 6], degrees: [0, 2, 4, 5, 6], rhythm: 'triplet-feel', repetition: 'low', voicing: 'single' },
    bass: B('walking', 'mid', 'free'), lead: 'keys',
    roles: { keys: 'ep', keys2: 'trumpet', gtr: 'comp', gtr2: 'none' },
    chordType: 'sev', comping: 'ballad_pad',
    pool: ['jazz_aaba', 'jazbal_aaba', 'jazz_abab'], riff: ['jazz_gtr_comp', 'jazz_gtr_swing'], bline: ['bwal_abab', 'bwal_aaba'],
    ev: '1990년대 초 미국 · 5곡', conf: 'high',
    why: '**더블베이스가 장르의 몸이다** — The Low End Theory 는 Ron Carter 를 직접 불렀고 문서가 「double bass」를 악기로 든다. 힙합에서 유일하게 재즈 화성이 몸이라 밀도가 형제의 두 배다',
  },
  oldschool: {
    anchor: 'Old School Hip Hop', members: ['Old School Hip Hop'],
    mel: { density: [4, 6], leap: [0.05, 0.35], contour: 'static', range: [4, 6], degrees: [0, 2, 4], rhythm: 'offbeat16', repetition: 'high', voicing: 'single' },
    bass: B('root', 'short', 'locked'), lead: 'keys',
    roles: { keys: 'organ', keys2: 'piano', gtr: 'cut', gtr2: 'none' },
    chordType: 'sev', comping: 'disco_stab',
    pool: ['funk_aabb', 'funk_abab', 'funk_aaab'], riff: ['funk_cut', 'funk_call'], bline: ['bfun_aabb', 'bfun_abab'],
    ev: '1970~1980년대 미국 뉴욕 · 5곡', conf: 'high',
    why: '**사람이 켠 일렉트릭 베이스가 곡을 끈다** — 「use a live band to do covers」. 이 장르에서 808 은 「drum machine recreation of the breakbeat」, 곧 드럼이지 베이스가 아니다',
  },
  conscious: {
    anchor: 'Conscious Hip Hop', members: ['Conscious Hip Hop'],
    mel: { density: [1, 3], leap: [0.25, 0.50], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'high', voicing: 'single' },
    bass: B('root', 'long', 'offset'), lead: 'keys2',
    roles: { keys: 'piano', keys2: 'sax', gtr: 'none', gtr2: 'none' },
    chordType: 'sev', comping: 'ballad_pad',
    pool: ['amb_aaba', 'amb_aabb', 'bal_aaba'], riff: ['arp_folk', 'jazz_gtr_comp'], bline: ['breg_aaba', 'bwal_aaba'],
    ev: '1980~2010년대 미국 · 5곡', conf: 'medium',
    why: '장르 정의가 음악이 아니라 가사라 골격을 시대에서 빌린다. 확인된 생악기는 **색소폰과 피아노**였고 플루트·합창을 지목한 출처는 하나도 없었다 — 템포도 101~111 로 붐뱁보다 빠르다',
  },

  trap: {
    anchor: 'Trap', members: ['Trap', 'Mumble Rap'],
    mel: { density: [2, 3], leap: [0.60, 0.85], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'offbeat16', repetition: 'high', voicing: 'single' },
    bass: B('root', 'long', 'locked'), lead: 'keys',
    roles: { keys: 'woodwind-strings', keys2: 'strings', gtr: 'none', gtr2: 'none' },
    chordType: 'triad', comping: 'trap_pad',
    pool: ['trp_aaab', 'trp_aaba', 'trp_abab'], riff: ['edm_arp', 'edm_alt'], bline: ['b808_aaab', 'b808_aaba'],
    ev: '2010년대 미국 애틀랜타 · 8곡', conf: 'high',
    why: '출처가 이름을 대는 음색은 「synthesized string, brass, **woodwind**, and keyboard」다 — 벨은 지목된 적이 없다. 808 은 「tuned with a long decay」이지 **미끄러지지 않는다**(문서에 slide 서술이 없다)',
  },
  plugg: {
    anchor: 'Plugg', members: ['Plugg', 'Pluggnb'],
    mel: { density: [2, 4], leap: [0.15, 0.45], contour: 'static', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'offbeat16', repetition: 'high', voicing: 'single' },
    bass: B('root', 'long', 'locked'), lead: 'keys',
    roles: { keys: 'xylophone-ep', keys2: 'pad', gtr: 'none', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['cin_aabb', 'cinbal_aaba', 'cinbal_aabb'], riff: ['edm_arp', 'arp_folk'], bline: ['b808_aaab', 'b808_aabb'],
    ev: '2010년대 중반 미국 애틀랜타 · 8곡', conf: 'medium',
    why: '출처가 음색을 직접 댄다 — 「retro Nintendo-style video game sounds … lush chords, **xylophone tones**, and soft synthesizer presets」. 실로폰 오스티나토가 되풀이되므로 반복도가 높고 도약은 작다. 808 은 「thick, hard, **steady**」라 미끄러지지 않고, 드럼은 「beat skips, crash cymbals … accent snares on **half-beats**」로 트랩과 갈린다',
  },
  melodictrap: {
    anchor: 'Melodic Trap', members: ['Melodic Trap'],
    mel: { density: [3, 5], leap: [0.10, 0.40], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'offbeat16', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'long', 'locked'), lead: 'keys',
    roles: { keys: 'pluck', keys2: 'glocken', gtr: 'none', gtr2: 'none' },
    chordType: 'sev', comping: 'ballad_pad',
    pool: ['cinbal_aaba', 'cinbal_aabb', 'bal_aaba'], riff: ['edm_arp', 'arp_folk'], bline: ['b808_aaba', 'b808_aabb'],
    ev: '2010년대 후반 미국 · 5곡', conf: 'medium',
    why: '트랩 골격에 노래가 얹힌다 — 형제 플러그와 달리 선율이 **아치를 그리고** 반복이 덜하다. **위키백과에 항목이 없어**(Melodic trap 404) 계열에서 근거가 가장 얇다. 7화음이 쓰인다(Gmaj7—Em—Bm—A)',
  },
  rage: {
    anchor: 'Rage', members: ['Rage'],
    mel: { density: [6, 8], leap: [0.85, 1.00], contour: 'rise', range: [6, 7], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: B('root', 'long', 'locked', false, 'occasional'), lead: 'keys',
    roles: { keys: 'supersaw', keys2: 'choir', gtr: 'none', gtr2: 'none' },
    chordType: 'triad', comping: 'disco_stab',
    pool: ['chip_aaab', 'chip_aabb', 'chip_abab'], riff: ['edm_build', 'edm_alt'], bline: ['b808_aaab', 'bhou_aaab'],
    ev: '2020년대 초 미국 · 5곡', conf: 'medium',
    why: '과포화된 슈퍼소우 리드가 주역이고 드럼은 「basic, ‘dull’, trap beat」다 — 그래서 가장 빽빽하던 햇을 8분으로 내렸다. 훅이 「**short, looping**, stereo-widened」라 반복도를 높였고, 808 이 「**elastic**」이라 글라이드를 열었다',
  },
  trapmetal: {
    anchor: 'Trap Metal', members: ['Trap Metal'],
    mel: { density: [3, 4], leap: [0.85, 1.00], contour: 'static', range: [5, 7], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'high', voicing: 'chord' },
    bass: B('root', 'mid', 'locked'), lead: 'gtr',
    roles: { keys: 'poly', keys2: 'strings', gtr: 'hi', gtr2: 'none' },
    chordType: 'triad', comping: 'disco_stab',
    pool: ['pwr_aaab', 'pwr_abab'], riff: ['metal_riff', 'rock_power'], bline: ['b808_aaab', 'bmet_aaab'],
    ev: '2010년대 후반 미국·영국 · 5곡', conf: 'medium',
    why: '**리드가 슈퍼소우가 아니라 왜곡 기타다** — 「guitar riffs … sampled, synthesized or recorded」가 정의에 들어 있다. 그래서 레이지에서 떼어 내고 **파워코드 재료**(voicing:chord)로 바꿨다. 베이스는 TR-808 에 드라이브를 태운 것이지 리스(DnB 음색)가 아니다',
  },

  lofi: {
    anchor: 'Lo-fi', members: ['Lo-fi', 'Chillhop'],
    mel: { density: [5, 7], leap: [0.20, 0.45], contour: 'zigzag', range: [3, 5], degrees: [0, 2, 4, 5], rhythm: 'triplet-feel', repetition: 'high', voicing: 'single' },
    bass: B('root', 'mid', 'offset'), lead: 'keys',
    roles: { keys: 'piano-ep', keys2: 'ep-vibes', gtr: 'fingerpick', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['jazbal_aaba', 'jazbal_abab'], riff: ['jazz_gtr_comp', 'arp_swing'], bline: ['bwal_aaba', 'breg_aaba'],
    ev: '2000년대 이후 일본·인터넷 · 10곡', conf: 'medium',
    why: '**칠홉은 로파이의 다른 이름이다** — 위키백과가 「Lofi hip-hop (also known as **chillhop**)」이라 적고 Chillhop 은 그 문서로 넘어간다. 둘을 가르던 swing 30/44 의 근거는 없다. 기타는 선율 악기인데(「cloying piano or **guitar** melodies」) 여태 패턴이 비어 울리지 않았다',
  },
  jazzhop: {
    anchor: 'Jazzhop', members: ['Jazzhop'],
    mel: { density: [5, 7], leap: [0.20, 0.45], contour: 'zigzag', range: [4, 6], degrees: [0, 2, 4, 5, 6], rhythm: 'triplet-feel', repetition: 'low', voicing: 'single' },
    bass: B('walking', 'mid', 'free'), lead: 'keys',
    roles: { keys: 'felt-piano', keys2: 'trumpet', gtr: 'fingerpick', gtr2: 'none' },
    chordType: 'nine', comping: 'ballad_pad',
    pool: ['jazz_aaba', 'jazz_aabb', 'jazbal_abab'], riff: ['jazz_gtr_swing', 'jazz_gtr_comp'], bline: ['bwal_abab', 'bwal_aabb'],
    ev: '1990년대 초 미국 · 2곡', conf: 'low',
    why: '**사전적으로 「jazz hop」 은 1990년대 재즈랩을 가리킨다** — Jazz rap 문서가 「also known as **jazz hop**」이라 적고, 로파이 문서의 다른 이름에는 없다. 그래서 확인된 곡이 둘뿐이고 템포도 98·116 으로 저장소의 85 보다 빨랐다. 베이스는 더블베이스다',
  },

  grime: {
    anchor: 'Grime', members: ['Grime'],
    mel: { density: [6, 8], leap: [0.85, 1.00], contour: 'rise', range: [6, 7], degrees: [0, 2, 4, 7], rhythm: 'offbeat16', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'short', 'locked'), lead: 'keys',
    roles: { keys: 'lead', keys2: 'poly', gtr: 'none', gtr2: 'none' },
    chordType: 'triad', comping: 'disco_stab',
    pool: ['chip_abab', 'chip_aabb', 'chip_aaab'], riff: ['edm_alt', 'edm_build'], bline: ['bhou_aaab', 'bmet_aaab'],
    ev: '2000년대 이후 영국 런던 · 5곡', conf: 'high',
    why: '「generally around **140 beats per minute**」이 문서에 그대로 있다 — 계열에서 템포에 출처가 있는 드문 자리다. 저역은 「dark, guttural basslines」이고 베이스 엔진이 kit 의 square 와 어긋나 있어 맞췄다. 미국 힙합이 아니라 영국 사운드 시스템에서 나왔다',
  },
  afroswing: {
    anchor: 'Afroswing', members: ['Afroswing'],
    mel: { density: [3, 5], leap: [0.20, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 1, 4], rhythm: 'offbeat16', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'mid', 'offset'), lead: 'keys',
    roles: { keys: 'marimba', keys2: 'pad', gtr: 'none', gtr2: 'none' },
    chordType: 'triad', comping: 'trap_pad',
    pool: ['afr_aabb', 'afr_abab', 'car_aabb'], riff: ['highlife_gtr', 'skank_offbeat'], bline: ['bafr_aabb', 'breg_aabb'],
    ev: '2010년대 중반 영국 런던 · 5곡', conf: 'medium',
    why: '**스네어가 셋째 박에 온다** — 프로듀서 Steel Banglez: 「it\'s the snare that comes on the third. In hip-hop it comes on the fourth」. 2·4 백비트는 갈래의 표식을 지운다. 문서가 「largely defined by its **melody rather than a specific tempo**」라 적어 105 BPM 은 근거 있는 값이 아니다',
  },
  ukrap: {
    anchor: 'UK Rap', members: ['UK Rap'],
    mel: { density: [1, 3], leap: [0.25, 0.50], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'high', voicing: 'single' },
    bass: B('root', 'long', 'offset'), lead: 'keys2',
    roles: { keys: 'ep-pad', keys2: 'strings', gtr: 'none', gtr2: 'none' },
    chordType: 'triad', comping: 'ballad_pad',
    pool: ['amb_aaab', 'amb_aaba', 'bal_aabb'], riff: ['arp_folk', 'edm_arp'], bline: ['b808_aabb', 'breg_aaba'],
    ev: '2000년대 이후 영국 · 0곡', conf: 'low',
    why: '**장르가 아니라 우산 이름이다** — 「covers a variety of styles of hip-hop made in the United Kingdom」이고 하위 장르로 Britcore·road rap·UK drill·UK underground 를 든다. 문서에 **템포 수치가 아예 없다.** 팝 계열의 Desi Beats 와 같은 경우라 곡을 채우지 않았다 — 계열의 기본값 자리로만 쓴다',
  },
  roadrap: {
    anchor: 'Road Rap', members: ['Road Rap'],
    mel: { density: [1, 3], leap: [0.25, 0.50], contour: 'fall', range: [3, 5], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'high', voicing: 'single' },
    bass: B('root', 'long', 'offset'), lead: 'keys2',
    roles: { keys: 'pad', keys2: 'strings', gtr: 'none', gtr2: 'none' },
    chordType: 'triad', comping: 'ballad_pad',
    pool: ['amb_aaab', 'amb_aaba', 'bal_aabb'], riff: ['arp_folk', 'edm_arp'], bline: ['b808_aabb', 'breg_aaba'],
    ev: '2000년대 후반 영국 남런던 · 4곡', conf: 'medium',
    why: '어둡고 성기다 — 이 서술은 원래 여기 것이다(앞서 우산 UK Rap 에 붙어 있었다). 그라임과 같은 영국인데 **뿌리가 다르다**: 「a musical style more similar to American gangsta rap than the **sound system influenced** music of grime」. 템포 수치는 출처에 없고 「그라임보다 느리다」는 방향만 있다',
  },

  ukdrill: {
    anchor: 'UK Drill', members: ['UK Drill', 'NY / Bronx Drill'],
    mel: { density: [1, 3], leap: [0.25, 0.50], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'high', voicing: 'single' },
    bass: B('root', 'long', 'offset', false, 'defining'), lead: 'bass',
    roles: { keys: 'strings-piano', keys2: 'choir-strings', gtr: 'none', gtr2: 'none' },
    chordType: 'triad', comping: 'trap_pad',
    pool: ['amb_aaba', 'amb_aabb', 'amb_aaab'], riff: ['edm_arp', 'edm_alt'], bline: ['b808_aaba', 'b808_aaab'],
    ev: '2010년대 후반 영국·미국 · 11곡', conf: 'high',
    why: '**미끄러지는 808 이 선율을 맡는다** — 「Instrumentals often also have a **sliding bass**」. 햇은 셋잇단이 아니라 「**3+3+2** polyrhythm」이고(셋잇단에서 **떠난** 것이 정의다) 템포는 138~151 이다. 브루클린/브롱크스는 이 골격을 그대로 가져오되 808 이 더 일그러진다',
  },
  chidrill: {
    anchor: 'Chicago Drill', members: ['Chicago Drill'],
    mel: { density: [2, 3], leap: [0.55, 0.80], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'high', voicing: 'single' },
    bass: B('root', 'long', 'locked'), lead: 'keys',
    roles: { keys: 'bell', keys2: 'synth-brass', gtr: 'none', gtr2: 'none' },
    chordType: 'triad', comping: 'trap_pad',
    pool: ['trp_aaba', 'trp_abab', 'amb_aabb'], riff: ['edm_arp', 'edm_alt'], bline: ['b808_aaab', 'b808_aabb'],
    ev: '2010년대 미국 시카고 · 4곡', conf: 'medium',
    why: '**미끄러지지 않는다** — 「808s ‘slides’」는 출처가 UK 드릴에만 붙이고 시카고 서술에는 없다(프리셋 자신도 glide 0 이었다). 문서가 드는 성질은 「**synth brass and bell** melodic elements, use of the **crash cymbal**, and **busy snare** drum patterns」라 스네어 한 방과 빈 크래시를 고쳤다',
  },
  sampledrill: {
    anchor: 'Sample Drill', members: ['Sample Drill'],
    mel: { density: [3, 5], leap: [0.10, 0.40], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'offbeat16', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'long', 'locked', false, 'occasional'), lead: 'keys',
    roles: { keys: 'sampled-ep', keys2: 'strings', gtr: 'none', gtr2: 'none' },
    chordType: 'sev', comping: 'trap_pad',
    pool: ['cin_aabb', 'cinbal_aaba', 'cinbal_aabb'], riff: ['soul_prog', 'jazz_gtr_comp'], bline: ['b808_aabb', 'b808_aaab'],
    ev: '2020년대 미국 뉴욕 · 4곡', conf: 'medium',
    why: '**선율을 808 이 아니라 샘플이 맡는다** — 「uses uncleared samples of older records **instead of synthesizers**」(옛 R&B·소울·펑크). 그래서 드릴 무리에서 떼어 냈다. 다만 골격은 브루클린 드릴이라 808 자체는 있어야 한다 — 이 프리셋에 808 이 통째로 빠져 있던 것이 가장 큰 불일치였다. 위키백과는 이 이름을 **Bronx drill 의 별칭**으로 적는다(「Other names: BX drill, sample drill」)',
  },
  jerseydrill: {
    anchor: 'Jersey Drill', members: ['Jersey Drill'],
    mel: { density: [4, 6], leap: [0.15, 0.45], contour: 'zigzag', range: [5, 7], degrees: [0, 2, 1, 4], rhythm: 'offbeat16', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'short', 'free', true), lead: 'keys',
    roles: { keys: 'lead', keys2: 'poly', gtr: 'cut', gtr2: 'none' },
    chordType: 'triad', comping: 'disco_stab',
    pool: ['gar_abab', 'gar_aabb', 'funk_abab'], riff: ['funk_cut', 'edm_alt'], bline: ['b808_aabb', 'bhou_abab'],
    ev: '2020년대 초 미국 뉴저지 · 3곡', conf: 'medium',
    why: '**킥이 박자를 만든다** — 「heavy **tresillo** or shuffled triplet kick patterns」. 저지클럽은 「tempos near **130–140 BPM**」이라 다섯 갈래 중 가장 느려야 하고, 「shuffled」라 스윙이 0 일 수 없다. 「808 bass sounds are commonly employed」인데 808 이 빠져 있었다',
  },

  phonk: {
    anchor: 'Phonk', members: ['Phonk', 'Memphis Rap', 'Drift Phonk'],
    mel: { density: [2, 3], leap: [0.55, 0.80], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'high', voicing: 'single' },
    bass: B('root', 'long', 'locked'), lead: 'keys',
    roles: { keys: 'bell', keys2: 'organ-choir', gtr: 'none', gtr2: 'none' },
    chordType: 'triad', comping: 'trap_pad',
    pool: ['trp_aaab', 'trp_abab', 'amb_aabb'], riff: ['edm_arp', 'edm_alt'], bline: ['b808_aaab', 'bmet_aaab'],
    ev: '1980~2020년대 미국 멤피스·러시아 · 15곡', conf: 'high',
    why: '**카우벨은 폰크 일반이 아니라 드리프트 폰크와 멤피스 랩의 표식이다** — 드리프트 폰크 정의가 「high bass, **TR-808 cowbells**, and distorted sounds」다. 그래서 카우벨 톰 튠이 홀로 내려가 있던 것을 형제와 같게 올렸다. 드리프트 폰크는 2010년대 후반 **러시아**에서 나왔다',
  },
  crunk: {
    anchor: 'Crunk', members: ['Crunk'],
    mel: { density: [1, 3], leap: [0.40, 0.60], contour: 'static', range: [4, 6], degrees: [0, 2, 4], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: B('root', 'short', 'locked'), lead: 'keys',
    roles: { keys: 'lead', keys2: 'poly', gtr: 'none', gtr2: 'none' },
    chordType: 'triad', comping: 'disco_stab',
    pool: ['ant_aabb', 'ant_abab', 'ant_aaba'], riff: ['edm_build', 'funk_cut'], bline: ['b808_aabb', 'bhou_aaab'],
    ev: '2000년대 초 미국 남부 · 6곡', conf: 'high',
    why: '출처가 드는 것은 「layered **keyboard synths**, a drum machine **clapping** rhythm, heavy basslines, and shouting vocals」와 「simple, repeated synthesizer melodies in the form of **ostinato**」다 — **신스 브라스는 어디에도 없다.** 정전 5곡이 101~105 라 150 + 3박 단독 스네어(체감 75)를 2·4 박수로 고쳤다',
  },
  bounce: {
    anchor: 'Bounce', members: ['Bounce'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'offbeat16', repetition: 'high', voicing: 'single' },
    bass: B('root', 'short', 'offset'), lead: 'keys',
    roles: { keys: 'organ', keys2: 'whistle-flute', gtr: 'none', gtr2: 'none' },
    chordType: 'triad', comping: 'disco_stab',
    pool: ['funk_aabb', 'funk_abab', 'car_aabb'], riff: ['funk_cut', 'funk_call'], bline: ['bfun_aabb', 'bfun_abab'],
    ev: '1990년대 이후 미국 뉴올리언스 · 9곡', conf: 'high',
    why: '**정체는 「트리거맨」 브레이크의 반복**이고 출처는 바운스를 크렁크와 잇지 않는다 — 그래서 크렁크 무리에서 떼어 냈다. 확인된 조성 셋이 전부 **장조**라 계열에서 유일하게 장조이고, 템포도 91~99 로 크렁크와 다르다. 악기로는 **휘파람**이 나온다',
  },
  bassmusic: {
    anchor: 'Miami Bass', members: ['Miami Bass', 'Booty Bass'],
    mel: { density: [6, 8], leap: [0.80, 0.95], contour: 'rise', range: [6, 7], degrees: [0, 2, 4, 7], rhythm: 'onbeat', repetition: 'mid', voicing: 'single' },
    bass: B('octave', 'long', 'locked', true), lead: 'keys',
    roles: { keys: 'lead', keys2: 'poly-strings', gtr: 'none', gtr2: 'none' },
    chordType: 'triad', comping: 'disco_stab',
    pool: ['dis_aabb', 'dis_abab', 'dis_aaab'], riff: ['edm_arp', 'funk_cut'], bline: ['bdis_abab', 'bhou_aaab'],
    ev: '1980~1990년대 미국 마이애미 · 7곡', conf: 'high',
    why: '**Booty Bass 는 Miami Bass 의 다른 이름이다** — 문서 첫 문장이 「Miami bass (also known as **booty music or booty bass**)」다. 그런데 둘이 정반대로 설정돼 있었다(게이트 600 대 80, metal 햇 대 noise). 출처의 유일한 저역 서술이 「**sustained** kick drum, heavy bass」라 짧은 게이트가 정반대였다. 힙합 중 유일하게 빠른 정박이고 확인값은 123~136 이다',
  },
  snap: {
    anchor: 'Snap', members: ['Snap'],
    mel: { density: [1, 3], leap: [0.25, 0.50], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'offbeat', repetition: 'high', voicing: 'single' },
    bass: B('root', 'long', 'offset'), lead: 'keys',
    roles: { keys: 'steelpan', keys2: 'bell', gtr: 'none', gtr2: 'none' },
    chordType: 'triad', comping: 'trap_pad',
    pool: ['amb_aaba', 'amb_aaab', 'amb_aabb'], riff: ['edm_arp'], bline: ['b808_aabb', 'breg_aaba'],
    ev: '2000년대 중반 미국 남부 · 7곡', conf: 'high',
    why: '**스네어가 없다** — 편성이 「an 808 bass drum, hi-hat, bass, **snapping**, a main groove and a vocal track」이다. 대표 음색은 벨이 아니라 **스틸팬**(「Crank That」)과 **휘파람**이고, 75 BPM 은 확인된 체감 64~88 의 한가운데라 그대로 뒀다. 여백이 스타일인데 햇만 가장 촘촘하던 것을 성기게 고쳤다',
  },

  gfunk: {
    anchor: 'G-Funk', members: ['G-Funk'],
    mel: { density: [4, 6], leap: [0.05, 0.35], contour: 'arch', range: [4, 6], degrees: [0, 2, 4, 5], rhythm: 'offbeat', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'mid', 'offset', false, 'occasional'), lead: 'keys',
    roles: { keys: 'portamento-lead', keys2: 'choir', gtr: 'cut', gtr2: 'none' },
    chordType: 'sev', comping: 'funk_16th_stab',
    pool: ['funk_abab', 'funk_aabb', 'disfun_abab'], riff: ['funk_cut', 'funk_groove'], bline: ['bfun_abab', 'bfun_aabb'],
    ev: '1990년대 초 미국 서부 · 4곡', conf: 'medium',
    why: '**정의문이 리드를 그대로 적는다** — 「a high-pitched **portamento** saw wave synthesizer lead」. 템포도 「between **90 and 100 BPM**」이라 95 가 정확히 맞는다(확인값 92·94.5·95.3). 정의에 「background **female vocals**」가 있어 2번 건반을 현에서 합창으로 옮겼다. 무그와 swing 30 은 **출처가 없다** — 반대 증거도 없어 그대로 두고 기록만 한다',
  },
  hyphy: {
    anchor: 'Hyphy', members: ['Hyphy', 'Jerk'],
    mel: { density: [4, 6], leap: [0.15, 0.45], contour: 'zigzag', range: [4, 6], degrees: [0, 2, 4, 1], rhythm: 'offbeat16', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'short', 'locked'), lead: 'keys',
    roles: { keys: 'supersaw-pluck', keys2: 'poly-strings', gtr: 'none', gtr2: 'none' },
    chordType: 'sev', comping: 'disco_stab',
    pool: ['gar_aabb', 'gar_abab', 'funk_aaab'], riff: ['edm_alt', 'funk_cut'], bline: ['bhou_abab', 'bfun_abab'],
    ev: '2000년대 미국 서부 · 9곡', conf: 'medium',
    why: '출처가 드는 악기는 「**Roland TR-808** drum samples」와 「**synth-led** staccato beats」다 — 무그는 G-Funk 의 표식이지 여기 것이 아니어서 808 로 바꿨다(대표곡 둘이 크렁크 프로듀서 작업이다). 저크는 하이피 태그를 함께 단 곡이 많아 같은 무리에 둔다 — 다만 위키백과에는 **저크가 둘**이고(2009 LA · 2020 뉴욕) 이 프리셋은 2009년 쪽이다',
  },

  cloud: {
    anchor: 'Cloud Rap', members: ['Cloud Rap'],
    mel: { density: [1, 3], leap: [0.25, 0.50], contour: 'static', range: [3, 5], degrees: [0, 2, 4], rhythm: 'onbeat', repetition: 'high', voicing: 'single' },
    bass: B('root', 'long', 'free'), lead: 'keys2',
    roles: { keys: 'pad', keys2: 'choir', gtr: 'none', gtr2: 'none' },
    chordType: 'add9', comping: 'ballad_pad',
    pool: ['amb_aaba', 'amb_aabb', 'bal_aaba'], riff: ['arp_folk', 'edm_arp'], bline: ['breg_aaba', 'b808_aabb'],
    ev: '2010년대 초 미국·스웨덴 · 5곡', conf: 'high',
    why: '정의가 「ethereal, psychedelic and soft samples as well as the inclusion of **trap style drums**」다 — 4분 하이햇 네 번으로는 트랩이 아니라 그 자리를 16분으로 고쳤다. 리버브는 이미 맞다(「reverb-heavy beats」). 정의의 나머지 절반인 「**chopped**·**distorted** samples」는 이 도구로 낼 수 없어 기록만 한다',
  },
  emorap: {
    anchor: 'Emo Rap', members: ['Emo Rap', 'SoundCloud Rap'],
    mel: { density: [1, 3], leap: [0.20, 0.45], contour: 'arch', range: [3, 5], degrees: [0, 2, 4, 1], rhythm: 'offbeat16', repetition: 'mid', voicing: 'single' },
    bass: B('root', 'mid', 'locked'), lead: 'gtr',
    roles: { keys: 'pad', keys2: 'strings-glocken', gtr: 'arp-crunch', gtr2: 'none' },
    chordType: 'sev', comping: 'ballad_pad',
    pool: ['bal_aaba', 'bal_aabb', 'bal_abab'], riff: ['arp_folk', 'rock_drive'], bline: ['b808_aaba', 'brock_aabb'],
    ev: '2010년대 후반 인터넷 · 9곡', conf: 'high',
    why: '「fuses **trap music-style beats** with sing-rapping vocals」이고 typical instruments 에 **guitar** 가 있다 — 기타가 정체성이라 클라우드 랩과 갈린다. 템포는 곡 문서가 준다(XO Tour Llif3 155 · Lucid Dreams 84=체감 168)라 140 은 어느 쪽에도 닿지 않았다. 화성은 7화음이다(Gmaj7—Em—Bm—A). 사운드클라우드 랩은 기타 대신 **왜곡**이 정체성이다(「lack of production」)',
  },
  brphonk: {
    anchor: 'Brazilian Phonk', members: ['Brazilian Phonk'],
    mel: { density: [3, 5], leap: [0.15, 0.45], contour: 'static', range: [4, 6], degrees: [0, 2, 4], rhythm: 'offbeat16', repetition: 'high', voicing: 'single' },
    bass: B('root', 'long', 'locked'), lead: 'keys',
    roles: { keys: 'bell', keys2: 'organ', gtr: 'none', gtr2: 'none' },
    chordType: 'triad', comping: 'trap_pad',
    pool: ['lat_abab', 'lat_aabb', 'car_aabb'], riff: ['latin_montuno', 'edm_arp'], bline: ['blat_abab', 'b808_aaab'],
    ev: '2020년대 브라질 · 4곡', conf: 'medium',
    why: '골격은 **탐보르장**(「Bum-Cha-Cha」)이고 저장소의 킥이 그 모양과 맞는다. 다만 이름에 주의가 붙는다 — 위키백과가 funk automotivo 를 「**mislabeled** as ‘Brazilian phonk’ outside of Brazil」이라 적는다. 문서가 「tom = 카우벨」이라 해 놓고 프리셋만 synth 였던 것을 맞췄고, 스틸팬은 출처가 없어 뺐다(카리브 악기다)',
  },
};
