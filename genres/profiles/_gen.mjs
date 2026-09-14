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
const { batch, sub, cat, date, verdict, groups, CAT = {}, SUB = {}, PHRASES = {} }
  = await import(pathToFileURL(resolve(srcPath)).href);

const keys = Object.keys(groups).filter(k => groups[k].members.length);
const profiles = [];

for (const gk of keys) {
  const g = groups[gk];
  for (const m of g.members) {
    const isAnchor = m === g.anchor;
    const dist = [];
    /* 다른 무리 — 풀이 같으면 선율로 갈리는 게 아니다. 축을 그렇게 적는다 */
    for (const ok of keys) {
      if (ok === gk) continue;
      const same = groups[ok].pool.join('|') === g.pool.join('|');
      dist.push({ from: groups[ok].anchor,
                  axis: same ? 'timbre' : 'melody',
                  note: same ? '선율 풀이 같다. 갈리는 것은 편성·음색이다' : g.why });
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
        scale: g.mel.scale || 'Minor Pentatonic',
      },
      harmony: { chordType: g.chordType, comping: g.comping },
      bass: { role: g.bass.role, octaveJump: g.bass.oct, gate: g.bass.gate,
              kickRelation: g.bass.kick, glide: g.bass.glide },
      ensemble: { lead: g.lead, off: g.off || [], roles: g.roles, lvlHint: g.lvlHint || {} },
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
