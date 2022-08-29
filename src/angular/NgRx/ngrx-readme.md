## NgRx

### 定义

### 原理

### 核心组成部分
1. Store
   1. 定义: 提供全应用范围内的全局状态管理。Global state across an entire application
   2. 使用: 想提供一个全局都可以用的状态:
      1. 导入 StoreModule.forRoot 并加入根模块的 Imports 数组
         ```
         import { StoreModule } from '@ngrx/store';
         @NgModule({
            imports: [
               // `StoreModule.forRoot` 方法注册了使 store 可以被整个应用使用的全局提供者
               StoreModule.forRoot({ count: counterReducer }),
               ...
            ]，
            ...
         })
         ```
      2. 在组件中，作为 constructor 的参数
         ```
         export class MyCounterComponent {
            count$: Observable<{num: number}>;// TODO: Connect `this.count$` stream to the current store `count` state
            // Store< 这里面表示要引用的数据类型 >
            constructor( private store: Store<{ count: {num: number} }> ) { // The count is from `StoreModule.forRoot` from 'app.module.ts'
               this.count$ = store.select('count');// select 的字符串参数表示要取得的数据的名称是 count 的一部分数据， 也可以看出 store.select(...)的返回结果是一个 ovservable
            }
         }
         ```
      注意：例如这里的 count$ 是observable 对象， 它没办法直接在 template 中使用，所以要先用 async 管道符转换后，才能用 .符号取得其中属性，即 (count$ | async).num
   3. State
      1. 定义：数据状态，store 是存储的所有 state 的总和，通过 store 来访问 state
      2. 更新状态：在组件中，使用 store.dispatch(action) 即可。会有对应 reducer 监听 action 的触发，然后执行响应处理函数，产生新的 state
2. Actions
   1. 定义：actions 描述了各种独一无二的事件，这些事件是由 components 或者 service 触发的
   2. 接口：NgRx中的 Actions 是由一个简单的接口组成的. 
      ```
      interface Action {
         // type 属性用来描述这个 Action 被触发的信息，写法以 [Source] Events 这样的形式表现 action 的分类和从哪里被触发。 action 的 category 被
         type: string;
         // 可以给 action 添加额外的信息或者数据
         username: string;
         password: string;
      }
      ```
   3. code
      ```
      import { createAction, props } from '@ngrx/store';
      // createAction 函数: 当它被调用时返回一个 Action 接口形状的对象。
      export const increment = createAction('[Counter Component] Increment');
      export const decrement = createAction('[Counter Component] Decrement');
      export const reset = createAction('[Counter Component] Reset');
      
      // props 方法，是用来定义 action 中除了 type 属性外其他属性的，这些属性将参与该 action event 的逻辑处理 
      export const login = createAction(
         // 【】里面写的是 action 的分类。这个分类在一些时候会用来分组 比如这个action 的分类就是 登录页面里的事情，是一个分类
         // 【】后面的文字是用来描述 发生了什么事件。比如这个 action 的事件就是登录
         '[Login Page] Login',
         props<{ username: string; password: string }>()
      );

      // 这里的 login 就时一个 action creator login() 返回的就是一个 action 对象
      onSubmit(username: string, password: string) {
         store.dispatch(login({ username: username, password: password }));
      }
      ``` 
   4. 写好 action 的规则
      1. 先写: 在开发之前，先写 action
      2. 分割: 基于事件信息，将 actions 分类
      3. 多写：写 action 的成本不高，写的越多，对事件流程的表述就越清楚
      4. 事件驱动：action 用来捕获事件，而不是捕获命令，因为对事件的描述和处理是分开的
      5. 描述性的：action 的描述信息可以帮助开发者工具的调试
