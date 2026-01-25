import { NextRequest, NextResponse } from "next/server";
import { processChatPipeline } from "../../../lib/chat/processor";
import { ChatMessage } from "../../../lib/chat/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { history, message } = body;

    if (!message || !message.content) {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 },
      );
    }

    // TODO: Session/User validation here

    const result = await processChatPipeline(
      history || [],
      message as ChatMessage,
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
