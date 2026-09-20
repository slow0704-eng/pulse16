/* 「몇 종인가」에 답하는 한 곳.
 *
 * 이 저장소의 문서들은 같은 수를 저마다 다르게 적고 있었습니다 — 엔진이
 * 186 · 70 · 222 로, 곡 형식이 13 · 18 로, 하위분기가 64 · 72 로 갈렸습니다.
 * 원인은 사람이 세어 문서에 박아 두었기 때문입니다. 코드가 움직이면 그 수는
 * 낡는데, 낡았다는 것을 아무도 모릅니다.
 *
 * 그래서 수는 문서에 적지 않습니다. 필요하면 여기에 물으십시오.
 *
 *   node tools/counts.mjs
 *
 * ⚠ 이 도구는 검사가 아닙니다 — 실패하지 않고 세기만 합니다. 문서에 수를 적어야
 *   할 일이 생기면, 적는 대신 이 명령을 가리키십시오.
 */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(join(ROOT, f), 'utf8');
const strip = s => s.replace(/'use strict';/g, '');

/* 앱과 같은 순서로 이어 붙여 전역을 만든다 — 프리셋 파일은 글롭으로 훑으므로
   장르 파일을 늘려도 따라온다. */
let src = '';
for (const f of ['src/core/config.js', 'src/core/scale.js', 'src/data/preset-index.js',
                 'src/data/pattern-codec.js', 'src/data/presets/_raw.js',
                 ...fs.readdirSync(join(ROOT, 'src/data/presets'))
                      .filter(x => /^\d\d-.+\.js$/.test(x)).sort()
                      .map(x => 'src/data/presets/' + x),
                 'src/data/presets/_build.js', 'src/data/melody.js',
                 'src/data/harmony.js', 'src/data/fills.js'])
  src += '\n' + strip(read(f));

const want = ['RAW', 'LIB_NAMES', 'PRESET_SUB', 'PRESET_CAT', 'ENGINES', 'TONE_KIT',
              'MELODY', 'PHRASE', 'RIFF', 'BLINE', 'RIFF_PHRASE', 'BASS_PHRASE',
              'COMP', 'PROG', 'FILLS', 'SCALES'];
const P = new Function('window', 'console',
  src + `\n; return { ${want.map(n => `${n}: typeof ${n}!=='undefined'?${n}:null`).join(', ')} };`
)({ Tone: undefined }, { warn() {}, log() {} });

const len = o => o == null ? null : (Array.isArray(o) ? o.length : Object.keys(o).length);
const forms = JSON.parse(read('genres/forms/forms.json'));

/* 엔진은 트랙별 목록이라 합쳐 센다 */
let engTotal = 0; const engPer = [];
for (const [track, list] of Object.entries(P.ENGINES || {})) {
  const c = len(list); engTotal += c; engPer.push(`${track} ${c}`);
}

const rows = [
  ['프리셋', len(P.RAW), 'src/data/presets/*.js'],
  ['  그중 규칙 파생(gen)', Object.values(P.RAW).filter(p => p && p.gen).length, ''],
  ['계열', new Set(Object.values(P.PRESET_CAT || {})).size || null, 'preset-index.js'],
  ['하위분기', new Set(Object.values(P.PRESET_SUB || {})).size, 'preset-index.js · PRESET_SUB'],
  ['음색 엔진 (합계)', engTotal, 'core/config.js · ENGINES'],
  ['스케일', len(P.SCALES), 'core/scale.js'],
  ['곡 형식', len(forms.forms), 'genres/forms/forms.json'],
  ['  형식이 배정된 분기', len(forms.assignSub), '나머지는 계열 기본형을 물려받는다'],
  ['  조사 안 한 분기', len(forms.unresearched), ''],
  ['선율 MELODY', len(P.MELODY), 'melody.js — 프레이즈를 폼으로 엮어 만든다'],
  ['  프레이즈 PHRASE', len(P.PHRASE), ''],
  ['기타 리프 RIFF', len(P.RIFF), ''],
  ['  리프 프레이즈', len(P.RIFF_PHRASE), ''],
  ['베이스 BLINE', len(P.BLINE), ''],
  ['  베이스 프레이즈', len(P.BASS_PHRASE), ''],
  ['화성 진행 PROG', len(P.PROG), 'harmony.js'],
  ['컴핑 COMP', len(P.COMP), 'harmony.js'],
  ['필인 FILLS', len(P.FILLS), 'fills.js'],
];

console.log('\n── 지금 이 저장소에 있는 것 ' + '─'.repeat(44));
for (const [label, n, note] of rows)
  console.log(`${label.padEnd(24)}${String(n ?? '(못 셈)').padStart(6)}   ${note}`);
console.log(`\n엔진 내역 — ${engPer.join(' · ')}`);

/* ── data/genres.json ─────────────────────────────────────────────────
   앱은 이 파일을 읽지 않지만 죽은 파일이 아니다 — tools/chart-to-genres.mjs 가
   읽고, genres/forms/forms.json 이 feltBpm 을 근거로 인용하며, 11-world.js 의
   파생 프리셋이 여기서 나왔다. 그런데 프리셋 이름과의 연결을 **아무도 지키지
   않는다.** 이름을 바꾸면 조용히 끊긴다 — 그래서 여기서 함께 센다. */
{
  const J = JSON.parse(read('data/genres.json'));
  const live = new Set(Object.keys(P.RAW));
  const genres = J.genres || [];
  const linked = genres.filter(g => g.preset);
  const dead = linked.filter(g => !live.has(g.preset));
  const unlinked = [...live].filter(n => !linked.some(g => g.preset === n));
  console.log(`\n── data/genres.json (updated ${J.updated}) ` + '─'.repeat(30));
  console.log(`장르 ${genres.length} · 패턴 ${(J.patterns || []).length} · 프리셋 연결 ${linked.length}`);
  console.log(`confidence — ` + Object.entries(
    genres.reduce((a, g) => (a[g.confidence || '(없음)'] = (a[g.confidence || '(없음)'] || 0) + 1, a), {})
  ).map(([k, v]) => `${k} ${v}`).join(' · '));
  console.log(dead.length
    ? `⚠ 끊긴 연결 ${dead.length}건 — ${dead.slice(0, 10).map(g => g.preset).join(' · ')}`
    : `✅ 끊긴 연결 0건 — 연결된 이름이 전부 실재하는 프리셋이다`);
  console.log(`연결되지 않은 프리셋 ${unlinked.length}종${unlinked.length ? ' — ' + unlinked.join(' · ') : ''}`);
}

console.log('\n이 수를 문서에 적지 마십시오. 이 명령을 가리키십시오 — CLAUDE.md §4.');
