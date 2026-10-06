class Solution:
    def encode(self, strs):
        return "".join(f"{len(s)}#{s}" for s in strs)

    def decode(self, s):
        out, i = [], 0
        while i < len(s):
            j = s.index("#", i)
            n = int(s[i:j])
            out.append(s[j + 1 : j + 1 + n])
            i = j + 1 + n
        return out
