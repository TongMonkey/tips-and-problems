// 参考链接：https://juejin.cn/post/6945319439772434469#heading-15

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

/**
 * 集中处理链式then中如何传递值
 * @param {*} promise 新Promise实例
 * @param {*} x  上一个then的返回值
 * @param {*} resolve 将新promise实例的状态变成fulfilled
 * @param {*} reject 将新proise实例的状态变成rejected
 * @returns
 */
function resolvePromise(promise, x, resolve, reject) {
  // 如果相等了，说明return的是自己，抛出类型错误并返回
  if (promise === x) {
    return reject(
      new TypeError("The promise and the return value are the same")
    );
  }
  if (typeof x === "object" || typeof x === "function") {
    // x 为 null 直接返回，走后面的逻辑会报错
    if (x === null) {
      return resolve(x);
    }
    let then;
    try {
      // 把 x.then 赋值给 then
      then = x.then;
    } catch (error) {
      // 如果取 x.then 的值时抛出错误 error ，则以 error 为据因拒绝 promise
      return reject(error);
    }
    // 如果 then 是函数
    if (typeof then === "function") {
      let called = false;
      try {
        // 相当于 x.then(resolve, reject)
        then.call(
          x, // this 指向 x
          // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          (y) => {
            // 如果 resolvePromise 和 rejectPromise 均被调用，
            // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量 called
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (error) {
        // 如果调用 then 方法抛出了异常 error：
        // 如果 resolvePromise 或 rejectPromise 已经被调用，直接返回
        if (called) return;
        // 否则以 error 为据因拒绝 promise
        reject(error);
      }
    } else {
      // 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x);
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x);
  }
}
class Promise {
  promiseState = PENDING; //PENDING FULFILLED REJECTED
  promiseResult; // 成功或失败结果只能有一个，都用这个存储
  promiseFulfillReactions = [];
  promiseRejectReactions = [];
  constructor(executor) {
    try {
      executor(this.resolve, this.reject);
    } catch (err) {
      return this.reject(err);
    }
  }
  // 箭头函数是为了捕获当前实例为this
  // val 的值有几种类型 Promise实例
  resolve = (val) => {
    if (this.promiseState === PENDING) {
      this.promiseState = FULFILLED;
      this.promiseResult = val;
      while (this.promiseFulfillReactions.length) {
        let callback = this.promiseFulfillReactions.shift();
        callback(val);
      }
    }
  };
  // 箭头函数是为了捕获当前实例为this
  reject = (val) => {
    if (this.promiseState === PENDING) {
      this.promiseState = REJECTED;
      this.promiseResult = val;
      while (this.promiseRejectReactions.length) {
        let callback = this.promiseRejectReactions.shift();
        callback(val);
      }
    }
  };
  // 在then内判断状态
  // onFulfilled, onRejected 是成功/失败 的两个回调函数
  // then 方法要链式调用那么就需要返回一个 Promise 对象
  // then 方法里面 return 一个返回值作为下一个 then 方法的参数，如果是 return 一个 Promise 对象，那么就需要判断它的状态
  // return 的值 就是执行 onFulfilled(val) 的返回值
  then(onFulfilled, onRejected) {
    // 这里忽略了then(非函数) 值穿透的处理
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected = typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };
    let p1 = new Promise((resolve, reject) => {
      if (this.promiseState === FULFILLED) {
        // console.log(p1); //ReferenceError: Cannot access 'p1' before initialization
        // 这里是初始化函数的运行块，所以此时传进来的p1，还没有完成初始化,所以需要创建一个异步函数
        // queueMicrotask可以创建一个微任务
        queueMicrotask(() => {
          let x = onFulfilled(this.promiseResult);
          resolvePromise(p1, x, resolve, reject);
        });
      }
      if (this.promiseState === REJECTED) {
        queueMicrotask(() => {
          let x = onRejected(this.promiseResult);
          resolvePromise(p1, x, resolve, reject);
        });
      }
      if (this.promiseState === PENDING) {
        if (onFulfilled) this.promiseFulfillReactions.push(onFulfilled);
        if (onRejected) this.promiseRejectReactions.push(onRejected);
      }
    });
    return p1;
  }
  catch(onRejected) {
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };
    let p1 = new Promise((resolve, reject) => {
      if (this.promiseState === REJECTED) {
        queueMicrotask(() => {
          let x = onRejected(this.promiseResult);
          resolvePromise(p1, x, resolve, reject);
        });
      }
      if (this.promiseState === PENDING) {
        if (onRejected) this.promiseRejectReactions.push(onRejected);
      }
    });
    return p1;
  }
  finally() {}
  done() {}
  static resolve(param) {
    if (param instanceof Promise) {
      return param;
    } else if (typeof param === "object" && typeof param.then === "function") {
      return param.then(); // ？？
    } else {
      return new Promise((resolve, reject) => {
        resolve(param);
      });
    }
  }
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(param);
    });
  }
  static all(promises) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        throw Error("参数应该是数组");
      }
      const result = [];
      let count = 0;
      promises.forEach((promise, index) => {
        promise
          .then((res) => {
            result[index] = res;
            count++;
            count === promises.length && resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  }
  static race(promiseArr) {
    return new Promise((resolve, reject) => {
      promiseArr.length === 0 && reject();
      promiseArr.forEach((p) => {
        Promise.resolve(p).then(
          (val) => {
            resolve(val);
          },
          (err) => {
            rejecte(err);
          }
        );
      });
    });
  }
  static any(promiseArr) {
    return new Promise((resolve, reject) => {
      promiseArr.length === 0 && reject();
      let count = 0;
      promiseArr.forEach((p) => {
        Promise.resolve(p).then(
          (val) => {
            resolve(val);
          },
          (err) => {
            count++;
            count === promiseArr.length && reject(err);
          }
        );
      });
    });
  }
  static allSettled() {}
}
export default Promise;
