import { NextRequest, NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';
import { db } from '@/lib/prisma';
import cosineSimilarity from 'compute-cosine-similarity';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Helper: generate embedding vector for given text
async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return response.data.data[0].embedding;
}

export async function POST(req: NextRequest) {
  try {
    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: 'Missing courseId' }, { status: 400 });
    }

    // Ensure embedding cached for courses
    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    let courseEmbedding = course.embedding;
    if (!courseEmbedding || courseEmbedding.length === 0) {
      // Generate and save embedding
      courseEmbedding = await getEmbedding(course.title + ' ' + course.description);
      await db.course.update({
        where: { id: courseId },
        data: { embedding: courseEmbedding },
      });
    }

    // Fetch all other courses' embeddings
    const otherCourses = await db.course.findMany({
      where: { id: { not: courseId }, embedding: { not: null } },
      select: { id: true, title: true, description: true, embedding: true },
    });

    // Compute similarity scores
    const similarities = otherCourses.map(c => ({
      course: c,
      similarity: cosineSimilarity(courseEmbedding, c.embedding),
    }));

    // Sort by highest similarity
    similarities.sort((a, b) => b.similarity - a.similarity);

    // Return top 5 recommendations
    const recommendations = similarities.slice(0, 5).map(s => s.course);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('AI course recommendation failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
