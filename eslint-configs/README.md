个人整理的 eslint rules

# 使用方法
在项目根目录： `npm install --save-dev eslint-config-anjianshi-xxx`

然后在项目中的 `eslint` 配置文件，如 `.eslintrc.js` 中，添加：
```js
{
    extends: ['anjianshi-xxx']
    ...
}
```


# config 之间的继承结构
```
base
    babel
        react
            react-native
```
