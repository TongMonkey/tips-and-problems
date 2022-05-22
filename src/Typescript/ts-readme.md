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