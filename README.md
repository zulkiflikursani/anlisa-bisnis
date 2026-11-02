# Praktikum Analisa Bisnis — Modul & Data Kasus

Aplikasi web untuk praktikum Analisa Bisnis (Program Studi Akuntansi). Modul praktikum dibaca
di dalam situs, sedangkan data kasus CSV disediakan sebagai unduhan.

- **Modul tanpa berkas PDF.** PDF sumber dipecah menjadi 50 gambar halaman bertanda air
  (`web-praktikum/assets/halaman/*.jpg`). Berkas PDF-nya **tidak ada di dalam aplikasi**, tidak
  berada di `public/`, dan tidak pernah dikirim ke browser. Halaman dikirim satu per satu oleh
  `/api/halaman/[nomor]` hanya bila permintaan menyertakan token sesi dari `/api/sesi`.
- **Tanpa tombol unduh/cetak.** Viewer hanya menampilkan gambar; klik kanan dinonaktifkan,
  `Ctrl/Cmd+S` dan `Ctrl/Cmd+P` diblokir, dan saat mencetak yang muncul hanya peringatan.
- **Data kasus tetap bisa diunduh.** Enam CSV kelompok (400–447 ribu baris) plus data latihan
  retail disimpan terkompresi dan dialirkan sebagai `.csv` oleh route server.
- **Tanpa basis data dan tanpa environment variable.**

## Struktur

```
app/
  page.jsx                    Beranda
  modul/page.jsx              Halaman viewer
  data/page.jsx               Daftar data + tombol unduh
  api/sesi/route.js           Menerbitkan token 2 jam
  api/halaman/[nomor]/route.js  Gambar halaman (wajib token)
  api/unduh/[slug]/route.js   Streaming CSV dari arsip gzip
components/
  Nav.jsx  Footer.jsx  PdfViewer.jsx
lib/
  kasus.js      Metadata kasus
  modul.js      Token HMAC, jumlah halaman
  rahasia.js    Kunci penandatangan token (bukan kredensial pihak ketiga)
assets/halaman/  50 gambar halaman bertanda air (tidak dilayani sebagai berkas statis)
data/            CSV terkompresi (tidak dilayani sebagai berkas statis)
scripts/render-halaman.py   Build ulang gambar halaman dari PDF sumber
```

## Menjalankan lokal

```bash
npm install
npm run dev     # http://localhost:3000
```

Build produksi: `npm run build && npm start`

## Mengunggah ke Vercel

1. Unggah folder ini ke repositori GitHub (folder `web-praktikum` boleh menjadi akar repo).
2. Vercel: **Add New → Project → Import**, framework terdeteksi sebagai **Next.js**.
3. **Deploy**. Tidak ada environment variable yang perlu diisi.

Lewat terminal: `npx vercel` (pratinjau) atau `npx vercel --prod` (produksi).

Catatan untuk Vercel:

- `next.config.mjs` memakai `outputFileTracingIncludes` agar gambar halaman dan arsip CSV ikut
  dikemas ke fungsi server. Tanpa itu, route akan 404 di Vercel meski jalan di lokal.
- Total isi repositori sekitar 73 MB (19 MB gambar halaman + 54 MB CSV terkompresi).
- Route gambar dan CSV memakai streaming, jadi ukurannya tidak melewati batas respons fungsi.

## Mengganti modul

PDF sumber disimpan **di luar folder aplikasi**, yaitu `assets/modul/Panduan_Praktikum_Analisa_Bisnis.pdf`
pada folder induk proyek. Setelah isi modul berubah:

```bash
python3 -m venv .venv && .venv/bin/pip install pymupdf     # sekali saja
.venv/bin/python web-praktikum/scripts/render-halaman.py \
  --pdf assets/modul/Panduan_Praktikum_Analisa_Bisnis.pdf \
  --keluar web-praktikum/assets/halaman --lebar 1800
```

Sesuaikan `TOTAL_HALAMAN` di `lib/modul.js` bila jumlah halaman berubah. Jangan menaruh PDF di
dalam `web-praktikum/` — itu akan mengirim berkas yang justru ingin dilindungi.

## Menambah atau mengganti data kasus

Letakkan CSV baru di `data/` sebagai `<nama>.csv.gz` (`gzip -9 -c berkas.csv > berkas.csv.gz`),
lalu tambahkan entrinya di `lib/kasus.js` (`slug`, `berkas`, `arsip`, jumlah baris, ukuran byte).

## Sejauh mana modul terlindungi?

Yang diterapkan:

- Tidak ada berkas PDF di server maupun di bundel deploy — hanya gambar halaman.
- Gambar hanya dilayani bila ada token HMAC yang sah dan belum kedaluwarsa; tanpa token
  responsnya `401`, nomor di luar 1–50 `404`.
- Gambar dimuat sebagai blob lewat `fetch`, bukan `<img src>` yang bisa dibuka di tab baru.
- Tanda air "HANYA BACA · PRAKTIKUM ANALISA BISNIS" dibakar ke dalam gambar, jadi ikut terbawa
  pada tangkapan layar.
- Tidak ada teks yang bisa dipilih/disalin, tidak ada tautan unduh, klik kanan dan pintasan
  simpan/cetak diblokir, dan tampilan cetak diganti peringatan.

Yang tidak bisa dijamin situs mana pun: pengguna yang membuka DevTools tetap dapat menyimpan
gambar halaman satu per satu (kualitasnya JPEG 1800 px, bukan PDF vektor), dan gambar dapat
disusun ulang menjadi PDF dengan alat lain. Perlindungan ini tepat untuk mahasiswa di kelas,
bukan pengamanan hak cipta tingkat tinggi.
