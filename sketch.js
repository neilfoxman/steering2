var v;
var MARGIN = 50;
var VEHICLES = [];
var EDIBLES = [];
var DEBUGGING = true;

function setup() {
  createCanvas(600, 360);

  // spawn starting vehicles
  for (var i = 0; i < 10; i++) {
    var x = random(MARGIN, width - MARGIN);
    var y = random(MARGIN, height - MARGIN);
    var pos = createVector(x, y);
    VEHICLES.push(new Vehicle(pos));
  }

  // spawn starting food
  for (var i = 0; i < 10; i++) {
    var x = random(MARGIN, width - MARGIN);
    var y = random(MARGIN, height - MARGIN);
    var pos = createVector(x, y);
    EDIBLES.push(new Edible(pos, EDIBLETYPE.FOOD));
  }

  // spawn starting poison
  for (var i = 0; i < 5; i++) {
    var x = random(MARGIN, width - MARGIN);
    var y = random(MARGIN, height - MARGIN);
    var pos = createVector(x, y);
    EDIBLES.push(new Edible(pos, EDIBLETYPE.POISON));
  }
}

function draw() {
  background(51);

  // spawn new food
  if (random() < 0.05) {
    spawn(EDIBLETYPE.FOOD);
  }

  // spawn new poison
  if (random() < 0.005) {
    spawn(EDIBLETYPE.POISON);
  }



  // Update vehicles and show
  for (var i = VEHICLES.length - 1; i >= 0; i--) {
    var v = VEHICLES[i];

    v.reset();
    v.seek(EDIBLES);
    if (v.health < 0) {
      VEHICLES.splice(i, 1);
    } else {
      v.applyMargins(MARGIN);
      v.updateMotion();
      v.show()
    };

  }

  // show edibles
  for (var i = 0; i < EDIBLES.length; i++) {
    EDIBLES[i].show();
  }
}




function spawn(edibleType) {
  var x = random(MARGIN, width - MARGIN);
  var y = random(MARGIN, height - MARGIN);
  var pos = createVector(x, y);
  EDIBLES.push(new Edible(pos, edibleType))
}