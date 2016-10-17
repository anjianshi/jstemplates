/*eslint-env node*/
'use strict';

module.exports = {
    extends: 'anjianshi-base',

    parser: 'babel-eslint',

    rules: {
        'strict': 0,            // babel 会自动给代码加上 use strict;
    }
};
