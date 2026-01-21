import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { TabType, Student } from './types';
import StudentGrid from './components/StudentGrid';
import Statistics from './components/Statistics';
import Timetable from './components/Timetable';
import Timer from './components/Timer';
import DiceRoller from './components/DiceRoller';
import RandomPicker from './components/RandomPicker';
import BigMemo from './components/BigMemo';
import NoticeBoard from './components/NoticeBoard';
import Vote from './components/Vote';
import WordCloud from './components/WordCloud';

// Navbar Clock Component
const NavBarClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="flex items-center space-x-2 text-base font-bold text-gray-700 bg-white/80 px-3 py-1 rounded-full shadow-sm border border-orange-100">
      <Clock className="w-4 h-4 text-orange-400" />
      <span className="tabular-nums tracking-wide">{formatDate(time)}</span>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('hearts');
  
  // Initialize 25 students + 1 teacher
  const [students, setStudents] = useState<Student[]>(() => {
    const initialStudents: Student[] = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `${i + 1}번`,
      emotion: '😐',
      hasStar: false,
    }));
    // Add teacher
    initialStudents.push({
      id: 999,
      name: '선생님',
      emotion: '😐',
      hasStar: false,
    });
    return initialStudents;
  });

  const handleUpdateStudent = (id: number, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // Reordered menu items based on user request
  const menuItems: { id: TabType; icon: string; label: string; color: string }[] = [
    { id: 'hearts', icon: 'fa-heart', label: '우리들의 마음', color: 'bg-rose-100 text-rose-600' },
    { id: 'stats', icon: 'fa-chart-pie', label: '마음 통계', color: 'bg-blue-100 text-blue-600' },
    { id: 'timetable', icon: 'fa-table-cells', label: '시간표', color: 'bg-lime-100 text-lime-600' },
    { id: 'timer', icon: 'fa-hourglass-half', label: '모래시계', color: 'bg-amber-100 text-amber-600' },
    { id: 'picker', icon: 'fa-sitemap', label: '뽑기 대장', color: 'bg-cyan-100 text-cyan-600' },
    { id: 'wordcloud', icon: 'fa-cloud', label: '워드클라우드', color: 'bg-teal-100 text-teal-600' },
    { id: 'dice', icon: 'fa-dice', label: '행운의 주사위', color: 'bg-violet-100 text-violet-600' },
    { id: 'vote', icon: 'fa-check-to-slot', label: '투표함', color: 'bg-indigo-100 text-indigo-600' },
    { id: 'memo', icon: 'fa-pen-to-square', label: '대왕 메모장', color: 'bg-yellow-100 text-yellow-600' },
    { id: 'notice', icon: 'fa-clipboard-list', label: '알림장/급식', color: 'bg-slate-100 text-slate-600' },
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-[1920px] mx-auto overflow-hidden">
      {/* Top Navbar */}
      <header className="h-14 bg-white/50 backdrop-blur-md border-b border-orange-100 flex items-center justify-between px-4 shadow-sm z-50">
        <div className="flex items-center space-x-2">
          <div className="bg-orange-400 p-1.5 rounded-xl text-white shadow-sm">
            <i className="fa-solid fa-school text-lg"></i>
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">우리반 전자칠판</h1>
        </div>
        
        <NavBarClock />

        <div className="w-10"></div> {/* Spacer for balance */}
      </header>

      <main className="flex-1 flex overflow-hidden gap-2 p-1">
        {/* Sidebar Tabs */}
        <nav className="w-16 flex flex-col gap-1 overflow-y-auto pr-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all duration-300 aspect-square group shadow-sm hover:shadow-md ${
                activeTab === item.id 
                  ? `${item.color} ring-2 ring-white shadow-md scale-100` 
                  : 'bg-white text-gray-400 hover:bg-gray-50'
              }`}
            >
              <i className={`fa-solid ${item.icon} text-lg mb-0.5 ${activeTab === item.id ? '' : 'group-hover:text-gray-600'}`}></i>
              <span className="text-[9px] font-bold text-center leading-tight tracking-tighter">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Main Content Area */}
        <section className="flex-1 bg-white rounded-2xl shadow-lg border-4 border-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[#FFF9F2] bg-opacity-50 pointer-events-none"></div>
          {/* Removed no-scrollbar to ensure users can scroll if needed */}
          <div className="relative h-full w-full overflow-y-auto p-4">
            
            {/* View Routing - Title removed as per user request */}
            {activeTab === 'hearts' && (
              <StudentGrid students={students} onUpdateStudent={handleUpdateStudent} />
            )}
            {activeTab === 'stats' && (
              <Statistics students={students} />
            )}
            {activeTab === 'timetable' && (
              <Timetable />
            )}
            {activeTab === 'vote' && (
              <Vote />
            )}
            {activeTab === 'wordcloud' && (
              <WordCloud />
            )}
            {activeTab === 'timer' && (
              <Timer />
            )}
            {activeTab === 'dice' && (
              <DiceRoller />
            )}
            {activeTab === 'picker' && (
              <RandomPicker students={students} />
            )}
            {activeTab === 'memo' && (
              <BigMemo />
            )}
            {activeTab === 'notice' && (
              <NoticeBoard />
            )}

          </div>
        </section>
      </main>
    </div>
  );
};

export default App;