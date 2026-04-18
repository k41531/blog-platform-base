import type { Metadata } from "next";
import { Montserrat, Zen_Kaku_Gothic_New, Zen_Maru_Gothic } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Blog Platform",
  description: "ブログプラットフォーム",
};

const zenMaruGothic = Zen_Maru_Gothic({
  variable: "--font-jp-round-family",
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  variable: "--font-jp-sans-family",
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-en-family",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${zenMaruGothic.variable} ${zenKakuGothicNew.variable} ${montserrat.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
