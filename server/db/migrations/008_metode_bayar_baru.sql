-- VIRTUAL_ACCOUNT tetap ada agar pesanan lama masih terbaca, tetapi tidak lagi diterima saat checkout.
ALTER TYPE e_metode_bayar ADD VALUE IF NOT EXISTS 'MANDIRI';
ALTER TYPE e_metode_bayar ADD VALUE IF NOT EXISTS 'BSI';
ALTER TYPE e_metode_bayar ADD VALUE IF NOT EXISTS 'QRIS';
