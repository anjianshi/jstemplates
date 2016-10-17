/*eslint-env node*/
"use strict";

// 依赖： eslint-plugin-react-native，以及上级 rules 文件的依赖
module.exports = {
    "extends": ['anjianshi-react'],

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
