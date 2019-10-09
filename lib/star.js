
class Star {

  constructor({ x, y, color, mass, drawTail, isMovingInitially }) {
    color = color || 'rgb(200, 200, 200)';

    const randomD = function() {
      if (isMovingInitially) {
        const d = ((Math.random() - 0.5) * 0.7);
        return d;
      }
      return 0;
    };
    const dx = randomD();
    const dy = randomD();
    mass = mass || (Math.random() * 5) + 2;

    this.x = x;
    this.y = y;
    this.color = color;
    this.dx = dx;
    this.dy = dy;
    this.mass = mass;
    this.drawTail = drawTail;
  }

  moveBounce(space) {
    this.x = this.moveDimensionBounce(this.x, this.dx, 1, space.width);
    this.y = this.moveDimensionBounce(this.y, this.dy, 0, space.height);
  }

  moveWrap(space) {
    this.x = this.moveDimensionWrap(this.x, this.dx, space.width);
    this.y = this.moveDimensionWrap(this.y, this.dy, space.height);
  }

  moveDimensionBounce(d, dd, isX, dMax) {
    d += dd;
    if (d < 0 || d > dMax) {
      if (isX) { this.dx *= -1 }
      else     { this.dy *= -1 }
      return d - dd;
    }
    return d;
  }

  moveDimensionWrap(d, dd, dMax) {
    d += dd;
    if (d < 0) { d = dMax - 1 }
    else if (d > dMax) { d = 0 }
    return d;
  }


  draw(space) {
    space.c.fillStyle = this.color;
    const size = this.mass / 2;
    const sizeOffset = size / 2;
    space.c.fillRect(this.x - sizeOffset, this.y - sizeOffset, size, size);

    if (this.drawTail) {
      const tailPoint = this.tailPoint();
      space.drawLine(this.x, this.y, tailPoint.x, tailPoint.y);
    }
  }

  tailPoint() {
    return {
      x: this.x - ( this.dx * 15 ),
      y: this.y - ( this.dy * 15 ),
    };
  }

}
