import { BlogPost, StatItem } from '@/types/blog';

export const blogPosts: BlogPost[] = [
    {
        id: '1',
        title: 'The Art of Clean Code',
        slug: 'art-of-clean-code',
        category: 'Technology',
        excerpt: 'Exploring the principles and practices that transform good code into great code. A deep dive into maintainability, readability, and elegant solutions.',
        image: '/blog_hero_simple.png',
        readTime: '5 min read',
        content: (
            <>
                <p>
                    The landscape of web development is constantly evolving. As we move further into 2025, 
                    we're seeing a paradigm shift in how we build, deploy, and experience the web. 
                    From AI-driven development workflows to the resurgence of server-side rendering, 
                    the tools at our disposal are more powerful than ever.
                </p>

                <h2>The Rise of AI-Native Frameworks</h2>
                <p>
                    Artificial Intelligence is no longer just a buzzword; it's becoming an integral part of our 
                    development stack. We're seeing frameworks that optimize themselves at runtime, 
                    predicting user behavior to pre-fetch data and assets with unprecedented accuracy.
                </p>

                <blockquote>
                    "The best code is the code you don't have to write. AI is helping us focus on the 
                    creative aspects of engineering while handling the boilerplate."
                </blockquote>

                <h3>Key Trends to Watch</h3>
                <ul>
                    <li><strong>Zero-Bundle-Size Architectures:</strong> Delivering only the HTML and CSS needed for the initial view.</li>
                    <li><strong>Edge-First Computing:</strong> Pushing logic closer to the user for instant interactions.</li>
                    <li><strong>WebAssembly Maturity:</strong> Running high-performance applications directly in the browser.</li>
                </ul>

                <h2>Designing for Immersion</h2>
                <p>
                    User interfaces are moving beyond flat design. We're seeing a return to depth, texture, 
                    and fluid animations that make digital spaces feel more tangible. The goal is to create 
                    experiences that are not just functional, but emotionally resonant.
                </p>

                <p>
                    As developers, our responsibility is to bridge the gap between complex technology and 
                    human-centric design. The tools of 2025 allow us to do just that with greater ease and 
                    efficiency than ever before.
                </p>
            </>
        ),
    },
    {
        id: '2',
        title: 'Finding Balance',
        slug: 'finding-balance',
        category: 'Travel & Life',
        excerpt: 'Reflections on maintaining work-life harmony in the fast-paced world of technology. Lessons learned from remote work and digital nomad experiences.',
        image: '/images/blog-travel.png',
        readTime: '7 min read',
    },
    {
        id: '3',
        title: 'Mobile-First Architecture',
        slug: 'mobile-first-architecture',
        category: 'Development',
        excerpt: 'Building scalable mobile applications with modern frameworks. Best practices for React Native, Flutter, and native development.',
        image: '/images/blog-dev.png',
        readTime: '8 min read',
    },
    {
        id: '4',
        title: 'The Future of AI',
        slug: 'future-of-ai',
        category: 'Innovation',
        excerpt: 'Exploring how artificial intelligence is reshaping software development. Practical applications and ethical considerations for modern developers.',
        image: '/images/blog-tech.png',
        readTime: '6 min read',
    },
    {
        id: '5',
        title: 'UI/UX Principles',
        slug: 'ui-ux-principles',
        category: 'Design',
        excerpt: 'Creating intuitive user experiences through thoughtful design. Lessons from building products used by thousands of people daily.',
        image: '/images/blog-dev.png',
        readTime: '5 min read',
    },
    {
        id: '6',
        title: 'Lessons from Bhimtang',
        slug: 'lessons-from-bhimtang',
        category: 'Reflection',
        excerpt: 'A journey through the mountains of Manang, discovering parallels between trekking and software development. Patience, persistence, and perspective.',
        image: '/images/blog-travel.png',
        readTime: '10 min read',
    },
];

export const stats: StatItem[] = [
    { number: '5+', label: 'Years Experience' },
    { number: '50+', label: 'Projects Delivered' },
    { number: '100K+', label: 'Users Reached' },
];
