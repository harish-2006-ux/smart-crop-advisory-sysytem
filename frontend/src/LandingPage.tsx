import { ArrowRight, CheckCircle2, Leaf, Radio, ShieldCheck } from 'lucide-react';
import FieldAnimation from './FieldAnimation';

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  return <div className="landing-page">
    <FieldAnimation reading={null} showAdvisory={false} />
    <header className="landing-nav">
      <div className="landing-brand"><span className="landing-brand-mark"><Leaf size={18}/></span><span><b>Smart Crop</b><small>Advisory System</small></span></div>
      <button className="landing-nav-link" onClick={onEnter}>Open workspace <ArrowRight size={15}/></button>
    </header>
    <main className="landing-hero">
      <div className="landing-copy">
        <span className="landing-eyebrow"><span className="landing-pulse"/> FIELD INTELLIGENCE, CONNECTED</span>
        <h1>Grow with<br/><em>confidence.</em></h1>
        <p>Make every crop decision clearer with verified soil telemetry, practical recommendations, and one calm view of the field.</p>
        <div className="landing-actions"><button className="landing-cta" onClick={onEnter}>Enter your workspace <ArrowRight size={17}/></button><span className="landing-note"><ShieldCheck size={15}/> Only validated readings are displayed</span></div>
      </div>
      <div className="landing-signal-card">
        <div className="landing-signal-top"><span>FIELD SIGNAL</span><b><Radio size={13}/> READY</b></div>
        <div className="landing-signal-line"><i/><i/><i/><i/><i/><i/><i/><i/></div>
        <div className="landing-signal-bottom"><span>ESP32 pathway</span><span>Live when connected</span></div>
      </div>
    </main>
    <section className="landing-proof" aria-label="Platform capabilities">
      <div><CheckCircle2 size={17}/><span><b>Verified data</b><small>Real sensor inputs, no placeholder values</small></span></div>
      <div><Leaf size={17}/><span><b>Crop-aware guidance</b><small>Recommendations shaped around field conditions</small></span></div>
      <div><Radio size={17}/><span><b>Hardware ready</b><small>Built for the ESP32 telemetry bridge</small></span></div>
    </section>
  </div>;
}
