(function (app) {
    app.fwkDefineState("loading", {
        _message: null,
        beforeEnter: function () {

        },
        setup: function () {
            // message
            this._message = new PIXI.Text("", new PIXI.TextStyle({
                fontSize: 40,
                fill: "white"
            }));
            this._message.y = (app.applicationHeight / 2) - (this._message.height / 2);
            this.state.scene.addChild(this._message);
        },
        onTick: function () {
            this._message.text = "Loading " + app.loadingStep + "/" + app.loadingSteps;
            this._message.x = (app.applicationWidth / 2) - (this._message.width / 2) - 5;
        },
        beforeLeave: function () {

        }
    });
}(window.app || (window.app = {})));    