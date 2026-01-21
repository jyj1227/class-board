import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const Timer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(300); // Default 5 min
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(300);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Play alarm sound
      if (!audioRef.current) {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Gentle bell
      }
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  const setDuration = (minutes: number) => {
    const seconds = minutes * 60;
    setInitialTime(seconds);
    setTimeLeft(seconds);
    setIsActive(false);
  };

  const progressPercentage = (timeLeft / initialTime) * 100;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-2 pb-4">
      
      {/* Timer Visuals - Slightly reduced size */}
      <div className="relative w-72 h-72 md:w-[400px] md:h-[400px] mb-6 flex items-center justify-center">
        {/* Background Circle */}
        <div className="absolute inset-0 rounded-full border-[20px] border-gray-100"></div>
        
        {/* Progress SVG */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
           <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#FDBA74" /* Orange-300 */
            strokeWidth="8"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * progressPercentage) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        <div className="text-6xl md:text-8xl font-bold text-gray-700 tabular-nums">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Controls - Reduced size */}
      <div className="flex space-x-4 mb-6">
        <button 
          onClick={toggleTimer}
          className={`
            w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white text-2xl shadow-lg transition-transform active:scale-95
            ${isActive ? 'bg-orange-300 hover:bg-orange-400' : 'bg-green-400 hover:bg-green-500'}
          `}
        >
          {isActive ? <Pause fill="currentColor" size={32} /> : <Play fill="currentColor" className="ml-1" size={32} />}
        </button>
        <button 
          onClick={resetTimer}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 flex items-center justify-center text-2xl shadow-lg transition-transform active:scale-95"
        >
          <RotateCcw size={32} />
        </button>
      </div>

      {/* Quick Selectors - Reduced size */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[1, 3, 5, 10, 15, 30].map(min => (
          <button
            key={min}
            onClick={() => setDuration(min)}
            className="px-5 py-2 bg-white border-2 border-orange-100 rounded-xl text-orange-600 text-lg font-bold hover:bg-orange-50 hover:border-orange-300 transition-colors shadow-sm"
          >
            {min}분
          </button>
        ))}
      </div>
    </div>
  );
};

export default Timer;