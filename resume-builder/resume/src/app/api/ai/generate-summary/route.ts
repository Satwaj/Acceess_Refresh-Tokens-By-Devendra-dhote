import { NextRequest, NextResponse } from "next/server";

import { generateAiContent } from "@/lib/gemini";
import { parseAiJson } from "@/lib/ai/ai-json";
import { generateSummaryPrompt } from "@/lib/ai/prompts";

import { GenerateSummaryBody, GenerateSummaryResult } from "@/types/ai.types";

import { ApiResponse } from "@/types/api.types";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateSummaryBody = await req.json();

    const { resumeText, targetRole, experienceLevel, skills } = body;

    if (!resumeText && !targetRole && !skills?.length) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Resume information is required",
        },
        { status: 400 },
      );
    }

    const prompt = generateSummaryPrompt({
      resumeText,
      targetRole,
      experienceLevel,
      skills,
    });

    const response = await generateAiContent(prompt);

    const result = parseAiJson<GenerateSummaryResult>(response);

    if (!result.summary?.trim()) {
      throw new Error("AI did not generate a summary");
    }

    return NextResponse.json<ApiResponse<GenerateSummaryResult>>(
      {
        success: true,
        message: "Summary generated successfully",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Generate summary error:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to generate summary",
      },
      { status: 500 },
    );
  }
}
