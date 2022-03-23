## Webpack

### webpack是什么
1. webpack是一个js应用程序静态模块打包工具。会从应用内部一个或多个入口点构建一个依赖图(dependency grarph),然后将项目中夺得每个模块合成一个或多个bundles.
2. Es6中的 import 和 export 已经被webpack^4.0天然支持, 其余语法特性需要类似于Bable这种转译器先转译成es5


### webpack命令行 与 npm包
1. webpack
   1. 在命令行中执行 webpack index.js 实际上是做了什么？
      1. npm 会让命令行工具查找webpack的命令脚本。 如果webpack是在全局安装的，将会进入 user_local/.bin里找。如果是在项目中安装的webpack，就进入 当前项目/node_modules/.bin目录下查找是否存在webpack.sh(mac系统) 或者 webpack.cmd(window系统) 文件。如果存在就执行，不存在就抛出错误。 
      2. 找到node_modules/webpack包后，查看到package.json里 “bin”属性引用的地址是“./bin/webpack.js”，
      3. 所以最终可以在这个路径下找到webpack: node_modules/webpack/bin/webpack.js
   2. eslint ./src && webpack 是做了什么？ (srcipts:{"build":"eslint ./src && webpack"})
      1. 先对 src 文件夹下所有代码用eslint校验
      2. 然后再执行 webpack index.js 操作。因为默认入口文件就是 index.js, 所以可以省略直接写 webpack
2. npm 包 Node Package Manager
   1. 版本号：
      1. ^1.*.*: ^表示 除了第一位的主版本号，后面中、小 两位版本号都查找最新版本的安装
      2. ～1.1.* ～表示 除了前两位，后面最后一位 小版本号 查找最新的版本安装
      3. 1.1.0 没有任何前缀的版本号，表示安装特定版本号
   2. npm install 的过程
      1. 查找当前项目中的 package.json 版本信息文件
      2. 在package.json中，查找依赖项 有 dependencies 和 devDependencies 两个部分
      3. 如果发现了新包，就下载并更新package.json
   3. 痛点：
      1. 需要安装能匹配其他模块的版本
      2. ？





### webpack打包流程是什么
#### 大方向分为：初始化、编译、输出文件
1. 前提：先找到项目的package.json文件下载好各个依赖的npm包
2. 初始化
   1. 初始化参数： 从配置文件webpack.config.js(默认)+Shell语句中读取并合并参数，得到最终的参数
   ```
   // 通过npm脚本语句执行打包，先查找webpack工具 进入node_module\.bin中找webpack.sh或webpack.cmd文件，如果存在就执行，不存在就抛出错误
   npm run dev //开发环境
   npm run build //生产环境
   //直接运行webpack 从入口文件entry开始打包到bundle.js输出；webpack打包的实际位置是node_modules\webpack\bin\webpack.js
   webpack entry.js bundle.js 
   //读取系统文件文件
   //读取Entrys 为每个Entry实例化一个EntryPlugin，为后续该Entry的递归工作做准备
   //读取Resolver
   // ...等
   ```
   1. 初始化编译实例：通过初始化得到的参数，初始化一个Compiler。
   ```
   // Compiler负责文件监听和启动编译。Compiler 实例中包含了完整的 Webpack 配置，全局只有一个Compiler实例
   let globalSingleCompiler = new Compiler(configs);
   ```
   1. 初始化系统文件读取：应用文件系统到compiler对象，方便后续文件查找和读取
   2. 初始化所有Plugin:plugin本质是类，有一个apply方法。
   ```
   // 依次调用插件的apply方法，将事件钩子挂在到compiler对象上，让插件可以监听后续的所有事件节点。
   // 给插件传入compiler的实例引用，方便插件通过compiler调用webpack提供的api
   Plugins.each(Plugin=>{
       let plugin = new Plugin();
       plugin.apply(globalSingleCompiler);
   })
   ```
   1. 初始化Resolver，负责在文件系统中寻找指定路径的文件。
3. 编译：
   1. 启动编译：
   ```
   globalSingleCompiler.run(); //启动一次新的编译 globalSingleCompiler.watchRun(); //在监听模式下启动的编译，在这个事件中可以获取是那些文件发生了变化导致了重新启动了
   compile(); //告诉插件一次新的编译要启动了，同时给插件带上compiler对象
   let compilation = new Compilation(); // 创建一个编译阶段对象，一个compilation包含了下面2、3、4的步骤。开发模式下，每当检测到文件变化，就会创建一个新的compilation。包含了当前的模块资源、编译生成资源、变化的文件等信息
   ```
   1. 找到entry:当一个compilation创建完，先找到入口文件，再根据依赖关系找到整个依赖模块图关系。找entry:去配置文件webpack.config.js里找entry属性配置的地址，如果没有，默认是index.js
   2. 调动loader翻译：对每个module串行调用配置的所有loader翻译文件内容。在loader翻译完一个module后，将翻译后的内容进行解析(Babel中用的是@babel/parser)，输出对应的抽象语法书AST, 以便webpack后面对代码进行分析。
   3. 递归: 从配置的入口模块开始，分析其AST，当遇到导入语句导入了新的module，就将其加入依赖列表，同时对新找到的module翻译并递归(即重复3.4.步骤)，最终所有module都用loader翻译完成，并找到所有模块的依赖关系。
4. 输出文件
   1. 合成chunk:根据入口文件和文件之间的依赖关系，相关模块会组装成chunk, 最终输出多个chunk
   2. 一个chunk就是一个文件：把每个chunk转换成一个单独的文件加入到输出列表。这步是可以修改输出内容的最后一个机会。
   3. 输出完成:根据配置文件output设置，输出到文件系统对应路径下
5. 整个过程中：Webpack会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，插件可以调用Webpack提供的API



### 模块打包原理
#### 官网例子:实时创建一个简单打包工具`https://www.youtube.com/watch?v=Gc9-7PBqOC8` 简单工具的详细说明`https://github.com/ronami/minipack`


