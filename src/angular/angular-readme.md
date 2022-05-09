## Angular
1. 视频课：https://www.bilibili.com/video/BV1oS4y1c7or?p=1
2. 视频课：https://www.acfun.cn/v/ac25920410_1

### Angular vs Angular.js
1. 定义：angular是由Google维护的一款开源javaScript。
2. 版本：Anguar1.5叫做angularJs，Angular4.0称为Angular，Angular1.5到Angular4.0是完全重写。

### 相关知识点
1. 架构：angular是一种组件架构，用户可以与组件交互，组件之间互相路由，组件和服务之间通过依赖注入调用，服务调用webSocket与服务器端发生http通信。
2. 基础语言：Typescript
3. js：基于Es6开发
4. 入口：/src/index.html+main.ts+style.css

### 样式问题
1. 导入全局样式的方法
   1. 在入口样式 style.css 文件中导入 
      ```
      // 这个~波浪号代表相对 node_module 文件夹
      @import "~bootstrap/dist/css/bootstrap.css"
      ```
   2. 在 入口模版 index.html 中引入外链
   3. 在文件根目录下的 angular.json 中，加入样式数组
      ```
      // angular.json
      "styles":[
         "./node_modules/bootstrap/dist/css/bootstrap.min.css",
         "src/style.css"
      ]
      ```

### angular/cli 
1. 常规创建 ng new angular-demo
2. 精简创建 ng new angular-demo -minimal 最小化，会创建一个精简的项目，不会包含 karma *spec.ts 等单元测试相关，并且也会把 html/css/ts 文件统一都打进一个 ts文件里
3. 精简创建 ng new angular-demo --inlineTemplate 创建一个的项目，使 html 文件和 ts文件是分开的
4. 总结第2、3点，可以使用 ng new angular-demo -minimal --inlineTemplate 最合适
5. --skipGit=true 会跳过设置git
6. --skip-install 会跳过自动安装依赖，可手动安装
7. --style=css 设置项目的css的方式
8. --routing=false 不创建路由文件
9. --inlineStyle=true 则组件类文件+组件样式文件会合并
10. --prefix="xxt" 指定组件默认前缀 默认是app 例如 app-menu-index 

### 启动命令
1. ng serve
2. --open=true 应用构建完成后在浏览器中运行
3. --hmr=true 开启热更新
4. hmrWarning=false 禁用热更新警告
5. --port=1234 更改应用的运行端口 默认4200


### 常见问题
1. 用cnpm install @angular/cli 可能会有问题，提示无权限安装，还是用npm直接安装吧
2. 一直卡在 installing packages: 可以 ng new projectName --skip-install 之后在项目里用淘宝镜像安装依赖 cnpm intall

### 组件的组成
1. 组件类class
2. 组件模版html
   1. 数据绑定：
      1. 讲组件类中的数据显示在组件模版中，当组件类中的数据发生变化，会自动同步到组件模版中。简言之就是，数据驱动DOM
      2. 插值表达式：{{}} 
   2. 属性绑定：
      1. 普通属性：
3. 组件样式css

### 获取原生DOM对象
1. 获取一个元素：利用 模版 #name 
   1. 给模版对象设置一个模版引用变量 username，通过模版名称直接取得DOM ,从而可以获取事件对象的值
      ```
      <input #username/>
      <button (click)="share(username.value)">分享</button>
      // share(val){// val即为input输入}
      ```
2. 获取一个元素：利用 @ViewChild + #name 模版引用 
   ```
   <p #username></p>
   class AnotherComponent implements AfterViewInit {
      @ViewChild("username"): nickname: ElementRef<HTMLParagraphElement> | undefined
      ngAfterViewInit(){
         console.log(this.nickname?.nativeElement)
      }
   }
   ```
3. 获取一组元素：利用 @ViewChildren
   ```
   <ul>
      <li #items></li>
      <li #items></li>
      <li #items></li>
   </ul>
   class AnotherComponent implements AfterViewInit {
      @ViewChildren('items') items: QueryList<HTMLElement> | undefined
      ngAfterViewInit(){
         // console.log(this.items) items里有一个_result私有属性里才是真正的结果，但是私有属性不建议直接访问，可以通过 .toArray将结果转化为数组
         console.log(this.items?.toArray());  //[ElementRef, ElementRef, ElementRef]
      }
   }
   ```


