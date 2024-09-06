# SSME

<https://slb001.sharepoint.com/_layouts/15/search.aspx/?q=ssme>

## SSME Role

1. Definition：Security Subjec tMatter Expert 安全主题专家
2. Duty: Execute all zutomation test (SAST, DAST, etc.) at the beginning of every month, update manual artifacts (TM, CCC, etc) on demand.

### Defination

1. Self-development in Software Security generally and in any areas specific to your TC needs 
2. Threat Model and Risk mitigation consultation for product groups Technology consultation on security issues in SIS and 3rd party products
3. Promotion of secure SW practices
4. A local point of contact for any coordination issues regarding software security
5. Security testing consultation and leadership (specifically SAQP at present)
6. Local Champion for the security aspects of the SLM process wrt TC product needs
7. Eventually, presentation or coordination of local training on the above as per SLM needs
8. To promote and achieve a 'scale-out' of security expertise and testing from its centralized nature in the present


## Workflow

1. SSME 和 dev 负责在月初执行所有的自动化测试，按需求不定时手动更新工具结果
2. dev 应该跟进后续 non-compliance 问题，在每个月的同步会议之前处理完。
3. CSA 和 SSME 和 dev, 在同步会议上一起 review 所有的项目，确定修改问题的 deadline.
4. dev 必须完成所有的 non-compliance 问题，并通知 CSA
5. CSA 通过 SLM 追踪平台二次确认安全限制已经被修复和更新



## CSQP

1. 定义：在项目上到生产环境之前，开发者应该提交 cloud-hosted applications to the Cloud Security Qualification Process, 云安全认证流程，这就是 CSQP.
2. 包含的常规控制有：
   1. SAQP: Application Security Qualification Process 安全应用审核流程
      1. 包含：
         1. Container Scan：用 pipeline 检查 Env → cluster → namespace → pod → image 环境→集群→命名空间→pod→映像
            1. 工具：Trivy
            2. 到底是干啥的 ❓
         2. DAST：Dynamic Application Security Testing. 动态应用安全测试
            1. 作用：黑盒测试通过注入一个错误反射技术用来返回可疑数据从而找到正在运行的应用的脆弱处，DAST 也是用来诊断应用的 running problems，这些是静态分析无法诊断的，比如 authentication issues，server configuration issues, 或者当某已知用户登录时才有的缺陷 等等。
            2. 工具：<https://cloud.appscan.com/AsoCUI/serviceui/home>
            3. 怎么做：
               1. API: 通过 DAST_API pipeline
               2. Website: 手动创建扫描
            4. 结果上传到 QPExpress: 通过 pipeline: QPExpress.Upload_DAST_*
         3. SAST：Static Application Security Testing. 静态应用安全测试
            1. 工具：现在用的是 SonarQube
            2. 怎么做：用pipeline: Prism.SecScan.SAST.*
         4. WhiteSource
            1. 怎么扫描：通过 pipelines.
            2. 结果上传到 QPExpress: 通过 pipelines.
         5. WebRoot：废弃了，用 VirusTotal. 这是一种在线服务，用来分析文件和 URL，从而使用防病毒引擎和网站扫描仪检测病毒、蠕虫、木马和其他类型的恶意内容。它也可以用来检测误报。
         6. SSL certificate check:
         7. Web Header: 检查 HTTP security headers. 现在由 Portal 在 Request Router Service 中统一处理。
   2. NAQP：Network Application Qualification Process 网络应用审核流程
      1. 强制的：是 SINet 斯伦贝谢网络中强制流程。用来保障网络应用能顺利部署，提高用户满意度
      2. 用处：NAQP 在部署之前测试 app, 以查看它们在 SINet 上是否具有可接受的行为，并查看它们对 SINet 基础设置 和对在 SINet 上的其他应用的影响。 NAQP 也可以用在已经部署的应用上，分析其性能以辅助进行性能提升。
      3. 能得到的一些信息：
         1. The size of the traffic between the browser (e.g. Chrome/Internet Explorer) and the webserver.浏览器之间或者服务之间的网络交通拥堵的大小
         2. The number of corresponding round trips per click on the client browser.客户端浏览器上每次点击所对应的往返次数。
         3. Sites that each page would call out to. 每个页面会调用的站点
      4. 标准 NAQP 的建议：
         1. Configure web content caching for at least 7 days, subject to the following: 根据以下规定，配置网页内容缓存至少7天
            1. for an internal app: enable caching for static objects, such as CSS and JavaScript files. 对于内部应用:启用静态对象的缓存，比如CSS和JavaScript文件。
            2. for an externally exposed app: enable caching for non-sensitive data. 对于外部暴露的应用:启用非敏感数据的缓存。
         2. Ensure that the payload for each transaction does not exceed 600 Kbytes, after the browser has cached the data.确保在浏览器缓存数据后，每个事务的有效负载不超过600 kb。最好为所有内容配置HTTP压缩。
         3. Configure HTTP Compression preferably for all content. 最好为所有内容配置HTTP压缩。
         4. Ensure that the response time for each transaction does not exceed 6 seconds, after the browser has cached the data.确保在浏览器缓存数据后，每个事务的响应时间不超过6秒。
         5. Ensure that the round trips (application turns) for each transaction does not exceed 85 requests, after the browser has cached the data. 确保在浏览器缓存数据后，每个事务的往返(应用程序轮询)不超过85个请求。
      5. 怎么做 NAQP?
         1. 自动：每个季度，使用自动化工具 fiddler. setup 教程：https://wiki.slb.com/display/Prism/NAQP+automation+test+tools+setup
         2. 手动：按需求
   3. DPQP：Data Privacy Qaulification Process 数据隐私审核流程
3. 包含的法律控制有：
   1. Legal review
   2. TCC: Trade Customs and Compliance review 贸易、海关和合规审查。

## Container Security

1. definition:

### Trivy

1. definition:
2. CVEs:

## SSR

1. 定义：System and Service Repository, 系统和服务存储库，用来存储一个清单，这个清单包含了 applications + applications 与其他 IT 部分的关系。比如 跟其他 applications/services/integrations集成 的关系。
2. 好处：当我们需要了解在我们的网络中部署了哪些应用或软件，谁拥有它们，这些程序之间用了哪些接口对应哪些功能，SSR 清单就很有价值了。
3. SSR ID: 需要 SSR record 和 id, 用来 execute SSR tasks. 比如 request infrustructure 请求基础设施、开防火墙、在 global ticketing system 中排队, 运行 qualification processes 审核流程，等等，都需要 SSR ID.
4. RCI 的 SSR ID 是3405

## QPExpress

1. 定义：是一个框架，会根据 QP type，借助第三方工具，检查所有 on boarded 到 Azure DevOps 中的 applications
