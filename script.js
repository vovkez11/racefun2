const gameContainer = document.getElementById('gameContainer');
const player = document.getElementById('player');

let playerX = 130;
let enemies = [];
let gameOver = false;
let score = 0;

// Move player
document.addEventListener('keydown', (e) => {
  if (gameOver) return;
  if (e.key === 'ArrowLeft' && playerX > 0) playerX -= 10;
  if (e.key === 'ArrowRight' && playerX < 260) playerX += 10;
  player.style.left = playerX + 'px';
});

// Create enemies
function createEnemy() {
  const enemy = document.createElement('div');
  enemy.classList.add('enemy');
  enemy.style.left = Math.floor(Math.random() * 260) + 'px';
  enemy.style.top = '-60px';
  gameContainer.appendChild(enemy);
  enemies.push(enemy);
}

function updateGame() {
  if (gameOver) return;

  enemies.forEach((enemy, i) => {
    let top = parseInt(enemy.style.top);
    top += 5;
    enemy.style.top = top + 'px';

    if (top > 400) {
      enemy.remove();
      enemies.splice(i, 1);
      score++;
    }

    // Collision
    const enemyRect = enemy.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    if (
      enemyRect.left < playerRect.right &&
      enemyRect.right > playerRect.left &&
      enemyRect.top < playerRect.bottom &&
      enemyRect.bottom > playerRect.top
    ) {
      endGame();
    }
  });

  requestAnimationFrame(updateGame);
}

function endGame() {
  gameOver = true;
  alert(`💥 Game Over! Your score: ${score}`);
  window.location.reload();
}

// Game loop
setInterval(createEnemy, 1000);
updateGame();
