// [Removed unused Metadata import]
import {
  Plus_Jakarta_Sans,
  Inter,
  Playfair_Display,
  Outfit,
  Caudex,
} from "next/font/google";
import SmoothScroll from "@/components/common/SmoothScroll/SmoothScroll";
import Footer from "@/components/common/Footer/Footer";
import "./globals.scss";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { TransitionProvider } from "@/context/TransitionContext";
import Navigation from "@/components/common/Navigation/Navigation";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-serif", // Reverting to original mapping (confusing name, but consistent with rest of app)
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-geom",
  display: "swap",
});

const caudex = Caudex({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif-caudex", // Reverting to specific variable
  display: "swap",
});

export const viewport = {
  themeColor: "#050505", // Matches black background
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Prevent zoom on mobile inputs
  viewportFit: "cover", // Ensures background extends to edges (notch area)
};

export const metadata = {
  title: "Yu Hang Ang | Developer & Creator",
  description: "Personal portfolio and blog of Yu Hang Ang.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${inter.variable} ${playfair.variable} ${outfit.variable} ${caudex.variable}`}
      suppressHydrationWarning={true}
    >
      <body>
        <TransitionProvider>
          <SmoothScroll>
            <Navigation />
            <main style={{ backgroundColor: "#1d1d1f", minHeight: "100dvh" }}>
              {children}
            </main>
            <div id="contact" style={{ scrollMarginTop: "100px" }}>
              <Footer />
            </div>
          </SmoothScroll>
        </TransitionProvider>
      </body>
      {process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      )}
    </html>
  );
}
