from solution import Solution


# 253. Meeting Rooms II


def test_example_1():
    assert Solution().minMeetingRooms([[0, 30], [5, 10], [15, 20]]) == 2


def test_example_2():
    assert Solution().minMeetingRooms([[7, 10], [2, 4]]) == 1


def test_back_to_back_meetings_share_a_room():
    assert Solution().minMeetingRooms([[1, 5], [5, 10], [10, 15]]) == 1


def test_all_overlapping():
    assert Solution().minMeetingRooms([[1, 10], [2, 9], [3, 8], [4, 7]]) == 4


def test_single_meeting():
    assert Solution().minMeetingRooms([[3, 4]]) == 1


def test_rooms_freed_and_reused():
    assert Solution().minMeetingRooms([[1, 4], [2, 5], [4, 8], [5, 9], [9, 10]]) == 2
