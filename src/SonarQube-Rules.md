# Sonar Qube

## Rules

### References

1. Cognitive Complexity: 认知复杂度
   1. 报错原文：Refactor this function to reduce its Cognitive Complexity from 25 to the 15 allowed.
   2. 定义：❓❓❓
   3. 参考链接：`https://www.sonarsource.com/docs/CognitiveComplexity.pdf`
   4. 怎么降低 复杂度 参考链接：`https://hardiquedasore.medium.com/how-to-reduce-cognitive-complexity-of-a-function-730cbdbf6e46`
      1. Move repeated code/nested if else to a seperate function
      2. Use ternary operator
      3. Avoid if-else loops for always truthy of falsy conditions ❓❓❓
      4. Use Array.includes instead of multiple 'or' conditions in if else loops
      5. Optional chaining
      6. Setting default value using selector operator.
2. Extract the assinment of "..." from this expression

   ``` c
      let someBoolean = true;
      // 在子表达式中赋值很难被发现，使代码的可读性下降
      condifiton ? someFunc() : someBoolean = false;
   ```
