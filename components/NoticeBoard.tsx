import React, { useState } from 'react';
import { TodoItem } from '../types';
import { Minus, Plus } from 'lucide-react';

const NoticeBoard: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', text: '수학 익힘책 32쪽 풀기', completed: false },
    { id: '2', text: '가정통신문 부모님 보여드리기', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [lunchMenu, setLunchMenu] = useState('');
  const [fontSize, setFontSize] = useState(40);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-4">
      
      {/* Left: To-Do List (Alimjang) - Expanded width */}
      <div className="flex-1 flex flex-col bg-slate-50 rounded-3xl border-2 border-slate-200 overflow-hidden">
        <div className="bg-slate-200 p-2 md:p-3 flex items-center justify-between px-4">
          <h3 className="text-xl font-bold text-slate-700 flex items-center">
            <i className="fa-solid fa-clipboard-list mr-2"></i> 오늘 할 일
          </h3>

          {/* Font Size Controls */}
          <div className="flex items-center space-x-2 bg-white/50 rounded-lg px-2 py-1">
             <button 
               onClick={() => setFontSize(Math.max(16, fontSize - 2))}
               className="w-7 h-7 bg-white rounded-full shadow border border-slate-300 flex items-center justify-center hover:bg-slate-100 active:scale-95"
             >
               <Minus size={14} className="text-slate-600"/>
             </button>
             <span className="w-8 text-center font-bold text-sm text-slate-600">{fontSize}px</span>
             <button 
               onClick={() => setFontSize(Math.min(80, fontSize + 2))}
               className="w-7 h-7 bg-white rounded-full shadow border border-slate-300 flex items-center justify-center hover:bg-slate-100 active:scale-95"
             >
               <Plus size={14} className="text-slate-600"/>
             </button>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-3">
            {todos.map(todo => (
              <li key={todo.id} className="flex items-center group bg-white p-3 rounded-xl shadow-sm border border-slate-100 hover:border-slate-300 transition-colors">
                <button 
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-8 h-8 rounded-full border-4 mr-3 flex-shrink-0 flex items-center justify-center transition-colors ${todo.completed ? 'bg-green-400 border-green-400 text-white' : 'border-slate-300'}`}
                >
                  {todo.completed && <i className="fa-solid fa-check text-base"></i>}
                </button>
                <span 
                  className={`flex-1 font-medium leading-snug transition-all ${todo.completed ? 'text-gray-300 line-through' : 'text-slate-800'}`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {todo.text}
                </span>
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-opacity p-2 ml-2"
                >
                  <i className="fa-solid fa-trash text-lg"></i>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={addTodo} className="p-3 bg-white border-t border-slate-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="할 일을 입력하세요..."
              className="flex-1 px-4 py-2 text-lg rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-200 placeholder-slate-300"
            />
            <button type="submit" className="bg-slate-700 text-white px-6 py-2 rounded-xl text-lg font-bold hover:bg-slate-800 hover:shadow-lg transition-all active:scale-95">
              추가
            </button>
          </div>
        </form>
      </div>

      {/* Right: Lunch Menu - Reduced Width (20%) */}
      <div className="w-full md:w-[20%] flex flex-col bg-orange-50 rounded-3xl border-2 border-orange-200 overflow-hidden">
        <div className="bg-orange-200 p-3 flex items-center justify-center">
          <h3 className="text-xl font-bold text-orange-800">
            <i className="fa-solid fa-utensils mr-2"></i> 오늘의 급식
          </h3>
        </div>
        
        <div className="flex-1 p-4 flex flex-col">
          <textarea
            value={lunchMenu}
            onChange={(e) => setLunchMenu(e.target.value)}
            className="flex-1 w-full h-full bg-white rounded-xl border border-orange-100 p-4 font-bold leading-normal text-gray-700 resize-none focus:outline-none focus:ring-4 focus:ring-orange-200 text-center flex items-center justify-center placeholder-orange-200"
            style={{ fontSize: '30px', lineHeight: '1.4' }}
            placeholder="급식 메뉴를 입력해주세요."
          />
          <div className="mt-3 text-center text-orange-400 text-lg font-bold">
            <i className="fa-solid fa-carrot mr-1"></i>
            맛있는 점심!
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;