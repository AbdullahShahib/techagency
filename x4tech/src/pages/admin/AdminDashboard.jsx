import React, { useEffect, useState } from 'react';
import { FolderOpen, Wrench, Star, Users, FileText, TrendingUp, Eye, Clock } from 'lucide-react';
import { getAll, COLS } from '../../lib/firestore';
import { StatCard, PageHeader } from '../../components/admin/AdminUI';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ projects: 0, services: 0, testimonials: 0, team: 0, blog: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [projects, services, testimonials, team, blog] = await Promise.all([
          getAll(COLS.PROJECTS), getAll(COLS.SERVICES), getAll(COLS.TESTIMONIALS),
          getAll(COLS.TEAM), getAll(COLS.BLOG)
        ]);
        setCounts({ projects: projects.length, services: services.length, testimonials: testimonials.length, team: team.length, blog: blog.length });
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`${greeting} — here's your X4Tech overview`}
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <StatCard icon={FolderOpen} label="Projects"     value={loading ? '…' : counts.projects}     color="#0066FF" />
        <StatCard icon={Wrench}    label="Services"      value={loading ? '…' : counts.services}     color="#00D4FF" />
        <StatCard icon={Star}      label="Testimonials"  value={loading ? '…' : counts.testimonials} color="#7B00FF" />
        <StatCard icon={Users}     label="Team Members"  value={loading ? '…' : counts.team}         color="#FF003C" />
        <StatCard icon={FileText}  label="Blog Posts"    value={loading ? '…' : counts.blog}         color="#00D4FF" />
      </div>

      {/* Quick links */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--x4-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Quick Actions</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {[
            { label: 'Add Project',     href: '/admin/projects',     color: '#0066FF' },
            { label: 'Add Service',     href: '/admin/services',     color: '#00D4FF' },
            { label: 'Add Testimonial', href: '/admin/testimonials', color: '#7B00FF' },
            { label: 'Write Blog Post', href: '/admin/blog',         color: '#FF003C' },
            { label: 'Update SEO',      href: '/admin/seo',          color: '#00ff88' },
            { label: 'Add Team Member', href: '/admin/team',         color: '#0066FF' },
          ].map(item => (
            <a key={item.label} href={item.href}
              style={{ padding: '1rem 1.25rem', background: 'var(--x4-card)', border: `1px solid var(--x4-border)`, color: 'var(--x4-text)', textDecoration: 'none', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s', borderLeft: `3px solid ${item.color}` }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--x4-card)'; }}>
              {item.label}
              <span style={{ color: item.color, fontSize: '1rem' }}>→</span>
            </a>
          ))}
        </div>
      </div>

      {/* Firebase setup reminder */}
      <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', display: 'flex', gap: '1rem' }}>
        <Clock size={18} color="var(--x4-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--x4-cyan)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Firebase Setup Required</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--x4-muted)', lineHeight: 1.6 }}>
            Add your Firebase credentials to <code style={{ color: 'var(--x4-text)', background: 'rgba(255,255,255,0.06)', padding: '0.1rem 0.4rem' }}>.env</code> file.
            See README for setup instructions. All CRUD operations connect to Firestore in real-time.
          </p>
        </div>
      </div>
    </div>
  );
}
