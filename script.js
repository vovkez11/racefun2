const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const CAR_WIDTH = 40;
const CAR_HEIGHT = 70;
let car = { x: 180, y: 500, width: CAR_WIDTH, height: CAR_HEIGHT };
let obstacles = [];
let keys = {};
let score = 0;
let speed = 5;
let gameOver = false;

// controls
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

// spawn obstacles
function createObstacle() {
  const width = 40 + Math.random() * 60;
  const x = Math.random() * (canvas.width - width);
  obstacles.push({ x, y: -60, width, height: 40 });
}

// update game
function update() {
  if (keys['ArrowLeft'] || keys['a']) car.x -= 6;
  if (keys['ArrowRight'] || keys['d']) car.x += 6;

  // clamp car
  car.x = Math.max(0, Math.min(canvas.width - car.width, car.x));

  // move obstacles
  obstacles.forEach(o => o.y += speed);
  obstacles = obstacles.filter(o => o.y < canvas.height + 50);

  // collision
  for (let o of obstacles) {
    if (
      car.x < o.x + o.width &&
      car.x + car.width > o.x &&
      car.y < o.y + o.height &&
      car.y + car.height > o.y
    ) {
      gameOver = true;
    }
  }

  score++;
  if (score % 200 === 0) speed += 0.5;
  if (Math.random() < 0.03) createObstacle();
}

// draw everything
function draw() {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // road
  ctx.fillStyle = '#444';
  ctx.fillRect(60, 0, canvas.width - 120, canvas.height);

  // center line
  ctx.strokeStyle = '#ccc';
  ctx.setLineDash([20, 20]);
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // car
  ctx.fillStyle = 'red';
  ctx.fillRect(car.x, car.y, car.width, car.height);

  // obstacles
  ctx.fillStyle = 'yellow';
  obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.width, o.height));

  // score
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);

  // game over
  if (gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, canvas.height/2 - 50, canvas.width, 120);
    ctx.fillStyle = 'white';
    ctx.font = '26px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('💥 Crash! Score: ' + score, canvas.width/2, canvas.height/2);
  }
}

// game loop
function loop() {
  if (!gameOver) update();
  draw();
  requestAnimationFrame(loop);
}

loop();
