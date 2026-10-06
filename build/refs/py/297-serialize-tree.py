import json
from sleek import from_tree, to_tree


class Codec:
    def serialize(self, root):
        return json.dumps(from_tree(root))

    def deserialize(self, data):
        return to_tree(json.loads(data))
