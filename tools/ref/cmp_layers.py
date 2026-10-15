"""레퍼런스 스템(장르별 3곡 중앙값·최소·최대) vs 우리 렌더, 묶음 단위.

사용: python cmp_layers.py <작업폴더> [우리.jsonl]
  <작업폴더>/ref_layers.json — {"g1": layers.py ref 결과, ...}. 키는 곡 이름이 아니라
                               장르 머리글자 + 번호다(g=Grunge s=Shoegaze h=Heavy Metal p=Pop Punk,
                               그 밖은 <작업폴더>/genres.json).
                               어느 곡인지는 docs/음색/02-락-레퍼런스-대조.md 에만 적는다.
  우리.jsonl                  — 줄마다 {"id": 프리셋(공백은 _), "r": layers.py ours 결과}
"""
import json, statistics as st, sys
W = sys.argv[1]
ours_file = sys.argv[2] if len(sys.argv) > 2 else W + '/ours_layers.jsonl'
ref = json.load(open(W + '/ref_layers.json', encoding='utf8'))
ours = {j['id']: j['r'] for j in map(json.loads, open(ours_file, encoding='utf8'))}
G = {'Grunge': 'g', 'Shoegaze': 's', 'Heavy_Metal': 'h', 'Pop_Punk': 'p'}
# 장르를 더 잴 때는 작업폴더에 genres.json({"프리셋_이름": "머리글자"})을 둔다 — 위 넷에 덧붙는다
try:
    G.update(json.load(open(W + '/genres.json', encoding='utf8')))
except FileNotFoundError:
    pass
B = ['sub', 'bass', 'lowmid', 'mid', 'himid', 'pres', 'air']


def row(label, vals, u):
    m = st.median(vals)
    print(f'{label:16}{min(vals):7.1f}{m:7.1f}{max(vals):7.1f}{u:8.1f}{u - m:+7.1f}')


for g, p in G.items():
    if g not in ours:
        continue
    rs = [ref[p + str(i)] for i in (1, 2, 3)]
    u = ours[g]
    print(f'\n### {g}            min    med    max    ours     Δ')
    row('inst side', [r['inst_side'] for r in rs], u['inst_side'])
    for b in B:
        row('inst ' + b, [r['inst_bands'][b] for r in rs], u['inst_bands'][b])
    for grp in ('drums', 'bass', 'other'):
        row(grp + ' lvl', [r['groups'][grp]['lvl'] for r in rs], u['groups'][grp]['lvl'])
        row(grp + ' side', [r['groups'][grp]['side'] for r in rs], u['groups'][grp]['side'])
        for b in B:
            row(f'  {grp[:5]}.{b}', [r['groups'][grp]['bands'][b] for r in rs], u['groups'][grp]['bands'][b])
