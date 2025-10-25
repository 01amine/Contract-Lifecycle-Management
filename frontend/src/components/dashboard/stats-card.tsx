import { ChartNoAxesColumn } from "lucide-react";
import { motion } from "motion/react";

interface StatsCardProps {
  title: string;
  value: number;
}

export function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div className="p-4 pb-6 border rounded-xl shadow-island bg-card flex gap-4">
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
        <ChartNoAxesColumn className="size-6 text-primary" strokeWidth={2.5} />
      </motion.div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h2 className="text-lg font-semibold">{value}</h2>
      </div>
    </div>
  );
}