3. Reducer：
   1. 定义：是用来改变 state 的函数，是纯函数，需要当前的 state 和最新 被 dispached 的 action，一番操作后，得出新的 State
   2. 原理：
      1. 每个 reducer 都是一个用来监听 action 的 listener。当一个 action 被触发，所有注册了这个 action 的 reducers 都会接收到， 监听的方法是通过 `on` 方法
      2. 每次 reducer 返回的 new state 都是 immutable, 是一个完全新的对象，不是在原来对象上进行修改。这样的好处就是可以保障原来的被舍弃的状态对象可以被销毁
   3. 用法：
      1. 定义 piece of state
      2. 注册全局状态：导入 StoreModule.forRoot. 就是上面写在 store 下面笔记里的，一个东西
      3. 注册分支状态：导入 StoreModule.forFeature 并加入到 AppModule
         ```
         // Scoreboard.module.ts
         import { StoreModule } from '@ngrx/store';
         import { counterReducer } from './counterReducer.reducer';
         @NgModule({
            imports: [
               StoreModule.forFeature('count', counterReducer)
            ],
         })
         export class ScoreboardModule {}

         // app.module.ts
         import { StoreModule } from '@ngrx/store';
         import { ScoreboardModule } from './scoreboard/scoreboard.module';
         @NgModule({
            imports: [
               StoreModule.forRoot({}), // 不设置全局的状态了
               ScoreboardModule 
            ],
         })
         export class AppModule {}
         ```
      4. 建议；像上面分支状态例子中的 scoreboardFeatureKey， 是先抽象出来一个值，这样可以防止硬编码
   4. code:
      ```
      import { on } from '@ngrx/store';
      import { increment, decrement, reset } from './counter.actions';

      // state 的初始值
      export const initialState = { 
         num: 0,
      };
      export const counterReducer = createReducer(
         initialState, // 初始化 state
         on(increment, (state) => state.num + 1),
         on(decrement, (state) => state.num - 1),
         on(reset, (state) => ({num: 0}))
      );
      ```
   5. 注意：
      1. The exported reducer function is no longer required if you use the default Ivy AOT compiler (or JIT). It is only necessary with the View Engine AOT compiler as function calls are not supported there. ❓❓❓
4. Selectors:
   1. 定义：是用来从 store 中获得 state 的函数，是纯函数
   2. 特性：Selectors 提供了一些 features  ❓❓❓
      1. Portability
      2. Memoization
      3. Composition
      4. Testability
      5. Type Safety
   3. 分类
      1. createFeatureSelector： 获取外层数据
      2. createSelector： 通过 createFeatureSelector 获取内层数据
   4. 用法：
      ```
      import { createSelector, createFeatureSelector } from '@ngrx/store'; 
      export const selectBooksState = createFeatureSelector<ReadonlyArray<Book>>('books');
      export const selectCollectionState = createFeatureSelector<ReadonlyArray<string>>('collection');
      export const selectBookCollection = createSelector(
         selectBooksState,
         selectCollectionState,
         (books, collection) => { // 最后一个函数参数用来实际控制得到何种处理过的数据
            return collection.map((id) => books.find((book) => book.id === id));
         }
      );
      ```
5. Effects
   1. 定义：在一个基于服务的Angular应用程序中，component 负责直接通过 serivce 与外部资源进行交互。相反，effects 提供了一种与这些 service 交互的方式，并将它们与 component 隔离。effects 是你处理业务的地方，如获取数据、产生多个事件的长期运行的任务，以及其他外部交互，你的组件不需要明确了解这些交互。
   2. 核心概念：
      1. Effects isolate side effects from components, allowing for more pure components that select state and dispatch actions.
      2. Effects are long-running services that listen to an observable of every action dispatched from the Store.
      3. Effects filter those actions based on the type of action they are interested in. This is done by using an operator.
      4. Effects perform tasks, which are synchronous or asynchronous and return a new action.
   3. Effects are injectable service classes with distinct parts:
   4. 代码
      ```
      // movie.effects.ts 中
      @Injectable()
      export class MovieEffects {
         // 当组件触发 action 时，effect 需要通过 Actions 类服务接收 Action， 所以在 Effect 类中通过 constructor 参数的方式将 Actions 的实例注入
         // Actions 服务类的实例对象是 Observable 对象，当有 Action 被触发时，Action 对象本身会作为数据流被发出
         constructor( private actions$: Actions, private moviesService: MoviesService ) {}
      
         // 接收的值 loadMovie$ 是一个 observable 对象，当最后反回的那个 action 被触发时，loadMovie$ 就会发出流数据
         loadMovies$ = createEffect(() => {
            // 回调函数中返回 observable 对象，对象中要发出副作用执行完成后要触发的 action 
            return this.actions$.pipe(
               ofType('[Movies Page] Load Movies'), // 每个 action 被触发的时候，都会发出数据流，所以要通过 ofType 过滤得到要处理的 action
               mergeMap(
                  () => {
                     // 返回 observable 对象，对象中要发出副作用执行完成后要触发的 action 
                     return this.moviesService.getAll().pipe(
                        map( movies => {
                           // 返回的就是要最后被触发的 action
                           return { type: '[Movies API] Movies Loaded Success', payload: movies } 
                        }, 
                        catchError(() => EMPTY)
                     )
                  }
               )
            )
         });
      }
      ```
   5. 使用
      1. 在 constructor 中注入 actions$, 并且是 observable 类型的。当有 Action 被触发时，Action 对象本身会作为数据流被发出
      2. createEffect 接受一个回调函数作参数，回调函数中返回 observable 对象，对象中要发出副作用执行完成后要触发的 action 
      3. ofType(): 对目标 Action 对象进行过滤，如果没有过滤到目标action对象，本次不会继续发出数据流；如果找到了，就会将action对象作为数据流继续发出
      4. mergeMap: rxjs操作符，用来合并 observable 对象。接受一个回调函数作参数。
      5. map： rxjs操作符，可以操作 observable 对象
   6. 
