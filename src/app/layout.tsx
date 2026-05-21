import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TennisEdge | Precision. Discipline. Edge.",
  description: "Professional tennis betting intelligence platform. Maximum 3 high-value underdog opportunities daily with data-driven analysis.",
  keywords: ["tennis betting", "sports betting", "underdog betting", "tennis analysis", "value betting"],
  authors: [{ name: "TennisEdge" }],
  openGraph: {
    title: "TennisEdge | Precision. Discipline. Edge.",
    description: "Professional tennis betting intelligence platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0a0a] antialiased">
        {children}
      </body>
    </html>
  );
}