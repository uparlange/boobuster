import Fwk from "./../fwk.js";

const music = Fwk.getSound("/snd/mario_die.mp3");

const returnToHome = function () {
    Fwk.moveToState("home");
}

Fwk.defineState("game_over", {
    beforeEnter: function () {
        // music
        music.play();
    },
    setup: function () {
        // mario
        const mario = new PIXI.Sprite(PIXI.Loader.shared.resources["/img/boobuster.json"].textures["mario_sad.png"]);
        mario.x = (Fwk.applicationWidth / 2) - (mario.width / 2);
        mario.y = 60;
        Fwk.userModel.tink.makeInteractive(mario);
        mario.release = () => {
            returnToHome();
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
            case "Space": returnToHome(); break;
        }
    },
    onTick: function () {

    },
    beforeLeave: function () {
        // music
        music.stop();
    }
});