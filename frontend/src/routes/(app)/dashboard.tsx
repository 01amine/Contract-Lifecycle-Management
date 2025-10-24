import { useHeader } from "@/stores/header";
import { createFileRoute } from "@tanstack/react-router";
import { ChartNoAxesColumn } from "lucide-react";
import { motion } from "motion/react";

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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockData.map((item, index) => (
          <div
            key={index}
            className="p-4 pb-6 border rounded-xl shadow-island bg-card flex gap-4"
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
              className="size-12 rounded-full shadow-island bg-card border flex items-center justify-center shrink-0 cursor-pointer hover:bg-muted/20 transition-colors"
            >
              <ChartNoAxesColumn
                className="size-6 text-primary"
                strokeWidth={2.5}
              />
            </motion.div>
            <div>
              <p className="text-sm text-muted-foreground">{item.title}</p>
              <h2 className="text-lg font-semibold">{item.value}</h2>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[5fr_3fr] gap-4 h-[calc(82vh-5rem)] min-h-48">
        <div className="p-4 pb-6 border rounded-xl shadow-island bg-card">
          <h2 className="text-lg font-semibold">Add a chart here</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            the chart will be added here. I don't know what to put here yet.
          </p>
        </div>
        <div className="p-4 pb-6 border rounded-xl shadow-island bg-card">
          <h2 className="text-lg font-semibold">
            Add list of recent contracts
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            I just haven't programmed this yet. It is clear what to do
          </p>
        </div>
      </div>
    </div>
  );
}
