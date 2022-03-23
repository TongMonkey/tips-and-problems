// 注册成功之后就会触发安装功能
this.addEventListener("install", function (event) {
  // 用 waitUntil 方法控制流程，只有缓存内容都结束了，install才结束
  event.waitUntil(
    // 定义一块缓存区域
    caches.open("my-cache-v1").then(function (cache) {
      /**
       * 在安装阶段，通常会预缓存一些静态资源. 定义缓存列表
       * 只有列表中的都缓存成功了才成功，有一个失败就install就失败了，所以有风险，要控制定义的静态资源
       */
      return cache.addAll(["/", "/test.js", "test.css"]);
    })
  );
});

// 激活：当获得当前作用域控制权时被触发
this.addEventListener("activate", function (event) {
  // 用 waitUntil 方法控制流程
  event.waitUntil(
    Promise.all([
      // 由于首次加载时没有使用sw，所以安装成功后还需要让首次加载的页面也受sw的控制，才能拦截页面请求
      // claim方法就是能让页面立刻能被sw控制
      this.clients.claim(),
      caches.keys().then(function (cacheList) {
        return Promise.all(
          cacheList.map(function (cacheName) {
            // 不属于该sw的缓存将会被丢弃
            if (cacheName !== "my-cache-v1") {
              return caches.delete(cacheName);
            }
          })
        );
      }),
    ])
  );
});
