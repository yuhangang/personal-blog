'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.scss';

const navLinks = [
  { label: 'Blog', href: '/#blog' },
  { label: 'About', href: '/#about' },
  { label: 'Wallpapers', href: '/wallpapers' },
  { label: 'Journal', href: '#blog' },
  { label: 'Connect', href: '#contact' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname === '/wallpapers') return null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#') || href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.split('#')[1];
      const element = document.getElementById(targetId);
      if (element) {
        const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        setMobileMenuOpen(false); // Close mobile menu after clicking
      }
    } else {
      // For external links or full paths, let Next.js Link handle the navigation
      setMobileMenuOpen(false); // Close mobile menu even if navigating away
    }
  };

  return (
    <>
      <nav className={`${styles.nav} ${scrolled || mobileMenuOpen ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          <Link href="#home" className={styles.logo} onClick={(e) => handleClick(e, '#home')}>
            Yu Hang Ang
          </Link>

          {/* Desktop Navigation */}
          <ul className={styles.links}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={styles.link}
                  onClick={(e) => handleClick(e, link.href)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className={styles.menuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className={`${styles.hamburger} ${mobileMenuOpen ? styles.open : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Outside nav for full-screen coverage */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileMenuOverlay} onClick={() => setMobileMenuOpen(false)} />
        <div className={styles.mobileMenuContent}>
          <ul className={styles.mobileLinks}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={styles.mobileLink}
                  onClick={(e) => handleClick(e, link.href)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

