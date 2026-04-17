export function cn(...inputs: Array<string | undefined | null | false>) {
  return inputs.filter(Boolean).join(' ');
}

export function sanitizeImageUrl(value: unknown): string {
  if (typeof value !== 'string') return '';
  let url = value.trim();
  if (!url) return '';

  // Dev uploads can store absolute localhost URLs with a specific port.
  // Convert proxy paths to relative URLs so they remain valid across ports.
  try {
    const parsed = new URL(url);
    const isLocalHost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
    if (isLocalHost && parsed.pathname.startsWith('/api/supabase/')) {
      url = `${parsed.pathname}${parsed.search}`;
    }
  } catch (_) {
    // Not an absolute URL; continue validation below.
  }

  const lower = url.toLowerCase();
  if (lower.startsWith('data:') || lower.startsWith('blob:') || lower.startsWith('javascript:')) {
    return '';
  }

  if (url.startsWith('/') || lower.startsWith('http://') || lower.startsWith('https://')) {
    return url;
  }

  return '';
}
