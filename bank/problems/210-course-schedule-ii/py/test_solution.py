from solution import Solution


# 210. Course Schedule II
# Many orders can be correct, so check the rules instead of one exact answer.


def expect_valid_order(num_courses, prerequisites):
    order = Solution().findOrder(num_courses, prerequisites)
    assert sorted(order) == list(range(num_courses))
    position = {course: i for i, course in enumerate(order)}
    for course, pre in prerequisites:
        assert position[pre] < position[course]


def test_example_1():
    expect_valid_order(2, [[1, 0]])


def test_example_2():
    expect_valid_order(4, [[1, 0], [2, 0], [3, 1], [3, 2]])


def test_example_3():
    expect_valid_order(1, [])


def test_cycle_means_impossible():
    assert Solution().findOrder(2, [[1, 0], [0, 1]]) == []


def test_longer_cycle():
    assert Solution().findOrder(3, [[0, 1], [1, 2], [2, 0]]) == []


def test_no_prerequisites():
    expect_valid_order(3, [])
