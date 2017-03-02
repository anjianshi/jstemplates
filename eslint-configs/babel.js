/*eslint-env node*/
'use strict'

var merge = require('./utils').merge
var base = require('./index')

module.exports = merge(base, {
    parser: 'babel-eslint',

    // 使用了 babel 后，eslint 的一些 rule 的行为需要修改，但光靠 babel-eslint parse 没法做到这些，
    // 因此还要通过 eslint-plugin-babel 提供一些经过修正的 rules
    plugins: ['bable'],

    env: {
        es6: true               // 此设定是有必要的，不然 eslint 会认为 Set / Map 等对象是不存在 / 不允许使用的
    },

    rules: {
        'strict': 0,            // babel 会自动给代码加上 use strict;

        /*
        解决原 rule 不支持 class arrow function 的问题
        class C {
            fn = () => { this.a = 1 }
        }
        */
        'no-invalid-this': 0,
        'babel/no-invalid-this': 1,
    }
})
