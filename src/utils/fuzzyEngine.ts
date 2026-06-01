/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AssessmentInput, AssessmentResult, RuleOutput } from '../types';

/**
 * ============================================================================
 * INPUT MEMBERSHIP FUNCTIONS (PHQ-9 ordinal range 0-3 mapped to continuous fuzzy sets)
 * ============================================================================
 * 
 * We fuzzify each of the 9 symptom items into 'Low', 'Medium', and 'High' sets.
 * Although discrete selections are integers {0, 1, 2, 3}, intermediate fuzzy math
 * supports fractional symptoms and ensures continuous overlapping profiles.
 * 
 * 1. Low Symptom Severity Profile:
 *    - Full membership at 0 (Not at all), decreases linearly, fully 0 at 1.2 (Several days).
 */
export function lowMF(x: number): number {
  if (x <= 0) return 1.0;
  if (x >= 1.2) return 0.0;
  return (1.2 - x) / 1.2;
}

/**
 * 2. Medium Symptom Severity Profile:
 *    - Triangular membership centered at 1.5. Starts growing at 0.5, peaks at 1.5, decays to 0 at 2.5.
 */
export function mediumMF(x: number): number {
  if (x <= 0.5 || x >= 2.5) return 0.0;
  if (x < 1.5) {
    return (x - 0.5) / 1.0;
  } else {
    return (2.5 - x) / 1.0;
  }
}

/**
 * 3. High Symptom Severity Profile:
 *    - Starts growing at 1.8 (More than half the days), reaches full membership 1.0 at 3.0 (Nearly every day).
 */
export function highMF(x: number): number {
  if (x <= 1.8) return 0.0;
  if (x >= 3.0) return 1.0;
  return (x - 1.8) / 1.2;
}


/**
 * ============================================================================
 * OUTPUT MEMBERSHIP FUNCTIONS (PHQ-9 scale score range [0 - 27])
 * ============================================================================
 * 
 * The output represents continuous severity. The output fuzzy sets match the 
 * standard clinical diagnostic thresholds of the PHQ-9 scoring scale.
 * 
 * - None/Minimal: [0 - 4]
 * - Mild: [5 - 9]
 * - Moderate: [10 - 14]
 * - Moderately Severe: [15 - 19]
 * - Severe: [20 - 27]
 */
export function noneOutputMF(y: number): number {
  if (y <= 2) return 1.0;
  if (y >= 5) return 0.0;
  return (5 - y) / 3;
}

export function mildOutputMF(y: number): number {
  if (y <= 4 || y >= 10) return 0.0;
  if (y < 7) {
    return (y - 4) / 3;
  } else {
    return (10 - y) / 3;
  }
}

export function moderateOutputMF(y: number): number {
  if (y <= 9 || y >= 15) return 0.0;
  if (y < 12) {
    return (y - 9) / 3;
  } else {
    return (15 - y) / 3;
  }
}

export function moderatelySevereOutputMF(y: number): number {
  if (y <= 14 || y >= 20) return 0.0;
  if (y < 17) {
    return (y - 14) / 3;
  } else {
    return (20 - y) / 3;
  }
}

export function severeOutputMF(y: number): number {
  if (y <= 19) return 0.0;
  if (y >= 22) return 1.0;
  return (y - 19) / 3;
}


/**
 * ============================================================================
 * ASSESSMENT INPUT VECTOR MAPPING
 * ============================================================================
 * 
 * Maps raw form/JSON questionnaire inputs (0-3) to continuous fuzzy variables.
 */
