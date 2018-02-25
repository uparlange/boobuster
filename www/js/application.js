(function (app) {
    const applicationWidth = 512;
    const applicationHeight = 512;
    let bump = null;
    let tink = null;
    let gameUtilities = null;
    let scale = null;
    let loadingStep = 0;
    const loadingSteps = 3;
    class Sprite {
        constructor(image) {
            this._defaultImage = image;
            this._image = image;
            this._sprite = new PIXI.Sprite(PIXI.loader.resources["img/boobuster.json"].textures[this._image]);
        }
        getSprite() {
            return this._sprite;
        }
        setImage(image) {
            this._image = image;
            this._sprite.texture = PIXI.loader.resources["img/boobuster.json"].textures[this._image];
        }
        changeDirection(direction) {
            if (direction.has("right")) {
                this.setImage(this._image.replace("left", "right"));
            } else if (direction.has("left")) {
                this.setImage(this._image.replace("right", "left"));
            }
        }
        inverseDirection(collision) {
            if (collision.has("right")) {
                this.setImage(this._image.replace("right", "left"));
            } else if (collision.has("left")) {
                this.setImage(this._image.replace("left", "right"));
            }
        }
        move(constraints) {
            this._sprite.x += this._sprite.vx;
            this._sprite.y += this._sprite.vy;
            if (constraints) {
                const collision = bump.contain(this._sprite, constraints, true);
                if (collision) {
                    this.inverseDirection(collision);
                }
            }
        }
    }
    class CircularSprite extends Sprite {
        constructor(image) {
            super(image);
            this._sprite.circular = true;
        }
    }
    class Bullet extends CircularSprite {
        constructor() {
            super("fireball.png");
            this._sprite.vx = 0;
            this._sprite.vy = -5;
        }
    }
    class Life extends CircularSprite {
        constructor() {
            super("one_up.png");
        }
    }
    class Mario extends CircularSprite {
        constructor() {
            super("mario.png");
            this._sprite.x = (applicationWidth / 2) - 16;
            this._sprite.y = applicationHeight - 64;
            this._sprite.vx = 0;
            this._sprite.vy = 0;
            this._lifeCount = 5;
            this._state = "normal";
        }
        hit() {
            if (this._state === "normal") {
                this._lifeCount--;
                if (this._lifeCount === 0) {
                    this._state = "dead";
                } else {
                    sounds["snd/mario_hit.wav"].play();
                    this._state = "hit";
                    setTimeout(() => {
                        this._state = "normal";
                    }, 3000);
                }
            }
        }
        isDead() {
            return this._state === "dead";
        }
        getLifeCount() {
            return this._lifeCount;
        }
    }
    class Boo extends CircularSprite {
        constructor(image) {
            const vx = gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
            super(vx > 0 ? "boo_right.png" : "boo_left.png");
            this._sprite.x = gameUtilities.randomInt(0, 480);
            this._sprite.y = gameUtilities.randomInt(0, applicationHeight - 200);
            this._sprite.vx = vx;
            this._sprite.vy = gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
            this._hitCount = 0;
            this._state = "normal";
        }
        hit() {
            if (this._state === "normal") {
                this._hitCount++;
                if (this._hitCount === 3) {
                    sounds["snd/ghost_die.wav"].play();
                    this._state = "dead";
                    this._sprite.alpha = 0.3;
                } else {
                    sounds["snd/boo_hit.wav"].play();
                    this._state = "hidding";
                    this.setImage((this._image.indexOf("left") !== -1) ? "boo_shy_left.png" : "boo_shy_right.png");
                    setTimeout(() => {
                        this._state = "normal";
                        this.setImage((this._image.indexOf("left") !== -1) ? this._defaultImage.replace("right", "left") : this._defaultImage);
                    }, 3000);
                }
            }
        }
        isDead() {
            return this._state === "dead";
        }
        isHidding() {
            return this._state === "hidding";
        }
    }
    class BlueBoo extends CircularSprite {
        constructor() {
            const vx = gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
            super(vx > 0 ? "boo_blue_right.png" : "boo_blue_left.png");
            this._sprite.x = gameUtilities.randomInt(0, 480);
            this._sprite.y = gameUtilities.randomInt(0, applicationHeight - 200);
            this._sprite.vx = vx;
            this._sprite.vy = gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
        }
    }
    class DarkBoo extends CircularSprite {
        constructor() {
            const vx = gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
            super(vx > 0 ? "boo_dark_right.png" : "boo_dark_left.png");
            this._sprite.x = gameUtilities.randomInt(0, 480);
            this._sprite.y = gameUtilities.randomInt(0, applicationHeight - 200);
            this._sprite.vx = vx;
            this._sprite.vy = gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
        }
    }
    class PinkBoo extends CircularSprite {
        constructor() {
            const vx = gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
            super(vx > 0 ? "boo_pink_right.png" : "boo_pink_left.png");
            this._sprite.x = gameUtilities.randomInt(0, 480);
            this._sprite.y = gameUtilities.randomInt(0, applicationHeight - 200);
            this._sprite.vx = vx;
            this._sprite.vy = gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
        }
    }
    class KingBoo extends CircularSprite {
        constructor() {
            const vx = gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
            super(vx > 0 ? "boo_king_right.png" : "boo_king_left.png");
            this._sprite.x = gameUtilities.randomInt(0, 448);
            this._sprite.y = gameUtilities.randomInt(0, applicationHeight - 200);
            this._sprite.vx = vx;
            this._sprite.vy = gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
        }
    }
    class BlueKingBoo extends CircularSprite {
        constructor() {
            const vx = gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
            super(vx > 0 ? "boo_blue_king_right.png" : "boo_blue_king_left.png");
            this._sprite.x = gameUtilities.randomInt(0, 448);
            this._sprite.y = gameUtilities.randomInt(0, applicationHeight - 200);
            this._sprite.vx = vx;
            this._sprite.vy = gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
        }
    }
    app.configure({
        application: {
            width: applicationWidth,
            height: applicationHeight,
            antialias: true,
            transparent: false,
            resolution: 1
        },
        images: [
            "img/boobuster.json"
        ],
        sounds: [
            "snd/beetlejuice.mp3", "snd/boo_hit.wav", "snd/fireball.wav", "snd/ghost_die.wav", "snd/level_finished.wav",
            "snd/mario_die.wav", "snd/mario_hit.wav", "snd/mortuary.mp3"
        ],
        javascripts: [
            "/vendors/bump.js", "/vendors/gameUtilities.js", "/vendors/scaleToWindow.js", "/vendors/tink.js"
        ],
        defaultState: "home",
        handlers: {
            onJavascriptsLoaded: function (PIXI, view) {
                loadingStep++;
                scale = scaleToWindow(view);
                window.addEventListener("resize", function (event) {
                    scale = scaleToWindow(view);
                    tink.scale = scale;
                });
                bump = new Bump(PIXI);
                tink = new Tink(PIXI, view, scale);
                gameUtilities = new GameUtilities();
            },
            onSoundsLoaded: function () {
                loadingStep++;
            },
            onImagesLoaded: function () {
                loadingStep++;
            },
            onTick: function () {
                tink.update();
            }
        },
        states: {
            loading: {
                _message: null,
                beforeEnter: function () {

                },
                setup: function () {
                    this._message = new PIXI.Text("", new PIXI.TextStyle({
                        fontSize: 40,
                        fill: "white"
                    }));
                    this._message.y = (applicationHeight / 2) - (this._message.height / 2);
                    this.state.scene.addChild(this._message);
                },
                tick: function () {
                    this._message.text = "Loading " + loadingStep + "/" + loadingSteps;
                    this._message.x = (applicationWidth / 2) - (this._message.width / 2) - 5;
                },
                beforeLeave: function () {

                }
            },
            home: {
                _boos: [],
                _music: null,
                beforeEnter: function () {
                    // music
                    this._music.play();
                },
                setup: function () {
                    // music
                    this._music = sounds["snd/mortuary.mp3"];
                    this._music.loop = true;
                    // background
                    const background = new PIXI.Sprite(PIXI.loader.resources["img/boobuster.json"].textures["bg_home.png"]);
                    this.state.scene.addChild(background);
                    // title
                    const title = new PIXI.Text("Boobuster", new PIXI.TextStyle({
                        fontSize: 40,
                        fill: "white"
                    }));
                    title.x = (applicationWidth / 2) - (title.width / 2);
                    title.y = 30;
                    this.state.scene.addChild(title);
                    // play
                    const play = new PIXI.Text("Play", new PIXI.TextStyle({
                        fontSize: 24,
                        fill: "white"
                    }));
                    play.x = (applicationWidth / 2) - (play.width / 2);
                    play.y = 395;
                    tink.makeInteractive(play);
                    play.release = () => {
                        app.setState("level", { level: 1 });
                    }
                    this.state.scene.addChild(play);
                    // boos
                    this._boos.push(new Boo());
                    this._boos.push(new BlueBoo());
                    this._boos.push(new DarkBoo());
                    this._boos.push(new PinkBoo());
                    this._boos.push(new KingBoo());
                    this._boos.push(new BlueKingBoo());
                    this._boos.forEach((boo) => {
                        this.state.scene.addChild(boo.getSprite());
                    });
                    // shortcuts
                    const h = tink.keyboard(72);
                    h.release = () => {
                        app.setState("home");
                    };
                },
                tick: function () {
                    // boos
                    this._boos.forEach((boo) => {
                        boo.move({ x: 0, y: 0, width: applicationWidth, height: applicationHeight });
                    });
                    bump.multipleCircleCollision(this._boos.map(boo => boo.getSprite()))
                },
                beforeLeave: function () {
                    // music
                    this._music.pause();
                }
            },
            level: {
                _mario: null,
                _boos: [],
                _bullets: [],
                _level: null,
                _lives: [],
                _music: null,
                _deviceorientationHandler: null,
                _marioShoot: function () {
                    const bullet = new Bullet();
                    bullet.getSprite().x = this._mario.getSprite().x + 5;
                    bullet.getSprite().y = this._mario.getSprite().y;
                    this._bullets.push(bullet);
                    this.state.scene.addChild(bullet.getSprite());
                    sounds["snd/fireball.wav"].play();
                },
                beforeEnter: function () {
                    // music
                    this._music.play();
                    // level
                    this._level.text = "Level : " + this.state.params.level;
                    // boos
                    this._boos.forEach(boo => {
                        this.state.scene.removeChild(boo.getSprite());
                    });
                    this._boos = [];
                    const booCount = this.state.params.level * 5;
                    for (let index = 0; index < booCount; index++) {
                        const boo = new Boo();
                        this._boos.push(boo);
                        this.state.scene.addChild(boo.getSprite());
                    }
                    // bullets
                    this._bullets.forEach(bullet => {
                        this.state.scene.removeChild(bullet.getSprite());
                    });
                    this._bullets = [];
                    // mario
                    if (this._mario) {
                        this.state.scene.removeChild(this._mario.getSprite());
                    }
                    this._mario = new Mario();
                    this.state.scene.addChild(this._mario.getSprite());
                    // lives
                    this._lives.forEach(life => {
                        life.getSprite().visible = true;
                    });
                    // device orientation
                    this._deviceorientationHandler = (event) => {
                        const gamma = Math.round(event.gamma);
                        if (gamma < 0) {
                            this._mario.getSprite().vx = Math.max(gamma, -5);
                        } else if (gamma > 0) {
                            this._mario.getSprite().vx = Math.min(gamma, 5);
                        } else {
                            this._mario.getSprite().vx = 0;
                        }
                    }
                    window.addEventListener("deviceorientation", this._deviceorientationHandler);
                },
                setup: function () {
                    // music
                    this._music = sounds["snd/beetlejuice.mp3"];
                    this._music.loop = true;
                    // background
                    const background = new PIXI.Sprite(PIXI.loader.resources["img/boobuster.json"].textures["bg_play.png"]);
                    tink.makeInteractive(background);
                    background.release = () => {
                        this._marioShoot();
                    };
                    this.state.scene.addChild(background);
                    // level
                    this._level = new PIXI.Text("", new PIXI.TextStyle({
                        fontSize: 20,
                        fill: "white"
                    }));
                    this._level.x = 10;
                    this._level.y = 10;
                    this.state.scene.addChild(this._level);
                    // lives
                    const liveCount = new Mario().getLifeCount();
                    for (let index = 1; index <= liveCount; index++) {
                        const life = new Life();
                        life.getSprite().x = applicationWidth - index * 34;
                        life.getSprite().y = 10;
                        this._lives.push(life);
                        this.state.scene.addChild(life.getSprite());
                    }
                    // mario
                    const up = tink.keyboard(38);
                    up.release = () => {
                        this._marioShoot();
                    };
                    const left = tink.keyboard(37);
                    left.press = () => {
                        this._mario.getSprite().vx = -5;
                    };
                    left.release = () => {
                        this._mario.getSprite().vx = 0;
                    };
                    const right = tink.keyboard(39);
                    right.press = () => {
                        this._mario.getSprite().vx = 5;
                    };
                    right.release = () => {
                        this._mario.getSprite().vx = 0;
                    };
                },
                tick: function () {
                    // mario
                    this._mario.move({ x: 0, y: 0, width: applicationWidth, height: applicationHeight });
                    // bullets
                    this._bullets.forEach(bullet => {
                        bullet.move();
                        if (bump.contain(bullet.getSprite(), { x: 0, y: 0, width: applicationWidth, height: applicationHeight }) !== undefined) {
                            this.state.scene.removeChild(bullet.getSprite());
                            this._bullets.splice(this._bullets.indexOf(bullet), 1);
                        }
                    });
                    // boos
                    this._boos.forEach(currentBoo => {
                        // all boos moves even if they are dead
                        currentBoo.move({ x: 0, y: 0, width: applicationWidth, height: applicationHeight });
                        // manage collision for leaving boos
                        if (!currentBoo.isDead()) {
                            // boo againt boo
                            const leavingBoos = this._boos.filter(boo => !boo.isDead());
                            leavingBoos.forEach(otherBoo => {
                                if (otherBoo != currentBoo) {
                                    if (bump.hitTestCircle(currentBoo.getSprite(), otherBoo.getSprite())) {
                                        bump.movingCircleCollision(currentBoo.getSprite(), otherBoo.getSprite());
                                    }
                                }
                            });
                            // boo againt bullet
                            this._bullets.forEach(bullet => {
                                if (bump.hitTestCircle(currentBoo.getSprite(), bullet.getSprite())) {
                                    bump.movingCircleCollision(currentBoo.getSprite(), bullet.getSprite());
                                    currentBoo.hit();
                                }
                            });
                            // boo against mario
                            if (!currentBoo.isHidding()) {
                                if (bump.hitTestCircle(currentBoo.getSprite(), this._mario.getSprite())) {
                                    this._mario.hit();
                                    this._lives[this._mario.getLifeCount()].getSprite().visible = false;
                                }
                            }
                        }
                    });
                    // check end
                    const leavingBoos = this._boos.filter(boo => !boo.isDead());
                    if (leavingBoos.length === 0) {
                        app.setState("level_finished", { level: this.state.params.level });
                    } else if (this._mario.isDead()) {
                        app.setState("game_over");
                    }
                },
                beforeLeave: function () {
                    // music
                    this._music.pause();
                    // device orientation
                    window.removeEventListener("deviceorientation", this._deviceorientationHandler);
                }
            },
            level_finished: {
                _message: null,
                _music: null,
                beforeEnter: function () {
                    // music
                    this._music.playFrom(0);
                    // message
                    this._message.text = "Level " + this.state.params.level + " cleared !";
                    this._message.x = (applicationWidth / 2) - (this._message.width / 2);
                },
                setup: function () {
                    // music
                    this._music = sounds["snd/level_finished.wav"];
                    // mario
                    const mario = new PIXI.Sprite(PIXI.loader.resources["img/boobuster.json"].textures["mario_win.png"]);
                    mario.x = (applicationWidth / 2) - (mario.width / 2);
                    mario.y = 60;
                    tink.makeInteractive(mario);
                    mario.release = () => {
                        app.setState("level", { level: this.state.params.level + 1 });
                    }
                    this.state.scene.addChild(mario);
                    // message
                    this._message = new PIXI.Text("", new PIXI.TextStyle({
                        fontSize: 40,
                        fill: "white"
                    }));
                    this._message.y = 360;
                    this.state.scene.addChild(this._message);
                },
                tick: function () {

                },
                beforeLeave: function () {
                    // music
                    this._music.pause();
                }
            },
            game_over: {
                _music: null,
                beforeEnter: function () {
                    // music
                    this._music.playFrom(0);
                },
                setup: function () {
                    // music
                    this._music = sounds["snd/mario_die.wav"];
                    // mario
                    const mario = new PIXI.Sprite(PIXI.loader.resources["img/boobuster.json"].textures["mario_sad.png"]);
                    mario.x = (applicationWidth / 2) - (mario.width / 2);
                    mario.y = 60;
                    tink.makeInteractive(mario);
                    mario.release = () => {
                        app.setState("home");
                    }
                    this.state.scene.addChild(mario);
                    // message
                    const message = new PIXI.Text("Game Over !", new PIXI.TextStyle({
                        fontSize: 40,
                        fill: "white"
                    }));
                    message.x = (applicationWidth / 2) - (message.width / 2);
                    message.y = 360;
                    this.state.scene.addChild(message);
                },
                tick: function () {

                },
                beforeLeave: function () {
                    // music
                    this._music.pause();
                }
            }
        }
    });
}(window.app || (window.app = {})));