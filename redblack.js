class Node
{
    constructor(value)
    {
        this.value = value;
        this.color = 0;
        this.parent = this.left = this.right = null;
          this.x = this.y = 0;
    }

    uncle()
    {
        // If no parent or grandparent, then no uncle
        if (this.parent == null || this.parent.parent == null)
          return null;
     
        if (this.parent.isOnLeft())
          // uncle on right
          return this.parent.parent.right;
        else
          // uncle on left
          return this.parent.parent.left;
    }
     
      // check if node is left child of parent
      isOnLeft() {return this == this.parent.left;}
     
      // returns pointer to sibling
      sibling()
      {
        // sibling null if no parent
        if (this.parent == null)
          return null;
     
        if (this.isOnLeft())
          return this.parent.right;
     
        return this.parent.left;
      }
     
      // moves node down and moves given node in its place
      moveDown(nParent)
      {
        if (this.parent != null)
        {
            if (this.isOnLeft())
          {
            this.parent.left = nParent;
          }
          else
          {
            this.parent.right = nParent;
          }
        }
        nParent.parent = this.parent;
        this.parent = nParent;
      }
     
      hasRedChild()
      {
        return (this.left != null && this.left.color == 0) ||
            (this.right != null && this.right.color == 0);
      }
};

class redBlack
{
    #root;
    #size;
    constructor()
    {
      this.#root = null;
      this.#size = 0;
    }

