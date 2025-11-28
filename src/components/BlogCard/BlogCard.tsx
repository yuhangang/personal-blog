import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import styles from './BlogCard.module.scss';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className={styles.card}>
      <Link href={`/blog/${post.slug}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          <Image
            src={post.image}
            alt={post.title}
            width={400}
            height={300}
            className={styles.image}
          />
        </div>
        <div className={styles.content}>
          <p className={styles.category}>{post.category}</p>
          <h3 className={styles.title}>{post.title}</h3>
          <p className={styles.excerpt}>{post.excerpt}</p>
          <div className={styles.meta}>
            <span>{post.readTime}</span>
            <span className={styles.readMore}>Read More →</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
