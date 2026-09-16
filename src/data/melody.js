/* 16마디 선율 라이브러리
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다.

   근거는 melody/00-analysis.md 에 적어 두었습니다.

   ── 구조 ──
   PHRASE : 4마디 단위. 실제 작곡이 4마디로 사고하므로 그 단위로 씁니다.
   FORM   : 프레이즈를 잇는 방식. AABA · AABB 처럼 대중음악의 16마디 틀.
   MELODY : label + 프레이즈 4개 = 16마디.

   표기는 patterns/README.md §1 의 건반 트랙과 같습니다.
     a~h : 단음(스케일 0~7도)   0~7 : 3화음   - : 쉼
   도수라서 근음·스케일 노브를 따라갑니다 — 절대 음이 아닙니다. */
'use strict';

/* ── 4마디 프레이즈 ──────────────────────────────────────────
   마지막 마디를 비우는 것이 원칙입니다(melody/README.md §3).
   다음 덩어리로 넘길 자리이고, 드럼 필인이 그 자리를 채웁니다. */
const PHRASE = {
  /* ── 설계 ──
     A 프레이즈 = 낮은 층(도수 0~3), B 프레이즈 = 높은 층(2~5).
     AABA·AABB 어느 폼으로 이어도 곡의 정점이 B 에서 한 번만 나온다.
     한 마디 안의 뼈대는 "도약 하나 + 순차 둘로 되받기" 다.
       a → c (도약 +2) → b → a (순차로 되받음)
     이 비율이 순차 0.75 안팎을 만든다. (melody/02-melody-theory.md §1·§2) */

  /* A. Rock */
  rockA :['a-----c-b---a---','b-----d-c---b---','a-----c-b---c---','b---a-----------'],
  rockB :['c-----e-d---c---','d-----f-e---d---','c-----e-d---c---','b---a-----------'],

  /* B. Pop — 마디 첫 박에 긴 음을 두어 숨을 만듦 */
  popA  :['a-----c-b---a---','b-----d-c---b---','c-----d-c---b---','b---a-----------'],
  popB  :['c-----e-d---c---','d-----f-e---d---','e-----d-c---b---','c---b---a-------'],

  /* C. Hip Hop — §10 예외. 두세 음 반복이 훅 */
  hipA  :['a-------c---a---','a-------c---b---','a-------c---a---','c-----b---------'],
  hipB  :['c-------e---c---','c-------e---d---','d-----c---b-----','----------------'],

  /* D. R&B·Funk — 정박을 비운 16분. 음 종류는 적게 */
  funkA :['-a-c--b-a-b---a-','-b-d--c-b-c---b-','-a-c--b-a-b---c-','-b-a------------'],
  funkB :['-c-e--d-c-d---c-','-d-f--e-d-e---d-','-c-e--d-c-b---a-','-b-a------------'],

  /* E. Electronic — §10 예외. 아르페지오는 도약이 정체성 */
  edmA  :['acegacegacegaceg','acegacegacfhacfh','acegacegacegaceg','ageca-----------'],
  edmB  :['ecgeecgeecgeecge','dfhdfhdfhdfhdfhd','acegacegacegaceg','a---------------'],

  /* F. Jazz — 지그재그. 도약 뒤 반드시 되받되 방향을 자주 바꾼다 */
  jazzA :['--acb-a-c-b-a-b-','b-d-c-b-d-c-b---','--acb-a-c-b-a-c-','b-a-------------'],
  jazzB :['-c-e-d-c-e-d-c-b','d-f-e-d-f-e-d---','-c-e-d-c-b-a-b-c','b-a-------------'],

  /* G. Roots — 펜타토닉 왕복. 장식음(같은 음 두 번)을 살린다 */
  rootA :['a---ac--b---a---','b---bd--c---b---','a---ac--b---c---','b---a-----------'],
  rootB :['c---ce--d---c---','d---df--e---d---','c---ce--d---b---','b---a-----------'],

  /* H. Latin — 2마디 모티프 + 4마디째 하행 종지(몬투노) */
  latA  :['--a-c---b-a-----','--b-d---c-b-----','--a-c---b-c-----','b-a-------------'],
  latB  :['--c-e---d-c-----','--d-f---e-d-----','--c-e---d-b-----','c-b-a-----------'],

  /* I. Caribbean — 2·4박 뒷면 */
  carA  :['--a---c---b---a-','--b---d---c---b-','--a---c---b---c-','--b---a---------'],
  carB  :['--c---e---d---c-','--d---f---e---d-','--c---e---d---b-','--b---a---------'],

  /* I-2. 래가 · 디지털 댄스홀 — 신스 리드가 스킹크보다 촘촘하다.
     carA 가 오프비트(2·6·10·14)만 치는 반면 여기는 2박·4박 머리(4·12)도
     짚어 «리드가 앞에 나오는» 시대의 어법을 만든다. 오프비트 74%.
     근거: genres/profiles/09-I-dancehall.json */
  ragA  :['--a-b-c---e---d-','--a-b-c---e-d-c-','--c-b-a---d---c-','--a-b-a---------'],
  ragB  :['--e-f-g---h---g-','--e-f-g---h-g-d-','--g-f-e---h---d-','--e-f-e---------'],

  /* I-3. 아프로 댄스홀 — 마림바가 리드다. 위 둘과 달리 8분 순차로 걸어
     올라갔다 내려온다(도약 하나 + 순차 되받기). 오프비트 고정이 아니다. */
  afdA  :['--a-b-c-e-d-c---','--a-b-c-e-f-e---','--c-d-e-g-f-e---','--a-c-a---------'],
  afdB  :['--e-f-g-e-f-e---','--e-f-g-h-g-f---','--g-f-d-h-g-f---','--e-g-e---------'],

  /* E-2. UK 개러지 — 16분 싱코페. 스텝 0·3·6·10·13 에 걸린다.
     하우스의 정박(0·4·8·12)도, 레게의 오프비트(2·6·10·14)도 아닌
     «쪼갠» 자리다. 이것이 2-step 을 2-step 으로 만든다.
     근거: genres/profiles/05-E-house.json */
  garA  :['a--b--c---a--c--','a--b--c---e--d--','c--d--e---c--e--','a--b--a---------'],
  garB  :['e--f--g---e--g--','e--f--g---h--g--','g--f--d---g--e--','e--f--e---------'],

  /* J. African — 3·5스텝 모티프가 어긋나며 겹침 */
  afrA  :['a--c--b--a--b---','b--d--c--b--c---','a--c--b--a--c---','b--a------------'],
  afrB  :['c--e--d--c--d---','d--f--e--d--e---','c--e--d--c--b---','b--a------------'],

  /* K. 기타 지역 — 인접 도수를 스치고 본음으로 */
  worA  :['ab-a--c---b-----','bc-b--d---c-----','ab-a--c---b-----','b-a-------------'],
  worB  :['cd-c--e---d-----','de-d--f---e-----','cd-c--e---b-----','b-a-------------'],

  /* 블루스 — b3(도수 1)을 길게 끌어 블루노트 자리를 표시 */
  bluesA:['a---c--b--a-----','b---d--c--b-----','a---c--b--c-----','b---a-----------'],
  bluesB:['c---e--d--c-----','d---f--e--d-----','c---e--d--b-----','b---a-----------'],

  /* 가스펠 — 3화음. 순차 상행 뒤 되받아 내림 */
  gosA  :['0-------2---1---','1-------3---2---','0-------2---1---','1---0-----------'],
  gosB  :['2-------4---3---','3-------5---4---','2-------4---3---','1---0-----------'],

  /* 발라드 — 마디에 두 음. 노래 자리를 최대한 비움 */
  balA  :['a-------------c-','b-------------a-','c-------------b-','b---a-----------'],
  balB  :['c-------------e-','d-------------c-','e-------------d-','c---b---a-------'],

  /* 시네마틱 — 4마디에 걸쳐 오르고 마지막에 되받아 내림 */
  cinA  :['a---c---b---a---','b---d---c---b---','a---c---b---c---','b---a-----------'],
  cinB  :['c---e---d---c---','d---f---e---d---','e---g---f---e---','d---c---b-------'],

  /* 칩튠 — §10 예외 */
  chipA :['a-c-e-a-c-e-a-c-','a-c-e-a-c-e-g-h-','c-e-g-c-e-g-c-e-','h-g-e-c-a-------'],
  chipB :['e-g-h-e-g-h-e-g-','d-f-a-d-f-a-d-f-','a-c-e-a-c-e-a-c-','a---------------'],

  /* 앰비언트 — §10 예외. 여백이 악기 */
  ambA  :['a---------------','----------c-----','b---------------','----------a-----'],
  ambB  :['c---------------','----------e-----','d---------------','----------c-----'],

  /* 보사노바 — 정박을 피해 들어가고 길게 끔 */
  bosA  :['--a-----c-------','--b-----a-------','--c-----b-------','--b-----a-------'],
  bosB  :['--c-----e-------','--d-----c-------','--e-----d-------','--c-----a-------'],

  /* 디스코 — §10 예외. 옥타브 도약이 정체성 */
  disA  :['a-c-e-h-a-c-e-h-','a-c-e-h-a-c-g-h-','c-e-g-h-c-e-g-h-','h-g-e-c-a-------'],
  disB  :['e-g-h-e-g-h-e-g-','d-f-h-d-f-h-d-f-','a-c-e-h-a-c-e-h-','a---------------'],

  /* 트랩 — §10 예외. 랩 자리를 크게 비움 */
  trpA  :['a---------c-a---','a---------c-b---','a---------c-a---','c-a-------------'],
  trpB  :['c---------e-c---','b---------d-b---','a---------c-a---','----------------'],

  /* 앤섬 — 스타디움. 긴 음으로 오르고 정점에서 되받음 */
  antA  :['a-------c-------','b-------d-------','a-------c-------','b---a-----------'],
  antB  :['c-------e-------','d-------f-------','e-------d-------','c---b---a-------'],

  /* ── 아래 두 쌍은 3화음 보강분 ──
     gosA·gosB 가 42개 중 유일한 3화음 표기였다(patterns/00-harmony.md TRIAD
     주석·melody/01-harmony.md §2 근거). keys2 컴핑이 harmony.js 로 따로
     생겼으니 선율까지 전부 화음으로 바꾸지는 않는다 — 몇 개만 코드
     멜로디로 남겨 둔다. 리듬 자리(대시 위치)는 기존 단음 프레이즈의
     자리를 그대로 빌리고 문자만 도수(0~7)로 바꿨다 — 자리를 새로
     설계하지 않아도 길이 실수가 안 난다. */

  /* 성가 — gosA(0-2-1) 와 다른 화성 어휘(0-3-1). 온음계 상행 뒤 서브도미넌트 경유 */
  hymA  :['0-------3---1---','1-------4---2---','0-------3---1---','1---0-----------'],
  hymB  :['2-------5---3---','3-------6---4---','2-------5---3---','1---0-----------'],

  /* 파워코드 성 — hipA 자리를 빌린 3화음. 록·힙합 훅에 파워코드 스타브를 얹을 때.
     hipA 원본은 끝음이 도수1(불안정)이지만 — 힙합은 훅이 계속 도는 것이 맞아
     의도적이다(melody/02-melody-theory.md §10). 여기는 "코드멜로디" 예시라
     끝은 안정 도수(0)로 맺는다. */
  pwrA  :['0-------2---0---','0-------2---1---','0-------2---0---','2-----0---------'],
  pwrB  :['2-------4---2---','2-------4---3---','2-------4---2---','4-----0---------'],
};

/* ── 리듬 × 윤곽 분해 ────────────────────────────────────────
   위 46개 프레이즈는 «언제 치는가»(리듬)와 «무슨 도수를 치는가»(윤곽)가
   한 문자열에 붙어 있습니다. 그래서 장르마다 리듬 자리가 고정이고,
   도수 골격은 거의 전부 «도약 하나 + 순차 둘로 되받기»(0→2→1→0) 한 종류입니다.
   같은 장르를 틀면 늘 같은 리듬으로 같은 윤곽이 나오는 이유가 이것입니다.

     리듬  'x-----x-x---x---'   온셋 자리 16비트
     윤곽  [0, 2, 1, 0]         온셋 순서대로의 도수
     weave(리듬, 윤곽) → 'a-----c-b---a---'

   리듬 문자는 «그 자리에 무슨 표기를 쓰는가»(단음이냐 화음이냐)까지 담습니다.
   안 담으면 gosA('0-------2---1---')를 되짜올 때 단음('a---')이 나와
   왕복이 깨집니다. 아래 표가 pattern-codec.js 의 kpat 표기 전부를 덮습니다.
   ⚠ 리듬 문자열의 알파벳은 마디 문자열과 **다른 계통**입니다 —
     리듬에는 '-' 와 아래 마커 일곱 개만 나옵니다. */
const NOTE_CLASS = [
  ['x','a'],   // 단음 a~h
  ['X','0'],   // 3화음 0~7
  ['7','A'],   // 7화음 A~H
  ['9','I'],   // 9화음 I~P
  ['+','Q'],   // add9  Q~X
  ['4','i'],   // sus4  i~p
  ['6','q'],   // 6화음 q~x
];
/** 마디 문자 → [마커, 기준문자]. 쉼이면 null */
const noteClass = c => NOTE_CLASS.find(([,base]) => {
  const d = c.charCodeAt(0) - base.charCodeAt(0);
  return d >= 0 && d < 8;
}) || null;

/** 마디 → 리듬(온셋 자리 + 표기 계열) */
function rhythmOf(bar){
  let out='';
  for(const c of bar){ const e=noteClass(c); out += e ? e[0] : '-'; }
  return out;
}
/** 마디 → 윤곽(온셋 순서대로의 도수 0~7) */
function contourOf(bar){
  const out=[];
  for(const c of bar){ const e=noteClass(c); if(e) out.push(c.charCodeAt(0)-e[1].charCodeAt(0)); }
  return out;
}
/** 리듬 + 윤곽 → 마디. 윤곽이 온셋보다 짧으면 **되풀이합니다** —
    모티프를 짧게 두고 리듬만 늘리는 것이 실제 작법이라 그대로 돌립니다. */
function weave(r, c){
  let k=0;
  let out='';
  for(const m of r){
    if(m==='-'){ out+='-'; continue; }
    const e = NOTE_CLASS.find(([mark]) => mark===m) || NOTE_CLASS[0];
    const d = c.length ? c[k++ % c.length] : 0;
    out += String.fromCharCode(e[1].charCodeAt(0) + Math.max(0, Math.min(7, d|0)));
  }
  return out;
}

/* ── 리듬 교차로 만든 프레이즈 ──────────────────────────────
   ⚠ **계열 안에서만** 섞습니다. latA(몬투노) 윤곽에 hipA(힙합) 리듬을
     씌우면 장르 정체성이 깨집니다 — genres/00-tree.md 의 A~K 계열이
     경계이고, MELODY_KIT_CAT 이 그 경계를 그대로 씁니다.

   ⚠ **종지 마디(4번째)는 리듬 쪽 원본을 그대로 씁니다.** 교차하면 끝음이
     으뜸음에서 벗어나는 일이 잦은데(실측: 8쌍 중 3쌍), 그 마디는 이미
     검증된 종지라 손대지 않는 편이 낫습니다. buildLong 이 종지에서
     모방진행을 그만두는 것과 같은 규칙입니다.

   계열 C(힙합)·I(카리브)·J(아프리카)는 **일부러 뺐습니다** — 그 계열의
   프레이즈끼리는 윤곽이 이미 같아서(둘 다 0→2→1→0) 교차해도 상대 프레이즈가
   그대로 나옵니다. 이름만 늘고 소리는 안 느는 항목은 표를 속입니다. */
function crossPhrase(rSrc, cSrc){
  const pr=PHRASE[rSrc], pc=PHRASE[cSrc];
  return pr.map((bar,i) => i===3 ? bar : weave(rhythmOf(bar), contourOf(pc[i])));
}
/* [새 이름(A/B 뺀 것), 리듬 출처, 윤곽 출처, 계열] */
const MEL_CROSS = [
  ['rkant','rock','ant',  'A'],   // 록 8분 자리에 앤섬의 2음 왕복
  ['cinbal','cin','bal',  'B'],   // 시네마틱 4분 자리에 발라드의 2음 오스티나토
  ['disfun','dis','funk', 'D'],   // 디스코 8분 자리에 펑크의 촘촘한 순차
  ['edmchp','edm','chip', 'E'],   // EDM 16분 자리에 칩튠의 3음 순환
  ['jazbal','jazz','bal', 'F'],   // 재즈 지그재그 자리에 2음 — 엔클로저
  ['rootbl','root','blues','G'],  // 루츠 장식음 자리에 블루스 왕복
  ['latbos','lat','bos',  'H'],   // 몬투노 자리에 2음 과헤오
  ['worcin','wor','cin',  'K'],   // 월드 장식음 자리에 시네마틱 순차
];
MEL_CROSS.forEach(([name, r, c]) => {
  PHRASE[name+'A'] = crossPhrase(r+'A', c+'A');
  PHRASE[name+'B'] = crossPhrase(r+'B', c+'B');
});

/* ── 송폼 ──
   16마디를 어떻게 잇는지. 대중음악에서 실제로 쓰이는 틀만 넣었습니다.
   숫자는 PHRASE 두 개(A·B) 중 무엇을 쓰는지의 자리입니다. */
const FORM = {
  AABA:[0,0,1,0],   // 가장 흔한 32마디 팝 폼의 절반
  AABB:[0,0,1,1],   // 절-후렴
  ABAB:[0,1,0,1],   // 교대
  /* ABAC 를 두었었지만 값이 ABAB 와 같고 아무 프레이즈쌍도 쓰지 않았다.
     프레이즈가 A·B 둘뿐이라 C 자리에 넣을 재료가 없었던 것이다 —
     이름만 다른 항목은 표를 읽는 사람을 속이므로 지운다.
     긴 선율(LONG_FORMS)은 이 문제를 모방진행으로 푼다. */
  AAAB:[0,0,0,1],   // 반복 후 전환 — 힙합·일렉트로닉
};

/** 프레이즈 두 개와 폼으로 16마디를 만든다.

    같은 프레이즈가 두 번째로 나올 때는 **끝마디를 바꿉니다.**
    악보의 1번 괄호 / 2번 괄호와 같은 장치입니다.
    안 바꾸고 그대로 이으면 16마디 중 서로 다른 마디가 8개뿐이라
    "긴 루프"이지 선율이 아닙니다. (melody/README.md §3 원칙 3) */
function buildBars(a, b, form){ return buildBarsP(PHRASE[a], PHRASE[b], form); }
function buildBarsP(pa, pb, form){
  const pair=[pa, pb];
  const seen=[0,0];
  return (FORM[form]||FORM.AABA).flatMap(i => {
    const p=pair[i].slice();
    if(seen[i]++) p[3]=pair[1-i][3];     // 두 번째 등장 — 다른 쪽 끝마디를 빌려 온다
    return p;
  });
}

/* ── 선율 목록 ──
   프레이즈 쌍 하나에 폼을 여러 개 걸어 만듭니다.
   AABA · AABB · ABAB · AAAB 는 같은 재료로도 전개가 완전히 달라집니다 —
   어디서 되풀이하고 어디서 넘어가는지가 곡의 인상을 정하기 때문입니다. */
const MEL_SRC = [
  ['rockA','rockB',  {AABA:'록 드라이브',   AABB:'록 앤섬',      ABAB:'록 교대'}],
  ['popA','popB',    {AABB:'팝 아치',       ABAB:'팝 훅',        AABA:'팝 절-후렴'}],
  ['hipA','hipB',    {AAAB:'힙합 루프',     AABA:'힙합 성긴',    ABAB:'힙합 교대'}],
  ['funkA','funkB',  {AABB:'펑크 싱코페',   ABAB:'펑크 콜앤리스폰스', AAAB:'펑크 반복'}],
  ['edmA','edmB',    {AAAB:'EDM 아르페지오',AABB:'EDM 빌드',     ABAB:'EDM 교대'}],
  ['jazzA','jazzB',  {ABAB:'재즈 비밥',     AABA:'재즈 발라드',  AABB:'재즈 절-후렴'}],
  ['rootA','rootB',  {AABA:'루츠 펜타토닉', AABB:'루츠 전통',    ABAB:'루츠 교대'}],
  ['latA','latB',    {AABB:'라틴 몬투노',   ABAB:'라틴 모티프',  AAAB:'라틴 반복'}],
  ['carA','carB',    {AABA:'카리브 스킹크', AABB:'카리브 오프비트', ABAB:'카리브 교대'}],
  ['ragA','ragB',    {AABA:'래가 리드',     AABB:'래가 스탭',    ABAB:'래가 교대'}],
  ['afdA','afdB',    {AABB:'아프로댄스홀 마림바', AABA:'아프로댄스홀 회귀', ABAB:'아프로댄스홀 교대'}],
  ['garA','garB',    {AABB:'개러지 2-step', ABAB:'개러지 교대', AABA:'개러지 회귀'}],
  ['afrA','afrB',    {AABB:'아프로 폴리리듬',AAAB:'아프로 모티프',ABAB:'아프로 교대'}],
  ['worA','worB',    {AABA:'월드 장식음',   AABB:'월드 전통',    ABAB:'월드 교대'}],
  ['bluesA','bluesB',{AABA:'블루스 왕복',   AABB:'블루스 12마디풍', ABAB:'블루스 콜앤리스폰스'}],
  ['gosA','gosB',    {AABB:'가스펠 상행',   AABA:'가스펠 화답',  ABAB:'가스펠 교대'}],
  ['balA','balB',    {AABA:'발라드 긴숨',   AABB:'발라드 절-후렴', ABAB:'발라드 교대'}],
  ['cinA','cinB',    {AABB:'시네마틱 상승', AABA:'시네마틱 회귀',ABAB:'시네마틱 교대'}],
  ['chipA','chipB',  {AAAB:'칩튠 아르페지오',AABB:'칩튠 빌드',   ABAB:'칩튠 교대'}],
  ['ambA','ambB',    {AABA:'앰비언트 여백', AABB:'앰비언트 전환',AAAB:'앰비언트 반복'}],
  ['bosA','bosB',    {AABB:'보사 싱코페',   AABA:'보사 회귀',    ABAB:'보사 교대'}],
  ['disA','disB',    {AABB:'디스코 옥타브', ABAB:'디스코 교대',  AAAB:'디스코 반복'}],
  ['trpA','trpB',    {AAAB:'트랩 성긴',     AABA:'트랩 회귀',    ABAB:'트랩 교대'}],
  ['antA','antB',    {AABA:'앤섬 스타디움', AABB:'앤섬 절-후렴', ABAB:'앤섬 교대'}],
  /* 3화음 보강분 — gosA·gosB 하나뿐이던 코드멜로디 어휘를 둘 더 늘렸다.
     선율 전체를 화음화하지 않는다는 원칙(§ PHRASE 주석)은 지킨다 —
     42개 프레이즈 중 이제 3쌍(6개)만 3화음이다. */
  ['hymA','hymB',    {AABB:'성가 코드멜로디', AABA:'성가 화답'}],
  ['pwrA','pwrB',    {AAAB:'파워코드 코드멜로디', ABAB:'파워코드 교대'}],

  /* ── 리듬 × 윤곽 교차분 (§ MEL_CROSS) ──
     위 23쌍은 리듬 자리가 장르마다 하나씩 고정이었다. 여기부터는 같은 계열
     안에서 **한쪽의 리듬에 다른 쪽의 윤곽**을 얹은 쌍이다. 새 프레이즈를
     손으로 쓴 것이 아니라 이미 검증된 재료 둘을 교차한 것이라, 리듬은 그
     장르의 자리를 그대로 지키고 윤곽만 낯설어진다.
     ⚠ 이름은 전부 새 이름이다 — 위 23쌍은 한 글자도 안 건드렸다. */
  ['rkantA','rkantB',  {AABB:'록 스타디움 훅',   ABAB:'록 훅 교대'}],
  ['cinbalA','cinbalB',{AABA:'시네마틱 오스티나토', AABB:'시네마틱 긴숨'}],
  ['disfunA','disfunB',{AABB:'디스코 펑크 라인', ABAB:'디스코 펑크 교대'}],
  ['edmchpA','edmchpB',{AAAB:'EDM 칩 아르페지오', AABB:'EDM 칩 빌드'}],
  ['jazbalA','jazbalB',{ABAB:'재즈 엔클로저',    AABA:'엔클로저 회귀'}],
  ['rootblA','rootblB',{AABB:'루츠 블루스 왕복', AABA:'루츠 블루스 회귀'}],
  ['latbosA','latbosB',{AABB:'라틴 과헤오',      ABAB:'과헤오 교대'}],
  ['worcinA','worcinB',{AABA:'월드 시네마틱',    AABB:'월드 시네마틱 진행'}],
];

