class TreeImage {
  #tree;

  constructor() {
    this.#tree = new RedBlackTree();
  }

  #connectTwoCircles(ctx, x1, y1, x2, y2) {
    ctx.fillStyle = "black";
    let d = Math.sqrt(40 * 40 + (x2 - x1) * (x2 - x1));
    let x11 = x1 - 20 * (x1 - x2) / d;
    let y11 = y1 - 20 * (y1 - y2) / d;
    let x21 = x2 + 20 * (x1 - x2) / d;
    let y21 = y2 + 20 * (y1 - y2) / d;
    ctx.moveTo(x11, y11);
    ctx.lineTo(x21, y21);
    ctx.stroke();
  }

  #drawTree(ctx, x, y, root, hGap) {
    if (root.color == 0)
      ctx.fillStyle = 'red';
    else
      ctx.fillStyle = 'grey';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
    ctx.font = '12px serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(root.value.toString(), x, y);
    if (root.left != null) {
      this.#connectTwoCircles(ctx, x, y, x - hGap, y + 40);
      this.#drawTree(ctx, x - hGap, y + 40, root.left, hGap / 2);
    }
    if (root.right != null) {
      this.#connectTwoCircles(ctx, x, y, x + hGap, y + 40);
      this.#drawTree(ctx, x + hGap, y + 40, root.right, hGap / 2);
    }
  }

  draw() {
    let canvas = document.getElementById('myCanvas');
    if (canvas.getContext) {
      canvas.width = window.innerWidth - 20;
      canvas.height = window.innerHeight - 180;
      let ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "18px sans-serif";
      ctx.strokeStyle = "#100";
      if (this.#tree.getSize() == 0)
        ctx.fillText("Tree is empty", canvas.width / 2 - 50, 70);
      else {
        let x = canvas.width / 2;
        let y = 30;
        this.#drawTree(ctx, x, y, this.#tree.getRoot(), canvas.width / 4);
      }
      ctx.stroke();
    }
  }

  getSize() { return this.#tree.getSize(); }

  insert(value) {
    if (value === undefined)
      value = document.getElementById('value').value.trim();
    document.getElementById('value').value = "";
    if (value == "")
      return;
    else if (isNaN(parseInt(value)))
      return;
    else {
      this.#tree.insert(parseInt(value));
      this.draw();
    }
  }

  insert_range(start, end, step = 1) {

    if (start === undefined)
      start = document.getElementById('range1').value.trim();
    if (end === undefined)
      end = document.getElementById('range2').value.trim();
    document.getElementById('range1').value = "";
    document.getElementById('range2').value = "";
    if (start == "" || end == "")
      return;
    else if (isNaN(parseInt(start)) || isNaN(parseInt(end)))
      return;
    start = parseInt(start);
    end = parseInt(end);
    for (let index = start, counter = 0; index < end && counter < 50; index += step, counter++)
      this.#tree.insert(index);
    this.draw();

  }

  insert_random(max) {
    if (max === undefined)
      max = document.getElementById('value').value.trim();
    document.getElementById('value').value = "";
    if (max == "")
      max = 50;
    else if (isNaN(parseInt(max)))
      return;
    this.clear();
    while (this.#tree.getSize() < max && this.#tree.getSize() < 50)
      this.#tree.insert(Math.floor(Math.random() * 500) + 1);
    this.draw();
  }

  erase(value) {
    if (value === undefined)
      value = document.getElementById('value').value.trim();
    document.getElementById('value').value = "";
    if (value == "")
      return;
    else if (isNaN(parseInt(value)))
      return;
    else {
      this.#tree.delete(parseInt(value));
      this.draw();
    }
  }

  erase_range(start, end, step = 1) {
    if (start === undefined)
      start = document.getElementById('range1').value.trim();
    if (end === undefined)
      end = document.getElementById('range2').value.trim();
    document.getElementById('range1').value = "";
    document.getElementById('range2').value = "";
    if (start == "" || end == "")
      return;
    else if (isNaN(parseInt(start)) || isNaN(parseInt(end)))
      return;
    start = parseInt(start);
    end = parseInt(end);
    if (end > this.#tree.getMax().value)
      end = this.#tree.getMax().value + 1;
    for (let index = start; index < end; index += step)
      this.#tree.delete(index);
    this.draw();
  }

  clear() {
    document.getElementById('value').value = "";
    document.getElementById('range1').value = "";
    document.getElementById('range2').value = "";
    this.#tree.clear();
    this.draw();
  }
};