/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { runFuzzyInference } from './utils/fuzzyEngine';
import { AssessmentHistoryEntry, AssessmentResult, AssessmentInput } from './types';
import LandingView from './components/LandingView';
import HomeView from './components/HomeView';
import AssessmentForm from './components/AssessmentForm';
import ResultView from './components/ResultView';
import HistoryView from './components/HistoryView';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import {
  Heart,
  AlertTriangle,
  Trash2,
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'home' | 'assessment' | 'result' | 'history'>('landing');
  const [history, setHistory] = useState<AssessmentHistoryEntry[]>([]);
  const [activeResult, setActiveResult] = useState<AssessmentResult | null>(null);
  const [activeInputs, setActiveInputs] = useState<AssessmentInput | null>(null);
  const [activeNotes, setActiveNotes] = useState<string | undefined>(undefined);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // Load data ledger from browser storage at startup
  useEffect(() => {
    try {
      const stored = localStorage.getItem('phq9_fuzzy_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Critical: Failed to compile local storage logs.", e);
    }
  }, []);

  // Sync historical shifts with LocalStorage
  const saveHistoryToLocalStorage = (updated: AssessmentHistoryEntry[]) => {
    try {
      localStorage.setItem('phq9_fuzzy_history', JSON.stringify(updated));
    } catch (e) {
      console.error("Critical: Failed to record data registry.", e);
    }
  };

    // Process symptoms, calculate metrics and log results
  const handleAssessmentSubmit = (formData: Record<string, number>, userNotes?: string) => {
    // Fuzzify and calculate centroid results
    const inputs = {
      q1_anhedonia: formData.q1_anhedonia ?? 0,
      q2_depressed_mood: formData.q2_depressed_mood ?? 0,
      q3_sleep_issue: formData.q3_sleep_issue ?? 0,
      q4_fatigue: formData.q4_fatigue ?? 0,
      q5_appetite_issue: formData.q5_appetite_issue ?? 0,
      q6_self_worth: formData.q6_self_worth ?? 0,
      q7_concentration: formData.q7_concentration ?? 0,
      q8_psychomotor: formData.q8_psychomotor ?? 0,
      q9_suicide_ideation: formData.q9_suicide_ideation ?? 0,
    };

    const result = runFuzzyInference(inputs);
    
    // Register assessment entry
    const newEntry: AssessmentHistoryEntry = {
      id: `mdd_case_${Date.now()}`,
      timestamp: new Date().toISOString(),
      inputs,
      result,
      notes: userNotes
    };

    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    saveHistoryToLocalStorage(updatedHistory);
    
    // Launch Result Report screen
    setActiveResult(result);
    setActiveInputs(inputs);
    setActiveNotes(userNotes);
    setCurrentView('result');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Record deletions
  const handleDeleteEntry = (id: string) => {
    setEntryToDelete(id);
  };

  const confirmDeleteEntry = () => {
    if (entryToDelete) {
      const updated = history.filter(item => item.id !== entryToDelete);
      setHistory(updated);
      saveHistoryToLocalStorage(updated);
      setEntryToDelete(null);
    }
  };

  // Master reset databases
  const handleClearAllHistory = () => {
    setShowClearAllConfirm(true);
  };

  const confirmClearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem('phq9_fuzzy_history');
    setShowClearAllConfirm(false);
    setCurrentView('home');
  };

  // View specific historic results
  const handleSelectEntry = (entry: AssessmentHistoryEntry) => {
    setActiveResult(entry.result);
    setActiveInputs(entry.inputs);
    setActiveNotes(entry.notes);
    setCurrentView('result');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Determine latest status summary
  const latestEntry = history.length > 0 ? history[0] : null;

  if (currentView === 'landing') {
    return (
      <LandingView
        onEnterDashboard={() => {
          setCurrentView('home');
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
        onStartAssessment={() => {
          setCurrentView('assessment');
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex bg-[#FAF8F2] text-oasis-ink font-sans relative selection:bg-[#CD6040] selection:text-white">
      
      {/* PERSISTENT SIDEBAR NAVIGATION (Desktop persistent, Mobile toggleable drawer) */}
      <Sidebar
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
        hasHistory={history.length > 0}
        historyCount={history.length}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* COMPACT MAIN SCREEN CONTENT FRAME */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Modern Dashboard Top Header */}
        <DashboardHeader
          currentView={currentView}
          onMenuToggle={() => setIsMobileMenuOpen(prev => !prev)}
          historyCount={history.length}
        />

        {/* Dynamic Display workspace slots */}
        <div className="flex-grow p-4 sm:p-6 md:p-8 xl:p-10 max-w-6xl w-full mx-auto space-y-8">
          <div className="transition-all duration-200">
            {currentView === 'home' && (
              <HomeView
                history={history}
                onStartAssessment={() => {
                  setCurrentView('assessment');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                onViewChange={setCurrentView}
              />
            )}

            {currentView === 'assessment' && (
              <AssessmentForm
                onSubmit={handleAssessmentSubmit}
                onCancel={() => {
                  setCurrentView('home');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
              />
            )}

            {currentView === 'result' && activeResult && (
              <ResultView
                result={activeResult}
                inputs={activeInputs || undefined}
                notes={activeNotes}
                onRestart={() => {
                  setCurrentView('assessment');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                onGoToHistory={() => {
                  setCurrentView('history');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
              />
            )}

            {currentView === 'history' && (
              <HistoryView
                history={history}
                onDeleteEntry={handleDeleteEntry}
                onClearAll={handleClearAllHistory}
                onSelectEntry={handleSelectEntry}
                onNewAssessment={() => {
                  setCurrentView('assessment');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
              />
            )}
          </div>
        </div>

        {/* Global Dashboard Footnote */}
        <footer className="mt-auto px-6 py-5 border-t border-[#E5DFCE] bg-white/40 text-center font-sans text-xs text-oasis-sage flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          <p className="flex items-center gap-1.5 justify-center sm:justify-start">
            <Heart className="w-3.5 h-3.5 text-[#CD6040] fill-[#FAF8F2]" />
            SymptomScribe Dashboard &bull; Clinical PHQ-9 self-screening companion.
          </p>
          <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-[#CD6040]">
            <span>100% Client-Side Privacy Sync</span>
          </div>
        </footer>
      </div>

      {/* Confirmation Modals (Fix for sandboxed iframe blockades) */}
      {entryToDelete && (
        <div className="fixed inset-0 bg-[#1C201E]/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="delete-entry-modal" role="dialog" aria-modal="true" aria-labelledby="delete-confirm-title">
          <div className="bg-white border border-[#E5DFCE] max-w-md w-full rounded-2xl p-6 shadow-xl space-y-4 transform scale-100 transition-all leading-relaxed animate-fade-in-quick">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FDF3F0] flex items-center justify-center text-[#CD6040] border border-[#F7DFD6] shrink-0">
                <Trash2 className="w-5 h-5 animate-pulse" />
              </div>
              <h3 id="delete-confirm-title" className="text-lg font-black text-oasis-ink font-serif">
                Delete Assessment Entry?
              </h3>
            </div>
            
            <p className="text-xs text-oasis-sage leading-relaxed font-sans">
              Are you certain you want to purge this specific symptom score from your local history logs? This action is permanent and cannot be undone.
            </p>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setEntryToDelete(null)}
                className="px-4 py-2 border border-[#E5DFCE] text-oasis-sage font-sans font-bold text-xs uppercase hover:bg-oasis-sand rounded-xl cursor-pointer transition-colors"
                id="delete-cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteEntry}
                className="px-4 py-2 bg-[#CD6040] hover:opacity-90 text-white font-sans font-bold text-xs uppercase rounded-xl cursor-pointer shadow-xs transition-colors"
                id="delete-confirm"
              >
                Delete Score
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearAllConfirm && (
        <div className="fixed inset-0 bg-[#1C201E]/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="clear-all-modal" role="dialog" aria-modal="true" aria-labelledby="clear-confirm-title">
          <div className="bg-white border border-[#E5DFCE] max-w-md w-full rounded-2xl p-6 shadow-xl space-y-4 transform scale-100 transition-all leading-relaxed animate-fade-in-quick">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FDF3F0] flex items-center justify-center text-[#CD6040] border border-[#F7DFD6] shrink-0">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
              </div>
              <h3 id="clear-confirm-title" className="text-lg font-black text-[#CD6040] font-serif">
                Purge Complete History?
              </h3>
            </div>
            
            <p className="text-xs text-oasis-sage leading-relaxed font-sans">
              <strong>CRITICAL WARNING:</strong> This initiates a complete schema database format. It will wipe all stored well-being paths, clinical records, and journal notes. Your progress data cannot be recovered.
            </p>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowClearAllConfirm(false)}
                className="px-4 py-2 border border-[#E5DFCE] text-oasis-sage font-sans font-bold text-xs uppercase hover:bg-oasis-sand rounded-xl cursor-pointer transition-colors"
                id="clear-cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmClearAllHistory}
                className="px-4 py-2 bg-[#CD6040] text-white font-sans font-bold text-xs uppercase hover:opacity-95 rounded-xl cursor-pointer shadow-xs transition-colors"
                id="clear-confirm"
              >
                Purge All Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

