/*eslint-env node*/
"use strict";

module.exports = {
    "extends": ["./react"],

    "plugins": ["react-native"],

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
