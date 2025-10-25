import { useHeader } from "@/stores/header";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BotIcon, SendIcon, SparklesIcon, UserIcon } from "lucide-react";

export const Route = createFileRoute("/(app)/assistant")({
  component: RouteComponent,
});

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: string[];
  confidence?: number;
}

const SUGGESTED_QUESTIONS = [
  "What are the key Shariah compliance requirements for Murabaha contracts?",
  "Explain the difference between Ijara and Murabaha financing",
  "What are the UAE labor law requirements for employment contracts?",
  "How do I ensure force majeure clauses are compliant?",
  "What should I look for in a commercial service agreement?",
  "Explain the requirements for real estate sale agreements in UAE",
];

const AI_RESPONSES: Record<string, { content: string; sources: string[]; confidence: number }> = {
  "shariah": {
    content: "Key Shariah compliance requirements for Murabaha contracts include:\n\n1. **Asset Ownership**: The bank must take actual ownership of the asset before selling to the customer\n2. **Cost Disclosure**: Clear disclosure of cost price and profit margin is mandatory\n3. **No Interest**: Profit must be fixed at the time of contract, not time-based\n4. **Late Payment**: Late fees should go to charity, not as profit to the bank\n5. **Asset Type**: The asset must be Shariah-compliant (halal)\n6. **Documentation**: Separate purchase and sale agreements required\n7. **Risk Transfer**: Bank bears risk during ownership period\n\nAll contracts should be reviewed by a Shariah board for certification.",
    sources: ["AAOIFI Standard FAS 28", "UAE Islamic Affairs Guidelines", "Internal Shariah Policy"],
    confidence: 95,
  },
  "ijara": {
    content: "The key differences between Ijara and Murabaha:\n\n**Murabaha (Cost-Plus Financing)**:\n- Sale-based contract\n- Ownership transfers immediately\n- Customer owns the asset from start\n- Fixed profit margin on cost\n- Early settlement may reduce profit\n\n**Ijara (Islamic Lease)**:\n- Lease-based contract\n- Bank retains ownership during lease period\n- Customer is lessee, not owner\n- Rental payments over time\n- May end with ownership transfer (Ijara wa Iqtina)\n- Bank responsible for major repairs\n\nChoose Murabaha for outright purchase financing, Ijara for asset usufruct needs.",
    sources: ["AAOIFI Standard FAS 8 & 28", "Islamic Fiqh Academy Resolutions"],
    confidence: 98,
  },
  "default": {
    content: "I'm your AI-powered legal assistant specialized in contract lifecycle management and Islamic finance compliance.\n\nI can help you with:\n- Shariah compliance questions\n- Legal requirements analysis\n- Contract review guidance\n- Risk assessment\n- Best practices for contract drafting\n- UAE and GCC legal frameworks\n\nPlease ask your question about contracts, compliance, or Islamic finance, and I'll provide detailed guidance with references.",
    sources: ["CLM Knowledge Base", "Legal Documentation"],
    confidence: 90,
  },
};

function RouteComponent() {
  useHeader("AI Legal Assistant");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI legal assistant specialized in contract management and Islamic finance. How can I help you today?",
      timestamp: new Date(),
      confidence: 100,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    } else if (lowerInput.includes("ijara") || lowerInput.includes("difference")) {
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

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(95vh-5rem)] flex flex-col">
      {/* Suggested Questions (show when no messages except welcome) */}
      {messages.length === 1 && (
        <div className="mb-4 p-4 border rounded-xl shadow-island bg-card">
          <div className="flex items-center gap-2 mb-3">
            <SparklesIcon className="size-4 text-primary" />
            <h3 className="font-semibold text-sm">Suggested Questions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {SUGGESTED_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="text-left p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all text-sm"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-1">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="size-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                <BotIcon className="size-4 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
              <div
                className={`p-4 rounded-xl ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-card border shadow-island"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="text-xs text-muted-foreground mb-1">Sources:</div>
                    <div className="flex flex-wrap gap-1">
                      {message.sources.map((source, index) => (
                        <span
                          key={index}
                          className="text-xs bg-muted/50 px-2 py-0.5 rounded"
                        >
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {message.confidence !== undefined && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Confidence: {message.confidence}%
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1 px-1">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
            {message.role === "user" && (
              <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <UserIcon className="size-4" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="size-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center shrink-0">
              <BotIcon className="size-4 text-white" />
            </div>
            <div className="p-4 rounded-xl bg-card border shadow-island">
              <div className="flex gap-1">
                <div className="size-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="size-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="size-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t pt-4">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            placeholder="Ask about contracts, compliance, or Islamic finance..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            className="resize-none"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="shrink-0"
          >
            <SendIcon className="size-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
