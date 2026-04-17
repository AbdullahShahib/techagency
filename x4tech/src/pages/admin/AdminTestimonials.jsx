import React, { useState, useEffect } from 'react';
import { Plus, Star } from 'lucide-react';
import { getAll, create, update, remove, uploadFile, COLS } from '../../lib/firestore';
import { formatFirebaseError } from '../../lib/firebaseError';
import { sanitizeImageUrl } from '../../lib/utils';
import {
  PageHeader, Btn, Field, Input, Select, Toggle,
  ImageUpload, Modal, Confirm, DataTable, useToast
} from '../../components/admin/AdminUI';

const EMPTY = { clientName: '', role: '', company: '', quote: '', rating: 5, visible: true, avatarUrl: '', avatarFile: null };

export default function AdminTestimonials() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [form, setForm]       = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [saving, setSaving]   = useState(false);
  const { toast, ToastContainer } = useToast();

  const load = async () => { setLoading(true); setItems(await getAll(COLS.TESTIMONIALS)); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (item) => { setForm({ ...EMPTY, ...item, avatarFile: null }); setEditing(item.id); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      let avatarUrl = form.avatarUrl || '';
      if (form.avatarFile?.file) {
        avatarUrl = await uploadFile(`testimonials/${Date.now()}_${form.avatarFile.file.name}`, form.avatarFile.file);
      }
      const data = { ...form, avatarUrl, avatarFile: undefined };
      delete data.avatarFile;

      if (editing) { await update(COLS.TESTIMONIALS, editing, data); toast('Testimonial updated!'); }
      else          { await create(COLS.TESTIMONIALS, data);          toast('Testimonial added!'); }
      setModal(false); load();
    } catch (err) { toast(formatFirebaseError(err, 'Error saving testimonial'), 'error'); }
    setSaving(false);
  };

  const handleDelete = async () => {
    try { await remove(COLS.TESTIMONIALS, delTarget.id); toast('Deleted'); load(); }
    catch (err) { toast(formatFirebaseError(err, 'Error deleting testimonial'), 'error'); }
  };

  const f = (key) => (val) => setForm(p => ({ ...p, [key]: typeof val === 'object' && val?.target ? val.target.value : val }));

  const cols = [
    { key: 'avatarUrl', label: '', render: v => {
      const safe = sanitizeImageUrl(v);
      return safe
        ? <img src={safe} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
        : <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--x4-border)' }} />;
    } },
    { key: 'clientName', label: 'Name' },
    { key: 'role',       label: 'Role' },
    { key: 'company',    label: 'Company' },
    { key: 'rating',     label: '★',  render: v => '⭐'.repeat(v || 5) },
    { key: 'visible',    label: 'Visible', render: v => <span style={{ color: v ? '#00ff88' : 'var(--x4-muted)' }}>{v ? 'Yes' : 'No'}</span> },
  ];

  return (
    <div>
      <ToastContainer />
      <PageHeader title="Testimonials" subtitle="Client reviews and social proof" action={<Btn onClick={openNew}><Plus size={14} /> Add Testimonial</Btn>} />
      <DataTable cols={cols} rows={items} loading={loading} onEdit={openEdit} onDelete={setDelTarget} />

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Testimonial' : 'New Testimonial'} width="640px">
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Client Name" required>
              <Input value={form.clientName} onChange={f('clientName')} placeholder="Arjun Mehta" required />
            </Field>
            <Field label="Company">
              <Input value={form.company} onChange={f('company')} placeholder="NovaTrade" />
            </Field>
          </div>
          <Field label="Role">
            <Input value={form.role} onChange={f('role')} placeholder="CEO, NovaTrade" />
          </Field>
          <Field label="Testimonial Quote" required>
            <Input value={form.quote} onChange={f('quote')} rows={4} placeholder="What did this client say about working with X4Tech?" required />
          </Field>
          <Field label="Star Rating">
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setForm(p => ({ ...p, rating: n }))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', opacity: form.rating >= n ? 1 : 0.3, transition: 'opacity 0.2s' }}>
                  ⭐
                </button>
              ))}
              <span style={{ alignSelf: 'center', color: 'var(--x4-muted)', fontSize: '0.85rem', marginLeft: '0.25rem' }}>{form.rating}/5</span>
            </div>
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Client Photo" hint="Square image recommended">
              <ImageUpload value={form.avatarFile || form.avatarUrl} onChange={v => setForm(p => ({ ...p, avatarFile: v }))} label="Upload photo" />
            </Field>
            <Field label="Visibility">
              <div style={{ paddingTop: '0.5rem' }}><Toggle value={form.visible} onChange={f('visible')} label="Show on website" /></div>
            </Field>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => setModal(false)} type="button">Cancel</Btn>
            <Btn type="submit" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Testimonial'}</Btn>
          </div>
        </form>
      </Modal>

      <Confirm open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={handleDelete} message={`Delete testimonial from "${delTarget?.clientName}"?`} />
    </div>
  );
}
