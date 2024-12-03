"use client";

import Link from "next/link";

interface AnchorLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const AnchorLink = ({ href, children, className }: AnchorLinkProps) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Get the hash from the href
    const hash = href.split("#")[1];

    // Smoothly scroll to the element
    const element = document.getElementById(hash);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Update URL without reload
      router.push(href, { scroll: false });
    }
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};

// components/AnchorSection.tsx
import styled from "styled-components";

const Section = styled.section`
  scroll-margin-top: 5rem; // Adjust based on your header height
`;

interface AnchorSectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const AnchorSection = ({
  id,
  children,
  className,
}: AnchorSectionProps) => (
  <Section id={id} className={className}>
    {children}
  </Section>
);

// Hook to handle initial scroll on page load
// hooks/useAnchorScroll.ts

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const useAnchorScroll = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [searchParams]);
};
