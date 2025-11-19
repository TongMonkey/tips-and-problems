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


### 类型应用

1. readonly win: (Window & typeof globalThis) | null
   * 这是一个交集类型（intersection type），表示一个同时具有 Window 和 globalThis 类型的对象。实际上，在浏览器中，window 对象确实同时具有这两种类型的属性和方法。

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

### 修饰符

### 关键字标识符

1. override: 用于明确表示一个方法在子类中是对父类方法的重写。这有助于提高代码的可读性和安全性，确保在子类中重写的方法确实存在于父类中。如果父类中没有相应的方法，TypeScript 编译器会抛出错误. 如果没有会被报错：“This member cannot have an 'override' modifier because it is not declared in the base class”

   ``` code
      class Parent {
         greet(): void {
            console.log("Hello from Parent!");
         }
      }

      class Child extends Parent {
         override greet(): void {
            console.log("Hello from Child!");
         }
      }

      const child = new Child();
      child.greet(); // 输出: "Hello from Child!"
   ```

### Type

1. `Type<T>` 是啥 ❓❓❓
2. Type-only Field Declarations: <https://www.typescriptlang.org/docs/handbook/2/classes.html#type-only-field-declarations>
3. interface vs type 的区别是啥

## Project Configuration

### 编译项目的方式

1. with command line. `tsc --project` ❓❓❓
2. with compile file: tsconfig.json

### tsconfig.base.json

1. 作用：通常用于大型 TypeScript 项目或多项目仓库中，它包含了共享的 TypeScript 编译配置，可以被其他 tsconfig 文件继承。这个文件有助于集中管理常见的编译选项，减少重复配置，提高配置的可维护性和一致性

   ``` code
      {
         "compileOnSave": false, // 保存文件时，是否自动重新编译项目
         "compilerOptions": { // 这个对象包含 TypeScript 编译器的各种配置选项
            "rootDir": ".", // 指定项目的根目录。所有输入文件的路径都会相对于这个目录进行解析。在这里 “.” 它设置为当前目录
            "baseUrl": ".", // 配置模块解析的基路径。在这里 “.” 它设置为当前目录。这通常用于配置 paths 选项，使得模块路径可以相对于 baseUrl 来解析
            "isolatedModules": false, //设置为 false 表示 TypeScript 编译器不会对每个文件单独进行编译。这通常用于与 Babel 或其他工具联合使用时，确保 TypeScript 的类型检查能够跨文件进行
            "target": "ES2022",
            "useDefineForClassFields": false,
            "paths": {
               "@sdo/entitlement": ["libs/entitlement/src/index.ts"],
               "@sdo/shared": ["libs/shared/src/index.ts"]
            }
         },
         "extends": "@slb-rcis/eslint-plugin-wpf/tsconfig.base.json"
      }
   ```

2. Detailed:
   1. "baseUrl" 配合 “path" 使用

      ``` code
         // 示例项目结构
         my-project/
         ├── src/
         │   ├── app/
         │   │   └── app.module.ts
         │   ├── utils/
         │   │   └── helpers.ts
         │   └── index.ts
         └── tsconfig.json

         {
            "compilerOptions": {
               "baseUrl": "./src" //作用: baseUrl 设置为 ./src，表示所有模块解析的基准路径是 src 目录
            }
         }
         {
            "compilerOptions": {
               "baseUrl": "./src",
               "paths": {
                  "@app/*": ["app/*"],
                  "@utils/*": ["utils/*"]
               }
            }
         }
         // 使用路径别名导入
         import { helperFunction } from '@utils/helpers';
         import { AppModule } from '@app/app.module';

      ```

   2. isolated Modules：false
      1. 作用: 控制是否对每个文件进行独立编译。设置为 false 表示不会对每个文件进行独立编译，而是按照整个项目进行编译. 
      2. 默认值是 false, 表示适用于标准 TypeScript 编译流程
      3. 优点：对于大型项目，传统的编译流程可能会更高效，因为编译器可以进行跨文件优化和类型检查
      4. 值为 true 时：设置 isolatedModules 为 true 的情况通常是当你使用 Babel 等编译工具，而不是 TypeScript 编译器进行编译。Babel 等工具通常对每个文件单独编译，不进行跨文件检查和优化
      5. 跨文件检查和优化：是指编译器能够在多个文件之间进行类型检查、引用检查和依赖关系分析，从而确保整个项目的代码一致性和正确性。这种检查和优化有助于发现潜在的错误，提高代码质量和性能

### tsconfig.json

