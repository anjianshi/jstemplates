// 参考： https://github.com/babel/babel/blob/master/packages/babel-preset-es2015/src/index.js

function preset(context, opts) {
    return {
        presets: [
            [require('babel-preset-anjianshi-react').buildPreset, opts],
        ],
        plugins: [
            // decorators-legacy 必须出现在 class-properties 前面，它自身才能正常运行。
            require('babel-plugin-transform-decorators-legacy').default,

            // class-properties 必须出现在 proto-to-assign 前面，proto-to-assign 才能正常运行
            // babel 会先解析 plugins，后解析 presets，所以这里需要手动将它提前引入进来。
            require('babel-plugin-transform-class-properties'),

            // 使 IE9、10 支持 static properties
            // 官方说明： https://babeljs.io/docs/usage/caveats/#internet-explorer
            require('babel-plugin-transform-proto-to-assign')

            // 官方说明里还提到在 IE9、10 下对 super() 的解析有问题，需要将 es2015-classes 的 loose 参数设为 true 来解决。
            // 相关讨论： http://leonshi.com/2016/03/16/babel6-es6-inherit-issue-in-ie10/
            // 但经测试，貌似现在的版本已经将此问题解决，不需要再设置 loose 参数了。
        ]
    }
}

var oldConfig = preset()
module.exports = oldConfig

Object.defineProperty(oldConfig, "buildPreset", {
  configurable: true,
  writable: true,
  enumerable: false,
  value: preset
})