### webpack打包后都会产生什么
1. 打包后的结果代码，是一个自执行函数
   ```
   // 基础版打包-大概逻辑：
   // 前提：入口文件为模块1, 在模块1中import了模块2 忽略了检查模块缓存优化的部分
   function chunkA(){
      // 根据文件依赖关系，将各个文件存储在文件集合对象中
      var _webpack_modules_ = {
         "模块ID1": function(__unused_webpack_module, __webpack_exports__, __webpack_require__){
            var code1 = "
               ```
               var code2 = __webpack_require__("模块ID2"); //对应源代码中的import  有依赖关系的代码之间会迭代执行
               "执行模块1的代码块";
               "调用模块2的代码code";
               ```
            ";
            eval(code1);
         },
         "模块ID2": function(__unused_webpack_module, __webpack_exports__, __webpack_require__){
            var code2 = "代码块";
            eval(code2);
         }
      }
      // 入参是入口模块对应在 _webpack_modules_对象中的Id, 由于模块间有依赖关系，所以这里只需要调用一次入口文件即可，
      function __webpack_require__(moduleId){  
         function o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
         function r = (exports) => {
            if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
               Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
            }
            Object.defineProperty(exports, "__esModule", { value: true });
         }
         function d = (exports, definition) => {
            for (var key in definition) {
               if (
                  o(definition, key) && !o(exports, key)
               ) {
                  Object.defineProperty(exports, key, {
                     enumerable: true,
                     get: definition[key],
                  });
               }
            }
         }
      }
      __webpack_require__("模块ID1"); //模块1为入口文件
   }();
   ```

### Loader是什么
1. 前提：webpack默认只支持.js和.json两种文件类型，其他类型的都无法处理
2. loader是翻译器，将不支持的其他文件类型，转化为webpack可以处理的模块，在weboack读取后，添加到依赖关系图中
3. 本质：loader是一个函数，入参是源文件，返回转换后的结果
4. 常用Loader有什么：
   1. babel-loader 使webpack中能运行babel的插件。用来转换ES6及更高版本或React等js特殊语法 使用babel的时候，需要搭配babel一起使用配置文件.babelrc或者babel.config.js文件
   2. css-loader 加载和解析css文件(less-loader)
   3. postcss-loader 跟autoprefixer结合使用补充css前缀
      ```
      rules:[{
         test: /.css$/,
         use:[
            'css-loader',
            {
               loader:'postcss-loader',
               options:{
                  plugins:()=>{
                     require('autoprefixer')({
                        browsers: [
                           'last 2 version', //兼容最新的两个版本
                           ‘iOS 7’
                           ]
                     })
                  }
               }
            }
         ]
      }]
      ```
   4. px2rem-loader 自动将px单位转化为rem 与lib-flexible开源库可以搭配使用(lib-flexible可以动态计算根元素的大小,通过HtmlWebpackExternalsPlugin插件引入第三方库)
      ```
      rules:[{
         test: /.css$/,
         use:[
            'css-loader',
            {
               loader:'px2rem-loader',
               options:{
                  remUnit: 75, // 配置1rem对应多少px
                  remPrecision: 2 //控制px转为rem后小数点后的精度
               }
            }
         ]
      }]
      ```
   5. file-loader 对图片、字体等的打包
   6. raw-loader 文件内联：把文件转化为字符串的形式插入到html中，可以减少http请求，减少页面闪动等   
   7. thread-loader 多进程打包
5. 自定义一个loader:
   1. demo: /tips-and-problems/src/webpack/custom_webpack/json-loader.js


### 资源内联
1. 定义：将js、css插入到html中，随着请求html时一起返回，不需要额外发起http请求, 有利于页面初始化，css内联也可以避免页面闪动
2. 小资源内联： url-loader
3. js内联：raw-loader
4. css内联：
   1. 方案1:借助style-loader
      ```
      module:{
         rules:[{
            test:/.css$/,
            use:[
               {
               'style-loader', //style-loader会将css代码插入到<style>标签并放进Html的头部，此时没有css独立文件
               options:{
                  insertAt:'top', // 样式插入到<head>
                  singleton: true, //将所有的style标签合并成一个
               }
               }
               'css-loader',
            ]
         }]
      }
      ```
   2. 方案2:html-inline-css-webpack-plugin 将打包好的css chunk代码插入到html中
   3. raw-loader
   

### Plugin是什么
1. 作用：插件plugin用来拓展webpack打包构建的能力。用户不需要但开发者需要的功能，一般就会封装成plugin使用。
2. Plugin的实现原理
   1. 通过注册事件、事件监听机制，在不同的位置都留有“钩子”,增强打包的功能。
   2. 基于Tapable库的注册机制. 原话大概是 tapable can expose Hook classes,and create hooks for plugins.
3. 调用顺序：正序调用
4. 用法：
   ```
   module.exports = {
      plugins:[
         new PluginName();
      ]
   }
   ```
5. 常用的plugin
   1. SplitChunksPlugin 将公共的代码抽取成单独的chunkhook.memoizedState
   2. CleanWebpackPlugin 清理构建目录 默认删除output配置对应的文件目录
   3. ExtractTextWebpackPlugin 将css代码从js文件里抽取成单独的.css文件
   4. autoprefixer插件 跟postcss-loader结合使用自动补齐css前缀
   5. CopyWebpackPlugin 将文件或者文件夹拷贝到构建的输出目录
   6. UglifyjsWebpackPlugin 压缩打包后的bundle.js的体积 
   7. HtmlWebpackPlugin 创建html模版文件用来承载输出bundle
   8. ZipWebpackPlugin 将打包的资源生成一个.zip包
   9. webpackBundleAnalyzer 打包资源分析器


### 编写Plugin


### Source map是什么
#### 
1. 作用：是一个.map后缀的信息文件，里面存储着代码的位置信息。转换后的代码的每个位置所对应的转换前的位置
2. 配置：在配置文件中的devtool
```
module.export = {  
   devtool:"..."
}
```
3. 配置关键词
```
eval: 使用eval包裹代码块
source map: 产生.map文件
cheap: 不包含列信息
inline: 将.map作为DataURI嵌入，不单独生成.map文件
module: 生成的是未经loader转译的源码的map文件
```

