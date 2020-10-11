# 前段开发过程中遇到的Tips 和 Problems

###1.【Tip】无返回数据的http请求
#### 背景描述：触发点击事件时，发送某请求 http://$%^.$%^?a=*&b=*  通知后台，不需要返回数据
#### Tip：用访问图片的方式自动请求 代替写ajax get请求
```
var img = new Image();
img.src=' http://...'

```
### 2.【Problem】document.write()带来的问题
####背景描述：document.write最简单的理解就是：打印输出，在页面中输出write()括号内的东西。在JS中 document是DOM树最顶端的对象，也就是说是在body里打印括号里的东西。调用浏览器DOM中document对象的write方法，将一段HTML代码或是一段文本内容输出到文档,以使浏览器可以动态处理。要在页面中渲染完成后动态的插入一段script代码，使用document.write('<script>...</script>')；结果页面原本的内容都不见了，只有<script>...</script>
####原因：在已经渲染完的页面也就是执行过load事件的页面里，调用document.write()会自动调用docuement.open()打开一个文档流，清空该文档的内容！然后写入数据，写完再调用document.close(),以告诉浏览器页面已经加载完毕。写入的数据会被解析到文档结构模型里。在上面的例子里，元素h1会成为文档中的一个节点。此时页面上就只剩下'<script>...</script>'这一段了。
#### 特殊：如果document.write()调用发生在`<script>`标签中，那么它将不会自动调用document.open()。
#### 解决：使用dom的api，操作元素。
#### 链接：https://developer.mozilla.org/zh-CN/docs/Web/API/Document/write

```
var scri = document.createElement('script');
document.getElementByTagName('head')[0].appendChild(scri);

```

### 3.【Tip】Js节流
#### 背景描述：页面下滑，间断加载图片，每个图片展示在视窗内就触发一次展示报告事件
#### 做法：在window.onscroll事件中，for循环图片dom元素，其距离视窗顶部高度低于视窗本身高度时，触发报告事件
#### 问题：onscroll+for 导致一直在触发for里的代码块
#### 解决：通过定时器实现js截流
#### 原文链接：https://www.jianshu.com/p/b8b467837b77
```
   // onscroll截流事件所需的全局定时器
  var timeoutMac = null;
  //定时器回调函数
  function callBack(){
    //展示行为报告
    var adList = document.getElementsByClassName('ds');
    for(var i=0;i<adList.length;i++){
        showAd(adList[i].getAttribute('impAddress'))
    }
  }
  window.onscroll = function(){
    if(timeoutMac){
      clearTimeout(timeoutMac);
    }
    //回调函数延迟50毫秒触发
    timeoutMac = setTimeout(callBack,50);
  }
```
### 4.【Problem】在页面上引入一个scirpt,要是用脚本里的方法，直接使用funName();不生效提示funName is undefined.
#### 解决：在script脚本中定义该方法时不能直接 function funName(){...} 而是window.funName = function(){}

### 5.【Problem】页面上自调用的函数里调用另一个函数，写法如下
```
var getNum = function(){
     return 23;
}
(function(){
     console.log('aa')
})();

```
#### 浏览器编译报错：
```
(intermediat value)(...) is not a function
```
#### 原因：自调用函数前写一个；分号，浏览器可以理解为前一个函数执行完毕
```
var getNum = function(){
     return 23;
}
；(function(){
     console.log('aa')
})();
```
### 6.【Tip】获取当前元素的所有样式
#### 背景描述：查看当前元素的样式，通过ele.style.*只能查到当前元素的行内样式，无法查看类样式等所有样式
#### 解决: 获取元素的样式对象，从对象中取出对应的样式值
```
var ele = document.getElementsByClassName('article')[0];
var style = getComputedStyle(ele);
console.log(style);
var br = style.getPropertyValue('font-size'); //结果是带单位的‘18px’
```

### 7.【Problem】设置边距后，改变了原本的宽高
#### 背景描述：弹出一个提示框，固定大小为300px*185px,但设置8px的边距后，提示框被撑大为316px*201px
#### 原因：所有只讲内边距不讲盒模型的教程都是耍流氓！盒模型定义：每个元素被表示称一个矩形的方框；默认情况下，一个元素的宽和高指的是content也就是内容的宽高，此时盒模型box-sizing的值是默认值：content-box;所以设置的padding和border会在现有的content的宽高基础上再累加；如果要固定宽高，就要设置box-sizing:border-box;表示先添加border,padding,最后content，保证父元素不会被撑大；这两种模式也被称作正常盒模型(content-box)和怪异盒模型()
#### 链接：https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Styling_boxes/Box_model_recap
#### 相关：
1. 外边距塌陷问题：当两个盒子挨在一起时，二者之间的距离为两个挨着的外边距中最大的那个值，而不是二者的和。
2. 背景图片的边界问题：background-clip: border-box | padding-box | content-box | text ;
链接：https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-clip
3. 轮廓outline:看起来像边框，是在边框之外外边距之内的一条线，不占据空间，不会修改盒子的大小

