// 判断数据类型
// typeof instanceof constructor  Object.prototype.toString.call

// console.log(0 === undefined)

function isType(type){ // 变量
    return function(conetnt){
        return Object.prototype.toString.call(conetnt)=== `[object ${type}]`
    }

}

let types = ['String','Boolean','Number','Null','Undefined']

let utils = {}
for(let i=0;i<types.length;i++){
    let type = types[i]
    utils['is'+type] = isType(type)
}
console.log(utils)
console.log(utils.isString('heeloo'))