from solution import Solution


# 252. Meeting Rooms


def test_example_1():
    assert Solution().canAttendMeetings([[0, 30], [5, 10], [15, 20]]) is False


def test_example_2():
    assert Solution().canAttendMeetings([[7, 10], [2, 4]]) is True


def test_no_meetings():
    assert Solution().canAttendMeetings([]) is True


def test_back_to_back_meetings_dont_conflict():
    assert Solution().canAttendMeetings([[5, 8], [8, 10]]) is True


def test_unsorted_input_with_an_overlap_at_the_end():
    assert Solution().canAttendMeetings([[10, 20], [1, 5], [6, 9], [19, 25]]) is False
