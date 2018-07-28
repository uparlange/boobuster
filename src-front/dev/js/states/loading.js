import Fwk from "./../fwk.js";

Fwk.defineState("loading", {
    _message: null,
    beforeEnter: function () {

    },
    setup: function () {
        // message
        this._message = new PIXI.Text("", new PIXI.TextStyle({
            fontSize: 40,
            fill: "white"
        }));
        this._message.y = (Fwk.applicationHeight / 2) - (this._message.height / 2);
        this.state.scene.addChild(this._message);
    },
    onTick: function () {
        this._message.text = "Loading " + Fwk.data.loadingStep + "/" + Fwk.data.loadingSteps;
        this._message.x = (Fwk.applicationWidth / 2) - (this._message.width / 2) - 5;
    },
    beforeLeave: function () {

    }
});   