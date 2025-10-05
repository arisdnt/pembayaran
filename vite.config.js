import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Prevent vite from obscuring rust errors
  clearScreen: false,

  // Tauri expects a fixed port, fail if that port is not available
  server: {
    host: host || '0.0.0.0',
    port: 5175,
    strictPort: true,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 5175,
        }
      : undefined,
  },

  // to access the Tauri environment variables set by the CLI with information about the current target
  envPrefix: ['VITE_', 'TAURI_ENV_*'],

  build: {
    // Target modern browsers for web deployment, fallback to Tauri targets for desktop
    target: process.env.TAURI_ENV_PLATFORM 
      ? (process.env.TAURI_ENV_PLATFORM == 'windows' ? 'chrome105' : 'safari13')
      : 'es2020',
    
    // Minify for production builds
    minify: process.env.NODE_ENV === 'production' ? 'esbuild' : !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
    
    // Sourcemaps for debug builds or development
    sourcemap: !!process.env.TAURI_ENV_DEBUG || process.env.NODE_ENV === 'development',

    outDir: 'dist',
    assetsDir: 'assets',

    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching and loading
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-radix': ['@radix-ui/themes', '@radix-ui/react-icons'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-utils': ['date-fns', 'nanoid', 'lucide-react']
        }
      }
    },

    // Optimization settings
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false, // Faster builds
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js']
  }
})
