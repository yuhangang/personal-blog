"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
    size = 'medium'
}: CollectionCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current) {
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

    return (
        <motion.div 
            className={`${styles.cardWrapper} ${styles[size]}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
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
