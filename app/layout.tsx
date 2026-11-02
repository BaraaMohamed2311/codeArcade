import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CODE ARCADE // practice loop",
  description: "A personal arcade for grinding the patterns that matter.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="scanlines" />
        {children}
      </body>
    </html>
  );
}
