export function toPlainText(input?: string | null) {
  if (!input) return null;
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
