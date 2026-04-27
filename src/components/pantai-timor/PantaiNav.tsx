import { NAV_ITEMS } from "./constants";

export function PantaiNav() {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 grid grid-cols-[1fr_auto] items-center gap-6 !px-4 !py-7 md:grid-cols-[1fr_auto_1fr] md:!px-10 md:!py-10">
      <div className="min-w-0">
        <span className="font-sans text-[0.72rem] font-black uppercase tracking-[0.28em] text-[#e3e1da] md:text-[0.78rem] md:tracking-[0.35em] whitespace-nowrap">
          PANTAI TIMOR
        </span>
      </div>

      <div className="hidden md:flex justify-center gap-10 lg:gap-16 items-center">
        {NAV_ITEMS.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className={`font-sans text-[0.68rem] font-bold uppercase tracking-[0.25em] transition-colors whitespace-nowrap pb-1 ${
              item === "GALLERY"
                ? "text-[#e3e1da] border-b border-[#e3e1da]/50"
                : "text-[#e3e1da]/50 hover:text-[#e3e1da]"
            }`}
          >
            {item}
          </a>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="border border-[#e3e1da]/20 !px-6 !py-3 font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#e3e1da] hover:bg-[#e3e1da] hover:text-[#10110F] transition-all md:!px-8 md:text-[0.72rem] md:tracking-[0.2em]">
          CONTACT
        </button>
      </div>
    </nav>
  );
}
