import React, { useMemo } from 'react';
import { Student } from '../types';

interface FloatingPlaygroundProps {
  students: Student[];
}

const FloatingPlayground: React.FC<FloatingPlaygroundProps> = ({ students }) => {
  // Collect all active emojis
  const activeEmojis = useMemo(() => {
    return students
      .filter(s => s.emotion !== '😐')
      .map(s => s.emotion);
  }, [students]);

  // If no one has chosen, show a default set
  const displayEmojis = activeEmojis.length > 0 
    ? activeEmojis 
    : ['😊', '😊', '😍', '😍', '🌞', '☁️', '🎈'];

  // Generate random positions and delays for the animation
  // Since useMemo runs only when students change, positions shuffle slightly on update, which is acceptable lively behavior.
  const floatingItems = useMemo(() => {
    // Generate more items if the count is low to fill the screen
    let items = [...displayEmojis];
    while (items.length < 20) {
      items = items.concat(displayEmojis);
    }
    
    return items.slice(0, 50).map((emoji, index) => ({
      emoji,
      id: index,
      left: `${Math.random() * 90}%`,
      animationDuration: `${5 + Math.random() * 10}s`,
      animationDelay: `${Math.random() * -10}s`, // Start immediately at different cycles
      fontSize: `${2 + Math.random() * 3}rem`,
    }));
  }, [displayEmojis]);

  return (
    <div className="h-full w-full bg-gradient-to-b from-blue-50 to-indigo-50 rounded-3xl relative overflow-hidden flex items-center justify-center border border-blue-100">
      
      {activeEmojis.length === 0 && (
        <div className="absolute z-10 text-center text-gray-400 bg-white/60 p-6 rounded-3xl backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-2">텅 비었어요!</h3>
          <p>친구들이 감정을 선택하면 여기에 둥둥 떠다녀요.</p>
        </div>
      )}

      {floatingItems.map((item) => (
        <div
          key={item.id}
          className="floating-emoji absolute select-none pointer-events-none filter drop-shadow-md"
          style={{
            left: item.left,
            fontSize: item.fontSize,
            animationDuration: item.animationDuration,
            animationDelay: item.animationDelay,
          }}
        >
          {item.emoji}
        </div>
      ))}
      
      {/* Decorative Ground */}
      <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-white to-transparent opacity-50"></div>
    </div>
  );
};

export default FloatingPlayground;