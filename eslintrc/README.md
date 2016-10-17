# 使用方法
在项目根目录： `npm install --save-dev eslint-config-anjianshi-std`

然后在项目中的 `eslint` 配置文件，如 `.eslintrc.js` 中，添加：
```json
{
    extends: ['anjianshi-std']
    ...
}
```
或 
```json
{
    extends: ['anjianshi-std/react']
    ...
}
```


# rules 文件列表及其继承结构
index 是 base 的别名，`extends: ['anjianshi-std']` 等同于 `extends: ['anjianshi-std/base']`。
babel 继承 base，因此使用了它就不用再引用 base 了。
```
index（base）
    babel
        react
            react-native
```
