import { useState, useEffect, useRef } from "react";

/**
 * 倒计时器组件
 * 使用window.requestAnimationFrame
 */
function Countdown(props) {
  const [count, setCount] = useState(0);
  const [duration, setDuration] = useState(0);
  const countdownRef = useRef(null); //用来存储倒计时器
  const previousTimeRef = useRef(null); //存储上次修改倒计时的时间戳
  const currentCountRef = useRef(0); //存储这一次即将更改倒计时的时间戳
  /**
   * requestAnimationFrame的参数：回调函数
   * @param {*} time  回调函数的参数记录了requestAnimationFrame调用这个回调函数的时间戳
   * @returns
   */
  const animate = (time) => {
    if (previousTimeRef.current !== undefined) { // 倒计时过程中
      const deltaTime = time - previousTimeRef.current; // 每次时间差就是一帧的时间16ms 等积累到1000才会更改计时器
      // 这个1000 控制了计时器变化的时间间隔
      if (deltaTime > 1000) {
        if (currentCountRef.current > 0) {
          previousTimeRef.current = time;
          setCount((prevCount) => {
            currentCountRef.current = prevCount - 1000;
            return prevCount - 1000;
          });
        } else {
          setCount(0);
          cancelAnimationFrame(countdownRef.current);
          return;
        }
      }
    } else {
      previousTimeRef.current = time; // 第一次倒计时 记录时间
    }
    countdownRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const totalDuration = 60 * 1000; //倒计时1分钟
    setCount(totalDuration);
    setDuration(totalDuration);
  }, []);

  useEffect(() => {
    if (duration <= 0) {
      return;
    }
    currentCountRef.current = duration;
    previousTimeRef.current = undefined;
    if (countdownRef.current) {
      cancelAnimationFrame(countdownRef.current);
    }
    countdownRef.current = requestAnimationFrame(animate); // 第一次 开始倒计时
    return () => cancelAnimationFrame(countdownRef.current);
  }, [duration]);

  return <div>倒计时 {count/1000}</div>;
}

export default Countdown;
