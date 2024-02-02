# Nx library

## Monorepo

1. 定义：

## Nx基础

### 前提概念

1. Workspace: 工作空间是一种在单个 repo 中设置多个软件包，并允许它们以依赖关系的形式交互的模式互动. Workspaces are a model of setting up multiple packages in a single repo and allowing them to interact with each other as dependencies.
2. Task: 表示完成的某一个工作。比如运行一个 script 命令，本质上是运行了某个东西，就可以说是某个 task. 比如 build task.
3. Application VS Library: <https://nx.dev/concepts/more-concepts/applications-and-libraries>

### CLIs

1. 执行 Lint 验证：`nx run-many -t lint`
2. 查看所有插件：`nx list`
3. 查看某个 plugin 具有的能力(like generators): `npx nx list @nx/angular`

### Nx CLI vs Angular CLI

1. 历史：Nx 曾经是 Angular CLI 中的 一个拓展 extension ，现在发展成了可与多个框架配合使用的完全独立的 fully standalone CLI.
2. Nx CLI 比 Angular CLI 的好处：
   1. Cache any target
   2. Run only tasks affected by a code change
   3. Split a large angular.json into multiple project.json files
   4. Integrate with modern tools
   5. Controllable update process

### Nx

1. 文档 <https://nx.dev/>
2. 定义：Nx 是一个功能强大的开源构建系统，提供用于提高开发人员生产力、优化 CI 性能和维护代码质量的工具和技术。
3. 本质：Nx is a tool.
4. 核心特点：
   1. 高效运行任务：Nx 并行运行任务，并根据任务之间的依赖关系对任务进行排序
   2. 本地/远程缓存：通过在本地和远程进行缓存，可以节省时间，避免不必要的 re-run 任务重运行
   3. 自动对依赖更新：如果您利用 Nx 插件，您将获得其他功能，例如代码生成和自动升级代码库和依赖项的工具。
   4. 打造您自己的：Nx 具有高度可定制性和可扩展性
5. 用处：
   1. 加速现有项目的本地和 CI 构建和测试（无论是单一存储库还是独立应用程序）
   2. 快速构建新项目（使用 Nx 插件），而无需配置任何较低级别的构建工具
   3. 轻松地将新工具（例如 Storybook、Tailwind 等）集成到您的项目中。
   4. 使用自定义生成器和 lint 规则确保一致性和代码质量
   5. 使用自动代码迁移功能更新您的框架和工具并保持您的工作空间常青
6. 架构：![Nx 架构](./assets/nx-architecture.svg)
   1. Nx包提供与技术无关的基本功能，例如：工作区分析、任务运行、缓存、分发、代码生成和自动代码迁移
   2. Plugins 是构建在 Nx 包提供的基本功能之上的 NPM 包。
      1. Nx 插件包含代码生成器、执行器（用于抽象较低级别的构建工具）和自动代码迁移，以使您的工具保持最新。
      2. Nx 无关技术，与此相反，Plugins 通常是特定于技术的。例如，@nx/react添加了对构建 React 应用程序和库的支持，@nx/cypress添加了 Cypress 的 e2e 测试功能。
      3. 插件消除了不同工具相互集成的任何摩擦，并提供实用程序使它们保持最新状态，从而提高了开发人员的工作效率。Nx 团队维护 React、Next、Remix、Angular、Jest、Cypress、Storybook 等插件。
      4. 您可以使用该@nx/plugin包轻松构建新插件，甚至自动化您的本地工作区。还有超过 80 个社区插件。
   3. Devkit是一组用于构建 Nx 插件的实用程序。
   4. Nx Cloud通过添加远程缓存和分布式任务执行来帮助扩展 CI 上的项目。它还通过与 GitHub、GitLab 和 BitBucket 集成并提供可搜索的结构化日志来改善开发人员的人体工程学。请访问nx.app了解更多信息。
   5. Nx Console是VSCode、IntelliJ 和 VIM的扩展。它提供代码自动完成、交互式生成器、工作区可视化、强大的重构等等。

### Monorepos

