import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Mail, Eye, EyeOff, Zap } from 'lucide-react';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [show, setShow]   = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid credentials. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--x4-black)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif', position: 'relative', overflow: 'hidden'
    }}>
      {/* BG glow */}
      <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,102,255,0.12) 0%, transparent 70%)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

      {/* Grid bg */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '420px', padding: '2rem', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.5rem', letterSpacing: '0.1em', color: '#fff', marginBottom: '0.5rem' }}>
            X4<span style={{ color: 'var(--x4-cyan)' }}>TECH</span>
          </div>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.4em', color: 'var(--x4-muted)', textTransform: 'uppercase' }}>
            Admin Portal
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--x4-card)', border: '1px solid var(--x4-border)', padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ width: '36px', height: '36px', background: 'rgba(0,102,255,0.15)', border: '1px solid rgba(0,102,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={16} color="var(--x4-blue)" />
            </div>
            <div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', letterSpacing: '0.05em', color: '#fff' }}>Secure Access</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--x4-muted)' }}>Sign in to manage your portfolio</div>
            </div>
          </div>

          {error && (
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,0,60,0.08)', border: '1px solid rgba(255,0,60,0.3)', color: '#ff6b8a', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--x4-muted)' }} />
                <input
                  type="email" required
                  style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                  placeholder="admin@x4tech.dev"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--x4-muted)' }} />
                <input
                  type={show ? 'text' : 'password'} required
                  style={{ ...inputStyle, paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  placeholder="••••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
                <button type="button" onClick={() => setShow(s => !s)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--x4-muted)', padding: 0 }}>
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ marginTop: '0.5rem', padding: '0.9rem', background: loading ? 'var(--x4-border)' : 'var(--x4-blue)', border: 'none', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background 0.3s' }}>
              {loading ? (
                <><span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Signing In...</>
              ) : (
                <><Zap size={14} /> Access Dashboard</>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--x4-muted)' }}>
            Protected area — authorized personnel only
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="/" style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--x4-muted)', textDecoration: 'none', textTransform: 'uppercase' }}>
            ← Back to Website
          </a>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const labelStyle = {
  fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.3em',
  color: 'var(--x4-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem'
};
const inputStyle = {
  width: '100%', background: 'var(--x4-dark)', border: '1px solid var(--x4-border)',
  color: 'var(--x4-text)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
  padding: '0.75rem 1rem', outline: 'none', transition: 'border-color 0.3s'
};
