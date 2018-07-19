var v;
var MARGIN = 50;
var EDIBLES = [];
var DEBUGGING = true;

function setup() {
  createCanvas(600, 360);
  v = new Vehicle(width / 2, height / 2);

  for (var i = 0; i < 10; i++) {
    var x = random(MARGIN, width - MARGIN);
    var y = random(MARGIN, height - MARGIN);
    var pos = createVector(x, y);
    EDIBLES.push(new Edible(pos, EDIBLETYPE.FOOD));
  }
}

function draw() {
  background(51);

  v.resetForces();
  v.seek(EDIBLES);
  v.applyMargins(MARGIN);
  v.updateMotion();
  v.show();

  for (var i = 0; i < EDIBLES.length; i++) {
    var edible = EDIBLES[i];
    edible.show();
  }


}