### 双向绑定 ngModel
1. 定义：数据在组件类和组件模版中双向同步
2. 语法：`[(ngModule)]="组件类中属性"`
   1. 使用ngModel: 
      ```
      // 先在根模块中导入FormsModule依赖：
      import { FormsModule } from '@angular/forms';
      // 并在imports中导入FormsModule以供所有组件使用
      @NgModule{
         imports: [FormsModule]
      }
      ``` 
   2. 用法：
      ```
      <input [(ngModel)]="title">
      <p>{{title}}</p>
      ```
   3. 注意：ngModel 只对表单元素有效！！
3. 表单元素通过绑定ngModel的引用，可以拿到当前组件的信息，通过引用获取到验证的信息
   1. 通过ngModel跟踪修改状态与有效性验证，使用三个CSS类来更新控件 ![表单用ngModel添加CSS](../assets/表单用ngModel添加样式.png)




### @Component 里几个常用选项的含义
1. selector：css选择器用于在模版中标记出该指令，并触发该指令的实例化
2. template：组件的内联模版
3. templateUrl: 组件模版文件的URL
4. styleUrls: 组件央视文件
5. styles: 组件内联样式

### 属性的写法
1. class：
    ```
    // 都可以
    [class.big-btn] = "true" //单一类样式
    [class] = "'big-btn big-btn2'" 
    [class] = "classList" // 需要在ts中定义变量classList: string = "big-btn big-btn2"
    [class] = "['big-btn', 'big-btn2']"
    [class]="{'big-btn':1+1===2,'big-btn2': 1+1===3}"
    ```
2. style
   ```
   [style.width] = "300px" //单一样式
   [style.width.px] = "300" // 也可以，但不如上边的常用
   [style] = "'width:300px, color:red'" 
   [style] = "{'width':'300px', 'color': 'red'}"
   ```
3. ngClass 相当于绑定了一个class
   ```
   // class="myClass"
   [ngClass] = "{'myClass': isActive}" // 在ts中定义 isActive:boolean = true
   ```
4. ngStyle
   ```
    [ngStyle] = "{'color': isActive ？'red' : 'blue'}" // 在ts中定义 isActive:boolean = true
   ```

### 指令
1. 属性指令：
   1. 定义：修改现有元素的外观或者行为，使用`[]`包裹
   2. 分类
      1. `[ngSwitch]` 注意写法，不是带星的
         1. 注意：内部的选项是结构指令：*ngSwitchCase *ngSwitchDefault
            ```
             <div [ngSwitch]="type">
                 <p *ngSwitchCase="1">1</p>
                 <p *ngSwitchCase="2">2</p>
                 <p *ngSwitchDefault>0</p>
             </div>
            ```
      2. `[hidden]`: 根据条件显示 DOM 节点的显隐，与 display:none 同理
         ```
         <div [hidden]="1+1===2"></div>
         ```
2. 结构指令
   1. 定义：修改 DOM 节点从而修改布局，使用 * 作为指令前缀
   2. 分类
      1. *ngIf / else + 'ng-template #template'
         1. 作用：根据条件渲染或者移除 DOM 节点
         2. 本质：相当于给html的标签设置一个`[ngIf]="true/false"`的属性
            ```
             <div *ngFor="let name of [1, 2, 3, 4]">
                 <a [title]="'haha'" *ngIf="name % 2 === 0; else elseArea "> {{ name }} </a>
             </div>
             // 这里是用一个模版引用 #elseArea
             <ng-template #elseArea>
                 <div>奇数</div>
             </ng-template>
            ```
      2. *ngFor
         1. 作用：遍历数据生成HTML结构
         2. Angular提供的内部变量：
            1. let item of list
            2. let i = index  序号从0开始
            3. let isEven = even  是否是偶数
            4. let isOdd = odd  是否是奇数
            5. let isFirst = first  是否是第一个
            6. let isLast = last  是否是最后一个
         3. 
            ```
            <div *ngFor="let name of names let i=index let isOdd=odd">
                  {{ name }}
                  {{i}}
                  {{isOdd}}
               </div>
               // 解析完相当于
               <ng-template ngFor let-name [ngForOf]="names" let-i="index" let-odd="odd">
                  <div>
                     {{ name }}
                     {{i}}
                     {{isOdd}}
                  </div>
               </ng-template>
            ```
