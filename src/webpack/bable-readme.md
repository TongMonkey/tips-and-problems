### babel 是什么
#### 
babel是静态转换编译器，将同一语言的高阶规则转化为低阶规则，如果是语言新特性中新增了某些对象或某些对象新增了原型方法，这些babel本身无法解决，需要引入polyfill。

### 安装
1. 核心包 
   1. @babel-core 核心库
   2. @babel-cli 支持命令行的库
   3. @babel/preset-env 预设包 包含了ES6转译ES5功能 
   4. @babel/preset-react 转译react中jsx语法的包
   5. @babel/plugin-transform-runtime 解决转译中的两个问题
      1. 背景：Es6与Es5的转化有两个方向，一个是类似于 let const 这样的新syntax语法；一个是类似 Array.prototype.includes 这样的新API. 默认@babel/preset-env可以转译语法，默认不转译API。需要把preset-env包的设置项 useBuildIns修改一下才可以：
         1. useBuildIns: false 默认 不会转译API
         2. useBuildIns: entry 会把转译API的所有polyfill 都下载，使项目特别大
         3. (推荐方案)useBuildIns: usage 仅仅下载需要转译的API的polyfill。并且这样也不用手动引入 @babel/polyfill了。 
      2. 问题1，转译syntax语法问题：当babel转译语法时，需要一些辅助函数来帮忙，比如class就会用一个叫_classCallCheck的函数来辅助转化，把这一类辅助转译的统称为helper函数。如果一个项目里有100个文件里用了新syntax，最终打包后的包中就有100处helper函数，它们功能和代码都一模一样，这很不合理
         1. @babel/plugin-transform-runtime 作用：从原来直接修改原型的做法，变为 从一个统一的模块引入，避免全局污染
      3. 问题2，转译API方法问题：babel引入polyfill的机制是，用require()来引入第三方代码后，如果是某类的静态代码，就直接在该类上添加方法；如果是某类的实例代码，就在该类的prototype上添加。所以如果引入了多个第三方库，或者自己开发第三方库，就会都去修改全局变量、全局原型变量，很有可能冲突，这很不合理。
         1. @babel/plugin-transform-runtime 作用：helpers都放在统一的模块中引入，使多个地方都用同一个helper函数，最终打包的结果里每个helper只存在一个


### babel.config.js 和.babelrc 有什么区别，应该在什么场景使用，同时使用的话会出现什么现象
1. 定义
   1. babel.config.js 是项目级配置，相当于一份全局配置
   2. .babelrc 是文件(夹)级配置，相当于一份局部配置。根据局部配置与目标文件的位置关系，决定是否要从目标文件向上寻找局部配置。
2. 同时有两种配置：
   1. 判断.babelrc所在的文件层级，某文件是否在该范围内。在的话，该文件就在该.labelrc的生效范围内。从文件的角度理解，从该文件往上层找，找到的‘最近’的一个.babelrc，它跟全局配置babel.config.js一起合并的配置结果作为新配置；(这里说的某层级是指项目源码文件目录，有的文档里也会把当前目录称为当前项目)
   2. 如果要打包的文件一路向上查找，都不在任何.babelrc的层级范围内，那就忽略该.babelrc，只去应用全局配置babel.config.js
3. 总结：当在某一个路径下执行babel命令，babel 会在当前执行目录搜索 babel.config.js, 若有则读取并作为全局配置，若无则全局配置为空。然后在转换一个具体的js文件时会去判断，如果这个文件在当前执行目录外面，则只应用全局配置。如果这个文件在当前执行路径内，则会去基于这个文件向上搜索最近的一个 .babelrc ，将其与全局配置合并作为转换这个文件的配置

### Babel 是什么实现原理
#### babel的执行流程，记住三步走： 解析parse——转换transform——生成generate
1. 解析步骤接收代码并输出AST：它使用一个解析器对源码进行词法分析和语法分析。 词法分析将字符串形式的代码转换为一个语法片段数组 Tokens, 单独的一个Token是不可分割的最小单元。语法分析阶段把 Tokens 输出成 AST 形式，过程中用到了 @babel/parser 语法分析器（之前叫@babel/babylon） 和 @babel/template （官方解释为：generate an AST from a string template. 将字符串形式的代码生成AST）, 
2. 转换步骤接收AST并对其进行遍历，对节点进行增、删、更新：根据配置的各种转化规则(plugins) 将AST 变成最终的结构，使用了@babel/traverse, 官方解释为：The Bable Traverse module contains the overall tree state, and is responsible for replacing、removing、adding nodes. 负责AST所有节点的增删改, 也可以用到@babel-types是一个AST工具库合集，
3. 将AST转化为js代码，使用了@babel/generator 深度遍历整个AST树，同时创建源码映射文件(Source-maps)


### Polyfill VS runtime:  
#### 有几点区别：
1. polyfill是全部引入， runtime是以库的形式按需引入
2. polyfill 要确保在代码入口处导入，而runtime没有这个限制
3. polyfill模式下的代码，实例对象的方法都会生效，而runtime下的实例对象如果如果该原型链上新增了方法，该方法不会生效
   
### babel-polyfill 是什么
babel-polyfill是对Es6+所有特性的全部集合的引入，全部添加到全局环境， 例如 require(‘core-js/libarary/fn/set’)，如果引用的话，需要在代码入口处导入，保证在其他代码执行前先被调用。当项目中有一些第三方包，引入babel-polyfill可能会引起全局污染制造一些冲突，此时就可以按需引入了，就是runtime，运行时的包， 以库的形式引入 例如内部实现var Set = require(‘core-js/libarary/fn/set’)...再使用Set， 不会污染环境，但是有个缺点：如果新特性是某对象的原型链上新增了API, 那么有一个实例，实例的新特性的api方法可能无法工作，因为不像是polyfill在入口处就修改了对象，runtime是在执行时替换了语法，没有在该实例的原型链上添加该方法。


### Transform-runtime VS babel-runtime:  
#### transform-runtime依赖babel-runtime，但我们一般不会直接引用babel-runtime, 而是使用transform-runtime
#### Transform-runtime主要做三件事：
1. 替代ES6+新语法：把代码中的使用到的ES6引入的新原生对象和静态方法用babel-runtime/core-js导出的对象和方法替代。
2. 替代Es6+的generator函数：当使用generators或async函数时，用babel-runtime/regenerator导出的函数取代。
3. 改写把Babel生成的辅助函数： 改为用babel-runtime/helpers导出的函数来替代（babel默认会在每个文件顶部放置所需要的辅助函数，如果文件多的话，这些辅助函数就在每个文件中都重复了，通过引用babel-runtime/helpers就可以统一起来，减少代码体积）。
由此可见，core-js包是核心，可以粗略理解为polyfill和runtime 都是对 regenerator和core-js两个部分的再封装，

### babel 配置中plugin VS preset：
#### 定义不同：
plugin是js片段，是转换规则； preset是提前预设好的一组plugins。 
#### 优先级/执行顺序：
1. 先插件再预设 
2. 插件是顺序执行【A，B】先执行A再执行B
3. 预设是倒序执行【A，B】先执行B再执行A。



### babel的核心原理 得看源码 比如 core.js