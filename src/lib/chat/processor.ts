import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { CHAT_ACTIONS } from "../../config/chat-actions";
import { ChatMessage, PipelineResult, validateActionParams } from "./types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// System prompt generation based on strict config
function generateSystemPrompt() {
  const actionsList = Object.values(CHAT_ACTIONS)
    .map(
      (action) =>
        `- ID: "${action.id}"\n  Description: ${action.description}\n  Parameters: ${JSON.stringify(
          // Extract purely the shape/description if possible, or assume Zod structure is readable enough for LLM conceptualization
          // Simplified description of params for the prompt
          "Refer to schema", // In a real implementation we might auto-generate a JSON schema from Zod
        )}`,
    )
    .join("\n");

  return `
You are an intelligent assistant capable of executing specific actions.
Your goal is to identify if the user intends to perform one of the allowed actions or just wants to chat.

ALLOWED ACTIONS:
${actionsList}

INSTRUCTIONS:
1. If the user wants to perform an action, you MUST respond with a STRICT JSON object in this format:
   { "intent": "action", "actionId": "THE_ID", "params": { ...values } }
   
2. If the user just wants to chat or the request is unclear/out of scope, respond with:
   { "intent": "chat", "message": "Your helpful response..." }

3. You are helpful, concise, and professional.
4. If an image is provided, analyze it to help fulfill the user's request (e.g. "make it look like this").
`.trim();
}

export async function processChatPipeline(
  history: ChatMessage[],
  newMessage: ChatMessage,
): Promise<PipelineResult> {
  try {
    const systemPrompt = generateSystemPrompt();

    // Convert history to Gemini format (simplified)
    // In production, we'd manage tokens and history window carefully
    const chatSession = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        {
          role: "model",
          parts: [
            { text: "Understood. I am ready to identify actions and chat." },
          ],
        },
        // ... (We would map previous history here)
      ],
    });

    const parts: Part[] = [{ text: newMessage.content }];

    // Handle Attachments (Images)
    if (newMessage.attachments) {
      for (const att of newMessage.attachments) {
        if (att.type === "image" && att.url.startsWith("data:")) {
          // Extract base64
          const base64Data = att.url.split(",")[1];
          const mimeType = att.url.split(";")[0].split(":")[1];

          parts.push({
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          });
        }
      }
    }

    const result = await chatSession.sendMessage(parts);
    const responseText = result.response.text();

    console.log("LLM Raw Response:", responseText); // Debug

    // Attempt to parse JSON response
    try {
      // Find JSON block if wrapped in markdown
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : responseText;

      const parsed = JSON.parse(jsonStr);

      if (parsed.intent === "action") {
        // Validate Params
        const validatedParams = validateActionParams(
          parsed.actionId,
          parsed.params,
        );

        return {
          success: true,
          action: {
            id: parsed.actionId,
            params: validatedParams,
          },
          response: "Action identified. Executing...", // Or custom message
        };
      } else {
        return {
          success: true,
          response: parsed.message,
        };
      }
    } catch (e) {
      // Fallback if model didn't output strict JSON (it happens)
      // Treat as chat response
      return {
        success: true,
        response: responseText,
      };
    }
  } catch (error: any) {
    console.error("Pipeline Error:", error);
    return {
      success: false,
      error: error.message || "Unknown pipeline error",
    };
  }
}
