
import { Game } from './types';

const NEBULA_RIVALS_CODE = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; background: #0a0a0c; color: #fff; font-family: sans-serif; overflow: hidden; }
        canvas { display: block; cursor: crosshair; }
        #ui { position: absolute; top: 20px; left: 20px; pointer-events: none; }
        .bar { width: 200px; height: 10px; background: #333; border-radius: 5px; margin-bottom: 5px; }
        .fill { height: 100%; border-radius: 5px; transition: width 0.2s; }
        #hp { background: #ff4757; }
        #enemy-hp { background: #2f3542; border: 1px solid #ff4757; }
        #enemy-fill { background: #ff4757; }
        .label { font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 2px; }
    </style>
</head>
<body>
    <div id="ui">
        <div class="label">You (WASD + Click)</div>
        <div class="bar"><div id="hp" class="fill" style="width: 100%"></div></div>
        <div class="label" style="margin-top: 15px">Rival (AI)</div>
        <div class="bar" id="enemy-hp"><div id="enemy-fill" class="fill" style="width: 100%"></div></div>
    </div>
    <canvas id="game"></canvas>
    <script>
        const canvas = document.getElementById('game');
        const ctx = canvas.getContext('2d');
        const hpFill = document.getElementById('hp');
        const enemyFill = document.getElementById('enemy-fill');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const player = { x: 100, y: canvas.height/2, r: 20, color: '#7d5fff', hp: 100, speed: 5 };
        const enemy = { x: canvas.width - 100, y: canvas.height/2, r: 20, color: '#ff4757', hp: 100, speed: 3 };
        const bullets = [];
        const keys = {};

        window.onkeydown = e => keys[e.key.toLowerCase()] = true;
        window.onkeyup = e => keys[e.key.toLowerCase()] = false;
        
        canvas.onmousedown = e => {
            const angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
            bullets.push({ x: player.x, y: player.y, vx: Math.cos(angle) * 15, vy: Math.sin(angle) * 15, owner: 'player' });
        };

        function update() {
            if (keys['w'] && player.y > player.r) player.y -= player.speed;
            if (keys['s'] && player.y < canvas.height - player.r) player.y += player.speed;
            if (keys['a'] && player.x > player.r) player.x -= player.speed;
            if (keys['d'] && player.x < canvas.width/2 - 50) player.x += player.speed;

            // Simple AI
            if (Math.abs(enemy.y - player.y) > 10) enemy.y += (player.y > enemy.y ? 1 : -1) * enemy.speed;
            if (Math.random() < 0.02) {
                const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
                bullets.push({ x: enemy.x, y: enemy.y, vx: Math.cos(angle) * 10, vy: Math.sin(angle) * 10, owner: 'enemy' });
            }

            bullets.forEach((b, i) => {
                b.x += b.vx; b.y += b.vy;
                if (b.owner === 'player' && Math.hypot(b.x - enemy.x, b.y - enemy.y) < enemy.r) {
                    enemy.hp -= 5; bullets.splice(i, 1);
                } else if (b.owner === 'enemy' && Math.hypot(b.x - player.x, b.y - player.y) < player.r) {
                    player.hp -= 5; bullets.splice(i, 1);
                }
                if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) bullets.splice(i, 1);
            });

            hpFill.style.width = player.hp + '%';
            enemyFill.style.width = enemy.hp + '%';

            if (player.hp <= 0 || enemy.hp <= 0) {
                alert(player.hp <= 0 ? "You Lost!" : "You Won!");
                player.hp = 100; enemy.hp = 100;
            }
        }

        function draw() {
            ctx.fillStyle = '#0a0a0c';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.strokeStyle = '#333';
            ctx.beginPath(); ctx.moveTo(canvas.width/2, 0); ctx.lineTo(canvas.width/2, canvas.height); ctx.stroke();

            ctx.fillStyle = player.color;
            ctx.beginPath(); ctx.arc(player.x, player.y, player.r, 0, Math.PI*2); ctx.fill();

            ctx.fillStyle = enemy.color;
            ctx.beginPath(); ctx.arc(enemy.x, enemy.y, enemy.r, 0, Math.PI*2); ctx.fill();

            ctx.fillStyle = '#fff';
            bullets.forEach(b => {
                ctx.beginPath(); ctx.arc(b.x, b.y, 4, 0, Math.PI*2); ctx.fill();
            });

            requestAnimationFrame(() => { update(); draw(); });
        }
        draw();
    </script>
