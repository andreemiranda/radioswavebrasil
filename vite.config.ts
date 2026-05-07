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
        // ── Estratégia de registro do Service Worker ──────────────────────
        registerType: 'autoUpdate',
        // autoUpdate: atualiza o SW silenciosamente quando há nova versão
        // sem precisar de prompt de confirmação do usuário

        // ── Inclui o SW no build ──────────────────────────────────────────
        injectRegister: 'auto',

        // ── Dev: habilita SW em desenvolvimento para testes ───────────────
        // devOptions: {
        //   enabled: true,
        //   type: 'module',
        // },

        // ── Workbox: configuração de cache ────────────────────────────────
        workbox: {
          // Arquivos pré-cacheados no install do SW (shell do app)
          globPatterns: [
            '**/*.{js,css,html}',
            '**/*.{svg,png,ico,webp}',
            '**/*.{woff,woff2,ttf}',
          ],

          // Estratégias de cache por tipo de recurso
          runtimeCaching: [
            // ── Google Fonts (CSS) ────────────────────────────────────────
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'google-fonts-stylesheets',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              },
            },
            // ── Google Fonts (arquivos de fonte) ──────────────────────────
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            // ── Radio Browser API ─────────────────────────────────────────
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
            // ── Imagens de estações de rádio (favicons externos) ──────────
            {
              urlPattern: /^https?:\/\/.*\.(png|jpg|jpeg|svg|ico|webp)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'radio-station-images',
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30 dias
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            // ── Streams de áudio: NUNCA cachear ──────────────────────────
            // Streams ao vivo não podem ser cacheados (são infinitos e dinâmicos)
            {
              urlPattern: /\.(mp3|aac|ogg|m3u8|m3u|pls|asx|wma)(\?.*)?$/i,
              handler: 'NetworkOnly', // sempre da rede, nunca do cache
              options: { cacheName: 'audio-streams' },
            },
          ],

          // Limpa caches antigos de versões anteriores do SW
          cleanupOutdatedCaches: true,

          // Ignora parâmetros de URL ao verificar o cache
          ignoreURLParametersMatching: [/^utm_/, /^fbclid/, /^ref/],

          // Permite navegação offline (SPA fallback)
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//],
        },

        // ── Web App Manifest ──────────────────────────────────────────────
        manifest: {
          name: 'Radio Wave Brasil',
          short_name: 'RadioWave',
          description: 'Ouça as melhores rádios do Brasil ao vivo. Sertanejo, Pagode, MPB, Rock, Gospel e Notícias. Grátis, sem anúncios.',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          // standalone: abre como app nativo (sem barra de endereço)
          // outras opções: 'fullscreen' | 'minimal-ui' | 'browser'
          display_override: ['standalone', 'minimal-ui'],
          background_color: '#1a1d26',
          theme_color: '#009C3B',
          lang: 'pt-BR',
          dir: 'ltr',
          orientation: 'portrait-primary',
          categories: ['music', 'entertainment', 'lifestyle'],

          // ── Ícones ───────────────────────────────────────────────────────
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
              // maskable: ícone com safe zone para Android adaptive icons
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

          // ── Screenshots (exibidas na tela de instalação do PWA) ──────────
          screenshots: [
            {
              src: '/og-image.png',
              sizes: '1200x630',
              type: 'image/png',
              form_factor: 'wide',
              label: 'Radio Wave Brasil — Tela principal desktop',
            },
            {
              src: '/og-image.png',
              sizes: '1200x630',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Radio Wave Brasil — Tela principal mobile',
            },
          ],

          // ── Shortcuts (atalhos no ícone do app — Android long-press) ─────
          shortcuts: [
            {
              name: 'Rádios Top',
              short_name: 'Top',
              description: 'Ver as rádios mais populares do Brasil',
              url: '/?tab=top',
              icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'Favoritos',
              short_name: 'Favoritos',
              description: 'Suas rádios favoritas',
              url: '/?tab=favorites',
              icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'Buscar Rádio',
              short_name: 'Buscar',
              description: 'Buscar rádios por nome ou gênero',
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
