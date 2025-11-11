'use client';

import { useUser } from '@/hooks/use-user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Button } from '@/components/common/ui/button';
import Link from 'next/link';
import { BookOpen, TrendingUp, Users } from 'lucide-react';

export default function StudentDashboardPage() {
  const { fullName } = useUser();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {fullName}!</h1>
        <p className="text-muted-foreground mt-2">Continue your learning journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Courses In Progress</p>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <BookOpen className="h-10 w-10 text-blue-100" />
            </div>
            <Link href="/courses" className="text-sm text-blue-600 hover:underline mt-4 block">
              Browse courses →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Learning Streak</p>
                <p className="text-3xl font-bold mt-2">0 days</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-100" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Completed</p>
                <p className="text-3xl font-bold mt-2">0%</p>
              </div>
              <Users className="h-10 w-10 text-purple-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent learning activities</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent activity yet. Start a course to get started!</p>
        </CardContent>
      </Card>
    </div>
  );
}
