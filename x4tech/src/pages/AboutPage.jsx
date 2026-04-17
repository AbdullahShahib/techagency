import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Cursor from '../components/ui/Cursor';
import Footer from '../components/sections/Footer';
import { getAll, COLS } from '../lib/firestore';
import { sanitizeImageUrl } from '../lib/utils';
import { TestimonialCarousel } from '../components/ui/profile-card-testimonial-carousel';

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
  const location = useLocation();
  const [members, setMembers] = useState([]);
  const [teamLoaded, setTeamLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getAll(COLS.TEAM);
        if (!alive) return;
        if (Array.isArray(data) && data.length) {
          const mapped = data
            .filter((m) => m.visible !== false)
            .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
            .map((m) => ({
              ...m,
              headshotUrl: sanitizeImageUrl(m.headshotUrl),
            }));
          setMembers(mapped);
        }
      } catch (_) {
        // Keep fallback members when Firestore is unavailable.
      } finally {
        if (alive) setTeamLoaded(true);
      }
    })();
    return () => { alive = false; };
  }, []);

  const team = members.length ? members : FALLBACK_MEMBERS;
  const selectedMemberId = new URLSearchParams(location.search).get('member');
  const initialIndex = Math.max(0, team.findIndex((m) => String(m.id) === String(selectedMemberId)));

  return (
    <>
      <div className="scanline" />
      <Cursor />

      <main style={{ background: 'var(--x4-black)', minHeight: '100vh' }}>
        <section style={{ padding: 'clamp(4.5rem, 10vw, 7rem) clamp(1rem, 5vw, 3rem) clamp(2.5rem, 8vw, 4rem)', borderBottom: '1px solid var(--x4-border)', position: 'relative', overflow: 'hidden' }}>
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

        <section style={{ padding: 'clamp(2rem, 6vw, 4rem) clamp(0.75rem, 4vw, 3rem) clamp(3rem, 10vw, 8rem)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {teamLoaded ? (
              <TestimonialCarousel testimonials={team.map(mapMemberToTestimonial)} initialIndex={initialIndex} />
            ) : (
              <div style={{ height: '520px', borderRadius: '24px', border: '1px solid var(--x4-border)', background: 'rgba(255,255,255,0.02)' }} />
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

function normalizeExternalUrl(value) {
  if (!value) return '#';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return `https://${value}`;
}

function toMailto(value) {
  if (!value) return '#';
  if (value.startsWith('mailto:')) return value;
  return `mailto:${value}`;
}

function mapMemberToTestimonial(member) {
  return {
    name: member.name,
    title: member.role || 'Team Member',
    description: member.bio || 'Creative and technical professional at X4Tech.',
    imageUrl: member.headshotUrl || FALLBACK_MEMBERS[0].headshotUrl,
    githubUrl: member.github ? normalizeExternalUrl(member.github) : undefined,
    twitterUrl: member.twitter ? normalizeExternalUrl(member.twitter) : undefined,
    youtubeUrl: member.instagram ? normalizeExternalUrl(member.instagram) : undefined,
    linkedinUrl: member.linkedin ? normalizeExternalUrl(member.linkedin) : undefined,
    instagramUrl: member.instagram ? normalizeExternalUrl(member.instagram) : undefined,
    gmailUrl: member.gmail ? toMailto(member.gmail) : undefined,
  };
}
