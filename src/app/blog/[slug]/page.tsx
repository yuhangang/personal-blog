import React from 'react';
import { notFound } from 'next/navigation';
import BlogPost from '../../../components/BlogPost/BlogPost';
import { blogPosts } from '../../../data/blogPosts';

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  console.log("post", post);

  if (!post) {
    notFound();
  }

  return (
    <BlogPost
      title={post.title}
      date="November 26, 2025" // You might want to add a date field to your data
      author="Yu Hang Ang"     // You might want to add an author field to your data
      readTime={post.readTime}
      coverImage={post.image}
      content={post.content || <p>Content coming soon...</p>}
    />
  );
}
