class Space {

  constructor({
    id,
    starCount = 100,
    maxDistance = 100,
    blackHoleGravity = 10,
    drawStarTail = true,
    drawStarsLine = true,
    drawFieldVector = true,
    drawFieldStrength = true,
    isFieldInverted = false,
  }) {

    this.id = id;
    this.starCount = starCount;
    this.stars = [];
    this.maxDistance = maxDistance;
    this.field = null;
    this.blackHoleGravity = blackHoleGravity;
    this.drawStarsLine = drawStarsLine;
    this.drawFieldVector = drawFieldVector;
    this.drawFieldStrength = drawFieldStrength;
    this.isFieldInverted = isFieldInverted;

    // Initialized during setup()
    this.canvas = null;
    this.c = null;
    this.width = null;
    this.height = null;
  }

  // Call after the div for #id is rendered
  setup() {
    if (this.canvas) return false;

    const canvas = this.canvas = document.getElementById(this.id);
    this.width = canvas.width;
    this.height = canvas.height;
    const c = this.c = canvas.getContext("2d");

    return true;
  }

  passTime() {
    this.ensureStarCount();

    this.recreateField();

    const field = this.field;
    for (let star of this.stars) {
      field.changeSpeed(star);
    }

    for (let star of this.stars) {
      star.move(this);
    }

    this.draw();
  }

  restartStars() {
    this.stars = [];
  }

  ensureStarCount() {
    const missingCount = this.starCount - this.stars.length;
    if (missingCount > 0) {
      this.stars.push(
        ... Array(missingCount).fill().map(
          () => new Star({
            x: Math.floor(Math.random() * this.width),
            y: Math.floor(Math.random() * this.height),
            drawTail: this.drawStarTail,
          }),
        )
      );
    }
    else if (missingCount < 0) {
      Array.from({ length: -missingCount }).forEach( () => this.stars.pop() );
    }
  }

  setDrawStarTail(value) {
    this.drawStarTail = value;
    this.stars.forEach((star) => star.setDrawTail(value));
  }

  setDrawStarsLine(value) {
    //TODO: remove limitation after optimising the O(n**2) stars line
    if (this.starCount > 300) {
      value = false;
    }
    this.drawStarsLine = value;
  }

  recreateField() {
    this.field = new Field({
      spaceWidth: this.width,
      spaceHeight: this.height,
      drawVector: this.drawFieldVector,
      drawStrength: this.drawFieldStrength,
      isInverted: this.isFieldInverted,
    });
    this.field.placeGravityWell(
      Math.ceil((this.width  / 2) - (this.field.pixelPerLocation / 2)),
      Math.ceil((this.height / 2) - (this.field.pixelPerLocation / 2)),
      this.blackHoleGravity,
    );

    for (let star of this.stars) {
      this.field.placeGravityWell(star.x, star.y, star.mass);
    }
  }

  draw() {
    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.field.draw(this);
    this.c.strokeStyle = 'rgb(100, 100, 100)';

    // Draw stars
    for (let star of this.stars) {
      star.draw(this);
    }

    // Draw lines between stars
    if (this.drawStarsLine) {
      this.drawStarLines();
    }
  }

  drawStarLines() {

    for (let star1 of this.stars) {
      for (let star2 of this.stars) {
        if (star1 === star2) { continue }
        if (this.isTooFarAway(star1, star2)) { continue }
        this.drawStarLine(star1, star2);
      }
    }
  }

  isTooFarAway(star1, star2) {
    const xDistance = Math.abs(star1.x - star2.x);
    if (xDistance > this.maxDistance) return true;

    const yDistance = Math.abs(star1.y - star2.y);
    if (yDistance > this.maxDistance) return true;

    return false;
  }

  drawStarLine(star1, star2) {
    this.drawLine(star1.x, star1.y, star2.x, star2.y, "rgb(255, 255, 255, 0.17)");
  }

  drawLine(x1, y1, x2, y2, strokeStyle) {
    const c = this.c;
    if (strokeStyle) {
      c.strokeStyle = strokeStyle;
    }
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
    c.closePath();
  }

  totalSpeedX() {
    return this.stars.map(s => s.dx).reduce((delta, sum) => delta + sum, 0).toPrecision(2);
  }

  totalSpeedY() {
    return this.stars.map(s => s.dy).reduce((delta, sum) => delta + sum, 0).toPrecision(2);
  }

}
