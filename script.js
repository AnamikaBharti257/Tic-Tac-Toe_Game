let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newgamebtn = document.querySelector("#new-btn");
let msgcontainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let draw = document.querySelector("#draw");

let turn0 = true; // true -> 0's turn, false -> X's turn
let count = 0;
let gameOver = false;
let moveInProgress = false; // prevents re-entrancy during a move

const winpatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

const disabledbox = () => {
  for (let box of boxes) {
    box.disabled = true;
    box.style.pointerEvents = "none";
  }
};

const enabledbox = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
    box.style.pointerEvents = "";
  }
};

const showwinner = (winner) => {
  if (gameOver) return;
  gameOver = true;
  disabledbox(); // lock immediately
  msg.innerText = `🎉 Congratulations, winner is ${winner}!`;
  draw.innerText = "";
  msgcontainer.classList.remove("hide");
};

const drawmsg = () => {
  if (gameOver) return;
  gameOver = true;
  disabledbox(); // lock immediately
  msg.innerText = "";
  draw.innerText = "🤝 Oops.. It's a Draw!";
  msgcontainer.classList.remove("hide");
};

const checkwinner = () => {
  if (gameOver) return;

  for (let pattern of winpatterns) {
    const [a,b,c] = pattern;
    const pa = boxes[a].innerText.trim();
    const pb = boxes[b].innerText.trim();
    const pc = boxes[c].innerText.trim();

    if (pa && pa === pb && pb === pc) {
      showwinner(pa);
      return; // stop immediately if winner found
    }
  }

  // no winner found
  if (!gameOver && count === 9) {
    drawmsg();
  }
};

const resetGame = () => {
  turn0 = true;
  count = 0;
  gameOver = false;
  moveInProgress = false;
  enabledbox();
  msgcontainer.classList.add("hide");
  msg.innerText = "";
  draw.innerText = "";
};

// Attach listeners once per box (prevents duplicates if the script runs again)
boxes.forEach((box, idx) => {
  if (box.dataset.listener === "true") return; // already attached
  box.dataset.listener = "true";

  box.addEventListener("click", (e) => {
    // prevent overlapping moves or clicks after game over
    if (gameOver || moveInProgress) return;

    moveInProgress = true;
    // immediately lock this box so a rapid second click won't re-enter
    box.disabled = true;
    box.style.pointerEvents = "none";

    // set mark for this move
    if (turn0) {
      box.innerText = "0";
      turn0 = false;
    } else {
      // use innerText (not innerHTML) to keep comparisons consistent
      box.innerText = "X";
      turn0 = true;
    }

    count++;

    // Check winner/draw synchronously
    checkwinner();

    // small safe cleanup: release move lock only if the game hasn't ended
    // If game ended, gameOver will be true and boxes are disabled anyway.
    if (!gameOver) {
      moveInProgress = false;
    }
  });
});

newgamebtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
