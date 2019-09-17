class Field {

  constructor({
    spaceWidth,
    spaceHeight,
    drawVector = true,
    drawStrength = true,
    isInverted = false,
  }) {
    const pixelPerLocation = 10;

    const width = Math.floor(spaceWidth / pixelPerLocation);
    const height = Math.floor(spaceHeight / pixelPerLocation);

    const newMatrix = function(value) {
      return Array.from(
        Array(
          width,
        ), () => Array.from( Array(width), () => value ),
      );
    }

    const xMatrix = newMatrix(0);
    const yMatrix = newMatrix(0);

    return {
      width: width,
      height: height,
      xMatrix: xMatrix,
      yMatrix: yMatrix,
      pixelPerLocation: pixelPerLocation,
      drawVector: drawVector,
      drawStrength: drawStrength,

      newMatrix: newMatrix,
      isInverted: isInverted,

      resetMatrix: function() {
        this.xMatrix = newMatrix(1);
        this.yMatrix = newMatrix(0.5);
      },

      xInfluence: function(point, mass) {
        const influence = this.xMatrix[ point[0] ][ point[1] ];
        return influence / mass;
      },
      yInfluence: function(point, mass) {
        const influence = this.yMatrix[ point[0] ][ point[1] ];
        return influence / mass;
      },

      pixelToPoint: function(x, y) {
        return [
          Math.floor(x / pixelPerLocation),
          Math.floor(y / pixelPerLocation),
        ];
      },

      placeGravityWell: function(xCenter, yCenter, mass) {
        const centerPoint = this.pixelToPoint(xCenter, yCenter);
        const radius = Math.max(
          2,
          Math.floor(mass * this.pixelPerLocation / 6), ///JPL: 10
        );
        // console.log(`JPL: mass: ${mass}, radius: ${radius}`);

        const gravityStep = mass / radius;
        let gravity = mass / 1000 * this.pixelPerLocation;
        // console.log("placeGravityWell", { mass: mass, gravityStep: gravityStep, gravity: gravity });
        // Should be radius ** 2 (according to physics)
        for (let r = 1, g = gravity; r < radius; r++, g = gravity / (r ** 1.2)) {
          /* if (g < 0.005) break; */
          this.setMatrixGravityCircle(centerPoint, r, g);
        }
      },

      setMatrixGravityCircle(centerPoint, radius, gravity) {
        // From https://www.mathopenref.com/coordcirclealgorithm.html
        const h = centerPoint[0];
        const k = centerPoint[1];

        ///JPL: increase as radius increases
        const step = 2 * Math.PI / 40; // originally 20
        const r = radius;

        // console.log("setMatrixGravityCircle", { radius: radius, gravity: gravity, step: step });
        for(let theta = 0;  theta < 2 * Math.PI; theta += step) {
          const gx = r * Math.cos(theta);
          const gy = r * Math.sin(theta);
          // Not sure why the adjustment does
          const x = Math.ceil(h + gx - 0.25);
          const y = Math.ceil(k - gy - 0.25);

          // No effect on the point the thing is on, so stars don't affect themselves
          if (x === h && y === k) continue;

          // Point back to centerPoint
          const xGravity = -gx * gravity;
          const yGravity =  gy * gravity;
          this.adjustMatrixGravityAt(x , y,  xGravity, yGravity);
        }
      },

      adjustMatrixGravityAt: function(px, py, dx, dy) {
        if (px < 0 || py < 0 || px >= this.width || py >= this.height) return;
        const divisor = 1; // dx && dy ? 2 : 1; ///JPL: should be something more like sqrt
        this.xMatrix[px][py] += dx / divisor;
        this.yMatrix[px][py] += dy / divisor;
      },

      matrixGravitySizeAt: function(px, py) {
        const dx = this.xMatrix[px][py];
        const dy = this.yMatrix[px][py];
        return Math.sqrt((dx ** 2) + (dy ** 2));
      },

      changeSpeed: function(star) {
        const point = this.pixelToPoint(star.x, star.y);
        const direction = this.isInverted ? -1 : 1;
        star.dx += direction * this.xInfluence(point, star.mass);
        star.dy += direction * this.yInfluence(point, star.mass);
      },


      draw: function(space) {
        for (let px = 0; px < this.width; px++) {
          for (let py = 0; py < this.height; py++) {
            const gravitySize = this.matrixGravitySizeAt(px, py);
            if (!gravitySize) continue;

            this.drawGravitySize(px, py, gravitySize, space);
          }
        }
      },

      drawGravitySize: function(px, py, gravitySize, space) {
        const pixelCount = this.pixelPerLocation;

        const x = px * pixelCount;
        const y = py * pixelCount;

        // Draw strength background
        if (this.drawStrength) {
          const opacity = Math.min(gravitySize / 4, 0.6);
          space.c.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          space.c.fillRect(x, y, pixelCount, pixelCount);
        }

        // Draw vector line
        if (this.drawVector) {
          const xCenter = x + (pixelCount / 2);
          const yCenter = y + (pixelCount / 2);
          const dx = this.xMatrix[px][py] * 100;
          const dy = this.yMatrix[px][py] * 100;
          space.drawLine(xCenter, yCenter, xCenter + dx, yCenter + dy, 'rgb(10, 10, 10)');
        }
      },
    };
  }
}
