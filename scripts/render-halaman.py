#!/usr/bin/env python3
"""Mengubah setiap halaman PDF menjadi gambar WebP bertanda air.

Aplikasi tidak menyimpan berkas PDF sama sekali: yang dikirim ke browser hanya
gambar halaman. Jalankan ulang skrip ini bila isi modul berubah.

Contoh:
    .venv/bin/python web-praktikum/scripts/render-halaman.py \
        --pdf "assets/Panduan_Praktikum_Analisa_Bisnis.pdf" \
        --keluar web-praktikum/assets/halaman \
        --lebar 1800
"""

import argparse
import pathlib

import fitz

AIR = "HANYA BACA · PRAKTIKUM ANALISA BISNIS"
KAKI = "PRAKTIKUM ANALISA BISNIS · HANYA BACA"


def beri_tanda_air(halaman: fitz.Page) -> None:
    lebar, tinggi = halaman.rect.width, halaman.rect.height
    font = fitz.Font("helv")
    ukuran = max(8.0, lebar * 0.011)

    for baris in range(4):
        for kolom in range(3):
            x = lebar * (0.02 + kolom * 0.34) + (baris % 2) * lebar * 0.09
            y = tinggi * (0.10 + baris * 0.24)
            penulis = fitz.TextWriter(halaman.rect, color=(0.22, 0.28, 0.36), opacity=0.10)
            penulis.append(fitz.Point(x, y), AIR, font=font, fontsize=ukuran)
            penulis.write_text(halaman, morph=(fitz.Point(x, y), fitz.Matrix(28)))

    penulis = fitz.TextWriter(halaman.rect, color=(0.35, 0.37, 0.41), opacity=0.6)
    penulis.append(
        fitz.Point(lebar * 0.05, tinggi - 14),
        KAKI,
        font=font,
        fontsize=max(6.0, lebar * 0.0075),
    )
    penulis.write_text(halaman)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf", required=True, help="Berkas PDF sumber (di luar folder aplikasi)")
    parser.add_argument("--keluar", required=True, help="Folder tujuan gambar halaman")
    parser.add_argument("--lebar", type=int, default=1800, help="Lebar gambar dalam piksel")
    args = parser.parse_args()

    sumber = pathlib.Path(args.pdf)
    tujuan = pathlib.Path(args.keluar)
    tujuan.mkdir(parents=True, exist_ok=True)

    for lama in list(tujuan.glob("halaman-*.webp")) + list(tujuan.glob("halaman-*.jpg")):
        lama.unlink()

    dokumen = fitz.open(sumber)
    total = 0
    for indeks, halaman in enumerate(dokumen, start=1):
        beri_tanda_air(halaman)
        zoom = args.lebar / halaman.rect.width
        pix = halaman.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
        keluaran = tujuan / f"halaman-{indeks:02d}.jpg"
        pix.save(keluaran, jpg_quality=82)
        total += keluaran.stat().st_size

    print(f"{len(dokumen)} halaman, total {total / 1048576:.1f} MB")
    dokumen.close()


if __name__ == "__main__":
    main()
