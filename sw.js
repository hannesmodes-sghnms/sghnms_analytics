/*
 * Analytics bleibt absichtlich network-only.
 *
 * Das Dashboard soll perspektivisch serverseitig kennwortgeschuetzt laufen.
 * Ein Offline-Cache wuerde bereits geladene HTML-/JSON-Daten auf dem Endgeraet
 * weiter verfuegbar halten und damit eine spaetere serverseitige Sperre
 * teilweise umgehen. Der Service Worker dient daher nur der PWA-Integration
 * und cacht keine geschuetzten Inhalte.
 */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    self.clients.claim()
  );
});

self.addEventListener("fetch", (event) => {
  const request =
    event.request;

  if (
    request.method !== "GET"
  ) {
    return;
  }

  const url =
    new URL(
      request.url
    );

  if (
    url.origin !==
    self.location.origin
  ) {
    return;
  }

  event.respondWith(
    fetch(request)
  );
});
