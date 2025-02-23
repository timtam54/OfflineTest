// This is a custom service worker to handle offline functionality
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open("offline-cache")
      .then((cache) => cache.addAll(["/", "/offline", "/manifest.json", "/icon-192x192.png", "/icon-512x512.png"])),
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response
      }

      return fetch(event.request)
        .then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response
          var responseToCache = response.clone()

          caches.open("offline-cache").then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // If the network request fails, return the offline page
          return caches.match("/offline")
        })
    }),
  )
})

// Clean up old caches
self.addEventListener("activate", (event) => {
  var cacheWhitelist = ["offline-cache"]

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      ),
    ),
  )
})

