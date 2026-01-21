import React, { useState, useRef } from 'react';
import { Student } from '../types';

interface RandomPickerProps {
  students: Student[];
}

const RandomPicker: React.FC<RandomPickerProps> = ({ students }) => {
  const [displayId, setDisplayId] = useState<number | null>(null);
  const [displayName, setDisplayName] = useState<string>("누구일까요?");
  const [isPicking, setIsPicking] = useState(false);
  
  const fanfareSound = useRef<HTMLAudioElement | null>(null);

  const pickStudent = () => {
    if (isPicking) return;
    
    // Initialize sound
    if (!fanfareSound.current) fanfareSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'); // Fanfare trumpet

    setIsPicking(true);
    setDisplayName("두구두구...");

    // Filter only actual students (exclude teacher id 999 if desired, usually picker is for students)
    const candidates = students.filter(s => s.id !== 999);
    
    let counter = 0;
    const maxIterations = 20; // How many shuffles before stop
    const intervalTime = 100; // Speed of shuffle

    const interval = setInterval(() => {
      const randomStudent = candidates[Math.floor(Math.random() * candidates.length)];
      setDisplayId(randomStudent.id);
      counter++;

      if (counter >= maxIterations) {
        clearInterval(interval);
        finalizePick(candidates);
      }
    }, intervalTime);
  };

  const finalizePick = (candidates: Student[]) => {
    const winner = candidates[Math.floor(Math.random() * candidates.length)];
    setDisplayId(winner.id);
    setDisplayName(`${winner.name} 당첨!`);
    setIsPicking(false);
    
    // Play sound
    fanfareSound.current?.play().catch(() => {});
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-cyan-50 rounded-3xl border border-cyan-100">
      
      <div className="flex-1 flex items-center justify-center w-full">
        <div className={`
          w-64 h-64 md:w-[350px] md:h-[350px] bg-white rounded-full flex items-center justify-center
          border-[14px] border-cyan-300 shadow-[0_0_60px_rgba(34,211,238,0.4)]
          transition-all duration-200
          ${isPicking ? 'scale-105 animate-pulse' : 'scale-100'}
        `}>
          <div className="text-center">
             <div className="text-8xl md:text-[9rem] font-bold text-cyan-600 mb-2 leading-none">
               {displayId !== null ? displayId : '?'}
             </div>
             {displayId !== null && (
                <div className="text-2xl text-cyan-400 font-bold mt-2">번 친구</div>
             )}
          </div>
        </div>
      </div>

      <div className="text-4xl md:text-5xl font-bold text-cyan-800 mb-8 min-h-[4rem]">
        {displayName}
      </div>

      <div className="pb-10">
        <button
          onClick={pickStudent}
          disabled={isPicking}
          className={`
            px-12 py-5 text-3xl font-bold rounded-full shadow-xl text-white transition-all
            ${isPicking 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-105 hover:shadow-2xl active:scale-95'
            }
          `}
        >
          <i className="fa-solid fa-wand-magic-sparkles mr-3"></i>
          {isPicking ? '뽑는 중...' : '발표자 뽑기'}
        </button>
      </div>
    </div>
  );
};

export default RandomPicker;