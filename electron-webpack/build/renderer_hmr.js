'use strict';

const express = require('express')
const querystring = require('querystring')
const fs = require('fs')
const webpack = require('webpack')
const config = require('./renderer.webpack.js')
const env = require('./env')


const app = express()

function withQuery(req, path) {
    let query = querystring.stringify(req.query)
    if(query) { query = '?' + query }
    return path + query
}

/*
适配 react-router，碰到不符合匹配规则的请求，一律返回首页。
以便能正确处理 react-router 通过 pushState 功能构建出来的原本不存在的 URL。
例如： localhost:9000/index.js 就是正常 URL； localhost:9000/goods/picture/5 像这个就应该转换成返回首页
*/
app.use((req, res, next) => {
    const patterns = [
        /__webpack_hmr/,
        /\.(js|map|json|css|html)$/,
        /\.(jpg|png|gif|svg)$/,
    ]
    for(const pattern of patterns) {
        if(req.path.match(pattern)) {
            next()
            return
        }
    }

    req.url = withQuery(req, '/')
    next()
})


// ======= 配置 dev 和 hot middleware ===========

const compiler = webpack(config)

// https://github.com/webpack/webpack-dev-middleware#usage
app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    stats: {
        colors: true
    },
    publicPath: '/',
}))

app.use(require('webpack-hot-middleware')(compiler))


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

    server = require('https').createServer(credentials, app)
} else {
    server = require('http').createServer(app)
}

server.listen(port, host, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log(`Listening at ${protocol}://${host}:${port}`)
        console.log(`manual run 'yarn start' to start Electron app`)
    }
});
