const states = {
  view: {
    time: document.querySelector(".hud__timeleft"),
    score: document.querySelector(".hud__currentScore"),
    life: document.querySelector(".hud__currentLife"),
    cards: document.querySelectorAll(".card"),
    enemy: null,
  },
  values: {
    currentScore: 0,
    timeleft: 60,
    lives: 3,
    enemy: null,
  },
  actions: {
    enemyMoveId: setInterval(() => {
      enemyMove();
    }, 1000),
    countdownId: null,
  },
};

const playSound = (file) => {
  const sound = new Audio(`./assets/sound/${file}.m4a`);
  sound.volume = 0.2;
  sound.play();
};

const removeEnemy = () => {
  states.view.cards.forEach((card) => card.classList.remove("enemy"));
  states.view.enemy = null;
};

const enemyMove = () => {
  removeEnemy();

  let nextMove = Math.floor(Math.random() * 9);
  while (nextMove === states.values.enemy) {
    nextMove = Math.floor(Math.random() * 9);
  }

  states.values.enemy = nextMove;
  states.view.cards[nextMove].classList.add("enemy");
  states.view.enemy = states.view.cards[nextMove];
};

const gameover = () => {
  playSound("gameover");
  removeEnemy();

  setTimeout(() => {
    alert(`Game Over! Score:${states.values.currentScore}`);
    reset();
  }, 100);
};

const countdown = () => {
  states.view.time.innerText = --states.values.timeleft;
  if (states.values.timeleft <= 0) {
    gameover();
  }
};

const attackEnemy = (e) => {
  if (!states.actions.countdownId) {
    states.actions.countdownId = setInterval(() => {
      countdown();
    }, 1000);
  }

  if (e.currentTarget === states.view.enemy) {
    removeEnemy();
    playSound("hit");
    states.view.score.innerText = ++states.values.currentScore;
  } else {
    states.view.life.innerText = --states.values.lives;
    if (states.values.lives <= 0) {
      gameover();
    } else {
      playSound("miss");
    }
  }
};

const addEnemyListener = () => {
  states.view.cards.forEach((card) => {
    card.addEventListener("pointerdown", attackEnemy);
  });
};

const hudReset = () => {
  states.view.score.innerText = states.values.currentScore;
  states.view.time.innerText = states.values.timeleft;
  states.view.life.innerText = states.values.lives;
};

const reset = () => {
  states.actions.enemyMoveId = clearInterval(states.actions.enemyMoveId);
  states.actions.countdownId = clearInterval(states.actions.countdownId);
  states.values.currentScore = 0;
  states.values.timeleft = 60;
  states.values.lives = 3;

  hudReset();

  states.actions.enemyMoveId = setInterval(() => {
    enemyMove();
  }, 1000);
};

const init = () => {
  hudReset();
  addEnemyListener();
};

init();
