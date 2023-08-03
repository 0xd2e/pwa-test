/* eslint no-restricted-globals: ["off", "self"] */

const APP_PREFIX = 'ghpwat_';
const VERSION = 'version_00';
const CACHE_NAME = APP_PREFIX + VERSION;

const REPO_NAME = 'github-pwa-test';
const ASSETS = [
  `/${REPO_NAME}/`,
  `/${REPO_NAME}/index.html`,
  `/${REPO_NAME}/styles.css`,
  `/${REPO_NAME}/main.js`,
  // `/${REPO_NAME}/ww.js`,
  `/${REPO_NAME}/img/icon72.jpeg`,
  `/${REPO_NAME}/img/icon96.jpeg`,
  `/${REPO_NAME}/img/icon120.jpeg`,
  `/${REPO_NAME}/img/icon128.jpeg`,
  `/${REPO_NAME}/img/icon144.jpeg`,
  `/${REPO_NAME}/img/icon152.jpeg`,
  `/${REPO_NAME}/img/icon180.jpeg`,
  `/${REPO_NAME}/img/icon192.jpeg`,
  `/${REPO_NAME}/img/icon384.jpeg`,
  `/${REPO_NAME}/img/icon512.jpeg`,
];


self.addEventListener('fetch', async (evt) => {
  'use strict';

  // Perform global search on all caches in the current origin with Cache First Strategy
  // If cache is available, respond with cached resources
  // If there is no cache, try fetching the resources from the network
  const cachedResponse = await caches.match(evt.request);
  evt.respondWith(cachedResponse || fetch(evt.request));
});


self.addEventListener('install', (evt) => {
  'use strict';

  // Pre-cache all initial resources
  const preCache = async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll(ASSETS);
  };

  evt.waitUntil(preCache());
});


// Delete outdated caches
self.addEventListener('activate', (evt) => {
  'use strict';

  const deleteSpecificCache = async (key) => await caches.delete(key);

  const deleteOldCache = async () => {
    const allCaches = await caches.keys();
    // Filter out cache names that has this app prefix from a list of all cache names under username.github.io
    // const appCacheKeys = allCacheKeys.filter((key) => key.includes(APP_PREFIX));
    // appCacheKeys.push(CACHE_NAME);
    const cachesToDelete = allCaches.filter((key) => key.includes(APP_PREFIX) && !key.includes(CACHE_NAME));

    return await Promise.all(cachesToDelete.map(deleteSpecificCache));
  };

  evt.waitUntil(deleteOldCache());
});

// https://www.freecodecamp.org/news/build-a-pwa-from-scratch-with-html-css-and-javascript/
// https://web.dev/learn/pwa/
// https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/
