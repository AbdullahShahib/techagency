import React, { useState, useEffect } from 'react';
import { Plus, ExternalLink, Image } from 'lucide-react';
import { getAll, create, update, remove, uploadFile, COLS } from '../../lib/firestore';
import { formatFirebaseError } from '../../lib/firebaseError';
import { sanitizeImageUrl } from '../../lib/utils';
import {
  PageHeader, Btn, Field, Input, Select, Toggle, TagInput,
  ImageUpload, Modal, Confirm, DataTable, useToast
} from '../../components/admin/AdminUI';

const TECH_SUGGESTIONS = [
  'React','Next.js','Vue','Angular','Node.js','Express','NestJS','Python','Django',
  'FastAPI','PostgreSQL','MongoDB','Firebase','Supabase','AWS','GCP','Docker',
  'Tailwind CSS','TypeScript','GraphQL','REST API','React Native','Flutter','Figma',
  'Three.js','GSAP','Framer Motion','Shopify','WordPress','Webflow','Stripe'
];

const CATEGORIES = ['Web Development','Mobile App','UI/UX Design','Brand Identity','E-Commerce','Poster Design','Full Stack'];
const STATUSES    = ['Live','In Progress','Case Study','Archived'];

const EMPTY = {
  title: '', category: '', status: 'Live', shortDesc: '', problem: '', solution: '',
  techStack: [], liveUrl: '', appStoreUrl: '', playStoreUrl: '', featured: false,
  images: [], coverImage: null
};

export default function AdminProjects() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState(EMPTY);
  const [editing, setEditing]   = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [saving, setSaving]     = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast, ToastContainer } = useToast();

  const load = async () => { setLoading(true); setItems(await getAll(COLS.PROJECTS)); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (item) => { setForm({ ...EMPTY, ...item, coverImage: item.coverImageUrl || null }); setEditing(item.id); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let coverImageUrl = typeof form.coverImage === 'string' ? form.coverImage : '';

      // Upload cover image if new file selected
      if (form.coverImage?.file) {
        setUploadProgress(0);
        coverImageUrl = await uploadFile(
          `projects/${Date.now()}_cover_${form.coverImage.file.name}`,
          form.coverImage.file,
          setUploadProgress
        );
      }

      const data = { ...form, coverImageUrl, coverImage: undefined };
      delete data.coverImage;

      if (editing) { await update(COLS.PROJECTS, editing, data); toast('Project updated!'); }
      else          { await create(COLS.PROJECTS, data);          toast('Project created!'); }
      setModal(false); load();
    } catch (err) { toast(formatFirebaseError(err, 'Error saving project'), 'error'); }
    setSaving(false); setUploadProgress(0);
  };

  const handleDelete = async () => {
    try { await remove(COLS.PROJECTS, delTarget.id); toast('Project deleted'); load(); }
    catch (err) { toast(formatFirebaseError(err, 'Error deleting project'), 'error'); }
  };

  const f = (key) => (val) => setForm(p => ({ ...p, [key]: typeof val === 'object' && val?.target ? val.target.value : val }));

  const cols = [
    { key: 'coverImageUrl', label: '', render: v => {
      const safe = sanitizeImageUrl(v);
      return safe
        ? <img src={safe} alt="" style={{ width: '48px', height: '36px', objectFit: 'cover', border: '1px solid var(--x4-border)' }} />
        : <div style={{ width: '48px', height: '36px', background: 'var(--x4-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Image size={14} color="var(--x4-muted)" /></div>;
    } },
    { key: 'title',    label: 'Title',    maxWidth: '200px' },
    { key: 'category', label: 'Category' },
    { key: 'status',   label: 'Status',   render: v => <span style={{ padding: '0.2rem 0.6rem', background: v === 'Live' ? 'rgba(0,255,136,0.1)' : 'rgba(0,102,255,0.1)', color: v === 'Live' ? '#00ff88' : 'var(--x4-cyan)', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{v}</span> },
    { key: 'techStack', label: 'Tech', render: v => (v || []).slice(0,3).join(', ') + ((v?.length > 3) ? '…' : '') },
    { key: 'featured', label: 'Featured', render: v => v ? '⭐' : '—' },
  ];

  return (
    <div>
      <ToastContainer />
      <PageHeader
        title="Projects"
        subtitle={`${items.length} projects in portfolio`}
        action={<Btn onClick={openNew}><Plus size={14} /> New Project</Btn>}
      />

      <DataTable cols={cols} rows={items} loading={loading} onEdit={openEdit} onDelete={setDelTarget} />

      {/* Form Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Project' : 'New Project'} width="780px">
        <form onSubmit={handleSave}>
          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Project Title" required>
              <Input value={form.title} onChange={f('title')} placeholder="FinFlow Dashboard" required />
            </Field>
            <Field label="Category" required>
              <Select value={form.category} onChange={f('category')} options={CATEGORIES} placeholder="Select category…" />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Status">
              <Select value={form.status} onChange={f('status')} options={STATUSES} />
            </Field>
            <Field label="Featured on Home">
              <div style={{ paddingTop: '0.5rem' }}>
                <Toggle value={form.featured} onChange={f('featured')} label="Show in featured projects" />
              </div>
            </Field>
          </div>

          <Field label="Short Description" required>
            <Input value={form.shortDesc} onChange={f('shortDesc')} placeholder="One-line overview for the portfolio card…" required />
          </Field>

          <Field label="The Problem" hint="What challenge did the client face?">
            <Input value={form.problem} onChange={f('problem')} rows={3} placeholder="Describe the client's pain points and challenges…" />
          </Field>

          <Field label="Our Solution" hint="How did X4Tech solve it?">
            <Input value={form.solution} onChange={f('solution')} rows={3} placeholder="Describe the approach, process, and outcome…" />
          </Field>

          <Field label="Tech Stack" hint="Press Enter after each tag">
            <TagInput value={form.techStack} onChange={f('techStack')} suggestions={TECH_SUGGESTIONS} placeholder="Type a technology and press Enter…" />
          </Field>

          {/* URLs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <Field label="Live URL">
              <Input value={form.liveUrl} onChange={f('liveUrl')} placeholder="https://…" />
            </Field>
            <Field label="App Store URL">
              <Input value={form.appStoreUrl} onChange={f('appStoreUrl')} placeholder="https://apps.apple.com/…" />
            </Field>
            <Field label="Play Store URL">
              <Input value={form.playStoreUrl} onChange={f('playStoreUrl')} placeholder="https://play.google.com/…" />
            </Field>
          </div>

          {/* Cover image */}
          <Field label="Cover Image" hint="Recommended: 1200×800px, JPG or PNG">
            <ImageUpload value={form.coverImage} onChange={f('coverImage')} label="Upload cover image" />
          </Field>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ height: '4px', background: 'var(--x4-border)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${uploadProgress}%`, background: 'var(--x4-cyan)', transition: 'width 0.3s' }} />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--x4-muted)', marginTop: '0.4rem' }}>Uploading… {uploadProgress}%</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
            <Btn variant="ghost" onClick={() => setModal(false)} type="button">Cancel</Btn>
            <Btn type="submit" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Project'}</Btn>
          </div>
        </form>
      </Modal>

      <Confirm
        open={!!delTarget} onClose={() => setDelTarget(null)}
        onConfirm={handleDelete}
        message={`Delete "${delTarget?.title}"? This cannot be undone.`}
      />
    </div>
  );
}
