import { useHeader } from "@/stores/header";
import { createFileRoute } from "@tanstack/react-router";
import { StatsCard } from "@/components/dashboard/stats-card";
import { UploadSection } from "@/components/dashboard/upload-section";
import { RecentContracts } from "@/components/dashboard/recent-contracts";
import { useDashboardStats } from "@/actions/hooks/use-contracts";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

export const Route = createFileRoute("/(app)/dashboard")({
  component: RouteComponent,
});

const statsTitles = [
  "Total contracts",
  "Pending contracts",
  "Completed contracts",
  "Discarded contracts",
];

function RouteComponent() {
  useHeader("Welcome back");
  const { data: stats, isLoading } = useDashboardStats();

  const statsData = stats
    ? [
        { title: statsTitles[0], value: stats.totalContracts },
        { title: statsTitles[1], value: stats.pendingContracts },
        { title: statsTitles[2], value: stats.completedContracts },
        { title: statsTitles[3], value: stats.discardedContracts },
      ]
    : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading
          ? // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="p-4 pb-6 border rounded-xl shadow-island bg-card flex gap-4 items-center"
              >
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-6 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))
          : statsData.map((item, index) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                key={index}
                className="size-full"
              >
                <StatsCard key={index} title={item.title} value={item.value} />
              </motion.div>
            ))}
      </div>
      <div className="grid grid-cols-[5fr_3fr] gap-4 h-[calc(82vh-5rem)] min-h-48">
        <UploadSection />
        <RecentContracts />
      </div>
    </div>
  );
}
