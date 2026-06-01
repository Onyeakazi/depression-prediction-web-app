/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormEvent, useState } from 'react';
import { AssessmentInput } from '../types';
import { ChevronLeft, ChevronRight, ClipboardSignature, RotateCcw } from 'lucide-react';

interface AssessmentFormProps {
  onSubmit: (answers: Record<string, number>, notes?: string) => void;
  onCancel: () => void;
  initialAnswers?: Record<string, number>;
}

interface PHQ9Item {
  key: keyof AssessmentInput;
  id: string;
  label: string;
  description: string;
}

const PHQ9_QUESTIONS: PHQ9Item[] = [
  {
    key: 'q1_anhedonia',
    id: 'Item 1',
    label: 'Interest in Activities',
    description: 'Little interest or pleasure in doing things over the past 2 weeks.'
  },
  {
    key: 'q2_depressed_mood',
    id: 'Item 2',
    label: 'Overall Mood',
    description: 'Feeling down, depressed, or hopeless.'
  },
  {
    key: 'q3_sleep_issue',
    id: 'Item 3',
    label: 'Sleep Habits',
    description: 'Trouble falling or staying asleep, or sleeping too much.'
  },
  {
    key: 'q4_fatigue',
    id: 'Item 4',
    label: 'Energy Level',
    description: 'Feeling tired or having little energy.'
  },
  {
    key: 'q5_appetite_issue',
    id: 'Item 5',
    label: 'Appetite & Eating',
    description: 'Poor appetite or overeating.'
  },
  {
    key: 'q6_self_worth',
    id: 'Item 6',
    label: 'Self-Worth Feelings',
    description: 'Feeling bad about yourself, or that you are a failure, or have let yourself/family down.'
  },
  {
    key: 'q7_concentration',
    id: 'Item 7',
    label: 'Concentration',
    description: 'Trouble concentrating on things, such as reading documents or viewing screens.'
  },
  {
    key: 'q8_psychomotor',
    id: 'Item 8',
    label: 'Physical Pace & Calmness',
    description: 'Moving/speaking so slowly that others noticed, or the opposite—being fidgety/restless.'
  },
  {
    key: 'q9_suicide_ideation',
    id: 'Item 9',
    label: 'Self-Harm Thoughts',
    description: 'Thoughts that you would be better off dead, or of hurting yourself in some way.'
  }
];

const SCORING_OPTIONS = [
  { value: 0, label: '0', title: 'Not at all' },
  { value: 1, label: '1', title: 'Several days' },
  { value: 2, label: '2', title: 'More than half the days' },
  { value: 3, label: '3', title: 'Nearly every day' }
];

