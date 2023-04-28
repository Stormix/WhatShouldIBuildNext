'use client';

import { cn } from '@/utils/styles';
import * as React from 'react';
import Button from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';

import Discord from '@/assets/icons/discord.svg';
import Github from '@/assets/icons/github.svg';
import Google from '@/assets/icons/google.svg';
import Twitter from '@/assets/icons/twitter.svg';
import type { Providers } from '@/pages/auth/signin';
import { signIn } from 'next-auth/react';

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement> & {
  providers: Providers;
};

export function UserAuthForm({ className, providers, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>('');
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    await signIn('email', { email, callbackUrl: '/' });
    setIsLoading(false);
  }

  const iconClassName = 'h-4 w-4 text-foreground';
  const icons: Record<string, () => React.ReactNode> = {
    discord: () => <Discord className={iconClassName} />,
    github: () => <Github className={iconClassName} />,
    google: () => <Google className={iconClassName} />,
    twitter: () => <Twitter className={iconClassName} />
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your email below to create your account</p>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
            />
          </div>
          <Button disabled={isLoading} loading={isLoading} type="submit">
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {Object.values(providers)
        .filter((provider) => provider.id !== 'email')
        .map((provider) => (
          <div key={provider.name}>
            <Button
              className="w-full"
              variant="outline"
              type="button"
              size={'lg'}
              disabled={isLoading}
              loading={isLoading}
              icon={icons[provider.id]?.()}
              onClick={() => signIn(provider.id)}
            >
              Sign in with {provider.name}
            </Button>
          </div>
        ))}
    </div>
  );
}
