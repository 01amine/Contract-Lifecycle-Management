import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Navigation } from "@/components/layout/navigation";
import { Header } from "@/components/layout/Header";

export const Route = createFileRoute("/(app)")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid grid-cols-[auto_1fr] p-6 gap-6 h-screen overflow-hidden max-w-7xl mx-auto">
      <Navigation />
      <div className="overflow-y-auto relative pe-3">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
