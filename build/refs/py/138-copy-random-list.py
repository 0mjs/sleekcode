from sleek import RandomNode as Node


class Solution:
    def copyRandomList(self, head):
        copies = {None: None}
        n = head
        while n:
            copies[n] = Node(n.val)
            n = n.next
        n = head
        while n:
            copies[n].next = copies[n.next]
            copies[n].random = copies[n.random]
            n = n.next
        return copies[head]
