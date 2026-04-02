import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, FolderOpen, Wrench, Star, Users, FileText,
  Search, LogOut, ChevronLeft, ChevronRight, Menu, Briefcase,
  Image, Settings, Bell
} from 'lucide-react';

const NAV = [
  { label: 'Dashboard',    path: '/admin/dashboard',    icon: LayoutDashboard },
  { label: 'Projects',     path: '/admin/projects',     icon: FolderOpen },
  { label: 'Services',     path: '/admin/services',     icon: Wrench },
  { label: 'Testimonials', path: '/admin/testimonials', icon: Star },
  { label: 'Clients',      path: '/admin/clients',      icon: Image },
  { label: 'Team',         path: '/admin/team',         icon: Users },
  { label: 'Blog',         path: '/admin/blog',         icon: FileText },
  { label: 'Jobs',         path: '/admin/jobs',         icon: Briefcase },
  { label: 'SEO',          path: '/admin/seo',          icon: Search },
  { label: 'Settings',     path: '/admin/settings',     icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => { await logout(); navigate('/admin'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#07070E', fontFamily: 'DM Sans, sans-serif', color: 'var(--x4-text)' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: collapsed ? '64px' : '240px', flexShrink: 0,
        background: 'var(--x4-dark)', borderRight: '1px solid var(--x4-border)',
        display: 'flex', flexDirection: 'column', transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1)',
        position: 'sticky', top: 0, height: '100vh', zIndex: 100, overflow: 'hidden'
      }}>
        {/* Logo */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--x4-border)', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', gap: '0.5rem' }}>
          {!collapsed && (
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
              X4<span style={{ color: 'var(--x4-cyan)' }}>TECH</span>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.5rem', letterSpacing: '0.2em', color: 'var(--x4-muted)', display: 'block', marginTop: '-4px' }}>ADMIN</span>
            </span>
          )}
          <button onClick={() => setCollapsed(c => !c)}
            style={{ background: 'none', border: '1px solid var(--x4-border)', color: 'var(--x4-muted)', padding: '0.3rem', cursor: 'pointer', display: 'flex', flexShrink: 0, transition: 'all 0.3s' }}>
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto', overflowX: 'hidden' }}>
          {NAV.map(({ label, path, icon: Icon }) => (
            <NavLink key={path} to={path}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: collapsed ? '0.7rem' : '0.65rem 1.25rem',
                justifyContent: collapsed ? 'center' : 'flex-start',
                color: isActive ? 'var(--x4-cyan)' : 'var(--x4-muted)',
                background: isActive ? 'rgba(0,212,255,0.06)' : 'transparent',
                borderLeft: isActive && !collapsed ? '2px solid var(--x4-cyan)' : '2px solid transparent',
                textDecoration: 'none', fontSize: '0.85rem', whiteSpace: 'nowrap',
                transition: 'all 0.2s ease', fontWeight: isActive ? 500 : 400,
              })}>
              <Icon size={16} style={{ flexShrink: 0 }} />
              {!collapsed && label}
            </NavLink>
          ))}
        </nav>

        {/* User / Logout */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--x4-border)' }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', padding: '0.6rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--x4-border)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--x4-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', fontWeight: 700 }}>
                {user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--x4-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--x4-muted)' }}>Administrator</div>
              </div>
            </div>
          )}
          <button onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: '0.6rem', padding: '0.6rem', background: 'none', border: '1px solid var(--x4-border)', color: 'var(--x4-muted)', cursor: 'pointer', fontSize: '0.78rem', transition: 'all 0.2s', fontFamily: 'inherit' }}>
            <LogOut size={14} />
            {!collapsed && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--x4-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--x4-dark)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--x4-muted)', textTransform: 'uppercase' }}>
              X4Tech Admin
            </span>
            <span style={{ color: 'var(--x4-border)' }}>/</span>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--x4-cyan)', textTransform: 'uppercase' }}>
              Control Panel
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <a href="/" target="_blank" rel="noreferrer"
              style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--x4-muted)', textDecoration: 'none', padding: '0.4rem 0.8rem', border: '1px solid var(--x4-border)', textTransform: 'uppercase', transition: 'all 0.2s' }}>
              View Site ↗
            </a>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
