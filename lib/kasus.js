// Metadata data kasus praktikum. Dipakai halaman /data dan route unduhan.
// Angka baris mengikuti README_DATA_KELOMPOK.md dan berkas CSV yang disertakan.

export const KASUS = [
  {
    slug: 'kelompok1',
    nomor: 1,
    judul: 'Deteksi Kecurangan Klaim',
    konteks: 'PT Nusa Bangsawan — audit internal klaim reimbursement 2024',
    berkas: 'kelompok1_fraud_audit.csv',
    arsip: 'kelompok1_fraud_audit.csv.gz',
    baris: 414350,
    byte: 35533172,
    granularitas: 'Satu baris = satu klaim reimbursement',
    kunci: 'ID_Transaksi',
    kolom: 8,
    fokus:
      'Nomor transaksi ganda, klaim menumpuk di bawah ambang Rp 2,5 juta, klaim akhir pekan, dan distorsi digit pertama (Hukum Benford).',
    bab: 'Bab 6.5 dan Bab 7.4',
  },
  {
    slug: 'kelompok2',
    nomor: 2,
    judul: 'Piutang Usaha dan Prediksi Gagal Bayar',
    konteks: 'PT Surya Utama — 431.580 faktur 2024 dari 1.600 pelanggan',
    berkas: 'kelompok2_piutang_pelanggan.csv',
    arsip: 'kelompok2_piutang_pelanggan.csv.gz',
    baris: 431580,
    byte: 34489826,
    granularitas: 'Satu baris = satu faktur penjualan',
    kunci: 'No_Faktur',
    kolom: 8,
    fokus:
      'Faktur belum dibayar, pembayaran sebelum tanggal faktur, skor kredit di luar rentang, dan hubungan skor kredit dengan keterlambatan.',
    bab: 'Bab 3 dan Bab 6',
  },
  {
    slug: 'kelompok3',
    nomor: 3,
    judul: 'Kinerja Keuangan dan Rasio Profitabilitas',
    konteks: '20.000 perusahaan, 20 tahun (2005–2024); 20 emiten ritel menjadi fokus',
    berkas: 'kelompok3_kinerja_keuangan.csv',
    arsip: 'kelompok3_kinerja_keuangan.csv.gz',
    baris: 400350,
    byte: 33363195,
    granularitas: 'Satu baris = satu perusahaan-tahun',
    kunci: 'Kode_Perusahaan + Tahun',
    kolom: 9,
    fokus:
      'ROA menurun karena aset tumbuh lebih cepat daripada laba; dekomposisi DuPont, proyeksi dua tahun, dan skor kelayakan investasi.',
    bab: 'Bab 5–7',
  },
  {
    slug: 'kelompok4',
    nomor: 4,
    judul: 'Evaluasi Varians Anggaran Operasional',
    konteks: 'PT Melati Express — 3.100 cabang, 36 bulan, 4 kategori biaya',
    berkas: 'kelompok4_varians_anggaran.csv',
    arsip: 'kelompok4_varians_anggaran.csv.gz',
    baris: 447300,
    byte: 18445531,
    granularitas: 'Satu baris = cabang-bulan-kategori biaya',
    kunci: 'ID_Cabang + Bulan + Kategori_Biaya',
    kolom: 5,
    fokus:
      'Cabang kronis over-budget, realisasi ekstrem 2–3,5 kali anggaran, kategori biaya kosong, dan varians BBM.',
    bab: 'Bab 6.4 dan Bab 8',
  },
  {
    slug: 'kelompok5',
    nomor: 5,
    judul: 'Profitabilitas Produk dan Segmentasi Pelanggan',
    konteks: 'PT Digital Mart — 11.267 SKU, 8 kategori, 36 bulan',
    berkas: 'kelompok5_profitabilitas_produk.csv',
    arsip: 'kelompok5_profitabilitas_produk.csv.gz',
    baris: 406012,
    byte: 23543914,
    granularitas: 'Satu baris = SKU-bulan (tanpa kolom bulan eksplisit)',
    kunci: 'ID_SKU + urutan bulan',
    kolom: 8,
    fokus:
      'SKU dengan kontribusi negatif, HPP di atas harga jual, retur tidak wajar, dan SKU yang berhenti terjual.',
    bab: 'Bab 6 dan Bab 7.4',
  },
  {
    slug: 'kelompok6',
    nomor: 6,
    judul: 'Kepatuhan PPN',
    konteks: 'Konsultan pajak — 423.600 faktur 2024 atas 7.500 lawan transaksi',
    berkas: 'kelompok6_pajak_ppn.csv',
    arsip: 'kelompok6_pajak_ppn.csv.gz',
    baris: 423600,
    byte: 36327147,
    granularitas: 'Satu baris = satu faktur pajak',
    kunci: 'No_Faktur_Pajak',
    kolom: 7,
    fokus:
      'PPN tidak sama dengan 11% × DPP, NPWP kosong, status rekonsiliasi tidak konsisten, dan lawan transaksi berisiko.',
    bab: 'Bab 3, Bab 6, dan Bab 7',
  },
];

export const RETAIL = {
  slug: 'retail',
  judul: 'Data Latihan Retail',
  konteks: 'Contoh data penjualan ritel untuk latihan Power Query dan dashboard awal',
  berkas: 'contoh_data_penjualan_retail_450000.csv',
  arsip: 'retail_penjualan_450000.csv.gz',
  baris: 400551,
  byte: 54814077,
};

export const SEMUA_UNDUHAN = [...KASUS, RETAIL];

export function cariKasus(slug) {
  return SEMUA_UNDUHAN.find((k) => k.slug === slug);
}

export const TOTAL_BARIS = KASUS.reduce((n, k) => n + k.baris, 0);

export function ukuran(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;
}

export function jumlah(n) {
  return new Intl.NumberFormat('id-ID').format(n);
}
