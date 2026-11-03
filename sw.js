/* Clinic Departure Navi Web Push Service Worker V0.3.0 */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('push',event=>{
  // Apple requires user-visible notifications, not silent pushes.
  let msg={title:'診察出発ナビ',body:'通知が届きました。アプリを開いて確認してください。',tag:'clinic-general'};
  try{if(event.data){const parsed=event.data.json();if(parsed&&typeof parsed==='object')msg={...msg,...parsed};}}catch(_){/* use safe defaults */}
  const title=String(msg.title||'診察出発ナビ').slice(0,80);
  const options={body:String(msg.body||'アプリを開いて確認してください。').slice(0,220),
    icon:'./icon-192.png',badge:'./icon-192.png',tag:String(msg.tag||'clinic-general').slice(0,80),
    renotify:true,requireInteraction:false,data:{url:self.registration.scope}};
  event.waitUntil(self.registration.showNotification(title,options));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  event.waitUntil((async()=>{
    const all=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of all){if(client.url.startsWith(self.registration.scope))return client.focus();}
    return self.clients.openWindow(self.registration.scope);
  })());
});
