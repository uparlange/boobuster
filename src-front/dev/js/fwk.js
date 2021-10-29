let currentState = null;
let states = {};
let pixi = null;
let configuration = null;
let resourcesCount = 0;
let deviceOrientationEventInitialized = false;
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
    if (typeof configuration.handlers.onResourcesLoadedHandler === "function") {
        configuration.handlers.onResourcesLoadedHandler({ total: resourcesCount, count: count });
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
            });
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
            });
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
            });
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
        if (key.isUp && currentState && typeof currentState.onKeyPress === "function") {
            currentState.onKeyPress(event.code);
        }
        key.isDown = true;
        key.isUp = false;
    });
    window.addEventListener("keyup", (event) => {
        let key = keyboard[event.code];
        if (key) {
            if (key.isDown && currentState && typeof currentState.onKeyRelease === "function") {
                currentState.onKeyRelease(event.code)
            }
            key.isDown = false;
            key.isUp = true;
        }
    });
    window.addEventListener("resize", () => {
        if (configuration.handlers && typeof configuration.handlers.onResizeHandler === "function") {
            configuration.handlers.onResizeHandler();
        }
        if(currentState && typeof currentState.onResize === "function") {
            currentState.onResize();
        }
    });
    window.addEventListener("orientationchange", () => {
        if (configuration.handlers && typeof configuration.handlers.onOrientationChangeHandler === "function") {
            configuration.handlers.onOrientationChangeHandler();
        }
    });
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
                if (configuration.handlers && typeof configuration.handlers.onJavascriptsLoadedHandler === "function") {
                    configuration.handlers.onJavascriptsLoadedHandler(PIXI, pixi.view);
                }
                pixi.ticker.add((delta) => {
                    if (configuration.handlers && typeof configuration.handlers.onTickHandler === "function") {
                        configuration.handlers.onTickHandler(delta);
                    }
                    if (currentState && typeof currentState.onTick === "function") {
                        currentState.onTick(delta);
                    }
                });
                loadSounds(configuration.resources.sounds).then(() => {
                    if (configuration.handlers && typeof configuration.handlers.onSoundsLoadedHandler === "function") {
                        configuration.handlers.onSoundsLoadedHandler();
                    }
                    loadImages(configuration.resources.images).then(() => {
                        if (configuration.handlers && configuration.handlers.onImagesLoadedHandler === "function") {
                            configuration.handlers.onImagesLoadedHandler();
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
Fwk.askDeviceOrientationEventPermission = function () {
    return new Promise((resolve) => {
        if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
            DeviceOrientationEvent.requestPermission().then(permissionState => {
                if (permissionState === "granted") {
                    if (!deviceOrientationEventInitialized) {
                        window.addEventListener("deviceorientation", (event) => {
                            if (currentState && typeof currentState.onDeviceOrientation === "function") {
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
                        deviceOrientationEventInitialized = true;
                    }
                }
                setTimeout(() => {
                    resolve();
                });
            }).catch((err) => {
                alert(err);
                resolve();
            });
        } else {
            setTimeout(() => {
                resolve();
            });
        }
    });
}
Fwk.isProductionMode = function () {
    const meta = document.getElementById("productionMode");
    return meta && meta.content == "true";
}
Fwk.getLogger = function () {
    return logAppender;
};
Fwk.userModel = {};

export default Fwk;