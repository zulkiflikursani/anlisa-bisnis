import './globals.css';
import Nav from '@/components/Nav';

export const metadata = {
  title: {
    default: 'Praktikum Analisa Bisnis — Modul & Data Kasus',
    template: '%s · Praktikum Analisa Bisnis',
  },
  description:
    'Modul praktikum Analisa Bisnis untuk mahasiswa Akuntansi: baca panduan langsung di browser tanpa unduhan, dan unduh data kasus CSV untuk diolah sendiri di Excel.',
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#10233a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
