// Central place for platform metadata: word limit, display label, accent color.
export const PLATFORMS = {
  Twitter: { label: 'X / Twitter', limit: 50, icon: '𝕏', color: '#1da1f2' },
  Instagram: { label: 'Instagram', limit: 100, icon: '◎', color: '#e1306c' },
  Facebook: { label: 'Facebook', limit: 200, icon: 'f', color: '#1877f2' },
};

export const PLATFORM_KEYS = Object.keys(PLATFORMS);

export function countWords(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
