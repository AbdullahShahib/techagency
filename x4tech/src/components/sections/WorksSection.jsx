import React, { useState } from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { useReveal } from '../../hooks/useReveal';

const works = [
  {
    id: 1,
    cat: 'Web Development',
    title: 'FinFlow Dashboard',
    desc: 'A real-time finance tracking SaaS with custom charts and AI insights.',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    tags: ['React', 'Node.js', 'D3'],
    size: 'large'
  },
  {
    id: 2,
    cat: 'Brand Identity',
    title: 'Nova Coffee Co.',
    desc: 'Full rebrand for a premium specialty coffee brand.',
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    tags: ['Logo', 'Packaging', 'Brand Guide'],
    size: 'small'
  },
  {
    id: 3,
    cat: 'Mobile App',
    title: 'TrailMate',
    desc: 'Cross-platform hiking app with GPS trail mapping and community features.',
    img: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80',
    tags: ['React Native', 'Maps API'],
    size: 'small'
  },
  {
    id: 4,
    cat: 'UI/UX Design',
    title: 'MedSync Platform',
    desc: 'Healthcare management system with intuitive patient-first design.',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    tags: ['Figma', 'Design System'],
    size: 'medium'
  },
  {
    id: 5,
    cat: 'E-Commerce',
    title: 'Luxé Boutique',
    desc: 'Premium fashion e-commerce with immersive product experience.',
    img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
    tags: ['Shopify', 'Custom Dev'],
    size: 'medium'
  },
  {
    id: 6,
    cat: 'Poster Design',
    title: 'Neon Nights Festival',
    desc: 'Full visual identity and poster suite for a 3-day music festival.',
    img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    tags: ['Print', 'Digital', 'Motion'],
    size: 'large'
  }
];

const filters = ['All', 'Web Development', 'Brand Identity', 'Mobile App', 'UI/UX Design', 'E-Commerce', 'Poster Design'];

export default function WorksSection() {
  const [active, setActive] = useState('All');
  const sectionRef = useReveal();

  const filtered = active === 'All' ? works : works.filter(w => w.cat === active);

  return (
    <section id="works" ref={sectionRef} style={{ background: 'var(--x4-black)', padding: '8rem 3rem', position: 'relative', overflow: 'hidden' }}>
      {/* Accent line */}
      <div style={{ position: 'absolute', bottom: 0, right: '15%', width: '40%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--x4-purple), transparent)' }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
          <div className="reveal">
            <p className="section-label">Portfolio</p>
            <h2 className="section-title">
              SELECTED<br />
              <span style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)', color: 'transparent' }}>WORKS</span>
            </h2>
          </div>
          <div className="reveal reveal-delay-2" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActive(f)}
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.6rem',
                  letterSpacing: '0.15em',
                  padding: '0.5rem 1rem',
                  textTransform: 'uppercase',
                  background: active === f ? 'var(--x4-blue)' : 'transparent',
                  border: `1px solid ${active === f ? 'var(--x4-blue)' : 'var(--x4-border)'}`,
                  color: active === f ? '#fff' : 'var(--x4-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Works grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--x4-border)' }}>
          {filtered.map((work, i) => (
            <div
              key={work.id}
              className={`work-card reveal reveal-delay-${(i % 3) + 1}`}
              style={{ gridColumn: work.size === 'large' && i === 0 ? 'span 2' : 'span 1' }}
            >
              <div style={{ overflow: 'hidden', aspectRatio: work.size === 'large' && i === 0 ? '16/9' : '4/3' }}>
                <img className="work-img" src={work.img} alt={work.title} />
              </div>
              <div className="work-overlay">
                <div>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--x4-cyan)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{work.cat}</p>
                  <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', letterSpacing: '0.05em', color: '#fff' }}>{work.title}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                    {work.tags.map((t, j) => (
                      <span key={j} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', padding: '0.2rem 0.6rem', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}>{t}</span>
                    ))}
                  </div>
                </div>
                <ArrowUpRight size={32} color="var(--x4-cyan)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
              </div>
              <div className="work-info">
                <div className="work-cat">{work.cat}</div>
                <div className="work-title">{work.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="reveal" style={{ textAlign: 'center', marginTop: '4rem' }}>
          <button className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
            View All Projects <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
