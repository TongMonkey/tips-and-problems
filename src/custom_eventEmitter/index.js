/**
 * 我们要实现的API有：
on(event, fn)：为指定事件注册一个监听器，接受一个字符串 event 和一个回调函数。
emit(event, [arg1], [arg2])： 按监听器的顺序执行执行每个监听器
once(event, fn): 和on类似，但只触发一次，随后便解除事件监听
removeListener(event, fn)： 移除指定事件的某个监听回调
removeAllListeners([event])：移除指定事件的所有监听回调
setMaxListeners(n)：用于提高监听器的默认限制的数量。（默认10监听回调个产生警告）
getListeners(event)： 返回指定事件的监听器数组。
 */
class EventEmitter {
    constructor() {
      this.eventCache = {};
      this.maxCount = 10;
    }
    on(eventName, callback) {
      if (eventName in this.eventCache && this.eventCache[eventName].length<this.maxCount) {
        this.eventCache[eventName]?.push(callback);
      } else {
        this.eventCache[eventName] = [callback];
      }
    }
    removeListener(eventName, callback) {
      if(!callback){
        throw Error('没有传函数')
      }
      if (eventName in this.eventCache) {
        for (let i = 0; i < this.eventCache[eventName].length; ) {
          if (this.eventCache[eventName][i] === callback) {
            this.eventCache[eventName].splice(i, 1);
          } else {
            i++;
          }
        }
      }
    }
    emit(eventName) {
      if (eventName in this.eventCache) {
        let args = Array.prototype.slice.call(arguments, 1);
        this.eventCache[eventName].forEach((fn) => {
          fn.apply(this, args);
        });
      }
    }
    once(eventName, callback) {
      let arg = [].slice.call(arguments,2);
      let fn = ()=>{
        callback.apply(this, arg);
        this.removeListener(eventName, fn);
      }
      this.on(eventName,fn);
    }
    removeAllListeners(eventName) {
      if (eventName in this.eventCache) {
        this.eventCache[eventName] = [];
      }
    }
    setMaxListeners(number) {
      this.maxCount = number;
    }
    getListenersCount(eventName) {
      return this.eventCache[eventName]?.length
    }
  }
