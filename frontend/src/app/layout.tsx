import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { TopBar } from "@/components/layout/topbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ratefluencer AI Copilot",
  description: "AI-powered influencer intelligence platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body
        style={{ margin: 0, padding: 0, minHeight: '100vh', display: 'flex', background: 'var(--background)' }}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {/* Sidebar + spacer (both rendered inline) */}
          <Sidebar />

          {/* Page content — fills remaining space */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: 0, overflow: 'hidden' }}>
            <TopBar />
            <main
              className="bg-grid-pattern"
              style={{ flex: 1, padding: 24, overflowY: 'auto' }}
            >
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
