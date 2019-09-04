let fs = require("fs").promises
function* fun() {
    yield fs.readFile("./1.txt",'utf8')
    return 1
}

var t = fun()
let {value} = t.next()
// console.log(t.next())
value.then((val)=>{
    console.log('hh',val)
})