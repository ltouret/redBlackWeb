class RedBlackTree {
  #root;
  #size;

  constructor() {
    this.#root = null;
    this.#size = 0;
  }

  #leftRotate(x) {
    let nParent = x.right;
    if (x == this.#root)
      this.#root = nParent;
    x.moveDown(nParent);
    x.right = nParent.left;
    if (nParent.left != null)
      nParent.left.parent = x;
    nParent.left = x;
  }

  #rightRotate(x) {
    let nParent = x.left;
    if (x == this.#root)
      this.#root = nParent;
    x.moveDown(nParent);
    x.left = nParent.right;
    if (nParent.right != null)
      nParent.right.parent = x;
    nParent.right = x;
  }

  #swapColors(x1, x2) {
    let temp = x1.color;
    x1.color = x2.color;
    x2.color = temp;
  }

  #swapValues(u, v) {
    let temp = u.value;
    u.value = v.value;
    v.value = temp;
  }

  #fixRedRed(x) {
    if (x == this.#root) {
      x.color = 1;
      return;
    }
    let parent = x.parent;
    let grandparent = parent.parent;
    let uncle = x.uncle();
    if (parent.color != 1) {
      if (uncle != null && uncle.color == 0) {
        parent.color = 1;
        uncle.color = 1;
        grandparent.color = 0;
        this.#fixRedRed(grandparent);
      } else {
        if (parent.isOnLeft()) {
          if (x.isOnLeft()) {
            this.#swapColors(parent, grandparent);
          } else {
            this.#leftRotate(parent);
            this.#swapColors(x, grandparent);
          }
          this.#rightRotate(grandparent);
        } else {
          if (x.isOnLeft()) {
            this.#rightRotate(parent);
            this.#swapColors(x, grandparent);
          } else {
            this.#swapColors(parent, grandparent);
          }

          this.#leftRotate(grandparent);
        }
      }
    }
  }

  #successor(x) {
    let temp = x;
    while (temp.left != null)
      temp = temp.left;
    return temp;
  }

  #BSTreplace(x) {
    if (x.left != null && x.right != null)
      return this.#successor(x.right);
    if (x.left == null && x.right == null)
      return null;
    if (x.left != null)
      return x.left;
    else
      return x.right;
  }

  #deleteNode(v) {
    let u = this.#BSTreplace(v);

    let uvBlack = ((u == null || u.color == 1) && (v.color == 1));
    let parent = v.parent;

    if (u == null) {
      if (v == this.#root) {
        this.#root = null;
      } else {
        if (uvBlack) {
          this.#fixDoubleBlack(v);
        } else {
          if (v.sibling() != null)
            v.sibling().color = 0;
        }
        if (v.isOnLeft()) {
          parent.left = null;
        } else {
          parent.right = null;
        }
      }
      return;
    }
    if (v.left == null || v.right == null) {
      if (v == this.#root) {
        v.value = u.value;
        v.left = v.right = null;
      } else {
        if (v.isOnLeft()) {
          parent.left = u;
        } else {
          parent.right = u;
        }
        u.parent = parent;
        if (uvBlack) {
          this.#fixDoubleBlack(u);
        } else {
          u.color = 1;
        }
      }
      return;
    }
    this.#swapValues(u, v);
    this.#deleteNode(u);
  }

  #fixDoubleBlack(x) {
    if (x == this.#root)
      return;
    let sibling = x.sibling();
    let parent = x.parent;
    if (sibling == null) {
      this.#fixDoubleBlack(parent);
    } else {
      if (sibling.color == 0) {
        parent.color = 0;
        sibling.color = 1;
        if (sibling.isOnLeft()) {
          this.#rightRotate(parent);
        } else {
          this.#leftRotate(parent);
        }
        this.#fixDoubleBlack(x);
      } else {
        if (sibling.hasRedChild()) {
          if (sibling.left != null && sibling.left.color == 0) {
            if (sibling.isOnLeft()) {
              sibling.left.color = sibling.color;
              sibling.color = parent.color;
              this.#rightRotate(parent);
            } else {
              sibling.left.color = parent.color;
              this.#rightRotate(sibling);
              this.#leftRotate(parent);
            }
          } else {
            if (sibling.isOnLeft()) {
              sibling.right.color = parent.color;
              this.#leftRotate(sibling);
              this.#rightRotate(parent);
            } else {
              sibling.right.color = sibling.color;
              sibling.color = parent.color;
              this.#leftRotate(parent);
            }
          }
          parent.color = 1;
        } else {
          sibling.color = 0;
          if (parent.color == 1)
            this.#fixDoubleBlack(parent);
          else
            parent.color = 1;
        }
      }
    }
  }

  #search(n) {
    let temp = this.#root;
    while (temp != null) {
      if (n < temp.value) {
        if (temp.left == null)
          break;
        else
          temp = temp.left;
      }
      else if (n == temp.value)
        break;
      else {
        if (temp.right == null)
          break;
        else
          temp = temp.right;
      }
    }
    return temp;
  }

  getRoot() { return this.#root; }

  getSize() { return this.#size; }

  getMax() {
    let curr = this.#root;
    while (curr.right != null)
      curr = curr.right;
    return curr;
  }

  insert(n) {
    if (this.#size > 49)
      return;
    let newNode = new Node(n);
    if (this.#root == null) {
      newNode.color = 1;
      this.#root = newNode;
      this.#size++;
    }
    else {
      let temp = this.#search(n);
      if (temp.value == n)
        return;
      newNode.parent = temp;
      if (n < temp.value)
        temp.left = newNode;
      else
        temp.right = newNode;
      this.#size++;
      this.#fixRedRed(newNode);
    }
  }

  delete(n) {
    if (this.#root == null)
      return;
    let v = this.#search(n);
    if (v.value != n)
      return;
    this.#size--;
    this.#deleteNode(v);
  }

  levelOrder() {
    if (this.#root == null)
      return;
    let q = [];
    let curr = null;
    q.push(this.#root);
    while (q.length != 0) {
      curr = q.pop();
      console.log(curr.value);
      if (curr.right != null)
        q.push(curr.right);
      if (curr.left != null)
        q.push(curr.left);
    }
  }

  clear() {
    this.#root = null;
    this.#size = 0;
  }
};