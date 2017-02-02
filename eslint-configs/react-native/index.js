/*eslint-env node*/
"use strict";

module.exports = {
    "extends": ['anjianshi-react'],

    "plugins": ["react-native"],

    "rules": {
        "react-native/no-unused-styles": 1,
        "react-native/split-platform-components": 2,
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
    }
};
