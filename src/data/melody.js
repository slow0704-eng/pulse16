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
};

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
  plan.forEach(([form,shift], k) => {
    const chunk = shift ? buildBarsP(seqPhrase(pa,shift), seqPhrase(pb,shift), form)
                        : buildBarsP(pa, pb, form);
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
};
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
    pool.forEach(n => ['_l32','_l64'].forEach(suf => {
      const k=sib(n,suf);
      if(MELODY[k] && !out.includes(k)) out.push(k);
    }));
    return out;
  }
  const want=+pref;
  if(!(want>0)) return pool;
  const swapped = pool.map(n => {
    const k=sib(n,'_l'+want);
    return (want>16 && MELODY[k]) ? k : n;
  });
  const hit = swapped.filter(n => MELODY[n] && MELODY[n].rows.length===want);
  return hit.length ? hit : swapped;      // 그 길이가 없으면 원래 풀로
}

/* ── 하위분기 → 어울리는 선율 ──
   이름은 `프레이즈쌍_폼` 입니다 (예: pop_aabb). */
const MELODY_KIT_CAT = {
  A:['rock_aaba','rock_aabb','ant_aaba','blues_aaba'],
  B:['pop_aabb','pop_abab','bal_aaba','ant_aabb','cin_aabb'],
  C:['hip_aaab','hip_aaba','trp_aaab','trp_aaba'],
  D:['funk_aabb','funk_abab','dis_aabb','gos_aabb'],
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
  'Metal'                  :[],            // 메탈은 건반을 안 씁니다
  'Punk'                   :[],
  'Hard Rock'              :['rock_aaba','ant_aaba','blues_aaba'],
  'Alternative'            :['rock_aabb','amb_aaba','bal_aaba'],
  'Post-punk 계보'         :['rock_abab','amb_aabb','ant_abab'],
  'Bebop 계보'             :['jazz_abab','jazz_aaba','bal_aabb'],
  'Latin Jazz'             :['lat_aabb','jazz_abab','bos_aabb'],
  'Fusion 계보'            :['funk_aabb','jazz_abab','dis_aabb'],
  '현대 갈래'              :['jazz_aaba','bos_aaba','bal_aaba'],
  'Funk'                   :['funk_aabb','funk_abab','dis_aabb'],
  'Disco'                  :['dis_aabb','funk_abab','gos_aabb'],
  'Soul'                   :['gos_aabb','funk_aabb','bal_aaba'],
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
  'Gospel · 지역 장르'     :['gos_aabb','gos_aaba','bal_aabb'],
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
};

/** 지금 걸린 프리셋에 어울리는 선율 이름 목록 */
function melodyPoolFor(name){
  const sub=MELODY_KIT[PRESET_SUB[name]];
  if(sub) return sub;                                   // 빈 배열이면 "선율 없음"
  /* ⚠ 'pop_arch' 는 키가 아니라 **라벨**('팝 아치')이었다.
     MELODY 의 키는 프레이즈쌍_폼 규칙이라 실제 이름은 pop_aabb 다.
     하위분기·계열 둘 다 안 걸리는 프리셋 69개(355개 중)가 이 자리로 떨어져
     선율이 통째로 안 나왔다. riff·bline 의 기본값은 원래 정상이었다. */
  return MELODY_KIT_CAT[PRESET_CAT[name]] || ['pop_aabb'];
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
};
const RIFF_NAMES = Object.keys(RIFF);
Object.values(RIFF).forEach(r => { r.rows = r.bars.map(bpat); });

const RIFF_KIT_CAT = {
  A:['rock_power','rock_drive'],
  B:['rock_drive','arp_folk'],
  C:['funk_cut','edm_arp'],
  D:['funk_cut','funk_call'],
  E:['edm_arp','funk_cut'],
  F:['funk_call','arp_folk'],
  G:['arp_country','arp_folk'],
  H:['latin_montuno','arp_folk'],
  I:['skank','skank_up'],
  J:['funk_cut','arp_folk'],
  K:['arp_folk','latin_montuno'],
  X:['rock_power'],
};
const RIFF_KIT = {
  'Metal'                  :['metal_chug','metal_gallop'],
  'Hard Rock'              :['rock_power','metal_gallop'],
  'Punk'                   :['rock_drive','rock_power'],
  'Alternative'            :['rock_power','rock_drive'],
  'Post-punk 계보'         :['arp_folk','rock_drive'],
  'Funk'                   :['funk_cut','funk_call'],
  'Disco'                  :['funk_cut','funk_call'],
  'Soul'                   :['funk_call','funk_cut'],
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
  '서아프리카'             :['funk_cut','arp_folk'],
  '남아시아'               :['arp_folk','latin_montuno'],
};

/** 지금 걸린 프리셋에 어울리는 기타 리프 이름 목록 */
function riffPoolFor(name){
  const sub=RIFF_KIT[PRESET_SUB[name]];
  if(sub) return sub;
  return RIFF_KIT_CAT[PRESET_CAT[name]] || ['rock_power'];
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
  ['brockA','brockB',{AABA:'록 근음',    AABB:'록 진행'}],
  ['bmetA','bmetB',  {AAAB:'메탈 연타',  AABB:'메탈 갤럽'}],
  ['bfunA','bfunB',  {AABB:'펑크 싱코페',ABAB:'펑크 옥타브'}],
  ['bwalA','bwalB',  {ABAB:'재즈 워킹',  AABA:'워킹 회귀'}],
  ['bdisA','bdisB',  {AABB:'디스코 옥타브',ABAB:'디스코 교대'}],
  ['bregA','bregB',  {AABA:'레게 성긴',  AABB:'레게 진행'}],
  ['b808A','b808B',  {AAAB:'808 롱',     AABA:'808 슬라이드'}],
  ['bcouA','bcouB',  {AABB:'컨트리 붐칙',AABA:'붐칙 회귀'}],
  ['bhouA','bhouB',  {AAAB:'하우스 엇박',AABB:'하우스 진행'}],
  ['blatA','blatB',  {AABB:'라틴 툼바오',ABAB:'툼바오 교대'}],
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
  I:['breg_aaba','breg_aabb'],   J:['bfun_aabb','blat_aabb'],
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
  '서아프리카':['bfun_aabb','blat_aabb'], '동아프리카':['bfun_aabb'],
};

/** 지금 걸린 프리셋에 어울리는 베이스 라인 이름 목록 */
function blinePoolFor(name){
  const sub=BLINE_KIT[PRESET_SUB[name]];
  if(sub) return sub;
  return BLINE_KIT_CAT[PRESET_CAT[name]] || ['brock_aaba'];
}