/* 이름은 프레이즈쌍 + 폼으로 자동 생성 — 손으로 21개를 적던 것을 없앱니다 */
const MELODY = {};
MEL_SRC.forEach(([a,b,forms]) => {
  const base=a.replace(/A$/,'');
  for(const [form,label] of Object.entries(forms))
    MELODY[base+'_'+form.toLowerCase()] = {label, bars:buildBars(a,b,form)};
});

/* ── 긴 선율 (32 · 64루프) ─────────────────────────────────
   16마디를 두 번 트는 것과 "32마디 선율"은 다릅니다.
   16마디 덩어리를 그대로 반복하면 듣는 쪽은 두 번째 바퀴에서
   이미 다 아는 소리를 듣습니다 — 길어진 것이 아니라 늘어진 것입니다.
   그래서 덩어리마다 **폼을 바꾸고**(전개가 달라짐), 이어지는 자리의
   종지를 **열어 둡니다**(끝나지 않았다는 신호). 마지막 덩어리만 닫습니다.
   실제 32마디 AABA 폼(각 8마디)이 하는 일이 이것입니다.
   (melody/01-harmony.md 의 반종지 · melody/README.md §3 원칙 3) */

/** 종지 마디를 '열어' 둔다 — 끝에 놓인 으뜸음을 한 도수 위로 밀어
    끝나지 않은 느낌을 만든다. 반종지(half cadence)의 최소 구현이다.
    단음 마디는 a→b, 3화음 마디는 0→1 로 민다. 둘 다 없으면 그대로 둔다
    (쉼표로 끝나는 마디는 이미 열려 있다). */
function openEnd(bar){
  let i=bar.lastIndexOf('a');
  if(i>=0) return bar.slice(0,i)+'b'+bar.slice(i+1);
  i=bar.lastIndexOf('0');
  if(i>=0) return bar.slice(0,i)+'1'+bar.slice(i+1);
  return bar;
}

/** 도수를 통째로 n 단 올린다 — 모방진행(sequence).
    같은 모양을 다른 높이에서 되풀이하는 것으로, 브릿지를 만드는
    가장 흔한 수단입니다. 윤곽이 같아서 새 재료인데도 낯설지 않습니다.
    (melody/02-melody-theory.md — 윤곽 보존) */
function seqUp(bar, n){
  let out='';
  for(const c of bar){
    /* a=97 · h=104 로 가둔다. 음수 n 으로 되돌릴 때 아래로도 새면 안 된다. */
    if(c>='a' && c<='h')      out += String.fromCharCode(Math.max(97, Math.min(104, c.charCodeAt(0)+n)));
    else if(c>='0' && c<='7') out += String(Math.max(0, Math.min(7, +c+n)));
    else                      out += c;
  }
  return out;
}
const seqPhrase = (p,n) => p.map(bar => seqUp(bar,n));

/* ── 변형 연산자 4종 ─────────────────────────────────────────
   전부 «리듬 × 윤곽» 분해(§ NOTE_CLASS) 위에서 돕니다. 그래서 표기 계열
   (단음이냐 화음이냐)은 어느 연산을 걸어도 안 바뀝니다. */

/** 역행 — 리듬은 그대로 두고 **온셋의 음만 역순**으로.

    ⚠ 문자열을 통째로 뒤집는 진짜 역행은 안 씁니다. 'b---a-----------' 을
      뒤집으면 '-----------a---b' 가 되어 첫 박이 비고, 무엇보다 **리듬 자리가
      뒤집힙니다** — 이 파일의 전제가 «리듬 자리 = 장르 정체성» 이라
      역행 한 번에 장르가 사라집니다. 음 순서만 되짚으면 윤곽은 확실히
      새로워지고 장르는 남습니다. 브릿지·아웃트로 자리에 씁니다. */
function retro(bar){ return weave(rhythmOf(bar), contourOf(bar).reverse()); }

/** 반사 — 도수를 축 axis 에 대고 뒤집는다. d → 2·axis − d.
    axis 를 안 주면 그 마디의 **첫 음**을 축으로 삼습니다(첫 음이 제자리에 남음).

    ⚠ 대중음악에서 가장 위험한 변형입니다. 무조 음악에서는 정체성이지만
      조성 음악에서 도수를 반사하면 «음이 이상해진» 것으로 들립니다.
      그래서 (1) 결과를 0~7 안에 **반드시** 가두고(범위를 벗어나면 ±7 로 접고,
      그래도 벗어나면 자릅니다), (2) 적용처를 긴 선율의 브릿지 한 덩어리로
      좁힙니다 — LONG_FORMS['64b'] 의 세 번째 덩어리 하나뿐이고,
      거는 재료도 시네마틱·재즈·앰비언트 셋뿐입니다(§ LONG_B). */
function invert(bar, axis){
  const c=contourOf(bar);
  if(!c.length) return bar;
  const ax = (axis===undefined || axis===null) ? c[0] : axis;
  return weave(rhythmOf(bar), c.map(d => {
    let v = 2*ax - d;
    while(v < 0) v += 7;                 // 옥타브로 접는다 — 도수 공간이라 7
    while(v > 7) v -= 7;
    return Math.max(0, Math.min(7, v));
  }));
}

/** 회전 — **온셋 자리만** n 스텝 돌린다. 음 순서는 그대로.
    모티프가 박자와 어긋나며 겹치는 것이 아프로·라틴 계열의 몸이라,
    그 계열의 재료에 겁니다(§ LONG_B). n>0 이 늦게, n<0 이 당겨 침. */
function rotate(bar, n){
  const r=rhythmOf(bar);
  const s=((16 - (n|0)) % 16 + 16) % 16;
  return weave(r.slice(s)+r.slice(0,s), contourOf(bar));
}

/** 온셋 간격을 f 배로. 첫 온셋은 제자리에 두고 그 뒤 간격만 늘리거나 줄인다.
    16칸을 넘으면 잘라내고, 줄여서 자리가 겹치면 다음 빈 칸으로 밀어
    음을 안 버립니다(rootA 의 장식음 같은 연타가 사라지면 안 됩니다). */
function timeScale(bar, f){
  const r=rhythmOf(bar), c=contourOf(bar);
  const mark=[], pos=[];
  [...r].forEach((m,i) => { if(m!=='-'){ mark.push(m); pos.push(i); } });
  if(!pos.length) return bar;
  const out=new Array(16).fill('-');
  pos.forEach((i,n) => {
    let p=Math.round(pos[0] + (i-pos[0])*f);
    while(p<16 && out[p]!=='-') p++;
    if(p<16) out[p]=weave(mark[n], [c[n]]);
  });
  return out.join('');
}
/** 확대 — 간격 ×2. 여백이 악기인 앰비언트·발라드에 맞습니다. */
const augment  = bar => timeScale(bar, 2);
/** 축소 — 간격 ÷2. 마디 뒤쪽이 비므로 필인 자리가 생깁니다. */
const diminish = bar => timeScale(bar, .5);

/* buildLong 의 plan 이 이름으로 부릅니다 */
const MEL_OPS = {retro, invert, rotate, augment, diminish};

/** 16마디 덩어리를 이어 붙인다. 덩어리마다 폼과 **재료**를 함께 바꾼다.

    폼만 바꾸면 서로 다른 마디가 늘지 않는다 — AABA 와 AABB 는 네 자리 중
    셋이 같아서, 32마디를 만들어도 재료는 여전히 8마디뿐이다.
    실제로 재어 보면 32마디에 서로 다른 마디가 9개(0.28)로,
    16마디짜리(0.38~0.50)보다 오히려 성겼다. 그래서 두 번째 덩어리는
    모방진행으로 한 단 올려 새 재료를 만든다. 마지막 덩어리는
    첫 덩어리로 되돌아온다 — 재현부라 반복이 흠이 아니라 형식이다. */
function buildLong(a, b, plan){
  const pa=PHRASE[a], pb=PHRASE[b];
  const out=[];
  plan.forEach(([form,shift,op,arg], k) => {
    const chunk = shift ? buildBarsP(seqPhrase(pa,shift), seqPhrase(pb,shift), form)
                        : buildBarsP(pa, pb, form);
    /* ⚠ 변형은 그 덩어리의 **종지 마디(15)를 빼고** 겁니다. 모방진행을
       종지 직전에 그만두는 위 규칙과 같은 이유입니다 — 종지까지 뒤집으면
       곡이 으뜸음이 아닌 데서 끝납니다. */
    if(op && MEL_OPS[op]) for(let i=0;i<15;i++) chunk[i]=MEL_OPS[op](chunk[i], arg);
    if(k < plan.length-1) chunk[15]=openEnd(chunk[15]);   // 마지막만 닫는다
    /* ⚠ 마지막 덩어리가 모방진행이면 **종지에서 모방을 버린다.**
       안 그러면 곡 전체가 으뜸음이 아닌 데서 끝난다 —
       처음 만들었을 때 32루프 21개 중 20개가 끝음 불안정으로 걸렸다.
       실제 작곡에서도 시퀀스는 종지 직전에 그만두는 것이 관례다. */
    if(k === plan.length-1 && shift) chunk[15]=seqUp(chunk[15], -shift);
    out.push(...chunk);
  });
  return out;
}

/* [폼, 올림] 쌍. 올림이 0 이 아니면 그 덩어리는 모방진행으로 만든 새 재료다.
   32 = 제시 + 전개, 64 = 제시 + 전개 + 더 밀기 + 재현. */
const LONG_FORMS = {
  32:[['AABA',0],['AABB',1]],
  64:[['AABA',0],['AABB',1],['ABAB',2],['AABA',0]],

  /* ── 변형 연산자를 건 새 plan ──
     ⚠ 위 32·64 는 한 글자도 안 건드렸습니다 — 기존 _l32·_l64 선율의 소리는
       변화가 0 입니다. 아래는 **새 이름**(_l32b·_l64b)으로만 나갑니다.

     [폼, 올림, 연산, 인자]. 연산은 그 덩어리에만 걸립니다.
     32b — 두 번째(마지막) 덩어리를 변형. **모방진행(올림)은 뺐습니다** —
           올림과 변형을 겹치면 한 덩어리에서 두 가지가 동시에 바뀌어
           «다른 곡» 이 됩니다. 여기서는 변형 하나만 겁니다.
     64b — 32·64 와 같은 제시·전개·재현 위에서 **세 번째 덩어리(브릿지)만**
           반사합니다. 32마디를 듣고 나서 16마디 낯설어졌다가 재현부로
           돌아오는 자리라, 반사를 견디는 유일한 위치입니다. */
  '32b':[['AABA',0],['AABB',0,'@op']],
  '64b':[['AABA',0],['AABB',1],['ABAB',2,'invert'],['AABA',0]],
};
/* 32b 의 '@op' 자리에 무엇이 들어가는지는 **계열이 정합니다.**
   리듬 자리를 흔드는 rotate 는 «모티프가 어긋나며 겹치는» 것이 정체성인
   아프로·라틴·카리브·보사에만, 음을 늘리는 augment 는 «여백이 악기» 인
   앰비언트·발라드에만 겁니다. 나머지는 음 순서만 되짚는 retro 입니다.
   (diminish 는 뒤쪽을 비워 필인 자리를 내주므로 촘촘한 재료에 씁니다) */
const LONG_B_OP = {
  afr:'rotate', lat:'rotate', car:'rotate', bos:'rotate', latbos:'rotate',
  amb:'augment', bal:'augment', ant:'augment', cinbal:'augment',
  edm:'diminish', chip:'diminish', dis:'diminish', edmchp:'diminish', disfun:'diminish',
};
const LONG_B_ARG = {rotate:2};        // 회전은 2스텝(8분 하나) — 한 박을 넘기면 다른 리듬이 된다
/* 32b 를 다는 재료. 두세 음 훅이 정체성인 힙합·트랩은 뺍니다 —
   훅을 되짚으면 훅이 아니게 됩니다(melody/02-melody-theory.md §10). */
const LONG_32B = ['rock','pop','bal','cin','ant','jazz','root','blues','wor','amb',
                  'lat','afr','car','bos','edm','chip','dis','funk','gos',
                  'rkant','cinbal','disfun','edmchp','jazbal','rootbl','latbos','worcin'];
/* 64b 는 **셋뿐입니다.** invert 가 걸리는 유일한 자리라 좁게 잡았습니다:
   시네마틱(영화음악은 반사를 실제로 씁니다) · 재즈(비밥 어법에 있습니다) ·
   앰비언트(조성의 구심력이 가장 약해 반사를 견딥니다).
   록·팝·앤섬은 뺐습니다 — 후렴 윤곽을 뒤집으면 후렴이 안 됩니다. */
const LONG_64B = ['cin','jazz','amb'];
const OP_LABEL = {retro:'역행', invert:'반사', rotate:'회전', augment:'확대', diminish:'축소'};
/* ── 측정 결과 (tools/analyze-melody.html, 2026-08) ──
   ①순차·②복귀·③정점·⑦끝음은 16루프짜리와 같은 수준으로 통과합니다.
   ⑥'다른 마디' 비율만 목표(0.40~0.75) 아래입니다 — 32루프 0.38, 64루프 0.20~0.33.
   이 지표는 **16마디를 전제로 잡은 값**이라 긴 폼에 그대로 대면 맞지 않습니다.
   64루프의 마지막 16마디는 재현부라 첫 덩어리를 그대로 되풀이하는 것이 형식이고,
   그 16마디만으로 비율이 0.25 씩 내려갑니다. 재료가 성긴 것이 아니라
   같은 재료를 되풀이하도록 **설계한** 자리입니다.
   긴 폼은 '덩어리별 새 재료 비율'로 따로 재야 합니다. */
/* 64루프는 긴 호흡이 어울리는 재료에만 답니다 —
   힙합·트랩처럼 두세 음 훅이 정체성인 계열에 64마디를 물리면
   같은 두 음을 64번 듣는 꼴이 됩니다. */
const LONG_64 = ['rock','pop','bal','cin','ant','jazz','amb','root'];
MEL_SRC.forEach(([a,b,forms]) => {
  const base=a.replace(/A$/,'');
  const first=Object.values(forms)[0];
  MELODY[base+'_l32']={label:first+' 32루프', bars:buildLong(a,b,LONG_FORMS[32])};
  if(LONG_64.includes(base))
    MELODY[base+'_l64']={label:first+' 64루프', bars:buildLong(a,b,LONG_FORMS[64])};

  /* 변형판 — 새 이름(_l32b·_l64b)으로만 나갑니다(§ LONG_FORMS 주석) */
  if(LONG_32B.includes(base)){
    const op=LONG_B_OP[base]||'retro';
    const plan=LONG_FORMS['32b'].map(t => t[2]==='@op' ? [t[0],t[1],op,LONG_B_ARG[op]] : t);
    MELODY[base+'_l32b']={label:first+' 32루프 '+OP_LABEL[op], bars:buildLong(a,b,plan)};
  }
  if(LONG_64B.includes(base))
    MELODY[base+'_l64b']={label:first+' 64루프 반사', bars:buildLong(a,b,LONG_FORMS['64b'])};
});

const MELODY_NAMES = Object.keys(MELODY);

/* 문자열 마디 → 스텝 비트마스크 (건반 트랙과 같은 인코딩).
   rows.length 가 곧 그 선율이 차지하는 **루프 개수**다. */
Object.values(MELODY).forEach(m => { m.rows = m.bars.map(kpat); });

/** 길이 선호에 맞춰 풀을 고른다.
    'auto' 는 16루프와 긴 것을 함께 놓아 섞여 나오게 하고,
    '32'·'64' 는 같은 재료의 긴 판이 있으면 그쪽으로 갈아탑니다.
    긴 판이 없는 재료는 16루프를 그대로 둡니다 —
    없다고 빼 버리면 풀이 비어 선율이 아예 안 나옵니다. */
function melodyLenPool(pool, pref){
  if(!pool || !pool.length) return pool || [];
  const sib = (n,suf) => n.replace(/_[a-z0-9]+$/, suf);
  if(pref==='auto'){
    const out=[...pool];
    /* '_l32b'·'_l64b' 는 변형 연산자를 건 판입니다(§ LONG_FORMS).
       **더하기만 합니다** — 기존 네 개는 그대로 남습니다. */
    pool.forEach(n => ['_l32','_l64','_l32b','_l64b'].forEach(suf => {
      const k=sib(n,suf);
      if(MELODY[k] && !out.includes(k)) out.push(k);
    }));
    return out;
  }
  const want=+pref;
  if(!(want>0)) return pool;
  /* 같은 길이의 변형판이 있으면 **함께** 내놓습니다. 고르는 것은 부르는 쪽이고,
     여기서 하나로 줄이면 새 재료가 영영 안 나옵니다. 없으면 예전과 같습니다. */
  const swapped = pool.flatMap(n => {
    const k=sib(n,'_l'+want);
    if(!(want>16 && MELODY[k])) return [n];
    return MELODY[k+'b'] ? [k, k+'b'] : [k];
  });
  const hit = swapped.filter(n => MELODY[n] && MELODY[n].rows.length===want);
  return hit.length ? hit : swapped;      // 그 길이가 없으면 원래 풀로
}

/* ── 하위분기 → 어울리는 선율 ──
   이름은 `프레이즈쌍_폼` 입니다 (예: pop_aabb). */
const MELODY_KIT_CAT = {
  A:['rock_aaba','rock_aabb','ant_aaba','blues_aaba','pwr_aaab'],
  B:['pop_aabb','pop_abab','bal_aaba','ant_aabb','cin_aabb'],
  C:['hip_aaab','hip_aaba','trp_aaab','trp_aaba'],
  D:['funk_aabb','funk_abab','dis_aabb','gos_aabb','hym_aabb'],
  E:['edm_aaab','edm_aabb','chip_aaab','dis_abab','amb_aaba'],
  F:['jazz_abab','jazz_aaba','bos_aabb','bal_aabb'],
  G:['root_aaba','root_aabb','blues_aaba','blues_aabb'],
  H:['lat_aabb','lat_abab','bos_aaba','cin_aaba'],
  I:['car_aaba','car_aabb','lat_abab'],
  J:['afr_aabb','afr_aaab','lat_aabb'],
  K:['wor_aaba','wor_aabb','cin_aaba'],
  X:['pop_aabb'],
};
const MELODY_KIT = {
  'Metal'                  :[],            // 메탈은 대체로 건반을 안 씁니다 — Black·Power·Symphonic 은 MELODY_KIT_PRESET 이 덮는다
  'Punk'                   :[],
  'Hard Rock'              :['rock_aaba','ant_aaba','blues_aaba','pwr_aaab'],
  'Alternative'            :['rock_aabb','amb_aaba','bal_aaba'],
  'Post-punk 계보'         :['rock_abab','amb_aabb','ant_abab'],
  'Bebop 계보'             :['jazz_abab','jazz_aaba','bal_aabb'],
  'Latin Jazz'             :['lat_aabb','jazz_abab','bos_aabb'],
  'Fusion 계보'            :['funk_aabb','jazz_abab','dis_aabb'],
  '현대 갈래'              :['jazz_aaba','bos_aaba','bal_aaba'],
  'Funk'                   :['funk_aabb','funk_abab','dis_aabb'],
  'Disco'                  :['dis_aabb','funk_abab','gos_aabb'],
  'Soul'                   :['gos_aabb','funk_aabb','bal_aaba','hym_aabb'],
  'Contemporary R&B'       :['bal_aaba','funk_abab','trp_aaba'],
  'House 계열'             :['edm_aaab','dis_abab','chip_aaab'],
  'Techno 계열'            :['edm_aaab','amb_aaab','chip_abab'],
  'Trance 계열'            :['edm_aabb','chip_aaab','cin_aabb'],
  'Breakbeat 계열'         :['edm_abab','chip_aabb','funk_abab'],
  'Dubstep · Bass Music'   :['trp_aaab','edm_aabb','amb_aaba'],
  'Downtempo · Ambient · Retro':['amb_aaba','bal_aaba','bos_aabb','jazz_aaba'],
  'Synth-pop 계보'         :['chip_aabb','ant_aabb','pop_abab'],
  'Dance-pop 계보'         :['pop_aabb','dis_aabb','ant_aaba'],
  'Teen Pop · Indie Pop'   :['pop_aabb','bal_aaba','ant_aaba'],
  'Trap 계열'              :['trp_aaab','trp_aaba','hip_aaab'],
  'Drill'                  :['trp_aaab','hip_aaba'],
  'Southern'               :['trp_aaab','hip_aaab'],
  'Lo-fi'                  :['jazz_aaba','bos_aabb','amb_aaba'],
  'Blues'                  :['blues_aaba','blues_aabb','root_aaba'],
  'Country'                :['root_aabb','root_aaba','blues_aaba'],
  'Folk'                   :['root_aabb','bal_aaba','blues_aaba'],
  'Gospel · 지역 장르'     :['gos_aabb','gos_aaba','hym_aabb'],
  'Reggae 갈래'            :['car_aaba','car_aabb'],
  '자메이카'               :['car_aaba','car_aabb','lat_abab'],
  '쿠바'                   :['lat_aabb','lat_abab','bos_aaba'],
  '브라질'                 :['bos_aabb','bos_aaba','lat_abab'],
  '멕시코'                 :['lat_abab','root_aabb','cin_aaba'],
  '콜롬비아'               :['lat_abab','lat_aabb'],
  '아르헨티나 · 남미 남부' :['bal_aabb','bos_aaba','cin_aaba'],
  '서아프리카'             :['afr_aabb','afr_aaab','funk_abab'],
  '동아프리카'             :['afr_aaab','afr_aabb'],
  '중앙아프리카'           :['afr_aabb','afr_abab'],
  '남아프리카'             :['afr_aaab','edm_aaab'],
  '남아시아'               :['wor_aaba','wor_aabb','afr_aaab'],
  '동유럽 · 발칸'          :['wor_aabb','wor_abab','cin_aaba'],
  '북아프리카'             :['wor_aaba','lat_abab'],
  /* 'Metalcore' 항목이 있었지만 PRESET_SUB['Metalcore'] 가 'Metal' 이라
     이 키로는 조회되지 않는다. 'Metal' 이 이미 [] 라 결과도 같았다 —
     닿지 않는 줄은 "메탈코어는 따로 정했다"는 착각만 준다. */

  /* ── 2026-09-14 · 빈 하위분기를 채웠다 ────────────────────────────
     RIFF_KIT·BLINE_KIT 과 같은 일이다. 여기 없던 분기는 계열 기본값으로
     떨어져, `pop_aabb|pop_abab|…` 하나를 **18종**이(지역 팝·뿌리·동아시아…),
     `hip_aaab|hip_aaba|trp_*` 를 18종이(골든에이지·UK·West Coast…) 썼다.
     **새 선율은 만들지 않았다.** 있던 152종을 제 자리에 연결했을 뿐이다.
     'Dancehall 계보' 는 여기 두지 않는다 — 프리셋마다 갈려서
     MELODY_KIT_PRESET 이 맡는다(배치 A2).                            */

  /* A·B. 록·팝 */
  '뿌리'                   :['rock_aaba','blues_aaba','root_aaba'], // 로큰롤·R&B — 블루스에서 왔다
  '루츠와의 교차'          :['root_aabb','rock_aabb','blues_aabb'],
  'Psychedelic · Krautrock':['rock_abab','amb_aaba','ant_abab'],    // 모토릭 — 같은 것을 오래
  'Soft Rock · AOR 계보'   :['bal_aaba','pop_aabb','cinbal_aaba'],
  '지역 팝'                :['pop_abab','bal_aaba','cin_aabb'],     // 계열 기본값과 겹치지 않게
  '동아시아'               :['bal_aaba','pop_aabb','wor_aaba'],     // 트로트·C-pop — 월드 어휘가 섞인다

  /* C. 힙합 */
  '뿌리 · 골든에이지'      :['hip_aaba','jazz_aaba','funk_abab'],   // 재즈·펑크 샘플이 몸이다
  'UK 계열'                :['hip_aaab','trp_aaba','afr_aabb'],     // 아프로스윙이 섞여 있다
  'West Coast'             :['funk_abab','hip_aaba','dis_aabb'],    // G-Funk 는 펑크다
  'Cloud · Emo 계열'       :['amb_aaba','trp_aaba','bal_aaba'],     // 이모 랩은 발라드에 가깝다
  '지역화 파생'            :['trp_aaab','lat_abab'],                // Brazilian Phonk

  /* E. 일렉트로닉 */
  'Hardcore 계열'          :['edm_aaab','chip_aaab'],
  'Electro'                :['edm_abab','chip_aabb'],

  /* H·I. 라틴·카리브 */
  '푸에르토리코 · 도미니카':['lat_aabb','car_aabb','latbos_aabb'],
  '현대 크로스오버'        :['trp_aaba','lat_abab'],                // 라틴 트랩
  '트리니다드 · 바베이도스':['car_aabb','lat_abab','afr_aabb'],     // 소카 — 아프로가 섞인다
  '프랑스어권 카리브'      :['car_aaba','bos_aabb','lat_abab'],     // 주크 — 부드럽다

  /* K. 기타 지역 */
  '서아시아 · 지중해'      :['wor_aaba','wor_aabb','lat_abab'],
  '하이브리드 · 인터넷 장르':['edm_abab','lat_abab','afr_aabb'],
};

