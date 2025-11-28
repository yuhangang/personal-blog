import React from 'react';

export interface BlogPost {
    id: string;
    title: string;
    category: string;
    excerpt: string;
    image: string;
    readTime: string;
    slug: string;
    content?: React.ReactNode;
}

export interface StatItem {
    number: string;
    label: string;
}

export interface SocialLink {
    platform: string;
    url: string;
    icon: React.ReactNode;
}

export interface NavLink {
    label: string;
    href: string;
}
