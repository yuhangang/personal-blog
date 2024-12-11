import { ReactNode } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import Footer from "./_components/common/footer/footer";

import "../styles/globals.scss";

export default function RootLayout({ children }: { children: ReactNode }) {
  if (!process.env.NEXT_PUBLIC_GA_ID) {
    throw new Error("Missing NEXT_PUBLIC_GA_ID in environment variables");
  }

  return (
    <html lang="en">
      <body>
        {children}
        <Footer />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ""} />
      </body>
    </html>
  );
}