3. 自定义指令 ？？？
   1. https://www.bilibili.com/video/BV1mQ4y1m7o6/?spm_id_from=pageDriver
   2. 定义：自定义指令以操作 DOM
   3. 创建：ng g d path/dName 也就是 ng generate directive path/dName，并且会被放进根模块的declaration中
      ```
      ng g d directives/hover
      ```
   4. 指令类：用 @Directive 装饰的类 


### 事件绑定 + 模版引用变量
1. 定义：事件用括号包裹起来表示是一个事件语法 
2. 直接获取事件对象`$event`: 
   ```
   // 在change share函数体内都可以直接使用event
   <input (input)="change($event)"/>
   <button (click)="share($event)">分享</button>
   ```
3. 获取 DOM: 利用 模版 #name
   1. 给模版对象设置一个模版引用变量 username，通过模版名称直接取得DOM ,从而可以获取事件对象的值
      ```
      <input #username/>
      <button (click)="share(username.value)">分享</button>
      // share(val){// val即为input输入}
      ```



### 管道 Pipe
1. 管道：传输数据，支持链式管道，从左到右，逐层执行, 
2. 自带的管道 
   1. ![管道分类](../assets/Angular_Pipe.png)
      ```
      <div>{{ date | date: 'yyyy-MM-dd' }}</div> 2022-05-08
      <div>{{ money | currency: "Y" }}</div> // ¥123
      <div>{{  content | uppercase }}</div>
      <div>{{  object | json }}</div> // 就不会直接打印出[Object object],而是展开的对象，在一行
      <div><pre>{{  object | json }}</pre></div> //再用 pre标签包裹，就会把对象在大括号处换行，格式清晰明了

      ```
3. 自定义管道：
   1. 命令 ng g p pipeName
   2. 示例：/angular-demo/src/app/pipes/custom-pipe-one.pipe.ts
   3. 传参：管道默认有两个参数，第一个必选value，第二个可选数组
      1. 入参的写法，就是在管道后面用冒号依次向后写 比如 `<p>{{ title | customPipeOne: 5:10:15 }}</p>` 那么在 customPipeOne 管道中的第二个参数就是[5,10,15]
      2. 自定义入参：默认的入参是number数组格式，可以自定义修改

### 生命周期：Angular 会按照以下顺序执行钩子方法
1. constructor 其实不是生命周期函数，是构造函数，是组件实例化时执行的实际，可以用来接受Angular注入的 服务实例对象
2. 生命周期
   1. ngOnInit
      1. 用途：第一次初始化时会触发的钩子
      2. 前提：组件 implements OnInit
   2. ngOnChanges(changes: SimpleChanges)
      1. 用途：
         1. 检测输入属性的变化。
         2. 初始化时会执行一次，顺序优于ngOnInit
         3. 当输入属性值变化时总会触发。如果是基础类型，值变了就触发；如果是引用类型，当对象的引用地址改变可以检测到，如果对象没变但是对象中的属性值，不会触发本方法，但是不影响页面正常展示新数据
      2. 入参：当前和上一次发生了变化的属性会存储在对象中，该对象是 SimpleChanges 类型的；没有变化的不会存储
         ```
         changes: SimpleChanges 
         {
            currentValue: 某值,
            firstChange: false/true,
            previousValue: 某值,
         }
         ```
      3. 执行时机：初始化后在ngOnInit之前 & 属性值变化，都会触发，例如输入性属性就会一直被触发
      4. 注意：
         1. 不论同时多少个属性在变化，都只会执行一次钩子函数
         2. 如果属性变化很频繁，可能会被触发得非常频繁，注意性能
         3. 注意，判断属性变化的方式是，普通类型判断值，引用类型判断地址
   3. ngDoCheck
      1. 用途：只要输入属性发生变化，基本类型、引用类型、引用类型中的属性，任意变化都会触发本方法
      2. 时机：每次 ngOnChanges 之后 & 第一次 ngOnInit 之后
      3. 注意：被触发的频率可能过高，常用于调试
   4. ngAfterContentInit
      1. 用途：当Angular把内容投影进组件之后时调用
      2. 前提：implements AfterContentInit
      3. 时机：第一次 ngDoCheck 之后调用，只调用一次
   5. ngAfterContentChecked
      1. 用途：内容投影更新完成后执行
      2. 时机：在 ngAfterContentInit之后 & 每次 ngDoCheck 之后
   6. ngAfterViewInit
      1. 用途：当组件视图渲染完成后调用
      2. 前提：组件 Implements AfterViewInit
      3. 时机：第一次 ngAfterContentChecked 之后调用，只调用一次
   7. ngAfterViewChecked
      1. 用途：组件视图更新完成后执行
      2. 时机：在 ngAfterViewInit 之后 & 每次 ngAfterContentChecked 之后
   8.  ngOnDestroy
      3. 用途：组件销毁之前调用，例如切换页面时，主要在这里做清理工作，比如清理事件订阅、定时器等
      4. 时机：在Angular真正销毁指令执行之前
