import { MainLayout } from "@/components/layout/main-layout";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  PreferenceProvider,
  ReactQueryProvider,
  SessionsProvider,
} from "@/libs/context"; // Consolidated context imports
import { AuthProvider } from "@/libs/context/auth";
import { CSPostHogProvider } from "@/libs/posthog/provider";
import { cn } from "@/libs/utils/clsx";
import type { Metadata, Viewport } from "next"; // Combined type imports
import { ThemeProvider } from "next-themes";
import { interVar } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Connect IX AI - Your Ultimate AI Chat Experience",
  description: "Chat with top LLMs in a minimal, privacy-focused UI.",
  openGraph: {
    title: "Connect IX AI - Your Ultimate AI Chat Experience",
    siteName: "ixcoach.com",
    description: "Chat with top LLMs in a minimal, privacy-focused UI.",
    url: "https://connect.ixcoach.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Connect IX AI - Your Ultimate AI Chat Experience",
    site: "connect.ixcoach.com",
    description: "Chat with top LLMs in a minimal, privacy-focused UI.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(interVar.variable, "antialiased", "light")}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          defer
          data-domain="llmchat.co"
          src="https://plausible.io/js/script.tagged-events.js"
        ></script>
      </head>
      <CSPostHogProvider>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ReactQueryProvider>
              <AuthProvider>
                <TooltipProvider>
                  <PreferenceProvider>
                    <SessionsProvider>
                      <MainLayout>{children}</MainLayout>
                    </SessionsProvider>
                  </PreferenceProvider>
                </TooltipProvider>
              </AuthProvider>
            </ReactQueryProvider>
          </ThemeProvider>
        </body>
      </CSPostHogProvider>
    </html>
  );
}
