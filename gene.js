class Gene {
  constructor(val, mutationPlusMinus, mutationProb) {
    this.val = val;
    this.mutationPlusMinus = mutationPlusMinus;
    this.mutationProb = mutationProb;

  }

  copyFrom(parentGene) {
    for (var propName in this) {
      // console.log(this[propName]);
      this[propName] = parentGene[propName];
    }
  }

  mutate() {
    // random mutation within range
    // if (random() < this.mutationProb) {
    //   this.val += random(-this.mutationPlusMinus, this.mutationPlusMinus);
    // }

    // mutation of fixed increment in random direction
    if (random() < this.mutationProb) {
      if (random() < 0.5) {
        this.val -= this.mutationPlusMinus;
      } else {
        this.val += this.mutationPlusMinus;
      }
    }
  }


}