"use client";

import { Libre_Caslon_Text } from "next/font/google";
import Image from "next/image";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  display: "swap",
});

export const QuoteSection = () => {
  return (
    <section className="relative z-10 w-full min-h-[80vh] !py-48 md:!py-64 overflow-hidden flex items-center justify-center !px-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC08162.jpg"
          alt="Coastal sunset background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[#10110F]/65 backdrop-blur-[2px]" />
      </div>

      {/* Wavy gradient background (kept for subtle movement) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden z-1">
        <div className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_60%)] blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />
      </div>

      <div className="relative z-10 max-w-6xl text-center flex flex-col items-center">
        <span className="text-[#e3e1da]/40 text-3xl md:text-5xl font-serif leading-none block !mb-10">&ldquo;</span>
        <blockquote className={`${libreCaslon.className} !text-[1.8rem] md:!text-[2.6rem] !leading-[1.45] !text-[#e3e1da] !mb-12 text-balance font-medium tracking-tight`}>
          Visual manifestations transcend the mere act of telling a story. It is the lifeblood of our culture in the making.
        </blockquote>
        <cite className="font-sans text-[0.6rem] md:text-[0.7rem] font-bold uppercase tracking-[0.3em] text-[#e3e1da]/50 not-italic">
          — Unknown Coastal Author
        </cite>
      </div>
    </section>
  );
};

