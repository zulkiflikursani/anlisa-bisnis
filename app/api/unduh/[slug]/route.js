import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { createGunzip } from 'node:zlib';
import path from 'node:path';
import { cariKasus } from '@/lib/kasus';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// CSV disimpan terkompresi di data/ (di luar public/). Route ini membuka gzip
// dan mengalirkannya sebagai unduhan biasa, sehingga pengunjung menerima .csv
// dengan nama berkas yang benar tanpa perlu alat tambahan.
export async function GET(request, { params }) {
  const { slug } = await params;
  const kasus = cariKasus(slug);

  if (!kasus) {
    return new Response('Data tidak ditemukan.', { status: 404 });
  }

  const berkas = path.join(process.cwd(), 'data', kasus.arsip);

  try {
    await stat(berkas);
  } catch {
    return new Response('Berkas data belum tersedia.', { status: 404 });
  }

  const aliran = createReadStream(berkas).pipe(createGunzip());

  return new Response(Readable.toWeb(aliran), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${kasus.berkas}"`,
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
