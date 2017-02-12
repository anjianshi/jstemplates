const path = require('path')
const urlJoin = require('url-join')     // path.join() 不能用于 url，它会把 http:// 转换成 http:/，因此需要此工具
const _ = require('lodash')

module.exports = function makeWebpackConfig() {
    if(!process.env.PACK_ARGS) throw Error("can't get PACK_ARGS")
    const packArgs = JSON.parse(process.env.PACK_ARGS)
    const env = require('./env').generateEnv(packArgs.command, packArgs.configPath)

    const config = {};
    [basePart, entryAndChunkPart, babelPart, stylePart, indexHTMLPart].forEach(
        partFunc => mergeConfig(config, partFunc(env))
    )
    mergeConfig(config, env.webpackConfig || {})
    return config
}

// 以后可以考虑要不要用 webpack-merge 代替此函数
// https://github.com/survivejs/webpack-merge
function mergeConfig(config, updates) {
    _.forIn(updates, (value, key) => {
        if(!(key in config)) {
            config[key] = value
        } else if(_.isPlainObject(config[key])) {
            mergeConfig(config[key], value)
        } else if(_.isArray(config[key])) {
            config[key] = config[key].concat(value)
        } else {
            throw new Error('config 与 updates 合并失败。冲突的 key：' + key)
        }
    })
}


// ================================================


const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

/*
许多配置内容是依照 webpack 官网上的指导来设置的。

= Caching 优化
https://webpack.js.org/guides/caching/
目标：尽可能多地利用浏览器缓存。
为此，要给文件名加上 hash，因为 hash 可以作为判断文件是否变化的参考依据，有了这个依据我们就可以给浏览器设置很长的缓存时间，
使得只要 hash 没变，就能一直直接从缓存里取出脚本内容；而当文件内容变化时，因为 hash（文件名）也跟着变，又能保证浏览器立刻载入新文件。

对于有多 chunk 的环境（例如配置了 code spliting 把 3rd library 单独拆分成了一个 chunk 或是用来实现 lazy load），
还应尽可能做到每次打包时，只有内容变化了的 chunk 的 hash 发生变化，内容没变的 chunk 的 hash 不发生变化。
对于这一点，有一个要注意的事：webpack 默认把 chunk manifest 放在 entry chunk 里。
这就使得只要有任意 chunk 发生变化，entry chunk 就必然也跟着变化。
为了解决此问题，我们需要想办法把 chunk manifest 从 entry chunk 提取出来，例如生成一个单独的 js 文件，或记录到 index.html 里。

= HMR 配置
https://webpack.js.org/guides/hmr-react
https://webpack.js.org/configuration/dev-server
*/

function getPublicPath(env) {
    const hmr = env.hmr
    return env.inHmr
        // 在 HMR 环境下解决 CSS 里 url() 解析不正确的问题。详见 stylePart 的注释
        ? urlJoin(`${hmr.sslCert ? 'https' : 'http'}://${hmr.domain}:${hmr.port}`, env.publicPath)
        : (env.useCdn
            ? urlJoin(env.cdn.visitBaseUrl, env.cdn.prefix, '/')
            : env.publicPath)
}

