import { motion } from "motion/react";

interface Clause {
  clause_id?: string;
  text?: string;
  content?: string;
  heading?: string;
  level?: number;
  type?: string;
  confidence?: number;
}

interface ClauseDisplayProps {
  clauses: Clause[];
}

export default function ClauseDisplay({ clauses }: ClauseDisplayProps) {
  return (
    <div className="max-w-md text-xs text-muted-foreground max-h-24 mx-auto mask-b-from-80% mask-alpha relative mask-t-from-80%">
      <motion.div
        className="space-y-2"
        animate={{
          y: [0, -600],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {clauses.map((clause) => (
          <div
            key={clause.clause_id}
            className="text-left line-clamp-3 text-balance"
          >
            {clause.heading}: {clause.text}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
