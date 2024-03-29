### 编写一个方法，判断一个字符串是否是合法的 XML

```
const str1 = "<html><div>123</div></html>"; // true
const str2 = "<div><div>123</div><div></div></div>"; // true
const str2 = "<html><div>123</html></div>"; // false
```

### V8引擎是什么

V8 是谷歌开源的 JavaScript 引擎，被用于 Chrome 和 Node.js 。程序最终会被 CPU 执行，不同架构 CPU 提供的指令是不同的，而我们写的一套代码需要跑到不同架构的 CPU 上，这就需要 JavaScript 引擎来做这件事情。最初的时候 V8 直接通过 AST 生成对应机器码，后来爆出一堆问题，比如内存占用大、启动时间长等。于是，现在使用的是解释器与编译器混合的JIT技术(Just In Time)

### js是解释型语言还是编译型语言: 解释型

参考链接：<https://mp.weixin.qq.com/s/ZJsokYm5EjdHKxUPoRmI6g>

1. 编译型语言：
   1. 直接可以转换为计算机处理器可以执行的机器代码，运行编译型语言需要一个 “构建” 的步骤，每次更新了代码你也要重新 “构建”
   2. 由计算机系统(CPU)来执行。
2. 解释型语言：
   1. 是通过一个解释器逐行解释并执行程序的每个命令
   2. 由解释器执行。
   3. js引擎的工作就是一个解释器，例如常见的V8引擎
3. 机器码：machine code 也叫原生码，是电脑CPU能直接解读的数据(只有0和1)
4. 字节码：byte code 是一种二进制文件，是一种中间码，比机器码更抽象，需要直译器转译后才能成为机器码，被CPU读懂
5. JIT 即时编译技术：采用了解释执行和编译执行这两种方式，V8 采用的就是这种技术。在解释器执行字节码的过程中，如果发现有热点代码，比如一段代码被重复执行多次，这种就称为热点代码，那么后台的编译器就会把该段热点的字节码编译为高效的机器码，然后当再次执行这段被优化的代码时，只需要执行编译后的机器码就可以了，这样就大大提升了代码的执行效率。

### V8是如何执行一段代码的

1. 运行时环境(浏览器orNode环境)：初始化基础运行时环境，包括：堆/栈空间、全局执行上下文、事件循环系统 等
2. 解析器：负责将 JavaScript 代码转换成 AST 抽象语法树 和 执行上下文
   1. 词法分析：将字符序列转换为token序列。token是原文件中不可再分割的最小单元
   2. 语法分析：将token序列根据语法规则转换为AST+执行上下文，所有函数体中的变量和函数参数，都将放进作用域中。
3. 解释器：根据AST+执行上下文，解释器生成字节码、并执行字节码
4. JIT即时编译技术：用到编译器(可选)。 如果代码中有一部分代码重复多次，就会被标记为“热点代码”,由优化编译器在后台将字节码编译成机器码(二进制代码),再执行时就会直接执行机器码而不是字节码；如果热点代码有变化，优化编译器执行“反优化操作”，使下次执行重新由解释器执行

### V8里的内存机制

1. 数据类型：
   1. 基本数据类型 7种：null undefined string number boolean symbol bigint
   2. 引用数据类型 1种：Object (Function函数也是对象)
2. 内存的空间结构：有三种空间
   1. 栈空间：存储调用栈/可执行上下文、基本类型数据。栈不会很大
   2. 堆空间：存放引用类型数据。例如对象、数组、闭包等。堆空间很大，是一种树形存储结构
   3. 代码空间：存放可执行代码
3. 堆 VS 栈：
   1. let a = aObj; a存储的是引用类型 aObj 在堆中的引用地址。 a在栈中，aObj在堆中
   2. let b = 'abc'; b存的是完整复制的原始类型变量。 b在栈中

### V8垃圾回收机制

1. 垃圾回收策略的基础是代际假说。代际假说：1.大部分对象都是朝生夕死 2.不死的对象会活得更久
2. V8堆空间结构：
   1. 堆 = 新生代 + 老生代；
   2. 新生代：用来存放活得短的，空间也较小，只有1-8M；
   3. 老生代：存储活得长的(新生代两次垃圾回收都没被回收的就会放进老生代) + 对象本身很大的。老生代的空间比新生代大得多。
   4. 新生代 = 对象区 + 空间区
      1. 对象区：新加入的对象都会存放到对象区域，当对象区域快被写满时，就需要执行一次垃圾清理操作。对象区一般设置的较小(原因：副垃圾回收器每次执行清理操作时，都需要将存活的对象从对象区域复制到空闲区域，复制操作需要时间成本，如果新生区空间设置得太大了，那么每次清理的时间就会过久，所以为了执行效率，一般新生区的空间会被设置得比较小)
      2. 空闲区：
