export function formatRupiah(harga) {
  return `Rp ${harga.toLocaleString('id-ID')}`;
}

const FORMAT_WAKTU = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

export function formatWaktu(waktu) {
  return FORMAT_WAKTU.format(new Date(waktu));
}
