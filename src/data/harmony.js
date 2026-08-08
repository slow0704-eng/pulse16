/* 화성 진행 레이어 — 마디 단위 코드 진행 + 컴핑 리듬
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다.
   로드 위치: src/data/melody.js 다음, src/core/dom.js 앞.

   ── 왜 이 파일이 필요한가 ──
   `src/seq/sequencer.js` 의 voicesAt() 은 선율 모드에서
   `barOf(melNow)[i]` 로 P.keys 를 통째로 대체한다. 프리셋의 화성 패턴은
   1마디짜리(patterns/00-harmony.md)라 16마디를 도는 동안 진행이 없었다.
   `SCALES[scaleName][d]` 로 도수→반음을 바로 매핑하는 구조라 "지금 마디의
   화음" 이라는 상태 자체가 코드 어디에도 없었다 — 그래서 레이어를 하나
   더 얹는다. 근거는 melody/01-harmony.md §4(대표 진행)·§5(케이던스)와
   그 문서의 "장르별 기본 진행" 표다.

   ── 이름 규칙 ──
   진행 데이터는 **도수**로 적는다. 절대음이 아니라 근음(rootNote)·
   스케일(scaleName) 노브를 따라간다. 이름에 아티스트·앨범을 넣지
   않는다 — 파생된 서술 속성만 쓴다(이 저장소의 원칙, README 참고).

   ⚠ `id="harm"` 슬라이더(들뜸 노브)가 이미 있다(ARCHITECTURE.md).
   최상위 함수/변수 이름을 `harm`·`prog`·`comp` 처럼 짧게 짓지 않고
   시퀀서 담당(D)과 합의한 시그니처(PROG·PROG_NAMES·progPoolFor·
   chordDegAt·chordSemis·snapDeg·COMP·compPoolFor)를 그대로 쓴다. */
'use strict';

/* ═══ §1  화성 진행 (PROG) ═══════════════════════════════════
   도수 배열 하나가 "그 진행의 마디별 근음" 이다. chordDegAt() 이
   bar % degs.length 로 되풀이한다 — degs.length 가 4 면 16마디에 4번,
   8 이면 2번, 16 이면 1번 돈다. 선율 라이브러리가 16·32·64마디이고
   MEL_BARS=16 격자 위에서 돌기 때문에 길이는 반드시 4·8·16 중 하나로
   맞춘다(8·64는 16의 약수/배수, 4는 16의 약수).

   로마숫자는 01-harmony.md §2 표 기준(Major). 마이너 스케일에서는
   같은 도수가 i·ii°·III·iv·v·VI·VII 로 읽힌다 — 도수 자체는 그대로다.

   힙합·펑크·카리브는 **진행이 성긴 것이 정답**이다(01-harmony.md §4
   "펑크와 힙합에 화성 진행이 거의 없는 것은 빈약해서가 아닙니다").
   그래서 이 계열 항목 중 일부는 일부러 변화가 적거나 0이다 —
   버그가 아니라 근거 있는 설계다. */
