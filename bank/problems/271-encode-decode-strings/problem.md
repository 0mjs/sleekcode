Design an algorithm to **encode** a list of strings into a single string, and **decode** that string back into the original list.

Implement `encode(strs)` and `decode(s)` so that `decode(encode(strs))` returns exactly `strs`.

The strings may contain **any** characters, including whatever delimiter you pick — so a simple `join(",")` won't survive every input.

### Example 1

```
Input:  ["neet","code","love","you"]
Output: ["neet","code","love","you"]
```

### Example 2

```
Input:  ["we","say",":","yes"]
Output: ["we","say",":","yes"]
```

### Constraints

- `0 <= strs.length < 100`
- `0 <= strs[i].length < 200`
- `strs[i]` may contain any of the 256 ASCII characters.

### Follow-up

Can you do it without relying on a delimiter that "hopefully" never appears in the input?

