import crypto from 'crypto';

export function hashItem(domain: string, title: string, snippet?: string | null) {
  const normalized = `${domain.toLowerCase()}|${title.trim().toLowerCase()}|${(snippet ?? '').trim().toLowerCase().slice(0, 200)}`;
  return crypto.createHash('sha256').update(normalized).digest('hex');
}
