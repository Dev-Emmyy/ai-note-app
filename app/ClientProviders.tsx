// app/ClientProviders.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SessionProviderWrapper from './SessionProviderWrapper';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProviderWrapper>{children}</SessionProviderWrapper>
    </QueryClientProvider>
  );
}