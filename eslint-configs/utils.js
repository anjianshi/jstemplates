function merge(a, b) {
    var o = Object.assign({}, a)

    var key, value
    for(key in b) {
        value = b[key]

        if(key in o) {
            if(value instanceof Array) {
                value = o[key].concat(value)
            } else if(typeof value === 'object' && value !== null) {
                value = merge(o[key], value)
            }
        }

        o[key] = value
    }

    return o
}

exports.merge = merge
