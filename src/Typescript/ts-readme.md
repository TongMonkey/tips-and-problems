## Typescript

### *.d.ts 是什么文件
1. 定义：d 是 declaration 的缩写 即 type declaration files 类型声明文件
2.  

### any 与 unknown 类型的区别
1. any 不关心不会操作 unknown会先确定类型再操作 
2. 包含的范围 any比unknown更大一点
3. ???

### 类型断言 ？

### 类里的 get 函数 什么意思, 为什么作为方法不用写()括号就能调用了？究竟是不是调用了
```
class A {
    names: Array = [];
    name: String ='abc';
    get names(){
        return this.names;
    }
    this.names.push(name);
}
```

### 文件搜索顺序 
1. 注意：这里用*代表任意模块名了，而不是通配符
2. relative 相对路径时
   1. *.ts
   2. *.tsx
   3. *.d.ts
   4. */package.json
   5. */index.ts
   6. */index.tsx
   7. */index.d.ts
3. nonrelative 非相对路径时 在一个 /A/index.ts 里 import ... from '*' 
   1. /A/node_modules/*.ts (*.tsx *.d.ts)
   2. /A/node_modules/*/package.json  (with "types" property)
   3. /A/node_modules/@types/*.d.ts
   4. /A/node_modules/*/index.ts (index.tsx index.d.ts)
   5. /node_modules/*.ts (*.tsx *.d.ts)
   6. /node_modules/*/package.json
   7. /node_modules/@types/*.d.ts
   8. /node_modules/*/index.ts (index.tsx index.d.ts)     