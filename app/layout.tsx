import type { Metadata } from "next";
import { IBM_Plex_Sans, Lora } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Order Tracker",
  description: "Daily order tracking and after-sales tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${lora.variable}`}>
      <body className="min-h-screen bg-ivory text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
