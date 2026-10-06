There is a foreign language that uses the English lowercase letters, but the **order of the letters** is unknown.

You are given a list of strings `words` from the alien language's dictionary, where the words are **sorted lexicographically** by the rules of this new language.

Return a string of the **unique letters** in the alien language sorted in lexicographically increasing order by the new language's rules. If there is **no valid order**, return `""`. If there are **multiple valid orders**, return **any** of them.

Note: a word that's a prefix of another must come first — `["abc", "ab"]` is invalid.

### Example 1

```
Input:  words = ["wrt","wrf","er","ett","rftt"]
Output: "wertf"
```

### Example 2

```
Input:  words = ["z","x"]
Output: "zx"
```

### Example 3

```
Input:  words = ["z","x","z"]
Output: ""
Explanation: The order is invalid, so return "".
```

### Constraints

- `1 <= words.length <= 100`
- `1 <= words[i].length <= 100`
- `words[i]` consists of only lowercase English letters.

