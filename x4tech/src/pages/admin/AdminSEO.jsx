import React, { useState, useEffect } from 'react';
import { Save, Globe, Share2 } from 'lucide-react';
import { getOne, update, create, COLS } from '../../lib/firestore';
import { PageHeader, Btn, Field, Input, ImageUpload, useToast } from '../../components/admin/AdminUI';

const DOC_ID = 'global';

const EMPTY = {
  siteName: 'X4TECH',
  tagline: 'Build. Design. Launch.',
  metaTitle: 'X4TECH — Freelance Tech Agency',
  metaDesc: 'X4Tech builds apps, websites, logos, posters and brand identities for startups and growing businesses.',
  ogTitle: '',
  ogDesc: '',
  ogImage: null, ogImageUrl: '',
  twitterHandle: '@x4tech',
  googleAnalyticsId: '',
  facebookPixelId: '',
  hotjarId: '',
  contactEmail: 'hello@x4tech.dev',
  whatsapp: '+919999999999',
  address: '',
  linkedIn: '', twitter: '', instagram: '', github: '',
};

export default function AdminSEO() {
  const [form, setForm]   = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { toast, ToastContainer } = useToast();

  useEffect(() => {
    getOne(COLS.SEO, DOC_ID).then(data => {
      if (data) setForm({ ...EMPTY, ...data });
      setLoaded(true);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      let data = { ...form };
      // If OG image is a new upload, handle via uploadFile separately if needed
      delete data.ogImage;
      // Try update first, create if not found
      try { await update(COLS.SEO, DOC_ID, data); }
      catch (_) { await create(COLS.SEO, data); }
      toast('SEO settings saved!');
    } catch (_) { toast('Error saving', 'error'); }
    setSaving(false);
  };

  const f = (key) => (val) => setForm(p => ({ ...p, [key]: typeof val === 'object' && val?.target ? val.target.value : val }));

  const SectionHead = ({ icon: Icon, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '2rem 0 1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--x4-border)' }}>
      <div style={{ width: '32px', height: '32px', background: 'rgba(0,102,255,0.1)', border: '1px solid rgba(0,102,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={14} color="var(--x4-blue)" />
      </div>
      <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--x4-cyan)', textTransform: 'uppercase' }}>{label}</p>
    </div>
  );

  if (!loaded) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--x4-muted)' }}>Loading…</div>;

  return (
    <div>
      <ToastContainer />
      <PageHeader title="SEO & Settings" subtitle="Global metadata, social profiles, analytics" />

      <form onSubmit={handleSave} style={{ maxWidth: '760px' }}>

        {/* ── Site Identity ── */}
        <SectionHead icon={Globe} label="Site Identity" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field label="Site Name"><Input value={form.siteName} onChange={f('siteName')} placeholder="X4TECH" /></Field>
          <Field label="Tagline"><Input value={form.tagline} onChange={f('tagline')} placeholder="Build. Design. Launch." /></Field>
        </div>

        {/* ── Meta / SEO ── */}
        <SectionHead icon={Globe} label="Default Meta Tags" />
        <Field label="Meta Title" hint="Appears in browser tab and Google results (50–60 chars)">
          <Input value={form.metaTitle} onChange={f('metaTitle')} placeholder="X4TECH — Freelance Tech Agency" />
          <div style={{ fontSize: '0.7rem', color: form.metaTitle.length > 60 ? '#ff6b8a' : 'var(--x4-muted)', marginTop: '0.3rem', textAlign: 'right' }}>{form.metaTitle.length} / 60</div>
        </Field>
        <Field label="Meta Description" hint="Appears in Google snippets (max 160 chars)">
          <Input value={form.metaDesc} onChange={f('metaDesc')} rows={3} placeholder="X4Tech builds apps, websites, logos…" />
          <div style={{ fontSize: '0.7rem', color: form.metaDesc.length > 160 ? '#ff6b8a' : 'var(--x4-muted)', marginTop: '0.3rem', textAlign: 'right' }}>{form.metaDesc.length} / 160</div>
        </Field>

        {/* ── Open Graph ── */}
        <SectionHead icon={Share2} label="Open Graph (Social Sharing)" />
        <p style={{ fontSize: '0.82rem', color: 'var(--x4-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>These values appear when your link is shared on Slack, LinkedIn, WhatsApp, etc.</p>
        <Field label="OG Title" hint="Leave blank to use Meta Title">
          <Input value={form.ogTitle} onChange={f('ogTitle')} placeholder="X4TECH — We build what you imagine" />
        </Field>
        <Field label="OG Description" hint="Leave blank to use Meta Description">
          <Input value={form.ogDesc} onChange={f('ogDesc')} rows={2} placeholder="" />
        </Field>
        <Field label="OG Image" hint="Recommended: 1200×630px. This image appears in link previews.">
          <ImageUpload value={form.ogImage || form.ogImageUrl} onChange={v => setForm(p => ({ ...p, ogImage: v }))} label="Upload OG image (1200×630)" />
        </Field>
        <Field label="Twitter Handle">
          <Input value={form.twitterHandle} onChange={f('twitterHandle')} placeholder="@x4tech" />
        </Field>

        {/* ── Analytics ── */}
        <SectionHead icon={Globe} label="Analytics & Tracking" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <Field label="Google Analytics ID" hint="G-XXXXXXXXXX">
            <Input value={form.googleAnalyticsId} onChange={f('googleAnalyticsId')} placeholder="G-XXXXXXXXXX" />
          </Field>
          <Field label="Facebook Pixel ID">
            <Input value={form.facebookPixelId} onChange={f('facebookPixelId')} placeholder="1234567890" />
          </Field>
          <Field label="Hotjar Site ID">
            <Input value={form.hotjarId} onChange={f('hotjarId')} placeholder="1234567" />
          </Field>
        </div>

        {/* ── Contact ── */}
        <SectionHead icon={Globe} label="Contact Details" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field label="Contact Email"><Input value={form.contactEmail} onChange={f('contactEmail')} placeholder="hello@x4tech.dev" /></Field>
          <Field label="WhatsApp Number"><Input value={form.whatsapp} onChange={f('whatsapp')} placeholder="+919999999999" /></Field>
        </div>
        <Field label="Address (optional)">
          <Input value={form.address} onChange={f('address')} placeholder="City, State, Country" />
        </Field>

        {/* ── Social ── */}
        <SectionHead icon={Share2} label="Social Media Profiles" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field label="LinkedIn"><Input value={form.linkedIn} onChange={f('linkedIn')} placeholder="https://linkedin.com/company/…" /></Field>
          <Field label="Twitter / X"><Input value={form.twitter} onChange={f('twitter')} placeholder="https://twitter.com/…" /></Field>
          <Field label="Instagram"><Input value={form.instagram} onChange={f('instagram')} placeholder="https://instagram.com/…" /></Field>
          <Field label="GitHub"><Input value={form.github} onChange={f('github')} placeholder="https://github.com/…" /></Field>
        </div>

        {/* Save */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--x4-border)' }}>
          <Btn type="submit" size="lg" disabled={saving}>
            <Save size={14} /> {saving ? 'Saving…' : 'Save All Settings'}
          </Btn>
        </div>
      </form>
    </div>
  );
}
