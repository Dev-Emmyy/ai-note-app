// app/layout.tsx
import type { Metadata } from 'next';
import ClientProviders from './ClientProviders'; // New client wrapper
import './globals.css';

export const metadata: Metadata = {
  title: 'NeuroNotes',
  description: 'Access your AI-powered knowledge base',
  icons: {
    icon: '/appLogo.png?v=3',
    shortcut: '/appLogo.png?v=3',
    apple: '/appLogo.png?v=3',
  },
  manifest: '/manifest.json?v=3',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="background-effect">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}