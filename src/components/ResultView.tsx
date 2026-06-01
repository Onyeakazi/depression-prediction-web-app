import { useState } from 'react';
import { AssessmentResult, AssessmentInput } from '../types';
import { Clipboard, Download, Heart, ArrowRight, ShieldAlert, ListChecks, CheckCircle, Sparkles } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ResultViewProps {
  result: AssessmentResult;
  inputs?: AssessmentInput;
  notes?: string;
  onRestart: () => void;
  onGoToHistory: () => void;
}

export default function ResultView({ result, inputs, notes, onRestart, onGoToHistory }: ResultViewProps) {
  const [copied, setCopied] = useState(false);

  // Dynamic summary of key symptoms reported
  const generateDynamicSummary = () => {
    if (!inputs) {
      return "You successfully logged a symptom evaluation. The cumulative scoring details reflect your overall report.";
    }
    const high = symptomsMeta.filter(s => (inputs[s.key] ?? 0) >= 2).map(s => s.name);
    const mod = symptomsMeta.filter(s => (inputs[s.key] ?? 0) === 1).map(s => s.name);
    
    if (high.length === 0 && mod.length === 0) {
      return "Excellent. Your check-in indicates minimal to zero symptoms active. Energy levels, focus patterns, and physical motor behaviors are balanced and stable.";
    }
    
    let summaryText = "Your evaluation highlights ";
    if (high.length > 0) {
      summaryText += `more frequent challenges affecting your ${high.join(', ')}. `;
    }
    if (mod.length > 0) {
      summaryText += `${high.length > 0 ? 'Additionally, you ' : 'you '}experienced minor periodic variations in ${mod.join(', ')}. `;
    }
    summaryText += "Prioritizing physical rest, positive dialogue, rhythmic breathing, and constructive regular self-reflection outlines can highly support a balanced mood.";
    return summaryText;
  };

  // Friendly descriptions and guidelines based on PHQ-9 medical scoring
  const getSeverityDescription = (label: string) => {
    switch (label) {
      case 'None':
        return {
          title: "None or Minimal Symptoms",
          guideline: "No active clinical protocols are suggested. Maintain your standard healthy routines, practice proactive sleep patterns, and re-assess if you experience extra life stressors.",
          levelStyle: "bg-emerald-50 text-emerald-800 border-emerald-150",
          colorCode: "#10b981"
        };
      case 'Mild':
        return {
          title: "Mild Symptoms",
          guideline: "Indicates minor mood symptoms. We recommend incorporating light physical exercise, focusing on mindfulness, discussing feelings with supportive friends, and taking routine screen checks.",
          levelStyle: "bg-green-50 text-green-800 border-green-150",
          colorCode: "#22c55e"
        };
      case 'Moderate':
        return {
          title: "Moderate Symptoms",
          guideline: "Represents intermediate symptoms. It may be highly beneficial to consult with a mental health professional or counselor. Exploring conversational support or Cognitive Behavioral Therapy (CBT) techniques can provide excellent guidance.",
          levelStyle: "bg-amber-50 text-amber-800 border-amber-150",
          colorCode: "#f59e0b"
        };
      case 'Moderately Severe':
        return {
          title: "Moderately Severe Symptoms",
          guideline: "Indicates significant symptom patterns. We highly suggest scheduling a consultation with a licensed psychotherapist, counselor, or general health doctor to review customized support strategies.",
          levelStyle: "bg-orange-50 text-orange-850 border-orange-200",
          colorCode: "#f97316"
        };
      case 'Severe':
      default:
        return {
          title: "Severe Symptoms",
          guideline: "Indicates substantial mood symptoms. Standard medical consensus strongly advises scheduling a diagnostic interview or professional check-up with an authorized clinical specialist immediately to build a supportive care outline.",
          levelStyle: "bg-rose-50 text-rose-800 border-rose-150",
          colorCode: "#f43f5e"
        };
    }
  };

  const severityDesc = getSeverityDescription(result.severityLabel);

  const getResponseLabel = (score: number) => {
    switch (score) {
      case 0: return { text: "Not at all", style: "bg-oasis-sand text-oasis-sage border-oasis-straw" };
      case 1: return { text: "Several days", style: "bg-[#EFF5F1] text-oasis-sage border-[#DCEAE1]" };
      case 2: return { text: "More than half the days", style: "bg-[#FAF6ED] text-[#8C7B50] border-[#E8E2D2]" };
      case 3: return { text: "Nearly every day", style: "bg-[#FDF3F0] text-oasis-clay border-[#F7DFD6] font-extrabold" };
      default: return { text: "Unanswered", style: "bg-oasis-sand text-oasis-sage/40 border-oasis-straw" };
    }
  };

  const symptomsMeta = [
    { key: 'q1_anhedonia' as keyof AssessmentInput, name: 'Interest Levels', desc: 'Little interest or pleasure in doing things' },
    { key: 'q2_depressed_mood' as keyof AssessmentInput, name: 'Overall Mood', desc: 'Feeling down, depressed, or hopeless' },
    { key: 'q3_sleep_issue' as keyof AssessmentInput, name: 'Sleep Patterns', desc: 'Trouble falling/staying asleep, or sleeping too much' },
    { key: 'q4_fatigue' as keyof AssessmentInput, name: 'Energy Level', desc: 'Feeling tired or having little energy' },
    { key: 'q5_appetite_issue' as keyof AssessmentInput, name: 'Appetite Habits', desc: 'Poor appetite or overeating' },
    { key: 'q6_self_worth' as keyof AssessmentInput, name: 'Self Relationship', desc: 'Feeling bad about yourself, or that you let people down' },
    { key: 'q7_concentration' as keyof AssessmentInput, name: 'Concentration', desc: 'Trouble concentrating (e.g., reading or watching TV)' },
    { key: 'q8_psychomotor' as keyof AssessmentInput, name: 'Motor Velocity', desc: 'Moving/speaking slowly, or fidgety/restless physical state' },
    { key: 'q9_suicide_ideation' as keyof AssessmentInput, name: 'Critical Thoughts', desc: 'Thoughts of being better off dead, or self-harm' },
  ];

  const handleShareText = () => {
    const textOutput = `=== SymptomScribe Well-being Record ===\n` +
      `Date: ${new Date(result.timestamp).toLocaleDateString()}\n` +
      `PHQ-9 Score: ${result.numericScore}/27\n` +
      `Severity Status: ${result.severityLabel} Features\n` +
      `Assessment Notes: ${notes || 'None'}`;
    
    navigator.clipboard.writeText(textOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const margin = 20;
    let y = 20;

    // Report Header Banner
    doc.setFillColor(244, 248, 249); // Clean slate-teal accent background
    doc.rect(0, 0, 210, 35, "F");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(15, 118, 110); // Teal #0f766e
    doc.text("SYMPTOMSCRIBE WELL-BEING REPORT", margin, y);
    y += 6;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(`Generated: ${new Date(result.timestamp).toLocaleString()}  •  Secure Local Record  •  PHQ-9 Scale`, margin, y);
    
    y = 48;

    // Section 1: Score Details
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("ASSESSMENT SCORE PROFILE", margin, y);
    y += 6;

    // Border container for core stats
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y, 170, 28, 2, 2, "DF");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(13);
    let colorRGB = [15, 118, 110]; // Default teal
    if (result.severityLabel === 'None') colorRGB = [16, 185, 129];
    else if (result.severityLabel === 'Mild') colorRGB = [34, 197, 94];
    else if (result.severityLabel === 'Moderate') colorRGB = [245, 158, 11];
    else if (result.severityLabel === 'Moderately Severe') colorRGB = [249, 115, 22];
    else if (result.severityLabel === 'Severe') colorRGB = [244, 63, 94];

    doc.setTextColor(colorRGB[0], colorRGB[1], colorRGB[2]);
    doc.text(`${result.severityLabel.toUpperCase()} SEVERITY RANGE`, margin + 6, y + 8);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text(severityDesc.title, margin + 6, y + 13);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`Total Score: ${result.numericScore} / 27`, margin + 6, y + 21);

    y += 38;

    // Section 2: Clinical Guideline
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("SUPPORTIVE RECOMMENDATIONS & GUIDELINES", margin, y);
    y += 6;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85); // slate-700
    const textLines = doc.splitTextToSize(severityDesc.guideline, 170);
    doc.text(textLines, margin, y);
    y += (textLines.length * 4.8) + 10;

    // Section 3: Symptom Log if inputs present
    if (inputs) {
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("DETAILED SYMPTOM RESPONSE ANALYSIS", margin, y);
      y += 6;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);

      symptomsMeta.forEach((sym) => {
        const scoreVal = inputs[sym.key] ?? 0;
        const scoreLabel = getResponseLabel(scoreVal).text;
        
        // Print compact listing of responses
        if (y < 250) {
          doc.setFont("Helvetica", "bold");
          doc.text(`• ${sym.name}:`, margin + 2, y);
          doc.setFont("Helvetica", "normal");
          doc.text(` ${scoreLabel}  (${scoreVal} pts)  --  ${sym.desc}`, margin + 35, y);
          y += 4.5;
        }
      });
      y += 6;
    }

    // Section 4: Notes
    if (notes) {
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("PERSONAL ANNOTATIONS / JOURNAL", margin, y);
      y += 6;

      doc.setFont("Helvetica", "italic");
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      const noteLines = doc.splitTextToSize(`"${notes}"`, 170);
      doc.text(noteLines, margin, y);
      y += (noteLines.length * 4.8) + 10;
    }

    // Supportive self-care notes at bottom (Always visible, clean container)
    y = Math.max(y, 230);
    doc.setFillColor(240, 253, 250); 
    doc.setDrawColor(204, 251, 241); 
    doc.roundedRect(margin, y, 170, 18, 1.5, 1.5, "DF");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(13, 148, 136); 
    doc.text("DAILY WELLNESS NOTE:", margin + 4, y + 5);
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(15, 118, 110); 
    const wellnessInfo = "Prioritizing physical rest, positive dialogue, rhythmic breathing, and constructive regular self-reflection outlines highly benefit sustained mental well-being.";
    const emLines = doc.splitTextToSize(wellnessInfo, 160);
    doc.text(emLines, margin + 4, y + 10);

    // Footer lines
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, 260, 210 - margin, 260);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); 
    doc.text("This screening document does not represent formal medical prescriptions or licensed therapy regimens.", margin, 265);
    doc.text("Page 1 of 1  • SymptomScribe Daily Companion Dashboard", margin, 270);

    doc.save(`wellbeing-score-record-${Math.floor(Date.now() / 1000)}.pdf`);
  };

  return (
    <div className="space-y-8" id="assessment-result-sheet">
      
      {/* Editorial Report Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-oasis-straw pb-4">
        <div>
          <span className="bg-[#FAF6ED] text-oasis-clay text-[0.7rem] font-bold uppercase tracking-widest px-3 py-1 rounded-md border border-oasis-straw font-sans">
            Score Summary Profile
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-oasis-ink mt-1.5 font-serif">
            Wellness Check-in Record
          </h2>
        </div>
        <div className="text-xs text-oasis-sage font-sans">
          Completed: {new Date(result.timestamp).toLocaleDateString()}
        </div>
      </div>

      {/* Primary Diagnosis Callout panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        
        {/* Score Circle Card */}
        <div className="md:col-span-1 bg-white border border-oasis-straw p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 shadow-xs">
          <span className="text-[0.7rem] uppercase tracking-widest text-oasis-sage font-bold font-sans">
            PHQ-9 Cumulative Score
          </span>
          
          <div className="relative flex items-center justify-center w-28 h-28 bg-oasis-sand border-4 border-oasis-clay rounded-full select-none shadow-xs">
            <span className="text-3xl font-black text-oasis-ink font-sans">
              {result.numericScore}
            </span>
            <span className="absolute bottom-4 text-[0.7rem] uppercase font-bold text-oasis-sage">
              / 27 pts
            </span>
          </div>

          <div className="text-xs text-slate-400 font-sans leading-normal">
            Standard clinical sum of 9 questions
          </div>
        </div>

        {/* Severity Classification Card (2 columns) */}
        <div className="md:col-span-2 bg-white border border-oasis-straw p-6 rounded-2xl flex flex-col justify-between shadow-xs space-y-4">
          <div className="space-y-2">
            <span className="text-[0.7rem] uppercase tracking-widest text-oasis-sage font-bold font-sans">
              Screened Status
            </span>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: severityDesc.colorCode }}
              />
              <h3 className="text-xl sm:text-2xl font-black text-oasis-ink font-serif">
                {result.severityLabel} Features
              </h3>
            </div>
            <p className="text-xs text-oasis-forest bg-[#EFF5F1] px-3 py-1 border border-[#DCEAE1] rounded-lg w-fit font-bold">
              {severityDesc.title}
            </p>
          </div>

          <div className="text-xs text-oasis-sage leading-relaxed font-sans border-t border-oasis-straw pt-3">
            Your self-reports are captured securely and evaluated against authorized medical guidelines to provide helpful supportive summaries below.
          </div>
        </div>
      </div>

      {/* Dynamic Summary Card */}
      <div className="bg-[#FAF6ED] border border-oasis-straw p-6 rounded-2xl shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-oasis-clay uppercase tracking-widest font-sans flex items-center gap-1.5 font-serif">
          <Sparkles className="w-4 h-4 text-oasis-clay fill-oasis-clay/20 animate-pulse" />
          Symptom Evaluation Summary
        </h4>
        <p className="text-xs sm:text-sm leading-relaxed text-[#2c302d] font-sans">
          {generateDynamicSummary()}
        </p>
      </div>

      {/* Advisory Guidelines */}
      <div className="bg-white border border-oasis-straw p-6 rounded-2xl shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-[#3E4944] uppercase tracking-widest font-sans border-b border-oasis-straw pb-2 font-serif">
          🎯 Supportive Guidance &amp; Resources
        </h4>
        <p className="text-xs sm:text-sm leading-relaxed text-[#2c302d] font-sans">
          {severityDesc.guideline}
        </p>
        
        <div className="flex gap-3 text-xs text-[#2C4A3A] leading-normal bg-[#EFF5F1]/80 p-4 border border-[#DCEAE1] rounded-xl shadow-2xs">
          <Heart className="w-5 h-5 text-oasis-clay flex-shrink-0 fill-[#FDF3F0]" />
          <span className="font-sans">
            <strong>Daily Well-being Pointer:</strong> Prioritizing active rest, practicing mindfulness, staying hydrated, and chatting with trusted close friends are wonderful, positive ways to support a balanced mood.
          </span>
        </div>
      </div>

      {/* Symptom Breakdown Grid */}
      {inputs && (
        <section className="bg-white border border-oasis-straw p-6 rounded-2xl shadow-xs space-y-5" aria-label="Symptom analysis dashboard">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-oasis-ink uppercase tracking-widest font-sans flex items-center gap-2 font-serif">
              <ListChecks className="w-4 h-4 text-oasis-clay" />
              Symptom Specific Breakdown
            </h4>
            <p className="text-xs text-oasis-sage leading-relaxed">
              Below is the summary of what you reported across each of the nine core areas evaluated during this session.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {symptomsMeta.map((sym) => {
              const scoreVal = inputs[sym.key] ?? 0;
              const badge = getResponseLabel(scoreVal);
              return (
                <div key={sym.key} className="p-3 border border-oasis-straw rounded-xl space-y-1 flex items-start justify-between gap-3 hover:bg-oasis-sand/50 transition-colors">
                  <div className="space-y-0.5 max-w-[70%]">
                    <p className="text-xs font-bold text-oasis-ink font-serif">{sym.name}</p>
                    <p className="text-xs text-oasis-sage leading-normal line-clamp-2" title={sym.desc}>
                      {sym.desc}
                    </p>
                  </div>
                  <span className={`text-[0.65rem] px-2.5 py-0.5 rounded-full border shrink-0 text-center font-sans tracking-wide ${badge.style}`}>
                    {badge.text}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Clinician Notes Log */}
      {notes && (
        <div className="border border-oasis-straw bg-white p-6 rounded-2xl shadow-xs relative mt-4">
          <span className="absolute -top-3 left-4 bg-oasis-clay text-white text-[0.65rem] px-2.5 py-1 font-sans font-bold uppercase tracking-wider rounded-lg shadow-sm">
            Self Journal Observational Notes
          </span>
          <h4 className="font-bold text-oasis-ink text-xs mb-1.5 mt-1 uppercase font-sans tracking-widest font-serif">
            Appended Notes
          </h4>
          <p className="text-xs italic leading-relaxed text-oasis-sage font-sans">
            &ldquo;{notes}&rdquo;
          </p>
        </div>
      )}

      {/* Interactive Action Menu */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-oasis-straw" id="results-command-bar">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            id="btn-archive-report"
            onClick={handleShareText}
            className="w-full sm:w-auto px-5 py-3 border border-oasis-straw text-oasis-sage hover:bg-oasis-sand font-sans font-bold text-xs uppercase flex items-center justify-center gap-1.5 bg-white rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Clipboard className="w-4 h-4 text-oasis-clay" />
            {copied ? "Copied!" : "Copy Clipboard Text"}
          </button>
          
          <button
            id="btn-download-pdf-report"
            onClick={handleDownloadPDF}
            className="w-full sm:w-auto px-5 py-3 border border-oasis-straw text-oasis-sage hover:bg-oasis-sand font-sans font-bold text-xs uppercase flex items-center justify-center gap-1.5 bg-white rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-oasis-clay" />
            Download PDF Report
          </button>

          <button
            id="btn-[#sec-history-link]"
            onClick={onGoToHistory}
            className="w-full sm:w-auto px-5 py-3 border border-oasis-straw text-oasis-sage hover:bg-oasis-sand font-sans font-bold text-xs uppercase flex items-center justify-center gap-1.5 bg-white rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Go to history
          </button>
        </div>

        <button
          id="btn-start-evaluation-anew"
          onClick={onRestart}
          className="w-full sm:w-auto px-6 py-3 bg-oasis-forest text-white hover:bg-oasis-ink font-sans font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          Take Another Test
        </button>
      </div>

    </div>
  );
}