const PROG = {
  /* ── A. Rock — "모달 2코드 · 블루스 하강 · 12마디" (01-harmony.md §4 표) ── */
  modal_i_iv    :{label:'모달 2코드(i-IV)',        cat:'A', degs:[0,3,0,3]},
  modal_i_vii   :{label:'모달 2코드(i-VII)',        cat:'A', degs:[0,6,0,6]},
  blues_descend :{label:'블루스 하강(i-VII-VI-V)',  cat:'A', degs:[0,6,5,4]},

  /* ── B. Pop — "4코드 팝 · 감성 4코드 · 캐논" ── */
  pop_four       :{label:'4코드 팝(I-V-vi-IV)',        cat:'B', degs:[0,4,5,3]},
  pop_sentimental:{label:'감성 4코드(vi-IV-I-V)',       cat:'B', degs:[5,3,0,4]},
  pop_50s        :{label:'50년대 진행(I-vi-IV-V)',      cat:'B', degs:[0,5,3,4]},
  pop_turn       :{label:'턴어라운드(I-vi-ii-V)',       cat:'B', degs:[0,5,1,4]},
  pop_canon      :{label:'캐논 진행(I-V-vi-iii-IV-I-IV-V)', cat:'B', degs:[0,4,5,2,3,0,3,4]},
  /* 16마디 정형 — §5 케이던스 표를 그대로 구현한 것.
     4마디 끝 반종지(→V) · 8마디 끝 정격종지(V→I) ·
     12마디 끝 위종지(V→vi) · 16마디 끝 정격종지(V→I) */
  pop_form16     :{label:'팝 16마디 정형(질문-대답-이탈-종결)', cat:'B',
                    degs:[0,3,5,4, 5,3,4,0, 3,0,4,5, 5,3,4,0]},

  /* ── C. Hip Hop — "2코드 반복(0·5 또는 0·3) — 진행보다 루프" ── */
  hh_loop_vi :{label:'2코드 반복(i-VI)',       cat:'C', degs:[0,0,5,5]},
  hh_loop_iv :{label:'2코드 반복(i-iv)',       cat:'C', degs:[0,0,3,3]},
  trap_minor :{label:'단조 진행(i-iv-VII-i)',  cat:'C', degs:[0,3,6,0]},

  /* ── D. R&B·Funk — "1코드 또는 도리안 뱀프 — 화성보다 리듬" ── */
  funk_one   :{label:'1코드(리듬이 화성을 대신)', cat:'D', degs:[0,0,0,0]},
  funk_vamp8 :{label:'8마디 원코드+서브도미넌트', cat:'D', degs:[0,0,0,0,3,3,0,0]},
  rnb_ii_v   :{label:'vi-ii-V-I',                 cat:'D', degs:[5,1,4,0]},

  /* ── E. Electronic — "감성 4코드 · 2코드 반복" ── */
  edm_i_v    :{label:'2코드 반복(i-V)', cat:'E', degs:[0,4,0,4]},
  edm_riser8 :{label:'8마디 빌드업',    cat:'E', degs:[0,0,5,5,3,3,4,4]},

  /* ── F. Jazz — "ii-V-I · 순환 진행" ── */
  jazz_251   :{label:'ii-V-I',                      cat:'F', degs:[1,4,0,0]},
  jazz_circle:{label:'순환 진행(circle of fifths)', cat:'F', degs:[0,3,6,2,5,1,4,0]},

  /* ── G. Roots — "12마디 블루스 · I-IV-V" ──
     12마디는 4·8·16 규칙에 안 맞아 8마디(단축형)·16마디(태그 포함)로 옮겼다.
     16마디판은 01-harmony.md 의 12마디 도수열(0×4·3×2·0×2·4·3·0·4)에
     4마디 태그(4·3·0·4 되풀이)를 붙인 것 — 재즈·블루스 세션에서
     흔한 "턴어라운드 반복" 관례다. */
  roots_ivv   :{label:'I-IV-V-I',       cat:'G', degs:[0,3,4,0]},
  blues_8bar  :{label:'8마디 블루스',   cat:'G', degs:[0,0,3,3,0,4,3,0]},
  blues_16bar :{label:'16마디 블루스(태그 포함)', cat:'G',
                 degs:[0,0,0,0,3,3,0,0,4,3,0,4,4,3,0,4]},

  /* ── H. Latin — "안달루시아 · ii-V-I · 2코드 몬투노" ── */
  latin_andalusian:{label:'안달루시아 진행(vi-V-IV-III)', cat:'H', degs:[5,4,3,0]},
  latin_vamp8     :{label:'몬투노 8마디(i-V 반복)',        cat:'H', degs:[0,0,4,4,0,0,4,4]},

  /* ── I. Caribbean — "1~2코드 — 스킹크가 리듬을 맡음" ── */
  reggae_turn:{label:'로커스 진행(i-iv-i-V)', cat:'I', degs:[0,3,0,4]},
  ska_walkup :{label:'스카 상행 워크업(I-ii-iii-IV)', cat:'I', degs:[0,1,2,3]},

  /* ── J. African — "2코드 순환 — 반복 위에 폴리리듬" ── */
  afro_cycle :{label:'2코드 순환 변형(i-VI-i-iv)', cat:'J', degs:[0,5,0,3]},
  afro_cycle8:{label:'8마디 순환',                 cat:'J', degs:[0,0,5,5,0,0,3,3]},

  /* ── K. 기타 지역 — 안달루시아·모달 진행은 지중해·발칸 계열에서도 흔하다 ── */
  flamenco_phryg8:{label:'안달루시아 8마디(플라멩코풍)', cat:'K', degs:[5,4,3,0,5,4,3,0]},
  balkan_cycle   :{label:'발칸 순환(브라스 밴드풍)',     cat:'K', degs:[0,3,5,3]},
};
const PROG_NAMES = Object.keys(PROG);

/* ── 하위분기 → 어울리는 진행 (blinePoolFor() 와 같은 방식) ──
   BLINE_KIT 과 granularity 를 맞췄다 — 전부 다 채우지는 않지만
   장르 문서에서 화성적 정체성이 뚜렷한 하위분기는 짚었다. */
