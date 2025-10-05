# Panduan Deployment ke Netlify

## Persiapan Project

Project ArtaPay telah dikonfigurasi untuk deployment ke Netlify dengan optimasi berikut:

### 1. Build Configuration
- **Script build web**: `npm run build:web` - khusus untuk web deployment
- **Output folder**: `dist/` - hasil build untuk web
- **Optimasi bundle**: Vendor chunks terpisah untuk caching yang lebih baik

### 2. Netlify Configuration
File `netlify.toml` telah dikonfigurasi dengan:
- Build command: `npm run build:web`
- Publish directory: `dist`
- Node.js version: 18
- SPA redirects untuk React Router
- Security headers
- Cache optimization untuk static assets

### 3. Environment Variables
Template environment variables tersedia di:
- `.env.example` - untuk development
- `.env.production` - untuk production

## Langkah Deployment

### 1. Setup Environment Variables di Netlify
Di dashboard Netlify, tambahkan environment variables berikut:
```
VITE_SUPABASE_URL=https://your-production-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_APP_ENV=production
```

### 2. Deploy via Git
1. Push project ke repository Git (GitHub, GitLab, atau Bitbucket)
2. Connect repository ke Netlify
3. Netlify akan otomatis detect `netlify.toml` dan menggunakan konfigurasi yang sudah disiapkan

### 3. Deploy via Netlify CLI (Opsional)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login ke Netlify
netlify login

# Deploy
netlify deploy --prod
```

## Optimasi yang Sudah Diterapkan

### 1. Bundle Splitting
- `vendor-react`: React, React DOM, React Router
- `vendor-radix`: Radix UI components
- `vendor-supabase`: Supabase client
- `vendor-utils`: Utility libraries (date-fns, nanoid, lucide-react)

### 2. Build Optimizations
- Modern ES2020 target untuk web browsers
- Minification dengan esbuild
- Compressed assets
- Optimized chunk sizes

### 3. Security & Performance
- Security headers (XSS protection, content type options, etc.)
- Cache headers untuk static assets
- SPA routing support

## Testing Build Lokal

Untuk menguji build production secara lokal:

```bash
# Build untuk web
npm run build:web

# Preview build
npm run preview
```

## Troubleshooting

### Build Errors
- Pastikan semua dependencies terinstall: `npm install`
- Clear cache jika diperlukan: `npm cache clean --force`

### Environment Variables
- Pastikan semua VITE_* variables sudah diset di Netlify
- Periksa format URL Supabase (harus https://)

### Routing Issues
- File `_redirects` dan `netlify.toml` sudah dikonfigurasi untuk SPA
- Semua routes akan redirect ke `index.html` dengan status 200

## File Konfigurasi

- `netlify.toml` - Konfigurasi build dan deployment Netlify
- `public/_redirects` - Redirect rules untuk SPA
- `vite.config.js` - Konfigurasi build Vite yang sudah dioptimasi
- `.env.production` - Template environment variables production