</body>
</html>
`;

const STICKMAN_STRIKE_CODE = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; background: #111; overflow: hidden; font-family: sans-serif; color: #fff; }
        canvas { display: block; }
        #hint { position: absolute; top: 10px; width: 100%; text-align: center; pointer-events: none; }
    </style>
</head>
<body>
    <div id="hint">Drag your stickman (Blue) to hit the Red rival!</div>
    <canvas id="game"></canvas>
    <script>
        const canvas = document.getElementById('game');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const gravity = 0.3;
        const dragFactor = 0.98;

        class Stickman {
            constructor(x, y, color, isPlayer) {
                this.x = x; this.y = y; this.vx = 0; this.vy = 0;
                this.color = color; this.isPlayer = isPlayer;
                this.hp = 100; this.r = 25;
            }
            update() {
                if (!this.dragging) {
                    this.vy += gravity;
                    this.x += this.vx; this.y += this.vy;
                    this.vx *= dragFactor; this.vy *= dragFactor;

                    if (this.y > canvas.height - this.r) {
                        this.y = canvas.height - this.r;
                        this.vy *= -0.5;
                    }
                    if (this.x < this.r || this.x > canvas.width - this.r) {
                        this.vx *= -1;
                        this.x = this.x < this.r ? this.r : canvas.width - this.r;
                    }
                }
            }
            draw() {
                ctx.strokeStyle = this.color; ctx.lineWidth = 5;
                ctx.beginPath(); ctx.arc(this.x, this.y - 40, 15, 0, Math.PI*2); ctx.stroke(); // Head
                ctx.beginPath(); ctx.moveTo(this.x, this.y - 25); ctx.lineTo(this.x, this.y + 10); ctx.stroke(); // Body
                ctx.beginPath(); ctx.moveTo(this.x, this.y - 15); ctx.lineTo(this.x - 20, this.y); ctx.stroke(); // Left Arm
                ctx.beginPath(); ctx.moveTo(this.x, this.y - 15); ctx.lineTo(this.x + 20, this.y); ctx.stroke(); // Right Arm
                ctx.beginPath(); ctx.moveTo(this.x, this.y + 10); ctx.lineTo(this.x - 15, this.y + 35); ctx.stroke(); // Left Leg
                ctx.beginPath(); ctx.moveTo(this.x, this.y + 10); ctx.lineTo(this.x + 15, this.y + 35); ctx.stroke(); // Right Leg
                
                // HP Bar
                ctx.fillStyle = '#333'; ctx.fillRect(this.x - 20, this.y - 70, 40, 5);
                ctx.fillStyle = this.hp > 30 ? '#4cd137' : '#e84118';
                ctx.fillRect(this.x - 20, this.y - 70, (this.hp/100) * 40, 5);
            }
        }

        const player = new Stickman(200, 300, '#00a8ff', true);
        const enemy = new Stickman(canvas.width - 200, 300, '#e84118', false);
        let lastMouse = { x: 0, y: 0 };

        canvas.onmousedown = e => {
            if (Math.hypot(e.clientX - player.x, e.clientY - player.y) < 50) {
                player.dragging = true;
            }
        };
        window.onmousemove = e => {
            if (player.dragging) {
                player.vx = (e.clientX - player.x) * 0.2;
                player.vy = (e.clientY - player.y) * 0.2;
                player.x = e.clientX; player.y = e.clientY;
            }
        };
        window.onmouseup = () => player.dragging = false;

        function loop() {
            ctx.fillStyle = '#111'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            player.update();
            enemy.update();

            // Simple Enemy AI behavior
            if (Math.random() < 0.05) {
                enemy.vx += (player.x > enemy.x ? 1 : -1) * 2;
                enemy.vy -= 3;
            }

            // Collision check
            const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
            if (dist < 60) {
                const force = Math.hypot(player.vx, player.vy);
                if (force > 5) {
                    enemy.hp -= force;
                    enemy.vx += player.vx * 1.5;
                    enemy.vy += player.vy * 1.5;
                }
            }

            player.draw();
            enemy.draw();

            if (enemy.hp <= 0 || player.hp <= 0) {
                alert(enemy.hp <= 0 ? "Enemy Defeated!" : "Stickman Wasted!");
                player.hp = 100; enemy.hp = 100;
                player.x = 200; enemy.x = canvas.width - 200;
            }

            requestAnimationFrame(loop);
        }
        loop();
    </script>
</body>
</html>
`;

