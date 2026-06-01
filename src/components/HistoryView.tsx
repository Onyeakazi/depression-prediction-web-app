import { AssessmentHistoryEntry, AssessmentInput } from '../types';
import { Calendar, Trash2, LineChart, FileText, Download, Heart } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface HistoryViewProps {
  history: AssessmentHistoryEntry[];
  onDeleteEntry: (id: string) => void;
  onClearAll: () => void;
  onSelectEntry: (entry: AssessmentHistoryEntry) => void;
  onNewAssessment: () => void;
}

export default function HistoryView({
  history,
  onDeleteEntry,
  onClearAll,
  onSelectEntry,
  onNewAssessment
}: HistoryViewProps) {
  
  // Chronological sorting for the SVG longitudinal trend line chart
  const chronologicalHistory = [...history].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Modern, polished PDF generation matching ResultView
  const downloadReportPDF = (entry: AssessmentHistoryEntry) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const { result, notes, inputs } = entry;
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
    doc.setTextColor(15, 23, 42); 
    doc.text("ASSESSMENT SCORE PROFILE", margin, y);
    y += 6;

    // Border container for core stats
    doc.setDrawColor(226, 232, 240); 
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y, 170, 28, 2, 2, "DF");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(13);
    let colorRGB = [15, 118, 110];
    if (result.severityLabel === 'None') colorRGB = [16, 185, 129];
    else if (result.severityLabel === 'Mild') colorRGB = [34, 197, 94];
    else if (result.severityLabel === 'Moderate') colorRGB = [245, 158, 11];
    else if (result.severityLabel === 'Moderately Severe') colorRGB = [249, 115, 22];
    else if (result.severityLabel === 'Severe') colorRGB = [244, 63, 94];

    doc.setTextColor(colorRGB[0], colorRGB[1], colorRGB[2]);
    doc.text(`${result.severityLabel.toUpperCase()} SEVERITY RANGE`, margin + 6, y + 8);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105); 
    doc.text(`${result.severityLabel} Depressive symptoms identified on PHQ-9 metric.`, margin + 6, y + 13);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`Total Score: ${result.numericScore} / 27`, margin + 6, y + 21);

    y += 38;

    // Section 2: Clinical Guideline
    const getSeverityGuideline = (label: string) => {
      switch (label) {
        case 'None':
          return "No active clinical protocols are suggested. Maintain your standard healthy routines, practice proactive sleep patterns, and re-assess if you experience extra life stressors.";
        case 'Mild':
          return "Indicates minor mood symptoms. We recommend incorporating light physical exercise, focusing on mindfulness, discussing feelings with supportive friends, and taking routine screen checks.";
        case 'Moderate':
          return "Represents intermediate symptoms. It may be highly beneficial to consult with a mental health professional or counselor. Exploring conversational support or Cognitive Behavioral Therapy (CBT) techniques can provide excellent guidance.";
        case 'Moderately Severe':
          return "Indicates significant symptom patterns. We highly suggest scheduling a consultation with a licensed psychotherapist, counselor, or general health doctor to review customized support strategies.";
        case 'Severe':
        default:
          return "Indicates substantial mood symptoms. Standard medical consensus strongly advises scheduling a diagnostic interview or professional check-up with an authorized clinical specialist immediately to build a supportive care outline.";
      }
    };

    const docGuideline = getSeverityGuideline(result.severityLabel);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("SUPPORTIVE RECOMMENDATIONS & GUIDELINES", margin, y);
    y += 6;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85); 
    const textLines = doc.splitTextToSize(docGuideline, 170);
    doc.text(textLines, margin, y);
    y += (textLines.length * 4.8) + 10;

    // Section 3: Symptom breakdown listing
    if (inputs) {
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("DETAILED SYMPTOM RESPONSE ANALYSIS", margin, y);
      y += 6;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);

      const symptomsMeta = [
        { key: 'q1_anhedonia', name: 'Interest Levels' },
        { key: 'q2_depressed_mood', name: 'Overall Mood' },
        { key: 'q3_sleep_issue', name: 'Sleep Patterns' },
        { key: 'q4_fatigue', name: 'Energy Level' },
        { key: 'q5_appetite_issue', name: 'Appetite Habits' },
        { key: 'q6_self_worth', name: 'Self Relationship' },
        { key: 'q7_concentration', name: 'Concentration' },
        { key: 'q8_psychomotor', name: 'Motor Velocity' },
        { key: 'q9_suicide_ideation', name: 'Critical Thoughts' },
      ];

      const getResponseText = (score: number) => {
        switch (score) {
          case 0: return "Not at all";
          case 1: return "Several days";
          case 2: return "More than half the days";
          case 3: return "Nearly every day";
          default: return "Unanswered";
        }
      };

      symptomsMeta.forEach((sym) => {
        const scoreVal = inputs[sym.key as keyof AssessmentInput] ?? 0;
        const scoreLabel = getResponseText(scoreVal);
        
        if (y < 250) {
          doc.setFont("Helvetica", "bold");
          doc.text(`• ${sym.name}:`, margin + 2, y);
          doc.setFont("Helvetica", "normal");
          doc.text(` ${scoreLabel}  (${scoreVal} pts)`, margin + 45, y);
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
    const wellnessInfo = "Prioritizing physical rest, positive dialogue, and keeping active journals helps enhance mental well-being. For professional mental health support services in Nigeria, call MANI on 0809 111 6264 or contact local care clinics.";
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

  // Generate an elegant, beautifully formatted SVG timeline trend graph
  const renderTrendChart = () => {
    if (chronologicalHistory.length < 2) {
      return (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center max-w-lg mx-auto mb-8">
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 font-sans">
            Symptom Progress Chart
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed font-sans">
            Complete at least two (2) mood screen check-ins to unlock your well-being journey line chart.
          </p>
        </div>
      );
    }

    const width = 600;
    const height = 180;
    const paddingLeft = 40;
    const paddingRight = 30;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const maxScore = 27;

    const getY = (score: number) => {
      return height - paddingBottom - (score / maxScore) * chartHeight;
    };

    const getX = (index: number) => {
      if (chronologicalHistory.length <= 1) return paddingLeft + chartWidth / 2;
      return paddingLeft + (index / (chronologicalHistory.length - 1)) * chartWidth;
    };

    const thresholdGuidelines = [
      { val: 4, label: "None" },
      { val: 9, label: "Mild" },
      { val: 14, label: "Mod" },
      { val: 19, label: "Sev" }
    ];

    let scoreLinePath = '';
    chronologicalHistory.forEach((item, index) => {
      const x = getX(index);
      const y = getY(item.result.numericScore); // Using clear standard numericScore directly instead of obscure fuzzyScore!
      if (index === 0) {
        scoreLinePath = `M ${x} ${y}`;
      } else {
        scoreLinePath += ` L ${x} ${y}`;
      }
    });

    return (
      <div className="border border-oasis-straw bg-white p-4 md:p-6 rounded-2xl shadow-xs mb-8 overflow-x-auto">
        <h4 className="font-serif font-extrabold text-[#111613] text-sm mb-4 flex items-center gap-2">
          <LineChart className="w-5 h-5 text-oasis-clay" />
          Symptom Score Over Time
        </h4>

        <div className="min-w-[500px] w-full relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none font-sans" aria-hidden="true">
            {/* Background Grid Rules */}
            <line x1={paddingLeft} y1={getY(0)} x2={width - paddingRight} y2={getY(0)} stroke="#E5DFCE" strokeWidth="1.5" />
            <line x1={paddingLeft} y1={getY(27)} x2={width - paddingRight} y2={getY(27)} stroke="#F1ECE0" strokeWidth="1" strokeDasharray="3 3" />
            
            {/* Guide markers */}
            {thresholdGuidelines.map((guideline, gridIdx) => (
              <g key={gridIdx}>
                <line
                  x1={paddingLeft}
                  y1={getY(guideline.val)}
                  x2={width - paddingRight}
                  y2={getY(guideline.val)}
                  stroke="#F1ECE0"
                  strokeWidth="0.8"
                  strokeDasharray="4 2"
                />
                <text
                  x={width - paddingRight + 4}
                  y={getY(guideline.val) + 3}
                  fontFamily="sans-serif"
                  fontSize="7"
                  fill="#8E9791"
                  textAnchor="start"
                >
                  {guideline.val} ({guideline.label})
                </text>
              </g>
            ))}

            {/* Score trend line */}
            <path
              d={scoreLinePath}
              fill="none"
              stroke="#4E6E5D"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Trajectory Nodes */}
            {chronologicalHistory.map((item, index) => {
              const x = getX(index);
              const y = getY(item.result.numericScore);
              return (
                <g key={item.id} className="cursor-pointer group">
                  <circle
                    cx={x}
                    cy={y}
                    r="4.5"
                    fill="#CD6040"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  {/* Score Label Tooltip */}
                  <text
                    x={x}
                    y={y - 10}
                    fontFamily="sans-serif"
                    fontSize="8"
                    fontWeight="bold"
                    fill="#1C201E"
                    textAnchor="middle"
                    className="opacity-100 font-sans"
                  >
                    {item.result.numericScore}
                  </text>
                </g>
              );
            })}

            {/* X-Axis dates labeling */}
            {chronologicalHistory.map((item, index) => {
              const x = getX(index);
              const dateText = new Date(item.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric'
              });
              return (
                <text
                  key={`lbl-${item.id}`}
                  x={x}
                  y={height - 8}
                  fontFamily="sans-serif"
                  fontSize="7.5"
                  fill="#8E9791"
                  textAnchor="middle"
                >
                  {dateText}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  const handleExportJSON = () => {
    const rawData = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([rawData], { type: 'application/json' });
    const blobURL = URL.createObjectURL(dataBlob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = blobURL;
    downloadAnchor.download = `SymptomScribe_History_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(blobURL);
  };

  return (
    <div className="space-y-6" id="assessment-history-sheet">
      
      {/* Editorial History section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-oasis-straw pb-4">
        <div>
          <span className="bg-[#FAF6ED] text-oasis-clay text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md border border-oasis-straw font-sans">
            Timeline Records
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-oasis-ink mt-1.5 font-serif">
            Your Tracking History
          </h2>
        </div>

        {history.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportJSON}
              className="text-xs font-sans bg-white hover:bg-oasis-sand text-oasis-sage border border-oasis-straw px-3 py-2 rounded-xl flex items-center gap-1.5 font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-oasis-clay" />
              Download backup (.json)
            </button>
            
            <button
              onClick={onClearAll}
              className="text-xs font-sans bg-[#FDF3F0] text-oasis-clay hover:bg-orange-100/50 border border-[#F7DFD6] px-3 py-2 rounded-xl flex items-center gap-1.5 font-bold transition-colors shadow-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-oasis-clay" />
              Clear History
            </button>
          </div>
        )}
      </div>

      {/* Trajectory plot projection */}
      {history.length > 0 && renderTrendChart()}

      {/* Assessment records layout */}
      {history.length === 0 ? (
        <div className="border border-oasis-straw rounded-3xl p-12 text-center bg-white shadow-xs" id="empty-state">
          <Calendar className="w-12 h-12 mx-auto text-oasis-straw mb-3 animate-bounce" />
          <h3 className="font-extrabold text-lg text-oasis-ink mb-1 font-serif">
            No history yet
          </h3>
          <p className="text-sm text-oasis-sage mb-6 max-w-sm mx-auto leading-relaxed font-sans">
            You don't have any saved symptom records yet. Take a quick self-evaluation to map your baseline!
          </p>
          <button
            onClick={onNewAssessment}
            className="px-6 py-3 bg-oasis-forest hover:bg-oasis-ink text-white font-sans font-bold rounded-xl text-xs uppercase tracking-wide transition-colors shadow-xs cursor-pointer"
          >
            Start Check-in
          </button>
        </div>
      ) : (
        <div className="space-y-4" id="history-dossiers-list">
          <div className="flex justify-between items-center text-xs font-sans uppercase tracking-wider text-oasis-sage font-bold">
            <span>Saved Records ({history.length})</span>
            <span>Stored Locally</span>
          </div>

          <div className="divide-y divide-oasis-straw border border-oasis-straw bg-white rounded-2xl shadow-xs overflow-hidden">
            {history.map((item) => {
              
              const getBadgeColors = (label: string) => {
                switch (label) {
                  case 'None': return 'text-oasis-forest bg-[#EFF5F1] border-[#DCEAE1]';
                  case 'Mild': return 'text-[#2e4d3e] bg-[#EFF5F1] border-[#cdeae1]';
                  case 'Moderate': return 'text-[#8c7b50] bg-[#FAF6ED] border-[#e8e2d2]';
                  case 'Moderately Severe': return 'text-oasis-clay bg-[#FAF6ED]/80 border-[#f1ece0]';
                  case 'Severe': default: return 'text-rose-950 bg-[#FDF3F0] border-[#f7dfd6]';
                }
              };

              const badgeStyle = getBadgeColors(item.result.severityLabel);

              return (
                <div
                  key={item.id}
                  className="p-5 hover:bg-oasis-sand/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-grow">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs text-oasis-sage bg-[#FAF6ED] px-2.5 py-1 rounded-md border border-oasis-straw font-bold">
                        {new Date(item.timestamp).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </span>

                      <span className={`text-[10px] font-sans tracking-widest font-bold px-2.5 py-1 uppercase rounded-md border ${badgeStyle}`}>
                        {item.result.severityLabel} Severity
                      </span>
                    </div>

                    <div className="text-xs font-sans text-oasis-sage">
                      PHQ-9 Cumulative Score: <strong className="font-extrabold text-oasis-ink">{item.result.numericScore} / 27</strong>
                    </div>

                    {item.notes ? (
                      <p className="text-xs text-[#2c302d] line-clamp-1 italic font-sans pl-3 border-l-2 border-oasis-clay mt-2 bg-[#FAF6ED]/50 py-1 pr-2 rounded">
                        &ldquo;{item.notes}&rdquo;
                      </p>
                    ) : null}
                  </div>

                  {/* Commands panel */}
                  <div className="flex sm:flex-row md:flex-row items-center gap-2 shrink-0 border-t md:border-t-0 border-oasis-straw pt-3 md:pt-0">
                    <button
                      onClick={() => onSelectEntry(item)}
                      className="text-xs font-sans border border-[#FAF6ED] px-3.5 py-2 hover:bg-oasis-forest hover:text-[#FAF8F2] hover:border-oasis-forest transition-colors bg-white text-oasis-sage text-center font-bold rounded-xl shadow-xs cursor-pointer whitespace-nowrap"
                    >
                      View Dashboard Report
                    </button>

                    <button
                      onClick={() => downloadReportPDF(item)}
                      className="text-xs font-sans border border-oasis-straw p-2 hover:bg-oasis-sand text-oasis-sage transition-all bg-white rounded-xl shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5 text-oasis-clay" />
                      <span className="hidden sm:inline">PDF</span>
                    </button>
                    
                    <button
                      onClick={() => onDeleteEntry(item.id)}
                      className="text-xs font-sans text-oasis-clay hover:opacity-80 p-2 rounded-xl border border-transparent flex items-center justify-center font-medium cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