3. 阶段&顺序：
   ```
   // 挂载阶段
   constructor
   ngOnChanges
   ngOnInit
   ngAfterContentInit
   ngAfterViewInit
   // 更新阶段
   ngOnChanges
   ngDoCheck
   ngAfterContentChecked
   ngAfterViewChecked
   // 卸载阶段
   ngOnDestroy
   ```


### DI框架 依赖注入 
1. 定义：Dependency Injection 简称 DI, 是面向对象编程中的一种设计原则，用来减少代码之间的耦合度
   1. Injection 注入： 通过传参的方式，将依赖类对象从参数传入，而不是直接在类里调用依赖对象
   2. 手动注入的缺点：当被依赖类发生变化，所有对依赖的实现和调用都需要变动，所以 Angular 提供了一个 DI 框架，自动完成这一套注入，
2. DI 框架
   1. 4个核心概念：
      1. Dependency: 组件要依赖的服务实例对象
      2. Token: 依赖的服务实例对象有很多，用 Token 做服务实例对象的标识，即通过 Token 来获取服务实例对象
      3. Injector：注入器，负责创建和维护服务类的实例对象，并通过传参的方式，自动向组件中注入需要的服务实例对象
      4. Provider: 提供者，是个对象，用来配置 Injector，指明要创建的服务实例对象所属的服务类+用来获取服务实例对象的Token
   2. Injectors 注入器：
      1. 定义：负责创建服务类实例对象，并将服务类实例对象注入到需要的组件中
      2. 用法：
         ```
         // 创建注入器 注意：ReflectiveInjector 会带有中划线是因为此API未来将会被废弃
         import { ReflectiveInjector } from '@angular/core'
         // 服务类
         class MailService {}
         // 创建注入器并传入服务类
         const injector = ReflectiveInjector.resolveAndCreate([MailService]);
         // 获取注入器中的服务类的实例对象
         const mailService = injector.get(MailService)
         console.log("mailService", mailService);
         
         ```
      3. 相同的注入器，返回的服务实例对象是单例模式，同一个注入器在创建服务实例后会对其进行缓存
         ```
         const mailService1 = injector.get(MailService)
         const mailService2 = injector.get(MailService)
         console.log(mailService1 === mailService2); // true
         ```
      4. 不同的注入器，返回的是不同的服务实例对象
         ```
         const injectorFirst = ReflectiveInjector.resolveAndCreate([MailService]);
         const injectorSecond = ReflectiveInjector.resolveAndCreate([MailService]);
         const firstService = injectorFirst.get(MailService)
         const secondService = injectorSecond.get(MailService)
         console.log(firstService === secondService); // false
         ```
      5. resolveAndCreateChild可以创建子注入器，服务实例对象的查找类似函数作用域链，当前级别可以找到就使用当前级别，当前级别找不到就去父级中查找
         ```
         // resolveAndCreate 创建注入器
         const injector = ReflectiveInjector.resolveAndCreate([MailService]);
         // resolveAndCreateChild 创建子注入器
         // 数组里没传入服务 所以当前级别没有对应服务实例对象 
         const childInjector = injector.resolveAndCreateChild([])
         const fatherService = injector.get(MailService)
         // 在 get的时候发现本层没有，就会向上查找
         const sonService = childInjector.get(MailService)
         console.log(fatherService === sonService); // true 最终查到的一个实例对象

         ```
   3. Provider 提供者: ???
      1. 定义：
      2. 用法：
         ```
         
         ```
      3. https://www.bilibili.com/video/BV1SM4y1A7Ci/?spm_id_from=pageDriver


