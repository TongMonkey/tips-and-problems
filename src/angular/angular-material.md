# Angular-Material

## Read Source Code

### Button

1. Location: `C:\Personal-XXT\Projects\angular-material\components\src\material\button\*`
2. Questions:
   1. 所有的 button 都 extends MatButtonBase, 是干什么的
   2. Focus 方法干嘛的。_focusMonitor = inject(FocusMonitor)。 FocusMonitor 干嘛的
   3. MAT_ANCHOR_HOST 是怎么被用的？
   4. 为什么在 onInit 中使用 runOutsideAngular 执行 _haltDisabledEvents. Note: 在 使用 stopImmediatePropagation.
   5. button.css VS button-theme.css 区别怎么用
   6. button.html 等 template 是怎么做的。最重要的是，怎么做的条件判断?
   7. 