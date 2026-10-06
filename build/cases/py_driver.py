"""Runs a reference solution on many inputs: python py_driver.py <problem dir with solution.py, cases.json, inputs.json>"""

import builtins
import importlib.util
import json
import sys
from pathlib import Path

from sleek.cases import run

folder = Path(sys.argv[1])
file = json.loads((folder / "cases.json").read_text())
inputs = json.loads((folder / "inputs.json").read_text())
sys.path.insert(0, str(folder))
sys.setrecursionlimit(100_000)
spec = importlib.util.spec_from_file_location("solution", folder / "solution.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
builtins.print = lambda *a, **k: None
out = []
for input_ in inputs:
    try:
        value = run(file, module, input_)
        json.dumps(value)  # must be JSON-able
        out.append({"ok": True, "value": value})
    except Exception as e:  # noqa: BLE001
        out.append({"ok": False, "error": f"{type(e).__name__}: {e}"[:200]})
sys.stdout.write(json.dumps(out))
