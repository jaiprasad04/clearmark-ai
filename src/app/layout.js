import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import { Navbar } from "../components/layout/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "ClearMark AI — Remove Watermarks Instantly with AI",
  description:
    "Remove watermarks, logos, and text overlays from images in seconds using GPT Image 2. Restore old photos, clean documents, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full w-full dark" style={{ colorScheme: "dark" }}>
      <body
        className={`${inter.variable} ${inter.className} h-full w-full flex flex-col antialiased bg-zinc-950 text-zinc-100 overflow-hidden`}
      >
        <Providers>
          <Navbar />
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
