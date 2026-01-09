import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message, token } = body;

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

        // --- PROCESS SUBMISSION ---
        // TODO: Integrate with email service (e.g., SendGrid, Resend)
        console.log("Contact Form Submitted:", { name, email, message });

        return NextResponse.json({ success: true, message: 'Message received' });

    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({
            error: 'Failed to send message.'
        }, { status: 500 });
    }
}
