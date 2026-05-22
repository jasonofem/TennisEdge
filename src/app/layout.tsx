import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TennisEdge | Precision. Discipline. Edge.",
  description: "Professional tennis betting intelligence platform. Maximum 3 high-value underdog opportunities daily with data-driven analysis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`html, body { background-color: #0a0a0a; }`}</style>
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
