const CACHE_NAME = "pause-now-v1-final-3";

const ASSETS = [
  "./",
  "index.html",
  "styles.css",
  "app.js",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png",

  // Ambient
  "sounds/birds.mp3",
  "sounds/rain.mp3",
  "sounds/fire.mp3",
  "sounds/ocean.mp3",

  // Cues SV
  "sounds/ready_sv.mp3",
  "sounds/sv_in.mp3",
  "sounds/sv_hold.mp3",
  "sounds/sv_out.mp3",
  "sounds/done_sv.mp3",

  // Cues EN
  "sounds/ready_en.mp3",
  "sounds/en_in.mp3",
  "sounds/en_hold.mp3",
  "sounds/en_out.mp3",
  "sounds/done_en.mp3",

  // Purpose SV
  "sounds/purpose_scroll_sv.mp3",
  "sounds/purpose_stress_sv.mp3",
  "sounds/purpose_adhd_sv.mp3",
  "sounds/purpose_school_sv.mp3",

  // Purpose EN
  "sounds/purpose_scroll_en.mp3",
  "sounds/purpose_stress_en.mp3",
  "sounds/purpose_adhd_en.mp3",
  "sounds/purpose_school_en.mp3"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE_NAME ? null : caches.delete(k))))
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
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(()=>{});
        return res;
      }).catch(() => cached);
    })
  );
});