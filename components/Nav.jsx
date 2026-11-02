'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TAUTAN = [
  { href: '/', label: 'Beranda' },
  { href: '/modul', label: 'Modul Praktikum' },
  { href: '/data', label: 'Data Kasus' },
];

export default function Nav() {
  const jalur = usePathname();

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="merek" aria-label="Beranda Praktikum Analisa Bisnis">
          <span className="merek-lambang">AB</span>
          <span className="merek-teks">
            Analisa Bisnis
            <small>Laboratorium Akuntansi</small>
          </span>
        </Link>
        <nav className="nav-tautan" aria-label="Navigasi utama">
          {TAUTAN.map((t) => {
            const aktif = t.href === '/' ? jalur === '/' : jalur.startsWith(t.href);
            return (
              <Link key={t.href} href={t.href} className={aktif ? 'aktif' : undefined}>
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
