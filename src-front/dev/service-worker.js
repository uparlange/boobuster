/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/","4205d5d4eaf12e119587b4e1a350b814"],["/app-cache","c5c2f7fef62f604f53dfe9173e61fe0c"],["/css/app.css","081e893d1b27398d46f3e9aa234489a6"],["/img/boobuster.json","06fd67a4ddd92ab181ba337c43992c6c"],["/img/boobuster.png","7d1e71fe05f6725ac2de0b4a3fd63189"],["/img/favicon/android-chrome-192x192.png","bb7335a1e299144516057c50be28085b"],["/img/favicon/android-chrome-512x512.png","b00a0845f6ee285d153f6efc61f58cf6"],["/img/favicon/apple-touch-icon.png","627284c06d8b78b3fce764bbb952cac1"],["/img/favicon/browserconfig.xml","c4fcf70b3b8dae796835a1eb62947e08"],["/img/favicon/favicon-16x16.png","5cfd65e92811baa9e4b424c5ff9fbd84"],["/img/favicon/favicon-32x32.png","ec39959547d421228506690709b429fd"],["/img/favicon/favicon.ico","265400a295739c3b1461a6bd5007f617"],["/img/favicon/mstile-150x150.png","e42f8fe6b2b23367ae7396d08dd44f64"],["/img/favicon/safari-pinned-tab.svg","31d8b8b798904b58c78ea0daa33cff41"],["/img/favicon/site.webmanifest","2ec8828263fe81cce85c4c4c6ef36a6a"],["/img/splash/launch-1125x2436.jpg","ef879f3f0c43e6c8c0050aa851e1f724"],["/img/splash/launch-1242x2148.jpg","44e38ec7c3ed57ac985e2871d1ac8008"],["/img/splash/launch-1536x2048.jpg","8b4803776505c0672c2ac59320a7c821"],["/img/splash/launch-1668x2224.jpg","6d2771cd283706654489430e9c0396e2"],["/img/splash/launch-2048x2732.jpg","e2ca8db1103019cede90f1dbac97c0be"],["/img/splash/launch-640x1136.jpg","d09ea819d1d330a90ee63482e258317e"],["/img/splash/launch-750x1294.jpg","9f287e6d9543b5e9d427859932ea778a"],["/js/app.js","766a3279959232c9f4fb3b5cadbf26ac"],["/js/classes/BlueBoo.js","02515c844d9637240a478ef96c5697b1"],["/js/classes/BlueKingBoo.js","43d20338b3b26a060bb62e39ea283f06"],["/js/classes/Boo.js","2e48826b2fadd21b98fbff2d8910e6f2"],["/js/classes/Bullet.js","c97216d025368e7afa1335c22442ee25"],["/js/classes/DarkBoo.js","811a971f6f5ca02265390139ecabd2ab"],["/js/classes/KingBoo.js","18925f6dabd489862acfe82faaa14655"],["/js/classes/Life.js","655e9063f20ef0e52633fe1ec5d122b8"],["/js/classes/Mario.js","be8be8b724c87a5476eec5dac9b96399"],["/js/classes/PinkBoo.js","7b75cba9592fcf8225d237fb504f93d7"],["/js/classes/Sprite.js","21fa61369ab7d6385f6f005d6e425118"],["/js/fwk.js","3e9a5f87b7307da9faae12e878d3300b"],["/js/states/game_over.js","4ffc3872abe819e874f71076569f2e92"],["/js/states/home.js","57d1e8565599686b0d1af01c9f0c0418"],["/js/states/level.js","785c9fee4b12ce70de7da6012280602f"],["/js/states/level_cleared.js","450442798179b61166d0f6baa4107a32"],["/js/states/loading.js","37e4354c9f38aca5ca9241e7d17b8aa5"],["/js/vendors/bump.js","a3cbf231a5ddd9d3f2731c19fb81c1ea"],["/js/vendors/gameUtilities.js","1aa3662dd60f19a4cee702427f27082f"],["/js/vendors/howler.min.js","b929efedb09049df7c5f98fa00eb0fc4"],["/js/vendors/pixi.min.js","11846c4c7a8c0b07c3f85638fcabf6d3"],["/js/vendors/scaleToWindow.js","9f356d897d6c3222289f42361cef4428"],["/js/vendors/tink.js","deb57ecac6a9abbc9d0f4559525772ec"],["/snd/beetlejuice.mp3","5ae155361467d8ae2696686374bfe181"],["/snd/boo_hit.mp3","8abae1e423b348042609cbd51e84c926"],["/snd/fireball.mp3","1208fccd4046018e0972f3d1719d4759"],["/snd/ghost_die.mp3","691655ab4601f0cd07201c370514b120"],["/snd/level_cleared.mp3","3bbb9214ef9e6c546e3701aa9d31998d"],["/snd/mario_die.mp3","b8f69bfb0ec4612ee70cd06645d19cf2"],["/snd/mario_hit.mp3","e4eb3693d92e4fd4d6c893a0b32b6b7e"],["/snd/mortuary.mp3","953b1bcb859794009f741057ee1a3ee7"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







