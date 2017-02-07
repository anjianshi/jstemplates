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
        faviconPath: null,
        baiduTongjiCode: null,
    },

    hmr: {
        domain: 'localhost',
        port: 9000,
        sslCert: null,
        sslKey: null,
        proxy: null
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
