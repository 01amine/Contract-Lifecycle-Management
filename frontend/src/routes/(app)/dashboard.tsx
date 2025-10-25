import { useHeader } from "@/stores/header";
import { createFileRoute } from "@tanstack/react-router";
import { StatsCard } from "@/components/dashboard/stats-card";
import { UploadSection } from "@/components/dashboard/upload-section";
import { RecentContracts } from "@/components/dashboard/recent-contracts";

export const Route = createFileRoute("/(app)/dashboard")({
  component: RouteComponent,
});

const mockData = [
  {
    title: "Total contracts",
    value: 12,
  },
  {
    title: "Pending contracts",
    value: 4,
  },
  {
    title: "Completed contracts",
    value: 8,
  },
  {
    title: "Discarded contracts",
    value: 2,
  },
];

function RouteComponent() {
  useHeader("Welcome back");
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mockData.map((item, index) => (
          <StatsCard key={index} title={item.title} value={item.value} />
        ))}
      </div>
      <div className="grid grid-cols-[5fr_3fr] gap-4 h-[calc(82vh-5rem)] min-h-48">
        <UploadSection />
        <RecentContracts />
      </div>
    </div>
  );
}
