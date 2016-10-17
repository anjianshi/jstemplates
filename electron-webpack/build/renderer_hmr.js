'use strict';

const express = require("express")
const fs = require("fs")
const https = require("https")
const webpack = require("webpack")
const config = require("./renderer.webpack.js")
const env = require("./env")


const app = express()


// ======= 配置 dev 和 hot middleware ===========

const compiler = webpack(config);

// https://github.com/webpack/webpack-dev-middleware#usage
app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    stats: {
        colors: true
    },
    publicPath: "/",
}));

app.use(require("webpack-hot-middleware")(compiler));


// ======== listen ==================

const host = '0.0.0.0';
const port = {TMP:HMR_port};
const credentials = {
    key: fs.readFileSync(env.ssl_key_path),
    cert: fs.readFileSync(env.ssl_cert_path)
};

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, host, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log(`Listening at https://${host}:${port}`)
        console.log(`manual run 'npm start' to start Electron app`)
    }
});
