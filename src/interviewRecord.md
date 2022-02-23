## 面经

### 广州探迹科技有限公司 25K-30K
1. 兼容问题1px的解决方案有哪些
2. 本地存储方案有哪些 另外 说一说cookie是怎么用的
3. React的diff算法 
4. React生命周期
5. React-Router用了什么功能，做了哪些事  100%
6. 有哪些前端优化方式：图片压缩,高清化,文件的打包,常用库和业务代码分离,sass,less 等样式的支持,node 的本地服务等等
7. 说一说本地缓存

### OKAY智慧教育 25-30K
1. npm包自己开发
2. 浏览器 时间切片
3. 二叉树 
4. 数组去重有几种方法
5. 排序算法 插入排序、冒泡拍粗、快速排序
6. 说一说原型链 
7. prototype __proto__ 的区别
8. 手写Promise
9. promise.resolve(false)。then后面后发生什么
10. "123abc" == true; 具体valueOf和ToString() 没回答上来
11. 事件循环 都有什么
12. Es6 有什么优势 

### 佚名
1. 请叙述React Hooks组件与 Class组件的差异，及各自性能优化的方法
2. 实现对象深拷贝 递归法
4. `[1,2,[3,4],5]`手写flatten函数返回一个一维数组

### 阿拉钉 
#### 面试过程一直在扯淡，甚至都没问任何具体的技术问题

### 博研智通 25-35K 要30K说给不到
1. 优化类
2. 骨架屏
3. 父组件一秒一刷新，子组件怎么避免一秒一刷新 useCllback/useMemo
4. redux 重要

### 分贝通 15-30K 
1. 前端优化 
2. 原型链 细节方法
3. webpack打包流程 答得不好，含糊其辞
4. node应用  应该会
5. 微服务 技术视野
6. 闭包的原理

### 鳄梨科技
1. 说一说事件循环：事件循环解决什么问题：单线程、事件循环的流程、
2. diff算法：类型type改变会删掉整个树，怎么比较key值的？
3. setState之后，是什么流程，useEffect在啥阶段触发的 
4. useRef 为什么在render时没有更改
5. 运营后台的优化：怎么看当前组件是否在render？ chrome的react扩展+profiler
6. Function的原型是什么，原型链的尽头是什么 Object.prototype

### 正大集团 20-40K
1. React单一事实来源
2. MVVM
3. 数据扁平化
4. 数组去重
5. 类数组转化为数组
6. 继承方式
7. 柯里化
8. 防抖、节流
9. 深拷贝、浅拷贝
10. 滚动加载、分页
11. 水平居中、垂直居中 几种方式 写出代码
12. 行内元素、块级元素 区别
13. 盒模型 
14. 创建公共方法的方式


### 新橙科技 25-40K
1. margin 根据父亲元素的宽计算
2. 两列布局 实现方案
   1. float + calc右侧宽度
   2. float + margin-left
   3. absolute + margin-left
   4. float + BFC
   5. flex
   6. grid
   7. relative+absolute 瀑布流
3. css 动画平移
4. js 数组复制
5. slice 复制并返回 不影响原来 slice(start, end)
6. splice 切下并添加 返回删了的 影响原来的 splice(start,howmany,)
7. js 数据类型 
8. 深拷贝 实现方案
9. 兼容问题

### 兰宇科技 25-40K
1. react数据 单向绑定
2. useState后发生了什么 没说明白
3. react 优化 加载速度？ 不必要的渲染
4. generator async-await promise 的关系 与 setTimeout 的区别
5. 虚拟dom比真实dom的优点
6. redux
7. 五种排序 说都没说明白
8. 手写 节流  不行
9. 深浅拷贝
10. 手写.call 没写出来
11. 手写 new 没写出来
12. 闭包 优点缺点
13. 网络攻击 细节没说明白
14. Set Map 的遍历方法 。map
15. Map 转数组、对象的方法
16. 设计模式 一个都没答上来
   

### 句子科技
1. 五种排序算法
2. 复杂请求/非复杂请求
3. 协议默认端口
4. canvas
5. DOCTYPE
6. 反向代理
7. ！important的优先级
8. border-box
9. get/post请求的区别

### 销售易 一面
1. 垃圾回收
2. 新项目搭建-上线发布流程
3. 错误采集监听、性能监控
4. 0.5px线 只说出来了1种 transform
5. redux 
### 销售易 二面
1. requestAnimationFrame方法中修改页面dom，会怎么样：引发强制重排重绘
2. react对requestIdleCallback方法 是怎么应用的
3. 用ajax请求收到响应状态是301时会不会自动重定向：不会


