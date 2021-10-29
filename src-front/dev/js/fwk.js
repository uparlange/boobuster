let currentState = null;
let states = {};
let pixi = null;
let configuration = null;
let resourcesCount = 0;
const sounds = {};
const logAppender = console;
const keyboard = {};
const fwkJs = ["/js/vendors/pixi.min.js", "/js/vendors/howler.min.js"];
const Fwk = {};
const setConfiguration = function (config) {
    configuration = config;
    Fwk.applicationWidth = config.application.width;
    Fwk.applicationHeight = config.application.height;
    resourcesCount = fwkJs.length + configuration.resources.images.length + configuration.resources.sounds.length + configuration.resources.javascripts.length;
};
const callResourcesLoadedHandler = function (count) {
    if (configuration.handlers.onResourcesLoaded) {
        configuration.handlers.onResourcesLoaded({ total: resourcesCount, count: count });
    }
};
const loadJavascripts = function (list, type) {
    return new Promise(function (resolve, reject) {
        if (Array.isArray(list) && list.length > 0) {
            let loadCount = 0;
            list.forEach(function (element) {
                const script = document.createElement("script");
                if (type) {
                    script.type = type;
                }
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
            PIXI.Loader.shared.add(list).load(function () {
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
            loadJavascripts(["/js/states/" + stateName + ".js"], "module").then(() => {
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
        let key = keyboard[event.code];
        if (!key) {
            key = { isUp: true, isDown: false };
            keyboard[event.code] = key;
        }
        if (key.isUp && currentState.onKeyPress) {
            currentState.onKeyPress(event.code);
        }
        key.isDown = true;
        key.isUp = false;
    });
    window.addEventListener("keyup", (event) => {
        let key = keyboard[event.code];
        if (key) {
            if (key.isDown && currentState.onKeyRelease) {
                currentState.onKeyRelease(event.code)
            }
            key.isDown = false;
            key.isUp = true;
        }
    });
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission().then(permissionState => {
            if (permissionState === "granted") {
                window.addEventListener("deviceorientation", (event) => {
                    if (currentState.onDeviceOrientation) {
                        // alpha : rotation autour de l"axe z
                        const rotateDegrees = event.alpha;
                        // gamma : de gauche à droite
                        const leftToRight = event.gamma;
                        // bêta : mouvement avant-arrière
                        const frontToBack = event.beta;
                        currentState.onDeviceOrientation({
                            frontToBack: frontToBack,
                            leftToRight: leftToRight,
                            rotateDegrees: rotateDegrees
                        });
                    }
                });
            } else {
                alert("Device Orientation need to be granted !");
            }
        }).catch(console.error);
    } else {
        // handle regular non iOS 13+ devices
    }
};
Fwk.getSound = function (name) {
    return sounds[name];
};
Fwk.defineApplication = function (config) {
    setConfiguration(config);
    loadJavascripts(fwkJs).then(() => {
        pixi = new PIXI.Application(configuration.application);
        document.body.appendChild(pixi.view);
        Fwk.moveToState("loading").then(() => {
            initEvents();
            loadJavascripts(configuration.resources.javascripts).then(() => {
                if (configuration.handlers && configuration.handlers.onJavascriptsLoaded) {
                    configuration.handlers.onJavascriptsLoaded(PIXI, pixi.view);
                }
                pixi.ticker.add((delta) => {
                    if (configuration.handlers && configuration.handlers.onTick) {
                        configuration.handlers.onTick(delta);
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
                        Fwk.moveToState(configuration.defaultState.name, configuration.defaultState.params);
                    });
                });
            });
        });
    });
};
Fwk.defineState = function (stateName, stateDescription) {
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
Fwk.moveToState = function (stateName, params) {
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
Fwk.getLogger = function () {
    return logAppender;
};
Fwk.data = {};

export default Fwk;