/* ── 교차분 배정 ────────────────────────────────────────────
   위 두 표를 **더하기만** 합니다 — 지우지도, 순서를 바꾸지도 않습니다.
   그래서 예전에 나오던 선율은 전부 그대로 나오고, 풀에 항목이 늘 뿐입니다.
   손으로 45줄을 고치는 대신 표를 따로 두는 이유가 이것입니다: 무엇을
   더했는지가 한눈에 보이고, «지운 것이 없다» 를 증명할 필요가 없어집니다.

   ⚠ 계열이 곧 경계입니다(genres/00-tree.md). 교차 프레이즈는 그 계열
     안에서만 만들었으므로, 배정도 그 계열 밖으로 안 나갑니다.
     C(힙합)·I(카리브)·J(아프리카)는 교차분이 없어 비어 있습니다. */
const MEL_CROSS_CAT = {
  A:['rkant_aabb','rkant_abab'],   B:['cinbal_aaba','cinbal_aabb'],
  D:['disfun_aabb','disfun_abab'], E:['edmchp_aaab','edmchp_aabb'],
  F:['jazbal_abab','jazbal_aaba'], G:['rootbl_aabb','rootbl_aaba'],
  H:['latbos_aabb','latbos_abab'], K:['worcin_aaba','worcin_aabb'],
};
Object.entries(MEL_CROSS_CAT).forEach(([f,ns]) => MELODY_KIT_CAT[f].push(...ns));

const MEL_CROSS_SUB = {
  'Hard Rock':['rkant_aabb'], 'Alternative':['rkant_abab'], 'Post-punk 계보':['rkant_abab'],
  'Bebop 계보':['jazbal_abab'], '현대 갈래':['jazbal_aaba'], 'Lo-fi':['jazbal_aaba'],
  'Downtempo · Ambient · Retro':['jazbal_aaba'],
  'Latin Jazz':['latbos_aabb'], '쿠바':['latbos_aabb'], '콜롬비아':['latbos_aabb'],
  '브라질':['latbos_abab'], '멕시코':['latbos_abab'],
  'Fusion 계보':['disfun_aabb'], 'Funk':['disfun_aabb'], 'Soul':['disfun_aabb'],
  'Disco':['disfun_abab'], 'Contemporary R&B':['disfun_abab'],
  'House 계열':['edmchp_aaab'], 'Techno 계열':['edmchp_aaab'],
  'Trance 계열':['edmchp_aabb'], 'Breakbeat 계열':['edmchp_aabb'],
  'Dubstep · Bass Music':['edmchp_aabb'],
  'Synth-pop 계보':['cinbal_aabb'], 'Dance-pop 계보':['cinbal_aaba'],
  'Teen Pop · Indie Pop':['cinbal_aaba'], '아르헨티나 · 남미 남부':['cinbal_aabb'],
  'Blues':['rootbl_aabb'], 'Country':['rootbl_aabb'], 'Folk':['rootbl_aaba'],
  '남아시아':['worcin_aaba'], '북아프리카':['worcin_aaba'], '동유럽 · 발칸':['worcin_aabb'],
  /* Metal·Punk 은 건반을 안 쓰므로(빈 배열) 여기 없습니다.
     Trap·Drill·Southern(C)·Reggae·자메이카(I)도 교차분이 없어 없습니다. */
};
Object.entries(MEL_CROSS_SUB).forEach(([k,ns]) => { if(MELODY_KIT[k]) MELODY_KIT[k].push(...ns); });

/** 지금 걸린 프리셋에 어울리는 선율 이름 목록 */
/* ── 풀을 고를 때의 계열 판정 ────────────────────────────────────
   프리셋 357종은 raw 정의에 cat:'A'~'K' 를 **직접 적어 둔다**(LIB[name].cat).
   `PRESET_CAT` 은 56종만 손으로 적힌 예외표라, 그것만 보면 계열을 못 찾고
   폴백으로 떨어지는 프리셋이 생긴다. 실측(2026-09-14)하면 이랬다:

     선율 69종 · 기타 리프 **140종** · 베이스 라인 **152종**

   리프·베이스는 폴백 키가 실재해서 죽지 않을 뿐, 댄스홀·소카·엔카가
   전부 록 파워코드 리프와 록 베이스라인을 받고 있었다. 셋 다 LIB.cat 만
   보면 100% 제 계열을 찾는다(어긋나는 프리셋 0종 — 두 표는 상보적이다).

   ui/build.js 의 catOf() · seq/arrange.js 의 catFor() 와 같은 우선순위다.
   그 둘은 melody.js 보다 **나중에** 로드되므로 기대지 않고 여기서 다시
   적는다 — arrange.js 가 같은 이유로 한 것과 같은 판단이다. */
function poolCatFor(name){
  return (typeof LIB!=='undefined' && LIB[name] && LIB[name].cat)
      || PRESET_CAT[name] || 'K';
}

/* ── 프리셋이 직접 정한 선율 풀 ────────────────────────────────────
   MELODY_KIT 은 **하위분기** 키다. 그래서 한 분기에 묶인 프리셋은
   전부 같은 선율을 받는다 — `_build.js` 가 2026-08-17 에 kit 에서 끊어낸
   것과 똑같은 상속이 선율 쪽에는 남아 있었다.

   실제로 문제가 된 자리: 'Dancehall 계보' 6종은 한 분기인데
     · Dancehall · Dembow riddim — 리듬이 정체성. 선율은 성긴 스킹크
     · Ragga · Digital Dancehall · Bashment — 신스 리드가 앞에 나온다
     · Afro-dancehall — 마림바 리드 · 핑거 베이스 · 셰이커. 계보가 다르다
   셋은 선율로 갈리는데 분기가 하나라 표현할 방법이 없었다.

   ⚠ **여기에 프리셋을 적는 것은 «형제와 다르다» 는 판정이다.**
     근거 없이 적지 말 것. 판정 근거는 genres/profiles/*.json 에 있고
     tools/ci/check-melody-profile.mjs 가 둘이 어긋나는지 본다.
     차이가 없으면 적지 않는 것이 맞다 — 없는 차이를 만드는 것이
     이 작업의 가장 큰 실패다. */
