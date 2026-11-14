/* Service Worker: speichert die App auf dem Gerät, damit sie ohne Internet läuft. Bei Änderungen die Versionsnummer V erhöhen. */
var V='fp-labor-v1';
var FILES=["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable.png", "apple-touch-icon.png", "chakra-petch-latin-500-normal.woff2", "chakra-petch-latin-600-normal.woff2", "chakra-petch-latin-700-normal.woff2", "share-tech-mono-latin-400-normal.woff2"];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(V).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(function(hit){
    var net=fetch(r).then(function(res){
      if(res&&res.ok){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)})}
      return res;
    }).catch(function(){return hit||(r.mode==='navigate'?caches.match('index.html'):undefined)});
    return hit||net;
  }));
});
