/* 검사를 전부 돌린다.
 *
 * 여태 이 저장소에는 검사를 한 번에 돌리는 진입점이 없었습니다. `package.json`
 * 도 Makefile 도 없어서 사람이 열 몇 개를 손으로 불러야 했고, 그래서 README 의
 * 목록이 CI 와 어긋나 있었습니다 — README 대로 다 돌려도 `check-kit-engines` ·
 * `check-song-length` · `build-refdata --check` 셋이 빠져 CI 에서 떨어졌습니다.
 * 목록이 두 곳에 있으면 반드시 갈라집니다. 이제 목록은 **여기 하나**입니다.
 *
 * 사용법
 *   node tools/ci/all.mjs            검사 전부
 *   node tools/ci/all.mjs --static   브라우저가 필요 없는 것만 (빠름)
 *   node tools/ci/all.mjs --list     무엇을 도는지만 보여 준다
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');

/* browser:true 는 playwright 로 실제 페이지를 띄웁니다 — 느리고 환경을 탑니다. */
const CHECKS = [
  { name: 'check-syntax',      run: ['tools/ci/check-syntax.mjs'],      what: '모든 .js/.mjs 가 파싱되는가 (node --check)' },
  { name: 'check-globals',     run: ['tools/ci/check-globals.mjs'],     what: '최상위 이름 충돌 · HTML id 와 함수 이름 충돌' },
  { name: 'check-load-order',  run: ['tools/ci/check-load-order.mjs'],  what: 'HTML 로드 순서 ↔ 디스크 ↔ ARCHITECTURE 지도' },
  { name: 'check-css-vars',    run: ['tools/ci/check-css-vars.mjs'],    what: '정의 없는 var() 가 있는가' },
  { name: 'check-kit-engines', run: ['tools/ci/check-kit-engines.mjs'], what: 'kit 칸이 실재하는 엔진인가 · 건반 컴핑 대조' },
  { name: 'check-song-length', run: ['tools/ci/check-song-length.mjs'], what: '폼의 마디 수를 선율 길이가 나누는가' },
  { name: 'check-docs-sync',   run: ['tools/ci/check-docs-sync.mjs'],   what: '문서의 설정값 표·패턴 블록이 프리셋 코드와 같은가' },
  { name: 'build-refdata',     run: ['tools/build-refdata.mjs', '--check'], what: '생성물이 원본 문서와 일치하는가' },
  { name: 'check-melody-profile', run: ['tools/ci/check-melody-profile.mjs'], what: '프로파일 ↔ melody.js (P1~P11)', browser: true },
  { name: 'smoke',             run: ['tools/ci/smoke.mjs'],             what: '실제로 뜨고 소리 나는가 · file:// · 접근성', browser: true },
  { name: 'regression',        run: ['tools/ci/regression.mjs'],        what: 'docs/qa 의 알려진 결함이 되살아났는가', browser: true },
  { name: 'check-layout',      run: ['tools/ci/check-layout.mjs'],      what: '첫 화면 안에 핵심 조작이 들어오는가', browser: true },
];

const args = process.argv.slice(2);
const staticOnly = args.includes('--static');
const browserOnly = args.includes('--browser');
/* CI 가 이 두 축으로 작업을 나눕니다 — 값싼 정적 검사가 떨어지면 비싼 브라우저
   검사를 아예 시작하지 않습니다. 그래서 러너도 같은 축을 지원해야 «검사 목록은
   한 곳» 이 성립합니다. */
const list = CHECKS.filter(c => staticOnly ? !c.browser : browserOnly ? c.browser : true);

if (args.includes('--list')) {
  for (const c of list) console.log(`${c.browser ? '🌐' : '  '} ${c.name.padEnd(22)} ${c.what}`);
  process.exit(0);
}

const started = Date.now();
const failed = [], warned = [];
for (const c of list) {
  const t0 = Date.now();
  const r = spawnSync(process.execPath, c.run.map(p => join(ROOT, p)).slice(0, 1).concat(c.run.slice(1)),
                      { cwd: ROOT, encoding: 'utf8' });
  const out = (r.stdout || '') + (r.stderr || '');
  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  const ok = r.status === 0;
  const warn = ok && /⚠/.test(out);
  if (!ok) failed.push({ c, out });
  else if (warn) warned.push(c.name);
  const mark = ok ? (warn ? '⚠' : '✅') : '❌';
  console.log(`${mark} ${c.name.padEnd(22)} ${secs.padStart(5)}s  ${c.what}`);
  /* 실패는 그 자리에서 전문을 보여 준다 — 나중에 다시 부르게 하지 않는다 */
  if (!ok) console.log(out.split('\n').map(l => '     │ ' + l).join('\n'));
}

const total = ((Date.now() - started) / 1000).toFixed(1);
console.log(`\n${list.length}종 · ${total}s${staticOnly ? ' (--static — 브라우저 검사는 건너뜀)' : ''}`);
if (warned.length) console.log(`⚠ 경고가 있는 검사: ${warned.join(' · ')} (실패는 아닙니다)`);
if (failed.length) {
  console.log(`❌ 실패 ${failed.length}종 — ${failed.map(f => f.c.name).join(' · ')}`);
  process.exit(1);
}
console.log('✅ 전부 통과');