1. 定义：A monorepo or a mono repository is a single repository that stores all of the code and assets for all of your projects, rather than each product or library being stored in its own source control.
2. 相关概念：
   1. Code sharing 代码共享
      1. 定义：在 multiple projects 中共享 a function or a component 或者 在前后端共用一个 ts interface 去定义 network API interface.
      2. 缺陷：
         1. 一个团队可能会修改另一个团队的代码以满足自己的需求。解决办法：使用 codeowners 文件来明确地定义代码改变需要谁来 approve the PRs.
         2. 外部人员使用了内部代码，比如他们 import NOT from Index.ts public API, 而是直接导入了内部的代码并修改了，那就会引起问题。解决办法：Nx provides a lint rule named 'enforce-module-boundaries' 用来监控用户使用的代码不是从 library-root-level index.ts (这个是所有公共 APIs 的导出位置)中导出的，就会抛出一个错误。
         3. 项目用错库：解决办法：每个组织的规则不同，但都可以自动强制使用 tags 和 enforce-module-boundaries Lint rule
   2. Dependency Management Strategies ❓❓❓
      1. 独立维护依赖策略，在 package.json 中定义依赖项，这个策略有两个问题：
         1. 当代码使用了不同版本得依赖，这段作为 shared code 就很容易出问题还不好诊断
         2. 当开发者本地安装的 node_module 是正确的，但 package.json 里配置的版本是不同的，就会出现本地开发一切正常，但是已发布到生产环境就有问题且不好诊断。
      2. 单一版本策略：Single Version Policy enforces a single version for all dependencis acroll the codebase. Individual projects 仍任可以有一个 package.json 文件，但这个文件只是为了定义一些 metadata, 并不像常规的那样定义依赖。Nx 提供的 plugins 都带有 executor,这些执行器会 automatically 使用 Nx 提供的 dependency graph，将各个 package.json 中的依赖关系部分，自动填充到 build output 中，并自动填充一个 lock file.一旦开发人员删除了特定依赖的最后一次使用，本质上就会从 dependency graph 中断开关联，那该依赖项就会从 bundle 捆绑包中被移除。
   3. Code collocation 代码搭配
      1. 定义：简单来说，是吧多个库中的代码放进同一个库里
      2. 现状：很多大公司并不真的会简单地把代码都放在一起，因为 That's not enough.
      3. 弊端：
         1. Running unnecessary tests: 只要是 under the entire repository，所有的文件无论跟真正的改动相不相关，都会被执行 test 以检测有没有 breaks.
         2. No code boundaries: 都在一个 repository 里，没有办法限制人员对代码的引用。
         3. Inconsistant tooling: 不同团队需要的 command scripts 都放在 root-level package.json中，由 project.json 定义，并没有地方能给这些 tools 划分 scope, 这就导致需要开发者自己去记，增加了 mental overhead remembering which commands to use from project to project.
      4. Yarn and Lerna Workspace 帮忙提供了一些 npm 下载包的优化，但是他们都并不支持 monorepo 风格的开发 Monorepo-style
3. 本质：Monorepo = Nx + Code Collocation。 Nx 提供的工具可以让您享受到单一存储库的好处，同时又避免了简单代码搭配的缺点。Nx provides tools to give you the benefits of a monorepo without the drawbacks of simple code collocation.
4. Monorepo 的好处：
   1. Shared code and visibility
   2. Atomic changes
   3. Developer mobility
   4. Single set of dependencies
5. 用 Nx 拓展 monorepo:
   1. Consistent Command Execution 一致地命令执行：
      1. Executors 允许用一致的命令，用不同的工具，给每个项目执行不同的命令。
      2. 原文：Executors allow for consistent commands to test, serve, build, and lint each project using various tools.
   2. Consistent Code Generation:
      1. 一致地代码生成：Generators 允许自定义或者标准化组织内的项目约定和结构，就不需要重复地执行相同的手动配置任务。
      2. 原文：Generators allow you to customize and standardize organizational conventions and structure, removing the need to perform the same manual setup tasks repetitively.
   3. Affected Commands 只有受影响的命令：
      1. Nx affected commands 会分析源码、变化的上下文，然后只执行受源码变化影响的项目的任务。
      2. 原文：Nx’s affected commands analyze your source code, the context of the changes, and only runs tasks on the affected projects impacted by the source code changes.
   4. Distributed Cacheing 分布式缓存
      1. Nx 提供本地缓存，也支持命令执行的分布式缓存。当团队中有人执行一个 command task，分布式缓存下来后，团队里的其他人可以获取到缓存，如果再次执行该 task, 就会直接从 cache 中拿结果，把command execution speed 命令执行速度从分钟级降低到秒级。
      2. 优点：Nx 通过 distributed task execution and incremental build 分布式任务执行和增量构建，可以开发拓展海量的应用和库
      3. 原文：Nx provides local caching and support for distributed caching of command executions. With distributed caching, when someone on your team runs a command, everyone else gets access to those artifacts to speed up their command executions, bringing them down from minutes to seconds. Nx helps you scale your development to massive applications and libraries even more with distributed task execution and incremental builds.
