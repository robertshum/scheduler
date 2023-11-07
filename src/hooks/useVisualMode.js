import { useState } from "react";

export default function useVisualMode(initial) {

  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  //transition method
  function transition(inputState, isReplace = false) {
    setMode(inputState);

    if (isReplace) {
      setHistory(
        prevHistory =>
          [...prevHistory.slice(0, prevHistory.length - 1), inputState]);
      return;
    }

    setHistory(prevHistory => [...prevHistory, inputState]);
  };

  function back() {
    if (history.length !== 1) {
      setHistory(
        prevHistory =>
          [...prevHistory.slice(0, prevHistory.length - 1)]);
    }
  }

  return { mode: history[history.length - 1], transition, back };
};
