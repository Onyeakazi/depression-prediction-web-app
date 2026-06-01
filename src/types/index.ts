/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AssessmentInput {
  q1_anhedonia: number;      // Little interest or pleasure in doing things (0-3)
  q2_depressed_mood: number; // Feeling down, depressed, or hopeless (0-3)
  q3_sleep_issue: number;    // Trouble falling or staying asleep, or sleeping too much (0-3)
  q4_fatigue: number;        // Feeling tired or having little energy (0-3)
  q5_appetite_issue: number; // Poor appetite or overeating (0-3)
  q6_self_worth: number;     // Feeling bad about yourself (0-3)
  q7_concentration: number;  // Trouble concentrating on things (0-3)
  q8_psychomotor: number;    // Moving/speaking slowly, or too fidgety/restless (0-3)
  q9_suicide_ideation: number;// Thoughts that you would be better off dead or hurting yourself (0-3)
}

export interface RuleOutput {
  ruleId: number;
  description: string;
  firingStrength: number;
  consequentClass: string;
}

export interface AssessmentResult {
  severityLabel: 'None' | 'Mild' | 'Moderate' | 'Moderately Severe' | 'Severe';
  numericScore: number;       // Direct clinical sum (0 - 27)
  fuzzyScore: number;         // Defuzzified Centroid output (0.00 - 27.00)
  fuzzyConfidence: number;    // Relative certainty of rule firings (0 - 100%)
  ruleFirings: RuleOutput[];  // Active rules trace for clinical audit
  classificationDetails: {
    noneMembership: number;
    mildMembership: number;
    moderateMembership: number;
    moderatelySevereMembership: number;
    severeMembership: number;
  };
  timestamp: string;          // ISO Date
}

export interface AssessmentHistoryEntry {
  id: string;
  timestamp: string;
  inputs: AssessmentInput;
  result: AssessmentResult;
  notes?: string;             // Practitioner or personal journal annotation
}
