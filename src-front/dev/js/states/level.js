import Fwk from "./../fwk.js";

import Boo from "./../classes/Boo.js";
import Life from "./../classes/Life.js";
import Mario from "./../classes/Mario.js";
import Bullet from "./../classes/Bullet.js";

Fwk.defineState("level", {
    _defaultMarioLifeCount: 5,
    _mario: null,
    _boos: [],
    _bullets: [],
    _level: null,
    _lives: [],
    _music: null,
    _addBullet: function () {
        const bullet = new Bullet();
        bullet.getSprite().x = this._mario.getSprite().x + 5;
        bullet.getSprite().y = this._mario.getSprite().y;
        bullet.getSprite().vx = 0;
        bullet.getSprite().vy = -5;
        this._bullets.push(bullet);
        this.state.scene.addChild(bullet.getSprite());
        Fwk.getSound("/snd/fireball.mp3").play();
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
            boo.getSprite().x = Fwk.data.gameUtilities.randomInt(0, Fwk.applicationWidth - boo.getSprite().height);
            boo.getSprite().y = Fwk.data.gameUtilities.randomInt(0, Fwk.applicationHeight - 200);
            boo.getSprite().vx = Fwk.data.gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
            boo.getSprite().vy = Fwk.data.gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
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
            this._mario.getSprite().x = (Fwk.applicationWidth / 2) - (this._mario.getSprite().width / 2);
        }
        // lives
        this._lives.forEach(life => {
            life.getSprite().visible = true;
        });
    },
    setup: function () {
        // music
        this._music = Fwk.getSound("/snd/beetlejuice.mp3");
        this._music.loop(true);
        // background
        const background = new PIXI.Sprite(PIXI.Loader.shared.resources["/img/boobuster.json"].textures["bg_play.png"]);
        Fwk.data.tink.makeInteractive(background);
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
            life.getSprite().x = Fwk.applicationWidth - index * 34;
            life.getSprite().y = 10;
            this._lives.push(life);
            this.state.scene.addChild(life.getSprite());
        }
        // mario
        this._mario = new Mario();
        this._mario.getSprite().x = (Fwk.applicationWidth / 2) - (this._mario.getSprite().width / 2);
        this._mario.getSprite().y = Fwk.applicationHeight - this._mario.getSprite().height;
        this.state.scene.addChild(this._mario.getSprite());
    },
    onDeviceOrientation: function (event) {
        const gamma = Math.round(event.gamma);
        const sprite = this._mario.getSprite();
        if (gamma < 0) {
            sprite.vx = Math.max(gamma, -5);
        } else if (gamma > 0) {
            sprite.vx = Math.min(gamma, 5);
        } else {
            sprite.vx = 0;
        }
    },
    onKeyPress: function (keyCode) {
        switch (keyCode) {
            case 37: this._mario.getSprite().vx = -5; break; // left
            case 39: this._mario.getSprite().vx = 5; break; // right
        }
    },
    onKeyRelease: function (keyCode) {
        switch (keyCode) {
            case 32: this._addBullet(); break; // space
            case 37: this._mario.getSprite().vx = 0; break; // left
            case 39: this._mario.getSprite().vx = 0; break; // right
        }
    },
    onTick: function () {
        // mario
        this._mario.move({ x: 0, y: 0, width: Fwk.applicationWidth, height: Fwk.applicationHeight });
        // bullets
        this._bullets.forEach(bullet => {
            bullet.move();
            if (Fwk.data.bump.contain(bullet.getSprite(), { x: 0, y: 0, width: Fwk.applicationWidth, height: Fwk.applicationHeight }) !== undefined) {
                this._removeBullet(bullet);
            }
        });
        // boos
        this._boos.forEach(currentBoo => {
            // all boos moves even if they are dead
            currentBoo.move({ x: 0, y: 0, width: Fwk.applicationWidth, height: Fwk.applicationHeight });
            // manage collision for leaving boos
            if (!currentBoo.isDead()) {
                // boo againt boo
                const leavingBoos = this._boos.filter(boo => !boo.isDead());
                leavingBoos.forEach(otherBoo => {
                    if (otherBoo != currentBoo) {
                        if (Fwk.data.bump.hitTestCircle(currentBoo.getSprite(), otherBoo.getSprite())) {
                            Fwk.data.bump.movingCircleCollision(currentBoo.getSprite(), otherBoo.getSprite());
                        }
                    }
                });
                // boo againt bullet
                this._bullets.forEach(bullet => {
                    if (Fwk.data.bump.hitTestCircle(currentBoo.getSprite(), bullet.getSprite())) {
                        Fwk.data.bump.movingCircleCollision(currentBoo.getSprite(), bullet.getSprite());
                        this._removeBullet(bullet);
                        currentBoo.hit();
                    }
                });
                // boo against mario
                if (!currentBoo.isProtecting()) {
                    if (Fwk.data.bump.hitTestCircle(currentBoo.getSprite(), this._mario.getSprite())) {
                        this._mario.hit();
                        this._lives[this._mario.lifeCount].getSprite().visible = false;
                    }
                }
            }
        });
        // check end
        const leavingBoos = this._boos.filter(boo => !boo.isDead());
        if (leavingBoos.length === 0) {
            Fwk.moveToState("level_cleared", { level: this.state.params.level });
        } else if (this._mario.isDead()) {
            Fwk.moveToState("game_over");
        }
    },
    beforeLeave: function () {
        // music
        this._music.stop();
    }
});  