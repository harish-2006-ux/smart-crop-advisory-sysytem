import { useEffect, useRef, useState } from 'react';
import { ArrowDown, CloudRain, Leaf, Sprout, Sun, Wheat } from 'lucide-react';

const stages = [
  { key: 'Sow', day: 'Days 0–30', icon: Sprout, color: '#ffb27a', copy: 'Start with the soil. Seed decisions begin with the readings your field can verify.' },
  { key: 'Grow', day: 'Days 30–75', icon: Leaf, color: '#9be15d', copy: 'Track moisture, temperature, humidity and pH as roots build resilience.' },
  { key: 'Rain', day: 'Days 75–95', icon: CloudRain, color: '#7cc7ff', copy: 'Let rainfall and telemetry shape irrigation guidance instead of guesswork.' },
  { key: 'Harvest', day: 'Days 95–118', icon: Wheat, color: '#f2c14e', copy: 'Turn validated field conditions into timely crop and harvest recommendations.' },
];

export default function TilthExperience({ children, hardware, setPage }: { children: React.ReactNode; hardware: { available: boolean }; setPage: (page: any) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let frame = 0;
    const particles = Array.from({ length: 90 }, (_, i) => ({ x: (i * 47) % 100, y: (i * 83) % 100, r: 0.5 + (i % 3) * 0.45 }));
    const resize = () => { const dpr = Math.min(window.devicePixelRatio || 1, 2); canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const draw = (time: number) => {
      const w = innerWidth, h = innerHeight, p = progress;
      const top = `hsl(${218 - p * 175} ${Math.round(35 + p * 28)}% ${Math.round(18 + p * 27)}%)`;
      const bottom = `hsl(${26 - p * 6} ${Math.round(38 + p * 20)}% ${Math.round(38 - p * 15)}%)`;
      const sky = ctx.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, top); sky.addColorStop(0.62, bottom); sky.addColorStop(1, '#16100a'); ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
      const sunX = w * (0.16 + p * 0.68), sunY = h * (0.7 - Math.sin(Math.PI * p) * 0.56); const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, h * 0.42); glow.addColorStop(0, 'rgba(255,220,158,.55)'); glow.addColorStop(1, 'rgba(255,160,100,0)'); ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h * .75);
      ctx.fillStyle = 'rgba(35,52,50,.75)'; ctx.beginPath(); ctx.moveTo(0, h * .57); for (let x = 0; x <= w; x += 18) ctx.lineTo(x, h * .54 + Math.sin(x * .008 + p * 4) * 24 + Math.sin(x * .019) * 9); ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.fill();
      ctx.strokeStyle = 'rgba(255,222,154,.16)'; ctx.lineWidth = 1; for (let i = -18; i <= 18; i++) { const x = w / 2 + i * 32; ctx.beginPath(); ctx.moveTo(w / 2 + i * 7, h * .61); ctx.lineTo(x * 2 - w / 2, h); ctx.stroke(); }
      particles.forEach((m, i) => { const x = (m.x / 100) * w + Math.sin(time * .0005 + i) * 4; const y = (m.y / 100) * h; ctx.fillStyle = `rgba(255,220,150,${0.16 + 0.18 * Math.abs(Math.sin(time * .001 + i))})`; ctx.beginPath(); ctx.arc(x, y, m.r, 0, Math.PI * 2); ctx.fill(); });
      frame = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener('resize', resize); frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, [progress]);

  const active = progress < .35 ? 0 : progress < .62 ? 1 : progress < .82 ? 2 : 3;
  const jump = (fraction: number) => window.scrollTo({ top: fraction * (document.documentElement.scrollHeight - innerHeight), behavior: 'smooth' });
  return <div className="tilth-experience">
    <canvas ref={canvasRef} className="tilth-field" aria-hidden="true" /><div className="tilth-veil" aria-hidden="true" />
    <section className="tilth-hero"><div className="tilth-kicker"><Sun size={15}/> ONE GROWING SEASON</div><h1>TILTH</h1><p>Regenerative decisions, from soil signal to harvest. Scroll through your crop advisory workspace.</p><div className="tilth-hero-actions"><button onClick={() => jump(.22)}><ArrowDown size={15}/> Explore the season</button><span className={hardware.available ? 'live' : ''}><i />{hardware.available ? 'Verified telemetry live' : 'Awaiting field telemetry'}</span></div></section>
    <div className="tilth-season-nav" aria-label="Season stages">{stages.map((stage, index) => { const Icon = stage.icon; return <button key={stage.key} className={active === index ? 'active' : ''} onClick={() => jump([.25, .5, .7, .88][index])} style={{ '--stage': stage.color } as React.CSSProperties}><Icon size={15}/><span>{stage.key}</span></button>; })}</div>
    <section className="tilth-story"><div className="tilth-story-intro"><span>FIELD NOTE  /  01</span><h2>Read the season.</h2><p>Your advisory system becomes the field notebook: honest inputs, clear signals, practical next steps.</p></div><div className="tilth-stage-grid">{stages.map((stage, index) => <article key={stage.key} className={active === index ? 'is-active' : ''} style={{ '--stage': stage.color } as React.CSSProperties}><span className="stage-index">0{index + 1}</span><stage.icon size={21}/><h3>{stage.key}</h3><b>{stage.day}</b><p>{stage.copy}</p></article>)}</div></section>
    <section className="tilth-dashboard"><div className="tilth-dashboard-heading"><span>FIELD CONSOLE</span><h2>Smart Crop Advisory System</h2><p>Move from seasonal context into validated sensor intelligence.</p></div>{children}</section>
    <div className="tilth-back-to-top"><button onClick={() => jump(0)}>Back to seed</button><span>Day {Math.round(progress * 118)}</span></div>
  </div>;
}
