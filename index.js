const express = require("express");
const app = express();
app.use(express.static("www"));
app.use("/vendors", express.static("vendors"));
app.use("/vendors", express.static("node_modules/pixi.js/dist"));
app.use("/vendors", express.static("node_modules/howler/dist"));
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Listening on port " + port + "!");
})