6. 用 Nx 拓展 Organization ❓❓❓

### Package-Based Monorepo

1. 创建一个新的工作区: `npx create-nx-workspace@latest package-based --preset=npm` 会自动生成
   1. nx.json
   2. package.json. 在创建 workspace 之后，这里默认有个属性 `"workspaces": ["packages/*"]` 是告诉 NPM 给 packages 目录下能找到的所有包创建链接。Tell NPM to create links for all packages found in the packages directory. 这样就无需先将他们发布到 NPM 注册表。 ❓❓❓
   3. packages/：官方文档上说会自动创建一个 packages 文件夹，但实际操作中并没有，所以在后续的步骤中手动创建了。但默认的规则就是，packages 文件夹下的内容将会作为包的内容，所以还是要遵守这个命名规范的。
      1. 解释：在 Nx version 17 之前，@Nx 的包还叫 @nrwl，运行出来的命令里会有 packages folder
2. Create packages & build:
   1. 创建 packages folder 用来存储所有的包
   2. 创建包的 folder 名称，例如 packages/is-even/， 在 该包下创建 index.ts 和 package.json 两个文件
      1. index.ts: 源码
      2. package.json：对 is-event package 的描述。
      3. 注意这里的脚本用的是 tsc，需要安装 typescript: `npm i typescript -D -W`

      ``` c
      // package.json
      {
         "name": "is-even",
         "version": "0.0.0",
         "main": "dist/index.js",
         "devDependencies": {},
         "scripts": {
            "build": "tsc index.ts --outDir dist" // tsc 是 typescript 脚本
         }
      }
      ```

   3. Build the package: `npx nx build ${{packageName}}` 如 `npx nx build is-even`
   4. dist: 默认会把打包结果放进 dist folder. 目录结构变成：

      ``` c
      * package-based 
         * packages
            * is-even
               * dist
                  * index.js  // built result.
               * index.ts
               * package.json
      ```

3. 创建包的本地连接：Build Local linking of packages. 将会在 node_modules/ 中产生构建后的包
   1. 创建另一个 package is-odd, 跟创建 is-even 步骤一致，之后在 is-odd 中引用 is-even.
      1. 在 index.ts 源码中引用

         ``` c
         // packages/is-odd/index.ts
         import { isEven } from 'is-even'; // 直接引用包名 'is-even' 而不是通过相对路径 '../is-even/index.ts'
         export const isOdd = (x: number) => !isEven(x);
         ```

      2. 在 package.json 包配置文件中配置依赖

         ``` c
         // packages/is-odd/package.json
         {
            "name": "is-odd",
            "version": "0.0.0",
            "main": "dist/index.js",
            "devDependencies": {},
            "scripts": {
               "build": "tsc index.ts --outDir dist"
            },
            "dependencies": {
               "is-even": "*"  // 依赖项 这里的 * 是什么意思？❓❓❓
            }
         }
         ```

   2. 产生 npm 包: 在 workspace level 执行 `npm install`, 会分别生成 node_modules/is-even 和 node_modules/is-odd 分别响应 packages/is-even 和 packages/is-odd.
4. Task Dependencies
   1. 定义：packages 之间也有依赖关系，'build is-odd' 是一个 task, 它依赖 is-even，所以应该保证 'build is-even'这个 task 应该先完成。这就是 task dependencies.(Build Sequence 任务依赖构建顺序)
   2. 用法：workspace-level 的 nx.json 里默认设置了 targetDefaults 中的 dependsOn

      ``` c
      // package-based/nx.json
      {
         "extends": "nx/presets/npm.json",
         "$schema": "./node_modules/nx/schemas/nx-schema.json",
         "affected": {
            "defaultBase": "master"
         },
         "targetDefaults": {
            "build": {
               "cache": true,
               "dependsOn": ["^build"] // 表示将自动首先构建被依赖的包. 如果被以来的包之前已经build 过了，那就会直接从"缓存"中拿
            },
            "lint": {
               "cache": true
            }
         },
         "nxCloudAccessToken": "YzM2ZTk1NmQtNDRiNS00YTg5LTgyNGEtODU3OWE0ZjczNjIwfHJlYWQtd3JpdGU="
      }

      ```

5. Build Results:
   1. `npx nx build is-even` 将会在 packages/is-even/dist folder 下产生一个 index.ts 文件
   2. Cache Build Results：构建结果将会被自动缓存
