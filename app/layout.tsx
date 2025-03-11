import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

import { AppProvider } from "@/components/authContext";

export const metadata: Metadata = {
  title: "Stępki Gotują",
  description: "Przepisy kulinarne stworzone przez rodzine Stępków.",
  manifest: "/manifest.json",
  keywords: ["gotowanie", "przepisy"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <AppProvider>
        <body className="relative">
          <Toaster
            position="top-center"
            containerStyle={{
              top: 100,
            }}
          />
          <Navbar />
          {children}
          <Footer />
        </body>
      </AppProvider>
    </html>
  );
}
