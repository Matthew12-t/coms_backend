# COMS Backend

API utama untuk sistem **C.O.M.S (Canteen Occupancy Monitoring System)**. Menangani autentikasi pengguna, data kantin, log kepadatan, prediksi AI, notifikasi, preferensi, menu, dan analitik.

## Cara Kerja

Backend ini bertindak sebagai gateway antara frontend (web & mobile), layanan AI, dan database Supabase. Setiap request dari client diproses di sini sebelum data disimpan atau dikembalikan.

## Stack

- **Node.js + Express 5**
- **Supabase** (PostgreSQL + Auth)
- dotenv, CORS

## Requirements

- Node.js 18+
- npm
- Akun Supabase

## Instalasi & Menjalankan Lokal

```bash
npm install
cp .env.example .env
# Isi .env dengan kredensial Supabase kamu
npm run dev
```

Server berjalan di `http://localhost:3000`.

## Setup Database

1. Buat project baru di [Supabase](https://supabase.com)
2. Buka SQL Editor, jalankan `db/schema.sql` (membuat tabel, view, dan RLS)
3. Opsional: jalankan `db/seed.sql` untuk data kantin contoh
4. Salin Project URL dan `service_role` key ke file `.env`

## Environment Variables

| Variable | Keterangan |
|----------|------------|
| `SUPABASE_URL` | URL project Supabase |
| `SUPABASE_KEY` | Service role key Supabase |

## API Endpoints

| Method | Path | Auth | Keterangan |
|--------|------|------|------------|
| GET | `/health` | - | Liveness probe |
| POST | `/api/auth/register` | - | Daftar akun baru |
| POST | `/api/auth/login` | - | Login, mengembalikan session |
| POST | `/api/auth/logout` | - | Logout |
| GET | `/api/auth/me` | ✓ | Data user saat ini |
| GET | `/api/canteens` | - | Semua kantin aktif |
| GET | `/api/canteens/:id` | - | Detail satu kantin |
| GET | `/api/canteens/:id/history` | - | Riwayat kepadatan kantin |
| GET | `/api/occupancy/latest` | - | Kepadatan terbaru per kantin |
| POST | `/api/occupancy` | - | Catat log kepadatan manual |
| POST | `/api/predictions` | - | Ingress hasil prediksi dari AI |
| GET | `/api/notifications` | ✓ | Daftar notifikasi user |
| POST | `/api/notifications` | ✓ | Subscribe notifikasi |
| DELETE | `/api/notifications/:id` | ✓ | Unsubscribe notifikasi |
| GET | `/api/preferences` | ✓ | Preferensi & favorit user |
| PUT | `/api/preferences` | ✓ | Simpan preferensi |
| GET | `/api/menus?canteen_id=` | - | Daftar menu kantin |
| POST | `/api/menus` | - | Tambah item menu |
| GET | `/api/analytics/peak-hours` | - | Agregat jam sibuk |
| GET | `/api/analytics/daily-averages` | - | Agregat harian |
| GET | `/api/analytics/recommendations` | - | Rekomendasi kantin terbaik |

## Deploy

Backend di-deploy ke **Railway**.

### Langkah Deploy ke Railway

**URL Produksi:** `https://web-production-e34ad.up.railway.app`
