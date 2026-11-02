import { createHmac, timingSafeEqual } from 'node:crypto';
import { RAHASIA } from './rahasia';

export const TOTAL_HALAMAN = 50;
export const MASA_BERLAKU = 2 * 60 * 60 * 1000; // 2 jam

function tandaTangan(kedaluwarsa) {
  return createHmac('sha256', RAHASIA).update(String(kedaluwarsa)).digest('base64url');
}

export function buatToken(sekarang = Date.now()) {
  const kedaluwarsa = sekarang + MASA_BERLAKU;
  return `${kedaluwarsa}.${tandaTangan(kedaluwarsa)}`;
}

export function tokenSah(token) {
  if (typeof token !== 'string') return false;
  const [kedaluwarsa, nilai] = token.split('.');
  if (!kedaluwarsa || !nilai) return false;

  const waktu = Number(kedaluwarsa);
  if (!Number.isFinite(waktu) || waktu < Date.now()) return false;

  const harapan = Buffer.from(tandaTangan(waktu));
  const diterima = Buffer.from(nilai);
  return diterima.length === harapan.length && timingSafeEqual(diterima, harapan);
}

export function berkasHalaman(nomor) {
  return `halaman-${String(nomor).padStart(2, '0')}.jpg`;
}
