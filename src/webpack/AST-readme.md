### AST 是什么
1. 定义：AST 是抽象语法树，简称语法树，是源代码语法结构的一种抽象表示。
2. 特点：它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。每个节点是一个Node,一个 AST 可以由单一的Node或是成百上千个Node构成。
3. 伪代码：
  ```
    //每个节点都有接口：
    interface Node{
      // 每个节点都可能有很多属性，不完全列举如下：
      type:"...",
      id:{
          type: "...",
          name: "..."
      },
      params: [
          {
              type: "...",
              name: "..."
          },
          {
              type: "...",
              name: "..."
          },
      ],
      body: {...},
      operator: ...,
      left: {...},
      right: {...},
      // Babel 还为每个节点额外生成了一些属性，用于描述该节点在原始代码中的位置,每个节点都有start, end, loc这几个属性
      start: 0,
      end: 0,
      loc: {
          start: {line:0, column:0},
          end: {line:0, column:0},
      }
    }
    ```
4. AST 可以做什么
   1. babel
   2. webpack
   3. sass/less
   4. ESLint
   5. TypeScript


#### AST中的一些关键词
1. Visitor: 获取具体节点的方式是采用访问者模式，用一个 visitor 的概念，访问节点，在进入、退出节点时都可以调用访问者方法。
2. Path: 表示两个节点之间连接的对象
3. State: 状态
4. Scopes: 作用域 可以在树状嵌套结构中创建出的作用域 
   注意：在js中创建的”引用“，都属于当前作用域。在transform的过程中，必须谨慎对待作用域，确保创建的引用不会和内层、外层作用域内的引用有冲突；在创建新的作用域时，需要给出它的路径和父作用域，之后在遍历过程中它会在该作用域内收集所有的引用
5. Bindings: 绑定 所有引用属于各自特定的作用域，这种归属关系，就是引用和作用域之间的绑定关系。
```
// binding的结构
{
  identifier: node,
  scope: scope,
  path: path,
  kind: 'var',

  referenced: true,
  references: 3,
  referencePaths: [path, path, path],

  constant: false,
  constantViolations: [path]
}
// 通过这些信息，可以查找一个绑定的所有引用
```

### AST怎么操作节点
#### 利用@babel-types 模块
Babel Types模块是一个用于 AST 节点的 Lodash 式工具库（译注：Lodash 是一个 JavaScript 函数工具库，提供了基于函数式编程风格的众多工具函数）， 它包含了构造、验证以及变换 AST 节点的方法。 该工具库包含考虑周到的工具方法，对编写处理AST逻辑非常有用
@babel-types中的一些概念：
1. Definitions: 定义。 babel-types模块拥有所有类型节点的定义方法
```
defineType("BinaryExpression", {
  builder: ["operator", "left", "right"],
  fields: {
    operator: {
      validate: assertValueType("string")
    },
    left: {
      validate: assertNodeType("Expression")
    },
    right: {
      validate: assertNodeType("Expression")
    }
  },
  visitor: ["left", "right"],
  aliases: ["Binary", "Expression"]
});
```
2. Builders: 构造器。 每一个节点类型都有构造器方法 就是上面defineType函数中那个builder
```
t.binaryExpression("*", t.identifier("a"), t.identifier("b"));
//得到
{
  type: "BinaryExpression",
  operator: "*",
  left: {
    type: "Identifier",
    name: "a"
  },
  right: {
    type: "Identifier",
    name: "b"
  }
}
// 打印出来是 ` a * b `
```



