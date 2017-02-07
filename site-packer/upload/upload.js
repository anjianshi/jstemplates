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
        const key = path.join(options.prefix, filepath)
        const scope = options.bucket + ':' + key
        const uploadToken = (new qiniu.rs.PutPolicy(scope)).token()
        const extra = new qiniu.io.PutExtra()

        fs.readFile(path.join(options.path, filepath), (err, data) => {
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
                }
            })
        })
    }
}
