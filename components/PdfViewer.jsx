'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const SKALA_MIN = 0.7;
const SKALA_MAKS = 2.5;
const LANGKAH_SKALA = 0.15;
const JARAK_MUAT = 900;

async function ambilHalaman(nomor, token) {
  const jawaban = await fetch(`/api/halaman/${nomor}?t=${encodeURIComponent(token)}`, {
    cache: 'no-store',
  });
  if (!jawaban.ok) throw new Error(`Halaman ${nomor} gagal dimuat (${jawaban.status}).`);

  const url = URL.createObjectURL(await jawaban.blob());
  const gambar = await new Promise((selesai, gagal) => {
    const el = new Image();
    el.decoding = 'async';
    el.onload = () => selesai(el);
    el.onerror = () => gagal(new Error(`Gambar halaman ${nomor} gagal dibaca.`));
    el.src = url;
  }).catch((galat) => {
    URL.revokeObjectURL(url);
    throw galat;
  });
  return { url, gambar };
}

export default function PdfViewer() {
  const gulirRef = useRef(null);
  const viewerRef = useRef(null);
  const cacheRef = useRef(new Map());
  const sedangRef = useRef(new Set());

  const [status, setStatus] = useState('memuat');
  const [pesan, setPesan] = useState('');
  const [token, setToken] = useState('');
  const [jumlah, setJumlah] = useState(0);
  const [rasio, setRasio] = useState(1.4142);
  const [aktif, setAktif] = useState(1);
  const [skala, setSkala] = useState(1);

  const lepasCache = useCallback((nomor) => {
    const isi = cacheRef.current.get(nomor);
    if (!isi) return;
    URL.revokeObjectURL(isi.url);
    cacheRef.current.delete(nomor);
  }, []);

  // Ambil token sesi, lalu ukur rasio halaman dari gambar pertama.
  useEffect(() => {
    let batal = false;

    (async () => {
      const jawaban = await fetch('/api/sesi', { cache: 'no-store' });
      if (!jawaban.ok) throw new Error('Sesi modul tidak dapat dibuat.');
      const { token: kunci, total } = await jawaban.json();
      if (batal) return;

      const isi = await ambilHalaman(1, kunci);
      if (batal) {
        URL.revokeObjectURL(isi.url);
        return;
      }

      cacheRef.current.set(1, isi);
      setRasio(isi.gambar.naturalHeight / isi.gambar.naturalWidth);
      setToken(kunci);
      setJumlah(total);
      setStatus('siap');
    })().catch((galat) => {
      if (batal) return;
      setPesan(galat?.message || 'Modul gagal dimuat. Periksa koneksi lalu muat ulang halaman.');
      setStatus('galat');
    });

    return () => {
      batal = true;
      cacheRef.current.forEach((isi) => URL.revokeObjectURL(isi.url));
      cacheRef.current.clear();
    };
  }, []);

  // Sesuaikan ukuran halaman saat zoom atau rasio berubah.
  useEffect(() => {
    const akar = gulirRef.current;
    if (!akar) return;
    akar.querySelectorAll('.halaman').forEach((el) => {
      el.style.aspectRatio = String(1 / rasio);
      el.style.width = `${Math.round(skala * 100)}%`;
      el.dataset.zoom = skala > 1 ? 'ya' : 'tidak';
    });
  }, [skala, rasio, jumlah]);

  // Muat gambar halaman di sekitar posisi baca, lepaskan yang sudah jauh.
  useEffect(() => {
    if (!token || !jumlah) return;
    const akar = gulirRef.current;
    if (!akar) return;

    const pasang = async (el, nomor) => {
      if (el.dataset.siap === '1' || sedangRef.current.has(nomor)) return;
      sedangRef.current.add(nomor);

      try {
        let isi = cacheRef.current.get(nomor);
        if (!isi) {
          isi = await ambilHalaman(nomor, token);
          cacheRef.current.set(nomor, isi);
        }

        const bingkai = el.querySelector('.kanvas-bingkai');
        if (!bingkai || el.dataset.siap === '1') return;

        const salinan = isi.gambar.cloneNode();
        salinan.className = 'gambar-halaman';
        salinan.draggable = false;
        salinan.alt = `Halaman ${nomor} modul praktikum`;
        bingkai.replaceChildren(salinan);
        el.dataset.siap = '1';
      } catch (galat) {
        console.error(galat);
      } finally {
        sedangRef.current.delete(nomor);
      }
    };

    const lepas = (el) => {
      if (el.dataset.siap !== '1') return;
      el.dataset.siap = '';
      el.querySelector('.kanvas-bingkai')?.replaceChildren();
      lepasCache(Number(el.dataset.nomor));
    };

    // Sengaja memakai setTimeout, bukan requestAnimationFrame: rAF berhenti saat
    // tab tidak aktif sehingga halaman tidak akan pernah dimuat.
    let antre = 0;
    const proses = () => {
      antre = 0;
      const kotak = akar.getBoundingClientRect();
      for (const el of akar.querySelectorAll('.halaman')) {
        const r = el.getBoundingClientRect();
        const dekat = r.bottom > kotak.top - JARAK_MUAT && r.top < kotak.bottom + JARAK_MUAT;
        if (dekat) pasang(el, Number(el.dataset.nomor));
        else lepas(el);
      }
    };
    const minta = () => {
      if (antre) return;
      antre = setTimeout(proses, 30);
    };

    minta();
    akar.addEventListener('scroll', minta, { passive: true });
    window.addEventListener('resize', minta);

    return () => {
      akar.removeEventListener('scroll', minta);
      window.removeEventListener('resize', minta);
      if (antre) clearTimeout(antre);
    };
  }, [token, jumlah, lepasCache]);

  // Lacak halaman yang sedang dilihat.
  useEffect(() => {
    if (!jumlah) return;
    const akar = gulirRef.current;
    if (!akar) return;

    let antre = 0;
    const hitung = () => {
      antre = 0;
      const batas = akar.getBoundingClientRect().top + 130;
      let dekat = 1;
      let jarak = Infinity;
      for (const el of akar.querySelectorAll('.halaman')) {
        const d = Math.abs(el.getBoundingClientRect().top - batas);
        if (d < jarak) {
          jarak = d;
          dekat = Number(el.dataset.nomor);
        }
      }
      setAktif(dekat);
    };
    const saatGulir = () => {
      if (antre) return;
      antre = setTimeout(hitung, 60);
    };

    akar.addEventListener('scroll', saatGulir, { passive: true });
    hitung();

    return () => {
      akar.removeEventListener('scroll', saatGulir);
      if (antre) clearTimeout(antre);
    };
  }, [jumlah]);

  const keHalaman = useCallback((nomor) => {
    const akar = gulirRef.current;
    const el = akar?.querySelector(`.halaman[data-nomor="${nomor}"]`);
    if (!akar || !el) return;
    const atas = el.getBoundingClientRect().top - akar.getBoundingClientRect().top + akar.scrollTop;
    akar.scrollTo({ top: Math.max(0, atas - 14), behavior: 'smooth' });
  }, []);

  const ubahSkala = useCallback((delta) => {
    setSkala((kini) =>
      Math.min(SKALA_MAKS, Math.max(SKALA_MIN, Number((kini + delta).toFixed(2)))),
    );
  }, []);

  const layarPenuh = useCallback(() => {
    const el = viewerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else el.requestFullscreen?.();
  }, []);

  // Blokir pintasan simpan/cetak dan menu klik kanan pada area dokumen.
  useEffect(() => {
    const saatTombol = (e) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      const k = e.key.toLowerCase();
      if (k === 's' || k === 'p') {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', saatTombol, true);
    return () => window.removeEventListener('keydown', saatTombol, true);
  }, []);

  const persen = Math.round(skala * 100);

  return (
    <div
      className="viewer"
      ref={viewerRef}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <div className="viewer-bilah">
        <div className="bilah-kelompok">
          <button
            type="button"
            className="tombol-ikon"
            onClick={() => keHalaman(Math.max(1, aktif - 1))}
            disabled={aktif <= 1 || status !== 'siap'}
            aria-label="Halaman sebelumnya"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="indikator-halaman">
            {status === 'siap' ? `${aktif} / ${jumlah}` : '— / —'}
          </span>
          <button
            type="button"
            className="tombol-ikon"
            onClick={() => keHalaman(Math.min(jumlah, aktif + 1))}
            disabled={aktif >= jumlah || status !== 'siap'}
            aria-label="Halaman berikutnya"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="bilah-kelompok">
          <button
            type="button"
            className="tombol-ikon"
            onClick={() => ubahSkala(-LANGKAH_SKALA)}
            disabled={skala <= SKALA_MIN || status !== 'siap'}
            aria-label="Perkecil tampilan"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            className="tombol-ikon"
            onClick={() => setSkala(1)}
            aria-label="Sesuaikan lebar"
            title="Sesuaikan lebar"
          >
            <span className="persen">{persen}%</span>
          </button>
          <button
            type="button"
            className="tombol-ikon"
            onClick={() => ubahSkala(LANGKAH_SKALA)}
            disabled={skala >= SKALA_MAKS || status !== 'siap'}
            aria-label="Perbesar tampilan"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="bilah-kelompok">
          <button type="button" className="tombol-ikon" onClick={layarPenuh} aria-label="Layar penuh">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="viewer-gulir" ref={gulirRef}>
        {status === 'siap' &&
          Array.from({ length: jumlah }, (_, i) => i + 1).map((nomor) => (
            <div className="halaman" data-nomor={nomor} key={nomor}>
              <div className="kanvas-bingkai" />
            </div>
          ))}

        {status !== 'siap' && (
          <div className="viewer-status">
            <div>
              {status === 'memuat' ? (
                <>
                  <div className="pemuat" />
                  <p>Menyiapkan modul…</p>
                </>
              ) : (
                <>
                  <h2>Modul belum bisa dibuka</h2>
                  <p>{pesan}</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="cetak-blokir">
        Modul ini hanya dapat dibaca di aplikasi Praktikum Analisa Bisnis dan tidak disediakan
        untuk dicetak atau diunduh.
      </div>
    </div>
  );
}
