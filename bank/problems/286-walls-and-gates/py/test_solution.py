from solution import Solution


# 286. Walls and Gates

INF = 2147483647


def test_example_1():
    rooms = [
        [INF, -1, 0, INF],
        [INF, INF, INF, -1],
        [INF, -1, INF, -1],
        [0, -1, INF, INF],
    ]
    Solution().wallsAndGates(rooms)
    assert rooms == [
        [3, -1, 0, 1],
        [2, 2, 1, -1],
        [1, -1, 2, -1],
        [0, -1, 3, 4],
    ]


def test_example_2_single_wall():
    rooms = [[-1]]
    Solution().wallsAndGates(rooms)
    assert rooms == [[-1]]


def test_unreachable_room_stays_inf():
    rooms = [[0, -1, INF], [INF, -1, INF]]
    Solution().wallsAndGates(rooms)
    assert rooms == [[0, -1, INF], [1, -1, INF]]


def test_picks_the_nearest_of_two_gates():
    rooms = [[0, INF, INF, INF, 0]]
    Solution().wallsAndGates(rooms)
    assert rooms == [[0, 1, 2, 1, 0]]


def test_no_gates_at_all():
    rooms = [[INF, INF]]
    Solution().wallsAndGates(rooms)
    assert rooms == [[INF, INF]]
