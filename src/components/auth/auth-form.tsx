'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/common/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type AuthVariant = 'sign-in' | 'sign-up';

interface AuthFormProps {
  variant: AuthVariant;
}

export function AuthForm({ variant }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const actionCopy = variant === 'sign-in' ? 'Sign In' : 'Create Account';

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
              'Something went wrong. Please try again.';
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
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required
            className="h-11"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          required
          className="h-11"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          minLength={8}
          required
          className="h-11"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="w-full h-11 text-base font-semibold"
        variant={variant === 'sign-up' ? 'default' : 'outline'}
      >
        {pending ? 'Please wait...' : actionCopy}
      </Button>
    </form>
  );
}

