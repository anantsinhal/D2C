import React from 'react';
import { Activity, Moon, Zap, ShieldAlert, Target } from 'lucide-react';
import GlassCard from './GlassCard';

interface HealthSummaryData {
  energyStatus: string;
  sleepStatus: string;
  stressStatus: string;
  activityStatus: string;
  primaryFocus: string;
}

interface HealthSummaryProps {
  data: HealthSummaryData;
}

export const HealthSummary: React.FC<HealthSummaryProps> = ({ data }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-5 h-5 text-[#0df27d]" />
        <h2 className="text-sm font-mono tracking-widest text-gray-400 uppercase">
          HEALTH SUMMARY
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Energy Status Card */}
        <GlassCard className="p-4 flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-gray-500 font-mono text-[10px] tracking-wider uppercase mb-3">
            <span>ENERGY</span>
            <Zap className="w-3.5 h-3.5 text-yellow-500" />
          </div>
          <div>
            <div className="text-xl font-display font-bold text-white mb-1">
              {data.energyStatus}
            </div>
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
              HOW YOU SHOULD FEEL
            </span>
          </div>
        </GlassCard>

        {/* Sleep Status Card */}
        <GlassCard className="p-4 flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-gray-500 font-mono text-[10px] tracking-wider uppercase mb-3">
            <span>SLEEP</span>
            <Moon className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div>
            <div className="text-xl font-display font-bold text-white mb-1">
              {data.sleepStatus}
            </div>
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
              SLEEP QUALITY
            </span>
          </div>
        </GlassCard>

        {/* Stress Status Card */}
        <GlassCard className="p-4 flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-gray-500 font-mono text-[10px] tracking-wider uppercase mb-3">
            <span>STRESS LOAD</span>
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
          </div>
          <div>
            <div className="text-xl font-display font-bold text-white mb-1">
              {data.stressStatus}
            </div>
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
              STRESS LEVEL
            </span>
          </div>
        </GlassCard>

        {/* Activity Status Card */}
        <GlassCard className="p-4 flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-gray-500 font-mono text-[10px] tracking-wider uppercase mb-3">
            <span>ACTIVITY</span>
            <Activity className="w-3.5 h-3.5 text-[#0df27d]" />
          </div>
          <div>
            <div className="text-xl font-display font-bold text-white mb-1">
              {data.activityStatus}
            </div>
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
              MOVEMENT LEVEL
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Primary Focus Card */}
      <GlassCard className="p-5 border-l-2 border-l-[#0df27d] bg-[rgba(13,242,125,0.02)]">
        <span className="text-xs font-mono text-[#0df27d] tracking-widest uppercase mb-1 block">
          MAIN FOCUS
        </span>
        <p className="text-gray-300 font-sans text-sm md:text-base leading-relaxed">
          {data.primaryFocus}
        </p>
      </GlassCard>
    </div>
  );
};

export default HealthSummary;
