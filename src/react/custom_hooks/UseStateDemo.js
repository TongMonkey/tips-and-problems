/**
 * 简易版useState实现
 * 源代码中使用单向链表来实现状态的记录，这里使用Array进行模拟
 */
import ReactDOM from "react-dom";
import React from "react";
const stateArray = []; //存储State
let curIndex = 0; //记录操作state的序号

const useState = (initialState) => {
  const _curIndex = curIndex;
  stateArray[_curIndex] = stateArray[_curIndex] || initialState;
  const setState = (newState) => {
    stateArray[_curIndex] = newState;
    render();
  };
  curIndex++;
  return [stateArray[_curIndex], setState];
};

function UseStateDemo() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("xxt");
  const clickHandler = () => {
    setCount(count + 1);
  };
  const changeNameHandler = (newName) => {
    setName(newName);
  };
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
      <UseStateDemo />
    </React.StrictMode>,
    document.getElementById("root")
  );
  curIndex = 0; //每一次渲染后都应从新开始计
};

export { render };
export default UseStateDemo;
