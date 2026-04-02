import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Plus } from 'lucide-react';
import { getAll, create, update, remove, uploadFile, COLS } from '../../lib/firestore';
import {
  PageHeader, Btn, Field, Input, Select, Toggle, TagInput,
  ImageUpload, Modal, Confirm, DataTable, useToast
} from '../../components/admin/AdminUI';

// Lazy load rich text editor
const ReactQuill = lazy(() => import('react-quill'));

const EMPTY = {
  title: '', slug: '', category: 'Insights', status: 'Draft',
  excerpt: '', body: '', coverImage: null, coverImageUrl: '',
  tags: [], seoTitle: '', seoDesc: '', featured: false, publishedAt: ''
};

const CATEGORIES = ['Insights','Tutorial','Case Study','News','Behind the Scenes'];
const STATUSES   = ['Draft','Published','Scheduled'];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminBlog() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [form, setForm]       = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [saving, setSaving]   = useState(false);
  const { toast, ToastContainer } = useToast();

  const load = async () => { setLoading(true); setItems(await getAll(COLS.BLOG)); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (item) => { setForm({ ...EMPTY, ...item }); setEditing(item.id); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      let data = { ...form };
      if (form.coverImage?.file) {
        data.coverImageUrl = await uploadFile(`blog/${Date.now()}_${form.coverImage.file.name}`, form.coverImage.file);
      }
      delete data.coverImage;
      if (!data.slug) data.slug = slugify(data.title);

      if (editing) { await update(COLS.BLOG, editing, data); toast('Post updated!'); }
      else          { await create(COLS.BLOG, data);          toast('Post created!'); }
      setModal(false); load();
    } catch (_) { toast('Error saving', 'error'); }
    setSaving(false);
  };

  const handleDelete = async () => {
    try { await remove(COLS.BLOG, delTarget.id); toast('Post deleted'); load(); }
    catch (_) { toast('Error', 'error'); }
  };

  const f = (key) => (val) => setForm(p => ({ ...p, [key]: typeof val === 'object' && val?.target ? val.target.value : val }));

  const cols = [
    { key: 'coverImageUrl', label: '', render: v => v ? <img src={v} alt="" style={{ width: '52px', height: '36px', objectFit: 'cover', border: '1px solid var(--x4-border)' }} /> : '—' },
    { key: 'title',    label: 'Title', maxWidth: '240px' },
    { key: 'category', label: 'Category' },
    { key: 'status',   label: 'Status', render: v => <span style={{ padding: '0.2rem 0.6rem', background: v === 'Published' ? 'rgba(0,255,136,0.1)' : v === 'Draft' ? 'rgba(255,255,255,0.05)' : 'rgba(0,102,255,0.1)', color: v === 'Published' ? '#00ff88' : v === 'Draft' ? 'var(--x4-muted)' : 'var(--x4-cyan)', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{v}</span> },
    { key: 'featured', label: '★', render: v => v ? '⭐' : '—' },
  ];

  return (
    <div>
      <ToastContainer />
      <PageHeader title="Blog / Insights" subtitle="Publish thought leadership content" action={<Btn onClick={openNew}><Plus size={14} /> New Post</Btn>} />
      <DataTable cols={cols} rows={items} loading={loading} onEdit={openEdit} onDelete={setDelTarget} />

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Post' : 'New Blog Post'} width="900px">
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
            <Field label="Post Title" required>
              <Input value={form.title} onChange={e => { f('title')(e); setForm(p => ({ ...p, slug: slugify(e.target.value) })); }} placeholder="10 Web Design Trends for 2025" required />
            </Field>
            <Field label="Category">
              <Select value={form.category} onChange={f('category')} options={CATEGORIES} />
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={f('status')} options={STATUSES} />
            </Field>
          </div>

          <Field label="URL Slug" hint="Auto-generated from title">
            <Input value={form.slug} onChange={f('slug')} placeholder="10-web-design-trends-2025" />
          </Field>

          <Field label="Excerpt" hint="Short summary shown in blog listings">
            <Input value={form.excerpt} onChange={f('excerpt')} rows={2} placeholder="A brief 1-2 sentence summary of the post…" />
          </Field>

          <Field label="Cover Image">
            <ImageUpload value={form.coverImage || form.coverImageUrl} onChange={v => setForm(p => ({ ...p, coverImage: v }))} label="Upload cover image" />
          </Field>

          <Field label="Post Content">
            <div style={{ background: '#fff', color: '#000' }}>
              <Suspense fallback={<div style={{ padding: '1rem', color: 'var(--x4-muted)', background: 'var(--x4-dark)' }}>Loading editor…</div>}>
                <ReactQuill
                  theme="snow"
                  value={form.body}
                  onChange={val => setForm(p => ({ ...p, body: val }))}
                  placeholder="Write your blog post here…"
                  style={{ minHeight: '300px' }}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      ['blockquote', 'code-block'],
                      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                      ['link', 'image'],
                      ['clean']
                    ]
                  }}
                />
              </Suspense>
            </div>
          </Field>

          <Field label="Tags">
            <TagInput value={form.tags} onChange={f('tags')} placeholder="Add a tag and press Enter…" />
          </Field>

          <div style={{ height: '1px', background: 'var(--x4-border)', margin: '1.25rem 0' }} />
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--x4-cyan)', textTransform: 'uppercase', marginBottom: '1rem' }}>SEO Settings</p>

          <Field label="SEO Title" hint="Overrides the post title in search results">
            <Input value={form.seoTitle} onChange={f('seoTitle')} placeholder="Leave blank to use post title" />
          </Field>
          <Field label="Meta Description" hint="Max 160 characters">
            <Input value={form.seoDesc} onChange={f('seoDesc')} rows={2} placeholder="What will appear in Google search results…" />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Publish Date">
              <Input type="datetime-local" value={form.publishedAt} onChange={f('publishedAt')} />
            </Field>
            <Field label="Featured Post">
              <div style={{ paddingTop: '0.5rem' }}><Toggle value={form.featured} onChange={f('featured')} label="Show as featured" /></div>
            </Field>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Btn variant="ghost" onClick={() => setModal(false)} type="button">Cancel</Btn>
            <Btn variant="ghost" onClick={() => { setForm(p => ({ ...p, status: 'Draft' })); }} type="button">Save Draft</Btn>
            <Btn type="submit" disabled={saving}>{saving ? 'Saving…' : editing ? 'Update Post' : 'Publish Post'}</Btn>
          </div>
        </form>
      </Modal>

      <Confirm open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={handleDelete} message={`Delete "${delTarget?.title}"? This is permanent.`} />
    </div>
  );
}