3. 垃圾回收器
   1. 副回收器：副回收器负责新生代的垃圾回收
   2. 主回收器：主回收器负责老生代的垃圾回收
4. 垃圾回收总体流程
   1. 总体思想三步走：1. 标记活动/非活动对象 2.回收内存 3.内存整理(内存回收后产生很多内存碎片整理后变成大块的连续内存)
   2. 副回收器：
      1. 在垃圾回收过程中，首先要对对象区域中的垃圾做标记；
      2. 标记完成之后，就进入垃圾清理阶段。副垃圾回收器会把这些存活的对象复制到空闲区域中，同时它还会把这些对象有序地排列起来，所以这个复制过程，也就相当于完成了内存整理操作，复制后空闲区域就没有内存碎片了。
      3. 完成复制后，对象区域与空闲区域进行角色翻转，也就是原来的对象区域变成空闲区域，原来的空闲区域变成了对象区域。这样就完成了垃圾对象的回收操作，同时，这种角色翻转的操作还能让新生代中的这两块区域无限重复使用下去。
      4. 中间有个优化策略：副垃圾回收器还会采用对象晋升策略，也就是移动那些经过两次垃圾回收依然还存活的对象到老生代中
   3. 主回收器：两种回收算法
      1. 标记-清除算法：
         1. 标记过程阶段。标记阶段就是从一组根元素开始，递归遍历这组根元素，在这个遍历过程中，能到达的元素称为活动对象，没有到达的元素就可以判断为垃圾数据
         2. 清除过程：主垃圾回收器会直接将标记为垃圾的数据清理掉。但这样会产生很多内存碎片，所以引入了标记-整理算法。
      2. 标记-整理算法：
         1. 标记过程：标记可回收对象，跟上面一样
         2. 整理过程：不直接清除，而是让所有存活的对象都向一端移动，然后直接清理掉这一端之外的内存。

### 如果在 js 中执行 location.href = url，这个行为有可能会有哪些安全问题

### 如何实现秒开Webview  

1. 打开的同时加载数据 ❓❓❓
2. 缓存webview  ❓❓❓

### 浏览器时间切片 ???

### 浏览器本地缓存

### 浏览器缓存机制

### jsBridge的原理

![JsBridge](/src/assets/JsBridge.jpeg)

### 一个页面的性能指标有哪些

### 如何做页面的监控

### 浏览器从输入地址URL之后都做了什么

#### 参考链接：![打开网页后全程](/src/assets/打开网页后全程.png)

1. 卸载已有的页面(Prompt for unload)：先卸载原来的页面，释放页面占据的内存
2. 重定向(redirect)：基于缓存。在请求url时，可能该地址在以前请求过，如果发生了重定向，例如301，就会在浏览器内存中存储该重定向后的地址，所以会重新向新地址发起请求。
3. App cache
4. DNS
5. TCP
6. Request
7. Response
8. 文档解析 Processing
9. 文档加载完成 onload

### 各个浏览器包括App端/小程序端WebView的内核都是什么

### 基于DOM画一个扇形，提出方案

### 浏览器 帧

1. 60hz刷新频率的浏览器在一帧的16ms里要做 2+5 件事：![一帧](/src/assets/一帧.png)
   1. 处理用户输入等交互
   2. 执行JS包含EventLoop回调、
   3. 帧开始，调用requestAnimationFrame执行动画、：窗口尺寸变更，页面滚动、媒体查询、动画事件等的处理
      1. 参考链接：实现进度条<https://www.jianshu.com/p/d36c161943d9>  协同reacthooks实现倒计时<https://juejin.cn/post/7022636375136534565> <https://baijiahao.baidu.com/s?id=1702088861129925384&wfr=spider&for=pc>
      2. 同时调用两次 requestAnimationFrame 会在一帧里执行；在requestAnimationFrame里调用requestAnimationFrame，会放到下一帧里执行。
   4. 布局layout加样式css、
   5. 绘制渲染paint。
   6. 当这些事都做完了还没到16ms,就会执行window.requestIdleCallback方法
