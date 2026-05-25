import React from 'react';
import { Shield, RotateCcw } from 'lucide-react';

interface NavbarProps {
  onReset?: () => void;
  showReset?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, showReset = false }) => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[rgba(255,255,255,0.06)] bg-[rgba(8,8,10,0.7)] backdrop-blur-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-[#0df27d] filter drop-shadow-[0_0_8px_rgba(13,242,125,0.4)]" />
        <span className="font-display font-bold tracking-[0.2em] text-lg text-white">
          AETHERIS
        </span>
        <span className="text-[10px] tracking-widest text-[#0df27d] bg-[rgba(13,242,125,0.1)] px-2 py-0.5 rounded border border-[rgba(13,242,125,0.2)] font-mono">
          BIOTECH
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm tracking-wider font-mono text-gray-400">
        <a href="#dashboard" className="hover:text-white transition-colors">Overview</a>
        <a href="#audit" className="hover:text-white transition-colors">Weekly summary</a>
        <a href="#coach" className="hover:text-white transition-colors">Coach</a>
        <a href="#knowledge" className="hover:text-white transition-colors">Learn</a>
      </div>

      <div className="flex items-center gap-4">
        {showReset && onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-mono text-gray-400 hover:text-white border border-[rgba(255,255,255,0.1)] hover:border-white px-3 py-1.5 rounded transition-all duration-300 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESET SESSION
          </button>
        )}
        <div className="text-xs font-mono bg-white text-black font-semibold px-3 py-1.5 rounded tracking-widest">
          AETHERIS OS v4.1
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
