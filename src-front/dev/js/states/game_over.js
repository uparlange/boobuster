import Fwk from "./../fwk.js";

Fwk.defineState("game_over", {
    _music: null,
    _returnToHome: function () {
        Fwk.moveToState("home");
    },
    beforeEnter: function () {
        // music
        this._music.play();
    },
    setup: function () {
        // music
        this._music = Fwk.getSound("/snd/mario_die.mp3");
        // mario
        const mario = new PIXI.Sprite(PIXI.Loader.shared.resources["/img/boobuster.json"].textures["mario_sad.png"]);
        mario.x = (Fwk.applicationWidth / 2) - (mario.width / 2);
        mario.y = 60;
        Fwk.data.tink.makeInteractive(mario);
        mario.release = () => {
            this._returnToHome();
        }
        this.state.scene.addChild(mario);
        // message
        const message = new PIXI.Text("Game Over !", new PIXI.TextStyle({
            fontSize: 40,
            fill: "white"
        }));
        message.x = (Fwk.applicationWidth / 2) - (message.width / 2);
        message.y = 360;
        this.state.scene.addChild(message);
    },
    onKeyRelease: function (keyCode) {
        switch (keyCode) {
            case 32: this._returnToHome(); break; // space
        }
    },
    onTick: function () {

    },
    beforeLeave: function () {
        // music
        this._music.stop();
    }
});