class Node
{
    constructor(value)
    {
        this.value = value;
        this.color = 0;
        this.parent = this.left = this.right = null;
    }

    uncle()
    {
        if (this.parent == null || this.parent.parent == null)
          return null;
     
        if (this.parent.isOnLeft())
          return this.parent.parent.right;
        else
          return this.parent.parent.left;
    }
     
      isOnLeft() {return this == this.parent.left;}
     
      sibling()
      {
        if (this.parent == null)
          return null;
     
        if (this.isOnLeft())
          return this.parent.right;
     
        return this.parent.left;
      }
     
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

class RedBlackTree
{
    #root;
    #size;

    constructor()
    {
      this.#root = null;
      this.#size = 0;
    }

    leftRotate(x)
    {
      let nParent = x.right;
      if (x == this.#root)
        this.#root = nParent;
      x.moveDown(nParent);
      x.right = nParent.left;
      if (nParent.left != null)
        nParent.left.parent = x;
      nParent.left = x;
    }
 
    rightRotate(x)
    {
      let nParent = x.left;
      if (x == this.#root)
        this.#root = nParent;
      x.moveDown(nParent);
      x.left = nParent.right;
      if (nParent.right != null)
        nParent.right.parent = x;
      nParent.right = x;
    }
 
    swapColors(x1, x2)
    {
      let temp = x1.color;
      x1.color = x2.color;
      x2.color = temp;
    }
 
   swapValues(u, v)
    {
      let temp = u.value;
      u.value = v.value;
      v.value = temp;
    }
 
    fixRedRed(x)
    {
      if (x == this.#root)
      {
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
        this.fixRedRed(grandparent);
      } else {
        if (parent.isOnLeft()) {
          if (x.isOnLeft()) {
            this.swapColors(parent, grandparent);
          } else {
            this.leftRotate(parent);
            this.swapColors(x, grandparent);
          }
          this.rightRotate(grandparent);
        } else {
          if (x.isOnLeft()) {
            this.rightRotate(parent);
            this.swapColors(x, grandparent);
          } else {
            this.swapColors(parent, grandparent);
          }
 
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
 
//private all up:
//public all down:
 
  getRoot() {return this.#root;}
  getSize() {return this.#size;}
 
  insert(n)
  {
    if (this.#size > 49)
      return ;
    let newNode = new Node(n);
    if (this.#root == null)
    {
      newNode.color = 1;
      this.#root = newNode;
      this.#size++;
    }
    else
    {
      let temp = this.search(n);
      if (temp.value == n)
        return;
      newNode.parent = temp;
      if (n < temp.value)
        temp.left = newNode;
      else
        temp.right = newNode;
      this.#size++;
      this.fixRedRed(newNode);
    }
  }
 
  delete(n)
  {
    if (this.#root == null) // size == 0
      return;
    let v = this.search(n);
    if (v.value != n)
    {
      // send msg to html?
      console.log("cant erase ", n);
      return;
    }
    this.#size--;
    this.deleteNode(v);
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
    }
};

class TreeImage
{
  #tree

  constructor()
  {
    this.#tree = new RedBlackTree();
  }

  // private :

  #drawTree(ctx, x, y, root, hGap)
  {
    if (root.color == 0)
      ctx.fillStyle = 'red';
    else
      ctx.fillStyle = 'grey';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2, false);  
    ctx.closePath(); //?
    ctx.fill();
    ctx.font = '12px serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(root.value.toString(), x, y);
    if (root.left != null)
    {
      this.#connectTwoCircles(ctx, x, y, x - hGap, y + 40);
      this.#drawTree(ctx, x - hGap, y + 40, root.left, hGap / 2);
    }
    if (root.right != null)
    {
      this.#connectTwoCircles(ctx, x, y, x + hGap, y + 40);
      this.#drawTree(ctx, x + hGap, y + 40, root.right, hGap / 2);
    }
  }

  #connectTwoCircles(ctx, x1, y1, x2, y2)
  {
    ctx.fillStyle="black";
    let d = Math.sqrt(40 * 40 + (x2 - x1) * (x2 - x1));
    let x11 = x1 - 20 * (x1 - x2) / d;
    let y11 = y1 - 20 * (y1 - y2) / d;
    let x21 = x2 + 20 * (x1 - x2) / d;
    let y21 = y2 + 20 * (y1 - y2) / d;
    ctx.moveTo(x11, y11);
    ctx.lineTo(x21, y21);
    ctx.stroke();
  }

  // public :

  getSize() {return this.#tree.getSize();}

  draw()
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
      if (this.#tree.getSize() == 0)
        ctx.fillText("tree is empty", canvas.width / 2 - 50, 15);
      else
      {
        let x = canvas.width / 2;
        let y = 30;
        this.#drawTree(ctx, x, y, this.#tree.getRoot(), canvas.width / 4);
      }
      ctx.stroke();
    }
  }

  insert(value)
  {
    if (value === undefined)
      value = document.getElementById('value').value.trim();
    if (value == "")
      return ;
    else if (isNaN(parseInt(value)))
      return ;
    else
    {
      this.#tree.insert(parseInt(value));
      this.draw();
      document.getElementById('value').value = "";
    }
  }

  insert_range(start, end, step = 1)
  {
    for (let index = start, counter = 0; index < end && counter < 50; index+=step, counter++)
      //this.insert(index);
     this.#tree.insert(index);
    this.draw();
  }

  insert_array(arr)
  {
    if (Array.isArray(arr) == true)
    {
      for (const index of arr)
        this.#tree.insert(index);
      this.draw();
    }
  }

  erase(value)
  {
    if (value === undefined)
      value = document.getElementById('value').value.trim();
    if (value == "")
      return ;
    else if (isNaN(parseInt(value)))
      return ;
    else
    {
      this.#tree.delete(parseInt(value));
      this.draw();
      document.getElementById('value').value = "";
    }
  }

  erase_range(start, end, step = 1)
  {
    for (let index = start; index < end; index+=step)
      this.#tree.delete(index);
    this.draw();
  }

  erase_array(arr)
  {
    if (Array.isArray(arr) == true)
    {
      for (const index of arr)
        this.#tree.delete(index);
      this.draw();
    }
  }

  clear()
  {
    this.#tree.clear();
    this.draw();
  }
};

// TODO
// change to private in RedBlackTree class
// clean input of html
// separate js files

const canvas = new TreeImage();

function init()
{
  canvas.insert(76);
  canvas.insert(84);
  canvas.insert(42);
}