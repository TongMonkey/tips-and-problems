//8. 9.
// 要是用Es6语法需要在package.json文件中加一个 type:module属性
import fs from "fs";
import path from "path";
import parser from "@babel/parser";
import babel from "@babel/core";
import jsonLoader from "./loaders/json-loader.js"; //自定义loader
import babelTraverse from "@babel/traverse";
const traverse = babelTraverse.default;

let ID = 0;
// 9.
const webpackConfig = {
  module: {
    rules: [
      //11.
      { test: /\.json$/, use: jsonLoader },
    ],
  },
};

function createAsset(filename) {
  //1.
  let content = fs.readFileSync(filename, "utf-8"); //如果不设置字符编码规则，会打印出 二进制 Buffer 流

  //11.
  const loaders = webpackConfig.module.rules;
  loaders.forEach(({ test, use }) => {
    if (test.test(filename)) {
      if (Array.isArray(use)) {
        // 注意 数组use里是倒序执行，必须 reverse
        use.reverse();
        use.forEach((fn) => {
          content = fn(content);
        });
      } else {
        content = use(content);
      }
    }
  });

  //2.
  const ast = parser.parse(content, {
    sourceType: "module", // 解决报错 SyntaxError: 'import' and 'export' may appear only with 'sourceType: "module"'
  });

  //3.
  //存储多个导入的相对路径 如果有多个导入，webpack默认不会验证路径是否正确
  const dependencies = [];
  // 第二个参数是一个 visitor对象 { AST_propertyName: callback } callback里定义如何操作 AST树中propertyName属性对应的内容
  // 每个import部分都对应一个ImportDeclaration部分，traverse自动循环，所以这里只写一一遍却可以用数组dependencies收集到所有导入信息
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });

  //4.
  // 将ES6代码转换成ES5代码 返回的是一个对象，只关注里面的code属性引用的代码源码
  const { code } = babel.transformFromAstSync(ast, null, {
    presets: ["@babel/preset-env"],
  });

  let id = ID++;

  return {
    id,
    filename,
    code,
    dependencies,
  };
}

//5.
function createGraph(entry) {
  const mainAsset = createAsset(entry);
  const queue = [mainAsset];
  for (const asset of queue) {
    asset.mapping = {};
    asset.dependencies.forEach((relativePath) => {
      const dirname = path.dirname(asset.filename); //path.dirname 获取当前文件的目录路径
      const absolutePath = path.join(dirname, relativePath);
      const child = createAsset(absolutePath);
      asset["mapping"][relativePath] = child.id; //映射相对路径与id
      queue.push(child);
    });
  }
  return queue;
}

//6.
// 输出一个自执行函数的代码字符串
function bundle(graph) {
  // modules 对象 {id:[code,mapping]} 方便快速查找
  // ${JSON.stringify(mod.mapping)} 是方便拼接字符串，直接就能变成 “k:v” 格式
  let modules = "";
  // 被转译后的Es5 code里可能会有require, module, exports这些关键字. require方法的入参是依赖文件的相对路径
  graph.forEach((mod) => {
    modules += `
            ${mod.id}: [
                function(require, module, exports){
                    ${mod.code}
                },
                ${JSON.stringify(mod.mapping)}
            ],
        `;
  });
  // 结构modules对象 {...id:[code,mapping]}  fn就是function(require, module, exports){code}
  let res = `
        (function(modules){
            function require(id){
                const [fn, mapping] = modules[id];
                function localRequire(relativePath){
                    let id = mapping[relativePath];
                    return require(id);
                };
                const module = {
                    exports:{}
                };
                fn(localRequire,module,module.exports);
                return module.exports;
            }
            require(0);
        })({${modules}});
    `;
  return res;
}

//7.
function bundleOutput(content, outputPath) {
  fs.writeFileSync(outputPath, content, "utf-8");
}

const graph = createGraph("./index.js");
const bundleContent = bundle(graph);
//9.
const outputPath = path.join(process.cwd(), "./dist", "bundle.js");
bundleOutput(bundleContent, outputPath);

// console.log(bundleContent);
eval(bundleContent);
