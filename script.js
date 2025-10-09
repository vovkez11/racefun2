const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

let car = { x: 180, y: 500, w: 40, h: 70 };
let keys = {};
let obstacles = [];
let score = 0;
let gameOver = false;
let speed = 5;

// --- controls ---
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

// --- restart ---
function restartGame() {
  car = { x: 180, y: 500, w: 40, h: 70 };
  keys = {};
  obstacles = [];
  score = 0;
  speed = 5;
  gameOver = false;
  animate();
}

// --- obstacle generator ---
function spawnObstacle() {
  const width = 40 + Math.random() * 50;
  const x = Math.random() * (canvas.width - width);
  obstacles.push({ x, y: -60, w: width, h: 40 });
}

// --- game update ---
function update() {
  if (keys['ArrowLeft'] || keys['a']) car.x -= 6;
  if (keys['ArrowRight'] || keys['d']) car.x += 6;
  car.x = Math.max(0, Math.min(canvas.width - car.w, car.x));

  obstacles.forEach(o => o.y += speed);
  obstacles = obstacles.filter(o => o.y < canvas.height + 50);

  for (let o of obstacles) {
    if (car.x < o.x + o.w &&
        car.x + car.w > o.x &&
        car.y < o.y + o.h &&
        car.y + car.h > o.y) {
      gameOver = true;
    }
  }

  score++;
  if (score % 200 === 0) speed += 0.5; // increase difficulty
  if (Math.random() < 0.03) spawnObstacle();
}

// --- draw everything ---
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
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // draw car
  ctx.fillStyle = 'red';
  ctx.fillRect(car.x, car.y, car.w, car.h);
  ctx.fillStyle = 'white';
  ctx.fillRect(car.x + 10, car.y + 10, 20, 20);

  // draw obstacles
  ctx.fillStyle = 'yellow';
  obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.w, o.h));

  // score
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText("Score: " + score, 10, 30);
}

// --- game loop ---
function animate() {
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("💥 Crash! Score: " + score, 60, 300);
    return;
  }

  update();
  draw();
  requestAnimationFrame(animate);
}

// --- start game ---
animate();
