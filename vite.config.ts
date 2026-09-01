import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    chunkSizeWarningLimit: 600,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'og-image.png', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        id: '/',
        name: 'WinterArc habit tracker',
        short_name: 'WinterArc',
        description: 'Track a few daily habits for a fixed run of days. Start today, or run the October to December winter arc. Everything stays in your browser.',
        lang: 'en',
        dir: 'ltr',
        theme_color: '#09090b',
        background_color: '#09090b',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        // the installed app opens on the tracker; the nav still reaches every page
        start_url: '/tracker',
        categories: ['productivity', 'health', 'lifestyle'],
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // sw-notify is imported by the worker itself, so precaching it would cache it twice
        globIgnores: ['**/ThreeHero-*.js', '**/sw-notify.js'],
        // gives the generated worker a notificationclick handler without leaving generateSW
        importScripts: ['/sw-notify.js'],
        navigateFallbackDenylist: [/^\/(robots\.txt|sitemap\.xml|manifest\.webmanifest)$/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: '/index.html',
      },
      devOptions: { enabled: false }
    })
  ],
})
