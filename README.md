# Praktikum Analisa Bisnis — Modul & Data Kasus

Aplikasi web untuk praktikum Analisa Bisnis (Program Studi Akuntansi). Modul praktikum
ditampilkan langsung di browser tanpa tombol unduh atau cetak, sedangkan data kasus CSV
disediakan sebagai unduhan.

- **Modul** — PDF 50 halaman dirender ke `<canvas>` oleh PDF.js di dalam aplikasi. Berkas PDF
  tidak berada di folder `public/`, sehingga tidak punya URL publik, dan halaman diberi tanda air
  "HANYA BACA". Tombol unduh/cetak tidak disediakan; pintasan `Ctrl/Cmd+S` dan `Ctrl/Cmd+P`
  diblokir, dan saat mencetak halaman hanya muncul peringatan.
- **Data kasus** — enam CSV kelompok (400–447 ribu baris) plus satu data latihan retail. CSV
  disimpan terkompresi dan dialirkan sebagai unduhan oleh route server, jadi pengunjung menerima
  berkas `.csv` dengan nama yang benar.
- **Tanpa basis data, tanpa variabel lingkungan** — seluruh isi bersifat statis.

## Struktur

```
app/
  page.jsx                 Beranda
  modul/page.jsx           Halaman viewer
  data/page.jsx            Daftar data + tombol unduh
  api/modul/route.js       Mengirim PDF (inline, no-store)
  api/unduh/[slug]/route.js  Streaming CSV dari arsip gzip
components/
  Nav.jsx  Footer.jsx  PdfViewer.jsx
lib/kasus.js               Metadata kasus (judul, baris, kolom, berkas)
assets/pdf/                PDF modul (tidak dilayani sebagai berkas statis)
data/                      CSV terkompresi (tidak dilayani sebagai berkas statis)
scripts/salin-worker.mjs   Menyalin worker PDF.js ke public/ saat npm install
```

## Menjalankan lokal

```bash
npm install     # sekaligus menyalin public/pdf.worker.min.mjs
npm run dev     # http://localhost:3000
```

Build produksi:

```bash
npm run build
npm start
```

## Mengunggah ke Vercel

1. Unggah folder ini ke repositori GitHub (folder `web-praktikum` boleh menjadi akar repo).
2. Di Vercel: **Add New → Project → Import** repositori tersebut.
3. Framework terdeteksi otomatis sebagai **Next.js**; biarkan semua pengaturan default.
4. **Deploy**. Tidak ada environment variable yang perlu diisi.

Alternatif lewat terminal:

```bash
npm i -g vercel
vercel          # pratinjau
vercel --prod   # produksi
```

Catatan teknis untuk Vercel:

- `next.config.mjs` memakai `outputFileTracingIncludes` agar PDF dan arsip CSV ikut dikemas ke
  fungsi server. Tanpa pengaturan itu, route akan 404 di Vercel meski berjalan di lokal.
- Total data di repositori sekitar 54 MB (CSV terkompresi + PDF). Jika ingin mengecilkan,
  kurangi berkas di `data/` dan hapus entri terkait di `lib/kasus.js`.
- Fungsi unduhan mengalirkan data (streaming), jadi ukuran 18–36 MB per berkas tidak melewati
  batas respons fungsi.

## Mengganti atau menambah materi

- **Modul:** ganti `assets/pdf/panduan-praktikum.pdf` dengan nama berkas yang sama.
- **Data kasus:** letakkan CSV baru di `data/` sebagai `<nama>.csv.gz`
  (`gzip -9 -c berkas.csv > berkas.csv.gz`), lalu tambahkan entrinya di `lib/kasus.js`
  (`slug`, `berkas`, `arsip`, jumlah baris, dan ukuran byte).
- **Teks halaman:** `app/page.jsx` (beranda), `app/data/page.jsx` (daftar data),
  `app/modul/page.jsx` (judul modul).

## Sejauh mana modul "tidak bisa diunduh"?

Yang diterapkan: PDF tidak disajikan dari URL publik, hanya dikirim ke viewer dengan
`Content-Disposition: inline` dan `Cache-Control: no-store`; halaman digambar sebagai kanvas
(teks tidak bisa disalin); tanda air tetap terlihat pada tangkapan layar; menu klik kanan,
`Ctrl/Cmd+S`, `Ctrl/Cmd+P`, dan pencetakan diblokir; tidak ada tombol unduh.

Yang tidak bisa dijamin oleh situs mana pun: pengguna yang membuka DevTools tetap dapat
menangkap respons jaringan atau mengambil piksel kanvas. Perlindungan ini berfungsi untuk
mahasiswa umum di kelas, bukan sebagai pengamanan hak cipta tingkat tinggi.
# anlisa-bisnis
