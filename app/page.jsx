import Link from 'next/link';
import Footer from '@/components/Footer';
import { KASUS, TOTAL_BARIS, jumlah, ukuran } from '@/lib/kasus';

const TOTAL_BYTE = KASUS.reduce((n, k) => n + k.byte, 0);

const LANGKAH = [
  {
    judul: 'Ask',
    isi: 'Rumuskan pertanyaan audit atau bisnis dan tentukan data yang benar-benar dibutuhkan.',
  },
  {
    judul: 'Master',
    isi: 'Bersihkan data dengan Power Query: tipe data, duplikat, tanggal tidak valid, nilai kosong.',
  },
  {
    judul: 'Present',
    isi: 'Susun PivotTable, skor risiko, dan dashboard dengan slicer agar temuan mudah dibaca.',
  },
  {
    judul: 'Story',
    isi: 'Terjemahkan angka menjadi rekomendasi tindakan beserta dampak dan prioritasnya.',
  },
];

export const metadata = {
  title: 'Praktikum Analisa Bisnis — Modul & Data Kasus',
};

export default function Beranda() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div>
            <p className="eyebrow" style={{ color: '#e8c877' }}>
              Program Studi Akuntansi · Politeknik Negeri Ujung Pandang
            </p>
            <h1>
              Praktikum <em>Analisa Bisnis</em>
            </h1>
            <p className="hero-pimpin">
              Modul praktikum berbasis Microsoft Excel dan enam kasus data nyata-sintetis: dari
              pembersihan data dengan Power Query sampai dashboard dan rekomendasi. Modul dibaca
              langsung di halaman ini; berkas CSV disediakan untuk Anda olah sendiri.
            </p>
            <div className="hero-aksi">
              <Link href="/modul" className="tombol tombol-utama">
                Baca modul praktikum
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link href="/data" className="tombol tombol-garis">
                Unduh data kasus (CSV)
              </Link>
            </div>
          </div>

          <aside className="papan-modul" aria-hidden="true">
            <p className="eyebrow" style={{ color: '#9fb0c2' }}>Modul praktikum</p>
            <h2>Analitika Data untuk Akuntansi</h2>
            <p>Kerangka AMPS · Power Query · Dashboard · Empat tipe analitik</p>
            <div className="papan-halaman">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="papan-kaki">
              <span>50 halaman</span>
              <span>Hanya baca</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="pita">
        <div className="container pita-grid">
          <div className="pita-item">
            <div className="pita-angka">50</div>
            <div className="pita-label">Halaman modul</div>
          </div>
          <div className="pita-item">
            <div className="pita-angka">{KASUS.length}</div>
            <div className="pita-label">Kasus data kelompok</div>
          </div>
          <div className="pita-item">
            <div className="pita-angka">{jumlah(TOTAL_BARIS)}</div>
            <div className="pita-label">Baris data untuk diolah</div>
          </div>
          <div className="pita-item">
            <div className="pita-angka">{ukuran(TOTAL_BYTE)}</div>
            <div className="pita-label">Ukuran data kasus</div>
          </div>
        </div>
      </section>

      <section className="bagian">
        <div className="container">
          <div className="kepala-bagian">
            <p className="eyebrow">Dua hal yang bisa dilakukan di sini</p>
            <h2>Baca modulnya, unduh datanya</h2>
            <p>
              Modul dijaga agar tidak berpindah tangan sebagai berkas: halaman dirender langsung di
              browser tanpa tombol unduh maupun cetak. Data kasus sebaliknya — memang disediakan
              sebagai CSV agar bisa dibuka di Excel dan diolah sendiri.
            </p>
          </div>

          <div className="dua-kolom">
            <article className="kartu">
              <div className="kartu-ikon">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                  <path d="M8 7h7M8 10.5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  <path
                    d="M4 20.5A2.5 2.5 0 0 1 6.5 18H19v3H6.5A2.5 2.5 0 0 1 4 20.5Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Modul praktikum — hanya baca</h3>
              <p>
                Panduan 50 halaman dengan kerangka AMPS, langkah Power Query, Data Model, PivotTable,
                slicer, dan empat tipe analitik. Halaman dikirim sebagai gambar bertanda air dan
                dibaca di dalam aplikasi — berkas PDF-nya tidak disimpan di server, jadi tidak ada
                yang bisa diunduh.
              </p>
              <Link href="/modul" className="kartu-tautan">
                Buka modul
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </article>

            <article className="kartu">
              <div className="kartu-ikon">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <ellipse cx="12" cy="6" rx="7.5" ry="3" stroke="currentColor" strokeWidth="1.7" />
                  <path
                    d="M4.5 6v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M4.5 12v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                </svg>
              </div>
              <h3>Data kasus — CSV untuk diolah</h3>
              <p>
                Enam kasus kelompok berisi 400 ribu sampai 447 ribu baris, lengkap dengan anomali
                yang harus dibersihkan pada tahap ETL. Tersedia juga data latihan retail untuk
                mencoba alur kerja dari awal.
              </p>
              <Link href="/data" className="kartu-tautan">
                Lihat dan unduh data
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </article>
          </div>

          <div className="catatan">
            <span className="catatan-ikon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="4" y="10" width="16" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
                <path d="M8 10V7.5a4 4 0 0 1 8 0V10" stroke="currentColor" strokeWidth="1.7" />
                <circle cx="12" cy="15" r="1.4" fill="currentColor" />
              </svg>
            </span>
            <div>
              <strong>Kenapa modul tidak bisa diunduh?</strong>
              <p>
                Modul dipakai bersama di kelas dan diperbarui tiap semester, sehingga salinan cetak
                yang beredar cepat kedaluwarsa. Karena itu modul tidak disediakan sebagai berkas
                PDF: server hanya mengirim gambar tiap halaman, satu per satu, dengan tanda air.
                Data kasus tetap bebas diunduh sebagai CSV untuk diolah di Excel.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bagian bagian-krem">
        <div className="container">
          <div className="kepala-bagian">
            <p className="eyebrow">Kerangka kerja</p>
            <h2>Alur AMPS yang dipakai di seluruh modul</h2>
            <p>
              Setiap kasus dikerjakan dengan urutan yang sama, sehingga luaran tiap pertemuan punya
              bentuk yang konsisten dan mudah dinilai.
            </p>
          </div>
          <div className="langkah">
            {LANGKAH.map((l) => (
              <div className="langkah-item" key={l.judul}>
                <h4>{l.judul}</h4>
                <p>{l.isi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
