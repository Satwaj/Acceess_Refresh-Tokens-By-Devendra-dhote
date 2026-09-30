import mongoose, { Schema } from "mongoose";
import { IAtsAnalysis } from "@/types/ats.types";

const atsCategorySchema = new Schema(
  {
    score: {
      type: Number,
      required: true,
      min: 0,
    },

    maxScore: {
      type: Number,
      required: true,
      min: 0,
    },

    issues: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const keywordCategorySchema = new Schema(
  {
    score: {
      type: Number,
      required: true,
      min: 0,
    },

    maxScore: {
      type: Number,
      required: true,
    },

    issues: {
      type: [String],
      default: [],
    },

    matchedKeywords: {
      type: [String],
      default: [],
    },

    missingKeywords: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const atsCategoriesSchema = new Schema(
  {
    keywordOptimization: {
      type: keywordCategorySchema,
      required: true,
    },

    professionalSummary: {
      type: atsCategorySchema,
      required: true,
    },

    workExperience: {
      type: atsCategorySchema,
      required: true,
    },

    skills: {
      type: atsCategorySchema,
      required: true,
    },

    projects: {
      type: atsCategorySchema,
      required: true,
    },

    readability: {
      type: atsCategorySchema,
      required: true,
    },

    actionLanguage: {
      type: atsCategorySchema,
      required: true,
    },
  },
  { _id: false },
);

const resumeAnalysisSchema = new Schema<IAtsAnalysis>(
  {
    resume_id: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true,
    },

    targetRole: {
      type: String,
      default: "",
      trim: true,
    },

    jobDescription: {
      type: String,
      default: "",
    },

    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    categories: {
      type: atsCategoriesSchema,
      required: true,
    },

    strengths: {
      type: [String],
      default: [],
    },

    improvements: {
      type: [String],
      default: [],
    },

    recommendations: {
      type: [String],
      default: [],
    },
  },

  {
    timestamps: true,
  },
);

const ResumeAnalysisModel =
  mongoose.models.ResumeAnalysis ||
  mongoose.model<IAtsAnalysis>("ResumeAnalysis", resumeAnalysisSchema);

export default ResumeAnalysisModel;
