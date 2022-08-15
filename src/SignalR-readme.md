## SignalR

### ASP.NET CORE
1. 定义：是一个跨平台、高性能的开源框架，用于构建现代的、基于云连接互联网的应用程序。
2. 特性:
   1. 跨平台 cross platform：可以在不同的开发系统中运行和开发、可以托管在更多的地方，例如 Apache、Docker 等


### SignalR
1. 定义：ASP.NET Core SignalR 是一个开放源代码库，可用于简化向应用添加实时 Web 功能。实时 Web 功能使服务器端代码能够将内容推送到客户端。
2. RPC：SignalR 提供用于创建服务器到客户端远程过程调用 (RPC) 的 API，RPC 从服务器端 .NET Core 代码调用客户端上的函数。 提供多个受支持的平台，其中每个平台都有各自的客户端 SDK。
3. 部分功能：
   1. 自动处理连接管理
   2. 同时向所有连接的客户端发送消息。 例如聊天室
   3. 向特定客户端或客户端组发送消息
   4. ...
4. 处理实时通讯的技术
   1. WebSockets
   2. Server-Sent Events
   3. long polling 长轮询
5. 


### RPC ？？？


### long polling 长轮询
1. 原理：浏览器向服务器发起请求，服务器不会完成相应，而是保持开放，直到服务端真的有所变化，然后响应更新后的数据。如果在一定时间内没有响应，则请求中断。然后浏览器会再一次发起一个新的请求。而服务端则是开启一个定时器，不停地检查是否有update change

### SSE: Server Sent Events
1. 这是一个 HTML5 的特性
2. 原理： 服务器通过 server-sent events 向浏览器发起一个 http 连接，浏览器会监听以流的形式传来的信息，这个连接将会一直保持着，直到主动关闭。 浏览器端通过一个叫 EventSource 的对象接收信息和处理错误
3. 兼容性：Not all browsers support it, but it can easily be polyfilled.
4. 最多连接数: 大部分浏览器的 http 的最大连接数为 6，但 server-sent events 只支持 2 条消息通道
5. 单向：连接是单向连接 one-way connection
   
### Web Sockets
1. 定义: websocket 是一种使用 TCP 来发送消息的标准方式，消息发送支持两个方向，比如从服务端发向客户端，反之亦然。
2. 最大连接数：不收浏览器最多 6 个 HTTP 连接的限制，websockets 的连接最多可以有 50 个左右，
3. 协议：使用 WS protocol

