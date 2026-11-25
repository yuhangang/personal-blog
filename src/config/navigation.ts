export interface NavLinkItem {
  label: string;
  href: string;
  meta?: string;
  external?: boolean;
}

export const NAV_LINKS: readonly NavLinkItem[] = [
  { label: "Home", href: "/", meta: "Overview" },
  { label: "About", href: "/about", meta: "Background" },
  { label: "Resume", href: "/resume", meta: "Experience, skills, and PDF" },
  { label: "Gallery", href: "/gallery", meta: "Photo essays and films" },
] as const;

export const FOOTER_EXPLORE_LINKS: readonly NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
  { label: "Gallery", href: "/gallery" },
  { label: "Pantai Timor", href: "/pantai-timor" },
] as const;

export const FOOTER_LINKS: readonly NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  // WIP: temporarily hidden
  // { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "mailto:contact@yuhangang.com" },
  { label: "pelbag.ai", href: "https://pelbag.ai" },
] as const;