### 怎么代码压缩
1. HTML压缩：使用html-webpack-plugin
```
module.export = {
   plugins:[
      // 一个页面对应一个HtmlWebpackPlugin
      new HtmlWebpackPlugin({
         template: path.join(__dirname, 'src/index.html'), //打包用的html模版
         filename: 'index.html', //指定打包后的文件名称
         chunks: ['index'], //指定生成的html文件使用哪个chunk的js
         inject: true, //指定打包生成的chunk(js/css)是否自动注入到html
         minify: { //压缩的自定义配置项
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true, 
            removeComments: false
         }
      }),
      // 两个入口文件，两个Html，就要写两个Plugin
      new HtmlWebpackPlugin({
         template: path.join(__dirname, 'src/search.html'),
         filename: 'search.html',
         chunks: ['search'],
         inject: true,
         minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true, 
            removeComments: false
         }
      }),
   ]
}
```
2. CSS压缩：使用optimize-css-assets-webpack-plugin插件 + cssnano处理器
```
module.export = {
   plugins:[
      new OptinizeCSSAssetsPlugin({
         assetNameRegExp: /\.css$/g,
         cssProcessor: require('cssnano')
      })
   ]
}
```
3. JS压缩：在webpack4里内置了uglifyjs-webpack-plugin，自动压缩了js代码量压缩

### 多页面怎么打包
1. 方案1: 手动配置文件，每个entry对应一个html-webpack-plugin,缺点是每增/删一个entry就要多增/删一个plugin
2. 方案2: 是方案1的进阶，通过glob库动态计算有多少个entry，动态生成多个html-webpack-plugin的数组，添加在配置文件中

### 文件监听是什么
1. 定义文件监听是在发现源码发生变化时，自动重新构建出新的输出文件
2. 开启监听模式，有两种方法
   1. 启动webpack命令时，带上`--watch`参数
   2. 配置文件文件中设置`watch：true`
3. 缺陷：不会自动刷新浏览器，需要额外手动刷新
4. 文件监听构建出的代码存储位置：本地磁盘文件
5. 文件监听的原理是什么:webpack轮询判断文件的最后编辑时间是否变化
   1. webpack记录文件的编辑时间，轮询判断文件再次变化时，不会立刻告诉监听者，而是先缓存起来，等到aggregateTimeout集合等待时间结束，在此期间内，如果有别的文件也变化了，所有变化的文件列表再一起重新构建
   ```
   module.export = {
      watch: true,
      watchOptions:{
         ignored: /node_modules/, //默认为空，不监听包的变化可以使构建性能提升
         aggregateTimeout: 300, //默认的集合等待时间是300ms 即监听到文件变化后会等待300ms后再去构建
         poll: 1000, //默认的轮询时间是1000次/秒，即每毫秒询问一次判断文件是否发生变化
      }
   }
   ```

### webpack-dev-server 本底开发服务器 
1. 安装：npm install --save-dev weback-dev-server
2. 用处：开启一个本地服务做热更新，可以对文件的变化实时监听，然后重新打包。
3. 配置：在webpack.config.js里 设置 devServer属性，可以设置 port publicPath 等配置
   ```
   module.export = {
      devServer:{
         hot: true, //启用热更新 文件改变后 自动重新打包放在内存中，不产出打包文件
      }
   }
   ```
4. 注意：光是开启devServer 并不会产生新的打包文件，而是在内存中，开发者可以看到页面效果，无新文件
5. 包所在位置：./node_modules/.bin/webpack-dev-server.js

###  HMR(HotModuleReplacement)是什么
参考链接：https://zhuanlan.zhihu.com/p/30669007
1. 定义：HMR是热模块替换 用WDS(webpack-dev-server)启动HMR功能,之后就可以在不刷新页面的前提下更改页面效果
2. 做了什么：相比于文件watch监听模式不能刷新浏览器，热更新在检测到文件变化后，会自动构建并更新浏览器
3. 输出位置：WDS放在内存中,不用写入磁盘，所以有速度优势
4. 如何使用：有两种方式都可以
   1. 使用HotModuleReplacementPlugin插件，这样开启热更新有2个必要条件：使用HotModuleReplacementPlugin插件 + 设置devServer.hot为 true。注意在v4之后内置了HotModuleReplacementPlugin，看起来好像没使用，但其实是必须的。这种方式的热更新开启后，在浏览器页面就能够查看所有打包后的文件
      ```
      // package.json
      script: { 
         "dev": "webpack-dev-serve --open" // --open命令：每次构建完成后自动开启一个浏览器页面
      }
      // 通过命令行`npx webpack serve --hot`或者通过webpack.config.js
      module.export = {
         plugins:[
            // new webpack.HotModuleReplacementPlugin(), //设置了hot为true后，就不需要手动添加该插件了，在V4之后默认使用了
         ],
         devServer:{
            hot: true, //启用热更新
         }
      }
      ``` 
   2. 使用webpack-dev-middleware搭配使用将输出文件传输给服务器。使用这种方式，还需要额外使用Express或者Koa等Node服务器来提供一个本地服务。
5. 错误监控
   1. 开启热替换后，在生效范围内的任意文件中都可以监测错误
   ```
   if(module.hot){
      module.hot.accept(error=>{
         if(error) console.log("热替换出现错误",error);
      })
   }
   ```
   

### HMR热更新的原理/流程是什么
1. WDS中的参与角色
   1. Webpack Compiler: 在Webpack端运行，将源代码js编译成bundle.js输出文件,分别给到HMR Server和Bundle Server
   2. Bundle Server: 在Webpack端运行的服务器，提供浏览器对bundle.js输出文件的服务器方式的访问能力
   3. HMR Server:HMR Server是在WebpackDevServer服务器中运行的。当有文件更新，就将`热更新的输出文件`传输给HMR Runtime。
   4. HMR Runtime: HMR Runtime是在browser浏览器终端中运行的。在最初Webpack Compiler打包过程中就把HMR Runtime注入到bundle.js里，在浏览器端的bundle.js里负责与服务器建立连接并更新文件的变化, 当监听到HMR Server传来了消息(一般是json数据)就更新浏览器。
   5. bundle.js: 即在浏览器中被访问的构建后输出的文件，包含HMR Runtime + js code
