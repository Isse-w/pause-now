const CACHE = "pause-now-v6";

const ASSETS = [
  "./",
  "index.html",
  "app.js",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png",

  "sounds/rain.mp3",
  "sounds/birds.mp3",
  "sounds/fire.mp3",

  "sounds/coach_scroll.mp3",
  "sounds/coach_scroll_en.mp3",
  "sounds/coach_stress.mp3",
  "sounds/coach_stress_en.mp3",
  "sounds/coach_adhd.mp3",
  "sounds/coach_adhd_en.mp3",
  "sounds/coach_school.mp3",
  "sounds/coach_school_en.mp3",

  "sounds/sv_ready.mp3",
  "sounds/sv_in.mp3",
  "sounds/sv_hold.mp3",
  "sounds/sv_out.mp3",
  "sounds/sv_done.mp3",

  "sounds/en_ready.mp3",
  "sounds/en_in.mp3",
  "sounds/en_hold.mp3",
  "sounds/en_out.mp3",
  "sounds/en_done.mp3"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE ? null : caches.delete(k))))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(()=>{});
        return res;
      }).catch(() => cached);
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "./";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});