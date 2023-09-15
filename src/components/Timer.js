import React, { useEffect, useState } from "react";
import "../styles/Timer.css";

function Timer() {

  const calculateTimeLeft = () => {
    var currDate = new Date()
    var endDate = new Date(Date.UTC(2023, 8, 23, 18, 0, 0))
    const difference = endDate - currDate;
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    var value = timeLeft[interval]
    if (!timeLeft[interval]) {
      value = 0
    }

    timerComponents.push(
      <li key={interval}>
        <span className='big-number'>{value}</span>
        <span className='small-text'>
          {interval}
        </span>
      </li>
    );
  });
  return (
    <ul>
      {timerComponents.length ? timerComponents : <></>}
    </ul>
  );
}

export default Timer;