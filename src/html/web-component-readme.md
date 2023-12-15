# Web Component

## 基本概念

### Web Component 定义

1. 定义：自定义一个元素，作为 web component

### Shadow DOM 是啥

1. 背景：自定义元素的重要方面就是 封装。因为按照定义，一个自定义元素，就是一个可以被复用的功能，它可能被放进任何的网页，并且应该能够正常运行。所以在任何页面中，自定义元素的崩溃，都不应该影响到页面的其他部分。
2. 定义：Shadow DOM 可以往一个 element 上绑定上一个 DOM tree, 并且当前页面的运行与这个 subtree 的运行是独立隔离开的。或者说，这段 shadow DOM 的内部是 hidden from the main page 隐藏的。
3. 角色：
   1. Shadow Host: The regular DOM node that the shadow DOM is attached to.被 shadow DOM 绑定到的那个 DOM node 就是 shadow host.
   2. shadow Tree: The DOM tree inside the shadow DOM.
   3. shadow boundary: The place where the shadow DOM ends, and the regular DOM begins.
   4. shadow Root: The root node of the shadow tree. 这棵 subtree 的根元素就是 shadow root.
   5. shadow Host == shadow Root.
4. 结构：![Shadow Dom Tree structure](../assets/shadowDomTREE.svg)
5. 对比：
   1. 相同：对 nodes 的用法，与正常的 DOM node 用法一样。可以给它的 children 添加节点、可以处理它的 styles.
   2. 不同：对 shadow DOM nodes 的处理，不会影响到 outside.
6. 封装：
   1. 封装JS Encapsulation from JavaScript. 
      1. `host.attachShadow({ mode: "open" });` open 参数给主页面提供了一种方式去 break encapsulation of shadow DOM.
      2. `host.attachShadow({ mode: "closed" });`. 通过 close 这个 breaker, host.shadowRoot returns null.
      3. 注意：这个 mode 模式控制并不是一个强安全机能，有其他能绕过它的方式可以打破封装。所以更多的，我们把它当成一种"表态"，表明这个主页面不允许访问 shadow DOM.
      4. 用法：

         ``` code
            // Will use this div element as the shadow host.
            <div id="host"></div>
            <span>I'm not in the shadow DOM</span>
            <button id="upper" type="button">Uppercase shadow DOM span elements</button>
            <button id="lower" type="button">Lowercase shadow DOM span elements</button>
            <button id="reload" type="button">Reload</button>

            // 1. mode: open
            // Create the shadow DOM by calling attachShadow() funtion on the host
            const host = document.querySelector("#host");
            const shadow = host.attachShadow({ mode: "open" }); // mode: open 
            // const shadow = host.attachShadow({ mode: "closed" });  // mode: closed
            const span = document.createElement("span");
            span.textContent = "I'm in the shadow DOM";
            shadow.appendChild(span);

            //  从主页面的btn发起事件大写字符。结果：只有主页面的元素响应了改变，因为 document.query* & mode: open
            const upper = document.querySelector("button#upper");
            upper.addEventListener("click", () => {
               const spans = Array.from(document.querySelectorAll("span")); // document
               for (const span of spans) {
                  span.textContent = span.textContent.toUpperCase();
               }
            });

            //   从主页面的btn发起事件小写字符。结果：只有 Shadow DOM 响应了改变, 因为 host.shadowRoot.query* & mode: open
            const lower = document.querySelector("button#lower");
            lower.addEventListener("click", () => {
               const spans = Array.from(host.shadowRoot.querySelectorAll("span")); // host.shadowRoot
               for (const span of spans) {
                  span.textContent = span.textContent.toLowerCase();
               }
            });

            // 2. mode: closed
            // 当把 mode 改为 closed. upper 事件仍然生效，但 shadow DOM 的 lower event 无响应。
         ```

   2. 封装 CSS Encapsulation from CSS
      1. 生效前提：跟上面一样，mode: open
      2. 2种用法：参考链接：<https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#encapsulation_from_css>
      3. 
