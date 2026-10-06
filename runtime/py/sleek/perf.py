"""The speed check, in its own process so a too-slow solution can be stopped:
python -m sleek.perf <problem folder>  → prints {"seconds": …} or {"error": …}"""

import builtins
import importlib.util
import json
import sys
import time
from pathlib import Path

from .cases import run
from .recipe import build

builtins.print = lambda *a, **k: None  # your prints would slow it down

folder = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
file = json.loads((folder / "cases.json").read_text())
sys.path.insert(0, str(folder))
spec = importlib.util.spec_from_file_location("solution", folder / "solution.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
input_ = build(file["perf"]["input"])
sys.setrecursionlimit(100_000)
start = time.perf_counter()
try:
    run(file, module, input_)
    sys.stdout.write(json.dumps({"seconds": time.perf_counter() - start}) + "\n")
except Exception as e:  # noqa: BLE001
    sys.stdout.write(json.dumps({"error": f"{type(e).__name__}: {e}"}) + "\n")
