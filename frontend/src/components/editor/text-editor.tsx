import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListIcon,
  Pilcrow,
  Code2,
  Link,
  QuoteIcon,
} from "lucide-react";

interface TextEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function TextEditor({
  content,
  onContentChange,
  textareaRef,
}: TextEditorProps) {
  const wordCount = content
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const charCount = content.length;

  return (
    <div className="p-3 border rounded-xl shadow-island bg-card">
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <Button variant="outline" size="sm" title="Bold">
          <BoldIcon className="size-4" />
        </Button>
        <Button variant="outline" size="sm" title="Italic">
          <ItalicIcon className="size-4" />
        </Button>
        <Button variant="outline" size="sm" title="Underline">
          <UnderlineIcon className="size-4" />
        </Button>
        <div className="w-px h-6 bg-border" />
        <Button variant="outline" size="sm" title="List">
          <ListIcon className="size-4" />
        </Button>
        <div className="w-px h-6 bg-border" />
        <Select value="paragraph">
          <SelectTrigger className="bg-muted/80!">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="paragraph">
              <Pilcrow /> Paragraph
            </SelectItem>
            <SelectItem value="blockquote">
              <QuoteIcon /> Blockquote
            </SelectItem>
            <SelectItem value="code">
              <Code2 /> Code
            </SelectItem>
            <SelectItem value="link">
              <Link /> Link
            </SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground ml-auto">
          {wordCount} words • {charCount} characters
        </span>
      </div>

      <Textarea
        ref={textareaRef}
        placeholder="Start drafting your contract... type more to get Ai suggestions"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        className="min-h-[250px] h-[calc(95vh-30.5rem)] text-sm border-border focus-visible:ring-0 focus:border-border ring-0! bg-muted/80!"
      />
    </div>
  );
}
