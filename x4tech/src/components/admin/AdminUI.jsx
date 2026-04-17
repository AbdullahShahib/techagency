import React, { useState, useRef } from 'react';
import { X, Upload, Loader2, AlertTriangle } from 'lucide-react';
import { sanitizeImageUrl } from '../../lib/utils';

// ── Page header ─────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.2rem', letterSpacing: '0.05em', color: '#fff', lineHeight: 1 }}>{title}</h1>
        {subtitle && <p style={{ color: 'var(--x4-muted)', fontSize: '0.88rem', marginTop: '0.4rem' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Primary button ───────────────────────────────────────────
export function Btn({ children, onClick, variant = 'primary', size = 'md', disabled, type = 'button', style: ext }) {
  const sizes = { sm: '0.5rem 1rem', md: '0.7rem 1.5rem', lg: '0.9rem 2rem' };
  const bg = {
    primary: 'var(--x4-blue)', danger: 'rgba(255,0,60,0.15)',
    ghost: 'transparent', success: 'rgba(0,255,136,0.1)'
  };
  const bc = {
    primary: 'var(--x4-blue)', danger: 'rgba(255,0,60,0.4)',
    ghost: 'var(--x4-border)', success: 'rgba(0,255,136,0.3)'
  };
  const col = {
    primary: '#fff', danger: '#ff6b8a', ghost: 'var(--x4-muted)', success: '#00ff88'
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ padding: sizes[size], background: bg[variant], border: `1px solid ${bc[variant]}`, color: col[variant], fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', whiteSpace: 'nowrap', ...ext }}>
      {children}
    </button>
  );
}

// ── Form field wrapper ───────────────────────────────────────
export function Field({ label, required, children, hint }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {label && <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.3em', color: 'var(--x4-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
        {label}{required && <span style={{ color: 'var(--x4-accent)', marginLeft: '0.25rem' }}>*</span>}
      </label>}
      {children}
      {hint && <p style={{ fontSize: '0.75rem', color: 'var(--x4-muted)', marginTop: '0.35rem' }}>{hint}</p>}
    </div>
  );
}

// ── Input ────────────────────────────────────────────────────
export function Input({ value, onChange, placeholder, type = 'text', required, disabled, rows, style: ext }) {
  const s = {
    width: '100%', background: 'var(--x4-dark)', border: '1px solid var(--x4-border)',
    color: 'var(--x4-text)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
    padding: '0.7rem 1rem', outline: 'none', transition: 'border-color 0.2s',
    resize: rows ? 'vertical' : undefined, ...ext
  };
  if (rows) return <textarea value={value} onChange={onChange} placeholder={placeholder} required={required} disabled={disabled} rows={rows} style={s} onFocus={e => e.target.style.borderColor = 'var(--x4-blue)'} onBlur={e => e.target.style.borderColor = 'var(--x4-border)'} />;
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} disabled={disabled} style={s} onFocus={e => e.target.style.borderColor = 'var(--x4-blue)'} onBlur={e => e.target.style.borderColor = 'var(--x4-border)'} />;
}

// ── Select ───────────────────────────────────────────────────
export function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={onChange}
      style={{ width: '100%', background: 'var(--x4-dark)', border: '1px solid var(--x4-border)', color: value ? 'var(--x4-text)' : 'var(--x4-muted)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', padding: '0.7rem 1rem', outline: 'none', cursor: 'pointer' }}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.value ?? o} value={o.value ?? o} style={{ background: 'var(--x4-card)' }}>{o.label ?? o}</option>)}
    </select>
  );
}

// ── Toggle ───────────────────────────────────────────────────
export function Toggle({ value, onChange, label }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
      <div onClick={() => onChange(!value)}
        style={{ width: '44px', height: '24px', background: value ? 'var(--x4-blue)' : 'var(--x4-border)', borderRadius: '12px', position: 'relative', transition: 'background 0.3s', cursor: 'pointer', flexShrink: 0 }}>
        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: value ? '23px' : '3px', transition: 'left 0.3s' }} />
      </div>
      {label && <span style={{ fontSize: '0.88rem', color: 'var(--x4-text)' }}>{label}</span>}
    </label>
  );
}

// ── Tag input ────────────────────────────────────────────────
export function TagInput({ value = [], onChange, suggestions = [], placeholder = 'Add tag and press Enter...' }) {
  const [input, setInput] = useState('');
  const addTag = (tag) => {
    const t = tag.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setInput('');
  };
  return (
    <div style={{ border: '1px solid var(--x4-border)', background: 'var(--x4-dark)', padding: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', minHeight: '46px' }}>
      {value.map(tag => (
        <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', background: 'rgba(0,102,255,0.12)', border: '1px solid rgba(0,102,255,0.3)', color: 'var(--x4-cyan)', fontSize: '0.75rem', fontFamily: 'Space Mono, monospace' }}>
          {tag}
          <button type="button" onClick={() => onChange(value.filter(t => t !== tag))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, lineHeight: 1 }}>×</button>
        </span>
      ))}
      <input value={input} onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(input); } }}
        placeholder={placeholder}
        style={{ flex: 1, minWidth: '160px', background: 'none', border: 'none', outline: 'none', color: 'var(--x4-text)', fontSize: '0.88rem', fontFamily: 'DM Sans, sans-serif', padding: '0.2rem' }}
      />
      {suggestions.length > 0 && input && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--x4-card)', border: '1px solid var(--x4-border)', zIndex: 50 }}>
          {suggestions.filter(s => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s)).map(s => (
            <button key={s} type="button" onMouseDown={() => addTag(s)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem 1rem', background: 'none', border: 'none', color: 'var(--x4-text)', cursor: 'pointer', fontSize: '0.85rem' }}>{s}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Image upload field ───────────────────────────────────────
export function ImageUpload({ value, onChange, label = 'Upload Image', aspect }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();
  const safeValue = typeof value === 'string' ? sanitizeImageUrl(value) : '';

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => onChange({ file, preview: e.target.result });
    reader.readAsDataURL(file);
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => inputRef.current?.click()}
      style={{ border: `2px dashed ${dragging ? 'var(--x4-blue)' : 'var(--x4-border)'}`, background: dragging ? 'rgba(0,102,255,0.04)' : 'var(--x4-dark)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', transition: 'all 0.2s', minHeight: '120px', position: 'relative' }}>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
      {value?.preview || safeValue ? (
        <img src={value?.preview || safeValue} alt="" style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain' }} />
      ) : (
        <>
          <Upload size={22} color="var(--x4-muted)" />
          <p style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--x4-muted)' }}>{label}</p>
          <p style={{ fontSize: '0.7rem', color: 'var(--x4-border)' }}>PNG, JPG, WebP — drag or click</p>
        </>
      )}
    </div>
  );
}

