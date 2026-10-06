from solution import Solution


# 125. Valid Palindrome


def test_example_1():
    assert Solution().isPalindrome("A man, a plan, a canal: Panama") == True


def test_example_2():
    assert Solution().isPalindrome("race a car") == False


def test_example_3():
    assert Solution().isPalindrome(" ") == True
