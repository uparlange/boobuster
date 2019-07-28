const config = require("./config.json");
const express = require("express");
const compression = require("compression");
const pkg = require("./../package.json");

const PROD_MODE = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || config.expressPort;

const app = express();

app.use(compression());

app.use(express.static("src-front" + (PROD_MODE ? "/prod" : "/dev")));
config.expressStaticsVendorsConf.vendors.forEach(vendor => {
    app.use(config.expressStaticsVendorsConf.path, express.static(vendor.folder));
});

app.set("views", config.expressViewsConf.folder);
app.set("view engine", config.expressViewsConf.engine);
config.expressViewsConf.files.forEach((file, index, array) => {
    app.get(file.path, function (req, res) {
        res.render(file.value.split(".")[0], {
            title: pkg.name.toUpperCase(),
            vendorsConf: config.expressStaticsVendorsConf
        });
    });
});

app.listen(PORT, function () {
    console.debug("Listening on port " + PORT);
});