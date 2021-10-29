import Fwk from "./../fwk.js";

import Boo from "./../classes/Boo.js";
import Life from "./../classes/Life.js";
import Mario from "./../classes/Mario.js";
import Bullet from "./../classes/Bullet.js";

const DEFAULT_MARIO_LIFE_COUNT = 5;

const music = Fwk.getSound("/snd/beetlejuice.mp3");
const boos = [];
const bullets = [];
const lives = [];

let mario = null;
let level = null;

const addBullet = function (state) {
    const bullet = new Bullet();
    bullet.getSprite().x = mario.getSprite().x + 5;
    bullet.getSprite().y = mario.getSprite().y;
    bullet.getSprite().vx = 0;
    bullet.getSprite().vy = -5;
    bullets.push(bullet);
    state.scene.addChild(bullet.getSprite());
    Fwk.getSound("/snd/fireball.mp3").play();
};

const removeBullet = function (state, bullet) {
    state.scene.removeChild(bullet.getSprite());
    bullets.splice(bullets.indexOf(bullet), 1);
};

Fwk.defineState("level", {
    beforeEnter: function () {
        // music
        music.play();
        // level
        level.text = "Level : " + this.state.params.level;
        // boos
        boos.forEach(boo => {
            this.state.scene.removeChild(boo.getSprite());
        });
        boos.length = 0;
        const booCount = this.state.params.level * 5;
        for (let index = 0; index < booCount; index++) {
            const boo = new Boo();
            boo.getSprite().x = Fwk.userModel.gameUtilities.randomInt(0, Fwk.applicationWidth - boo.getSprite().height);
            boo.getSprite().y = Fwk.userModel.gameUtilities.randomInt(0, Fwk.applicationHeight - 200);
            boo.getSprite().vx = Fwk.userModel.gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
            boo.getSprite().vy = Fwk.userModel.gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
            boos.push(boo);
            this.state.scene.addChild(boo.getSprite());
        }
        // bullets
        bullets.forEach(bullet => {
            this.state.scene.removeChild(bullet.getSprite());
        });
        bullets.length = 0;
        // mario
        if (mario) {
            mario.lifeCount = DEFAULT_MARIO_LIFE_COUNT;
            mario.getSprite().x = (Fwk.applicationWidth / 2) - (mario.getSprite().width / 2);
        }
        // lives
        lives.forEach(life => {
            life.getSprite().visible = true;
        });
    },
    setup: function () {
        // music
        music.loop(true);
        // background
        const background = new PIXI.Sprite(PIXI.Loader.shared.resources["/img/boobuster.json"].textures["bg_play.png"]);
        Fwk.userModel.tink.makeInteractive(background);
        background.release = () => {
            addBullet(this.state);
        };
        this.state.scene.addChild(background);
        // level
        level = new PIXI.Text("", new PIXI.TextStyle({
            fontSize: 20,
            fill: "white"
        }));
        level.x = 10;
        level.y = 10;
        this.state.scene.addChild(level);
        // lives
        for (let index = 1; index <= DEFAULT_MARIO_LIFE_COUNT; index++) {
            const life = new Life();
            life.getSprite().x = Fwk.applicationWidth - index * 34;
            life.getSprite().y = 10;
            lives.push(life);
            this.state.scene.addChild(life.getSprite());
        }
        // mario
        mario = new Mario();
        mario.getSprite().x = (Fwk.applicationWidth / 2) - (mario.getSprite().width / 2);
        mario.getSprite().y = Fwk.applicationHeight - mario.getSprite().height;
        this.state.scene.addChild(mario.getSprite());
    },
    onDeviceOrientation: function (event) {
        const value = Math.round(event.leftToRight);
        const sprite = mario.getSprite();
        if (value < 0) {
            sprite.vx = Math.max(value, -5);
        } else if (value > 0) {
            sprite.vx = Math.min(value, 5);
        } else {
            sprite.vx = 0;
        }
    },
    onKeyPress: function (keyCode) {
        switch (keyCode) {
            case "ArrowLeft": mario.getSprite().vx = -5; break;
            case "ArrowRight": mario.getSprite().vx = 5; break;
        }
    },
    onKeyRelease: function (keyCode) {
        switch (keyCode) {
            case "Space": addBullet(this.state); break;
            case "ArrowLeft": mario.getSprite().vx = 0; break;
            case "ArrowRight": mario.getSprite().vx = 0; break;
        }
    },
    onTick: function () {
        // mario
        mario.move({ x: 0, y: 0, width: Fwk.applicationWidth, height: Fwk.applicationHeight });
        // bullets
        bullets.forEach(bullet => {
            bullet.move();
            if (Fwk.userModel.bump.contain(bullet.getSprite(), { x: 0, y: 0, width: Fwk.applicationWidth, height: Fwk.applicationHeight }) !== undefined) {
                removeBullet(this.state, bullet);
            }
        });
        // boos
        boos.forEach(currentBoo => {
            // all boos moves even if they are dead
            currentBoo.move({ x: 0, y: 0, width: Fwk.applicationWidth, height: Fwk.applicationHeight });
            // manage collision for leaving boos
            if (!currentBoo.isDead()) {
                // boo against boo
                const livingBoos = boos.filter(boo => !boo.isDead());
                livingBoos.forEach(otherBoo => {
                    if (otherBoo != currentBoo) {
                        if (Fwk.userModel.bump.hitTestCircle(currentBoo.getSprite(), otherBoo.getSprite())) {
                            Fwk.userModel.bump.movingCircleCollision(currentBoo.getSprite(), otherBoo.getSprite());
                        }
                    }
                });
                // boo against bullet
                bullets.forEach(bullet => {
                    if (Fwk.userModel.bump.hitTestCircle(currentBoo.getSprite(), bullet.getSprite())) {
                        Fwk.userModel.bump.movingCircleCollision(currentBoo.getSprite(), bullet.getSprite());
                        removeBullet(this.state, bullet);
                        currentBoo.hit();
                    }
                });
                // boo against mario
                if (!currentBoo.isProtecting()) {
                    if (Fwk.userModel.bump.hitTestCircle(currentBoo.getSprite(), mario.getSprite())) {
                        mario.hit();
                        lives[mario.lifeCount].getSprite().visible = false;
                    }
                }
            }
        });
        // check end
        const livingBoos = boos.filter(boo => !boo.isDead());
        if (livingBoos.length === 0) {
            Fwk.moveToState("level_cleared", { level: this.state.params.level });
        } else if (mario.isDead()) {
            Fwk.moveToState("game_over");
        }
    },
    beforeLeave: function () {
        // music
        music.stop();
    }
});