
import { Game } from './types';

const GAME_CORE_SCRIPT = `
    <script>
        // Listen for portal settings
        window.addEventListener('message', (event) => {
            const data = event.data;
            if (data.type === 'SETTING_CHANGE') {
                if (data.key === 'neonIntensity') {
                    document.body.style.filter = \`brightness(\${0.8 + data.value * 0.4}) saturate(\${1.2 + data.value * 0.8})\`;
                }
                window.gameSettings = window.gameSettings || {};
                window.gameSettings[data.key] = data.value;
            }
        });
    </script>
`;

const PHONK_STRIKE_CODE = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; background: #010409; color: #fff; font-family: sans-serif; overflow: hidden; touch-action: none; }
        canvas { display: block; cursor: crosshair; width: 100vw; height: 100vh; }
        #ui { position: absolute; top: 20px; left: 20px; pointer-events: none; font-weight: 900; font-style: italic; }
        .bar { width: 150px; height: 12px; background: #111; border: 2px solid #222; margin-bottom: 5px; transform: skewX(-10deg); }
        .fill { height: 100%; transition: width 0.2s; }
        #hp { background: #22c55e; box-shadow: 0 0 15px #22c55e; }
        #enemy-hp { background: #111; border: 1px solid #eab308; }
        #enemy-fill { background: #eab308; box-shadow: 0 0 15px #eab308; }
        .label { font-size: 10px; text-transform: uppercase; margin-bottom: 2px; color: #aaa; letter-spacing: 1px; }
    </style>
</head>
<body>
    <div id="ui">
        <div class="label">PLAYER</div>
        <div class="bar"><div id="hp" class="fill" style="width: 100%"></div></div>
        <div class="label" style="margin-top: 10px">RIVAL</div>
        <div class="bar" id="enemy-hp"><div id="enemy-fill" class="fill" style="width: 100%"></div></div>
    </div>
    <canvas id="game"></canvas>
    ${GAME_CORE_SCRIPT}
    <script>
        const canvas = document.getElementById('game');
        const ctx = canvas.getContext('2d');
        const hpFill = document.getElementById('hp');
        const enemyFill = document.getElementById('enemy-fill');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.onresize = resize;
        resize();

        const player = { x: 50, y: canvas.height/2, r: 18, color: '#22c55e', hp: 100, speed: 6 };
        const enemy = { x: canvas.width - 50, y: canvas.height/2, r: 18, color: '#eab308', hp: 100, speed: 4 };
        const bullets = [];
        const keys = {};

        window.onkeydown = e => keys[e.key.toLowerCase()] = true;
        window.onkeyup = e => keys[e.key.toLowerCase()] = false;
        
        const shoot = (x, y) => {
            const angle = Math.atan2(y - player.y, x - player.x);
            bullets.push({ x: player.x, y: player.y, vx: Math.cos(angle) * 14, vy: Math.sin(angle) * 14, owner: 'player' });
        };

        canvas.onmousedown = e => shoot(e.clientX, e.clientY);
        canvas.ontouchstart = e => {
            const touch = e.touches[0];
            shoot(touch.clientX, touch.clientY);
            e.preventDefault();
        };

        function update() {
            const sens = (window.gameSettings?.sensitivity || 1);
            const speed = player.speed * sens;
            if (keys['w'] && player.y > player.r) player.y -= speed;
            if (keys['s'] && player.y < canvas.height - player.r) player.y += speed;
            if (keys['a'] && player.x > player.r) player.x -= speed;
            if (keys['d'] && player.x < canvas.width/2 - 20) player.x += speed;

            if (Math.abs(enemy.y - player.y) > 10) enemy.y += (player.y > enemy.y ? 1 : -1) * enemy.speed;
            if (Math.random() < 0.03) {
                const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
                bullets.push({ x: enemy.x, y: enemy.y, vx: Math.cos(angle) * 10, vy: Math.sin(angle) * 10, owner: 'enemy' });
            }

            bullets.forEach((b, i) => {
                b.x += b.vx; b.y += b.vy;
                if (b.owner === 'player' && Math.hypot(b.x - enemy.x, b.y - enemy.y) < enemy.r + 5) {
                    enemy.hp -= 5; bullets.splice(i, 1);
                } else if (b.owner === 'enemy' && Math.hypot(b.x - player.x, b.y - player.y) < player.r + 5) {
                    player.hp -= 5; bullets.splice(i, 1);
                }
                if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) bullets.splice(i, 1);
            });

            hpFill.style.width = player.hp + '%';
            enemyFill.style.width = enemy.hp + '%';

            if (player.hp <= 0 || enemy.hp <= 0) {
                player.hp = 100; enemy.hp = 100;
            }
        }

        function draw() {
            ctx.fillStyle = '#010409';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.strokeStyle = '#052e16';
            ctx.lineWidth = 2;
            for(let i=0; i<canvas.width; i+=40) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
            }

            ctx.shadowBlur = 20;
            ctx.shadowColor = player.color;
            ctx.fillStyle = player.color;
            ctx.beginPath(); ctx.arc(player.x, player.y, player.r, 0, Math.PI*2); ctx.fill();

            ctx.shadowColor = enemy.color;
            ctx.fillStyle = enemy.color;
            ctx.beginPath(); ctx.arc(enemy.x, enemy.y, enemy.r, 0, Math.PI*2); ctx.fill();

            ctx.shadowBlur = 10;
            ctx.shadowColor = '#3b82f6';
            ctx.fillStyle = '#3b82f6';
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

const PHONK_WARRIOR_CODE = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; background: #000; overflow: hidden; font-family: sans-serif; color: #fff; touch-action: none; }
        canvas { display: block; width: 100vw; height: 100vh; }
        #hint { position: absolute; top: 10px; width: 100%; text-align: center; pointer-events: none; font-size: 14px; font-weight: 900; color: #22c55e; text-transform: uppercase; italic; }
    </style>
</head>
<body>
    <div id="hint">DRAG TO SMASH / DESTROY YOUR RIVAL</div>
    <canvas id="game"></canvas>
    ${GAME_CORE_SCRIPT}
    <script>
        const canvas = document.getElementById('game');
        const ctx = canvas.getContext('2d');
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.onresize = resize;
        resize();

        const gravity = 0.35;
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

                    if (this.y > canvas.height - 50) {
                        this.y = canvas.height - 50;
                        this.vy *= -0.3;
                    }
                    if (this.x < 30 || this.x > canvas.width - 30) {
                        this.vx *= -0.7;
                        this.x = this.x < 30 ? 30 : canvas.width - 30;
                    }
                }
            }
            draw() {
                ctx.shadowBlur = 10; ctx.shadowColor = this.color;
                ctx.strokeStyle = this.color; ctx.lineWidth = 6;
                ctx.beginPath(); ctx.arc(this.x, this.y - 40, 15, 0, Math.PI*2); ctx.stroke(); // Head
                ctx.beginPath(); ctx.moveTo(this.x, this.y - 25); ctx.lineTo(this.x, this.y + 15); ctx.stroke(); // Body
                ctx.beginPath(); ctx.moveTo(this.x, this.y - 15); ctx.lineTo(this.x - 20, this.y + 5); ctx.stroke(); 
                ctx.beginPath(); ctx.moveTo(this.x, this.y - 15); ctx.lineTo(this.x + 20, this.y + 5); ctx.stroke(); 
                ctx.beginPath(); ctx.moveTo(this.x, this.y + 15); ctx.lineTo(this.x - 15, this.y + 40); ctx.stroke(); 
                ctx.beginPath(); ctx.moveTo(this.x, this.y + 15); ctx.lineTo(this.x + 15, this.y + 40); ctx.stroke(); 
                
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#111'; ctx.fillRect(this.x - 20, this.y - 70, 40, 6);
                ctx.fillStyle = this.color; ctx.fillRect(this.x - 20, this.y - 70, (this.hp/100) * 40, 6);
            }
        }

        const player = new Stickman(150, 300, '#22c55e', true);
        const enemy = new Stickman(canvas.width - 150, 300, '#eab308', false);

        const handleDown = (ex, ey) => {
            if (Math.hypot(ex - player.x, ey - player.y) < 80) player.dragging = true;
        };
        const handleMove = (ex, ey) => {
            if (player.dragging) {
                const sens = (window.gameSettings?.sensitivity || 1) * 0.3;
                player.vx = (ex - player.x) * sens;
                player.vy = (ey - player.y) * sens;
                player.x = ex; player.y = ey;
            }
        };

        canvas.onmousedown = e => handleDown(e.clientX, e.clientY);
        canvas.ontouchstart = e => { handleDown(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); };
        window.onmousemove = e => handleMove(e.clientX, e.clientY);
        window.ontouchmove = e => { handleMove(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); };
        window.onmouseup = window.ontouchend = () => player.dragging = false;

        function loop() {
            ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            player.update(); enemy.update();
            if (Math.random() < 0.04) { enemy.vx += (player.x > enemy.x ? 1.5 : -1.5) * 4; enemy.vy -= 6; }
            if (Math.hypot(player.x - enemy.x, player.y - enemy.y) < 60) {
                const f = Math.hypot(player.vx, player.vy);
                if (f > 5) { enemy.hp -= f * 0.4; enemy.vx += player.vx * 1.2; enemy.vy += player.vy * 1.2; }
            }
            player.draw(); enemy.draw();
            if (enemy.hp <= 0 || player.hp <= 0) { player.hp = 100; enemy.hp = 100; }
            requestAnimationFrame(loop);
        }
        loop();
    </script>
