import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useReveal } from '../../hooks/useReveal';
import { getAll, COLS } from '../../lib/firestore';

const testimonials = [
  {
    text: "X4Tech completely transformed our online presence. The website they built for us loads in under a second, looks stunning on every device, and has doubled our conversion rate in just two months.",
    name: "Arjun Mehta",
    role: "CEO, NovaTrade",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    stars: 5
  },
  {
    text: "I came with a rough sketch of a logo idea and they turned it into a full brand identity I'm genuinely proud of. Every client who sees our new branding asks who designed it.",
    name: "Priya Sharma",
    role: "Founder, Bloom Wellness",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    stars: 5
  },
  {
    text: "Fast, responsive, and they actually care about the quality of their work. Our React Native app shipped ahead of schedule and the code quality is exceptional.",
    name: "Daniel Osei",
    role: "CTO, FlowFinance",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80",
    stars: 5
  },
  {
    text: "Working with X4Tech felt like having a senior design team in-house. They pushed back on ideas that wouldn't work and brought better ones. That's rare in freelance work.",
    name: "Sara Liu",
    role: "Product Manager, Orbit SaaS",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    stars: 5
  }
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [items, setItems] = useState([]);
  const sectionRef = useReveal();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getAll(COLS.TESTIMONIALS);
        if (alive && Array.isArray(data) && data.length) {
          const mapped = data
            .filter(t => t.visible !== false)
            .map(t => ({
              id: t.id,
              text: t.quote || '',
              name: t.clientName || 'Client',
              role: [t.role, t.company].filter(Boolean).join(', '),
              avatar: t.avatarUrl || FALLBACK_AVATAR,
              stars: Number(t.rating) || 5,
            }));
          setItems(mapped);
        }
      } catch (_) {
        // Keep local fallback data if Firestore read fails.
      }
    })();
    return () => { alive = false; };
  }, []);

  const testimonialsToShow = items.length ? items : testimonials;

  useEffect(() => {
    if (!testimonialsToShow.length) return undefined;
    const timer = setInterval(() => setCurrent(c => (c + 1) % testimonialsToShow.length), 5000);
    return () => clearInterval(timer);
  }, [testimonialsToShow]);

  useEffect(() => {
    if (current >= testimonialsToShow.length) setCurrent(0);
  }, [current, testimonialsToShow.length]);

  const prev = () => setCurrent(c => (c - 1 + testimonialsToShow.length) % testimonialsToShow.length);
  const next = () => setCurrent(c => (c + 1) % testimonialsToShow.length);

  return (
    <section ref={sectionRef} style={{ background: 'var(--x4-black)', padding: '8rem 3rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(123,0,255,0.08) 0%, transparent 60%)' }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p className="section-label">Client Love</p>
          <h2 className="section-title">
            WHAT THEY<br />
            <span style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)', color: 'transparent' }}>SAY</span>
          </h2>
        </div>

        <div className="reveal reveal-delay-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--x4-border)', marginBottom: '3rem' }}>
          {testimonialsToShow.map((t, i) => (
            <div
              key={t.id || i}
              className="testimonial-card"
              style={{
                transition: 'all 0.4s ease',
                opacity: current === i ? 1 : 0.4,
                transform: current === i ? 'scale(1)' : 'scale(0.98)',
              }}
            >
              <div className="quote-mark">"</div>
              <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.5rem', paddingTop: '0.5rem' }}>
                {Array(t.stars).fill(0).map((_, j) => (
                  <Star key={j} size={12} fill="var(--x4-cyan)" color="var(--x4-cyan)" />
                ))}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src={t.avatar} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
          <button onClick={prev} style={{ width: '44px', height: '44px', border: '1px solid var(--x4-border)', background: 'transparent', color: 'var(--x4-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--x4-cyan)'; e.target.style.color = 'var(--x4-cyan)'; }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--x4-border)'; e.target.style.color = 'var(--x4-muted)'; }}>
            <ChevronLeft size={18} />
          </button>
          {testimonialsToShow.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? '24px' : '6px', height: '6px', background: i === current ? 'var(--x4-cyan)' : 'var(--x4-border)', border: 'none', cursor: 'pointer', transition: 'all 0.4s ease', borderRadius: '3px' }} />
          ))}
          <button onClick={next} style={{ width: '44px', height: '44px', border: '1px solid var(--x4-border)', background: 'transparent', color: 'var(--x4-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--x4-cyan)'; e.target.style.color = 'var(--x4-cyan)'; }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--x4-border)'; e.target.style.color = 'var(--x4-muted)'; }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80';
