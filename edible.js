class Edible {
  constructor(pos, type) {
    this.pos = pos;
    this.type = type;
    if (this.type == EDIBLETYPE.FOOD) {
      this.size = 4;
      this.color = color(0, 255, 0);
    } else if (this.type == EDIBLETYPE.POISON) {
      this.size = 4;
      this.color = color(255, 0, 0);
    }
  }

  show() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}

var EDIBLETYPE = Object.freeze({
  FOOD: {},
  POISON: {}
})