import Fwk from "./../fwk.js";

import Boo from "./../classes/Boo.js";
import BlueBoo from "./../classes/BlueBoo.js";
import DarkBoo from "./../classes/DarkBoo.js";
import PinkBoo from "./../classes/PinkBoo.js";
import KingBoo from "./../classes/KingBoo.js";
import BlueKingBoo from "./../classes/BlueKingBoo.js";

const BUTTON_SIZE = 50;
const boos = [];
const music = Fwk.getSound("/snd/mortuary.mp3");

let playButton = null;

const playGame = function () {
    Fwk.moveToState("level", { level: 1 });
};

const updatePlayButtonWidthAndPosition = function () {
    const buttonSize = Fwk.userModel.tink.scale * BUTTON_SIZE;
    playButton.style.borderRadius = (buttonSize / 2) + "px";
    playButton.style.width = buttonSize + "px";
    playButton.style.height = buttonSize + "px";
    playButton.style.left = ((window.innerWidth / 2) - (buttonSize / 2)) + "px";
    let buttonBottom = Fwk.userModel.tink.scale * 78;
    const spaceHeight = window.innerHeight - (Fwk.userModel.tink.scale * Fwk.applicationHeight);
    if(spaceHeight > 0) {
        buttonBottom += spaceHeight / 2;
    }
    playButton.style.bottom = buttonBottom + "px";
};

Fwk.defineState("home", {
    beforeEnter: function () {
        // music
        music.play();
    },
    setup: function () {
        // music
        music.loop(true);
        // background
        const background = new PIXI.Sprite(PIXI.Loader.shared.resources["/img/boobuster.json"].textures["bg_home.png"]);
        this.state.scene.addChild(background);
        // title
        const title = new PIXI.Text("Boobuster", new PIXI.TextStyle({
            fontSize: 40,
            fill: "white"
        }));
        title.x = (Fwk.applicationWidth / 2) - (title.width / 2);
        title.y = 30;
        this.state.scene.addChild(title);
        // play
        playButton = document.createElement("button");
        playButton.style.position = "absolute";
        playButton.style.border = "1px solid white";
        playButton.style.background = "none";
        playButton.style.color = "white";
        playButton.innerHTML = "Play";
        playButton.onclick = () => {
            Fwk.askDeviceOrientationEventPermission().then(() => {
                playGame();
            });
        }
        document.body.appendChild(playButton);
        updatePlayButtonWidthAndPosition();
        // boos
        boos.push(new Boo());
        boos.push(new BlueBoo());
        boos.push(new DarkBoo());
        boos.push(new PinkBoo());
        boos.push(new KingBoo());
        boos.push(new BlueKingBoo());
        boos.forEach((boo) => {
            boo.getSprite().x = Fwk.userModel.gameUtilities.randomInt(0, Fwk.applicationWidth - boo.getSprite().height);
            boo.getSprite().y = Fwk.userModel.gameUtilities.randomInt(0, Fwk.applicationHeight - 200);
            boo.getSprite().vx = Fwk.userModel.gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
            boo.getSprite().vy = Fwk.userModel.gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
            this.state.scene.addChild(boo.getSprite());
        });
    },
    onResize: function () {
        updatePlayButtonWidthAndPosition();
    },
    onKeyRelease: function (keyCode) {
        switch (keyCode) {
            case "Space": playGame(); break;
        }
    },
    onTick: function () {
        // boos
        boos.forEach((boo) => {
            boo.move({ x: 0, y: 0, width: Fwk.applicationWidth, height: Fwk.applicationHeight });
        });
        Fwk.userModel.bump.multipleCircleCollision(boos.map(boo => boo.getSprite()))
    },
    beforeLeave: function () {
        // button
        document.body.removeChild(playButton);
        // music
        music.stop();
    }
});