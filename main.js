
import Simulation from "./lib/simulation.js";
import Space from "./lib/space.js";
import Field from "./lib/field.js";
import Star from "./lib/star.js";


const milkySpace = new Space({
  id: "milky",
  starCount: 25,
  blackHoleGravity: 0,
  drawStarTail: true,
  drawStarsLine: true,
  maxDistance: 60,
  drawFieldVector: true,
  drawFieldStrength: false,
  isFieldInverted: false,
});
const milkySimulation = new Simulation({
  id: "milky-simulation",
  space: milkySpace,
});


const spaces = [
  new Space({
    id: "andromeda",
    starCount: 4,
    maxDistance: 20,
    blackHoleGravity: 4,
  }),
  milkySpace,
];

function passTime() {
  for (let space of spaces) {
    space.passTime();
  }

  window.requestAnimationFrame(passTime);
}

passTime();