2. 流程图：![HMR实现原理](../assets/HMR.png)
3. 参考：文档`https://webpack.docschina.org/concepts/hot-module-replacement/`
4. 流程描述： 
   1. 在热更新的过程中，有两个阵营，一边是webpack,一边是browser，中间维护一个WebSocket.
   2. webpack中，通过HotModuleReplacementPlugin或者webpack-dev-middleware的方式，开启一个devServer本地服务器. 里面有两个Server服务，分别是Bundle-Server和HMR-Server
   3. webpack中，通过Compiler将 源码 + HMR-Runtime 打包进bundle.js(HMR是可选功能，不是所有的文件都有HMR-Runtime，需要热替换的文件才注入，同样，有了HMR-Runtime才能支持热替换)
   4. browser中,访问bundle.js文件。在未开启WDS时，浏览器是直接访问文件 例如 ./user/document/bundle.js，有了热更新后，其实是开启了webpack端的Bundle-Server之后，就可以用访问服务器的方式访问文件了，例如localhost:8080/bundle.js;
   5. 在webpack中，当发生一次更新，compiler发出一个update给到HMR-Server，update包含两部分：1.更新后的manifest(新的打包hash和所有的updated-chunks更新模块清单) + 2.updated-chunks更新后的模块文件。compiler 会确保在这些构建之间的模块 ID 和 chunk ID 保持一致。（通常将这些 ID 存储在内存中 例如使用 webpack-dev-server 时，但是也可能会将它们存储在一个 JSON 文件中)。然后通过websocket通知给browser端。
   6. 在browser中，应用程序要求 HMR-Runtime 检查更新： HMR-Runtime中，会先check 即发送一个HTTP请求到HMR-Server请求更新manifest,如果请求失败说明没有可更新的；如果请求成功，HMR-Runtime会将 updated chunk 列表与当前的 loaded chunk 列表进行比较。
   7. 在browser中， HMR-Runtime异步下载更新：比较后将每个需要更新的chunk下载相应的 updated chunk。当所有更新 chunks 完成下载，HMR-Runtime 就会切换到 ready 状态，然后通知应用程序。
   8. 在browser中，应用程序要求HMR-Runtime 重新执行模块代码。HMR-Runtime 运行新的updated module, 将所有 updated module 标记为无效并不断冒泡把父module都标记为无效。之后所有无效 module 都会被处理和解除加载。然后更新当前 hash， HMR-Runtime 切换回 idle 状态，HMR-Runtime同步更新完成。

### 热更新遇到跨域问题怎么解决：
```
module.exports = {
  //本地服务器默认域名是http://localhost:8000
  devServer: {
   //代理
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {'^/api' : ''},
        changeOrigin: true,     // target是域名的话，需要这个参数，
        secure: false,          // 设置支持https协议的代理
      },
      
    }
  }
};
```

### 文件指纹是什么，有什么用处
1. 文件资源名的后缀，用来版本管理，被浏览器用来判断继续使用缓存中的文件还是需要请求新资源
2. 分类：有三种：
   1. Hash: 分两种
      1. 项目Hash: 关联整个项目的指纹，只要项目内文件变化，hash就更新，配置的位置在配置文件的output
      2. 独立文件Hash是指文件内容的hash:例如图片/字体等，使用file-loader打包时，会设置一个hash
   2. ChunkHash: 关联webpack打包生成的chunk,例如js文件, 默认情况下(不考虑代码分割优化)每个entry入口输出一个chunk,会有一个chunkHash，不同chunk之间的chunkHash互相独立互不影响
   3. ContentHash: 根据文件内容生成内容指纹，例如css文件，文件内容变化才会更新contentHash
3. 在webpack中设置：
   ```
   module.export = {
      output:{
         // :8表示取该指纹字符串的前8位
         // filename:'[name]_[hash:8].js', 整个项目都变会浪费资源
         filename:'[name]_[chunkhash:8].js'
      },
      module:{
         rules:[{
            test: /\.(png|jpg|gif|jpeg|woff|woff2|eot|ttf|otf)$/,
            use:[{
                  loader:'file-loader',
                  // 图片/字体的文件指纹用hash,此hash也表示文件内容，而不是项目的hash，默认时md5算法生成，ext表示资源后缀名 'static/'表示资源要放进这个叫static的文件夹
                  options:{
                     name:'static/[name]_[hash:8].[ext]'
                  }
            }]
         },{
            test:/.css$/,
            use:[
               //style-loader和MiniCssExtractPlugin作用互斥，不能同时配置
               // 'style-loader', //style-loader会将css代码插入到<style>标签并放进Html的头部，此时没有css独立文件
               MiniCssExtractPlugin.loader, // MiniCssExtractPlugin这个插件将css独立成文件，自带一个laoder
               'css-loader',
            ]
         }]
      },
      plugins:[
         // MiniCssExtractPlugin这个插件将css独立成文件输出
         new MiniCssExtractPlugin({
            filename:'[name]_[contenthash:8].css'
         })
      ]
   }
   ```

### 如何提取页面公共资源
1. 有几种情况
   1. 第三方库：例如react/react-dom等基础库
      1. 方案：使用html-webpack-externals-plugin插件，配置直接通过cdn引入，不打入bundle中。
      ```
      module.export = {
         plugins:[
            new HtmlWebpackExternalsPlugin({
               {
                  module:'react',
                  entry: '..第三方库地址', 
                  global: 'React',
               },
               {
                  module:'react-dom',
                  entry: '..第三方库地址',
                  global: 'ReactDOM',
               },
            })
         ]
      }
      ```
   2. 代码中含有公共脚本，需要提取分离成单独文件 这种方式也能将第三方库单独提取
      1. 方案：利用SplitChunksPlugin插件，配置webpack在打包时做代码分割(V4之前用CommonsChunksPlugin,官方建议不再用)
      2. 代码：
         ```
         module.export = {
            optimization:{
               splitChunks:{
                  //通用规则---start---
                  chunks:'async', // 选项：[async(默认), initial, all(推荐)] async 只对异步引入的库分离；initial只对同步引入的库分离；all引入的库都进行分离
                  minSize:30000, //生成的公共chunk大小必须>=30000 单位Byte
                  maxSize:0, //抽离的公共chunk体积如果大于maxSize就分成较小的chunks
                  minChunks:1, //至少被引用的1次才会抽离
                  maxAsyncRequests: 5, //浏览器按需加载文件时的最大并行请求数
                  maxIntialRequests:3, //浏览器加载入口文件时的最大并行请求数
                  automaticNameDelimiter: '~', // 表示拆分出的chunk的名称连接符。默认为~。如chunk~vendors.js
                  name: true,// 设置chunk的文件名。默认为true。当为true时，splitChunks基于chunk和cacheGroups的key自动命名。
                  // 通用规则---end---\
                  cacheGroups:{ //单独配置的分割规则，缓存组里的配置可以继承和覆盖上面splitChunks.*的任何配置,但test、priority、reuseExistingChunk只能在缓存组级别上配置
                     commons:{
                        test:/(react | react-dom)/,  //将react和react-dom分成一个单独的chunk
                        name:'vendors', //打出来的包名称是vendors开头的 例如vendors.34nf45if.js
                        chunks: 'all', //跟splitChunks.chunks通用规则一样，配置对什么样的库进行分离
                        priority: -9， //一个模块可能属于多个缓存组，打包时优先考虑优先级更高的缓存组。默认为负数，自定义的缓存组默认优先级是0
                     },
                     vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10，
                     },
                     default: {
                        name:'common',
                        priority: 20，
                     },
                  }
               }
            }
         }
         ```


