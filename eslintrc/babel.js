/*eslint-env node*/
'use strict';

// 使用了 babel 的情况下的 rules
module.exports = {
    extends: './base',

    parser: 'babel-eslint',

    rules: {
        'strict': 0,            // babel 会自动给代码加上 use strict;
    }
};
