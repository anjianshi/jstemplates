# 使用方式
复制此文件夹作为项目目录，在所有文件里搜索以 `{TMP:` 开头的字符串，将它们替换成你的项目中对应的值即可。


# 技术栈
- Electron
- Webpack
- Babel
- Stylus
- React
- HMR
- eslint


# 运行方式
为了在 Electron 里引入 babel，之前尝试过通过 `electron-compile` 进行编译并配合 `electron-packager` 来打包。
但是问题很多。而且文档写得很不清楚，也没有实际可运行的例子。
所以改成通过 `webpack` 来编译，然后让 `electron-packager` 针对编译后的目录而不是源代码来打包。
这样附带的一个好处时 renderer 部分支持 HMR。

因为 renderer 部分要使用 HMR，main 部分则不用。因此将它们分别编译。
（不是分成两个 entry，而是分成两个 webpack.config.js）。


# 代码结构
```
src/                    app 源代码
    main/
        index.js        main process 的入口文件
    renderer/
        index.html      renderer 的入口 html 文件，main process 开启浏览器后访问这个页面，然后由它来载入 renderer process 入口文件。
        index.js        renderer process 的入口文件

build/                  编译 / 打包的相关代码及工具脚本

package.json            记录 app 的基本信息，包括 devDependencies 和 renderer process 的 dependencies。
                        main process 的 dependencies 不记录在这里。
mainDependencies.json   main process 引用类库的方式和 renderer process 不一样。
                        renderer 的依赖会在 webpack 打包、编译代码时和 renderer 代码打包到一起；
                        而 main process 则是要求将类库安装到它实际运行时所在的目录中（也就是安装到 webpack 的编译结果所在的目录中，而不是项目开发时的目录中）。
                        因此，讲 main process 的依赖项单独记录在这里，这样开发时执行 `yarn install` 这些依赖项就不会被安装，
                        然后 webpack 编译完成后，也便于讲这里面记录的类库都提取出来，安装到编译结果目录中。

var/                    打包结果及各种临时文件都放在这里
    app_dist/           webpack 对 app 的编译结果放在这里，src/package.json 也在经过整理后同步过来。
                        electron-packager 就是对这个文件夹进行打包。
        main/
            index.js    main process 的所有代码会被打包成这个文件。
        renderer/
            index.html
            index.js    renderer process 的所有代码以及依赖的类库会被打包成这个文件
        package.json    对 src/package.json 进行整理，并生成出的与编译得到的 app 代码对应的 package.json

    xxx/                electron-packager 生成的可运行软件包也放在 var/ 下
...
```


# renderer process 的调试
renderer process 的调试分两部分：

1. 通过 devtools 调试页面内容与样式，以及通过查看消息日志找出代码中的问题
2. 代码有更新时，加载最新的代码

对于第一项，在开发环境下，可通过 `Ctrl + Shift + I` 快捷键调出 devtools；当页面中出现报错时，还可通过 `Ctrl + R` 来重新载入页面。
但是在生产环境下，这些功能都不会被开启，需要在页面里手动监听这些快捷键，并执行相应的操作：
https://discuss.atom.io/t/how-to-make-developer-tools-appear/16232/5

对于第二项，现在已实现了 HMR 功能。即使遇到不能 Hot Reload 的情况，只要刷新页面（而不用重新启动 app）就能保证取得最新的代码。
