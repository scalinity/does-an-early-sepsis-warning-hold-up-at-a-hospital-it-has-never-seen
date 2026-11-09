import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { DirectionProvider } from "@/components/foundations/direction/direction";
import { cx } from "@/utils/cx";
import "@/styles/globals.css";
import "./print.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], axes: ["opsz"] });

export const metadata: Metadata = {
  title: "CAI 5720 Final Project Proposal",
  description: "Does an early sepsis warning hold up at a hospital it has never seen?",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-US" dir="ltr" className={cx(inter.variable, "antialiased")}>
      <body className="bg-background-full text-text-primary">
        <DirectionProvider locale="en-US">{children}</DirectionProvider>
      </body>
    </html>
  );
}
