(function (app) {
    let currentState = null;
    let states = {};
    let pixi = null;
    const loadJavascripts = function (list) {
        return new Promise(function (resolve, reject) {
            if (Array.isArray(list) && list.length > 0) {
                let scriptLoadCount = 0;
                list.forEach(function (element) {
                    const script = document.createElement("script");
                    script.onload = function () {
                        scriptLoadCount++;
                        if (scriptLoadCount === list.length) {
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
                sounds.load(list);
                sounds.whenLoaded = function () {
                    resolve();
                }
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
    app.configure = function (configuration) {
        loadJavascripts(["/vendors/pixi.min.js", "/vendors/sound.js"]).then(() => {
            let stateDescription = null;
            pixi = new PIXI.Application(configuration.application);
            document.body.appendChild(pixi.view);
            for (stateName in configuration.states) {
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
                    app.setState("loading");
                }
            }
            loadJavascripts(configuration.javascripts).then(() => {
                if (configuration.handlers && configuration.handlers.onJavascriptsLoaded) {
                    configuration.handlers.onJavascriptsLoaded(PIXI, pixi.view);
                }
                pixi.ticker.add((delta) => {
                    if (configuration.handlers && configuration.handlers.onTick) {
                        configuration.handlers.onTick();
                    }
                    currentState.tick(delta);
                });
                loadSounds(configuration.sounds).then(() => {
                    if (configuration.handlers && configuration.handlers.onSoundsLoaded) {
                        configuration.handlers.onSoundsLoaded();
                    }
                    loadImages(configuration.images).then(() => {
                        if (configuration.handlers && configuration.handlers.onImagesLoaded) {
                            configuration.handlers.onImagesLoaded();
                        }
                        for (stateName in configuration.states) {
                            stateDescription = states[stateName];
                            if (stateName != "loading") {
                                stateDescription.setup();
                                enableDisableStateScene(stateDescription.state.scene, false);
                            }
                        }
                        app.setState(configuration.defaultState);
                    });
                });
            });
        });
    };
    app.setState = function (stateName, params) {
        let previousState = null;
        if (currentState) {
            previousState = currentState.state.name;
            if (currentState.beforeLeave) {
                currentState.beforeLeave();
            }
            enableDisableStateScene(currentState.state.scene, false);
        }
        currentState = states[stateName];
        console.debug("Display state : " + currentState.state.name);
        currentState.state.previousState = previousState;
        currentState.state.params = params;
        if (currentState.beforeEnter) {
            currentState.beforeEnter();
        }
        enableDisableStateScene(currentState.state.scene, true);
    };

}(window.app || (window.app = {})));