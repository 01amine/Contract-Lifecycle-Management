import { type Title, useHeader } from "@/stores/header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/contracts/create")({
  component: RouteComponent,
});

const title = {
  type: "back",
  back: "Back To Contracts",
  backPath: "/contracts",
} satisfies Title;

function RouteComponent() {
  useHeader(title);

  return <div>Hello "/(app)/contracts/create"!</div>;
}