const MELODY_KIT_PRESET = {
  /* I. Dancehall 계보 — 2026-09-14 배치 A2 (genres/profiles/09-I-dancehall.json) */
  'Dancehall'        :['car_aaba','car_aabb'],          // 성긴 스킹크 — 기존 재료가 맞다
  'Dembow riddim'    :['car_aaba','car_aabb'],          // Dancehall 과 공유 (리듬으로 갈린다)
  'Ragga'            :['rag_aaba','rag_aabb','car_aabb'],
  'Digital Dancehall':['rag_aaba','rag_aabb','car_aabb'],   // Ragga 와 공유 (음색으로 갈린다)
  'Bashment'         :['rag_aaba','rag_aabb','car_aabb'],   // Ragga 와 완전히 같은 풀 — 차이를 못 찾았다
  'Afro-dancehall'   :['afd_aabb','afd_aaba','afr_aabb'],

  /* E. House 계열 23종 — 2026-09-14 배치 A4 (genres/profiles/05-E-house.json)
     한 하위분기에 23종이 묶여 선율·리프·베이스가 전부 같았다. 남아 있던
     마지막 23종 천장이다. 편성이 이미 갈려 있었다 —
     bass 가 acid · reese · sub · moog · pluckbs · finger 로 여섯 갈래고
     BPM 113~139, swing 0~34. 선율만 따라오지 못한 자리였다.
     23종 → 7무리. 23풀로 쪼개지 않았다.                                */
  /* 1) 피아노 하우스 — 시카고·가라지. 가스펠·디스코에서 온 코드 스탭 */
  'House'                 :['gos_aabb','gos_aaba','gos_abab'],
  'Chicago House'         :['gos_aabb','gos_aaba','gos_abab'],
  'Garage House'          :['gos_aabb','gos_aaba','gos_abab'],
  /* 2) 필터·프렌치 — 디스코 루프를 필터로 여닫는다. 긴 상행 프레이즈 */
  'French House'          :['dis_abab','dis_aabb','dis_aaab'],
  'Filter House'          :['dis_abab','dis_aabb','dis_aaab'],
  /* 3) 딥·멜로딕 — 패드 위에 성글게. 움직임이 가장 적다 */
  'Deep House'            :['amb_aaba','bal_aaba','bal_abab'],
  'Melodic House & Techno':['amb_aaba','bal_aaba','bal_abab'],
  'Tech House'            :['amb_aaba','bal_aaba','bal_abab'],
  'Future House'          :['amb_aaba','bal_aaba','bal_abab'],
  /* 4) UK 개러지 — 16분 싱코페. garA/garB 를 새로 썼다 */
  'UK Garage'             :['gar_aabb','gar_abab','funk_abab'],
  '2-step Garage'         :['gar_aabb','gar_abab','funk_abab'],
  'Speed Garage'          :['gar_aabb','gar_abab','funk_abab'],
  /* UK Funky 는 처음에 따로 뒀다가 되돌렸다 — 선율 수치가 개러지 넷과
     거리 0 이었다. 아프로가 섞이는 것은 타악과 기타(highlife_gtr)이지
     선율이 아니다. Bassline 도 순서만 바꿔 뒀던 것을 되돌렸다. */
  'UK Funky'              :['gar_aabb','gar_abab','funk_abab'],
  'Bassline'              :['gar_aabb','gar_abab','funk_abab'],
  /* 5) 빅룸·일렉트로 — 리드가 앞에 나온다. 기존 하우스 풀이 여기 맞다 */
  'Big Room'              :['edm_aaab','chip_aaab','edmchp_aaab'],
  'Complextro'            :['edm_aaab','chip_aaab','edmchp_aaab'],
  'Bass House'            :['edm_aaab','chip_aaab','edmchp_aaab'],
  'Electro House'         :['edm_aaab','chip_aaab','edmchp_aaab'],
  'Progressive House'     :['edm_aaab','chip_aaab','edmchp_aaab'],
  /* 6) 애시드 — 303 이 선율을 맡는다. 건반은 비켜 준다 */
  'Acid House'            :['amb_aaab','amb_aaba'],
  /* 7) 타악·아프로 — 마림바·로그드럼. 아마피아노는 113 BPM 에 스윙 28 로
        형제 22종과 템포부터 다르다 */
  'Tribal House'          :['afr_aabb','afr_aaab','lat_abab'],
  'Amapiano'              :['afr_aabb','afr_aaab','lat_abab'],
  'Afro House'            :['afr_aabb','afr_aaab','lat_abab'],

  /* E. Dubstep · Bass Music 16종 — 2026-09-14 배치 A5
     (genres/profiles/05-E-dubstep.json)
     여기도 편성이 먼저 갈려 있었다 — pad+sub(분위기) · growl+reese(공격) ·
     supersaw(선율) · s808(트랩 파생) · bell 134~135BPM(클럽), 그리고
     110 BPM 의 Moombahton. 16종 → 6무리. 새 프레이즈는 만들지 않았다 —
     있는 재료로 충분했다.                                              */
  /* 1) 분위기형 — 패드가 길게 깔린다. 하프타임이라 밀도가 절반이다 */
  'Dubstep'               :['amb_aaba','amb_aabb','bal_aaba'],
  'Deep Dubstep'          :['amb_aaba','amb_aabb','bal_aaba'],
  'Meditative Dubstep'    :['amb_aaba','amb_aabb','bal_aaba'],
  'Future Garage'         :['amb_aaba','amb_aabb','bal_aaba'],
  'Wave'                  :['amb_aaba','amb_aabb','bal_aaba'],
  /* 2) 공격형 — 베이스가 주역이라 건반이 비켜 준다 */
  /* edm_aaab 은 밀도 12.5 의 빽빽한 아르페지오다 — «건반이 비켜 준다» 는
     프로파일과 정반대였다(P11 이 잡음). 성긴 재료로 바꿨다 */
  'Brostep'               :['trp_aaab','hip_aaab'],
  'Riddim'                :['trp_aaab','hip_aaab'],
  'Hardwave'              :['trp_aaab','hip_aaab'],
  /* 3) 선율형 — 슈퍼소우로 화음을 넓게 편다. 이 무리만 상행 윤곽이다 */
  /* 밀도가 3.63·12.75·2.19 로 뒤죽박죽이었다. cin 으로 통일했다 —
     음역 6 에 순차가 많아 «화음을 넓게 편다» 에 가장 가깝다 */
  'Future Bass'           :['cin_aabb','cin_aaba','cin_abab'],
  'Melodic Dubstep'       :['cin_aabb','cin_aaba','cin_abab'],
  /* 4) 트랩 파생 — 808 이 들어오면 선율도 트랩 어법이 된다 */
  'EDM Trap'              :['trp_aaab','trp_aaba','hip_aaab'],
  'Festival Trap'         :['trp_aaab','trp_aaba','hip_aaab'],
  /* 5) 클럽 — 저지·볼티모어·필리. 쪼갠 스탭이 몸이라 개러지와 어법이 같다 */
  'Jersey Club'           :['gar_abab','gar_aabb','funk_abab'],
  'Baltimore Club'        :['gar_abab','gar_aabb','funk_abab'],
  'Philly Club'           :['gar_abab','gar_aabb','funk_abab'],
  /* 6) 뭄바톤 — 110 BPM 에 뎀보우. 형제 15종과 템포부터 30 이상 벌어진다 */
  'Moombahton'            :['lat_abab','car_aabb','lat_aabb'],

  /* E. Downtempo · Ambient · Retro 11종 — 2026-09-15 배치 A6
     (genres/profiles/05-E-downtempo.json)
     한 분기인데 73~124 BPM, 스윙 0~50, 베이스 엔진이 여섯이다. 11종 → 7무리.
     Synthwave 만 계열이 B(팝)이고 나머지는 E 다 — 분기 안에 계열이 섞여 있다. */
  /* 1) 성긴 패드 — 건반이 패드다. 재료 중 가장 성긴 축(밀도 1.0~2.2).
        베이퍼웨이브를 따로 두려다 합쳤다 — 느리고 뭉갠 것은 템포와
        음색이지 선율이 아니다(73 BPM vs 100 BPM 인데 음 배치는 같다) */
  'Downtempo'             :['amb_aaba','amb_aabb','bal_aaba'],
  'Chillout'              :['amb_aaba','amb_aabb','bal_aaba'],
  'Ambient Techno'        :['amb_aaba','amb_aabb','bal_aaba'],
  'Vaporwave'             :['amb_aaba','amb_aabb','bal_aaba'],
  'Mallsoft'              :['amb_aaba','amb_aabb','bal_aaba'],
  /* 2) 발레아릭 — 나일론 기타가 둘(gtr·keys2). 음역이 한 도수 넓다 */
  'Balearic'              :['bos_aaba','bos_aabb','cin_aabb'],
  /* 3) 트립합 — 90 BPM 스윙 30. 두세 음 반복이라 도약 비율이 두 배다 */
  'Trip Hop'              :['trp_aaba','hip_aaba','bal_aabb'],
  /* 4) 재즈 물든 — 업라이트에 스윙 28~50. 밀도가 패드 무리의 세 배 */
  'Nu Jazz'               :['jazz_aaba','jazz_abab','jazz_aabb'],
  'Lounge'                :['jazz_aaba','jazz_abab','jazz_aabb'],
  /* 5) 신스웨이브 — 계열 B. 아르페지오라 거의 모든 이동이 도약(0.92) */
  'Synthwave'             :['chip_aabb','chip_abab','chip_aaab'],
  /* 6) 퓨처펑크 — 잘라 붙인 디스코. 신스웨이브와 밀도는 같고 윤곽이 다르다 */
  'Future Funk'           :['dis_abab','dis_aabb','dis_aaab'],
  /* A. Rock 계열 32종 — 2026-09-15 배치 A7 → 2026-09-16 대표곡 교정
     (genres/profiles/01-A-rock.json). 근거는 웹에서 실재·장르 분류를 확인한
     대표곡이다(genres/01-rock.md «대표곡» 표). 곡의 선율을 옮기지 않고 성질만 맞췄다. */
  /* Metal 10 · Punk 7 은 선율 없음이라 여기 없다. 아래 Metal 셋은 대표곡에 건반이
     실제로 있어서(Black 2/4 · Power 2/4 · Symphonic 4/4) 하위분기의 빈 배열을 덮는다. */
  /* 필인 없는 8분 킥 위 한 코드 드론 — 같은 것을 오래 민다 */
  'Motorik'                 :['ant_abab','ant_aabb','amb_aaba'],
  'Krautrock'               :['ant_abab','ant_aabb','amb_aaba'],
  /* 좁은 음역의 반복 보컬 + 곡마다 이국적 음색 하나(시타르·오르간) */
  'Psychedelic Rock'        :['rock_abab','wor_aaba','rock_aabb'],
  /* 퍼즈 기타 리프가 주인공, 블루스 음계 */
  'Acid Rock'               :['rock_abab','blues_aabb','rock_aabb'],
  /* 보컬은 약하고 음향 층이 주인공 */
  'Space Rock'              :['amb_aaba','amb_aabb','bal_aaba'],
  /* 트윈·슬라이드 기타와 피아노, 블루스 어휘 */
  'Southern Rock'           :['blues_aaba','blues_aabb','rootbl_aabb'],
  /* 기타 리프 위 크게 벌어지는 훅 */
  'Rock'                    :['rkant_aabb','rkant_abab'],
  'Glam Rock'               :['rkant_aabb','rkant_abab'],
  /* 피아노 5/5 · 12마디 블루스 */
  'Rock & Roll'             :['blues_aaba','rootbl_aaba','root_aaba'],
  /* 록 계열에서 거의 유일하게 **기타가 선율을 맡는** 장르다 */
  'Surf Rock'               :['cin_aabb','cin_aaba','rock_aabb'],
  /* 두세 코드를 최면적으로 되풀이 */
  'Garage Rock'             :['rock_aaba','rock_aabb','blues_abab'],
  'Proto-punk'              :['rock_aaba','rock_aabb','blues_abab'],
  /* **베이스가 선율을 맡는다** — 곡 문서 3곳·고딕록 장르 문서 */
  'Post-punk'               :['ant_abab','ant_aaba','amb_aabb'],
  'Gothic Rock'             :['ant_abab','ant_aaba','amb_aabb'],
  /* 보컬과 맞물린 기타 두 대 — 베이스는 근음 8분이라 원조와 떼어 냈다 */
  'Post-punk Revival'       :['rock_abab','rock_aabb'],
  /* 디스코 하이햇·카우벨·클랩 위 선율 베이스와 싱코페이션 */
  'Dance-punk'              :['funk_abab','funk_aabb','funk_aaab'],
  /* 신스 리프 4/5 · 장조 우세 */
  'New Wave'                :['pop_abab','funk_abab'],
  /* 음역 꼭대기에서 긴장하는 보컬, 클린 아르페지오 ↔ 디스토션 */
  'Emo'                     :['bal_aaba','bal_aabb','bal_abab'],
  'Screamo'                 :['bal_aaba','bal_aabb','bal_abab'],
  /* 기타 텍스처가 주인공, 보컬은 한 겹으로 묻힌다 */
  'Shoegaze'                :['amb_aaba','amb_aabb','bal_aaba'],
  'Dream Pop'               :['amb_aaba','amb_aabb','bal_aaba'],
  /* 4곡 모두 건반 · 장조 찬가형 후렴 */
  'Britpop'                 :['pop_aabb','pop_aaba','pop_abab'],
  /* 장조 파워팝·포크 훅 */
  'Lo-fi Indie'             :['pop_aabb','pop_aaba'],
  /* 박 뒤에 앉아 늘어지며 내려오는 무표정 보컬 */
  'Slacker Rock'            :['rock_aaba','blues_aabb'],
  /* 조용한 벌스 → 터지는 코러스, 표준 록 선율 */
  'Alternative Rock'        :['rock_aabb','rock_aaba','rock_abab'],
  'Grunge'                  :['rock_aabb','rock_aaba','rock_abab'],
  'Indie Rock'              :['rock_aabb','rock_aaba','rock_abab'],
  'Noise Rock'              :['rock_aabb','rock_aaba','rock_abab'],
  /* 페달 스틸·밴조 · 전곡 장조 · 화음 보컬 */
  'Country Rock'            :['rootbl_aabb','rootbl_aaba','root_aabb'],
  /* 트레몰로 기타의 긴 음 + 신스의 느린 모티프(Emperor·Burzum) */
  'Black Metal'             :['amb_aaab','amb_aaba'],
  /* 고음 클린 보컬의 상행 찬가형 후렴 */
  'Power Metal'             :['rkant_aabb','cin_aabb'],
  /* 오케스트라·합창과 보컬 선율이 같은 비중 */
  'Symphonic Metal'         :['cin_aabb','cinbal_aabb','cin_abab'],
  /* B. Pop 계열 39종 — 2026-09-15 배치 A8 → 2026-09-16 대표곡 교정
     (genres/profiles/02-B-pop.json). 근거는 웹에서 실재·장르 분류를 확인한
     대표곡이다(genres/02-pop.md «대표곡» 표). 곡의 선율을 옮기지 않고 성질만 맞췄다. */
  /* 슈퍼소우가 드롭을 끌고 간다 */
  'EDM-pop'                 :['dis_aabb','dis_abab','dis_aaab'],
  'Eurodance'               :['dis_aabb','dis_abab','dis_aaab'],
  /* 후렴 훅이 노래가 되어야 하므로 순차 진행이 가장 많다 */
  'Dance-pop'               :['pop_aabb','pop_aaba','pop_abab'],
  'Euro-pop'                :['pop_aabb','pop_aaba','pop_abab'],
  /* 벨 리드에 라틴계 싱코페 */
  'Freestyle'               :['cin_aabb','cin_aaba','cin_abab'],
  /* 155~160 BPM 에 칩튠 어휘 — 주인공은 처리된 보컬이고 신스는 훅이다 */
  'Hyperpop'                :['chip_aabb','chip_abab','chip_aaab'],
  'Digicore'                :['chip_aabb','chip_abab','chip_aaab'],
  /* 신스 훅이 몇 음으로 앤섬을 만든다 */
  'Electropop'              :['ant_aaba','ant_aabb','ant_abab'],
  'New Romantic'            :['ant_aaba','ant_aabb','ant_abab'],
  /* 80년대 아르페지오가 쉬지 않고 돈다 — 리드가 아니라 반주의 성질이다 */
  'Retrowave'               :['chip_aabb','chip_abab','chip_aaab'],
  'Synthwave'               :['chip_aabb','chip_abab','chip_aaab'],
  /* 크루너의 긴 음과 순차 진행 — 빅밴드 스윙이 아니라 12/8 발라드였다 */
  'Traditional Pop'         :['bal_aaba','cinbal_aabb','cin_aaba'],
  /* 작곡가 공장의 3분 팝 */
  'Brill Building'          :['pop_aaba','rock_aaba','blues_aaba'],
  /* 합창 훅이라 순차가 많고 반복이 강하다 */
  'Teen Pop'                :['pop_aabb','pop_abab','cinbal_aaba'],
  'Bubblegum'               :['pop_aabb','pop_abab','cinbal_aaba'],
  /* 다듬지 않은 프로덕션 */
  'Indie Pop'               :['bal_aaba','bal_aabb','bal_abab'],
  'Twee Pop'                :['bal_aaba','bal_aabb','bal_abab'],
  'Bedroom Pop'             :['bal_aaba','bal_aabb','bal_abab'],
  /* 하프시코드·현·목관 */
  'Chamber Pop'             :['cin_aaba','cin_aabb','cin_abab'],
  'Baroque Pop'             :['cin_aaba','cin_aabb','cin_abab'],
  /* 9화음에 펑크 핑거 베이스 */
  'City Pop'                :['jazbal_aaba','jazbal_abab','jazz_aaba'],
  /* 전자피아노에 라디오용 매끈함 */
  'Soft Rock'               :['cinbal_aaba','cinbal_aabb','bal_aaba'],
  'AOR'                     :['cinbal_aaba','cinbal_aabb','bal_aaba'],
  /* 피아노와 현이 깔리고 후렴에서 상행한다 */
  'J-pop'                   :['cin_aabb','cin_aaba','cinbal_aabb'],
  'Mandopop'                :['cin_aabb','cin_aaba','cinbal_aabb'],
  'Cantopop'                :['cin_aabb','cin_aaba','cinbal_aabb'],
  'Kayōkyoku'               :['cin_aabb','cin_aaba','cinbal_aabb'],
  /* 요나누키 음계에 꺾는 창법 */
  'Enka'                    :['wor_aaba','wor_aabb','worcin_aaba'],
  'Trot'                    :['wor_aaba','wor_aabb','worcin_aaba'],
  /* 출신 리듬이 곡마다 다르다 — 관·나일론 기타·안데스 관 */
  'Latin Pop'               :['lat_aabb','lat_abab','latbos_aabb'],
  /* 짧은 반복 후렴의 장조 팝 — 아코디언은 대표곡에 없었다 */
  'Schlager'                :['pop_aabb','pop_aaba'],
  /* 재즈·보사·라운지 인용 */
  'Shibuya-kei'             :['bos_aabb','bos_aaba','latbos_aabb'],
  /* 중국 5음계(궁조식)와 민요풍 반복 */
  'C-pop'                   :['wor_aaba','cin_aabb'],
  /* 장식음이 많고 인접 도수를 스친다 */
  'Arabic Pop'              :['wor_aabb','wor_abab','worcin_aabb'],
  'Rumba Flamenca'          :['wor_aabb','wor_abab','worcin_aabb'],
  'Turbo-folk'              :['wor_aabb','wor_abab','worcin_aabb'],
  /* 돌(dhol) 골격 — 시타르가 아니라 툼비의 짧은 반복이다 */
  'Desi Beats'              :['afr_aabb','afr_aaab','wor_aaba'],
  'UK Bhangra'              :['afr_aabb','afr_aaab','wor_aaba'],
  /* 쿠두루·뭄바톤 — 선율 악기가 주인공인 사례가 없다 */
  'Tropical Bass'           :['car_aabb','car_aaba','lat_abab'],
  /* C. Hip Hop (계열 C) — 2026-09-15 배치 A9 → 2026-09-17 대표곡 교정
     41종 → 27무리. 근거는 웹에서 실재·장르 분류를 확인한 대표곡이다
     (genres/03-hiphop.md «대표곡» 표). 곡의 선율을 옮기지 않고 성질만 맞췄다. */
  /* 스윙 퀀타이즈가 장르 정의의 일부다 — 두세 음을 되풀이해 랩 자리를 비운다 */
  'Boom Bap'                :['hip_aaab','hip_aaba','hip_abab'],
  'Golden Age'              :['hip_aaab','hip_aaba','hip_abab'],
  'Hardcore Hip Hop'        :['hip_aaab','hip_aaba','hip_abab'],
  /* 공포영화 스코어에서 온 음색 — 골격은 붐뱁 그대로다 */
  'Horrorcore'              :['hip_aaba','amb_aabb','bal_aaba'],
  /* 재즈 원반이 화성의 출처다. 업라이트가 워킹으로 걷는다 */
  'Jazz Rap'                :['jazz_aaba','jazbal_aaba','jazz_abab'],
  /* 디스코·펑크를 라이브 밴드가 다시 연주한다 */
  'Old School Hip Hop'      :['funk_aabb','funk_abab','funk_aaab'],
  /* 가사가 주역이라 골격을 시대에서 빌린다 — 관과 피아노가 사이를 메운다 */
  'Conscious Hip Hop'       :['amb_aaba','amb_aabb','bal_aaba'],
  /* 벨이 아니라 목관·현이 두세 음을 놓는다. 808 이 저역을 다 가져간다 */
  'Trap'                    :['trp_aaab','trp_aaba','trp_abab'],
  'Mumble Rap'              :['trp_aaab','trp_aaba','trp_abab'],
  /* 실로폰 음색과 복고풍 게임기 소리, 그리고 덧쌓인 화성 */
  'Plugg'                   :['cin_aabb','cinbal_aaba','cinbal_aabb'],
  'Pluggnb'                 :['cin_aabb','cinbal_aaba','cinbal_aabb'],
  /* 트랩 골격에 노래가 얹힌다 — 7화음이 들어간다 */
  'Melodic Trap'            :['cinbal_aaba','cinbal_aabb','bal_aaba'],
  /* 짧고 반복되고 스테레오로 벌린 신스 훅. 드럼은 단순하다 */
  'Rage'                    :['chip_aaab','chip_aabb','chip_abab'],
  /* 리드가 슈퍼소우가 아니라 왜곡 기타다 */
  'Trap Metal'              :['pwr_aaab','pwr_abab'],
  /* 로즈·펠트 피아노가 9화음을 굴린다 — 힙합에서 가장 느린 축 */
  'Lo-fi'                   :['jazbal_aaba','jazbal_abab'],
  'Chillhop'                :['jazbal_aaba','jazbal_abab'],
  /* 사전적으로 «재즈홉» 은 1990년대 재즈랩을 가리킨다 */
  'Jazzhop'                 :['jazz_aaba','jazz_aabb','jazbal_abab'],
  /* 140 BPM 에 각진 스퀘어 베이스 — 영국 개러지에서 나왔다 */
  'Grime'                   :['chip_abab','chip_aabb','chip_aaab'],
  /* 아프로비츠·댄스홀이 영국 랩과 만난 자리. 스네어가 셋째 박에 온다 */
  'Afroswing'               :['afr_aabb','afr_abab','car_aabb'],
  /* 우산 이름이라 하나의 성질로 적을 수 없다 — 계열 기본값 자리다 */
  'UK Rap'                  :['amb_aaab','amb_aaba','bal_aabb'],
  /* 미국 갱스터랩 쪽 프로덕션. 그라임보다 느리고 성기다 */
  'Road Rap'                :['amb_aaab','amb_aaba','bal_aabb'],
  /* 미끄러지는 808 이 선율을 맡는다 — 다섯 갈래 중 여기만 출처가 확인된다 */
  'UK Drill'                :['amb_aaba','amb_aabb','amb_aaab'],
  'NY / Bronx Drill'        :['amb_aaba','amb_aabb','amb_aaab'],
  /* 시카고는 미끄러지지 않는다 — 신스 브라스와 벨, 바쁜 스네어 */
  'Chicago Drill'           :['trp_aaba','trp_abab','amb_aabb'],
  /* 선율을 샘플 루프가 가져간다(옛 R&B·소울·펑크) */
  'Sample Drill'            :['cin_aabb','cinbal_aaba','cinbal_aabb'],
  /* 저지 클럽 킥이 박자를 만든다 — 넷이 성긴데 여기만 16분으로 쪼갠다 */
  'Jersey Drill'            :['gar_abab','gar_aabb','funk_abab'],
  /* 로파이 카우벨에 어두운 벨. 두세 음을 흐릿하게 되풀이한다 */
  'Phonk'                   :['trp_aaab','trp_abab','amb_aabb'],
  'Memphis Rap'             :['trp_aaab','trp_abab','amb_aabb'],
  /* 카우벨이 정의 조건이다(TR-808 cowbells) */
  'Drift Phonk'             :['trp_aaab','trp_abab','amb_aabb'],
  /* 신스 오스티나토 + 떼창. «신스 브라스» 는 출처에 없었다 */
  'Crunk'                   :['ant_aabb','ant_abab','ant_aaba'],
  /* 트리거맨 브레이크 반복이 전부다 — 이 계열에서 유일한 장조 */
  'Bounce'                  :['funk_aabb','funk_abab','car_aabb'],
  /* 808 일렉트로에 빠른 정박 — 힙합 중 유일하게 디스코 옥타브 어법 */
  'Miami Bass'              :['dis_aabb','dis_abab','dis_aaab'],
  'Booty Bass'              :['dis_aabb','dis_abab','dis_aaab'],
  /* 스네어가 없다. 스틸팬과 휘파람이 몇 음을 놓는다 */
  'Snap'                    :['amb_aaba','amb_aaab','amb_aabb'],
  /* 높고 얇은 포르타멘토 리드가 P-펑크 위를 미끄러진다 */
  'G-Funk'                  :['funk_abab','funk_aabb','disfun_abab'],
  /* 808 과 크렁크 프로덕션 위의 바운시한 신스 */
  'Hyphy'                   :['gar_aabb','gar_abab','funk_aaab'],
  'Jerk'                    :['gar_aabb','gar_abab','funk_aaab'],
  /* 에테리얼한 샘플 + 트랩 드럼. 리버브가 정체성 */
  'Cloud Rap'               :['amb_aaba','amb_aabb','bal_aaba'],
  /* 이모 기타가 트랩 위에 얹힌다 — 7화음 자연단조 */
  'Emo Rap'                 :['bal_aaba','bal_aabb','bal_abab'],
  /* 정의가 «음색의 실패» 다 — 왜곡과 나쁜 믹스 */
  'SoundCloud Rap'          :['bal_aaba','bal_aabb','bal_abab'],
  /* 탐보르장 «Bum-Cha-Cha» 골격. 화성 재료는 브라질 밖에서 온다 */
  'Brazilian Phonk'         :['lat_abab','lat_aabb','car_aabb'],
  /* D. R&B · Soul · Funk (계열 D) — 2026-09-15 배치 A10
     24종 → 16무리.
     근거: genres/profiles/*.json · 수치는 재료 실측에서 나왔다 */
  /* 클라비넷 16분에 슬랩 */
  'Funk'                    :['funk_aabb','funk_abab','funk_aaab'],
  'JB Funk'                 :['funk_aabb','funk_abab','funk_aaab'],
  /* 현이 옥타브로 오르내린다 */
  'Disco Funk'              :['dis_aabb','dis_abab','dis_aaab'],
  'Post-disco'              :['dis_aabb','dis_abab','dis_aaab'],
  /* 보코더와 무그가 앞에 선다 */
  'P-Funk'                  :['funk_abab','disfun_abab','funk_aaab'],
  'Electro-funk'            :['funk_abab','disfun_abab','funk_aaab'],
  /* 슬랩에 트럼펫과 EP */
  'Jazz-Funk'               :['jazz_aabb','jazz_abab','jazbal_abab'],
  /* 디스코가 신스로 넘어간 자리 */
  'Boogie'                  :['dis_abab','dis_aaab','dis_aabb'],
  /* 스윙 34 에 신스 브라스 */
  'New Jack Swing'          :['funk_aaab','funk_aabb','disfun_abab'],
  /* 72~75 BPM */
  'Quiet Storm'             :['bal_aaba','bal_aabb','amb_aaba'],
  'Alternative R&B'         :['bal_aaba','bal_aabb','amb_aaba'],
  /* 스윙 30 에 EP 9화음 */
  '90s R&B'                 :['cinbal_aaba','cinbal_aabb','bal_abab'],
  'Hip Hop Soul'            :['cinbal_aaba','cinbal_aabb','bal_abab'],
  /* 808 에 R&B 보컬 */
  'Trap Soul'               :['trp_aaba','trp_aaab','trp_abab'],
  /* 125~130 BPM 의 빠른 백비트에 합창 훅 */
  'Motown'                  :['pop_aabb','pop_aaba','pop_abab'],
  'Northern Soul'           :['pop_aabb','pop_aaba','pop_abab'],
  /* 현과 하프의 스위트 사운드 */
  'Philadelphia Soul'       :['cin_aaba','cin_aabb','cin_abab'],
  /* 혼 섹션이 거칠게 밀고 오르간이 받친다 */
  'Memphis Soul'            :['blues_aaba','blues_aabb','rootbl_aabb'],
  /* 와우 기타와 오르간 */
  'Psychedelic Soul'        :['funk_aabb','disfun_aabb','funk_abab'],
  /* 현이 옥타브로 오르내리고 베이스가 근음과 옥타브를 왕복한다 */
  'Disco'                   :['dis_aabb','dis_abab','dis_aaab'],
  'Euro Disco'              :['dis_aabb','dis_abab','dis_aaab'],
  /* 124~134 BPM 에 신스 리드 */
  'Hi-NRG'                  :['chip_aabb','chip_abab','chip_aaab'],
  'Italo Disco'             :['chip_aabb','chip_abab','chip_aaab'],
  /* 스윙 30 에 혼과 피아노 */
  'Rhythm & Blues'          :['blues_abab','blues_aaba','root_aaba'],
  /* F. Jazz · Roots · Regional (계열 F·G·K) — 2026-09-15 배치 A11
     32종 → 18무리.
     근거: genres/profiles/*.json · 수치는 재료 실측에서 나왔다 */
  /* 워킹 베이스에 스윙 */
  'West Coast Jazz'         :['jazz_abab','jazz_aaba','jazz_aabb'],
  'Soul Jazz'               :['jazz_abab','jazz_aaba','jazz_aabb'],
  /* 프렛리스에 13화음 */
  'Jazz Fusion'             :['jazz_aabb','jazbal_abab','jazz_abab'],
  /* 색소폰이 패드 위를 걷는다 */
  'Smooth Jazz'             :['bal_aaba','cinbal_aaba','cinbal_aabb'],
  /* 와우 기타와 오르간에 스윙 30 */
  'Acid Jazz'               :['jazbal_abab','jazz_aaba','jazbal_aaba'],
  /* 170~190 BPM 에 클라베 */
  'Latin Jazz'              :['lat_aabb','lat_abab','latbos_aabb'],
  'Afro-Cuban Jazz'         :['lat_aabb','lat_abab','latbos_aabb'],
  /* 나일론 기타에 긴 음 */
  'Bossa Jazz'              :['bos_aabb','bos_aaba','bos_abab'],
  'Samba Jazz'              :['bos_aabb','bos_aaba','bos_abab'],
  /* 스윙 30~50 의 셔플에 하모니카·크런치 기타 */
  'Chicago Blues'           :['blues_aaba','blues_aabb','blues_abab'],
  'Electric Blues'          :['blues_aaba','blues_aabb','blues_abab'],
  'Texas Blues'             :['blues_aaba','blues_aabb','blues_abab'],
  /* 160 BPM 에 혼 섹션과 업라이트 */
  'Jump Blues'              :['jazz_aaba','jazbal_aaba','jazz_abab'],
  /* 스윙 0 의 스트레이트 */
  'Blues Rock'              :['rootbl_aabb','rootbl_aaba','rock_aabb'],
  /* 90 BPM 에 리조네이터와 덜시머 */
  'Country Blues'           :['root_aaba','rootbl_aaba','blues_aaba'],
  /* 붐칙 베이스에 피아노·밴조 */
  'Honky-tonk'              :['root_aaba','root_aabb','root_abab'],
  'Old-time / Hillbilly'    :['root_aaba','root_aabb','root_abab'],
  /* 150 BPM 에 만돌린 트레몰로 */
  'Bluegrass'               :['jazz_aabb','root_abab','jazbal_abab'],
  /* 현과 합창으로 컨트리를 팝으로 다듬은 자리 */
  'Nashville Sound'         :['pop_aaba','pop_aabb','cinbal_aaba'],
  'Countrypolitan'          :['pop_aaba','pop_aabb','cinbal_aaba'],
  'Country Pop'             :['pop_aaba','pop_aabb','cinbal_aaba'],
  /* 내슈빌의 매끈함을 거부한 계보 */
  'Outlaw Country'          :['rootbl_aaba','rootbl_aabb','root_aabb'],
  'Alt-country'             :['rootbl_aaba','rootbl_aabb','root_aabb'],
  'Americana'               :['rootbl_aaba','rootbl_aabb','root_aabb'],
  /* 크런치 기타에 신스 리드 */
  'Bro-country'             :['rock_aaba','rock_aabb','rock_abab'],
  /* 스틸 기타 아르페지오에 업라이트 */
  'Folk Revival'            :['root_aabb','root_aaba','worcin_aaba'],
  'Indie Folk'              :['root_aabb','root_aaba','worcin_aaba'],
  /* 12현에 드럼이 들어온다 */
  'Folk Rock'               :['rock_aabb','rock_abab','root_abab'],
  /* 오르간 코드 스웰과 합창 */
  'Gospel'                  :['gos_aabb','gos_aaba','gos_abab'],
  /* 아코디언과 워시보드에 140 BPM */
  'Zydeco / Cajun'          :['wor_aabb','wor_abab','afr_abab'],
  /* 돌 리듬에 시타르 */
  'Bhangra'                 :['afr_abab','afr_aabb','wor_abab'],
  /* 여러 지역 타악을 베이스 뮤직 위에 얹는다 */
  'Global Bass'             :['car_aabb','lat_abab','car_abab'],
  /* E. Electronic 나머지 (계열 E) — 2026-09-15 배치 A12
     39종 → 17무리.
     근거: genres/profiles/*.json · 수치는 재료 실측에서 나왔다 */
  /* 플럭 몇 음이 루프를 돈다 */
  'Techno'                  :['amb_aaba','amb_aaab','amb_aabb'],
  'Hardgroove'              :['amb_aaba','amb_aaab','amb_aabb'],
  'Microhouse'              :['amb_aaba','amb_aaab','amb_aabb'],
  /* 패드 코드가 길게 깔린다 */
  'Detroit Techno'          :['bal_aaba','bal_aabb','amb_aaba'],
  'Dub Techno'              :['bal_aaba','bal_aabb','amb_aaba'],
  /* 303 이 선율을 맡는다 */
  'Acid Techno'             :['amb_aaab','amb_aabb','amb_aaba'],
  /* 150~155 BPM 에 왜곡 리드 */
  'Hard Techno'             :['chip_aaab','chip_abab','chip_aabb'],
  'Schranz'                 :['chip_aaab','chip_abab','chip_aabb'],
  'Industrial'              :['chip_aaab','chip_abab','chip_aabb'],
  /* 벨 한두 음이 16분 격자에서 자리를 바꾼다 */
  'Minimal Techno'          :['amb_aabb','amb_aaba','bal_aabb'],
  /* 174 BPM 이지만 화성은 하프타임으로 느리게 흐른다 */
  'Drum & Bass'             :['bal_aaba','amb_aaba','bal_aabb'],
  'Liquid Funk'             :['bal_aaba','amb_aaba','bal_aabb'],
  'Halftime DnB'            :['bal_aaba','amb_aaba','bal_aabb'],
  /* 리스 베이스가 주역이고 신스가 위에서 쏘아 댄다 */
  'Neurofunk'               :['chip_abab','chip_aabb','chip_aaab'],
  'Techstep'                :['chip_abab','chip_aabb','chip_aaab'],
  'Jump-up'                 :['chip_abab','chip_aabb','chip_aaab'],
  /* 브레이크를 잘게 썬 것이 몸이라 건반은 자리를 비운다 */
  'Jungle'                  :['amb_aabb','amb_aaab','amb_aaba'],
  'Drumfunk'                :['amb_aabb','amb_aaab','amb_aaba'],
  /* 펑크 브레이크에 록 기타 */
  'Big Beat'                :['funk_aabb','funk_abab','funk_aaab'],
  'Nu Skool Breaks'         :['funk_aabb','funk_abab','funk_aaab'],
  /* 슈퍼소우가 긴 상행으로 쌓아 올린다 */
  'Trance'                  :['dis_aabb','dis_abab','dis_aaab'],
  'Uplifting Trance'        :['dis_aabb','dis_abab','dis_aaab'],
  'Hard Trance'             :['dis_aabb','dis_abab','dis_aaab'],
  /* 303 계열 베이스가 16분을 쉬지 않고 구른다 */
  'Psytrance'               :['chip_aaab','chip_abab','chip_aabb'],
  'Goa'                     :['chip_aaab','chip_abab','chip_aabb'],
  'Full-on'                 :['chip_aaab','chip_abab','chip_aabb'],
  'Forest'                  :['chip_aaab','chip_abab','chip_aabb'],
  'Hi-tech'                 :['chip_aaab','chip_abab','chip_aabb'],
  /* 리버스 베이스에 앤섬 리드 */
  'Hardstyle'               :['ant_aabb','ant_abab','ant_aaba'],
  'Rawstyle'                :['ant_aabb','ant_abab','ant_aaba'],
  /* 132 BPM 에 패드가 천천히 열린다 */
  'Progressive Trance'      :['amb_aaba','bal_aaba','amb_aabb'],
  /* 180~205 BPM 에 왜곡 킥 */
  'Gabber'                  :['chip_abab','chip_aaab','chip_aabb'],
  'Hardcore Techno'         :['chip_abab','chip_aaab','chip_aabb'],
  'Frenchcore'              :['chip_abab','chip_aaab','chip_aabb'],
  /* 피아노 스탭에 밝은 훅 */
  'Happy Hardcore'          :['dis_aaab','dis_aabb','dis_abab'],
  'Breakbeat Hardcore'      :['dis_aaab','dis_aabb','dis_abab'],
  /* 디스코를 현대 장비로 다시 만든 자리 */
  'Nu-disco'                :['dis_abab','dis_aabb','dis_aaab'],
  /* 808 에 보코더 */
  'Electro'                 :['ant_abab','ant_aabb','ant_aaba'],
  'Electroclash'            :['ant_abab','ant_aabb','ant_aaba'],
  /* H. Latin (계열 H) — 2026-09-15 배치 A13
     39종 → 17무리.
     근거: genres/profiles/*.json · 수치는 재료 실측에서 나왔다 */
  /* 뎀보우 리듬이 정체성이고 건반은 벨 두세 음뿐 */
  'Reggaeton'               :['amb_aabb','amb_aaba','car_aabb'],
  'Dembow'                  :['amb_aabb','amb_aaba','car_aabb'],
  /* 레키토 기타 아르페지오가 선율을 맡는다 */
  'Bachata'                 :['lat_aabb','latbos_aabb','lat_aaab'],
  /* 혼 섹션이 빠른 2박 위를 달린다 */
  'Merengue'                :['lat_abab','lat_aabb','afr_abab'],
  'Bomba'                   :['lat_abab','lat_aabb','afr_abab'],
  'Plena'                   :['lat_abab','lat_aabb','afr_abab'],
  /* 아코디언이 리드이고 92~105 BPM 으로 느긋하다 */
  'Cumbia'                  :['lat_aaab','lat_aabb','wor_aaba'],
  'Vallenato'               :['lat_aaab','lat_aabb','wor_aaba'],
  'Cumbia Sonidera'         :['lat_aaab','lat_aabb','wor_aaba'],
  /* 쿰비아에 서프 기타와 아프로 기타가 들어온다 */
  'Chicha'                  :['latbos_abab','lat_abab','car_abab'],
  'Champeta'                :['latbos_abab','lat_abab','car_abab'],
  'Cumbia Villera'          :['latbos_abab','lat_abab','car_abab'],
  /* 반도네온이 하행으로 끌어내린다 */
  'Tango'                   :['jazz_abab','jazz_aabb','jazbal_abab'],
  'Nuevo Tango'             :['jazz_abab','jazz_aabb','jazbal_abab'],
  'Electrotango'            :['jazz_abab','jazz_aabb','jazbal_abab'],
  /* 트레스와 피아노 몬투노가 클라베 위를 돈다 */
  'Son Cubano'              :['lat_aabb','lat_aaab','latbos_aabb'],
  'Songo'                   :['lat_aabb','lat_aaab','latbos_aabb'],
  'Cha-cha-chá'             :['lat_aabb','lat_aaab','latbos_aabb'],
  /* 180~200 BPM 에 혼 섹션 */
  'Salsa'                   :['jazz_aaba','jazz_aabb','jazbal_aaba'],
  'Timba'                   :['jazz_aaba','jazz_aabb','jazbal_aaba'],
  'Mambo'                   :['jazz_aaba','jazz_aabb','jazbal_aaba'],
  'Mozambique'              :['jazz_aaba','jazz_aabb','jazbal_aaba'],
  /* 타악과 창이 몸이라 화성 악기가 거의 안 움직인다 */
  'Rumba'                   :['bos_aabb','bos_aaba','bos_abab'],
  'Rumba Yambú'             :['bos_aabb','bos_aaba','bos_abab'],
  'Rumba Columbia'          :['bos_aabb','bos_aaba','bos_abab'],
  /* 트랩 골격에 스페인어 */
  'Latin Trap'              :['trp_aaab','trp_aaba','trp_abab'],
  /* 레게톤을 느리고 흐릿하게 */
  'Neoperreo'               :['bal_aaba','amb_aaba','bal_aabb'],
  'Sad Perreo'              :['bal_aaba','amb_aaba','bal_aabb'],
  /* 나일론 기타의 싱코페 컴핑에 9화음 */
  'Bossa Nova'              :['bos_aaba','bos_aabb','bos_abab'],
  'Partido Alto'            :['bos_aaba','bos_aabb','bos_abab'],
  'Pagode'                  :['bos_aaba','bos_aabb','bos_abab'],
  /* 아코디언·자붐바에 삼각철 */
  'Forró'                   :['wor_aabb','wor_aaba','lat_aaab'],
  'Baião'                   :['wor_aabb','wor_aaba','lat_aaab'],
  /* 타악과 808 이 전부다 */
  'Baile Funk'              :['amb_aaab','amb_aabb','car_abab'],
  'Funk Mandelão'           :['amb_aaab','amb_aabb','car_abab'],
  'Bruxaria'                :['amb_aaab','amb_aabb','car_abab'],
  /* 트럼펫 두 대가 화음으로 운다 */
  'Mariachi'                :['cin_aaba','cin_aabb','worcin_aaba'],
  /* 140 BPM 에 관악대와 투바 */
  'Banda'                   :['root_abab','root_aabb','wor_abab'],
  'Norteño'                 :['root_abab','root_aabb','wor_abab'],
  /* I. Caribbean · African (계열 I·J) — 2026-09-15 배치 A14
     37종 → 17무리.
     근거: genres/profiles/*.json · 수치는 재료 실측에서 나왔다 */
  /* 75~80 BPM 에 원드롭 */
  'Roots Reggae'            :['car_aaba','car_aabb','car_abab'],
  'Reggae One Drop'         :['car_aaba','car_aabb','car_abab'],
  'Rockers'                 :['car_aaba','car_aabb','car_abab'],
  'Steppers'                :['car_aaba','car_aabb','car_abab'],
  /* EP 와 현이 깔린 부드러운 레게 */
  'Lovers Rock'             :['bal_aaba','bal_aabb','amb_aaba'],
  /* 140 BPM 에 혼 섹션과 워킹 베이스 */
  'Ska'                     :['lat_aaab','lat_aabb','car_aabb'],
  /* 스카와 레게 사이의 90~115 BPM */
  'Rocksteady'              :['car_aabb','blues_aabb','lat_abab'],
  'Mento'                   :['car_aabb','blues_aabb','lat_abab'],
  /* 155~168 BPM 에 스틸팬과 관악 */
  'Soca'                    :['afr_aabb','afr_abab','car_abab'],
  'Power Soca'              :['afr_aabb','afr_abab','car_abab'],
  /* 125~145 BPM 으로 소카보다 느긋하다 */
  'Calypso'                 :['car_aabb','lat_aabb','latbos_aabb'],
  'Groovy Soca'             :['car_aabb','lat_aabb','latbos_aabb'],
  'Chutney Soca'            :['car_aabb','lat_aabb','latbos_aabb'],
  /* EP 9화음에 부드러운 싱코페 */
  'Zouk'                    :['latbos_aabb','bos_aabb','cinbal_aaba'],
  'Kompa'                   :['latbos_aabb','bos_aabb','cinbal_aaba'],
  'Zouk Love'               :['latbos_aabb','bos_aabb','cinbal_aaba'],
  /* 135 BPM 에 신스 리드와 스틸팬 */
  'Bouyon'                  :['afr_abab','car_abab','afr_aaab'],
  /* 벨과 셰이커가 16분을 짜고 스윙 26 이 붙는다 */
  'Afrobeats'               :['afr_aabb','afr_aaab','afr_abab'],
  'Hiplife'                 :['afr_aabb','afr_aaab','afr_abab'],
  'Coupé-décalé'            :['afr_aabb','afr_aaab','afr_abab'],
  /* 혼 섹션에 스윙 30 */
  'Highlife'                :['wor_aabb','afr_abab','lat_aaab'],
  'Fuji'                    :['wor_aabb','afr_abab','lat_aaab'],
  /* 크런치 기타가 순환 리프를 돈다 */
  'Desert Blues'            :['blues_abab','rootbl_aaba','wor_aaba'],
  /* 느린 하우스에 타악이 얹힌다 */
  'Kwaito'                  :['amb_aaba','amb_aabb','amb_aaab'],
  'Gqom'                    :['amb_aaba','amb_aabb','amb_aaab'],
  'Afro Tech'               :['amb_aaba','amb_aabb','amb_aaab'],
  /* 오르간·색소폰이 순환 화성을 돈다 */
  'Mbaqanga'                :['wor_abab','afr_aabb','lat_aabb'],
  'Marabi'                  :['wor_abab','afr_aabb','lat_aabb'],
  /* **기타 세 대가 얽히는 세베네가 정체성**이다 */
  'Soukous'                 :['afr_abab','afr_aabb','lat_abab'],
  'Ndombolo'                :['afr_abab','afr_aabb','lat_abab'],
  'Congolese Rumba'         :['afr_abab','afr_aabb','lat_abab'],
  /* 스윙 50 에 5음계 모드 */
  'Ethio-jazz'              :['jazz_aaba','jazbal_aaba','jazz_abab'],
  /* 힙합·댄스홀이 동아프리카에서 만난 자리 */
  'Bongo Flava'             :['afr_aaab','afr_aabb','car_aabb'],
  'Gengetone'               :['afr_aaab','afr_aabb','car_aabb'],
  /* 아코디언과 나일론에 장식음이 많다 */
  'Raï'                     :['wor_aaba','worcin_aabb','wor_abab'],
  'Shaabi'                  :['wor_aaba','worcin_aabb','wor_abab'],
  'Mahraganat'              :['wor_aaba','worcin_aabb','wor_abab'],
};