1. 作用：是 Typescript 项目的配置文件，用于指定 compiler options 编译选项和项目结构，指定当前项目的 root 路径
2. 位置：tsconfig.json 文件在哪个目录，就表示这个目录是 ts 项目的 root 目录
3. jsconfig.json: 跟 tsconfig.json 两个的作用差不多
4. 一个项目里有几个 tsconfig.json 文件？
5. 配置选项
   1. compilerOptions: 编译器选项
   2. files: 指定一个可以在项目中包含的文件白名单。这些文件如果找不到就会报错。
   3. include: 指定一组文件名或者模式的数组，匹配的文件将会参与编译。文件的路径是文件相对于 tsconfig.json 的目录结构解析的。
   4. exclude：与 include 相反，排除的文件或模式数组。
   5. extends: 一些现成的，可以被继承的配置. 这样就可以只关注当前项目中自己的特有的配置
   6. rootDir: 表示哪一层是最终会导出文件的 root layer. “.”表示把当前层就是 root, 那么这一层的 其他 folder 也将会被打包进最后的 dist 中作为一层 folder.
   7. module: 用来指定编译器如何处理模块。esnext 表示使用最新版本的ECMAScript.
   8. lib: 用来指定默认要包含的一组 API，比如浏览器环境就需要 DOM.

   ``` code
      {
         "extends": "../../tsconfig.base.json", //作用：继承另一个 tsconfig.json 文件的配置。这使得项目可以共享一些通用配置，而不需要重复定义
         "files": [], //作用：显式列出要编译的文件。这里是一个空数组，表示没有单独列出文件，通常是通过 include 和 exclude 来控制要编译的文件
         "include": [],
         "exclude": [],
         "references": [ //作用：设置项目间的依赖关系，这对于大型项目或多包项目很有用。它引用了两个其他的 tsconfig 文件，表示当前项目依赖于这两个项目
            {
               "path": "./tsconfig.lib.json"
            },
            {
               "path": "./tsconfig.spec.json"
            }
         ],
         "compilerOptions": { //作用：设置 TypeScript 编译器的选项
            "target": "ES2022", //指定编译输出的 JavaScript 版本，这里是 ES2022
            "forceConsistentCasingInFileNames": true, //强制文件名一致的大小写
            "strict": true, //启用所有严格类型检查选项
            "noImplicitOverride": true, //强制方法必须明确使用 override 关键字
            "noPropertyAccessFromIndexSignature": true, //禁止通过索引签名来访问属性，即“点操作符”来访问索引签名
            "noImplicitReturns": true, //如果函数没有显式返回值，TypeScript 会报错
            "noFallthroughCasesInSwitch": true, //防止 switch 语句中的 case 语句穿透
            "useDefineForClassFields": false //控制是否使用 define 属性来声明类字段。设置为 false 时，TypeScript 不会使用 define 属性声明类字段，而是使用传统的方式
         },
         "angularCompilerOptions": { //作用: 设置 Angular 编译器的选项
            "enableI18nLegacyMessageIdFormat": false, //设置为 false 时，禁用遗留的 i18n 消息 ID 格式
            "strictInjectionParameters": true, //设置为 true 时，启用严格的依赖注入参数检查
            "strictInputAccessModifiers": true, //设置为 true 时，启用严格的输入访问修饰符检查
            "strictTemplates": true //设置为 true 时，启用严格的模板检查
         }
      }
   ```

6. Details
   1. "noPropertyAccessFromIndexSignature": true, //禁止通过索引签名来访问属性，即禁止“点操作符”来访问索引签名

      ``` code
         interface MyObject {
            [key: string]: number;
         }
         // when "noPropertyAccessFromIndexSignature": true
         const obj: MyObject = { a: 1, b: 2 };
         console.log(obj.a); // 编译错误: Property 'a' comes from an index signature, so it must be accessed with ['a']
         console.log(obj['a']); // 输出: 1
      ```

### 在 angular 项目中，有几个 tsconfig.json 文件？

1. tsconfig.josn: 在根目录下的主配置文件, 通常包含通用的编译选项
2. tsconfig.app.json: 用于在 Angular 项目中定义特定于应用程序的 TypeScript 编译选项。它继承和扩展了全局的 tsconfig.json 配置文件，提供了更细粒度的控制，用于设置应用程序级别的编译选项和文件包含规则。它通常位 project 的目录下.
3. tsconfig.spec.json: 用于配置单元测试代码的编译选项。它通常位于项目的 src 目录下
4. tsconfig.e2e.json: 用于配置端到端测试代码的编译选项。它通常位于项目的 e2e 目录下
5. tsconfig.worker.json: 如果项目中使用了 Web Workers，可以添加这个配置文件来单独配置 Web Workers 的编译选项
