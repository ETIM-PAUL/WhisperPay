import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';  // default styles

function EventCountdownCalendar({ endDate }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(endDate) - +new Date();
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div style={{margin: 'auto', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <p className="text-xl font-bold text-red-500 mb-4">Event Date</p>

      {/* Calendar */}

      {/* Countdown */}
      <div style={{ marginTop: 20, fontSize: '1.5rem', fontWeight: 'bold' }}>
        {timeLeft ? (
          <>
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s left
          </>
        ) : (
          <span>The event has started or ended!</span>
        )}
      </div>

      {/* Styles to highlight the date */}
      <style>{`
        .highlight {
          background: #4caf50 !important;
          color: white !important;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}

export default EventCountdownCalendar;
