// Override: NeetCode's TS version marks a cell visited only after exploring from it, so it reuses cells ("aaa" on a 2-cell board)
type TrieNode = { kids: Map<string, TrieNode>; word: string | null };

export function findWords(board: string[][], words: string[]): string[] {
  const root: TrieNode = { kids: new Map(), word: null };
  for (const w of words) {
    let node = root;
    for (const ch of w) {
      if (!node.kids.has(ch)) node.kids.set(ch, { kids: new Map(), word: null });
      node = node.kids.get(ch)!;
    }
    node.word = w;
  }
  const rows = board.length, cols = board[0]!.length;
  const found: string[] = [];
  const dfs = (r: number, c: number, parent: TrieNode) => {
    const ch = board[r]![c]!;
    const node = parent.kids.get(ch);
    if (!node) return;
    if (node.word !== null) { found.push(node.word); node.word = null; }
    board[r]![c] = "#";
    if (r > 0) dfs(r - 1, c, node);
    if (r < rows - 1) dfs(r + 1, c, node);
    if (c > 0) dfs(r, c - 1, node);
    if (c < cols - 1) dfs(r, c + 1, node);
    board[r]![c] = ch;
    if (node.kids.size === 0 && node.word === null) parent.kids.delete(ch); // prune finished branches
  };
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) dfs(r, c, root);
  return found;
}
