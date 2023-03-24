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


### Chapter 10: Subject 