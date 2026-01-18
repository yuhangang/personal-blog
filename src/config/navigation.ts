export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Create", href: "/create" },
  { label: "Contact", href: "#contact" }, // Anchor link (requires id="contact" on page or footer)
] as const;

export const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Create", href: "/create" },
  { label: "Contact", href: "mailto:contact@yuhangang.com" }, // Footer contact is email
] as const;
