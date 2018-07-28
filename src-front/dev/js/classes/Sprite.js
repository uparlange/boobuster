import Fwk from "./../fwk.js";

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
            const collision = Fwk.data.bump.contain(this._sprite, constraints, true);
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
        return PIXI.Loader.shared.resources["/img/boobuster.json"].textures[image];
    }
}

export default Sprite;