export function assessmentToInputVector(formData: Record<string, number>): AssessmentInput {
  return {
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
}


/**
 * ============================================================================
 * FUZZY RULE EVALUATION & INFERENCE ENGINE
 * ============================================================================
 * 
 * Computes crisp outputs using 15 expert diagnostic rules combining 
 * cardinal DSM-5 criteria and secondary symptoms via Mamdani's Max-Min model.
 */
export function runFuzzyInference(inputs: AssessmentInput): AssessmentResult {
  // 1. Calculate the raw PHQ-9 summation score for clinical calibration.
  const numericScore = 
    inputs.q1_anhedonia +
    inputs.q2_depressed_mood +
    inputs.q3_sleep_issue +
    inputs.q4_fatigue +
    inputs.q5_appetite_issue +
    inputs.q6_self_worth +
    inputs.q7_concentration +
    inputs.q8_psychomotor +
    inputs.q9_suicide_ideation;

  // 2. Fuzzify inputs for lookup.
  const f = {
    q1: { l: lowMF(inputs.q1_anhedonia), m: mediumMF(inputs.q1_anhedonia), h: highMF(inputs.q1_anhedonia) },
    q2: { l: lowMF(inputs.q2_depressed_mood), m: mediumMF(inputs.q2_depressed_mood), h: highMF(inputs.q2_depressed_mood) },
    q3: { l: lowMF(inputs.q3_sleep_issue), m: mediumMF(inputs.q3_sleep_issue), h: highMF(inputs.q3_sleep_issue) },
    q4: { l: lowMF(inputs.q4_fatigue), m: mediumMF(inputs.q4_fatigue), h: highMF(inputs.q4_fatigue) },
    q5: { l: lowMF(inputs.q5_appetite_issue), m: mediumMF(inputs.q5_appetite_issue), h: highMF(inputs.q5_appetite_issue) },
    q6: { l: lowMF(inputs.q6_self_worth), m: mediumMF(inputs.q6_self_worth), h: highMF(inputs.q6_self_worth) },
    q7: { l: lowMF(inputs.q7_concentration), m: mediumMF(inputs.q7_concentration), h: highMF(inputs.q7_concentration) },
    q8: { l: lowMF(inputs.q8_psychomotor), m: mediumMF(inputs.q8_psychomotor), h: highMF(inputs.q8_psychomotor) },
    q9: { l: lowMF(inputs.q9_suicide_ideation), m: mediumMF(inputs.q9_suicide_ideation), h: highMF(inputs.q9_suicide_ideation) },
  };

  // 3. Define the 15 Diagnostic Rules & extract firing strengths using Min operator.
  const rulesList = [
    {
      id: 1,
      description: "If Anhedonia, Depressed Mood, and Suicide Ideation are all Low",
      strength: Math.min(f.q1.l, f.q2.l, f.q9.l),
      consequentClass: "None"
    },
    {
      id: 2,
      description: "If Anhedonia is Medium and Depressed Mood is Low",
      strength: Math.min(f.q1.m, f.q2.l),
      consequentClass: "Mild"
    },
    {
      id: 3,
      description: "If Self Worth and Fatigue are both Medium",
      strength: Math.min(f.q6.m, f.q4.m),
      consequentClass: "Mild"
    },
    {
      id: 4,
      description: "If Depressed Mood is Medium and Sleep Issue is Medium",
      strength: Math.min(f.q2.m, f.q3.m),
      consequentClass: "Mild"
    },
    {
      id: 5,
      description: "If Anhedonia is Medium and Depressed Mood is Medium",
      strength: Math.min(f.q1.m, f.q2.m),
      consequentClass: "Moderate"
    },
    {
      id: 6,
      description: "If Sleep Issue is High, Fatigue is High, and Concentration is Medium",
      strength: Math.min(f.q3.h, f.q4.h, f.q7.m),
      consequentClass: "Moderate"
    },
    {
      id: 7,
      description: "If Self Worth is High and Appetite Issue is Medium",
      strength: Math.min(f.q6.h, f.q5.m),
      consequentClass: "Moderate"
    },
    {
      id: 8,
      description: "If Psychomotor Agitation is High and Fatigue is High",
      strength: Math.min(f.q8.h, f.q4.h),
      consequentClass: "Moderate"
    },
    {
      id: 9,
      description: "If Depressed Mood is High, Anhedonia is Medium, and Self Worth is Medium",
      strength: Math.min(f.q2.h, f.q1.m, f.q6.m),
      consequentClass: "Moderately Severe"
    },
    {
      id: 10,
      description: "If Psychomotor Agitation is High and Suicide Ideation is Medium",
      strength: Math.min(f.q8.h, f.q9.m),
      consequentClass: "Moderately Severe"
    },
    {
      id: 11,
      description: "If Anhedonia is High, Depressed Mood is High, and Suicide Ideation is Low",
      strength: Math.min(f.q1.h, f.q2.h, f.q9.l),
      consequentClass: "Moderately Severe"
    },
    {
      id: 12,
      description: "If Suicide Ideation is High (Critical Patient Priority Escalation)",
      strength: f.q9.h,
      consequentClass: "Severe"
    },
    {
      id: 13,
      description: "If Anhedonia is High, Depressed Mood is High, and Self Worth is High",
      strength: Math.min(f.q1.h, f.q2.h, f.q6.h),
      consequentClass: "Severe"
    },
    {
      id: 14,
      description: "If Psychomotor Agitation is High, Concentration Issue is High, and Sleep Issue is High",
      strength: Math.min(f.q8.h, f.q7.h, f.q3.h),
      consequentClass: "Severe"
    },
    {
      id: 15,
      description: "If Depressed Mood is High, Fatigue is High, and Self Worth is High",
      strength: Math.min(f.q2.h, f.q4.h, f.q6.h),
      consequentClass: "Severe"
    }
  ];

  // Store details of active rules for clinical audit logs
  const ruleFirings: RuleOutput[] = rulesList.map(r => ({
    ruleId: r.id,
    description: r.description,
    firingStrength: Number(r.strength.toFixed(3)),
    consequentClass: r.consequentClass
  }));

  // Aggregated output profiles at height y using Max-min composition
  const evaluateAggregatedMF = (y: number): number => {
    let maxVal = 0;
    for (const rule of rulesList) {
      if (rule.strength <= 0) continue;
      
      let mfValue = 0;
      switch (rule.consequentClass) {
        case "None":
          mfValue = noneOutputMF(y);
          break;
        case "Mild":
          mfValue = mildOutputMF(y);
          break;
        case "Moderate":
          mfValue = moderateOutputMF(y);
          break;
        case "Moderately Severe":
          mfValue = moderatelySevereOutputMF(y);
          break;
        case "Severe":
          mfValue = severeOutputMF(y);
          break;
      }
      
      const clippedValue = Math.min(rule.strength, mfValue);
      if (clippedValue > maxVal) {
        maxVal = clippedValue;
      }
    }
    return maxVal;
  };

  // 4. Defuzzify using discretised Centroid method (step scale = 0.1)
  let weightedSum = 0;
  let membershipSum = 0;
  const step = 0.1;

  for (let y = 0; y <= 27.0; y += step) {
    const muAgg = evaluateAggregatedMF(y);
    weightedSum += y * muAgg * step;
    membershipSum += muAgg * step;
  }

  // Handle boundary edge cases where NO rules are activated (division by zero backup)
  let fuzzyScore = numericScore;
  if (membershipSum > 0.0001) {
    fuzzyScore = Number((weightedSum / membershipSum).toFixed(2));
  } else {
    // If rules are completely unexcited due to edge configurations, set directly to crisp representation
    fuzzyScore = numericScore;
  }

  // 5. Compute linguistic memberships of the final computed crisp fuzzyScore
  const noneMembership = Number(noneOutputMF(fuzzyScore).toFixed(3));
  const mildMembership = Number(mildOutputMF(fuzzyScore).toFixed(3));
  const moderateMembership = Number(moderateOutputMF(fuzzyScore).toFixed(3));
  const moderatelySevereMembership = Number(moderatelySevereOutputMF(fuzzyScore).toFixed(3));
  const severeMembership = Number(severeOutputMF(fuzzyScore).toFixed(3));

  // Determine winning linguistic severity category
  const memberships = [
    { label: "None" as const, value: noneMembership },
    { label: "Mild" as const, value: mildMembership },
    { label: "Moderate" as const, value: moderateMembership },
    { label: "Moderately Severe" as const, value: moderatelySevereMembership },
    { label: "Severe" as const, value: severeMembership },
  ];

  memberships.sort((a, b) => b.value - a.value);
  let severityLabel: 'None' | 'Mild' | 'Moderate' | 'Moderately Severe' | 'Severe' = memberships[0].label;

  // If supreme tie or all memberships are flat, fall back strictly to clinical PHQ-9 summation brackets
  if (memberships[0].value <= 0.01) {
    if (numericScore <= 4) severityLabel = 'None';
    else if (numericScore <= 9) severityLabel = 'Mild';
    else if (numericScore <= 14) severityLabel = 'Moderate';
    else if (numericScore <= 19) severityLabel = 'Moderately Severe';
    else severityLabel = 'Severe';
  }

  // 6. Calculate Fuzzy Confidence Rating
  // Calculated as the max output activation degree scaled to normal clinical expectancy, min limit capped at 50% for display readability
  const maxMembership = Math.max(noneMembership, mildMembership, moderateMembership, moderatelySevereMembership, severeMembership);
  const fuzzyConfidence = maxMembership > 0 
    ? Math.round(50 + (maxMembership * 50)) 
    : 100; // if direct translation, lock to 100% calibration

  return {
    severityLabel,
    numericScore,
    fuzzyScore,
    fuzzyConfidence,
    ruleFirings,
    classificationDetails: {
      noneMembership,
      mildMembership,
      moderateMembership,
      moderatelySevereMembership,
      severeMembership
    },
    timestamp: new Date().toISOString()
  };
}
