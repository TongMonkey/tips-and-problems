# Typescript

## TS 基础

### any 与 unknown 类型的区别

1. any 不关心不会操作 unknown会先确定类型再操作 
2. 包含的范围 any比unknown更大一点
3. ???

### 类型断言

1. 定义：变量有明确的类型，由开发者手动设置类型
2. 写法
   1. `<number>name` 用一对尖括号包裹类型放在变量前面
   2. `name as number` 使用 as 关键词

### 类里的 get 函数 什么意思, 为什么作为方法不用写()括号就能调用了？究竟是不是调用了

1. code:

    ``` c
        class A {
            names: Array = [];
            name: String ='abc';
            get names(){
                return this.names;
            }
            this.names.push(name);
        }
    ```

### Class

1. 定义：TS offers full support for the Class in ES6.
2. members:
   1. readonly:
   2. abstract:
   3. protected:
   4. private:
   5. public
