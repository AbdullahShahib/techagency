import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamShowcase from '@/components/ui/team-showcase';
import { getAll, COLS } from '@/lib/firestore';
import { sanitizeImageUrl } from '@/lib/utils';

const FALLBACK_TEAM = [
  {
    id: 'm1',
    name: 'X4Tech Team Member',
    role: 'Design & Development',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
    bio: 'We craft high-performance websites and apps focused on growth.',
    social: { linkedin: '#', twitter: '#' },
  },
  {
    id: 'm2',
    name: 'X4Tech Team Member',
    role: 'Frontend Engineer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
    bio: 'Building polished interfaces with clean interactions and speed.',
    social: { linkedin: '#' },
  },
  {
    id: 'm3',
    name: 'X4Tech Team Member',
    role: 'Brand Strategist',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    bio: 'Helping businesses stand out with bold visuals and clear messaging.',
    social: { twitter: '#' },
  },
];

export default function TeamShowcaseSection() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getAll(COLS.TEAM);
        if (!alive || !Array.isArray(data) || !data.length) return;

        const mapped = data
          .filter((m) => m.visible !== false)
          .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
          .map((m) => ({
            id: m.id,
            name: m.name || 'Team Member',
            role: m.role || 'Contributor',
            image: sanitizeImageUrl(m.headshotUrl),
            bio: m.bio || 'Creative and technical professional at X4Tech.',
            social: {
              twitter: m.twitter ? normalizeExternalUrl(m.twitter) : undefined,
              linkedin: m.linkedin ? normalizeExternalUrl(m.linkedin) : undefined,
              instagram: m.instagram ? normalizeExternalUrl(m.instagram) : undefined,
              behance: m.github ? normalizeExternalUrl(m.github) : undefined,
            },
          }));

        setMembers(mapped);
      } catch (_) {
        // keep fallback
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const teamToRender = useMemo(() => (members.length ? members : FALLBACK_TEAM), [members]);

  return (
    <section id="team" style={{ background: 'var(--x4-dark)', padding: 'clamp(4rem, 10vw, 7rem) clamp(1rem, 5vw, 3rem)', borderTop: '1px solid var(--x4-border)', borderBottom: '1px solid var(--x4-border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <p className="section-label">About Us</p>
          <h2 className="section-title" style={{ maxWidth: '680px' }}>
            MEET THE<br />
            <span style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)', color: 'transparent' }}>TEAM</span>
          </h2>
        </div>

        <TeamShowcase
          members={teamToRender}
          onMemberClick={(member) => navigate(`/about?member=${encodeURIComponent(member.id)}`)}
        />
      </div>
    </section>
  );
}

function normalizeExternalUrl(value) {
  if (!value) return '#';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return `https://${value}`;
}