
class Star {

  constructor({ x, y, color, mass, drawTail }) {
    color = color || 'rgb(200, 200, 200)';

    const randomD = function() {
      const d = ((Math.random() - 0.5) * 0.7);
      return d;
    };
    const dx = randomD();
    const dy = randomD();
    mass = mass || (Math.random() * 5) + 2;
    return {
      x: x,
      y: y,
      color: color,
      dx: dx,
      dy: dy,
      mass: mass,
      drawTail: drawTail,

      move: function(space) {
        this.x = this.moveDimension(this.x, this.dx, space.width);
        this.y = this.moveDimension(this.y, this.dy, space.height);
      },

      moveDimension: function(d, dd, dMax) {
        d += dd;
        if (d < 0) { d = dMax - 1 }
        else if (d > dMax) { d = 0 }
        return d;
      },

      draw: function(space) {
        space.c.fillStyle = this.color;
        const size = this.mass / 2;
        const sizeOffset = size / 2;
        space.c.fillRect(this.x - sizeOffset, this.y - sizeOffset, size, size);

        if (this.drawTail) {
          const tailPoint = this.tailPoint();
          space.drawLine(this.x, this.y, tailPoint.x, tailPoint.y);
        }
      },

      tailPoint: function() {
        return {
          x: this.x - ( this.dx * 15 ),
          y: this.y - ( this.dy * 15 ),
        };
      },

      setDrawTail: function(value) {
        this.drawTail = value;
      }
    };
  }

}
