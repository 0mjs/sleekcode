// Two heaps: addNum O(log n), findMedian O(1). (NeetCode's TypeScript version needs LeetCode's global queue classes.)
class Heap {
  private a: number[] = [];
  constructor(private before: (x: number, y: number) => boolean) {}
  get size() { return this.a.length; }
  peek() { return this.a[0]!; }
  push(v: number) {
    const a = this.a;
    a.push(v);
    for (let i = a.length - 1; i > 0; ) {
      const p = (i - 1) >> 1;
      if (!this.before(a[i]!, a[p]!)) break;
      [a[i], a[p]] = [a[p]!, a[i]!];
      i = p;
    }
  }
  pop() {
    const a = this.a, top = a[0]!, last = a.pop()!;
    if (a.length) {
      a[0] = last;
      for (let i = 0; ; ) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < a.length && this.before(a[l]!, a[m]!)) m = l;
        if (r < a.length && this.before(a[r]!, a[m]!)) m = r;
        if (m === i) break;
        [a[i], a[m]] = [a[m]!, a[i]!];
        i = m;
      }
    }
    return top;
  }
}

export class MedianFinder {
  private low = new Heap((x, y) => x > y); // max-heap: the smaller half
  private high = new Heap((x, y) => x < y); // min-heap: the larger half
  addNum(num: number): void {
    this.low.push(num);
    this.high.push(this.low.pop());
    if (this.high.size > this.low.size) this.low.push(this.high.pop());
  }
  findMedian(): number {
    return this.low.size > this.high.size ? this.low.peek() : (this.low.peek() + this.high.peek()) / 2;
  }
}
