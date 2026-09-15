/* tools/ci/check-css-vars.mjs — 정의되지 않은 CSS 변수를 잡는다.

   왜 필요한가.
   `border:1px solid var(--line)` 에서 --line 이 없으면 CSS 는 그 선언을
   «계산 시점 무효(invalid at computed-value time)» 로 처리한다. 그러면
   border-color 만 빠지는 게 아니라 **선언 전체가 초기값으로 되돌아간다** —
   border-style 이 none 이 되어 테두리가 아예 안 그려진다. 오타 하나가
   조용히 한 층을 지운다. 콘솔에 아무것도 안 남고, 스모크도 못 잡는다.
   눈으로만 보이는 결함이라 기계가 대신 봐야 한다.

   외부 의존성 없음. 정적 단계에서 돈다. */

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, rel, OK, NG, WARN, head } from './_lib.mjs';

const CSS_DIR = path.join(ROOT, 'styles');
const files = fs.readdirSync(CSS_DIR).filter(f => f.endsWith('.css')).map(f => path.join(CSS_DIR, f));

/* HTML 의 인라인 style= 과 <style> 도 var() 를 쓸 수 있다 */
for (const f of ['pulse16-mk16.html', 'billboard.html', 'manual.html', 'index.html']) {
  const p = path.join(ROOT, f);
  if (fs.existsSync(p)) files.push(p);
}

const defined = new Set();
const used = new Map();          // name -> [{file, line}]
const DEF = /(--[\w-]+)\s*:/g;
/* var(--x) 와 var(--x, 대체값) 을 가른다. 대체값이 있으면 없어도 안전하다. */
const USE = /var\(\s*(--[\w-]+)\s*(,)?/g;

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  /* 선언부만 훑는다 — var() 안의 --x 는 «사용» 이므로 먼저 지운다 */
  const forDef = src.replace(/var\([^)]*\)/g, 'var()');
  let m;
  while ((m = DEF.exec(forDef))) defined.add(m[1]);
  const lines = src.split(/\r?\n/);
  lines.forEach((ln, i) => {
    let u;
    USE.lastIndex = 0;
    while ((u = USE.exec(ln))) {
      if (u[2]) continue;        // 대체값이 있다
      if (!used.has(u[1])) used.set(u[1], []);
      used.get(u[1]).push({ file: rel(f), line: i + 1 });
    }
  });
}

head('CSS 변수');

let bad = 0;
for (const [name, at] of [...used].sort()) {
  if (defined.has(name)) continue;
  bad++;
  console.log(`${NG} ${name} — 정의가 없습니다. 이 선언들은 «계산 시점 무효» 로 통째로 사라집니다`);
  for (const a of at) console.log(`      ${a.file}:${a.line}`);
}

/* 반대쪽 — 정의해 놓고 아무도 안 쓰는 것. 죽은 토큰은 실패가 아니라 경고다. */
let dead = 0;
for (const name of [...defined].sort()) {
  if (used.has(name)) continue;
  if (name === '--tone') continue;               // 인라인 style 로만 걸린다
  dead++;
  console.log(`${WARN} ${name} — 정의만 있고 쓰는 곳이 없습니다`);
}

console.log(`\n   정의 ${defined.size}개 · 사용 ${used.size}개 · 파일 ${files.length}개`);
if (bad) {
  console.log(`\n❌ 정의 없는 변수 ${bad}개`);
  process.exit(1);
}
console.log(`${OK} 정의 없는 변수 0개${dead ? ` (죽은 토큰 ${dead}개는 경고)` : ''}`);
