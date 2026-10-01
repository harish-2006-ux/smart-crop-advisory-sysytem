import { useEffect, useRef } from 'react';

export default function FieldAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let frame = 0;
    let progress = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const scroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const draw = (time: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const horizon = h * 0.58;
      const sky = ctx.createLinearGradient(0, 0, 0, horizon);
      sky.addColorStop(0, `hsl(${218 - progress * 22} 35% 19%)`);
      sky.addColorStop(1, `hsl(${22 + progress * 8} 38% 38%)`);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);
      const sunX = w * (0.18 + progress * 0.64);
      const sunY = horizon - Math.sin(Math.PI * progress) * horizon * 0.65;
      const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, h * 0.4);
      glow.addColorStop(0, 'rgba(255,220,158,.45)');
      glow.addColorStop(1, 'rgba(255,160,100,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, horizon);
      ctx.fillStyle = 'rgba(35,52,50,.82)';
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      for (let x = 0; x <= w; x += 20) ctx.lineTo(x, horizon - 24 + Math.sin(x * 0.009 + progress * 3) * 18);
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.fill();
      ctx.strokeStyle = 'rgba(244,236,216,.12)';
      ctx.lineWidth = 1;
      for (let i = -18; i <= 18; i += 1) {
        ctx.beginPath();
        ctx.moveTo(w / 2 + i * 8, horizon + 12);
        ctx.lineTo(w / 2 + i * 50, h);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255,220,150,.32)';
      for (let i = 0; i < 42; i += 1) {
        const x = (i * 97 + time * 0.008) % w;
        const y = (i * 53) % h;
        ctx.fillRect(x, y, 1.5, 1.5);
      }
      frame = requestAnimationFrame(draw);
    };
    resize(); scroll();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', scroll, { passive: true });
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); window.removeEventListener('scroll', scroll); };
  }, []);

  return <canvas ref={canvasRef} className="field-animation" aria-hidden="true" />;
}
