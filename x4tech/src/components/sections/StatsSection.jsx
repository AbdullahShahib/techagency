import React, { useEffect, useRef, useState } from 'react';

const stats = [
  { num: 50, suffix: '+', label: 'Projects Delivered' },
  { num: 30, suffix: '+', label: 'Happy Clients' },
  { num: 3, suffix: 'yrs', label: 'Industry Experience' },
  { num: 100, suffix: '%', label: 'Client Satisfaction' },
];

function CountUp({ target, suffix, start }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const duration = 2000;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target]);

  return <>{count}{suffix}</>;
}

export default function StatsSection() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ background: 'var(--x4-card)', borderTop: '1px solid var(--x4-border)', borderBottom: '1px solid var(--x4-border)', padding: '5rem 3rem', position: 'relative', overflow: 'hidden' }}>
      {/* BG accent */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(0,102,255,0.06) 0%, transparent 70%)' }} />
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', position: 'relative' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: 'center', borderRight: i < 3 ? '1px solid var(--x4-border)' : 'none', padding: '1rem' }}>
            <div className="stat-num">
              <span className="accent"><CountUp target={s.num} suffix={s.suffix} start={started} /></span>
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
