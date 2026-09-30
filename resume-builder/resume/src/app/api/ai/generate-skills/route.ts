import { NextRequest, NextResponse } from "next/server";

import { generateAiContent } from "@/lib/gemini";
import { parseAiJson } from "@/lib/ai/ai-json";
import { generateSkillsPrompt } from "@/lib/ai/prompts";

import { GenerateSkillsBody, GenerateSkillsResult } from "@/types/ai.types";

import { ApiResponse } from "@/types/api.types";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateSkillsBody = await req.json();

    const { resumeText, targetRole, jobDescription, currentSkills } = body;

    if (!resumeText && !targetRole && !currentSkills?.length) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Resume information is required",
        },
        { status: 400 },
      );
    }

    const prompt = generateSkillsPrompt({
      resumeText,
      targetRole,
      jobDescription,
      currentSkills,
    });

    const response = await generateAiContent(prompt);

    const result = parseAiJson<GenerateSkillsResult>(response);

    if (!Array.isArray(result.skills)) {
      throw new Error("Invalid skills response");
    }

    const skills = [
      ...new Set(
        result.skills
          .filter((skill) => typeof skill === "string")
          .map((skill) => skill.trim())
          .filter(Boolean),
      ),
    ];

    return NextResponse.json<ApiResponse<GenerateSkillsResult>>(
      {
        success: true,
        message: "Skills generated successfully",
        data: {
          skills,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Generate skills error:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to generate skills",
      },
      { status: 500 },
    );
  }
}
