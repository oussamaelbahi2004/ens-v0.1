
const CACHE_NAME = 'moustakbali-v2-offline-complete';
const ASSETS_TO_CACHE = [
    '/',
    '/Communication.html',
    '/FRDETERMINONTCOURE.html',
    '/FRDETERMINONTGAME.html',
    '/Futur Antérieur.html',
    '/L'Imparfait.html',
    '/MTU CHAP 1.html',
    '/MTU CHAP 2.html',
    '/MTU CHAP 3.html',
    '/MTU CHAP 4.html',
    '/Présent de l'indicatif.html',
    '/QUIZ1SVT.html',
    '/SE5IYARATBIDA5OJIYACOURE.html',
    '/SE5IYARATBIDA5OJIYAGAME.html',
    '/SEAWAMILAHDAFCOURE.html',
    '/SEAWAMILAHDAFGAME.html',
    '/SEHISTORYCOURE.html',
    '/SEHISTORYGAME1.html',
    '/SEHISTORYGAME2.html',
    '/SEITIJAHATCOURE.html',
    '/SEITIJAHATGAME.html',
    '/SEMA7TATISLA7COURE.html',
    '/SEMA7TATISLA7GAME.html',
    '/SEMAFAHIMCOURE.html',
    '/SEMAFAHIMGAME.html',
    '/SENADARIYATCOURE.html',
    '/SENADARIYATGAME.html',
    '/conjugu.html',
    '/futur simple.html',
    '/game1.html',
    '/game2.html',
    '/game3.html',
    '/game4.html',
    '/game5.html',
    '/game6.html',
    '/game7.html',
    '/index.html',
    '/manifest.json',
    '/menu.html',
    '/part 1.html',
    '/part 10.html',
    '/part 11.html',
    '/part 12.html',
    '/part 2.html',
    '/part 3.html',
    '/part 4.html',
    '/part 5.html',
    '/part 6.html',
    '/part 7.html',
    '/part 8.html',
    '/part 9.html',
    '/passe compose.html',
    '/passé antérieur.html',
    '/passé simple.html',
    '/plus-que-parfait.html',
    '/pwa.js',
    '/service-worker.js',
    '/subjonctif presont.html',
    '/أقسام الاسم.html',
    '/أقسام الفعل (الزمن + البنية).html',
    '/أقسام الكلام والميزان الصرفي.html',
    '/إسناد الأفعال للضمائر.html',
    '/التثنية والجمع.html',
    '/التصغير والنسب.html',
    '/المصادر والمشتقات.html',
    '/خصائص الفعل.html',
    '/لإعلال، الإبدال، والعدد.html',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Outfit:wght@300;400;600;800&display=swap',
    'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:wght@300;400;600&family=Cairo:wght@400;700&display=swap'
];

// 1. INSTALL: Force caching of ALL assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing & Caching all files...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// 2. ACTIVATE: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// 3. FETCH: Cache First Strategy for Offline Support
self.addEventListener('fetch', (event) => {
    // Skip cross-origin or non-GET requests if needed, but for fonts/CDN we want them.
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Return cached response if found
            if (cachedResponse) {
                return cachedResponse;
            }

            // Otherwise, fetch from network
            return fetch(event.request).then((networkResponse) => {
                // Check if valid response
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                // Cache the new resource dynamically (if it wasn't in pre-cache)
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });

                return networkResponse;
            }).catch(() => {
                // Offline fallback
                console.log('[Service Worker] Fetch failed; offline and not in cache.');
                // Optional: return offline.html if available
            });
        })
    );
});
