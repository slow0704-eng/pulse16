/* 프리셋 전개 — 장르 파일이 모두 로드된 뒤에 돈다
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* 문자열 패턴을 숫자 배열로 전개한 사용본 */
const LIB = {};
for(const [n,p] of Object.entries(RAW)){
  /* 프리셋이 직접 적은 kit 이 항상 이깁니다. 안 적은 트랙만 TONE_KIT 이 채웁니다.
     그래서 특정 프리셋만 예외를 두고 싶으면 그 프리셋의 kit 에 적으면 됩니다. */
  const T = toneKitFor(n, p.cat);
  const kit = {...p.kit};
  if(!kit.keys) kit.keys = T.keys;
  if(!kit.gtr ) kit.gtr  = T.gtr;
  if(!kit.perc && T.perc) kit.perc = T.perc;
  /* 드럼 엔진도 하위분기가 정할 수 있게 합니다.
     예전에는 keys·gtr·perc·bass 만 통로가 있어서, 트랩을 불러도 킥이
     deep 이고 하우스를 불러도 클랩이 spread 였습니다 — 엔진은 있는데
     아무도 안 골라 주는 상태였습니다.
     perc 는 pperc(기본 패턴)까지 딸려 있어 위에서 따로 다룹니다. */
  TRACK_IDS.forEach(id => { if(id!=='perc' && !kit[id] && T[id]) kit[id] = T[id]; });
  /* 2번 건반·기타 — 같은 악기를 두 벌 쓰지 않도록 하위분기가 따로 정합니다.
     (keys2·gtr2 는 코러스에서만 켜지는 레이어입니다 — arrange.js SECTION_RULE) */
  /* ⚠ 반드시 값을 채웁니다. 적용 지점이 «없으면 현재 엔진 유지» 라서,
     비워 두면 **앞서 부른 프리셋의 2번 악기가 그대로 따라옵니다** —
     아프로비츠를 불렀다가 탱고를 부르면 탱고 코러스에서 코라가 울렸습니다.
     기본값은 state.js 의 eng 초기값과 같습니다. */
  kit.keys2 = kit.keys2 || T.keys2 || 'strings';
  kit.gtr2  = kit.gtr2  || T.gtr2  || 'clean';
  /* 화음 종류 — '0'~'7' 이 3화음으로 울릴지 7·9화음으로 울릴지.
     안 정하면 'triad' 라 예전과 완전히 같다. */
  kit.chord = kit.chord || T.chord || 'triad';
  /* perc 엔진만 정하고 패턴이 없으면 트랙이 조용합니다.
     하위분기 단위로 기본 패턴을 함께 줍니다 — 프리셋이 perc 를 직접 적으면 그쪽이 이깁니다.
     Soca 의 16분 아이언만 문서에 명시돼 있고, 나머지는 통상적인 자리입니다. */
  const percPat = p.perc || (kit.perc ? T.pperc : null);

  /* 베이스 우선순위 — 프리셋의 kit.bass > TONE_KIT > 프리셋의 bcfg.eng.
     bcfg.eng 는 모든 프리셋이 갖고 있어서 "기본값"과 "일부러 정한 값"을
     구분할 수 없습니다. 그래서 예외를 두고 싶은 프리셋은 kit.bass 에 적습니다.
     이 통로가 없으면 하위분기 하나에 묶인 프리셋들이 전부 같은 베이스가 됩니다. */
  const bassEng = kit.bass || T.bass || null;
  const bcfg = bassEng ? {...p.bcfg, eng:bassEng} : p.bcfg;

  /* off — 그 장르가 안 쓰는 악기는 패턴을 비웁니다.
     음소거가 아니라 패턴을 비우는 쪽입니다. 음소거는 상태로 남아
     다음 프리셋까지 따라가지만, 빈 패턴은 프리셋에 딸린 성질이라
     사용자가 롤에서 직접 찍으면 바로 살아납니다.
     (메탈에 건반이 없는 것은 patterns/00-harmony.md 의 의도입니다) */
  /* 프리셋이 직접 끄는 것이 하위분기 기본값을 이깁니다.
     같은 하위분기라도 그런지는 건반이 없고 브릿팝은 있습니다 —
     이 통로가 없으면 둘을 못 가릅니다. (genres/00-reference.md) */
  const off = kit.off || T.off || [];
  const blankKeys = off.includes('keys'), blankGtr = off.includes('gtr');

  LIB[n] = {
    bpm:p.bpm, swing:p.swing, kit, bcfg, tune:p.tune, tone:!!p.tone,
    cat:p.cat||null, gen:!!p.gen,
    prob:p.prob||null, smp:p.smp||null, bass:bpat(p.bass),
    keys: blankKeys ? new Array(STEPS).fill(0) : kpat(p.keys, kit.chord),
    gtr : (blankGtr || !p.gtr) ? new Array(STEPS).fill(-1) : bpat(p.gtr),
    /* 2번 트랙은 프리셋이 적으면 쓰고, 없으면 빈 패턴.
       16마디 선율 모드에서는 라이브러리가 채웁니다. */
    keys2: p.keys2 ? kpat(p.keys2, kit.chord) : new Array(STEPS).fill(0),
    gtr2 : p.gtr2  ? bpat(p.gtr2)  : new Array(STEPS).fill(-1),
    drums:Object.fromEntries(TRACKS.map(t =>
      [t.id, pat(t.id==='perc' ? (off.includes('perc') ? null : percPat) : p[t.id])])),
    /* 악기별 볼륨 — 하위분기가 정한 것만. 없으면 프리셋이 트랙 볼륨을 안 건드립니다. */
    lvl: T.lvl || null,
  };
}
const LIB_NAMES = Object.keys(LIB);
