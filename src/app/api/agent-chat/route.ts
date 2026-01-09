import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const { currentAnalysis, userMessage, chatHistory } = await request.json();

        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

        const historyContext = chatHistory.map((msg: any) =>
            `${msg.role === 'user' ? 'User' : 'Agent'}: ${msg.content}`
        ).join('\n');

        const prompt = `
        You are a strategic brand consultant called "Antigravity Agent". 
        You previously analyzed a business and provided this Strategic Audit:
        ${JSON.stringify(currentAnalysis, null, 2)}

        The user is now replying to you. 
        Current Conversation History:
        ${historyContext}
        
        User's New Input: "${userMessage}"

        Your Goal:
        1. Reply to the user as a helpful consultant.
        2. If the user asks to change the "Growth Plan" or "Inquiry Message", you MUST provide the updated versions in the JSON.
        3. If the user provides new info (e.g., "We actually sell shoes, not hats"), update the critique/plan/suggestion accordingly.

        Output valid JSON only:
        {
            "reply": "Your conversational reply to the user...",
            "updatedPlan": ["step 1", "step 2", "step 3"], // ONLY include if it needs changing, otherwise null
            "updatedSuggestion": "..." // ONLY include if it needs changing, otherwise null,
            "updatedCritique": "..." // ONLY include if it needs changing, otherwise null
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonString);

        return NextResponse.json(data);

    } catch (error) {
        console.error("Agent Chat Error:", error);
        return NextResponse.json({
            error: "Failed to chat",
            reply: "I'm having trouble processing that right now. Could you try again?"
        }, { status: 500 });
    }
}
