// selecting elements from html using their IDs
// selecting playerA socre div
let playerA__score__card = document.getElementById("playerA__score__div");
// selecting playerB score div
let playerB__score__card = document.getElementById("playerB__score__div");
// selecting top bar div
let bar__top = document.getElementById("bar__top");
// selecting bottom bar div
let bar__bottom = document.getElementById("bar__bottom");
// selecting ball div
let ball = document.getElementById("ball");

// initializing variables, used to change the coordinates of ball
let toAddInX, toAddInY;

// defining variables to get ball and top & bottom bar position and dimensions
let ball__pos, bar__top__pos, bar__bottom__pos;

// variables storing height and width of the window
let window__width = window.innerWidth;
let window__height = window.innerHeight;

// variables storing height and width of the ball
ball__pos = ball.getBoundingClientRect();
let ball__height = ball__pos.height;
let ball__width = ball__pos.width;

// variables storing height and width of the bar
bar__top__pos = bar__top.getBoundingClientRect();
let bar__width = bar__top__pos.width;
let bar__height = bar__top__pos.height;

// variables to store information about the game status and ball direction
let flag;
let gameHasStarted;
let isBallGoingDown;

// variables to store information about both the players score and max score
let playerA__score, playerB__score, max__score;

// function to setup the position of the ball inside the window
function setupPositionOfBall() {
  toAddInX = -10;
  if (isBallGoingDown === null) {
    // setting the top css property of the ball
    ball.style.top = `${bar__height}px`;
    toAddInY = 4;
  } else {
    if (isBallGoingDown === 1) {
      // setting the bottom css property of the ball
      ball.style.bottom = `${bar__height}px`;
      toAddInY = -4;
    } else {
      // setting the top css property of the ball
      ball.style.top = `${bar__height}px`;
      toAddInY = 4;
    }
    isBallGoingDown ^= 1;
  }

  // setting the left css property of the ball
  ball.style.left = `${window__width / 2 - ball__width / 2}px`;
}

// function to setup the position of the bars
function setupBarPosition() {
  let left = window__width / 2 - bar__width / 2;

  // setting the left css property of both the bars
  bar__top.style.left = `${left}px`;
  bar__bottom.style.left = `${left}px`;
}

// function to initialize variables and showing the alert message before starting of the game
function welcomAlert() {
  // initializing different variables declared at the top
  flag = false;
  gameHasStarted = false;
  isBallGoingDown = null;
  playerA__score = 0;
  playerB__score = 0;
  max__score = 0;

  // storing max__score and max__score__player in localStorage
  localStorage.setItem("max__score", JSON.stringify(max__score));
  localStorage.setItem("max__score__player", "PlayerA");

  // calling functions to set up ball position and bars position
  setupPositionOfBall();
  setupBarPosition();
  isBallGoingDown = 1;

  // showing alert message
  window.alert(
    "Press Enter to start the game and 'a' & 'd' keys to move the bar..."
  );
}

// function for starting the game
function startTheGame() {
  // initializing variables declared at the top
  gameHasStarted = true;
  flag = false;

  // calling the move function inside requestAnimationFrame
  window.requestAnimationFrame(move);
}

// function for pausing the game
function pauseTheGame() {
  // getting the previous max score from localStorage
  let prev__max__score = JSON.parse(localStorage.getItem("max__score"));
  // initializing the current max score
  max__score = Math.max(playerA__score, playerB__score);

  // condition for comparing the previous max score to current max score
  if (prev__max__score < max__score) {
    // storing max score inside the localStorage
    localStorage.setItem("max__score", JSON.stringify(max__score));
    if (isBallGoingDown === 1) {
      localStorage.setItem("max__score__player", "PlayerA");
    } else {
      localStorage.setItem("max__score__player", "PlayerB");
    }
  }

  // getting max score and the player name from the localStorage
  max__score = JSON.parse(localStorage.getItem("max__score"));
  let player__name = localStorage.getItem("max__score__player");

  // showing alert message with current score and max score
  if (isBallGoingDown === 1) {
    window.alert(
      `PlayerA has won the game with a score of ${playerA__score}. Max Score: ${max__score}[${player__name}].`
    );
  } else {
    window.alert(
      `PlayerB has won the game with a score of ${playerB__score}. Max Score: ${max__score}[${player__name}].`
    );
  }

  // initializing variables declared at the top
  gameHasStarted = false;
  flag = false;
  playerA__score = 0;
  playerB__score = 0;

  // calling updateScore function to update the score at the screen
  updateScore();

  // calling functions to set up ball's position and both the bars positoin
  setupPositionOfBall();
  setupBarPosition();
}

