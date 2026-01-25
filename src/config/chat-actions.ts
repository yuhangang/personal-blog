import { z } from "zod";

export const CHAT_ACTIONS = {
  UPDATE_STYLE: {
    id: "update_style",
    description: "Modify global or component specific styles using CSS",
    parameters: z.object({
      css: z.string().describe("The CSS to apply"),
      target: z
        .string()
        .optional()
        .describe(
          "The specific component or selector to target, uses global if omitted",
        ),
    }),
  },
  ADD_CAROUSEL: {
    id: "add_carousel",
    description: "Insert a carousel component with images",
    parameters: z.object({
      images: z.array(z.string()).describe("List of image URLs"),
      title: z.string().describe("Title for the carousel section"),
      autoPlay: z
        .boolean()
        .optional()
        .default(true)
        .describe("Whether to auto-play slides"),
    }),
  },
} as const;

export type ChatActionType = keyof typeof CHAT_ACTIONS;
