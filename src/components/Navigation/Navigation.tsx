'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.scss';
import { useLenis } from '@/components/SmoothScroll/SmoothScroll';
import Logo from './Logo';
import LogoWordmark from './LogoWordmark';

const navLinks = [
  { label: 'About', href: '/about', preview: '/wallpaper_mountain_dusk.png' },
  { label: 'Create', href: '/create', preview: '/projects/yoymedia.png' },
  { label: 'Connect', href: '#contact', preview: '/wallpaper_mountain_dusk.png' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [interactionDisabled, setInteractionDisabled] = useState(false);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [navTheme, setNavTheme] = useState<'light' | 'dark'>('dark');

  // Dynamic Theme Detection
  useEffect(() => {
    // Select all sections that have a data-theme attribute
    const sections = document.querySelectorAll('[data-theme]');
    
    // Observer options: Trigger when 10% of the section is visible
    // But we specifically care about what is at the TOP of the screen (where nav is)
    // So rootMargin should be set to inspect the top area.
    // So rootMargin should be set to inspect the top area.
    const observerOptions = {
        root: null,
        rootMargin: '-30px 0px -90% 0px', // Check a thin strip at the top
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const theme = entry.target.getAttribute('data-theme') as 'light' | 'dark';
                if (theme) setNavTheme(theme);
            }
        });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    return () => {
        sections.forEach((section) => observer.unobserve(section));
    };
  }, [pathname]); // Re-run on path change

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    
    // Disable hover/long-press effects temporarily
    setInteractionDisabled(true);
    setTimeout(() => {
        setInteractionDisabled(false);
    }, 3000);
  };

  const { lenis } = useLenis();

  // Prevent body scroll and stop Lenis when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      lenis?.stop();
      document.body.classList.add('nav-open'); // Mark for optimization observers
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden'; // Ensure robust locking on all browsers
    } else {
      lenis?.start();
      document.body.classList.remove('nav-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      setHoveredImage(null); // Reset preview on close
    }
    return () => {
      lenis?.start();
      document.body.classList.remove('nav-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [mobileMenuOpen, lenis]);

  // Close menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Disable hover effects temporarily on ANY navigation click
    setInteractionDisabled(true);
    setTimeout(() => {
        setInteractionDisabled(false);
    }, 3000);

    setMobileMenuOpen(false); // Close menu
    setHoveredImage(null);

    if (href.startsWith('#') || href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.split('#')[1];
      const element = document.getElementById(targetId);
      if (element) {
        const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav 
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${mobileMenuOpen ? styles.navOpen : ''}`}
        data-nav-theme={navTheme}
      >
        <div className={styles.container}>
          <Link 
            href="/" 
            className={`${styles.logo} ${interactionDisabled ? styles.noHover : ''}`} 
            onClick={(e) => handleClick(e, '/')}
            aria-label="Yu Hang Ang - Home"
          >
            <div className={styles.logoContainer}>
              <Logo className={styles.logoIcon} />
              <LogoWordmark className={styles.logoText} />
            </div>
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
            className={`${styles.menuButton} ${interactionDisabled ? styles.disabled : ''}`}
            onClick={handleMenuClick}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu-overlay"
          >
            <span className={`${styles.hamburger} ${mobileMenuOpen ? styles.open : ''} ${interactionDisabled ? styles.noHover : ''}`}>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        id="mobile-menu-overlay"
        className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className={styles.previewContainer}>
            {navLinks.map((link) => (
                <div 
                    key={link.label} 
                    className={`${styles.previewImage} ${hoveredImage === link.preview ? styles.active : ''}`}
                >
                    <Image src={link.preview} alt="" fill style={{ objectFit: 'cover' }} priority quality={50} />
                    <div className={styles.dimmer} />
                </div>
            ))}
        </div>

        <div className={styles.mobileMenuOverlay} onClick={() => setMobileMenuOpen(false)} />
        <div className={styles.mobileMenuContent}>
          <ul className={styles.mobileLinks}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={styles.mobileLink}
                  onClick={(e) => handleClick(e, link.href)}
                  onMouseEnter={() => setHoveredImage(link.preview)}
                  onMouseLeave={() => setHoveredImage(null)}
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