### 哗啦啦
1. react双缓存
2. 手动实现promise.*
3. css 布局
4. position 定位 + sticky
5. react 大改后怎么提升性能的：requestIdleCallback
6. 建议把原理性的东西多看看

### 深纳普思
1. react传值的方式
2. react的好处
3. 高阶组件的应用场景
4. 手写Set底层实现 找到更好的复杂度的方案
5. 二分查找 + 复杂度分析
6. UDP
7. TCP是怎么保证每个数据包都被接收端正确接收的：
   1. 当TCP发出一个分组后，它启动一个超时计时器，如果在超时计时器到期之前收到了对方的确认，就撤销已设置的超时计时器。如果不能及时收到一个确认，就认为刚才发送的分组丢失了，将重发这个分组，这就叫超时重传。TCP中保持可靠性的方式就是确认和重传机制，这样就可以在不可靠的传输网络上实现可靠的通信
   2. TCP的报文到达确认（ACK），是对接收到的数据的最高序列号的确认，并向发送端返回一个下次接收时期望的TCP数据包的序列号（Ack Number）。例如， 主机A发送的当前数据序号是400，数据长度是100，则接收端收到后会返回一个确认号是501的确认号给主机A

### 慧拓
1. 排序算法的时间复杂度
2. webSocket
3. http restful

### 站酷一面 面试体验非常不好
1. postMessage
2. 多层组件通讯
3. ssr
### 站酷二面 面试体验依然不好
1. 301 重置客户端永久重定向状态 重定向的地址会缓存好久 甚至重启都不行，所以可以设置缓存策略不缓存该重定向资源
2. 服务端渲染
3. xxs 攻击
4. react router加载的方式 100%
5. ts
6. webpack 热更新原理
7. 设计模式
8. 浏览区请求全流程

### Moka 一面没过
1. redux
2. 数组转树 对象引用

## 红松 问的问题也偏简单不深入 等待二面回北京面试
import 的特点 在node环境中用require.js
import 会有暂时性死区问题么
es6 export引用
coocie Vs localstorage
a.b.c 跳到 d.b.c 不同域名下 cookie 与 localstorage 保存登陆信息 可以用postMessage  100%
promise 原理
webpack loader plugin 修改全局配置换肤
redux 用过什么中间件   redux-thunk  redux-promise
ref
node 服务端 实现压缩
怎么上线代码
你任务redux的缺陷或者与原生js有冲突的地方：react 定时器 

### 翼欧 一面没过
fetch 请求超时 如何控制 : promise.all + AbortController
promise then做了什么
async await
generator VS promise: generator会切换协程 promises是callback的封装
useMemo 原理
redux怎么解决异步问题 
jsbridge原理
css 自适应
rem 原理
flex: 0 1 100px; 是什么含义
项目细节+复杂度低+细节讲清楚

### 网易研究院 一面
1. 手撕节流并解释
2. js代码题
3. 移动端响应式布局 如何实现不同设备 元素布局不同如何监听屏幕大小
4. flex:1什么意思 还有其他的取值吗
5. es5继承方法有哪些 解释一下 你认为哪种最好为什么
6. 原型 原型链 如何判断A是不是B的实例
7. 在学校有没有做过什么项目？为什么做这个项目？从中学到了什么？遇到了哪些问题？
8. 什么是事件委托 用处 怎么让他监听捕获阶段
9. 闭包,用处危害
10. 实现一个函数add函数 我这样调用它add(1,2,3)(4)（5,6)0输出 21
11. 说一下网络安全及解决方法 
12. ca证书中包含什么如何证明ca证书的真实性
13. cookie 放在哪里 放在请求头里我可以获取到 cookie呀 这样就不安全了啊 怎么办呢
14. 请求头还有哪些

### 浙江大华
1. webpack常用的包
2. flex布局 常用属性
3. http https区别 怎么实现的安全
4. 垂直居中
5. 伪类 VS 伪元素 的 区别、属性
6. websocket
7. css中和字体相关的属性有哪些
8. nexttick 使用
9. 两列布局实现：左边固定，右边灵活。 用flex怎么实现 不用flex怎么实现
10. 迭代器怎么实现
11. rem vs em 的区别 还有什么其他类似单位
12. 图片下方有留白的解决办法

### 用友网络
1. Node.js实现：给一个文件夹，打印输出该文件夹下面的所有文件及文件夹。如果文件夹里有文件，继续打印内部文件和文件夹。
2. 代码实现：一个输入框，输入内容后，等待500ms再发送网络请求 (提示：防抖)   100%
3. ajax 中 get 与 post的区别  100%


### 龙创悦动
1. react原理
2. websocket
