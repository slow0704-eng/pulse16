/* tools/ci/check-syntax.mjs — 모든 JS 파일의 문법을 검사한다.

   왜: 이 앱은 빌드 단계가 없다. 쉼표 하나 빠뜨린 채 커밋하면 아무도
   모르다가, 페이지를 여는 사람의 브라우저에서 그 파일부터 아래로
   전부 실행되지 않는다. `node --check` 는 실행하지 않고 파싱만 하므로
   오디오도 DOM 도 없이 이 사고를 미리 잡는다.

   사용법:  node tools/ci/check-syntax.mjs
   종료코드: 0 통과 / 1 실패                                            */

import { execFileSync } from 'node:child_process';
import { walk, abs, ROOT, OK, NG, head } from './_lib.mjs';

const TARGET_DIRS = ['src', 'tools', 'mcp'];
const EXTS = ['.js', '.mjs'];

const files = TARGET_DIRS.flatMap(d => walk(d, EXTS));

head('문법 검사 (node --check)');
console.log(`대상 ${files.length}개 — ${TARGET_DIRS.map(d => d + '/').join(' · ')} (node_modules 제외)`);

const failures = [];

for (const f of files) {
  try {
    execFileSync(process.execPath, ['--check', abs(f)], { stdio: 'pipe' });
  } catch (e) {
    const msg = String(e.stderr || e.stdout || e.message)
      .split(ROOT).join('.')          // 절대경로를 저장소 상대로 — CI 로그가 읽히게
      .split('\n')
      .filter(l => l.trim() && !/^\s*at /.test(l) && !/^Node\.js v/.test(l))
      .slice(0, 8)
      .join('\n');
    failures.push({ file: f, msg });
  }
}

console.log('');
if (failures.length === 0) {
  console.log(`${OK} 문법 오류 없음 — ${files.length}개 파일 전부 통과`);
  process.exit(0);
}

console.log(`${NG} 문법 오류 ${failures.length}개 파일`);
for (const { file, msg } of failures) {
  console.log(`\n  ${NG} ${file}`);
  for (const line of msg.split('\n')) console.log(`      ${line}`);
}
console.log('');
process.exit(1);
