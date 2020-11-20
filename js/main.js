const gameContainer = document.getElementById("root");
const jumper = document.createElement("div");
const startButton = document.createElement("div");
const scorePanal = document.createElement("div");
let jumperPosition = {
  left: "",
  bottom: ""
}
let platformCount = 5;
let platforms = [];
let upTimerId;
let downTimerId;
let jumpMeter = 0;
let leftTimerId;
let rightTimerId;
let isGoingLeft = false;
let isGoingRight = false;
let score = 0;
let highScore = 0;

startButton.setAttribute("id", "start");
startButton.addEventListener('click', start);
startButton.innerText = "start";
gameContainer.appendChild(startButton);

scorePanal.addEventListener("click", restart);

function createJumper() {
  gameContainer.appendChild(jumper);
  jumper.classList.add("jumper");
  jumper.style.left = jumperPosition.left + "px";
  jumper.style.bottom = jumperPosition.bottom + "px";
}

class Platform{
  constructor(newPlatBottom){
    this.bottom = newPlatBottom;
    this.left = Math.random() * 500;
    this.body = document.createElement('div');

    const platform = this.body;
    platform.classList.add('platform');
    platform.style.left = this.left + "px";
    platform.style.bottom = this.bottom + "px";
    gameContainer.appendChild(platform);
  }
}

function createPlatforms() {
  for(let x = 0; x < platformCount; x++){
    let platformGap = 800 / platformCount;
    let newPlatBottom = 100 + x * platformGap;
    let newPlatform = new Platform(newPlatBottom);
    platforms.push(newPlatform);
  }
  jumperPosition.left = platforms[0].left + 35;
  jumperPosition.bottom = platforms[0].bottom + 15 ;
}

function movePlatform() {
  if (jumperPosition.bottom > 200){
    platforms.forEach(platform => {
      platform.bottom -= 4;
      let body = platform.body;
      body.style.bottom = platform.bottom + "px";

      if (platform.bottom < 10){
        let firstPlatform = platforms[0].body;
        firstPlatform.classList.remove('platform');
        platforms.shift();
        let newPlatform = new Platform(800);
        platforms.push(newPlatform);
      }
    });
  }
}

function jump() {
  clearInterval(downTimerId);
  upTimerId = setInterval(function(){
    jumperPosition.bottom += 5;
    jumpMeter += 5;
    jumper.style.bottom = jumperPosition.bottom + "px";
    //moveLeft();
    if(jumpMeter > 300){
      fall();
    }
  }, 30);
}

function moveLeft() {
  isGoingLeft = true;
  if(isGoingRight){
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
  }
  leftTimerId = setInterval(function () {
    if (jumperPosition.left < 570){
      jumperPosition.left += 5;
      jumper.style.left = jumperPosition.left + "px";
    }else{
      moveRight();
    }
  }, 30)
}
function moveRight() {
  isGoingRight = true;
  if(isGoingRight){
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
  }
  rightTimerId = setInterval(function () {
    if (jumperPosition.left > 0){
      jumperPosition.left -= 5;
      jumper.style.left = jumperPosition.left + "px";
    }else{
      moveLeft();
    }
  }, 30)
}
function moveUp(){
  clearInterval(leftTimerId);
  clearInterval(rightTimerId);
}
function fall() {
  clearInterval(upTimerId);
  downTimerId = setInterval(function() {
    //moveRight();
    jumperPosition.bottom -= 5;
    jumper.style.bottom = jumperPosition.bottom + "px";
    if (jumperPosition.bottom <= 0){
      gameOver();
    }
    platforms.forEach(platform => {
      if(
        (jumperPosition.bottom <= (platform.bottom + 15)) &&
        jumperPosition.bottom >= platform.bottom &&
        (jumperPosition.left + 30) >= platform.left &&
        jumperPosition.left <= (platform.left + 100)
      ){
        jump();
        score++;
      }
    })
  }, 30);
  jumpMeter = 0;
}

function control(e) {
  if(e.key === "ArrowLeft"){
    moveRight();
  }else if(e.key === "ArrowRight"){
    moveLeft();
  }else if(e.key === "ArrowUp"){
    moveUp();
  }
}

function gameOver() {
  clearInterval(upTimerId);
  clearInterval(downTimerId);
  if (score > highScore){
    highScore = score;
  }
  gameContainer.appendChild(scorePanal);
  scorePanal.classList.add("scorePanal");
  scorePanal.textContent = "score: " + score + " || high score: " + highScore;
}
function start() {
  gameContainer.removeChild(startButton);
  createPlatforms();
  createJumper();
  setInterval(movePlatform, 150);
  jump();
  document.addEventListener('keyup', control)
}
function restart() {
  score = 0;
  gameContainer.removeChild(jumper);
  gameContainer.removeChild(scorePanal);
  createJumper();
  clearInterval(movePlatform);
  setInterval(movePlatform, 150);
  jump();
  document.addEventListener('keyup', control)
}