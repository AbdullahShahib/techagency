import { supabase, MEDIA_BUCKET } from './supabase';

function inflateRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    ...(row.data || {}),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// ─── Generic CRUD ───────────────────────────────────────────
export async function getAll(col) {
  let query = supabase.from(col).select('*').order('createdAt', { ascending: false });
  let { data, error } = await query;

  // Fallback if table does not have createdAt yet.
  if (error) {
    const fallback = await supabase.from(col).select('*');
    data = fallback.data;
    error = fallback.error;
  }

  if (error) throw error;
  return (data || []).map(inflateRow);
}

export async function getOne(col, id) {
  const { data, error } = await supabase
    .from(col)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return inflateRow(data);
}

export async function create(col, data) {
  const payload = { ...data };

  // Keep singleton records stable for settings-style tables.
  if ((col === COLS.SEO || col === COLS.SETTINGS) && !payload.id) {
    payload.id = 'global';
  }

  const row = {
    ...(payload.id ? { id: payload.id } : {}),
    data: payload,
  };

  const { data: inserted, error } = await supabase
    .from(col)
    .insert(row)
    .select('*')
    .single();

  if (error) throw error;
  return inflateRow(inserted);
}

export async function update(col, id, data) {
  const row = { data };

  const { data: updated, error } = await supabase
    .from(col)
    .update(row)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return inflateRow(updated);
}

export async function remove(col, id) {
  const { error } = await supabase
    .from(col)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ─── Storage Upload ─────────────────────────────────────────
export async function uploadFile(path, file, onProgress) {
  if (onProgress) onProgress(10);

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  let publicUrl = data.publicUrl;
  try {
    const parsed = new URL(publicUrl);
    const isLocalHost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
    if (isLocalHost && parsed.pathname.startsWith('/api/supabase/')) {
      publicUrl = `${parsed.pathname}${parsed.search}`;
    }
  } catch (_) {
    // Keep original public URL when parsing fails.
  }

  if (onProgress) onProgress(100);
  return publicUrl;
}

export async function deleteFile(url) {
  try {
    const marker = `/object/public/${MEDIA_BUCKET}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return;

    const objectPath = url.slice(idx + marker.length).split('?')[0];
    if (!objectPath) return;

    await supabase.storage.from(MEDIA_BUCKET).remove([objectPath]);
  } catch (_) { /* already deleted or wrong url */ }
}

// ─── Collections ────────────────────────────────────────────
export const COLS = {
  PROJECTS:     'projects',
  SERVICES:     'services',
  TESTIMONIALS: 'testimonials',
  CLIENTS:      'clients',
  TEAM:         'team',
  BLOG:         'blog',
  SEO:          'seo',
  CASE_STUDIES: 'case_studies',
  JOBS:         'jobs',
  SETTINGS:     'settings',
};
