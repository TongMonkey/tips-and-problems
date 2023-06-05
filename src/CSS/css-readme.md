### 1px问题 有几种解决方案
### 0.5px的线 怎么画
1. height: 1px; transform: scaleY(0.5); transform-origin: 50% 100%;
2. `<meta name="viewport" content="width=device-width,initial-scale=0.5">` + rem 实现：将border设置为1px,然后将页面根据设备的dpr缩小相应的倍数，接着将rem放大相应的倍数，这样页面中只有1px的边框缩小了，而其他内容经过缩小和扩大，还是原来的状态。(rem元素大小不变，仅仅是px元素会根据dpr进行缩放) 缺点是页面都要设置为原来的两倍大小
3. height: 1px; background: linear-gradient(0deg, #fff, #000);
4. border-image:url(...) 

### 写个动画，一个盒子，开始时缩放是 0，50%时是 1，100%时是 0，开始结束都是慢速，持续 2 秒，延迟 2 秒，结束后固定在结束的效果

### 如果让你做一个动画，一个地球本身在自转，外面有个飞机围着它转，飞机的螺旋桨自己也在转，有哪些需要考虑的点

### CSS 实现一个扇形 transform: skew
1. 以物体的中心点为origin
2. 坐标轴跟普通坐标轴是不同的，计算机上 向右侧方向的是y轴，向下方向的是x轴
3. skew(x偏移量, y偏移量)
4. ![skew](assets/skew.png)

### 如果实现一个三栏布局，需要三栏占同样的宽度，放多个元素时会自动换行，有哪些做法

### px VS rem VS EM
1. px 相对长度单位，相对的是屏幕的分辨率
2. em 相对长度单位，相对的是当前印刷单元对象的文本字体大小。 默认为浏览器的font-size为16px。 
   1. em的问题：em是相对不同印刷单元对象的。
      1. font-size: 16px; 表示设置 1em=16px;
      2. font-size: 62.5%; 表示设置 1em = 16 * 62.5% = 10px;
      3. font-size: 2rem; 标识当前这个印刷单元对象里的长度单位 是基础单位的2倍 所以如果继承来的基础单位是16px,那么在这个单元里 长度就全都变成16*2=32px了。
   2. 如果本身没有设置，那就会从父印刷单元继承em的相对长度。所以有的博文里说，em的单位长度是参照父类的，其实不够准确。可以理解成，都是参照自己的em相对长度，有的是自己内部设置了，有的是从父单元继承来的。
   3. 代码示例：
      ```
      div{
         font-size: 62.5%;
         margin-bottom: 1rem;   /* 1em = 10px */ 
      }
      h1 {
         font-size: 2em; /* 1em = 16px */ 
         margin-bottom: 1em; /* 1em = 32px */ 
      } 
      p { 
         font-size: 1em; /* 1em = 16px */ 
         margin-bottom: 1em; /* 1em = 16px */ 
      }
      ```
3. rem 相对长度单位，相对的是html根元素的文本字体大小。默认也为16px. 在任何地方使用，都只针对根元素上设定的font-size.

### css 选择器权重是如何计算的
1. css选择器权重： style > id > class > tag
2. 重复的选择器会重复计算：
   ```
   .testClass.testClass { // 如果没有更高权重的选择器 相同级别的选择器 重复计算生效
      background-color: red; //红
   } 
   #testId{ //如果设置了id选择器，多少个class选择器叠加都没用 还是会遵守style > id > class > tag
      background-color: pink; //粉
   }
   .testClass { 
      background-color: black; //黑
   }
   <div id="testId" class="testClass">  //表现为粉色
      <span>test div</span>
   </div>
   ```
3. !importance
   1. 权重：不在css选择器的权重计算范围，浏览器遇到!importance会特殊判断。当有多个!importance时才会计算权重再比较
   2. 权重计算：
      1. 都设置了!importance的选择器，比如一个是id 一个是class，权重会跟选择器的优先级叠加,最终id里那个属性 〉class的属性
      2. !importance的权重只针对当前属性，不会继承给子元素
      3. 相同选择器优先级的情况下，都设置了!importance，那么后定义的属性会覆盖先定义的
   3. 使用建议：
      1. 总是先考虑使用权重更高的 css 选择器, 而不是使用 !important
      2. 只有当你的目的是覆盖来自第三方的 css(如: Bootstrap, normalize.css)时, 才在页面范围使用 !important
      3. 永远不要 在你写一个第三方插件时使用 !important
      4. 永远不要在全站范围使用 !important

### 盒模型与DOCTYPE
1. DOCTYPE 是 document type的简称，通知浏览器用什么模式来解析html htm文件
   1. 页面中有DOCTYPE,将采用w3c标准
   2. 页面中没声明，将由浏览器自己决定，IE9以下的将采用IE标准，其他浏览器大多采用w3c标准
2. w3c VS IE 
   1. w3c标准采用 标准盒模型
   2. IE标准采用 怪异盒模型
3. 盒模型：前提，一个页面Block由 content、padding、border、margin 构成
   1. 标准盒模型：width 表示的是content的宽 高也一样
   2. 怪异盒模型：width 表示的是 content+padding+border的宽 高也一样
4. css中box-sizing可以手动设置盒模型
   1. box-sizing:content-box; 相当于标准盒模型
   2. box-sizing:border-box; 相当于怪异盒模型 所以当一个设置了width 且同时设有padding的块，当设置为border-box后，会缩小，因为实际宽度width值从原来的content width + padding 变成了 width 

### 

### BFC VS IFC VS FFC VS GFC
1. 背景
   1. 行内元素 VS 块级元素
      1. block: 块级元素 
         1. 默认占据整行 不能并排放置
         2. 支持设置 width height padding margin 
         3. 常见元素：header form ul ol table article div hr aside figure canvas video audio footer
      2. inline: 行内元素
         1. 默认靠内容撑起大小 并配放置元素
         2. 不支持设置 width height 
         3. 支持水平方向的margin 垂直方向margin不生效
         4. 支持padding 但垂直方向上不占据空间
            1. 只有在行内元素有内容时，padding才会生效。即如果没有content，padding也随之消失
            2. 当行内元素有内容，padding在水平方向表现正常，在垂直方向上，并不会占据位置，文字还是在原来的位置，paddin-top的部分在内容的上方 如图 ![inline元素的padding](assets/inline_padding.png)
               ```
               #root{
                  width: 300px;
                  height: 300px;
                  background-color: pink;
               }
               #box{
                  width: 100px;
                  height: 100px;
                  /* 重新设置子元素的行高，否则会继承父元素的行高*/
                  line-height: 100px;
                  background-color: plum;
                  padding:50px;
               }
               <div id="root">
                  <span id="box">内</span>
               </div>
               ```
         5. 常见元素: a b strong span label button select textarea
      3. inline-block：行内块级元素
         1. 可以默认并排放置的块级元素
         2. 支持设置 width height padding margin
         3. 常见元素: img input
   2. inline 和 inline-block 共有的一个特殊问题：间距空格
      1. 问题表现：两个元素在页面上存在几像素的间距，可能是由于两个元素的代码在编写时有空格或者换行。
      2. 解决办法：
         1. 办法1:直接将换行或者空格删除，将代码写在一行
         2. 办法2: 在两行元素中间加一个注释代码，作用跟办法1一样，本质上都是消除空格和换行
         3. 办法3: 给父元素设置font-size:0; 然后在子元素中重写
         4. 办法4: 给父元素设置letter-spacing为负值，然后在子元素中重写letter-spacing: 0px;
      3. Formatting Context：是一个决定如何渲染的容器。 不同的Box类型对应了不同的Formatting context
         1. Blocing Formatting Context: BFC 规定了block-level元素的布局规则
         2. Inline Formatting Context
2. BFC：Block Formatting Contexts 直译为"块级格式化上下文"。
   1. 定义：是一个独立的布局环境，或者说是一个独立的渲染区域，其中的元素布局与外界的布局互不影响
   2. BFC的布局规则
      1. 块级元素在垂直方向依次排列
      2. 垂直排列的两个block-box，如果属于同一个BFC,就会发生margin塌陷,即两个元素垂直方向上中间只间隔了一个margin的距离而不是两个
      3. BFC VS Float: 
         1. BFC不与float区域重叠 (双栏布局基于此实现)
         2. 计算BFC高度时，子元素float元素也参与计算
       (背景：正常文档流中，子元素float后，子元素会脱离文档流并且自己成为一个BFC, 此时父元素的表现有：无法包裹子元素，高度撑不起来； 子元素覆盖在父元素之上，父元素局部区域被遮挡； 如果父元素中有文字，文字会围绕在浮动的子元素周围； 如果父元素有backgroud或者border, 只能包含父元素的文字区域，其余区域因为高度撑不起来，而无法覆盖。)
   3. 怎么创建BFC
      1. html元素本身是一个BFC
      2. float的值不是none的 即 浮动元素是BFC
      3. 绝对定位元素, 即position 为 absolute 和 fixed 两个脱离文档流的是BFC
      4. overflow的值不是visible 这种方案可能会对页面隐藏或者滚动造成影响
      5. display: flow-root 给父元素设置成一个BFC块，所有的子元素都将在该BFC中参与计算 是替代使用visible:auto的无副作用的优秀方案  名字理解：创造一个类似于根元素(html)的上下文，在在其中进行flow layout
      6. 行内块元素：display:inline-block
      7. 表格元素：display值为 tabel、table-cell、table-row 等
      8. 弹性元素：diaplay值为 flex 等
      9. 网格元素：display值为 grid 等
      10. 多列元素：多列元素的 column-count 或 column-width属性 不为 auto时，创建BFC
      11. 跨列元素：元素设置column-span：all 值为all时，始终会创建一个BFC，无论是否在一个多列元素中
   4. 应用：
      1. 解决margin塌陷问题:将相邻元素中的一个变成一个BFC即可
      2. 解决元素浮动后父元素高度塌陷：将父元素变成一个BFC即可
      3. 通过BFC实现两栏自适应布局: 左元素float,右元素设置成为BFC,由于BFC不与Float重叠的特性，可以实现双列布局
3. IFC:Inline Formatting Contexts 直译为"内联格式化上下文"
   1. 定义：产生一个line box 线状框。 
   2. 布局规则：
      1. IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来，不受到竖直方向的padding/margin影响
      2. 元素排列：左右排列，左侧紧紧贴住line box的左边缘
      3. float元素会扰乱IFC布局
      4. 当一个IFC中放入块级作用域，例如一个p标签中有一个div标签,会在块级元素div前后各自产生一个p。即当IFC中放置BFC, 会在BFC前后各产生一个IFC且这两个IFC表现为块级元素类似BFC占满整行。 ![IFC内块元素分割IFC](assets/IFC内有块元素.png)
         ```
         #root{
            width: 300px;
            height: 300px;
            background-color: pink;
         }
         #box{
            width: 100px;
            height: 100px;
            color:black;
            background-color: plum;
         }
         <p id="root">
            <div id="box">左</div>   
         </p>
         ```
   3. 应用：
      1. 水平居中：当一个子块要在父块中水平居中时，设置 子IFC为inline-block，父块设置text-align:center则可以使子IFC水平居中。同时由于text-align可以继承，子IFC表现为块级元素，其中的内容也会水平居中
         ```
         #root{
            width: 300px;
            height: 300px;
            background-color: pink;
            text-align:center;
         }
         #box{
            width: 100px;
            height: 100px;
            color:black;
            background-color: plum;
            display:inline-block;
         }
         <p id="root">
            <span id="box">左</span>   
            <span id="box">右</span>   
         </p>
         ```
      2. 垂直居中：创建一个IFC，用其中一个元素撑开父元素的高度，然后设置其vertical-align:middle，其他行内元素则可以在此父元素下垂直居中。
         ```
         #root{
            width: 300px;  
            <!-- height: 300px; -->  // line box 不设置高度 由子IFC撑起
            background-color: pink;
         }
         #box1 {
            width: 100px;
            height: 300px;
            color:black;
            background-color: plum;
            display: inline-block;  // 产生IFC
            vertical-align: middle;  //高的居中用来撑开 line box 高度
         }
         #box2 {
            width: 100px;
            height: 100px;
            color:black;
            background-color: plum;
            display: inline-block;  // 产生IFC
            vertical-align: middle;  // 矮的垂直居中
         }
         <p id="root">
            <span id="box1">左</span>
            <span id="box2">右</span>
         </p>
         ```
4. GFC：GridLayout Formatting Contexts 直译为"网格布局格式化上下文"
   1. 定义：当为一个元素设置display值为grid的时候，此元素将会获得一个独立的渲染区域
   2. 应用：比用table有更丰富的属性控制行列
5. FFC：Flex Formatting Contexts 直译为"自适应格式化上下文"
   1. 定义：通过设置元素的 display 属性为 flex 或 inline-flex 可以得到一个伸缩容器。设置为 flex 的容器被渲染为一个块级元素，而设置为 inline-flex 的容器则渲染为一个行内元素。
### 实现水平居中、垂直居中布局
1. 水平居中
   1. flex
   2. table-ceil
   3. display: grid
   4. text-align + inline-block
      ```
      #root{
         width: 300px;
         height: 300px;
         background-color: pink;
         text-align:center;
      }
      #box{
         width: 100px;
         height: 100px;
         color:black;
         background-color: plum;
         display:inline-block;
      }
      <p id="root">
         <span id="box">左</span>   
         <span id="box">右</span>   
      </p>
      ```
   5. margin + transfrom
      ```
      #root{
        width: 300px;
        height: 300px;
        background-color: pink; 
      }
      #box{
        width: 100px;
        height: 100px;
        background-color: plum;
        margin-left: 50%;
        transform: translateX(-50%); 
      }
      ```
   6. absolute + 负margin 这种方式需要知道父子块的宽高
      ```
      .root{
         width: 300px;
         height: 300px;
         position: relative;
         background-color: pink;
      }
      .box{
         width: 100px;
         height: 100px;
         position: absolute;
         left: 0;
         top: 0;
         bottom:0;
         right:0;
         margin-left: 100px; // 需要明确知道父子块的宽高
         background-color: plum;
      }
      ```
   7. absolute + margin:auto
      ```
      .root{
         width: 300px;
         height: 300px;
         position: relative;
         background-color: pink;
      }
      .box{
         width: 100px;
         height: 100px;
         position: absolute;
         left: 0;
         top: 0;
         bottom:0;
         right:0;
         margin:auto;
         background-color: plum;
      }
      ```
   8. absolute + transform  与方法5类似 但不需要知道父子块的宽高
      ```
       .root {
         width: 300px;
         height: 300px;
         position: relative;
         background-color: pink;
      }
      .box {
         width: 100px;
         height: 100px;
         position: absolute;
         left: 50%;
         top: 50%;
         transform: translate(-50%,-50%); // 自身百分比
         background-color: plum;
      }
      ```
2. 垂直居中 
   1. flex
   2. table-cell
   3. display: grid
   4. margin + transform
      ```
      #root{
        width: 300px;
        height: 300px;
        background-color: pink; 
        display: flow-root; // 将父级块变成BFC 排除margin塌陷
      }
      #box{
        width: 100px;
        height: 100px;
        background-color: plum;
        margin:50% auto; // 垂直方向上 上编剧为父元素宽度的50% 左右外边距自动居中
        transform: translateY(-50%); //向上平移自身高度的50%
      }
      ```
   5. inline-block + vertical-aligin
      ```
      #root{
         width: 300px;  
         <!-- height: 300px; -->  // line box 不设置高度 由子IFC撑起
         background-color: pink;
      }
      #box1 {
         width: 100px;
         height: 300px;
         color:black;
         background-color: plum;
         display: inline-block;  // 产生IFC
         vertical-align: middle;  //高的居中用来撑开 line box 高度
      }
      #box2 {
         width: 100px;
         height: 100px;
         color:black;
         background-color: plum;
         display: inline-block;  // 产生IFC
         vertical-align: middle;  // 矮的垂直居中
      }
      <p id="root">
         <span id="box1">左</span>
         <span id="box2">右</span>
      </p>
      ```
   6. absolute + 负margin. 这种方式需要知道父子块的宽高
      ```
      .root{
         width: 300px;
         height: 300px;
         position: relative;
         background-color: pink;
      }
      .box{
         width: 100px;
         height: 100px;
         position: absolute;
         left: 0;
         top: 0;
         bottom:0;
         right:0;
         margin-top: 100px;  // 需要明确知道父子块的宽高
         background-color: plum;
      }
      ```
   7. absolute + margin:auto
      ```
      .root{
         width: 300px;
         height: 300px;
         position: relative;
         background-color: pink;
      }
      .box{
         width: 100px;
         height: 100px;
         position: absolute;
         left: 0;
         top: 0;
         bottom:0;
         right:0;
         margin:auto;
         background-color: plum;
      }
      ```
   8. absolute + transform  与方法5类似 但不需要知道子块的宽高
      ```
       .root {
         width: 300px;
         height: 300px;
         position: relative;
         background-color: plum;
      }
      .box {
         width: 100px;
         height: 100px;
         position: absolute;
         left: 50%;
         top: 50%;
         transform: translate(-50%,-50%); // 自身百分比
         background-color: powderblue;
      }
      ```

### 边距的百分比是根据什么计算的 父元素的宽度？
padding和margin的百分比，无论是垂直方向还是水平方向，都是根据其最近父元素的宽度来计算的。不用父Height计算，是因为子元素的高会撑大父元素的高，再去影响子元素...陷入死循环，所以都用父的width做参照

### 通过css将一个元素向左平移10个像素的方法
1. transition过度 + transform变换(translate是transform的一个方法)
   ```
   .transition {
      transition-property: transform; // 要更改的属性名
      transition-delay: 2s; //延迟执行2s
      transition-timing-function: linear; //直线运动
      transition-duration: 4s; //过渡总时长
   }
   .transition:hover {
      transform: translateX(-50px); // 鼠标悬浮时，向左运动50像素
   }
   ```
2. animation动画 多个transition的组合

### 遇到过什么兼容性问题

### 伪类 VS  伪元素
1. 伪类：
   1. 定义：用来添加一些选择器的特殊效果。 简单理解为，通过新加一个类能实现的效果，可以使用伪类
      ```
      // 用伪类 实现给第一个子元素设置字体颜色
      p > i:first-child {
         color: red
      }
      <p>
         <i>first</i>
         <i>second</i>
      </p>
      // 用class类
      .firstItem{
         color: red
      }
      <p>
         <i class="firstItem">first</i>
         <i>second</i>
      </p>
      ```
   2. 常用选择器： 用一个冒号:
      1. :before
      2. :after
      3. :link
      4. :visited
      5. :focus
      6. :hover
      7. :active
      8. :first-child
      9. :last-child
      10. :nth-child(n)
      11. :empty
      12. 等等...还有好多
   3. 使用demo:
      ```
      // 没有子元素的所有P标签的dom对象，设置颜色为红色
      p:empty{
         color: red; 
      }
      ```
2. 伪元素：
   1. 定义：用于设置元素制定部分的样式。简单理解为：通过新加一个dom元素能实现的效果，可以使用伪元素
      ```
      // 用伪元素 实现给第一个字母设置字体颜色 
      p::first-letter {
         color: red
      }
      <p>I am stephen lee.</p>
      // 新添加元素才能实现
      .first-letter {
         color: red
      }
      <p>
         <span class='first-letter'>I</span> 
         am stephen lee.
      </p>
      ```
      ```
   2. 常用选择器：用两个冒号::
      1. ::before
      2. ::after
      3. ::first-letter
      4. ::first-line
      5. ::selection
3. 伪类 伪元素 的区别：
   1. 用处：伪类的效果可以通过添加一个实际的类来实现，伪元素的效果可以通过添加一个实际的元素来实现。
   2. 写法：:伪类有一个冒号，是旧规范中的约定。 ::伪元素有两个冒号，是css3新规范中引入了双冒号表示伪元素，
   3. :before 和 ::before 的区别：对于CSS2之前已有的伪类，比如:before，单冒号和双冒号的写法::before作用是一样的。
   4. 写法建议：如果只需要兼容webkit、firefox、opera等浏览器，建议对于伪元素采用双冒号的写法，如果不得不兼容IE浏览器，还是用CSS2的单冒号写法比较安全


### 怎么渲染一个宽度是百分比的图片，自适应的方案是什么，怎么解决图片闪烁问题
1. 原因：宽高自适应的图片闪烁，是因为图片加载后造成重排重绘，所以如果知道图片的宽高比，可以预留出图片的大小
2. 解决高度问题：利用:after伪元素，按比例留出高度 
   ```
   // 假设图片宽高比是1:1.3
   .item {
      width: 20px;
      position: relative;    
   }
   .placeholder:after {
      content: '';
      display: block;
      padding-top: 130%; // padding 和 margin 设置百分比时，都是按照父元素的width来设置的。这里使用伪元素，就是假设在img后面有一个兄弟dom，那么.item的宽度就是该伪dom的padding-top的基数，而img的宽度是100%，所以高度可以设置成130%
   }
   .img {
      position: absolute;
      width: 100%;
      left: 0;
      top: 0;
   }
   <div class="item placeholder">
      <img class="img" src="...">
   </div>
   ```
3. 解决图片加载问题：可以使用prefetch或者preload提前加载


### display:none VS opacity:0  VS visibility:hidden
![css隐藏元素](assets/css隐藏元素.png)
1. 子元素是否继承 ？？？ 

### 如何通过 contain 属性 控制 重排和重绘
1. 定义：CSS contain 属性允许开发者声明当前元素和它的内容尽可能的独立于 DOM 树的其他部分。这使得浏览器在重新计算布局、样式、绘图、大小或这四项的组合时，只影响到有限的 DOM 区域，而不是整个页面，可以有效改善性能。
2. 应用：这个属性在包含大量独立组件的页面非常实用，它可以防止某个小部件的 CSS 规则改变对页面上的其他东西造成影响
3. 兼容性：目前各浏览器支持的情况还不那么好
4. 用法：
  1.  contain: size 设置该属性的元素的 尺寸不被它的子元素的尺寸影响
  2.  contain: paint 设置了该属性的节点，如果不在视窗内，则该节点和其子元素节点都不必渲染
  3.  contain: layout 表示区域内的变化，不会影响到区域外的重排重绘


### clip

### 三种动画方式

### css模块化

### css布局
1. float
2. flex
3. grid
4. position

### css继承 + 权重

### vh vw
1. vw  相对于视口的宽度。视口被均分为100单位的vw(即浏览器可视区) 100vw = 可视区宽度
2. vh  相对于视口的高度。视口被均分为100单位的vh(即浏览器可视区) 100vh  = 可视区高度
3. vmin/vmax 分别是 vw和vh 两个长度单位 相对较 小/大的那个。举个例子，一个宽100px，高1000px的视窗。vw的相对长度就是1px,vh的相对长度就是10px. 所以 vmin就是相对小的，这里就是1px的hw, vmax 是相对大的，就是这里的10px的 vh.


### flex:1 是什么意思
1. flex属性 是 flex-grow、flex-shrink、flex-basis三个属性的缩写。
2. flex-grow：定义项目的的放大比例； 
   1. 默认为0，即 即使存在剩余空间，也不会放大；
   2. 所有项目的flex-grow为1：等分剩余空间（自动放大占位）；
   3. lex-grow为n的项目，占据的空间（放大的比例）是flex-grow为1的n倍。
3. flex-shrink：定义项目的缩小比例；
   1. 默认为1，即 如果空间不足，该项目将缩小
   2. 所有项目的flex-shrink为1：当空间不足时，缩小的比例相同；
   3. flex-shrink为0：空间不足时，该项目不会缩小
   4. flex-shrink为n的项目，空间不足时缩小的比例是flex-shrink为1的n倍。
4. flex-basis： 定义在分配多余空间之前，项目占据的主轴空间（main size），浏览器根据此属性计算主轴是否有多余空间
   1. 默认值为auto，即 项目原本大小
   2. 设置后项目将占据固定空间。
5. flex: *; 不同值组合的不同含义：
   1. flex: 0 1 auto 不放大会缩小 占据默认值
   2. flex: 0 0 auto  不放大也不缩小
   3. flex: 1 1 auto  （放大且缩小）
   4. flex为一个非负数字n： flex：n;  该数字为flex-grow的值 即flex-grow：n； flex-shrink：1； flex-basis：0%；
   5. flex为一个长度或百分比L： flex: L; 视为flex-basis的值，即 flex-grow：0；flex-shrink：1；flex-basis：L；
   6. flex为两个非负数字n1，n2： flex：n1 n2;分别为flex-grow和flex-shrink的值。即  flex-grow：n1；flex-shrink：n2；flex-basis：0%；
   7.  flex为一个非负数字n和一个长度或百分比L：flex：n L； 分别为flex-grow和flex-basis的值， 即 flex-grow：n；flex-shrink：1；flex-basis：L;
6. 所以 flex:1 就是 flex-grow:1; 自动放大占满剩余空间，实现自适应布局。


### css 导入 import 和 link 的区别

### css选择器
1. :root 根选择器匹配文档根元素。在 HTML 中，根元素始终是 html 元素。
2. * 所有元素
3. .类名
   1. .classA.classB: 同时有 classA classB 两个类的元素
   2. .classA .classB: 选择 类名 classA后面 所有类名为 classB 的元素
4. ‘#id名’
5. element 就是Html原生的标签
6. elementA.classA 选择类为classA的标签A
7. element,element: 逗号表示 和 
8. elementA elementB 选择标签A`内部`的所有标签B
9. elementA>elementB 选择父亲是标签A的元素中的标签B, 一层亲父子
10. elementA+elementB 表示跟紧标签A的首个标签B
11. `[attribute]` 带有对应属性的所有元素 也可以`[attribute]=value`
12. ...还有超多

### css中的变量
1. sass： 用 $ 声明
2. less： 用 @ 声明
3. 原生css： 
   1. 用 -- 声明 变量名大小写敏感
      ```
      body{
         --color:red;
         --Color:blue;
         --font-stack: fangsong;
      }
      ```
   2. 用 var(变量, (可选)默认值) 读取变量，只能做属性值，不能做属性名
      ```
      div {
         color: var(--color,);
         color: var(--Color,#545454); //第二个参数可选 //第二个参数不处理内部的逗号或空格，都视作参数的一部分
         --logo-text: var(--font-stack); //读取后用于声明新的变量
         <!-- var(--font-stack):'';  //Error:不能做属性名 -->
      }
      ```
   3. 变量类型
      1. 字符串类型：支持拼接
         ```
         div {
            --bar: 'hello';
            --foo: var(--bar)' world'; // ‘hello word’
         }
         ```
      2. 数值类型： 不能直接与单位连用，必须用calc()函数
         ```
         div {
            --gap: 20;
            <!-- margin-top: var(--gap)px;  //无效 -->
            margin-top: calc(var(--gap) * 1px);
         }
         ``` 
   4. 作用域：
      1. 变量的作用域，就是它所在的选择器的有效范围。所以全局的变量通常放在根元素 :root里面，确保任何选择器都可以读取它们。
      2. 同一个css变量，可以在多处声明。读取的时候，优先级最高的生效。跟 CSS 本身的样式层叠规则是一致的。与JS的作用域不同，注意不要混淆。

### 媒体查询
```
@media  and|not|only  mediatype and|not|only (media feature) {
    CSS-Code;
}
// mediatype 媒体类型 常用的有screen 标识屏幕类型
// and|not|only 用来设置查询条件的关系 与｜不｜只有
// media feature 要筛选的媒体的特点 例如 max-width:350px 标识屏幕最大可展示宽度为350px的媒体设备
```

### 图片下方有一条留白
1. 原因：由于img元素默认为inline元素，而inline元素的vertical-align属性的默认值为baseline文字基线对齐，正好图片底部的留白就是baseline和bottom之间的距离
2. 方案：
   1. 将图片设置为BFC:
      1. img{display:block;}把图片设置为块级元素。我们都知道图片img标签默认为内联（inline）元素，把img标签设置为块元素就可以解决底部留白问题。 
      2. 给图片设置float或者position，最终目的就是变成块级元素渲染。注意：使用浮动的话最后要清除浮动
   2. img{vertical-align:bottom} 设置图片的垂直对齐方式：top、middle、bottom
   3. font-size: 0px; 设置父元素的文字大小为0。 注意：子元素的font-size会继承，要重写。
   4. 给父元素添加overflow:hidden。 如果父元素规定了固定的宽高，图片大小就会跟随父元素而定

### What is the difference among sass scss and less ?