// ── File upload (PDF etc.) ───────────────────────────────────
export function FileUpload({ onChange, accept = '.pdf', label = 'Upload File' }) {
  const inputRef = useRef();
  const [name, setName] = useState('');
  return (
    <div style={{ border: '1px solid var(--x4-border)', background: 'var(--x4-dark)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => inputRef.current?.click()}>
      <input ref={inputRef} type="file" accept={accept} style={{ display: 'none' }} onChange={e => { setName(e.target.files[0]?.name); onChange(e.target.files[0]); }} />
      <Upload size={16} color="var(--x4-muted)" />
      <span style={{ fontSize: '0.85rem', color: name ? 'var(--x4-text)' : 'var(--x4-muted)' }}>{name || label}</span>
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = '640px' }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
      <div style={{ background: 'var(--x4-dark)', border: '1px solid var(--x4-border)', width: '100%', maxWidth: width, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--x4-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.6rem', letterSpacing: '0.05em', color: '#fff' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--x4-muted)', padding: 0 }}><X size={18} /></button>
        </div>
        <div style={{ padding: '1.5rem' }}>{children}</div>
      </div>
    </div>
  );
}

// ── Confirm dialog ───────────────────────────────────────────
export function Confirm({ open, onClose, onConfirm, message = 'Are you sure?' }) {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title="Confirm Action" width="420px">
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <AlertTriangle size={20} color="#ff6b8a" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ color: 'var(--x4-text)', lineHeight: 1.6 }}>{message}</p>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn variant="danger" onClick={() => { onConfirm(); onClose(); }}>Delete</Btn>
      </div>
    </Modal>
  );
}

// ── Data table ───────────────────────────────────────────────
export function DataTable({ cols, rows, onEdit, onDelete, loading }) {
  return (
    <div style={{ border: '1px solid var(--x4-border)', overflow: 'hidden' }}>
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <Loader2 size={24} style={{ animation: 'spin 0.7s linear infinite', color: 'var(--x4-muted)' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--x4-card)', borderBottom: '1px solid var(--x4-border)' }}>
              {cols.map(c => (
                <th key={c.key} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.25em', color: 'var(--x4-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{c.label}</th>
              ))}
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.25em', color: 'var(--x4-muted)', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={cols.length + 1} style={{ padding: '3rem', textAlign: 'center', color: 'var(--x4-muted)', fontSize: '0.88rem' }}>No items yet. Create your first one →</td></tr>
            ) : rows.map((row, i) => (
              <tr key={row.id || i} style={{ borderBottom: '1px solid var(--x4-border)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                {cols.map(c => (
                  <td key={c.key} style={{ padding: '0.85rem 1rem', fontSize: '0.88rem', color: 'var(--x4-text)', maxWidth: c.maxWidth || 'auto', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: c.wrap ? 'normal' : 'nowrap' }}>
                    {c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}
                  </td>
                ))}
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                    {onEdit && <Btn size="sm" variant="ghost" onClick={() => onEdit(row)}>Edit</Btn>}
                    {onDelete && <Btn size="sm" variant="danger" onClick={() => onDelete(row)}>Del</Btn>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ── Stats card ───────────────────────────────────────────────
export function StatCard({ icon: Icon, label, value, color = 'var(--x4-blue)' }) {
  return (
    <div style={{ padding: '1.5rem', background: 'var(--x4-card)', border: '1px solid var(--x4-border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <div style={{ width: '48px', height: '48px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30`, background: `${color}10` }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', lineHeight: 1, color: '#fff' }}>{value}</div>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.2em', color: 'var(--x4-muted)', textTransform: 'uppercase', marginTop: '0.2rem' }}>{label}</div>
      </div>
    </div>
  );
}

// ── Toast notification ───────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };
  const ToastContainer = () => (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {toasts.map(t => (
        <div key={t.id} style={{ padding: '0.75rem 1.25rem', background: t.type === 'error' ? 'rgba(255,0,60,0.15)' : 'rgba(0,255,136,0.1)', border: `1px solid ${t.type === 'error' ? 'rgba(255,0,60,0.4)' : 'rgba(0,255,136,0.3)'}`, color: t.type === 'error' ? '#ff6b8a' : '#00ff88', fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.1em', maxWidth: '320px', animation: 'slideIn 0.3s ease' }}>
          {t.msg}
        </div>
      ))}
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </div>
  );
  return { toast: add, ToastContainer };
}
