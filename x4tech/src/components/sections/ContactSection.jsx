import React, { useState } from 'react';
import { Send, Mail, MessageCircle, Phone } from 'lucide-react';
import { useReveal } from '../../hooks/useReveal';

const services = ['Web Development', 'Mobile App', 'Logo Design', 'Brand Identity', 'Poster Design', 'UI/UX Design', 'Full Package'];

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', service: '', budget: '', message: '' });
  const [sent, setSent] = useState(false);
  const sectionRef = useReveal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" ref={sectionRef} style={{ background: 'var(--x4-dark)', padding: '8rem 3rem', position: 'relative', overflow: 'hidden' }}>
      <div className="contact-glow" />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, var(--x4-blue), var(--x4-cyan), transparent)' }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
        {/* Big CTA Header */}
        <div className="reveal" style={{ marginBottom: '5rem', textAlign: 'center' }}>
          <p className="section-label">Let's Build</p>
          <div className="big-cta-title">
            <div>START YOUR</div>
            <div className="hollow">PROJECT</div>
            <div>TODAY</div>
          </div>
          <p style={{ color: 'var(--x4-muted)', fontSize: '1rem', marginTop: '2rem', maxWidth: '500px', margin: '2rem auto 0', lineHeight: 1.7 }}>
            Tell us what you're building. We'll get back to you within 24 hours with a tailored proposal.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '4rem', alignItems: 'start' }}>
          {/* Left info */}
          <div className="reveal">
            <div style={{ marginBottom: '3rem' }}>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.4em', color: 'var(--x4-cyan)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Contact Info</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <a href="mailto:hello@x4tech.dev" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--x4-text)', textDecoration: 'none', padding: '1rem', border: '1px solid var(--x4-border)', transition: 'border-color 0.3s ease' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--x4-blue)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--x4-border)'}>
                  <Mail size={18} color="var(--x4-blue)" />
                  <div>
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--x4-muted)', marginBottom: '0.2rem' }}>EMAIL</div>
                    <div style={{ fontSize: '0.9rem' }}>hello@x4tech.dev</div>
                  </div>
                </a>
                <a href="https://wa.me/919999999999" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--x4-text)', textDecoration: 'none', padding: '1rem', border: '1px solid var(--x4-border)', transition: 'border-color 0.3s ease' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--x4-blue)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--x4-border)'}>
                  <MessageCircle size={18} color="var(--x4-cyan)" />
                  <div>
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--x4-muted)', marginBottom: '0.2rem' }}>WHATSAPP</div>
                    <div style={{ fontSize: '0.9rem' }}>Chat with us directly</div>
                  </div>
                </a>
                <a href="tel:+919999999999" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--x4-text)', textDecoration: 'none', padding: '1rem', border: '1px solid var(--x4-border)', transition: 'border-color 0.3s ease' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--x4-blue)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--x4-border)'}>
                  <Phone size={18} color="var(--x4-purple)" />
                  <div>
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--x4-muted)', marginBottom: '0.2rem' }}>CALL</div>
                    <div style={{ fontSize: '0.9rem' }}>+91 99999 99999</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Availability badge */}
            <div style={{ padding: '1.25rem', border: '1px solid rgba(0,212,255,0.2)', background: 'rgba(0,212,255,0.03)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff88', display: 'inline-block', boxShadow: '0 0 10px #00ff88', flexShrink: 0, animation: 'pulse 2s infinite' }} />
              <div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em', color: '#00ff88', textTransform: 'uppercase' }}>Available for Work</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--x4-muted)', marginTop: '0.2rem' }}>Accepting projects for Q2 2025</div>
              </div>
            </div>

            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
          </div>

          {/* Form */}
          <div className="reveal reveal-delay-2">
            {sent ? (
              <div style={{ padding: '4rem', textAlign: 'center', border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.03)' }}>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '3rem', color: 'var(--x4-cyan)', marginBottom: '1rem' }}>MESSAGE SENT!</div>
                <p style={{ color: 'var(--x4-muted)' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.3em', color: 'var(--x4-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Name *</label>
                    <input className="contact-form-input" placeholder="Your full name" required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.3em', color: 'var(--x4-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Email *</label>
                    <input className="contact-form-input" type="email" placeholder="you@company.com" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.3em', color: 'var(--x4-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Service</label>
                    <select className="contact-form-input" style={{ cursor: 'pointer' }} value={form.service} onChange={e => setForm(f => ({...f, service: e.target.value}))}>
                      <option value="" style={{ background: 'var(--x4-card)' }}>Select service...</option>
                      {services.map(s => <option key={s} value={s} style={{ background: 'var(--x4-card)' }}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.3em', color: 'var(--x4-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Budget</label>
                    <select className="contact-form-input" style={{ cursor: 'pointer' }} value={form.budget} onChange={e => setForm(f => ({...f, budget: e.target.value}))}>
                      <option value="" style={{ background: 'var(--x4-card)' }}>Budget range...</option>
                      {['< ₹15K', '₹15K – ₹50K', '₹50K – ₹1L', '₹1L – ₹3L', '₹3L+'].map(b => (
                        <option key={b} value={b} style={{ background: 'var(--x4-card)' }}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.3em', color: 'var(--x4-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Tell us about your project *</label>
                  <textarea className="contact-form-input" rows={5} placeholder="What are you building? What's the goal? Any specific requirements?" required value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} style={{ resize: 'vertical' }} />
                </div>

                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <span>Send Message</span>
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