6. Entity
   1. 定义：实体，就是集合中的一条数据。
   2. 作用：ngrx提供了实体适配器对象，这个适配器对象提供了各种操作集合中实体的方法，目的就是提高开发者操作实体的效率。
   3. 写在哪里：*.reducer.ts 既然是增强处理一条数据(实体)的能力，那肯定是写在处理数据逻辑的地方，就是reducer
   4. 核心成员：
      1. EntityState: 实体类型接口. 
         1. EntityState 接口类型存储的数据格式：有 ids 和 entities 两个属性
            ```
            {
               ids: [1,2],
               entities: {
                  1: {id: 1, ...}, 
                  2: {id: 2, ...}
               }
            }
            ```
         2. 状态接口继承该实体类型接口后，就也有了ids&entities两个属性
            ```
            export interface State extends EntityState<T> {} 
            ```
         3. 
      2. EntityAdapter： 实体适配器对象类型接口
      3. createEntityAdapter: 创建实体适配器对象的方法
         ```
         const adapter: EntityAdapter<T> = createEntityAdapter<T>();
         const initialState: State = adapter.getInitialState(); //{ ids: [], entities: {} }
         ```
   5. 核心方法
      1. 适配器方法：就是用来操作实体的方法
         1. 目录:
            ```
            // 删
            removeOne: Remove one entity from the collection.
            removeMany: Remove multiple entities from the collection, by id or by predicate.
            removeAll: Clear entity collection.
            // 增
            addOne: Add one entity to the collection.
            addMany: Add multiple entities to the collection.
            // 增 or 改
            upsertOne: Add or Update one entity in the collection. 
            upsertMany: Add or Update multiple entities in the collection. 
            setOne: Add or Replace one entity in the collection.
            setMany: Add or Replace multiple entities in the collection.
            // 改
            setAll: Replace current collection with provided collection.
            updateOne: Update one entity in the collection. Supports partial updates.
            updateMany: Update multiple entities in the collection. Supports partial updates.
            // 遍历(查) + 改
            mapOne: Update one entity in the collection by defining a map function.
            map: Update multiple entities in the collection by defining a map function, similar to Array.map.
            ```
         2. 用法：大部分两个参数的方法是fn(参数,state)，state是作为第二个参数使用的，注意区别
            ```
            on(UserActions.addUser, (state, { user }) => {
               return adapter.addOne(user, state)
            }),
            on(UserActions.setUser, (state, { user }) => {
               return adapter.setOne(user, state)
            })
            // ...
            ```
         3. 注意：目录中的方法，没说 Support partial updates.的就是 不支持局部更新， 比如  upsertOne and upsertMany
      2. 选择器方法：就是用来选择实体的 adapter.getSelectors()
         1. 目录：
            ```
            // 来自 adapter.getSelectors() 的返回值
            const { selectIds, selectEntities, selectAll, selectTotal, } = adapter.getSelectors();
            ```
         2. 用法：不是方法，是变量可直接赋值
            ```
            // 获取 id 集合，以数组形式呈现
            export const selectUserIds = selectIds;

            // 获取实体集合，以字典形式呈现
            export const selectUserEntities = selectEntities;

            // 获取所有数据，以数组形式呈现
            export const selectAllUsers = selectAll;
            
            // 获取数据条数
            export const selectUserTotal = selectTotal;
            ```
   6. Entity 与 Selector 的结合
      1. 用法
         ```
         import { createSelector, createFeatureSelector } from '@ngrx/store'; 
         export const selectBooksState = createFeatureSelector<ReadonlyArray<Book>>('books');
         // 原来:得到所有对象
         export const selectBookCollection = createSelector(selectBooksState,(books) => books);
         // 现在：得到所有实体
         const { selectAll } = adapter.getSelectors();
         export const selectBookCollection = createSelector(selectBooksState,selectAll);
         ```
      2. 
7. ComponentStore
   1. 定义：提供组件范围内的局部状态管理。如果不想使用在全局范围的状态管理，只是想使用临时状态或者组件内的状态，可以使用这个


### 执行过程
1. 图示 ![ngrx状态管理全流程图](../../assets/ngrx-state-management-lifecycle.png)
2. 注意
   1. 所有的 actions 在应用内被触发时，永远是先被 reducer 处理，然后才是 effects ❗❗❗
3. 