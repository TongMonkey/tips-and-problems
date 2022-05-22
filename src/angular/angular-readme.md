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
4. 组件逻辑 ts 
   1. 有三个层级的结构
      1. 全局 app.module.ts
      2. 模块：里面有 @NgModule 修饰符的，是通过 ng g m name 创建的 (ng generate module name)
      3. 组件：里面有 @Component 修饰符的，是通过 ng g c name 创建的 (ng generate component name)
   2. 关系：
      1. 全局文件中 declarations 里可以定义要使用的 compoennts, imports 里可以定义要导入的 modules
      2. 在 module 文件中，可以 declareations 和 exports 相关的 components 
      3. component 文件，就是最小的文件层级了

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


### 表单
1. 两种类型：模版驱动 && 模型驱动
2. 模版驱动表单：FormsModule
   1. 定义：表单的控制逻辑写在组件模版中，适合简单的表单类型
   2. 使用：
      1. 在根模块中：import {FormsModule } form '@angular/forms'，并在模块的 imports 中注入 FormsModule
      2. 在使用表单的模块中 import { NgForm } from '@angular/forms';
      3. 将普通的 DOM 表单转化成 ngForm 表单 #name="ngForm" 
         ```
         // 这里的 f 是自定义的名字
         <form #f="ngForm" (submit)="onSubmit(f)">
         ```
      4. 声明表单字段为 ngModel：标识该字段受 ngForm 表单管控
         ```
         // 3
         <form #f="ngForm" (submit)="onSubmit(f)">
            // 4
            用户名：<input type="text" name="username" ngModel/>
            <button type="submit">提交</button>
         </form>
         ```
      5. 之后就可以获取表单字段值了 form.value 对象里包含所有字段值
         ```
         onSubmit(form: NgForm){
            console.log('form',form.value)
            console.log('验证通过',form.valid)
            console.log('验证未通过',form.invalid)
         }
         ```
   3. 表单分组 ngModelGroup
      ```
      <form #f="ngForm" (submit)="onSubmit(f)">
         <ng-container ngModelGroup="user">
            用户名：<input type="text" name="username" ngModel/>
         </ng-container>
         <ng-container ngModelGroup="contact">
            手机：<input type="text" name="phone" ngModel/>
         </ng-container>
         <button type="submit">提交</button>
      </form>
      // 此时 form.value 变成了一个对象中包含多个组对象
      form.value:{
         user:{username:'aaa'}
         contact:{phone:'bbb'}
      }
      ```
   4. 表单验证：
      1. required maxLength minLength pattern 等直接作为属性放到表单元素上就可以
      2. 整体表单验证的两个属性：form.valid:boolean 验证通过、 form.invalid:boolean 验证未通过
      3. 具体表单项验证：
         1. 获取表单项：使用 #name="ngModel"
            ```
            // 这里的 #username 里，username 是自定义名
            用户名：<input type="text" name="username" ngModel #username="ngModel"/>
            <div *ngIf="username.touched"> 出现</div>
            ```
         2. 表单属性：
            1. *.touched 标识是否操作过该表单项的值
            2. *.valid 验证通过：boolean
            3. *.errors 可能是对象或者是 null, 对象里包含的是未通过的表单项的信息
         3. 自定义表单样式：官方提供了几个样式类名，可以自行添加样式
            1. ng-touched
            2. ng-invalid
            3. ng-dirty
            4. 组合
               1. input.ng-touched.ng-invalid 修改过但不合格
