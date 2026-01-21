import React, { useState, useEffect } from 'react';
import { RefreshCcw, Send, Eraser, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

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
  const [isLoading, setIsLoading] = useState(false); // AI 로딩 상태

  // AI 생성 함수
  const generateAIWords = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      alert("API 키가 설정되지 않았습니다! Vercel 설정에서 VITE_GEMINI_API_KEY를 확인하세요.");
      return;
    }

    if (!input.trim()) {
      alert("어떤 주제로 만들지 단어를 입력해주세요! (예: 동물, 역사, 여름)");
      return;
    }

    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `
        주제: "${input}"
        이 주제와 관련된 단어 20개를 쉼표(,)로 구분해서 나열해줘. 
        설명 없이 단어만 적어줘. 한국어로 적어줘.
        예시: 사과, 배, 포도, 수박
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // 응답받은 텍스트를 쉼표 기준으로 쪼개서 단어 구름에 추가
      const newWordsList = text.split(',').map(w => w.trim()).filter(w => w.length > 0);
      
      const aiWords: WordItem[] = newWordsList.map(w => ({
        id: Date.now().toString() + Math.random(),
        text: w,
        count: 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() > 0.7 ? (Math.random() * 20 - 10) : 0,
        fontSize: 30 + Math.random() * 30
      }));

      setWords(prev => [...prev, ...aiWords]);
      setInput(''); // 입력창 비우기

    } catch (error) {
      console.error("AI Error:", error);
      alert("AI가 단어를 생각하다가 실패했어요 😭 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <i className="fa-solid fa-cloud mr-2"></i>AI 단어 구름
        </h2>
      </div>

      {/* Cloud Display Area */}
      <div className="flex-1 p-4 flex flex-wrap items-center justify-center content-center overflow-hidden gap-4">
        {words.length === 0 ? (
          <div className="text-center text-teal-300">
            <i className="fa-regular fa-comment-dots text-7xl mb-2 opacity-50"></i>
            <p className="text-xl font-bold">주제를 입력하고 AI 버튼을 눌러보세요!</p>
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
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addWord()}
            placeholder="주제를 입력하세요 (예: 여름, 공룡)"
            className="flex-1 px-4 py-2 text-lg rounded-xl bg-teal-50 border border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder-teal-300 text-teal-900"
          />
          
          {/* 수동 추가 버튼 */}
          <button 
            onClick={() => addWord()}
            className="w-12 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-xl flex items-center justify-center transition-all"
            title="그냥 추가하기"
          >
            <Send size={20} />
          </button>

          {/* ✨ AI 생성 버튼 (핵심 기능) */}
          <button 
            onClick={generateAIWords}
            disabled={isLoading}
            className="px-4 bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-500 hover:to-emerald-600 text-white rounded-xl flex items-center gap-2 shadow-md active:scale-95 transition-all font-bold"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            {isLoading ? "생각 중..." : "AI 생성"}
          </button>
        </div>
        
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
