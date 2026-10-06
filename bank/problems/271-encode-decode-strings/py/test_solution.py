from solution import Solution


# 271. Encode and Decode Strings
# Any encoding works, as long as decode(encode(x)) gives back x.


def round_trip(strs):
    return Solution().decode(Solution().encode(strs))


def test_example_1():
    assert round_trip(["neet", "code", "love", "you"]) == ["neet", "code", "love", "you"]


def test_example_2():
    assert round_trip(["we", "say", ":", "yes"]) == ["we", "say", ":", "yes"]


def test_empty_list():
    assert round_trip([]) == []


def test_list_containing_an_empty_string():
    assert round_trip([""]) == [""]


def test_several_empty_strings():
    assert round_trip(["", "", "a", ""]) == ["", "", "a", ""]


def test_strings_containing_common_delimiters():
    tricky = ["a,b", "#", "4#abc", "|", "\\n", " ", "::", "5#"]
    assert round_trip(tricky) == tricky


def test_encode_returns_a_single_string():
    assert isinstance(Solution().encode(["a", "b"]), str)