const PROG_KIT = {
  'Metal':['modal_i_iv','blues_descend'],
  'Hard Rock':['modal_i_iv','blues_descend'],
  'Punk':['modal_i_iv','hh_loop_iv'],
  'Alternative':['modal_i_vii','pop_50s'],
  'Post-punk 계보':['modal_i_iv','modal_i_vii'],
  'Bebop 계보':['jazz_251','jazz_circle'],
  'Latin Jazz':['jazz_251','latin_vamp8'],
  'Fusion 계보':['jazz_circle','rnb_ii_v'],
  '현대 갈래':['jazz_251','pop_turn'],
  'Funk':['funk_one','funk_vamp8'],
  'Disco':['pop_sentimental','edm_riser8'],
  'Soul':['rnb_ii_v','pop_turn'],
  'Contemporary R&B':['rnb_ii_v','pop_sentimental'],
  'House 계열':['edm_i_v','edm_riser8'],
  'Techno 계열':['edm_i_v','modal_i_iv'],
  'Trance 계열':['edm_riser8','pop_sentimental'],
  'Trap 계열':['trap_minor','hh_loop_iv'],
  'Drill':['trap_minor'],
  'Southern':['hh_loop_vi','trap_minor'],
  'Lo-fi':['jazz_251','rnb_ii_v'],
  'Country':['roots_ivv','pop_50s'],
  'Folk':['roots_ivv','modal_i_iv'],
  'Blues':['blues_8bar','blues_16bar'],
  'Gospel · 지역 장르':['rnb_ii_v','pop_turn'],
  'Reggae 갈래':['reggae_turn','modal_i_iv'],
  '자메이카':['ska_walkup','reggae_turn'],
  '쿠바':['latin_vamp8','jazz_251'],
  '브라질':['pop_sentimental','latin_andalusian'],
  '멕시코':['roots_ivv','latin_andalusian'],
  '콜롬비아':['latin_vamp8','modal_i_iv'],
  '서아프리카':['afro_cycle','afro_cycle8'],
  '동아프리카':['afro_cycle8','modal_i_iv'],
};
const PROG_KIT_CAT = {
  A:['modal_i_iv','blues_descend','modal_i_vii'],
  B:['pop_four','pop_sentimental','pop_50s','pop_turn'],
  C:['hh_loop_vi','hh_loop_iv','trap_minor'],
  D:['funk_one','rnb_ii_v','funk_vamp8'],
  E:['edm_i_v','edm_riser8','pop_sentimental'],
  F:['jazz_251','jazz_circle'],
  G:['roots_ivv','blues_8bar','blues_16bar'],
  H:['latin_andalusian','latin_vamp8','jazz_251'],
  I:['reggae_turn','ska_walkup','modal_i_iv'],
  J:['afro_cycle','afro_cycle8','modal_i_iv'],
  K:['flamenco_phryg8','balkan_cycle','latin_andalusian'],
  X:['pop_four'],
};

/** 프리셋 이름 → 어울리는 진행 이름 배열.
    blinePoolFor() 와 같은 순서(하위분기 우선 → 계열 → 기본값)지만,
    **절대 빈 배열을 주지 않는다** — 메탈·펑크처럼 건반을 꺼 두는
    계열도 진행 데이터 자체는 갖는다(호출부가 빈 배열로 인덱싱해
    깨지지 않도록). 건반을 낼지 말지는 TONE_KIT.off 가 정한다. */
function progPoolFor(name){
  const sub = PROG_KIT[PRESET_SUB[name]];
  if(sub) return sub;
  return PROG_KIT_CAT[PRESET_CAT[name]] || ['pop_four'];
}

/** p 는 PROG 의 항목. bar 는 0부터. degs.length 로 되풀이한다 —
    barOf() 가 rows.length 로 되풀이하는 것과 같은 관례다. */
function chordDegAt(p, bar){
  return p.degs[bar % p.degs.length];
}

/** 화음 구성음을 스케일 토닉 기준 반음 오프셋 배열로 준다.
    시퀀서는 `kbase + semi` 로 바로 쓴다(kbase = keysOct+rootNote+knob('ksemi')).

    TRIAD(rootDeg) 로 화음 구성 도수의 비트마스크를 얻고(pattern-codec.js —
    r·r+2·r+4, 인덱스 7 을 넘으면 −7 자리바꿈), 켜진 도수를 낮은 것부터
    SCALES 로 반음화한다. keysVoice 가 건반 비트마스크를 그릴 때 쓰는
    루프(`for d=0..ROWS if(m&(1<<d))`)와 **같은 오름차순**이라, 자리바꿈이
    일어나도(예: rootDeg=5 → 도수 {5,7,2}) 기존 건반 화음이 들리는 순서와
    어긋나지 않는다.

    5음계(펜타토닉)에서는 TRIAD 가 3화음이 아니라 4도 쌓기가 된다
    (pattern-codec.js TRIAD 주석). 여기서도 그대로 반영된다 — 막지 않는다.
    힙합·록에서는 이쪽이 오히려 정확하다(melody/01-harmony.md §2).

    예: chordSemis(3,'Natural Minor') → TRIAD(3)={3,5,7} →
        [SCALES['Natural Minor'][3], [5], [7]] = [5,8,12]. */
