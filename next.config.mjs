/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gambar halaman dan arsip CSV berada di luar public/ supaya tidak punya URL
  // statis. Keduanya dibaca route handler, jadi harus ikut dikemas oleh Vercel.
  outputFileTracingIncludes: {
    '/api/halaman/[nomor]': ['./assets/halaman/**'],
    '/api/unduh/[slug]': ['./data/**'],
  },
};

export default nextConfig;
