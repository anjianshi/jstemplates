/*eslint-env node*/
'use strict'

module.exports = {
    // 会导致程序不能正常运行的或明确禁止使用的句法设为 2-error；
    // 不会影响程序运行，但是不好的习惯的，设为 1-warning
    'rules': {
        // Possible Errors
        'no-await-in-loop': 0,
        'no-cond-assign': [2, 'except-parens'],
        'no-console': 0,
        'no-constant-condition': [2, {checkLoops: false}],
        'no-control-regex': 0,
        'no-debugger': 0,
        'no-dupe-args': 2,
        'no-dupe-keys': 2,
        'no-duplicate-case': 2,
        'no-empty-character-class': 2,
        'no-empty': 1,
        'no-ex-assign': 2,
        'no-extra-boolean-cast': 1,
        'no-extra-parens': 0,
        'no-extra-semi': 2,
        'no-func-assign': 2,
        'no-inner-declarations': [2, 'functions'],
        'no-invalid-regexp': 2,
        'no-irregular-whitespace': 2,
        'no-obj-calls': 2,
        'no-prototype-builtins': 2,
        'no-regex-spaces': 2,
        'no-sparse-arrays': 2,
        'no-template-curly-in-string': 2,
        'no-unexpected-multiline': 2,
        'no-unsafe-negation': 2,
        'no-unreachable': 1,
        'no-unsafe-finally': 2,
        'use-isnan': 2,
        'valid-typeof': 2,

        // Best Practices
        'accessor-pairs': 2,
        'array-callback-return': 2,
        'block-scoped-var': 1,
        'class-methods-use-this': 0,
        'complexity': 0,
        'curly': [2, 'multi-line'],
        'default-case': 1,
        'dot-location': [1, 'property'],
        'dot-notation': 1,
        'eqeqeq': [2, 'smart'],
        'guard-for-in': 1,
        'no-caller': 2,
        'no-case-declarations': 2,
        'no-div-regex': 1,
        'no-else-return': 0,
        'no-empty-function': 0,
        'no-empty-pattern': 1,
        'no-eq-null': 1,
        'no-eval': 2,
        'no-extend-native': 2,
        'no-extra-bind': 1,
        'no-extra-label': 0,
        'no-fallthrough': 1,
        'no-floating-decimal': 1,
        'no-global-assign': 1,
        'no-implicit-coercion': [1, {boolean: false}],
        'no-implicit-globals': 0,
        'no-implied-eval': 2,
        'no-invalid-this': 1,
        'no-iterator': 2,
        'no-labels': 2,
        'no-lone-blocks': 1,
        'no-loop-func': 0,
        'no-magic-numbers': 0,
        'no-multi-spaces': 1,
        'no-multi-str': 1,
        'no-new-func': 2,
        'no-new-wrappers': 2,
        'no-new': 0,
        'no-octal-escape': 2,
        'no-octal': 2,
        'no-param-reassign': 0,
        'no-proto': 2,
        'no-redeclare': [2, {builtinGlobals: true}],
        'no-restricted-properties': 0,
        'no-return-assign': [2, 'except-parens'],
        'no-return-await': 1,
        'no-script-url': 2,
        'no-self-compare': 2,
        'no-sequences': 2,
        'no-throw-literal': 2,
        'no-unused-expressions': 1,
        'no-unused-labels': 0,
        'no-useless-call': 1,
        'no-useless-concat': 1,
        'no-useless-escape': 1,
        'no-useless-return': 1,
        'no-void': 1,
        'no-warning-comments': 0,
        'no-with': 2,
        'prefer-promise-reject-errors': 2,
        'radix': [1, 'as-needed'],
        'require-await': 1,
        'vars-on-top': 0,
        'wrap-iife': [2, 'inside'],
        'yoda': 0,

        // Strict Mode
        'strict': [2, 'global'],

        // Variables
        'init-declarations': 0,
        'no-catch-shadow': 2,
        'no-delete-var': 2,
        'no-label-var': 2,
        'no-restricted-globals': 0,
        'no-shadow-restricted-names': 2,
        'no-shadow': 0,
        'no-undef-init': 2,
        'no-undef': 1,
        'no-undefined': 0,
        'no-unused-vars': 1,
        'no-use-before-define': 0,

        // Node.js and CommonJS
        'callback-return': 0,
        'global-require': 0,
        'handle-callback-err': 0,
        'no-mixed-requires': 0,
        'no-new-require': 0,
        'no-path-concat': 0,
        'no-process-env': 0,
        'no-process-exit': 0,
        'no-restricted-modules': 0,
        'no-sync': 0,

        // Stylistic Issues
        'array-bracket-spacing': [1, 'never'],
        'block-spacing': 0,
        'brace-style': [1, '1tbs', {allowSingleLine: true}],
        'camelcase': 0,
        'capitalized-comments': 0,
        'comma-dangle': 0,
        'comma-spacing': [1, {before: false, after: true}],
        'comma-style': [1, 'last'],
        'computed-property-spacing': [1, 'never'],
        'consistent-this': 0,
        'eol-last': 1,
        'func-call-spacing': 2,
        'func-name-matching': 0,
        'func-names': 0,
        'func-style': 0,
        'id-blacklist': 0,
        'id-length': 0,
        'id-match': 0,
        'indent': 0,
        'jsx-quotes': [1, 'prefer-double'],
        'key-spacing': [1, {beforeColon: false, afterColon: true, mode: 'strict'}],
        'keyword-spacing': [1, {overrides: {
            'if': {after: false},
            'for': {after: false},
            'while': {after: false},
            'switch': {after: false},
            'catch': {after: false}
        }}],
        'line-comment-position': 0,
        'linebreak-style': [1, 'unix'],
        'lines-around-comment': 0,
        'lines-around-directive': 0,
        'max-depth': 0,
        'max-len': 0,
        'max-lines': 0,
        'max-nested-callbacks': 0,
        'max-params': 0,
        'max-statements-per-line': 0,
        'max-statements': 0,
        'multiline-ternary': 0,
        'new-cap': 0,
        'new-parens': 1,
        'newline-after-var': 0,
        'newline-before-return': 0,
        'newline-per-chained-call': 0,
        'no-array-constructor': 1,
        'no-bitwise': 0,
        'no-continue': 0,
        'no-inline-comments': 0,
        'no-lonely-if': 0,
        'no-mixed-operators': 0,
        'no-mixed-spaces-and-tabs': 2,
        'no-multi-assign': 0,
        'no-multiple-empty-lines': 0,
        'no-negated-condition': 0,
        'no-nested-ternary': 0,
        'no-new-object': 1,
        'no-plusplus': 0,
        'no-restricted-syntax': 0,
        'no-tabs': 0,
        'no-ternary': 0,
        'no-trailing-spaces': 1,
        'no-underscore-dangle': 0,
        'no-unneeded-ternary': 1,
        'no-whitespace-before-property': 0,
        'object-curly-newline': 0,
        'object-curly-spacing': 0,
        'object-property-newline': 0,
        'one-var-declaration-per-line': 0,
        'one-var': 0,
        'operator-assignment': 0,
        'operator-linebreak': 0,
        'padded-blocks': 0,
        'quote-props': 0,
        'quotes': [1, 'single', {avoidEscape: true, allowTemplateLiterals: true}],
        'require-jsdoc': 0,
        'semi-spacing': [1, {before: false, after: true}],
        'semi': 0,
        'sort-keys': 0,
        'sort-vars': 0,
        'space-before-blocks': 1,
        'space-before-function-paren': [1, 'never'],
        'space-in-parens': [1, 'never'],
        'space-infix-ops': 0,
        'space-unary-ops': [1, { words: true, nonwords: false }],
        'spaced-comment': 0,
        'unicode-bom': 0,
        'template-tag-spacing': 2,
        'wrap-regex': 0,


        // ECMAScript 6
        'arrow-body-style': 0,
        'arrow-parens': 0,
        'arrow-spacing': [1, {before: true, after: true}],
        'constructor-super': 2,
        'generator-star-spacing': 0,
        'no-class-assign': 2,
        'no-confusing-arrow': 0,
        'no-const-assign': 2,
        'no-dupe-class-members': 2,
        'no-duplicate-imports': 0,
        'no-new-symbol': 0,
        'no-restricted-imports': 0,
        'no-this-before-super': 2,
        'no-useless-computed-key': 0,
        'no-useless-constructor': 0,
        'no-useless-rename': 0,
        'no-var': 0,
        'object-shorthand': 0,
        'prefer-arrow-callback': 0,
        'prefer-const': 1,
        'prefer-destructuring': 0,
        'prefer-numeric-literals': 1,
        'prefer-reflect': 0,
        'prefer-rest-params': 0,
        'prefer-spread': 0,
        'prefer-template': 0,
        'require-yield': 0,
        'rest-spread-spacing': 0,
        'sort-imports': 0,
        'symbol-description': 0,
        'template-curly-spacing': 0,
        'yield-star-spacing': 0,
    }
}