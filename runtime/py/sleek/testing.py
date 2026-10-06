"""What a problem's test file runs (`sk test`): every case, plus a speed check."""

from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any

import pytest

from .cases import VALIDATORS, close, normalize, preview, run

# LeetCode allows deep recursion; Python's default (1,000 levels) would fail correct recursive solutions
sys.setrecursionlimit(100_000)


def load(test_file: str) -> dict:
    return json.loads((Path(test_file).parent / "cases.json").read_text())


def ids(file: dict) -> list[str]:
    return [f"{c['name']}: {preview(file, c['input'], 50)}" for c in file["cases"]]


def check(file: dict, module: Any, case: dict) -> None:
    if file["compare"].startswith("validator:"):
        actual = run(file, module, case["input"])
        ok = VALIDATORS[file["compare"][10:]](case["input"], actual, case["output"])
        assert ok, f"{actual!r} isn't a correct answer (one correct answer: {case['output']!r})"
        return
    if file["compare"] == "float":
        actual = run(file, module, case["input"])
        assert close(normalize("exact", actual), case["output"]), f"expected {case['output']} (within 0.00001), got {actual}"
        return
    expected = normalize(file["compare"], case["output"])
    actual = normalize(file["compare"], run(file, module, case["input"]))
    assert actual == expected, f"{case['name']}: {preview(file, case['input'], 120)}"


def check_perf(file: dict, test_file: str) -> None:
    perf = file.get("perf")
    if not perf:
        pytest.skip("no speed check for this problem")
    limit = perf["limit"]["py"]
    try:
        proc = subprocess.run(
            [sys.executable, "-m", "sleek.perf", str(Path(test_file).parent)],
            capture_output=True, text=True, timeout=limit + 5,
            env={**os.environ, "PYTHONPATH": str(Path(__file__).resolve().parent.parent)},
        )
    except subprocess.TimeoutExpired:
        pytest.fail(f"Too slow: still running after {limit + 5:.0f}s on {perf['about']}. LeetCode would say Time Limit Exceeded.")
    lines = proc.stdout.strip().splitlines()
    if not lines:
        pytest.fail(proc.stderr.strip().splitlines()[-1] if proc.stderr.strip() else "the speed check crashed")
    result = json.loads(lines[-1])
    if "error" in result:
        pytest.fail(f"On the big input ({perf['about']}): {result['error']}")
    if result["seconds"] > limit:
        pytest.fail(
            f"Too slow: {result['seconds']:.2f}s on {perf['about']} (limit {limit}s). "
            "LeetCode would say Time Limit Exceeded. Try `sk hint` for the target complexity."
        )
