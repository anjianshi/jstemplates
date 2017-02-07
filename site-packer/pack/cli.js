#!/usr/bin/env node

/*
TODO
据说 webpack-dev-server 与 nodejs v7 目前有一点兼容性问题
但是好像只在 windows 上发生，所以我现在的情况应该不用介意
https://github.com/webpack/webpack-dev-server/commit/7eb7a921d6d95328c30783ed0a172906b0fface3
*/

const fs = require('fs')
const path = require('path')
const spawnSync = require('child_process').spawnSync
const upload = require('../upload/upload')


// ===== 提取、整理 arguments =====

const commands = ['compile', 'watch', 'hmr', 'compile-upload']

if(process.argv.length !== 4) {
    console.log(`Usage: NODE_ENV=development|production anjianshi-pack ${commands.join('|')} config-file`)
    process.exit(1)
}

const command = process.argv[2]
if(commands.indexOf(command) === -1) {
    console.log(`Command not exists. Available commands: ${commands.join('|')}`)
    process.exit(1)
}

// 注意，这里处理的均是 anjianshi-pack 工具本身用到的 config，并不是 webpack config（虽然里面会包含部分 webpack config 的内容）
const configPath = process.argv[3]
if(!fs.existsSync(configPath)) {
    console.log('pack config file not exists')
    process.exit(1)
}


// ===== 执行命令 =====

const webpackArgs = ['--color', '--config=' + path.join(__dirname, 'webpack.config.js')]

// 要传递给 webpack config 生成函数的内容
const packArgs = JSON.stringify({command: command, configPath: configPath})

function exec(binName, extraArgs) {
    const binPath = path.resolve(path.join(__dirname, '../node_modules/.bin', binName))
    const args = extraArgs ? [...webpackArgs, ...extraArgs] : webpackArgs
    console.log('exec: ', [binPath, ...args].join(' '))

    spawnSync(binPath, args, {
        stdio: 'inherit',
        env: {
            NODE_ENV: process.env.NODE_ENV,
            PACK_ARGS: packArgs
        }
    })
}

if(command === 'compile' || command === 'compile-upload') {
    exec('webpack')

    if(command === 'compile-upload') {
        const env = require('./env').generateEnv(command, configPath)
        upload({
            bucket: env.cdn.bucket,
            accessKey: env.cdn.accessKey,
            secretKey: env.cdn.secretKey,
            prefix: env.cdn.prefix,
            path: env.outputPath,
        })
    }
} else if(command === 'watch') {
    exec('webpack', ['--watch'])
} else if(command === 'hmr') {
    exec('webpack-dev-server')
}
