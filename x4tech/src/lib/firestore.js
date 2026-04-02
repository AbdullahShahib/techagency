import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject
} from 'firebase/storage';
import { db, storage } from './firebase';

// ─── Generic CRUD ───────────────────────────────────────────
export async function getAll(col) {
  const q = query(collection(db, col), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getOne(col, id) {
  const snap = await getDoc(doc(db, col, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function create(col, data) {
  return addDoc(collection(db, col), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function update(col, id, data) {
  return updateDoc(doc(db, col, id), { ...data, updatedAt: serverTimestamp() });
}

export async function remove(col, id) {
  return deleteDoc(doc(db, col, id));
}

// ─── Storage Upload ─────────────────────────────────────────
export function uploadFile(path, file, onProgress) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);
    task.on('state_changed',
      snap => onProgress && onProgress(Math.round(snap.bytesTransferred / snap.totalBytes * 100)),
      reject,
      async () => resolve(await getDownloadURL(task.snapshot.ref))
    );
  });
}

export async function deleteFile(url) {
  try {
    await deleteObject(ref(storage, url));
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
