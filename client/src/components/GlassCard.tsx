import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hoverable = true 
}) => {
  return (
    <div 
      className={`glass-panel ${hoverable ? 'glass-panel-hover' : ''} p-6 relative overflow-hidden ${className}`}
    >
      {/* Dynamic green top border glow */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(13,242,125,0.2)] to-transparent" />
      {children}
    </div>
  );
};

export default GlassCard;
