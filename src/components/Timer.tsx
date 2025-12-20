import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import doneSound from "../assets/done.mp3";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import { RiResetLeftFill } from "react-icons/ri";

export const Timer = () => {
  const [time, setTime] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);
  const soundRef = useRef(new Audio(doneSound));
  const [isDone, setIsDone] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    if (!isRunning || time <= 0) return;

    const intervalId = setInterval(() => {
      setTime((prevTime) => {
        const newTime = prevTime - 100;
        if (newTime <= 0) setIsDone(true);
        return newTime <= 0 ? 0 : newTime;
      });
    }, 100);

    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  useEffect(() => {
    if (isDone) {
      soundRef.current.load();
      soundRef.current.play();
    } else {
      soundRef.current.pause();
    }
  }, [isDone]);

  const editTimer = () => {
    setIsRunning(!isRunning);
    setIsDone(false);
  };

  const handleMinutesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const minutes = Number(e.target.value);
    setMinutes(minutes);
  };
  const handleSecondsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const seconds = Number(e.target.value);
    setSeconds(seconds);
  };

  useEffect(() => {
    setIsRunning(false);
    const minToSec = minutes * 60;
    const totalSec = minToSec + seconds;
    const miliSec = totalSec * 1000;
    setTime(miliSec);
  }, [seconds, minutes]);

  const updateTimer = useMemo(() => {
    const min = Math.floor(time / 1000 / 60);
    const sec = (time % 60000) / 1000;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }, [time]);

  const resetTimer = () => {
    setIsDone(false);
    setIsRunning(false);
    const minToSec = minutes * 60;
    const totalSec = minToSec + seconds;
    const miliSec = totalSec * 1000;
    setTime(miliSec);
  };

  return (
    <div className="timer">
      <div className="timer-inputs">
        <input
          type="text"
          id="min"
          value={minutes}
          onChange={handleMinutesChange}
        />
        <p className="timer-text">min</p>
        <input type="text" value={seconds} onChange={handleSecondsChange} />
        <p className="timer-text">sek</p>
      </div>

      <div className={`time-container ${isDone ? "flashing" : ""}`}>
        <p className="time">{updateTimer}</p>
      </div>
      <div className="timer-buttons">
        <button onClick={editTimer}>
          {isRunning ? <CiPause1 /> : <CiPlay1 />}
        </button>
        <button onClick={resetTimer}>
          <RiResetLeftFill />
        </button>
      </div>
    </div>
  );
};
