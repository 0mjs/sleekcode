"""`sk play`: runs every example with your prints shown, then your answer next to the expected one.
python -m sleek.play <problem folder>"""

import importlib.util
import os
import shutil
import sys
import traceback
from pathlib import Path
import json

from .cases import preview, run, same, short

sys.setrecursionlimit(100_000)  # like LeetCode: recursive solutions shouldn't hit Python's default limit

tty = sys.stdout.isatty() or os.environ.get("FORCE_COLOR") == "1"


def paint(code: str):
    return lambda s: f"\x1b[{code}m{s}\x1b[0m" if tty else s


dim, green, red, bold = paint("2"), paint("32"), paint("31"), paint("1")
width = min(shutil.get_terminal_size((80, 20)).columns, 100)

folder = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
file = json.loads((folder / "cases.json").read_text())
examples = [c for c in file["cases"] if c["name"].startswith("example")]
sys.path.insert(0, str(folder))
spec = importlib.util.spec_from_file_location("solution", folder / "solution.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

ok = 0
for i, ex in enumerate(examples):
    title = f"── Example {i + 1} "
    print(f"\n{bold(title)}{dim('─' * max(4, width - len(title)))}")
    print(dim(preview(file, ex["input"], width - 4)))
    try:
        answer = run(file, module, ex["input"])
        good = same(file, answer, ex["output"], ex["input"])
        ok += good
        print(f"{green('✓') if good else red('✗')} {bold(short(answer, width - 6))}" + ("" if good else dim(f"   expected {short(ex['output'], 60)}")))
    except Exception as e:  # noqa: BLE001
        frames = [f for f in traceback.extract_tb(e.__traceback__) if f.filename.endswith("solution.py")]
        where = f"  solution.py line {frames[-1].lineno}" if frames else ""
        print(f"{red('✗')} {red(f'{type(e).__name__}: {e}')}{dim(where)}")

done = ok == len(examples)
summary = green(f"✓ {ok}/{len(examples)} examples match") if done else f"{ok}/{len(examples)} examples match"
print(f"\n{summary}{dim(' · now try sk test (hidden cases + speed)') if done else ''}\n")
