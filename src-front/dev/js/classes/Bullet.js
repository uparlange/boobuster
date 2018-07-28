import Sprite from "./Sprite.js";

class Bullet extends Sprite {
    constructor() {
        super({ default: "fireball.png" });
    }
}

export default Bullet;