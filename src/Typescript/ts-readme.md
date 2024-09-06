# Typescript

## TS 基础

### 编译

1. 下载 `npm install -g typescript`
2. 编译成 js: `tsc index.ts` gets index.js
3. 注意：即使 index.ts 里有类型断言的错误，执行 " tsc * " 之后还是会创建出 js 文件

### 数据类型

1. Javascript 本身有的：boolean, bigint, null, number, string, symbol, and undefined
2. Typescript 拓展的
   1. any：allow anything
   2. unknown：ensure someone using this type declares what the type is。确保使用该类型的人声明该类型是什么❓❓❓
   3. never：it’s not possible that this type could happen ❓❓❓
   4. void：a function which returns undefined or has no return value
3. 对比 ❓❓❓
   1. any 与 unknown 类型的区别
   2. never vs void

### 类型断言

1. 定义：变量有明确的类型，由开发者手动设置类型
2. 定义类型的方式：
   1. 方式：
      1. interface
      2. type
   2. 对比：❓❓❓
   3. 建议：You should prefer interface. Use type when you need specific features.
3. Composing types 类型组合方式
   1. Unions 联合类型 declare that a type could be one of many types. 用一个竖线分割

      ``` c
      type WindowStates = "open" | "closed" | "minimized"; // 不同的值
      obj: string | string[] // string or array 不同的类型
      ```

   2. Generics 泛型：用来表示某个类型的值

      ``` c
         interface Backpack<Type> {
             add: (obj: Type) => void;
             get: () => Type;
         }
         // 传进去的泛型 Type 是 string 类型
         declare const backpack: Backpack<string>;
         
         // object is a string because the get function return Type which presents string
         const object = backpack.get();
         
         // add function need a string type parameter.
         backpack.add(23); // Error
      ```

4. 写法
   1. `<number>name` 用一对尖括号包裹类型放在变量前面
   2. `name as number` 使用 as 关键词

### Class

1. 定义：TS offers full support for the Class in ES6.
2. Class members:❓❓❓
   1. readonly:
   2. abstract:
3. Access Modifiers: Control member visibility:
   1. public
   2. protected:
      1. 定义：The protected modifier allows properties and methods of a class to be accessible within the same class and within subclasses.
      2. Subclasses 定义：When a class (child class) inherits from another class (parent class), it is a subclass of the parent class.
   3. private modifier:
      1. 定义：The private modifier limits the visibility to the same class only
4. TS 是什么时候决定她们的 visibility 的？
   1. 是 Compilation time, 不是 Runtime.

### Type

1. `Type<T>` 是啥 ❓❓❓
2. Type-only Field Declarations: <https://www.typescriptlang.org/docs/handbook/2/classes.html#type-only-field-declarations>
3. interface vs type 的区别是啥

## Project Configuration

### 编译项目的方式

1. with command line. `tsc --project`
2. with compile file: tsconfig.json

### tsconfig.json

1. 位置：tsconfig.json 文件在哪个目录，就表示这个目录是 ts 项目的 root 目录。
2. 作用：用来指定当前项目的 root 路径和编译器选项配置 compiler options.
3. jsconfig.json: 跟 tsconfig.json 两个的作用差不多.
4. 配置选项
   1. compilerOptions: 编译器选项
   2. files: 指定一个可以在项目中包含的文件白名单。这些文件如果找不到就会报错。
   3. include: 指定一组文件名或者模式的数组，匹配的文件将会参与编译。文件的路径是文件相对于 tsconfig.json 的目录结构解析的。
   4. exclude：与 include 相反，排除的文件或模式数组。
   5. extends: 一些现成的，可以被继承的配置. 这样就可以只关注当前项目中自己的特有的配置
   6. rootDir: 表示哪一层是最终会导出文件的 root layer. “.”表示把当前层就是 root, 那么这一层的 其他 folder 也将会被打包进最后的 dist 中作为一层 folder.
   7. module: 用来指定编译器如何处理模块。esnext 表示使用最新版本的ECMAScript.
   8. lib: 用来指定默认要包含的一组 API，比如浏览器环境就需要 DOM.

   ``` c
      compilerOptions: {
         module: "esnext",
         sourceMap: true,
         removeComments: true,
         outFile: "../../build/tsc.js",
         outDir: "dist",
         rootDir: ".",
         declaration: false,
         moduleResolugtion: "node",
         emitDecoratorMetadata: true,
         experimentalDecorators: true,
         importHelpers: true,
         isolatedModules: true,
         target: "es2015",
         resolveJsonModule: true,
         lib: ["es2020", "dom"],
         strictNullChecks: true,
         paths: {
            "@slb-rcis/wpf-app-skeleton": [
               "libs/wpf-app-skeleton/src/index.ts"
            ],
            "@slb-rcis/wpf-app-skeleton/shared": [
               "libs/wpf-app-skeleton/shared/src/index.ts"
            ]
         },
      },
      compileOnSave: false,
      files: []，
      include: ["src/**/*"],
      exclude: ["**/*.spec.ts"],
      extends: "@tsconfig/node18/tsconfig.json",
   ```
