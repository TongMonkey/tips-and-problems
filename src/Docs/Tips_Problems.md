# 前段开发过程中遇到的 Tips 和 Problems

###1.【Tip】无返回数据的 http 请求

#### 背景描述：触发点击事件时，发送某请求 http://$%^.$%^?a=_&b=_ 通知后台，不需要返回数据

#### Tip：用访问图片的方式自动请求 代替写 ajax get 请求

```
var img = new Image();
img.src=' http://...'

```

### 2.【Problem】document.write()带来的问题

####背景描述：document.write 最简单的理解就是：打印输出，在页面中输出 write()括号内的东西。在 JS 中 document 是 DOM 树最顶端的对象，也就是说是在 body 里打印括号里的东西。调用浏览器 DOM 中 document 对象的 write 方法，将一段 HTML 代码或是一段文本内容输出到文档,以使浏览器可以动态处理。要在页面中渲染完成后动态的插入一段 script 代码，使用 document.write('<script>...</script>')；结果页面原本的内容都不见了，只有<script>...</script> ####原因：在已经渲染完的页面也就是执行过 load 事件的页面里，调用 document.write()会自动调用 docuement.open()打开一个文档流，清空该文档的内容！然后写入数据，写完再调用 document.close(),以告诉浏览器页面已经加载完毕。写入的数据会被解析到文档结构模型里。在上面的例子里，元素 h1 会成为文档中的一个节点。此时页面上就只剩下'<script>...</script>'这一段了。

#### 特殊：如果 document.write()调用发生在`<script>`标签中，那么它将不会自动调用 document.open()。

#### 解决：使用 dom 的 api，操作元素。

#### 链接：https://developer.mozilla.org/zh-CN/docs/Web/API/Document/write

```
var scri = document.createElement('script');
document.getElementByTagName('head')[0].appendChild(scri);

```

### 3.【Tip】Js 节流

#### 背景描述：页面下滑，间断加载图片，每个图片展示在视窗内就触发一次展示报告事件

#### 做法：在 window.onscroll 事件中，for 循环图片 dom 元素，其距离视窗顶部高度低于视窗本身高度时，触发报告事件

#### 问题：onscroll+for 导致一直在触发 for 里的代码块

#### 解决：通过定时器实现 js 截流

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

### 4.【Problem】在页面上引入一个 scirpt,要是用脚本里的方法，直接使用 funName();不生效提示 funName is undefined.

#### 解决：在 script 脚本中定义该方法时不能直接 function funName(){...} 而是 window.funName = function(){}

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

#### 背景描述：查看当前元素的样式，通过 ele.style.\*只能查到当前元素的行内样式，无法查看类样式等所有样式

#### 解决: 获取元素的样式对象，从对象中取出对应的样式值

```
var ele = document.getElementsByClassName('article')[0];
var style = getComputedStyle(ele);
console.log(style);
var br = style.getPropertyValue('font-size'); //结果是带单位的‘18px’
```

### 7.【Problem】设置边距后，改变了原本的宽高

#### 背景描述：弹出一个提示框，固定大小为 300px*185px,但设置 8px 的边距后，提示框被撑大为 316px*201px

#### 原因：所有只讲内边距不讲盒模型的教程都是耍流氓！盒模型定义：每个元素被表示称一个矩形的方框；默认情况下，一个元素的宽和高指的是 content 也就是内容的宽高，此时盒模型 box-sizing 的值是默认值：content-box;所以设置的 padding 和 border 会在现有的 content 的宽高基础上再累加；如果要固定宽高，就要设置 box-sizing:border-box;表示先添加 border,padding,最后 content，保证父元素不会被撑大；这两种模式也被称作正常盒模型(content-box)和怪异盒模型()

#### 链接：https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Styling_boxes/Box_model_recap

#### 相关：

1. 外边距塌陷问题：当两个盒子挨在一起时，二者之间的距离为两个挨着的外边距中最大的那个值，而不是二者的和。
2. 背景图片的边界问题：background-clip: border-box | padding-box | content-box | text ;
   链接：https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-clip
3. 轮廓 outline:看起来像边框，是在边框之外外边距之内的一条线，不占据空间，不会修改盒子的大小

### 8.【Problem】滚动穿透问题：弹出蒙层时使底层页面不动

####问题：overflow：hidden 在移动端无效 && 设置 position:fixed 时总是回到页面顶端 && offsetTop 有风险，设置元素到页面顶端的距离 scrollTop 未生效 ####背景：开发一个 sdk，嵌入到在 webview 的 h5 页面里，在弹出提示框蒙层之后，滚动蒙层时希望底层的 body 不动。设置样式

