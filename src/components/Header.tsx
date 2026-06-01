/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, FileText, Heart, History } from 'lucide-react';

interface HeaderProps {
  currentView: 'home' | 'assessment' | 'result' | 'history';
  onViewChange: (view: 'home' | 'assessment' | 'result' | 'history') => void;
  hasHistory: boolean;
}

export default function Header({ currentView, onViewChange, hasHistory }: HeaderProps) {
  return (
    <header className="border-b border-oasis-straw pb-6 mb-8 text-oasis-ink" id="app-masthead">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Calming Modern Oak Emblem */}
          <div className="w-10 h-10 flex-shrink-0 bg-oasis-straw rounded-xl flex items-center justify-center border border-[#E5DFCE] shadow-xs" aria-hidden="true">
            <Heart className="w-5 h-5 text-oasis-clay fill-oasis-straw" />
          </div>
          <div>
            <p className="text-[10px] uppercase text-oasis-sage font-bold tracking-widest font-sans">
              Private Well-being Companion
            </p>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-oasis-ink leading-none mt-0.5 font-serif">
              SymptomScribe Dashboard
            </h1>
          </div>
        </div>
        
        <div className="text-xs text-oasis-sage font-sans border-oasis-straw pl-0 sm:pl-4 sm:border-l sm:h-8 flex sm:items-center">
          <span className="bg-[#EFF5F1] text-oasis-forest border border-[#DCEAE1] text-[10px] font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-oasis-sage animate-pulse"></span>
            100% Secure &amp; Local
          </span>
        </div>
      </div>

      <div className="my-5 border-b border-dashed border-oasis-straw" />

      {/* Access Index Tabs */}
      <nav className="flex flex-wrap gap-2" aria-label="Dashboard views">
        <button
          id="nav-tab-framework"
          onClick={() => onViewChange('home')}
          className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold tracking-wide transition-all border ${
            currentView === 'home'
              ? 'bg-oasis-forest text-white border-oasis-forest shadow-sm'
              : 'text-oasis-sage hover:bg-oasis-sand hover:text-oasis-ink border-oasis-straw bg-white/70'
          }`}
          aria-current={currentView === 'home' ? 'page' : undefined}
        >
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Overview
          </span>
        </button>

        <button
          id="nav-tab-session"
          onClick={() => onViewChange('assessment')}
          className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold tracking-wide transition-all border ${
            currentView === 'assessment' || currentView === 'result'
              ? 'bg-oasis-forest text-white border-oasis-forest shadow-sm'
              : 'text-oasis-sage hover:bg-oasis-sand hover:text-oasis-ink border-oasis-straw bg-white/70'
          }`}
          aria-current={currentView === 'assessment' || currentView === 'result' ? 'page' : undefined}
        >
          <span className="flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            New assessment
          </span>
        </button>

        <button
          id="nav-tab-history"
          onClick={() => onViewChange('history')}
          className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold tracking-wide transition-all border ${
            currentView === 'history'
              ? 'bg-oasis-forest text-white border-oasis-forest shadow-sm'
              : 'text-oasis-sage hover:bg-oasis-sand hover:text-oasis-ink border-oasis-straw bg-white/70'
          }`}
          aria-current={currentView === 'history' ? 'page' : undefined}
        >
          <span className="flex items-center gap-1.5">
            <History className="w-4 h-4" />
            History &amp; Trends
            {hasHistory && (
              <span className="w-2 h-2 bg-oasis-clay rounded-full inline-block ml-1 animate-pulse" />
            )}
          </span>
        </button>
      </nav>
    </header>
  );
}
