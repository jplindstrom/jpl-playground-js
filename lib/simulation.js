export default class Simulation {

  constructor({ id, space }) {
    const topElement = document.querySelector(`#${id}`);
    const restartButton = topElement.querySelector(`#${id} .restart-simulation`);

    const starCountInput = topElement.querySelector(`input[name="starCount"]`);
    const drawStarTailCheckbox = topElement.querySelector(`input[name="drawStarTail"]`);
    const isFieldInvertedCheckbox = topElement.querySelector(`input[name="isFieldInverted"]`);
    const drawFieldVectorCheckbox = topElement.querySelector(`input[name="drawFieldVector"]`);
    const drawFieldStrengthCheckbox = topElement.querySelector(`input[name="drawFieldStrength"]`);
    const drawStarsLineCheckbox = topElement.querySelector(`input[name="drawStarsLine"]`);

    const self = this;
    // Update config immediately on all input changes (checkbox, text field)
    topElement.querySelectorAll(`input`).forEach((element) => {
      element.addEventListener(
        "change", function(e) { event.preventDefault(); return self.eventConfigChanged(); },
      );
    });
    // Stop form from being submitted on <Return>
    topElement.querySelectorAll(`form`).forEach((element) => {
      element.addEventListener(
        "submit", function(e) { return event.preventDefault(); return false }, false,
      );
    });

    // Click button
    restartButton.addEventListener(
      "click", function(e) { return self.eventRestartClick(e); },
    );

    // Construct object
    this.id = id;
    this.space = space;
    this.starCountInput = starCountInput;
    this.drawStarTailCheckbox = drawStarTailCheckbox;
    this.isFieldInvertedCheckbox = isFieldInvertedCheckbox;
    this.drawFieldVectorCheckbox = drawFieldVectorCheckbox;
    this.drawFieldStrengthCheckbox = drawFieldStrengthCheckbox;
    this.drawStarsLineCheckbox = drawStarsLineCheckbox;

    this.eventConfigChanged();
  }


  eventConfigChanged() {

    const starCountInputValue = this.starCountInput.value;
    const starCount = parseInt(starCountInputValue , 10);
    if (isNaN(starCount)) {
      this.starCountInput.value = this.space.starCount;
    }
    else {
      this.space.starCount = starCount;
    }

    const drawStarTail = !! this.drawStarTailCheckbox.checked;
    this.space.setDrawStarTail(drawStarTail);

    const drawFieldVector = !! this.drawFieldVectorCheckbox.checked;
    this.space.drawFieldVector = drawFieldVector;

    const drawFieldStrength = !! this.drawFieldStrengthCheckbox.checked;
    this.space.drawFieldStrength = drawFieldStrength;

    const isFieldInverted = !! this.isFieldInvertedCheckbox.checked;
    this.space.isFieldInverted = isFieldInverted;

    const drawStarsLine = !! this.drawStarsLineCheckbox.checked;
    this.space.setDrawStarsLine(drawStarsLine);

    return false;
  }

  eventRestartClick(e) {
    event.preventDefault();

    this.space.restartStars();

    return false;
  }


}
