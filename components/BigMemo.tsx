import React, { useState } from 'react';
import { Minus, Plus, Eraser } from 'lucide-react';

const BigMemo: React.FC = () => {
  const [fontSize, setFontSize] = useState(60);
  const [text, setText] = useState("");

  return (
    <div className="h-full flex flex-col">
      {/* Controls */}
      <div className="flex justify-between items-center mb-2 bg-yellow-50 p-2 rounded-xl border border-yellow-100">
        <div className="flex items-center space-x-2">
           <span className="font-bold text-yellow-700 mr-2 text-sm">글자 크기</span>
           <button 
             onClick={() => setFontSize(Math.max(20, fontSize - 10))}
             className="w-8 h-8 bg-white rounded-full shadow border border-yellow-200 flex items-center justify-center hover:bg-yellow-100 active:scale-95"
           >
             <Minus size={16} className="text-yellow-600"/>
           </button>
           <span className="w-10 text-center font-bold text-base text-gray-600">{fontSize}</span>
           <button 
             onClick={() => setFontSize(Math.min(200, fontSize + 10))}
             className="w-8 h-8 bg-white rounded-full shadow border border-yellow-200 flex items-center justify-center hover:bg-yellow-100 active:scale-95"
           >
             <Plus size={16} className="text-yellow-600"/>
           </button>
        </div>

        <button
          onClick={() => setText("")}
          className="flex items-center space-x-1 bg-white px-3 py-1.5 rounded-lg shadow border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 transition-colors"
        >
          <Eraser size={16} />
          <span className="font-bold text-sm">지우기</span>
        </button>
      </div>

      {/* Text Area */}
      <textarea
        className="flex-1 w-full p-4 rounded-2xl border-2 border-yellow-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 outline-none resize-none bg-yellow-50/30 text-gray-800 placeholder-yellow-200 transition-all"
        style={{ fontSize: `${fontSize}px`, lineHeight: 1.2 }}
        placeholder="여기에 크게 적으세요..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};

export default BigMemo;