### 8.【Problem】滚动穿透问题：弹出蒙层时使底层页面不动
####问题：overflow：hidden在移动端无效 &&  设置position:fixed时总是回到页面顶端 && offsetTop有风险，设置元素到页面顶端的距离scrollTop未生效
####背景：开发一个sdk，嵌入到在webview的h5页面里，在弹出提示框蒙层之后，滚动蒙层时希望底层的body不动。设置样式
```
overflow:hidden
```
未解决(在chrome里调试时生效，在手机上运行时无效)，尝试将body设置为
```
overflow:hidden;
position:fixed;
```
 此时页面不再滚动，但是会回到页顶部,即scrollTop归为0。
 于是尝试给body设置一个top，值等于当前页面的距离页面顶端的距离，首先尝试设置ele.style.top/ele.offsetTop,在一部分页面中正常表现，追查原因，原来style.top和offsetTop都是元素距离最近一层的position属性，不是对static的父元素的上偏移量，所以sdk的代码嵌入在不同结构的html时会导致表现不同；
 接着尝试了
 
```
var top = ele.getBoundingClientRect().top; //获取距离视窗顶部的距离
document.body.scrollTop = -top; //未生效

```

在chrome浏览器中document.body.scrollTop的值始终为0,在safari中可以查到非零值；原因是没有用兼容性写法

```
var top = document.body.scrollTop || document.documentElement.scrollTop;
//以后在使用scrollTop属性时都要注意下下兼容性；
```
####链接：https://blog.csdn.net/huang100qi/article/details/5950894
#### 注意：scrollTop的结果是数值型，默认使用像素作单位,设置值的时候不要带单位

### 9.【Tip】访问远程静态资源的缓存问题
####背景：把html/css/js放在CDN上(使用的是oss浏览器)，远程调用时，文件名不变，内容更新，返回内容不能及时变更，缓存了静态资源
####解决：请求资源时，将资源的url添加一个后缀就可以完美####解决
```
css.href = "https://****.com/src/index.css" + '?v=' + parseInt(Math.random() * 10000);
```
### 10.【Problem】在css使用calc()函数没有生效
####解决：calc(expression) 里的加减乘除运算符前后需要留出空格
```
width: calc(100%+100px); //不生效
width: calc(100% + 100px); //生效
```

### 11.【Problem】（在微信环境中）(仅ios端有问题) H5页面里有input,输入后收起keyboard,页面被顶起，留下空白
####解决：在input失去焦点时使页面的滚动效果归零
```
var inputPhone = document.getElementsByClassName('phone_input')[0];
    inputPhone.addEventListener('blur', function () {
        window.scroll(0, 0);
        window.scrollTo(0, 0);
    })
```

### 12.【Tip】H5页面开发后，无法实时的在手机上看效果，调试deeplink等
```
### 使用 BrowserSync

## 安装

npm install -g browser-sync

## (在项目根目录)启动 BrowserSync

browser-sync start --server --files "**/\*.css, **/_.html, \*\*/_.js"

## 启动后，将 `${External}/页面地址` 放到连着同一 Wifi 的 iPhone 浏览器上，就可以打开页面了。
```
### 13.【Tip】创建一个对象，其属性值按照排序双向绑定。例如 Color[0]==='red'; Color['red']===0;
```
// 原理: =赋值运算的返回值总是这个值
// 应用：Typescript的枚举类型
var Color;
(function (Color) {
  Color[Color["Red"] = 0] = "Red";
  Color[Color["Green"] = 1] = "Green";
  Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
```

### 14.【Problem】当本地文件访问一些http,提示跨域问题，origin为null，是浏览器的跨域限制
#### 解决：
####1. 建立本地跨域文件夹
#####这个文件夹是浏览器打开时候进行设置一些基本文件，因为需要关闭浏览器的安全策略。
我的电脑名称是dl
命令：cd /Users/dl/Documents/ 然后建立个文件夹：命令是mkdir MyChromeDevUserData
####2. 打开浏览器增加参数
##### 终端执行命令：
```
open -n /Applications/Google\ Chrome.app/ --args --disable-web-security --user-data-dir=/Users/dl/Documents/MyChromeDevUserData
```
执行后，会打开一个新的浏览器窗口，顶部提示：`您使用的是不受支持的命令行标记：--disable-web-security.稳定性和安全性会有所下降`
要在新打开的窗口里调试才没有跨域问题，用原来的窗口还是跨域受限
####原文：https://segmentfault.com/a/1190000012807882



