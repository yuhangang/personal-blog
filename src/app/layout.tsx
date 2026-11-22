import type { Viewport } from "next";
import {
  Plus_Jakarta_Sans,
  Inter,
  Playfair_Display,
  Outfit,
  Caudex,
  Jost,
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
  variable: "--font-serif",
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
  variable: "--font-serif-caudex",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#faf8f5",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata = {
  title: "Yu Hang Ang | Software Engineer",
  description:
    "Personal portfolio of Yu Hang Ang, a software engineer based in Kuala Lumpur, Malaysia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${inter.variable} ${playfair.variable} ${outfit.variable} ${caudex.variable} ${jost.variable}`}
      suppressHydrationWarning={true}
    >
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <TransitionProvider>
          <SmoothScroll>
            <Navigation />
            <div id="main-content" tabIndex={-1} className="app-shell">
              {children}
            </div>
            <div id="contact" style={{ scrollMarginTop: "100px" }}>
              <Footer />
            </div>
          </SmoothScroll>
        </TransitionProvider>
      </body>
      {process.env.NEXT_PUBLIC_NODE_ENV === "production" && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      )}
    </html>
  );
}
