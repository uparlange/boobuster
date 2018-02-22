(function (app) {
    let spriteUtilities = null;
    let bump = null;
    let tink = null;
    let currentState = null;
    let states = {};
    let pixi = null;
    let gameUtilities = null;
    let scale = null;
    app.getGameUtilitiesLib = function () {
        return gameUtilities;
    };
    app.getSpriteUtilitiesLib = function () {
        return spriteUtilities;
    };
    app.getBumpLib = function () {
        return bump;
    };
    app.getTinkLib = function () {
        return tink;
    };
    app.getSoundLib = function () {
        return sounds;
    }
    app.loadScripts = function (scripts) {
        return new Promise((resolve, reject) => {
            let scriptLoadCount = 0;
            scripts.forEach(element => {
                const script = document.createElement("script");
                script.onload = () => {
                    scriptLoadCount++;
                    if (scriptLoadCount === scripts.length) {
                        resolve();
                    }
                };
                script.onerror = () => {
                    reject();
                };
                document.head.appendChild(script);
                script.src = element;
            });
        });
    };
    app.define = function (params) {
        app.loadScripts(["/vendors/pixi.min.js"]).then(() => {
            let stateDescription = null;
            // init application
            pixi = new PIXI.Application(params.application);
            document.body.appendChild(pixi.view);
            // init states
            for (stateName in params.states) {
                stateDescription = params.states[stateName];
                const scene = new PIXI.Container();
                scene.visible = false;
                stateDescription.state = {
                    name: stateName,
                    scene: scene
                };
                pixi.stage.addChild(scene);
                states[stateName] = stateDescription;
                if (stateName === "loading") {
                    stateDescription.setup();
                    app.setState("loading");
                }
            }
            app.loadScripts(["/vendors/bump.js", "/vendors/gameUtilities.js", "/vendors/scaleToWindow.js", "/vendors/sound.js", "/vendors/spriteUtilities.js", "/vendors/tink.js"]).then(() => {
                // init libs
                spriteUtilities = new SpriteUtilities(PIXI);
                bump = new Bump(PIXI);
                tink = new Tink(PIXI, pixi.view);
                gameUtilities = new GameUtilities();
                scale = scaleToWindow(pixi.view);
                window.addEventListener("resize", function (event) {
                    scale = scaleToWindow(pixi.view);
                });
                // init ticker
                pixi.ticker.add((delta) => {
                    tink.update();
                    currentState.tick(delta);
                });
                // load resources
                sounds.load(params.sounds);
                sounds.whenLoaded = () => {
                    PIXI.loader.add(params.images).load(() => {
                        for (stateName in params.states) {
                            stateDescription = states[stateName];
                            if (stateName != "loading") {
                                stateDescription.setup();
                            }
                        }
                        app.setState(params.defaultState);
                        resolve();
                    });
                }
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
            currentState.state.scene.visible = false;
        }
        currentState = states[stateName];
        currentState.state.previousState = previousState;
        currentState.state.params = params;
        if (currentState.beforeEnter) {
            currentState.beforeEnter();
        }
        currentState.state.scene.visible = true;
    };

}(window.app || (window.app = {})));