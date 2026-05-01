import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const categoryData = [
  { name: 'LinkedList', value: 15, color: '#00b8a3' }, 
  { name: 'Hash Table', value: 20, color: '#ffc01e' }, 
  { name: 'DP', value: 11, color: '#ef4743' },       
];

const StatsPage = () => {
  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '40px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ color: '#111827', fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>My Progress</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          {/* Difficulty Card */}
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '40px' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '28px', fontWeight: '800', color: '#1f2937' }}>46</span>
                <span style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>Solved</span>
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="60" cy="60" r="54" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                  <circle cx="60" cy="60" r="54" stroke="#fb923c" strokeWidth="8" fill="transparent" strokeDasharray="339" strokeDashoffset="240" strokeLinecap="round" />
                </svg>
            </div>
            
            <div style={{ flex: 1 }}>
                {['Easy', 'Medium', 'Hard'].map((label, i) => (
                    <div key={label} style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 'bold', color: '#6b7280' }}>{label}</span>
                            <span style={{ color: '#374151' }}>{i === 0 ? '36/706' : i === 1 ? '9/1492' : '1/620'}</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
                            <div style={{ height: '100%', borderRadius: '4px', width: i === 0 ? '60%' : i === 1 ? '30%' : '5%', backgroundColor: i === 0 ? '#00b8a3' : i === 1 ? '#ffc01e' : '#ef4743' }} />
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Category Card */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '16px', textTransform: 'uppercase' }}>Solved by Category</h3>
            <div style={{ width: '100%', height: '200px' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {categoryData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
                {categoryData.map(item => (
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#4b5563' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }} />
                        {item.name}
                    </div>
                ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StatsPage;