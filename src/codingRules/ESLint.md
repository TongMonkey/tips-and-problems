# ESlint

## ESLint Tools

### 定义

1. ESLint 是一个用来检测 js code 的 tool, 目的是避免错误
2. 安装前提：必须安装了 Node
3. CLI:
   1. 创建配置文件：为一个项目初始化安装和配置 ESLint: `npm init @eslint/config`. 这个命令有个前提，就是必须有 package.json 文件，否则会报错提示你先运行 npm init 或者 yarn init 来创建一个。初始化后，将会产生一个配置文件名为 `.eslintrc.{js, yml, json}`
   2. 想安装某个指定的配置，可以用 -- config conf1,config2 或者 -- config conf1, -- config conf2 这样的后缀，来指定要安装的 package name. 例如:

        ``` shell
        npm init @eslint/config -- --config semistandard,standard
        npm init @eslint/config -- --config semistandard --config standard
        ```

   3. 想单独检测某个文件：`npx eslint file.js` 或者 `yarn run eslint file.js`
   4. 检测时使其自动修复的命令是: ❓❓❓

### Rules

1. 定义：ESLint 是完全可插入的 tool, 里面的每一个 rule 本质都是一个 plugin. 每一个 rule 都用来验证某一种预期，并且指示当没有符合预期时应该怎么做。Rule 可以包含其他 optional specific configurations.
2. 常用 rules:

### Plugins

1. 定义：一个 ESLint plugin 是一个 npm module, 包含 a set of ESLint rules + 配置 + processors 处理器 + 环境。一般 plugin 包含一些 custom rules 自定义规则。
2. 用途：Plugins 可以用于强制执行某个 style guide 样式指南、支持 js 的拓展例如 typescript (@typescript-eslint/eslint-plugin)、支持一些库例如 react、支持一些框架例如 angular (@angular-eslint/eslint-plugin)

### Parsers

1. 定义：一个 parser 是一个解析器，具有能把代码转化成 abstract synctax tree 抽象语法树 的能力。
2. 用途：解析器用来将代码 convert 转换成能被 ESLint 计算的 abstract synctax tree 抽象语法树。
3. 默认情况下使用的是 ESpree parser, 这个解析器会跟标准的 JS 保持版本兼容。由 eslint 官方团队维护。

### Q&A

1. 怎么把rules 封装到 plugin 中使用
2. 检测问题时自动修复的命令是什么？