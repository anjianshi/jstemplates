'use strict';
const webpack = require('webpack')
const _ = require('lodash')
const env = require('./env')


exports.makeWebpackConfig = function makeWebpackConfig(overrideConfigs={}, supportHMR=false) {
    const config = {
        // 因为 webpack 无论在开发还是生产环境下，都会把多个文件合并成一个，因此在两种情况下都需要 source-map 以帮助进行调试
        // 对 source-map 格式的选择来自这里： http://cheng.logdown.com/posts/2016/03/25/679045
        // 经测试，在 HMR 环境下 `cheap-module-source-map` 无法正常运行，所以这里不加 '-module'
        devtool: 'cheap-source-map',
        plugins: [
            // 设置 main 和 renderer process　能读取到的 process.env　内容
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify(env.dev ? "development" : "production"),
                    HMR: JSON.stringify(env.hmr ? '1' : '0'),
                }
            })
        ]
    }

    if(!env.dev) {
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
        )
    }
    if(env.hmr && supportHMR) {
        config.plugins = config.plugins.concat([
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin()
        ])
    }

    merge(config, makeBabelConfig())
    merge(config, makeStyleConfig())
    merge(config, overrideConfigs)

    return config
}


function makeBabelConfig() {
    const compileConfig = {
        // 开启 cache 可以加快二次编译时的编译速度，但也有可能因使用了过时的缓存导致页面出现 bug。
        // 因此生产环境中应把此功能关闭。
        cacheDirectory: env.dev,
        presets: [['anjianshi-react', { modules: false }]]
    }
    const loaderUri = 'babel?' + JSON.stringify(compileConfig)
    const loader = { test: /\.js$/, exclude: /node_modules/, loader: loaderUri }

    return {
        module: {
            loaders: [loader]
        }
    }
}


function makeStyleConfig() {
    // 在 hmr 状态下，启用 sourceMap 会导致 css 中的 url() 引用不正常
    const localIdentName = 'localIdentName=_[local]__[hash:base64:8]'
    return {
        module: {
            loaders: [
                 { test: /\.styl$/, loader: `style!css?${env.hmr ? 'sourceMap&' : ''}${localIdentName}!stylus` },
            ]
        },
    }
}


// =========================================


function merge(obj, updates) {
    _.forIn(updates, (value, key) => {
        if(!(key in obj)) {
            obj[key] = value
        } else if(_.isPlainObject(obj[key])) {
            merge(obj[key], value)
        } else if(_.isArray(obj[key])) {
            obj[key] = obj[key].concat(value)
        } else {
            throw new Error("updates 与原 object 合并失败。冲突的 key：" + key)
        }
    })
}
