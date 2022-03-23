// 检查是否可用
if ("serviceWorker" in navigator) {
  // 不与首次加载页面的线程抢占系统资源，等渲染好之后再延迟注册
  window.addEventListener("load", function () {
    /**
     * register函数 同域下可以注册多个serviceWorker分管不同的scope
     * 第一个入参：指定要安装的service worker脚本文件的访问位置
     * 第二个入参: 是一个对象
     * 
     */
    navigator.serviceWorker
      .register("/src/ServiceWorker/sw.js", {
        // scope 指定 serviceWorker 要控制的域, 只有指定域名及其子域下的页面发出的请求才命中serviceWorker
        // 指定scope的时候不能“越域”，只有指定域名及其子域，否则注册失败
        // 指定的特例：服务器端可以通过service-worker-allow 来指定scope的层级路径
        scope: "/src",
      })
      .then(function(registion){

      })
      .catch(function(error){

      });
  });
}
