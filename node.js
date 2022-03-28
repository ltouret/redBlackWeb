class Node {
  constructor(value) {
    this.value = value;
    this.color = 0;
    this.parent = this.left = this.right = null;
  }

  uncle() {
    if (this.parent == null || this.parent.parent == null)
      return null;
    if (this.parent.isOnLeft())
      return this.parent.parent.right;
    else
      return this.parent.parent.left;
  }

  isOnLeft() { return this == this.parent.left; }

  sibling() {
    if (this.parent == null)
      return null;
    if (this.isOnLeft())
      return this.parent.right;
    return this.parent.left;
  }

  moveDown(nParent) {
    if (this.parent != null) {
      if (this.isOnLeft()) {
        this.parent.left = nParent;
      }
      else {
        this.parent.right = nParent;
      }
    }
    nParent.parent = this.parent;
    this.parent = nParent;
  }

  hasRedChild() {
    return (this.left != null && this.left.color == 0) ||
      (this.right != null && this.right.color == 0);
  }
};