export default function Footer() {
  return (
    <footer className="kaki">
      <div className="container kaki-isi">
        <div>
          <p>
            <strong>Praktikum Analisa Bisnis</strong> — Program Studi Akuntansi,
            Politeknik Negeri Ujung Pandang.
          </p>
          <p style={{ marginTop: 4 }}>
            Modul dan data kasus disusun untuk kegiatan praktikum di kelas; seluruh data bersifat
            sintetis dan tidak memuat data pribadi.
          </p>
        </div>
        <p>© {new Date().getFullYear()} Laboratorium Akuntansi</p>
      </div>
    </footer>
  );
}
