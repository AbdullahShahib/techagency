export function cn(...inputs: Array<string | undefined | null | false>) {
  return inputs.filter(Boolean).join(' ');
}

export function sanitizeImageUrl(value: unknown): string {
  if (typeof value !== 'string') return '';
  const url = value.trim();
  if (!url) return '';

  const lower = url.toLowerCase();
  if (lower.startsWith('data:') || lower.startsWith('blob:') || lower.startsWith('javascript:')) {
    return '';
  }

  if (url.startsWith('/') || lower.startsWith('http://') || lower.startsWith('https://')) {
    return url;
  }

  return '';
}