### 代码分割是什么，原理是什么 ？？？
1. 定义：代码分割是将代码库分割成多个chunks，在代码运行需要它们的时候再进行下载、加载
   1. 有两种情况需要代码分割：
      1. 抽离相同代码到一个共享块
      2. 脚本懒加载，使初始化代码下载量更小
   2. 懒加载的方式
   3. CommonJS语法：require.ensure
   4. ES6: 动态import (目前原生还没有支持，需要Babel翻译，使用插件@babel/plugin-syntax-dynamic-import)
   5. 配置
      ```
      module.export = {
         plugins:[
            "@babel/plugin-syntax-dynamic-import"
         ]
      }
      ```
2. 原理： ？？？？

### 使用动态import时，webpack是怎么工作的 || 动态import的实现原理 ？？？



### Scope-Hoisting 区域提升，原理是什么 ？？？
1. 背景：webpack生产环境下默认打包出来的的格式是一个自执行函数,多个模块之间采用迭代的方式依次调用。如果模块很多，会产生多个作用域，占用内存较大。
2. 作用：Scope-Hoisting 使多个模块之间的调用变成串联执行，都包裹在同一个作用域内
3. 使用：production模式下默认支持,其他模式需要手动配置。
4. 原理：分析模块之间的依赖关系后，直接放在同一个函数内。在使用Scope-Hoisting时必须有 ModuleConcatenationPlugin 的支持，production模式 默认启动了它，其他模式需要手动添加
   ```
   module.exports={
      mode:'development',
      plugins:[
         new webpack.optimize.ModuleConcatenationPlugin()
      ]
   }
   // a依赖b，b依赖c 打包成的 bundle.js
   (()=>{
      {//c代码块}
      {//b代码块}
      {//a代码块}
   })();
   ```
5. 注意：只支持ES6语法，不支持CommonJS.在一些项目中用到了babel，例如babel-loader或者@babel/preset-env中可能会讲代码翻译成CommonJs语法的，就会导致Scope-Hoisting失败

### 如何处理webpack打包构建过程中出现的异常和中断

### 提升CSS生产力的工具用过哪些

### Webpack离线缓存静态资源是怎么实现的

### 如何持久化缓存

### Tree-Shaking 摇树优化
1. 背景： 由 Rollup 率先实现，从Wabpack2.0版本开始接入
2. 功能：
   1. 按需加载:没有被引用的模块不会被打包进来；
   2. 清理unused-module:把加载后未使用的模块干掉
   3. 清理unused-code:把加载完毕的模块中的未使用的代码干掉
3. 基于：Es6 Module + UglifyJs实现
   1. 为什么只能是 Es6Module? 而CommonJs不行
      1. Es6Module是静态引用，编译时执行，可以在编译阶段就确定模块之间的依赖关系、输入、输出，从而能够静态分析哪些是用到的，哪些是没用的。 
      2. 而CommonJs是动态引用，运行时加载，无法提前确定用不用得到，所以先都加载进来，运行完就算没用到也已经加载完了。
   2. UglifyJs 
      1. 定义：实现对引入模块中未使用的代码进行干掉
      2. 原理：Webpack 中，Tree-shaking 的实现一是先「标记」出模块导出值中哪些没有被用过，二是使用 Terser 删掉这些没被用到的导出语句。标记过程大致可划分为三个步骤：
         1. Make 阶段，收集模块导出变量并记录到模块依赖关系图 ModuleGraph 变量中。
         2. Seal 阶段，遍历 ModuleGraph 标记模块导出变量有没有被使用。
         3. 生成产物时，若变量没有被其它模块使用则删除对应的导出语句。
4. 注意：
   1. 只支持ES6语法，不支持CommonJS.
   2. 如果用了第三方资源，注意兼容性。有一些库例如babel-loader或者@babel/preset-env，会将代码翻译成CommonJs语法的，就会导致Tree-Shaking失败
5. 使用：
   2. 开启：`optimization:{usedExports: true}`  production模式默认开启了; dev环境下默认没有
   3. 在使用 tree shaking 时必须有 ModuleConcatenationPlugin 的支持，production模式 默认启动了它，其他模式需要手动添加



### Webpack做前端性能优化的方向
1. 解析优化
   1. 减少解析工作量：配置中的module中，noParse 排除不参与解析的文件;include 白名单指定要转译的范围；exclude 黑名单排除不参与loader转译的文件
      ```
      module.export = {
         module:{
            noParse: /node_modules\/(*\.js)/,  //排除解析
            rules:[
               {
                  test: /.css$/,
                  include: /src\/*/, //指定转译
                  exclude: /node_modules\/(*\.js)/, //排除转译
                  use: [
                     'style-loader', 
                     "css-loader", 
                  ],
               },
            ]
         }
      }
      ```
