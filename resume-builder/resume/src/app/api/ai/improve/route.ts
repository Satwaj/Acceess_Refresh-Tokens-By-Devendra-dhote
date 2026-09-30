import { NextRequest, NextResponse } from "next/server";

import { generateAiContent } from "@/lib/gemini";
import { parseAiJson } from "@/lib/ai/ai-json";
import { improveContentPrompt } from "@/lib/ai/prompts";

import { ImproveContentBody, ImproveContentResult } from "@/types/ai.types";

import { ApiResponse } from "@/types/api.types";

export async function POST(req: NextRequest) {
  try {
    const body: ImproveContentBody = await req.json();

    const { content, section, targetRole, jobDescription } = body;

    if (!content?.trim()) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Content is required",
        },
        { status: 400 },
      );
    }

    const prompt = improveContentPrompt({
      content,
      section,
      targetRole,
      jobDescription,
    });

    const response = await generateAiContent(prompt);

    const result = parseAiJson<ImproveContentResult>(response);

    if (!result.improvedContent?.trim()) {
      throw new Error("AI did not improve the content");
    }

    return NextResponse.json<ApiResponse<ImproveContentResult>>(
      {
        success: true,
        message: "Content improved successfully",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Improve content error:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to improve content",
      },
      { status: 500 },
    );
  }
}
