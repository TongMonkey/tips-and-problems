# Python

## Python App

1. 在启动搜索栏里搜索 IDLE, 可以找到 IDLE Shell 3.*.* 的包 （目前我下载的是 Python 3）。
2. IDLE is an editor.
3. 交互页面分为两个界面：
   1. Interactive shell:
   2. File editor:

## Syntax

1. Expressions
   1. 注释：以 # 开始
   2. string * n：跟 JS 不同，不会进行自动数字转换，而是重复 n 遍字符串
   3. def ❓❓❓
2. Varieables
3. Statements

    ``` c
        'Alice' * 3  // 'AliceAliceAlice'
        'Hello' + '!' * 5  // 'Hello!!!!!'

        spam = 42;
        spam * 2; // 84
        spam = 'Hello'
        spam + 'World' // 'Hello World'

        spam = 2 + 2
        spam = spam + 1
        spam // 5
    ```

4. Functions
   1. print('Hello world'): print out text。

      ``` c
         print('Hello World')
         // Hello World

         print('Hello', end='')
         print('World')
         // HelloWorld

         print('Hello', end='123')
         print('World')
         // Hello123World

         print('Hello', 'World') // 中间会自带一个空格分隔
         // Hello World

         print('Hello', 'World', '!'，sep='123')
         // Hello123World123!
      ```

   2. input(): Python waits for the user to type some text on a keyboard and press Enter. 取到的结果是 string 类型
   3. len(): return the length of a string
   4. str()/int()/float()/bool(): convert the type of value
   5. range(): 设置一组数值，默认每次值变化为+1，可以修改
      1. range(5): 0~4, 共5个数
      2. range(12, 16): 12~16, not including 16
      3. range(0, 10, 2): 修改递增值，从0到9每次递增2，所以结果就是 0，2，4，6，8
      4. range(5, -1, -1): 从5开始递 -1，直到 -1（不包含-1），所以结果是 5，4，3，2，1，0.
5. Operators
   1. if
   2. elif: else if
   3. else
   4. block: 用缩进表示 block 代码块。 New blocks begin only after statements that end with a colon like in a If statement.
   5. while & break & continue:
      1.Ctrl-C can interrupt an infinite loop.
      1. break causes the execution to immediately leave the loop, without re-checking the condition.
      2. continue causes the execution to immediately jump back to the start of the loop and re-check the condition.
   6. for
6. 自动转化
   1. 0 和 0.0 是 falsy, 其余都是 truthy

## Modules in Python

### Python build-in functions

1. Standard Library: is a set of modules
2. Each module is a Python program that contains a related group of functions that can be used
3. 导入的语法:
   1. import muduleName 更加普通且常用
   2. `from random import *` 星号表示 import everything
4. example:

   ```c
    import random
    import random, sys, os, math
    random.randint(1, 10)

    from random import *
    randint(1, 10) 用 import * 这样的形式，就不用写 "random." 了

    import sys
    sys.exit() 结束当前这次 execution，后面的代码不会执行
   ```

### Third party modules

1. Pipp Tool: Install third party modules using Pipp program
2. 注意：这个只能在 terminal command line 中 run
3. 语法：

   ``` c
      // 找到 pip 的位置在 C:\Python311\Scripts> pip.exe 后执行
      C:\Python311\Scripts> pip.exe install pyperclip
      import pyperclip
      pyperclip.copy("hello world")
      pyperclip.paste()
   ```

4. Examples:
5. Modules
   1. pyperclip: give you the ability to copy and paste text to and from the clipboard.
   2. selenium Module
6.

#### Selenium

