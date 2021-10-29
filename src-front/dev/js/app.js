import Fwk from "./fwk.js";

let view = null;

const refreshScale = function () {
    if (view && Fwk.userModel.tink) {
        Fwk.userModel.tink.scale = scaleToWindow(view);
    }
};

Fwk.defineApplication({
    application: {
        width: 512,
        height: 512,
        antialias: true,
        transparent: false,
        resolution: 1,
        needDeviceOrientation: true
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
        onResourcesLoadedHandler: function (event) {
            Fwk.userModel.loadingSteps = event.total;
            if (Fwk.userModel.loadingStep == undefined) {
                Fwk.userModel.loadingStep = -1;
            }
            Fwk.userModel.loadingStep += event.count;
        },
        onJavascriptsLoadedHandler: function (p, v) {
            view = v;
            Fwk.userModel.bump = new Bump(p); 
            Fwk.userModel.tink = new Tink(p, v, scaleToWindow(v)); 
            Fwk.userModel.gameUtilities = new GameUtilities(); 
        },
        onResizeHandler: function () {
            refreshScale();
        },
        onOrientationChangeHandler: function () {
            refreshScale();
        },
        onSoundsLoadedHandler: function () {

        },
        onImagesLoadedHandler: function () {

        },
        onTickHandler: function () {
            Fwk.userModel.tink.update();
        }
    }
});

if (Fwk.isProductionMode()) {
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
}