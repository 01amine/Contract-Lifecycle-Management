import { motion } from "motion/react";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex gap-3"
    >
      <img src="/logo-square.svg" alt="AI" className="size-8 shrink-0" />
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