2. 构建优化
   1. 用一些插件例如 TerserPlugin 清除打印、调试、无用代码
   2. 图片优化
   3. Tree-Shaking
   4. 多通道并行 
      1. fast-sass-loader 可以并行处理sass文件
      2. tread-loader 多线程执行
         1. 原理：维护一个worker线程池，每次webpack解析一个模块，thread-loader会将它及它的依赖分配给一个线程池
         2. 注意：tread-loader必须写在所有loader的前面。由于loader是倒序调用的，也可以理解为要保证它在最后被调用
         3. 用法：
            ```
            module.export = {
               module:{
                  rules:[
                     {
                        test: /.css$/,
                        use: [
                           'tread-loader', //务必放在第一个位置
                           'style-loader', 
                           "css-loader", 
                        ],
                     },
                  ]
               }
            }
            ```
      3. happypack 多线程执行 用多进程实现多线程
         1. 原理：由于js是单线程语言，webpack依托于Node.js也是单线程执行，所以想要并发执行，只能依赖于计算机系统的多进程实现多线程。但是在聊webpack打包时，只关注多线程这个概念。
         2. 用法：
            ```
            const HappyPack = require('happypack');
            // 根据CPU的数量创建一个线程池
            const happyThreadPool = HappyPack.ThreadPool({
               size: OscillatorNode.cpus().length
            })
            module.export = {
               plugins:[
                  new HappyPack({
                     id:'jsx',
                     treads: happyThreadPool, //自定义线程池
                     loader:['babel-loader'], // 注意这个loader需要支持happypack
                  })
               ]
               
            }
            ```
   5. 预编译 ???
3. 组装优化
   1. splitChunks
   2. 动态懒加载 
4. 导出优化
   1. 压缩 例如UglifyPlugin、TerserPlugin
5. 缓存优化
   1. 长缓存优化
      1. 定义：浏览器在用户访问页面的时候，为了加快加载速度，会对用户访问的静态资源进行存储，
      2. 方案：
         1. 每一次代码升级或者更新，都需要浏览器去下载新的代码，最方便和最简单的更新方式就是引入新的文件名称。在Webpack中，可以在output给出输出的文件制定chunkhash，并且分离经常更新的代码和框架代码，通过NameModulesPlugin或者HashedModulesPlugin使再次打包文件名不变。

   
### 如何分析webpack的构建成果
1. 关于模块的统计数据的stats文件内会有各种编译信息
   1. 用法执行script语句`"build:stats": "webpack --json > stats.json"`就会生成一个stats.json文件，包含各种信息
   2. 信息
   ```
   { //外层基础信息
      "asset":{
         // 每一个asset对象表示一个编译出的output文件
      },
      "chunks":{// chunk 对象},
      "modules":{// module 对象},
      "errors":{// error 对象},
      "warnings":{// warning 对象},
   }
   ```
2. 速度分析：
   1. 使用 speed-measure-webpack-plugin 分析Loader和Plugin花费的时间，在控制台的打印信息中，用红黄绿三种颜色标识，红色要优化，黄色可优化，绿色ok.
      ```
      // 在配置文件 webpack.config.js 中 用该插件的实例将整个配置对象.wrap()起来
      const SpeedMeasureWebpackPlugin = require("speed-measure-webpack-plugin");
      const smp = new SpeedMeasureWebpackPlugin();
      module.exports = smp.wrap({
         //正常配置项
      })
      ```
3. 体积分析：
   1. 使用 webpack-bundle-analyzer 分析体积, 构建完成之后会在端口8888中，http://127.0.0.1:8888，看到各个组件或者依赖的第三方模块的文件大小
   2. 用法：
      ```
      // 在配置文件 webpack.config.js 中
      const webpackBundleAnalyzer = require('webpack-bundle-analyzer');
      module.exports = {
         plugins:[
            new webpackBundleAnalyzer.BundleAnalyzerPlugin(),
         ],
      }
      ```



### webpack 中的 polyfill
1. 定义：
2. 有几种方式


### 如何配置一个文件夹下所有的js各为一个入口



### webpack+CDN实现加速(笔记上有记录)

### 源码

### 常用配置

### 复杂情况下的配置方案


### split chunks 用了哪些函数实现 得看源码

### runtime.js是什么

### 其他打包工具 比如vite

### 基于babel实现一个webpack   简易实现：/tips-and-problems/src/webpack/custom_webpack/*
1. 文件位置： 
   1. 基础版：能对js文件打包 commonjs版本在/tips-and-problems/src/webpack/custom_webpack/webpack_commonjs.js中  
   2. 自定义loader版：es6版本在/tips-and-problems/src/webpack/custom_webpack/webpack_es6.js中
