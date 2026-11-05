import { formatRupiah } from './format.js';
import { SEGMENT_LABELS } from './segments.js';

export const HARGA_STEP = 50000;

// Warna dasar. "Biru Navy" ikut Biru, "Putih Marun" ikut Putih dan Marun.
export const WARNA_FILTER = [
  { value: 'hitam', label: 'Hitam', hex: '#111111' },
  { value: 'putih', label: 'Putih', hex: '#ffffff' },
  { value: 'abu-abu', label: 'Abu-abu', hex: '#9ca3af' },
  { value: 'merah', label: 'Merah', hex: '#dc2626' },
  { value: 'marun', label: 'Marun', hex: '#7b1e3a' },
  { value: 'biru', label: 'Biru', hex: '#1d4ed8' },
  { value: 'hijau', label: 'Hijau', hex: '#15803d' },
];

export const URUTAN_OPSI = [
  { value: '', label: 'Rekomendasi' },
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'harga_terendah', label: 'Harga terendah' },
  { value: 'harga_tertinggi', label: 'Harga tertinggi' },
];

export function getList(searchParams, key) {
  return (searchParams.get(key) ?? '').split(',').filter(Boolean);
}

export function toggleValue(searchParams, key, value) {
  const list = getList(searchParams, key);
  const updated = list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
  return withParams(searchParams, { [key]: updated.join(',') });
}

// Nilai kosong atau null menghapus parameter dari URL.
export function withParams(searchParams, changes) {
  const next = new URLSearchParams(searchParams);
  Object.entries(changes).forEach(([key, value]) => {
    if (value === null || value === '') next.delete(key);
    else next.set(key, value);
  });
  return next;
}

function labelHarga(hargaMin, hargaMax) {
  if (hargaMin && hargaMax) return `${formatRupiah(hargaMin)} - ${formatRupiah(hargaMax)}`;
  return hargaMin ? `Mulai ${formatRupiah(hargaMin)}` : `Sampai ${formatRupiah(hargaMax)}`;
}

// Daftar filter aktif untuk ditampilkan sebagai tag. `next` berisi URL setelah tag dihapus.
export function activeTags(searchParams, { brands, categories }) {
  const dariList = (key, getLabel) =>
    getList(searchParams, key).map((value) => ({
      id: `${key}-${value}`,
      label: getLabel(value),
      next: toggleValue(searchParams, key, value),
    }));

  const tags = [
    ...dariList('segmen', (value) => SEGMENT_LABELS[value.toUpperCase()] ?? value),
    ...dariList('trending', () => 'Trending'),
    ...dariList('merek', (value) => brands?.find((brand) => brand.slug === value)?.nama ?? value),
    ...dariList('kategori', (value) => categories?.find((item) => item.slug === value)?.nama ?? value),
    ...dariList('ukuran', (value) => `Ukuran ${value}`),
    ...dariList('warna', (value) => WARNA_FILTER.find((item) => item.value === value)?.label ?? value),
  ];

  const hargaMin = Number(searchParams.get('harga_min')) || null;
  const hargaMax = Number(searchParams.get('harga_max')) || null;
  if (hargaMin || hargaMax) {
    tags.push({
      id: 'harga',
      label: labelHarga(hargaMin, hargaMax),
      next: withParams(searchParams, { harga_min: null, harga_max: null }),
    });
  }

  const q = searchParams.get('q');
  if (q) {
    tags.push({ id: 'q', label: `"${q}"`, next: withParams(searchParams, { q: null }) });
  }

  return tags;
}

// Urutan tetap dipertahankan saat semua filter dihapus.
export function clearFilters(searchParams) {
  const urut = searchParams.get('urut');
  return new URLSearchParams(urut ? { urut } : {});
}
