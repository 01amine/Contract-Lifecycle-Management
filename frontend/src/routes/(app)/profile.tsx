import { createFileRoute } from "@tanstack/react-router";
import { useHeader } from "@/stores/header";

export const Route = createFileRoute("/(app)/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  useHeader("Profile");
  return <div>Profile</div>;
}
