/* env 中包含了对 command 相关需求的分析，以及从 packConfig 里提取出来的内容 */

const path = require('path')
const _ = require('lodash')

exports.generateEnv = function generateEnv(command, packConfigPath) {
    // 要注意 packConfig 里不要有和 baseEnv 重名的键
    const baseEnv = {
        dev: process.env.NODE_ENV === 'development',    // 除非明确指定为 development，否则都视为 production
        inHmr: command === 'hmr',
        useCdn: command === 'compile-upload'
    }
    const packConfig = loadPackConfig(packConfigPath, baseEnv)
    const env = Object.assign({}, packConfig, baseEnv)
    return env
}

// 注意：设计了新的配置项时，一定要把它的定义补充进来，不然用户为那个配置项赋的值会被抛弃。
const packConfigTemplate = {
    clearOutputPath: false,

    entry: null,
    vendors: null,
    outputPath: null,
    publicPath: null,

    html: {
        template: null,
        title: null,
        bodyContent: '<div id="root"></div>',
        // faviconUrl 和 Path 任选一个
        // 若 favicon 通过其他模块提供，则通过 faviconUrl 指定那个模块提供的 url
        // 若 favicon 文件就放在当前模块内，则可通过 faviconPath 指定此文件在硬盘上的路径，打包时会把它纳入进来。
        // favicon 只支持 png 格式
        faviconUrl: null,
        faviconPath: null,
        baiduTongjiCode: null,
    },

    hmr: {
        port: 9000,

        /*
        是否裸着使用 hmr server，即用户在浏览器里直接通过 hmr server 访问网站
        为 false，则是在 hmr server 前面另罩一层 app server，由它将请求转发给 hmr server

        这两种状态的区别：
        - 非 bare 情况下，一个资源文件引用另一个资源文件时，使用的是前置 app server 的路径（域名和端口），而不是 hmr server 提供文件的路径。
          因为浏览器载入文件时需要通过前置 server 来载入而不是直接和 hmr server 交互。

          此外，非 bare 情况下，hmr 以 "/" 而不是 webpack 里配置的 publicPath 为基础路径来提供对文件的访问。
          以便于前置 server 向 hmr server 获取文件。

        - bare 情况下，每当访问的路径不存在对应的文件时，就会输出 index.html 的内容，以支持 react-router 动态生成的 URL
          非 bare 情况下，此行为交由前置 server 处理
        */
        bare: false,

        // 此功能应该只在 bare 情况下用得上，因为非 bare 情况下，可以由前置 server 进行 proxy
        proxy: null,

        // 这些属性在 bare 和非 bare 情况下都有可能用得上
        // 在 bare 环境下，自然不用说；
        // 在非 bare 情况下，需要通过这些属性让 hmr server 监听的域名和协议与前置 server 匹配，
        // 不然 hmr client js 有可能无法正常和 hmr server 通讯
        domain: 'localhost',
        sslCert: null,
        sslKey: null,
    },

    webpackConfig: null,    // 这里默认值不能设成 {}，不然后面 merge 时会导致忽略使用者指定的内容

    cdn: {
        bucket: null,
        accessKey: null,
        secretKey: null,
        prefix: '/',
        visitBaseUrl: null,
    }
}

function loadPackConfig(configPath, baseEnv) {
    let packConfig = require(path.resolve(process.cwd(), configPath))
    if(typeof packConfig === 'function') {
        packConfig = packConfig(baseEnv)
    }

    const mergedPackConfig = {}
    function mergePackConfig(node, _parentPath) {
        if(!_parentPath) _parentPath = []
        _.each(node, (value, key) => {
            const path = [..._parentPath, key]
            if(_.isPlainObject(value)) {
                mergePackConfig(value, path)
            } else {
                _.set(
                    mergedPackConfig,
                    path,
                    _.get(packConfig, path, value)
                )
            }
        })
    }
    mergePackConfig(packConfigTemplate)
    return mergedPackConfig
}
