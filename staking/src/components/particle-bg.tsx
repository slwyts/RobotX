"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
  }

  update(w: number, h: number) {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > w || this.x < 0) this.speedX = -this.speedX;
    if (this.y > h || this.y < 0) this.speedY = -this.speedY;
  }

  draw(ctx: CanvasRenderingContext2D, isDark: boolean) {
    ctx.fillStyle = isDark ? "rgba(0, 229, 255, 0.5)" : "rgba(0, 102, 255, 0.2)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function ParticleBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement!;
    let animId: number;

    const resize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    for (let i = 0; i < 35; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.documentElement.classList.contains("dark");
      const lineColor = isDark ? "0, 229, 255" : "0, 102, 255";

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(canvas.width, canvas.height);
        particles[i].draw(ctx, isDark);
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineColor}, ${0.15 - dist / 800})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-[1] pointer-events-none"
    />
  );
}
