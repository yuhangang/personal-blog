import { ReactNode } from "react";
import StyledComponentsRegistry from "@/lib/styled-components-registry";
import ClientLayout from "@/lib/client-layout";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function RootLayout({ children }: { children: ReactNode }) {
  console.log("GA_ID", process.env.GA_ID);

  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <ClientLayout>{children}</ClientLayout>
        </StyledComponentsRegistry>
        <GoogleAnalytics gaId={process.env.GA_ID} />
      </body>
    </html>
  );
}
