import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-8xl font-bold text-primary/30">404</div>
        <h1 className="text-3xl font-bold font-title">Page Not Found</h1>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center gap-2">
          <Link to="/">
            <Button size="lg" className="gap-2">
              To Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="lg" className="gap-2" variant="outline">
              To Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/not-found")({
  component: NotFound,
});