    leftRotate(x) {
    // new parent will be node's right child
    let nParent = x.right;
 
    // update this.#root if current node is this.#root
    if (x == this.#root)
      this.#root = nParent;
 
    x.moveDown(nParent);
 
    // connect x with new parent's left element
    x.right = nParent.left;
    // connect new parent's left element with node
    // if it is not null
    if (nParent.left != null)
      nParent.left.parent = x;
 
    // connect new parent with x
    nParent.left = x;
  }
 
  rightRotate(x) {
    // new parent will be node's left child
    let nParent = x.left;
 
    // update this.#root if current node is this.#root
    if (x == this.#root)
      this.#root = nParent;
 
    x.moveDown(nParent);
 
    // connect x with new parent's right element
    x.left = nParent.right;
    // connect new parent's right element with node
    // if it is not null
    if (nParent.right != null)
      nParent.right.parent = x;
 
    // connect new parent with x
    nParent.right = x;
  }
 
  swapColors(x1, x2) {
    let temp = x1.color;
    x1.color = x2.color;
    x2.color = temp;
  }
 
  swapValues(u, v) {
    let temp = u.value;
    u.value = v.value;
    v.value = temp;
  }
 
  // fix red red at given node
  fixRedRed(x) {
    // if x is this.#root color it black and return
    if (x == this.#root) {
      x.color = 1;
      return;
    }
 
    // initialize parent, grandparent, uncle
    let parent = x.parent;
    let grandparent = parent.parent;
    let uncle = x.uncle();
 
    if (parent.color != 1) {
      if (uncle != null && uncle.color == 0) {
        // uncle red, perform recoloring and recurse
        parent.color = 1;
        uncle.color = 1;
        grandparent.color = 0;
        this.fixRedRed(grandparent);
      } else {
        // Else perform LR, LL, RL, RR
        if (parent.isOnLeft()) {
          if (x.isOnLeft()) {
            // for left right
            this.swapColors(parent, grandparent);
          } else {
            this.leftRotate(parent);
            this.swapColors(x, grandparent);
          }
          // for left left and left right
          this.rightRotate(grandparent);
        } else {
          if (x.isOnLeft()) {
            // for right left
            this.rightRotate(parent);
            this.swapColors(x, grandparent);
          } else {
            this.swapColors(parent, grandparent);
          }
 
          // for right right and right left
          this.leftRotate(grandparent);
        }
      }
    }
  }

  successor(x) {
    let temp = x;
 
    while (temp.left != null)
      temp = temp.left;
 
    return temp;
  }
 
  // find node that replaces a deleted node in BST
  BSTreplace(x) {
    // when node have 2 children
    if (x.left != null && x.right != null)
      return this.successor(x.right);
 
    // when leaf
    if (x.left == null && x.right == null)
      return null;
 
    // when single child
    if (x.left != null)
      return x.left;
    else
      return x.right;
  }
 
  // deletes the given node
  deleteNode(v) {
    let u = this.BSTreplace(v);
 
    // True when u and v are both black
    let uvBlack = ((u == null || u.color == 1) && (v.color == 1));
    let parent = v.parent;
 
    if (u == null) {
      // u is null therefore v is leaf
      if (v == this.#root) {
        // v is this.#root, making this.#root null
        this.#root = null;
      } else {
        if (uvBlack) {
          // u and v both black
          // v is leaf, fix double black at v
          this.fixDoubleBlack(v);
        } else {
          // u or v is red
          if (v.sibling() != null)
            // sibling is not null, make it red"
            v.sibling().color = 0;
        }
 
        // delete v from the tree
        if (v.isOnLeft()) {
          parent.left = null;
        } else {
          parent.right = null;
        }
      }
      //delete v;
      return;
    }
 
    if (v.left == null || v.right == null) {
      // v has 1 child
      if (v == this.#root) {
        // v is this.#root, assign the value of u to v, and delete u
        v.value = u.value;
        v.left = v.right = null;
        //delete u;
      } else {
        // Detach v from tree and move u up
        if (v.isOnLeft()) {
          parent.left = u;
        } else {
          parent.right = u;
        }
        //delete v;
        u.parent = parent;
        if (uvBlack) {
          // u and v both black, fix double black at u
          this.fixDoubleBlack(u);
        } else {
          // u or v red, color u black
          u.color = 1;
        }
      }
      return;
    }
 
    // v has 2 children, swap values with successor and recurse
    this.swapValues(u, v);
    this.deleteNode(u);
  }
 
  fixDoubleBlack(x) {
    if (x == this.#root)
      // Reached this.#root
      return;
 
    let sibling = x.sibling();
    let parent = x.parent;

    if (sibling == null) {
      // No sibiling, double black pushed up
      this.fixDoubleBlack(parent);
    } else {
      if (sibling.color == 0) {
        // Sibling red
        parent.color = 0;
        sibling.color = 1;
        if (sibling.isOnLeft()) {
          // left case
          this.rightRotate(parent);
        } else {
          // right case
          this.leftRotate(parent);
        }
        this.fixDoubleBlack(x);
      } else {
        // Sibling black
        if (sibling.hasRedChild()) {
          // at least 1 red children
          if (sibling.left != null && sibling.left.color == 0) {
            if (sibling.isOnLeft()) {
              // left left
              sibling.left.color = sibling.color;
              sibling.color = parent.color;
              this.rightRotate(parent);
            } else {
              // right left
              sibling.left.color = parent.color;
              this.rightRotate(sibling);
              this.leftRotate(parent);
            }
          } else {
            if (sibling.isOnLeft()) {
              // left right
              sibling.right.color = parent.color;
              this.leftRotate(sibling);
              this.rightRotate(parent);
            } else {
              // right right
              sibling.right.color = sibling.color;
              sibling.color = parent.color;
              this.leftRotate(parent);
            }
          }
          parent.color = 1;
        } else {
          // 2 black children
          sibling.color = 0;
          if (parent.color == 1)
            this.fixDoubleBlack(parent);
          else
            parent.color = 1;
        }
      }
    }
  }


 
//public:
  // constructor
  // initialize this.#root
  //RBTree() { this.#root = null; }
 
  getRoot() { return this.#root; }
  getSize() { return this.#size; }
 
  // searches for given value
  // if found returns the node (used for delete)
  // else returns the last node while traversing (used in insert)
  search(n)
  {
    let temp = this.#root;
    while (temp != null)
    {
      if (n < temp.value)
      {
        if (temp.left == null)
          break;
        else
          temp = temp.left;
      }
      else if (n == temp.value)
        break;
      else
      {
        if (temp.right == null)
          break;
        else
          temp = temp.right;
      }
    }
 
    return temp;
  }
 
  // inserts the given value to tree
  insert(n)
  {
    let newNode = new Node(n);
    if (this.#root == null)
    {
      // when this.#root is null
      // simply insert value at this.#root
      newNode.color = 1;
      this.#root = newNode;
      this.#size++;
    }
    else
    {
      let temp = this.search(n);
 
      if (temp.value == n)
        // return if value already exists
        return;
 
      // if value is not found, search returns the node
      // where the value is to be inserted
 
      // connect new node to correct node
      newNode.parent = temp;
 
      if (n < temp.value)
        temp.left = newNode;
      else
        temp.right = newNode;
 
      // fix red red voilaton if exists
      this.#size++;
      this.fixRedRed(newNode);
      draw();
      //this.update_canvas();
    }
  }
 
  // utility function that deletes the node with given value
  delete(n) {
    if (this.#root == null)
      // Tree is empty
      return;
 
    let v = this.search(n);
 
    if (v.value != n) {
      console.log("cant erase n");
      return;
    }
 
    this.#size--;
    this.deleteNode(v);
    draw();
    //this.update_canvas();
  }

      // prints inorder recursively
      inorder(x)
      {
        if (x == null)
          return;
        this.inorder(x.left);
        console.log(x.value);
        this.inorder(x.right);
      }

      postOrder(node)
      {
        if (node == null) {
          return;
      }
      this.postOrder(node.left);
      this.postOrder(node.right);
      console.log(node.value);
  }

  preOrder(node)
  {
    if (node == null)
      return;
    console.log(node.value, !node.color ? 'red' : 'black');
    this.preOrder(node.left);
    this.preOrder(node.right);
  }
  
    // prints inorder of the tree
    printInOrder()
    {
      console.log("Inorder: ");
      if (this.#root == null)
        console.log("Tree is empty");
      else
        this.inorder(this.#root);
    }

    update_canvas()
    {
      clear();
      if (this.#root == null)
        return;
   
      let q = [];
      let curr = null;
      this.#root.x = 500;
      this.#root.y = 30;

      q.push(this.#root);
      
      while (q.length != 0)
      {
        curr = q.pop();
        
        if (curr.parent != null)
        {
          if (curr.value < curr.parent.value)
            curr.x = curr.parent.x - 50;
            curr.y = curr.parent.y + 40;
          if (curr.value > curr.parent.value)
            curr.x = curr.parent.x + 50;
            curr.y = curr.parent.y + 40;
        }

        add_value(curr);
        //console.log(curr.value);

        if (curr.right != null)
          q.push(curr.right);
        if (curr.left != null)
          q.push(curr.left);
      }
    }

    levelOrder()
    {
      if (this.#root == null)
        return;
   
      let q = [];
      let curr = null;

      q.push(this.#root);
      
      while (q.length != 0)
      {
        curr = q.pop();
        
        console.log(curr.value);

        if (curr.right != null)
          q.push(curr.right);
        if (curr.left != null)
          q.push(curr.left);
      }
    }

    clear()
		{
      this.#root = null;
      this.#size = 0;
      draw();
    }
};

function add_value(node)
{
  let canvas = document.getElementById('myCanvas');
  if (canvas.getContext)
  {
    let ctx = canvas.getContext('2d'); // alpha false?
    ctx.beginPath();
    // if black or red
    if (node.color == 0)
      ctx.fillStyle = 'red';
    else
      ctx.fillStyle = 'grey';
    ctx.arc(node.x, node.y, 22, 0, Math.PI * 2, true); // Inner circle
    ctx.fill();
    ctx.arc(node.x, node.y, 23, 0, Math.PI * 2, true); // Outer circle
    ctx.stroke();
    ctx.font = '12px serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // add number to be added here
    ctx.fillText(node.value.toString(), node.x, node.y);
  }
}

function clear()
{
  let canvas = document.getElementById('myCanvas');
  if (canvas.getContext)
  {
    let ctx = canvas.getContext('2d'); // alpha false?
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

let vGap = 40;
let radius = 20;

function draw()
{
  let canvas = document.getElementById('myCanvas');
  if (canvas.getContext)
  {
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 180;
    let ctx = canvas.getContext('2d'); // alpha false?
    //ctx.clearRect(0, 0, canvas.width, canvas.height); // For IE 9

    ctx.font = "14px sans-serif";
    ctx.strokeStyle = "#100";
    if (tree.getSize() == 0)
      ctx.fillText("tree is empty", canvas.width / 2 - 50, 15);
    else
    {
      let x = canvas.width / 2;
      let y = 30;
      drawTree(ctx, x, y, tree.getRoot(), canvas.width / 4);
    }
    ctx.stroke();
  }
}

function drawTree(ctx, x, y, root, hGap)
{
  if (root.color == 0)
    ctx.fillStyle = 'red';
  else
    ctx.fillStyle = 'grey';

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);  
  ctx.closePath();
  ctx.fill();

  ctx.font = '12px serif';
  ctx.fillStyle = 'black';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(root.value.toString(), x, y);
        
  
  if (root.left != null)
  {
    connectTwoCircles(ctx, x, y, x - hGap, y + vGap);
    drawTree(ctx, x - hGap, y + vGap, root.left, hGap / 2);
  }
 
  if (root.right != null)
  {
    connectTwoCircles(ctx, x, y, x + hGap, y + vGap);
    drawTree(ctx, x + hGap, y + vGap, root.right, hGap / 2);
  }
}

function connectTwoCircles(ctx, x1, y1, x2, y2)
{
  ctx.fillStyle="black";
  let d = Math.sqrt(vGap * vGap + (x2 - x1) * (x2 - x1));
  let x11 = x1 - radius * (x1 - x2) / d;
  let y11 = y1 - radius * (y1 - y2) / d;
  let x21 = x2 + radius * (x1 - x2) / d;
  let y21 = y2 + radius * (y1 - y2) / d;
  ctx.moveTo(x11, y11);
  ctx.lineTo(x21, y21);
  ctx.stroke();
} 

// TODO
// max insert 50 even on arr_insert
// func that will only fix color after each insert delete!. making it faster that drawing all again
// function update_color

let tree = new redBlack();

tree.insert(23);
tree.insert(42);
tree.insert(65);

function arr_insert(arr)
{
  if (Array.isArray(arr) == true)
    for (let index = 0, size = 100; index < size; index++) {
      tree.insert(index);
    }
}

//console.log(Array.isArray([1,2,3]));

for (let index = 0, size = 100; index < size; index++) {
  //tree.insert(index);
  //tree.insert(size-index);
}

for (let index = 0, size = 100; index < size; index += 2) {
  //tree.insert(index);
  //tree.insert(size-index);
}