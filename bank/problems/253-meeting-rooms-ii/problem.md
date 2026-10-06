Given an array of meeting time `intervals` where `intervals[i] = [start_i, end_i]`, return the **minimum number of conference rooms** required to hold all the meetings.

A meeting ending at time `t` and another starting at time `t` can share a room.

### Example 1

```
Input:  intervals = [[0,30],[5,10],[15,20]]
Output: 2
```

### Example 2

```
Input:  intervals = [[7,10],[2,4]]
Output: 1
```

### Constraints

- `1 <= intervals.length <= 10^4`
- `0 <= start_i < end_i <= 10^6`

