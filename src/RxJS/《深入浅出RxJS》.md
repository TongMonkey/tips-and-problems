# 《深入浅出RxJS》

## github link: <https://github.com/mocheng/dissecting-rxjs>

### RxJS 引用了两个重要的编程思想

1. 函数式编程
   1. 定义：就是非常强调使用函数来解决问题的一种编程方式。是一种编程思想，JavaScript本身并不是纯粹的函数式编程语言。
   2. 函数式编程对函数的使用有一些特殊要求
      1. 声明式
         1. 命令式编程
            1. 定义：代码把计算逻辑完整地描述一遍
            2. 问题：产生大量重复代码
         2. 声明式编程：
            1. 定义：
      2. 纯函数
      3. 数据不可变性
2. 相应式编程

### 导入模块

1. 两个库的关系 ReactiveX/rxjs vs Reactive-Extensions/RxJS ❓
2. 版本更新 4 -> 5 的重大改革 ❓ 安装 v4 npm i rx 安装 v5 npm i rxjs
3. 导入方式： 见 P22 待验证❓❓❓
   1. Tree-shaking 对 rxjs 不起作用。有些函数不管我们的应用代码用还是不用，都在 RxJS 内部已经被 Observable 这个类”引用“了
   2. Deep Link 深链：最好的方式是用一个代码文件专门导入rxjs相关功能，其他的文件再导入这个文件

      ```code
         import { Observable } from 'rxjs/Observable';
         import 'rxjs/add/observable/of'
      ```

### 用到的设计模式：观察者 + 迭代器

1. 观察者模式 Observable Pattern
   1. 定义：将逻辑分为发布者 Publisher 和观察者 Observer。
   2. 作用：其中发布者只负责产生事件，它会通知所有注册了的观察者，而不关心这些观察者如何处理事件；同样，观察者可以注册挂上某个发布者，只管被叫号接受事件后进行处理，而不关心这些数据是怎么产生的。
2. 迭代器模式 Iterator Pattern
   1. 定义：遍历器是指能够遍历一个数据集合的对象。
   2. 作用：但数据集合的实现方式很多，所以迭代器就是提供一个通用的接口，让使用者完全不用关心这个数据集合的具体实现方式
   3. ‘推’式迭代器：与普通的“拉”式迭代器不同，需要具备 1查看当前元素、2光标移到下一个元素、3判断全部遍历完成 这些方法，rxjs 使用的是 “推”式迭代器，所以不会看到上述的过程去遍历。
   4. rxjs 不需要主动去从 Observable 中拉数据，而是只要 subscribe 某个 Observable 之后，自然就能够收到消息推送，所以不需要拉，是推后迭代
3. 总结：
   1. Observable = Publisher + Iterator


### Code Observable VS Hot Observable
1. 定义：
   1. Hot Observable: 观察者错过了就错过了，只需要接受从订阅那一刻开始Observable产生的数据就行，就像看电视直播
   2. Cold Observable: 观察者不能错过，需要获取 Observable 之前产生的数据，就像打开一部电影，都是从头开始放的。
2. 区别：
   1. 生产者与观察者之间关系的区别
      1. 理解 Hot Observable: 概念上有一个独立于 Observable 对象的“生产者”， 这个生产者的创建和 subscribe 调用没有关系， subscribe 调用只是让 观察者连接上“生产者” 而已。
      2. 理解 Cold Observable: 每一次订阅，都会产生一个新的“生产者”，这个生产者会从头开始生产数据
   2. hot or cold 都是对 生产者 而言的：如果每次订阅的时候，已经有一个热的生产者准备好了，那就是 hot；相反，如果每次订阅都要产生一个新的生产者，就像汽车引擎刚启动时肯定是冷的，所以就是 cold。
3. 一些例子
   1. 产生 Hot Observable 的操作符:
   2. 产生 Cold Observable 的操作符: of


### 实现 new Observable 
1. code

   ```code
      import { Observable } from 'rxjs/Observable';
      //2-1. 而这个 onSubscribe 函数接受一个 observer 观察者 作为入参，obSubscribe 函数可以任意操作观察者对象，比如在函数体内会调用 observer 的 next 函数，从而把数据推给 observer。
      //2-2. onSubscribe 的被调用时机：是 subscribe 方法调用的时候，触发 onSubscribe
      const onSubscribe = observable => {
         observer.next(1);
         observer.next(2);
         observer.next(3);
         //5-1. 返回一个对象，需要有一个 unsubscribe 函数，用来切断 publisher 和 observer 的关联
         return {
            unsubscribe: () => {

            }
         }
      };
      //1. onSubscribe 函数作为 Observable 构造函数的入参，完全决定了 Observable 对象的行为
      const source$ = new Observable(onSubscribe);
      //3. 观察者没有什么特别之处，只要求它必须有一个 next 函数，等待被 onSubscribe 调用
      const theObserver = {
         next: item => console.log(item);
      }
      //4. 通过 subscribe 函数将 publisher 和 observer 关联起来
      //5-2. 并返回一个对象
      const subscription = source$.subscribe(theObserver);
      //6. 此时 theObserver 不会再收到推送过来的数据了，但作为 Observable 的 source$ 并没有终结，只要没有调用 complete 或者 error 就没有结束，只不过不会再调用观察者的 next 函数了。
      subscription.unsubscribe();

   ```

### 实现 操作符

1. map

### Chapter 10: Subject 