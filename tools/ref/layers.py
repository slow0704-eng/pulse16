"""층 구조 비교 — 레퍼런스(Demucs 스템)와 우리(트랙 솔로)를 같은 네 묶음으로 접는다.

  drums · bass · other(기타·건반) · vocals(레퍼런스만)
  · 묶음별 레벨: 반주(drums+bass+other) 합 대비 dB
  · 묶음별 대역 점유율: 그 묶음 안에서의 대역 분포
  · 반주 전체의 대역 점유율과 사이드/미드 — 보컬을 뺀 상태로 비교
  · 레퍼런스는 몸통(3초 RMS 상위 50%) 구간만 쓴다 — 인트로·아웃트로를 뺀다

사용: python layers.py ref <stem_dir>...     (각 dir 에 drums/bass/other/vocals.wav)
      python layers.py ours <solo_dir> <prefix>
출력: JSON 한 줄
"""
import glob, json, os, sys
import numpy as np, soundfile as sf
from scipy.signal import welch

BANDS = [('sub', 20, 60), ('bass', 60, 250), ('lowmid', 250, 500), ('mid', 500, 2000),
         ('himid', 2000, 4000), ('pres', 4000, 8000), ('air', 8000, 16000)]
GROUP = {'kick': 'drums', 'snare': 'drums', 'clap': 'drums', 'chat': 'drums', 'ohat': 'drums',
         'tom': 'drums', 'perc': 'drums', 'bass': 'bass',
         'gtr': 'other', 'gtr2': 'other', 'keys': 'other', 'keys2': 'other'}


def load(fn):
    x, sr = sf.read(fn, always_2d=True, dtype='float32')
    if x.shape[1] == 1:
        x = np.repeat(x, 2, 1)
    return x, sr


def body_mask(m, sr):
    hop, win = int(sr * 0.5), int(sr * 3)
    rms = np.array([np.sqrt(np.mean(m[i:i + win] ** 2) + 1e-12) for i in range(0, max(1, len(m) - win), hop)])
    mk = np.zeros(len(m), bool)
    for k, v in enumerate(rms):
        if v >= np.median(rms):
            mk[k * hop:k * hop + win] = True
    return mk


def spec(x, sr):
    """미드 PSD 와 사이드 파워 — 대역 계산에 쓴다"""
    M, S = x.mean(1), (x[:, 0] - x[:, 1]) / 2
    f, P = welch(M, sr, nperseg=8192)
    return f, P * (f[1] - f[0]), float(np.mean(S ** 2)), float(np.mean(M ** 2))


def summarize(groups):
    """groups: name -> (f, Pmid, side_pow, mid_pow). 묶음끼리는 무상관이라 파워를 더한다."""
    f = next(iter(groups.values()))[0]
    inst = sum(groups[g][1] for g in ('drums', 'bass', 'other') if g in groups)
    inst_side = sum(groups[g][2] for g in ('drums', 'bass', 'other') if g in groups)
    inst_mid = sum(groups[g][3] for g in ('drums', 'bass', 'other') if g in groups)
    tot = inst[(f >= 20) & (f < 16000)].sum()
    db = lambda v: round(float(10 * np.log10(v + 1e-20)), 2)
    out = {'inst_bands': {n: db(inst[(f >= a) & (f < b)].sum() / tot) for n, a, b in BANDS},
           'inst_side': db(inst_side / inst_mid), 'groups': {}}
    for g, (_, P, sp, mp) in groups.items():
        gt = P[(f >= 20) & (f < 16000)].sum()
        out['groups'][g] = {'lvl': db(gt / tot), 'side': db(sp / mp),
                            'bands': {n: db(P[(f >= a) & (f < b)].sum() / gt) for n, a, b in BANDS}}
    return out


if sys.argv[1] == 'ref':
    res = []
    for d in sys.argv[2:]:
        st = {g: load(os.path.join(d, g + '.wav')) for g in ('drums', 'bass', 'other', 'vocals')}
        sr = st['drums'][1]
        mix = sum(v[0] for v in st.values())
        mk = body_mask(mix.mean(1), sr)
        res.append(summarize({g: spec(v[0][mk], sr) for g, v in st.items()}))
    print(json.dumps(res))
else:
    D, pre = sys.argv[2], sys.argv[3]
    acc = {}
    for fn in glob.glob(os.path.join(D, pre + '__*.wav')):
        tid = os.path.basename(fn)[len(pre) + 2:-4]
        if tid == 'MIX':
            continue
        x, sr = load(fn)
        f, P, sp, mp = spec(x[int(sr * 0.5):], sr)
        g = GROUP[tid]
        if g in acc:
            a = acc[g]; acc[g] = (f, a[1] + P, a[2] + sp, a[3] + mp)
        else:
            acc[g] = (f, P, sp, mp)
    print(json.dumps(summarize(acc)))
