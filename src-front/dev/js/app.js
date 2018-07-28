import Fwk from "./fwk.js";

Fwk.defineApplication({
    application: {
        width: 512,
        height: 512,
        antialias: true,
        transparent: false,
        resolution: 1
    },
    resources: {
        images: [
            "/img/boobuster.json"
        ],
        sounds: [
            "/snd/beetlejuice.mp3", "/snd/boo_hit.mp3", "/snd/fireball.mp3", "/snd/ghost_die.mp3", "/snd/level_cleared.mp3",
            "/snd/mario_die.mp3", "/snd/mario_hit.mp3", "/snd/mortuary.mp3"
        ],
        javascripts: [
            "/js/vendors/bump.js", "/js/vendors/gameUtilities.js", "/js/vendors/scaleToWindow.js", "/js/vendors/tink.js"
        ]
    },
    defaultState: {
        name: "home",
        params: null
    },
    handlers: {
        onResourcesLoaded: function (event) {
            Fwk.data.loadingSteps = event.total;
            if (Fwk.data.loadingStep == undefined) {
                Fwk.data.loadingStep = -1;
            }
            Fwk.data.loadingStep += event.count;
        },
        onJavascriptsLoaded: function (PIXI, view) {
            let scale = scaleToWindow(view); /* global scaleToWindow */
            window.addEventListener("resize", () => {
                scale = scaleToWindow(view);
                Fwk.data.tink.scale = scale;
            });
            window.addEventListener("orientationchange", () => {
                scale = scaleToWindow(view);
                Fwk.data.tink.scale = scale;
            });
            Fwk.data.bump = new Bump(PIXI); /* global Bump */
            Fwk.data.tink = new Tink(PIXI, view, scale); /* global Tink */
            Fwk.data.gameUtilities = new GameUtilities(); /* global GameUtilities */
        },
        onSoundsLoaded: function () {

        },
        onImagesLoaded: function () {

        },
        onTick: function () {
            Fwk.data.tink.update();
        }
    }
});

const serviceWorkerAvailable = "serviceWorker" in navigator;
const applicationCacheAvailable = "applicationCache" in window;
if (serviceWorkerAvailable) {
    // https://github.com/GoogleChromeLabs/sw-precache/blob/master/demo/app/js/service-worker-registration.js
    window.addEventListener("load", function () {
        navigator.serviceWorker.register("/service-worker.js").then(function (reg) {
            reg.onupdatefound = function () {
                var installingWorker = reg.installing;
                installingWorker.onstatechange = function () {
                    switch (installingWorker.state) {
                        case "installed":
                            if (navigator.serviceWorker.controller) {
                                Fwk.getLogger().debug("New or updated content is available");
                                window.location.reload();
                            } else {
                                Fwk.getLogger().debug("Content is now available offline");
                            }
                            break;
                        case "redundant":
                            Fwk.getLogger().debug("The installing service worker became redundant");
                            break;
                    }
                };
            };
        }).catch(function (e) {
            Fwk.getLogger().debug("Error during service worker registration : " + e);
        });
    });
} else if (applicationCacheAvailable) {
    // https://github.com/beebole/mobile-app-demo/blob/master/index.html
    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "/app.cache";
    document.body.appendChild(iframe);
    window.addEventListener("load", function () {
        window.applicationCache.addEventListener("updateready", function () {
            if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
                window.applicationCache.swapCache();
                window.location.reload();
            }
        });
    });
}