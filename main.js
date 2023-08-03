window.addEventListener('DOMContentLoaded', async () => {
  'use strict';

  /* eslint one-var: ["error", "consecutive"] */

  if (navigator.serviceWorker) {
    try {
      const swRegOptions = {
        scope: '/pwa-test/',
        updateViaCache: 'all',
      },
            swRegistration = await navigator.serviceWorker.register('/pwa-test/sw.js', swRegOptions);
      console.log(`Service worker registration succeeded: ${swRegistration}`);
    } catch (err) {
      console.error(`Service worker registration failed: ${err}`);
    }
  } else {
    console.error('Service workers are not supported.');
  }


}, {
  capture: false,
  once: true,
  passive: true
});
