import { NextRequest, NextResponse } from "next/server";

import { generateAiContent } from "@/lib/gemini";
import { parseAiJson } from "@/lib/ai/ai-json";
import { resumeReviewPrompt } from "@/lib/ai/prompts";

import { ResumeReviewBody, ResumeReviewResult } from "@/types/ai.types";

import { ApiResponse } from "@/types/api.types";

export async function POST(req: NextRequest) {
  try {
    const body: ResumeReviewBody = await req.json();

    const { resumeText, targetRole, jobDescription } = body;

    if (!resumeText?.trim()) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Resume text is required",
        },
        { status: 400 },
      );
    }

    const prompt = resumeReviewPrompt({
      resumeText,
      targetRole,
      jobDescription,
    });

    const response = await generateAiContent(prompt);

    const result = parseAiJson<ResumeReviewResult>(response);

    if (
      !result.overallAssessment ||
      !Array.isArray(result.strengths) ||
      !Array.isArray(result.weaknesses) ||
      !Array.isArray(result.recommendations)
    ) {
      throw new Error("Invalid resume review response");
    }

    return NextResponse.json<ApiResponse<ResumeReviewResult>>(
      {
        success: true,
        message: "Resume review completed successfully",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Resume review error:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to review resume",
      },
      { status: 500 },
    );
  }
}
