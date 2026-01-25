"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage, MessageRole } from "../../lib/chat/types";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pastedImages, setPastedImages] = useState<string[]>([]); // Base64 strings

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setPastedImages((prev) => [
                ...prev,
                event.target!.result as string,
              ]);
            }
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && pastedImages.length === 0) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: Date.now(),
      attachments: pastedImages.map((img) => ({
        type: "image",
        url: img,
      })),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setPastedImages([]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: messages, // Send limited history in real app
          message: userMsg,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.action) {
          // Action triggered!
          const actionMsg: ChatMessage = {
            id: Date.now().toString(),
            role: "system",
            content: `ACTION TRIGGERED: ${data.action.id} \n PARAMS: ${JSON.stringify(data.action.params, null, 2)}`,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, actionMsg]);
        } else {
          const modelMsg: ChatMessage = {
            id: Date.now().toString(),
            role: "model",
            content: data.response || "No response text",
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, modelMsg]);
        }
      } else {
        throw new Error(data.error);
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "system",
          content: `Error: ${e.message}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-auto">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-zinc-900 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="mt-4 w-[400px] h-[600px] bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-lg flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-zinc-800 bg-zinc-800/50">
            <h3 className="font-bold text-sm text-zinc-300">
              Dev Chat Pipeline
            </h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 text-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : msg.role === "system"
                        ? "bg-red-900/50 text-red-200 border border-red-800 front-mono text-xs"
                        : "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  {/* Attachments */}
                  {msg.attachments?.map((att, i) => (
                    <img
                      key={i}
                      src={att.url}
                      alt="attachment"
                      className="mb-2 rounded max-h-32 border border-white/10"
                    />
                  ))}

                  <pre className="whitespace-pre-wrap font-sans">
                    {msg.content}
                  </pre>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-zinc-500 text-xs italic p-2">
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-zinc-800 bg-zinc-900">
            {/* Image Preview */}
            {pastedImages.length > 0 && (
              <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                {pastedImages.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img}
                      className="h-16 w-16 object-cover rounded border border-zinc-700"
                    />
                    <button
                      onClick={() =>
                        setPastedImages((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        )
                      }
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPaste={handlePaste}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type or paste images..."
                className="flex-1 bg-zinc-800 text-zinc-200 rounded p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={2}
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-bold"
              >
                Send
              </button>
            </div>
            <div className="text-[10px] text-zinc-500 mt-2 text-center">
              Supports Image Paste (Ctrl+V)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
