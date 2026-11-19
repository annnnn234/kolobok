const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

let kolobok = { x: 300, y: 350, radius: 20, color: '#ffcc00', speed: 6 };
let foxes = [];
let score = 0;
let gameOver = false;
let frameCount = 0;
let keys = {};

document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

function gameLoop() {
    update();
    draw();
    if (!gameOver) requestAnimationFrame(gameLoop);
}

function update() {
    if (gameOver) return;
    if (keys['ArrowLeft'] && kolobok.x > kolobok.radius) kolobok.x -= kolobok.speed;
    if (keys['ArrowRight'] && kolobok.x < canvas.width - kolobok.radius) kolobok.x += kolobok.speed;

    frameCount++;
    if (frameCount % 60 === 0) {
        foxes.push({ x: Math.random() * (canvas.width - 40) + 20, y: -20, radius: 15, speed: 3 + Math.random() * 2 });
    }

    for (let i = foxes.length - 1; i >= 0; i--) {
        foxes[i].y += foxes[i].speed;
        let dx = kolobok.x - foxes[i].x;
        let dy = kolobok.y - foxes[i].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < kolobok.radius + foxes[i].radius) gameOver = true;
        if (foxes[i].y > canvas.height + 20) {
            foxes.splice(i, 1);
            score += 10;
            scoreEl.innerText = score;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем Колобка
    ctx.beginPath();
    ctx.arc(kolobok.x, kolobok.y, kolobok.radius, 0, Math.PI * 2);
    ctx.fillStyle = kolobok.color;
    ctx.fill();
    ctx.closePath();
    
    // Глазки
    ctx.beginPath();
    ctx.arc(kolobok.x - 7, kolobok.y - 5, 3, 0, Math.PI * 2);
    ctx.arc(kolobok.x + 7, kolobok.y - 5, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();

    // Рисуем Лис
    foxes.forEach(fox => {
        ctx.beginPath();
        ctx.arc(fox.x, fox.y, fox.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ff4500';
        ctx.fill();
        ctx.closePath();
    });

    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Лиса съела Колобка!', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '20px sans-serif';
        ctx.fillText('Очки: ' + score, canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText('Нажми F5, чтобы играть заново', canvas.width / 2, canvas.height / 2 + 60);
    }
}

gameLoop();