// calling welcomeAlert function
welcomAlert();

// function responsible for moving the ball
function move() {
  // getting ball's current coordinates information
  ball__pos = ball.getBoundingClientRect();
  let curr__x = ball__pos.x,
    curr__y = ball__pos.y,
    curr__bottom = ball__pos.bottom,
    curr__right = ball__pos.right;

  // getting bar's current coordinates information
  bar__top__pos = bar__top.getBoundingClientRect();
  let bar__left = bar__top__pos.left;
  let bar__right = bar__top__pos.right;

  if (flag) {
    // condition for checking whether the ball has collided with the bar or touched the upper or lower hinge
    if (
      curr__y <= bar__height ||
      curr__bottom + bar__height >= window__height
    ) {
      if (curr__right >= bar__left && curr__x <= bar__right) {
        // ball has collided with the bars
        toAddInY *= -1;

        // incrementing players scores
        if (isBallGoingDown === 1) playerB__score++;
        else playerA__score++;

        // calling updateScreen function to update the score on the screen
        updateScore();

        // changing the direction of the ball
        isBallGoingDown ^= 1;
      } else {
        // ball has missed the bars and touched the upper or lower hinge
        // calling pauseGame function to pause the game
        pauseTheGame();
        return;
      }
    }
  }

  // updating the x and y coordinates of the ball
  let updated__x = curr__x + toAddInX;
  let updated__y = curr__y + toAddInY;
  let updated__right = curr__right + toAddInX;

  // condition for checking if the ball has touched the left or right hinge
  if (updated__x <= 0 || updated__right >= window__width) {
    toAddInX *= -1;
  }

  // updating the position of the ball on the screen
  ball.style.left = `${updated__x}px`;
  ball.style.top = `${updated__y}px`;

  flag = true;

  // recursively calling the move function inside requestAnimationFrame
  requestAnimationFrame(move);
}

// updateScore function for the showing the updated score of the players on the screen
function updateScore() {
  playerA__score__card.innerHTML = `${playerA__score}`;
  playerB__score__card.innerHTML = `${playerB__score}`;
}

// adding keydown event listner on the document
document.addEventListener("keydown", (event) => {
  if (
    event.key === "a" ||
    event.key === "d" ||
    event.key === "A" ||
    event.key === "D"
  ) {
    // condition for moving the bars horizontally
    if (!gameHasStarted) return;

    // getting bar's coordinates
    bar__top__pos = bar__top.getBoundingClientRect();

    let curr__x = parseFloat(bar__top__pos.x);
    let updated__x;
    if (event.key === "a" || event.key === "A") {
      // condition for moving the bar to the left side
      updated__x = curr__x - 15;
      if (updated__x < 0) updated__x = 0;
    } else if (event.key === "d" || event.key === "D") {
      // condition for moving the bar to the right side
      updated__x = curr__x + 15;
      if (updated__x + bar__width > window__width)
        updated__x = window__width - bar__width;
    }

    // updating the position of the bars on the screen
    bar__top.style.left = `${updated__x}px`;
    bar__bottom.style.left = `${updated__x}px`;
  } else if (event.key === "Enter") {
    // condition for starting the game
    if (gameHasStarted) {
      return;
    }

    // calling the startTheGame function to start the game
    startTheGame();
  }
});
