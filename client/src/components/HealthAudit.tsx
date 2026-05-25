import React from 'react';
import { Award, AlertCircle, Compass, CalendarRange } from 'lucide-react';
import GlassCard from './GlassCard';

interface AuditItem {
  averageHours: number;
  averageQuality: number;
  trend: string;
}

interface StressItem {
  level: number;
  description: string;
}

interface WeeklyAuditData {
  overallWellnessScore: number;
  sleepAudit: AuditItem;
  stressAudit: StressItem;
  activityAudit: { status: string };
  energyAudit: { status: string };
  biggestWin: string;
  biggestOpportunity: string;
  focusForNextWeek: string[];
  progressTimeline: { week: string; score: number }[];
}

interface HealthAuditProps {
  data: WeeklyAuditData;
}

export const HealthAudit: React.FC<HealthAuditProps> = ({ data }) => {
  return (
    <GlassCard className="h-full" hoverable={false}>
      <div className="flex items-center gap-2 mb-6">
        <CalendarRange className="w-5 h-5 text-[#0df27d]" />
        <h2 className="text-sm font-mono tracking-widest text-gray-400 uppercase">
          WEEKLY SUMMARY
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Side: Score & Timeline */}
        <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[rgba(255,255,255,0.06)] pb-6 md:pb-0 md:pr-8 text-center">
          <div className="relative w-36 h-36 flex items-center justify-center mb-4">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                className="stroke-gray-900"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                className="stroke-[#0df27d] filter drop-shadow-[0_0_8px_rgba(13,242,125,0.3)]"
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 64}
                strokeDashoffset={2 * Math.PI * 64 * (1 - data.overallWellnessScore / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-display font-bold text-white">
                {data.overallWellnessScore}
              </span>
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">
                WELLNESS SCORE
              </span>
            </div>
          </div>

          <div className="w-full mt-4">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">
              WEEKLY TREND
            </div>
            <div className="flex items-center justify-between px-2">
              {data.progressTimeline.map((pt, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-gray-400">{pt.score}</span>
                  <div className="w-1.5 h-12 bg-gray-900 rounded-full relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 left-0 w-full bg-[#0df27d] rounded-full"
                      style={{ height: `${pt.score}%` }}
                    />
                  </div>
                  <span className="text-[8px] font-mono text-gray-500">{pt.week}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Audit Cards */}
        <div className="md:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded border border-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.01)]">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-1">
                SLEEP
              </span>
              <div className="text-sm font-semibold text-gray-200">
                {data.sleepAudit.averageHours}h average · Quality {data.sleepAudit.averageQuality}/10
              </div>
              <span className="text-[9px] font-mono text-[#0df27d] uppercase tracking-wider block mt-1">
                Trend: {data.sleepAudit.trend}
              </span>
            </div>

            <div className="p-3.5 rounded border border-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.01)]">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-1">
                STRESS
              </span>
              <div className="text-sm font-semibold text-gray-200">
                Level {data.stressAudit.level}/10
              </div>
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mt-1">
                Status: {data.stressAudit.description}
              </span>
            </div>

            <div className="p-3.5 rounded border border-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.01)]">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-1">
                ACTIVITY
              </span>
              <div className="text-sm font-semibold text-gray-200">
                {data.activityAudit.status}
              </div>
            </div>

            <div className="p-3.5 rounded border border-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.01)]">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-1">
                ENERGY
              </span>
              <div className="text-sm font-semibold text-gray-200">
                {data.energyAudit.status}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            <div className="flex gap-2 items-start">
              <Award className="w-4 h-4 text-[#0df27d] mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-mono text-[#0df27d] mr-1">BEST PART:</span>
                <span className="text-gray-300">{data.biggestWin}</span>
              </div>
            </div>

            <div className="flex gap-2 items-start">
              <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-mono text-yellow-500 mr-1">NEXT STEP:</span>
                <span className="text-gray-300">{data.biggestOpportunity}</span>
              </div>
            </div>

            <div className="flex gap-2 items-start">
              <Compass className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-mono text-blue-400 mr-1">NEXT WEEK:</span>
                <span className="text-gray-300">
                  {data.focusForNextWeek.join(' · ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default HealthAudit;
