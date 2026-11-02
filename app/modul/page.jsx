import PdfViewer from '@/components/PdfViewer';

export const metadata = {
  title: 'Modul Praktikum (hanya baca)',
  description: 'Baca modul praktikum Analisa Bisnis langsung di browser tanpa mengunduhnya.',
};

export default function HalamanModul() {
  return (
    <main className="modul-tata">
      <div className="modul-kepala">
        <div className="modul-judul">
          <div>
            <span>Modul praktikum · 50 halaman</span>
            <h1>Analitika Data untuk Akuntansi</h1>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="lencana-baca">Hanya baca</span>
          <a className="tombol tombol-tinta tombol-kecil" href="/data">
            Unduh data kasus
          </a>
        </div>
      </div>

      <PdfViewer />
    </main>
  );
}
