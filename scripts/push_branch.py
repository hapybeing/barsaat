#!/usr/bin/env python3
"""Push a local folder to a GitHub repo in ONE commit via the git data API (curl through the connector)."""
import base64, json, os, subprocess, sys
OWNER, REPO, ROOT = sys.argv[1], sys.argv[2], sys.argv[3]
MSG = sys.argv[4] if len(sys.argv) > 4 else 'Update'
BRANCH = sys.argv[5] if len(sys.argv) > 5 else 'main'
EXTRA_SKIP = set(sys.argv[6].split(',')) if len(sys.argv) > 6 else set()
SKIP = {'node_modules', '.git', 'dist', 'shots'}
API = f'https://api.github.com/repos/{OWNER}/{REPO}'

def call(method, url, body=None):
    cmd = ['curl', '-s', '-X', method, url, '-H', 'Accept: application/vnd.github+json']
    if body is not None:
        cmd += ['-d', '@-']
    r = subprocess.run(cmd, input=json.dumps(body).encode() if body is not None else None, capture_output=True)
    out = json.loads(r.stdout or b'{}')
    if isinstance(out, dict) and out.get('message') and not out.get('sha') and 'ref' not in out:
        print(method, url, out.get('message'), file=sys.stderr)
    return out

ref = call('GET', f'{API}/git/ref/heads/{BRANCH}')
if 'object' not in ref:
    main = call('GET', f'{API}/git/ref/heads/main')
    call('POST', f'{API}/git/refs', {'ref': f'refs/heads/{BRANCH}', 'sha': main['object']['sha']})
    ref = call('GET', f'{API}/git/ref/heads/{BRANCH}')
parent = ref['object']['sha']
base_tree = call('GET', f'{API}/git/commits/{parent}')['tree']['sha']
tree = []
for dp, dns, fns in os.walk(ROOT):
    dns[:] = [d for d in dns if d not in SKIP]
    for fn in fns:
        p = os.path.join(dp, fn); rel = os.path.relpath(p, ROOT)
        if any(rel.startswith(x) for x in EXTRA_SKIP) or os.path.islink(p): continue
        data = open(p, 'rb').read()
        blob = call('POST', f'{API}/git/blobs', {'content': base64.b64encode(data).decode(), 'encoding': 'base64'})
        tree.append({'path': rel, 'mode': '100644', 'type': 'blob', 'sha': blob['sha']})
        print('blob', rel)
t = call('POST', f'{API}/git/trees', {'tree': tree})  # full tree: removes stale files
c = call('POST', f'{API}/git/commits', {'message': MSG, 'tree': t['sha'], 'parents': [parent]})
r = call('PATCH', f'{API}/git/refs/heads/{BRANCH}', {'sha': c['sha']})
print('commit', c.get('sha'), r.get('object', {}).get('sha'))
