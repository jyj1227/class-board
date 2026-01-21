import React, { useState, useRef } from 'react';

const DiceRoller: React.FC = () => {
  const [result, setResult] = useState<number>(1);
  const [isRolling, setIsRolling] = useState(false);
  
  // Audio Refs
  const rollSound = useRef<HTMLAudioElement | null>(null);
  const successSound = useRef<HTMLAudioElement | null>(null);

  const rollDice = () => {
    if (isRolling) return;

    // Initialize audio context/elements on user interaction
    if (!rollSound.current) rollSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3');
    if (!successSound.current) successSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');

    setIsRolling(true);
    
    // Play rolling sound
    rollSound.current.currentTime = 0;
    rollSound.current.play().catch(() => {});

    // Determine result beforehand
    const newResult = Math.floor(Math.random() * 6) + 1;

    // Wait for animation (1s)
    setTimeout(() => {
      setResult(newResult);
      setIsRolling(false);
      
      // Play success sound
      successSound.current?.play().catch(() => {});
    }, 1000);
  };

  // Helper to determine the CSS class for showing specific face
  const getShowClass = (num: number) => {
    return `show-${num}`;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-violet-50 rounded-3xl border border-violet-100 relative overflow-hidden">
      
      {/* Decorative background elements */}
      <i className="fa-solid fa-star absolute top-10 left-10 text-violet-200 text-5xl animate-pulse"></i>
      <i className="fa-solid fa-dice-d20 absolute bottom-10 right-10 text-violet-200 text-5xl animate-bounce"></i>

      {/* Masively increased scale for "big" visual */}
      <div className="flex-1 flex items-center justify-center w-full">
         <div className="scene scale-[2.0] md:scale-[3.5]">
            <div className={`cube ${getShowClass(isRolling ? Math.floor(Math.random() * 6) + 1 : result)}`}>
              <div className="cube__face cube__face--1">1</div>
              <div className="cube__face cube__face--2">2</div>
              <div className="cube__face cube__face--3">3</div>
              <div className="cube__face cube__face--4">4</div>
              <div className="cube__face cube__face--5">5</div>
              <div className="cube__face cube__face--6">6</div>
            </div>
         </div>
      </div>

      <div className="z-10 text-center pb-12">
        <h2 className="text-3xl font-bold text-violet-800 mb-8 h-8">
           {isRolling ? "굴러가는 중..." : `결과: ${result}!`}
        </h2>

        <button
          onClick={rollDice}
          disabled={isRolling}
          className={`
            px-12 py-5 text-3xl font-bold rounded-full shadow-xl text-white transition-all
            ${isRolling 
              ? 'bg-gray-300 cursor-not-allowed transform scale-95' 
              : 'bg-violet-500 hover:bg-violet-600 hover:scale-105 active:scale-95'
            }
          `}
        >
          {isRolling ? '...' : '주사위 굴리기!'}
        </button>
      </div>
    </div>
  );
};

export default DiceRoller;