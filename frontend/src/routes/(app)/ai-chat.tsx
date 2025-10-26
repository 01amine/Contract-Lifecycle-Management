import { useHeader } from "@/stores/header";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { MessageList } from "@/components/ai-chat/message-list";
import { SuggestedQuestions } from "@/components/ai-chat/suggested-questions";
import { ChatInput } from "@/components/ai-chat/chat-input";
import { AI_RESPONSES } from "@/components/ai-chat/constants";
import type { Message } from "@/components/ai-chat/types";

export const Route = createFileRoute("/(app)/ai-chat")({
  component: RouteComponent,
});

function RouteComponent() {
  useHeader("AI Legal Assistant");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your AI legal assistant specialized in contract management and Islamic finance. How can I help you today?",
      timestamp: new Date(),
      confidence: 100,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Select response based on keywords
    let response = AI_RESPONSES.default;
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("shariah") || lowerInput.includes("murabaha")) {
      response = AI_RESPONSES.shariah;
    } else if (
      lowerInput.includes("ijara") ||
      lowerInput.includes("difference")
    ) {
      response = AI_RESPONSES.ijara;
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response.content,
      timestamp: new Date(),
      sources: response.sources,
      confidence: response.confidence,
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };

  return (
    <div className="h-[calc(95vh-5rem)] flex flex-col">
      <MessageList messages={messages} isTyping={isTyping} />

      {/* Input Area */}
      <div>
        {messages.length === 1 && (
          <SuggestedQuestions
            onSelect={(question) => {
              setInput(question);
              textareaRef.current?.focus();
            }}
          />
        )}

        <ChatInput
          input={input}
          setInput={setInput}
          onSend={handleSend}
          isTyping={isTyping}
          textareaRef={textareaRef}
        />
      </div>
    </div>
  );
}
