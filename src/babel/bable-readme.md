### babel 是什么
#### 
babel是静态转换编译器，将同一语言的高阶规则转化为低阶规则，如果是语言新特性中新增了某些对象或某些对象新增了原型方法，这些babel本身无法解决，需要引入polyfill。

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

### babel.config.js 和.babelrc 有什么区别，应该在什么场景使用，同时使用的话会出现什么现象
1. 定义
   1. babel.config.js 是项目级配置，相当于一份全局配置
   2. .babelrc 是文件(夹)级配置，相当于一份局部配置。根据局部配置与目标文件的位置关系，决定是否要从目标文件向上寻找局部配置。
2. 同时有两种配置：
   1. 当.babelrc在某层级内，判断某文件是否在该层级内。在的话，该文件就在该.labelrc的生效范围内。就从文件往上层找，找到的‘最近’的一个.babelrc，将它跟全局配置babel.config.js一起合并作为新配置；(这里说的某层级是指项目文件目录，有的文档里也会把当前目录称为当前项目)
   2. 如果.babel所在的层级内，要打包的文件并不在该层级内，那就忽略.babelrc，只去应用全局配置babel.config.js
3. 总结：babel 会在当前执行目录搜索 babel.config.js, 若有则读取并作为全局配置，若无则全局配置为空。然后在转换一个具体的js文件时会去判断，如果这个文件在当前执行目录外面，则只应用全局配置。如果这个文件在当前执行路径内，则会去基于这个文件向上搜索最近的一个 .babelrc ，将其与全局配置合并作为转换这个文件的配置

### babel的核心原理 得看源码 比如 core.js