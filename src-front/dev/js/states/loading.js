import Fwk from "./../fwk.js";

let message = null;

Fwk.defineState("loading", {
    beforeEnter: function () {

    },
    setup: function () {
        // message
        message = new PIXI.Text("", new PIXI.TextStyle({
            fontSize: 40,
            fill: "white"
        }));
        message.y = (Fwk.applicationHeight / 2) - (message.height / 2);
        this.state.scene.addChild(message);
    },
    onTick: function () {
        message.text = "Loading " + Fwk.userModel.loadingStep + "/" + Fwk.userModel.loadingSteps;
        message.x = (Fwk.applicationWidth / 2) - (message.width / 2) - 5;
    },
    beforeLeave: function () {

    }
});   