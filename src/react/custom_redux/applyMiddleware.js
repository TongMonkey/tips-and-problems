/**
 *  模拟 applyMiddleware 怎样合并链式middleware 的
 *  功能并不完善，无法直接使用
 */

/***********************第二版*********************************/
var applyAllMiddlewares = function (store, middlewares) {
  middlewares = middlewares.slice();
  // 此时 各个middleware之间还没有关联
  middlewares.forEach((middleware) => (store.dispatch = middleware(store)));
};

/***********************第三版*********************************/
var applyAllMiddlewares = function (store, ...middlewares) {
  middlewares = middlewares.slice();
  var dispatch = store.dispatch;
  middlewares.forEach((middleware) => {
    dispatch = middleware(store)(dispatch);
  });
  // forEach执行完以后，dispatch函数变成了一个套娃
  
};

export { applyAllMiddlewares };
