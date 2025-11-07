import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Editor from '@/components/ui/editor'; // Assume a rich text editor component

export default function LessonPage({ params }) {
  const router = useRouter();
  const { id: courseId, lessonId } = params;

  const [content, setContent] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function generateQuiz() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ai/quiz/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate quiz');
      }
      setQuestions(data.questions);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Lesson Content and AI Quiz Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <Editor
            value={content}
            onChange={setContent}
            placeholder="Enter lesson content here..."
          />

          <Button
            onClick={generateQuiz}
            disabled={loading || !content.trim()}
            className="mt-4"
          >
            {loading ? 'Generating Quiz...' : 'Generate Quiz with AI'}
          </Button>

          {error && <p className="text-red-600 mt-4">Error: {error}</p>}

          {questions.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg">Generated Quiz Questions</h3>
              <ul className="space-y-4">
                {questions.map((q, i) => (
                  <li key={i} className="border p-4 rounded">
                    <p className="font-medium">Q{i + 1}: {q.question}</p>
                    <ul className="list-disc list-inside">
                      {q.options.map((option, idx) => (
                        <li
                          key={idx}
                          className={idx === q.answer ? 'font-bold text-green-600' : ''}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
