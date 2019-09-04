
// let Promise = require("./promise")
let p = new Promise((resove,reject)=>{
    // setTimeout(()=>{
        // resove('ss')
        reject('ddd')
    // },1000)
   
})
Promise.prototype.finally = function(callback){
    return this.then((data)=>{
        return new Promise((resove,reject)=>{
            resove(callback())
        }).then(()=>data)
       
    //    return data
    },err=>{
        console.log('jjj')
        return new Promise((resove,reject)=>{
            resove(callback())
        }).then(()=>{throw err})
        // throw err
    })
}
p.finally(()=>{
    console.log('data')
}).then((value)=>{
    console.log('成功',value)
},(value)=>{
    console.log('失败',value)
}).then((data)=>{
    console.log('dd',data)
})
console.log(p)


function fn(){
    console.log(arguments.length)
    for(let item of arguments){
        console.log(item)
    }
}
fn(1,2,3)