/* 프리셋 전개 — 장르 파일이 모두 로드된 뒤에 돈다
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ═══ 2026-08-17 — 상속을 끊었다 ═══════════════════════════════
   여기에는 «프리셋이 안 적은 칸을 TONE_KIT(하위분기)이 채운다» 는
   상속이 있었다. 편했지만 대가가 컸다:

     · 한 하위분기에 묶인 프리셋은 건반·기타·2번 레이어·화음·베이스·
       스케일·퍼커션이 **전부 같은 값**이 됐다. 357종 중 **207종**이
       형제와 편성이 한 칸도 다르지 않았다.
     · «House 계열» 23종이 편성 14가지, «Trap 계열» 7종이 **2가지**였다.
       Melodic Trap 과 Rage 와 Trap Metal 이 같은 악기로 울렸다는 뜻이다.
     · 세부 장르를 추가할수록 상위 장르의 평균값에 수렴했다 —
       가지를 칠수록 개성이 사라지는 구조였다.

   계통도(genres/00-tree.md)의 상하위 관계는 **논리적 분류로 남긴다.**
   PRESET_SUB 도 그대로다 — 문서·검색·표 정렬이 그것을 쓴다.
   다만 **소리를 만드는 값은 프리셋마다 직접 적는다.** 357종 전부
   물질화했고(2026-08-17), 이제 여기서는 아무것도 상속하지 않는다.

   ⚠ 새 프리셋을 추가할 때는 kit 에 **13칸을 다 적어야 한다** —
     kick·snare·clap·chat·ohat·tom·keys·keys2·gtr·gtr2·bass·chord,
     그리고 퍼커션을 쓰면 perc(엔진)와 perc(패턴). 빠뜨리면 아래
     MISSING 검사가 콘솔에 이름을 찍는다. TONE_KIT 은 이제 «그 하위분기에는
     이런 악기가 맞다» 는 **참고표**이지 적용되는 값이 아니다. */

const PRESET_REQUIRED = ['kick','snare','clap','chat','ohat','tom',
                         'keys','keys2','gtr','gtr2','bass','chord'];

/* 문자열 패턴을 숫자 배열로 전개한 사용본 */
const LIB = {};
const PRESET_MISSING = [];
for(const [n,p] of Object.entries(RAW)){
  const kit = {...p.kit};

  /* 빠진 칸 보고 — 채워 주지 않는다. 소리로 티가 나야 고쳐진다.
     (state.js 초기값으로 울리므로 «앞 프리셋이 따라오는» 일은 없다) */
  const miss = PRESET_REQUIRED.filter(k => !kit[k]);
  if(miss.length) PRESET_MISSING.push(`${n} — ${miss.join(',')}`);

  /* 베이스 — kit.bass 가 bcfg.eng 를 덮는다.
     둘 다 프리셋 안에 있으므로 이것은 상속이 아니라 «한 프리셋 안의 우선순위» 다.
     bcfg.eng 는 신스 베이스 5종을 고르던 옛 칸이고, 현 베이스 11종이
     들어오면서 kit.bass 가 실질적인 엔진 칸이 됐다. */
  const bcfg = {...p.bcfg};
  if(kit.bass) bcfg.eng = kit.bass;

  /* off — 그 장르가 안 쓰는 악기는 패턴을 비웁니다.
     음소거가 아니라 패턴을 비우는 쪽입니다. 음소거는 상태로 남아
     다음 프리셋까지 따라가지만, 빈 패턴은 프리셋에 딸린 성질이라
     사용자가 롤에서 직접 찍으면 바로 살아납니다.
     (메탈에 건반이 없는 것은 patterns/00-harmony.md 의 의도입니다) */
  const off = kit.off || [];
  const blankKeys = off.includes('keys'), blankGtr = off.includes('gtr');

  LIB[n] = {
    bpm:p.bpm, swing:p.swing, kit, bcfg, tune:p.tune, tone:!!p.tone,
    cat:p.cat||null, gen:!!p.gen,
    prob:p.prob||null, smp:p.smp||null, bass:bpat(p.bass),
    keys: blankKeys ? new Array(STEPS).fill(0) : kpat(p.keys, kit.chord, bcfg.scale),
    gtr : (blankGtr || !p.gtr) ? new Array(STEPS).fill(-1) : bpat(p.gtr),
    /* 2번 트랙은 프리셋이 적으면 쓰고, 없으면 빈 패턴.
       16마디 선율 모드에서는 라이브러리가 채웁니다. */
    keys2: p.keys2 ? kpat(p.keys2, kit.chord, bcfg.scale) : new Array(STEPS).fill(0),
    gtr2 : p.gtr2  ? bpat(p.gtr2)  : new Array(STEPS).fill(-1),
    drums:Object.fromEntries(TRACKS.map(t =>
      [t.id, pat(t.id==='perc' ? (off.includes('perc') ? null : p.perc) : p[t.id])])),
    /* 악기별 볼륨 — 프리셋이 적은 것만. 없으면 트랙 볼륨을 안 건드립니다. */
    lvl: p.lvl || null,
  };
}
if(PRESET_MISSING.length)
  console.warn(`[preset] kit 칸이 빈 프리셋 ${PRESET_MISSING.length}종\n  ` + PRESET_MISSING.join('\n  '));
const LIB_NAMES = Object.keys(LIB);
