/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Heart, 
  ShieldCheck, 
  Smile, 
  Wind, 
  Play, 
  Pause, 
  Activity, 
  TrendingUp, 
  Clock, 
  Award, 
  AlertCircle
} from 'lucide-react';
import { AssessmentHistoryEntry } from '../types';

interface HomeViewProps {
  onStartAssessment: () => void;
  onViewChange: (view: 'home' | 'assessment' | 'result' | 'history') => void;
  history?: AssessmentHistoryEntry[];
}

export default function HomeView({ onStartAssessment, onViewChange, history = [] }: HomeViewProps) {
  // Breath micro-widget states
  const [breathState, setBreathState] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [breathSeconds, setBreathSeconds] = useState<number>(0);
  
  // Compute analytics
  const lastEntry = history.length > 0 ? history[0] : null;
  const totalEntries = history.length;
  
  // Calculate average score
  const avgScore = totalEntries > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.result.numericScore, 0) / totalEntries)
    : 0;

  // Handle breathing sequence cycle
  useEffect(() => {
    if (breathState === 'idle') {
      setBreathSeconds(0);
      return;
    }

    const timer = setInterval(() => {
      setBreathSeconds((prev) => {
        const next = prev + 1;
        
        // Let's implement Box Breathing pacing constraints (4 seconds inhale, 4 hold, 4 exhale)
        if (breathState === 'inhale' && next >= 4) {
          setBreathState('hold');
          return 0;
        } else if (breathState === 'hold' && next >= 4) {
          setBreathState('exhale');
          return 0;
        } else if (breathState === 'exhale' && next >= 4) {
          setBreathState('inhale');
          return 0;
        }
        
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [breathState]);

  const toggleBreathWidget = () => {
    if (breathState === 'idle') {
      setBreathState('inhale');
      setBreathSeconds(0);
    } else {
      setBreathState('idle');
    }
  };

  return (
    <div className="space-y-8" id="dashboard-home-portal">
      {/* 1. LATEST INSIGHT & STATS BENTO ROW */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-label="Quick Analytics Dashboard">
        
        {/* Card A: Real-Time Local Activity Stats */}
        <div className="bg-white border border-[#E5DFCE] rounded-2xl p-6 shadow-2xs flex flex-col justify-between relative group hover:border-[#CD6040]/30 transition-all duration-300">
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#CD6040] block">
              Local Vault Metrics
            </span>
            <h3 className="text-3xl font-black font-serif text-oasis-ink tracking-tight">
              {totalEntries} <span className="text-sm font-sans font-bold text-oasis-sage">sessions logged</span>
            </h3>
            <p className="text-xs text-oasis-sage leading-relaxed">
              Every entry represents a physical screening captured securely inside your browser's private memory sandbox.
            </p>
          </div>
          
          <div className="pt-4 border-t border-[#F1ECE0] mt-4 flex items-center justify-between text-[11px] font-sans text-oasis-sage">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-oasis-clay" />
              Logs active: {totalEntries > 0 ? 'Consistent' : 'Awaiting intake'}
            </span>
            {totalEntries > 0 && (
              <button 
                onClick={() => onViewChange('history')}
                className="text-oasis-clay font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Explore logs
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Card B: Diagnostic Score Baseline status */}
        <div className="bg-white border border-[#E5DFCE] rounded-2xl p-6 shadow-2xs flex flex-col justify-between relative group hover:border-[#CD6040]/30 transition-all duration-300">
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-oasis-sage block">
              Cumulative State
            </span>
            
            {totalEntries > 0 ? (
              <div className="space-y-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black font-serif text-oasis-ink">{avgScore}</span>
                  <span className="text-xs text-oasis-sage font-bold">/ 27 Avg Pt</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-oasis-clay shrink-0"></span>
                  <span className="text-xs font-bold text-oasis-ink">
                    Classified Severity Balance
                  </span>
                </div>
                <p className="text-xs text-oasis-sage leading-normal">
                  Fuzzy Centroid centroid estimation suggests continuous stabilization index is active.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs font-bold text-oasis-sage flex items-center gap-1.5 bg-oasis-sand p-2.5 rounded-xl border border-[#FAF6ED]">
                  <AlertCircle className="w-4 h-4 text-oasis-clay shrink-0" />
                  No check-ins completed yet
                </div>
                <p className="text-xs text-oasis-sage leading-relaxed">
                  Start a brief clinical symptom assessment to unlock personalized fuzzy tracking vectors.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#F1ECE0] mt-4">
            <button
              onClick={onStartAssessment}
              className="text-xs text-oasis-clay font-bold flex items-center gap-1 hover:text-[#B54A2D] cursor-pointer"
            >
              Run screener intake
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card C: Modern Wellness Progress Gauge with Nigeria Resources */}
        <div className="bg-[#FAF6ED] border border-[#E3DCCE] rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-oasis-sage">
                Security Node Status
              </span>
              <span className="bg-[#EFF5F1] text-oasis-forest border border-[#DCEAE1] text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                Active
              </span>
            </div>
            
            <h4 className="font-extrabold text-oasis-ink text-sm font-serif">
              Clinical Sovereignty Guaranteed
            </h4>
            <p className="text-xs text-oasis-sage leading-relaxed">
              No tracking algorithms. No storage matrices beyond local database segments. Download data history logs anytime.
            </p>
          </div>

          <div className="pt-3 border-t border-[#E3DCCE] mt-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#CD6040]" />
            <span className="text-[10px] uppercase font-bold text-oasis-ink/80 tracking-wide">
              Isolated Web Client Sandbox
            </span>
          </div>
        </div>
      </section>

      {/* 2. LIVE INTERACTIVE BREATHING EXERCISE MINDFULNESS WIDGET */}
      <section className="bg-[#EFF5F1] border border-[#DCEAE1] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xs">
        <div className="max-w-md space-y-3 shrink-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-white border border-[#DCEAE1] text-oasis-forest font-sans text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            <Wind className="w-3.5 h-3.5 text-oasis-clay animate-pulse" />
            Interactive Micro-Mindfulness Tool
          </div>
          
          <h3 className="text-2xl font-black font-serif text-oasis-ink tracking-tight leading-tight">
            Stress-Release Breathing Ring
          </h3>
          <p className="text-xs text-oasis-sage leading-relaxed">
            Need an immediate moment of peace before answering clinical symptoms? Practice rhythmic box breathing: 4s inhale, 4s hold steady, 4s exhale.
          </p>

          <div className="pt-2 flex justify-center md:justify-start">
            <button
              onClick={toggleBreathWidget}
              className={`flex items-center gap-1.5 px-5 py-3 rounded-xl font-sans text-xs font-bold uppercase tracking-wide transition-all cursor-pointer shadow-2xs
                ${breathState !== 'idle'
                  ? 'bg-[#CD6040] text-white hover:opacity-90'
                  : 'bg-oasis-forest text-white hover:bg-oasis-ink'
                }`}
            >
              {breathState !== 'idle' ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  Stop Exercise
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-oasis-clay fill-oasis-clay" />
                  Begin Breathing Cycle
                </>
              )}
            </button>
          </div>
        </div>

        {/* Circular Breathing Ring container */}
        <div className="w-44 h-44 shrink-0 flex items-center justify-center relative bg-white/40 rounded-full border border-dashed border-[#B8D7C2]">
          
          {/* Outer Breathing Pulsing Graphic Node */}
          <div 
            className={`rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out border
              ${breathState === 'inhale' ? 'w-32 h-32 bg-[#D9ECD8]/45 border-[#9CCAA1] scale-110' : ''}
              ${breathState === 'hold' ? 'w-32 h-32 bg-[#C8E0CD]/60 border-[#7BB882] scale-110 shadow-lg shadow-[#7BB882]/10' : ''}
              ${breathState === 'exhale' ? 'w-24 h-24 bg-[#EAF3EA]/40 border-[#BCD8C1] scale-95' : ''}
              ${breathState === 'idle' ? 'w-24 h-24 bg-white border-[#D2E4D6] scale-100' : ''}
            `}
          >
            {/* Center Text displaying active focus instructions */}
            <div className="text-center select-none">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#CD6040] block font-sans">
                {breathState === 'idle' && 'Breathe'}
                {breathState === 'inhale' && 'Inhale'}
                {breathState === 'hold' && 'Hold'}
                {breathState === 'exhale' && 'Exhale'}
              </span>
              <span className="text-lg font-black font-serif text-[#1E3125] leading-none mt-1 inline-block">
                {breathState === 'idle' ? 'Ready' : `${breathSeconds}s`}
              </span>
            </div>
          </div>

          {/* Subtitle guide dot indicators */}
          <div className="absolute bottom-2 font-mono text-[9px] font-bold text-oasis-sage uppercase opacity-80">
            {breathState !== 'idle' ? 'Box loop' : 'Tactile focus'}
          </div>
        </div>
      </section>

      {/* 3. CLINICAL EXPLANATORY PANEL & RESOURCES */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="Clinical Support Guides">
        
        {/* Supportive Daily Routines */}
        <div className="bg-white border border-[#E5DFCE] rounded-2xl p-6 shadow-2xs space-y-3 hover:border-oasis-sage/20 transition-all">
          <h4 className="font-extrabold text-oasis-ink text-sm flex items-center gap-2 font-serif">
            <Heart className="w-4 h-4 text-[#CD6040]" />
            Supportive Daily Routines
          </h4>
          <p className="text-xs leading-relaxed text-oasis-sage">
            Establishing tiny, consistent anchors in your daily pattern is highly effective for grounding emotional comfort. Focus on regular hydration intervals, clean sleep guidelines, and logging small daily wins to observe your mood patterns gently.
          </p>
        </div>

        {/* Mindful Breathing & Focus */}
        <div className="bg-white border border-[#E5DFCE] rounded-2xl p-6 shadow-2xs space-y-3 hover:border-oasis-sage/20 transition-all">
          <h4 className="font-extrabold text-oasis-ink text-[#3E4944] text-sm flex items-center gap-2 font-serif">
            <Smile className="w-4 h-4 text-oasis-clay" />
            Rhythmic Breath &amp; Focus
          </h4>
          <p className="text-xs leading-relaxed text-oasis-sage">
            Slowing down your respiration signals the nervous system to ease muscle tension and soothe active stress. Practicing box breathing once or twice daily creates quiet mental space, perfect for stepping away from busy thoughts and centering your focus.
          </p>
        </div>
      </section>

      {/* 4. EXPLANATORY CENTRAL ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-[#F1ECE0]" id="action-terminal">
        <button
          onClick={onStartAssessment}
          className="w-full sm:w-auto px-8 py-4 bg-oasis-forest hover:bg-oasis-ink text-white font-sans font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          Begin Clinical Intake
          <ArrowRight className="w-4 h-4 text-[#CD6040] animate-pulse" />
        </button>

        <button
          onClick={() => onViewChange('history')}
          className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#FAF6ED] text-oasis-ink border border-[#E5DFCE] font-sans font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          Explore Archived Sessions
        </button>
      </div>
    </div>
  );
}
