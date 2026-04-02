import React, { useEffect, useState } from 'react';
import { Monitor, Smartphone, Palette, Megaphone, Code2, Layers, ArrowUpRight } from 'lucide-react';
import { useReveal } from '../../hooks/useReveal';
import { getAll, COLS } from '../../lib/firestore';

const services = [
  {
    num: '01',
    icon: Monitor,
    name: 'Web Development',
    desc: 'Custom websites and web apps built with cutting-edge tech. Lightning fast, fully responsive, and conversion optimized.',
    tags: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
    color: '#0066FF'
  },
  {
    num: '02',
    icon: Smartphone,
    name: 'App Development',
    desc: 'Native and cross-platform mobile apps for iOS and Android that users love to open every morning.',
    tags: ['React Native', 'Flutter', 'iOS', 'Android'],
    color: '#00D4FF'
  },
  {
    num: '03',
    icon: Palette,
    name: 'Logo & Identity',
    desc: 'Brand marks that carry weight. We craft logos and visual identities that make your business unforgettable.',
    tags: ['Logo Design', 'Brand Guide', 'Typography', 'Color System'],
    color: '#7B00FF'
  },
  {
    num: '04',
    icon: Layers,
    name: 'Poster & Print',
    desc: 'Print and digital marketing materials that stop the scroll and command attention at every touchpoint.',
    tags: ['Poster Design', 'Banners', 'Social Media', 'Flyers'],
    color: '#FF003C'
  },
  {
    num: '05',
    icon: Megaphone,
    name: 'Business Branding',
    desc: 'End-to-end brand strategy and identity systems that position your business for growth and recognition.',
    tags: ['Brand Strategy', 'Visual Identity', 'Guidelines', 'Assets'],
    color: '#0066FF'
  },
  {
    num: '06',
    icon: Code2,
    name: 'UI/UX Design',
    desc: 'Wireframes, prototypes, and pixel-perfect designs in Figma that balance beauty with ruthless usability.',
    tags: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
    color: '#00D4FF'
  }
];

export default function ServicesSection() {
  const sectionRef = useReveal();
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getAll(COLS.SERVICES);
        if (alive && Array.isArray(data) && data.length) {
          const mapped = data
            .filter(s => s.visible !== false)
            .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
            .map((s, i) => ({
              id: s.id,
              num: String(i + 1).padStart(2, '0'),
              icon: ICON_MAP[s.icon] || Monitor,
              name: s.title || 'Service',
              desc: s.shortDesc || s.longDesc || '',
              tags: Array.isArray(s.tags) ? s.tags : [],
              color: PALETTE[i % PALETTE.length],
            }));
          setItems(mapped);
        }
      } catch (_) {
        // Keep local fallback data if Firestore read fails.
      }
    })();
    return () => { alive = false; };
  }, []);

  const servicesToShow = items.length ? items : services;

  return (
    <section id="services" ref={sectionRef} style={{ background: 'var(--x4-dark)', position: 'relative', padding: '8rem 3rem', overflow: 'hidden' }}>
      {/* Background grid */}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
      
      {/* Blue glow */}
      <div style={{ position: 'absolute', top: 0, left: '20%', width: '60%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--x4-blue), transparent)' }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'end', marginBottom: '5rem' }}>
          <div className="reveal">
            <p className="section-label">What We Do</p>
            <h2 className="section-title">
              OUR<br />
              <span style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)', color: 'transparent' }}>SERVICES</span>
            </h2>
          </div>
          <div className="reveal reveal-delay-2">
            <p style={{ color: 'var(--x4-muted)', lineHeight: 1.8, fontSize: '1rem', maxWidth: '440px' }}>
              From concept to launch — we handle every digital touchpoint so you can focus on running your business.
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem' }}>
              <div>
                <div className="stat-num" style={{ fontSize: '2.5rem' }}>50<span className="accent">+</span></div>
                <div className="stat-label">Projects Done</div>
              </div>
              <div>
                <div className="stat-num" style={{ fontSize: '2.5rem' }}>30<span className="accent">+</span></div>
                <div className="stat-label">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--x4-border)' }}>
          {servicesToShow.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <div key={svc.id || i} className={`service-card reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="service-num">{svc.num}</div>
                <div className="service-icon-wrap" style={{ borderColor: `${svc.color}30` }}>
                  <Icon size={22} color={svc.color} />
                </div>
                <div className="service-name">{svc.name}</div>
                <p className="service-desc">{svc.desc}</p>
                <div className="service-tags">
                  {svc.tags.map((t, j) => <span key={j} className="service-tag">{t}</span>)}
                </div>
                <div className="service-arrow">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const ICON_MAP = {
  Monitor,
  Smartphone,
  Palette,
  Megaphone,
  Code2,
  Layers,
};

const PALETTE = ['#0066FF', '#00D4FF', '#7B00FF', '#FF003C'];
