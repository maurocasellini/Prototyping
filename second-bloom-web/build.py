"""Wrap second-bloom/index.html (artifact page body) into a standalone HTML document."""
from pathlib import Path
root = Path(__file__).resolve().parent.parent
s = (root / 'second-bloom' / 'index.html').read_text()
head, rest = s[:s.index('<style>')], s[s.index('<style>'):]
style, body = rest[:rest.index('</style>') + 8], rest[rest.index('</style>') + 8:]
style = style.replace('html,body{height:100%}', 'html,body{height:100%}\nbody{margin:0}', 1)
html = ('<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
        '<meta name="theme-color" content="#F6F1EE">\n<meta name="robots" content="noindex">\n'
        + head + style + '\n</head>\n<body>' + body + '\n</body>\n</html>\n')
(root / 'second-bloom-web' / 'index.html').write_text(html)