2. 查看浏览器帧：在f12打开控制台后，shift+commond+p 可以显示fps面板

### 进程 VS 线程  VS 协程

1. 进程：一个进程就是一个程序的运行实例。详细解释就是，启动一个程序的时候，操作系统会为该程序创建一块内存，用来存放代码、运行中的数据和一个执行任务的主线程，我们把这样的一个运行环境叫进程。
2. 线程：线程是不能单独存在的，它是由进程来启动和管理的，线程是依附于进程的，而进程中使用多线程并行处理能提升运算效率
3. 协程：一个线程也可以拥有多个协程。每一时刻该线程只能执行其中某一个协程,即同一时间只能有一个协程在运行的，其他协程会暂停执行、之后交换执行权。协程不是被操作系统内核所管理，而完全是由程序所控制，（也就是在用户态执行）。这样带来的好处就是性能得到了很大的提升，不会像线程切换那样消耗资源
4. 子例程：子例程是源代码里具有一定独立功能的模块单元。
5. 进程vs进程 进程VS线程 之间的关系
   1. 进程中的任意一线程执行出错，都会导致整个进程的崩溃。
   2. 线程之间共享进程中的数据。
   3. 当一个进程关闭之后，操作系统会回收进程所占用的内存。
   4. 进程之间的内容相互隔离。一个挂了，另一个也不受影响。如果进程之间需要进行数据的通信，这时候，就需要使用用于进程间通信的 IPC 机制了。

### 浏览器 目前多进程架构

1. 进程图： ![Chrome进程架构](/src/assets/浏览器进程架构.png)
2. 进程功能
   1. 1个 browser 主进程：主要负责界面显示、用户交互、子进程管理，同时提供存储等功能
   2. 最多1个 GPU进程：绘制3D CSS，现在普遍用来绘制UI界面
   3. 1个 Network 网络进程: 负责网络资源加载
   4. 多个 Render 渲染进程(沙箱模式)：核心任务是将 HTML、CSS 和 JavaScript 转换为用户可以与之交互的网页，
      1. 排版引擎 Blink 和 JavaScript 引擎 V8 都是运行在该进程中，
      2. 默认情况下，Chrome 会为每个 Tab 标签创建一个渲染进程。
      3. 出于安全考虑，渲染进程都是运行在沙箱模式下。
   5. 多个 插件进程：主要是负责插件的运行，因插件易崩溃，所以需要通过插件进程来隔离，以保证插件进程崩溃不会对浏览器和页面造成影响，每个类型的插件对应一个进程，只有当使用该插件时才创建
3. 打开一个页面，最少有几个进程协同工作：4个。打开 1 个页面至少需要 1 个网络进程、1 个浏览器主进程、1 个 GPU 进程、 1 个渲染进程，共 4 个

### 一个渲染进程的多线程架构

1. 定义：每个tab页面创建一个渲染进程，这个进程内是多线程的，有几个大类线程
2. 线程图： ![浏览器内核](/src/assets/一个渲染进程的多线程.webp)
   1. GUI渲染线程：(有的文档里也叫它渲染进程的主线程)负责渲染浏览器界面，解析HTML，CSS，构建DOM树和RenderObject树，布局和绘制等，当界面需要重绘（Repaint/Redraw）或由于某种操作引发回流(reflow)时，该线程就会执行. 例如window.requestAnimationFrame就属于GUI线程，会在下一次重绘之前调用获取动画计算结果
   2. JS引擎线程：负责执行js脚本，渲染进程无论什么时候都会有一个且只有一个js引擎始终存在，现在大部分用的都是排版引擎 Blink 和 JavaScript 引擎 V8，同步的任务在这个线程中运行，维持一个执行栈，js引擎是单线程的，它一直等待着任务队列中任务的到来，一旦执行栈中的所有同步任务执行完毕（此时JS引擎空闲），就会读取事件线程中的任务队列，将可运行的异步任务添加到可执行栈中，开始执行
   3. 事件队列线程：这个线程管理一个任务队列，即事件循环EventLoop, 将来自其他线程的任务加入到事件队列中等待js引擎线程空闲时处理，(任务可能来自不同线程，例如setTimeout来自定时触发器线程、ajax异步请求来自网络请求线程)
   4. 定时器线程：setInterval与setTimeout所在线程。 所以说浏览器定时计数器并不是由JavaScript引擎线程计数的,因为JavaScript引擎线程是单线程, 如果处于阻塞线程状态就会影响记计时的准确。
      1. 注意：规定要求setTimeout中低于4ms的时间间隔算为4ms。 注意这个时间不是回调函数将会被执行的间隔，而是这个时间间隔后，将事件推入任务队列，然后就等着js引擎空闲时执行了(如果js还是在忙，可能执行时间还会延后哦)。
   5. 异步网络请求线程：产生一个xhr连接后会新开一个网络请求线程，监控到xhr的readyState状态变化后，如果设置了处理状态的回调函数，异步线程将回调函数放进事件触发线程中的任务队列中，等待JS引擎线程执行。注意Chrome浏览器对同一域名的请求并发数限制为6
   6. Compositor合成线程：直接将GUI线程得到的LayerTree拿来执行，对图层分块给光栅线程做光栅化，GPU进程可以加速。做好了就给回GUI主线程了。它可以跟GUI主线程一起执行，这也是为什么说用GPU做动画等是优化方案了
   7. Raster光栅线程：用来将几何信息转换为屏幕上像素的线程