export default function AssessmentForm({ onSubmit, onCancel, initialAnswers }: AssessmentFormProps) {
  // Store form state using initialAnswers if available
  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    if (initialAnswers) return initialAnswers;
    const initial: Record<string, number> = {};
    PHQ9_QUESTIONS.forEach(q => {
      // Intentionally leave as undefined to enforce selection validation
    });
    return initial;
  });

  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Pagination capability to make the clinical questionnaire digestible and keyboard-focused
  const [currentStep, setCurrentStep] = useState(0); // 0 = Questions 1-5, 1 = Questions 6-9 + Notes
  const stepIndices = currentStep === 0 ? [0, 1, 2, 3, 4] : [5, 6, 7, 8];

  const handleSelectValue = (key: string, val: number) => {
    setAnswers(prev => ({
      ...prev,
      [key]: val
    }));
    setValidationError(null);
  };

  const handleReset = () => {
    setAnswers({});
    setNotes('');
    setValidationError(null);
    setCurrentStep(0);
  };

  const isStepComplete = () => {
    const currentQuestions = PHQ9_QUESTIONS.filter((_, idx) => stepIndices.includes(idx));
    return currentQuestions.every(q => answers[q.key] !== undefined);
  };

  const handleNext = () => {
    if (!isStepComplete()) {
      setValidationError("Please complete all symptoms in the current section for strict mathematical convergence.");
      return;
    }
    setValidationError(null);
    setCurrentStep(1);
    // Smoothly scroll to the top of form boundary
    document.getElementById('assessment-intake')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrev = () => {
    setValidationError(null);
    setCurrentStep(0);
    document.getElementById('assessment-intake')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    
    // Check all questions
    const unanswered = PHQ9_QUESTIONS.filter(q => answers[q.key] === undefined);
    if (unanswered.length > 0) {
      setValidationError(`Assessment incomplete. Required symptoms: ${unanswered.map(q => q.id).join(', ')}.`);
      return;
    }

    onSubmit(answers, notes.trim());
  };

  // Progress metrics calculation
  const totalCompleted = PHQ9_QUESTIONS.filter(q => answers[q.key] !== undefined).length;
  const progressRatio = totalCompleted / PHQ9_QUESTIONS.length;

  return (
    <form onSubmit={handleSubmitForm} className="font-serif-body text-oasis-ink" id="assessment-intake">
      {/* Editorial Navigation Masthead */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-oasis-straw pb-4 mb-8">
        <div>
          <span className="font-mono text-[0.65rem] text-oasis-clay font-bold uppercase tracking-wider block mb-1">
            PART II • WELL-BEING ASSESSMENT
          </span>
          <h2 className="text-xl md:text-2xl font-serif-display font-black text-oasis-ink">
            Intake Questionnaire
          </h2>
        </div>

        {/* Dynamic Metric Indicator */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-sans font-bold text-oasis-forest bg-[#E7EFEA] px-3 py-1.5 rounded-xl border border-[#D5E2D9] shadow-2xs">
            Symptom Progress: {totalCompleted} / 9
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-sans hover:bg-oasis-sand flex items-center gap-1 border border-oasis-straw px-3 py-1.5 rounded-xl bg-white text-oasis-sage font-bold transition-all shadow-sm cursor-pointer"
            title="Wipe current entries"
          >
            <RotateCcw className="w-3.5 h-3.5 text-oasis-clay" />
            Reset
          </button>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-[#EAE6DC] h-2.5 rounded-full mb-8 relative overflow-hidden" aria-hidden="true">
        <div
          className="bg-oasis-clay h-full transition-all duration-500 rounded-full"
          style={{ width: `${progressRatio * 100}%` }}
        />
      </div>

      {/* Grid Table Layout (Clinical Matrix style) */}
      <div className="bg-white border border-oasis-straw rounded-2xl shadow-xs overflow-hidden mb-8">
        {/* Table Header: Only visible on widescreen desktop */}
        <div className="hidden md:grid grid-cols-12 border-b border-oasis-straw bg-[#FAF6ED]/60 font-sans text-[0.7rem] font-bold text-oasis-sage tracking-widest uppercase" aria-hidden="true">
          <div className="col-span-1 border-r border-oasis-straw p-3.5 text-center text-oasis-clay">ID</div>
          <div className="col-span-11 grid grid-cols-11">
            <div className="col-span-5 border-r border-oasis-straw p-3.5">CLINICAL SYMPTOM DESCRIPTION</div>
            <div className="col-span-6 grid grid-cols-4 text-center">
              <div className="p-3 border-r border-oasis-straw hover:bg-[#FAF6ED]/30">0<br/><span className="text-[0.65rem] font-normal text-oasis-sage lowercase font-sans">not at all</span></div>
              <div className="p-3 border-r border-oasis-straw hover:bg-[#FAF6ED]/30">1<br/><span className="text-[0.65rem] font-normal text-oasis-sage lowercase font-sans">several days</span></div>
              <div className="p-3 border-r border-oasis-straw hover:bg-[#FAF6ED]/30">2<br/><span className="text-[0.65rem] font-normal text-oasis-sage lowercase font-sans">half the days</span></div>
              <div className="p-3 hover:bg-[#FAF6ED]/30">3<br/><span className="text-[0.65rem] font-normal text-oasis-sage lowercase font-sans">nearly daily</span></div>
            </div>
          </div>
        </div>

        {/* Input Rows */}
        <div className="divide-y divide-oasis-straw">
          {PHQ9_QUESTIONS.map((q, absoluteIndex) => {
            const isVisible = stepIndices.includes(absoluteIndex);
            if (!isVisible) return null;

            const selectedValue = answers[q.key];

            return (
              <div
                key={q.key}
                className={`grid grid-cols-1 md:grid-cols-12 items-center transition-all ${
                  selectedValue !== undefined ? 'bg-[#EFF5F1]/30' : 'bg-white'
                }`}
                role="radiogroup"
                aria-labelledby={`desc-${q.key}`}
              >
                {/* Metric/ID identifier */}
                <div className="col-span-1 border-r border-oasis-straw p-4 text-center font-mono text-xs font-bold text-oasis-clay bg-oasis-sand/50 md:bg-transparent">
                  {q.id}
                </div>

                <div className="col-span-11 grid grid-cols-1 md:grid-cols-11 h-full items-center">
                  {/* Question clinical details */}
                  <div className="col-span-1 md:col-span-5 border-r border-oasis-straw p-4 md:p-6 text-sm">
                    <h3 className="font-serif font-extrabold text-[#111613] text-sm md:text-base mb-1" id={`desc-${q.key}`}>
                      {q.label}
                    </h3>
                    <p className="text-xs text-oasis-sage leading-relaxed font-sans">
                      {q.description}
                    </p>
                  </div>

                  {/* Score Option Matrix */}
                  <div className="col-span-1 md:col-span-6 p-4 md:p-0 h-full flex md:grid grid-cols-4 items-center justify-between gap-2">
                    {SCORING_OPTIONS.map(opt => {
                      const isSelected = selectedValue === opt.value;
                      const radioId = `radio-${q.key}-${opt.value}`;

                      return (
                        <label
                          key={opt.value}
                          htmlFor={radioId}
                          className={`flex-1 md:h-full flex flex-col md:flex-row items-center justify-center gap-2 cursor-pointer transition-all border md:border-0 md:border-r border-oasis-straw last:border-0 p-3.5 select-none rounded-xl md:rounded-none ${
                            isSelected
                              ? 'bg-oasis-forest text-white font-bold shadow-xs'
                              : 'hover:bg-oasis-sand md:bg-white bg-oasis-sand/80 text-oasis-ink font-medium'
                          }`}
                        >
                          <input
                            type="radio"
                            id={radioId}
                            name={q.key}
                            value={opt.value}
                            checked={isSelected}
                            onChange={() => handleSelectValue(q.key, opt.value)}
                            className="sr-only" /* keeping standard input controls readable by screen readers while customized visually */
                          />
                          <span className="font-mono text-xs md:text-md">{opt.value}</span>
                          {/* Mobile Option Guide text */}
                          <span className="md:hidden text-[0.65rem] font-sans opacity-95 text-center">
                            {opt.title}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnostic Context Area (Second Step Only) */}
      {currentStep === 1 && (
        <div id="clinician-notes-sec" className="border border-oasis-straw bg-gradient-to-br from-white to-[#FAF6ED]/60 p-6 mb-8 rounded-2xl shadow-xs relative mt-4">
          <span className="absolute -top-3 left-4 bg-oasis-clay text-white text-[0.65rem] px-2.5 py-1 font-sans font-bold uppercase tracking-wider rounded-lg shadow-xs">
            OBSERVATIONAL CLINICIAN REPORT DATA
          </span>
          <label htmlFor="clinician_notes_field" className="font-serif font-extrabold text-md flex items-center gap-2 mb-2 text-oasis-ink mt-2">
            <ClipboardSignature className="w-5 h-5 text-oasis-sage" />
            Clinician Observations / Personal Annotations (Optional)
          </label>
          <p className="text-xs text-oasis-sage mb-4 leading-relaxed font-sans">
            Record temporary environmental variables, patient medication status, or clinical observations. These will be securely stored inside this browser history file alongside the aggregated output vector.
          </p>
          <textarea
            id="clinician_notes_field"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-oasis-straw p-3 rounded-xl font-sans text-xs bg-white focus:ring-1 focus:ring-oasis-sage focus:border-oasis-sage outline-none transition-all"
            placeholder="e.g. Patient presents under high work stress. Adherence to therapy was observed..."
          />
        </div>
      )}

      {/* Validation Prompt Banner */}
      {validationError && (
        <div className="bg-orange-50 border border-orange-100 text-orange-950 p-4 mb-8 rounded-xl font-sans text-xs flex items-center gap-2 shadow-xs animate-shake" role="alert">
          <span className="font-bold uppercase text-[0.65rem] bg-oasis-clay text-white px-2 py-0.5 rounded">
            UNFINISHED
          </span>
          <span className="font-semibold">{validationError}</span>
        </div>
      )}

      {/* Intake Navigation Action Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 pt-6 border-t border-oasis-straw" id="form-actions-panel">
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-3 border border-oasis-straw hover:bg-oasis-sand text-oasis-sage font-sans font-bold text-xs tracking-wide uppercase transition-all bg-white rounded-xl shadow-xs cursor-pointer"
          >
            Cancel Session
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {currentStep === 1 ? (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="w-full sm:w-auto px-5 py-3 border border-oasis-straw hover:bg-oasis-sand text-oasis-[#1C201E] font-sans font-bold text-xs tracking-wide uppercase transition-all bg-white rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Section
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-oasis-forest text-white hover:bg-oasis-ink font-sans font-bold text-xs tracking-wider uppercase transition-all rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Compute Diagnostics
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="w-full sm:w-auto px-6 py-3 bg-oasis-forest text-white hover:bg-oasis-ink font-sans font-bold text-xs tracking-wider uppercase transition-all rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Continue to Step II
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
