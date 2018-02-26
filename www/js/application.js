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
        constructor(images) {
            this._defaultImages = images;
            this._images = images;
            this._sprite = new PIXI.Sprite(this._getTexture(this._defaultImages.default));
            this._sprite.circular = true;
            this._sprite.vx = 0;
            this._sprite.vy = 0;
        }
        getSprite() {
            return this._sprite;
        }
        move(constraints) {
            this._sprite.x += this._sprite.vx;
            this._sprite.y += this._sprite.vy;
            this._sprite.texture = this._getTexture(this._sprite.vx > 0 ? this._images.right : this._images.left);
            if (constraints) {
                const collision = bump.contain(this._sprite, constraints, true);
                if (collision) {
                    if (collision.has("right")) {
                        this._sprite.texture = this._getTexture(this._images.left);
                    } else if (collision.has("left")) {
                        this._sprite.texture = this._getTexture(this._images.right);
                    }
                }
            }
        }
        _getTexture(image) {
            if (!image) {
                image = this._defaultImages.default;
            }
            return PIXI.loader.resources["img/boobuster.json"].textures[image];
        }
    }
    class Bullet extends Sprite {
        constructor() {
            super({ default: "fireball.png" });
        }
    }
    class Life extends Sprite {
        constructor() {
            super({ default: "one_up.png" });
        }
    }
    class Mario extends Sprite {
        constructor() {
            super({ default: "mario.png" });
            this._lifeCount = 5;
            this._state = "normal";
        }
        get lifeCount() {
            return this._lifeCount;
        }
        set lifeCount(value) {
            this._lifeCount = value;
            this._state = "normal";
        }
        hit() {
            if (this._state === "normal") {
                this._lifeCount--;
                if (this._lifeCount === 0) {
                    this._state = "dead";
                } else {
                    app.getSound("snd/mario_hit.wav").play();
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
    }
    class Boo extends Sprite {
        constructor() {
            super({ left: "boo_left.png", right: "boo_right.png" });
            this._hitCount = 0;
            this._state = "normal";
        }
        hit() {
            if (this._state === "normal") {
                this._hitCount++;
                if (this._hitCount === 3) {
                    app.getSound("snd/ghost_die.wav").play();
                    this._state = "dead";
                    this._sprite.alpha = 0.3;
                } else {
                    app.getSound("snd/boo_hit.wav").play();
                    this._state = "hidding";
                    this._images = { left: "boo_shy_left.png", right: "boo_shy_right.png" };
                    setTimeout(() => {
                        this._state = "normal";
                        this._images = this._defaultImages;
                    }, 3000);
                }
            }
        }
        isDead() {
            return this._state === "dead";
        }
        isProtecting() {
            return this._state === "hidding";
        }
    }
    class BlueBoo extends Sprite {
        constructor() {
            super({ left: "boo_blue_left.png", right: "boo_blue_right.png" });
        }
    }
    class DarkBoo extends Sprite {
        constructor() {
            super({ left: "boo_dark_left.png", right: "boo_dark_right.png" });
        }
    }
    class PinkBoo extends Sprite {
        constructor() {
            super({ left: "boo_pink_left.png", right: "boo_pink_right.png" });
        }
    }
    class KingBoo extends Sprite {
        constructor() {
            super({ left: "boo_king_left.png", right: "boo_king_right.png" });
        }
    }
    class BlueKingBoo extends Sprite {
        constructor() {
            super({ left: "boo_blue_king_left.png", right: "boo_blue_king_right.png" });
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
            "snd/beetlejuice.mp3", "snd/boo_hit.wav", "snd/fireball.wav", "snd/ghost_die.wav", "snd/level_cleared.wav",
            "snd/mario_die.wav", "snd/mario_hit.wav", "snd/mortuary.mp3"
        ],
        javascripts: [
            "/vendors/bump.js", "/vendors/gameUtilities.js", "/vendors/scaleToWindow.js", "/vendors/tink.js"
        ],
        defaultState: "home",
        handlers: {
            onBeforeLoad: function (PIXI) {

            },
            onJavascriptsLoaded: function (PIXI, view) {
                loadingStep++;
                scale = scaleToWindow(view);
                window.addEventListener("resize", () => {
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
                    // message
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
                    this._music = app.getSound("snd/mortuary.mp3");
                    this._music.loop(true);
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
                        app.moveTo("level", { level: 1 });
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
                        boo.getSprite().x = gameUtilities.randomInt(0, applicationWidth - boo.getSprite().height);
                        boo.getSprite().y = gameUtilities.randomInt(0, applicationHeight - 200);
                        boo.getSprite().vx = gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
                        boo.getSprite().vy = gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
                        this.state.scene.addChild(boo.getSprite());
                    });
                    // shortcuts
                    const h = tink.keyboard(72);
                    h.release = () => {
                        app.moveTo("home");
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
                    this._music.stop();
                }
            },
            level: {
                _defaultMarioLifeCount: 5,
                _mario: null,
                _boos: [],
                _bullets: [],
                _level: null,
                _lives: [],
                _music: null,
                _deviceorientationHandler: null,
                _addBullet: function () {
                    const bullet = new Bullet();
                    bullet.getSprite().x = this._mario.getSprite().x + 5;
                    bullet.getSprite().y = this._mario.getSprite().y;
                    bullet.getSprite().vx = 0;
                    bullet.getSprite().vy = -5;
                    this._bullets.push(bullet);
                    this.state.scene.addChild(bullet.getSprite());
                    app.getSound("snd/fireball.wav").play();
                },
                _removeBullet: function (bullet) {
                    this.state.scene.removeChild(bullet.getSprite());
                    this._bullets.splice(this._bullets.indexOf(bullet), 1);
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
                        boo.getSprite().x = gameUtilities.randomInt(0, applicationWidth - boo.getSprite().height);
                        boo.getSprite().y = gameUtilities.randomInt(0, applicationHeight - 200);
                        boo.getSprite().vx = gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
                        boo.getSprite().vy = gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
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
                        this._mario.lifeCount = this._defaultMarioLifeCount;
                        this._mario.getSprite().x = (applicationWidth / 2) - (this._mario.getSprite().width / 2);
                    }
                    // lives
                    this._lives.forEach(life => {
                        life.getSprite().visible = true;
                    });
                    // device orientation
                    this._deviceorientationHandler = (event) => {
                        const gamma = Math.round(event.gamma);
                        const sprite = this._mario.getSprite();
                        if (gamma < 0) {
                            sprite.vx = Math.max(gamma, -5);
                        } else if (gamma > 0) {
                            sprite.vx = Math.min(gamma, 5);
                        } else {
                            sprite.vx = 0;
                        }
                    }
                    window.addEventListener("deviceorientation", this._deviceorientationHandler);
                },
                setup: function () {
                    // music
                    this._music = app.getSound("snd/beetlejuice.mp3");
                    this._music.loop(true);
                    // background
                    const background = new PIXI.Sprite(PIXI.loader.resources["img/boobuster.json"].textures["bg_play.png"]);
                    tink.makeInteractive(background);
                    background.release = () => {
                        this._addBullet();
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
                    for (let index = 1; index <= this._defaultMarioLifeCount; index++) {
                        const life = new Life();
                        life.getSprite().x = applicationWidth - index * 34;
                        life.getSprite().y = 10;
                        this._lives.push(life);
                        this.state.scene.addChild(life.getSprite());
                    }
                    // mario
                    this._mario = new Mario();
                    this._mario.getSprite().x = (applicationWidth / 2) - (this._mario.getSprite().width / 2);
                    this._mario.getSprite().y = applicationHeight - this._mario.getSprite().height;
                    this.state.scene.addChild(this._mario.getSprite());
                    const up = tink.keyboard(38);
                    up.release = () => {
                        this._addBullet();
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
                            this._removeBullet(bullet);
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
                                    this._removeBullet(bullet);
                                    currentBoo.hit();
                                }
                            });
                            // boo against mario
                            if (!currentBoo.isProtecting()) {
                                if (bump.hitTestCircle(currentBoo.getSprite(), this._mario.getSprite())) {
                                    this._mario.hit();
                                    this._lives[this._mario.lifeCount].getSprite().visible = false;
                                }
                            }
                        }
                    });
                    // check end
                    const leavingBoos = this._boos.filter(boo => !boo.isDead());
                    if (leavingBoos.length === 0) {
                        app.moveTo("level_cleared", { level: this.state.params.level });
                    } else if (this._mario.isDead()) {
                        app.moveTo("game_over");
                    }
                },
                beforeLeave: function () {
                    // music
                    this._music.stop();
                    // device orientation
                    window.removeEventListener("deviceorientation", this._deviceorientationHandler);
                }
            },
            level_cleared: {
                _message: null,
                _music: null,
                beforeEnter: function () {
                    // music
                    this._music.play();
                    // message
                    this._message.text = "Level " + this.state.params.level + " cleared !";
                    this._message.x = (applicationWidth / 2) - (this._message.width / 2);
                },
                setup: function () {
                    // music
                    this._music = app.getSound("snd/level_cleared.wav");
                    // mario
                    const mario = new PIXI.Sprite(PIXI.loader.resources["img/boobuster.json"].textures["mario_win.png"]);
                    mario.x = (applicationWidth / 2) - (mario.width / 2);
                    mario.y = 60;
                    tink.makeInteractive(mario);
                    mario.release = () => {
                        app.moveTo("level", { level: this.state.params.level + 1 });
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
                    this._music.stop();
                }
            },
            game_over: {
                _music: null,
                beforeEnter: function () {
                    // music
                    this._music.play();
                },
                setup: function () {
                    // music
                    this._music = app.getSound("snd/mario_die.wav");
                    // mario
                    const mario = new PIXI.Sprite(PIXI.loader.resources["img/boobuster.json"].textures["mario_sad.png"]);
                    mario.x = (applicationWidth / 2) - (mario.width / 2);
                    mario.y = 60;
                    tink.makeInteractive(mario);
                    mario.release = () => {
                        app.moveTo("home");
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
                    this._music.stop();
                }
            }
        }
    });
}(window.app || (window.app = {})));