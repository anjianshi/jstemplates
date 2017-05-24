// 参考： https://github.com/facebook/react-native/tree/master/babel-preset

module.exports = {
    presets: [
        require('babel-preset-react-native')
    ],
    plugins: [
        require('babel-plugin-transform-export-extensions'),
        require('babel-plugin-transform-decorators-legacy').default,
        require('hg-jsx-control-statements')
    ]
}