function basePart(env) {
    const config = {
        // 可选的 devtool 类型见： https://webpack.js.org/configuration/devtool/
        // 经测试，cheap-module-source-map、cheap-source-map 无法生成准确的 JavaScript source map，
        // 在代码里进行 console.log() 然后在 chrome dev tools 里跳转到对应的代码，看到的是 babel 编译后的代码，而不是原始代码。
        // 只有 source-map 没有问题。
        // 目前原因不明。
        devtool: 'source-map',

        plugins: [
            // 设置 App 代码及其引用的类库里能读取到的 process.env 内容
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(env.dev ? 'development' : 'production')
                }
            }),
        ],

        devServer: {
            hot: true,
            host: '0.0.0.0',
            port: env.hmr.port,
            https: env.hmr.sslCert ? {
                cert: fs.readFileSync(env.hmr.sslCert),
                key: fs.readFileSync(env.hmr.sslKey),
            } : false,
            proxy: env.hmr.proxy || {},
            historyApiFallback: {
                rewrites: [
                    { from: /./, to: urlJoin(getPublicPath(env), 'index.html') }
                ]
            },
        }
    }

    if(!env.dev) {
        config.plugins.push(
            // UglifyJS API 文档： http://lisperator.net/uglifyjs/
            // 以下配置里，通过 `compress: {}` 可以向 UglifyJS compressor 指定参数；
            // 通过 `output: {}`，可以向 UglifyJS code generator 指定参数
            // 详见 https://github.com/webpack/webpack/blob/master/lib/optimize/UglifyJsPlugin.js
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,

                compress: {
                    // 要求 UglifyJS 不将 o['abc'] 转换成 o.abc
                    // 不然对于 ES6 module 相关的代码： module['default'] 会被转换成 module.default，导致在 IE8 及以下浏览器里报错
                    // 这个报错连在 manifest chunk 里都会出现，使得整个 app 里所有脚本，包括用来引导用户更新浏览器的脚本都没办法运行。
                    properties: false,
                    // 让 UglifyJS 不要输出许多我们用不到的提示信息
                    warnings: false
                }
            })
        )
    }

    if(env.inHmr) {
        config.plugins = config.plugins.concat([
            new webpack.HotModuleReplacementPlugin()
        ])
    }

    return config
}


