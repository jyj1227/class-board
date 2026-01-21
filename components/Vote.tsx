import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, CheckCircle2, Eye, EyeOff, RotateCcw, Pencil } from 'lucide-react';

interface VoteOption {
  id: string;
  text: string;
  count: number;
  color: string;
}

const COLORS = [
  'bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-green-400', 
  'bg-emerald-400', 'bg-teal-400', 'bg-cyan-400', 'bg-blue-400', 
  'bg-indigo-400', 'bg-violet-400', 'bg-purple-400', 'bg-fuchsia-400', 'bg-pink-400', 'bg-rose-400'
];

// Internal component for the firework effect
const FireworkEffect: React.FC = () => {
  // Create 100 particles for a bigger explosion
  const particles = Array.from({ length: 100 }).map((_, i) => {
    const angle = Math.random() * 360;
    const distance = 150 + Math.random() * 450; // Larger explosion radius
    const tx = Math.cos(angle * (Math.PI / 180)) * distance;
    const ty = Math.sin(angle * (Math.PI / 180)) * distance;
    const colorClass = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    return {
      id: i,
      tx,
      ty,
      color: colorClass,
      delay: Math.random() * 0.3, // Spread out the pop
      size: 8 + Math.random() * 10
    };
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
       {/* CSS for the animation */}
      <style>{`
        @keyframes firework-explode {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          40% { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
      `}</style>
      
      {particles.map(p => (
         <div
           key={p.id}
           className={`absolute rounded-full shadow-sm ${p.color}`}
           style={{
             width: `${p.size}px`,
             height: `${p.size}px`,
             animation: `firework-explode 2s ease-out forwards`,
             animationDelay: `${p.delay}s`,
             '--tx': `${p.tx}px`,
             '--ty': `${p.ty}px`,
           } as React.CSSProperties}
         />
      ))}
    </div>
  );
};

const Vote: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [options, setOptions] = useState<VoteOption[]>([
    { id: '1', text: '', count: 0, color: COLORS[0] },
    { id: '2', text: '', count: 0, color: COLORS[1] }
  ]);
  const [isVoting, setIsVoting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  
  // State for effects
  const [showFirework, setShowFirework] = useState(false);
  const fanfareRef = useRef<HTMLAudioElement | null>(null);
  const voteSoundRef = useRef<HTMLAudioElement | null>(null);

  // Preload audio on mount
  useEffect(() => {
    voteSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    fanfareRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
    
    // Set volume
    if (voteSoundRef.current) voteSoundRef.current.volume = 1.0;
    if (fanfareRef.current) fanfareRef.current.volume = 1.0;
  }, []);

  const addOption = () => {
    if (options.length >= 15) return; 
    setOptions([
      ...options,
      { 
        id: Date.now().toString(), 
        text: '', 
        count: 0, 
        color: COLORS[options.length % COLORS.length] 
      }
    ]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) return;
    setOptions(options.filter(opt => opt.id !== id));
  };

  const updateOptionText = (id: string, text: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const handleVote = (id: string) => {
    if (!isVoting || showResults) return; 
    
    // Play Click/Pop Sound
    if (voteSoundRef.current) {
      // Clone to allow overlapping sounds
      const soundClone = voteSoundRef.current.cloneNode() as HTMLAudioElement;
      soundClone.volume = 1.0;
      soundClone.play().catch((e) => console.error("Sound play failed", e));
    }

    setOptions(options.map(opt => opt.id === id ? { ...opt, count: opt.count + 1 } : opt));
  };

  const startVote = () => {
    setIsVoting(true);
    setShowResults(false);
    setConfirmReset(false);
  };

  const toggleResults = () => {
    const nextState = !showResults;
    setShowResults(nextState);

    if (nextState) {
      // Trigger Firework
      setShowFirework(true);
      setTimeout(() => setShowFirework(false), 2500);

      // Play Fanfare Sound
      if (fanfareRef.current) {
        fanfareRef.current.currentTime = 0;
        fanfareRef.current.play().catch((e) => console.error("Fanfare play failed", e));
      }
    }
  };

  const resetVotes = () => {
    if (confirmReset) {
      setOptions(options.map(opt => ({ ...opt, count: 0 })));
      setShowResults(false);
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000); 
    }
  };

  const editVote = () => {
    setIsVoting(false);
    setShowResults(false);
    setConfirmReset(false);
  };

  const totalVotes = options.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="h-full flex flex-col bg-indigo-50 p-6 rounded-3xl border border-indigo-100 overflow-hidden relative">
      
      {/* Render Firework Effect Overlay */}
      {showFirework && <FireworkEffect />}

      {/* Header / Config Area */}
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4 z-10">
        <div className="flex-1 w-full">
          {isVoting ? (
            <div className="flex items-center gap-3">
               <h2 className="text-3xl font-bold text-indigo-700 md:text-left pl-2">
                 Q. {topic || "투표 주제"}
               </h2>
               <div className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-lg font-bold">
                 총 {totalVotes}명 참여
               </div>
            </div>
          ) : (
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="투표 주제를 입력하세요 (예: 오늘 체육 뭐 할까?)"
              className="w-full text-2xl font-bold text-indigo-800 placeholder-indigo-300 border-b-2 border-indigo-100 focus:border-indigo-400 outline-none py-2 bg-transparent transition-colors"
            />
          )}
        </div>
        
        <div className="flex space-x-2 shrink-0">
          {!isVoting ? (
             <button 
             onClick={startVote}
             className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold transition-transform active:scale-95 flex items-center"
           >
             <CheckCircle2 className="mr-2" /> 투표 시작
           </button>
          ) : (
            <>
              <button 
                onClick={toggleResults}
                className={`px-4 py-2 rounded-xl font-bold flex items-center text-white transition-colors ${showResults ? 'bg-gray-500 hover:bg-gray-600' : 'bg-orange-400 hover:bg-orange-500'}`}
              >
                {showResults ? <><EyeOff className="mr-2" size={20}/> 결과 숨기기</> : <><Eye className="mr-2" size={20}/> 결과 공개</>}
              </button>
              <button 
                onClick={resetVotes}
                className={`px-4 py-2 rounded-xl font-bold flex items-center transition-all ${
                  confirmReset 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                }`}
              >
                <RotateCcw className="mr-2" size={20}/> 
                {confirmReset ? "정말 초기화?" : "초기화"}
              </button>
              <button 
                onClick={editVote}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold flex items-center"
              >
                <Pencil className="mr-2" size={20}/> 수정
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto z-0">
        {!isVoting ? (
          /* Edit Mode - Force 3 columns on MD+ */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {options.map((option, index) => (
              <div key={option.id} className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-indigo-50">
                <div className={`w-8 h-8 rounded-full ${option.color} flex items-center justify-center text-white font-bold mr-3 shrink-0`}>
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => updateOptionText(option.id, e.target.value)}
                  placeholder={`선택지 ${index + 1}`}
                  className="flex-1 text-lg font-medium text-gray-700 outline-none min-w-0"
                />
                {options.length > 2 && (
                  <button onClick={() => removeOption(option.id)} className="text-gray-300 hover:text-red-400 p-2 shrink-0">
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
            {options.length < 15 && (
              <button 
                onClick={addOption}
                className="flex items-center justify-center bg-white/50 border-2 border-dashed border-indigo-200 p-4 rounded-xl text-indigo-400 hover:bg-indigo-50 hover:border-indigo-300 transition-colors font-bold"
              >
                <Plus className="mr-2" /> 선택지 추가
              </button>
            )}
          </div>
        ) : (
          /* Voting Mode */
          <div className="h-full flex flex-col justify-center px-4">
             {/* Blind Voting Mode - Force 3 columns on MD+ */}
             {!showResults && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {options.map((option, index) => (
                    <button
                      key={option.id}
                      onClick={() => handleVote(option.id)}
                      className="group relative bg-white p-8 rounded-3xl shadow-md border-2 border-indigo-50 hover:border-indigo-300 hover:shadow-lg transition-all active:scale-[0.98] active:bg-indigo-50 flex items-center"
                    >
                      <div className={`w-16 h-16 rounded-full ${option.color} flex items-center justify-center text-3xl text-white font-bold mr-6 shadow-sm group-hover:scale-110 transition-transform shrink-0`}>
                        {index + 1}
                      </div>
                      <span className="text-3xl font-bold text-gray-700 truncate">{option.text || `선택지 ${index + 1}`}</span>
                      
                      {/* Click Feedback Effect */}
                      <div className="absolute inset-0 rounded-3xl bg-indigo-200 opacity-0 group-active:opacity-20 transition-opacity pointer-events-none"></div>
                    </button>
                  ))}
                </div>
             )}

             {/* Results Mode */}
             {showResults && (
                <div className="space-y-6">
                  {options.map((option, index) => {
                    const percentage = totalVotes === 0 ? 0 : Math.round((option.count / totalVotes) * 100);
                    return (
                      <div key={option.id} className="group">
                        <div className="flex justify-between items-end mb-2 px-1">
                          <span className="text-2xl font-bold text-gray-700 flex items-center">
                            <span className={`w-8 h-8 rounded-full ${option.color} text-sm text-white flex items-center justify-center mr-3`}>{index + 1}</span>
                            {option.text || `선택지 ${index + 1}`}
                          </span>
                          <span className="text-3xl font-bold text-indigo-900">
                            {option.count}표 <span className="text-lg font-normal text-gray-500">({percentage}%)</span>
                          </span>
                        </div>
                        <div className="w-full h-14 bg-white rounded-full overflow-hidden shadow-inner border border-gray-100 relative">
                          <div 
                            className={`h-full ${option.color} transition-all duration-1000 ease-out flex items-center justify-end pr-4 opacity-90`}
                            style={{ width: `${percentage}%`, minWidth: option.count > 0 ? '20px' : '0' }}
                          >
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Vote;