import React, { useRef } from 'react';
import { Student, EMOTIONS } from '../types';

interface StudentGridProps {
  students: Student[];
  onUpdateStudent: (id: number, updates: Partial<Student>) => void;
}

const StudentGrid: React.FC<StudentGridProps> = ({ students, onUpdateStudent }) => {
  const timerRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const isLongPress = useRef<Record<number, boolean>>({});

  const handleMouseDown = (student: Student) => {
    isLongPress.current[student.id] = false;
    timerRef.current[student.id] = setTimeout(() => {
      isLongPress.current[student.id] = true;
      // Long press action: Toggle Star
      onUpdateStudent(student.id, { hasStar: !student.hasStar });
    }, 600); // 0.6s for long press
  };

  const handleMouseUp = (student: Student) => {
    if (timerRef.current[student.id]) {
      clearTimeout(timerRef.current[student.id]);
    }
    
    if (!isLongPress.current[student.id]) {
      // Short click action: Cycle Emotion
      const currentIndex = EMOTIONS.indexOf(student.emotion);
      const nextIndex = (currentIndex + 1) % EMOTIONS.length;
      // Skip neutral for click cycling if we want, but keeping it for reset is good. 
      // Let's cycle through emotions excluding Neutral if it was Neutral, start with Happy.
      let nextEmotion = EMOTIONS[nextIndex];
      if (student.emotion === '😐') nextEmotion = EMOTIONS[0];
      
      onUpdateStudent(student.id, { emotion: nextEmotion });
    }
  };

  const handleMouseLeave = (student: Student) => {
    if (timerRef.current[student.id]) {
      clearTimeout(timerRef.current[student.id]);
    }
  };

  // Touch support
  const handleTouchStart = (student: Student) => handleMouseDown(student);
  const handleTouchEnd = (student: Student, e: React.TouchEvent) => {
     // Prevent default to avoid double firing with mouse events on some devices
     // e.preventDefault(); 
     handleMouseUp(student);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-yellow-50 p-2 rounded-xl mb-3 text-gray-600 text-sm shadow-sm border border-yellow-100 flex items-center gap-3">
        <i className="fa-solid fa-circle-info text-yellow-500 text-base"></i>
        <span>
          <strong>클릭</strong> 감정 변경, <strong>꾹~(1초)</strong> 칭찬 별⭐
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 pb-8">
        {students.map((student) => (
          <div
            key={student.id}
            className={`
              relative flex flex-col items-center justify-between p-2 rounded-2xl h-28
              transition-all duration-200 select-none cursor-pointer
              shadow-[0_4px_0_0_rgba(0,0,0,0.05)] active:shadow-none active:translate-y-[2px]
              ${student.id === 999 
                ? 'bg-rose-100 border-2 border-rose-200' 
                : 'bg-white border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50'
              }
            `}
            onMouseDown={() => handleMouseDown(student)}
            onMouseUp={() => handleMouseUp(student)}
            onMouseLeave={() => handleMouseLeave(student)}
            onTouchStart={() => handleTouchStart(student)}
            onTouchEnd={(e) => handleTouchEnd(student, e)}
          >
            {/* Star Badge */}
            <div className={`absolute top-1 right-1 text-xl transition-transform duration-300 ${student.hasStar ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
              ⭐
            </div>

            {/* Emotion Emoji */}
            <div className="flex-1 flex items-center justify-center text-5xl lg:text-5xl filter drop-shadow-sm transform transition-transform hover:scale-110">
              {student.emotion}
            </div>

            {/* Name Label */}
            <div className={`
              w-full py-1 rounded-xl text-center font-bold text-base
              ${student.id === 999 ? 'bg-rose-200 text-rose-800' : 'bg-gray-100 text-gray-600'}
            `}>
              {student.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentGrid;