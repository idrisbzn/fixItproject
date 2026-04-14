import { useRef, useEffect } from 'react';

const CONFIG = {
    gridSize: 60,
    gridColor: '#334155',
    particleCount: 50,
    particleSpeedMin: 0.5,
    particleSpeedMax: 5,
    particleColors: ['#ffffff', '#64748b', '#94a3b8'],
    trailLength: 100,
    backgroundColor: '#0a0e1a',
    rippleDuration: 2000,
    rippleMaxRadius: 200,
};

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;':,.<>?";

class Particle {
    constructor() {
        this.color =
            CONFIG.particleColors[
            Math.floor(Math.random() * CONFIG.particleColors.length)
            ];
        this.speed =
            Math.random() * (CONFIG.particleSpeedMax - CONFIG.particleSpeedMin) +
            CONFIG.particleSpeedMin;
        this.trail = [];
        this.active = false;
        this.direction = 'horizontal';
        this.x = 0;
        this.y = 0;
    }

    update(canvas, occupiedLines) {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > CONFIG.trailLength) this.trail.shift();

        if (this.active) {
            if (this.direction === 'horizontal') {
                this.x += this.speed;
                if (this.x > canvas.width) {
                    this.active = false;
                    occupiedLines.horizontal.delete(this.y);
                }
            } else {
                this.y += this.speed;
                if (this.y > canvas.height) {
                    this.active = false;
                    occupiedLines.vertical.delete(this.x);
                }
            }
        } else {
            const allOff = this.trail.every(
                (pt) =>
                    (this.direction === 'horizontal' && pt.x > canvas.width) ||
                    (this.direction === 'vertical' && pt.y > canvas.height)
            );
            if (allOff) this.reset(canvas, occupiedLines);
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.trail.length; i++) {
            const pt = this.trail[i];
            const alpha = i / this.trail.length;
            ctx.fillStyle = this.color.replace('1)', `${alpha})`);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    findAvailableLine(canvas, occupiedLines) {
        let attempts = 0;
        while (attempts < 100) {
            if (Math.random() > 0.5) {
                const y =
                    Math.round((Math.random() * canvas.height) / CONFIG.gridSize) *
                    CONFIG.gridSize;
                if (!occupiedLines.horizontal.has(y)) {
                    this.direction = 'horizontal';
                    this.x = 0;
                    this.y = y;
                    occupiedLines.horizontal.add(y);
                    return true;
                }
            } else {
                const x =
                    Math.round((Math.random() * canvas.width) / CONFIG.gridSize) *
                    CONFIG.gridSize;
                if (!occupiedLines.vertical.has(x)) {
                    this.direction = 'vertical';
                    this.x = x;
                    this.y = 0;
                    occupiedLines.vertical.add(x);
                    return true;
                }
            }
            attempts++;
        }
        return false;
    }

    reset(canvas, occupiedLines) {
        if (this.findAvailableLine(canvas, occupiedLines)) {
            this.trail = [];
            this.active = true;
            this.speed =
                Math.random() * (CONFIG.particleSpeedMax - CONFIG.particleSpeedMin) +
                CONFIG.particleSpeedMin;
        } else {
            this.active = false;
            this.trail = [];
        }
    }
}

class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = CONFIG.rippleMaxRadius;
        this.startTime = Date.now();
    }

    update() {
        const elapsed = Date.now() - this.startTime;
        this.radius = (elapsed / CONFIG.rippleDuration) * this.maxRadius;
    }

    draw(ctx) {
        const alpha = 1 - this.radius / this.maxRadius;
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (Math.random() < 4.3) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.font = '16px monospace';
            const char =
                CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            ctx.fillText(
                char,
                this.x + (Math.random() - 0.5) * this.radius * 2,
                this.y + (Math.random() - 0.5) * this.radius * 2
            );
        }
    }

    isComplete() {
        return this.radius >= this.maxRadius;
    }
}

export default function GridAnimation() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animId;
        let resizeTimer;

        const occupiedLines = {
            horizontal: new Set(),
            vertical: new Set(),
        };

        const particles = Array(CONFIG.particleCount)
            .fill(null)
            .map(() => new Particle());

        let ripples = [];

        function resize() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            occupiedLines.horizontal.clear();
            occupiedLines.vertical.clear();
            particles.forEach((p) => p.reset(canvas, occupiedLines));
        }

        function createGrid() {
            ctx.fillStyle = CONFIG.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, 'rgba(51, 65, 85, 1)');
            gradient.addColorStop(1, 'rgba(51, 65, 85, 0)');
            ctx.strokeStyle = gradient;

            for (let y = 0; y < canvas.height; y += CONFIG.gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            for (let x = 0; x < canvas.width; x += CONFIG.gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
        }

        function handleClick(e) {
            const rect = canvas.getBoundingClientRect();
            ripples.push(
                new Ripple(
                    e.clientX - rect.left,
                    e.clientY - rect.top
                )
            );
        }

        function animate() {
            createGrid();

            particles.forEach((p) => {
                p.update(canvas, occupiedLines);
                p.draw(ctx);
            });

            ripples = ripples.filter((r) => !r.isComplete());

            ripples.forEach((r) => {
                r.update();
                r.draw(ctx);
            });

            animId = requestAnimationFrame(animate);
        }

        resize();
        animate();

        canvas.addEventListener('click', handleClick);

        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 150);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animId);
            canvas.removeEventListener('click', handleClick);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ display: 'block', width: '100%', height: '100%' }}
        />
    );
}