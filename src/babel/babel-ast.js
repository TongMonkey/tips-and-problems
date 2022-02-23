import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import generate from "@babel/generator";

//文档链接： https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#toc-writing-your-first-babel-plugin

// 转译三步走： 解析parse——转换transform——生成generate
const origin = `function square(n) {
  return n * n;
}`;

/********* parse start **********/
const ast = parser.parse(origin);

/********* transform start **********/
/**
 * traverse:{Hub, NodePath, Scope, default, visitors}
 */
traverse.default(ast, {
  enter(path) {
    // 原生api
    // if (path.isIdentifier({ name: "n" })) {
    //   path.node.name = "x";
    // }

    //使用babel-types工具集
    if (t.isIdentifier(path.node, { name: "n" })) {
      path.node.name = "x";
    }
  },
});

/********* generator start **********/
/**
 * generate: { CodeGenerator: [class CodeGenerator], default: [Function: generate] }
 */
let result = generate.default(
  ast,
  {
    // 设置选项
  },
  origin
);
/**
 * {
 *    code: 'function square(x) {\n  return x * x;\n}',
 *    map: null,
 *    rawMappings: undefined
 * }
 */
// console.log(result);
