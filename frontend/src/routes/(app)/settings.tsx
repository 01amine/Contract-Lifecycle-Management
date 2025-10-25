import { createFileRoute } from "@tanstack/react-router";
import { useHeader } from "@/stores/header";

export const Route = createFileRoute("/(app)/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  useHeader("Settings");
  return <div>Hello "/(app)/settings"!</div>;
}
