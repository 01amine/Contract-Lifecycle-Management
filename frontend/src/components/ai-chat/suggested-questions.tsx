import { SUGGESTED_QUESTIONS } from "./constants";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hidden items-center">
      <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
        Try asking:
      </span>
      {SUGGESTED_QUESTIONS.map((question, index) => (
        <button
          key={index}
          onClick={() => onSelect(question)}
          className="shrink-0 px-3 py-1.5 text-xs rounded-full border hover:border-primary hover:bg-primary/5 transition-colors whitespace-nowrap"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
