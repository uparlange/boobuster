(function (app) {
    app.fwkDefineApplication({
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
        defaultState: "home",
        handlers: {
            onResourcesLoaded: function (event) {
                app.loadingSteps = event.total;
                if (app.loadingStep == undefined) {
                    app.loadingStep = -1;
                }
                app.loadingStep += event.count;
            },
            onJavascriptsLoaded: function (PIXI, view) {
                app.scale = scaleToWindow(view); /* global scaleToWindow */
                window.addEventListener("resize", () => {
                    app.scale = scaleToWindow(view);
                    app.tink.scale = app.scale;
                });
                app.bump = new Bump(PIXI); /* global Bump */
                app.tink = new Tink(PIXI, view, app.scale); /* global Tink */
                app.gameUtilities = new GameUtilities(); /* global GameUtilities */
            },
            onSoundsLoaded: function () {

            },
            onImagesLoaded: function () {

            },
            onTick: function () {
                app.tink.update();
            }
        }
    });
    const serviceWorkerAvailable = "serviceWorker" in navigator;
    const applicationCacheAvailable = "applicationCache" in window;
    if (serviceWorkerAvailable) {
        window.addEventListener("load", function () {
            navigator.serviceWorker.register("/service-worker.js").then(function (reg) {
                reg.onupdatefound = function () {
                    var installingWorker = reg.installing;
                    installingWorker.onstatechange = function () {
                        switch (installingWorker.state) {
                            case "installed":
                                if (navigator.serviceWorker.controller) {
                                    app.getLogger().debug("New or updated content is available");
                                    window.location.reload();
                                } else {
                                    app.getLogger().debug("Content is now available offline");
                                }
                                break;
                            case "redundant":
                                app.getLogger().debug("The installing service worker became redundant");
                                break;
                        }
                    };
                };
            }).catch(function (e) {
                app.getLogger().debug("Error during service worker registration : " + e);
            });
        });
    } else if (applicationCacheAvailable) {
        // https://github.com/beebole/mobile-app-demo/blob/master/index.html
        var iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = "/manifest.html";
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
}(window.app || (window.app = {})));