'use strict';
const PREFIX='classroom-mobile-',CACHE=PREFIX+'a01d4cb998815ffb';
const ASSETS=["index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 try{for(const name of ASSETS){const url=new URL(name,self.registration.scope);const response=await fetch(url,{cache:'reload',credentials:'same-origin'});if(!response.ok||response.redirected)throw Error('Incomplete app download');if(name==='index.html'&&!(await response.clone().text()).includes('id="classroom-data"'))throw Error('Unexpected document');await cache.put(url,response);}if(!self.registration.active)await self.skipWaiting();}
 catch(error){await caches.delete(CACHE);throw error;}
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url),scope=new URL(self.registration.scope);
 if(event.request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 const relative=url.pathname.slice(scope.pathname.length);
 const name=event.request.mode==='navigate'&&['','index.html'].includes(relative)?'index.html':relative;
 if(!ASSETS.includes(name))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(new URL(name,scope))||fetch(event.request);})());
});
