import { NextRequest, NextResponse } from "next/server";

import { generateAiContent } from "@/lib/gemini";
import { parseAiJson } from "@/lib/ai/ai-json";
import { atsAnalysisPrompt } from "@/lib/ai/prompts";

import ResumeModel from "@/models/Resume.model";
import ResumeAnalysisModel from "@/models/ResumeAnalysis.model";

import { AtsAiResult, AtsScoreBody, AtsResult } from "@/types/ai.types";

import { ApiResponse } from "@/types/api.types";
import mongoose from "mongoose";

function calculateAtsScore(analysis: AtsAiResult): number {
  const categories = analysis.categories;

  return (
    categories.keywordOptimization.score +
    categories.professionalSummary.score +
    categories.workExperience.score +
    categories.skills.score +
    categories.projects.score +
    categories.readability.score +
    categories.actionLanguage.score
  );
}

function validateAtsResult(result: AtsAiResult): void {
  if (!result || !result.categories) {
    throw new Error("Invalid ATS response");
  }

  const categories = result.categories;

  const checks = [
    ["keywordOptimization", 20],
    ["professionalSummary", 10],
    ["workExperience", 20],
    ["skills", 15],
    ["projects", 10],
    ["readability", 10],
    ["actionLanguage", 15],
  ] as const;

  for (const [name, maxScore] of checks) {
    const category = categories[name];

    if (!category) {
      throw new Error(`Missing ATS category: ${name}`);
    }

    if (
      typeof category.score !== "number" ||
      category.score < 0 ||
      category.score > maxScore
    ) {
      throw new Error(`Invalid score for ${name}`);
    }

    if (!Array.isArray(category.issues)) {
      throw new Error(`Invalid issues for ${name}`);
    }
  }

  if (
    !Array.isArray(result.strengths) ||
    !Array.isArray(result.improvements) ||
    !Array.isArray(result.recommendations)
  ) {
    throw new Error("Invalid ATS arrays");
  }
}

function resumeToText(resume: any): string {
  return `
Title:
${resume.title || ""}

Professional Summary:
${resume.summary || ""}

Personal Information:
Name: ${resume.personalInfo?.fullname || ""}
Location: ${resume.personalInfo?.location || ""}

Work Experience:
${
  resume.workExperience
    ?.map(
      (experience: any) => `
Company: ${experience.company}
Position: ${experience.position}
Start Date: ${experience.startDate}
End Date: ${experience.endDate}
Description:
${experience.description}
`,
    )
    .join("\n") || "None"
}

Projects:
${
  resume.projects
    ?.map(
      (project: any) => `
Project: ${project.title}
Description:
${project.description}
Tech Stack:
${project.techStack?.join(", ") || ""}
`,
    )
    .join("\n") || "None"
}

Skills:
${resume.skills?.join(", ") || "None"}

Education:
${
  resume.education
    ?.map(
      (education: any) => `
Institute: ${education.institute}
Degree: ${education.degree}
Start Date: ${education.startDate}
End Date: ${education.endDate}
`,
    )
    .join("\n") || "None"
}

Certifications:
${resume.certifications?.join(", ") || "None"}
`;
}

export async function POST(req: NextRequest) {
  try {
    const body: AtsScoreBody = await req.json();

    const { resumeId, resumeText, targetRole, jobDescription } = body;

    if (!resumeId && !resumeText) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "resumeId or resumeText is required",
        },
        { status: 400 },
      );
    }

    let finalResumeText = resumeText || "";

    /*
      If resumeId is provided, use the saved Resume as
      the source of truth.
    */
    if (resumeId) {
      if (!mongoose.Types.ObjectId.isValid(resumeId)) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Invalid resumeId",
          },
          { status: 400 },
        );
      }

      const resume = await ResumeModel.findById(resumeId).lean();

      if (!resume) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Resume not found",
          },
          { status: 404 },
        );
      }

      finalResumeText = resumeToText(resume);
    }

    if (!finalResumeText.trim()) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Resume content is empty",
        },
        { status: 400 },
      );
    }

    const prompt = atsAnalysisPrompt({
      resumeText: finalResumeText,
      targetRole,
      jobDescription,
    });

    const aiResponse = await generateAiContent(prompt);

    const analysis = parseAiJson<AtsAiResult>(aiResponse);

    validateAtsResult(analysis);

    const atsScore = calculateAtsScore(analysis);

    let analysisId: string | undefined;

    /*
      Save analysis when a resumeId exists.
    */
    if (resumeId) {
      const savedAnalysis = await ResumeAnalysisModel.create({
        resume_id: resumeId,
        targetRole: targetRole || "",
        jobDescription: jobDescription || "",
        atsScore,
        categories: analysis.categories,
        strengths: analysis.strengths,
        improvements: analysis.improvements,
        recommendations: analysis.recommendations,
      });

      analysisId = savedAnalysis._id.toString();
    }

    const result: AtsResult = {
      ...analysis,
      atsScore,
      analysisId,
    };

    return NextResponse.json<ApiResponse<AtsResult>>(
      {
        success: true,
        message: "ATS analysis created successfully",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("ATS analysis error:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while analyzing the resume",
      },
      { status: 500 },
    );
  }
}
