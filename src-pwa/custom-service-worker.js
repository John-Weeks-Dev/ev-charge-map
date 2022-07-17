/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxPluginMode is set to "InjectManifest"
 */

import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)
const bgSync = 'sync' in self.registration
console.log('bgSync', bgSync)

registerRoute(
  ({ url }) => url.pathname.startsWith('http'),
  new StaleWhileRevalidate()
)
