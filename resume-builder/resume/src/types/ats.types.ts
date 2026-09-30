import { Types } from "mongoose";

export interface IAtsCategory {
  score: number;
  maxScore: number;
  issues: string[];
}

export interface IAtsKeywordCategory extends IAtsCategory {
  matchedKeywords: string[];
  missingKeywords: string[];
}

export interface IAtsCategories {
  keywordOptimization: IAtsKeywordCategory;

  professionalSummary: IAtsCategory;

  workExperience: IAtsCategory;

  skills: IAtsCategory;

  projects: IAtsCategory;

  readability: IAtsCategory;

  actionLanguage: IAtsCategory;
}

export interface IAtsAnalysis {
  _id?: Types.ObjectId;

  resume_id: Types.ObjectId;

  targetRole?: string;

  jobDescription?: string;

  atsScore: number;

  categories: IAtsCategories;

  strengths: string[];

  improvements: string[];

  recommendations: string[];

  createdAt?: Date;

  updatedAt?: Date;
}
