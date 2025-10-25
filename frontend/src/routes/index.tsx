import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold mb-4">Make landing page</h1>
      <div className="flex gap-4">
        <Link to="/contracts">
          <Button>Dashboard</Button>
        </Link>
        <Link to="/contracts">
          <Button variant="outline">Contracts</Button>
        </Link>
      </div>
    </div>
  );
}
