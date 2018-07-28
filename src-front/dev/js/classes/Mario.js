import Fwk from "./../fwk.js";

import Sprite from "./Sprite.js";

class Mario extends Sprite {
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
                Fwk.getSound("/snd/mario_hit.mp3").play();
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

export default Mario;