3. 关系：![渲染进程内多线程之间的关系](/src/assets/渲染进程内多线程之间关系.jpeg)
   1. GUI 与 JS 线程 互斥，一个执行时另一个挂起，
      1. 所以不能让js执行时间过长，会阻塞页面渲染
      2. 互斥的原因：由于JavaScript是可操纵DOM的，如果在修改这些元素属性同时渲染界面（即JS线程和UI线程同时运行），那么渲染线程前后获得的元素数据就可能不一致了。因此为了防止渲染出现不可预期的结果，浏览器设置GUI渲染线程与JS引擎线程为互斥的关系
   2. 上述5个线程中，只有js引擎线程执行js脚本，3-5这三个线程只负责将满足条件的函数推进事件循环中的任务队列，等待js引擎进程空闲时执行

### 浏览器的5种 Observer

参考链接：<https://blog.csdn.net/qiwoo_weekly/article/details/123080748?spm=1001.2014.3001.5502>

1. addEventListener 监听用户操作、窗口resize
2. IntersectionObserver 监听一个元素和可视区域相交部分的比例，然后在可视比例达到某个阈值的时候触发回调。
3. MutationObserver 可以监听对元素的属性的修改、对它的子节点的增删改。
4. ResizeObserver 监听元素大小的改变，当 width、height 被修改时会触发回调
5. PerformanceObserver 用于监听记录 performance 数据的行为，一旦记录了就会触发回调，这样我们就可以在回调里把这些数据上报
6. ReportingObserver 监听过时的 api、浏览器干预等报告等的打印，在回调里上报

### EventLoop事件循环 (浏览器环境)

参考链接：<https://baijiahao.baidu.com/s?id=1702088861129925384&wfr=spider&for=pc>

1. 处于一个渲染进程中的事件队列线程，维护了一个栈，分为 宏任务 和微任务。
   1. 宏任务：
      1. setTimeout
      2. setInterval
      3. messageChannel

   2. 微任务：
      1. Promise (包含promise.then promise.catch promise.finally)
      2. window.queueMicrotask 可以创建一个微任务
      3. MutationObserver，监控dom节点变化、

         ``` c
         // 创建一个微任务
         const observer = new MutationObserver((mutationRecords, observer)=>{
            console.log('mt1')
         })
         observer.observe(document.body, { attributes: true })
         ```

   3. 特殊的任务队列：Animation callbacks 是由 requestAnimationFrame定义的回调，也是一个队列，不属于事件循环
2. 优先级 同步任务 > 微任务 > 宏任务
3. 浏览器执行机制：
   1. 浏览器的事件循环，是在渲染进程中的；
   2. 执行一个宏任务，栈中没有就从事件队列中获取；
   3. 执行过程中如果遇到微任务，就添加到微任务的队列中；
   4. 当前这个宏任务执行完毕后，立即执行当前微任务队列的所有微任务；
   5. 当前宏任务执行完毕，GUI线程接管渲染； 其中这个GUI线程接管后，就执行 requestAnimationFrame ，这也是一帧的开始
   6. 渲染完毕后，JS线程继续接管，开始下一个宏任务；