function chordSemis(rootDeg, scaleName){
  const scale = SCALES[scaleName] || SCALES['Natural Minor'];
  const mask = TRIAD(((rootDeg % 8) + 8) % 8);
  const out = [];
  for(let d=0; d<ROWS; d++) if(mask & (1<<d)) out.push(scale[d]);
  return out;
}

/** 선율 도수를 그 마디 화음의 구성음으로 스냅한다.
    이미 화음음이면 그대로 둔다. 화음 밖이면 가장 가까운 구성음으로
    당기되, 거리가 너무 멀면(=스냅이 오히려 선율을 망가뜨리면) 원래
    도수를 그대로 돌려준다 — "선택적" 스냅이다.

    펜타토닉은 8칸 그리드 안에 실음이 5개뿐이라 이웃 화음음까지의
    도수 간격이 7음계보다 넓다. 그래서 펜타토닉만 허용 거리를 3으로
    늘렸다 — 7음계와 같은 거리(2)를 쓰면 스냅이 걸릴 자리가 거의
    없어져 함수가 있으나 마나 해진다. */
function snapDeg(deg, rootDeg, scaleName){
  const mask = TRIAD(((rootDeg % 8) + 8) % 8);
  if(mask & (1<<deg)) return deg;                 // 이미 화음음
  let best = deg, bestDist = Infinity;
  for(let d=0; d<ROWS; d++){
    if(!(mask & (1<<d))) continue;
    const dist = Math.abs(d-deg);
    if(dist < bestDist){ bestDist = dist; best = d; }
  }
  const maxDist = scaleName==='Minor Pentatonic' ? 3 : 2;
  return bestDist <= maxDist ? best : deg;         // 너무 멀면 스냅을 포기
}


/* ═══ §2  컴핑(반주 화음) 리듬 (COMP) ═══════════════════════════
   chordSemis() 는 "무슨 음" 만 준다. "언제 치는지" 가 없으면 컴핑이
   아니라 그냥 롱톤이다. 표기는 기존 관례(패턴 코덱)를 그대로 쓴다.
     X = 강세, x = 보통, - = 쉼
   여기 적힌 X/x 는 세기가 아니라 **어느 스텝에 화음을 치는지**의
   자리표시다. 실제 벨로시티는 D 쪽 시퀀서 코드가 정한다(추정).

   근거는 patterns/00-harmony.md 의 1마디 아키타입 이름과 리듬 모양,
   melody/00-analysis.md 의 계열별 리듬 서술이다. rows 가 1개면 매
   마디 같은 리듬(대개의 컴핑), 2개면 마디를 번갈아 쓴다(몬투노처럼
   엇박이 마디마다 미묘하게 바뀌는 스타일). */