3. 模型驱动表单：ReactiveFormModule
   1. 定义：表单的控制逻辑在组件类中，适合复杂的表单的类型
   2. 三个概念： 
      1. 表单项 FormControl: 在模型驱动表单中，所有表单字段都得是 FormControl 类的实例，实例对象可以验证字段中的值
      2. 表单组 FormControlGroup: 一组表单字段组成整个表单组，整个表单是 FormControlGroup 的实例，可以对表单进行整体的验证
      3. 表单数组 FormArray: 可以动态添加表单项或者表单组，适用于复杂表单。在表单验证时，只要有一个没通过，那整个 FormArray 就整体不通过
   3. 表单项：FormControl
      1. 在根模块中: import { ReactiveFormModule } from '@angular/forms',并在模块的 imports 中注入 ReactiveFormModule
      2. 在使用表单的模块中： import { FormControl, FormGroup } from '@angular/forms'，并且创建表单组对象
         ```
         import { FormControl, FormGroup } from '@angular/forms'
         export class AppComponent
         ```
      3. 在 html 中绘制表单
         1. formGroup 绑定表单对象，该表单对象是个引用，所以要用方括号将 formGroup框起来
         2. formControlName 绑定表单项的名字，名字是string, 它不是一个实时变化的数据，所以不需要方括号框起来
         ```
         // 使用 formGroup 跟 ts 类中定义的表单对象关联起来,需要[]
         <form [formGroup]="loginForm">
            // formControlName 绑定的是 string 类型的名字，不需要[]
            用户名：<input formControlName="username" /> 
            密码：<input type="password" formControlName="password" />
            <button (click)="done()">提交</button>
         </form>
         ```
      4. 在 ts 类中写逻辑
         1. 表单组是 FormGroup 实例
         2. 表单项是 FormControl 实例, new 初始化的入参是默认值
         3. 通过表单.value 获取表单数据
         ```
         // 模型驱动表单
         loginForm: FormGroup = new FormGroup({
            // new 的时候可以传入默认值
            username: new FormControl("defaultValue",[
               // ... 验证规则
            ]),
            password: new FormControl(),
         });
         done() {
            // this.表单.value 获取表单的全部属性
            console.log(this.loginForm.value);
         }
         ```
   4. 表单分组 formGroup
         1. 在 html 中：
            1. formGroupName：注意：表单绑定用`[formGroup]`绑定对象, 内部的组用 formGroupName 绑定字符串
            ```
            <form [formGroup]="loginForm" (submit)="done()">
            // formGroupName 绑定名称
               <div formGroupName="fullName">
                  姓：<input formControlName="lastName" /> 
                  名：<input formControlName="firstName" /> 
               </div>
               密码：<input type="password" formControlName="password" />
               <button>提交</button>
            </form>
            ```
         2. 在ts类中：
            1. 在 FormGroup 里面再写 FormGroup 即可
            2. .get 获取表单项：传参方式：
               1. 通过数组：`表单.get(['parentName', 'childName'])` 传入表单组层级`数组`，可以获取对应的表单项
               2. 通过点运算符：`表单.get('parentName.hildName')` 传入表单组层级名称，注意这里不用数组了哦
            ```
            loginForm: FormGroup = new FormGroup({
               fullName: new FormGroup({
                  firstName: new FormControl(),
                  lastName: new FormControl()
               }),
               password: new FormControl(),
            });
            done() {
               console.log(this.loginForm.value); // {fullName: { firstName, lastName },password}
               // 表单.get() 获取对应表单项
               let formControlObj1 = this.loginForm.get(['fullName', "firstName"]);
               let formControlObj2 = this.loginForm.get("fullName.firstName")
               formControlObj1 === formControlObj2; // true
               console.log(formControlObj1.value); //依然用 .value 取值
            }
            ```
   5. 表单数组 FormArray
      1. 参考链接：https://www.bilibili.com/video/BV113411t7rG/?spm_id_from=pageDriver%20Typescript
      2. 既可以放 FormGroup 也可以放 FormGroup
      3. API:
         1. 获取表单DOM对象：也可以用 formName.get 方法
         2. ts 中移除某个表单：formNameObj.removeAt(index)
         3. html 中遍历 formArray: 实际上遍历的是 `formNameObj.controls`
         4. 表单数组中的表单，遍历的 formGroupName 的值 实际上是遍历`formNameObj.controls`时的 index
            ```
            <div formArrayName="contacts">
               // 真正遍历的是 fromArray实例的controls 属性 
               // i 是变量而不是字符串，所以formGroupName 要用 [] 框起来
               <div *ngFor="let contact of contacts.controls; let i = index" [formGroupName]="i">
                  <input formControlName="name" />
                  <input formControlName="phone" />
                  <input formControlName="address" />
                  <button (click)="remoceContact(i)">删除联系方式</button>
               </div>
            </div>
            ```
      4. demo：/angular-demo/src/app/form-array/*
      5. 验证规则
         1. Angular 内置规则
            1. 创建规则：
               ```
               import { FromControl, FormGroup，Validators } from '@angular/forms"
               myForm: FormGroup = new FormGroup({
                  name: new FormControl('默认值', [
                     Validators.reqired, //注意这里没有括号，Angular会帮我们调用
                     Validators.minLength(2),
                     // ...
                  ])
               })
               ```
            2. 规则验证：
               ```
               // 在 ts 中
               this.myform.valid //boolean 
               // 在 html 中
               <button [disabled]="myForm.invalid"> 提交 </button>
               ```
            3. 规则列表：touched, valid, invalid, required, maxLength, minLength...
         2. 自定义同步表单验证器
            1. 参考链接：https://www.bilibili.com/video/BV1tP4y1V7DX/?spm_id_from=pageDriver
         3. 自定义异步表单验证器
            1. 参考链接：https://www.bilibili.com/video/BV1GF411871e/?spm_id_from=pageDriver
   6. FormBuilder: 创建模型表单的快捷方式
      1. 参考链接：https://www.bilibili.com/video/BV1aU4y1T7hD/?spm_id_from=pageDriver
   7. 复选表单：https://www.bilibili.com/video/BV1Bi4y1o7Gp/?spm_id_from=pageDriver
   8. 单选表单：https://www.bilibili.com/video/BV1aY411s7tF/?spm_id_from=pageDriver
   9. 其他内置常用API：
      1.  patchValue: 设置表单控件的值，可以设置全部or其中某几个，其他不受影响
      2.  setValue: 设置表单整体的值，一个表单项都不能落下
      3.  valueChanges: 当表单控件的值发生变化时会触发的事件
      4.  reset: 表单内容初始化

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
   3. Provider 提供者:
      1. 定义：是注入器 Injector 的配置对象
      2. 访问依赖对象的标识 provide：
         1. 数据类型：既可以是对象比如 MailService 也可以是 "mail" 字符串。
         2. 意义：将实力对象和外部的引用建立松耦合关系，外部通过标识获取实例对象，只要标识保持不变，内部代码怎么变化都不会影响到外部。
         3. 用法：
            ```
            // resolveAndCreate 创建注入器
            const injector = ReflectiveInjector.resolveAndCreate([
               {
                  // 注意：属性名是 provide 不是 provider
                  // 这样写的时候，就不需要在 
                  // provide: MailService,  // 用哪个标识去获取实例对象，也可以是字符串
                  provide: “mail”,  // 用哪个标识去获取实例对象，也可以是字符串
                  useClass: MailService //用那个类创建实例对象
               }
            ]);
            ```
      3. useValue: 作为配置对象，也可以传递一个对象 
         ```
         // resolveAndCreate 创建注入器
         const injector = ReflectiveInjector.resolveAndCreate([
            {
               provide: “Config”,  // 用哪个标识去获取实例对象，也可以是字符串
               // 使用 Object.freeze 使外部无法修改该对象
               useValue: Object.freeze({
                  APIKEY: '12345',
                  APISCRET: '500-400-300',
               })
            }
         ]);
         ```
      4. 


### 服务
1. 定义：用来放置和特定组件无关并希望能跨组件共享的数据或逻辑
2. 好处：把组件和服务区分开，有助于提高模块性和复用性。通过把组件和视图有关的功能与其它类型的处理分离开，可以让组件类更加精简、高效
3. 创建：
   1. 命令：ng g serviceFolerName/serveName 创建后，通过 @Injectable()装饰器标识服务 
   2. 注意：在使用服务时，不要用 new 手动创建服务，需要由 Angular 内置的依赖注入系统创建和维护。服务是依赖需要而被注入到组件中的！！
   3. demo: /angular-demo/src/app/service/menu.service.ts
4. 设置服务的 3 种作用域
   1. 全局作用域：在根注入器中注册服务，所有模块使用同一服务实例对象. 
      1. 默认root：root表示默认注入到 AppModule 里，就是app.module.ts
      2. 注意！！ 如果暂时不想定义任何区域，可以传入 null, 不能让 Injectable 里传入空对象,会报错。
      3. provedIn 的参数选项：  `({ providedIn: Type<any> | "root" | "platform" | "any" | null; } & InjectableProvider) | undefined`
         ```
         import { Injectable } from '@angular/core';
         @Injectable({
            // 1.全局作用域 默认 app.module.ts
            providedIn: 'root', 
            // providedIn: null
         })
         export class MenuService {}
         ```
   2. 模块级别：该 module 中的所有 components 使用同一服务实例对象。
      1. 有两种语法都可以，第一种：在服务中用 providedIn 声明要在哪个 module 里生效
         ```
         import { Injectable } from '@angular/core';
         import { SharedModule } from '../shared/share.module';
         @Injectable({
            // 在服务中用 providedIn 声明要在哪个 module 里生效
            providedIn: sharedModule, // 2.模块作用域
         })
         export class MenuService {}
         ```
      2. 两种语法都可以，第二种：在模块中用 providers 表示使用哪些服务
         ```
         import {MenuService} from './menu.service'
         @ngModule({
            // 在模块中用 providers 表示使用哪些服务  
            providers: [MenuService],
         })
         export class sharedModule{}
         ```
   3. 组件级别：该 component 组件及子组件中使用同一服务实例对象
      ```
      // 在组件中
      import {MenuService} from './menu.service'
      @Component({
         providers: [MenuService]
      })
      export class MenuIndexComponent implements OnInit {
         constructor(
            private menuServer: MenuService,
         ) {}
      }
      ```
5. 使用：
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
6. 设计模式：单例模式，所以当服务本身修改时，所有依赖注入到的组件内都会使用到新的修改


### 共享模块
1. 定义：共享模块中放置的是 Angular 应用中模块级别的需要共享的组件或者逻辑
2. 创建
   1. 共享模块：ng g m shared  这里取名叫shared
   2. 创建第一个组件：
      1. 在该共享模块下 创建组件：ng g c shared/components/Layout  demo 取名叫Layout 
      2. 此时，在shared.module.ts里可以看到，在declaration里已经自动注入了 LayoutComponent
         ```
         @NgModule({
            declarations: [
               LayoutComponent
            ],
            imports: [
               CommonModule
            ],
            exports:[
               LayoutComponent,
               PrintComponent
            ]
         })
         export class SharedModule { }
         ```
   3. 创建第二个组件：
      1. 如果继续创建组件 ng g c shared/components/Print 
      2. 此时，在shared.module.ts里可以看到,在 declarations 里已经自动添加了 printComponent, 但是在 exports 里没有自动添加，如果想导出，就自己手动添加，否则不导出是用不了的
         ```
         @NgModule({
            declarations: [
               LayoutComponent,
               PrintComponent 
            ],
            imports: [
               CommonModule
            ],
            // 导出
            exports:[
               LayoutComponent,
               // 这里没有自动 添加进 exports，手动添加
               PrintComponent
            ]
         })
         export class SharedModule { }
         ```
3. 导出：在共享模块中导出共享组件: 在shared.module.ts中的 exports数组中指定要导出的模块名 LayoutComponent, PrintComponent
4. 使用：
   1. SharedModule 已经被自动导入了根组件 app.module.ts 的 imports 中了, 注意这里自动导入的是分享模块SharedModule，而不是内部的 LayoutComponent 或者 PrintComponent，但是可以直接引用 分享模块中的 components
   2. 然后在想要使用的地方 直接引用标签就行了， `<app-layout></app-layout>`  `<app-print></app-print>`


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
      <子组件>
         // question 对应select
         <p question> 
            Is content projection cool?
         </p>
         <p>Let's learn about content projection!</p>
      </子组件>
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
   5. 用处：
      1. 创建一个 View-container ，动态调整 ？？？
5. 复杂情况 ？？？
6. 与 ng-template 有什么关系
7. 


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

### 内容投影的变更检测是跟着父组件还是子组件 ？？

### ng-container
两个结构化指令不能出现在一个标签上

### ng-template VS template ??
1. 辅助结构化指令语法糖
2. template 是 html的原生标签 不建议用 建议用 ng-template
3. template 包含 ng-template，
4. template 对应的是 component 的view模版
5. ng-template 是 template 内部可以复用的小的 template
6. ngTemplateOutlet 复用模版， context可以传入参数

### angular matierial - cdk - portal 动态

### templateRef 各种ref 是什么，干嘛的

### 幂等 ？？ pure-pipe相关的概念 pure = 幂等 ？

### injectionToken ?

### 是不是只有service 才能被 injectede? false! ???

### 当前层级 injector 没找到，就去上一层找 

### hostListener 监听dom自己的事件发生

### HostBinding

### host 是什么

### 如何监听宿主

### ElementRef

### @ngModule 是什么，干什么的

### CommonModule 是干嘛的