function entryAndChunkPart(env) {
    const mainEntry = env.inHmr
        ? [
            'react-hot-loader/patch',
            'webpack-dev-server/client?' + (env.hmr.sslCert ? 'https' : 'http') + '://' + env.hmr.domain + ':' + env.hmr.port,
            'webpack/hot/only-dev-server',
            env.entry
        ]
        : env.entry

    /*
    配置 common chunk
    进行此配置有两个目标：
    1. 将 library（vendor）内容抽离成一个独立的 chunk，因为 library 的更新频率相对较低、app 代码的更新频率相对较高，
       将 library 内容抽离出来，就可以做到 app 代码更新时，vendor chunk 的文件名不会变化，因而可以继续利用之前的缓存

    2. 生成一个独立的 manifest chunk，里面包含了 webpack 的 manifest 信息。
       以解决只要有任意代码发生变化，包含了 manifest 的 entry chunk 就会更新（尽管它自身的内容没有变化，但写入到它里面的 manifest 变化了）的问题

    生成 vendor chunk 需要两个步骤：
    1. 在 app entry 之外，建立一个 vendor entry，在里面指定上要抽离哪些 library
       （不然光靠 CommonsChunkPlugin 是没法精确指定要抽离出哪些 library 的）

    2. 在 CommonsChunkPlugin 里，定义一个 common chunk，并指明使用上面建立的那个 vender entry 来作为这个 chunk 的内容。
       光靠建立 vendor entry，是没法实现对 library 的抽离的。它确实会建立一个 entry，并且里面包含了这些 library，
       但它并不会对 app entry 产生影响，最终 app entry 还是会再次引入那些 library。
       （在没设置 common chunk 的情况下，vendor entry 和 app entry 对 webpack 来说，是完全无关的两个项目，相当于是两个独立的网站）
       而建立 common chunk 的行为，则使 webpack 对这两个 entry 的关系的认识发生了调整：
       1. 它告诉 webpack：“vendor entry 和 app entry 中的部分共通的内容会被抽离出来，我们载入 vendor entry 或 app entry 时，
          会自行保证先把抽出的那部分载入进来，然后再载入 entry 内容。”
       2. 因为我们告诉 CommonChunkPlugin，把 vendor entry 的内容作为 common chunk 的内容，所以它会把整个 vendor entry 的内容都放入
          common chunk，然后因为 vendor entry 自身已经没有其他内容了，它就会从最终生成的代码列表里消失。
          然后 CommonChunkPlugin 将自己建立的那个 common chunk 命名为 vendor，来取代已经消失的 vendor entry。
       3. 我们最终要做的，就是在页面里先引入 vendor chunk，再引入 app 的 chunk，这样便实现了 library 内容的抽离。

    CommonsChunkPlugin 默认的行为是把被很多地方引用到的内容单独抽离出来，做成 common chunk。
    这一行为不是我们需要的，我们需要的是把更新频率较低的内容抽离出来。
    因此在配置 CommonsChunkPlugin 时，要注意不要基于它默认的行为方式和用途来思考。

    生成 manifest chunk 是利用了一个小技巧：
    webpack 会把 manifest 内容放在 common chunk 里。定义了多个 common chunk 的情况下，会放到最后一个定义的 common chunk 里。
    （在载入时，后面的这个 chunk 需要先载入）
    因此，我们只要多定义一个 common chunk，就能自动把 manifest 内容收集进去了。
    （所以这个 chunk 其实叫什么名字都行，不用非得叫 manifest）

    指定 "minChunks: Infinity" 确保了除我们明确指定的内容外，没有其他内容会被添加到 common chunk 里。
    在有 vendors 的情况下，它确保 vendor chunk 里不会包含 vendors 外的内容
    在没有 vendors 的情况下，它确保 manifest chunk 里不会包含 app script

    https://webpack.js.org/guides/caching/#deterministic-hashes
    这里的蓝色部分有一些官方对 common chunk 行为的描述
    */
    const entrys = env.vendors
        ? { vendor: env.vendors, main: mainEntry }
        : mainEntry
    const plugin = new webpack.optimize.CommonsChunkPlugin({
        names: env.vendors ? ['vendor', 'manifest'] : ['manifest'],
        minChunks: Infinity,
    })

    const config = {
        entry: entrys,
        output: {
            // 输出的文件名中应尽量使用 `chunkhash` 而不是 `hash`。
            // 因为在有多个 chunk 的情况下，`hash` 对应的是代码总体的 hash，只要有任意一个 chunk 更新，所有 chunk 的文件名都会变化，
            // 严重影响对缓存的使用。
            // -----
            // 不过 chunkhash 在 hmr 模式下无效，所以在此模式下只能用 hash
            // https://github.com/webpack/webpack/issues/1363
            filename: `[name].[${env.inHmr ? 'hash' : 'chunkhash'}].js`,
            path: env.outputPath,
            pathinfo: env.dev,
            publicPath: getPublicPath(env)
        },
        plugins: [plugin],
    }

    // 要求 webpack 使用 file path / hash 来引用 module，而不是数字 id，以避免多次打包中，对于同一个文件生成了不同的数字 id。
    // （这会导致文件名在文件内容没有变化的情况下依然发生变化，进而导致浏览器缓存失效）
    // 具体的效果就是，在生成的代码里，执行 require() 时，传进去的参数不再是数字，而是 path 或 hash。
    // 详见： https://webpack.js.org/guides/caching/#deterministic-hashes
    // --------
    // 在 hmr 模式下，使用 NamedModulesPlugin 还有另外一个好处，官方的说法是：
    // “prints more readable module names in the browser console on HMR updates”
    // 见： https://webpack.js.org/guides/hmr-react/#webpack-config
    config.plugins.push(env.dev ? new webpack.NamedModulesPlugin() : new webpack.HashedModuleIdsPlugin())

    // recordsPath 也是用来解决和上面同样的问题，目前不清楚在已经使用了上面的 plugin 的情况下，是否还有必要设置它。
    // 官方尚没有对此功能的详细说明。
    // 另外，如果每次打包前都会清空文件夹、并使得此文件也删除了的话，使用它同样没有意义。
    // 一篇参考资料： https://github.com/webpack/webpack/issues/1315#issuecomment-158677302
    config.recordsPath = path.join(env.outputPath, '/webpack_records_path.json')

    return config
}


function babelPart(env) {
    const rule = {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
            // 开启 cache 可以加快二次编译时的编译速度，但也有可能因使用了过时的缓存导致页面出现 bug。
            // 因此生产环境中应把此功能关闭。
            cacheDirectory: env.dev,
            // 因为 webpack 自身支持解析 ES6 Module，所以要关闭 babel 的 module 转换功能
            // （在正式文档里没有看到这方面介绍，但在介绍 HMR 配置的地方提到了这一问题 https://webpack.js.org/guides/hmr-react/#code ）
            presets: [['anjianshi-react', { modules: false }]]
        }
    }
    return { module: { rules: [rule] } }
}


