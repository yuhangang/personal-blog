import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface Analysis {
    title?: string;
    description?: string;
    critique?: string;
    plan?: string[];
    suggestion?: string;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, business, message, token, analysis } = body as {
            name: string;
            email: string;
            business?: string;
            message: string;
            token: string;
            analysis?: Analysis;
        };

        // --- VALIDATION ---
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // --- VERIFY TURNSTILE ---
        // Skip in development
        if (process.env.NODE_ENV !== 'development') {
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
        }

        // --- BUILD ANALYSIS HTML ---
        let analysisHtml = '';
        if (analysis) {
            analysisHtml = `
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2px; border-radius: 12px; margin-bottom: 24px;">
                    <div style="background: #fff; padding: 24px; border-radius: 10px;">
                        <h3 style="color: #667eea; margin: 0 0 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                            🤖 AI Agent Analysis
                        </h3>
                        ${analysis.title ? `<p style="font-size: 18px; font-weight: 600; color: #1d1d1f; margin: 0 0 8px;"><strong>Brand:</strong> ${analysis.title}</p>` : ''}
                        ${analysis.description ? `<p style="color: #6e6e73; margin: 0 0 16px;">${analysis.description}</p>` : ''}
                        
                        ${analysis.critique ? `
                            <div style="background: #f5f5f7; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                                <p style="font-weight: 600; color: #1d1d1f; margin: 0 0 8px;">Verdict:</p>
                                <p style="color: #6e6e73; margin: 0; font-style: italic;">"${analysis.critique}"</p>
                            </div>
                        ` : ''}
                        
                        ${analysis.plan && analysis.plan.length > 0 ? `
                            <div style="margin-bottom: 16px;">
                                <p style="font-weight: 600; color: #1d1d1f; margin: 0 0 8px;">Growth Plan:</p>
                                <ul style="margin: 0; padding-left: 20px; color: #6e6e73;">
                                    ${analysis.plan.map(step => `<li style="margin-bottom: 4px;">${step}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        
                        ${analysis.suggestion ? `
                            <div style="background: #e8f4fd; padding: 16px; border-radius: 8px; border-left: 3px solid #667eea;">
                                <p style="font-weight: 600; color: #1d1d1f; margin: 0 0 8px;">AI Drafted Inquiry:</p>
                                <p style="color: #6e6e73; margin: 0;">"${analysis.suggestion}"</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        // --- SEND EMAIL TO YOU (ADMIN) ---
        const emailResult = await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>',
            to: 'redrainhang@gmail.com',
            replyTo: email,
            subject: `New Contact from ${name}${business ? ` (${business})` : ''}${analysis ? ' [AI Analysis Included]' : ''}`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1d1d1f; margin-bottom: 24px;">New Contact Form Submission</h2>
                    
                    <div style="background: #f5f5f7; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                        <p style="margin: 0 0 12px;"><strong>Name:</strong> ${name}</p>
                        <p style="margin: 0 0 12px;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        ${business ? `<p style="margin: 0 0 12px;"><strong>Business:</strong> ${business}</p>` : ''}
                    </div>
                    
                    ${analysisHtml}
                    
                    <div style="background: #fff; border: 1px solid #e5e5e7; padding: 24px; border-radius: 12px;">
                        <h3 style="color: #1d1d1f; margin: 0 0 16px;">Message:</h3>
                        <p style="color: #6e6e73; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
                    </div>
                    
                    <p style="color: #86868b; font-size: 12px; margin-top: 24px;">
                        This email was sent from your website contact form at ${new Date().toLocaleString()}.
                    </p>
                </div>
            `
        });

        if (emailResult.error) {
            console.error('Email sending failed:', emailResult.error);
            return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
        }

        // --- SEND CONFIRMATION EMAIL TO CLIENT ---
        await resend.emails.send({
            from: 'Yu Hang Ang <onboarding@resend.dev>',
            to: email,
            subject: `Thank you for reaching out${business ? `, ${business}` : ''}!`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #1d1d1f 0%, #3d3d3f 100%); padding: 40px 32px; text-align: center; border-radius: 12px 12px 0 0;">
                        <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">
                            Yu Hang Ang
                        </h1>
                        <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">
                            Creative Developer & Digital Strategist
                        </p>
                    </div>
                    
                    <!-- Body -->
                    <div style="padding: 40px 32px; background: #fafafa; border: 1px solid #e5e5e7; border-top: none; border-radius: 0 0 12px 12px;">
                        <h2 style="color: #1d1d1f; margin: 0 0 16px; font-size: 20px; font-weight: 600;">
                            Hi ${name}! 👋
                        </h2>
                        
                        <p style="color: #6e6e73; line-height: 1.7; margin: 0 0 24px; font-size: 15px;">
                            Thank you for reaching out! I've received your message and I'm excited to learn more about ${business ? `<strong>${business}</strong>` : 'your project'}.
                        </p>
                        
                        <p style="color: #6e6e73; line-height: 1.7; margin: 0 0 24px; font-size: 15px;">
                            I typically respond within <strong>24-48 hours</strong>. In the meantime, feel free to check out my recent work and case studies.
                        </p>
                        
                        <!-- Message Summary -->
                        <div style="background: #fff; border: 1px solid #e5e5e7; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                            <p style="color: #86868b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px;">
                                Your Message
                            </p>
                            <p style="color: #6e6e73; line-height: 1.6; margin: 0; font-size: 14px; white-space: pre-wrap;">${message}</p>
                        </div>
                        
                        ${analysis ? `
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2px; border-radius: 8px; margin-bottom: 24px;">
                                <div style="background: #fff; padding: 20px; border-radius: 6px;">
                                    <p style="color: #667eea; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px;">
                                        🤖 AI Analysis Preview
                                    </p>
                                    <p style="color: #6e6e73; line-height: 1.6; margin: 0; font-size: 14px;">
                                        I've reviewed your brand and prepared some initial insights. Let's discuss how we can take ${business || 'your business'} to the next level!
                                    </p>
                                </div>
                            </div>
                        ` : ''}
                        
                        <p style="color: #6e6e73; line-height: 1.7; margin: 0 0 8px; font-size: 15px;">
                            Looking forward to connecting!
                        </p>
                        
                        <p style="color: #1d1d1f; font-weight: 600; margin: 0; font-size: 15px;">
                            — Yu Hang
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="text-align: center; padding: 32px 24px; background: #f5f5f7; border-radius: 0 0 12px 12px;">
                        <!-- Social Links -->
                        <div style="margin-bottom: 20px;">
                            <a href="https://yuhangang.com" style="display: inline-block; margin: 0 8px; color: #1d1d1f; text-decoration: none; font-size: 13px; font-weight: 500;">
                                🌐 Website
                            </a>
                            <span style="color: #d1d1d6;">|</span>
                            <a href="https://linkedin.com/in/yuhangang" style="display: inline-block; margin: 0 8px; color: #1d1d1f; text-decoration: none; font-size: 13px; font-weight: 500;">
                                💼 LinkedIn
                            </a>
                            <span style="color: #d1d1d6;">|</span>
                            <a href="https://github.com/yuhangang" style="display: inline-block; margin: 0 8px; color: #1d1d1f; text-decoration: none; font-size: 13px; font-weight: 500;">
                                💻 GitHub
                            </a>
                            <span style="color: #d1d1d6;">|</span>
                            <a href="https://twitter.com/yuhangang" style="display: inline-block; margin: 0 8px; color: #1d1d1f; text-decoration: none; font-size: 13px; font-weight: 500;">
                                🐦 Twitter
                            </a>
                        </div>
                        <p style="color: #86868b; font-size: 12px; margin: 0;">
                            This is an automated confirmation. Please don't reply to this email.
                        </p>
                    </div>
                </div>
            `
        });

        console.log("Contact Form Submitted & Emails Sent:", { name, email, business, hasAnalysis: !!analysis, messageId: emailResult.data?.id });

        return NextResponse.json({ success: true, message: 'Message received and email sent' });

    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({
            error: 'Failed to send message.'
        }, { status: 500 });
    }
}