2. 流程：用CommonJS模块规范写的 在/tips-and-problems/src/webpack/custom_webpack/webpack_commonjs.js
   1. 使用node的fs模块读取入口文件，得到入口文件源码
   2. 使用@babel/parser包，将入口文件js源码解析，得到入口文件的AST树，传递给步骤3开始分析依赖。
      1. 注意：webpack默认不理解import export关键字，需要在配置对象中指出是module类型的sourceType.
   3. 使用@babel/traverse包，对ast处理，并根据文件的AST树，分析找到该文件直接依赖的其他文件，并。
      1. @babel/traverse包的作用：The Bable Traverse module contains the overall tree state, and is responsible for replacing、removing、adding nodes. 负责AST所有节点的增删改, 
      2. 参考 createAsset 方法
      3. 主键ID:查找依赖关系时，每个导入的文件都有自己的相对路径。在不同的层级下，文件可以重名，所以相对路径字符串有可能是相同的。为了区别，就需要给每个文件设置了一个唯一编号id。
   4. 使用@babel/core包，将ES6代码转换成ES5代码
      1. 参考 createAsset 方法
      2. 注意：ES6的import export关键字将会被转化为CommonJs模块规范中的require module exports 等关键字
   5. 遍历创建关系图：把步骤3里找到的每一个文件，都重新执行3～5步骤，遍历互相依赖的所有文件，最终形成一个“图”。
      1. 注意：没有使用递归法，而是用队列循环(队列概念是用数组实现的)
      2. 参考 createGraph 方法
      3. 在存储图关系的时候，用一个mapping对象存储 {相对路径: 对应的依赖包id} 之间的映射。这样就可以通过路径找到id，再用id找到对应的模块
   6. 把最终的ES5代码图打包为bundle.js
      1. 参考 bundle 方法
      2. 注意：输出一段一个立即执行函数的字符串代码 可以使用eval()执行
      3. 重写require：为了快速得到依赖的文件的code和id, 使用数组存储对象需要先遍历对象求其mapping才能找到目标，很繁琐，所以新建了一个modules的映射对象，以id为健，以`[code,mapping]`为值。 转化后的原生Es5的require的入参是相对路径，但是webpack为了快速查找到模块代码，入参希望是模块id,像 require(0) 这样调用，所以需要适配器，对require进行重写，参考 localRequire 方法
   7. 把代码输出到打包文件中 默认 ./dist/bundle.js
   8. #### 用loader处理非.js类型的文件。用ES6模块开发一个json-loader  es6版本在/tips-and-problems/src/webpack/custom_webpack/webpack_es6.js中
   9. 换了模块规范开发，先进行一部分准备
      1. 参考webpackConfig：添加一个配置文件，用来模拟webpack.config.js读取后的配置结果，指定解析.json文件的函数是jsonLoader
      2. commonJs的require语法都改成了es6的import
      3. __dirname 改成用 process.cwd()+filename
   10. 定义loader
       1.  参考 /tips-and-problems/src/webpack/custom_webpack/json-loader.js
       2.  本质：就是一函数,入参是要翻译的文件源文本代码,经过一系列核心代码转换后，返回翻译过的代码文本
       3.  模块化输出：输出代码要用 `export default code`
       4.  链式传递：loader函数返回的代码作为下一个loader的基础代码
       5.  注意：避免绝对路径
   11. 执行loader
       1. 调用顺序：loader按照书写顺序倒序调用
   12. #### 用plugin增加一些打包行为。 
       1.  基于 Tapable 库
           1.  Tapable 的四种类型钩子
               1.  基本钩子：只是简单的调用每个tap传进去的函数
               2.  waterfall钩子：也会调用每个tap传进去的函数，不同的是，它会从每一个函数中返回的值作传递给下一个函数
               3.  Bail钩子：允许更早的退出。当传进来的钩子里return了任何值，就停止其他函数的执行。
               4.  loop钩子：如果某个函数有返回值，就会循环之前的事件
           2. 三种注册方式： 
              1. .tap 生产同步hook .tap(name, callback)
              2. .tapAsync 生产带callback回调的异步hook .tapAsync(name,callback) 最后一个参数必须是回调函数
              3. .tapPromise 生产带promise回调的异步hook .tapPromise(name) 必须返回一个promise实例
           3. 与注册对应的三种消费方式：
              1. .call 调用注册的同步hook
              2. .callAsync
              3. .promise
           4. Tapable hooks 有三类API
              1. 同步的：
                 1. SyncHook,
                    1. demo:tap
                         ```
                         const syncHk = new SyncHook(['name','age']);
                         // 多处生产
                         syncHk.tap('plugin1',(name,age)=>{
                            console.log('plugin1', name, age);
                         })
                         syncHk.tap('plugin2',(name,age)=>{
                            console.log('plugin2', name, age);
                         })
                         // 多处消费
                         syncHk.call('jack',28);
                         // 输出
                         // 'plugin1', 'jack',28
                         // 'plugin2', 'jack',28
                         ```
                 2. SyncBailHook,
                 3. SyncWaterfallHook,
                 4. SyncLoopHook
              2. 异步并行的
                 1. AsyncParallelHook,
                    1. demo1:tapAsync
                       ```
                       const queue1 = new AsyncParallelHook(['name']);
                       queue1.tapAsync('1', (name,cb)=>{
                          setTimeout(()=>{
                             console.log(name,1);
                             cb('error', '1');
                          },2000) //延迟2秒
                       })
                       queue1.tapAsync('2', (name,cb)=>{
                          setTimeout(()=>{
                             console.log(name,2);
                             cb(null, '2');
                          },1000) //延迟1秒
                       })
                       queue1.callAsync('tapAsync', (err,res)=>{
                          console.log('err',err);
                          console.log('res',res);
                       })
                       // 输出
                       // tapAsync 2 当然是只延迟了1秒的先输出
                       // tapAsync 1
                       // 'err', 'error'
                       // 'res', undefined
                       ```
                    2. demo2:tapPromise
                       ```
                       const queue2 = new AsyncParallelHook(['name']);
                       queue2.tapPromise('1', (name)=>{
                          return  new Promsie((resolve,reject)=>{
                            setTimeout(()=>{
                               console.log(name,1);
                               resolve('1');
                            },2000) //延迟2秒
                          })
                       })
                       queue2.tapPromise('2', (name)=>{
                          return  new Promsie((resolve,reject)=>{
                            setTimeout(()=>{
                               console.log(name,2);
                               reject('2error');
                            },1000) //延迟1秒
                          })
                       })
                       queue2
                       .promise('tapPromise')
                       .then(res=>{
                          console.log('res',res);
                       })
                       .catch(err=>{
                          console.log('error',err);
                       })
                       // 如果一个是resolve 一个是reject 输出:
                       // tapPromise 2 //延迟时间短的先输出
                       // 'error' '2error' 
                       // tapPromise 1

                       // 如果两个都是resolve  输出:
                       // tapPromise 2 //延迟时间短的先输出
                       // tapPromise 1
                       // 'res' undefined
                       ```
                 2. AsyncParallelBailHook
              3. 异步串行的
                 1. AsyncSeriesHook,
                 2. AsyncSeriesBailHook,
                 3. AsyncSeriesWaterfallHook 
       2. 封装一个 plugin
           1.  遵守的规则：
               1.  一个 JavaScript 命名函数或 JavaScript 类。
               2.  在插件函数的 prototype 上定义一个 apply 方法。
               3.  指定一个绑定到 webpack 自身的事件钩子。
               4.  处理 webpack 内部实例的特定数据。
               5.  功能完成后调用 webpack 提供的回调。
           2.  plugin的本质：plugin是满足上述要求的类的实例。
           3.  plugin初始化：在安装插件时，这个原型上的apply方法会被webpack compiler调用一次。apply方法可以接收一个webpack compiler对象的引用，从而可以在回调函数中访问到compiler对象
               1.  安装插件就是在webpack.config.js配置文件的 plugins:[new Plugin()]数组中添加该插件的实例
               2.  compiler 是什么：是webpack的内置对象，plugin将会把各个事件钩子挂在到 webpack compiler 上去。
                   1.  compiler的本质
                       ```
                       class Compiler extends Tapable{
                          constrctor(){
                             this.hooks = {
                                compilation: new SyncHook(["compilation", "params"]),
                                shouldEmit: new SyncBailHook(["compilation"]),
                                make: new AsyncParallelHook(["compilation"]),
                                done: new AsyncSeriesHook(["stats"]), // 把钩子done挂在到compiler上
                                // 等等 很多
                             }
                          }
                       }
                       const compiler = new Compiler();
                       ```
                   2.  挂载到compiler
                        ```
                        class MyPlugin {
                           // 在插件函数的 prototype 上定义一个 `apply` 方法，以 compiler 为参数。
                           apply(compiler) {
                              // 给钩子done用.tapAsync绑定了一个事件
                              compiler.hooks.done.tapAsync('MyPlugin', (compilation, cb) => {});
                           }
                        }
                        ```
                   3.  触发钩子
                        ```
                        // done钩子绑定的事件 会在编译完成后被触发
                        compiler.hooks.done.callAsync(..)
                        ```
               3.  compilation是什么：   
                     ```
                     class HelloCompilationPlugin {
                        apply(compiler) {
                           // 指定一个挂载到 compilation 的钩子，回调函数的参数为 compilation 。
                           compiler.hooks.compilation.tap('HelloCompilationPlugin', (compilation) => {
                              // 现在可以通过 compilation 对象绑定各种钩子
                              compilation.hooks.optimize.tap('HelloCompilationPlugin', () => {
                                 console.log('资源已经优化完毕。');
                              });
                           });
                        }
                     }
                     module.exports = HelloCompilationPlugin;
                     ```   
               4.  compiler 与 compilation的区别   参考代码：/webpack/lib/Compiler.js /webpack/lib/Compilation.js 源码
                   1.  compiler 是 一开始就创建的，由webpack读取config文件之后创建，参与整个webpack的生命周期：before - run - beforeCompiler - complie - make - finishMake - afterComplier - done
                   2.  compilation 是webpack到了compile编译阶段才创建的
                   3.  区别：可以理解为compilation是为了完成核心编译阶段而单独取出来的一块逻辑，就像手脚，这样当源代码变化了，就可以直接用compilation来完成新的编译，而只有项目的配置改变了这种全局的东西才用conpiler来完成，就像一个人。 手脚属于人，手脚只用来做一部分的事，人来支配手脚
                   4.  源码截取
                        ```
                        // 源码位置： /webpack/lib/Compiler.js
                        compile(callback) {
                           const params = this.newCompilationParams();
                           this.hooks.beforeCompile.callAsync(params, err => {
                              if (err) return callback(err);

                              this.hooks.compile.call(params);

                              const compilation = this.newCompilation(params);

                              this.hooks.make.callAsync(compilation, err => {
                                 if (err) return callback(err);

                                 compilation.finish(err => {
                                    if (err) return callback(err);

                                    compilation.seal(err => {
                                       if (err) return callback(err);

                                       this.hooks.afterCompile.callAsync(compilation, err => {
                                          if (err) return callback(err);

                                          return callback(null, compilation);
                                       });
                                    });
                                 });
                              });
                           });
                        }
                        ``` 



