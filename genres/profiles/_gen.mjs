/* genres/profiles/_gen.mjs — 무리 표 하나에서 프로파일 JSON 을 펼친다.

   왜 생성기인가: 한 배치가 16~23종이고 필드가 스무 개 남짓이다. 손으로
   적으면 오타가 나고, 오타는 «지어낸 차이» 처럼 보인다. 무리 단위로 한 번만
   적고 기계가 펼치면 형제끼리 값이 어긋날 수 없다.

   ⚠ 이것은 **근거 자료 생성기**이지 데이터 빌더가 아니다.
     앱이 읽는 것은 여전히 src/data/melody.js 이고, 둘이 어긋나는지는
     tools/ci/check-melody-profile.mjs 가 본다.

   사용법:  node genres/profiles/_gen.mjs <배치모듈.mjs> <출력.json>          */

import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const [srcPath, outPath] = process.argv.slice(2);
if (!srcPath || !outPath) {
  console.log('사용법: node genres/profiles/_gen.mjs <배치모듈.mjs> <출력.json>');
  process.exit(2);
}
/* SCALE — 프리셋별 실제 스케일. 무리 한 칸(mel.scale)으로는 형제끼리 스케일이 갈릴 때
   (Indie Rock 은 Major, 형제 Grunge 는 Natural Minor) 거짓 값이 들어간다. */
const { batch, sub, cat, date, verdict, groups, CAT = {}, SUB = {}, PHRASES = {}, SCALE = {} }
  = await import(pathToFileURL(resolve(srcPath)).href);

const keys = Object.keys(groups).filter(k => groups[k].members.length);
const profiles = [];

for (const gk of keys) {
  const g = groups[gk];
  for (const m of g.members) {
    const isAnchor = m === g.anchor;
    const dist = [];
    /* 다른 무리 — 풀이 같으면 선율로 갈리는 게 아니다. 축을 그렇게 적는다.

       ⚠ 2026-09-16 두 가지를 고쳤다. 근거 패널이 «형제와 무엇이 다른가» 로 이 칸을 그대로 보여 준다.
         · 같은 하위분기의 무리만 형제다. 계열 전체와 비교하면 Symphonic Metal 옆에
           Space Rock · Rock & Roll 이 «형제» 로 줄줄이 붙었다.
         · note 는 **그쪽 무리**의 설명이어야 한다. 전에는 자기 설명(g.why)을 모든 줄에
           복사해서, «Space Rock — 4곡 모두 오케스트라·합창…» 처럼 남의 이름 옆에
           내 성질이 적혔다.
       하위분기가 하나뿐인 배치(SUB 를 안 쓰는 배치)는 모든 무리가 같은 분기라 전과 같다. */
    const mySub = SUB[m] || sub;
    for (const ok of keys) {
      if (ok === gk) continue;
      const og = groups[ok];
      if (!og.members.some(x => (SUB[x] || sub) === mySub)) continue;
      const same = og.pool.join('|') === g.pool.join('|');
      dist.push({ from: og.anchor,
                  axis: same ? 'timbre' : 'melody',
                  note: same ? '선율 풀이 같다. 갈리는 것은 편성·음색이다'
                             : '그쪽은 ' + og.why.split(/\s—\s|\.\s/)[0].trim() });
    }
    /* 같은 무리 — 선율로는 구분되지 않는다는 것이 판정이다 */
    for (const sib of g.members) if (sib !== m)
      dist.push({ from: sib, axis: 'none', note: '선율로 구분되지 않는다. 같은 풀이 맞다' });

    profiles.push({
      preset: m, sub: SUB[m] || sub, cat: CAT[m] || cat, stage: 'mine',
      melody: {
        density: { min: g.mel.density[0], max: g.mel.density[1] },
        leapRatio: { min: g.mel.leap[0], max: g.mel.leap[1] },
        contour: g.mel.contour,
        range: { min: g.mel.range[0], max: g.mel.range[1] },
        degrees: g.mel.degrees, rhythm: g.mel.rhythm,
        cadence: { lastBarEmpty: false, endDegree: 0 },
        repetition: g.mel.repetition, voicing: g.mel.voicing || 'single',
        scale: SCALE[m] || g.mel.scale || 'Minor Pentatonic',
      },
      harmony: { chordType: g.chordType, comping: g.comping },
      bass: { role: g.bass.role, octaveJump: g.bass.oct, gate: g.bass.gate,
              kickRelation: g.bass.kick, glide: g.bass.glide },
      ensemble: { lead: g.lead, off: g.off || [], roles: g.roles || {}, lvlHint: g.lvlHint || {} },
      ...(g.phrases && isAnchor && PHRASES[g.phrases] ? { phrases: PHRASES[g.phrases] } : {}),
      meta: {
        confidence: g.conf, evidenceBasis: g.ev, distinguishes: dist,
        poolDecision: isAnchor ? 'own' : 'share',
        shareWith: isAnchor ? null : g.anchor,
        pool: g.pool, note: g.why,
      },
    });
  }
}

writeFileSync(outPath, JSON.stringify({ batch, sub, cat, date, verdict, profiles }, null, 2) + '\n', 'utf8');
console.log(`${profiles.length}건 · 무리 ${keys.length}개 → ${outPath}`);
