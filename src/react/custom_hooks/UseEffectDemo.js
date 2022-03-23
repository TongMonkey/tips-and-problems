/**
 * 简易版useEffect实现,
 */
import ReactDOM from "react-dom";
import React, { useState } from "react";
const depsArray = []; //二维数组，存储useEffect的依赖项
let depIndex = 0; //记录执行useEffect的序号

function UseEffectDemo() {
  depIndex = 0; //执行useEffect可能不会重新渲染，所以在组件内头部模拟清空数据了

  const [count, setCount] = useState(0);
  const [name, setName] = useState("xxt");

  const clickHandler = () => {
    setCount(count + 1);
  };
  const changeNameHandler = (newName) => {
    setName(newName);
  };
  /******* useEffect start ***********/
  // 有依赖项的话，就跟之前存的依赖项比较 判断是否相等
  const areHookInputsEqual = (prevDeps, nextDeps) => {
    if (!prevDeps && nextDeps) {
      return false;
    }
    for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
      if (Object.is(nextDeps[i], prevDeps[i])) {
        continue;
      }
      return false;
    }
    return true;
  };
  const useEffect = (callback, newDeps) => {
    const _depIndex = depIndex;
    //没有传入依赖项的话，就每次都调用
    if (!newDeps) {
      callback();
      depsArray[_depIndex] = newDeps;
      depIndex++;
      return;
    }
    let prevDeps = depsArray[_depIndex];
    let hasChanged = !!!areHookInputsEqual(prevDeps, newDeps);
    if (hasChanged) {
      //有变化
      callback();
      depsArray[_depIndex] = newDeps;
    }
    depIndex++;
  };
  useEffect(() => {
    console.log("count发生了变化");
  }, [count]);
  useEffect(() => {
    console.log("name发生了变化");
  },[]);
  /******* useEffect end ***********/
  return (
    <>
      <div>{count}</div>
      <button onClick={clickHandler}>点击</button>
      <div>{name}</div>
      <button onClick={() => changeNameHandler("XXT")}>点击</button>
    </>
  );
}
const render = () => {
  ReactDOM.render(
    <React.StrictMode>
      <UseEffectDemo />
    </React.StrictMode>,
    document.getElementById("root")
  );
};

export { render };
export default UseEffectDemo;
