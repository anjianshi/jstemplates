#!/usr/bin/env node

// 此脚本仅用来接收、整理参数，实际的上传工作由 upload.js 来完成
const _ = require('lodash')
const upload = require('./upload')


if(process.argv.length !== 3) {
    console.log(`Usage: anjianshi-upload options`)
    process.exit(1)
}

const jsonOptions = process.argv[2]
let parsedOptions

try {
    parsedOptions = JSON.parsedOptions(jsonOptions)
    if(!_.isPlainObject(parsedOptions)) throw Error()
} catch(e) {
    console.log('options parse failed')
    process.exit(1)
}

upload(parsedOptions)
