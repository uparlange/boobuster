(function (app) {
    const applicationWidth = 512;
    const applicationHeight = 512;
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
                const collision = app.getBumpLib().contain(this._sprite, constraints, true);
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
    class Mario extends CircularSprite {
        constructor() {
            super("mario.png");
            this._sprite.x = (applicationWidth / 2) - 16;
            this._sprite.y = applicationHeight - 64;
            this._sprite.vx = 0;
            this._sprite.vy = 0;
            this._lifeCount = 5;
            this._state = "normal";
            const left = app.getTinkLib().keyboard(37);
            left.press = () => {
                this.changeDirection(new Set().add("left"));
                this._sprite.vx = -5;
                this._sprite.vy = 0;
            };
            left.release = () => {
                if (!right.isDown && this._sprite.vy === 0) {
                    this._sprite.vx = 0;
                }
            };
            const right = app.getTinkLib().keyboard(39);
            right.press = () => {
                this.changeDirection(new Set().add("right"));
                this._sprite.vx = 5;
                this._sprite.vy = 0;
            };
            right.release = () => {
                if (!left.isDown && this._sprite.vy === 0) {
                    this._sprite.vx = 0;
                }
            };
        }
        hit() {
            if (this._state === "normal") {
                this._lifeCount--;
                if (this._lifeCount === 0) {
                    this._state = "dead";
                } else {
                    this._state = "hit";
                    // TODO make flash
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
        constructor() {
            const vx = app.getGameUtilitiesLib().randomInt(0, 1) === 0 ? -1 : 1;
            super(vx > 0 ? "boo_right.png" : "boo_left.png");
            this._sprite.x = app.getGameUtilitiesLib().randomInt(0, 480);
            this._sprite.y = app.getGameUtilitiesLib().randomInt(0, applicationHeight - 200);
            this._sprite.vx = vx;
            this._sprite.vy = app.getGameUtilitiesLib().randomInt(0, 1) === 0 ? -1 : 1;
            this._hitCount = 0;
            this._state = "normal";
        }
        hit() {
            if (this._state === "normal") {
                this._hitCount++;
                if (this._hitCount === 3) {
                    this._state = "dead";
                    this._sprite.alpha = 0.3;
                } else {
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
    app.define({
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
            "snd/fireball.wav", "snd/ghost_die.wav", "snd/mario_die.wav"
        ],
        defaultState: "home",
        states: {
            loading: {
                _count: 0,
                _message: null,
                beforeEnter: function () {

                },
                setup: function () {
                    this._message = new PIXI.Text("Loading", new PIXI.TextStyle({
                        fontSize: 40,
                        fill: "white"
                    }));
                    this._message.x = (applicationWidth / 2) - (this._message.width / 2) - 5;
                    this._message.y = (applicationHeight / 2) - (this._message.height / 2);
                    this.state.scene.addChild(this._message);
                },
                tick: function () {
                    this._count++;
                    this._message.text += ".";
                    if (this._count === 3) {
                        this._count = 0;
                        this._message.text = "Loading";
                    }
                },
                beforeLeave: function () {

                }
            },
            home: {
                beforeEnter: function () {

                },
                setup: function () {
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
                    play.y = 280;
                    this.state.scene.addChild(play);
                    // shortcuts
                    const p = app.getTinkLib().keyboard(80);
                    p.release = () => {
                        app.setState("play", { level: 1 });
                    };
                    const h = app.getTinkLib().keyboard(72);
                    h.release = () => {
                        app.setState("home");
                    };
                },
                tick: function () {

                },
                beforeLeave: function () {

                }
            },
            play: {
                _mario: null,
                _boos: [],
                _bullets: [],
                _level: null,
                _lives: null,
                _addBullet: function () {
                    const bullet = new Bullet();
                    bullet.getSprite().x = this._mario.getSprite().x + 5;
                    bullet.getSprite().y = this._mario.getSprite().y;
                    this._bullets.push(bullet);
                    this.state.scene.addChild(bullet.getSprite());
                },
                _removeBullet: function (bullet) {
                    this.state.scene.removeChild(bullet.getSprite());
                    this._bullets.splice(this._bullets.indexOf(bullet), 1);
                },
                beforeEnter: function () {
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
                    this._lives.text = "Lives : " + this._mario.getLifeCount();
                },
                setup: function () {
                    // background
                    const background = new PIXI.Sprite(PIXI.loader.resources["img/boobuster.json"].textures["bg_play.png"]);
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
                    this._lives = new PIXI.Text("", new PIXI.TextStyle({
                        fontSize: 20,
                        fill: "white"
                    }));
                    this._lives.x = 10;
                    this._lives.y = 40;
                    this.state.scene.addChild(this._lives);
                    // mario
                    const up = app.getTinkLib().keyboard(38);
                    up.release = () => {
                        this._addBullet();
                    };
                },
                tick: function () {
                    // lives
                    this._lives.text = "Lives : " + this._mario.getLifeCount();
                    // mario
                    this._mario.move({ x: 0, y: 0, width: applicationWidth, height: applicationHeight });
                    // bullets
                    this._bullets.forEach(bullet => {
                        bullet.move();
                        if (app.getBumpLib().contain(bullet.getSprite(), { x: 0, y: 0, width: applicationWidth, height: applicationHeight }) !== undefined) {
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
                                    if (app.getBumpLib().hitTestCircle(currentBoo.getSprite(), otherBoo.getSprite())) {
                                        app.getBumpLib().movingCircleCollision(currentBoo.getSprite(), otherBoo.getSprite());
                                    }
                                }
                            });
                            // boo againt bullet
                            this._bullets.forEach(bullet => {
                                if (app.getBumpLib().hitTestCircle(currentBoo.getSprite(), bullet.getSprite())) {
                                    app.getBumpLib().movingCircleCollision(currentBoo.getSprite(), bullet.getSprite());
                                    currentBoo.hit();
                                }
                            });
                            // boo against mario
                            if (!currentBoo.isHidding()) {
                                if (app.getBumpLib().hitTestCircle(currentBoo.getSprite(), this._mario.getSprite())) {
                                    this._mario.hit();
                                }
                            }
                        }
                    });
                    // check end
                    const leavingBoos = this._boos.filter(boo => !boo.isDead());
                    if (leavingBoos.length === 0) {
                        app.setState("play", { level: this.state.params.level + 1 });
                    } else if (this._mario.isDead()) {
                        app.setState("gameover");
                    }
                },
                beforeLeave: function () {

                }
            },
            gameover: {
                beforeEnter: function () {

                },
                setup: function () {
                    // mario
                    const mario = new PIXI.Sprite(PIXI.loader.resources["img/boobuster.json"].textures["mario_sad.png"]);
                    mario.x = (applicationWidth / 2) - (mario.width / 2);
                    mario.y = 60;
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

                }
            }
        }
    });
}(window.app || (window.app = {})));