4. 事件循环与帧的关系：
   1. ![EventLoop与Frame](/src/assets/EventLoop与Frame.png)
   2. js引擎获得执行权：执行同步代码，从任务队列取出一个宏任务执行，然后执行当前所有微任务，微任务都执行完后才切换执行权。
   3. GUI线程获取执行权，开始新的一帧： requestAnimationFrame、页面布局、渲染，如果这一帧还有空闲时间就执行requestIdleCallback. 这一帧结束后，切换执行权
   4. js引擎获得执行权：再次取出任务队列的一个宏任务、所有微任务。。。
   5. 总结：js线程与GUI线程的一次交接就是一个循环。在每个循环里，浏览器只执行一个宏任务，而微任务要全部执行完才继续循环。如果微任务耗时特别长，那么这一帧内，浏览器刷新的时机就会被阻塞，页面卡顿

### 渲染引擎的渲染执行流程

参考链接：<http://blog.acohome.cn/inside-browser-part3/>
(有的文档里说渲染进程的主线程blabla...就是本文中的GUI渲染线程)

1. 构建 DOM (Document Object Model)树、
   1. 渲染引擎GUI线程接收到导航的确认信息，并开始接收相应数据HTML data，就开始由HTML解析器将HTML文本转化成浏览器能懂的树状DOM结构
      1. window.document就是在浏览器环境下，在内存中保存的DOM结构。DOM 和 HTML 内容几乎是一样的，但是和 HTML 不同的是 HTML 是一种文档语言，只能用 HTML解析器解读，而 DOM 是保存在内存中树状结构，可以通过 JavaScript 来查询或修改其内容。
   2. 加载外部资源：当渲染主线程GUI在解析并构建DOM树时，为了加速页面显示，PreloadScnner预加载扫描器会同时在后台运行。
      1. 当解析到例如img link这样的dom标签，预加载器就会通知浏览器进程中的网络线程去加载网络资源。
      2. 当加载到script标签时，html解析器就会停下来，先去加载相应的js资源并执行。解决办法有几个，比如可以用defer async关键字，也可以用link rel="preload"告知浏览器必须尽快加载
2. 样式计算 计算每个dom的calculatedstyle
   1. 渲染引擎GUI线程接收到CSS文本后，将CSS文本转化为浏览器可以理解的styleSheets结构，document.styleSheets 就是样式对象
   2. 将各个数据标准化，比如把rem单位转化为px,将颜色的单词转化为rgb()颜色数值等
   3. 计算每个DOM的css样式
      1. css的继承规则：CSS 继承就是每个 DOM 节点都包含有父节点的样式
      2. css的层叠规则：定义了如何合并来自多个源的属性值
      3. css的默认值：就算有的节点没有设置css，但不同的标签还是有一些默认样式
   4. 把css样式结果输出：每个DOM的css都保存在该DOM的ComputedStyle的结构中
3. Layout布局阶段: (传统意义上的布局阶段包括Layout和Layer)
   1. 创建布局：构建一棵可见元素的layoutTree:遍历所有节点，把所有可见的节点加入到布局树中，不可见的元素忽略掉
   2. 布局计算: 计算DOM中可见元素的几何位置
