import React, { useState } from 'react';
import { Settings, Key, Database, Shield, Copy, Check } from 'lucide-react';
import { PageHeader, Field, Input, Btn, useToast } from '../../components/admin/AdminUI';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function AdminSettings() {
  const { user } = useAuth();
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [copied, setCopied] = useState('');
  const { toast, ToastContainer } = useToast();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) { toast('Passwords do not match', 'error'); return; }
    if (pwForm.next.length < 8) { toast('Password must be 8+ characters', 'error'); return; }
    setPwSaving(true);
    try {
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: pwForm.current,
      });
      if (reauthError) throw reauthError;

      const { error: updateError } = await supabase.auth.updateUser({
        password: pwForm.next,
      });
      if (updateError) throw updateError;

      toast('Password updated!');
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (_) { toast('Incorrect current password', 'error'); }
    setPwSaving(false);
  };

  const copyEnv = (val, key) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const envVars = [
    { key: 'VITE_SUPABASE_URL',                  val: 'https://your-project-ref.supabase.co' },
    { key: 'VITE_SUPABASE_ANON_KEY',             val: 'your_anon_key' },
    { key: 'VITE_SUPABASE_STORAGE_BUCKET',       val: 'media' },
  ];

  return (
    <div>
      <ToastContainer />
      <PageHeader title="Settings" subtitle="Account, Supabase setup, and configuration" />

      {/* Account */}
      <div style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--x4-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700 }}>
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', letterSpacing: '0.05em', color: '#fff' }}>Your Account</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--x4-muted)' }}>{user?.email}</div>
          </div>
        </div>

        {/* Change password */}
        <div style={{ padding: '1.5rem', background: 'var(--x4-card)', border: '1px solid var(--x4-border)', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Shield size={16} color="var(--x4-blue)" />
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--x4-cyan)', textTransform: 'uppercase' }}>Change Password</p>
          </div>
          <form onSubmit={handlePasswordChange}>
            <Field label="Current Password">
              <Input type="password" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" required />
            </Field>
            <Field label="New Password" hint="Minimum 8 characters">
              <Input type="password" value={pwForm.next} onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))} placeholder="••••••••" required />
            </Field>
            <Field label="Confirm New Password">
              <Input type="password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" required />
            </Field>
            <Btn type="submit" disabled={pwSaving}>{pwSaving ? 'Updating…' : 'Update Password'}</Btn>
          </form>
        </div>

        {/* Supabase setup guide */}
        <div style={{ padding: '1.5rem', background: 'var(--x4-card)', border: '1px solid rgba(0,212,255,0.2)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Database size={16} color="var(--x4-cyan)" />
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--x4-cyan)', textTransform: 'uppercase' }}>Supabase Setup Guide</p>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--x4-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            <p style={{ marginBottom: '0.5rem', color: 'var(--x4-text)', fontWeight: 500 }}>Follow these steps to connect Supabase:</p>
            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" style={{ color: 'var(--x4-cyan)' }}>supabase.com/dashboard</a> and create a project</li>
              <li>In Authentication → Providers, enable <strong style={{ color: 'var(--x4-text)' }}>Email</strong></li>
              <li>Create your admin user in Authentication → Users</li>
              <li>Create tables named: <code style={{ background: 'rgba(255,255,255,0.06)', padding: '0.1rem 0.4rem', color: 'var(--x4-text)' }}>projects, services, testimonials, clients, team, blog, seo, case_studies, jobs, settings</code></li>
              <li>Create a Storage bucket named <code style={{ background: 'rgba(255,255,255,0.06)', padding: '0.1rem 0.4rem', color: 'var(--x4-text)' }}>media</code> and make it public</li>
              <li>Project Settings → API: copy Project URL and anon key</li>
              <li>Create a <code style={{ background: 'rgba(255,255,255,0.06)', padding: '0.1rem 0.4rem', color: 'var(--x4-text)' }}>.env</code> file in the project root with the values below</li>
            </ol>
          </div>

          {/* .env template */}
          <div style={{ background: 'var(--x4-dark)', border: '1px solid var(--x4-border)', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--x4-muted)' }}>.env</span>
              <button onClick={() => copyEnv(envVars.map(v => `${v.key}=${v.val}`).join('\n'), 'all')}
                style={{ background: 'none', border: '1px solid var(--x4-border)', color: 'var(--x4-muted)', cursor: 'pointer', padding: '0.25rem 0.6rem', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {copied === 'all' ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy All</>}
              </button>
            </div>
            {envVars.map(({ key, val }) => (
              <div key={key} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem', fontFamily: 'Space Mono, monospace', fontSize: '0.72rem' }}>
                <span style={{ color: 'var(--x4-cyan)' }}>{key}</span>
                <span style={{ color: 'var(--x4-border)' }}>=</span>
                <span style={{ color: '#ffa657' }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,0,60,0.05)', border: '1px solid rgba(255,0,60,0.2)', fontSize: '0.78rem', color: 'var(--x4-muted)', display: 'flex', gap: '0.5rem' }}>
            <span style={{ color: '#ff6b8a', flexShrink: 0 }}>⚠</span>
            Add <code style={{ color: 'var(--x4-text)' }}>.env</code> to your <code style={{ color: 'var(--x4-text)' }}>.gitignore</code> — never commit Supabase keys to Git.
          </div>
        </div>

        {/* Supabase RLS reminder */}
        <div style={{ padding: '1.25rem', background: 'var(--x4-card)', border: '1px solid var(--x4-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <Key size={14} color="var(--x4-muted)" />
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.2em', color: 'var(--x4-muted)', textTransform: 'uppercase' }}>Supabase RLS Policy</p>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--x4-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
            In SQL Editor, use policies to allow public read and authenticated writes:
          </p>
          <pre style={{ background: 'var(--x4-dark)', padding: '1rem', fontSize: '0.72rem', color: '#e8e8f0', overflowX: 'auto', fontFamily: 'Space Mono, monospace', lineHeight: 1.6, border: '1px solid var(--x4-border)' }}>
{`alter table projects enable row level security;
create policy "public read" on projects for select using (true);
create policy "auth write" on projects for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');`}
          </pre>
        </div>
      </div>
    </div>
  );
}
