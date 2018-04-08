class Sprite { /* exported Sprite */
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
            const collision = window.app.bump.contain(this._sprite, constraints, true);
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
        return PIXI.loader.resources["/img/boobuster.json"].textures[image];
    }
}
class Bullet extends Sprite { /* exported Bullet */
    constructor() {
        super({ default: "fireball.png" });
    }
}
class Life extends Sprite { /* exported Life */
    constructor() {
        super({ default: "one_up.png" });
    }
}
class Mario extends Sprite { /* exported Mario */
    constructor() {
        super({ default: "mario.png" });
        this._lifeCount = 5;
        this._hitAnimationCount = 0;
        this._hitAnimationInterval = null;
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
                window.app.fwkGetSound("/snd/mario_hit.mp3").play();
                this._state = "hit";
                this._hitAnimation().then(() => {
                    this._state = "normal";
                });
            }
        }
    }
    isDead() {
        return this._state === "dead";
    }
    _hitAnimation() {
        return new Promise((resolve) => {
            this._sprite.alpha = 0;
            this._hitAnimationInterval = setInterval(() => {
                this._hitAnimationCount++;
                if (this._hitAnimationCount === 12) {
                    clearInterval(this._hitAnimationInterval);
                    this._hitAnimationCount = 0;
                    this._sprite.alpha = 1;
                    resolve();
                } else {
                    this._sprite.alpha = (this._sprite.alpha === 1 ? 0 : 1);
                }
            }, 250);
        });
    }
}
class Boo extends Sprite { /* exported Boo */
    constructor() {
        super({ left: "boo_left.png", right: "boo_right.png" });
        this._hitCount = 0;
        this._state = "normal";
    }
    hit() {
        if (this._state === "normal") {
            this._hitCount++;
            if (this._hitCount === 3) {
                window.app.fwkGetSound("/snd/ghost_die.mp3").play();
                this._state = "dead";
                this._sprite.alpha = 0.3;
            } else {
                window.app.fwkGetSound("/snd/boo_hit.mp3").play();
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
class BlueBoo extends Sprite { /* exported BlueBoo */
    constructor() {
        super({ left: "boo_blue_left.png", right: "boo_blue_right.png" });
    }
}
class DarkBoo extends Sprite { /* exported DarkBoo */
    constructor() {
        super({ left: "boo_dark_left.png", right: "boo_dark_right.png" });
    }
}
class PinkBoo extends Sprite { /* exported PinkBoo */
    constructor() {
        super({ left: "boo_pink_left.png", right: "boo_pink_right.png" });
    }
}
class KingBoo extends Sprite { /* exported KingBoo */
    constructor() {
        super({ left: "boo_king_left.png", right: "boo_king_right.png" });
    }
}
class BlueKingBoo extends Sprite { /* exported BlueKingBoo */
    constructor() {
        super({ left: "boo_blue_king_left.png", right: "boo_blue_king_right.png" });
    }
}