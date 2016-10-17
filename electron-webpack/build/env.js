"use strict";
const path = require('path')


const env = {}

env.base = require('path').resolve(__dirname, "../")
env.src = env.base + '/src'
env.dist = env.base + '/var/app_dist'

env.dev = process.env.NODE_ENV !== 'production'
env.hmr = env.dev && process.env.HMR === '1'

module.exports = env
