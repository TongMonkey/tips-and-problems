/**
 * middleware的本质是重写dispatch方法
 *  第三版的middleware 在reudx原始库中的 applyMiddleware方法中 可以正常工作啦
 *  middlewares 只执行一次，所以会在 createStore() 中用到
 */

/***********************第一版*********************************/
var addLogs = function (store) {
  let next = store.dispatch;
  //  store.dispatch = function dispatchAndLog(action) {
  return function dispatchAndLog(action) {
    console.log("dispatching", action);
    let result = next(action);
    console.log("next state", store.getState());
    return result;
  };
};

var addCrashReporting = function (store) {
  let next = store.dispatch;
  //   store.dispatch = function dispatchAndReportErrors(action) {
  return function dispatchAndReportErrors(action) {
    try {
      return next(action);
    } catch (err) {
      console.error("捕获一个异常!", err);
      throw err;
    }
  };
};

/***********************第二版*********************************/
// 为了链式调用，只有第一个middleware里的dispatch来自store, 
// 其余dispatch方法应该是经过前面middleware重写的
// 用传入的next来代替dispatch
var addLogs = function (store) {
  //   let next = store.dispatch;
  return function dispatchAddLogWrapper(next) {
    return function dispatchAndLog(action) {
      console.log("dispatching", action);
      let result = next(action);
      console.log("next state", store.getState());
      return result;
    };
  };
};

var addCrashReporting = function (store) {
  //   let next = store.dispatch;
  return function dispatchReportErrorsWrapper(next) {
    return function dispatchAndReportErrors(action) {
      try {
        return next(action);
      } catch (err) {
        console.error("捕获一个异常!", err);
        throw err;
      }
    };
  };
};
/***********************第三版：把第二版使用柯里化精简 *********************************/
var addLogs = (store) => (next) => (action) => {
  console.log("dispatching", action);
  let result = next(action);
  console.log("next state", store.getState());
  return result;
};

var addCrashReporting = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (err) {
    console.error("捕获一个异常!", err);
    throw err;
  }
};


export { addLogs, addCrashReporting };
