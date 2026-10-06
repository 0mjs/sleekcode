class Solution:
    def canAttendMeetings(self, intervals):
        intervals = sorted(intervals)
        return all(a[1] <= b[0] for a, b in zip(intervals, intervals[1:]))