4. Layer分层构建图层树LayerTree, 也属于布局阶段
   1. 因为一些动画、z轴变化等特殊效果，渲染引擎还需要为特定的节点生成专用的图层，并生成一棵对应的图层树（LayerTree）
   2. 图层：
      1. ![图层树](/src/assets/图层树.webp)
   3. 并不是布局树的每个节点都包含一个图层，如果一个节点没有对应的层，那么这个节点就从属于父节点的图层。但不管怎样，最终每一个节点都会直接或者间接地从属于一个层。
   4. 会被提升为单独图层的2种情况
      1. 拥有层叠上下文属性的元素,即能够被z-index属性改变表现的元素会被提升为单独的一层，例如不在文档流内的position、opacity透明的元素、css filter滤镜的元素 等。参考链接：<https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context>
         1. 文档根元素（<html>）；
         2. position 值为 absolute（绝对定位）或  relative（相对定位）且 z-index 值不为 auto 的元素；
         3. position 值为 fixed（固定定位）或 sticky（粘滞定位）的元素（沾滞定位适配所有移动设备上的浏览器，但老的桌面浏览器不支持）；
            1. 注意！！ position:fixed遇到部分分层的情况后，将会从对屏幕绝对定位萎缩为对元素绝对定位

               ```
               /*  
               transform 属性值不为 none 的元素
               设置了 transform-style: preserve-3d 的元素
               perspective 值不为 none 的元素
               在 will-change 中指定了任意 CSS 属性
               设置了 contain: paint
               filter 值不为 none 的元素
               backdrop-filter 值不为 none的元素 
               */
               <style>
                  .outer {
                     width: 300px;
                     height: 400px;
                     background-color: orange;
                     /* transform: translateX(100px); */ 
                     /* transform-style: preserve-3d; */
                     /* perspective: 400px; */
                     /* will-change: transform; */
                     /* contain: paint; */
                     /* filter: grayscale(100%); */
                     /* backdrop-filter: grayscale(100%); */
                  }
                  .inner {
                     width: 200px;
                     height: 200px;
                     background-color: lightblue;
                     position: fixed;
                     right: 0;
                  }
               </style>
               ```

         4. flex (flexbox (en-US)) 容器的子元素，且 z-index 值不为 auto；
         5. grid (grid) 容器的子元素，且 z-index 值不为 auto；
         6. opacity 属性值小于 1 的元素（参见 the specification for opacity）；
         7. mix-blend-mode 属性值不为 normal 的元素；
         8. transform:值不为 none 的元素
         9. filter:值不为 none 的元素(filter将会给整个元素设置滤镜)
         10. backdrop-filter 值不为 none的元素(backdrop-filter 可以只给北京设置滤镜)
         11. perspective: preserve-3d 的元素
         12. clip-path
         13. mask / mask-image / mask-border
         14. isolation 属性值为 isolate 的元素；
         15. -webkit-overflow-scrolling 属性值为 touch 的元素；
         16. will-change 值设定了任一属性而该属性在 non-initial 值时会创建层叠上下文的元素（参考这篇文章）；
         17. contain 属性值为 layout、paint 或包含它们其中之一的合成值（比如 contain: strict、contain: content）的元素。
      2. 需要裁剪 或 出现滚动条的,会提升为单独的层 例如小区域大内容的overflow:hidden
5. 图层绘制指令：并非真的绘制，其实是组装一个待绘制指令列表。 完成图层树后，渲染引擎会对图层树中的每个图层拆解成一个个小的绘制指令，再将这些指令按照顺序组成待绘制列表，绘制阶段就是合成并输出待绘制指令列表。
6. 图层分块: 从这一步开始，下面的操作才是真正的绘制，是由合成线程控制光栅线程真正完成的。
   1. 当图层的待绘制指令列表组装好后，渲染引擎中的GUI线程将该列表提交给合成线程。
   2. 合成线程将图层分为图块，因为一个图层可能很大，所以合成线程将层的内容切割分块后发给光栅线程。
7. raster栅格化：
   1. 光栅化也叫栅格化，是指光栅线程将图块转换为位图(就是屏幕上的像素)的过程，图块是栅格化执行的最小单位。
   2. 光栅线程进程维护了一个栅格化的线程池，所有的图块栅格化都是在线程池内执行的  
      1. ![光栅线程-栅格化](/src/assets/光栅线程-栅格化.webp)
   3. 合成线程可以对不同的光栅线程进行优先级排序，视窗或附近的元素会优先被光栅化。
   4. 通常，栅格化过程都会使用 GPU 来加速生成。如果使用了GPU,光栅线程将图块交给GPU,最终生成位图的操作是在GPU进程中完成的，生成的位图被保存在 GPU 内存中。GPU是单独的进程，这中间涉及跨进程操作。
      1. ![跨进程栅格化](/src/assets/跨进程栅格化.webp)
   5. GPU完成所有图层里的各个图块的栅格化之后，将结果返回给合成线程
8. 合成线程进行合成:
   1. 一旦元素被光栅化，就会被合成线程收集起来。一旦所有图层都完成栅格化，合成线程就会创建一个CompositorFrame合成帧,也是最终合成后的图层。
   2. 合成线程将合成帧通过IPC 跨进程通知browser浏览器主进程。
   3. browser浏览器主进程接收来自渲染进程的合成线程发过来的合成帧，浏览器主进程执行显示合成操作(Display Compositor)。
   4. 进程关系：
      1. ![渲染流程-主进程接收](/src/assets/渲染流程-主进程接收.webp)
