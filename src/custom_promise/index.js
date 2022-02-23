import MyPromise from './promise.js';

var promise1 = MyPromise.resolve(1);
var promise2 = MyPromise.resolve(2);
MyPromise.all([promise1, promise2]).then(arr=>{
    console.log(arr)
})