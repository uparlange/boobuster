const express = require("express");
const app = express();
app.use(express.static("www"));
app.use("/vendors", express.static("vendors"));
app.use("/vendors", express.static("node_modules/pixi.js/dist"));
app.listen(3000, function () {
    console.log("Listening on port 3000!");
})