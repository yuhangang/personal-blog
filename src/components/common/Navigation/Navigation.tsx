'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.scss';
import { useLenis } from '@/components/common/SmoothScroll/SmoothScroll';
import Logo from './Logo';

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
  const [activeSection, setActiveSection] = useState('home');

  // Dynamic Theme & Scroll Spy
  useEffect(() => {
    // Scroll state
    const handleScroll = () => {
        setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Theme Observer
    const themeSections = document.querySelectorAll('[data-theme]');
    const themeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const theme = entry.target.getAttribute('data-theme') as 'light' | 'dark';
                if (theme) setNavTheme(theme);
            }
        });
    }, { rootMargin: '-30px 0px -90% 0px' });
    themeSections.forEach((s) => themeObserver.observe(s));

    // Section Spy Observer
    // Only active on homepage
    if (pathname === '/') {
        const spySections = ['home', 'about', 'identity', 'contact'];
        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                   setActiveSection(entry.target.id);
                   console.log('Active Section Check:', entry.target.id); // Debug Log
                }
            });
        }, { rootMargin: '-30% 0px -30% 0px' }); // Broader detection (30% vs 40%)

        spySections.forEach(id => {
            const el = document.getElementById(id);
            if (el) spyObserver.observe(el);
        });
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            themeSections.forEach((s) => themeObserver.unobserve(s));
            spySections.forEach(id => {
                const el = document.getElementById(id);
                if (el) spyObserver.unobserve(el);
            });
        };
    } else {
        // Non-home pages: Still observe 'contact' (Footer)
        const cleanPath = pathname.replace('/', '') || 'home';
        
        // Default to page name
        setActiveSection(cleanPath);

        const contactObserver = new IntersectionObserver((entries) => {
             entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection('contact');
                } else {
                    // When contact leaves view, revert to page name
                    setActiveSection(cleanPath);
                }
             });
        }, { rootMargin: '-10% 0px -10% 0px', threshold: 0.1 }); // More sensitive for footer

        const contactEl = document.getElementById('contact');
        if (contactEl) contactObserver.observe(contactEl);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            themeSections.forEach((s) => themeObserver.unobserve(s));
            if (contactEl) contactObserver.unobserve(contactEl);
        };
    }
  }, [pathname]);

  const handleMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setInteractionDisabled(true);
    setTimeout(() => setInteractionDisabled(false), 500);
  };

  const { lenis } = useLenis();

  // ... (Menu logic remains same)
  useEffect(() => {
    if (mobileMenuOpen) {
      lenis?.stop();
      document.body.classList.add('nav-open');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.body.classList.remove('nav-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      setHoveredImage(null);
    }
  }, [mobileMenuOpen, lenis]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);
    
    if (href.startsWith('#') || (pathname === '/' && href.startsWith('/#'))) {
      e.preventDefault();
      const targetId = href.split('#')[1];
      const element = document.getElementById(targetId);
      if (element) {
        lenis?.scrollTo(element);
      }
    }
  };

  if (pathname === '/resume') return null;

  return (
    <>
      <nav 
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${mobileMenuOpen ? styles.navOpen : ''}`}
        data-nav-theme={navTheme}
      >
        <div className={styles.container}>
            {/* Identity Anchor */}
            {/* Identity Anchor */}
            <div className={styles.identityAnchor}>
                <Link href="/" className={styles.name} onClick={(e) => handleClick(e, '/#home')}>
                    Yu Hang Ang
                </Link>
                
                {/* Logic: Only show anchor if mapped to a valid label */}
                <AnimatePresence>
                    {(() => {
                        const SECTION_LABELS: Record<string, string> = {
                            'about': 'About',
                            'contact': 'Contact',
                            'identity': 'Create', // Homepage section alias
                            'create': 'Create',   // Actual page
                        };

                        const displayText = SECTION_LABELS[activeSection] || null;

                        if (!displayText) return null;

                        return (
                            <motion.div 
                                key="anchor-container"
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className={styles.anchorContainer}
                                style={{ display: 'flex', alignItems: 'baseline', overflow: 'hidden' }}
                            >
                                <span className={styles.separator}>|</span>
                                <FilmLightText text={displayText} />
                            </motion.div>
                        );
                    })()}
                </AnimatePresence>
            </div>

          {/* New Desktop Navigation (Minimal) */}
          <ul className={styles.links}>
             {/* We can hide standard links if we want a pure "anchor" look, or keep them. 
                 The request implies "make navbar... display scroll ancho", 
                 often this replaces the standard menu or sits alongside. 
                 I'll keep the hamburger for full menu and maybe hide text links 
                 to be cleaner, OR just keep them. Let's keep them for usability but make sure styling works.
             */}
        
          </ul>

             {/* Mobile Menu Button (Hamburger) - Keeping original logic but styling might need tweak */}
            <button
                className={`${styles.menuButton}`}
                onClick={handleMenuClick}
                aria-label="Toggle menu"
            >
             <span className={`${styles.hamburger} ${mobileMenuOpen ? styles.open : ''}`}>
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

// --- Components ---

import { motion, AnimatePresence } from 'framer-motion';

function FilmLightText({ text }: { text: string }) {
    // Cinematic Crop = Slide Reveal
    return (
        <motion.div 
            className={styles.anchorWrapper} 
            layout // Animate width changes
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        > 
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={text}
                    initial={{ y: '100%', filter: 'blur(2px)', opacity: 0 }}
                    animate={{ 
                        y: '0%', 
                        filter: 'blur(0px)', 
                        opacity: 1,
                        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
                    }}
                    exit={{ 
                        y: '-100%', 
                        filter: 'blur(2px)', 
                        opacity: 0,
                        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                    }}
                    className={styles.anchorText}
                >
                    {text}
                </motion.span>
            </AnimatePresence>
        </motion.div>
    );
}

