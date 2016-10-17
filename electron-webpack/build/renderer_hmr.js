'use strict';

const express = require("express")
const fs = require("fs")
const webpack = require("webpack")
const config = require("./renderer.webpack.js")
const env = require("./env")


const app = express()


// ======= 配置 dev 和 hot middleware ===========

const compiler = webpack(config)

// https://github.com/webpack/webpack-dev-middleware#usage
app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    stats: {
        colors: true
    },
    publicPath: "/",
}))

app.use(require("webpack-hot-middleware")(compiler))


// ======== listen ==================

const protocol = 'http'         // 也可以设置成 https，这样需要指定下面 ssl_key_path 和 ssl_cert_path 的值。
const host = '0.0.0.0'
const port = {TMP:HMR_port}
let server = null

if(protocol === 'https') {
    // 若将 protocol 设为 http，下面两项的值不用设置
    const ssl_key_path = {TMP:SSL_KEY_PATH}
    const ssl_cert_path = {TMP:SSL_CERT_PATH}

    const credentials = {
        key: fs.readFileSync(ssl_key_path),
        cert: fs.readFileSync(ssl_cert_path)
    }

    server = require("https").createServer(credentials, app)
} else {
    server = require("http").createServer(app)
}

server.listen(port, host, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log(`Listening at ${protocol}://${host}:${port}`)
        console.log(`manual run 'npm start' to start Electron app`)
    }
});
