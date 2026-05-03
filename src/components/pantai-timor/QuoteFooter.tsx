import { FOOTER_LINKS } from "./constants";
import type { PantaiTimorFontClasses } from "./types";

export function QuoteSection({ fonts }: { fonts: PantaiTimorFontClasses }) {
  return (
    <section className="relative z-20 w-full !py-48 md:!py-64 overflow-hidden flex items-center justify-center !px-4 bg-[#10110F]">
      <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_60%)] blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 left-0 w-full h-full -translate-y-1/2 opacity-20">
          <div className="w-[200%] h-full flex items-center animate-[slideLeft_20s_linear_infinite]">
            <svg width="100%" height="200" viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-1/2 h-full">
              <path d="M0,100 C250,200 250,0 500,100 C750,200 750,0 1000,100 L1000,200 L0,200 Z" fill="rgba(255,255,255,0.02)" />
            </svg>
            <svg width="100%" height="200" viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-1/2 h-full">
              <path d="M0,100 C250,200 250,0 500,100 C750,200 750,0 1000,100 L1000,200 L0,200 Z" fill="rgba(255,255,255,0.02)" />
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="relative z-10 max-w-6xl text-center flex flex-col items-center">
        <span className="text-[#e3e1da]/20 text-3xl md:text-5xl font-serif leading-none block !mb-10">&ldquo;</span>
        <blockquote className={`${fonts.serif} !text-[1.6rem] md:!text-[2.2rem] !leading-[1.55] !text-[#e3e1da] !mb-12 text-balance`}>
          Visual manifestations transcend the mere act of telling a story. It is the lifeblood of our culture in the making.
        </blockquote>
        <cite className="font-sans text-[0.55rem] font-bold uppercase tracking-[0.2em] text-[#e3e1da]/30 not-italic md:tracking-[0.25em]">
          &mdash; Unknown Coastal Author
        </cite>
      </div>
    </section>
  );
}

export function PantaiFooter({ fonts }: { fonts: PantaiTimorFontClasses }) {
  return (
    <footer className="relative z-20 flex w-full flex-col items-center border-t border-[#e3e1da]/10 bg-[#10110F] !px-6 !py-20 sm:!px-8 md:!py-24 lg:!px-10">
      <div className="flex w-full max-w-6xl flex-col items-center gap-14 text-center md:gap-16">
        <div className="flex flex-col items-center gap-10 md:gap-12">
          <h2 className={`${fonts.serif} !mb-0 !text-[clamp(3.25rem,12vw,5rem)] !leading-none !tracking-normal !text-[#e3e1da]`}>
            Pantai Timor
          </h2>
          <div className="flex max-w-[44rem] flex-wrap justify-center gap-x-8 gap-y-5 md:gap-x-16">
            {FOOTER_LINKS.map((link) => (
              <a key={link} href={`#${link.replace(/\s+/g, "-")}`} className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] text-[#e3e1da]/40 hover:text-[#e3e1da] transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="max-w-sm text-center">
          <p className="!mb-0 font-sans !text-[10px] md:!text-xs font-medium uppercase !tracking-[0.18em] md:!tracking-widest !text-[#e3e1da]/30 !leading-relaxed">
            <span className="md:mt-1 block">&copy; 2026 Yu Hang Ang.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
