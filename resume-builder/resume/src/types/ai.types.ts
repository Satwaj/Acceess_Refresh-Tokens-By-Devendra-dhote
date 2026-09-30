/* =========================================================
   GENERATE SUMMARY
========================================================= */

export interface GenerateSummaryBody {
  experienceLevel: string;
  skills: string[];
  jobTitle: string;
}

export interface GenerateSummaryResult {
  summary: string;
}

/* =========================================================
   GENERATE SKILLS
========================================================= */

export interface GenerateSkillsBody {
  experienceLevel: string;
  jobTitle: string;
}

export interface GenerateSkillsResult {
  skills: string[];
}

/* =========================================================
   GENERATE PROJECT DESCRIPTION
========================================================= */

export interface GenerateProjectDescriptionBody {
  experienceLevel: string;
  jobTitle: string;
  techStack: string[];
}

export interface GenerateProjectDescriptionResult {
  description: string;
}

/* =========================================================
   GENERATE EXPERIENCE DESCRIPTION
========================================================= */

export interface GenerateExperienceDescriptionBody {
  experienceLevel: string;
  techStack: string[];
  yearsOfExperience: number;
  jobRole: string;
}

export interface GenerateExperienceDescriptionResult {
  description: string;
}

/* =========================================================
   IMPROVE CONTENT
========================================================= */

export interface ImproveContentBody {
  content: string;
}

export interface ImproveContentResult {
  improvedContent: string;
  changes: string[];
}

/* =========================================================
   ATS SCORE
========================================================= */

export interface AtsScoreBody {
  resumeId?: string;
  resumeText?: string;
  targetRole?: string;
  jobDescription?: string;
}

/* Individual ATS category */

export interface AtsCategory {
  score: number;
  maxScore: number;
  issues: string[];
}

/* Keyword category has extra information */

export interface AtsKeywordCategory extends AtsCategory {
  matchedKeywords: string[];
  missingKeywords: string[];
}

/* All ATS categories */

export interface AtsCategories {
  keywordOptimization: AtsKeywordCategory;

  professionalSummary: AtsCategory;

  workExperience: AtsCategory;

  skills: AtsCategory;

  projects: AtsCategory;

  readability: AtsCategory;

  actionLanguage: AtsCategory;
}

/* Raw result returned by AI */

export interface AtsAiResult {
  categories: AtsCategories;

  strengths: string[];

  improvements: string[];

  recommendations: string[];
}

/* Final result returned by our API */

export interface AtsResult {
  atsScore: number;

  categories: AtsCategories;

  strengths: string[];

  improvements: string[];

  recommendations: string[];

  analysisId?: string;
}

/* =========================================================
   RESUME REVIEW
========================================================= */

export interface ResumeReviewBody {
  resumeText: string;
  targetRole?: string;
  jobDescription?: string;
}

export interface ResumeReviewResult {
  overallAssessment: string;

  strengths: string[];

  weaknesses: string[];

  recommendations: string[];
}

/* =========================================================
   RESUME ROASTER
========================================================= */

export interface ResumeRoastBody {
  resumeText: string;
  targetRole?: string;
  tone?: "light" | "funny" | "brutal";
}

export interface ResumeRoastResult {
  roast: string[];

  seriousFixes: string[];
}

/* =========================================================
   INTERVIEW QUESTIONS
========================================================= */

export interface ResumeInterviewBody {
  resumeText: string;

  targetRole?: string;

  jobDescription?: string;

  questionCount?: number;
}

export interface ResumeInterviewQuestion {
  question: string;

  category: "technical" | "behavioral" | "project" | "experience" | "general";

  whyAsked: string;
}

export interface ResumeInterviewResult {
  questions: ResumeInterviewQuestion[];
}
