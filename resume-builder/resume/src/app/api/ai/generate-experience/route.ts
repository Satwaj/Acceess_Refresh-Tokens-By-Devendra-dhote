import { NextRequest, NextResponse } from "next/server";

import { generateAiContent } from "@/lib/gemini";
import { parseAiJson } from "@/lib/ai/ai-json";
import { generateExperiencePrompt } from "@/lib/ai/prompts";

import {
  GenerateExperienceDescriptionBody,
  GenerateExperienceDescriptionResult,
} from "@/types/ai.types";

import { ApiResponse } from "@/types/api.types";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateExperienceDescriptionBody = await req.json();

    const { experienceLevel, techStack, yearsOfExperience, jobRole } = body;

    // Validate required fields
    if (!experienceLevel || !jobRole) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Experience level and job role are required",
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(techStack)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "techStack must be an array",
        },
        { status: 400 },
      );
    }

    if (typeof yearsOfExperience !== "number" || yearsOfExperience < 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "yearsOfExperience must be a valid number",
        },
        { status: 400 },
      );
    }

    // Generate prompt
    const prompt = generateExperiencePrompt({
      experienceLevel,
      techStack,
      yearsOfExperience,
      jobRole,
    });

    // Generate AI response
    const response = await generateAiContent(prompt);

    // Parse JSON returned by AI
    const result = parseAiJson<GenerateExperienceDescriptionResult>(response);

    // Validate AI result
    if (!result.description?.trim()) {
      throw new Error("AI did not generate experience description");
    }

    return NextResponse.json<ApiResponse<GenerateExperienceDescriptionResult>>(
      {
        success: true,
        message: "Experience description generated successfully",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Generate experience error:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate experience description",
      },
      { status: 500 },
    );
  }
}
