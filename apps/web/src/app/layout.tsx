import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import {Inter} from 'next/font/google'

const inter = Inter({
   subsets: ["latin"],
   display: "swap",
   weight: ["100","200","300","400","500","600","700","800","900"],
})

export const metadata: Metadata = {
  title: "Control - Your Website Uptime Monitor",
  description: "Website uptime monitoring service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased tracking-[-0.022em;]`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
