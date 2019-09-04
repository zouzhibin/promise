class Transaction {
    perform(anyMethod,wrappers){
        wrappers.forEach(wrapper =>wrapper.initialize());
        // wrapper.initialize()
        anyMethod()
        // wrapper.close()
        wrappers.forEach(wrapper =>wrapper.close());
    }

}

let transaction = new Transaction();
let oldFunc = ()=>{
    console.log('原有的逻辑')
}
transaction.perform(oldFunc,[{
    initialize(){
        console.log('初始化')
    },
    close(){
        console.log('关闭')
    }
}])