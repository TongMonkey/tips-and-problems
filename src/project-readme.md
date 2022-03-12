### 微前端了解么

### 聊聊每个项目的亮点：
有亮点的项目最好多准备几个，最好是不同类型的，比如业务的、偏中后端的、组件库的、工程化的和新兴技术的，根据自己擅长的内容最起码准备两三个

### 对Serverless的理解

### 如何实现一个换肤功能

### 离线包/离线下载的原理是什么

### git CI/CD 了解

### 代码规范如何做的

### eslint 和 prettier 的冲突是如何解决的


### 如何做前端预渲染

### 怎么做能让项目更好

### 埋点+监控方案

### 前端优化
参考：https://segmentfault.com/a/1190000018392559
https://segmentfault.com/a/1190000018828048
https://blog.csdn.net/weixin_44368963/article/details/108264278
1. http
   1. URL后面加反斜杠/ 减少服务器查询文件的过程，直接去查询目录
   2. dns预解析：最关键的连接使用 preconnect，而其他的则可以用 dns-prefetch
      1. dns-prefetch预解析：针对跨域域名的DNS查找有效 `<link rel="dns-prefetch" href="https://fonts.googleapis.com/"> ` 注意，多页面重复的DNS预解析会增加DNS查询次数，dsn-prefetch需慎用
      2. preconnect预连接: 针对HTTPS协议的跨域域名有效。因为如果站点是通过HTTPS服务的，则此过程包括DNS解析，建立TCP连接以及执行TLS握手。注意，提前链接所有请求并不合理，
      3. 联合上述两个：最关键的连接使用 preconnect，而其他的则可以用 dns-prefetch； dns-prefetch 可以作为不支持预连接的浏览器的后备选择，同时配置它们两即可
      ```
      <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin>
      <link rel="dns-prefetch" href="https://fonts.gstatic.com/">
      ```
   3. 链接预解析：prefetch  preload  
         1. `<link ref="preload" as="style" crossorigin href="">` preload会在不阻塞onload事件的前提下，下载资源。中途跳转页面preload中断
         2. `<link ref="prefetch" as="style" crossorigin href="">` prefetch告诉浏览器我未来或者下个页面可能要使用的资源，由浏览器自己控制在空闲时下载。中途跳转页面prefetch可同步进行不中断，在新页面中继续用下载到的资源。
         3. 上述的as可以控制资源加载的优先级，跟随设置as设置的资源类型的优先级，例如as="style"的优先级就高于as="script"的优先级。如果不设置，就是个普通的异步，建议设置
         4. 建议始终设置crossorigin,否则可能引起两次请求
   4. CDN静态资源服务器：
   5. 减少请求：资源合并、promise.all并发
   6. 资源体积：webpack打包压缩 gzip压缩
   7. 利用缓存：cdn、http缓存(长缓存/协商缓存)、本地缓存、nginx缓存.不经常变动的文件，通过加后缀的方式，可以在每次发布的时候才修改后缀实现更新、使用离线包
   8. 请求顺序：控制请求优先级不重要的可以异步请求、判断哪些是关键请求、关键请求并发执行，可以用lighthouse排查链式请求的问题，注意关键请求的数量
   9.  优先使用 https2 协议
   10. 资源按需引入：路由懒加载、组件按需加载
2. html:
   1. 移除阻塞代码：变成异步加载或者写在最后，比如一些首屏用不到的第三方脚本
   2. css代码写在head里，js代码写在body后
   3. 少用table，用div+css替代，因为table里的东西都加载完才会展示整个table
   4. 减少无用dom数
   5. 减少dom操作：缓存dom、innerHtml代替操作多个dom
   6. 事件：可以事件委托、防抖/节流等
   7. 减少重排、重绘
   8. 长列表优化
3. js:
   1. js放在body后，防止阻塞首屏渲染
   2. 避免代码长期占用一个主线程 超过一帧时长，视觉卡顿
   3. 使用 defer 异步加载js
   4. webWorker 多线程编程
