import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Student, EMOTIONS } from '../types';

interface StatisticsProps {
  students: Student[];
}

const Statistics: React.FC<StatisticsProps> = ({ students }) => {
  // Process Data
  const data = EMOTIONS.filter(e => e !== '😐').map(emotion => {
    const count = students.filter(s => s.emotion === emotion).length;
    return {
      name: emotion,
      count: count,
      fill: getColorForEmotion(emotion)
    };
  });

  const totalActive = data.reduce((acc, curr) => acc + curr.count, 0);

  function getColorForEmotion(emotion: string): string {
    switch (emotion) {
      case '😊': return '#FCD34D'; // Yellow
      case '😍': return '#F472B6'; // Pink
      case '😢': return '#60A5FA'; // Blue
      case '😡': return '#F87171'; // Red
      case '😴': return '#A78BFA'; // Purple
      default: return '#E5E7EB';
    }
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8">
      {/* Bar Chart Section */}
      <div className="flex-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
        <h3 className="text-xl font-bold text-gray-700 mb-6 text-center">
          <i className="fa-solid fa-chart-column mr-2 text-blue-400"></i>
          우리 반 감정 막대 그래프
        </h3>
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 30 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: '#F3F4F6' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart Section */}
      <div className="flex-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
        <h3 className="text-xl font-bold text-gray-700 mb-6 text-center">
          <i className="fa-solid fa-chart-pie mr-2 text-pink-400"></i>
          우리 반 감정 비율
        </h3>
        <div className="flex-1 min-h-[300px] flex items-center justify-center relative">
          {totalActive === 0 ? (
            <div className="text-gray-400 text-center">
              <p className="text-4xl mb-2">😐</p>
              <p>아직 표현한 친구가 없어요!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-2xl ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;