import mongoose, { Schema } from "mongoose";
import { IResume } from "@/types/resume.types";

const personalInfoSchema = new Schema(
  {
    fullname: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    mobile: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    github: {
      type: String,
      default: "",
      trim: true,
    },

    linkedIn: {
      type: String,
      default: "",
      trim: true,
    },

    portfolio: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false },
);

const workExperienceSchema = new Schema(
  {
    company: {
      type: String,
      default: "",
      trim: true,
    },

    position: {
      type: String,
      default: "",
      trim: true,
    },

    startDate: {
      type: String,
      default: "",
    },

    endDate: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const projectSchema = new Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    githubUrl: {
      type: String,
      default: "",
      trim: true,
    },

    liveUrl: {
      type: String,
      default: "",
      trim: true,
    },

    techStack: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const educationSchema = new Schema(
  {
    institute: {
      type: String,
      default: "",
      trim: true,
    },

    degree: {
      type: String,
      default: "",
      trim: true,
    },

    startDate: {
      type: String,
      default: "",
    },

    endDate: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const resumeSchema = new Schema<IResume>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: "",
      trim: true,
    },

    summary: {
      type: String,
      default: "",
    },

    personalInfo: {
      type: personalInfoSchema,
      default: () => ({}),
    },

    workExperience: {
      type: [workExperienceSchema],
      default: [],
    },

    projects: {
      type: [projectSchema],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    education: {
      type: [educationSchema],
      default: [],
    },

    certifications: {
      type: [String],
      default: [],
    },
  },

  {
    timestamps: true,
  },
);

const ResumeModel =
  mongoose.models.Resume || mongoose.model<IResume>("Resume", resumeSchema);

export default ResumeModel;
