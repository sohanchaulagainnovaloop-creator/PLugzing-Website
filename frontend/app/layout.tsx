import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plugzin — Power Up Your Editing",
  description:
    "Discover production-ready tools and plugins for creative workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
