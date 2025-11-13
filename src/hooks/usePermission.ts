'use client';

import { useEffect, useState } from 'react';
import { logger } from '@/lib/errors';
import { ClerkProvider } from '@clerk/nextjs'

/**
 * Hook to fetch and manage user permissions
 */
export function usePermissions() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const res = await fetch('/api/permissions');
        if (!res.ok) {
          throw new Error(`Failed to fetch permissions: ${res.statusText}`);
        }
        const data: string[] = await res.json();
        setPermissions(data);
        logger.debug('Permissions fetched', { count: data.length });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        logger.error('Failed to fetch permissions', err);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPermissions();
  }, []);

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  return { permissions, loading, error, hasPermission };
}