```
overflow:hidden
```

未解决(在 chrome 里调试时生效，在手机上运行时无效)，尝试将 body 设置为

```
overflow:hidden;
position:fixed;
```

此时页面不再滚动，但是会回到页顶部,即 scrollTop 归为 0。
于是尝试给 body 设置一个 top，值等于当前页面的距离页面顶端的距离，首先尝试设置 ele.style.top/ele.offsetTop,在一部分页面中正常表现，追查原因，原来 style.top 和 offsetTop 都是元素距离最近一层的 position 属性，不是对 static 的父元素的上偏移量，所以 sdk 的代码嵌入在不同结构的 html 时会导致表现不同；
接着尝试了

```
var top = ele.getBoundingClientRect().top; //获取距离视窗顶部的距离
document.body.scrollTop = -top; //未生效

```

在 chrome 浏览器中 document.body.scrollTop 的值始终为 0,在 safari 中可以查到非零值；原因是没有用兼容性写法

```
var top = document.body.scrollTop || document.documentElement.scrollTop;
//以后在使用scrollTop属性时都要注意下下兼容性；
```

####链接：https://blog.csdn.net/huang100qi/article/details/5950894

#### 注意：scrollTop 的结果是数值型，默认使用像素作单位,设置值的时候不要带单位

### 9.【Tip】访问远程静态资源的缓存问题

####背景：把 html/css/js 放在 CDN 上(使用的是 oss 浏览器)，远程调用时，文件名不变，内容更新，返回内容不能及时变更，缓存了静态资源 ####解决：请求资源时，将资源的 url 添加一个后缀就可以完美####解决

```
css.href = "https://****.com/src/index.css" + '?v=' + parseInt(Math.random() * 10000);
```

### 10.【Problem】在 css 使用 calc()函数没有生效

####解决：calc(expression) 里的加减乘除运算符前后需要留出空格

```
width: calc(100%+100px); //不生效
width: calc(100% + 100px); //生效
```

### 11.【Problem】（在微信环境中）(仅 ios 端有问题) H5 页面里有 input,输入后收起 keyboard,页面被顶起，留下空白

####解决：在 input 失去焦点时使页面的滚动效果归零

```
var inputPhone = document.getElementsByClassName('phone_input')[0];
    inputPhone.addEventListener('blur', function () {
        window.scroll(0, 0);
        window.scrollTo(0, 0);
    })
```

### 12.【Tip】H5 页面开发后，无法实时的在手机上看效果，调试 deeplink 等

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

### 14.【Problem】当本地文件访问一些 http,提示跨域问题，origin 为 null，是浏览器的跨域限制

#### 解决：

####1. 建立本地跨域文件夹 #####这个文件夹是浏览器打开时候进行设置一些基本文件，因为需要关闭浏览器的安全策略。
我的电脑名称是 dl
命令：cd /Users/dl/Documents/ 然后建立个文件夹：命令是 mkdir MyChromeDevUserData
####2. 打开浏览器增加参数

##### 终端执行命令：

```
open -n /Applications/Google\ Chrome.app/ --args --disable-web-security --user-data-dir=/Users/dl/Documents/MyChromeDevUserData
```

执行后，会打开一个新的浏览器窗口，顶部提示：`您使用的是不受支持的命令行标记：--disable-web-security.稳定性和安全性会有所下降`
要在新打开的窗口里调试才没有跨域问题，用原来的窗口还是跨域受限 ####原文：https://segmentfault.com/a/1190000012807882

### 15.【Tip】判断某对象 Obj 是否有某 x 属性/某属性 x 是否是某对象 Obj 的属性

```
// 4种方法
1. Obj.x !== undefined
2. x in Obj  // Obj如果不是对象会报错
3. Reflect.has(obj,x)  // Obj如果不是对象会报错
4. Obj.hasOwnProperty(x)
```

### 16. [Tip] forEach 循环中，无法使用 return 完全跳出

#### 解决： 在 for 循环中使用 return 可以直接跳出循环，使用 continue 可以跳出当前循环的剩余代码，直接进入下一次循环；在 forEach 中，使用 return 的结果跟 for 循环中的 continue 是一样的，跳出当前循环，而不能跳出整个循环，

#### 跳出整个循环可以用 try-catch 实现

```
try{
  Array.forEach(item=>{
    ...
    throw Error('这样跳出循环');
  })
}catch(e){
  ...
}
```

### 17. [Tip]判断所处环境