function melodyPoolFor(name){
  const own=MELODY_KIT_PRESET[name];
  if(own) return own;                                   // 프리셋이 직접 정한 것이 최우선
  const sub=MELODY_KIT[PRESET_SUB[name]];
  if(sub) return sub;                                   // 빈 배열이면 "선율 없음"
  /* ⚠ 'pop_arch' 는 키가 아니라 **라벨**('팝 아치')이었다.
     MELODY 의 키는 프레이즈쌍_폼 규칙이라 실제 이름은 pop_aabb 다. */
  return MELODY_KIT_CAT[poolCatFor(name)] || ['pop_aabb'];
}


/* ═══ 기타 16마디 리프 ═══════════════════════════════════════
   선율을 건반에만 붙였더니 기타가 한 마디를 그대로 반복했습니다.
   기타는 건반과 다른 라인을 쳐야 하므로 별도 라이브러리를 둡니다 —
   같은 선율을 둘이 겹쳐 치면 편곡이 아니라 두 배로 시끄러운 것입니다.

   표기는 베이스 롤과 같습니다 (bpat).
     0~7 = 스케일 도수   - = 쉼
   기타는 모노라 한 스텝에 한 음입니다. 파워코드는 엔진이 만듭니다
   (crunch = [0,7], hi = [0,7,12]) — 도수 하나가 곧 코드입니다.

   마디 진행은 건반 선율과 **같은 melBar 를 봅니다.** 둘이 같은 16마디
   형식 위에 있어야 곡이 되지, 따로 돌면 그냥 겹친 두 루프입니다. */
const RIFF_PHRASE = {
  /* ── 설계 ──
     A = 낮은 층(도수 0~2), B = 높은 층(2~4). 정점이 곡 뒤쪽에 한 번 온다.
     같은 음 연타는 일부러 유지한다 — 파워코드 연타·근음 반복이 리프의 몸이다.
     (melody/02-melody-theory.md §10) */

  /* 록 — 파워코드 8분. 3마디에서 올라갔다 4마디에서 내려앉는다 */
  rockA :['0-0-0-0-0-0-0-0-','0-0-0-0-1-1-1-1-','2-2-2-2-1-1-1-1-','1-1-0-0-0-------'],
  rockB :['2-2-2-2-2-2-2-2-','2-2-2-2-3-3-3-3-','4-4-4-4-3-3-3-3-','3-3-2-2-0-------'],

  /* 메탈 — 팜뮤트 척. 16분 연타 사이에 도수를 옮긴다 */
  metalA:['00-00-0-00-00-0-','00-00-0-00-00-1-','22-22-2-22-22-1-','00-00-0-1-0-----'],
  metalB:['22-22-2-22-22-2-','22-22-2-33-33-3-','44-44-4-33-33-3-','22-22-1-0-------'],

  /* 펑크 — 16분 커팅. 정박을 비우고 앞뒤를 친다 */
  funkA :['--0-0--0--0-0--0','--0-0--0--1-1--1','--2-2--2--1-1--1','--1-0--0--------'],
  funkB :['--2-2--2--2-2--2','--2-2--2--3-3--3','--4-4--4--3-3--3','--2-1--0--------'],

  /* 레게 스킹크 — 2·4박 뒷면 */
  skankA:['--0---0---0---0-','--0---0---1---1-','--2---2---1---1-','--1---0---------'],
  skankB:['--2---2---2---2-','--2---2---3---3-','--4---4---3---3-','--2---0---------'],

  /* 아르페지오 — 컨트리·포크. 순차로 오르내린다 */
  arpA  :['0-1-2-1-0-1-2-1-','0-1-2-1-0-1-2-3-','2-3-4-3-2-3-4-3-','2-1-0-----------'],
  arpB  :['2-3-4-3-2-3-4-3-','3-4-5-4-3-4-5-4-','4-5-6-5-4-3-2-3-','2-1-0-----------'],

  /* 일렉트로닉 — §10 예외. 16분 아르페지오 */
  edmA  :['0-2-4-7-0-2-4-7-','0-2-4-7-0-2-5-7-','3-5-7-2-3-5-7-2-','7-4-2-0---------'],
  edmB  :['4-6-7-4-6-7-4-6-','2-4-5-2-4-5-2-4-','0-2-4-7-0-2-4-7-','0---------------'],

  /* 라틴 — 몬투노. 짧은 모티프 + 4마디째 하행 종지 */
  latA  :['--0-1---1-2-----','--1-2---2-3-----','--2-3---3-2-----','2-1-0-----------'],
  latB  :['--2-3---3-4-----','--3-4---4-5-----','--4-5---5-4-----','3-2-0-----------'],

  /* ── 아래 세 쌍은 보강분(melody/01-harmony.md 정리 후 추가) ──
     RIFF 12종은 MELODY 92종에 비해 심하게 적었다(00-analysis.md 근거로
     지적된 문제). 새 장르를 무작정 늘리기보다, RIFF_KIT_CAT 에 이미
     계열은 있는데 **그 계열다운 리프가 없어 대체 항목으로 때웠던 자리**
     (F=재즈가 펑크로, J=아프리카가 펑크로 대체됨)를 먼저 채운다. */

  /* 소울 — 클린 톤 커팅. funkA 보다 정박에 더 붙는다(싱커페이션이 덜함) */
  soulA :['0---0---0---0---','0---0---1---1---','2---2---1---1---','1---0-----------'],
  soulB :['2---2---2---2---','2---2---3---3---','4---4---3---3---','2---0-----------'],

  /* 하이라이프 — 서아프리카 핑거스타일. 3스텝 모티프가 16과 안 맞아떨어져
     자연히 어긋난다(멜로디 J 계열과 같은 설계, 00-analysis.md §2 J) */
  afrA  :['0--2--1--0--1---','0--2--1--0--1---','0--2--1--0--2---','1--0------------'],
  afrB  :['2--4--3--2--3---','2--4--3--2--3---','2--4--3--2--4---','3--2------------'],

  /* 재즈 컴핑 기타 — 찰스턴형 불규칙 스탭(patterns/00-harmony.md jazz_comp 리듬을 옮김) */
  jazzA :['--0----0--1---1-','--0----0--1---2-','--0----0--1---1-','--1-0-----------'],
  jazzB :['--2----2--3---3-','--2----2--3---4-','--2----2--3---3-','--3-2-----------'],
};

function buildRiff(a,b,form){
  const pair=[RIFF_PHRASE[a], RIFF_PHRASE[b]];
  const seen=[0,0];
  return (FORM[form]||FORM.AABA).flatMap(i => {
    const p=pair[i].slice();
    if(seen[i]++) p[3]=pair[1-i][3];     // 두 번째 등장은 끝마디를 바꾼다
    return p;
  });
}

const RIFF = {
  rock_power   :{label:'록 파워코드',  bars:buildRiff('rockA','rockB','AABA')},
  rock_drive   :{label:'록 드라이브',  bars:buildRiff('rockA','rockB','AABB')},
  metal_chug   :{label:'메탈 척',      bars:buildRiff('metalA','metalB','AAAB')},
  metal_gallop :{label:'메탈 갤럽',    bars:buildRiff('metalA','metalB','AABB')},
  funk_cut     :{label:'펑크 커팅',    bars:buildRiff('funkA','funkB','AABB')},
  funk_call    :{label:'펑크 주고받기',bars:buildRiff('funkA','funkB','ABAB')},
  skank        :{label:'레게 스킹크',  bars:buildRiff('skankA','skankB','AABA')},
  skank_up     :{label:'스카 업비트',  bars:buildRiff('skankA','skankB','AABB')},
  arp_folk     :{label:'포크 아르페지오',bars:buildRiff('arpA','arpB','AABA')},
  arp_country  :{label:'컨트리 아르페지오',bars:buildRiff('arpA','arpB','AABB')},
  edm_arp      :{label:'EDM 아르페지오',bars:buildRiff('edmA','edmB','AAAB')},
  latin_montuno:{label:'라틴 몬투노',  bars:buildRiff('latA','latB','AABB')},

  /* ── 보강분 — 기존 6쌍에 폼을 더 걸어서(MELODY 가 MEL_SRC 로 하는 것과 같은 방식)
     늘렸다. 새 재료를 새로 쓴 것이 아니라 같은 4마디 재료를 다른 폼으로 다시
     이었을 뿐이지만, AABA·AABB·ABAB 는 재현 지점이 달라 실제로 다른 16마디가
     된다(melody.js 파일 머리의 MEL_SRC 설계 참고). */
  rock_alt        :{label:'록 교대',        bars:buildRiff('rockA','rockB','ABAB')},
  metal_riff      :{label:'메탈 리프',      bars:buildRiff('metalA','metalB','AABA')},
  funk_groove     :{label:'펑크 반복',      bars:buildRiff('funkA','funkB','AAAB')},
  skank_offbeat   :{label:'스킹크 교대',    bars:buildRiff('skankA','skankB','ABAB')},
  arp_swing       :{label:'아르페지오 교대',bars:buildRiff('arpA','arpB','ABAB')},
  edm_build       :{label:'EDM 빌드',       bars:buildRiff('edmA','edmB','AABB')},
  edm_alt         :{label:'EDM 교대',       bars:buildRiff('edmA','edmB','ABAB')},
  latin_montuno_alt :{label:'몬투노 교대',  bars:buildRiff('latA','latB','ABAB')},
  latin_montuno_loop:{label:'몬투노 반복',  bars:buildRiff('latA','latB','AAAB')},

  /* ── 새 재료 — 재즈·소울·아프리카는 계열이 있는데도 리프가 없어
     RIFF_KIT_CAT 이 펑크로 대체하고 있었다(§ 위 주석). 진짜 재료를 채운다. */
  soul_chank   :{label:'소울 클린 커팅', bars:buildRiff('soulA','soulB','AABA')},
  soul_prog    :{label:'소울 진행',      bars:buildRiff('soulA','soulB','AABB')},
  highlife_gtr :{label:'하이라이프 기타',bars:buildRiff('afrA','afrB','AABB')},
  highlife_loop:{label:'하이라이프 반복',bars:buildRiff('afrA','afrB','AAAB')},
  jazz_gtr_comp :{label:'재즈 컴핑 기타',  bars:buildRiff('jazzA','jazzB','ABAB')},
  jazz_gtr_swing:{label:'재즈 스윙 컴핑',  bars:buildRiff('jazzA','jazzB','AABA')},
};
const RIFF_NAMES = Object.keys(RIFF);
Object.values(RIFF).forEach(r => { r.rows = r.bars.map(bpat); });

const RIFF_KIT_CAT = {
  A:['rock_power','rock_drive'],
  B:['rock_drive','arp_folk'],
  C:['funk_cut','edm_arp'],
  D:['funk_cut','soul_chank'],
  E:['edm_arp','edm_build'],
  F:['jazz_gtr_comp','jazz_gtr_swing'],       // 재즈 계열엔 재즈 컴핑 기타를 — 예전엔 펑크로 대체됐다
  G:['arp_country','arp_folk'],
  H:['latin_montuno','arp_folk'],
  I:['skank','skank_up'],
  J:['highlife_gtr','highlife_loop'],         // 아프리카 계열엔 하이라이프 기타를 — 예전엔 펑크로 대체됐다
  K:['arp_folk','latin_montuno'],
  X:['rock_power'],
};
const RIFF_KIT = {
  'Metal'                  :['metal_chug','metal_gallop'],
  'Hard Rock'              :['rock_power','metal_gallop'],
  'Punk'                   :['rock_drive','rock_power'],
  'Alternative'            :['rock_power','rock_alt'],
  'Post-punk 계보'         :['arp_folk','rock_drive'],
  'Bebop 계보'             :['jazz_gtr_comp','jazz_gtr_swing'],
  'Latin Jazz'             :['jazz_gtr_swing','latin_montuno'],
  'Fusion 계보'            :['jazz_gtr_comp','funk_groove'],
  '현대 갈래'               :['jazz_gtr_comp','jazz_gtr_swing'],
  'Funk'                   :['funk_cut','funk_call'],
  'Disco'                  :['funk_cut','funk_call'],
  'Soul'                   :['soul_chank','soul_prog'],
  'Contemporary R&B'       :['soul_prog','soul_chank'],
  '서아프리카'              :['highlife_gtr','highlife_loop'],
  '동아프리카'              :['highlife_loop','highlife_gtr'],
  'Reggae 갈래'            :['skank','skank_up'],
  '자메이카'               :['skank_up','skank'],
  'Dancehall 계보'         :['skank','edm_arp'],
  'Country'                :['arp_country','arp_folk'],
  'Folk'                   :['arp_folk','arp_country'],
  'Blues'                  :['rock_power','arp_country'],
  'House 계열'             :['edm_arp','funk_cut'],
  'Techno 계열'            :['edm_arp'],
  'Trance 계열'            :['edm_arp'],
  '쿠바'                   :['latin_montuno','funk_cut'],
  '브라질'                 :['latin_montuno','arp_folk'],
  '멕시코'                 :['arp_folk','latin_montuno'],
  '콜롬비아'               :['latin_montuno','arp_folk'],
  '남아시아'               :['arp_folk','latin_montuno'],

  /* ── 2026-09-14 · 빈 하위분기를 채웠다 ────────────────────────────
     위 29개만 등록돼 있어서 나머지 36개 분기 169종이 전부 계열 기본값
     하나로 몰렸다. 실측하면 `edm_arp|edm_build` 하나를 **43종**이,
     `funk_cut|edm_arp` 를 41종이, `rock_drive|arp_folk` 를 37종이 썼다.

     **새 리프는 만들지 않았다.** 있던 27종을 제 자리에 연결했을 뿐이다.
     차이가 없는 분기에는 같은 값을 준다 — 없는 차이를 만들지 않는다
     (Drill 과 Trap 계열은 기타 취급이 같아서 같은 값이다).            */

  /* E. 일렉트로닉 — 기타가 있어도 신스 아르페지오의 자리다 */
  'Dubstep · Bass Music'   :['edm_build','edm_alt'],      // 하프타임 — 빌드 쪽이 맞다
  'Breakbeat 계열'         :['funk_cut','edm_alt'],       // 브레이크비트의 뿌리가 펑크 브레이크다
  'Hardcore 계열'          :['edm_build','edm_alt'],
  'Electro'                :['edm_alt','edm_arp'],
  'Downtempo · Ambient · Retro':['arp_folk','edm_arp'],   // 성글고 느긋하게

  /* C. 힙합 — 기타는 드물다. 계열 기본값(펑크 커팅)이 과했다 */
  '뿌리 · 골든에이지'      :['funk_cut','jazz_gtr_comp'], // 샘플 출처가 재즈·펑크다
  'Trap 계열'              :['edm_arp','edm_alt'],
  'Drill'                  :['edm_arp','edm_alt'],        // Trap 과 같다 — 기타로는 안 갈린다
  'Southern'               :['edm_arp','edm_alt'],        // Trap 과 같다 — 처음엔 House 와 같은 값을 줘서 35종이 도로 뭉쳤다
  'Lo-fi'                  :['jazz_gtr_comp','arp_swing'],
  'West Coast'             :['funk_cut','funk_groove'],   // G-Funk 의 클린 커팅
  'UK 계열'                :['edm_arp','highlife_gtr'],   // 그라임은 기타가 없고 아프로스윙은 아프로비츠 기타다
  'Cloud · Emo 계열'       :['arp_folk','rock_alt'],      // 이모 랩의 기타는 이모 기타다
  '지역화 파생'            :['edm_arp','latin_montuno'],

  /* A·B. 록·팝 */
  'Psychedelic · Krautrock':['rock_alt','rock_drive'],    // 모토릭 — 같은 것을 오래 민다
  '뿌리'                   :['rock_drive','arp_country'], // 로큰롤은 컨트리에서 왔다
  '루츠와의 교차'          :['arp_country','rock_drive'],
  'Teen Pop · Indie Pop'   :['rock_alt','arp_folk'],
  'Dance-pop 계보'         :['funk_cut','arp_folk'],
  'Synth-pop 계보'         :['edm_arp','arp_folk'],
  'Soft Rock · AOR 계보'   :['arp_folk','rock_alt'],
  '지역 팝'                :['arp_folk','rock_drive'],

  /* H·I. 라틴·카리브 */
  '푸에르토리코 · 도미니카':['arp_folk','latin_montuno'], // 바차타의 레키토 아르페지오
  '아르헨티나 · 남미 남부' :['latin_montuno_alt','arp_folk'],
  '현대 크로스오버'        :['edm_arp','latin_montuno'],
  '트리니다드 · 바베이도스':['skank_up','skank_offbeat'], // 소카는 빠른 업스트로크
  '프랑스어권 카리브'      :['skank_offbeat','arp_folk'],

  /* J·K. 아프리카·기타 지역 */
  '중앙아프리카'           :['highlife_gtr','highlife_loop'], // 수쿠스 기타가 정체성이다
  '북아프리카'             :['arp_folk','latin_montuno'],
  '남아프리카'             :['highlife_loop','highlife_gtr'],
  'Gospel · 지역 장르'     :['soul_chank','soul_prog'],
  '동아시아'               :['arp_folk','rock_drive'],
  '서아시아 · 지중해'      :['arp_folk','latin_montuno'], // 룸바 플라멩카
  '동유럽 · 발칸'          :['arp_folk','latin_montuno'],
  '하이브리드 · 인터넷 장르':['edm_arp','latin_montuno'],
};

/* 프리셋이 직접 정한 리프 풀. MELODY_KIT_PRESET 과 같은 규칙이다 —
   적는 것은 «형제와 다르다» 는 판정이고, 근거는 genres/profiles/*.json 에 있다. */