6. 运行多个 build task: 
   1. 命令：`npx nx run-many -t build` 默认会把 packges/* 文件夹下所有的包都构建了。这是因为这个 run-many 是根据 root level 中的 nx.json 里的 targetDefaults.build.dependsOn 来决定的。
   2. 跳过缓存：重复构建会直接从缓存中拿结果，不想这样可以加上 --skip-nx-cache 的 flag `npx nx run-many -t build --skip-nx-cache`
   3. 仅对改变了的包构建：`npx nx affected -t build`

### Integrated Monorepo

1. Create a new workspace: `npx create-nx-workspace@latest myorg --preset=ts`
2. Create a package: 
   1. 命令：`npx nx generate @nx/js:library is-even --directory=packages/is-even --publishable --importPath=@myorg/is-even`
   2. Uses the @nx/js plugin's library generator to scaffold a new library named 'is-even'.
   3. The '--publishable' flag 确保同时生成了一个 package.json 文件和其中一个 'public' 目标属性可以调用，用来发布到 NPM.
   4. The '--importPath' 用来定义 the name of the NPM package.
   5. 注意：文档上的命令错了。`npx nx generate @nx/js:library is-even --directory=libs/is-even --publishable --importPath=@myorg/is-even`生成的文件都在 libs directory 下，后续的示例都是在 packages 下的，所以 libs 改成 packages.
   6. 生成的 project.json 里有可以给项目运行用的 targets meta data. 例如 build, publish, lint, test. 注意：平时 script 都是声明在 package.json 里，但可以在当前包中看到，package.json 中并没有 scripts, 但在命令行还是可以运行 npx nx build is-even, 这是因为实际上都是在 project.json 中管理的。这里有就可以了。
   7. 生成的文件层级：

      ``` c
      packages/
         └── is-even/
            ├── src/
            |  └── lib/
            |  |  ├── is-even.spec.ts
            |  |  ├── is-even.ts
            |  └── index.ts
            ├── project.json
            ├── package.json
            ├── ...
            └── tsconfig.json

      // packages/is-even/src/lib/is-even.ts 里默认生成的方法：
      export function isEven(): string {
         return 'is-even';
      }
      ```

3. 创建包的本地连接：Build Local linking of packages. 基于 tsconfig.base.json
   1. 当创建了 is-event, is-odd 两个包后，可以看到 tsconfig.base.json 的 compilerOptions.paths 数组中有两条数据，

      ``` c
      {
         "compilerOptions": {
            "paths": {
               "@myorg/is-even": ["packages/is-even/src/index.ts"],
               "@myorg/is-odd": ["packages/is-odd/src/index.ts"]
            }
         },
         "exclude": ["node_modules", "tmp"]
      }
      ```

   2. 引用的时候，就直接引用 @muorg/is-even 这种方式就可以了
4. Task Dependencies: 跟 Package-based Monorepo 一样，都是靠 workspace-level 的 nx.json 里默认设置了 targetDefaults 中的 dependsOn 来告诉 Nx 要用什么顺序来处理这些 tasks。
5. Build results:
   1. `npx nx build is-even` 结果将会产出在 workspace-level 生成一个新的文件夹 dist/packages/is-even folder.
   2. 生成的文件层级：

      ``` c
      * myorg
         * dist
            * packages
               * is-even
                  * src
                     * lib
                        * is-even.d.ts
                        * is-even.js
                        * is-even.js.map
                     * index.d.ts
                     * index.js
                     * index.js.map
                  * package.json
                  * README.md
      ```

6. Run multiple tasks: 跟 package-based monorepo 用法一样

### Angular Standalone

1. 注意：不要与 Angular standalone API 混淆，
2. 定义：a standalone project 是一个 non-monorepo 项目，在 root-level 只有一个应用程序。可以理解为 standalone 为 single-project.
3. 创建一个 angular standalone 项目
   1. 命令：`npx create-nx-workspace@latest myngapp --preset=angular-standalone` 取名为 myngapp
      1. 生成文件 nx.json: 在这里我们可以微调 Nx 的工作方式、定义可缓存操作、我们的任务管道以及 Nx 生成器的默认值。
      2. 此时 rootProject/src 下只有 app 一个文件夹，注意这里是 app，就表示单数，single-project
      3. 生成文件 project.json: Nx 使用此文件来定义可以运行的目标，类似于 Angular CLI 使用该angular.json文件的方式。
         1. 配置文档：<https://nx.dev/reference/project-configuration>
         2. project.json VS angular.json:
            1. 文档：<https://nx.dev/concepts/more-concepts/nx-and-angular> ❓❓❓
   2. 启动项目: `nx serve`
      1. 运行语法：![nx 命令语法](../assets/nx-run-target-syntax.svg)
      2. 所有在 package.json 中的 scripts, 例如 start, build, test 或者任何自定义的脚本命令， 都是在 project.json 中的 targets 里定义的。每个 target 都包含一个配置对象，告诉 Nx 如何运行该 target。
         1. 示例：

            ``` c
            {
               "name": "myngapp",
               "targets": {
                  "serve": {
                     "executor": "@angular-devkit/build-angular:dev-server",
                     "configurations": {
                     "production": {
                        "browserTarget": "myngapp:build:production"
                     },
                     "development": {
                        "browserTarget": "myngapp:build:development"
                     }
                     },
                     "defaultConfiguration": "development"
                  },
                  ...
               },
            }
            ```

         2. executor: 表示该命令的实际运行者。在 Angular API workspace 中，executor 是 builder 构建器；在 Nx workspace 中是 Nx plugins.
         3. options: 用来配置其他的属性，或者给 executor function 传进去一些 flags 标志来完成一些自定义的功能。
      3. Cache the task you run 缓存运行的任务
         1. 默认：上述 all of targets 默认被 Nx cached automatically 自动缓存. 当 re-run 一个命令甚至所有命令，会发现命令几乎是瞬间就执行结束了。在终端执行完命令后，能看到命令后面标注了存在匹配的 existing outputs match the cache, left as is. 现有输出与缓存匹配，保持原样.
         2. 指定要缓存的 task results：不是所有的 target 都是 cacheable 可缓存的。可以在 nx.json 中配置
            1. 文档：<https://nx.dev/core-features/cache-task-results>
            2. 示例：

               ``` c
               // Nx.version >= 17
               {
                  "targetDefaults": {
                     "build": {
                        "cache": true
                     },
                     "test": {
                        "cache": true
                     }
                  }
               }
               ```

         3. 指定决定Cache 的条件和结果

            ``` c
            // Globally configurate in nx.json
            {
               "targetDefaults": {
                  "build": {
                     "inputs": ["{projectRoot}/**/*", "!{projectRoot}/**/*.md"],
                     "outputs": ["{workspaceRoot}/dist/{projectName}"]
                  }
               }
            }

            // Project-level configuration in project.json
            {
               "name": "some-project",
               "targets": {
                  "build": {
                     ...
                     "inputs": ["!{projectRoot}/**/*.md"],
                     "outputs": ["{workspaceRoot}/dist/apps/some-project"],
                     ...
                  }
                  ...
               }
            }
            ```

         4. Nx 都 restore 存了什么
            1. the terminal output
            2. the files & artifacts created as a result of running the task (e.g. your build or dist directory)
         5. 支持 remote caching 远程缓存：
            1. 通过连接到 Nx Cloud: `npx nx connect`
            2. 未完待续 ❓❓❓
         6. 取消缓存：两种方法：
            1. `nx build projectName --skip-nx-cache`.如果是 Nx Cloud 远程缓存，使用 `--no-cloud` flag to skip remote caching.
            2. 保证该模块没有在 targetDefaults 的缓存目录中
         7. 清空本地缓存：`npx nx reset`
   3. Deploy the application: `npx nx build`
      1. output: 在 root 根文件夹下新增了一个 'dist/{{projectName}}' 文件夹, 这里就是 dist/myngapp.
   4. Create Components: @nx/angular:component
      1. 命令：`npx nx g @nx/angular:component hello-world --directory=src/app/hello-world --standalone --dry-run`
      2. --dry-run 不会真正创建文件，只为了 first check the output 首先检查输出，it means no change were make. 如果想要真正执行该 generator 创建文件, 移除这个 flag。
      3. Where to place 组件放哪: --directory 指定组件创建的 local subfolder
   5. Create Libraries: @nx/angular:library
      1. 命令：

         ``` c
            nx g @nx/angular:library products --directory=modules/products --standalone
            nx g @nx/angular:library orders --directory=modules/orders --standalone
            nx g @nx/angular:library shared-ui --directory=modules/shared/ui --standalone
         ```

      2. 生成： modules folder 里: Use --directory flat to place libraries in to a subfolder under 'modules' folder.
         1. 注意，library 会被放进 modules folder.
         2. modules folder 跟 src folder， 跟 tsconfig.base.json 是并列的，都是 root-level 的。
         3. 名为 shared-ui 的库，实际创建出来的 path 是 shared/ui，变成了两个 levels。
      3. 示例：The output of `nx g @nx/angular:library orders --directory=modules/orders --standalone`

         ``` c
         >  NX  Generating @nx/angular:library

         √ What should be the project name and where should it be generated? · orders @ modules/orders
         CREATE modules/orders/project.json
         CREATE modules/orders/README.md
         CREATE modules/orders/tsconfig.json
         CREATE modules/orders/tsconfig.lib.json
         CREATE modules/orders/src/index.ts
         CREATE modules/orders/jest.config.ts
         CREATE modules/orders/src/test-setup.ts
         CREATE modules/orders/tsconfig.spec.json
         CREATE modules/orders/src/lib/orders/orders.component.html
         CREATE modules/orders/src/lib/orders/orders.component.spec.ts
         CREATE modules/orders/src/lib/orders/orders.component.ts
         CREATE modules/orders/src/lib/orders/orders.component.css
         CREATE modules/orders/.eslintrc.json
         UPDATE tsconfig.base.json
         ```

         1. 有自己的 projece.json 用来配置可运行的 targets。
         2. index.js 是整个 library workspace exported 的 "public APIs" 的入口。注意：要确保该库中要暴露的组件在本文件中被 export 了，同时应该只 export 外界用的必要的部分。
         3. Update tsconfig.base.json ，在 paths 数组中添加了这个 orders 的路径。![新增 library 会在 tsconfig.base.json 中注册](./assets/changeOn_tsconfig.base.json_whenCreateLibrary.png)
      4. Library aliase 库别名: 所有自动生成的库，都在 tsconfig.base.json 中被创建了别名。All libraries we generate automatically have aliases created in the root-level tsconfig.base.json. 这样我们在导入它们的时候就很容易。
   6. Import libraries into the Angular application

      ``` c
      // src/app/app.routes.ts
      import { Route } from '@angular/router';

      export const appRoutes: Route[] = [
         {
            path: 'orders',
            loadComponent: () =>
               import('@myngapp/orders').then((m) => m.OrdersComponent),
         },
      ];

      // app.component.html
      <router-outlet></router-outlet>

      // 启动后访问 http://localhost:4200/orders
      ```

4. 可视化项目结构：`nx graph`
5. Module Boundary Rules 模块边界规则：使用模块边界规则施加约束，限制模块引用 Imposing constraints with Module Boundary Rules
   1. 定义：允许模块之间怎么互相引用的规则。
   2. 约束的两个维度：
      1. type: feature | utility | data-access | ui | more..
      2. scope(domain): 开发中定义的 scope。比如 products | orders | shared.
   3. 打 tags：
      1. 定义：Nx 带有一个通用机制，允许您为项目分配“标签”。“标签”是您可以分配给项目的任意字符串，稍后在定义项目之间的边界时可以使用这些字符串。
      2. 用法：在 target module 的 project.json 中，配置 `tags: []`

         ``` c
         // myngapp\modules\products\project.json
         {
            "name": "products",
            "tags": [
               "type:feature",
               "scope:products"
            ],
         }
         // myngapp\modules\orders\project.json
         {
            "name": "orders",
            "tags": [
               "type:feature",
               "scope:orders"
            ],
         }
         // myngapp\modules\shared\ui\project.json
         {
            "name": "shared-ui",
            "tags": [
               "type:ui",
               "scope:shared"
            ],
         }
         ```

   4. Enforce module boundaries 执行边界约束：
      1. 定义4种约束
         1. type:feature should be able to import from type:feature and type:ui
         2. type:ui should only be able to import from type:ui
         3. scope:orders should be able to import from scope:orders, scope:shared and scope:products
         4. scope:products should be able to import from scope:products and scope:shared
      2. 借助 ESLint rule. 在 .eslintrc.base.json 中的顶层结构上，添加一个 depConstraints 属性。![执行模块边界约束](./assets/Imposing_constraints_with_Module_boundary_Rules.png)
   5. 验证：执行 lint 命令行

      ``` c
      // 在 products 里用 @myngapp/orders 这种方式导入
      import { Component } from '@angular/core';
      import { CommonModule } from '@angular/common';

      import { OrdersComponent } from '@myngapp/orders';// It is not allowed. 

      @Component({
         selector: 'myngapp-products',
         standalone: true,
         imports: [CommonModule, OrdersComponent],
         templateUrl: './products.component.html',
         styleUrl: './products.component.css',
      })
      export class ProductsComponent {}

      // 执行 `nx run-many -t lint`, 在控制台报错
      √  nx run orders:lint  [existing outputs match the cache, left as is]
      √  nx run myngapp:lint  [existing outputs match the cache, left as is]
      √  nx run shared-ui:lint  [existing outputs match the cache, left as is]
      √  nx run e2e:lint  [existing outputs match the cache, left as is]

      ×  nx run products:lint
         Linting "products"...
      NX   Running target lint for 5 projects
      C:\Personal-XXT\Projects\Nx\myngapp\modules\products\src\lib\products\products.component.ts
      5:1  error  A project tagged with "scope:products" can only depend on libs tagged with "scope:products", "scope:shared"  @nx/enforce-module-boundaries
         ⠧    nx run products:lint
      ✖ 1 problem (1 error, 0 warnings)
         √    4/4 succeeded [4 read from cache]
      Lint errors found in the listed files.
      ```

### Angular Monorepo

1. CLI 创建一个工作空间：`npx create-nx-workspace@latest angular-monorepo --preset=angular-monorepo` 
   1. angular-monorepo 是整个 repo 的 root name。
2. 有了 workspace 之后，CLI 会提示 命名 Applicaiton name: 例如 angular-store。
   1. angular-store 只是一个 app 的 name.
   2. 位置：放在 angular=monorepo/apps/ 下。
   3. apps 下面可以放 多个 apps.
   4. 此时还没有 libs 文件夹。
3. Serve the App: 在 workspace-level 执行 `nx serve angular-store`，
   1. serve 等命令是在 app-level 的 project.json 中维护的。
   2. 此时只是有了这个 app, 但没有引入任何内容。是个空壳。 Nx 默认放了一个 welcome 页面
   3. executor 组成格式："executor": "@angular-devkit/build-angular:dev-server" 是 `<plugin>:<executor-name>`。其中 plugin 是一个包含 Nx plugin 的 NPM 包。 executor-name 指向的是运行这个 task 的那个 function.
   4. options: 是额外可以选择性传进去的属性 properties and flags.
   5. 示例：

      ``` c
      {
         "name": "angular-store",
         "targets": {
            "serve": {
               "executor": "@angular-devkit/build-angular:dev-server", // 1. executor
               "defaultConfiguration": "development",
               "options": {
                  "buildTarget": "angular-store:build" // 2. flags
               },
               "configurations": {
                  "development": {
                     "buildTarget": "angular-store:build:development",
                     "hmr": true
                  },
                  "production": {
                     "buildTarget": "angular-store:build:production",
                     "hmr": false
                  }
               }
            },
            ...
         },
      }
      ```

   6. Q&A：
      1. 遇到错误：Inner Error: ReferenceError: structuredClone is not defined。解决办法，当前node 版本是16， 这个 structuredClone 要求 node version 17+.

4. Add another application: `npx nx g @nx/angular:app inventory --directory=apps/inventory --dry-run` app 的名字是 inventory, 位置也是在 apps/ folder 下。这个时候，可以在控制台看到哪些文件会被创建出来，但实际的文件列表没有变化，这是因为用了 ‘dayRun' flag， that means no change were made. 就是其实并不真的会做出改变。真正创建，把这个 flag 移除。
5. Create local libraries:
   1. 命令：在 libs 里创建 libraries. 此时会在 libs/ folder 下创建三个 folder. 每个 folder 包含 lib/ folder + index.ts 用以 exprot public APIs。

      ``` c
      nx g @nx/angular:library products --directory=libs/products --standalone
      nx g @nx/angular:library orders --directory=libs/orders --standalone
      nx g @nx/angular:library shared-ui --directory=libs/shared/ui --standalone
      ```

   2. Import Alias: 所有自动生成的 libraries 都会在 "root-level tsconfig.base.json" 中有一个 用于 paths 属性的 alias 重命名, 用于更方便地 被other library or application 去 import

      ``` c
      // root-level tsconfig.base.json
      {
         "compilerOptions": {
            ...
            "paths": {
               "@angular-monorepo/orders": ["libs/orders/src/index.ts"],
               "@angular-monorepo/products": ["libs/products/src/index.ts"],
               "@angular-monorepo/shared-ui": ["libs/shared/ui/src/index.ts"]
            },
            ...
         },
      }
      ```

   3. 在 products lib 中创建一个 component: `nx g @nx/angular:component product-list --project=products --standalone --export`, 最终生成的路径是：`angular-monorepo/lib/products/src/lib/product-list/`.此时 products/src/lib/ folder 下有两个文件夹，product-list + products, 这时，index.ts 里应该有两个 export 来导出 API 了。
6. Use libs in apps: 
   1. 通过 routes: 在apps/app-store 里使用 libs/pruducts. 运行命令 `nx serve angular-store` 访问 localhost:4200/products

      ``` c
      // apps/angular-store/src/app/app.routes.ts
      import { Route } from '@angular/router';
      import { NxWelcomeComponent } from './nx-welcome.component';
      export const appRoutes: Route[] = [
         {
            path: 'products',
            loadComponent: () =>
               import('@angular-monorepo/products').then((m) => m.ProductListComponent),
         },
      ];
      ```

   2. 直接在组件中使用：

      ``` c
      // apps/inventory/src/app/app.component.ts
      import { Component } from '@angular/core';
      import { ProductListComponent } from '@angular-monorepo/products';
      @Component({
         standalone: true,
         imports: [ProductListComponent], // import library
         selector: 'angular-monorepo-root',
         templateUrl: './app.component.html',
         styleUrls: ['./app.component.css'],
      })
      export class AppComponent {
         title = 'inventory';
      }

      // apps/inventory/src/app/app.component.html
      <angular-monorepo-product-list></angular-monorepo-product-list>

      // 执行命令 nx serve inventory 可以看到 product-list ui.
      ```

7. Nx graph: `nx graph`.
   1. 结果：![nx graph](./assets/nx-graph-result.png)
   2. 对比：通过 route 可能引用的用 虚线连接了，在组件里直接引用的用了实线
8. Imposing Constraints with Module Boundary Rules 跟 Angular Standalone 里一样。
9.  注意，root-workspace 下有 nx.json + package.json, 无 project.json; 在 apps/angular-store/ 中有project.json, 无 package.json.

### Node Standalone ❓❓❓

### Nx Executors

### Nx Generators

1. 定义：与 Angular API 依靠 Schematic 相似，Nx 依靠 generator 具有生成代码的能力。
2. 成员：
   1. `@nx/workspace:move`: 将项目移动到工作区中的另一个文件夹Move a project to another folder in the workspace.

### Nx Plugins

1. 查看所有插件：执行 `nx list`
2. 查看某个 plugin 都集成了哪些 generators: 比如 @nx/angular package, 执行 `npx nx list @nx/angular`，在 outputs 可以看到有 generators: ... 列表。

### Practice

1. #### Use @Nx/plugin to scaffold a new plugin

2. #### Use Devkit utilities to build Nx plugins

3. #### Use Nx Cloud

4. #### How to use different versions for the same library used in different projects within a monorepo? ❓❓❓

## Other package managers

1. Yarn
2. NPM
3. PNPM
4. Yarn vs NPM vs PNPM

## Nx VS Tuiborepo

## Module federation 模块联邦  ❓❓❓

1. 定义：Module federation 模块联合是一种可以将代码分割成更小的可部署模块的方法，这些模块可以在应用程序之间在运行时共享和使用。Module Federation is a method in which code can be split into smaller deployable modules that can be shared and consumed at runtime between applications.
2. Webpack: 自从在Webpack中添加ModuleFederationPlugin以来，它近年来变得越来越流行。Nx 通过 Webpack 添加了对模块联合的开箱即用支持，使其更易于使用、更简单，并利用了一些只能在 monorepo 中实现的独特优势。
3. 架构：❓❓❓
   1. host:
      1. 定义：A host is an application that consumes federated modules from remote applications at runtime.
      2. 当您编写主机应用程序时，您从远程导入该模块，就好像它是构建的一部分一样，但在构建时，Webpack 知道该模块仅在运行时存在，并且仅在它向相应的远程应用程序来获取 JS 包。然后，联合模块将被执行，就好像它始终是host应用程序的一部分一样。
   2. remote: A remote is an application that exposes a federated module that can be fetched over the network at runtime.
   3. federated module：定义：A federated module is any valid JavaScript module that is exposed by a remote application with the aim that it will be consumed by a host application.
4. Common pitfalls 常见陷阱 ❓❓❓
5. Nx support: Nx 为 React 和 Angular 的模块联合提供开箱即用的支持。有许多功能可以在为您的应用程序开发模块联合架构时提供帮助 ❓❓❓
   1. Generators - to aid in scaffolding remotes, hosts and federated module
   2. Executors - to aid in building your applications with Module Federation and for great DX when developing locally
   3. Type Safety - allowing for type-safety between hosts and remotes to catch issues early and to take advantage of autocompletion in IDEs
   4. Versioning of Libraries - to aid in preventing some common issues regarding incompatible package versions being used by federated modules
   5. Scaling DX - techniques to ensure a smooth DX regardless of the number of remotes in the workspace
6. Use Cases
   1. Faster Builds
   2. Independent Deployability