### 服务
1. 定义：用来放置和特定组件无关并希望能跨组件共享的数据或逻辑
2. 好处：把组件和服务区分开，有助于提高模块性和复用性。通过把组件和视图有关的功能与其它类型的处理分离开，可以让组件类更加精简、高效
3. 创建：
   1. 命令：ng g serviceFolerName/serveName 创建后，通过 @Injectable()装饰器标识服务 
   2. 注意：在使用服务时，不要用 new 手动创建服务，需要由 Angular 内置的依赖注入系统创建和维护。服务是依赖需要而被注入到组件中的！！
   3. demo: /angular-demo/src/app/service/menu.service.ts
4. 使用：
   1. 在app.module.ts中手动import并放进 @Component的providers数组
      ```
      @NgModule({
         declarations: [...],
         imports: [...],
         // 存放服务 
         providers: [ MenuService ],
         bootstrap: [...],
      })
      export class AppModule {}
      ```
   2. 在目标模块中也需要手动import，然后作为入参传给类的constructor. 之后可以通过 this.serviceName 查询到. 如果没有还没有处理，就得到一个空对象，可以给该服务类添加属性
      1. 多个服务时，依靠服务的类别来判断使用哪个服务
      2. private 权限修饰符表示：
         1. 修饰的该服务，不作为参数，而是当前类的属性使用，所以可以通过 this.menuService 来访问。这是 Typescript的知识点
         2. 修饰的该服务，只能在组件类中使用，不能在组件模版中使用。如果使用public修饰的，才可以在模版中使用。
         ```
         constructor(
            private anotherServer: AnotherService,
            private menuServer: MenuService,
         ) {}
         ```
      3. 总结：通过类构造函数里的private服务，就可以在当前业务类中，使用this.服务.*来获取操作数据的方法
5. 设计模式：单例模式，所以当服务本身修改时，所有依赖注入到的组件内都会使用到新的修改


### 共享模块
1. 定义：共享模块中放置的是 Angular 应用中模块级别的需要共享的组件或者逻辑
2. 创建
   1. 共享模块：ng g m shared  这里取名叫shared
   2. 在该共享模块下 创建组件：ng g c shared/components/compName  demo 取名叫Layout
   3. 此时，在shared.module.ts里可以看到，在declaration里已经自动注入了 LayoutComponent
3. 导出：
   1. 在共享模块中导出共享组件: 在shared.module.ts中的 exports数组中指定要导出的模块名
4. 使用：
   1. sharedModule已经被自动导入了跟组件 app.module.ts 中了
   2. 在根组件app.module.ts中，作为依赖模块，写入imports数组。
   3. 然后在想要使用的地方正常标签引用就行了， `<app-layout></app-layout>`


### 组件交互
1. 父2子：利用 @Input("变量名")
2. 子2父：利用 @Output 父组件监听子组件的事件 eventEmitter
3. 利用 setter 截听输入属性值的变化
2. 利用 ngOnChanges() 截听输入属性值的变化
4. 获得子组件实例：
5. 服务


