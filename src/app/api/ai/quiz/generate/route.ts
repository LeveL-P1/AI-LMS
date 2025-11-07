import { NextRequest, NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import { db } from '@/lib/prisma'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
  try {
    const { lessonId, content } = await req.json();
    if (!lessonId || !content) {
      return NextResponse.json({ error: "Missing lessonId or content" }, { status: 400 });
    }

    // Create prompt for quiz question generation
    const prompt = `Generate 5 multiple choice quiz questions based on the following content. Return result in JSON with fields: question, options[4], answer (correct option index).

Content:\n${content}`;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    const resultText = response.data.choices[0].text?.trim();
    let questions = [];
    try {
      questions = JSON.parse(resultText || "[]");
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: "No quiz questions generated" }, { status: 500 });
    }

    // Save generated questions to DB linked to lesson
    await db.quizQuestion.deleteMany({ where: { lessonId } });
    for (const q of questions) {
      await db.quizQuestion.create({
        data: {
          lessonId,
          questionText: q.question,
          options: q.options,
          correctOptionIndex: q.answer,
        },
      });
    }

    return NextResponse.json({ success: true, questions }, { status: 200 });
  } catch (error) {
    console.error("AI quiz generation failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
