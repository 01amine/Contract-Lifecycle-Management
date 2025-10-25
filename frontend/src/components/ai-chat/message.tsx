import { UserIcon } from "lucide-react";
import { motion } from "motion/react";
import type { Message } from "./types";

interface MessageProps {
  message: Message;
}

export function ChatMessage({ message }: MessageProps) {
  return (
    <div
      className={`flex gap-3 ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {message.role === "assistant" && (
        <img src="/logo-square.svg" alt="AI" className="size-8 shrink-0" />
      )}
      <div
        className={`max-w-[80%] ${
          message.role === "user" ? "order-first" : ""
        }`}
      >
        <motion.div
          initial={{
            opacity: 0,
            x: message.role === "user" ? 20 : -20,
          }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`px-4 py-2 rounded-2xl ${
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
        </motion.div>
        <div className="text-xs text-muted-foreground mt-1 px-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      {message.role === "user" && (
        <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
          <UserIcon className="size-5" />
        </div>
      )}
    </div>
  );
}
