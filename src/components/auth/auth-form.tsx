'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/common/ui/input';
import { Button } from '@/components/common/ui/button';

type AuthVariant = 'sign-in' | 'sign-up';

interface AuthFormProps {
  variant: AuthVariant;
}

export function AuthForm({ variant }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const actionCopy = variant === 'sign-in' ? 'Access studio' : 'Join Synapse';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const payload = Object.fromEntries(formData.entries());
      const endpoint = variant === 'sign-in' ? '/api/auth/signin' : '/api/auth/signup';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        const message =
          typeof data?.error === 'string'
            ? data.error
            : Object.values<string[]>(data?.error ?? {})[0]?.[0] ??
              'Something glitched. Try again.';
        setError(message);
        return;
      }

      router.replace('/dashboard');
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {variant === 'sign-up' && (
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.3em] text-white/50">Name</label>
          <Input
            name="name"
            placeholder="Atlas Rivera"
            required
            className="bg-white/5 text-white"
          />
        </div>
      )}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-white/50">Email</label>
        <Input
          name="email"
          type="email"
          placeholder="you@studio.co"
          required
          className="bg-white/5 text-white"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-white/50">Password</label>
        <Input
          name="password"
          type="password"
          placeholder="********"
          minLength={8}
          required
          className="bg-white/5 text-white"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-white py-3 text-base font-semibold text-black hover:bg-white/90"
      >
        {pending ? 'Calibrating...' : actionCopy}
      </Button>
    </form>
  );
}