9. 相关概念
   1. 重排：修改元素的几何位置，触发从Layout、Layer开始的所有后续渲染流水线，开销大
   2. 重绘：修改了styleSheets, 没有几何位置的改变，就不会触发Layout和Layer，直接进入绘制阶段，比重排效率高些
   3. 重绘与重排的关系：重排一定会重绘，重绘不一定重排
   4. 直接合成：有些修改，既不修改布局也不修改样式，将跳过重排重绘，只执行后续的合成操作。例如transform:translate 实现的动画效果，利用了GPU擅长绘制CSS动画的特点，可以在不同位置绘制同一张位图，所以能直接执行合成操作，这样的效率最高
10. 开启GPU硬件加速的属性
    1. transform 比如 transform: translateZ(0)
    2. opacity
    3. filter
    4. will-change 告知浏览器该元素会有哪些属性发生变化(实验中)
11. 其他优化：
    1. 在内存中操作或缓存起来：在js中统一操作dom 或者缓存dom，之后操作一次dom
    2. 脱离文档流操作：将要修改的dom设置为 绝对定位或者浮动、或者display:none等，目的是脱离文档流，统一操作dom后再放回文档流
    3. 合并css样式修改：多个通过dom.style.*的修改 可以合并成一次 class的覆盖
    4. 分层渲染： 上面写了
12. 渲染流程总结为：
    1. 渲染进程将HTML内容转换为能够读懂的DOM树结构
    2. 渲染引擎将CSS样式表转换为浏览器可以理解的styleSheets，计算出DOM节点的样式
    3. 创建布局树，并计算元素的布局信息
    4. 对布局树进行分层，并生成分层树
    5. 为每个图层生成绘制列表，并将其提交到合成线程
    6. 合成线程将图层分成图块，并在光栅化线程池中将图块转换成位图
    7. 合成线程发送绘制图块命令DrawQuad给浏览器进程
    8. 浏览器进程根据DrawQuad消息生成页面，并显示到显示器上

### 各种资源是否阻塞渲染

1. 外部css的加载`不会`阻塞DOM`解析` 页面中会出现dom标签
2. 外部css的加载`不会阻塞 前面的`DOM`渲染`，页面中`标签和内容都会正常渲染`，css加载完成后有可能页面闪一下  (猜测，没解析到引入css的代码,不知道要加载css，所以就先渲染了，反正DOM也有默认的style)
3. 外部css的加载 `会阻塞 后面的`DOM`渲染` 页面中`只出现标签，在css加载后才会渲染出内容`   (猜测，这是浏览器的优化，知道有css要加载就先不渲染，省的还要重渲染)
4. 外部CSS的加载 `会阻塞 后面的JS执行` (因为GUI与JS线程互斥，所以要把css放在页面头部尽快加载，不让它耽误js运行)
5. JS 会 阻塞 后面的 DOM 解析和渲染  (所以js放在页面最后，别耽误html和css解析，减少白屏时间)
6. 视频、图片、字体 等都不会阻塞渲染

### Worker对象 进程中的独立后台线程

1. web Worker
   1. 定义：Web Worker 是一个独立的线程（独立的执行环境），这就意味着它可以完全和 UI 线程（主线程）并行的执行 js 代码，从而不会阻塞 UI，
   2. 通信；它和主线程是通过 MessageChannel(onmessage+postMessage)通信的
   3. 用途：Web Worker 使得网页中进行多线程编程成为可能。当主线程在处理界面事件时，worker 可以在后台运行，帮你处理大量的数据计算，当计算完成，将计算结果返回给主线程，由主线程更新 DOM 元素
   4. 特点：
      1. 不能直接访问操作DOM
      2. 可以被多个脚本调用并创建多个后台线程，前提是这些脚本所在页面必须同源（相同的协议、host 以及端口）。
   5. demo:

      ```
      // A. host.js
      const myWorker = new Worker('worker.js');
      myWorker.onmessage = function (e) {
         alert(e.data); // btn click : worker send
      }
      myWorker.postMessage("btn click");

      // B. worker.js
      onmessage = function (e) {
         const workerResult = e.data + " : worker send";
         postMessage(workerResult);// 发送消息给主线程
      }
      ```

