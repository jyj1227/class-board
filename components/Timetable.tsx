import React, { useState } from 'react';
import { ChevronDown, Check, PenLine } from 'lucide-react';

const PREDEFINED_SUBJECTS = [
  '국어', '수학', '사회', '과학', '영어', 
  '체육', '음악', '미술', '도덕', '실과', 
  '창체', '안전', '자율', '동아리', '급식'
];

const Timetable: React.FC = () => {
  // Initial state: 6 periods (6th is empty by default)
  const [schedule, setSchedule] = useState<string[]>(['국어', '수학', '체육', '급식', '과학', '']);
  
  // State for notes/materials per period
  const [notes, setNotes] = useState<string[]>(['', '', '', '', '', '']);

  // Track completion state for strikethrough effect
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false, false, false]);
  
  // Track which rows are in "Custom Input" mode
  const [customMode, setCustomMode] = useState<boolean[]>([false, false, false, false, false, false]);

  const handleSelectChange = (index: number, value: string) => {
    if (value === 'DIRECT_INPUT') {
      const newModes = [...customMode];
      newModes[index] = true;
      setCustomMode(newModes);
      
      const newSchedule = [...schedule];
      newSchedule[index] = '';
      setSchedule(newSchedule);
    } else {
      const newSchedule = [...schedule];
      newSchedule[index] = value;
      setSchedule(newSchedule);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const newSchedule = [...schedule];
    newSchedule[index] = value;
    setSchedule(newSchedule);
  };

  const handleNoteChange = (index: number, value: string) => {
    const newNotes = [...notes];
    newNotes[index] = value;
    setNotes(newNotes);
  };

  const switchToDropdown = (index: number) => {
    const newModes = [...customMode];
    newModes[index] = false;
    setCustomMode(newModes);
    
    // Default to '국어' if empty when switching back
    if (!schedule[index]) {
       const newSchedule = [...schedule];
       newSchedule[index] = '국어';
       setSchedule(newSchedule);
    }
  };

  const toggleComplete = (index: number) => {
    const newCompleted = [...completed];
    newCompleted[index] = !newCompleted[index];
    setCompleted(newCompleted);
  };

  return (
    <div className="h-full flex flex-col bg-lime-50 p-2 md:p-4 rounded-3xl border border-lime-100 overflow-hidden relative">
      
      {/* List Container */}
      <div className="flex-1 flex flex-col justify-center overflow-y-auto">
        <div className="w-full max-w-7xl mx-auto space-y-2 px-1">
          {schedule.map((subject, index) => {
            const period = index + 1;
            const isCustom = customMode[index];
            const isDone = completed[index];
            const note = notes[index];

            return (
              <div key={index} className={`flex items-center bg-white p-2 rounded-2xl shadow-sm border border-lime-200 transition-all duration-300 ${isDone ? 'bg-gray-50 border-gray-100' : 'hover:scale-[1.01]'}`}>
                
                {/* Completion Checkbox */}
                <button 
                  onClick={() => toggleComplete(index)}
                  className={`shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full border-4 flex items-center justify-center mr-2 md:mr-4 transition-all ${
                    isDone 
                      ? 'bg-lime-500 border-lime-500 text-white shadow-sm' 
                      : 'bg-white border-lime-200 text-transparent hover:border-lime-400'
                  }`}
                  title={isDone ? "완료 취소" : "완료 표시"}
                >
                  <Check size={28} strokeWidth={4} />
                </button>

                {/* Period Badge - '교시' removed, number maximized */}
                <div className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center font-bold mr-2 md:mr-4 border transition-colors ${
                  isDone 
                    ? 'bg-gray-100 text-gray-400 border-gray-200' 
                    : 'bg-lime-100 text-lime-700 border-lime-200'
                }`}>
                  <span className="text-4xl md:text-6xl">{period}</span>
                </div>

                {/* Content Area */}
                <div className={`flex-1 flex flex-col md:flex-row gap-2 transition-all duration-300 ${isDone ? 'opacity-30 pointer-events-none grayscale line-through decoration-4 decoration-lime-800/50' : ''}`}>
                  
                  {/* 1. Subject Selector */}
                  <div className="md:w-[45%] relative">
                    {isCustom ? (
                      // Custom Text Input Mode
                      <div className="flex items-center gap-2 h-full">
                        <input
                          type="text"
                          value={subject}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                          placeholder="과목명"
                          disabled={isDone}
                          className="w-full h-full text-4xl md:text-5xl font-bold text-gray-700 px-2 py-1 border-b-4 border-lime-300 focus:outline-none focus:border-lime-500 bg-transparent placeholder-lime-300/50"
                        />
                        <button 
                          onClick={() => switchToDropdown(index)}
                          className="p-2 text-gray-400 hover:text-lime-600 hover:bg-lime-50 rounded-full transition-colors"
                          title="목록에서 선택하기"
                        >
                          <i className="fa-solid fa-list-ul text-2xl"></i>
                        </button>
                      </div>
                    ) : (
                      // Dropdown Mode
                      <div className="relative w-full h-full group">
                        <select
                          value={PREDEFINED_SUBJECTS.includes(subject) ? subject : (subject ? 'DIRECT_INPUT' : '')}
                          onChange={(e) => handleSelectChange(index, e.target.value)}
                          disabled={isDone}
                          className="w-full h-full appearance-none bg-lime-50/50 hover:bg-lime-100 transition-colors border-2 border-transparent hover:border-lime-200 rounded-xl px-4 py-1 text-4xl md:text-5xl font-bold text-gray-700 cursor-pointer focus:outline-none focus:ring-4 focus:ring-lime-300 disabled:bg-transparent"
                        >
                           <option value="" disabled hidden>선택</option>
                          {PREDEFINED_SUBJECTS.map(subj => (
                            <option key={subj} value={subj}>{subj}</option>
                          ))}
                          <option disabled>──────────</option>
                          <option value="DIRECT_INPUT" className="font-bold text-lime-700">✎ 직접 입력</option>
                        </select>
                        {!isDone && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-lime-400 group-hover:text-lime-600">
                            <ChevronDown className="w-8 h-8" strokeWidth={4} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 2. Note Input */}
                  <div className="flex-1 relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-lime-500">
                      <PenLine size={28} />
                    </div>
                    <input 
                      type="text"
                      value={note}
                      onChange={(e) => handleNoteChange(index, e.target.value)}
                      placeholder="준비물"
                      disabled={isDone}
                      className="w-full h-full pl-14 pr-4 py-1 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-lime-300 focus:outline-none text-2xl md:text-4xl text-gray-600 placeholder-gray-300 transition-colors"
                    />
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-1 text-center text-lime-600/70 text-sm font-medium">
        * 왼쪽 체크박스를 누르면 완료된 수업을 지울 수 있어요.
      </div>
    </div>
  );
};

export default Timetable;