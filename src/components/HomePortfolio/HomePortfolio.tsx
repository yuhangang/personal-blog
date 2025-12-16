'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HomePortfolio.module.scss';

export default function HomePortfolio() {
    return (
        <section className={styles.section} id="portfolio">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        <span>Selected Work</span>
                        Featured Creation
                    </h2>
                    <Link href="/create" className={styles.viewAll}>
                        View All Projects &rarr;
                    </Link>
                </div>

                <Link href="/create" className={styles.featuredProject}>
                    <div className={styles.imageContainer}>
                        <Image 
                            src="/projects/yoymedia.png" 
                            alt="Yoy Media Project" 
                            fill
                            className={styles.projectImage}
                            style={{ objectFit: 'cover' }}
                        />
                        <div className={styles.overlay} />
                    </div>
                    <div className={styles.content}>
                        <div className={styles.info}>
                            <h3 className={styles.projectTitle}>Yoy Media</h3>
                            <p className={styles.projectDesc}>
                                A comprehensive digital solutions platform integrating AI-Powered Analysis into strategic social marketing workflows.
                            </p>
                        </div>
                        <div className={styles.tags}>
                            <span className={styles.tag}>Next.js</span>
                            <span className={styles.tag}>AI Analysis</span>
                            <span className={styles.tag}>Strategy</span>
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    );
}
