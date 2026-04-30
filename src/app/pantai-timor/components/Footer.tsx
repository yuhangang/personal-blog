"use client";


import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";

export const Footer = () => {
  const { lenis } = useLenis();

  const menuItems = [
    { label: "HISTORY", id: "history-section" },
    { label: "VILLAGE", id: "village" },
    { label: "GEOGRAPHY", id: "geography" },
    { label: "ARCHIVE", id: "archive" },
  ];

  const handleScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(`#${id}`, { offset: -20 });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer id="footer" className="relative z-20 w-full border-t border-[#e3e1da]/10 !px-4 !py-20 md:!px-10 bg-[#10110F]">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-start lg:items-end gap-16 max-w-[1700px] !mx-auto">
        <div className="flex flex-col gap-12 md:gap-16">
          <div className="flex max-w-[44rem] flex-wrap gap-x-8 gap-y-5 md:gap-x-16">
            {menuItems.map((item) => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                onClick={(e) => handleScroll(e, item.id)}
                className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] text-[#e3e1da]/40 hover:text-[#e3e1da] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
        
        <div className="text-left lg:text-right max-w-sm">
          <p className="!mb-0 font-sans !text-[10px] md:!text-xs font-medium uppercase !tracking-[0.18em] md:!tracking-widest !text-[#e3e1da]/30 !leading-relaxed lg:text-right">
            <span className="md:mt-1 block">© 2026 Yu Hang Ang.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
