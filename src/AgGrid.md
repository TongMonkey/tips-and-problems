# Ag Grid

## Scrolling performance improvements

### DOM Virtualization

1. Row Virtualization
   1. 定义：优先只渲染视窗内的DOM的技术R
   2. Row Buffer:
      1. 定义：默认情况下，网格会在第一条可见行之前渲染10行，在最后一条可见行之后渲染10行。原文：By default the grid will render 10 rows before the first visible row and 10 rows after the last visible row
      2. 默认值：这个 20 就是 row buffer 的默认值。可以通过修改属性 rowBuffer 来修改该值，例如 `rowBuffer = 0`
      3. 作用：用来计算 rows 要渲染的高度。比如默认高度是 42px，如果设置 rowBuffer = 10, 那么就会默认创建一个 420px 的高度来优先渲染 grid.
   3. 最大渲染数：
      1. 500 rows
      2. 解除 500 条的限制：`suppressMaxRenderedRowRestriction=true`
   4. 取消行虚拟化：`suppressRowVirtualisation=true` 此时 Row Buffer 缓冲区没有了 并且设置的 rowBuffer 属性会被忽略而无效
2. Column Virtualization
   1. 定义：列的虚拟化是在网格水平滚动时插入和移除列
   2. Column Buffer? ：
      1. 没有列缓冲区：除了可见集之外，没有额外的列被渲染。
      2. 原因：这是因为水平滚动不像垂直滚动那样消耗CPU，因此不需要缓冲器来获得良好的UI体验。原文：This is because horizontal scrolling is not as CPU intensive as vertical scrolling, thus the buffer is not needed for a good UI experience.
   3. 取消列虚拟化：`suppressColumnVirtualisation=true`
3. Demo Address: `https://plnkr.co/edit/?open=app%2Fapp.component.ts&preview`

### Massive Row Count

1. 背景：由于 DOM Virtualization 的优化，浏览器能渲染多少行数据是没有限制的。但实际上，每个浏览器都对div的最大高度有一个限制。这个限制没有公布，所以不同的浏览器以及不同的浏览器版本之间会有差异。例如，Chrome v89的最大高度为32,000,000像素，此数值可能随版本而变化。
2. AgGrid 查 div 最大高度：
   1. 在 AgGrid 初始化时会测试 div 的最大默认高度
   2. code: 要想知道网格确定的div的最大高度是多少，可以设置网格属性 `debug=true`，并注意日志输出： `AG Grid.RowContainerHeightService: maxDivHeight = 32000000`
3. 问题：比如一个 div 的最大高度是32000000px, 每行 row 的最大高度是 100px时，那就最多能渲染 3200000 行。尽管 DOM Virtualisatioin 可以先渲染一部分节点，但是仍然需要正确设置 container 的高度，使滚动条能正确工作。如果要渲染的东西超过3200000rows，就需要解决高度限制的问题
4. 解决办法：
   1. Stretching 拉伸: 一个 能渲染 32000000 px 的 div 内，100px/row, 理论上能展示 3200000 rows. 但现在通过 scretching,可以展示 1000000 rows.
   2. 原理：
      1. 公式：

         ``` code

            // see how many extra pixels we need to show all rows
            const additionalPixelsNeeded = combinedRowHeight - maxDivHeight;

            // see what % down we have vertically scrolled
            const scrollPercent = scrollY / maxScrollY;

            // we offset rows by by additionalPixelsNeeded times the scroll %
            const rowOffset = scrollPercent * additionalPixelsNeeded;

         ```

      2. Div stretch offset: translateY(rowOffset):
         1. translate:
            1. 不会改变元素的原始位置，检验方式：用 myDom.offsetTop 获取元素距离 top 的距离时，无法获取 translateY 的移动距离
            2. 为什么 translate 不会改变原始位置：translate 不会触发浏览器的 reflow 或者 repaint，只会触发 compositions 复合绘制
            3. 什么是 compositions? 浏览器绘制图层的流程是什么？
            4. 为什么用transform更高效？ 使浏览器为元素创建一个 GPU 图层，translate改变位置时，元素依然会占据其原始空间，如果改变绝对定位会触发重新布局，进而触发重绘和复合。因此translate()更高效，可以缩短平滑动画的绘制时间。
      3. 检验：在 Ag Grid 中设置属性 debug = true, 可以看到：AG Grid.RowContainerHeightService: Div Stretch Offset = 30836432.020472683 (68000000 * 0.4534769414775395) 其中小数是 scrollPercent 68000000 是 additionalPixelsNeeded
   3. 弊端：Scroll faster
      1. 当越多的 rows 根据 Row Offset 去调整了位置，约往下滚动，会发现 grid 好像滚动的更快了。这是因为，由于向下拉伸，但视窗大小不变，本质上是在把 row 往上拉(reposition rows up), 所以会形成相对速度，比正常的滚动看起来更快。
      2. 滚动速度增快的速率 与 所需额外空间 成正比。
      3. 能否规避：官网说不能。滚动加快是展示海量数据的必然副作用之一，只要 grid 受限于浏览器，而浏览器对 div 的最大高度有限制，就必然会有这个问题。
   4. 其他方案：使用分页，或者干脆不要展示如此多的数据

### Scrolling Performance 滚动优化方案

1. 检查 Cell Renderer： Cell Renderer 会创造更多更复杂的 DOM
2. 考虑使用 Javascript Cell Renderer 而不是 Angular Cell Renderer. 
3. 使用 Value Getter 或 Value Formatter 代替 Cell Renderer. 因为前两者都不会产生更多 DOM
4. 避免设置自动高度：`autoHeight = true` 也会给每个 cell 创造更多的复杂 DOM. 跟浏览器绘制原理有关
5. 少用动画 Animations: 包括 row animation 和 column animation
6. 考虑配置 Row Buffer: 设置一个比较低的 rowBuffer 可以使初始化时的绘制更快。设置一个比较高的 rowBuffer 可以减少垂直方向肉眼可见的重绘
7. 考虑用 Batch Update Transaction 批处理频繁改动的数据
8. 在一些慢的浏览器中可以考虑使用 Debounce Vertical Scroll 垂直滚动防抖 `debounceVerticalScrollbar=true`
9. 使用 `api.ensureIndexVisible(index)`会滚动页面，来确保该 index 伸缩面板能展示全。示例地址：`https://plnkr.co/edit/?open=app%2Fapp.component.ts&preview`