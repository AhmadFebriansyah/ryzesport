const UTM = '?utm_source=ryzesport&utm_medium=referral';

const fotoUnsplash = (url, lebar) => `${url}&w=${lebar}&q=80&fm=jpg&fit=crop`;

export const fotoSrcSet = (url) =>
  [828, 1280, 1920, 2560].map((lebar) => `${fotoUnsplash(url, lebar)} ${lebar}w`).join(', ');

export const fotoDefault = (url) => fotoUnsplash(url, 1920);

export const kreditUrl = (username) => `https://unsplash.com/@${username}${UTM}`;
export const UNSPLASH_URL = `https://unsplash.com/${UTM}`;

// Slide produk hanya memakai foto model yang benar. Foto lain menjadi slide kategori tanpa nama produk.
export const HERO_SLIDES = [
  {
    id: 'air-force-1',
    label: 'Nike',
    judul: "Air Force 1 '07",
    teks: 'Putih bersih yang cocok dengan semua gaya.',
    tautan: '/produk/nike-air-force-1-07-wanita',
    tombol: 'Lihat Sepatu',
    foto: 'https://images.unsplash.com/photo-1695073621086-aa692bc32a3d?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8MXx8d2hpdGUlMjBhaXIlMjBmb3JjZSUyMDElMjBzdHJlZXR8ZW58MXwwfHx8MTc5Mzg2NDg1N3ww&ixlib=rb-4.1.0',
    dasar: '#86463b',
    alt: 'Sepasang sepatu putih di atas latar merah',
    posisi: '50% 60%',
    posisiDesktop: '60% 60%',
    fotografer: 'Sanju Pandita',
    username: 'spxclicks',
  },
  {
    id: 'samba-og',
    label: 'adidas',
    judul: 'Samba OG',
    teks: 'Klasik dengan sol gum yang tidak pernah usang.',
    tautan: '/produk/adidas-samba-og-pria',
    tombol: 'Lihat Sepatu',
    foto: 'https://images.unsplash.com/photo-1718220130188-428c7dc27fd2?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8MTB8fGFkaWRhcyUyMHNhbWJhJTIwb24lMjBmZWV0fGVufDF8MHx8fDE3OTM4NjQ4NTd8MA&ixlib=rb-4.1.0',
    dasar: '#5c554c',
    alt: 'Sepasang sepatu putih bergaris hitam di lantai kayu',
    posisi: '60% 70%',
    posisiDesktop: '70% 70%',
    fotografer: 'Cris',
    username: 'cris_23',
  },
  {
    id: 'running',
    label: 'Running',
    judul: 'Lari Lebih Jauh',
    teks: 'Sepatu lari untuk latihan harian sampai hari lomba.',
    tautan: '/produk?kategori=running',
    tombol: 'Belanja Running',
    foto: 'https://images.unsplash.com/photo-1571008745378-fc9d2cc9e109?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8M3x8bmlrZSUyMHBlZ2FzdXMlMjBydW5uaW5nJTIwc2hvZXMlMjByb2FkfGVufDF8MHx8fDE3OTM4NjQ5MjB8MA&ixlib=rb-4.1.0',
    dasar: '#51595c',
    alt: 'Sekelompok pelari bersiap di jalan raya',
    posisi: '45% 40%',
    posisiDesktop: '45% 45%',
    fotografer: 'sporlab',
    username: 'sporlab',
  },
  {
    id: 'casual',
    label: 'Casual',
    judul: 'Gaya Setiap Hari',
    teks: 'Sepatu santai untuk ke mana pun langkahmu pergi.',
    tautan: '/produk?kategori=casual',
    tombol: 'Belanja Casual',
    foto: 'https://images.unsplash.com/photo-1785009736928-be36e6473fec?ixid=M3wxMTI0MDAwfDB8MXxzZWFyY2h8OXx8bmlrZSUyMGFpciUyMGZvcmNlJTIwMSUyMG9uJTIwZmVldHxlbnwxfDB8fHwxNzkzODY0ODU2fDA&ixlib=rb-4.1.0',
    dasar: '#5d5653',
    alt: 'Kaki mengenakan sepatu putih di permukaan beton',
    posisi: '62% 75%',
    posisiDesktop: '60% 72%',
    fotografer: 'Ian Edokov',
    username: 'edokov95',
  },
];