4. 图片：
   1. img标签提前定义好图片的宽高
   2. 压缩图片：npm install imagemin
      1. 压缩jpg: npm install imagemin-mozjpeg
      2. 压缩png: npm install imagemin-pngquant
      3. 压缩webP: npm install imagemin-webp
   3. 优先使用webP/AVIF图片、其次才是jpg/png图片 但webP兼容还不全面，两种方案
      1. 用css backgroud
         ```
         background-img: url('*.webp'),url('*.jpg'); //两张图片会叠加，会优先加载webP图片，之后再加载jpg图片也变清晰
         ```
      2. 用html picture标签
         ```
         <picture>
            <source src="*.webp" /> //浏览器会根据兼容性判断使用哪个source的src，如果都不兼容就使用最下面img标签的src
            <source src="*.avif" />
            <img src="*.jpg" />  //真正在页面占位的只有img标签
         </picture>
         ```
   4. 图片预加载：提前prefetch后面要展示的图片
   5. 图片懒加载：`<img loading="lazy" >` 只有展示到视窗时才会加载图片
   6. 隐藏iframe提前加载图片
   7. 内联 SVG 展示 Logo 和图标
5. css：
   1. css放在head前，尽快下载和解析
   2. 优先使用flex布局
   3. 对动画、操作dom等容易引起重排重绘的操作可以先脱离文档流
   4. 尽量使用css动画
   5. 减少重排和重绘
   6. 尽量使用class\id，少用行内样式style
   7. css中@import的内容可能有嵌套，所以浏览器会按序加载，如果用link标签就可以并行解析，更快
6. 动画：
   1. 因为复合动画可以使用GPU加速，所以应避免非复合动画
   2. 尽量使用css动画，可以GPU硬件加速，例如使用 transform、opacity、filter、will-change
   3. 动画脱离文档流
7. 字体：
   1. preload字体
   2. font-display:swap. 设置字体没加载出来之前，先用系统默认字体展示(默认font-display:auto表示字体没加载出来之前内容content也不显示)
   3. 缓存字体、压缩字体
   4. 采用svg图片或者字体图标：因为字体图标或者SVG是矢量图，代码编写出来的，放大不会失真，而且渲染速度快。字体图标使用时就跟字体一样，可以设置属性，例如 font-size、color 等等，非常方便，还有一个优点是生成的文件特别小
8. 渲染优化
   1. 首屏SSR服务器端渲染
   2. 页面预渲染 ？？？
9. 精简代码: 
   1. 提取公共代码： webpack的splitChunk插件
   2. 剥离冗余代码：利用loader、tree-Shaking等
10. Webview 优化
    1. 打开webview的同时并行加载页面数据 ？？？


### 项目性能监控指标 都有哪些
1. 分析工具：lighthouse web-vitals
2. 底层API：performance
3. 白屏时间：指的是从输入网址， 到页面开始显示内容的时间
   ```
   // 代码放在<head></head>里
   <script>
      let t = + new Date() - performance.timing.navigationStart
   </script>
   ```
4. 首屏时间：指从输入网址， 到首屏页面内容渲染完毕的时间。
   ```
   <script>
      window.onload = () =>{
         let t = + new Date() - performance.timing.navigationStart;
      }
   </script>
   ```

### debug 的方式
1. 先判断是前端问题还是后端问题。可以查看接口是否正确、根据报错信息提示 在network面板搜索关键字 
2. 如果是前端问题，也可以在source面板下全局搜索关键字
3. 由于 线上js 大多是混淆过的，可以手动添加 .soucemap文件。 参考链接：https://mp.weixin.qq.com/s/YLdHyX0lh123dqHxijlM2w
   1. 先通过配置webpack打包，得到对应的.sourcemap文件
   2. 安装一个http-server
   3. 通过开启一个http-server本地服务，将.sourcemap文件放在这个本地服务下，使能在浏览器中访问到这个本地 .sourcemap
   4. 在浏览器有错误的混淆js页面中，右键单击，会有一个"Add source map..."的选项，填入本地服务中sourcemap文件的地址
   5. 关联后，浏览器Sources面板下将会多出几个文件夹，跟本地代码的文件结构目录一致，可以看到源代码，就可以查找问题了
4. 如果有些代码修改后，想知道在浏览器是否能正常运行，可以使用 本地重写 Overrides 功能：
   1. 在Sources面板下，左侧跟Page等并列的一个功能叫Overrides。可以添加一个要重写的文件路径，
   2. 选择之后，浏览器会询问是否同意授权更改文件，同意即可
   3. 然后就修改对应的代码即可，修改好后文件名会带一个星，表示修改过，此时要保存后，星星会消失，刷新浏览器才会更新。更新的效果就是重新后的代码。
   4. 如果想取消，右键后会有remove的指令选项
5. 打断点 breakpoints
   1. 直接在文件行数上可以打
   2. 在代码中也可以通过 单击右键-add if breakpoints -写条件判断语句 来设置条件断点