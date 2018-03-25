const config = require("./config.json");
const express = require("express");

const PROD_MODE = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || config.expressPort;

const app = express();
app.use(express.static("src-front" + (PROD_MODE ? "/prod" : "/dev")));
config.expressStaticsVendorsConf.vendors.forEach(vendor => {
    app.use(config.expressStaticsVendorsConf.path, express.static(vendor.folder));
});
app.listen(PORT, function () {
    console.debug("Listening on port " + PORT);
});