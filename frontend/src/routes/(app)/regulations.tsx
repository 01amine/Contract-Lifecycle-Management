import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/regulations")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(app)/regulations"!</div>;
}
