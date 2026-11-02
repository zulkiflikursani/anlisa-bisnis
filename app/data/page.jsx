import Footer from '@/components/Footer';
import { KASUS, RETAIL, jumlah, ukuran } from '@/lib/kasus';

export const metadata = {
  title: 'Data Kasus (CSV)',
  description:
    'Unduh enam berkas CSV kasus praktikum Analisa Bisnis beserta data latihan retail untuk diolah di Microsoft Excel.',
};

function IkonUnduh() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4v11M7.5 10.5 12 15l4.5-4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 19h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function HalamanData() {
  return (
    <>
      <section className="judul-halaman">
        <div className="container">
          <p className="eyebrow">Bahan praktikum</p>
          <h1>Data kasus dalam format CSV</h1>
          <p>
            Setiap kelompok mendapat satu berkas dengan skema kolom sesuai modul. Seluruh berkas
            memakai pemisah koma, encoding UTF-8, dan tanggal <code>dd/mm/yyyy</code>; sebagian baris
            sengaja dibuat tidak valid agar tahap pembersihan benar-benar dikerjakan.
          </p>
        </div>
      </section>

      <div className="container">
        <div className="daftar-kasus">
          {KASUS.map((k) => (
            <article className="kasus" key={k.slug}>
              <div className="kasus-nomor">{String(k.nomor).padStart(2, '0')}</div>
              <div>
                <h2 className="kasus-judul">{k.judul}</h2>
                <p className="kasus-konteks">{k.konteks}</p>
                <div className="kasus-meta">
                  <span className="chip">{jumlah(k.baris)} baris</span>
                  <span className="chip">{k.kolom} kolom</span>
                  <span className="chip">Kunci: {k.kunci}</span>
                  <span className="chip chip-hijau">{ukuran(k.byte)}</span>
                </div>
                <p style={{ marginTop: 10, fontSize: 13, color: '#6b6353' }}>
                  <strong>Fokus analisis:</strong> {k.fokus} <span style={{ color: '#8b8069' }}>({k.bab})</span>
                </p>
              </div>
              <div className="kasus-aksi">
                <a
                  className="tombol tombol-tinta tombol-kecil"
                  href={`/api/unduh/${k.slug}`}
                  download={k.berkas}
                >
                  <IkonUnduh />
                  Unduh CSV
                </a>
                <small>{k.berkas}</small>
              </div>
            </article>
          ))}

          <article className="kasus kasus-latihan">
            <div className="kasus-nomor">L</div>
            <div>
              <h2 className="kasus-judul">{RETAIL.judul}</h2>
              <p className="kasus-konteks">{RETAIL.konteks}</p>
              <div className="kasus-meta">
                <span className="chip">{jumlah(RETAIL.baris)} baris</span>
                <span className="chip">Transaksi ritel</span>
                <span className="chip">Latihan Power Query</span>
                <span className="chip chip-hijau">{ukuran(RETAIL.byte)}</span>
              </div>
              <p style={{ marginTop: 10, fontSize: 13, color: '#6b6353' }}>
                Dipakai pada bab awal untuk mencoba koneksi data, pembersihan, dan dashboard sebelum
                masuk ke kasus kelompok.
              </p>
            </div>
            <div className="kasus-aksi">
              <a
                className="tombol tombol-tinta tombol-kecil"
                href={`/api/unduh/${RETAIL.slug}`}
                download={RETAIL.berkas}
              >
                <IkonUnduh />
                Unduh CSV
              </a>
              <small>{RETAIL.berkas}</small>
            </div>
          </article>
        </div>

        <div className="catatan" style={{ marginBottom: 60 }}>
          <span className="catatan-ikon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
              <path d="M12 11v5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="12" cy="7.8" r="1.1" fill="currentColor" />
            </svg>
          </span>
          <div>
            <strong>Cara memuat data yang disarankan</strong>
            <p>
              Karena ukurannya besar, gunakan <em>Data → Get Data → From Text/CSV</em> di Excel lalu{' '}
              <em>Load To → Only Create Connection</em> dan masukkan ke Data Model, bukan ke
              worksheet. Cara ini menjaga berkas kerja tetap ringan saat PivotTable dan slicer
              ditambahkan.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
