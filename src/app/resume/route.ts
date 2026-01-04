import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const filePath = path.join(process.cwd(), 'public', 'resume.pdf');

    try {
        const fileBuffer = fs.readFileSync(filePath);
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="resume.pdf"',
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }
}
