(function (app) {
    app.fwkDefineState("home", {
        _boos: [],
        _music: null,
        _playGame: function () {
            app.fwkMoveToState("level", { level: 1 });
        },
        beforeEnter: function () {
            // music
            this._music.play();
        },
        setup: function () {
            // music
            this._music = app.fwkGetSound("/snd/mortuary.mp3");
            this._music.loop(true);
            // background
            const background = new PIXI.Sprite(PIXI.loader.resources["/img/boobuster.json"].textures["bg_home.png"]);
            this.state.scene.addChild(background);
            // title
            const title = new PIXI.Text("Boobuster", new PIXI.TextStyle({
                fontSize: 40,
                fill: "white"
            }));
            title.x = (app.applicationWidth / 2) - (title.width / 2);
            title.y = 30;
            this.state.scene.addChild(title);
            // play
            const play = new PIXI.Text("Play", new PIXI.TextStyle({
                fontSize: 24,
                fill: "white"
            }));
            play.x = (app.applicationWidth / 2) - (play.width / 2);
            play.y = 395;
            app.tink.makeInteractive(play);
            play.release = () => {
                this._playGame();
            }
            this.state.scene.addChild(play);
            // boos
            this._boos.push(new Boo()); /* global Boo */
            this._boos.push(new BlueBoo()); /* global BlueBoo */
            this._boos.push(new DarkBoo()); /* global DarkBoo */
            this._boos.push(new PinkBoo()); /* global PinkBoo */
            this._boos.push(new KingBoo()); /* global KingBoo */
            this._boos.push(new BlueKingBoo()); /* global BlueKingBoo */
            this._boos.forEach((boo) => {
                boo.getSprite().x = app.gameUtilities.randomInt(0, app.applicationWidth - boo.getSprite().height);
                boo.getSprite().y = app.gameUtilities.randomInt(0, app.applicationHeight - 200);
                boo.getSprite().vx = app.gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
                boo.getSprite().vy = app.gameUtilities.randomInt(0, 1) === 0 ? -1 : 1;
                this.state.scene.addChild(boo.getSprite());
            });
        },
        onKeyRelease: function (keyCode) {
            switch (keyCode) {
                case 32: this._playGame(); break; // space
            }
        },
        onTick: function () {
            // boos
            this._boos.forEach((boo) => {
                boo.move({ x: 0, y: 0, width: app.applicationWidth, height: app.applicationHeight });
            });
            app.bump.multipleCircleCollision(this._boos.map(boo => boo.getSprite()))
        },
        beforeLeave: function () {
            // music
            this._music.stop();
        }
    });
}(window.app || (window.app = {})));    