(function (app) {
    let currentState = null;
    let states = {};
    let pixi = null;
    let configuration = null;
    let resourcesCount = 0;
    const sounds = {};
    const logAppender = console;
    const fwkJs = ["/js/vendors/pixi.min.js", "/js/vendors/howler.min.js"];
    const setConfiguration = function (config) {
        configuration = config;
        resourcesCount = fwkJs.length + configuration.resources.images.length + configuration.resources.sounds.length + configuration.resources.javascripts.length;
    };
    const callResourcesLoadedHandler = function (count) {
        if (configuration.handlers.onResourcesLoaded) {
            configuration.handlers.onResourcesLoaded({ total: resourcesCount, count: count });
        }
    };
    const loadJavascripts = function (list) {
        return new Promise(function (resolve, reject) {
            if (Array.isArray(list) && list.length > 0) {
                let loadCount = 0;
                list.forEach(function (element) {
                    const script = document.createElement("script");
                    script.onload = function () {
                        loadCount++;
                        callResourcesLoadedHandler(1);
                        if (loadCount === list.length) {
                            resolve();
                        }
                    };
                    script.onerror = function () {
                        reject();
                    };
                    document.head.appendChild(script);
                    script.src = element;
                });
            } else {
                setTimeout(function () {
                    resolve();
                }, 0);
            }
        });
    };
    const loadSounds = function (list) {
        return new Promise(function (resolve) {
            if (Array.isArray(list) && list.length > 0) {
                let loadCount = 0;
                list.forEach(function (element) {
                    const sound = new Howl({ src: [element] });
                    sounds[element] = sound;
                    sound.once("load", function () {
                        loadCount++;
                        callResourcesLoadedHandler(1);
                        if (loadCount === list.length) {
                            resolve();
                        }
                    });
                });
            } else {
                setTimeout(function () {
                    resolve();
                }, 0);
            }
        });
    };
    const loadImages = function (list) {
        return new Promise(function (resolve) {
            if (Array.isArray(list) && list.length > 0) {
                PIXI.loader.add(list).load(function () {
                    callResourcesLoadedHandler(list.length);
                    resolve();
                });
            } else {
                setTimeout(function () {
                    resolve();
                }, 0);
            }
        });
    };
    const enableDisableStateScene = function (scene, enabled) {
        scene.children.forEach((child) => {
            child.enabled = enabled;
        });
        scene.visible = enabled;
    };
    app.getSound = function (name) {
        return sounds[name];
    };
    app.configure = function (config) {
        setConfiguration(config);
        loadJavascripts(fwkJs).then(() => {
            let stateDescription = null;
            pixi = new PIXI.Application(configuration.application);
            document.body.appendChild(pixi.view);
            for (let stateName in configuration.states) {
                stateDescription = configuration.states[stateName];
                const scene = new PIXI.Container();
                stateDescription.state = {
                    name: stateName,
                    scene: scene
                };
                pixi.stage.addChild(scene);
                states[stateName] = stateDescription;
                if (stateName === "loading") {
                    stateDescription.setup();
                    enableDisableStateScene(stateDescription.state.scene, false);
                    app.moveTo("loading");
                }
            }
            loadJavascripts(configuration.resources.javascripts).then(() => {
                if (configuration.handlers && configuration.handlers.onJavascriptsLoaded) {
                    configuration.handlers.onJavascriptsLoaded(PIXI, pixi.view);
                }
                pixi.ticker.add((delta) => {
                    if (configuration.handlers && configuration.handlers.onTick) {
                        configuration.handlers.onTick();
                    }
                    currentState.tick(delta);
                });
                loadSounds(configuration.resources.sounds).then(() => {
                    if (configuration.handlers && configuration.handlers.onSoundsLoaded) {
                        configuration.handlers.onSoundsLoaded();
                    }
                    loadImages(configuration.resources.images).then(() => {
                        if (configuration.handlers && configuration.handlers.onImagesLoaded) {
                            configuration.handlers.onImagesLoaded();
                        }
                        setTimeout(() => {
                            for (let stateName in configuration.states) {
                                stateDescription = states[stateName];
                                if (stateName != "loading") {
                                    stateDescription.setup();
                                    enableDisableStateScene(stateDescription.state.scene, false);
                                }
                            }
                            app.moveTo(configuration.defaultState);
                        }, 1000);
                    });
                });
            });
        });
    };
    app.moveTo = function (stateName, params) {
        let previousState = null;
        if (currentState) {
            previousState = currentState.state.name;
            if (currentState.beforeLeave) {
                currentState.beforeLeave();
            }
            enableDisableStateScene(currentState.state.scene, false);
        }
        currentState = states[stateName];
        logAppender.debug("Display state : " + currentState.state.name);
        currentState.state.previousState = previousState;
        currentState.state.params = params;
        if (currentState.beforeEnter) {
            currentState.beforeEnter();
        }
        enableDisableStateScene(currentState.state.scene, true);
    };
}(window.app || (window.app = {})));