const RIFF_KIT_PRESET = {
  /* E. House 계열 — 배치 A4 */
  'House'                 :['funk_cut','soul_chank'],    // 디스코·소울 커팅
  'Chicago House'         :['funk_cut','soul_chank'],
  'Garage House'          :['funk_cut','soul_chank'],
  'French House'          :['funk_cut','funk_groove'],   // 필터드 디스코 기타가 정체성
  'Filter House'          :['funk_cut','funk_groove'],
  'Deep House'            :['edm_arp','arp_folk'],
  'Melodic House & Techno':['edm_arp','arp_folk'],
  'Tech House'            :['edm_arp','arp_folk'],
  'Future House'          :['edm_arp','arp_folk'],
  'UK Garage'             :['funk_cut','edm_alt'],
  '2-step Garage'         :['funk_cut','edm_alt'],
  'Speed Garage'          :['funk_cut','edm_alt'],
  'UK Funky'              :['highlife_gtr','funk_cut'],  // UK 펑키는 아프로 기타를 쓴다
  'Bassline'              :['funk_cut','edm_alt'],
  'Big Room'              :['edm_build','edm_alt'],
  'Complextro'            :['edm_build','edm_alt'],
  'Bass House'            :['edm_build','edm_alt'],
  'Electro House'         :['edm_build','edm_alt'],
  'Progressive House'     :['edm_arp','edm_build'],      // 긴 아르페지오가 주역 — 형제 넷과 여기서 갈린다
  'Acid House'            :['edm_arp'],                  // 303 이 다 한다 — 기타는 비켜 준다
  'Tribal House'          :['highlife_gtr','edm_arp'],
  'Amapiano'              :['highlife_gtr','edm_arp'],
  'Afro House'            :['highlife_gtr','edm_arp'],

  /* E. Dubstep · Bass Music — 배치 A5 */
  'Dubstep'               :['edm_arp','arp_folk'],   // 분위기형 — 성글게
  'Deep Dubstep'          :['edm_arp','arp_folk'],
  'Meditative Dubstep'    :['edm_arp','arp_folk'],
  'Future Garage'         :['edm_arp','arp_folk'],
  'Wave'                  :['edm_arp','arp_folk'],
  'Brostep'               :['edm_build','edm_alt'],  // 공격형 — 빌드와 드롭
  'Riddim'                :['edm_build','edm_alt'],
  'Hardwave'              :['edm_build','edm_alt'],
  'Future Bass'           :['edm_arp','edm_build'],  // 선율형
  'Melodic Dubstep'       :['edm_arp','edm_build'],
  'EDM Trap'              :['edm_arp','edm_alt'],
  'Festival Trap'         :['edm_arp','edm_alt'],
  'Jersey Club'           :['funk_cut','edm_alt'],   // 클럽 — 쪼갠 커팅
  'Baltimore Club'        :['funk_cut','edm_alt'],
  'Philly Club'           :['funk_cut','edm_alt'],
  'Moombahton'            :['latin_montuno','edm_arp'],

  /* E. Downtempo · Ambient · Retro — 배치 A6 */
  'Vaporwave'             :['arp_swing','edm_arp'],
  'Mallsoft'              :['arp_swing','edm_arp'],
  'Downtempo'             :['arp_folk','edm_arp'],
  'Chillout'              :['arp_folk','edm_arp'],
  'Ambient Techno'        :['arp_folk','edm_arp'],
  'Balearic'              :['arp_folk','latin_montuno'],  // 나일론 기타가 둘이다
  'Trip Hop'              :['jazz_gtr_comp','arp_swing'],
  'Nu Jazz'               :['jazz_gtr_swing','jazz_gtr_comp'],
  'Lounge'                :['jazz_gtr_swing','jazz_gtr_comp'],
  'Synthwave'             :['edm_arp','rock_alt'],
  'Future Funk'           :['funk_cut','funk_groove'],    // 잘라 붙인 디스코 커팅
  /* A. Rock 계열 34종 — 2026-09-15 배치 A7 → 2026-09-16 대표곡 교정
     (genres/profiles/01-A-rock.json). 근거는 웹에서 실재·장르 분류를 확인한
     대표곡이다(genres/01-rock.md «대표곡» 표). 곡의 선율을 옮기지 않고 성질만 맞췄다. */
  'Motorik'                 :['rock_alt','rock_drive'],
  'Krautrock'               :['rock_alt','rock_drive'],
  'Psychedelic Rock'        :['rock_alt','rock_power'],
  'Acid Rock'               :['rock_alt','rock_power'],
  /* 반복 리프(오스티나토)가 뼈대 */
  'Space Rock'              :['rock_alt','rock_drive'],
  'Southern Rock'           :['arp_country','rock_drive'],
  'Rock'                    :['rock_power','rock_drive'],
  'Glam Rock'               :['rock_power','rock_drive'],
  'Rock & Roll'             :['rock_drive','arp_country'],
  'Surf Rock'               :['rock_drive','arp_swing'],
  'Garage Rock'             :['rock_drive','rock_power'],
  'Proto-punk'              :['rock_drive','rock_power'],
  'Post-punk'               :['arp_folk','rock_alt'],
  'Gothic Rock'             :['arp_folk','rock_alt'],
  /* 맞물린 기타 두 대의 리프 */
  'Post-punk Revival'       :['rock_drive','rock_alt'],
  'Dance-punk'              :['funk_cut','rock_alt'],
  /* 짧은 뮤트 컷 */
  'New Wave'                :['funk_cut','rock_drive'],
  'Emo'                     :['arp_folk','rock_drive'],
  'Screamo'                 :['arp_folk','rock_drive'],
  'Shoegaze'                :['rock_power','arp_folk'],
  /* 반짝이는 기타 아르페지오 */
  'Dream Pop'               :['arp_folk','rock_power'],
  'Britpop'                 :['rock_alt','arp_folk'],
  /* 파워팝 코드 스트럼 */
  'Lo-fi Indie'             :['rock_alt','arp_folk'],
  'Slacker Rock'            :['arp_folk','rock_alt'],
  'Alternative Rock'        :['rock_power','rock_alt'],
  'Grunge'                  :['rock_power','rock_alt'],
  'Indie Rock'              :['rock_power','rock_alt'],
  'Noise Rock'              :['rock_power','rock_alt'],
  'Country Rock'            :['arp_country','rock_drive'],
  /* Metal — 갤럽은 Heavy Metal 이 아니라 NWOBHM(Iron Maiden)의 것이었다 */
  'Heavy Metal'             :['rock_power','metal_riff'],
  'NWOBHM'                  :['metal_gallop','metal_riff'],
  'Black Metal'             :['metal_riff','metal_chug'],
  'Power Metal'             :['metal_gallop','rock_power'],
  'Symphonic Metal'         :['rock_power','metal_riff'],
  /* B. Pop 계열 39종 — 2026-09-15 배치 A8 → 2026-09-16 대표곡 교정
     (genres/profiles/02-B-pop.json). 근거는 웹에서 실재·장르 분류를 확인한
     대표곡이다(genres/02-pop.md «대표곡» 표). 곡의 리프을 옮기지 않고 성질만 맞췄다. */
  'EDM-pop'                 :['edm_build','edm_alt'],
  'Eurodance'               :['edm_build','edm_alt'],
  'Dance-pop'               :['funk_cut','arp_folk'],
  'Euro-pop'                :['funk_cut','arp_folk'],
  'Freestyle'               :['edm_arp','funk_cut'],
  'Hyperpop'                :['edm_arp','edm_alt'],
  /* 팝펑크·이모 기타 갈래가 있다(nowhere to go · Frailty) */
  'Digicore'                :['rock_power','edm_arp'],
  'Electropop'              :['rock_alt','arp_folk'],
  'New Romantic'            :['rock_alt','arp_folk'],
  'Retrowave'               :['edm_arp','rock_alt'],
  'Synthwave'               :['edm_arp','rock_alt'],
  'Traditional Pop'         :['jazz_gtr_swing','jazz_gtr_comp'],
  'Brill Building'          :['rock_drive','arp_country'],
  'Teen Pop'                :['rock_alt','arp_folk'],
  'Bubblegum'               :['rock_alt','arp_folk'],
  'Indie Pop'               :['arp_folk','rock_alt'],
  'Twee Pop'                :['rock_alt','arp_folk'],
  'Bedroom Pop'             :['arp_folk','rock_alt'],
  'Chamber Pop'             :['arp_folk','arp_swing'],
  'Baroque Pop'             :['arp_folk','arp_swing'],
  'City Pop'                :['funk_cut','soul_chank'],
  'Soft Rock'               :['arp_folk','soul_prog'],
  'AOR'                     :['arp_folk','soul_prog'],
  'J-pop'                   :['arp_folk','rock_alt'],
  'Mandopop'                :['arp_folk','rock_alt'],
  'Cantopop'                :['arp_folk','rock_alt'],
  'Kayōkyoku'               :['arp_folk','rock_alt'],
  'Enka'                    :['arp_folk','arp_swing'],
  'Trot'                    :['arp_folk','arp_swing'],
  'Latin Pop'               :['latin_montuno','arp_folk'],
  'Schlager'                :['arp_folk','rock_alt'],
  /* 네오아코·재즈 커팅 */
  'Shibuya-kei'             :['jazz_gtr_comp','soul_chank'],
  'C-pop'                   :['arp_folk','latin_montuno'],
  'Arabic Pop'              :['arp_folk','latin_montuno'],
  'Rumba Flamenca'          :['arp_folk','latin_montuno'],
  'Turbo-folk'              :['arp_folk','latin_montuno'],
  'Desi Beats'              :['arp_folk','highlife_gtr'],
  'UK Bhangra'              :['arp_folk','highlife_gtr'],
  'Tropical Bass'           :['skank_up','latin_montuno'],
  /* C. Hip Hop (계열 C) — 2026-09-15 배치 A9 → 2026-09-17 대표곡 교정
     41종 → 27무리. 근거는 웹에서 실재·장르 분류를 확인한 대표곡이다
     (genres/03-hiphop.md «대표곡» 표). 곡의 리프을 옮기지 않고 성질만 맞췄다. */
  'Boom Bap'                :['jazz_gtr_comp','funk_cut'],
  'Golden Age'              :['jazz_gtr_comp','funk_cut'],
  'Hardcore Hip Hop'        :['jazz_gtr_comp','funk_cut'],
  'Horrorcore'              :['arp_folk','jazz_gtr_comp'],
  'Jazz Rap'                :['jazz_gtr_comp','jazz_gtr_swing'],
  'Old School Hip Hop'      :['funk_cut','funk_call'],
  'Conscious Hip Hop'       :['arp_folk','jazz_gtr_comp'],
  'Trap'                    :['edm_arp','edm_alt'],
  'Mumble Rap'              :['edm_arp','edm_alt'],
  'Plugg'                   :['edm_arp','arp_folk'],
  'Pluggnb'                 :['edm_arp','arp_folk'],
  'Melodic Trap'            :['edm_arp','arp_folk'],
  'Rage'                    :['edm_build','edm_alt'],
  /* 기타 리프가 장르 정의에 들어 있다 */
  'Trap Metal'              :['metal_riff','rock_power'],
  /* 기타가 선율 악기다 — 여태 패턴이 비어 울리지 않았다 */
  'Lo-fi'                   :['jazz_gtr_comp','arp_swing'],
  'Chillhop'                :['jazz_gtr_comp','arp_swing'],
  'Jazzhop'                 :['jazz_gtr_swing','jazz_gtr_comp'],
  'Grime'                   :['edm_alt','edm_build'],
  'Afroswing'               :['highlife_gtr','skank_offbeat'],
  'UK Rap'                  :['arp_folk','edm_arp'],
  'Road Rap'                :['arp_folk','edm_arp'],
  'UK Drill'                :['edm_arp','edm_alt'],
  'NY / Bronx Drill'        :['edm_arp','edm_alt'],
  'Chicago Drill'           :['edm_arp','edm_alt'],
  'Sample Drill'            :['soul_prog','jazz_gtr_comp'],
  'Jersey Drill'            :['funk_cut','edm_alt'],
  'Phonk'                   :['edm_arp','edm_alt'],
  'Memphis Rap'             :['edm_arp','edm_alt'],
  'Drift Phonk'             :['edm_arp','edm_alt'],
  'Crunk'                   :['edm_build','funk_cut'],
  'Bounce'                  :['funk_cut','funk_call'],
  'Miami Bass'              :['edm_arp','funk_cut'],
  'Booty Bass'              :['edm_arp','funk_cut'],
  'Snap'                    :['edm_arp'],
  'G-Funk'                  :['funk_cut','funk_groove'],
  'Hyphy'                   :['edm_alt','funk_cut'],
  'Jerk'                    :['edm_alt','funk_cut'],
  'Cloud Rap'               :['arp_folk','edm_arp'],
  'Emo Rap'                 :['arp_folk','rock_drive'],
  'SoundCloud Rap'          :['arp_folk','rock_drive'],
  'Brazilian Phonk'         :['latin_montuno','edm_arp'],
  /* D. R&B · Soul · Funk (계열 D) — 2026-09-15 배치 A10
     24종 → 16무리.
     근거: genres/profiles/*.json · 수치는 재료 실측에서 나왔다 */
  /* 클라비넷 16분에 슬랩 */
  'Funk'                    :['funk_cut','funk_call'],
  'JB Funk'                 :['funk_cut','funk_call'],
  /* 현이 옥타브로 오르내린다 */
  'Disco Funk'              :['funk_cut','funk_groove'],
  'Post-disco'              :['funk_cut','funk_groove'],
  /* 보코더와 무그가 앞에 선다 */
  'P-Funk'                  :['funk_groove','edm_arp'],
  'Electro-funk'            :['funk_groove','edm_arp'],
  /* 슬랩에 트럼펫과 EP */
  'Jazz-Funk'               :['jazz_gtr_comp','funk_groove'],
  /* 디스코가 신스로 넘어간 자리 */
  'Boogie'                  :['funk_cut','edm_arp'],
  /* 스윙 34 에 신스 브라스 */
  'New Jack Swing'          :['funk_cut','edm_alt'],
  /* 72~75 BPM */
  'Quiet Storm'             :['arp_folk','jazz_gtr_comp'],
  'Alternative R&B'         :['arp_folk','jazz_gtr_comp'],
  /* 스윙 30 에 EP 9화음 */
  '90s R&B'                 :['soul_prog','soul_chank'],
  'Hip Hop Soul'            :['soul_prog','soul_chank'],
  /* 808 에 R&B 보컬 */
  'Trap Soul'               :['edm_arp','edm_alt'],
  /* 125~130 BPM 의 빠른 백비트에 합창 훅 */
  'Motown'                  :['soul_chank','funk_cut'],
  'Northern Soul'           :['soul_chank','funk_cut'],
  /* 현과 하프의 스위트 사운드 */
  'Philadelphia Soul'       :['soul_prog','arp_folk'],
  /* 혼 섹션이 거칠게 밀고 오르간이 받친다 */
  'Memphis Soul'            :['soul_chank','funk_cut'],
  /* 와우 기타와 오르간 */
  'Psychedelic Soul'        :['funk_groove','funk_cut'],
  /* 현이 옥타브로 오르내리고 베이스가 근음과 옥타브를 왕복한다 */
  'Disco'                   :['funk_cut','funk_groove'],
  'Euro Disco'              :['funk_cut','funk_groove'],
  /* 124~134 BPM 에 신스 리드 */
  'Hi-NRG'                  :['edm_arp','edm_alt'],
  'Italo Disco'             :['edm_arp','edm_alt'],
  /* 스윙 30 에 혼과 피아노 */
  'Rhythm & Blues'          :['rock_drive','jazz_gtr_swing'],
  /* F. Jazz · Roots · Regional (계열 F·G·K) — 2026-09-15 배치 A11
     32종 → 18무리.
     근거: genres/profiles/*.json · 수치는 재료 실측에서 나왔다 */
  /* 워킹 베이스에 스윙 */
  'West Coast Jazz'         :['jazz_gtr_swing','jazz_gtr_comp'],
  'Soul Jazz'               :['jazz_gtr_swing','jazz_gtr_comp'],
  /* 프렛리스에 13화음 */
  'Jazz Fusion'             :['jazz_gtr_comp','funk_groove'],
  /* 색소폰이 패드 위를 걷는다 */
  'Smooth Jazz'             :['jazz_gtr_comp','arp_swing'],
  /* 와우 기타와 오르간에 스윙 30 */
  'Acid Jazz'               :['jazz_gtr_comp','funk_groove'],
  /* 170~190 BPM 에 클라베 */
  'Latin Jazz'              :['latin_montuno','latin_montuno_alt'],
  'Afro-Cuban Jazz'         :['latin_montuno','latin_montuno_alt'],
  /* 나일론 기타에 긴 음 */
  'Bossa Jazz'              :['latin_montuno_loop','arp_swing'],
  'Samba Jazz'              :['latin_montuno_loop','arp_swing'],
  /* 스윙 30~50 의 셔플에 하모니카·크런치 기타 */
  'Chicago Blues'           :['rock_power','arp_country'],
  'Electric Blues'          :['rock_power','arp_country'],
  'Texas Blues'             :['rock_power','arp_country'],
  /* 160 BPM 에 혼 섹션과 업라이트 */
  'Jump Blues'              :['jazz_gtr_swing','rock_drive'],
  /* 스윙 0 의 스트레이트 */
  'Blues Rock'              :['rock_power','rock_drive'],
  /* 90 BPM 에 리조네이터와 덜시머 */
  'Country Blues'           :['arp_country','arp_folk'],
  /* 붐칙 베이스에 피아노·밴조 */
  'Honky-tonk'              :['arp_country','rock_drive'],
  'Old-time / Hillbilly'    :['arp_country','rock_drive'],
  /* 150 BPM 에 만돌린 트레몰로 */
  'Bluegrass'               :['arp_country','arp_swing'],
  /* 현과 합창으로 컨트리를 팝으로 다듬은 자리 */
  'Nashville Sound'         :['arp_country','arp_folk'],
  'Countrypolitan'          :['arp_country','arp_folk'],
  'Country Pop'             :['arp_country','arp_folk'],
  /* 내슈빌의 매끈함을 거부한 계보 */
  'Outlaw Country'          :['arp_country','rock_alt'],
  'Alt-country'             :['arp_country','rock_alt'],
  'Americana'               :['arp_country','rock_alt'],
  /* 크런치 기타에 신스 리드 */
  'Bro-country'             :['rock_power','rock_drive'],
  /* 스틸 기타 아르페지오에 업라이트 */
  'Folk Revival'            :['arp_folk','arp_country'],
  'Indie Folk'              :['arp_folk','arp_country'],
  /* 12현에 드럼이 들어온다 */
  'Folk Rock'               :['rock_alt','arp_folk'],
  /* 오르간 코드 스웰과 합창 */
  'Gospel'                  :['soul_chank','soul_prog'],
  /* 아코디언과 워시보드에 140 BPM */
  'Zydeco / Cajun'          :['arp_country','funk_cut'],
  /* 돌 리듬에 시타르 */
  'Bhangra'                 :['arp_folk','highlife_gtr'],
  /* 여러 지역 타악을 베이스 뮤직 위에 얹는다 */
  'Global Bass'             :['skank_up','latin_montuno'],
  /* E. Electronic 나머지 (계열 E) — 2026-09-15 배치 A12
     39종 → 17무리.
     근거: genres/profiles/*.json · 수치는 재료 실측에서 나왔다 */
  /* 플럭 몇 음이 루프를 돈다 */
  'Techno'                  :['edm_arp'],
  'Hardgroove'              :['edm_arp'],
  'Microhouse'              :['edm_arp'],
  /* 패드 코드가 길게 깔린다 */
  'Detroit Techno'          :['arp_folk','edm_arp'],
  'Dub Techno'              :['arp_folk','edm_arp'],
  /* 303 이 선율을 맡는다 */
  'Acid Techno'             :['edm_arp'],
  /* 150~155 BPM 에 왜곡 리드 */
  'Hard Techno'             :['edm_build','metal_riff'],
  'Schranz'                 :['edm_build','metal_riff'],
  'Industrial'              :['edm_build','metal_riff'],
  /* 벨 한두 음이 16분 격자에서 자리를 바꾼다 */
  'Minimal Techno'          :['edm_arp'],
  /* 174 BPM 이지만 화성은 하프타임으로 느리게 흐른다 */
  'Drum & Bass'             :['arp_folk','edm_arp'],
  'Liquid Funk'             :['arp_folk','edm_arp'],
  'Halftime DnB'            :['arp_folk','edm_arp'],
  /* 리스 베이스가 주역이고 신스가 위에서 쏘아 댄다 */
  'Neurofunk'               :['edm_build','edm_alt'],
  'Techstep'                :['edm_build','edm_alt'],
  'Jump-up'                 :['edm_build','edm_alt'],
  /* 브레이크를 잘게 썬 것이 몸이라 건반은 자리를 비운다 */
  'Jungle'                  :['edm_arp'],
  'Drumfunk'                :['edm_arp'],
  /* 펑크 브레이크에 록 기타 */
  'Big Beat'                :['funk_cut','rock_power'],
  'Nu Skool Breaks'         :['funk_cut','rock_power'],
  /* 슈퍼소우가 긴 상행으로 쌓아 올린다 */
  'Trance'                  :['edm_build','edm_arp'],
  'Uplifting Trance'        :['edm_build','edm_arp'],
  'Hard Trance'             :['edm_build','edm_arp'],
  /* 303 계열 베이스가 16분을 쉬지 않고 구른다 */
  'Psytrance'               :['edm_arp','edm_alt'],
  'Goa'                     :['edm_arp','edm_alt'],
  'Full-on'                 :['edm_arp','edm_alt'],
  'Forest'                  :['edm_arp','edm_alt'],
  'Hi-tech'                 :['edm_arp','edm_alt'],
  /* 리버스 베이스에 앤섬 리드 */
  'Hardstyle'               :['edm_build','edm_alt'],
  'Rawstyle'                :['edm_build','edm_alt'],
  /* 132 BPM 에 패드가 천천히 열린다 */
  'Progressive Trance'      :['edm_arp','arp_folk'],
  /* 180~205 BPM 에 왜곡 킥 */
  'Gabber'                  :['edm_build','metal_riff'],
  'Hardcore Techno'         :['edm_build','metal_riff'],
  'Frenchcore'              :['edm_build','metal_riff'],
  /* 피아노 스탭에 밝은 훅 */
  'Happy Hardcore'          :['edm_build','edm_arp'],
  'Breakbeat Hardcore'      :['edm_build','edm_arp'],
  /* 디스코를 현대 장비로 다시 만든 자리 */
  'Nu-disco'                :['funk_cut','funk_groove'],
  /* 808 에 보코더 */
  'Electro'                 :['edm_alt','edm_arp'],
  'Electroclash'            :['edm_alt','edm_arp'],
  /* H. Latin (계열 H) — 2026-09-15 배치 A13
     39종 → 17무리.
     근거: genres/profiles/*.json · 수치는 재료 실측에서 나왔다 */
  /* 뎀보우 리듬이 정체성이고 건반은 벨 두세 음뿐 */
  'Reggaeton'               :['skank_offbeat','latin_montuno'],
  'Dembow'                  :['skank_offbeat','latin_montuno'],
  /* 레키토 기타 아르페지오가 선율을 맡는다 */
  'Bachata'                 :['arp_folk','latin_montuno'],
  /* 혼 섹션이 빠른 2박 위를 달린다 */
  'Merengue'                :['latin_montuno_alt','latin_montuno'],
  'Bomba'                   :['latin_montuno_alt','latin_montuno'],
  'Plena'                   :['latin_montuno_alt','latin_montuno'],
  /* 아코디언이 리드이고 92~105 BPM 으로 느긋하다 */
  'Cumbia'                  :['latin_montuno','arp_folk'],
  'Vallenato'               :['latin_montuno','arp_folk'],
  'Cumbia Sonidera'         :['latin_montuno','arp_folk'],
  /* 쿰비아에 서프 기타와 아프로 기타가 들어온다 */
  'Chicha'                  :['latin_montuno_loop','highlife_gtr'],
  'Champeta'                :['latin_montuno_loop','highlife_gtr'],
  'Cumbia Villera'          :['latin_montuno_loop','highlife_gtr'],
  /* 반도네온이 하행으로 끌어내린다 */
  'Tango'                   :['latin_montuno_alt','arp_swing'],
  'Nuevo Tango'             :['latin_montuno_alt','arp_swing'],
  'Electrotango'            :['latin_montuno_alt','arp_swing'],
  /* 트레스와 피아노 몬투노가 클라베 위를 돈다 */
  'Son Cubano'              :['latin_montuno','latin_montuno_loop'],
  'Songo'                   :['latin_montuno','latin_montuno_loop'],
  'Cha-cha-chá'             :['latin_montuno','latin_montuno_loop'],
  /* 180~200 BPM 에 혼 섹션 */
  'Salsa'                   :['latin_montuno_alt','latin_montuno'],
  'Timba'                   :['latin_montuno_alt','latin_montuno'],
  'Mambo'                   :['latin_montuno_alt','latin_montuno'],
  'Mozambique'              :['latin_montuno_alt','latin_montuno'],
  /* 타악과 창이 몸이라 화성 악기가 거의 안 움직인다 */
  'Rumba'                   :['latin_montuno_loop','skank_offbeat'],
  'Rumba Yambú'             :['latin_montuno_loop','skank_offbeat'],
  'Rumba Columbia'          :['latin_montuno_loop','skank_offbeat'],
  /* 트랩 골격에 스페인어 */
  'Latin Trap'              :['edm_arp','edm_alt'],
  /* 레게톤을 느리고 흐릿하게 */
  'Neoperreo'               :['edm_arp','arp_folk'],
  'Sad Perreo'              :['edm_arp','arp_folk'],
  /* 나일론 기타의 싱코페 컴핑에 9화음 */
  'Bossa Nova'              :['latin_montuno_loop','arp_swing'],
  'Partido Alto'            :['latin_montuno_loop','arp_swing'],
  'Pagode'                  :['latin_montuno_loop','arp_swing'],
  /* 아코디언·자붐바에 삼각철 */
  'Forró'                   :['arp_country','latin_montuno'],
  'Baião'                   :['arp_country','latin_montuno'],
  /* 타악과 808 이 전부다 */
  'Baile Funk'              :['edm_alt','latin_montuno_loop'],
  'Funk Mandelão'           :['edm_alt','latin_montuno_loop'],
  'Bruxaria'                :['edm_alt','latin_montuno_loop'],
  /* 트럼펫 두 대가 화음으로 운다 */
  'Mariachi'                :['arp_folk','latin_montuno'],
  /* 140 BPM 에 관악대와 투바 */
  'Banda'                   :['arp_country','latin_montuno_alt'],
  'Norteño'                 :['arp_country','latin_montuno_alt'],
  /* I. Caribbean · African (계열 I·J) — 2026-09-15 배치 A14
     37종 → 17무리.
     근거: genres/profiles/*.json · 수치는 재료 실측에서 나왔다 */
  /* 75~80 BPM 에 원드롭 */
  'Roots Reggae'            :['skank','skank_offbeat'],
  'Reggae One Drop'         :['skank','skank_offbeat'],
  'Rockers'                 :['skank','skank_offbeat'],
  'Steppers'                :['skank','skank_offbeat'],
  /* EP 와 현이 깔린 부드러운 레게 */
  'Lovers Rock'             :['skank','arp_folk'],
  /* 140 BPM 에 혼 섹션과 워킹 베이스 */
  'Ska'                     :['skank_up','skank'],
  /* 스카와 레게 사이의 90~115 BPM */
  'Rocksteady'              :['skank','arp_country'],
  'Mento'                   :['skank','arp_country'],
  /* 155~168 BPM 에 스틸팬과 관악 */
  'Soca'                    :['skank_up','skank_offbeat'],
  'Power Soca'              :['skank_up','skank_offbeat'],
  /* 125~145 BPM 으로 소카보다 느긋하다 */
  'Calypso'                 :['skank_up','latin_montuno'],
  'Groovy Soca'             :['skank_up','latin_montuno'],
  'Chutney Soca'            :['skank_up','latin_montuno'],
  /* EP 9화음에 부드러운 싱코페 */
  'Zouk'                    :['skank_offbeat','arp_folk'],
  'Kompa'                   :['skank_offbeat','arp_folk'],
  'Zouk Love'               :['skank_offbeat','arp_folk'],
  /* 135 BPM 에 신스 리드와 스틸팬 */
  'Bouyon'                  :['skank_up','edm_alt'],
  /* 벨과 셰이커가 16분을 짜고 스윙 26 이 붙는다 */
  'Afrobeats'               :['highlife_gtr','highlife_loop'],
  'Hiplife'                 :['highlife_gtr','highlife_loop'],
  'Coupé-décalé'            :['highlife_gtr','highlife_loop'],
  /* 혼 섹션에 스윙 30 */
  'Highlife'                :['highlife_gtr','highlife_loop'],
  'Fuji'                    :['highlife_gtr','highlife_loop'],
  /* 크런치 기타가 순환 리프를 돈다 */
  'Desert Blues'            :['rock_alt','highlife_loop'],
  /* 느린 하우스에 타악이 얹힌다 */
  'Kwaito'                  :['edm_arp','highlife_loop'],
  'Gqom'                    :['edm_arp','highlife_loop'],
  'Afro Tech'               :['edm_arp','highlife_loop'],
  /* 오르간·색소폰이 순환 화성을 돈다 */
  'Mbaqanga'                :['highlife_gtr','funk_cut'],
  'Marabi'                  :['highlife_gtr','funk_cut'],
  /* **기타 세 대가 얽히는 세베네가 정체성**이다 */
  'Soukous'                 :['highlife_gtr','highlife_loop'],
  'Ndombolo'                :['highlife_gtr','highlife_loop'],
  'Congolese Rumba'         :['highlife_gtr','highlife_loop'],
  /* 스윙 50 에 5음계 모드 */
  'Ethio-jazz'              :['jazz_gtr_comp','jazz_gtr_swing'],
  /* 힙합·댄스홀이 동아프리카에서 만난 자리 */
  'Bongo Flava'             :['highlife_loop','skank_offbeat'],
  'Gengetone'               :['highlife_loop','skank_offbeat'],
  /* 아코디언과 나일론에 장식음이 많다 */
  'Raï'                     :['arp_folk','latin_montuno'],
  'Shaabi'                  :['arp_folk','latin_montuno'],
  'Mahraganat'              :['arp_folk','latin_montuno'],
};

