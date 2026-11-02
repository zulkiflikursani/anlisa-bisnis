import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import path from 'node:path';
import { TOTAL_HALAMAN, berkasHalaman, tokenSah } from '@/lib/modul';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { nomor } = await params;
  const token = new URL(request.url).searchParams.get('t');

  if (!tokenSah(token)) {
    return new Response('Sesi tidak valid. Muat ulang halaman modul.', {
      status: 401,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const urutan = Number(nomor);
  if (!Number.isInteger(urutan) || urutan < 1 || urutan > TOTAL_HALAMAN) {
    return new Response('Halaman tidak ditemukan.', { status: 404 });
  }

  const berkas = path.join(process.cwd(), 'assets', 'halaman', berkasHalaman(urutan));

  let info;
  try {
    info = await stat(berkas);
  } catch {
    return new Response('Halaman tidak tersedia.', { status: 404 });
  }

  return new Response(Readable.toWeb(createReadStream(berkas)), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Length': String(info.size),
      'Content-Disposition': 'inline',
      'Cache-Control': 'private, max-age=600, no-transform',
      'X-Content-Type-Options': 'nosniff',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'X-Robots-Tag': 'noindex, noimageindex',
    },
  });
}
