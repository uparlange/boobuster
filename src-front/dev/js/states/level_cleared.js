import Fwk from "./../fwk.js";

const music = Fwk.getSound("/snd/level_cleared.mp3");

let message = null;

const playNextLevel = function (state) {
    Fwk.moveToState("level", { level: state.params.level + 1 });
};

Fwk.defineState("level_cleared", {
    beforeEnter: function () {
        // music
        music.play();
        // message
        message.text = "Level " + this.state.params.level + " cleared !";
        message.x = (Fwk.applicationWidth / 2) - (message.width / 2);
    },
    setup: function () {
        // mario
        const mario = new PIXI.Sprite(PIXI.Loader.shared.resources["/img/boobuster.json"].textures["mario_win.png"]);
        mario.x = (Fwk.applicationWidth / 2) - (mario.width / 2);
        mario.y = 60;
        Fwk.userModel.tink.makeInteractive(mario);
        mario.release = () => {
            playNextLevel(this.state);
        }
        this.state.scene.addChild(mario);
        // message
        message = new PIXI.Text("", new PIXI.TextStyle({
            fontSize: 40,
            fill: "white"
        }));
        message.y = 360;
        this.state.scene.addChild(message);
    },
    onKeyRelease: function (keyCode) {
        switch (keyCode) {
            case "Space": playNextLevel(this.state); break;
        }
    },
    onTick: function () {

    },
    beforeLeave: function () {
        // music
        music.stop();
    }
});