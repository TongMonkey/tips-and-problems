## Jest
参考链接：https://www.jianshu.com/p/7c2eea7ea4d6

### Matchers Synchronously
1. .toBe(): 使用 Object.is 来判断完全相等， 如果想对比对象的值，应该使用 toEqual
2. .toEqual(): 递归地 检查对象或者数组的每一个属性
3. .not.*  例如.not.toBe(); test for the opposite of a matcher
#### type: Truthiness 为真性
1. toBeNull 
2. toBeUndefined 
3. toBeDefined 
4. toBeTruthy 
5. toBeFalsy 
#### type: Numbers 数字型
1. toBeGreaterThan
2. toBeGreaterThanOrEqual
3. toBeLessThan
4. toBeLessThanOrEqual
5. toBe 也适用于数值
6. toEqual 也适用于数值
#### type: String 字符串
1. toMatch
2. .not.toMatch
#### type: Arrays and Iterables 数组与类数组
1. toContain
2. .not.toContain
#### type: Exceptions 例外情况
1. toThrow

### Test Asynchronously
1. 使用 Promise.then
2. 使用 async-await with .resolves and .rejects
3. 使用 callback with 'done' callback ???

### 工具方法
1. beroreEach && afterEach: 为每个test所重复调用的方法
2. beforeAll && afterAll: 只调用一次的方法
3. describe: 将测试的内容分成不同的 scope 来测试。 
   1. 每个 scope 里也可以写 beforeEach 等工具方法
   2. 内外顺序：顶层的工具方法 》scope内的工具方法： 外层的先执行 the top-level beforeEach is executed before the beforeEach inside the describe block


### 方法间的执行顺序
1. 先执行所有 describe 里的非 test 方法，同时根据声明的顺序收集所有 test 方法
2. 再按照收集顺序，依次执行 test
    ```
    describe('describe outer', () => {
    console.log('describe outer-a');
    
    describe('describe inner 1', () => {
        console.log('describe inner 1');

        test('test 1', () => console.log('test 1'));
    });

    console.log('describe outer-b');

    test('test 2', () => console.log('test 2'));

    describe('describe inner 2', () => {
        console.log('describe inner 2');

        test('test 3', () => console.log('test 3'));
    });

    console.log('describe outer-c');
    });

    // describe outer-a
    // describe inner 1
    // describe outer-b
    // describe inner 2
    // describe outer-c
    // test 1
    // test 2
    // test 3
    ```
3. 外部的 before* 和 after* 方法，在每个 test 的前后按照声明的顺序调用 (!!注意：这里的顺序，是 Jest 的顺序，Jasmine 的顺序有点不同)
    ```
    beforeEach(() => console.log('connection setup'));
    beforeEach(() => console.log('database setup'));

    afterEach(() => console.log('database teardown'));
    afterEach(() => console.log('connection teardown'));

    test('test 1', () => console.log('test 1'));

    describe('extra', () => {
    beforeEach(() => console.log('extra database setup'));
    afterEach(() => console.log('extra database teardown'));

    test('test 2', () => console.log('test 2'));
    });

    // connection setup
    // database setup
    // test 1
    // database teardown
    // connection teardown

    // connection setup
    // database setup
    // extra database setup
    // test 2
    // extra database teardown
    // database teardown
    // connection teardown
    ```



### expect.assertions 是什么？？？