import React, { useState, useEffect } from 'react';
import { RefreshCcw, Send, Eraser } from 'lucide-react';

interface WordItem {
  id: string;
  text: string;
  count: number;
  color: string;
  rotation: number;
  fontSize: number;
}

const COLORS = [
  'text-red-500', 'text-orange-500', 'text-amber-500', 'text-green-500', 
  'text-emerald-500', 'text-teal-500', 'text-cyan-500', 'text-sky-500', 
  'text-blue-500', 'text-indigo-500', 'text-violet-500', 'text-purple-500', 
  'text-fuchsia-500', 'text-pink-500', 'text-rose-500'
];

const WordCloud: React.FC = () => {
  const [input, setInput] = useState('');
  const [words, setWords] = useState<WordItem[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);

  // Sample data for initial impression or empty state
  useEffect(() => {
    if (words.length === 0) {
      // Optional: Start empty or with instructions
    }
  }, []);

  const addWord = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    // Check if word exists
    const existingIndex = words.findIndex(w => w.text === trimmed);

    if (existingIndex >= 0) {
      // Increment count and size
      const newWords = [...words];
      newWords[existingIndex].count += 1;
      newWords[existingIndex].fontSize = Math.min(newWords[existingIndex].fontSize + 10, 150); // Cap size
      setWords(newWords);
    } else {
      // Add new word
      const newWord: WordItem = {
        id: Date.now().toString(),
        text: trimmed,
        count: 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() > 0.7 ? (Math.random() * 20 - 10) : 0, // 30% chance of rotation
        fontSize: 40 + Math.random() * 20
      };
      setWords([...words, newWord]);
    }
    setInput('');
  };

  const clearWords = () => {
    if (confirmClear) {
      setWords([]);
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  const shuffleLayout = () => {
    setWords(words.map(w => ({
      ...w,
      rotation: Math.random() > 0.7 ? (Math.random() * 20 - 10) : 0,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    })));
  };

  return (
    <div className="h-full flex flex-col bg-teal-50 rounded-2xl border border-teal-100 overflow-hidden relative">
      
      {/* Title */}
      <div className="absolute top-3 left-3 z-10">
        <h2 className="text-xl font-bold text-teal-800 bg-white/80 backdrop-blur px-3 py-1 rounded-lg shadow-sm">
          <i className="fa-solid fa-cloud mr-2"></i>배움 정리 단어 구름
        </h2>
      </div>

      {/* Cloud Display Area */}
      <div className="flex-1 p-4 flex flex-wrap items-center justify-center content-center overflow-hidden gap-4">
        {words.length === 0 ? (
          <div className="text-center text-teal-300">
            <i className="fa-regular fa-comment-dots text-7xl mb-2 opacity-50"></i>
            <p className="text-xl font-bold">배운 내용을 입력해보세요!</p>
          </div>
        ) : (
          words.map((word) => (
            <span
              key={word.id}
              className={`font-bold ${word.color} transition-all duration-500 cursor-default select-none hover:scale-110 drop-shadow-sm`}
              style={{
                fontSize: `${word.fontSize}px`,
                transform: `rotate(${word.rotation}deg)`,
                lineHeight: 1
              }}
            >
              {word.text}
            </span>
          ))
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-white p-2 border-t border-teal-100 flex items-center gap-2">
        <form onSubmit={addWord} className="flex-1 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="단어를 입력하고 엔터를 누르세요..."
            className="flex-1 px-4 py-2 text-lg rounded-xl bg-teal-50 border border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder-teal-300 text-teal-900"
          />
          <button 
            type="submit"
            className="w-12 bg-teal-500 hover:bg-teal-600 text-white rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-all"
          >
            <Send size={20} />
          </button>
        </form>
        
        <div className="flex gap-2 border-l pl-2 border-gray-200">
          <button 
            onClick={shuffleLayout}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl flex items-center justify-center transition-colors"
            title="모양 섞기"
          >
            <RefreshCcw size={18} />
          </button>
          <button 
            onClick={clearWords}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              confirmClear ? 'bg-red-500 text-white' : 'bg-red-50 hover:bg-red-100 text-red-400'
            }`}
            title={confirmClear ? "정말 지울까요?" : "지우기"}
          >
            {confirmClear ? <span className="font-bold text-lg">!</span> : <Eraser size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordCloud;