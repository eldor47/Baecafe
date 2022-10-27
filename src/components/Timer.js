import React, { useEffect, useState } from "react";
import "../styles/Timer.css";

function Timer() {

  const calculateTimeLeft = () => {
    var currDate = new Date()
    var endDate = new Date(Date.UTC(2022, 9, 27, 14, 0, 0))
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
      <div className='time-top' key={interval}>
        {value}
        <div className='time-bottom'>
          {interval}
        </div>
      </div>
    );
  });
  return (
    <div>
      <div className='time-holder'>
        {timerComponents.length ? timerComponents : <></>}
      </div>
      {timerComponents.length ? (
        <h1 className="presale">PRESALE <span className="pink">BEGINS</span></h1>
      ) : <></>}
    </div>
  );
}

export default Timer;