### 路由
1. 位置：`<router-outlet></router-outlet>` 写在哪，路由就在哪里生效
2. 跳转：`<a [routerLink]="['/menuDetail']" routerLinkActive="router-link-active">跳转</a>` 其中 routerLinkActive 是内置的一个样式入参，可以给跳转自定义一些样式
3. 默认路由：给路由的path选项设置为空字符串'' 或者 两星通配符 `**` 注意是2星哦
4. 子路由：利用children注册，然后在父页面里也设置一个 `<router-outlet></router-outlet>`用来防止子路由渲染
5. 传参方式：两种传参互不影响
   1. query: (推荐，因为不会有顺序的坑)
      1. 传递：
         ```
         // 直接在a标签上设置一个属性传递参数对象 
         <a [routerLink]="['/menuDetail']" [queryParams]="{id:3,name:'abc'}">跳转</a>
         ```
      2. path变成：`/menuDetail?id=3&name=abc`
      3. 接收：在目标页面 引用ActivatedRoute并 作为构造函数的入参被使用. 然后通过 `this.ActivatedRoute实例.*`得到相关信息，可以用它的 `this.ActivatedRoute实例.snapshot.queryParams` 接受参数
      4.  参数顺序：要求不严格
   2. params
      1. 传递：
         ```
         //在router配置中 name后配置参数
         path: 'menuDetail/:menuId/:nickname'
         //在 a标签传参时，第二个参数开始是参数 
         <a [routerLink]="['/menuDetail', 123, 'Bob']"></a>
         ```
      2. path变成: `/menuDetail/123/Bob?id=3&name=abc`
      3. 接收：在子路由页面中接收 
         ```
         this.routerinfo.params.subscribe((params: Params) => {
            console.log(params);
         });
         ```
      4. 参数顺序：params 在router里注册的先后顺序，与传参数组里的顺序 是严格对应的


### 特殊的选择器
1. :host 
   1. 宿主元素：每个组件里的selector对应的组件选择器匹配的元素，称为宿主元素，模版template内容会渲染到其中
   2. 用途：:host 伪类选择器可创建针对宿主元素自身的样式，而不是针对宿主内部的元素。 但是可能会影响后代的样式，有的样式会继承
   3. 唯一：:host 是唯一的方式可以把宿主元素作为目标，因为宿主元素不是组件自身template的一部分，而是父组件模版中的一部分
   4. 组合：比如 :host h2，:host 选择器也可以与其他选择器组合使用
2. :host-content
   1. 用途：在当前组件的宿主元素的祖先节点开始查找css类，知道文档的根结点为止，如果找到了就应用样式 例如 :host-content(.active) 是找到当前宿主元素以下具有active类的节点。
   2. 必须组合：它只能与其他选择器组合使用


### 内容投影
1. 定义：在组件标签之间的内容可以传递给组件中展示，这一过程就是投射
2. 单插槽投影：ng-content
   1. 定义：创建一个组件，可以在其中投影一个组件
   2. slot：`<ng-contnet></ng-content`
   3. 但一插槽 且 没有select，会将所有内容都投影在一个 插槽中
3. 多插槽投影：ng-content
   1. 定义：一个组件可以具有多个插槽。每个插槽可以指定一个CSS选择器，该选择器会决定将哪些内容放进该插槽。
   2. slot + class: 
      ```
      <app-menu-detail>
         <div class="a">a</div>
         <div class="b">b</div>
      </app-menu-detial>
     
      // 在 menu-detail.component.html 中
      <ng-content select=".a"></ng-content>
      <ng-content select=".b"></ng-content>
      ```
   3. slot + select：定义了select属性的插槽是专门给定义了对应属性的内容投影的。其余没有select选项的内容默认都放到其他不带select属性的插槽中
      ```
      // 插槽
      组件内部: `
         <h2>Multi-slot content projection</h2>

         Default:
         <ng-content></ng-content>

         Question:
         <ng-content select="[question]"></ng-content>
      `
      // 组件标签中间的内容
      <p question> 
         Is content projection cool?
      </p>
      <p>Let's learn about content projection!</p>
      ```
4. ng-container
   1. 背景：在上述栗子中碳水化合物，会将整个标签拿过来投射进slot里，比如`<div class="a">a</div>` 如果不想要div,只想要里面的内容 a 怎么办？因为需要 select的表示同意，所以必须有一个容器，这时候就可以使用 ng-container
   2. 定义：不包含外部的例如`<div></div>`，只想要内容，可以用 ng-container代替 div
   3. 用法： 
      ```
      <app-menu-detail>
         <ng-container class="a">a</ng-container>
         <div class="b">b</div>
      </app-menu-detial>
     
      // 在 menu-detail.component.html 中
      <ng-content select=".a"></ng-content>
      <ng-content select=".b"></ng-content>

      // 页面展示：
      a
      <div>b</div>
      ```
   4. 优点：不会实例化真实 DOM 
