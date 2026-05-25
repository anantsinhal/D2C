import React from 'react';
import { CheckSquare, Square, ListTodo } from 'lucide-react';
import GlassCard from './GlassCard';

interface ActionItem {
  _id: string;
  text: string;
  completed: boolean;
}

interface DailyActionsProps {
  actions: ActionItem[];
  onToggleAction: (actionId: string) => void;
}

export const DailyActions: React.FC<DailyActionsProps> = ({ actions, onToggleAction }) => {
  return (
    <GlassCard className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <ListTodo className="w-5 h-5 text-[#0df27d]" />
          <h2 className="text-sm font-mono tracking-widest text-gray-400 uppercase">
            TODAY'S PLAN
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {actions.map((action) => (
            <button
              key={action._id}
              onClick={() => onToggleAction(action._id)}
              className="flex items-center gap-3 w-full text-left p-3.5 rounded border border-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.01)] hover:bg-[rgba(13,242,125,0.03)] hover:border-[rgba(13,242,125,0.1)] transition-all cursor-pointer group"
            >
              <div className="transition-transform duration-200 group-hover:scale-110">
                {action.completed ? (
                  <CheckSquare className="w-5 h-5 text-[#0df27d] filter drop-shadow-[0_0_5px_rgba(13,242,125,0.5)]" />
                ) : (
                  <Square className="w-5 h-5 text-gray-600 hover:text-gray-400" />
                )}
              </div>
              <span 
                className={`text-sm font-sans tracking-wide transition-all ${
                  action.completed 
                    ? 'line-through text-gray-500' 
                    : 'text-gray-200'
                }`}
              >
                {action.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11px] font-mono text-gray-500">
        <span>DONE TODAY</span>
        <span className="text-[#0df27d]">
          {actions.filter(a => a.completed).length} / {actions.length} DONE
        </span>
      </div>
    </GlassCard>
  );
};

export default DailyActions;
