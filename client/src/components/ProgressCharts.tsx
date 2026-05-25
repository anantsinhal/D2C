import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BarChart3 } from 'lucide-react';
import GlassCard from './GlassCard';

interface ChartPoint {
  day: string;
  sleep: number;
  stress: number;
  quality: number;
}

interface ProgressChartsProps {
  data: ChartPoint[];
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'sleep' | 'quality' | 'stress'>('sleep');

  const config = {
    sleep: {
      key: 'sleep',
      label: 'Sleep Duration (hrs)',
      color: '#3b82f6', // blue
      gradientId: 'colorSleep',
      domain: [4, 10]
    },
    quality: {
      key: 'quality',
      label: 'Sleep Quality (1-10)',
      color: '#0df27d', // green
      gradientId: 'colorQuality',
      domain: [1, 10]
    },
    stress: {
      key: 'stress',
      label: 'Stress Load (1-10)',
      color: '#ef4444', // red
      gradientId: 'colorStress',
      domain: [1, 10]
    }
  };

  const current = config[activeTab];

  return (
    <GlassCard className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#0df27d]" />
            <h2 className="text-sm font-mono tracking-widest text-gray-400 uppercase">
              WEEKLY TRENDS
            </h2>
          </div>

          <div className="flex gap-1.5 p-1 rounded bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
            {(['sleep', 'quality', 'stress'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[10px] font-mono tracking-wider font-semibold px-2.5 py-1 rounded uppercase transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#0df27d] text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'sleep' ? 'sleep' : tab === 'quality' ? 'quality' : 'stress'}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[200px] w-full mt-4 font-mono text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id={current.gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={current.color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={current.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#6b7280" 
                tickLine={false} 
                axisLine={false} 
                dy={10} 
              />
              <YAxis 
                stroke="#6b7280" 
                tickLine={false} 
                axisLine={false} 
                domain={current.domain} 
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(18, 18, 22, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#e5e5e9',
                  fontFamily: 'monospace'
                }}
                labelStyle={{ color: '#0df27d', fontWeight: 'bold' }}
                cursor={{ stroke: 'rgba(255,255,255,0.06)' }}
              />
              <Area
                type="monotone"
                dataKey={current.key}
                stroke={current.color}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#${current.gradientId})`}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest text-center mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)]">
        Data based on your check-in answers
      </div>
    </GlassCard>
  );
};

export default ProgressCharts;
