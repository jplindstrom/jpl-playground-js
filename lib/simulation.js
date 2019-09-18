class Simulation {

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

    this.eventConfigChanged = function() {

      const starCountInputValue = starCountInput.value;
      const starCount = parseInt(starCountInputValue , 10);
      if (isNaN(starCount)) {
        starCountInput.value = this.space.starCount;
      }
      else {
        this.space.starCount = starCount;
      }

      const drawStarTail = !! drawStarTailCheckbox.checked;
      this.space.setDrawStarTail(drawStarTail);

      const drawFieldVector = !! drawFieldVectorCheckbox.checked;
      this.space.drawFieldVector = drawFieldVector;

      const drawFieldStrength = !! drawFieldStrengthCheckbox.checked;
      this.space.drawFieldStrength = drawFieldStrength;

      const isFieldInverted = !! isFieldInvertedCheckbox.checked;
      this.space.isFieldInverted = isFieldInverted;

      const drawStarsLine = !! drawStarsLineCheckbox.checked;
      this.space.setDrawStarsLine(drawStarsLine);

      return false;
    };

    this.eventRestartClick = function(e) {
      event.preventDefault();

      this.space.restartStars();

      return false;
    };

    this.eventConfigChanged();

  }
}