/** 지금 걸린 프리셋에 어울리는 기타 리프 이름 목록 */
function riffPoolFor(name){
  const own=RIFF_KIT_PRESET[name];
  if(own) return own;
  const sub=RIFF_KIT[PRESET_SUB[name]];
  if(sub) return sub;
  return RIFF_KIT_CAT[poolCatFor(name)] || ['rock_power'];
}


/* ═══ 베이스 16마디 라인 ═══════════════════════════════════════
   기타·건반만 16마디로 돌고 베이스는 한 마디를 반복하고 있었습니다.
   실제 곡은 베이스도 16마디 안에서 움직입니다 — 특히 4마디째에
   다음 덩어리로 넘겨주는 경과음이 들어갑니다.

   표기는 기타 리프와 같습니다 (bpat). 0~7 = 도수, - = 쉼.
   건반 선율·기타 리프와 **같은 melBar** 를 봅니다. */
const BASS_PHRASE = {
  /* A = 낮은 층, B = 높은 층. 4마디째 경과음으로 다음 덩어리에 넘긴다.
     근음 반복(⑨)과 좁은 음역(⑤)은 베이스의 몸이라 그대로 둔다. */

  /* 록 — 4분 근음 */
  brockA:['0---0---0---0---','0---0---0-0-1---','2---2---2---2---','1---1---0-------'],
  brockB:['2---2---2---2---','3---3---2---2---','4---4---3---3---','2---1---0-------'],

  /* 메탈 — 기타를 그대로 따라가는 16분 연타 */
  bmetA :['00-00-0-00-00-0-','00-00-0-00-00-1-','22-22-2-22-22-1-','00-00-0-1-0-----'],
  bmetB :['22-22-2-22-22-2-','33-33-3-22-22-2-','44-44-4-33-33-3-','22-11-0---------'],

  /* 펑크 — 16분 싱코페 + 도약 */
  bfunA :['0--0-0--1--0-0--','0--0-0--1--0-1--','2--2-2--3--2-2--','1--1--0---------'],
  bfunB :['2--2-2--3--2-2--','3--3-3--2--2-2--','4--4-4--3--3-3--','2--1--0---------'],

  /* 워킹 — 재즈. 4분 순차진행으로 다음 코드에 이어 준다 */
  bwalA :['0---1---2---3---','4---3---2---1---','0---1---2---3---','2---1---0-------'],
  bwalB :['2---3---4---5---','6---5---4---3---','2---3---4---3---','2---1---0-------'],

  /* 디스코 — §10 예외. 근음↔옥타브 왕복이 정체성 */
  bdisA :['0-7-0-7-0-7-0-7-','0-7-0-7-1-7-1-7-','2-7-2-7-1-7-1-7-','1-7-0-----------'],
  bdisB :['2-7-2-7-2-7-2-7-','3-7-3-7-2-7-2-7-','4-7-4-7-3-7-3-7-','2-7-0-----------'],

  /* 레게 — 성기고 선율적 */
  bregA :['0-------0---1---','0-------0---2---','2-------2---1---','0-------0-------'],
  bregB :['2-------2---3---','3-------3---2---','2-------2---1---','0---------------'],

  /* 808 — §10 예외. 한 음을 길게, 4마디째에만 움직임 */
  b808A :['0---------------','0---------1-----','2---------------','1---------0-----'],
  b808B :['2---------------','3---------2-----','1---------------','0---------------'],

  /* 컨트리 — 근음↔5도 붐칙 */
  bcouA :['0---2---0---2---','0---2---1---2---','2---4---2---4---','1---2---0-------'],
  bcouB :['2---4---2---4---','3---5---2---4---','4---6---3---5---','2---1---0-------'],

  /* 하우스 — 킥 사이 엇박. 정박은 킥에 양보 */
  bhouA :['--0---0---0---0-','--0---0---1---1-','--2---2---1---1-','--1---0---------'],
  bhouB :['--2---2---2---2-','--3---3---2---2-','--4---4---3---3-','--2---0---------'],

  /* 툼바오 — 다음 마디를 미리 당겨 치는 것이 핵심 */
  blatA :['0-----0-1-----0-','0-----0-2-----1-','2-----2-3-----2-','1-----1-0-------'],
  blatB :['2-----2-3-----2-','3-----3-4-----3-','4-----4-3-----2-','1-----1-0-------'],

  /* 아프리카 — 최면적인 한 음 반복(00-analysis.md §2 J: "짧은 모티프가 겹침").
     BLINE_KIT_CAT J 가 여태 펑크·라틴으로 대체되고 있었다(§ 아래 KIT 주석). */
  bafrA :['0---0---0---0---','0---0---0---1---','2---2---2---1---','0---0-----------'],
  bafrB :['2---2---2---2---','2---2---2---3---','4---4---4---3---','2---2-----------'],
};

function buildBass(a,b,form){
  const pair=[BASS_PHRASE[a], BASS_PHRASE[b]];
  const seen=[0,0];
  return (FORM[form]||FORM.AABA).flatMap(i => {
    const p=pair[i].slice();
    if(seen[i]++) p[3]=pair[1-i][3];
    return p;
  });
}

const BLINE_SRC = [
  /* 폼을 한 개씩 더 걸었다(각 쌍 3폼) — BLINE 20종이 MELODY 92종 대비
     심하게 적다는 지적(melody/00-analysis.md)에 따른 보강.
     bmet 은 손대지 않았다 — 메탈 베이스는 기타를 그대로 따라가는 연타라
     AABA 로 튼다고 새로운 인상을 안 준다(§10 예외, 연타형). */
  ['brockA','brockB',{AABA:'록 근음',    AABB:'록 진행',    ABAB:'록 교대'}],
  ['bmetA','bmetB',  {AAAB:'메탈 연타',  AABB:'메탈 갤럽'}],
  ['bfunA','bfunB',  {AABB:'펑크 싱코페',ABAB:'펑크 옥타브',AAAB:'펑크 반복'}],
  ['bwalA','bwalB',  {ABAB:'재즈 워킹',  AABA:'워킹 회귀',  AABB:'워킹 진행'}],
  ['bdisA','bdisB',  {AABB:'디스코 옥타브',ABAB:'디스코 교대',AAAB:'디스코 반복'}],
  ['bregA','bregB',  {AABA:'레게 성긴',  AABB:'레게 진행',  ABAB:'레게 교대'}],
  ['b808A','b808B',  {AAAB:'808 롱',     AABA:'808 슬라이드',AABB:'808 진행'}],
  ['bcouA','bcouB',  {AABB:'컨트리 붐칙',AABA:'붐칙 회귀',  ABAB:'붐칙 교대'}],
  ['bhouA','bhouB',  {AAAB:'하우스 엇박',AABB:'하우스 진행',ABAB:'하우스 교대'}],
  ['blatA','blatB',  {AABB:'라틴 툼바오',ABAB:'툼바오 교대',AABA:'툼바오 회귀'}],
  /* 새 재료 — 아프리카 계열엔 여태 전용 베이스가 없어 펑크·라틴으로
     대체되고 있었다(§ 아래 KIT_CAT 주석). */
  ['bafrA','bafrB',  {AABB:'아프로 반복', AAAB:'아프로 순환'}],
];
const BLINE = {};
BLINE_SRC.forEach(([a,b,forms]) => {
  const base=a.replace(/A$/,'');
  for(const [form,label] of Object.entries(forms))
    BLINE[base+'_'+form.toLowerCase()] = {label, bars:buildBass(a,b,form)};
});
const BLINE_NAMES = Object.keys(BLINE);
Object.values(BLINE).forEach(l => { l.rows = l.bars.map(bpat); });

const BLINE_KIT_CAT = {
  A:['brock_aaba','brock_aabb'], B:['brock_aabb','bdis_aabb'],
  C:['b808_aaab','b808_aaba'],   D:['bfun_aabb','bdis_aabb'],
  E:['bhou_aaab','bdis_abab'],   F:['bwal_abab','bwal_aaba'],
  G:['bcou_aabb','bcou_aaba'],   H:['blat_aabb','blat_abab'],
  I:['breg_aaba','breg_aabb'],   J:['bafr_aabb','bafr_aaab'],
  K:['blat_abab','bcou_aabb'],   X:['brock_aaba'],
};
const BLINE_KIT = {
  'Metal':['bmet_aaab','bmet_aabb'], 'Hard Rock':['brock_aaba','bmet_aabb'],
  'Punk':['brock_aabb','bmet_aaab'],
  'Funk':['bfun_aabb','bfun_abab'],  'Disco':['bdis_aabb','bfun_abab'],
  'Soul':['bfun_aabb','bdis_aabb'],
  'Bebop 계보':['bwal_abab','bwal_aaba'], 'Latin Jazz':['blat_aabb','bwal_abab'],
  'Fusion 계보':['bfun_abab','bwal_abab'], '현대 갈래':['bwal_aaba','bwal_abab'],
  'House 계열':['bhou_aaab','bhou_aabb'], 'Techno 계열':['bhou_aaab'],
  'Trance 계열':['bhou_aabb','bdis_abab'],
  'Trap 계열':['b808_aaab','b808_aaba'],  'Drill':['b808_aaba','b808_aaab'],
  'Southern':['b808_aaab'], 'Lo-fi':['bwal_aaba','breg_aaba'],
  'Country':['bcou_aabb','bcou_aaba'],    'Folk':['bcou_aaba','bwal_aaba'],
  'Blues':['bcou_aabb','bwal_aaba'],
  'Reggae 갈래':['breg_aaba','breg_aabb'],'자메이카':['breg_aabb','breg_aaba'],
  '쿠바':['blat_aabb','blat_abab'],       '브라질':['blat_abab','bwal_aaba'],
  '멕시코':['bcou_aabb','blat_aabb'],     '콜롬비아':['blat_abab','blat_aabb'],
  '서아프리카':['bafr_aabb','bafr_aaab'], '동아프리카':['bafr_aaab','bafr_aabb'],

  /* ── 2026-09-14 · 빈 하위분기를 채웠다 ────────────────────────────
     RIFF_KIT 과 같은 일이다. 위 28개만 등록돼 있어 나머지 37개 분기
     177종이 계열 기본값으로 몰렸고, `bhou_aaab|bdis_abab` 하나를
     **43종**이, `brock_aabb|bdis_aabb` 를 39종이, `brock_aaba|brock_aabb`
     를 26종이 썼다. 있던 31종을 제 자리에 연결한 것이고 새 라인은 없다. */

  /* E. 일렉트로닉 — 베이스가 장르 그 자체인 자리가 많다 */
  'Dubstep · Bass Music':['b808_aabb','bhou_aaab'],   // 서브가 길게 움직인다
  'Breakbeat 계열':['bfun_abab','bhou_aaab'],         // 펑크 브레이크에서 왔다
  'Hardcore 계열':['bhou_aaab','bmet_aaab'],          // 킥과 베이스가 한 덩어리
  'Electro':['b808_aaab','bdis_abab'],
  'Downtempo · Ambient · Retro':['bdis_aabb','breg_aaba'],

  /* C. 힙합 */
  '뿌리 · 골든에이지':['bfun_aabb','bwal_aaba'],      // 샘플 출처가 펑크·재즈 업라이트다
  'Contemporary R&B':['bfun_abab','b808_aaba'],
  'West Coast':['bfun_abab','b808_aaab'],             // G-Funk 의 미끄러지는 베이스
  'UK 계열':['b808_aaab','bhou_aaab'],
  'Cloud · Emo 계열':['b808_aabb','brock_aabb'],
  '지역화 파생':['b808_aaba','blat_abab'],

  /* A·B. 록·팝 */
  'Alternative':['brock_aabb','brock_abab'],
  'Post-punk 계보':['brock_abab','bdis_abab'],        // 베이스가 선율을 맡는 계열
  'Psychedelic · Krautrock':['brock_abab','brock_aaba'],
  '뿌리':['bwal_aabb','bcou_aabb'],                   // 로큰롤 부기 — 워킹에 가깝다
  '루츠와의 교차':['bcou_aabb','brock_aabb'],
  'Teen Pop · Indie Pop':['brock_aabb','bdis_aabb'],
  'Dance-pop 계보':['bdis_aabb','bhou_aabb'],
  'Synth-pop 계보':['bdis_abab','bhou_aabb'],
  'Soft Rock · AOR 계보':['bdis_aabb','bwal_aabb'],
  '지역 팝':['bdis_aabb','brock_aabb'],
  '동아시아':['bdis_aabb','brock_aabb'],

  /* H·I. 라틴·카리브 */
  '푸에르토리코 · 도미니카':['blat_aabb','b808_aaab'],// 뎀보우는 808 과 툼바오 사이다
  '아르헨티나 · 남미 남부':['bwal_aabb','blat_aaba'], // 탱고의 걸어다니는 베이스
  '현대 크로스오버':['b808_aaba','blat_abab'],
  'Dancehall 계보':['breg_aaba','b808_aaab'],
  '트리니다드 · 바베이도스':['breg_aabb','blat_aabb'],
  '프랑스어권 카리브':['breg_aabb','blat_abab'],

  /* J·K. 아프리카·기타 지역 */
  '중앙아프리카':['bafr_aaab','bafr_aabb'],
  '북아프리카':['bafr_aabb','blat_aabb'],
  '남아프리카':['bafr_aabb','bhou_aaab'],             // 아마피아노의 로그드럼 베이스
  'Gospel · 지역 장르':['bfun_aabb','bwal_aaba'],
  '남아시아':['blat_aabb','bafr_aabb'],
  '서아시아 · 지중해':['blat_aaba','bafr_aabb'],
  '동유럽 · 발칸':['bwal_aabb','blat_aabb'],
  '하이브리드 · 인터넷 장르':['blat_abab','bhou_aaab'],
};

