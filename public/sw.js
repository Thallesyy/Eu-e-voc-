const CACHE_NAME = 'eu-e-voce-v4';
const STATIC_CACHE = 'static-v4';
const IMAGE_CACHE = 'images-v4';

// Assets essenciais para o app shell
const APP_SHELL = [
  '/',
  '/index.html'
];

// Instalação: cache do app shell
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(APP_SHELL);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] Install failed:', err);
      })
  );
});

// Ativação: limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== IMAGE_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch: estratégia de caching
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Estratégia 1: Cache-First para recursos estáticos (CSS, JS, fontes)
  if (request.destination === 'style' || request.destination === 'script' || request.destination === 'font') {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            // Atualiza em background
            fetch(request)
              .then((networkResponse) => {
                caches.open(STATIC_CACHE)
                  .then((cache) => cache.put(request, networkResponse.clone()));
              })
              .catch(() => {});
            return response;
          }
          return fetch(request)
            .then((networkResponse) => {
              return caches.open(STATIC_CACHE)
                .then((cache) => {
                  cache.put(request, networkResponse.clone());
                  return networkResponse;
                });
            });
        })
    );
    return;
  }

  // Estratégia 2: Stale-While-Revalidate para imagens
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE)
        .then((cache) => {
          return cache.match(request)
            .then((response) => {
              const fetchPromise = fetch(request)
                .then((networkResponse) => {
                  if (networkResponse.ok) {
                    cache.put(request, networkResponse.clone());
                  }
                  return networkResponse;
                })
                .catch(() => null);

              return response || fetchPromise;
            });
        })
    );
    return;
  }

  // Estratégia 3: Network-First para HTML (conteúdo dinâmico)
  if (request.destination === 'document' || request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          return caches.open(STATIC_CACHE)
            .then((cache) => {
              cache.put(request, networkResponse.clone());
              return networkResponse;
            });
        })
        .catch(() => {
          return caches.match(request)
            .then((response) => {
              if (response) {
                return response;
              }
              // Fallback offline
              return new Response(
                `<!DOCTYPE html>
                <html>
                <head><title>Offline</title></head>
                <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                  <h1>📱 Sem conexão</h1>
                  <p>Esta página não está disponível offline.</p>
                  <button onclick="location.reload()">Tentar novamente</button>
                </body>
                </html>`,
                { headers: { 'Content-Type': 'text/html' } }
              );
            });
        })
    );
    return;
  }

  // Estratégia padrão: tenta network, fallback para cache
  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
  );
});

// Background Sync para ações pendentes
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-music-progress') {
    event.waitUntil(syncMusicProgress());
  }
});

async function syncMusicProgress() {
  // Sincronizar progresso de música quando voltar online
  console.log('[SW] Syncing music progress...');
}

// Push notifications (preparado para futuro)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'Nova mensagem de amor! 💕',
    icon: 'icon-192x192.png',
    badge: 'icon-72x72.png',
    tag: 'love-message',
    requireInteraction: true,
    actions: [
      { action: 'open', title: 'Abrir' },
      { action: 'close', title: 'Fechar' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Eu e você ❤️', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CACHE_IMAGES') {
    // Pré-cachear imagens específicas
    caches.open(IMAGE_CACHE)
      .then((cache) => {
        return Promise.all(
          event.data.urls.map((url) => {
            return fetch(url)
              .then((response) => cache.put(url, response))
              .catch((err) => console.error('[SW] Failed to cache:', url, err));
          })
        );
      });
  }
});

console.log('[SW] Service Worker loaded');
