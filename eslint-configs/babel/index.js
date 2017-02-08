/*eslint-env node*/
'use strict';

module.exports = {
    extends: 'anjianshi-base',

    parser: 'babel-eslint',

    env: {
        es6: true               // 此设定是有必要的，不然 eslint 会认为 Set / Map 等对象是不存在 / 不允许使用的
    },

    rules: {
        'strict': 0,            // babel 会自动给代码加上 use strict;
    }
};
