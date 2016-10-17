'use strict';
// 将整理过的 package.json 添加到 webpack 的编译结果里
const env = require('./env')
const rawPkg = require(env.base + '/package.json')
const mainDependencies = require(env.base + '/mainDependencies.json')
const _ = require('lodash')


function DistPackageJsonPlugin() {}

DistPackageJsonPlugin.prototype.apply = function(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
        const pkg = _.pick(rawPkg, 'name', 'version', 'main')
        // renderer 依赖的类库已经由 webpack 打包进 bundle 里了，不再需要依赖。
        // main process 依赖的类库不会被 webpack 处理，需要安装到 node_modules 后，额外交给 electron-packager 来打包
        pkg.dependencies = mainDependencies
        const content = JSON.stringify(pkg)

        compilation.assets['package.json'] = {
            source: () => content,
            size: () => content.length,
        }

        callback()
    })
}

module.exports = DistPackageJsonPlugin
