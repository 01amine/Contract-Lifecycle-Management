import { BotIcon } from "lucide-react";
import { motion } from "motion/react";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex gap-3"
    >
      <div className="size-8 rounded-full bg-primary flex items-center justify-center shrink-0">
        <BotIcon className="size-4 text-white" />
      </div>
      <div className="p-4 rounded-xl bg-card border shadow-island">
        <div className="flex gap-1">
          <div
            className="size-2 rounded-full bg-muted-foreground animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="size-2 rounded-full bg-muted-foreground animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="size-2 rounded-full bg-muted-foreground animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
}
