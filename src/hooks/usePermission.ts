import { useEffect, useState } from 'react';

export function usePermissions() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const res = await fetch('/api/permissions');
        if (!res.ok) throw new Error('Failed to fetch');
        const data: string[] = await res.json();
        setPermissions(data);
      } catch {
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPermissions();
  }, []);

  return { permissions, loading };
}
