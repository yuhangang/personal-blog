import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');


export async function POST(request: Request) {
    try {
        try {
            const { url, token } = await request.json();

            if (!url) {
                return NextResponse.json({ error: 'URL is required' }, { status: 400 });
            }

            // --- VERIFY TURNSTILE ---
            if (!token) {
                return NextResponse.json({ error: 'Verification failed. Please refresh.' }, { status: 401 });
            }

            const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
            if (turnstileSecret) {
                const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        secret: turnstileSecret,
                        response: token
                    })
                });
                const verifyData = await verifyRes.json();
                if (!verifyData.success) {
                    return NextResponse.json({ error: 'Human verification failed.' }, { status: 401 });
                }
            }

            let validUrl: string = url;
            if (!validUrl.startsWith('http')) {
                validUrl = `https://${validUrl}`;
            }

            // --- 1. ALWAYS TRY TO FETCH (Best Attempt) ---
            // We do this to get metadata (og:image) or content if it's a normal site.
            // Even for social, we might get open graph tags.
            let fetchedHtml = '';
            try {
                const response = await fetch(validUrl, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BrandAgent/1.0)' },
                    next: { revalidate: 3600 }
                });
                if (response.ok) {
                    fetchedHtml = await response.text();
                }
            } catch (e) {
                console.warn("Initial site fetch failed, will rely on strategy fallback.", e);
            }

            // --- 2. DETERMINE STRATEGY ---
            // Common platforms where scraping is often blocked or useless (login walls)
            const commonPlatforms = [
                'instagram.com', 'facebook.com', 'linkedin.com', 'tiktok.com',
                'twitter.com', 'x.com', 'youtube.com', 'pinterest.com',
                'linktr.ee', 'patreon.com'
            ];

            const isPlatform = commonPlatforms.some(platform => validUrl.includes(platform));

            let analysisContent = '';
            let isSearchMode = false;

            if (isPlatform) {
                // STRATEGY A: PLATFORM DETECTED -> PREFER SEARCH
                // Even if we fetched HTML, it's likely "Login to Instagram" or obscured. 
                // We use Search to find *external* context about this profile/brand.

                // derive handle/brand from url
                const parts = validUrl.split('/').filter(p => p.length > 0);
                const handle = parts[parts.length - 1] || 'Brand';
                const query = `${handle} brand official website business info`;

                console.log(`Platform detected (${validUrl}). Preferring Search: ${query}`);
                const searchResults = await performSearch(query);

                if (searchResults) {
                    analysisContent = searchResults;
                    isSearchMode = true;
                } else {
                    // If search failed, fallback to whatever junk HTML we got (better than nothing)
                    analysisContent = fetchedHtml;
                }

            } else {
                // STRATEGY B: NORMAL WEBSITE -> PREFER HTML
                // Check if specifically blocked (Cloudflare, etc.) or just empty
                const isBlocked = fetchedHtml.includes('Attention Required! | Cloudflare') ||
                    fetchedHtml.includes('Access denied') ||
                    fetchedHtml.includes('security check to access');

                if (!isBlocked && fetchedHtml && fetchedHtml.length > 500) {
                    analysisContent = fetchedHtml;
                } else {
                    // If fetch failed, empty, OR BLOCKED -> Fallback to search
                    const reason = isBlocked ? "Cloudflare/Security Block" : "Content too short/empty";
                    console.log(`Fetch unusable (${reason}). Fallback to Search.`);

                    const domain = new URL(validUrl).hostname;
                    const searchResults = await performSearch(`${domain} brand info`);
                    if (searchResults) {
                        analysisContent = searchResults;
                        isSearchMode = true;
                    }
                }
            }

            // --- 3. ANALYZE ---
            const geminiResult = await analyzeWithGemini(validUrl, analysisContent, isSearchMode);

            if (geminiResult && geminiResult.suggestion) {
                // Try to rescue an image from HTML if we fetched it, even if we used search
                let image = '';
                if (fetchedHtml) {
                    const ogImageMatch = fetchedHtml.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i);
                    image = ogImageMatch ? ogImageMatch[1].trim() : '';
                }

                return NextResponse.json({
                    ...geminiResult,
                    image
                });
            }

            // 4. Fallback if Gemini completely fails (rare)
            return NextResponse.json({
                title: "Your Brand",
                description: "We couldn't fully analyze the site, but we're ready to help.",
                image: "",
                suggestion: "I'd like to discuss a project with you."
            });

        } catch (error) {
            console.error('Analysis Error:', error);
            return NextResponse.json({
                error: 'Could not analyze URL. Please type your message manually.'
            }, { status: 500 });
        }
    }

// --- HELPERS ---

async function performSearch(query: string): Promise<string> {
        const apiKey = process.env.SERPER_API_KEY;

        if (!apiKey) {
            console.warn("No SERPER_API_KEY found. Skipping search.");
            return "";
        }

        try {
            const res = await fetch('https://google.serper.dev/search', {
                method: 'POST',
                headers: {
                    'X-API-KEY': apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ q: query })
            });

            if (!res.ok) return "";

            const data = await res.json();
            const snippets = data.organic?.map((r: any) => `${r.title}: ${r.snippet}`).join('\n') || "";
            return snippets;
        } catch (e) {
            console.error("Search failed", e);
            return "";
        }
    }

    async function analyzeWithGemini(url: string, content: string, isSearchContext: boolean = false) {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const truncatedContent = content.substring(0, 15000);

        const prompt = `
    You are an expert brand analyst. 
    I will provide ${isSearchContext ? 'SEARCH RESULTS' : 'HTML CONTENT'} for a business (${url}).
    
    Your task is to analyze this business and generate a JSON response.
    
    ${isSearchContext ?
                `NOTE: The user provided a social link or difficult URL. I have searched the web for context. 
         Use these search snippets to infer the brand's industry, vibe, and goals.` :
                `NOTE: Analyze the raw HTML content directly.`
            }

    Task:
    1. "title": The brand name.
    2. "description": A short, punchy 1-sentence summary of what they do.
    3. "critique": A 1-sentence sharp observation. If you have limited info, comment on their digital presence (e.g. "Hard to find details online - recommend a clearer landing page.").
    4. "plan": An array of 3 short strings representing a "Growth Plan".
    5. "suggestion": Write a first-person inquiry message FROM THEM to "RMA" (creative agency).
       - Context: They want to elevate their brand.
       - Max 2 sentences.

    DATA:
    ${truncatedContent}

    Output valid JSON only:
    { 
        "title": "...", 
        "description": "...", 
        "critique": "...",
        "plan": ["...", "...", "..."],
        "suggestion": "..." 
    }
    `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonString);
        } catch (error) {
            console.error("Gemini Analysis Failed:", error);
            return null;
        }
    }
