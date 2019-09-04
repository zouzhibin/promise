
function* read() {
    let a = yield new Promise(() => { resolve(1) })
    let b = yield new Promise(() => { resolve(1) })
    let c = yield new Promise(() => { resolve(1) })
    return c
}

function co() {
    return new Promise((resolve, reject) => {
        function next(data) {  // 递归执行
            let { value, done } = it.next(data)
            if (done) {
                resolve(done)
            } else {
                // 这种方式没有区分是否 value 是 promise和常量 
                // value.then((data)=>{
                //     next(data)
                // },reject)
                Promise.resolve(data).then((data) => {
                    next(data)
                }, reject)  // 有一个失败了就失败了
            }
        }
        next()
    })
}