import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ArrowRight, ShieldCheck, Heart, Moon, AlertTriangle, Target } from 'lucide-react';
import GlassCard from './GlassCard';

interface OnboardingProps {
  onComplete: (data: any) => void;
  isLoading: boolean;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, isLoading }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    age: 28,
    sleepHours: 7,
    sleepQuality: 6,
    stressLevel: 5,
    activityLevel: 'Active',
    primaryGoal: 'Longevity'
  });

  const steps = [
    {
      title: "Your age",
      description: "This helps us shape a simple plan that fits you.",
      icon: <Heart className="w-8 h-8 text-[#0df27d]" />,
      component: (
        <div className="flex flex-col items-center gap-6">
          <span className="text-6xl font-display font-bold text-white">{formData.age}</span>
          <input
            type="range"
            min="18"
            max="80"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#0df27d]"
          />
          <div className="flex justify-between w-full text-xs font-mono text-gray-500">
            <span>18 YEARS</span>
            <span>80 YEARS</span>
          </div>
        </div>
      )
    },
    {
      title: "How much sleep do you get?",
      description: "Pick your usual sleep length.",
      icon: <Moon className="w-8 h-8 text-[#0df27d]" />,
      component: (
        <div className="flex flex-col items-center gap-6">
          <span className="text-6xl font-display font-bold text-white">{formData.sleepHours} hrs</span>
          <input
            type="range"
            min="4"
            max="12"
            step="0.5"
            value={formData.sleepHours}
            onChange={(e) => setFormData({ ...formData, sleepHours: Number(e.target.value) })}
            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#0df27d]"
          />
          <div className="flex justify-between w-full text-xs font-mono text-gray-500">
            <span>4.0 HOURS</span>
            <span>12.0 HOURS</span>
          </div>
        </div>
      )
    },
    {
      title: "How good is your sleep?",
      description: "Rate how rested you feel when you wake up.",
      icon: <ShieldCheck className="w-8 h-8 text-[#0df27d]" />,
      component: (
        <div className="flex flex-col items-center gap-6">
          <span className="text-6xl font-display font-bold text-white">{formData.sleepQuality}/10</span>
          <div className="flex gap-2 w-full justify-between">
            {[...Array(10)].map((_, i) => (
              <button
                key={i + 1}
                type="button"
                onClick={() => setFormData({ ...formData, sleepQuality: i + 1 })}
                className={`w-10 h-10 rounded font-mono text-sm border transition-all cursor-pointer ${
                  formData.sleepQuality === i + 1
                    ? 'bg-[#0df27d] text-black border-[#0df27d] font-bold drop-shadow-[0_0_8px_rgba(13,242,125,0.4)]'
                    : 'border-[rgba(255,255,255,0.1)] hover:border-gray-400 text-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="flex justify-between w-full text-xs font-mono text-gray-500">
            <span>RESTLESS</span>
            <span>DEEP RECOVERY</span>
          </div>
        </div>
      )
    },
    {
      title: "How stressed do you feel?",
      description: "Choose the level that matches your day.",
      icon: <AlertTriangle className="w-8 h-8 text-[#0df27d]" />,
      component: (
        <div className="flex flex-col items-center gap-6">
          <span className="text-6xl font-display font-bold text-white">{formData.stressLevel}/10</span>
          <div className="flex gap-2 w-full justify-between">
            {[...Array(10)].map((_, i) => (
              <button
                key={i + 1}
                type="button"
                onClick={() => setFormData({ ...formData, stressLevel: i + 1 })}
                className={`w-10 h-10 rounded font-mono text-sm border transition-all cursor-pointer ${
                  formData.stressLevel === i + 1
                    ? 'bg-[#0df27d] text-black border-[#0df27d] font-bold drop-shadow-[0_0_8px_rgba(13,242,125,0.4)]'
                    : 'border-[rgba(255,255,255,0.1)] hover:border-gray-400 text-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="flex justify-between w-full text-xs font-mono text-gray-500">
            <span>CALM / RESTED</span>
            <span>HIGH BURNOUT</span>
          </div>
        </div>
      )
    },
    {
      title: "How active are you?",
      description: "Choose the option that sounds most like your routine.",
      icon: <Activity className="w-8 h-8 text-[#0df27d]" />,
      component: (
        <div className="grid grid-cols-2 gap-4 w-full">
          {['Sedentary', 'Light', 'Active', 'Highly Active'].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setFormData({ ...formData, activityLevel: level })}
              className={`p-4 rounded border text-left transition-all cursor-pointer ${
                formData.activityLevel === level
                  ? 'border-[#0df27d] bg-[rgba(13,242,125,0.05)] text-white'
                  : 'border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:border-gray-600 text-gray-300'
              }`}
            >
              <div className="font-display font-semibold text-base">{level}</div>
              <div className="text-xs text-gray-500 font-mono mt-1">
                {level === 'Sedentary' && 'Desk job, minimal walks'}
                {level === 'Light' && '1-2 brief weekly workouts'}
                {level === 'Active' && '3-5 aerobic or strength sessions'}
                {level === 'Highly Active' && 'Intense athletic training program'}
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "What do you want to improve?",
      description: "Pick the main goal you want help with.",
      icon: <Target className="w-8 h-8 text-[#0df27d]" />,
      component: (
        <div className="grid grid-cols-2 gap-3 w-full">
          {[
            'Better Sleep',
            'More Energy',
            'Stress Reduction',
            'Recovery',
            'Longevity',
            'Better Performance'
          ].map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => setFormData({ ...formData, primaryGoal: goal })}
              className={`p-4 rounded border text-left transition-all cursor-pointer ${
                formData.primaryGoal === goal
                  ? 'border-[#0df27d] bg-[rgba(13,242,125,0.05)] text-white'
                  : 'border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:border-gray-600 text-gray-300'
              }`}
            >
              <span className="font-display font-semibold text-base">{goal}</span>
            </button>
          ))}
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // UI rendering
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="relative w-24 h-24 mb-8">
          {/* Animated circles mimicking diagnostic loading */}
          <div className="absolute inset-0 rounded-full border border-gray-800" />
          <motion.div
            className="absolute inset-0 rounded-full border-t border-[#0df27d]"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-b border-[#0df27d] opacity-50"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
          />
        </div>
        <h2 className="text-xl font-display font-bold text-white tracking-wider mb-2">
          SYNTHESIZING BIOLOGICAL PROFILE
        </h2>
        <p className="text-xs font-mono text-[#0df27d] tracking-widest max-w-sm animate-pulse">
          RUNNING PREDICTIONS · CALIBRATING HEURISTICS · COMPILING WEEKLY AUDIT
        </p>
      </div>
    );
  }

  const currentStep = steps[step];

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-12">
      {/* Top progress bar indicator */}
      <div className="w-full h-1 bg-gray-900 rounded-full mb-8 flex overflow-hidden">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-full transition-all duration-500 flex-1 ${
              index <= step ? 'bg-[#0df27d]' : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      <GlassCard className="p-8 md:p-10" hoverable={false}>
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs font-mono text-[#0df27d] tracking-widest uppercase">
            CALIBRATING STEP {step + 1} OF {steps.length}
          </span>
          <div className="p-2 rounded bg-[rgba(13,242,125,0.05)] border border-[rgba(13,242,125,0.1)]">
            {currentStep.icon}
          </div>
        </div>

        {/* Transition area */}
        <div className="min-h-[220px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h1 className="text-2xl font-display font-bold text-white mb-2 leading-tight">
                  {currentStep.title}
                </h1>
                <p className="text-sm text-gray-400 font-sans">
                  {currentStep.description}
                </p>
              </div>

              <div className="py-4">
                {currentStep.component}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Buttons Controls */}
        <div className="flex justify-between items-center mt-10 border-t border-[rgba(255,255,255,0.06)] pt-6">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0}
            className={`text-xs font-mono tracking-wider font-semibold border border-[rgba(255,255,255,0.1)] px-5 py-2.5 rounded transition-all cursor-pointer ${
              step === 0 
                ? 'opacity-30 cursor-not-allowed text-gray-600' 
                : 'text-gray-300 hover:text-white hover:border-gray-400'
            }`}
          >
            PREVIOUS STEP
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 text-xs font-mono tracking-wider font-bold bg-[#0df27d] text-black px-6 py-2.5 rounded hover:bg-[#00e676] transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(13,242,125,0.4)]"
          >
            {step === steps.length - 1 ? 'GENERATE PROTOCOL' : 'CONTINUE'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default Onboarding;
