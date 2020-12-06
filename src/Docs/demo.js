function f() {
	console.log("I am outside!");
}
(
    function () { 
        if (false) {
            // 重复声明函数f
            function f() {
                console.log("I am inside!");
            }
        }
        f();
    }
)();
// TypeError: f is not a function

if (false) { 
    var a = 1;
}
// a undefined
if (true) { 
    var b = 1;
}
// b 1

if (false) { 
    let c = 2;
}
// ReferenceError: c is not defined
if (true) { 
    let d = 2;
}
// ReferenceError: d is not defined

// let定义的变量 在块级作用域外访问不到
// Es6规定 在块级作用域之中，函数声明的行为类似于let，在块级作用域外不可访问
if (true) {
    function fn() { 
        console.log('I am Fn');
    }
}
// 此时的fn是什么？
// 猜测结果：跟用let 定义一样，fn is not defined 
// 事实结果：跟用var 定义一样，fn fn(){...}
// 猜测：块级作用域内，对 声明变量 和 声明函数 的实现方式似乎不同


/** 原因
 * 理论：Es5规定，函数智能在顶层作用域和函数作用域之中声明，不能在块级作用域中声明 例如 if(true){function f(){}} 或 try{function f(){}}catch(e){}
 * 现实：浏览器并没有遵守规定，为了兼容旧代码，还是支持在块级作用域之中声明函数，上面两个例子并不会报错
 * 发展：Es6规定 在块级作用域之中，函数声明的行为类似于let，在块级作用域外不可访问，但如此对老代码不兼容，为了减轻这个问题，在附录中规定，浏览器的实现可以不遵守这个规则，而有自己的实现。
 *      如下：
 *      1. 允许在块级作用域内声明函数
 *      2. 函数声明类似于var,即会提升到全剧作用域或函数作用域的头部
 *      3. 同时，函数声明还会提升到所在的块级作用域的头部
 *      注意： 上面3条规则支队ES6的浏览器实现有效，其他环境仍将块级作用域的函数声明当作let声明处理
 * 结论：根据这3条规则，在浏览器的Es6环境中，块级作用域内声明函数的行为类似于var声明变量。。。（var声明变量划重点，不是var声明的函数表达式，而是var声明变量）
 * 建议：考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式的形式，而不是函数声明语句。
 */

// 对比示例
// 在Es5环境下变为
function f() {
	console.log("I am outside!");
}
(function () {
	function f() {
		console.log("I am inside!");
	}
	if (false) {
		
	}
	f();
})();
// 在Es6环境下变为
function f() {
	console.log("I am outside!");
}
(function () {
    var f = undefined; 
	if (false) {
		function f() {
			console.log("I am inside!");
		}
	}
	f();
})();

//  结论示例：
console.log(f);
if (true) { 
    function f() { 
        console.log('结果是undefined即可证明结论正确')
    }
}

// 建议示例
{ 
    let a = 1;
    let fff = function () { 
        console.log('I am fff');
    }
}
// a is not defined
// fff is not defined


