import type { Metadata } from "next";
import { Creepster, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const display = Creepster({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const mono = Share_Tech_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "CekuLink",
  description:
    "Şaka linki: gerçek adresi yapıştır, şüpheli yol otomatik üretilir. Tıklanınca yine o adrese gider.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-zinc-200">
        {children}
      </body>
    </html>
  );
}
