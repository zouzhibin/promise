function resolvePromise(promsie2, x, resolve, reject) {
    // 判断promise 是否等于自身
    // 如下面这种情况，就会出现等于自身的情况
    // let p = new Promise1((resove,reject)=>{
    //     resove()
    // })
    // let p2 = p.then((value)=>{
    //     console.log('成功',value)
    //     return p2
    // },(value)=>{
    //     console.log('失败',value)
    //     return 'hhhh'
    // })
    // p2.then(()=>{
    //     console.log('哈哈哈')
    // },(err)=>{
    //     console.log('www',err)
    // })
    if (promsie2 === x) {
        return reject(new TypeError(' Chaining cycle detected for promise #<Promise>'))
    }
    let called;  // 为了防止掉了成功 又调用失败
    // 然后就是判断x的类型  是否是常量 还是promise
    // 如何判断promise 是不是一个promise 看他有没有then方法 
    if (typeof x === 'function' || (typeof x === 'object' && x != null)) {
        try {
            let then = x.then  // then方法可能会出错
            if (typeof then === 'function') {
                then.call(x, y => { // 如果promise是成功的就把结果向下传，如果失败的就让下一个也失败
                    if (called) return
                    called = true
                    resolvePromise(promsie2, y, resolve, reject) // 递归 为了防止then一层层为promise
                    // resolve(y)
                }, r => {
                    if (called) return
                    called = true
                    reject(r)
                })  // 不要使用x.then 否则会再次取值s
            } else {
                resolve(x)
            }
        } catch (e) {
            if (called) return
            called = true
            reject(e)
        }
    } else {
        resolve(x)
    }



}
class Promise {
    constructor(extruct) {
        this.state = 'pending'
        this.value = undefined; //成功的值
        this.reason = undefined //失败的原用

        this.onResovleCallbacks = []
        this.onRejectedCallbacks = []
        let resolve = (value) => {
            // 为了防止这种情况发生
            // let p = new Promise((resove,reject)=>{
            //     resove(new Promise((resove,reject)=>{
            //         resove(100)
            //     }))
            // })
            if (value instanceof Promise) {
                // debugger
                return value.then(resolve, reject)
            }

            if (this.state === 'pending') {
                // debugger
                this.state = 'resolve'
                this.value = value
                this.onResovleCallbacks.forEach(fu => fu())
            }
        }
        let reject = (value) => {
            if (this.state === 'pending') {
                this.state = 'reject'
                this.reason = value
                this.onRejectedCallbacks.forEach(fu => fu())
            }
        }
        // try 方法  可能会在调用Promise 的时候直接出催
        try {
            extruct(resolve, reject)
        } catch (e) {
            reject(e)
        }

    }
    catch(errCallbak){ // 用来捕获错误的 .then(null,err=>err)
        return this.then(null,errCallbak)
    }
    then(onFulfilled, onRejected) {
        // debugger
        // 为了防止值的穿透事件  
        // 例如这种情况
        // let p = new Promise((resove,reject)=>{
        //     reject()
        // })
        // p.then(()=>{}).then(()=>{},(ee)=>{
        //     console.log(111)
        // })
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data
        onRejected = typeof onRejected === 'function' ? onRejected : (err) => { throw err }
        let promsie2
        // 在promise中实现链式调用 靠的不是返回this 
        // 因为 promise 的状态是不可逆的 
        // 所以是返回了一个新的 promise
        promsie2 = new Promise((resolve, reject) => {
            if (this.state === 'resolve') {
                
                // setTimeout 的目的是为了获取 promsie2
                // 因为在刚开始的时候 promsie2 是不存在的
                setTimeout(() => {
                    // debugger
                    // x 为常量 x 为promise
                    // resolve(x)
                    try {
                        let x = onFulfilled(this.value)
                        // 这个函数主要目的是为了区分 x 是常量还是promise
                        resolvePromise(promsie2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }

                })
            }
            // debugger
            if (this.state === 'reject') {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promsie2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }

                })
            }
            if (this.state === 'pending') {
                this.onResovleCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value)
                            resolvePromise(promsie2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    })

                })
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promsie2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    })
                })
            }
        })
        return promsie2
    }
    finally(callback){
        return this.then((data)=>{
            return new Promise((resolve,reject)=>{
                resolve(callback)
            }).then(()=>data)
        },err=>{
            return new Promise((resolve,reject)=>{
                resolve(callback)
            }).then(()=>{throw err})
        })
    }
}
Promise.resolve = function(value){
    return new Promise((resolve,reject)=>{
        resolve(value)
    })
}
// 判断是否是promise
function isPromise(value){
    if(typeof value ==='function'|| (typeof value ==='object'&& typeof value !=null)){
        if(typeof value.then ){

        }
    }
}

Promise.all = function(values){
    return new Promise((resolve,reject)=>{
        let arr = []
        let i=0;
        let processDate = (index,val)=>{
            arr[index]  = val
            i++
            if(i===values.length){
                resolve(arr)
            }
            // 这里用 i++ 
            // 是为了防止 a[1] 
            // 有值了 而a[0] 还没有值 就会出现a[0]没有收到值而reolve()
        }
        // values 有可能会这样[promise,promise,1,2],
        // 所以要判断是否是promsie
        for(let i=0;i<values.length;i++){
            let cuurent = values[i] 
            if(isPromise(cuurent)){
                cuurent.then((val)=>{
                    processDate(i,val)
                },(err)=>{
                    reject(err)
                })
            }else{
                processDate(i,cuurent)
            }
           
        }
    })
    
}

// module.exports = Promise

// Promise.defer = Promise.deferred = function () {
//     let dfd = {}
//     dfd.promise = new Promise((resolve, reject) => {
//         dfd.resolve = resolve;
//         dfd.reject = reject;
//     });
//     return dfd;
// }
// module.exports = Promise