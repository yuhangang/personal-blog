type SocialLink = {
  name: string;
  icon: string;
  iconSize: number;
  url: string;
};

const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    icon: "{ }",
    iconSize: 16,
    url: "https://github.com/yuhangang",
  },
  {
    name: "Insta",
    icon: "◇",
    iconSize: 16,
    url: "https://instagram.com/yuhangang",
  },
  {
    name: "X",
    icon: "X",
    iconSize: 20,
    url: "https://x.com/redrainhang",
  },
  {
    name: "LinkedIn",
    icon: "IN",
    iconSize: 16,
    url: "https://linkedin.com/in/yu-hang-ang-b8510010b/",
  },
  {
    name: "Email",
    icon: "✉︎",
    iconSize: 24,
    url: "mailto:redrainhang@gmail.com",
  },
];

export { socialLinks, type SocialLink };
