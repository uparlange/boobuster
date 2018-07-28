import Fwk from "./../fwk.js";

import Sprite from "./Sprite.js";

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
                Fwk.getSound("/snd/ghost_die.mp3").play();
                this._state = "dead";
                this._sprite.alpha = 0.3;
            } else {
                Fwk.getSound("/snd/boo_hit.mp3").play();
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

export default Boo;