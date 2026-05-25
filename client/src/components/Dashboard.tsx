import React from 'react';
import { HealthSummary } from './HealthSummary';
import { DailyActions } from './DailyActions';
import { ProgressCharts } from './ProgressCharts';
import { HealthAudit } from './HealthAudit';
import { AICoach } from './AICoach';
import { KnowledgeHub } from './KnowledgeHub';
import { Shield, Sparkles } from 'lucide-react';

interface DashboardProps {
  data: {
    assessment: {
      _id: string;
      age: number;
      primaryGoal: string;
      activityLevel: string;
    };
    healthSummary: {
      energyStatus: string;
      sleepStatus: string;
      stressStatus: string;
      activityStatus: string;
      primaryFocus: string;
    };
    dailyAction: {
      _id: string;
      actions: { _id: string; text: string; completed: boolean }[];
    };
    weeklyAudit: {
      overallWellnessScore: number;
      sleepAudit: { averageHours: number; averageQuality: number; trend: string };
      stressAudit: { level: number; description: string };
      activityAudit: { status: string };
      energyAudit: { status: string };
      biggestWin: string;
      biggestOpportunity: string;
      focusForNextWeek: string[];
      progressTimeline: { week: string; score: number }[];
    };
    chartData: { day: string; sleep: number; stress: number; quality: number }[];
  };
  onToggleAction: (actionId: string) => void;
  onSendMessage: (message: string) => Promise<string>;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  data, 
  onToggleAction,
  onSendMessage 
}) => {
  const { assessment, healthSummary, dailyAction, weeklyAudit, chartData } = data;

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-8 flex flex-col gap-6" id="dashboard">
      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#0df27d] tracking-widest uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-brand-green" />
            SYNAPSE CONNECTION STABLE
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight leading-none">
            AETHERIS HEALTH OS
          </h1>
          <p className="text-xs text-gray-500 font-mono tracking-wider mt-1.5 uppercase">
            CALIBRATED FOR: {assessment.age} YEARS · GOAL: {assessment.primaryGoal}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-mono text-gray-500 block uppercase tracking-widest">
              LATEST SYNC
            </span>
            <span className="text-xs font-mono text-gray-300 font-medium">
              {todayDateStr}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full border border-glowing-green bg-[rgba(13,242,125,0.03)] flex items-center justify-center text-brand-green filter drop-shadow-[0_0_5px_rgba(13,242,125,0.3)]">
            <Shield className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Grid Layout Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Side: Summary & Actions (Col span 7) */}
        <div className="md:col-span-7 flex flex-col gap-6">
          <HealthSummary data={healthSummary} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-full">
              <DailyActions 
                actions={dailyAction.actions} 
                onToggleAction={onToggleAction} 
              />
            </div>
            <div className="h-full" id="coach">
              <AICoach 
                onSendMessage={onSendMessage} 
              />
            </div>
          </div>
        </div>

        {/* Right Side: Charts & Audits (Col span 5) */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <ProgressCharts data={chartData} />
          <div id="audit">
            <HealthAudit data={weeklyAudit} />
          </div>
        </div>
      </div>

      {/* Knowledge Hub Row (Full span) */}
      <div className="mt-2" id="knowledge">
        <KnowledgeHub />
      </div>
    </div>
  );
};

export default Dashboard;
