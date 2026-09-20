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
  /* i-iv-III-VI. 단조에서 네 마디로 한 바퀴 도는 파워코드 순환이라
     얼터너티브·그런지의 흔한 어법이다. 자연단음계 기준 도수로
     0=i · 3=iv · 2=III · 5=VI (예: F단조면 F-B♭-A♭-D♭).
     ⚠ 파워코드로 들으려면 프리셋의 chord 가 'power' 여야 한다 —
       chordSemis() 가 그 종류로 구성음을 만든다. */
  modal_i_iv_III_VI:{label:'모달 4코드(i-iv-III-VI)', cat:'A', degs:[0,3,2,5]},
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
  /* modal_i_iv_III_VI 를 더한다 — 단조 네 마디 파워코드 순환은 이 분기의
     흔한 어법이다. ⚠ 진행 표에는 프리셋 단위가 없다(progPoolFor 는 하위분기·
     계열까지만 본다). 그래서 이 진행은 Grunge 뿐 아니라 Alternative 분기
     전체가 함께 쓴다 — 곡 형식과 달리 그런지 전용이 아니다. */
  'Alternative':['modal_i_vii','pop_50s','modal_i_iv_III_VI'],
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
    깨지지 않도록). 건반을 낼지 말지는 프리셋의 kit.off 가 정한다. */
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
function chordSemis(rootDeg, scaleName, type){
  return chordVoicing(chordMask(((rootDeg % 8) + 8) % 8, type || 'triad', scaleName), scaleName);
}

/** 선율 도수를 그 마디 화음의 구성음으로 스냅한다.
    이미 화음음이면 그대로 둔다. 화음 밖이면 가장 가까운 구성음으로
    당기되, 거리가 너무 멀면(=스냅이 오히려 선율을 망가뜨리면) 원래
    도수를 그대로 돌려준다 — "선택적" 스냅이다.

    펜타토닉은 8칸 그리드 안에 실음이 5개뿐이라 이웃 화음음까지의
    도수 간격이 7음계보다 넓다. 그래서 펜타토닉만 허용 거리를 3으로
    늘렸다 — 7음계와 같은 거리(2)를 쓰면 스냅이 걸릴 자리가 거의
    없어져 함수가 있으나 마나 해진다. */
