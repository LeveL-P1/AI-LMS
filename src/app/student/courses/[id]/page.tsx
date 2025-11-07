import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CourseDetailPage({ params }) {
  const { id } = params;
  const [course, setCourse] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      const courseRes = await fetch(`/api/courses/${id}`);
      if (courseRes.ok) {
        const courseData = await courseRes.json();
        setCourse(courseData);
      }
    }

    async function fetchRecommendations() {
      const recRes = await fetch('/api/ai/course/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: id }),
      });
      if (recRes.ok) {
        const recData = await recRes.json();
        setRecommendations(recData.recommendations);
      }
      setLoading(false);
    }

    fetchCourse();
    fetchRecommendations();
  }, [id]);

  if (!course) return <div>Loading course...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>By {course.instructor?.firstName} {course.instructor?.lastName}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{course.description}</p>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-xl font-semibold mb-4">Recommended Courses</h2>
        {loading && <p>Loading recommendations...</p>}
        {!loading && recommendations.length === 0 && <p>No recommendations available.</p>}
        <div className="grid gap-4 md:grid-cols-2">
          {recommendations.map((rec) => (
            <Link key={rec.id} href={`/courses/${rec.id}`} className="border p-4 rounded hover:bg-accent">
              <h3 className="font-medium text-lg">{rec.title}</h3>
              <p className="text-sm truncate">{rec.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
