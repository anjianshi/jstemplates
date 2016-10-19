// 参考： https://github.com/babel/babel/blob/master/packages/babel-preset-es2015/src/index.js

function preset(context, opts) {
    return {
        presets: [
            [require('babel-preset-latest'), { es2015: opts }],
            require('babel-preset-react'),
            require('babel-preset-stage-1')
        ],
        plugins: [
            require('babel-plugin-transform-decorators-legacy').default,
            require('jsx-control-statements')
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