function snapDeg(deg, rootDeg, scaleName, type){
  const t = type || 'triad';
  const raw = chordMask(((rootDeg % 8) + 8) % 8, t, scaleName);
  /* 확장 화음은 도수가 8 이상까지 올라간다(9도·13도). 선율 도수는 0~7 이므로
     그대로 견주면 영영 안 맞는다 — **옥타브 안으로 접어 «음이름» 으로** 견준다.
     ⚠ 3화음일 때는 접지 않는다. TRIAD 는 이미 7 을 넘으면 −7 자리바꿈을 해
       0~7 안에 있고, 여기서 또 7→0 으로 접으면 예전 스냅 결과가 달라진다
       (근음 5도 화음이 {5,7,2} → {5,0,2} 가 되어 버린다). */
  let mask = raw;
  if(t !== 'triad'){
    const n = (typeof SCALE_N!=='undefined' && SCALE_N[scaleName]) || 7;
    mask = 0;
    for(let d=0; d<DEG_MAX; d++) if(raw & (1<<d)) mask |= 1 << (d % n);
  }
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
  /* §2 B 의 `pop_chord`·`dance_stab`·`synth_arp` 가 COMP 에 없어서 팝 분기 열다섯이
     전부 pop_pulse(8분)로 떨어지고 있었다. 세 리듬 다 §2 표에 이미 적혀 있다. */
  pop_chord    :{label:'팝 4분 코드',       cat:'B', rows:['X---X---X---X---']},
  dance_stab   :{label:'댄스팝 엇박 스탭',   cat:'B', rows:['--X---X---X---X-']},
  synth_arp    :{label:'신스팝 16분 아르페지오', cat:'B', rows:['XxxxXxxxXxxxXxxx']},

  /* ── C. Hip Hop ──
     trap_pad 하나로 계열 C 를 다 덮고 있었는데, 붐뱁·웨스트코스트는 온음표 패드가
     아니라 루프 위의 네 타점이다 — patterns/00-harmony.md 의 `hh_loop` 아키타입이
     그것을 이미 적고 있었다(건반 `0---0-----3---3-`). 그 자리를 옮겨 온다. */
  trap_pad     :{label:'트랩 패드(랩 자리 비움)', cat:'C', rows:['X---------------']},
  hh_loop      :{label:'힙합 루프 컴핑',          cat:'C', rows:['X---X-----X---X-']},
  /* §2 C 는 Southern·UK 를 `hh_sparse`(2타), Lo-fi 를 `lofi_ep` 로 적는데 둘 다
     COMP 에 없어서 각각 trap_pad(1타)·jazz_comp 로 떨어지고 있었다. */
  hh_sparse    :{label:'힙합 성긴 2타',           cat:'C', rows:['X-------X-------']},
  lofi_ep      :{label:'로파이 EP 컴핑',          cat:'C', rows:['X-----X-X-----X-']},

  /* ── D. R&B·Funk — funk_chank(patterns/00-harmony.md) 의 16분 자리를 그대로 옮김 ── */
  /* §2 D 의 `funk_chank` 건반은 `--0-0---3-3-----` 인데 여기 옮겨 적을 때 스텝 12 에
     타점이 하나 더 붙어 있었다. 프리셋 여덟 종은 전부 §2 쪽이다 — 표를 맞춘다. */
  funk_16th_stab:{label:'펑크 16분 스탭',    cat:'D', rows:['--X-X---X-X-----']},
  gospel_swell  :{label:'가스펠 온비트 스웰', cat:'D', rows:['X---X---X---X---']},
  disco_stab    :{label:'디스코 오프비트 스탭', cat:'D', rows:['--X---X---X---X-']},
  /* §2 D `njs_stab` — Contemporary R&B 여섯 종이 쓰는 리듬인데 COMP 에 없었다 */
  njs_stab      :{label:'뉴잭스윙 스탭',      cat:'D', rows:['X-X-----X-X-----']},

  /* ── E. Electronic — house_skank 의 엇박 자리(patterns/00-harmony.md) ── */
  house_offbeat:{label:'하우스 오프비트 스탭', cat:'E', rows:['--x---x---x---x-']},
  techno_pulse :{label:'테크노 8분 펄스',      cat:'E', rows:['x-x-x-x-x-x-x-x-']},
  breaks_stab  :{label:'브레이크비트 스탭',    cat:'E', rows:['X---X-----X---X-']},
  /* §2 E 는 Techno·Hardcore 를 `techno_stab`, Trance 를 `trance_arp`,
     Dubstep 을 `bass_music` 으로 적는데 셋 다 COMP 에 없었다. 그래서 테크노는
     8분 펄스로, 트랜스는 아르페지오 대신 8분으로, 덥스텝은 계열 기본 셋으로
     떨어지고 있었다. `techno_pulse` 는 §2 에 대응하는 아키타입이 없다. */
  techno_stab  :{label:'테크노 엇박 스탭',     cat:'E', rows:['--X-------X-----']},
  trance_arp   :{label:'트랜스 16분 아르페지오', cat:'E', rows:['XxxxXxxxXxxxXxxx']},
  bass_music   :{label:'베이스뮤직 2타',       cat:'E', rows:['X-------X-------']},

  /* ── F. Jazz — jazz_comp 의 불규칙 자리(patterns/00-harmony.md) ── */
  jazz_comp    :{label:'재즈 컴핑(불규칙 스탭)', cat:'F', rows:['--x----x--X---x-']},

  /* ── G. Roots ── */
  country_strum:{label:'컨트리 스트럼',        cat:'G', rows:['X-x-X-x-X-x-X-x-']},
  /* 2026-09-19 — 컨트리 10종이 이 8분과 어긋나 있었다. patterns/00-harmony.md §5-5 가
     2026-09-18 에 통키통크의 래그타임 서술(「선율·화성보다 리듬을 앞세운다」)을 근거로
     컨트리 프리셋을 **4타**로 고치면서 COMP 쪽을 함께 옮기지 않은 자리다.
     같은 country_strum 을 쓰는 블루스는 8분이 맞으므로(부기우기 「eight to the bar」)
     그쪽은 그대로 두고 컨트리에만 4타를 준다. */
  country_quarter:{label:'컨트리 4분 코드',     cat:'G', rows:['X---X---X---X---']},

  /* ── H. Latin — montuno 는 마디마다 엇박이 미세하게 다르다(살사 특징) ── */
  /* §2 H `montuno` 건반은 `--0-0---0-0-3---` 이다. 두 행 모두 그 자리와 어긋나
     있어서 쿠바 10종·푸에르토리코 6종이 한 번도 안 맞았다 — 첫 행을 §2 에 맞춘다. */
  montuno      :{label:'몬투노 엇박',      cat:'H', rows:['--X-X---X-X-X---','--x-x---x-x---x-']},
  /* 몬투노는 쿠바 계보의 것이다. 멕시코·콜롬비아까지 몬투노로 덮고 있었는데
     patterns/00-harmony.md 는 그 둘을 `latin_strum`(정박 네 타점)으로 적는다.
     리듬은 tango_marcato 와 같지만 이름이 가리키는 곳이 달라 따로 둔다. */
  latin_strum  :{label:'라틴 정박 스트럼', cat:'H', rows:['X---X---X---X---']},
  bossa_comp   :{label:'보사노바 싱코페 컴핑', cat:'H', rows:['X--x--x-X--x--x-']},
  tango_marcato:{label:'탱고 마르카토',     cat:'H', rows:['X---X---X---X---']},

  /* ── I. Caribbean — reggae_skank 의 뒷박(patterns/00-harmony.md) ── */
  reggae_skank :{label:'레게 뒷박 스캥크',   cat:'I', rows:['--X---X---X---X-']},
  /* §2 I `dancehall` 건반은 `--0---0---3---3-` 로 스캥크와 같은 자리다. 여기 적힌
     싱코페 행은 §2 에 없는 값이었고 댄스홀 6종이 전부 어긋나 있었다. */
  dancehall_stab:{label:'댄스홀 뒷박 스탭',   cat:'I', rows:['--X---X---X---X-']},
  /* §2 I `soca` — 트리니다드·프랑스어권 카리브 9종이 쓰는데 COMP 에 없었다 */
  soca_stab    :{label:'소카 엇박 3연타',     cat:'I', rows:['--X-X-X---X-X-X-']},

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
  /* §2 D 표가 `njs_stab` 의 «쓰이는 곳» 을 이 분기로 적는다. 여섯 종이 전부
     `0-0-----3-3-----` 인데 펑크 16분·가스펠 4분을 가리키고 있었다. */
  'Contemporary R&B':['njs_stab'],
  'Gospel · 지역 장르':['gospel_swell'],
  'House 계열':['house_offbeat'], 'Techno 계열':['techno_stab'],
  'Trance 계열':['trance_arp'], 'Breakbeat 계열':['breaks_stab'],
  'Hardcore 계열':['techno_stab'], 'Dubstep · Bass Music':['bass_music'],
  'Downtempo · Ambient · Retro':['ballad_pad'],
  'Trap 계열':['trap_pad'], 'Drill':['trap_pad'], 'Southern':['hh_sparse'],
  'UK 계열':['hh_sparse'],
  '뿌리 · 골든에이지':['hh_loop'], 'West Coast':['hh_loop'],
  'Lo-fi':['lofi_ep'],
  /* §2 B 가 적어 둔 세 리듬을 쓰는 분기들 — 전까지 전부 pop_pulse 로 떨어졌다.
     ⚠ `'뿌리'` 는 일부러 안 넣는다. COMP_KIT 은 분기 «이름» 만 보고 계열을 안 보는데
     이 이름을 A(Rock & Roll·Surf Rock)·B(Traditional Pop·Brill Building)·
     D(Rhythm & Blues) 셋이 공유한다. B 를 맞추려다 A 의 건반 주법까지 바꾸게 되고,
     록은 §5-8 ⓪ 이 「바깥 출처를 못 찾아 열어 둔다」고 적은 자리다. */
  '지역 팝':['pop_chord'], '동아시아':['pop_chord'],
  '남아시아':['pop_chord'], '서아시아 · 지중해':['pop_chord'],
  'Teen Pop · Indie Pop':['pop_chord'],
  'Dance-pop 계보':['dance_stab'], 'Synth-pop 계보':['synth_arp'],
  '푸에르토리코 · 도미니카':['montuno'],
  '트리니다드 · 바베이도스':['soca_stab'], '프랑스어권 카리브':['soca_stab'],
  'Bebop 계보':['jazz_comp'],
  /* 2026-09-19 — West Coast Jazz 를 «Bebop 계보» 에서 갈라 `Cool · West Coast` 로
     옮기면서 이 표에 새 이름을 등록하지 않아, 그 프리셋이 계열 기본값으로 떨어져
     건반 리듬이 어긋나 있었다(두 표 일치 220종 → 219종). 값은 형제와 같다. */
  'Cool · West Coast':['jazz_comp'], 'Latin Jazz':['montuno','bossa_comp'],
  'Fusion 계보':['jazz_comp'], '현대 갈래':['jazz_comp'],
  /* 컨트리만 4타로 옮긴다(§5-5 가 프리셋을 그렇게 고쳤다). 블루스는 8분이 맞다 —
     부기우기 「eight to the bar」. 포크는 **일부러 비워 둔다**: §5-8 이 `folk_strum` 의
     건반 행을 「기타 행에서 근음만 남긴 값」이라 적어 열어 두었고, 2026-09-19 조사에서도
     세 포크 장르 문서 모두 건반을 말하지 않음이 확인됐다 — 근거 없이 채우지 않는다. */
  'Country':['country_quarter'], 'Folk':['country_strum'], 'Blues':['country_strum'],
  'Reggae 갈래':['reggae_skank'], '자메이카':['reggae_skank'],
  'Dancehall 계보':['dancehall_stab'],
  '쿠바':['montuno'], '브라질':['bossa_comp'], '멕시코':['latin_strum'],
  '콜롬비아':['latin_strum'], '아르헨티나 · 남미 남부':['tango_marcato'],
  /* 아마피아노는 줄루어로 «피아노들» 이고 이 장르에서 건반이 주역이다.
     8분 펄스가 아니라 하우스와 같은 엇박 스탭이다(patterns/00-harmony.md 의
     `amapiano` 아키타입도 House 계열과 같은 자리를 쓴다). */
  '남아프리카':['house_offbeat'],
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

/** 지금 걸린 프리셋에 어울리는 컴핑 리듬 이름 목록.

    ⚠ 2026-09-18 — progPoolFor() 와 달리 **빈 배열을 줄 수 있다.**
    컴핑은 keys2 에서 나오는데, 「화성 진행」을 켜면 **건반이 없어야 할 장르에
    건반이 들어왔다.** patterns/00-harmony.md §2 가 「메탈에 건반이 없는 것은
    의도입니다 — 기타 벽이 중역을 다 채우므로 건반을 넣으면 탁해집니다」라고
    적는데, COMP_KIT 은 그 분기에 punk_quarter 를 주고 있었다.

    다만 `kit.off` 에 `keys` 가 있다는 것만으로는 부족하다 — 쿠바 룸바 계열은
    1번 건반을 끄고 **2번을 리드로 쓴다**(조사 roles.keys2 = choir-piano-horns).
    그래서 세 곳이 모두 «이 장르엔 건반이 없다» 고 할 때만 비운다.

      ① kit.off 에 keys 가 있다        ② keys2 패턴도 비어 있다
      ③ 선율 라이브러리에도 풀이 없다 (melodyPoolFor 가 빈 배열)

    지금 걸리는 것은 메탈·펑크 15종이다. 빈 배열을 주면 pickComp() 가 null 을
    돌려주고 시퀀서는 원래의 keys2 가지로 떨어진다 — 그쪽도 비어 있으므로
    결과는 «안 울림» 이고, 그것이 이 장르들의 편성이다. */
function compPoolFor(name){
  const L = LIB[name];
  if(L && (L.kit.off || []).includes('keys')
       && !L.keys2.some(v => v)
       && typeof melodyPoolFor === 'function' && !(melodyPoolFor(name) || []).length)
    return [];
  const sub = COMP_KIT[PRESET_SUB[name]];
  if(sub) return sub;
  return COMP_KIT_CAT[PRESET_CAT[name]] || ['pop_pulse'];
}