const COMP = {
  /* ── A. Rock ── */
  rock_8th     :{label:'록 8분 스트럼',     cat:'A', rows:['X-x-X-x-X-x-X-x-']},
  punk_quarter :{label:'파워코드 4분 강타', cat:'A', rows:['X---X---X---X---']},

  /* ── B. Pop ── */
  pop_pulse    :{label:'팝 8분 펄스',       cat:'B', rows:['X-x-X-x-X-x-X-x-']},
  ballad_pad   :{label:'발라드 온음표 패드', cat:'B', rows:['X---------------']},

  /* ── C. Hip Hop ── */
  trap_pad     :{label:'트랩 패드(랩 자리 비움)', cat:'C', rows:['X---------------']},

  /* ── D. R&B·Funk — funk_chank(patterns/00-harmony.md) 의 16분 자리를 그대로 옮김 ── */
  funk_16th_stab:{label:'펑크 16분 스탭',    cat:'D', rows:['--X-X---x-X-X---']},
  gospel_swell  :{label:'가스펠 온비트 스웰', cat:'D', rows:['X---X---X---X---']},
  disco_stab    :{label:'디스코 오프비트 스탭', cat:'D', rows:['--X---X---X---X-']},

  /* ── E. Electronic — house_skank 의 엇박 자리(patterns/00-harmony.md) ── */
  house_offbeat:{label:'하우스 오프비트 스탭', cat:'E', rows:['--x---x---x---x-']},
  techno_pulse :{label:'테크노 8분 펄스',      cat:'E', rows:['x-x-x-x-x-x-x-x-']},
  breaks_stab  :{label:'브레이크비트 스탭',    cat:'E', rows:['X---X-----X---X-']},

  /* ── F. Jazz — jazz_comp 의 불규칙 자리(patterns/00-harmony.md) ── */
  jazz_comp    :{label:'재즈 컴핑(불규칙 스탭)', cat:'F', rows:['--x----x--X---x-']},

  /* ── G. Roots ── */
  country_strum:{label:'컨트리 스트럼',        cat:'G', rows:['X-x-X-x-X-x-X-x-']},

  /* ── H. Latin — montuno 는 마디마다 엇박이 미세하게 다르다(살사 특징) ── */
  montuno      :{label:'몬투노 엇박',      cat:'H', rows:['--x-x---x-x-----','--x-x---x-x---x-']},
  bossa_comp   :{label:'보사노바 싱코페 컴핑', cat:'H', rows:['X--x--x-X--x--x-']},
  tango_marcato:{label:'탱고 마르카토',     cat:'H', rows:['X---X---X---X---']},

  /* ── I. Caribbean — reggae_skank 의 뒷박(patterns/00-harmony.md) ── */
  reggae_skank :{label:'레게 뒷박 스캥크',   cat:'I', rows:['--X---X---X---X-']},
  dancehall_stab:{label:'댄스홀 싱코페 스탭', cat:'I', rows:['--X---X--X----X-']},

  /* ── J. African ── */
  african_pulse:{label:'아프리칸 8분 펄스', cat:'J', rows:['x-x-x-x-x-x-x-x-']},

  /* ── K. 기타 지역 ── */
  balkan_brass :{label:'발칸 브라스 강박',  cat:'K', rows:['X---X---X---X---']},
};
const COMP_NAMES = Object.keys(COMP);

const COMP_KIT = {
  'Hard Rock':['rock_8th'], 'Alternative':['rock_8th'],
  'Punk':['punk_quarter'], 'Metal':['punk_quarter'],
  'Funk':['funk_16th_stab'], 'Disco':['disco_stab'], 'Soul':['gospel_swell'],
  'Contemporary R&B':['funk_16th_stab','gospel_swell'],
  'Gospel · 지역 장르':['gospel_swell'],
  'House 계열':['house_offbeat'], 'Techno 계열':['techno_pulse'],
  'Trance 계열':['techno_pulse'], 'Breakbeat 계열':['breaks_stab'],
  'Trap 계열':['trap_pad'], 'Drill':['trap_pad'], 'Southern':['trap_pad'],
  'Lo-fi':['jazz_comp'],
  'Bebop 계보':['jazz_comp'], 'Latin Jazz':['montuno','bossa_comp'],
  'Fusion 계보':['jazz_comp'], '현대 갈래':['jazz_comp'],
  'Country':['country_strum'], 'Folk':['country_strum'], 'Blues':['country_strum'],
  'Reggae 갈래':['reggae_skank'], '자메이카':['reggae_skank'],
  'Dancehall 계보':['dancehall_stab'],
  '쿠바':['montuno'], '브라질':['bossa_comp'], '멕시코':['montuno'],
  '콜롬비아':['montuno'], '아르헨티나 · 남미 남부':['tango_marcato'],
  '서아프리카':['african_pulse'], '동아프리카':['african_pulse'],
};
const COMP_KIT_CAT = {
  A:['rock_8th','punk_quarter'], B:['pop_pulse','ballad_pad'],
  C:['trap_pad'], D:['funk_16th_stab','disco_stab','gospel_swell'],
  E:['house_offbeat','techno_pulse','breaks_stab'], F:['jazz_comp'],
  G:['country_strum'], H:['montuno','bossa_comp','tango_marcato'],
  I:['reggae_skank','dancehall_stab'], J:['african_pulse'],
  K:['balkan_brass','montuno'], X:['pop_pulse'],
};

/** 지금 걸린 프리셋에 어울리는 컴핑 리듬 이름 목록. progPoolFor() 와
    같은 규칙 — 빈 배열을 주지 않는다. */
function compPoolFor(name){
  const sub = COMP_KIT[PRESET_SUB[name]];
  if(sub) return sub;
  return COMP_KIT_CAT[PRESET_CAT[name]] || ['pop_pulse'];
}
