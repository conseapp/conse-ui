import React from 'react'
import { useTimer } from 'react-timer-hook';

export default function Timer({expiryTimestamp, onExpire}) {
    const {
        totalSeconds,
        seconds,
        minutes,
      } = useTimer({ expiryTimestamp, onExpire: onExpire });
  return (
    <div>
    <span>{minutes}</span>:<span>{seconds}</span>
    </div>
  )
}
