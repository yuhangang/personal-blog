"use client";
import React from 'react';
import styles from './GalleryHero.module.scss';
import { motion } from 'framer-motion';

export default function GalleryHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
      
        
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Visual <br /> 
          <span className={styles.italic}>Index.</span>
        </motion.h1>

        <motion.p 
          className={styles.description}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          A curated collection of photographic essays and field notes. 
          Documenting rhythms of life and heritage across borders.
        </motion.p>
      </div>

  
      <div className={styles.decorLines}>
        <div className={styles.line} />
        <div className={styles.line} />
      </div>
    </section>
  );
}
