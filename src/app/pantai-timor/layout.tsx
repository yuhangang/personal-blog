import type { Metadata } from "next";

// page.tsx is a client component, so the route's metadata lives here.
export const metadata: Metadata = {
  title: "Pantai Timor | Yu Hang Ang",
  description: "Photographs from Malaysia's east coast by Yu Hang Ang.",
};

export default function PantaiTimorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
