/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, FileText, Heart, History, Shield, Info, X, Compass, PhoneCall } from 'lucide-react';
import siteIcon from '@/assets/icon.png';

interface SidebarProps {
  currentView: 'home' | 'assessment' | 'result' | 'history';
  onViewChange: (view: 'home' | 'assessment' | 'result' | 'history') => void;
  hasHistory: boolean;
  historyCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  currentView,
  onViewChange,
  hasHistory,
  historyCount,
  isOpen,
  onClose
}: SidebarProps) {
  const menuItems = [
    {
      id: 'home' as const,
      label: 'System Overview',
      subtitle: 'Dashboard introduction & guidance',
      icon: BookOpen,
    },
    {
      id: 'assessment' as const,
      label: 'Screener Intake',
      subtitle: 'PHQ-9 Clinical evaluation',
      icon: FileText,
    },
    {
      id: 'history' as const,
      label: 'History & Trends',
      subtitle: 'Stored scores & analytics',
      icon: History,
      badge: hasHistory ? historyCount : undefined
    }
  ];

  return (
    <>
      {/* Mobile background backdrop overlay when sidebar drawer is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-oasis-ink/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Navigation Panel */}
      <aside 
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 bg-[#1E3125] text-white w-[290px] z-50 transform transition-transform duration-300 ease-in-out border-r border-[#2C4636] flex flex-col justify-between 
          lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:max-h-screen
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Sidebar Navigation"
      >
        <div className="flex flex-col flex-1 overflow-y-auto pr-1">
          {/* Sidebar Header Container */}
          <div className="p-6 border-b border-[#2C4636] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={siteIcon} 
                alt="SymptomScribe Logo" 
                className="w-10 h-10 rounded-xl shadow-md shadow-black/10 object-cover"
                aria-hidden="true"
              />
              <div>
                <h1 className="text-lg font-black tracking-tight font-serif text-[#FAF8F2]">
                  SymptomScribe
                </h1>
                <p className="text-[0.7rem] uppercase text-[#8EAF9D] font-bold tracking-widest font-sans">
                  Sovereign Health Node
                </p>
              </div>
            </div>

            {/* Close Toggle (Mobile view list only) */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#2C4636] text-[#8EAF9D] hover:text-white transition-colors lg:hidden cursor-pointer"
              aria-label="Close Navigation Sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Core Interactive Module Links */}
          <nav className="p-4 py-6 space-y-1.5 flex-1" aria-label="Main Navigation">
            <span className="text-[0.7rem] uppercase font-bold tracking-widest text-[#8EAF9D]/75 px-3 block mb-3 font-sans">
              Clinical Workspace
            </span>
            
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || (item.id === 'assessment' && currentView === 'result');
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-sans text-left cursor-pointer group
                    ${isActive 
                      ? 'bg-[#CD6040] text-white font-bold shadow-md shadow-[#CD6040]/15' 
                      : 'hover:bg-[#253D2F] text-[#CBE1D4] hover:text-white'
                    }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-[#8EAF9D] group-hover:text-[#FAF8F2] transition-colors'}`} />
                    <div>
                      <div className="text-xs font-bold leading-none">{item.label}</div>
                      <div className={`text-[0.7rem] mt-0.5 leading-none font-normal ${isActive ? 'text-white/80' : 'text-[#8EAF9D]'}`}>
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  
                  {item.badge !== undefined && (
                    <span className={`text-[0.7rem] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-oasis-clay' : 'bg-[#2C4636] text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Helpful Self-Reflection Exercises */}
          <div className="p-4 mx-4 mb-4 rounded-xl bg-[#233B2E] border border-[#2F4E3C] space-y-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-oasis-clay" />
              <span className="text-[0.65rem] uppercase font-extrabold tracking-widest text-[#FAF8F2] font-sans">
                Self-Care Quick Tips
              </span>
            </div>
            
            <p className="text-xs text-[#A8C7B5] leading-normal font-sans">
              Take regular micro-breaks, hydrate thoroughly, and note down three daily silver linings to naturally align your center of gravity.
            </p>

            <button 
              onClick={() => {
                onViewChange('home');
                onClose();
              }}
              className="w-full flex items-center justify-center gap-1.5 bg-[#FAF8F2] hover:bg-[#F1ECE0] text-[#1E3125] font-sans font-bold text-[0.7rem] py-2 px-2.5 rounded-lg tracking-wider uppercase transition-colors cursor-pointer"
            >
              Try Breathing Exercise
            </button>
          </div>
        </div>

        {/* Secure & Offline Compliance Seal */}
        <div className="p-4 border-t border-[#2C4636] bg-[#17261D] text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[#8EAF9D]">
            <Shield className="w-3.5 h-3.5 text-[#CD6040]" />
            <span className="text-[0.7rem] font-bold uppercase tracking-widest font-sans">
              100% Secure Node
            </span>
          </div>
          <p className="text-[0.65rem] text-[#8EAF9D]/70 font-sans leading-relaxed px-2">
            Local SQLite sandbox emulation memory. Zero external server synchronization hooks.
          </p>
        </div>
      </aside>
    </>
  );
}
