import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SiteStructuredData } from "@/components/seo/site-structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fsb-e-commerce.vercel.app"),
  title: {
    default: "ShopHub — Great Products, Honest Prices",
    template: "%s | ShopHub",
  },
  description:
    "ShopHub is an online store with a 500+ product catalog across 24 categories: search, filter, compare prices, read reviews, and check out in minutes.",
  applicationName: "ShopHub",
  category: "eCommerce, Shopping",
  keywords: [
    "online shopping",
    "ecommerce",
    "electronics",
    "beauty",
    "fashion",
    "home decor",
    "discounts",
    "ShopHub",
  ],
  authors: [{ name: "ShopHub" }],
  creator: "ShopHub",
  publisher: "ShopHub",
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "ShopHub",
    locale: "en_US",
    url: "/",
    title: {
      default: "ShopHub — Great Products, Honest Prices",
      template: "%s | ShopHub",
    },
    description:
      "ShopHub is an online store with a 500+ product catalog across 24 categories: search, filter, compare prices, read reviews, and check out in minutes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopHub — Great Products, Honest Prices",
    description:
      "ShopHub is an online store with a 500+ product catalog across 24 categories: search, filter and check out in minutes.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-full flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <SiteStructuredData />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
