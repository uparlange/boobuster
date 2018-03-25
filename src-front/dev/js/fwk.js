(function (app) {
    let currentState = null;
    let states = {};
    let pixi = null;
    let configuration = null;
    let resourcesCount = 0;
    const sounds = {};
    const logAppender = console;
    const keyboard = {};
    const fwkJs = ["/js/vendors/pixi.min.js", "/js/vendors/howler.min.js"];
    const setConfiguration = function (config) {
        configuration = config;
        app.applicationWidth = config.application.width;
        app.applicationHeight = config.application.height;
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
    const loadState = function (stateName) {
        return new Promise(function (resolve) {
            if (states[stateName]) {
                resolve(states[stateName]);
            } else {
                loadJavascripts(["/js/states/" + stateName + ".js"]).then(() => {
                    resolve(states[stateName]);
                });
            }
        });
    };
    const enableDisableStateScene = function (scene, enabled) {
        scene.children.forEach((child) => {
            child.enabled = enabled;
            enableDisableStateScene(child, enabled);
        });
        scene.visible = enabled;
    };
    const initEvents = function () {
        window.addEventListener("keydown", (event) => {
            let key = keyboard[event.keyCode];
            if (key == undefined) {
                key = { isUp: true, isDown: false };
                keyboard[event.keyCode] = key;
            }
            if (key.isUp && currentState.onKeyPress) {
                currentState.onKeyPress(event.keyCode);
            }
            key.isDown = true;
            key.isUp = false;
        }, false);
        window.addEventListener("keyup", (event) => {
            let key = keyboard[event.keyCode];
            if (key.isDown && currentState.onKeyRelease) {
                currentState.onKeyRelease(event.keyCode)
            }
            key.isDown = false;
            key.isUp = true;
        }, false);
    };
    app.fwkGetSound = function (name) {
        return sounds[name];
    };
    app.fwkDefineApplication = function (config) {
        setConfiguration(config);
        loadJavascripts(fwkJs).then(() => {
            pixi = new PIXI.Application(configuration.application);
            document.body.appendChild(pixi.view);
            app.fwkMoveToState("loading").then(() => {
                initEvents();
                loadJavascripts(configuration.resources.javascripts).then(() => {
                    if (configuration.handlers && configuration.handlers.onJavascriptsLoaded) {
                        configuration.handlers.onJavascriptsLoaded(PIXI, pixi.view);
                    }
                    pixi.ticker.add((delta) => {
                        if (configuration.handlers && configuration.handlers.onTick) {
                            configuration.handlers.onTick();
                        }
                        currentState.onTick(delta);
                    });
                    loadSounds(configuration.resources.sounds).then(() => {
                        if (configuration.handlers && configuration.handlers.onSoundsLoaded) {
                            configuration.handlers.onSoundsLoaded();
                        }
                        loadImages(configuration.resources.images).then(() => {
                            if (configuration.handlers && configuration.handlers.onImagesLoaded) {
                                configuration.handlers.onImagesLoaded();
                            }
                            app.fwkMoveToState(configuration.defaultState);
                        });
                    });
                });
            });
        });
    };
    app.fwkDefineState = function (stateName, stateDescription) {
        const scene = new PIXI.Container();
        stateDescription.state = {
            name: stateName,
            scene: scene
        };
        pixi.stage.addChild(scene);
        states[stateName] = stateDescription;
        stateDescription.setup();
        enableDisableStateScene(stateDescription.state.scene, false);
    };
    app.fwkMoveToState = function (stateName, params) {
        return new Promise((resolve) => {
            loadState(stateName).then(() => {
                let previousState = null;
                if (currentState) {
                    previousState = currentState.state.name;
                    if (currentState.beforeLeave) {
                        currentState.beforeLeave();
                    }
                    enableDisableStateScene(currentState.state.scene, false);
                }
                currentState = states[stateName];
                app.getLogger().debug("Fwk - display state : " + currentState.state.name);
                currentState.state.previousState = previousState;
                currentState.state.params = params;
                if (currentState.beforeEnter) {
                    currentState.beforeEnter();
                }
                enableDisableStateScene(currentState.state.scene, true);
                resolve();
            });
        });
    };
    app.getLogger = function() {
        return logAppender;
    };
}(window.app || (window.app = {})));