/* 프리셋이 직접 정한 베이스 풀. 위 둘과 같은 규칙이다. */
const BLINE_KIT_PRESET = {
  /* E. House 계열 — 배치 A4. 베이스 엔진이 이미 여섯 갈래로 갈려 있었다
     (acid · reese · sub · moog · pluckbs · finger) — 라인만 하나였다 */
  'House'                 :['bhou_aabb','bdis_aabb'],    // 디스코 뿌리
  'Chicago House'         :['bhou_aabb','bdis_aabb'],
  'Garage House'          :['bhou_aabb','bdis_aabb'],
  'French House'          :['bdis_aabb','bdis_abab'],    // 디스코 옥타브 루프
  'Filter House'          :['bdis_aabb','bdis_abab'],
  'Deep House'            :['bhou_aaab','bhou_abab'],
  'Melodic House & Techno':['bhou_aaab','bhou_abab'],
  'Tech House'            :['bhou_aaab','bhou_abab'],
  'Future House'          :['bhou_aaab','bhou_abab'],
  'UK Garage'             :['bfun_abab','bhou_abab'],    // 개러지 베이스는 쪼갠다
  '2-step Garage'         :['bfun_abab','bhou_abab'],
  'Speed Garage'          :['bfun_abab','bhou_abab'],
  'UK Funky'              :['bfun_abab','bafr_aabb'],
  'Bassline'              :['bfun_abab','bmet_aaab'],    // 리스 베이스 — 연타에 가깝다
  'Big Room'              :['bhou_aaab','bmet_aaab'],
  'Complextro'            :['bhou_aaab','bmet_aaab'],
  'Bass House'            :['bhou_aaab','bmet_aaab'],
  'Electro House'         :['bhou_aaab','bmet_aaab'],
  'Progressive House'     :['bhou_aaab','bmet_aaab'],
  'Acid House'            :['bhou_abab','bhou_aaab'],    // 303 은 쉬지 않고 움직인다
  'Tribal House'          :['bafr_aabb','bhou_aaab'],
  'Amapiano'              :['bafr_aabb','bhou_aaab'],    // 로그드럼 — 분류가 House 라 여기서 잡는다
  'Afro House'            :['bafr_aabb','bhou_aaab'],

  /* E. Dubstep · Bass Music — 배치 A5. 베이스가 장르 그 자체인 계열이다 */
  'Dubstep'               :['b808_aabb','breg_aaba'],  // 분위기형 — 길게 끌고 성글게
  'Deep Dubstep'          :['b808_aabb','breg_aaba'],
  'Meditative Dubstep'    :['b808_aabb','breg_aaba'],
  'Future Garage'         :['b808_aabb','breg_aaba'],
  'Wave'                  :['b808_aabb','breg_aaba'],
  'Brostep'               :['bmet_aaab','bhou_aaab'],  // 공격형 — 워블은 연타에 가깝다
  'Riddim'                :['bmet_aaab','bhou_aaab'],
  'Hardwave'              :['bmet_aaab','bhou_aaab'],
  'Future Bass'           :['bhou_aabb','bdis_aabb'],  // 선율형 — 화음을 따라 움직인다
  'Melodic Dubstep'       :['bhou_aabb','bdis_aabb'],
  'EDM Trap'              :['b808_aaab','b808_aaba'],  // 트랩 파생 — 트랩 계열과 같다
  'Festival Trap'         :['b808_aaab','b808_aaba'],
  'Jersey Club'           :['bfun_abab','b808_aaab'],  // 클럽 — 쪼갠 싱코페
  'Baltimore Club'        :['bfun_abab','b808_aaab'],
  'Philly Club'           :['bfun_abab','b808_aaab'],
  'Moombahton'            :['blat_aabb','breg_aabb'],  // 뎀보우

  /* E. Downtempo · Ambient · Retro — 배치 A6 */
  'Vaporwave'             :['breg_aaba','b808_aabb'],  // 아주 느리고 길게
  'Mallsoft'              :['breg_aaba','b808_aabb'],
  'Downtempo'             :['bdis_aabb','breg_aaba'],
  'Chillout'              :['bdis_aabb','breg_aaba'],
  'Ambient Techno'        :['bdis_aabb','breg_aaba'],
  'Balearic'              :['blat_aaba','bcou_aaba'],
  'Trip Hop'              :['bwal_aaba','breg_aaba'],
  'Nu Jazz'               :['bwal_abab','bwal_aabb'],  // 업라이트 — 워킹이 정체성이다
  'Lounge'                :['bwal_abab','bwal_aabb'],
  'Synthwave'             :['bdis_abab','bhou_aabb'],  // 80년대 옥타브
  'Future Funk'           :['bdis_aabb','bfun_abab'],
  /* A. Rock 계열 34종 — 2026-09-15 배치 A7 → 2026-09-16 대표곡 교정
     (genres/profiles/01-A-rock.json). 근거는 웹에서 실재·장르 분류를 확인한
     대표곡이다(genres/01-rock.md «대표곡» 표). 곡의 선율을 옮기지 않고 성질만 맞췄다. */
  'Motorik'                 :['brock_abab','brock_aaba'],
  'Krautrock'               :['brock_abab','brock_aaba'],
  'Psychedelic Rock'        :['brock_aaba','brock_abab'],
  'Acid Rock'               :['brock_aaba','brock_abab'],
  /* 긴 음이 아니라 킥에 붙은 반복 리프 */
  'Space Rock'              :['brock_aaba','brock_abab'],
  'Southern Rock'           :['bcou_aabb','bwal_aabb'],
  'Rock'                    :['brock_aaba','bmet_aabb'],
  'Glam Rock'               :['brock_aaba','bmet_aabb'],
  'Rock & Roll'             :['bwal_aabb','bcou_aabb'],
  'Surf Rock'               :['brock_aabb','bcou_aaba'],
  'Garage Rock'             :['brock_aabb','brock_aaba'],
  'Proto-punk'              :['brock_aabb','brock_aaba'],
  'Post-punk'               :['brock_abab','bdis_abab'],
  'Gothic Rock'             :['brock_abab','bdis_abab'],
  /* 근음 8분 — 선율 베이스는 Interpol 1곡뿐 */
  'Post-punk Revival'       :['brock_aabb','brock_aaba'],
  'Dance-punk'              :['bdis_abab','bfun_abab'],
  /* 근음 8분 페달, Heart of Glass 는 디스코 옥타브 */
  'New Wave'                :['brock_aabb','bdis_aabb'],
  'Emo'                     :['brock_abab','brock_aaba'],
  'Screamo'                 :['brock_abab','brock_aaba'],
  'Shoegaze'                :['brock_aabb','breg_aaba'],
  'Dream Pop'               :['brock_aabb','breg_aaba'],
  'Britpop'                 :['brock_aabb','bdis_aabb'],
  /* 베이스가 약하거나 없다(초기 Pavement) */
  'Lo-fi Indie'             :['brock_aaba'],
  /* 펑키한 선율 베이스(Salad Days) */
  'Slacker Rock'            :['bfun_aabb','brock_abab'],
  'Alternative Rock'        :['brock_aabb','bmet_aaab'],
  'Grunge'                  :['brock_aabb','bmet_aaab'],
  'Indie Rock'              :['brock_aabb','bmet_aaab'],
  'Noise Rock'              :['brock_aabb','bmet_aaab'],
  'Country Rock'            :['bcou_aabb','brock_aabb'],
  'Heavy Metal'             :['brock_aabb','bmet_aaab'],
  'NWOBHM'                  :['bmet_aabb'],
  'Black Metal'             :['bmet_aaab'],
  'Power Metal'             :['bmet_aabb','brock_aabb'],
  'Symphonic Metal'         :['brock_aabb','bmet_aaab'],
  /* B. Pop 계열 39종 — 2026-09-15 배치 A8 → 2026-09-16 대표곡 교정
     (genres/profiles/02-B-pop.json). 근거는 웹에서 실재·장르 분류를 확인한
     대표곡이다(genres/02-pop.md «대표곡» 표). 곡의 베이스을 옮기지 않고 성질만 맞췄다. */
  'EDM-pop'                 :['bdis_abab','bhou_aaab'],
  'Eurodance'               :['bdis_abab','bhou_aaab'],
  'Dance-pop'               :['bdis_aabb','bhou_aabb'],
  'Euro-pop'                :['bdis_aabb','bhou_aabb'],
  'Freestyle'               :['bdis_abab','bfun_abab'],
  'Hyperpop'                :['bhou_aaab','bmet_aaab'],
  'Digicore'                :['b808_aaab','bhou_aaab'],
  'Electropop'              :['bdis_abab','bhou_aabb'],
  'New Romantic'            :['bdis_abab','bhou_aabb'],
  'Retrowave'               :['bdis_abab','bdis_aaab'],
  'Synthwave'               :['bdis_abab','bdis_aaab'],
  'Traditional Pop'         :['bcou_aaba','bwal_aaba'],
  'Brill Building'          :['bwal_aabb','bcou_aabb'],
  'Teen Pop'                :['brock_aabb','bdis_aabb'],
  'Bubblegum'               :['brock_aabb','bdis_aabb'],
  'Indie Pop'               :['brock_aabb','breg_aaba'],
  'Twee Pop'                :['brock_aabb','breg_aaba'],
  'Bedroom Pop'             :['brock_aabb','breg_aaba'],
  'Chamber Pop'             :['bwal_aabb','bwal_aaba'],
  'Baroque Pop'             :['bwal_aabb','bwal_aaba'],
  'City Pop'                :['bfun_abab','bfun_aabb'],
  'Soft Rock'               :['bdis_aabb','bwal_aabb'],
  'AOR'                     :['bdis_aabb','bwal_aabb'],
  'J-pop'                   :['bdis_aabb','brock_aabb'],
  'Mandopop'                :['bdis_aabb','brock_aabb'],
  /* 초기 광둥어 팝은 거의 모든 곡이 하행 베이스라인이다 */
  'Cantopop'                :['bwal_aabb','bwal_aaba'],
  'Kayōkyoku'               :['bdis_aabb','brock_aabb'],
  'Enka'                    :['bwal_aaba','breg_aaba'],
  'Trot'                    :['bcou_aabb','bcou_aaba'],
  'Latin Pop'               :['blat_aabb','blat_abab'],
  'Schlager'                :['bdis_aabb','brock_aabb'],
  'Shibuya-kei'             :['bwal_aabb','blat_aabb'],
  'C-pop'                   :['blat_aabb','brock_aabb'],
  'Arabic Pop'              :['blat_aaba','bafr_aabb'],
  'Rumba Flamenca'          :['blat_aaba','bafr_aabb'],
  'Turbo-folk'              :['blat_aaba','bafr_aabb'],
  'Desi Beats'              :['bafr_aabb','blat_aabb'],
  'UK Bhangra'              :['bafr_aabb','blat_aabb'],
  'Tropical Bass'           :['breg_aabb','blat_abab'],
  /* C. Hip Hop (계열 C) — 2026-09-15 배치 A9 → 2026-09-17 대표곡 교정
     41종 → 27무리. 근거는 웹에서 실재·장르 분류를 확인한 대표곡이다
     (genres/03-hiphop.md «대표곡» 표). 곡의 베이스을 옮기지 않고 성질만 맞췄다. */
  'Boom Bap'                :['bwal_aaba','bfun_aabb'],
  'Golden Age'              :['bwal_aaba','bfun_aabb'],
  'Hardcore Hip Hop'        :['bwal_aaba','bfun_aabb'],
  'Horrorcore'              :['breg_aaba','bwal_aaba'],
  /* 더블베이스가 워킹으로 걷는다 — 이 장르의 몸이다 */
  'Jazz Rap'                :['bwal_abab','bwal_aaba'],
  /* 사람이 켠 일렉트릭 베이스가 곡을 끈다(808 은 여기서 드럼이다) */
  'Old School Hip Hop'      :['bfun_aabb','bfun_abab'],
  'Conscious Hip Hop'       :['breg_aaba','bwal_aaba'],
  'Trap'                    :['b808_aaab','b808_aaba'],
  'Mumble Rap'              :['b808_aaab','b808_aaba'],
  /* 두껍고 단단하고 «일정한» 808 — 미끄러지지 않는다 */
  'Plugg'                   :['b808_aaab','b808_aabb'],
  'Pluggnb'                 :['b808_aaba','b808_aabb'],
  'Melodic Trap'            :['b808_aaba','b808_aabb'],
  /* 통통 튀고 과포화되고 «탄력적인» 808 */
  'Rage'                    :['b808_aaab','bhou_aaab'],
  'Trap Metal'              :['b808_aaab','bmet_aaab'],
  'Lo-fi'                   :['bwal_aaba','breg_aaba'],
  'Chillhop'                :['bwal_aaba','breg_aaba'],
  'Jazzhop'                 :['bwal_abab','bwal_aabb'],
  'Grime'                   :['bhou_aaab','bmet_aaab'],
  'Afroswing'               :['bafr_aabb','breg_aabb'],
  'UK Rap'                  :['b808_aabb','breg_aaba'],
  'Road Rap'                :['b808_aabb','breg_aaba'],
  'UK Drill'                :['b808_aaba','b808_aaab'],
  'NY / Bronx Drill'        :['b808_aaba','b808_aaab'],
  'Chicago Drill'           :['b808_aaab','b808_aabb'],
  'Sample Drill'            :['b808_aabb','b808_aaab'],
  'Jersey Drill'            :['b808_aabb','bhou_abab'],
  'Phonk'                   :['b808_aaab','bmet_aaab'],
  'Memphis Rap'             :['b808_aaab','bmet_aaab'],
  'Drift Phonk'             :['b808_aaab','bmet_aaab'],
  /* 길게 끄는 서브가 아니라 짧게 찍는 스탭 */
  'Crunk'                   :['b808_aabb','bhou_aaab'],
  'Bounce'                  :['bfun_aabb','bfun_abab'],
  'Miami Bass'              :['bdis_abab','bhou_aaab'],
  'Booty Bass'              :['bdis_abab','bhou_aaab'],
  'Snap'                    :['b808_aabb','breg_aaba'],
  'G-Funk'                  :['bfun_abab','bfun_aabb'],
  'Hyphy'                   :['bhou_abab','bfun_abab'],
  'Jerk'                    :['bhou_abab','bfun_abab'],
  'Cloud Rap'               :['breg_aaba','b808_aabb'],
  'Emo Rap'                 :['b808_aaba','brock_aabb'],
  'SoundCloud Rap'          :['b808_aaba','brock_aabb'],
  'Brazilian Phonk'         :['blat_abab','b808_aaab'],
  /* D. R&B · Soul · Funk (계열 D) — 2026-09-15 배치 A10
     24종 → 16무리.
     근거: genres/profiles/*.json · 수치는 재료 실측에서 나왔다 */
  /* 클라비넷 16분에 슬랩 */
  'Funk'                    :['bfun_aabb','bfun_abab'],
  'JB Funk'                 :['bfun_aabb','bfun_abab'],
  /* 현이 옥타브로 오르내린다 */
  'Disco Funk'              :['bdis_aabb','bdis_abab'],
  'Post-disco'              :['bdis_aabb','bdis_abab'],
  /* 보코더와 무그가 앞에 선다 */
  'P-Funk'                  :['bfun_abab','bhou_aaab'],
  'Electro-funk'            :['bfun_abab','bhou_aaab'],
  /* 슬랩에 트럼펫과 EP */
  'Jazz-Funk'               :['bwal_abab','bfun_abab'],
  /* 디스코가 신스로 넘어간 자리 */
  'Boogie'                  :['bdis_abab','bdis_aaab'],
  /* 스윙 34 에 신스 브라스 */
  'New Jack Swing'          :['bfun_aaab','bhou_aabb'],
  /* 72~75 BPM */
  'Quiet Storm'             :['breg_aaba','bwal_aaba'],
  'Alternative R&B'         :['breg_aaba','bwal_aaba'],
  /* 스윙 30 에 EP 9화음 */
  '90s R&B'                 :['bfun_aabb','breg_aabb'],
  'Hip Hop Soul'            :['bfun_aabb','breg_aabb'],
  /* 808 에 R&B 보컬 */
  'Trap Soul'               :['b808_aaba','b808_aabb'],
  /* 125~130 BPM 의 빠른 백비트에 합창 훅 */
  'Motown'                  :['bfun_aabb','bwal_aabb'],
  'Northern Soul'           :['bfun_aabb','bwal_aabb'],
  /* 현과 하프의 스위트 사운드 */
  'Philadelphia Soul'       :['bfun_abab','bdis_aabb'],
  /* 혼 섹션이 거칠게 밀고 오르간이 받친다 */
  'Memphis Soul'            :['bfun_aabb','bcou_aabb'],
  /* 와우 기타와 오르간 */
  'Psychedelic Soul'        :['bfun_abab','bfun_aaab'],
  /* 현이 옥타브로 오르내리고 베이스가 근음과 옥타브를 왕복한다 */
  'Disco'                   :['bdis_aabb','bdis_abab'],
  'Euro Disco'              :['bdis_aabb','bdis_abab'],
  /* 124~134 BPM 에 신스 리드 */
  'Hi-NRG'                  :['bdis_abab','bhou_aaab'],
  'Italo Disco'             :['bdis_abab','bhou_aaab'],
  /* 스윙 30 에 혼과 피아노 */
  'Rhythm & Blues'          :['bwal_aabb','bcou_aabb'],
  /* F. Jazz · Roots · Regional (계열 F·G·K) — 2026-09-15 배치 A11
     32종 → 18무리.
     근거: genres/profiles/*.json · 수치는 재료 실측에서 나왔다 */
  /* 워킹 베이스에 스윙 */
  'West Coast Jazz'         :['bwal_abab','bwal_aaba'],
  'Soul Jazz'               :['bwal_abab','bwal_aaba'],
  /* 프렛리스에 13화음 */
  'Jazz Fusion'             :['bwal_aabb','bfun_abab'],
  /* 색소폰이 패드 위를 걷는다 */
  'Smooth Jazz'             :['bwal_aaba','bfun_aabb'],
  /* 와우 기타와 오르간에 스윙 30 */
  'Acid Jazz'               :['bwal_abab','bfun_abab'],
  /* 170~190 BPM 에 클라베 */
  'Latin Jazz'              :['blat_aabb','bwal_abab'],
  'Afro-Cuban Jazz'         :['blat_aabb','bwal_abab'],
  /* 나일론 기타에 긴 음 */
  'Bossa Jazz'              :['bwal_aaba','blat_aaba'],
  'Samba Jazz'              :['bwal_aaba','blat_aaba'],
  /* 스윙 30~50 의 셔플에 하모니카·크런치 기타 */
  'Chicago Blues'           :['bcou_aabb','bwal_aabb'],
  'Electric Blues'          :['bcou_aabb','bwal_aabb'],
  'Texas Blues'             :['bcou_aabb','bwal_aabb'],
  /* 160 BPM 에 혼 섹션과 업라이트 */
  'Jump Blues'              :['bwal_aabb','bwal_abab'],
  /* 스윙 0 의 스트레이트 */
  'Blues Rock'              :['brock_aabb','bcou_aabb'],
  /* 90 BPM 에 리조네이터와 덜시머 */
  'Country Blues'           :['bcou_aaba','bwal_aaba'],
  /* 붐칙 베이스에 피아노·밴조 */
  'Honky-tonk'              :['bcou_aabb','bcou_aaba'],
  'Old-time / Hillbilly'    :['bcou_aabb','bcou_aaba'],
  /* 150 BPM 에 만돌린 트레몰로 */
  'Bluegrass'               :['bcou_abab','bwal_aabb'],
  /* 현과 합창으로 컨트리를 팝으로 다듬은 자리 */
  'Nashville Sound'         :['bcou_aaba','bdis_aabb'],
  'Countrypolitan'          :['bcou_aaba','bdis_aabb'],
  'Country Pop'             :['bcou_aaba','bdis_aabb'],
  /* 내슈빌의 매끈함을 거부한 계보 */
  'Outlaw Country'          :['bcou_aabb','brock_aabb'],
  'Alt-country'             :['bcou_aabb','brock_aabb'],
  'Americana'               :['bcou_aabb','brock_aabb'],
  /* 크런치 기타에 신스 리드 */
  'Bro-country'             :['brock_aabb','bcou_aabb'],
  /* 스틸 기타 아르페지오에 업라이트 */
  'Folk Revival'            :['bcou_aaba','bwal_aaba'],
  'Indie Folk'              :['bcou_aaba','bwal_aaba'],
  /* 12현에 드럼이 들어온다 */
  'Folk Rock'               :['brock_aabb','bcou_aabb'],
  /* 오르간 코드 스웰과 합창 */
  'Gospel'                  :['bfun_aabb','bwal_aaba'],
  /* 아코디언과 워시보드에 140 BPM */
  'Zydeco / Cajun'          :['bcou_abab','bfun_aabb'],
  /* 돌 리듬에 시타르 */
  'Bhangra'                 :['bafr_aaab','blat_aabb'],
  /* 여러 지역 타악을 베이스 뮤직 위에 얹는다 */
  'Global Bass'             :['blat_abab','breg_aabb'],
  /* E. Electronic 나머지 (계열 E) — 2026-09-15 배치 A12
     39종 → 17무리.
     근거: genres/profiles/*.json · 수치는 재료 실측에서 나왔다 */
  /* 플럭 몇 음이 루프를 돈다 */
  'Techno'                  :['bhou_aaab','bhou_abab'],
  'Hardgroove'              :['bhou_aaab','bhou_abab'],
  'Microhouse'              :['bhou_aaab','bhou_abab'],
  /* 패드 코드가 길게 깔린다 */
  'Detroit Techno'          :['bhou_aabb','breg_aaba'],
  'Dub Techno'              :['bhou_aabb','breg_aaba'],
  /* 303 이 선율을 맡는다 */
  'Acid Techno'             :['bhou_abab','bhou_aaab'],
  /* 150~155 BPM 에 왜곡 리드 */
  'Hard Techno'             :['bmet_aaab','bhou_aaab'],
  'Schranz'                 :['bmet_aaab','bhou_aaab'],
  'Industrial'              :['bmet_aaab','bhou_aaab'],
  /* 벨 한두 음이 16분 격자에서 자리를 바꾼다 */
  'Minimal Techno'          :['bhou_abab','bhou_aabb'],
  /* 174 BPM 이지만 화성은 하프타임으로 느리게 흐른다 */
  'Drum & Bass'             :['b808_aabb','breg_aaba'],
  'Liquid Funk'             :['b808_aabb','breg_aaba'],
  'Halftime DnB'            :['b808_aabb','breg_aaba'],
  /* 리스 베이스가 주역이고 신스가 위에서 쏘아 댄다 */
  'Neurofunk'               :['bmet_aaab','bhou_aaab'],
  'Techstep'                :['bmet_aaab','bhou_aaab'],
  'Jump-up'                 :['bmet_aaab','bhou_aaab'],
  /* 브레이크를 잘게 썬 것이 몸이라 건반은 자리를 비운다 */
  'Jungle'                  :['breg_aaba','b808_aabb'],
  'Drumfunk'                :['breg_aaba','b808_aabb'],
  /* 펑크 브레이크에 록 기타 */
  'Big Beat'                :['bfun_abab','bfun_aabb'],
  'Nu Skool Breaks'         :['bfun_abab','bfun_aabb'],
  /* 슈퍼소우가 긴 상행으로 쌓아 올린다 */
  'Trance'                  :['bhou_aabb','bdis_abab'],
  'Uplifting Trance'        :['bhou_aabb','bdis_abab'],
  'Hard Trance'             :['bhou_aabb','bdis_abab'],
  /* 303 계열 베이스가 16분을 쉬지 않고 구른다 */
  'Psytrance'               :['bhou_abab','bhou_aaab'],
  'Goa'                     :['bhou_abab','bhou_aaab'],
  'Full-on'                 :['bhou_abab','bhou_aaab'],
  'Forest'                  :['bhou_abab','bhou_aaab'],
  'Hi-tech'                 :['bhou_abab','bhou_aaab'],
  /* 리버스 베이스에 앤섬 리드 */
  'Hardstyle'               :['bmet_aaab','bhou_aaab'],
  'Rawstyle'                :['bmet_aaab','bhou_aaab'],
  /* 132 BPM 에 패드가 천천히 열린다 */
  'Progressive Trance'      :['bhou_aabb','bhou_aaab'],
  /* 180~205 BPM 에 왜곡 킥 */
  'Gabber'                  :['bmet_aaab','bmet_aabb'],
  'Hardcore Techno'         :['bmet_aaab','bmet_aabb'],
  'Frenchcore'              :['bmet_aaab','bmet_aabb'],
  /* 피아노 스탭에 밝은 훅 */
  'Happy Hardcore'          :['bdis_abab','bhou_aaab'],
  'Breakbeat Hardcore'      :['bdis_abab','bhou_aaab'],
  /* 디스코를 현대 장비로 다시 만든 자리 */
  'Nu-disco'                :['bdis_aabb','bfun_abab'],
  /* 808 에 보코더 */
  'Electro'                 :['b808_aaab','bdis_abab'],
  'Electroclash'            :['b808_aaab','bdis_abab'],
  /* H. Latin (계열 H) — 2026-09-15 배치 A13
     39종 → 17무리.
     근거: genres/profiles/*.json · 수치는 재료 실측에서 나왔다 */
  /* 뎀보우 리듬이 정체성이고 건반은 벨 두세 음뿐 */
  'Reggaeton'               :['b808_aaab','blat_abab'],
  'Dembow'                  :['b808_aaab','blat_abab'],
  /* 레키토 기타 아르페지오가 선율을 맡는다 */
  'Bachata'                 :['blat_aabb','bcou_aaba'],
  /* 혼 섹션이 빠른 2박 위를 달린다 */
  'Merengue'                :['blat_abab','bafr_aabb'],
  'Bomba'                   :['blat_abab','bafr_aabb'],
  'Plena'                   :['blat_abab','bafr_aabb'],
  /* 아코디언이 리드이고 92~105 BPM 으로 느긋하다 */
  'Cumbia'                  :['blat_aaba','bcou_aabb'],
  'Vallenato'               :['blat_aaba','bcou_aabb'],
  'Cumbia Sonidera'         :['blat_aaba','bcou_aabb'],
  /* 쿰비아에 서프 기타와 아프로 기타가 들어온다 */
  'Chicha'                  :['blat_abab','bafr_aaab'],
  'Champeta'                :['blat_abab','bafr_aaab'],
  'Cumbia Villera'          :['blat_abab','bafr_aaab'],
  /* 반도네온이 하행으로 끌어내린다 */
  'Tango'                   :['bwal_abab','bwal_aabb'],
  'Nuevo Tango'             :['bwal_abab','bwal_aabb'],
  'Electrotango'            :['bwal_abab','bwal_aabb'],
  /* 트레스와 피아노 몬투노가 클라베 위를 돈다 */
  'Son Cubano'              :['blat_aabb','blat_aaba'],
  'Songo'                   :['blat_aabb','blat_aaba'],
  'Cha-cha-chá'             :['blat_aabb','blat_aaba'],
  /* 180~200 BPM 에 혼 섹션 */
  'Salsa'                   :['blat_abab','bwal_abab'],
  'Timba'                   :['blat_abab','bwal_abab'],
  'Mambo'                   :['blat_abab','bwal_abab'],
  'Mozambique'              :['blat_abab','bwal_abab'],
  /* 타악과 창이 몸이라 화성 악기가 거의 안 움직인다 */
  'Rumba'                   :['blat_aaba','bafr_aaab'],
  'Rumba Yambú'             :['blat_aaba','bafr_aaab'],
  'Rumba Columbia'          :['blat_aaba','bafr_aaab'],
  /* 트랩 골격에 스페인어 */
  'Latin Trap'              :['b808_aaab','b808_aaba'],
  /* 레게톤을 느리고 흐릿하게 */
  'Neoperreo'               :['breg_aabb','b808_aabb'],
  'Sad Perreo'              :['breg_aabb','b808_aabb'],
  /* 나일론 기타의 싱코페 컴핑에 9화음 */
  'Bossa Nova'              :['bwal_aaba','blat_aaba'],
  'Partido Alto'            :['bwal_aaba','blat_aaba'],
  'Pagode'                  :['bwal_aaba','blat_aaba'],
  /* 아코디언·자붐바에 삼각철 */
  'Forró'                   :['bcou_aabb','blat_aabb'],
  'Baião'                   :['bcou_aabb','blat_aabb'],
  /* 타악과 808 이 전부다 */
  'Baile Funk'              :['b808_aaab','blat_abab'],
  'Funk Mandelão'           :['b808_aaab','blat_abab'],
  'Bruxaria'                :['b808_aaab','blat_abab'],
  /* 트럼펫 두 대가 화음으로 운다 */
  'Mariachi'                :['bcou_aaba','blat_aaba'],
  /* 140 BPM 에 관악대와 투바 */
  'Banda'                   :['bcou_abab','bcou_aabb'],
  'Norteño'                 :['bcou_abab','bcou_aabb'],
  /* I. Caribbean · African (계열 I·J) — 2026-09-15 배치 A14
     37종 → 17무리.
     근거: genres/profiles/*.json · 수치는 재료 실측에서 나왔다 */
  /* 75~80 BPM 에 원드롭 */
  'Roots Reggae'            :['breg_aaba','breg_aabb'],
  'Reggae One Drop'         :['breg_aaba','breg_aabb'],
  'Rockers'                 :['breg_aaba','breg_aabb'],
  'Steppers'                :['breg_aaba','breg_aabb'],
  /* EP 와 현이 깔린 부드러운 레게 */
  'Lovers Rock'             :['breg_aabb','breg_abab'],
  /* 140 BPM 에 혼 섹션과 워킹 베이스 */
  'Ska'                     :['bwal_aabb','breg_aabb'],
  /* 스카와 레게 사이의 90~115 BPM */
  'Rocksteady'              :['breg_aabb','bcou_aaba'],
  'Mento'                   :['breg_aabb','bcou_aaba'],
  /* 155~168 BPM 에 스틸팬과 관악 */
  'Soca'                    :['breg_abab','bafr_aabb'],
  'Power Soca'              :['breg_abab','bafr_aabb'],
  /* 125~145 BPM 으로 소카보다 느긋하다 */
  'Calypso'                 :['breg_aabb','blat_aabb'],
  'Groovy Soca'             :['breg_aabb','blat_aabb'],
  'Chutney Soca'            :['breg_aabb','blat_aabb'],
  /* EP 9화음에 부드러운 싱코페 */
  'Zouk'                    :['breg_aabb','blat_abab'],
  'Kompa'                   :['breg_aabb','blat_abab'],
  'Zouk Love'               :['breg_aabb','blat_abab'],
  /* 135 BPM 에 신스 리드와 스틸팬 */
  'Bouyon'                  :['breg_abab','bafr_aaab'],
  /* 벨과 셰이커가 16분을 짜고 스윙 26 이 붙는다 */
  'Afrobeats'               :['bafr_aabb','bafr_aaab'],
  'Hiplife'                 :['bafr_aabb','bafr_aaab'],
  'Coupé-décalé'            :['bafr_aabb','bafr_aaab'],
  /* 혼 섹션에 스윙 30 */
  'Highlife'                :['bafr_aaab','blat_aabb'],
  'Fuji'                    :['bafr_aaab','blat_aabb'],
  /* 크런치 기타가 순환 리프를 돈다 */
  'Desert Blues'            :['bafr_aabb','bcou_aaba'],
  /* 느린 하우스에 타악이 얹힌다 */
  'Kwaito'                  :['bafr_aabb','bhou_aaab'],
  'Gqom'                    :['bafr_aabb','bhou_aaab'],
  'Afro Tech'               :['bafr_aabb','bhou_aaab'],
  /* 오르간·색소폰이 순환 화성을 돈다 */
  'Mbaqanga'                :['bafr_aaab','bcou_abab'],
  'Marabi'                  :['bafr_aaab','bcou_abab'],
  /* **기타 세 대가 얽히는 세베네가 정체성**이다 */
  'Soukous'                 :['bafr_aaab','blat_abab'],
  'Ndombolo'                :['bafr_aaab','blat_abab'],
  'Congolese Rumba'         :['bafr_aaab','blat_abab'],
  /* 스윙 50 에 5음계 모드 */
  'Ethio-jazz'              :['bwal_aaba','bwal_abab'],
  /* 힙합·댄스홀이 동아프리카에서 만난 자리 */
  'Bongo Flava'             :['bafr_aabb','breg_aabb'],
  'Gengetone'               :['bafr_aabb','breg_aabb'],
  /* 아코디언과 나일론에 장식음이 많다 */
  'Raï'                     :['bafr_aabb','blat_aaba'],
  'Shaabi'                  :['bafr_aabb','blat_aaba'],
  'Mahraganat'              :['bafr_aabb','blat_aaba'],
};

/** 지금 걸린 프리셋에 어울리는 베이스 라인 이름 목록 */
function blinePoolFor(name){
  const own=BLINE_KIT_PRESET[name];
  if(own) return own;
  const sub=BLINE_KIT[PRESET_SUB[name]];
  if(sub) return sub;
  return BLINE_KIT_CAT[poolCatFor(name)] || ['brock_aaba'];
}