```
  function isAndroid() {
      return 0 <= navigator.userAgent.toLowerCase().indexOf("android")
  }
  function isIos() {
      return 0 <= navigator.userAgent.toLowerCase().indexOf("iphone")
  }
  function isInWb() {
      return 0 <= navigator.userAgent.toLowerCase().indexOf("weibo")
  }
  function isInWX() {
      return 0 <= navigator.userAgent.toLowerCase().indexOf("micromessenger")
  }
  function isInBdmini() {
      return 0 <= navigator.userAgent.toLowerCase().indexOf("swan-baiduboxapp")
  }
  function isInQQ() {
      return 0 <= navigator.userAgent.toLowerCase().replace("mqqbrowser", "").indexOf("qq")
  }
  function isInSafari() {
      return isIos() && !!window.ApplePaySession
  }
```

### 18.【Tip】将字符串复制到剪贴板

```
const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selected =
    document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};
// Example
copyToClipboard('Lorem ipsum'); 

```

### 19.【Tip】在微信浏览器打开app store地址
#### 背景：比如你页面写 <a href=”http://itunes.apple.com/us/app/id399608199″>download</a> ，在微信浏览器点击链接是没有反应的，但是如果是其他的链接地址，比如百度那就没有问题
#### 分析：在微信官方后台编辑图文，把原文链接写为：http://itunes.apple.com/us/app/id399608199 ，那就可以打开了，发现微信页面的“查看原文”是一个function，如下

```
function viewSource() {
	var redirectUrl =
		sourceurl.indexOf("://") < 0 ? "http://" + sourceurl : sourceurl;
	//redirectUrl = http://itunes.apple.com/us/app/id399608199
	redirectUrl =
		"http://" +
		location.host +
		"/mp/redirect?url=" +
		encodeURIComponent(sourceurl);
	//此处是关键，redirectUrl = http://mp.weixin.qq.com/mp/redirect?url=http%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fid399608199%23rd
	var opt = {
		url:
			"/mp/advertisement_report" +
			location.search +
			"&report_type=3&action_type=0&url=" +
			encodeURIComponent(sourceurl) +
			"&uin=" +
			uin +
			"&key=" +
			key +
			"&__biz=" +
			biz +
			"&r=" +
			Math.random(),
		type: "GET",
		async: !1,
	};
	return (
		tid
			? (opt.success = function (res) {
					try {
						res = eval("(" + res + ")");
					} catch (e) {
						res = {};
					}
					res && res.ret == 0 ? (location.href = redirectUrl) : viewSource();
			  })
			: ((opt.timeout = 2000),
			  (opt.complete = function () {
					location.href = redirectUrl;
			  })),
		ajax(opt),
		!1
	);
}

```

#### 说明：真正的url是：http://mp.weixin.qq.com/mp/redirect?url=http%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fid399608199%23rd
看来微信允许打开mp.weixin.qq.com这个host下的网页，然后用js再打开真正的页面。
现在简单了，将页面的代码写为：<a href=”http://mp.weixin.qq.com/mp/redirect?url=http%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fid399608199%23rd”>download</a>，在微信浏览器内可以打开app store的地址了。

### 20.H5 吊起deeplink 未安装则跳转安装
```
var n = 1800;
let timeStamp = + (new Date());
let stopTimeouter = setTimeout(function () {
	let res =  + (new Date()) - timeStamp;
	document.write(res);
	res < n + 300 && (window.location.href = downloadLink);
}, n);
window.onpagehide = function () {
	document.write('onpagehide');
	clearTimeout(stopTimeouter);
};
document.addEventListener("visibilitychange", function () {
	document.write('visibilitychange');
	(document.hidden || document.webkitHidden) && clearTimeout(stopTimeouter);
}, false);

```

### 21.自定义一个数组反转方法
```
let reverse = function(nums, start, end){
    while(start < end){
        [nums[start++], nums[end--]] = [nums[end], nums[start]];
    }
}
```

### 22.两个变量连续进行三次异或运算，可以互相交换值。
#### 假设两个变量是x和y，各自的值是a和b。下面就是x和y进行三次异或运算，注释部分是每次运算后两个变量的值。
```
x = x ^ y // (a ^ b, b)
y = x ^ y // (a ^ b, a ^ b ^ b) => (a ^ b, a)
x = x ^ y // (a ^ b ^ a, a) => (b, a)
```
#### 这是两个变量交换值的最快方法，不需要任何额外的空间。

### 23.React 函数组件与类组件的区别
`https://overreacted.io/zh-hans/how-are-function-components-different-from-classes/`
