module.exports = {
    presets: [
        require('babel-preset-latest'),
        require('babel-preset-react'),
        require('babel-preset-stage-1'),
    ],
    plugins: [
        require('babel-plugin-transform-decorators-legacy').default,
        require('jsx-control-statements'),
    ],
}
