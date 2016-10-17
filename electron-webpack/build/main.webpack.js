"use strict";
const webpack = require('webpack')
const DistPackageJsonPlugin = require('./DistPackageJsonPlugin')
const makeWebpackConfig = require('./makeConfig').makeWebpackConfig
const env = require('./env')
const dependencies = require(env.base + '/mainDependencies.json')

module.exports = makeWebpackConfig({
    context: env.src + '/main',
    entry: ['babel-polyfill', env.src + '/main/index.js'],
    output: {
        path: env.dist + '/main',
        filename: 'index.js',
        pathinfo: env.dev,
        libraryTarget: 'commonjs',
    },
    resolve: {
        // 让处在很多级文件夹下的应用代码能更方便地引入顶层的代码
        // 例如不用 require('../../../helper)，直接 require("helper") 即可
        // https://github.com/webpack/webpack/issues/472
        root: env.src + '/main'
    },
    plugins: [
        // Add source map support for stack traces in node
        // https://github.com/evanw/node-source-map-support
        new webpack.BannerPlugin(
          'require("source-map-support").install();',
          { raw: true, entryOnly: false }
        ),

        new DistPackageJsonPlugin(),
    ],

    // 以下内容参考了这里：
    // https://github.com/chentsulin/electron-react-boilerplate/blob/master/webpack.config.electron.js
    target: 'electron-main',

    node: {
        __dirname: false,
        __filename: false
    },

    // 把 main process 依赖的外部类库都在这里列出来，以使 webpack 不会去解析它们。
    // 这些类库不需要打包进 webpack bundle，而是会作为独立的代码被放置到部署目录中。
    // 此行为需配合 `output.libraryTarget: 'commonjs'` 一起使用
    // https://webpack.github.io/docs/configuration.html#externals
    externals: [
        ...Object.keys(dependencies)
    ]
})
