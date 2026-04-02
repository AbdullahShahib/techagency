import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { getAll, create, update, remove, uploadFile, COLS } from '../../lib/firestore';
import {
  PageHeader, Btn, Field, Input, Toggle,
  ImageUpload, FileUpload, Modal, Confirm, DataTable, useToast
} from '../../components/admin/AdminUI';

const EMPTY_CLIENT = { name: '', logoFile: null, logoUrl: '', website: '', visible: true };
const EMPTY_CASE   = { title: '', clientName: '', summary: '', pdfFile: null, pdfUrl: '', visible: true };

export default function AdminClients() {
  const [clients, setClients]   = useState([]);
  const [cases, setCases]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('logos');
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState(EMPTY_CLIENT);
  const [editing, setEditing]   = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [saving, setSaving]     = useState(false);
  const { toast, ToastContainer } = useToast();

  const load = async () => {
    setLoading(true);
    const [c, cs] = await Promise.all([getAll(COLS.CLIENTS), getAll(COLS.CASE_STUDIES)]);
    setClients(c); setCases(cs); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const isLogos = activeTab === 'logos';
  const items   = isLogos ? clients : cases;
  const EMPTY   = isLogos ? EMPTY_CLIENT : EMPTY_CASE;

  const openNew  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (item) => { setForm({ ...EMPTY, ...item }); setEditing(item.id); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      let data = { ...form };
      if (isLogos && form.logoFile?.file) {
        data.logoUrl = await uploadFile(`clients/${Date.now()}_${form.logoFile.file.name}`, form.logoFile.file);
      }
      if (!isLogos && form.pdfFile) {
        data.pdfUrl = await uploadFile(`case-studies/${Date.now()}_${form.pdfFile.name}`, form.pdfFile);
      }
      delete data.logoFile; delete data.pdfFile;

      const col = isLogos ? COLS.CLIENTS : COLS.CASE_STUDIES;
      if (editing) { await update(col, editing, data); toast('Updated!'); }
      else          { await create(col, data);          toast('Created!'); }
      setModal(false); load();
    } catch (_) { toast('Error', 'error'); }
    setSaving(false);
  };

  const handleDelete = async () => {
    const col = isLogos ? COLS.CLIENTS : COLS.CASE_STUDIES;
    try { await remove(col, delTarget.id); toast('Deleted'); load(); }
    catch (_) { toast('Error', 'error'); }
  };

  const f = (key) => (val) => setForm(p => ({ ...p, [key]: typeof val === 'object' && val?.target ? val.target.value : val }));

  const logoCols = [
    { key: 'logoUrl', label: '', render: v => v ? <img src={v} alt="" style={{ height: '28px', maxWidth: '80px', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.7 }} /> : '—' },
    { key: 'name', label: 'Company' },
    { key: 'website', label: 'Website' },
    { key: 'visible', label: 'Visible', render: v => <span style={{ color: v ? '#00ff88' : 'var(--x4-muted)' }}>{v ? 'Yes' : 'No'}</span> },
  ];
  const caseCols = [
    { key: 'title', label: 'Title' },
    { key: 'clientName', label: 'Client' },
    { key: 'summary', label: 'Summary', maxWidth: '220px', wrap: true },
    { key: 'pdfUrl', label: 'PDF', render: v => v ? <a href={v} target="_blank" rel="noreferrer" style={{ color: 'var(--x4-cyan)', fontSize: '0.78rem' }}>Download ↗</a> : '—' },
  ];

  return (
    <div>
      <ToastContainer />
      <PageHeader title="Clients & Case Studies" subtitle="Manage client logos and case study downloads"
        action={<Btn onClick={openNew}><Plus size={14} /> Add {isLogos ? 'Client Logo' : 'Case Study'}</Btn>} />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', borderBottom: '1px solid var(--x4-border)' }}>
        {[['logos', 'Client Logos'], ['cases', 'Case Studies']].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            style={{ padding: '0.65rem 1.5rem', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === key ? 'var(--x4-cyan)' : 'transparent'}`, color: activeTab === key ? 'var(--x4-cyan)' : 'var(--x4-muted)', fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}>
            {label} ({key === 'logos' ? clients.length : cases.length})
          </button>
        ))}
      </div>

      <DataTable cols={isLogos ? logoCols : caseCols} rows={items} loading={loading} onEdit={openEdit} onDelete={setDelTarget} />

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? `Edit ${isLogos ? 'Client' : 'Case Study'}` : `New ${isLogos ? 'Client Logo' : 'Case Study'}`} width="560px">
        <form onSubmit={handleSave}>
          {isLogos ? (
            <>
              <Field label="Company Name" required>
                <Input value={form.name} onChange={f('name')} placeholder="Acme Corp" required />
              </Field>
              <Field label="Website URL">
                <Input value={form.website} onChange={f('website')} placeholder="https://acme.com" />
              </Field>
              <Field label="Company Logo" hint="White or dark logo on transparent PNG works best">
                <ImageUpload value={form.logoFile || form.logoUrl} onChange={v => setForm(p => ({ ...p, logoFile: v }))} label="Upload logo (PNG, SVG)" />
              </Field>
              <Field label="Visibility">
                <Toggle value={form.visible} onChange={f('visible')} label="Show in 'Trusted By' section" />
              </Field>
            </>
          ) : (
            <>
              <Field label="Case Study Title" required>
                <Input value={form.title} onChange={f('title')} placeholder="How we built FinFlow in 6 weeks" required />
              </Field>
              <Field label="Client Name">
                <Input value={form.clientName} onChange={f('clientName')} placeholder="FinFlow Inc." />
              </Field>
              <Field label="Summary">
                <Input value={form.summary} onChange={f('summary')} rows={3} placeholder="Brief description of the project for high-value leads…" />
              </Field>
              <Field label="PDF Upload" hint="Upload the full case study as a PDF">
                {form.pdfUrl && !form.pdfFile && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--x4-cyan)', marginBottom: '0.5rem' }}>Current: <a href={form.pdfUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>View PDF ↗</a></p>
                )}
                <FileUpload onChange={f('pdfFile')} accept=".pdf" label="Upload case study PDF…" />
              </Field>
              <Field label="Visibility">
                <Toggle value={form.visible} onChange={f('visible')} label="Show as downloadable case study" />
              </Field>
            </>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Btn variant="ghost" onClick={() => setModal(false)} type="button">Cancel</Btn>
            <Btn type="submit" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add'}</Btn>
          </div>
        </form>
      </Modal>

      <Confirm open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={handleDelete} message={`Delete "${delTarget?.name || delTarget?.title}"?`} />
    </div>
  );
}