export const MOCK_GAMES: Game[] = [
  {
    id: 'nebula-rivals',
    title: 'Nebula Rivals',
    description: 'Competitive 1v1 arena shooter. Out-aim and out-maneuver your rival in high-speed combat.',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400&h=225',
    url: '',
    category: 'Action',
    tags: ['shooter', '1v1', 'action'],
    isInternal: true,
    internalCode: NEBULA_RIVALS_CODE
  },
  {
    id: 'stickman-strike',
    title: 'Stickman Strike',
    description: 'Physics-based stickman warrior combat. Swing, drag, and smash your way to victory!',
    thumbnail: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=400&h=225',
    url: '',
    category: 'Action',
    tags: ['stickman', 'physics', 'warriors'],
    isInternal: true,
    internalCode: STICKMAN_STRIKE_CODE
  },
  {
    id: '2048',
    title: '2048 Classic',
    description: 'Merge tiles to reach the 2048 tile in this addictive puzzle game.',
    thumbnail: 'https://picsum.photos/seed/2048/400/225',
    url: 'https://play2048.co/',
    category: 'Puzzle',
    tags: ['puzzle', 'math', 'classic']
  },
  {
    id: 'hextris',
    title: 'Hextris',
    description: 'A fast-paced puzzle game where you rotate a hexagon to match blocks.',
    thumbnail: 'https://picsum.photos/seed/hextris/400/225',
    url: 'https://hextris.io/',
    category: 'Arcade',
    tags: ['arcade', 'blocks', 'colors']
  },
  {
    id: 'snake',
    title: 'Snake Retro',
    description: 'The ultimate Nokia classic. Eat apples, grow longer, don\'t crash.',
    thumbnail: 'https://picsum.photos/seed/snake/400/225',
    url: 'https://snake.googlemaps.com/',
    category: 'Classic',
    tags: ['retro', 'classic', 'arcade']
  },
  {
    id: 'tetris',
    title: 'Block Fall',
    description: 'Classic block stacking gameplay with modern visuals.',
    thumbnail: 'https://picsum.photos/seed/tetris/400/225',
    url: 'https://tetris.com/play-tetris',
    category: 'Puzzle',
    tags: ['puzzle', 'retro', 'logic']
  },
  {
    id: 'tower',
    title: 'Tower Master',
    description: 'Stack blocks perfectly to build the highest tower in the sky.',
    thumbnail: 'https://picsum.photos/seed/tower/400/225',
    url: 'https://www.google.com/logos/2010/pacman10-i.html',
    category: 'Arcade',
    tags: ['stack', 'timing', 'arcade']
  }
];

export const CATEGORIES = ['All', 'Classic', 'Action', 'Puzzle', 'Arcade', 'AI-Gen'];
