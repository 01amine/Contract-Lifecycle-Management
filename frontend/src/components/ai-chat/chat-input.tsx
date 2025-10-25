import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isTyping: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function ChatInput({
  input,
  setInput,
  onSend,
  isTyping,
  textareaRef,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex gap-2">
      <Textarea
        ref={textareaRef}
        placeholder="Ask about contracts, compliance, or Islamic finance..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        className="resize-none bg-card!"
      />
      <Button
        onClick={onSend}
        disabled={!input.trim() || isTyping}
        className="shrink-0"
      >
        <SendIcon className="size-4" />
      </Button>
    </div>
  );
}