1. 定义：Selenium 是一个用于自动化网页浏览器的开源工具。它主要用于自动化测试网页应用程序，但也可以用于其他任务，如网页数据抓取和自动化操作。以下是有关 Selenium 的一些关键点：
2. 主要功能
   1. 浏览器自动化：Selenium 可以模拟用户在网页浏览器中的操作，如点击按钮、输入文本、导航到不同的网页等。
   2. 跨浏览器兼容性：Selenium 支持多种浏览器，包括 Google Chrome、Mozilla Firefox、Safari、Microsoft Edge 和 Internet Explorer。
   3. 多语言支持：Selenium 提供多种编程语言的绑定，包括 Java、Python、C#、Ruby、JavaScript 和 Kotlin，使得开发者可以使用熟悉的语言编写自动化脚本。
   4. 分布式测试：Selenium Grid 允许将测试任务分布在多个机器上并行执行，提高测试效率。
3. 组件：
   1. Selenium WebDriver: WebDriver 是 Selenium 的核心组件，它提供了与浏览器交互的接口。WebDriver 直接控制浏览器，并执行自动化脚本中的指令。selenum.webdriver module provides all the WebDriver implementations.
4. Examples

   ``` python
      from selenium import webdriver
      from selenium.webdriver.common.keys import Keys
      from selenium.webdriver.common.by import By

      driver = webdriver.Firefox()

      driver.get("http://www.python.org")
      // The driver.get method will navigate to a page given by the URL
      // WebDriver will wait until the page has fully loaded (that is, the “onload” event has fired) before returning control to your test or script. 

      assert "Python" in driver.title
      // 断言某字符串是否存在

      elem = driver.find_element(By.NAME, "q")
      elem.clear()
      elem.send_keys("pycon")
      elem.send_keys(Keys.RETURN)
      assert "No results found." not in driver.page_source
      driver.close()
      // Close the browser tab. 如果只有一个 tab 开着，就会关掉整个 browser window
      // driver.quit() function is similar, but will close entire browser, close all browser tabs.
   ```

## WebDriver

1. 定义：WebDriver 是一种浏览器自动化工具，最初由 Selenium 项目开发。它提供了一种编程接口，允许开发人员编写代码来控制和自动化网页浏览器。这种工具非常适用于自动化测试、网页抓取和其他需要与网页交互的任务。

## Chromedriver

1. 定义：是一个独立的可执行文件，用于控制 Google Chrome 浏览器，特别是在自动化测试和浏览器操作的场景下。它实现了 WebDriver 协议，并通过 Chrome 浏览器的 DevTools 协议与浏览器进行通信。
2. 主要功能：
   1. 浏览器控制：ChromeDriver 专门用于控制 Google Chrome 浏览器，能够模拟用户操作，如点击按钮、输入文本、导航到不同的网页等
   2. 实现 WebDriver 协议:ChromeDriver 实现了 WebDriver 协议，这是一种标准化的接口，用于浏览器自动化。WebDriver 协议由 W3C 定义，并被多种浏览器驱动实现。
   3. 与 Selenium WebDriver 写作：ChromeDriver 通常与 Selenium WebDriver 一起使用。Selenium WebDriver 提供了一个通用的接口，用于编写跨浏览器的自动化测试脚本，而 ChromeDriver 则负责具体执行这些脚本中的命令。
3. 工作原理：
   1. 接受命令：ChromeDriver 接收来自 Selenium WebDriver 的命令。这些命令可能是通过编程语言（如 Python、Java、C# 等）编写的自动化脚本发出的
   2. 执行操作：ChromeDriver 将这些命令转换为 Chrome 浏览器可以理解的操作，并通过 Chrome 浏览器的 DevTools 协议与浏览器进行通信，执行相应的操作。
   3. 返回结果：ChromeDriver 执行操作后，将结果返回给 Selenium WebDriver，后者再将结果传递给用户的自动化脚本。
4. 安装：下载地址：<https://sites.google.com/a/chromium.org/chromedriver/downloads> 下载适用于 Chrome 浏览器版本的 ChromeDriver. 之后放在系统的 PATH 中，或者在脚本中指定路径

## WebDriver VS Selenium WebDriver VS ChromeDriver

