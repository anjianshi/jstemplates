/*eslint-env node*/
'use strict'

var merge = require('./utils').merge
var react = require('./react')

module.exports = merge(react, {
    "plugins": ["react-native"],

    "rules": {
        "react-native/no-unused-styles": 1,
        "react-native/split-platform-components": 0,
        "react-native/no-inline-styles": 1,
        "react-native/no-color-literals": 1
    },

    "globals": {
        require: true,
        console: true,
        setTimeout: true,
        setInterval: true,
        clearTimeout: true,
        clearInterval: true,
        XMLHttpRequest: true,
        alert: true,
        process: true,
        global: true,
        window: true,
        navigator: true,
        __DEV__: true,
    }
})
