import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { SidebarProviderWrapper } from "@/components/layout/sidebar-provider";
import { AlertProvider } from "@/contexts/alert-context";
import { AuthMiddleware } from "@/components/auth/AuthMiddleware";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "TheOneEye - Automation-as-a-Service",
  description: "Fully managed Automation-as-a-Service that handles repetitive tasks, letting your team focus on growth. AI-enhanced intelligent actions for business automation.",
  keywords: ["automation", "business automation", "workflow automation", "AI automation", "automation as a service"],
  authors: [{ name: "TheOneEye Team" }],
  creator: "TheOneEye",
  publisher: "TheOneEye",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://theoneeye.com',
    title: 'TheOneEye - Automation-as-a-Service',
    description: 'Fully managed Automation-as-a-Service that handles repetitive tasks, letting your team focus on growth.',
    siteName: 'TheOneEye',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TheOneEye - Automation-as-a-Service',
    description: 'Fully managed Automation-as-a-Service that handles repetitive tasks, letting your team focus on growth.',
    creator: '@theoneeye',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "oklch(1 0 0)" },
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.145 0 0)" },
  ],
};
const font = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={`${font.className} ${font.variable}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AlertProvider>
              <Suspense fallback={<SidebarProviderWrapper>{children}</SidebarProviderWrapper>}>
                <AuthMiddleware>
                  <SidebarProviderWrapper>
                    {children}
                    <Toaster 
                      position="top-right"
                      expand={true}
                      richColors={true}
                      closeButton={true}
                    />
                  </SidebarProviderWrapper>
                </AuthMiddleware>
              </Suspense>
            </AlertProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
