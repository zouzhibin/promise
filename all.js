let p = new Promise((resolve,reject)=>{
    resolve(1)
})
let p1 = new Promise((resolve,reject)=>{
    reject(2)
})

Promise.all([p,p1]).then(data=>{
    console.log(data)
})