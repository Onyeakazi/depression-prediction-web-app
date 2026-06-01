/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Menu, Heart, ShieldCheck, Clock, User } from 'lucide-react';

interface DashboardHeaderProps {
  currentView: 'home' | 'assessment' | 'result' | 'history';
  onMenuToggle: () => void;
  historyCount: number;
}

export default function DashboardHeader({
  currentView,
  onMenuToggle,
  historyCount
}: DashboardHeaderProps) {
  
  // Custom display metadata depending on active state
  const getHeaderDetails = () => {
    switch (currentView) {
      case 'home':
        return {
          category: 'Medical Framework Workspace',
          title: 'Acoustic Peace Dashboard',
          accentColor: 'text-oasis-clay'
        };
      case 'assessment':
        return {
          category: 'Part II • Active Diagnosis',
          title: 'PHQ-9 Clinical Assessment',
          accentColor: 'text-oasis-clay'
        };
      case 'result':
        return {
          category: 'Centroid Mapping Outputs',
          title: 'Symptom Breakdown Report',
          accentColor: 'text-oasis-clay'
        };
      case 'history':
        return {
          category: 'Time Series Records',
          title: 'Trends & Archival Timeline',
          accentColor: 'text-oasis-clay'
        };
      default:
        return {
          category: 'Clinical Self-Companion',
          title: 'SymptomScribe Dashboard',
          accentColor: 'text-oasis-clay'
        };
    }
  };

  const details = getHeaderDetails();

  return (
    <header className="bg-white border-b border-oasis-straw px-6 py-4 flex items-center justify-between sticky top-0 z-30" id="dashboard-header-bar">
      {/* Brand Mobile Hub & Left Grid */}
      <div className="flex items-center gap-4">
        {/* Toggle option for Mobile devices */}
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 rounded-xl border border-oasis-straw hover:bg-oasis-sand text-oasis-forest transition-colors lg:hidden shrink-0 cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Header Descriptor */}
        <div className="space-y-0.5">
          <span className="text-[0.7rem] sm:text-xs uppercase font-bold tracking-widest text-oasis-sage block">
            {details.category}
          </span>
          <h2 className="text-lg sm:text-xl font-black text-oasis-ink font-serif leading-tight">
            {details.title}
          </h2>
        </div>
      </div>

      {/* Right Tools Hub */}
      <div className="flex items-center gap-4">
        {/* Time Stamp Clock (Web feeling) */}
        <div className="hidden md:flex items-center gap-2 bg-[#FAF6ED] border border-[#E5DFCE] text-oasis-sage font-mono text-[0.7rem] px-3 py-1.5 rounded-xl font-bold">
          <Clock className="w-3.5 h-3.5 text-oasis-clay" />
          <span>UTC SERVER ACTIVE</span>
        </div>

        {/* 100% Sovereign Cloudless Badge */}
        <div className="flex items-center">
          <span className="bg-[#EFF5F1] text-oasis-forest border border-[#DCEAE1] text-[0.7rem] font-extrabold px-3 py-1.5 rounded-full uppercase flex items-center gap-1.5 shadow-2xs select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CD6040] animate-pulse"></span>
            100% Offline
          </span>
        </div>
        
        {/* Profile Avatar Micro Icon */}
        <div className="w-9 h-9 rounded-xl border border-[#E5DFCE] bg-oasis-sand flex items-center justify-center text-oasis-sage select-none" title="Independent user capsule">
          <User className="w-4 h-4 text-oasis-clay" />
        </div>
      </div>
    </header>
  );
}
