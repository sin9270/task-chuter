'use strict';

const CACHE_VERSION = 1;
const CACHE_NAME = `SimpleTaskChute-v${CACHE_VERSION}`;
const contentToCache = ['./index.html', './bundle.js'];

// Service Worker へファイルをインストールする
self.addEventListener('install', event => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(contentToCache);
    })
  );
});

// リクエストされたファイルが Service Worker にキャッシュされている場合、キャッシュから返す
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      console.log('[Service Worker] Fetching resource: ' + event.request.url);
      return (
        response ||
        fetch(event.request).then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            console.log(
              '[Service Worker] Caching new resource: ' + event.request.url
            );
            cache.put(event.request, response.clone());
            return response;
          });
        })
      );
    })
  );
});

// Cache Storage にキャッシュされているサービスワーカーのkeyに変更があった場合、古いキャッシュを全て削除する
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (!CACHE_NAME.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
