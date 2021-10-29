import Fwk from "./../fwk.js";

import Boo from "./../classes/Boo.js";
import BlueBoo from "./../classes/BlueBoo.js";
import DarkBoo from "./../classes/DarkBoo.js";
import PinkBoo from "./../classes/PinkBoo.js";
import KingBoo from "./../classes/KingBoo.js";
import BlueKingBoo from "./../classes/BlueKingBoo.js";

Fwk.defineState("home", {
    _boos: [],
    _music: null,
    _playGame: function () {
        Fwk.moveToState("level", { level: 1 });
    },
    beforeEnter: function () {
        // music
        this._music.play();
    },
    setup: function () {
        // music
        this._music = Fwk.getSound("/snd/mortuary.mp3");
        this._music.loop(true);
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
        const play = new PIXI.Text("Play", new PIXI.TextStyle({
            fontSize: 24,
            fill: "white"
        }));
        play.x = (Fwk.applicationWidth / 2) - (play.width / 2);
        play.y = 395;
        Fwk.data.tink.makeInteractive(play);
        play.release = () => {
            Fwk.askDeviceOrientationEventPermission().then(() => {
                this._playGame();
            });
        }
        this.state.scene.addChild(play);
        // boos
        this._boos.push(new Boo());
        this._boos.push(new BlueBoo());
        this._boos.push(new DarkBoo());
        this._boos.push(new PinkBoo());
        this._boos.push(new KingBoo());
        this._boos.push(new BlueKingBoo());
        this._boos.forEach((boo) => {
            boo.getSprite().x = Fwk.data.gameUtilities.randomInt(0, Fwk.applicationWidth - boo.getSprite().height);
            boo.getSprite().y = Fwk.data.gameUtilities.randomInt(0, Fwk.applicationHeight - 200);
            boo.getSprite().vx = Fwk.data.gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
            boo.getSprite().vy = Fwk.data.gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
            this.state.scene.addChild(boo.getSprite());
        });
    },
    onKeyRelease: function (keyCode) {
        switch (keyCode) {
            case "Space": this._playGame(); break;
        }
    },
    onTick: function () {
        // boos
        this._boos.forEach((boo) => {
            boo.move({ x: 0, y: 0, width: Fwk.applicationWidth, height: Fwk.applicationHeight });
        });
        Fwk.data.bump.multipleCircleCollision(this._boos.map(boo => boo.getSprite()))
    },
    beforeLeave: function () {
        // music
        this._music.stop();
    }
});