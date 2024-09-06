# WebPlatform.Library.AppSkeleton

## AppSkeleton

### Q&A

1. apps/demo/src/app/app.module.ts 中:
   1. 使用的 SplashScreenModule 是什么作用
   2. providers 数组中，provide: HTTP_INTERCEPTORS 对应了两个 useClass. WorkflowInterceptor 和 TenantInterceptor, multiple interceptors 的执行顺序是什么?
2. apps/demo/src/app/app-routing.module.ts:
   1. Route[] 中， canActivate[] 是什么功能，里面传的 items 是什么？
   2. Route 中的 children[], parent route - child route 组合起来是怎么使用的？
3. WebPlatform.Library.AppSkeleton\libs\wpf-app-skeleton\main-page\src\lib\components\main-page/main-page.component.html 里：
   1. `<router-outlet class="hidden" content></router-outlet>` 这里的 content 是什么意思。
4. 使用 inject(***) insdead of construction DI, 好处是什么？
5. 