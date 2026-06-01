/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import siteIcon from '@/assets/icon.png';
import {
  ArrowRight,
  Heart,
  ShieldCheck,
  Wind,
  Brain,
  ChevronRight,
  Lock,
  Sparkles,
  Info,
  CheckCircle
} from 'lucide-react';

interface LandingViewProps {
  onEnterDashboard: () => void;
  onStartAssessment: () => void;
}

export default function LandingView({ onEnterDashboard, onStartAssessment }: LandingViewProps) {
  // Interactive preview state for fuzzy logic visualization
  const [mockScore, setMockScore] = useState<number>(14);

  // Calculate mock memberships based on PHQ-9 ranges
  const getFuzzyMemberships = (score: number) => {
    // Standard trapezoidal/triangular memberships
    const none = Math.max(0, Math.min(1, (10 - score) / 10));
    const mild = score <= 5 ? score / 5 : Math.max(0, Math.min(1, (15 - score) / 10));
    const moderate = score <= 10 ? Math.max(0, (score - 5) / 5) : Math.max(0, Math.min(1, (20 - score) / 10));
    const severe = Math.max(0, Math.min(1, (score - 15) / 5));

    return { none, mild, moderate, severe };
  };

  const memberships = getFuzzyMemberships(mockScore);

  const getSeverityLabel = (score: number) => {
    if (score < 5) return 'Minimal (None)';
    if (score < 10) return 'Mild';
    if (score < 15) return 'Moderate';
    if (score < 20) return 'Moderately Severe';
    return 'Severe';
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-oasis-ink font-sans relative overflow-hidden selection:bg-[#CD6040] selection:text-white" id="landing-portal">
      {/* Subtle grid backing decoration */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#E5DFCE_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none"
        aria-hidden="true"
      />

      {/* Decorative organic blur nodes */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#EFF5F1] rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FDF3F0] rounded-full blur-[120px] opacity-45 pointer-events-none" />

      {/* PREMIUM TOP HEADER NAVBAR */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 sm:py-8 flex items-center justify-between border-b border-oasis-straw/60 backdrop-blur-xs bg-[#FAF8F2]/80">
        <div className="flex items-center gap-3">
          <img 
            src={siteIcon} 
            alt="SymptomScribe Logo" 
            className="w-10 h-10 rounded-xl shadow-lg shadow-[#CD6040]/15 object-cover"
          />
          <div>
            <h1 className="text-xl font-black tracking-tight font-serif text-oasis-ink leading-none">
              SymptomScribe
            </h1>
            <p className="text-[0.65rem] sm:text-[0.7rem] uppercase text-oasis-sage font-bold tracking-widest font-sans mt-0.5">
              Sovereign Health Companion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 bg-[#EFF5F1] text-oasis-forest border border-[#DCEAE1] text-[0.7rem] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-2xs select-none">
            <ShieldCheck className="w-3.5 h-3.5 text-[#CD6040]" />
            100% Offline Sandbox
          </div>

          <button
            onClick={onEnterDashboard}
            className="group px-4 py-2 border border-oasis-forest hover:bg-oasis-forest hover:text-white text-oasis-forest font-sans font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all duration-300 shadow-2xs flex items-center gap-1"
          >
            Dashboard
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-20 md:pt-20 lg:pt-24 space-y-16">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" aria-label="Introduction Banner">

          {/* Left Column: Premium Pitch */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#FDF3F0] border border-[#F7DFD6] text-[#CD6040] font-sans text-[0.7rem] sm:text-xs px-4.5 py-1.5 rounded-full font-bold uppercase tracking-wider shadow-3xs animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 fill-[#CD6040]/10" />
              Private PHQ-9 Screener Intake &bull; Fuzzy Logic Engine
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-serif text-oasis-ink tracking-tight leading-[1.08]">
              A Calming Space for <br />
              <span className="text-oasis-sage italic font-normal">Honest Self-Reflection</span>
            </h2>

            <p className="text-sm sm:text-base text-oasis-sage max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans font-medium">
              SymptomScribe is a clinical-grade PHQ-9 self-screening companion designed to evaluate depressive symptom indicators. By integrating advanced **Fuzzy Inference Logic** with a beautiful, zero-tracking privacy architecture, it translates standard checklists into precise diagnostic insights.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onStartAssessment}
                className="w-full sm:w-auto px-8 py-4 bg-oasis-forest hover:bg-oasis-ink text-white font-sans font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                Begin Private Screening
                <ArrowRight className="w-4 h-4 text-[#CD6040] animate-pulse" />
              </button>

              <button
                onClick={onEnterDashboard}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#FAF6ED] text-oasis-ink border border-[#E5DFCE] font-sans font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                Access System Dashboard
              </button>
            </div>

            {/* Interactive feature indicators */}
            <div className="pt-8 border-t border-[#F1ECE0] grid grid-cols-3 gap-4 text-left max-w-lg mx-auto lg:mx-0">
              <div>
                <span className="block text-2xl font-black text-oasis-ink font-serif">100%</span>
                <span className="text-[0.7rem] uppercase font-bold text-oasis-sage tracking-wider">Client-Side Secure</span>
              </div>
              <div className="border-l border-[#E5DFCE] pl-4">
                <span className="block text-2xl font-black text-oasis-ink font-serif">PHQ-9</span>
                <span className="text-[0.7rem] uppercase font-bold text-oasis-sage tracking-wider">Clinical Standard</span>
              </div>
              <div className="border-l border-[#E5DFCE] pl-4">
                <span className="block text-2xl font-black text-oasis-ink font-serif">Fuzzy</span>
                <span className="text-[0.7rem] uppercase font-bold text-oasis-sage tracking-wider">Centroid Mapping</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Interactive Fuzzy Logic Interactive Mockup */}
          <div className="lg:col-span-5 bg-white border border-[#E5DFCE] rounded-3xl p-6 sm:p-8 shadow-xl relative group hover:border-[#CD6040]/30 transition-all duration-300">
            <div className="absolute top-3 right-3 bg-[#FAF6ED] border border-[#E5DFCE] text-[0.6rem] sm:text-[0.65rem] font-bold text-oasis-sage uppercase px-2 py-0.5 rounded-md flex items-center gap-1 select-none">
              <Brain className="w-3 h-3 text-[#CD6040]" />
              Fuzzy Mathematics Demo
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <h4 className="font-serif font-black text-lg text-oasis-ink leading-tight">
                  Dynamic Defuzzifier Simulator
                </h4>
                <p className="text-xs text-oasis-sage leading-relaxed font-sans">
                  Drag the slider below to witness how physical PHQ-9 scores activate multi-layered mathematical membership curves in real-time.
                </p>
              </div>

              {/* Slider Controller */}
              <div className="space-y-2 bg-[#FAF8F2] p-4 rounded-xl border border-oasis-straw">
                <div className="flex justify-between items-center">
                  <span className="text-[0.7rem] uppercase font-black text-oasis-sage tracking-wide">
                    Input PHQ-9 Sum:
                  </span>
                  <span className="text-xl font-serif font-black text-[#CD6040]">
                    {mockScore} / 27
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="27"
                  value={mockScore}
                  onChange={(e) => setMockScore(Number(e.target.value))}
                  className="w-full h-2 bg-[#E5DFCE] rounded-lg appearance-none cursor-pointer accent-[#CD6040] focus:outline-none"
                />
                <div className="flex justify-between text-[0.65rem] font-bold text-oasis-sage uppercase px-1">
                  <span>0 (None)</span>
                  <span>14 (Moderate)</span>
                  <span>27 (Severe)</span>
                </div>
              </div>

              {/* Fuzzy Membership Visual Bars */}
              <div className="space-y-3.5">
                <span className="text-[0.7rem] uppercase font-black text-oasis-sage tracking-wider block">
                  Activated Membership States (Centroid Mapping):
                </span>

                {/* State 1: None */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-oasis-forest">Minimal / None Status</span>
                    <span className="font-mono text-oasis-sage">{(memberships.none * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#FAF8F2] rounded-full overflow-hidden border border-[#E5DFCE]">
                    <div
                      className="h-full bg-oasis-sage rounded-full transition-all duration-300"
                      style={{ width: `${memberships.none * 100}%` }}
                    />
                  </div>
                </div>

                {/* State 2: Mild */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-oasis-forest">Mild Severity Range</span>
                    <span className="font-mono text-oasis-sage">{(memberships.mild * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#FAF8F2] rounded-full overflow-hidden border border-[#E5DFCE]">
                    <div
                      className="h-full bg-[#8EAF9D] rounded-full transition-all duration-300"
                      style={{ width: `${memberships.mild * 100}%` }}
                    />
                  </div>
                </div>

                {/* State 3: Moderate */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#CD6040]">Moderate Clinical Phase</span>
                    <span className="font-mono text-oasis-sage">{(memberships.moderate * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#FAF8F2] rounded-full overflow-hidden border border-[#E5DFCE]">
                    <div
                      className="h-full bg-[#CD6040]/70 rounded-full transition-all duration-300"
                      style={{ width: `${memberships.moderate * 100}%` }}
                    />
                  </div>
                </div>

                {/* State 4: Severe */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#CD6040] font-black">Severe Diagnosis Vector</span>
                    <span className="font-mono text-oasis-sage">{(memberships.severe * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#FAF8F2] rounded-full overflow-hidden border border-[#E5DFCE]">
                    <div
                      className="h-full bg-[#CD6040] rounded-full transition-all duration-300"
                      style={{ width: `${memberships.severe * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Centroid Classification Output */}
              <div className="bg-[#EFF5F1] border border-[#DCEAE1] p-4 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[0.6rem] sm:text-[0.65rem] uppercase font-black text-oasis-forest tracking-wider block">
                    Centroid Weighted Synthesis
                  </span>
                  <span className="font-serif font-black text-base text-oasis-forest leading-none">
                    {getSeverityLabel(mockScore)} Stage
                  </span>
                </div>
                <button
                  onClick={onStartAssessment}
                  className="bg-oasis-forest text-white hover:bg-oasis-ink font-sans font-bold text-[0.7rem] px-3.5 py-2 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Verify Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST PILLARS BENTO GRID */}
        <section className="space-y-8 pt-10" aria-label="Product Features">
          <div className="text-center space-y-2">
            <span className="text-[0.7rem] uppercase font-black tracking-widest text-[#CD6040]">
              Architectural Standard
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-serif text-oasis-ink tracking-tight">
              Clinical Quality. Sovereign Security.
            </h3>
            <p className="text-xs sm:text-sm text-oasis-sage max-w-lg mx-auto font-sans font-medium">
              We engineered SymptomScribe to operate strictly under your control, ensuring medical assessment standards work hand-in-hand with absolute privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Feature 1: Isolated Local Privacy */}
            <div className="bg-white border border-[#E5DFCE] p-6 sm:p-8 rounded-3xl space-y-4 hover:border-[#CD6040]/20 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EFF5F1] flex items-center justify-center text-[#CD6040] border border-[#DCEAE1] group-hover:scale-105 transition-transform duration-300">
                  <Lock className="w-5.5 h-5.5 text-oasis-sage" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif font-black text-lg text-oasis-ink">
                    100% Client-Side Privacy
                  </h4>
                  <p className="text-xs text-oasis-sage leading-relaxed font-sans">
                    Your mental health data belongs exclusively to you. SymptomScribe saves all assessments in an isolated LocalStorage vault on your browser. No remote servers. No cookies. No clouds.
                  </p>
                </div>
              </div>
              <ul className="text-xs font-sans text-oasis-sage space-y-1.5 pt-4 border-t border-[#F1ECE0] mt-4 font-semibold">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-oasis-sage shrink-0" />
                  Zero server trackers or APIs
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-oasis-sage shrink-0" />
                  Offline capability out-of-the-box
                </li>
              </ul>
            </div>

            {/* Feature 2: Scientific Fuzzy Centroid Math */}
            <div className="bg-white border border-[#E5DFCE] p-6 sm:p-8 rounded-3xl space-y-4 hover:border-[#CD6040]/20 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FDF3F0] flex items-center justify-center border border-[#F7DFD6] group-hover:scale-105 transition-transform duration-300">
                  <Brain className="w-5.5 h-5.5 text-[#CD6040]" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif font-black text-lg text-oasis-ink">
                    Standardized Fuzzy Inference
                  </h4>
                  <p className="text-xs text-oasis-sage leading-relaxed font-sans">
                    Standard clinical surveys suffer from rigid categorization. We model emotional symptoms using fuzzy mathematical membership functions (centroids) to reflect the true fluidity of human wellbeing.
                  </p>
                </div>
              </div>
              <ul className="text-xs font-sans text-oasis-sage space-y-1.5 pt-4 border-t border-[#F1ECE0] mt-4 font-semibold">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#CD6040] shrink-0" />
                  Clinical PHQ-9 screening metrics
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#CD6040] shrink-0" />
                  Centroid defuzzification mapping
                </li>
              </ul>
            </div>

            {/* Feature 3: Tactical Breathing Relief Ring */}
            <div className="bg-[#FAF6ED] border border-[#E3DCCE] p-6 sm:p-8 rounded-3xl space-y-4 hover:border-[#CD6040]/20 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-[#E3DCCE] group-hover:scale-105 transition-transform duration-300">
                  <Wind className="w-5.5 h-5.5 text-oasis-sage" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif font-black text-lg text-oasis-ink">
                    Rhythmic Breathing Ring
                  </h4>
                  <p className="text-xs text-oasis-sage leading-relaxed font-sans">
                    Clinical screenings can feel stressful. We integrated a calming rhythmic Box Breathing module designed to help slow down heart rate and settle mental static before starting check-ins.
                  </p>
                </div>
              </div>
              <ul className="text-xs font-sans text-oasis-sage space-y-1.5 pt-4 border-t border-[#E3DCCE] mt-4 font-semibold">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-oasis-sage shrink-0" />
                  Calming 4s-4s-4s pacing cycles
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-oasis-sage shrink-0" />
                  Immediate autonomic relaxation
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* MINDFULNESS CALL TO ACTION BANNER */}
        <section className="bg-oasis-forest border border-[#2C4636] text-[#FAF8F2] rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg" aria-label="Action Intake Callout">
          <div className="absolute top-[-30%] right-[-10%] w-[350px] h-[350px] bg-[#2C4636] rounded-full blur-[80px] opacity-40 pointer-events-none" />

          <div className="max-w-2xl space-y-6 relative z-10">
            <span className="text-[0.7rem] uppercase font-bold tracking-widest text-[#8EAF9D]">
              Secure intake gateway
            </span>
            <h3 className="text-3xl sm:text-4xl font-black font-serif tracking-tight leading-tight">
              Ready to take a private, clinical assessment?
            </h3>
            <p className="text-xs sm:text-sm text-[#A8C7B5] leading-relaxed">
              No forms to sign, no account registrations, and no tracking. You are 3 minutes away from a secure, local fuzzy classification breakdown. All diagnostic logs remain strictly in your browser session.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onStartAssessment}
                className="px-6 py-3.5 bg-[#CD6040] hover:bg-[#B54A2D] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-xs transition-colors flex items-center gap-2"
              >
                Begin screening intake
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={onEnterDashboard}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-[#FAF8F2] border border-[#2C4636] font-sans font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
              >
                Access dashboard
              </button>
            </div>
          </div>
        </section>

        {/* CLINICAL DISCLAIMER & RESOURCES FOOTER */}
        <footer className=" pt-10 pb-4 space-y-8 select-none" aria-label="Support Resources and Disclosures">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#F1ECE0] pt-6 text-xs text-oasis-sage font-sans font-semibold">
            <p>&copy; {new Date().getFullYear()} SymptomScribe Companion &bull; Safe, Local, Sovereign client node.</p>
            <div className="flex items-center gap-4 text-[0.7rem] uppercase font-bold tracking-widest text-[#CD6040]">
              <span>100% Client-Side Private</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
