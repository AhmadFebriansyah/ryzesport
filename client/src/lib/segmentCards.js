// Kategori sport untuk anak belum punya produk, jadi tombol Sport anak mengarah ke running.
export const SEGMENT_CARDS = [
  {
    label: 'Pria',
    foto: 'https://images.unsplash.com/photo-1619482662895-c35452ecf970?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8OHx8bWFuJTIwc25lYWtlcnMlMjBzdHJlZXR3ZWFyJTIwZnVsbCUyMGJvZHl8ZW58MXwxfHx8MTc5Mzg2NjUxN3ww&ixlib=rb-4.1.0',
    alt: 'Pria berbaju oranye mengenakan sepatu putih',
    posisi: '50% 35%',
    pilihan: [
      { teks: 'Sepatu Sport', params: { segmen: 'pria', kategori: 'sport' } },
      { teks: 'Sepatu Casual', params: { segmen: 'pria', kategori: 'casual' } },
    ],
    fotografer: 'uzziiii',
    username: 'uzziiii',
  },
  {
    label: 'Wanita',
    foto: 'https://images.unsplash.com/photo-1776409670989-e1dd3e7c663e?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8Nnx8d29tYW4lMjBzbmVha2VycyUyMHN0cmVldHdlYXIlMjBmdWxsJTIwYm9keXxlbnwxfDF8fHwxNzkzODY2NTE5fDA&ixlib=rb-4.1.0',
    alt: 'Wanita berbaju merah muda mengenakan sepatu hitam putih',
    posisi: '50% 40%',
    pilihan: [
      { teks: 'Sepatu Sport', params: { segmen: 'wanita', kategori: 'sport' } },
      { teks: 'Sepatu Casual', params: { segmen: 'wanita', kategori: 'casual' } },
    ],
    fotografer: 'vivek',
    username: 'vivekrb',
  },
  {
    label: 'Anak',
    foto: 'https://images.unsplash.com/photo-1754639663563-e4096e40da52?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8OHx8dGVlbiUyMGJveSUyMHNuZWFrZXJzJTIwc3RyZWV0fGVufDF8MXx8fDE3OTM4NzE5MTJ8MA&ixlib=rb-4.1.0',
    alt: 'Remaja berkaus merah duduk di tepi jalan mengenakan sepatu kets',
    posisi: '50% 30%',
    pilihan: [
      { teks: 'Sepatu Sport', params: { segmen: 'anak', kategori: 'running' } },
      { teks: 'Sepatu Casual', params: { segmen: 'anak', kategori: 'casual' } },
    ],
    fotografer: 'Sina Malek',
    username: 'sinamalek',
  },
];