/*
== 解决开启了 css-loader 的 sourceMap 后，CSS 里的 url() 引用不正确的问题

CSS 中，当 url() 的值不是一个完整的 URL（包含协议、域名...）时，它会根据 CSS 文件而不是网页的 URL 来解析。
webpack 的 css-loader 开启了 sourceMap 后，CSS 文件的 URL 会被识别成类似 `webpack://` 的值，因此会出现 url() 值无法正确解析的问题。
详见这个 issue：https://github.com/webpack-contrib/css-loader/issues/29
和 style-loader 文档里的 Note 部分： https://github.com/webpack-contrib/style-loader#recommended-configuration

一个解决办法是使用 ExtractTextPlugin，它能把 CSS 被抽离成一个实际的文件，这样它的 URL 就是它实际被载入的路径，因此不会碰到上面的问题。
但是 ExtractTextPlugin 在 HMR 环境下没法使用，因此我们还得为 HMR 环境再准备一种解决办法。

另一个解决办法是将 webpack 的 publicPath 设置成包含协议、域名的完整 URL。
刚好现在的 packConfig 的 hmr 部分里，有对 domain 和 port 的设置，直接使用它们的值，即可构建出完整的 URL。
这样，问题就得到解决了。

其实还有一个有可能可行的更通用的解决办法：
在 entry 前面加一个用来修正 publicPath 的辅助脚本，
它会对 publicPath 进行检查，如果 publicPath 不是包含协议、域名等的完整 url，就由它根据它所在的 <script> 标签的载入路径，把 publicPath 里的协议、域名和端口部分补充完整。
这个方法有一个不确定性：url() 的值是在打包时写死的，还是在前端生成 style 标签时才计算出来的，如果是前者，那就无能为力了。
因为上面的方式已经能够解决问题了，因此就不再费劲实现这种解决办法了。
*/
function stylePart(env) {
    /*
    通过 ExtractTextPlugin，将 style 单独提取成一个文件，而不是混在 JavaScript 内。
    它的好处是可以让 style 和 app 脚本并行载入，这样 style 就可以提前完成载入，并提前开始渲染。
    不然就必须等整个 app 脚本都载入完毕，才能开始渲染 style，这就导致页面刚开始会有一段没有样式的空白时间。

    不过 ExtractTextPlugin 在 HMR 模式下无法使用。
    */
    const plugins = env.inHmr ? [] : [new ExtractTextPlugin('app-[contenthash:20].css')]

    const styleLoader = { loader: 'style-loader' }
    const cssLoader = {
        loader: 'css-loader',
        options: {
            // 开启 CSS Module
            modules: true,
            localIdentName: '_[local]__[hash:base64:8]',
            // 启用 source map
            // ExtractTextPlugin 对 source map 的类型有要求，必须使用 'original source'（lines only 也可以）级别的
            // 不然生成的 source map 文件的 content 值会是空的
            sourceMap: true,
        }
    }
    const stylusLoader = { loader: 'stylus-loader' }

    const styleRule = {
        test: /\.styl$/,
        use: env.inHmr
            ? [styleLoader, cssLoader, stylusLoader]
            : ExtractTextPlugin.extract({
                use: [cssLoader, stylusLoader],
                fallback: styleLoader,
            })
    }

    const imgRule = {
        test: /\.(gif|png|jpg|svg)$/,
        loader: 'url-loader',
        options: {
            limit: 10000,                     // 10kb 以上的图片会改用 file-loader 加载
            name: '[name]-[hash:20].[ext]'    // 使用 file-loader 时，用此格式为文件命名
        }
    }

    return {
        module: { rules: [styleRule, imgRule] },
        plugins: plugins
    }
}


function indexHTMLPart(env) {
    const plugins = []

    plugins.push(new HtmlWebpackPlugin({
        template: env.html.template || path.join(__dirname, 'template_index.html'),
        title: env.html.title,
        inject: false,

        bodyContent: env.html.bodyContent,
        baiduTongjiCode: env.html.baiduTongjiCode,
        faviconUrl: env.html.faviconPath ? urlJoin(getPublicPath(env), 'favicon.png') : null
    }))

    if(env.html.faviconPath) {
        plugins.push(new CopyWebpackPlugin([
            { from: env.html.faviconPath, to: 'favicon.png' }
        ]))
    }

    return { plugins: plugins }
}
