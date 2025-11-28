'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './BlogPost.module.scss';

interface BlogPostProps {
  title: string;
  date: string;
  author: string;
  readTime: string;
  coverImage: string;
  content: React.ReactNode;
}

export default function BlogPost({ title, date, author, readTime, coverImage, content }: BlogPostProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <article className={styles.blogPost}>
      {/* Reading Progress Bar */}
      <div 
        className={styles.progressBar} 
        style={{ width: `${scrollProgress * 100}%` }} 
      />

      {/* Hero Section */}
      <div className={styles.hero}>
        <Image
          src={coverImage}
          alt={title}
          fill
          className={styles.coverImage}
          priority
        />
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.metadata}>
            <span>{date}</span>
            <span>•</span>
            <span>{readTime} read</span>
            <span>•</span>
            <span>By {author}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        {content}

        {/* Share Section */}
        <div className={styles.shareSection}>
          <button className={styles.shareButton}>Share on Twitter</button>
          <button className={styles.shareButton}>Share on LinkedIn</button>
          <button className={styles.shareButton}>Copy Link</button>
        </div>
      </div>
    </article>
  );
}
