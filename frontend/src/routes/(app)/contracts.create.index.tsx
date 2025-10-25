import { createFileRoute, Link } from "@tanstack/react-router";
import { Keyboard, Upload } from "lucide-react";
import { useHeader } from "@/stores/header";

export const Route = createFileRoute("/(app)/contracts/create/")({
  component: RouteComponent,
});

function RouteComponent() {
  useHeader("Create a new contract");

  return (
    <div className="space-y-4">
      <Link
        to="/contracts/create/write"
        className="block py-4 px-6 border rounded-md shadow-island bg-card"
      >
        <div className="flex items-center gap-2">
          Write <Keyboard className="size-4" />
        </div>
        <p className="text-sm text-muted-foreground">
          Write a new contract from scratch.
        </p>
      </Link>
      <Link
        to="/contracts/create/upload"
        className="block py-4 px-6 border rounded-md shadow-island bg-card"
      >
        <div className="flex items-center gap-2">
          Upload <Upload className="size-4" />
        </div>
        <p className="text-sm text-muted-foreground">
          Upload a contract from a file.
        </p>
      </Link>
    </div>
  );
}
