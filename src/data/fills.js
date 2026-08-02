/* 필인 — 루프 끝을 채우는 변주
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다.

   ── 구조 ──
   size : S = 작은 필인(4마디 프레이즈 끝), L = 큰 필인(16마디 섹션 끝).
          실제 곡은 두 단이 함께 돕니다 — 4마디마다 살짝 흔들고,
          16마디째에 크게 쳐서 다음 구간으로 넘깁니다.
          한 종류만 반복하면 "필인이 아니라 패턴의 일부" 로 들립니다.
   len  : 루프 16스텝 중 **마지막 몇 스텝**을 대체하는지. 2·4·8·16
   pat  : 트랙 id → len 길이의 패턴 문자열. X=강세, x=보통, -=쉼
          여기 안 적힌 트랙은 필인 구간 동안 **쉽니다**.
          필인은 원래 "평소 패턴을 멈추고 다르게 치는 것"이라 그게 맞습니다.
   eng  : 그 필인 동안만 쓸 음색. 상태를 바꾸지 않고 발음할 때만 넘깁니다
          (림롤은 스네어가 rim 이어야 림롤이 됩니다)

   베이스·건반·기타는 건드리지 않습니다. 실제 밴드도 필인은 드럼만 칩니다. */
'use strict';

const FILLS = {
  /* ── 스네어 계열 ── */
  snare16   :{label:'스네어 16분 롤', size:'S', len:4,
              pat:{snare:'xxxX'}},
  snare8    :{label:'스네어 가속',    size:'L', len:8,
              pat:{snare:'x-x-xxxX', chat:'x-x-----'}},
  snarebuild:{label:'스네어 빌드업',  size:'L', len:16,
              pat:{snare:'--x---x-x-xxxxxX', chat:'x-x-x-x-x-x-x-x-'}},

  /* ── 톰 계열 ── */
  tomroll   :{label:'톰 롤',          size:'S', len:4,
              pat:{tom:'xxxX'}},
  tomsnare  :{label:'톰↔스네어',      size:'L', len:8,
              pat:{snare:'x-x-----', tom:'----xxxX'}},
  tomlong   :{label:'톰 긴 롤',       size:'L', len:8,
              pat:{tom:'--xxxxxX', kick:'X-------'}},

  /* ── 킥 계열 ── */
  kickroll  :{label:'킥 연타',        size:'S', len:4,
              pat:{kick:'XXXX'}},
  doublekick:{label:'더블킥',         size:'L', len:8,
              pat:{kick:'xxxxxxxX', ohat:'-------x'}},

  /* ── 하이햇·클랩 (일렉트로닉) ── */
  hatstutter:{label:'햇 스터터',      size:'S', len:4,
              pat:{chat:'xxxx', snare:'---X'}},
  clapbuild :{label:'클랩 빌드',      size:'L', len:8,
              pat:{clap:'x-x-xxxx', chat:'xxxxxxxx'}},

  /* ── 타악기 (라틴·아프리카) ── */
  percflurry:{label:'타악기 몰이',    size:'L', len:8,
              pat:{perc:'xxxxxxxX', tom:'--x---x-'}},
  congaroll :{label:'콩가 롤',        size:'S', len:8,
              pat:{tom:'x-xxx-xX', perc:'--x---x-'}},

  /* ── 재즈·펑크 ── */
  rimroll   :{label:'림 롤',          size:'S', len:8,
              pat:{snare:'x-xx-xxX'}, eng:{snare:'rim'}},
  ghost     :{label:'고스트 노트',    size:'S', len:8,
              pat:{snare:'x--x-x-X', kick:'X-------'}},
  brushswirl:{label:'브러시 스월',    size:'S', len:8,
              pat:{snare:'xxxxxxxx'}, eng:{snare:'brush'}},

  /* ── 브레이크·드롭 ── */
  breakfill :{label:'브레이크',       size:'L', len:8,
              pat:{kick:'X--x--X-', snare:'--x--x-X', ohat:'------x-'}},
  drop      :{label:'드롭 (한 방)',   size:'S', len:4,
              pat:{kick:'---X', ohat:'---x'}},
  silence   :{label:'무음',           size:'S', len:4,
              pat:{}},
};
const FILL_NAMES = Object.keys(FILLS);

/* ── 하위분기 → 어울리는 필인 ──
   패턴 문서(patterns/00-archetypes.md)의 계열 구분을 따릅니다.
   여기 없는 하위분기는 계열 기본값으로 떨어집니다. */