</body>
</html>
`;

const PHONK_DRIFT_HOOPS_CODE = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; background: #020617; color: #fff; font-family: sans-serif; overflow: hidden; touch-action: none; }
        canvas { display: block; width: 100vw; height: 100vh; }
        #ui { position: absolute; top: 20px; left: 20px; pointer-events: none; }
        #score { font-size: 40px; font-weight: 900; color: #eab308; font-style: italic; text-shadow: 0 0 15px rgba(234, 179, 8, 0.5); }
    </style>
</head>
<body>
    <div id="ui"><div id="score">0</div></div>
    <canvas id="game"></canvas>
    ${GAME_CORE_SCRIPT}
    <script>
        const canvas = document.getElementById('game');
        const ctx = canvas.getContext('2d');
        const scoreEl = document.getElementById('score');
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.onresize = resize;
        resize();

        let score = 0;
        const gravity = 0.45;
        const ball = { x: 80, y: 0, vx: 0, vy: 0, r: 20, active: false, color: '#3b82f6' };
        ball.y = canvas.height - 120;
        
        const hoop = { x: 0, y: 180, w: 70, h: 10, color: '#22c55e' };
        hoop.x = canvas.width - 120;

        let isAiming = false;
        let aimStart = { x: 0, y: 0 }, currentMouse = { x: 0, y: 0 };

        const handleStart = (ex, ey) => {
            if (ball.active) return;
            isAiming = true;
            aimStart = { x: ex, y: ey };
            currentMouse = { ...aimStart };
        };
        const handleMove = (ex, ey) => { if (isAiming) currentMouse = { x: ex, y: ey }; };
        const handleEnd = () => {
            if (!isAiming) return;
            isAiming = false;
            const sens = (window.gameSettings?.sensitivity || 1) * 0.15;
            ball.vx = (aimStart.x - currentMouse.x) * sens;
            ball.vy = (aimStart.y - currentMouse.y) * sens;
            ball.active = true;
        };

        canvas.onmousedown = e => handleStart(e.clientX, e.clientY);
        canvas.ontouchstart = e => { handleStart(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); };
        window.onmousemove = e => handleMove(e.clientX, e.clientY);
        window.ontouchmove = e => { handleMove(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); };
        window.onmouseup = window.ontouchend = handleEnd;

        function loop() {
            ctx.fillStyle = '#020617'; ctx.fillRect(0,0, canvas.width, canvas.height);
            
            if (isAiming) {
                ctx.beginPath(); ctx.strokeStyle = '#eab308'; ctx.setLineDash([8, 8]);
                ctx.lineWidth = 3;
                ctx.moveTo(ball.x, ball.y);
                ctx.lineTo(ball.x + (aimStart.x - currentMouse.x)*0.5, ball.y + (aimStart.y - currentMouse.y)*0.5);
                ctx.stroke(); ctx.setLineDash([]);
            }
            if (ball.active) {
                ball.vy += gravity; ball.x += ball.vx; ball.y += ball.vy;
                if (ball.y > canvas.height + 100 || ball.x < -100 || ball.x > canvas.width + 100) {
                    ball.active = false; ball.x = 80; ball.y = canvas.height - 120;
                }
                if (ball.vy > 0 && ball.x > hoop.x && ball.x < hoop.x + hoop.w && Math.abs(ball.y - hoop.y) < 25) {
                    score++; scoreEl.innerText = score;
                    ball.active = false; ball.x = 80; ball.y = canvas.height - 120;
                }
            }
            
            ctx.shadowBlur = 20; ctx.shadowColor = hoop.color;
            ctx.fillStyle = hoop.color; ctx.fillRect(hoop.x, hoop.y, hoop.w, hoop.h);
            
            ctx.shadowColor = ball.color;
            ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
            ctx.fillStyle = ball.color; ctx.fill();
            ctx.shadowBlur = 0;
            
            requestAnimationFrame(loop);
        }
        loop();
    </script>
</body>
</html>
`;

