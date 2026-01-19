export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Create", href: "/create" },
  { label: "Contact", href: "/#contact" }, // Universal anchor link
] as const;

export const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Create", href: "/create" },
  { label: "Contact", href: "mailto:contact@yuhangang.com" }, // Footer contact is email
] as const;
