/*eslint-env node*/
'use strict';

// babel + react + jsx-control-statements 环境下的 rules
module.exports = {
    extends: './babel',

    plugins: ['react', 'jsx-control-statements'],

    env: {
        'jsx-control-statements/jsx-control-statements': true
    },

    rules: {
        'no-unused-vars': [1, {'varsIgnorePattern': '^React$'}],     // React 会被 jsx 隐式使用

        'react/jsx-no-undef': 1,
        'react/jsx-uses-vars': 1,
        'react/no-did-update-set-state': 1,
        'react/no-unknown-property': 2,
        'react/react-in-jsx-scope': 2,

        'jsx-control-statements/jsx-choose-not-empty': 1,
        'jsx-control-statements/jsx-for-require-each': 1,
        'jsx-control-statements/jsx-for-require-of': 1,
        'jsx-control-statements/jsx-if-require-condition': 1,
        'jsx-control-statements/jsx-otherwise-once-last': 1,
        'jsx-control-statements/jsx-when-require-condition': 1,
        'jsx-control-statements/jsx-jcs-no-undef': 1,
        'no-undef': 0 // Replace this with jsx-jcs-no-undef
    },

    globals: {
        // 由 jsx-control-statements 提供
        If: true,
        Else: true,
        For: true,
        Choose: true,
        When: true,
        Otherwise: true,
    }
};
