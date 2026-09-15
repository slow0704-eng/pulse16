/* genres/profiles/_apply.mjs — 배치표의 배정을 src/data/melody.js 에 넣는다.

   배치표(_batch-*.mjs)의 각 무리는 세 축을 모두 들고 있다:
     pool  선율 (MELODY_KIT_PRESET)
     riff  기타 (RIFF_KIT_PRESET)
     bline 베이스 (BLINE_KIT_PRESET)
   그리고 선택적으로 eng — 프리셋 파일의 kit.bass 를 바꾼다
   (_build.js:48 이 kit.bass 로 bcfg.eng 를 덮으므로 그것이 울린다).

   ⚠ 이미 들어 있는 프리셋은 건너뛴다 — 두 번 돌려도 중복되지 않는다.

   사용법:  node genres/profiles/_apply.mjs <배치표.mjs> [프리셋파일.js]      */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const [batchPath, presetPath] = process.argv.slice(2);
if (!batchPath) { console.log('사용법: node genres/profiles/_apply.mjs <배치표.mjs> [프리셋파일.js]'); process.exit(2); }

const B = await import(pathToFileURL(resolve(batchPath)).href);
const { groups, batch, cat } = B;

const q = s => "'" + s + "'";
const ANCHOR = {
  pool:  { after: 'function melodyPoolFor', label: '선율' },
  riff:  { after: '기타 리프 이름 목록',      label: '리프' },
  bline: { after: '베이스 라인 이름 목록',    label: '베이스' },
};

const file = resolve('src/data/melody.js');
let s = readFileSync(file, 'utf8');
const NL = s.includes('\r\n') ? '\r\n' : '\n';

let added = 0, skipped = 0;
for (const [key, a] of Object.entries(ANCHOR)) {
  const lines = [
    `  /* ${cat}. ${B.sub} — ${B.date} 배치 ${batch}`,
    `     ${B.verdict.split('.')[0].trim()}.`,
    `     근거: genres/profiles/*.json · 수치는 재료 실측에서 나왔다 */`];
  let n = 0;
  for (const g of Object.values(groups)) {
    const vals = g[key];
    if (!vals || !vals.length) continue;
    lines.push('  /* ' + g.why.split(/[.—]/)[0].trim() + ' */');
    for (const m of g.members) {
      /* 이 표에 이미 있으면 건너뛴다 */
      const at = s.indexOf(ANCHOR[key].after);
      const close = s.lastIndexOf('};', at);
      const openIdx = s.lastIndexOf('= {', close);
      if (s.slice(openIdx, close).includes(`'${m}'`)) { skipped++; continue; }
      lines.push('  ' + q(m).padEnd(26) + ':[' + vals.map(q).join(',') + '],');
      n++; added++;
    }
  }
  if (!n) continue;
  const at = s.indexOf(a.after);
  if (at < 0) throw new Error('못 찾음: ' + a.after);
  const close = s.lastIndexOf('};', at);
  s = s.slice(0, close) + lines.join(NL) + NL + s.slice(close);
}
writeFileSync(file, s, 'utf8');

/* 베이스 엔진 */
let engN = 0, engMiss = [];
if (presetPath && existsSync(presetPath)) {
  let ps = readFileSync(presetPath, 'utf8');
  for (const g of Object.values(groups)) {
    if (!g.eng) continue;
    for (const m of g.members) {
      const want = typeof g.eng === 'string' ? g.eng : g.eng[m];
      if (!want) continue;
      const i = ps.indexOf(`'${m}'`);
      if (i < 0) { engMiss.push(m); continue; }
      const endAt = ps.indexOf('\n},', i);
      const end = endAt > 0 ? endAt : i + 2200;
      const seg = ps.slice(i, end);
      const cur = /bass:'([a-z0-9]+)'/.exec(seg);
      if (!cur) { engMiss.push(m + '(bass 칸 없음)'); continue; }
      if (cur[1] === want) continue;
      ps = ps.slice(0, i) + seg.replace(/bass:'[a-z0-9]+'/, `bass:'${want}'`) + ps.slice(end);
      engN++;
    }
  }
  writeFileSync(presetPath, ps, 'utf8');
}

console.log(`${batch} — melody.js 에 ${added}줄 추가 (이미 있어 건너뜀 ${skipped})`
          + (presetPath ? ` · 베이스 엔진 ${engN}종 변경` : ''));
if (engMiss.length) console.log('  엔진 못 찾음: ' + engMiss.join(', '));
