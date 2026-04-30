"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./HomeGallery.module.scss";
import { GALLERY_PROJECTS } from "@/config/gallery";
import CollectionCard from "@/components/gallery/CollectionCard";

export default function HomeGallery() {
  return (
    <section className={styles.section} id="gallery">
      <div className={styles.container}>
        <div className={styles.header}>
          <motion.span 
            className={styles.subtitle}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            02 — Selected Works
          </motion.span>
          <motion.h2 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Visual Stories
          </motion.h2>
        </div>

        <div className={styles.grid}>
          {GALLERY_PROJECTS.map((project, index) => (
            <CollectionCard 
              key={project.id} 
              {...project} 
              index={index}
              size="medium"
            />
          ))}
          
          <motion.div 
            className={styles.viewArchive}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/gallery" className={styles.archiveLink}>
              <span>View Full Archive</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
