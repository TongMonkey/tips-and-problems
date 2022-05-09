## Next.js

### 相关概念
1. 页面page：一个page就是一个从pages目录下的 js jsx ts tsx 文件导出的 React组件
2. 路由route: page 根据其文件名，与 router路由关联。例如 pages/about.js 被映射到 /about 路径。甚至可以在文件名中添加动态路由参数

### 预渲染 两种形式
1. 静态生成：HTML 在 构建时 生成，并在每次页面请求（request）时重用
2. 服务器端渲染：在 每次页面请求（request）时 重新生成 HTML。
3. 混合渲染：Next.js 允许你为每个页面 选择 预渲染的方式。对一部分页面使用“静态生成”，同时对其它页面使用“服务器端渲染”。
4. 

