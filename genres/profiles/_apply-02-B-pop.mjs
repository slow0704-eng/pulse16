/* 배치 A8 의 배정을 melody.js 세 표에 넣고, 팝의 베이스 엔진 획일성도 푼다. */
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const root = process.argv[2];
const { groups } = await import(pathToFileURL(resolve(root, 'genres/profiles/_batch-02-B-pop.mjs')).href);

const RIFF = {
  edmpop: ['edm_build', 'edm_alt'], dancepop: ['funk_cut', 'arp_folk'], freestyle: ['edm_arp', 'funk_cut'],
  hyperpop: ['edm_arp', 'edm_alt'], synthpop: ['rock_alt', 'arp_folk'], retrowave: ['edm_arp', 'rock_alt'],
  tradpop: ['jazz_gtr_swing', 'jazz_gtr_comp'], brill: ['rock_drive', 'arp_country'],
  teenpop: ['rock_alt', 'arp_folk'], indiepop: ['arp_folk', 'rock_alt'], chamber: ['arp_folk', 'arp_swing'],
  citypop: ['funk_cut', 'soul_chank'], softrock: ['arp_folk', 'soul_prog'],
  jpop: ['arp_folk', 'rock_alt'], enka: ['arp_folk', 'arp_swing'], worldpop: ['latin_montuno', 'arp_folk'],
  mideast: ['arp_folk', 'latin_montuno'], desi: ['arp_folk', 'highlife_gtr'],
  tropical: ['skank_up', 'latin_montuno'],
};
const BASS = {
  edmpop: ['bdis_abab', 'bhou_aaab'], dancepop: ['bdis_aabb', 'bhou_aabb'], freestyle: ['bdis_abab', 'bfun_abab'],
  hyperpop: ['bhou_aaab', 'bmet_aaab'], synthpop: ['bdis_abab', 'bhou_aabb'], retrowave: ['bdis_abab', 'bdis_aaab'],
  tradpop: ['bwal_abab', 'bwal_aaba'], brill: ['bwal_aabb', 'bcou_aabb'],
  teenpop: ['brock_aabb', 'bdis_aabb'], indiepop: ['brock_aabb', 'breg_aaba'], chamber: ['bwal_aabb', 'bwal_aaba'],
  citypop: ['bfun_abab', 'bfun_aabb'], softrock: ['bdis_aabb', 'bwal_aabb'],
  jpop: ['bdis_aabb', 'brock_aabb'], enka: ['bwal_aaba', 'breg_aaba'], worldpop: ['blat_aabb', 'blat_abab'],
  mideast: ['blat_aaba', 'bafr_aabb'], desi: ['bafr_aabb', 'blat_aabb'], tropical: ['breg_aabb', 'blat_abab'],
};
/* 베이스 엔진 — 분기 안에서 전부 같던 것을 장르 성격에 맞춰 가른다.
   Dance-pop 5종이 전부 pluckbs, Synth-pop 5종이 전부 square, 지역 팝 8종이
   전부 finger 였다. 옛 TONE_KIT 상속의 흔적이다. */
const ENG = {
  'Eurodance': 'pluckbs', 'EDM-pop': 'reese', 'Dance-pop': 'pluckbs',
  'Euro-pop': 'square', 'Freestyle': 'fm',
  'Hyperpop': 'square', 'Digicore': 'buzz', 'Electropop': 'square',
  'New Romantic': 'organbs', 'Retrowave': 'moog',
  'Traditional Pop': 'upright', 'Brill Building': 'upright',
  'Teen Pop': 'finger', 'Bubblegum': 'pick', 'Indie Pop': 'finger',
  'Twee Pop': 'hollow', 'Bedroom Pop': 'tapewound',
  'Chamber Pop': 'upright', 'Baroque Pop': 'upright',
  'City Pop': 'slap', 'Soft Rock': 'flatwound', 'AOR': 'flatwound',
  'J-pop': 'finger', 'Mandopop': 'finger', 'Cantopop': 'fretless', 'Kayōkyoku': 'flatwound',
  'Enka': 'upright', 'Trot': 'finger',
  'Latin Pop': 'guitarron', 'Schlager': 'tuba', 'Shibuya-kei': 'upright', 'C-pop': 'finger',
  'Arabic Pop': 'fretless', 'Rumba Flamenca': 'guitarron', 'Turbo-folk': 'tuba',
  'Desi Beats': 'sub', 'UK Bhangra': 'sub', 'Tropical Bass': 'sub',
};

const q = s => "'" + s + "'";
function block(pick, label) {
  const L = [
    `  /* B. Pop 계열 39종 — 2026-09-15 배치 A8 (genres/profiles/02-B-pop.json)`,
    `     드럼(39/39)과 편성(39/39)은 이미 전부 달랐다. 묶여 있던 것은 ${label} 풀뿐이다.`,
    `     근거는 genres/02-pop.md 의 장르별 분석과 실제 kit 이다. */`];
  for (const [k, g] of Object.entries(groups)) {
    L.push('  /* ' + g.why.split(/[.—]/)[0].trim() + ' */');
    for (const m of g.members)
      L.push('  ' + q(m).padEnd(26) + ':[' + pick[k].map(q).join(',') + '],');
  }
  return L;
}

const file = resolve(root, 'src/data/melody.js');
let s = readFileSync(file, 'utf8');
const NL = s.includes('\r\n') ? '\r\n' : '\n';
const MEL = Object.fromEntries(Object.entries(groups).map(([k, g]) => [k, g.pool]));
for (const [after, pick, label] of [
  ['function melodyPoolFor', MEL, '선율'],
  ['기타 리프 이름 목록', RIFF, '리프'],
  ['베이스 라인 이름 목록', BASS, '베이스'],
]) {
  const at = s.indexOf(after);
  const close = s.lastIndexOf('};', at);
  s = s.slice(0, close) + block(pick, label).join(NL) + NL + s.slice(close);
}
writeFileSync(file, s, 'utf8');

/* 베이스 엔진 — 프리셋 파일의 kit.bass 를 바꾼다.
   _build.js:48 이 kit.bass 로 bcfg.eng 를 덮으므로 이것이 실제로 울린다. */
const pf = resolve(root, 'src/data/presets/02-pop.js');
let ps = readFileSync(pf, 'utf8');
let changed = 0, missed = [];
for (const [name, eng] of Object.entries(ENG)) {
  const i = ps.indexOf(`'${name}'`);
  if (i < 0) { missed.push(name); continue; }
  const end = ps.indexOf('\n},', i) > 0 ? ps.indexOf('\n},', i) : i + 2000;
  const seg = ps.slice(i, end);
  const m = /bass:'([a-z0-9]+)'/.exec(seg);
  if (!m) { missed.push(name + '(bass 칸 없음)'); continue; }
  if (m[1] === eng) continue;
  ps = ps.slice(0, i) + seg.replace(/bass:'[a-z0-9]+'/, `bass:'${eng}'`) + ps.slice(end);
  changed++;
}
writeFileSync(pf, ps, 'utf8');
console.log(`melody.js — 팝 39종 × 3축 · 02-pop.js 베이스 엔진 ${changed}종 변경`);
if (missed.length) console.log('  못 찾음: ' + missed.join(', '));
