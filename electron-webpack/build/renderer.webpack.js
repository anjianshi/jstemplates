"use strict";
const _ = require('lodash')
const env = require('./env')
const makeWebpackConfig = require('./makeConfig').makeWebpackConfig
const HtmlWebpackPlugin = require("html-webpack-plugin")


const htmlPlugin = new HtmlWebpackPlugin({
    path: env.dist + '/renderer',
    filename: 'index.html',
    template: env.src + '/renderer/index.html',
    inject: false,
})


// =======================


module.exports = makeWebpackConfig({
    context: env.src + '/renderer',
    entry: _.compact([
        env.hmr && 'webpack-hot-middleware/client',
        'babel-polyfill',
        env.src + '/renderer/index.js',
    ]),
    output: {
        path: env.dist + '/renderer',
        filename: 'index.js',
        pathinfo: env.dev,
    },
    resolve: {
        // 让处在很多级文件夹下的应用代码能更方便地引入顶层的代码
        // 例如不用 require('../../../helper)，直接 require("helper") 即可
        // https://github.com/webpack/webpack/issues/472
        root: env.src + '/renderer',
    },
    plugins: [htmlPlugin],

    // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
    target: 'electron-renderer'
}, true)
