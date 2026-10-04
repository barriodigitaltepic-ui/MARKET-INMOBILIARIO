const CACHE_NAME = "market-inmobiliario-v1";

const ARCHIVOS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",

  "./images/icon-192.png",
  "./images/icon-512.png",

  "./images/market-hero.jpg",
  "./images/inmobiliarias-banner.jpg",
  "./images/asesores-banner.jpg",
  "./images/propiedades-bg.jpg",
  "./images/logo-barrio-digital.png"
];

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ARCHIVOS))
      .then(() => self.skipWaiting())

  );

});


self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys =>

      Promise.all(

        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))

      )

    ).then(() => self.clients.claim())

  );

});


self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") return;

  event.respondWith(

    fetch(event.request)
      .then(response => {

        const copia = response.clone();

        caches.open(CACHE_NAME)
          .then(cache => cache.put(event.request, copia));

        return response;

      })
      .catch(() => caches.match(event.request))

  );

});
