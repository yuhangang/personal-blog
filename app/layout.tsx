import { ReactNode } from "react";
import StyledComponentsRegistry from "@/lib/styled-components-registry";
import ClientLayout from "@/lib/client-layout";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function RootLayout({ children }: { children: ReactNode }) {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_URL in environment variables");
  }

  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <ClientLayout>{children}</ClientLayout>
        </StyledComponentsRegistry>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ""} />
      </body>
    </html>
  );
}
