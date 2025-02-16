import type { Metadata } from "next";
import SessionProviderWrapper from "./SessionProviderWrapper";
import "./globals.css"; // Import your global CSS file

export const metadata: Metadata = {
  title: "NeuroNotes",
  description: "Access your AI-powered knowledge base",
  icons: {
    icon: "/appLogo.png?v=2", // Add ?v=2
    shortcut: "/appLogo.png?v=2",
    apple: "/appLogo.png?v=2",
  },
  manifest: "/manifest.json?v=2",  // Path to your manifest file
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="background-effect"> {/* Add className here */}
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}