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

var precacheConfig = [["/","ffc3a24b9eac79da5949544570c916f7"],["/app-cache","03be5d276cf5e4b3862e709d8664bc20"],["/css/app.css","081e893d1b27398d46f3e9aa234489a6"],["/img/boobuster.json","4cf76676235832d1def2246854544e01"],["/img/boobuster.png","7d1e71fe05f6725ac2de0b4a3fd63189"],["/img/favicon/android-chrome-192x192.png","1d953bee81855f8eab44fd3e097e536c"],["/img/favicon/android-chrome-512x512.png","2e4534c44d71be75dff89ad746e8994d"],["/img/favicon/apple-touch-icon.png","a6f5d9a729c9e8eab56456c6dd442342"],["/img/favicon/browserconfig.xml","c4fcf70b3b8dae796835a1eb62947e08"],["/img/favicon/favicon-16x16.png","5cfd65e92811baa9e4b424c5ff9fbd84"],["/img/favicon/favicon-32x32.png","ec39959547d421228506690709b429fd"],["/img/favicon/favicon.ico","265400a295739c3b1461a6bd5007f617"],["/img/favicon/mstile-150x150.png","e42f8fe6b2b23367ae7396d08dd44f64"],["/img/favicon/safari-pinned-tab.svg","31d8b8b798904b58c78ea0daa33cff41"],["/img/favicon/site.webmanifest","2ec8828263fe81cce85c4c4c6ef36a6a"],["/img/splash/launch-1125x2436.jpg","b323c686c66e95ceb179de4254ed5f17"],["/img/splash/launch-1242x2148.jpg","895159bf380671396102c97061e31673"],["/img/splash/launch-1536x2048.jpg","e092fd3e1b3f16a00cab464fccb79d46"],["/img/splash/launch-1668x2224.jpg","adb4a68f69bdcbcc5587b6ac43707a4b"],["/img/splash/launch-2048x2732.jpg","1d9060255975cc03c3012fe86b005418"],["/img/splash/launch-640x1136.jpg","577547c51fd87c45837a986b2f9d123a"],["/img/splash/launch-750x1294.jpg","bef48a05a1ad8e409fae1dff62e0f71e"],["/js/app.js","b09d583d77b5d8487c4db1634761232d"],["/js/classes/BlueBoo.js","02515c844d9637240a478ef96c5697b1"],["/js/classes/BlueKingBoo.js","43d20338b3b26a060bb62e39ea283f06"],["/js/classes/Boo.js","fcc9153d399e352f8a2c5dfdc15b3f32"],["/js/classes/Bullet.js","c97216d025368e7afa1335c22442ee25"],["/js/classes/DarkBoo.js","811a971f6f5ca02265390139ecabd2ab"],["/js/classes/KingBoo.js","18925f6dabd489862acfe82faaa14655"],["/js/classes/Life.js","655e9063f20ef0e52633fe1ec5d122b8"],["/js/classes/Mario.js","b5e239e8054827b756858bad52c2b109"],["/js/classes/PinkBoo.js","7b75cba9592fcf8225d237fb504f93d7"],["/js/classes/Sprite.js","21fa61369ab7d6385f6f005d6e425118"],["/js/fwk.js","2b92782b4acac82a152229ede7981e12"],["/js/states/game_over.js","d4e47af12a2fbe65fdc76e50e4d719bb"],["/js/states/home.js","ab9ec69e09e8ff1238177a9ed36450a4"],["/js/states/level.js","3c1c86544f30b507653253d2b4e04fe4"],["/js/states/level_cleared.js","b3a3debe71708d1ccd6f99f27f16053a"],["/js/states/loading.js","37e4354c9f38aca5ca9241e7d17b8aa5"],["/js/vendors/bump.js","c08679c6daa55d52857b9fef44ecdf8a"],["/js/vendors/gameUtilities.js","94db3db9ff552a48501c76aae646bbc6"],["/js/vendors/howler.min.js","8f5f7936b68c583ee7d6dd2ebb198b82"],["/js/vendors/pixi.min.js","b72e7710b66d6053ecb2e4af9e3ab5e1"],["/js/vendors/scaleToWindow.js","9f356d897d6c3222289f42361cef4428"],["/js/vendors/tink.js","7bf4d8e83988543f52848b33e78a5cff"],["/snd/beetlejuice.mp3","5ae155361467d8ae2696686374bfe181"],["/snd/boo_hit.mp3","8abae1e423b348042609cbd51e84c926"],["/snd/fireball.mp3","1208fccd4046018e0972f3d1719d4759"],["/snd/ghost_die.mp3","691655ab4601f0cd07201c370514b120"],["/snd/level_cleared.mp3","3bbb9214ef9e6c546e3701aa9d31998d"],["/snd/mario_die.mp3","b8f69bfb0ec4612ee70cd06645d19cf2"],["/snd/mario_hit.mp3","e4eb3693d92e4fd4d6c893a0b32b6b7e"],["/snd/mortuary.mp3","953b1bcb859794009f741057ee1a3ee7"]];
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







