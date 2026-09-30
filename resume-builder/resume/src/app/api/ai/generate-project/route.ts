import { NextRequest, NextResponse } from "next/server";

import { generateAiContent } from "@/lib/gemini";
import { parseAiJson } from "@/lib/ai/ai-json";
import { generateProjectPrompt } from "@/lib/ai/prompts";

import { GenerateProjectBody, GenerateProjectResult } from "@/types/ai.types";

import { ApiResponse } from "@/types/api.types";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateProjectBody = await req.json();

    const { title, description, techStack, githubUrl, liveUrl, targetRole } =
      body;

    if (!title) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Project title is required",
        },
        { status: 400 },
      );
    }

    const prompt = generateProjectPrompt({
      title,
      description,
      techStack,
      githubUrl,
      liveUrl,
      targetRole,
    });

    const response = await generateAiContent(prompt);

    const result = parseAiJson<GenerateProjectResult>(response);

    if (!result.description?.trim()) {
      throw new Error("AI did not generate project description");
    }

    return NextResponse.json<ApiResponse<GenerateProjectResult>>(
      {
        success: true,
        message: "Project description generated successfully",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Generate project error:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to generate project description",
      },
      { status: 500 },
    );
  }
}
