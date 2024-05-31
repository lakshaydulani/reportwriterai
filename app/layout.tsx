import "@/styles/globals.css";
import "@/styles/prosemirror.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";
import Header from "@/components/tailwind/ui/header";

const title = "AI Report Writer";
const description =
  "POC app developed by Lakshay Dulani";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: "summary_large_image",
    creator: "@bholechature",
  },
  metadataBase: new URL("https://novel.sh"),
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
      <div className="flex min-h-screen flex-col gap-4 bg-zinc-200">
        <Header />
        <Providers>{children}</Providers>
      </div>
      </body>
    </html>
  );
}
