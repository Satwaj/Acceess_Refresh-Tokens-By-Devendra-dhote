import { NextRequest, NextResponse } from "next/server";

import { generateAiContent } from "@/lib/gemini";
import { parseAiJson } from "@/lib/ai/ai-json";
import { resumeRoastPrompt } from "@/lib/ai/prompts";

import { ResumeRoastBody, ResumeRoastResult } from "@/types/ai.types";

import { ApiResponse } from "@/types/api.types";

export async function POST(req: NextRequest) {
  try {
    const body: ResumeRoastBody = await req.json();

    const { resumeText, targetRole, tone = "funny" } = body;

    if (!resumeText?.trim()) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Resume text is required",
        },
        { status: 400 },
      );
    }

    const prompt = resumeRoastPrompt({
      resumeText,
      targetRole,
      tone,
    });

    const response = await generateAiContent(prompt);

    const result = parseAiJson<ResumeRoastResult>(response);

    if (!Array.isArray(result.roast) || !Array.isArray(result.seriousFixes)) {
      throw new Error("Invalid roast response");
    }

    return NextResponse.json<ApiResponse<ResumeRoastResult>>(
      {
        success: true,
        message: "Resume roast generated successfully",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Resume roast error:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to roast resume",
      },
      { status: 500 },
    );
  }
}
