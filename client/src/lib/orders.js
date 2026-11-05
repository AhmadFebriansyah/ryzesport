export const KURIR = [
  { value: 'JNT', label: 'J&T' },
  { value: 'JNE', label: 'JNE' },
];

export const JENIS_BAYAR = [
  { value: 'TRANSFER', label: 'Transfer Bank' },
  { value: 'QRIS', label: 'QRIS' },
];

export const BANK = [
  { value: 'BCA', label: 'BCA' },
  { value: 'BRI', label: 'BRI' },
  { value: 'MANDIRI', label: 'Mandiri' },
  { value: 'BSI', label: 'BSI' },
];

// Virtual Account hanya untuk menampilkan pesanan lama.
export const METODE_BAYAR = [
  ...BANK.map(({ value, label }) => ({ value, label: `Transfer ${label}` })),
  { value: 'QRIS', label: 'QRIS' },
  { value: 'VIRTUAL_ACCOUNT', label: 'Virtual Account' },
];

export const STATUS_LABELS = {
  MENUNGGU_PEMBAYARAN: 'Menunggu Pembayaran',
  DIBAYAR: 'Dibayar',
  DIPROSES: 'Diproses',
  DIKIRIM: 'Dikirim',
  SELESAI: 'Selesai',
  DIBATALKAN: 'Dibatalkan',
};

export function optionLabel(options, value) {
  return options.find((option) => option.value === value)?.label ?? value;
}
