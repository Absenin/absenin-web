import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const PoppinsFont = Poppins({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Absenin",
  description: "Absensi Berbasis QR dengan authentication multilevel 🔥",
  icons: [
    {
      rel: "icon",
      href: "/favicon.ico",
      url: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      href: "/apple-touch-icon.png",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "manifest",
      href: "/site.webmanifest",
      url: "/site.webmanifest",
    },
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={PoppinsFont.className}>
        <main className="selection:bg-primary selection:text-background">
          {children}
        </main>
      </body>
    </html>
  );
}
