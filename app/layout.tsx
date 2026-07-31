import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import SiteChrome from "@/components/layout/SiteChrome";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "RentNest — Find & List Rental Properties with Ease",
  description:
    "RentNest is a modern rental property marketplace. Browse listings, submit requests, and manage properties all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <SiteChrome>{children}</SiteChrome>
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