const FILL_KIT = {
  '뿌리'                   :['snare16','tomroll','tomsnare','breakfill'],
  'Hard Rock'              :['tomroll','tomlong','snare16','doublekick'],
  'Metal'                  :['kickroll','doublekick','tomlong','snare16'],
  'Punk'                   :['snare16','kickroll','tomroll'],
  'Post-punk 계보'         :['snare16','tomsnare','breakfill'],
  'Alternative'            :['tomroll','snare16','tomsnare'],
  'Psychedelic · Krautrock':['tomlong','tomroll','snare16'],
  'Soft Rock · AOR 계보'   :['snare16','tomsnare','ghost'],

  'Teen Pop · Indie Pop'   :['snare16','clapbuild','tomroll'],
  'Synth-pop 계보'         :['clapbuild','hatstutter','drop'],
  'Dance-pop 계보'         :['clapbuild','snarebuild','drop'],
  '지역 팝'                :['snare16','tomsnare','clapbuild'],
  '하이브리드 · 인터넷 장르':['hatstutter','drop','silence'],

  '뿌리 · 골든에이지'      :['snare16','breakfill','ghost'],
  'Trap 계열'              :['hatstutter','drop','snarebuild'],
  'Drill'                  :['hatstutter','drop','snare16'],
  'Southern'               :['hatstutter','snarebuild','drop'],
  'West Coast'             :['snare16','ghost','breakfill'],
  'Cloud · Emo 계열'       :['hatstutter','silence','drop'],
  'Lo-fi'                  :['ghost','snare16','brushswirl'],
  'UK 계열'                :['hatstutter','breakfill','drop'],
  '지역화 파생'            :['hatstutter','drop','snarebuild'],

  'Funk'                   :['ghost','snare16','tomsnare'],
  'Disco'                  :['tomsnare','snare16','clapbuild'],
  'Soul'                   :['ghost','snare16','tomsnare'],
  'Contemporary R&B'       :['ghost','hatstutter','snare16'],
  'Electro'                :['clapbuild','hatstutter','drop'],

  'House 계열'             :['clapbuild','drop','snarebuild'],
  'Techno 계열'            :['snarebuild','drop','silence'],
  'Trance 계열'            :['snarebuild','clapbuild','drop'],
  'Breakbeat 계열'         :['breakfill','snare16','hatstutter'],
  'Dubstep · Bass Music'   :['snarebuild','drop','silence'],
  'Hardcore 계열'          :['kickroll','snarebuild','drop'],
  'Downtempo · Ambient · Retro':['ghost','brushswirl','silence'],

  'Bebop 계보'             :['rimroll','brushswirl','ghost'],
  'Latin Jazz'             :['percflurry','congaroll','rimroll'],
  'Fusion 계보'            :['ghost','tomsnare','snare16'],
  '현대 갈래'              :['rimroll','ghost','brushswirl'],
  '현대 크로스오버'        :['ghost','hatstutter','snare16'],

  'Blues'                  :['snare16','tomsnare','ghost'],
  'Country'                :['snare16','brushswirl','tomsnare'],
  'Folk'                   :['brushswirl','ghost','snare16'],
  'Gospel · 지역 장르'     :['ghost','snare16','tomsnare'],
  '루츠와의 교차'          :['snare16','tomsnare','brushswirl'],

  '쿠바'                   :['congaroll','percflurry','tomsnare'],
  '푸에르토리코 · 도미니카':['percflurry','congaroll','snare16'],
  '멕시코'                 :['percflurry','tomsnare','snare16'],
  '브라질'                 :['percflurry','congaroll','tomroll'],
  '콜롬비아'               :['percflurry','congaroll','snare16'],
  '아르헨티나 · 남미 남부' :['tomsnare','percflurry','ghost'],

  'Reggae 갈래'            :['rimroll','ghost','tomsnare'],
  '자메이카'               :['rimroll','snare16','tomsnare'],
  'Dancehall 계보'         :['hatstutter','drop','snarebuild'],
  '트리니다드 · 바베이도스':['percflurry','snare16','breakfill'],
  '프랑스어권 카리브'      :['percflurry','congaroll','tomsnare'],

  '서아프리카'             :['percflurry','congaroll','tomlong'],
  '동아프리카'             :['percflurry','congaroll','snare16'],
  '중앙아프리카'           :['congaroll','percflurry','tomroll'],
  '남아프리카'             :['percflurry','drop','hatstutter'],

  '남아시아'               :['percflurry','tomroll','snare16'],
  '동아시아'               :['snare16','clapbuild','tomsnare'],
  '서아시아 · 지중해'      :['percflurry','tomroll','snare16'],
  '동유럽 · 발칸'          :['percflurry','snare16','tomsnare'],
  '북아프리카'             :['percflurry','congaroll','tomroll'],
};

/* 하위분기가 표에 없을 때 쓰는 계열 기본값 */
const FILL_KIT_CAT = {
  A:['snare16','tomroll','tomsnare'],
  B:['snare16','clapbuild','tomroll'],
  C:['hatstutter','snarebuild','drop'],
  D:['ghost','snare16','tomsnare'],
  E:['clapbuild','snarebuild','drop'],
  F:['rimroll','brushswirl','ghost'],
  G:['snare16','brushswirl','tomsnare'],
  H:['percflurry','congaroll','snare16'],
  I:['rimroll','percflurry','snare16'],
  J:['percflurry','congaroll','tomroll'],
  K:['percflurry','snare16','tomroll'],
  X:['snare16','tomroll'],
};

/** 지금 걸린 프리셋에 어울리는 필인 이름 목록.
    size 를 주면 그 크기만 남깁니다. 장르 목록에 그 크기가 하나도 없으면
    전체에서 같은 크기를 가져옵니다 — 빈 목록이면 필인이 안 나오기 때문. */
function fillPoolFor(name, size){
  const base = FILL_KIT[PRESET_SUB[name]]
            || FILL_KIT_CAT[PRESET_CAT[name]]
            || ['snare16','tomroll'];
  if(!size) return base;
  const hit = base.filter(n => FILLS[n] && FILLS[n].size === size);
  return hit.length ? hit : FILL_NAMES.filter(n => FILLS[n].size === size);
}
