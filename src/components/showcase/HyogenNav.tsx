"use client";

import Link from "next/link";

export default function HyogenNav() {
  return (
    <nav className="fixed left-0 top-0 z-50 flex w-full items-center justify-between px-8 py-10 md:px-12 pointer-events-none">
      <div className="flex flex-col gap-1 pointer-events-auto">
        <span className="font-sans text-[0.62rem] font-black uppercase tracking-[0.3em] text-black">
          Pantai Timor: A Photobook
        </span>
        <span className="font-sans text-[0.5rem] tracking-[0.2em] text-black/30 uppercase font-medium">
          Heritage & Modernity
        </span>
      </div>

      <ul className="flex items-center gap-12 pointer-events-auto">
        {[
          { id: "01", label: "COVER", href: "#top" },
          { id: "02", label: "SPREADS", href: "#gallery" },
          { id: "03", label: "ABOUT", href: "#about" },
        ].map((link) => (
          <li key={link.id}>
            <Link
              href={link.href}
              className="group flex items-baseline gap-2 transition-opacity"
            >
              <span className="font-serif text-[0.55rem] italic text-black/20">
                {link.id}
              </span>
              <span className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.4em] text-black transition-colors group-hover:text-black/60">
                {link.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