5. 复杂情况 ？？？


### 视图包装 ？？？ 
https://angular.cn/guide/view-encapsulation

### 动态组件 ？？？
https://angular.cn/guide/dynamic-component-loader

### Angular 元素 ？？？
https://angular.cn/guide/elements


### 网络请求模块 HttpClientModule
1. 用途：发送http请求，用于发送请求的方法都返回 Observable 对象
2. 使用步骤：
   ```
   // 1. 在项目根配置导入 HttpClientModule 模块 并放置在 @ngModule-imports里
   //  app.module.ts 中
   import { httpClientModule } from '@angular/common/http';
   @ngModule{
      imports:{
         httpClientModule
      }
   }

   // 2. 在要引入的组件ts文件中，从@angular/common/http 导入, 
   // menu-index.component.ts 中
   import { HttpClient } from '@angular/common/http';
   
   // 3. 在类的constrcutor中注入，才能在类中使用，比如在生命周期函数ngOnInit中
   // menu-index.component.ts 中
   import { HttpClient } from '@angular/common/http';
   export class MenuIndexComponent{
      constructor(private http: HttpClient){}
      ngOnInit(){
         this.http.get('https://www.baidu.com')
      }
   }
   ```
3. 方法：get post delete put
4. 传参：利用 HttpParams 类、HttpParamsOptions 类
   1. HttpParams类的实例对象上，有一些方法，
      1. has(param:string):boolean
      2. get(param:string):string | null
      3. getAll(param:string):string[] | null
      4. keys(): string[]
      5. append(param:string, value:string):HttpParams  注意，凡是返回HttpParams类型的方法，新参数就是返回值，记得接收新值
      6. set(param:string, value:string):HttpParams
      7. delete(param:string, value?:string):HttpParams
      8. toString(): string
   2. HttpParamsOptions 有三种属性
      1. fromString 表示参数通过query键值对的形式传入
      2. fromObject: 表示传入的参数可以是对象形式, 但要注意，对象中的属性值，都是字符串类型的，传入的数字也都要string类型表示
      3. encoder: 指定入参的编码形式
   3. demo：
      ```
      constructor(
         private http: HttpClient 
      ) {}
      let params = {
                  name: 'zhangsan',
                  age: '20' //注意：传参的值都是string类型
               }
      this.http
         .get('https://jsonplaceholder.typicode.com/users',{
            params: new HttpParams({
               // fromObject: params
               fromString: "name=zhangsan&age=30"
            })
         })
         .subscribe(console.log);
      // 在network中可看到一条https://jsonplaceholder.typicode.com/users?name=zhangsan&age=20地址的请求发出去了
      ```
5. 请求头：使用 HttpHeader 类
   1. 在HttpHeader类实例对象下面有各种操作请求头的方法
   2. demo:
      ```
      let headers = new HttpHeaders({
         test: 'hello'
      })
      this.http
      .get('https://jsonplaceholder.typicode.com/users',{
        headers
      })
      .subscribe(console.log);
      ```
6. 响应内容
   1. 通过设置一个type, 可以取出返回内容
   2. type HttpObserve = 'body' | 'response'
      1. body: 表示返回的response中的响应体
      2. response: 表示整个返回的内容 包含 body headers ok status type 等
   3. demo：
      ```
      // 不需要引入什么，就直接用 observe属性指定type就行
      this.http
      .get('https://jsonplaceholder.typicode.com/users',{
        {observe: 'response'}
      })
      .subscribe(console.log);
      ```
7. 拦截器 ？？？
   1. 定义：在全局范围内，捕获和修改由 HttpClientModule模块发出的 Http 请求和响应
   2. https://www.bilibili.com/video/BV1UP4y1J762/?spm_id_from=pageDriver
   3.
8. Angular Proxy  ???
   1. https://www.bilibili.com/video/BV1Qa41167H1/?spm_id_from=pageDriver
      


### NgRx
1. 定义：是 Angular 应用实现全局状态管理的 Redux 架构解决方案
2. https://www.bilibili.com/video/BV1qq4y1m74v/?spm_id_from=pageDriver