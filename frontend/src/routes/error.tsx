import type { ErrorComponentProps } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function RouteError({ error, reset }: ErrorComponentProps) {
  // Log error to console in development
  if (import.meta.env.DEV) {
    console.error("Route Error:", error);
  }

  // Show error toast
  if (error instanceof Error) {
    toast.error(error.message || "An unexpected error occurred");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-8xl font-bold text-destructive/30">!</div>
        <h1 className="text-3xl font-bold font-title">Something went wrong</h1>
        <p className="text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex justify-center gap-2">
          <Button
            size="lg"
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            Reload Page
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="gap-2"
          >
            Go Home
          </Button>
        </div>
        {reset && (
          <Button size="sm" variant="ghost" onClick={reset} className="gap-2">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
