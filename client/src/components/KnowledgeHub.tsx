import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import GlassCard from './GlassCard';

interface Article {
  tag: string;
  title: string;
  summary: string;
  details: string;
  readTime: string;
}

export const KnowledgeHub: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const articles: Article[] = [
    {
      tag: "SLEEP",
      title: "Morning light helps sleep",
      summary: "A little sunlight early in the day can make it easier to sleep later.",
      details: "Try to get a few minutes of outdoor light soon after waking. It helps your body know when to feel awake and when to feel sleepy later.",
      readTime: "3 MIN READ"
    },
    {
      tag: "STRESS",
      title: "A quick breathing reset",
      summary: "Two slow breaths can help calm your body fast.",
      details: "Take two short inhales through your nose, then one long, slow exhale. It is a simple way to lower tension during a busy day.",
      readTime: "2 MIN READ"
    },
    {
      tag: "ENERGY",
      title: "Water supports energy",
      summary: "Starting the day hydrated can help you feel better.",
      details: "Drink water when you wake up and keep sipping through the day. Even mild dehydration can make you feel tired or foggy.",
      readTime: "3 MIN READ"
    },
    {
      tag: "MOVEMENT",
      title: "Easy cardio helps long-term health",
      summary: "Steady, moderate exercise is good for your heart and energy.",
      details: "A brisk walk, easy bike ride, or steady jog that still lets you talk is enough to help build endurance and keep your body active.",
      readTime: "4 MIN READ"
    }
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <GlassCard className="h-full" hoverable={false}>
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-[#0df27d]" />
        <h2 className="text-sm font-mono tracking-widest text-gray-400 uppercase">
          SCIENTIFIC RESEARCH HUB
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((art, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div
              key={idx}
              className="p-4 rounded border border-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.01)] hover:border-[rgba(13,242,125,0.1)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[8px] font-mono text-[#0df27d] tracking-widest bg-[rgba(13,242,125,0.05)] px-2 py-0.5 rounded border border-[rgba(13,242,125,0.1)]">
                    {art.tag}
                  </span>
                  <span className="text-[8px] font-mono text-gray-500 tracking-wider">
                    {art.readTime}
                  </span>
                </div>
                <h3 className="text-sm font-display font-bold text-white mb-1.5">
                  {art.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans mb-3">
                  {art.summary}
                </p>
                {isExpanded && (
                  <p className="text-xs text-gray-300 font-sans leading-relaxed border-t border-[rgba(255,255,255,0.06)] pt-3 mt-3">
                    {art.details}
                  </p>
                )}
              </div>

              <button
                onClick={() => toggleExpand(idx)}
                className="flex items-center justify-center gap-1.5 w-full text-[10px] font-mono tracking-wider text-gray-500 hover:text-white mt-4 border-t border-[rgba(255,255,255,0.03)] pt-3 cursor-pointer"
              >
                {isExpanded ? (
                  <>
                    COLLAPSE MODULE <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    EXPAND STUDY <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default KnowledgeHub;
