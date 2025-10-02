# Admin Dashboard - React + Radix UI + Supabase

Kerangka dasar Single Page Application (SPA) untuk dashboard admin dengan autentikasi email/password Supabase, login via magic link, dan contoh kanal realtime.

## Fitur
- Login menggunakan Supabase Auth (password & magic link).
- Halaman dashboard terlindungi dengan guard route.
- Integrasi Radix UI (`@radix-ui/themes`) untuk komponen siap pakai.
- Langganan realtime Supabase untuk tabel `dashboard_items`.

## Persiapan
1. Salin `.env.example` menjadi `.env` lalu isi:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
2. Pastikan Supabase memiliki tabel minimal berikut untuk demo realtime:
   ```sql
   create table if not exists public.dashboard_items (
     id uuid primary key default gen_random_uuid(),
     event_type text,
     payload jsonb,
     created_at timestamptz default now()
   );
   ```
   Aktifkan Realtime untuk tabel tersebut melalui dashboard Supabase ("Toggle Realtime" > "On").

## Menjalankan lokal
```bash
npm install
npm run dev
```
Aplikasi tersedia di `http://localhost:5173`.

## Rekomendasi berikutnya
- Tambah halaman lain (manajemen user, laporan, dsb.).
- Sediakan form untuk membuat data `dashboard_items` langsung dari dashboard.
- Pasang proteksi Role Based Access Control (RLS) pada tabel Supabase.
