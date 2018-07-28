import Fwk from "./../fwk.js";

Fwk.defineState("level_cleared", {
    _message: null,
    _music: null,
    _playNextLevel: function () {
        Fwk.moveToState("level", { level: this.state.params.level + 1 });
    },
    beforeEnter: function () {
        // music
        this._music.play();
        // message
        this._message.text = "Level " + this.state.params.level + " cleared !";
        this._message.x = (Fwk.applicationWidth / 2) - (this._message.width / 2);
    },
    setup: function () {
        // music
        this._music = Fwk.getSound("/snd/level_cleared.mp3");
        // mario
        const mario = new PIXI.Sprite(PIXI.Loader.shared.resources["/img/boobuster.json"].textures["mario_win.png"]);
        mario.x = (Fwk.applicationWidth / 2) - (mario.width / 2);
        mario.y = 60;
        Fwk.data.tink.makeInteractive(mario);
        mario.release = () => {
            this._playNextLevel();
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
    onKeyRelease: function (keyCode) {
        switch (keyCode) {
            case 32: this._playNextLevel(); break; // space
        }
    },
    onTick: function () {

    },
    beforeLeave: function () {
        // music
        this._music.stop();
    }
});   