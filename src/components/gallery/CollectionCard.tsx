"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import styles from './CollectionCard.module.scss';
import FilmNoiseOverlay from '@/components/create/ServiceIntro/FilmNoiseOverlay';

interface CollectionCardProps {
    title: string;
    category: string;
    description: string;
    image: string;
    video?: string;
    href: string;
    location: string;
    year: string;
    cta: string;
    index: number;
    size?: 'large' | 'medium' | 'small';
    variant?: 'grid' | 'band';
}

export default function CollectionCard({
    title,
    category,
    description,
    image,
    video,
    href,
    location,
    year,
    cta,
    index,
    size = 'medium',
    variant = 'grid',
}: CollectionCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const prefersReducedMotion = useReducedMotion();

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current && !prefersReducedMotion) {
            videoRef.current.play().catch(err => console.error("Video play failed:", err));
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    if (variant === 'band') {
        const seriesCode = String(index + 1).padStart(2, '0');

        return (
            <motion.div
                className={styles.bandWrapper}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: index * 0.08 }}
            >
                <Link
                    href={href}
                    className={styles.bandLink}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <article className={styles.bandCard}>
                        <div className={styles.bandMedia} aria-hidden="true">
                            <Image
                                src={image}
                                alt=""
                                fill
                                className={styles.image}
                                sizes="(max-width: 768px) 100vw, 1200px"
                            />

                            {video && (
                                <video
                                    ref={videoRef}
                                    src={video}
                                    className={`${styles.video} ${isHovered && !prefersReducedMotion ? styles.visible : ''}`}
                                    muted
                                    loop
                                    playsInline
                                    preload="none"
                                />
                            )}

                            <div className={styles.bandScrim} />
                        </div>

                        <div className={styles.bandContent}>
                            <div className={styles.bandTop}>
                                <div className={styles.bandTitleGroup}>
                                    <h3 className={styles.bandTitle}>{title}</h3>
                                    <p className={styles.bandSubline}>
                                        {location} · {year}
                                    </p>
                                </div>
                                <span className={styles.bandBadge}>
                                    {seriesCode} · {category}
                                </span>
                            </div>

                            <div className={styles.bandBottom}>
                                <p className={styles.bandDescription}>{description}</p>
                                <span className={styles.bandCta}>
                                    <span>{cta}</span>
                                    <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
                                </span>
                            </div>
                        </div>
                    </article>
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={`${styles.cardWrapper} ${styles[size]}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: index * 0.1 }}
        >
            <Link 
                href={href} 
                className={styles.card}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className={styles.imageContainer}>
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {video && (
                        <video
                            ref={videoRef}
                            src={video}
                            className={`${styles.video} ${isHovered ? styles.visible : ''}`}
                            muted
                            loop
                            playsInline
                            preload="none"
                        />
                    )}

                    <FilmNoiseOverlay className={styles.noise} />
                    
                    <div className={styles.overlay}>
                        <div className={styles.topInfo}>
                            <span className={styles.category}>{category}</span>
                            <span className={styles.year}>{year}</span>
                        </div>
                        
                        <div className={styles.bottomInfo}>
                            <h3 className={styles.title}>{title}</h3>
                            <div className={styles.footer}>
                                <span className={styles.location}>{location}</span>
                                <span className={styles.cta}>{cta}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className={styles.descriptionWrapper}>
                    <p className={styles.description}>{description}</p>
                </div>
            </Link>
        </motion.div>
    );
}
