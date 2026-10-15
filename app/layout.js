import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ApexCommerce — Enterprise E-Commerce & Analytics Platform (Cognevance Level 3)",
  description: "Scalable enterprise-level web platform with predictive analytics, payment gateways, role-based admin operations, and order tracking. Developed by Shahnawaz Khan for Cognevance Technologies.",
  keywords: ["ecommerce", "enterprise", "analytics", "dashboard", "nextjs", "react", "tailwindcss", "cognevance technologies"]
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#080c14] text-slate-100">
        {children}
      </body>
    </html>
  );
}
