import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        // â”€â”€ EstratÃ©gia de registro do Service Worker â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        registerType: 'autoUpdate',
        // autoUpdate: atualiza o SW silenciosamente quando hÃ¡ nova versÃ£o
        // sem precisar de prompt de confirmaÃ§Ã£o do usuÃ¡rio

        // â”€â”€ Inclui o SW no build â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        injectRegister: 'auto',

        // â”€â”€ Dev: habilita SW em desenvolvimento para testes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        devOptions: {
          enabled: true,
          type: 'module',
        },

        // â”€â”€ Workbox: configuraÃ§Ã£o de cache â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        workbox: {
          // Arquivos prÃ©-cacheados no install do SW (shell do app)
          globPatterns: [
            '**/*.{js,css,html}',
            '**/*.{svg,png,ico,webp}',
            '**/*.{woff,woff2,ttf}',
          ],

          // EstratÃ©gias de cache por tipo de recurso
          runtimeCaching: [
            // â”€â”€ Google Fonts (CSS) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'google-fonts-stylesheets',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              },
            },
            // â”€â”€ Google Fonts (arquivos de fonte) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            // â”€â”€ Radio Browser API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            // NetworkFirst: tenta a rede, cai no cache se offline
            {
              urlPattern: /^https:\/\/.*\.api\.radio-browser\.info\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'radio-browser-api',
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 2 }, // 2h
                cacheableResponse: { statuses: [0, 200] },
                networkTimeoutSeconds: 10,
              },
            },
            // â”€â”€ Imagens de estaÃ§Ãµes de rÃ¡dio (favicons externos) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            {
              urlPattern: /^https?:\/\/.*\.(png|jpg|jpeg|svg|ico|webp)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'radio-station-images',
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30 dias
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            // â”€â”€ Streams de Ã¡udio: NUNCA cachear â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            // Streams ao vivo nÃ£o podem ser cacheados (sÃ£o infinitos e dinÃ¢micos)
            {
              urlPattern: /\.(mp3|aac|ogg|m3u8|m3u|pls|asx|wma)(\?.*)?$/i,
              handler: 'NetworkOnly', // sempre da rede, nunca do cache
              options: { cacheName: 'audio-streams' },
            },
          ],

          // Limpa caches antigos de versÃµes anteriores do SW
          cleanupOutdatedCaches: true,

          // Ignora parÃ¢metros de URL ao verificar o cache
          ignoreURLParametersMatching: [/^utm_/, /^fbclid/, /^ref/],

          // Permite navegaÃ§Ã£o offline (SPA fallback)
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//],
        },

        // â”€â”€ Web App Manifest â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        manifest: {
          name: 'Radio Wave Brasil',
          short_name: 'RadioWave',
          description: 'OuÃ§a as melhores rÃ¡dios do Brasil ao vivo. Sertanejo, Pagode, MPB, Rock, Gospel e NotÃcias. GrÃ¡tis, sem anÃºncios.',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          // standalone: abre como app nativo (sem barra de endereÃ§o)
          // outras opÃ§Ãµes: 'fullscreen' | 'minimal-ui' | 'browser'
          display_override: ['standalone', 'minimal-ui'],
          background_color: '#1a1d26',
          theme_color: '#009C3B',
          lang: 'pt-BR',
          dir: 'ltr',
          orientation: 'portrait-primary',
          categories: ['music', 'entertainment', 'lifestyle'],

          // â”€â”€ Ã cones â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
          icons: [
            {
              src: '/favicon-16x16.png',
              sizes: '16x16',
              type: 'image/png',
            },
            {
              src: '/favicon-32x32.png',
              sizes: '32x32',
              type: 'image/png',
            },
            {
              src: '/favicon-96x96.png',
              sizes: '96x96',
              type: 'image/png',
            },
            {
              src: '/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icon-192x192-maskable.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
              // maskable: Ãcone com safe zone para Android adaptive icons
            },
            {
              src: '/icon-256x256.png',
              sizes: '256x256',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icon-384x384.png',
              sizes: '384x384',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icon-512x512-maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/favicon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],

          // â”€â”€ Screenshots (exibidas na tela de instalaÃ§Ã£o do PWA) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
          screenshots: [
            {
              src: '/og-image.png',
              sizes: '1200x630',
              type: 'image/png',
              form_factor: 'wide',
              label: 'Radio Wave Brasil â€” Tela principal desktop',
            },
            {
              src: '/og-image.png',
              sizes: '1200x630',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Radio Wave Brasil â€” Tela principal mobile',
            },
          ],

          // â”€â”€ Shortcuts (atalhos no Ãcone do app â€” Android long-press) â”€â”€â”€â”€â”€
          shortcuts: [
            {
              name: 'RÃ¡dios Top',
              short_name: 'Top',
              description: 'Ver as rÃ¡dios mais populares do Brasil',
              url: '/?tab=top',
              icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'Favoritos',
              short_name: 'Favoritos',
              description: 'Suas rÃ¡dios favoritas',
              url: '/?tab=favorites',
              icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'Buscar RÃ¡dio',
              short_name: 'Buscar',
              description: 'Buscar rÃ¡dios por nome ou gÃªnero',
              url: '/?tab=search',
              icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
            },
          ],
        },
      }),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            query: ['@tanstack/react-query'],
          },
        },
      },
    },

    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api': {
          target: 'https://de1.api.radio-browser.info/json',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: true,
        },
      },
    },
  };
});
