import React, { useEffect, useState } from 'react';
import { ArrowLeft, Linkedin, Twitter } from 'lucide-react';
import Cursor from '../components/ui/Cursor';
import Footer from '../components/sections/Footer';
import { getAll, COLS } from '../lib/firestore';

const FALLBACK_MEMBERS = [
  {
    id: 'm1',
    name: 'X4Tech Team Member',
    role: 'Design & Development',
    bio: 'We craft high-performance websites and apps focused on growth.',
    headshotUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
  },
  {
    id: 'm2',
    name: 'X4Tech Team Member',
    role: 'Frontend Engineer',
    bio: 'Building polished interfaces with clean interactions and speed.',
    headshotUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
  },
  {
    id: 'm3',
    name: 'X4Tech Team Member',
    role: 'Brand Strategist',
    bio: 'Helping businesses stand out with bold visuals and clear messaging.',
    headshotUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
  },
];

export default function AboutPage() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getAll(COLS.TEAM);
        if (!alive || !Array.isArray(data) || !data.length) return;
        const mapped = data
          .filter((m) => m.visible !== false)
          .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
        setMembers(mapped);
      } catch (_) {
        // Keep fallback members when Firestore is unavailable.
      }
    })();
    return () => { alive = false; };
  }, []);

  const team = members.length ? members : FALLBACK_MEMBERS;

  return (
    <>
      <div className="scanline" />
      <Cursor />

      <main style={{ background: 'var(--x4-black)', minHeight: '100vh' }}>
        <section style={{ padding: '7rem 3rem 4rem', borderBottom: '1px solid var(--x4-border)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 20%, rgba(0,212,255,0.12) 0%, transparent 45%)' }} />
          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
            <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--x4-muted)', textDecoration: 'none', marginBottom: '1.5rem', fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              <ArrowLeft size={14} /> Back Home
            </a>
            <p className="section-label">About Us</p>
            <h1 className="section-title" style={{ maxWidth: '760px' }}>
              THE PEOPLE<br />
              <span style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)', color: 'transparent' }}>BEHIND X4TECH</span>
            </h1>
            <p style={{ color: 'var(--x4-muted)', maxWidth: '760px', marginTop: '1rem', lineHeight: 1.8 }}>
              We are a compact team of builders, designers, and strategists helping brands launch better digital products.
            </p>
          </div>
        </section>

        <section style={{ padding: '4rem 3rem 8rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1px', background: 'var(--x4-border)' }}>
              {team.map((member) => (
                <article key={member.id} style={{ background: 'var(--x4-card)', padding: '1.2rem' }}>
                  <div style={{ aspectRatio: '4/5', marginBottom: '1rem', overflow: 'hidden', border: '1px solid var(--x4-border)', background: 'var(--x4-dark)' }}>
                    <img
                      src={member.headshotUrl || FALLBACK_MEMBERS[0].headshotUrl}
                      alt={member.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', letterSpacing: '0.04em', color: '#fff', marginBottom: '0.2rem' }}>
                    {member.name}
                  </p>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.2em', color: 'var(--x4-cyan)', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
                    {member.role || 'Team Member'}
                  </p>
                  <p style={{ color: 'var(--x4-muted)', fontSize: '0.86rem', lineHeight: 1.7, minHeight: '72px' }}>
                    {member.bio || 'Creative and technical professional at X4Tech.'}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noreferrer" style={socialLinkStyle}>
                        <Linkedin size={14} />
                      </a>
                    )}
                    {member.twitter && (
                      <a href={member.twitter} target="_blank" rel="noreferrer" style={socialLinkStyle}>
                        <Twitter size={14} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

const socialLinkStyle = {
  width: '34px',
  height: '34px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid var(--x4-border)',
  color: 'var(--x4-muted)',
  textDecoration: 'none',
};
