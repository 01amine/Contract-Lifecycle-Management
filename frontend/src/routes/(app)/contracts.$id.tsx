import { useHeader } from "@/stores/header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/contracts/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  useHeader("Doha Software Development Agreement");
  return (
    <div className="grid grid-cols-[5fr_3fr] gap-4 h-[calc(95vh-4.5rem)] min-h-48">
      <div className="p-4 pb-6 border rounded-xl shadow-island bg-card">
        <h2 className="text-2xl font-bold font-title">Contract Details</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          The contract details will be displayed here. I don't know what to put
          here yet.
        </p>
      </div>
      <div className="p-4 pb-6 border rounded-xl shadow-island bg-card">
        <h2 className="text-lg font-semibold">Contract Details</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          The contract details will be displayed here. I don't know what to put
          here yet.
        </p>
      </div>
    </div>
  );
}
