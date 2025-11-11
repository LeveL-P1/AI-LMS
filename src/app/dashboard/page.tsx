'use client';

import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { role, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && role) {
      const roleRoute = role.toLowerCase();
      router.push(`/dashboard/${roleRoute}`);
    }
  }, [isLoaded, role, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}



