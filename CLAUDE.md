# RyzeSport

Website toko online multi-merek yang menjual sepatu running, sport, dan casual (Nike, adidas, Puma, dll). Proyek portofolio, harus bisa dilihat publik.

Aplikasi terdiri dari 2 bagian:
1. **Storefront (e-commerce)**: dikerjakan sekarang.
2. **Admin/Owner**: dikerjakan belakangan (CRUD produk, update status pesanan). Jangan dibuat dulu kecuali diminta.

## Tech Stack

- **Frontend:** React (Vite) + React Router + Tailwind CSS
- **Backend:** Node.js + Express (REST API)
- **Database:** PostgreSQL di Neon (driver `pg`)
- **Auth:** JWT + bcrypt untuk hash password
- **Gambar produk:** foto Unsplash ditampilkan langsung dari `images.unsplash.com` (wajib menurut panduan API-nya, jangan disalin ke proyek). Foto Pexels dan Wikimedia Commons ada di `client/public/produk`. `UNSPLASH_ACCESS_KEY` di `server/.env` hanya untuk mencari foto.
- **Deploy:** Vercel Services (Beta). `vercel.json` mendefinisikan service `client` (Vite, publik di `/`) dan `server` (Express dengan entrypoint `server/app.js`, publik di `/api`). Yang wajib diisi di Vercel: `DATABASE_URL` dan `JWT_SECRET`. Uji lokal dengan `vercel dev -L`.

## Struktur Folder

```
ryzesport/
├── client/        # React storefront
├── server/        # Express API
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── db/        # koneksi, migration .sql, seed .sql
└── admin/         # (nanti) aplikasi owner
```

## Perintah

- `cd client && npm run dev`: jalankan frontend
- `cd server && npm run dev`: jalankan API
- Variabel rahasia (`DATABASE_URL`, `JWT_SECRET`, dll) ada di file `.env`, **jangan pernah di-commit**.

## Aturan Bisnis (WAJIB diikuti)

- Filter utama produk: Pria, Wanita, Anak, Trending. Kategori (running, sport, casual) menjadi filter kedua.
- Halaman `/produk` punya filter segmen, merek, harga, ukuran, jenis sepatu, dan warna, ditambah urutan. Semua tersimpan di URL dan bisa pilih banyak (nilai dipisah koma). Filter warna memakai warna dasar di `client/src/lib/productFilters.js`, dicocokkan per kata dari `nama_warna`. Filter ukuran hanya menghitung varian yang masih ada stoknya.
- Kartu katalog menampilkan foto warna terlaris. Warna dan ukuran dipilih di halaman detail.
- Pengunjung boleh melihat produk dan menambah ke keranjang **tanpa login** (keranjang disimpan di localStorage).
- **Checkout WAJIB login/punya akun.** Saat tamu klik checkout, tampilkan notifikasi/modal untuk login atau daftar. Setelah login, keranjang localStorage digabung ke database.
- Detail produk: user wajib memilih **warna** dan **ukuran** sebelum bisa add to cart / beli, urutannya bebas. Warna yang tidak punya stok di ukuran terpilih nonaktif, begitu juga sebaliknya. Klik pilihan yang aktif untuk membatalkannya.
- Form checkout: nama penerima, telepon, alamat lengkap, kurir, metode bayar.
  - Kurir: `JNT`, `JNE`
  - Metode bayar: Transfer Bank (`BCA`, `BRI`, `MANDIRI`, `BSI`) atau `QRIS` (**simulasi saja**, tidak ada payment gateway asli). `VIRTUAL_ACCOUNT` hanya tersisa untuk pesanan lama.
- Menu **"Pesanan Saya"**: user melihat daftar pesanan, item yang dibeli, status, nomor resi, dan riwayat status.
- Update status pesanan dilakukan dari aplikasi Admin (nanti). Di storefront status hanya dibaca.

## Database

Konvensi:
- Nama tabel diawali `t_` dan berbentuk jamak, contoh `t_products`.
- Primary key `id` (SERIAL/BIGSERIAL). Setiap tabel punya `created_at` dan `updated_at`.
- Harga disimpan dalam Rupiah sebagai `INTEGER` (tanpa desimal).
- Selalu pakai **parameterized query** (`$1, $2`), jangan menyambung string SQL.

