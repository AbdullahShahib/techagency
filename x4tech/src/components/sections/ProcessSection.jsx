import React from 'react';
import { useReveal } from '../../hooks/useReveal';

const steps = [
  {
    num: '01',
    title: 'Discovery Call',
    desc: 'We dive deep into your goals, audience, and vision. No templates — every project starts with a blank canvas and your unique story.',
    duration: '1–2 days'
  },
  {
    num: '02',
    title: 'Strategy & Proposal',
    desc: 'We map out the full scope: tech stack, design direction, timeline, and pricing. You get a clear roadmap before a single pixel is drawn.',
    duration: '2–3 days'
  },
  {
    num: '03',
    title: 'Design & Prototype',
    desc: 'Wireframes, visual concepts, and interactive prototypes. You see the full picture before development begins. Revisions until it\'s perfect.',
    duration: '5–14 days'
  },
  {
    num: '04',
    title: 'Build & Develop',
    desc: 'Our engineers build it clean, fast, and scalable. You get weekly progress updates and a live staging link throughout development.',
    duration: '2–8 weeks'
  },
  {
    num: '05',
    title: 'Launch & Beyond',
    desc: 'We handle deployment, testing, and go-live. Then we stick around for support, updates, and growth as your business evolves.',
    duration: 'Ongoing'
  },
];

export default function ProcessSection() {
  const sectionRef = useReveal();

  return (
    <section id="process" ref={sectionRef} style={{ background: 'var(--x4-dark)', padding: '8rem 3rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: '30%', width: '40%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--x4-cyan), transparent)' }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '6rem' }}>
        {/* Left sticky header */}
        <div className="reveal" style={{ position: 'sticky', top: '6rem', alignSelf: 'start' }}>
          <p className="section-label">How We Work</p>
          <h2 className="section-title">
            OUR<br />
            <span style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)', color: 'transparent' }}>PROCESS</span>
          </h2>
          <p style={{ color: 'var(--x4-muted)', lineHeight: 1.8, marginTop: '1.5rem', fontSize: '0.9rem' }}>
            A clear, collaborative workflow that keeps you informed and in control at every stage.
          </p>

          <div style={{ marginTop: '3rem', padding: '1.5rem', border: '1px solid var(--x4-border)', background: 'var(--x4-card)' }}>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--x4-cyan)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Ready to start?</p>
            <p style={{ color: 'var(--x4-muted)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>Most projects kick off within 48 hours of signing.</p>
            <button className="btn-primary" style={{ width: '100%', textAlign: 'center' }} onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
              <span>Book a Free Call</span>
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="reveal reveal-delay-2">
          {steps.map((step, i) => (
            <div key={i} className="process-step">
              <div className="step-num">{step.num}</div>
              <div className="step-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '1rem' }}>
                  <div className="step-title">{step.title}</div>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--x4-blue)', border: '1px solid rgba(0,102,255,0.3)', padding: '0.25rem 0.6rem', textTransform: 'uppercase', flexShrink: 0, marginTop: '0.4rem' }}>
                    {step.duration}
                  </span>
                </div>
                <p className="step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
