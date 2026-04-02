import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { getAll, create, update, remove, COLS } from '../../lib/firestore';
import {
  PageHeader, Btn, Field, Input, Select, Toggle, TagInput,
  Modal, Confirm, DataTable, useToast
} from '../../components/admin/AdminUI';

const ICONS = ['Monitor','Smartphone','Palette','Megaphone','Code2','Layers','Globe','Zap','ShoppingBag','Camera','PenTool','BarChart'];

const EMPTY = {
  title: '', icon: 'Monitor', shortDesc: '', longDesc: '',
  tags: [], order: 0, visible: true,
  pricingEnabled: false,
  tiers: [
    { name: 'Starter',  price: '', features: '' },
    { name: 'Growth',   price: '', features: '' },
    { name: 'Premium',  price: '', features: '' },
  ]
};

export default function AdminServices() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState(EMPTY);
  const [editing, setEditing]   = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [saving, setSaving]     = useState(false);
  const { toast, ToastContainer } = useToast();

  const load = async () => { setLoading(true); setItems(await getAll(COLS.SERVICES)); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (item) => { setForm({ ...EMPTY, ...item }); setEditing(item.id); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await update(COLS.SERVICES, editing, form); toast('Service updated!'); }
      else          { await create(COLS.SERVICES, form);          toast('Service created!'); }
      setModal(false); load();
    } catch (_) { toast('Error saving', 'error'); }
    setSaving(false);
  };

  const handleDelete = async () => {
    try { await remove(COLS.SERVICES, delTarget.id); toast('Service deleted'); load(); }
    catch (_) { toast('Error deleting', 'error'); }
  };

  const f = (key) => (val) => setForm(p => ({ ...p, [key]: typeof val === 'object' && val?.target ? val.target.value : val }));
  const fTier = (i, key) => (e) => setForm(p => {
    const tiers = [...p.tiers];
    tiers[i] = { ...tiers[i], [key]: e.target.value };
    return { ...p, tiers };
  });

  const cols = [
    { key: 'icon',     label: 'Icon',    render: v => <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', color: 'var(--x4-cyan)' }}>{v}</span> },
    { key: 'title',    label: 'Service' },
    { key: 'shortDesc',label: 'Desc',    maxWidth: '260px', wrap: true },
    { key: 'visible',  label: 'Visible', render: v => <span style={{ color: v ? '#00ff88' : 'var(--x4-muted)' }}>{v ? 'Yes' : 'Hidden'}</span> },
    { key: 'pricingEnabled', label: 'Pricing', render: v => v ? '✓' : '—' },
  ];

  return (
    <div>
      <ToastContainer />
      <PageHeader title="Services" subtitle="Manage your service offerings" action={<Btn onClick={openNew}><Plus size={14} /> New Service</Btn>} />
      <DataTable cols={cols} rows={items} loading={loading} onEdit={openEdit} onDelete={setDelTarget} />

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Service' : 'New Service'} width="680px">
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Service Title" required>
              <Input value={form.title} onChange={f('title')} placeholder="Web Development" required />
            </Field>
            <Field label="Icon Name" hint="Lucide icon name">
              <Select value={form.icon} onChange={f('icon')} options={ICONS} />
            </Field>
          </div>

          <Field label="Short Description" required>
            <Input value={form.shortDesc} onChange={f('shortDesc')} placeholder="One-line description for the service card…" required />
          </Field>

          <Field label="Long Description">
            <Input value={form.longDesc} onChange={f('longDesc')} rows={4} placeholder="Detailed description shown on the services page…" />
          </Field>

          <Field label="Tags / Technologies">
            <TagInput value={form.tags} onChange={f('tags')} placeholder="Add a tag and press Enter…" />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <Field label="Display Order">
              <Input type="number" value={form.order} onChange={f('order')} placeholder="1" />
            </Field>
            <Field label="Visible on Site">
              <div style={{ paddingTop: '0.5rem' }}><Toggle value={form.visible} onChange={f('visible')} label="Show on site" /></div>
            </Field>
            <Field label="Enable Pricing">
              <div style={{ paddingTop: '0.5rem' }}><Toggle value={form.pricingEnabled} onChange={f('pricingEnabled')} label="Show pricing" /></div>
            </Field>
          </div>

          {form.pricingEnabled && (
            <div>
              <div style={{ height: '1px', background: 'var(--x4-border)', margin: '1rem 0' }} />
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--x4-cyan)', textTransform: 'uppercase', marginBottom: '1rem' }}>Pricing Tiers</p>
              {form.tiers.map((tier, i) => (
                <div key={i} style={{ padding: '1rem', border: '1px solid var(--x4-border)', marginBottom: '0.75rem', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.2em', color: 'var(--x4-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{tier.name}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                    <Field label="Price">
                      <Input value={tier.price} onChange={fTier(i, 'price')} placeholder="₹15,000" />
                    </Field>
                    <Field label="Features (comma-separated)">
                      <Input value={tier.features} onChange={fTier(i, 'features')} placeholder="5 pages, Responsive, SEO basic, 2 revisions" />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => setModal(false)} type="button">Cancel</Btn>
            <Btn type="submit" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Service'}</Btn>
          </div>
        </form>
      </Modal>

      <Confirm open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={handleDelete} message={`Delete "${delTarget?.title}"?`} />
    </div>
  );
}