### webpack 性能优化方案
1. 开发提效：
   1. 省略后缀： 在配置resolve中使用 extensions 定义一个数组，表示按某路径查询资源时，如果没找到就自动按照数组顺序依次添加后缀查找。
   2. 自动打包html: 使用 html-webpack-plugin 插件，可以自动设置某个html文件为模版，作为入口html
   3. 自动前缀css： 使用 postcss-loader + autoprefixer插件 + 在package.json中配置 browserslist 实现给css自动添加浏览器内核前缀
2. 缩小打包体积：
   1. 压缩css：用 css-minimizer-webpack-plugin 插件
   2. 压缩js: 用 Uglify-webpack-plugin
   3. 开启gzip压缩： 用compression-webpack-plugin插件
   4. 打包后检查：用 webpack-bundle-analyser 包中的 BundleAnalyzerPlugin 插件，可以在本地另开一个服务显示各个bundle的体积
3. 提高打包速率：
   1. 多线程编译：
      1. 用 thread-loader 多线程打包。注意把这个 loader 放置在其他 loader 之前， 放置在这个 loader 之后的 loader 就会在一个单独的 worker 池(worker pool)中运行.
      2. 用 parallel-uplify-plugin 可以把对JS文件的串行压缩变为开启多个子进程并行执行
         1. 用 terser-webpack-plugin 开启 parallel参数 。这个插件默认支持es6代码的压缩
      3. 用 happy-pack 插件 现在已经不怎么维护了
   2. 减少使用extensions这种配置，因为每次找不到就会查一遍，优先规范代码写法
   3. 打包速度检查：用 speed-measure-webpack-plugin 插件，用插件实例化的对象 wrap整个配置文件即可
   4. 打包进度监控：使用 progress-bar-webpack-plugin 插件，可以在命令行看到实时的打包进度百分比
4. 内联资源：
   1. 将css内联到js: 用 style-loader 将css-loader打包好的代码由js操作，以`<style>`标签的形式加载到html中使样式生效. 此时打包出来的文件中，没有独立的css代码，打包的html中没有css代码
   2. 将css内联进html的head中：用 html-inline-css-webpack-plugin 插件. 注意配置时要放在 html-webpack-plugin 后面，要先产出了html后才能放置css
   3. 将css打包成独立文件: 用 mini-css-extract-plugin插件，配置时，除了要在插件数组里加入实例，还要注意，用MiniCssExtractPlugin.loader 代替 style-loader
   4. 小资源(小图/字体)内联到j：类似file-loader,用 url-loader 将小于限制大小的字体/图片加载为base64格式,这样就可以直接使用字符串得到资源而不用发http请求，url-loader对大小做限制判断，小的才去转换base64格式，大的资源依然去调用file-loader (但是我在测试中，url-loader打出来的包都是损毁的，直接打都打不开)
   5. 将html内联到html：用 raw-loader 将文件作为字符串导入.
5. 模块分离
   1. 第三方基础库打包：用 html-webpack-externals-plugin 插件，然后设置externals。然后可以从html中利用cdn获取资源
   2. 预编译资源模块：用 DLLPlugin 将外部的包都打进一个文件 并且生成一个 menifest.json 清单文件描述打出来的这些包，在config配置文件中可以通过 DLLReferencePlugin 去引用menifest 即可引用对应的资源包。 一般会单独配置一个文件叫 webpack.dll.js
   3. 代码分割：使用 split-chunks-plugin 插件提取公共代码 + 控制每个包的体积
   4. 提取第三方：
   5. Tree-Shaking:
   6. 动态加载：
6. 持久化缓存：
   1. 文件指纹：
   2. 控制项目部署顺序：



### ?