import heapq


class Solution:
    def minMeetingRooms(self, intervals):
        ends, best = [], 0
        for start, end in sorted(intervals):
            while ends and ends[0] <= start:
                heapq.heappop(ends)
            heapq.heappush(ends, end)
            best = max(best, len(ends))
        return best
