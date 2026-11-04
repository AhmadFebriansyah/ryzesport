export const SEGMENT_LABELS = { PRIA: 'Pria', WANITA: 'Wanita', ANAK: 'Anak' };

export const SEGMENTS = [
  { label: 'Pria', params: { segmen: 'pria' } },
  { label: 'Wanita', params: { segmen: 'wanita' } },
  { label: 'Anak', params: { segmen: 'anak' } },
  { label: 'Trending', params: { trending: '1' } },
];

export function productsPath(params = {}) {
  const query = new URLSearchParams(params).toString();
  return query ? `/produk?${query}` : '/produk';
}
