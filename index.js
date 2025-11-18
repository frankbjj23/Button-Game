let score = 0;

const bigButton = document.getElementById(`bigButton`);
const scoreDisplay = document.getElementById(`scoreBox`);
const scoreColors = [`black`, `blue`, `green`, `orange`, `purple`];

if (scoreDisplay) {
  scoreDisplay.value = score;
}

if (bigButton) {
  bigButton.addEventListener(`click`, function () {
    score++;

    if (scoreDisplay) {
      scoreDisplay.value = score;
      const colorIndex = Math.floor(score / 10) % scoreColors.length;
      scoreDisplay.style.color = scoreColors[colorIndex];
    }
  });
}
function updateScoreDisplay() {
  if (scoreDisplay) {
    scoreDisplay.value = score;

    // MODIFIED LINE: Change the divisor from 20 to 10
    // The color changes every time the score passes a multiple of 10
    const colorIndex = Math.floor(score / 10) % scoreColors.length;
    scoreDisplay.style.color = scoreColors[colorIndex];
  }
}
updateScoreDisplay();
