import { TOTAL_HALAMAN, buatToken } from '@/lib/modul';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(
    { token: buatToken(), total: TOTAL_HALAMAN },
    {
      headers: {
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Robots-Tag': 'noindex',
      },
    },
  );
}
