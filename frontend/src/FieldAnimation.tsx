import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { Reading } from './data';

type Props = { reading: Reading | null };
type Stage = { name: string; action: string; color: string };

const stages: Stage[] = [
  { name: 'Season starting', action: 'Prepare the beds and hold irrigation while the seed settles.', color: '#ffb27a' },
  { name: 'Sowing window', action: 'Drill seed shallow and check emergence in 7 days.', color: '#ffb27a' },
  { name: 'Canopy building', action: 'Keep cover crops in place; roots are doing the work.', color: '#9be15d' },
  { name: 'Irrigation check', action: 'Use the live moisture reading before watering the field.', color: '#7cc7ff' },
  { name: 'Harvest window', action: 'Plan the dawn cut and move the crop to threshing within the day.', color: '#f2c14e' },
  { name: 'Season complete', action: 'Record the yield, leave the stubble, and prepare the next rotation.', color: '#f2c14e' },
];

function stageFor(progress: number) {
  if (progress < 0.16) return stages[0];
  if (progress < 0.4) return stages[1];
  if (progress < 0.64) return stages[2];
  if (progress < 0.82) return stages[3];
  if (progress < 0.95) return stages[4];
  return stages[5];
}

export default function FieldAnimation({ reading }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const stage = useMemo(() => stageFor(progress), [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let frame = 0;
    let target = 0;
    let current = 0;
    let last = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const smooth = (a: number, b: number, t: number) => a + (b - a) * t;
    const draw = (time: number) => {
      const dt = Math.min(0.05, (time - last || 16) / 1000);
      last = time;
      current = reduceMotion ? target : smooth(current, target, 1 - Math.pow(0.0008, dt));
      setProgress((value) => Math.abs(value - current) > 0.006 ? current : value);

      const w = window.innerWidth;
      const h = window.innerHeight;
      const horizon = h * 0.56;
      const day = current;
      const skyTop = `rgb(${Math.round(smooth(35, 31, day))},${Math.round(smooth(52, 35, day))},${Math.round(smooth(88, 67, day))})`;
      const skyBottom = `rgb(${Math.round(smooth(210, 170, day))},${Math.round(smooth(157, 120, day))},${Math.round(smooth(113, 82, day))})`;
      const gradient = ctx.createLinearGradient(0, 0, 0, horizon);
      gradient.addColorStop(0, skyTop);
      gradient.addColorStop(1, skyBottom);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      const sunX = w * (0.12 + day * 0.76);
      const sunY = horizon - Math.sin(Math.PI * day) * horizon * 0.78;
      const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, h * 0.4);
      sun.addColorStop(0, 'rgba(255,244,205,.7)');
      sun.addColorStop(1, 'rgba(255,170,100,0)');
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, w, horizon + 5);
      ctx.beginPath();
      ctx.arc(sunX, sunY, Math.max(18, h * 0.04), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,231,175,.9)';
      ctx.fill();

      const hill = (offset: number, amplitude: number, color: string) => {
        ctx.beginPath();
        ctx.moveTo(0, horizon + 4);
        for (let x = 0; x <= w + 10; x += 12) ctx.lineTo(x, horizon - offset - amplitude * (Math.sin(x * .006 + day * 2) * .55 + Math.sin(x * .014) * .45 + 1) * .5);
        ctx.lineTo(w, horizon + 4);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      };
      hill(h * .08, h * .11, 'rgba(48,78,60,.8)');
      hill(h * .03, h * .07, 'rgba(32,58,43,.92)');

      const ground = ctx.createLinearGradient(0, horizon, 0, h);
      ground.addColorStop(0, 'rgba(76,63,43,1)');
      ground.addColorStop(1, 'rgba(28,23,16,1)');
      ctx.fillStyle = ground;
      ctx.fillRect(0, horizon, w, h - horizon);

      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(15,10,6,.36)';
      for (let i = -18; i <= 18; i += 1) {
        ctx.beginPath();
        ctx.moveTo(w / 2 + i * 8, horizon + 12);
        ctx.lineTo(w / 2 + i * 52, h);
        ctx.stroke();
      }

      const growth = Math.min(1, Math.max(0, (day - .08) / .52));
      const ripe = Math.min(1, Math.max(0, (day - .7) / .22));
      ctx.lineCap = 'round';
      for (let row = -15; row <= 15; row += 1) {
        const x = w / 2 + row * Math.max(20, w * .018);
        const scale = Math.max(.42, 1 - Math.abs(row) * .018);
        const stalk = (20 + 82 * growth) * scale;
        ctx.strokeStyle = ripe > .1 ? `rgba(238,198,92,${.25 + .65 * scale})` : `rgba(104,174,79,${.25 + .68 * scale})`;
        ctx.lineWidth = Math.max(1, 2.2 * scale);
        for (let n = 0; n < 7; n += 1) {
          const y = horizon + 28 + n * h * .055;
          const sway = Math.sin(time * .001 + row * .5 + n) * (1 + growth * 3);
          ctx.beginPath();
          ctx.moveTo(x + (n - 3) * 8, y);
          ctx.quadraticCurveTo(x + sway, y - stalk * .55, x + sway * 1.4, y - stalk);
          ctx.stroke();
        }
      }

      if (day > .54 && day < .86) {
        ctx.strokeStyle = 'rgba(205,225,242,.46)';
        ctx.lineWidth = 1.1;
        for (let i = 0; i < 80; i += 1) {
          const x = (i * 83 + time * .08) % (w + 80) - 40;
          const y = (i * 47 + time * .18) % h;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - 3, y + 14);
          ctx.stroke();
        }
      }
      frame = requestAnimationFrame(draw);
    };

    resize();
    readScroll();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', readScroll, { passive: true });
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); window.removeEventListener('scroll', readScroll); };
  }, []);

  const moisture = reading ? `${reading.soilMoisture}%` : 'No data';
  const signal = reading ? 'Verified' : 'No data';
  const action = stage.name === 'Irrigation check' && reading ? (reading.soilMoisture < 30 ? 'Sensor check: irrigation may be needed.' : 'Sensor check: hold irrigation for now.') : stage.action;

  return <>
    <canvas ref={canvasRef} className="field-animation" aria-hidden="true" />
    <aside className="tilth-advisory" aria-live="polite" aria-label="Smart crop advisory animation panel">
      <div className="tilth-advisory-card" style={{ '--tilth-accent': stage.color } as CSSProperties}>
        <div className="tilth-advisory-meta"><span>SMART CROP ADVISORY</span><b>DAY {Math.round(progress * 118)}</b></div>
        <h2>{stage.name}</h2>
        <p>{action}</p>
        <div className="tilth-advisory-metrics"><span>Soil moisture <b>{moisture}</b></span><span>Field signal <b>{signal}</b></span></div>
      </div>
    </aside>
  </>;
}
