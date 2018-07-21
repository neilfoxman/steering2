class Vehicle {
  constructor(pos) {

    this.health = 1;
    this.age = 1;

    this.genes = {
      mass: new Gene(1, 0.5, 0.5),
      maxVel: new Gene(5, 1, 0.5),
      maxAcc: new Gene(0.2, 0.05, 0.5),
      sight: new Gene(70, 5, 0.5),
      foodWeight: new Gene(1, 0.2, 0.5),
      poisonWeight: new Gene(-1, 0.2, 0.5)

    };
    // this.mass = 1;
    this.pos = pos;
    this.vel = createVector(2, 0);
    this.acc = createVector(0, 0);
    this.force = createVector(0, 0);

    // this.maxvel = 5;
    // this.maxacc = 0.2;

    // this.sight = 50;

    // this.poisonWeight = -1;
    // this.foodWeight = 1;

    this.noiseCounter = 0; // noise counter used for wandering with perlin noise
    this.wanderScale = 0.05; // scale used to set impact of wandervect

  }

  reset() {
    // track age
    this.age++;

    // constant health decrease due to metabolism
    this.health -= 0.001;

    // reset forces each call in draw() as force is calculated instantaneously
    this.force = createVector(0, 0);
  }


  // This function seeks or avoids a location provided as argument
  seek(edibles) {
    // Find closest
    var closestEdible = null;
    var closestDist = Infinity;
    var closestIdx = null;
    for (var i = edibles.length - 1; i >= 0; i--) {
      var edible = edibles[i];
      // console.log(edible);

      var dist = this.pos.dist(edible.pos);
      if (dist < this.genes.sight.val && dist < closestDist) {
        // save this edible to seek
        closestEdible = edible;
        closestDist = dist;
        closestIdx = i;
      }
    }

    if (closestEdible != null) { // if there is a nearby edible
      if (this.pos.dist(closestEdible.pos) < 5) { // if the edible is within eating distance
        this.eat(edibles, closestIdx);

      } else if (this.pos.dist(closestEdible.pos) < this.genes.sight.val) { // If this edible is perceivable
        // seek the edible
        var targetPos = closestEdible.pos.copy();

        // find error (deltas) between desired position and velocity to apply seeking force
        var pErr = targetPos.sub(this.pos); // position error (deltaPos)
        pErr.setMag(this.genes.maxVel.val); // scale down desired velocity to reasonable level
        var vErr = pErr.sub(this.vel); // velocity error (deltaV)
        vErr.setMag(this.genes.maxAcc.val); // scale down deltaV to maxacc

        // This is the desired change we want to see in the velocity
        var desiredDeltaV = vErr; // Rename for clarity

        // apply weight based on edible type
        if (closestEdible.type == EDIBLETYPE.FOOD) {
          desiredDeltaV.mult(this.genes.foodWeight.val);
        } else if (closestEdible.type == EDIBLETYPE.POISON) {
          desiredDeltaV.mult(this.genes.poisonWeight.val);
        }

        this.force.add(desiredDeltaV);
      }
    } else { // if no close edible
      // begin wandering

      // determine wander from perlin noise
      this.noiseCounter += 0.1;
      var wander = noise(this.noiseCounter);

      // begin translating result into a force vector
      var wanderVect = this.vel.copy(); // initialize as current velocity

      if (wander < 0.5) {
        // wander to the left
        wanderVect.rotate(-HALF_PI);
        wanderVect.setMag(wander * this.wanderScale);
      } else {
        // wander to the right
        wanderVect.rotate(HALF_PI);
        wanderVect.setMag(wander * this.wanderScale);
      }

      this.force.add(wanderVect);
    }

  }

  eat(edibles, edibleIdx) {

    var edible = edibles[edibleIdx];
    if (edible.type == EDIBLETYPE.FOOD) {
      this.health += 0.1;
    } else if (edible.type == EDIBLETYPE.POISON) {
      this.health -= 0.5;
    }
    edibles.splice(edibleIdx, 1);
  }

  // Apply forces to keep vehicles within margins of the canvas
  applyMargins(margin) {
    var marginForce = this.genes.maxAcc.val;

    if (this.pos.x < margin) {
      this.force.add(marginForce, 0)
    } else if (this.pos.x > width - margin) {
      this.force.add(-marginForce, 0)
    }

    if (this.pos.y < margin) {
      this.force.add(0, marginForce);
    } else if (this.pos.y > height - margin) {
      this.force.add(0, -marginForce);
    }
  }

  // This function updates motion vectors based on forces
  updateMotion() {
    this.acc.add(this.force.div(this.genes.mass.val)); // a = f/m
    this.acc.limit(this.genes.maxAcc.val);
    this.vel.add(this.acc);
    this.vel.limit(this.genes.maxVel.val);
    this.pos.add(this.vel);
  }

  reproduce() {
    var v2 = new Vehicle(this.pos.copy());
    for (var geneName in v2.genes) { // for each gene
      var gene = v2.genes[geneName];

      // get the parent's gene value
      gene.copyFrom(this.genes[geneName]);

      // mutate child gene
      gene.mutate();
    }

    // limit health benefit
    v2.health = this.health + 0.2;

    // checks
    if (v2.genes.mass.val <= 0) {
      v2.genes.mass.val = v2.genes.mass.mutationPlusMinus;
    }
    if (v2.genes.sight.val <= 0) {
      v2.genes.sight.val = v2.genes.sight.mutationPlusMinus;
    }
    VEHICLES.push(v2);
  }

  show() {

    // show vehicle
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() + PI / 2);
    stroke(0);
    strokeWeight(2);
    var gr = color(0, 255, 0);
    var rd = color(255, 0, 0);
    var col = lerpColor(rd, gr, this.health);
    fill(col);

    beginShape();
    vertex(0, 0);
    vertex(5, 20);
    vertex(-5, 20);
    endShape();

    // show debug info
    if (DEBUGGING) {
      noFill();
      strokeWeight(1);
      stroke(color(255, 0, 255));
      ellipse(0, 0, 2 * this.genes.sight.val, 2 * this.genes.sight.val);

      // text(this.genes.mass.val, 0, 0);
      textAlign(CENTER);
      text(nf(this.health, 2, 2), 0, 30);
      text(nf(this.age, 4, 0), 0, 40);
    }



    pop();


  }

}