export const MOCK_GAMES: Game[] = [
  {
    id: 'phonk-strike',
    title: 'PHONK STRIKE BR',
    description: 'Fast-paced arena battle. Dominate the Brazilian territory with high-speed drift reflexes.',
    thumbnail: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400&h=225',
    url: '',
    category: 'Action',
    tags: ['brazil', 'drift', 'combat'],
    isInternal: true,
    internalCode: PHONK_STRIKE_CODE
  },
  {
    id: 'phonk-warrior',
    title: 'PHONK WARRIOR',
    description: 'Aggressive physics combat. Use the asphalt\'s gravity to destroy your opponents.',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400&h=225',
    url: '',
    category: 'Action',
    tags: ['stickman', 'phonk', 'fight'],
    isInternal: true,
    internalCode: PHONK_WARRIOR_CODE
  },
  {
    id: 'phonk-hoops',
    title: 'PHONK HOOPS 2.0',
    description: 'Street basketball in Brazilian style. Precise aim under the neon lights of Sao Paulo.',
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400&h=225',
    url: '',
    category: 'Arcade',
    tags: ['basketball', 'neon', 'skill'],
    isInternal: true,
    internalCode: PHONK_DRIFT_HOOPS_CODE
  },
  {
    id: 'legacy-proxy',
    title: 'PROXY CLASSIC',
    description: 'Legacy utility for unlimited access on restricted networks.',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=400&h=225',
    url: '',
    category: 'Classic',
    tags: ['system', 'tool'],
    isInternal: true,
    internalCode: '' 
  }
];

export const CATEGORIES = ['All', 'Classic', 'Action', 'Puzzle', 'Arcade', 'AI-Gen'];
