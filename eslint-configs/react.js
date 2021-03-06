/*eslint-env node*/
'use strict'

var merge = require('./utils').merge
var babel = require('./babel')

module.exports = merge(babel, {
    plugins: ['react', 'jsx-control-statements'],

    env: {
        'jsx-control-statements/jsx-control-statements': true
    },

    rules: {
        // 用 `method = () => {}` 为 ES6 class 的 method 绑定 this 时，会误触这条 rule，因此将它关闭
        'no-invalid-this': 0,
        // React 里指定 ref 时会出现 <Elm ref={r => this.child = r} /> 的写法，这个写法违反了这条规则。
        // 但如果按这条规则要求的写成 ref={r => {this.child = r}}，则既啰嗦又不好看。
        // 权衡利弊，最终还是决定禁用此规则，在 React 里使用简洁的写法。
        'no-return-assign': 0,

        'react/display-name': 0,
        'react/forbid-component-props': 0,
        'react/forbid-prop-types': 0,
        'react/no-array-index-key': 2,
        'react/no-children-prop': 2,
        'react/no-danger': 0,
        'react/no-danger-with-children': 0,
        'react/no-deprecated': 2,
        'react/no-did-mount-set-state': 2,
        'react/no-did-update-set-state': 2,
        'react/no-direct-mutation-state': 2,
        'react/no-find-dom-node': 2,
        'react/no-is-mounted': 2,
        'react/no-multi-comp': 0,
        'react/no-render-return-value': 2,
        'react/no-set-state': 0,
        'react/no-string-refs': 2,
        'react/no-unescaped-entities': 2,
        'react/no-unknown-property': 2,
        'react/no-unused-prop-types': 0,
        'react/prefer-es6-class': 0,        // 有时要用 React.createClass() 代替 stateless function component 以支持 hmr
        'react/prefer-stateless-function': 0,
        'react/prop-types': 0,              // 对于使用了 redux 以及 redux-react 里的 connect() 的情况，这条规则不适用
        'react/react-in-jsx-scope': 2,
        // 有时，我们的 component 需要判断使用者是指定了还是没指定某个 props，以此来调整自己的行为。（已在实际使用中多次确定绝对会有这样的情况）
        // 设置 defaultProps 会导致无法进行这种判断，因此禁用此规则。
        'react/require-default-props': 0,
        'react/require-optimization': 0,
        'react/require-render-return': 1,
        'react/self-closing-comp': 2,
        'react/sort-comp': 0,
        'react/sort-prop-types': 0,
        'react/style-prop-object': 2,
        // 'react/void-dom-elements-no-children': 2,    // 此规则貌似还没发布

        'react/jsx-boolean-value': 1,
        'react/jsx-closing-bracket-location': 0,
        'react/jsx-curly-spacing': [1, "never", {spacing: {objectLiterals: "never"}, allowMultiline: true}],
        'react/jsx-equals-spacing': [1, "never"],
        'react/jsx-filename-extension': 0,
        'react/jsx-first-prop-new-line': 0,
        'react/jsx-handler-names': 0,
        'react/jsx-indent': 0,          // 此配置无法正确处理 jsx-control-statements 因此关闭它
        'react/jsx-indent-props': 0,    // 有时需要是 4，如果有 childern 则需要是 8，所以不限制
        'react/jsx-key': 1,
        'react/jsx-max-props-per-line': 0,
        // bind 确实有可能影响性能。但在很多时候，它对性能的影响未必很大。而使用 bind 又确实很方便。
        // 所以对这一点，就靠自觉来控制了，在可能的情况下尽量减少 bind，不过用了也没关系，当发现某处 bind 确实影响了性能，再移除它就行了。
        'react/jsx-no-bind': 0,
        'react/jsx-no-comment-textnodes': 2,
        'react/jsx-no-duplicate-props': 2,
        'react/jsx-no-literals': 0,
        'react/jsx-no-target-blank': 2,
        'react/jsx-no-undef': 1,
        'react/jsx-pascal-case': 1,
        'react/jsx-sort-props': 0,
        'react/jsx-space-before-closing': 1,
        'react/jsx-tag-spacing': [1, {"closingSlash": "never", "beforeSelfClosing": "always", "afterOpening": "never"}],
        'react/jsx-uses-react': 1,      // 解决 no-unused-vars 误认为 React 没有被使用的问题
        'react/jsx-uses-vars': 1,
        'react/jsx-wrap-multilines': 0,

        'jsx-control-statements/jsx-choose-not-empty': 1,
        'jsx-control-statements/jsx-for-require-each': 1,
        'jsx-control-statements/jsx-for-require-of': 1,
        'jsx-control-statements/jsx-if-require-condition': 1,
        'jsx-control-statements/jsx-otherwise-once-last': 1,
        'jsx-control-statements/jsx-use-if-tag': 0,
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
})