2. Service Worker
   1. 定义：service worker 是一种特殊的 web worker,是一种运行在后台，在GUI主线程之外的一个独立的子线程。
      1. 可以用来计算一些耗费性能的操作，计算后再跟js主线程通个信交换结果。
      2. 或者拦截网络请求并根据网络是否可用来采取适当的动作、更新来自服务器的的资源。
      3. 充当 Web 应用程序、浏览器与网络（可用时）之间的代理服务器。常作性能优化手段，使web项目也可以使用离线功能。
   2. 发展：是一个H5 API, 前身是 Application Cache。 2012年就推出了，浏览器支持的很好。但是因为规则很多，所以并没有得到大规模推广。
   3. 实现思路：service worker 可以拦截客户端到服务器的网络请求，然后决定是使用本地缓存，还是请求云端服务并缓存到本地。通过在H5中指定一个menifest缓存配置文件，并在对应的文件里指定缓存策略，比如设置要缓存的列表、要绕过缓存向真正服务器发起请求的白名单列表等等。之后浏览器就会完成相应操作
   4. service worker的特点
   1. 不能直接访问操作DOM
   2. 需要时直接唤醒，不需要时自动休眠
   3. 离线缓存内容开发者可控
   4. 一旦被安装，永远存活，除非手动卸载
   5. 必须在HTTPS协议下工作(不包括在本地环境，可以在本地调试)
   6. 广泛使用了Promise
   7. 目前只在Chrome Firefox上能兼容
   5. 使用： 为了区分功能，把sw不同的功能放在了不同的js中了
      1. 注册: 创建一个单独的js脚本作为service worker的工作文件 sw-register.js
      2. 安装: 如果注册过的sw没有被安装过或者过期了，就会触发安装 执行 sw-install.js中的代码
      3. 激活: 安装成功后就开始激活。要做的事就是让新的sw尽快获得对作用域的控制，并且清理与旧的sw相关的一些缓存资源。sw-install.js中的代码
      4. 1-3步完成后，sw就可以控制页面了
   6. 应用：PWA  ????
      1. PWA是一种可以提供类似于原生应用程序(native app)体验的网络应用程序(web app)。PWA 可以用来做很多事。其中最重要的是，在离线(offline)时应用程序能够继续运行功能。这是通过使用名为 Service Workers 的网络技术来实现的。
   7. Demo位置：/tips-and-problems/src/ServiceWorker
3. Web Worder 对比 Service Worker 的不同
   1. 参考链接：<https://www.bilibili.com/video/BV1bA411s7E3?spm_id_from=333.337.search-card.all.click>
   2.

### 主流浏览器引擎前缀

-webkit- （谷歌，Safari，新版Opera浏览器 ...
-moz- （火狐浏览器）
-o- （旧版Opera浏览器）
-ms- （IE浏览器 和 Edge浏览器）

### 页面上的 加载相关事件  window.load VS document.DOMContentLoaded VS document.readyStateChange

参考：<https://juejin.cn/post/6914479519394955271>

1. document.DOMContentLoaded 会在 DOM解析完成+同步js脚本执行完 后触发， 此时异步资源、外部资源可能还没加载完。 (外部资源:例如 css、图片、视频、字体、脚本).如果页面上有 用defer 或 async 或 type=module 标识的script脚本，如果在html没解析完就下载完了，则 DOMContentLoaded事件 会在这些下载好的js脚本同步执行完之后才触发
2. window.onload： 上述全部加载完之后才触发。
3. document.readyStateChange 监听的是document.readyState的状态 三种 loading 正在加载中; interactive表示html解析完毕类似document.DOMContentLoaded; complete 加载完成 类似 window.load

```
document.addEventListener('DOMContentLoaded', (event) => {
   console.log('DOMContentLoaded'); 
});
window.addEventListener('load', (event) => {
   console.log('load'); 
});
doucument.addEventListender('readyStateChange', ()=>{
   switch(document.readyState){
      case 'laoding':
      case 'interactive':
      case 'complete':
   }
})
<!-- 输出顺序: -->
loading
interactive
DOMContentLoaded
complete
load
```

### 移动端 click touch tap 的区别

参考：<https://www.cnblogs.com/zhuzhenwei918/p/7588553.html>

1. click的300ms延迟
2. 多指时 一个手指的离开就会触发touchend
3. tap 的穿透问题
