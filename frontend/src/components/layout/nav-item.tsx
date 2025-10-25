import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  to: string;
  active?: boolean;
}

export function NavItem({
  icon: Icon,
  label,
  to,
  active = false,
}: NavItemProps) {
  return (
    <li className="relative">
      <Link to={to} title={label}>
        <Icon
          className={cn(
            "size-6 transition-colors duration-300",
            active
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        />
        <span className="sr-only">{label}</span>
        {active && (
          <motion.div
            layoutId="indicator"
            layout
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            className="absolute left-[37px] top-1/2 -translate-y-1/2 w-1.5 h-7 bg-secondary rounded-full"
          />
        )}
      </Link>
    </li>
  );
}
