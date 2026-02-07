
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { FrequencyData } from '../types';

interface Props {
  data: FrequencyData[];
}

const FrequencyChart: React.FC<Props> = ({ data }) => {
  const average = data.reduce((acc, curr) => acc + curr.count, 0) / data.length;

  return (
    <div className="h-[400px] w-full bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl">
      <h3 className="text-xl font-bold mb-6 text-indigo-400 flex items-center">
        <i className="fas fa-chart-bar mr-2"></i> Frecuencia Histórica
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="number" 
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            itemStyle={{ color: '#818cf8' }}
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
          />
          <ReferenceLine y={average} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Promedio', position: 'right', fill: '#ef4444', fontSize: 10 }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.count >= average ? '#6366f1' : '#334155'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FrequencyChart;
