// Merek yang belum punya file di public/merek tampil sebagai teks.
const LOGO_TERSEDIA = new Set(['adidas', 'asics', 'new-balance', 'nike', 'puma']);

export function brandLogo(slug) {
  return LOGO_TERSEDIA.has(slug) ? `/merek/${slug}.webp` : null;
}
