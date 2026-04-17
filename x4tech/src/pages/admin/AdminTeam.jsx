import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { getAll, create, update, remove, uploadFile, COLS } from '../../lib/firestore';
import { sanitizeImageUrl } from '../../lib/utils';
import {
  PageHeader, Btn, Field, Input, Toggle,
  ImageUpload, FileUpload, Modal, Confirm, DataTable, useToast
} from '../../components/admin/AdminUI';

const EMPTY_MEMBER = {
  name: '',
  role: '',
  bio: '',
  linkedin: '',
  twitter: '',
  instagram: '',
  github: '',
  gmail: '',
  headshot: null,
  headshotUrl: '',
  visible: true,
  order: 0,
};
const EMPTY_JOB    = { title: '', department: '', type: 'Full-time', location: 'Remote', description: '', applyUrl: '', open: true };

export default function AdminTeam({ defaultTab = 'team' }) {
  const [members, setMembers]   = useState([]);
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState(EMPTY_MEMBER);
  const [editing, setEditing]   = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [saving, setSaving]     = useState(false);
  const [hiringBanner, setHiringBanner] = useState(false);
  const { toast, ToastContainer } = useToast();

  const isTeam = activeTab === 'team';

  const load = async () => {
    setLoading(true);
    const [m, j] = await Promise.all([getAll(COLS.TEAM), getAll(COLS.JOBS)]);
    setMembers(m); setJobs(j); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const EMPTY = isTeam ? EMPTY_MEMBER : EMPTY_JOB;
  const openNew  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (item) => { setForm({ ...EMPTY, ...item }); setEditing(item.id); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      let data = { ...form };
      if (isTeam && form.headshot?.file) {
        data.headshotUrl = await uploadFile(`team/${Date.now()}_${form.headshot.file.name}`, form.headshot.file);
      }
      if (isTeam) delete data.headshot;

      const col = isTeam ? COLS.TEAM : COLS.JOBS;
      if (editing) { await update(col, editing, data); toast('Updated!'); }
      else          { await create(col, data);          toast('Created!'); }
      setModal(false); load();
    } catch (err) { 
      if (import.meta.env.DEV) {
        console.error('Save error:', err);
      }
      toast(`Error: ${err.message || 'Failed to save'}`, 'error'); 
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    const col = isTeam ? COLS.TEAM : COLS.JOBS;
    try { await remove(col, delTarget.id); toast('Deleted'); load(); }
    catch (err) { 
      if (import.meta.env.DEV) {
        console.error('Delete error:', err);
      }
      toast(`Error: ${err.message || 'Failed to delete'}`, 'error'); 
    }
    setDelTarget(null);
  };

  const f = (key) => (val) => setForm(p => ({ ...p, [key]: typeof val === 'object' && val?.target ? val.target.value : val }));

  const memberCols = [
    { key: 'headshotUrl', label: '', render: v => {
      const safe = sanitizeImageUrl(v);
      return safe
        ? <img src={safe} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
        : <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--x4-border)' }} />;
    } },
    { key: 'name',   label: 'Name' },
    { key: 'role',   label: 'Role' },
    { key: 'order',  label: 'Order' },
    { key: 'visible',label: 'Visible', render: v => <span style={{ color: v ? '#00ff88' : 'var(--x4-muted)' }}>{v ? 'Yes' : 'No'}</span> },
  ];
  const jobCols = [
    { key: 'title',      label: 'Position' },
    { key: 'department', label: 'Dept' },
    { key: 'type',       label: 'Type' },
    { key: 'location',   label: 'Location' },
    { key: 'open',       label: 'Status', render: v => <span style={{ color: v ? '#00ff88' : 'var(--x4-muted)', fontFamily: 'Space Mono, monospace', fontSize: '0.65rem' }}>{v ? 'OPEN' : 'CLOSED'}</span> },
  ];

  return (
    <div>
      <ToastContainer />

      {/* Hiring banner toggle */}
      <div style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', background: 'var(--x4-card)', border: '1px solid var(--x4-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em', color: '#fff', textTransform: 'uppercase' }}>We're Hiring Banner</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--x4-muted)', marginTop: '0.2rem' }}>Show a "We're Hiring!" banner across the website</p>
        </div>
        <Toggle value={hiringBanner} onChange={setHiringBanner} label={hiringBanner ? 'Banner ON' : 'Banner OFF'} />
      </div>

      <PageHeader title="Team & Careers" subtitle="Manage team members and job openings"
        action={<Btn onClick={openNew}><Plus size={14} /> Add {isTeam ? 'Team Member' : 'Job Opening'}</Btn>} />

      <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', borderBottom: '1px solid var(--x4-border)' }}>
        {[['team', 'Team Members'], ['jobs', 'Job Openings']].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            style={{ padding: '0.65rem 1.5rem', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === key ? 'var(--x4-cyan)' : 'transparent'}`, color: activeTab === key ? 'var(--x4-cyan)' : 'var(--x4-muted)', fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}>
            {label} ({key === 'team' ? members.length : jobs.length})
          </button>
        ))}
      </div>

      <DataTable cols={isTeam ? memberCols : jobCols} rows={isTeam ? members : jobs} loading={loading} onEdit={openEdit} onDelete={setDelTarget} />

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit' : isTeam ? 'Add Team Member' : 'Add Job Opening'} width="640px">
        <form onSubmit={handleSave}>
          {isTeam ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Full Name" required><Input value={form.name} onChange={f('name')} placeholder="Riya Sharma" required /></Field>
                <Field label="Role / Title" required><Input value={form.role} onChange={f('role')} placeholder="Lead Designer" required /></Field>
              </div>
              <Field label="Bio">
                <Input value={form.bio} onChange={f('bio')} rows={3} placeholder="Short bio for the team page…" />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="LinkedIn URL"><Input value={form.linkedin} onChange={f('linkedin')} placeholder="https://linkedin.com/in/…" /></Field>
                <Field label="Twitter URL"><Input value={form.twitter} onChange={f('twitter')} placeholder="https://twitter.com/…" /></Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <Field label="Instagram URL"><Input value={form.instagram} onChange={f('instagram')} placeholder="https://instagram.com/…" /></Field>
                <Field label="GitHub URL"><Input value={form.github} onChange={f('github')} placeholder="https://github.com/…" /></Field>
                <Field label="Gmail"><Input value={form.gmail} onChange={f('gmail')} placeholder="name@gmail.com" /></Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Headshot Photo">
                  <ImageUpload value={form.headshot || form.headshotUrl} onChange={v => setForm(p => ({ ...p, headshot: v }))} label="Upload headshot" />
                </Field>
                <div>
                  <Field label="Display Order"><Input type="number" value={form.order} onChange={f('order')} placeholder="1" /></Field>
                  <Field label="Visible on Site"><Toggle value={form.visible} onChange={f('visible')} label="Show on team page" /></Field>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Job Title" required><Input value={form.title} onChange={f('title')} placeholder="Senior React Developer" required /></Field>
                <Field label="Department"><Input value={form.department} onChange={f('department')} placeholder="Engineering" /></Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <Field label="Type">
                  <select value={form.type} onChange={f('type')} style={{ width:'100%', background:'var(--x4-dark)', border:'1px solid var(--x4-border)', color:'var(--x4-text)', padding:'0.7rem 1rem', outline:'none' }}>
                    {['Full-time','Part-time','Contract','Internship'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Location"><Input value={form.location} onChange={f('location')} placeholder="Remote" /></Field>
                <Field label="Status"><Toggle value={form.open} onChange={f('open')} label="Position open" /></Field>
              </div>
              <Field label="Job Description" required>
                <Input value={form.description} onChange={f('description')} rows={5} placeholder="Responsibilities, requirements, nice-to-haves…" required />
              </Field>
              <Field label="Apply URL / Email">
                <Input value={form.applyUrl} onChange={f('applyUrl')} placeholder="https://forms.… or careers@x4tech.dev" />
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
