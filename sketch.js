var v;
var MARGIN = 50;
var VEHICLES = [];
var EDIBLES = [];


var cbDebugging;
var DEBUGGING = true;

function setup() {
  createCanvas(600, 360);

  // spawn starting vehicles
  for (var i = 0; i < 5; i++) {
    var x = random(MARGIN, width - MARGIN);
    var y = random(MARGIN, height - MARGIN);
    var pos = createVector(x, y);
    VEHICLES.push(new Vehicle(pos));
  }

  // spawn starting food
  for (var i = 0; i < 10; i++) {
    spawn(EDIBLETYPE.FOOD);
  }

  // spawn starting poison
  for (var i = 0; i < 5; i++) {
    spawn(EDIBLETYPE.POISON);
  }

  cbDebugging = createCheckbox();
}

function draw() {
  background(51);

  // spawn new food
  if (random() < 0.05) {
    spawn(EDIBLETYPE.FOOD);
  }

  // spawn new poison
  if (random() < 0.003) {
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
      if (v.health > 0.50 && v.age > 500 && random() < 0.005) {
        console.log("reproduced at age " + v.age);
        v.reproduce();
      }
      v.applyMargins(MARGIN);
      v.updateMotion();
      v.show()
    }

  }

  // show edibles
  for (var i = 0; i < EDIBLES.length; i++) {
    EDIBLES[i].show();
  }

  if (cbDebugging.checked() == true) {
    DEBUGGING = true;
    showAvg();
  } else {
    DEBUGGING = false;
  }
}




function spawn(edibleType) {
  var x = random(MARGIN, width - MARGIN);
  var y = random(MARGIN, height - MARGIN);
  var pos = createVector(x, y);
  EDIBLES.push(new Edible(pos, edibleType))
}

function showAvg() {


  var massAvg = 0;
  var maxVelAvg = 0;
  var maxAccAvg = 0;
  var sightAvg = 0;
  var foodWeightAvg = 0;
  var poisonWeightAvg = 0;

  var n = VEHICLES.length;
  for (var i = 0; i < n; i++) {
    var v = VEHICLES[i];
    // mass: new Gene(1, 0.1, 0.1),
    // maxVel: new Gene(5, 0.1, 0.1),
    // maxAcc: new Gene(0.2, 0.01, 0.1),
    // sight: new Gene(70, 3, 0.1),
    // foodWeight: new Gene(1, 0.2, 0.1),
    // poisonWeight: new Gene(-1, 0.2, 0.1)

    massAvg += v.genes.mass.val / n;
    maxVelAvg += v.genes.maxVel.val / n;
    maxAccAvg += v.genes.maxAcc.val / n;
    sightAvg += v.genes.sight.val / n;
    foodWeightAvg += v.genes.foodWeight.val / n;
    poisonWeightAvg += v.genes.poisonWeight.val / n;

  }

  noStroke();
  fill(255);
  var textY = 10;

  text("massAvg=" + nf(massAvg, 3, 3), 10, textY);
  textY += 10;
  text("maxVelAvg=" + nf(maxVelAvg, 3, 3), 10, textY);
  textY += 10;
  text("maxAccAvg=" + nf(maxAccAvg, 3, 3), 10, textY);
  textY += 10;
  text("sightAvg=" + nf(sightAvg, 3, 3), 10, textY);
  textY += 10;
  text("foodWeightAvg=" + nf(foodWeightAvg, 3, 3), 10, textY);
  textY += 10;
  text("poisonWeightAvg=" + nf(poisonWeightAvg, 3, 3), 10, textY);
}