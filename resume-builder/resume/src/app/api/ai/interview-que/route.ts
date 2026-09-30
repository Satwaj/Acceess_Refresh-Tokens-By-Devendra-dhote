import { NextRequest, NextResponse } from "next/server";

import { generateAiContent } from "@/lib/gemini";
import { parseAiJson } from "@/lib/ai/ai-json";
import { resumeInterviewPrompt } from "@/lib/ai/prompts";

import { ResumeInterviewBody, ResumeInterviewResult } from "@/types/ai.types";

import { ApiResponse } from "@/types/api.types";

export async function POST(req: NextRequest) {
  try {
    const body: ResumeInterviewBody = await req.json();

    const { resumeText, targetRole, jobDescription, questionCount = 10 } = body;

    if (!resumeText?.trim()) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Resume text is required",
        },
        { status: 400 },
      );
    }

    const safeQuestionCount = Math.min(
      Math.max(Number(questionCount) || 10, 5),
      20,
    );

    const prompt = resumeInterviewPrompt({
      resumeText,
      targetRole,
      jobDescription,
      questionCount: safeQuestionCount,
    });

    const response = await generateAiContent(prompt);

    const result = parseAiJson<ResumeInterviewResult>(response);

    if (!Array.isArray(result.questions)) {
      throw new Error("Invalid interview questions response");
    }

    return NextResponse.json<ApiResponse<ResumeInterviewResult>>(
      {
        success: true,
        message: "Interview questions generated successfully",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Interview questions error:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to generate interview questions",
      },
      { status: 500 },
    );
  }
}
