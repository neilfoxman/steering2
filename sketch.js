var v;
var edibles = []

function setup() {
  createCanvas(600, 360);
  v = new Vehicle(width / 2, height / 2);
}

function draw() {
  background(51);

  v.seek(createVector(mouseX, mouseY));
  v.update();
  v.show();


}