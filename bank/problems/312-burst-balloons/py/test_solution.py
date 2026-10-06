# Runs every case in cases.json (the examples plus hidden edge and random cases) and a speed check.
import pytest

import solution
from sleek.testing import check, check_perf, ids, load

FILE = load(__file__)


@pytest.mark.parametrize("case", FILE["cases"], ids=ids(FILE))
def test_case(case):
    check(FILE, solution, case)


def test_fast_enough():
    check_perf(FILE, __file__)
