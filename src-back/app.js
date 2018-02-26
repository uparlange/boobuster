const PROD_MODE = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3000;

const express = require("express");

const app = express();

app.use(express.static("src-front" + (PROD_MODE ? "/prod" : "/dev")));
app.use("/js/vendors", express.static("node_modules/pixi.js/dist"));
app.use("/js/vendors", express.static("node_modules/howler/dist"));

app.listen(PORT, function () {
    console.debug("Listening on port " + PORT);
});