``` c

WebDriver、Selenium WebDriver 和 ChromeDriver 是三个相关但不同的概念，理解它们之间的区别和关系对于使用它们进行浏览器自动化非常重要。以下是它们的详细解释和区别：

### 1. WebDriver

#### 概述
- **WebDriver** 是一种浏览器自动化协议，由 W3C 标准化。它定义了一组接口和方法，用于控制和自动化网页浏览器。

#### 主要功能
- **跨浏览器兼容性**：WebDriver 协议可以用于不同的浏览器，只要有对应的浏览器驱动支持。
- **编程接口**：提供统一的编程接口，开发人员可以使用不同的编程语言（如 Java、Python、C# 等）来编写自动化脚本。

#### 角色
- **标准**：WebDriver 是一个标准协议，用于浏览器自动化。
- **接口定义**：定义了浏览器自动化所需的接口和方法。

### 2. Selenium WebDriver

#### 概述
- **Selenium WebDriver** 是 Selenium 项目中的一个组件，它实现了 WebDriver 协议，并提供了一个编程接口，用于与浏览器进行自动化交互。

#### 主要功能
- **浏览器控制**：使用 Selenium WebDriver 可以模拟用户在浏览器中的操作，如点击、输入、导航等。
- **多语言支持**：Selenium WebDriver 提供多种编程语言的绑定，包括 Java、Python、C#、Ruby、JavaScript 和 Kotlin。
- **跨浏览器支持**：支持多种浏览器，包括 Google Chrome、Mozilla Firefox、Safari、Microsoft Edge 和 Internet Explorer。

#### 角色
- **实现 WebDriver 协议**：Selenium WebDriver 实现了 WebDriver 协议，并提供了与不同浏览器驱动（如 ChromeDriver、GeckoDriver）的接口。
- **工具库**：提供了丰富的工具和功能，用于编写和执行浏览器自动化脚本。

### 3. ChromeDriver

#### 概述
- **ChromeDriver** 是一个独立的可执行文件，实现了 WebDriver 协议，并专门用于与 Google Chrome 浏览器进行通信。

#### 主要功能
- **控制 Google Chrome**：ChromeDriver 专门用于控制 Google Chrome 浏览器，执行自动化测试脚本。
- **实现 WebDriver 协议**：ChromeDriver 实现了 WebDriver 协议，能够理解来自 Selenium WebDriver 的命令，并将其转换为 Chrome 浏览器的操作。

#### 角色
- **浏览器驱动**：ChromeDriver 是 Google Chrome 浏览器的驱动程序，负责接收来自 Selenium WebDriver 的命令，并与 Chrome 浏览器进行通信。
- **中间层**：作为中间层，ChromeDriver 将 Selenium WebDriver 的命令转换为 Chrome 浏览器可以理解的操作，并返回执行结果。

### 关系和区别

1. **WebDriver**：
   - **定义**：一种浏览器自动化协议，由 W3C 标准化。
   - **角色**：定义了浏览器自动化所需的接口和方法。

2. **Selenium WebDriver**：
   - **定义**：Selenium 项目中的一个组件，实现了 WebDriver 协议。
   - **角色**：提供了一个编程接口，用于编写和执行跨浏览器的自动化脚本。

3. **ChromeDriver**：
   - **定义**：Google Chrome 浏览器的驱动程序，实现了 WebDriver 协议。
   - **角色**：作为中间层，接收来自 Selenium WebDriver 的命令，并与 Chrome 浏览器进行通信。
```

## Example

1. `pip install selenium`
2. 下载适用于浏览器的驱动程序，比如 ChromeDriver
3. 编写并运行 python 脚本

   ``` python
      from selenium import webdriver
      from selenium.webdriver.common.keys import Keys

      # 初始化 Chrome 浏览器驱动
      driver = webdriver.Chrome(executable_path='/path/to/chromedriver')

      # 打开 Google 首页
      driver.get("https://www.google.com")

      # 找到搜索框并输入查询
      search_box = driver.find_element_by_name("q")
      search_box.send_keys("Selenium WebDriver")
      search_box.send_keys(Keys.RETURN)

      # 关闭浏览器
      driver.quit()
   ```
