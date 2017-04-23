const path = require('path')
const fs = require('fs')
const qiniu = require('qiniu')
const glob = require('glob')

module.exports = function upload(rawOptions) {
    const optionsTmpl = {
        bucket: null,
        accessKey: null,
        secretKey: null,
        prefix: '/',
        path: null,

        ignorePatterns: [],         // 这里传入一系列正则表达式，文件路径与其中某个表达式匹配的文件不会被上传到 cdn 上
                                    // removeAfterUpload 为 true 的情况下，被忽略的文件不会被删除
        removeAfterUpload: false    // 上传完毕后是否删除本地的文件
    }
    const options = {}
    for(const key in optionsTmpl) {     // eslint-disable-line guard-for-in
        options[key] = key in rawOptions ? rawOptions[key] : optionsTmpl[key]
    }

    console.log('----- start upload ---')

    qiniu.conf.ACCESS_KEY = options.accessKey
    qiniu.conf.SECRET_KEY = options.secretKey

    const files = glob.sync('**/*.*', {cwd: options.path})
    let completed = 0

    for(const filepath of files) {
        if(options.ignorePatterns.find(p => filepath.match(p))) {
            console.log('ignore: ' + filepath)
            continue
        }

        const key = path.join(options.prefix, filepath)
        const scope = options.bucket + ':' + key
        const uploadToken = (new qiniu.rs.PutPolicy(scope)).token()
        const extra = new qiniu.io.PutExtra()

        const abspath = path.join(options.path, filepath)
        fs.readFile(abspath, (err, data) => {
            if(err) { console.log('read failed: ', filepath, err); throw err }

            console.log('upload: ' + key)

            qiniu.io.put(uploadToken, key, data, extra, (uploadErr, ret) => {
                if(uploadErr) {
                    console.log('upload failed: ', key, uploadErr)
                    throw uploadErr
                } else {
                    console.log('complete: ' + ret.key + '\t' + ret.hash)
                    completed++
                    if(completed === files.length) {
                        console.log('----- upload complete ---')
                    }

                    if(options.removeAfterUpload) fs.unlinkSync(abspath)
                }
            })
        })
    }
}
