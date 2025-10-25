import { useCurrentHeader } from "@/stores/header";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export function Header() {
  const title = useCurrentHeader();

  if (!title) return null;
  return (
    <header className="sticky top-0 left-0 right-0 pb-4 mb-2 z-10">
      <div className="flex items-center justify-between gap-4">
        {title.type === "back" ? (
          <Link
            to={title.backPath}
            className="flex items-center gap-1 mb-2 text-muted-foreground font-medium"
          >
            <ChevronLeft className="size-4 translate-y-px" />
            {title.back}
          </Link>
        ) : (
          <h1 className="text-xl font-semibold text-primary mb-1">
            {title.text}
          </h1>
        )}
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-green-400 shadow-sm" />
          <div className="size-2.5 rounded-full bg-amber-400 shadow-sm" />
          <div className="size-2.5 rounded-full bg-red-400 shadow-sm" />
        </div>
      </div>
      <hr className="border-muted-foreground/20" />
      <div className="absolute inset-0 -bottom-4 bg-linear-to-b from-background to-transparent from-60% -z-10" />
    </header>
  );
}