Tabel inti:
- `t_users`: email (unik), password_hash, nama, telepon
- `t_addresses`: alamat milik user
- `t_categories`: running, sport, casual
- `t_brands`: merek sepatu (nama, slug)
- `t_products`: nama, slug, deskripsi, harga, category_id, brand_id, segmen (`PRIA`, `WANITA`, `ANAK`), is_trending, is_unggulan, is_active
- `t_product_colors`: warna per produk, URL foto, penanda foto ilustrasi, kredit dan tautannya, lisensi, dan sumber foto
- `t_product_photos`: foto tambahan per warna untuk galeri, dengan kredit, lisensi, dan sumbernya
- `t_product_variants`: kombinasi warna × ukuran, stok, SKU
- `t_carts`, `t_cart_items`: keranjang user yang sudah login
- `t_orders`: no_order, user_id (**NOT NULL**), data penerima, kurir, metode_bayar, no_resi, total, status
- `t_order_items`: variant_id, qty, **harga saat beli** (snapshot, jangan ambil dari t_products)
- `t_order_status_history`: order_id, status, catatan, waktu

Alur status pesanan:
`MENUNGGU_PEMBAYARAN` → `DIBAYAR` → `DIPROSES` → `DIKIRIM` → `SELESAI`
(bisa juga `DIBATALKAN`). Saat `DIKIRIM`, `no_resi` wajib terisi.

Checkout harus dalam **satu transaksi DB**: buat order, simpan item, kurangi stok, kosongkan keranjang. Jika stok kurang, rollback semuanya.

## Arah Desain

- Gaya modern, bold, dan minimalis (inspirasi layout toko sepatu olahraga besar).
- Dominan hitam-putih dengan satu warna aksen. Tipografi tebal untuk judul.
- Mobile-first dan responsif.
- Nama merek dan model asli boleh dipakai untuk menyebut produk, contoh "Nike Pegasus 41".
- **Jangan** menyalin deskripsi atau foto dari situs resmi merek. Deskripsi ditulis sendiri, foto harus berlisensi bebas dan kreditnya tampil di `/kredit-foto`.
- Nama warna harus sama dengan foto. Foto seri atau model lain wajib berlabel "Foto ilustrasi".
- Beranda menampilkan slide foto penuh (data di `client/src/lib/heroSlides.js`, foto Unsplash dengan kredit di slide) dan produk unggulan (`is_unggulan`). Slide bernama produk wajib memakai foto model itu, selain itu pakai slide kategori. Bagian Kategori Produk berisi kartu Pria, Wanita, Anak dengan pilihan Sport dan Casual (`client/src/lib/segmentCards.js`).
- Halaman detail memakai galeri foto per warna, dan klik foto membuka tampilan penuh yang bisa di-zoom. Foto tambahan harus sepatu dan warna yang sama dengan foto utama.
- Logo merek hanya dipakai di bagian Merek beranda (`client/public/merek`, daftar di `client/src/lib/brandLogos.js`), sebagai tautan ke produk merek itu. Bagian ini hanya menampilkan merek yang punya produk aktif (`/api/brands`). Jangan memberi kesan mitra resmi.
- Navbar: baris atas berisi logo, pencarian (`/produk?q=`), ikon akun, dan ikon keranjang. Baris bawah berisi filter utama.
- Footer setiap halaman memuat pernyataan tidak berafiliasi dengan merek dan tautan kredit foto. Halaman checkout tetap menyatakan pembayaran adalah simulasi. Kontak, jam operasional, dan lokasi di footer adalah data contoh di `client/src/lib/storeInfo.js`.

## Gaya Kode

- JavaScript (ES modules), `async/await`, bukan callback.
- Komponen React berupa function component, satu komponen per file.
- Teks yang tampil ke user memakai Bahasa Indonesia.
- Validasi input di backend, jangan hanya di frontend.
- Format harga di UI: `Rp 1.299.000`.

## Progres

- [x] Setup repo, Neon, migration + seed data
- [x] Beranda + daftar produk + filter kategori
- [x] Detail produk (warna, ukuran, stok)
- [x] Keranjang (tamu, localStorage). Penggabungan ke database dikerjakan bersama login.
- [x] Register / login
- [x] Checkout (wajib login)
- [x] Pesanan Saya + riwayat status
- [ ] (Nanti) Aplikasi Admin
